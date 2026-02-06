'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

const checkoutSchema = z.object({
    checkoutKey: z.string(),
    fullName: z.string().min(2, 'El nombre es muy corto'),
    email: z.string().email('Email invalido'),
    phone: z.string().min(6, 'Numero de telefono invalido'),
    country: z.string().min(2, 'Selecciona un pais'),
    quantity: z.number().min(1).max(10),
    culqiToken: z.string().min(1, 'Token de pago requerido'),
    acceptTerms: z.literal(true, { message: 'Debes aceptar los terminos y condiciones' }),
});

export type CheckoutState = {
    success?: boolean;
    error?: string;
    registrationId?: string;
    thankYouUrl?: string | null;
};

export async function createRegistration(
    _prevState: CheckoutState,
    formData: FormData
): Promise<CheckoutState> {
    try {
        const rawData = {
            checkoutKey: formData.get('checkoutKey'),
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            country: formData.get('country'),
            quantity: formData.get('quantity') ? parseInt(formData.get('quantity') as string) : 1,
            culqiToken: formData.get('culqiToken'),
            source: formData.get('source') || 'website',
            acceptTerms: formData.get('acceptTerms') === 'true',
        };

        const result = checkoutSchema.safeParse(rawData);

        if (!result.success) {
            return {
                error: result.error.issues[0]?.message || 'Datos invalidos',
            };
        }

        const { checkoutKey, fullName, email, phone, country, quantity, culqiToken } = result.data;

        const checkoutConfig = await prisma.checkoutConfig.findUnique({
            where: { checkoutKey },
        });

        if (!checkoutConfig || !checkoutConfig.isActive) {
            return { error: 'El paquete no esta disponible.' };
        }

        const totalPrice = Number(checkoutConfig.price) * quantity;
        const amountInCents = Math.round(totalPrice * 100);

        let paymentStatus = 'pending';
        let paymentId = null;
        let culqiResponse = null;

        try {
            const secretKey = process.env.CULQI_SECRET_KEY;

            if (secretKey) {
                const response = await fetch('https://api.culqi.com/v2/charges', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${secretKey}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        amount: amountInCents,
                        currency_code: checkoutConfig.currency,
                        email: email,
                        source_id: culqiToken,
                        description: `Compra: ${checkoutConfig.packageName} (x${quantity})`,
                        antifraud_details: {
                            // Limpiar teléfono: solo dígitos, máximo 15 caracteres
                            phone_number: phone.replace(/\D/g, '').slice(0, 15),
                        },
                    }),
                });

                culqiResponse = await response.json();

                if (response.ok) {
                    paymentStatus = 'paid';
                    paymentId = culqiResponse.id;
                } else {
                    console.error('Culqi Payment Failed:', culqiResponse);
                    return { error: culqiResponse.user_message || 'El pago fue rechazado. Verifica tu tarjeta e intenta nuevamente.' };
                }
            } else {
                console.warn('CULQI_SECRET_KEY not set. Skipping real charge.');
                if (process.env.NODE_ENV === 'production') {
                    return { error: 'Error de configuracion de pagos.' };
                }
                paymentStatus = 'pending_dev';
            }
        } catch (paymentError) {
            console.error('Payment processing error:', paymentError);
            return { error: 'Error de conexion con la pasarela de pago.' };
        }

        const registration = await prisma.registration.create({
            data: {
                checkoutId: checkoutConfig.id,
                fullName,
                email,
                phone,
                country,
                paymentStatus: paymentStatus,
                paymentProvider: 'culqi',
                paymentId: paymentId,
                amountPaid: totalPrice,
                metadata: {
                    source: String(rawData.source),
                    quantity: quantity,
                    culqi_response: culqiResponse,
                },
            },
        });

        try {
            await prisma.analyticsEvent.create({
                data: {
                    eventType: 'registration_created',
                    eventData: {
                        registrationId: registration.id,
                        checkoutKey,
                        price: checkoutConfig.price,
                        quantity,
                        totalPrice,
                        paymentStatus,
                    },
                },
            });
        } catch (e) {
            console.error('Analytics error:', e);
        }

        revalidatePath('/admin/registrations');

        return {
            success: true,
            registrationId: registration.id,
            thankYouUrl: checkoutConfig.thankYouUrl,
        };
    } catch (error) {
        console.error('Checkout error:', error);
        return {
            error: 'Ocurrio un error al procesar tu registro. Por favor intenta nuevamente.',
        };
    }
}
