'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { sendEmail } from '@/lib/mail';

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

        // 1. REGISTRO PREVENTIVO (PENDING)
        // Esto asegura que tengamos los datos del cliente incluso si el pago falla o se corta la red
        const registration = await prisma.registration.create({
            data: {
                checkoutId: checkoutConfig.id,
                fullName,
                email,
                phone,
                country,
                paymentStatus: 'pending',
                paymentProvider: 'culqi',
                amountPaid: totalPrice,
                metadata: {
                    source: String(rawData.source),
                    quantity: quantity,
                    pre_registration: true
                },
            },
        });

        let paymentStatus = 'failed';
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

                    // Actualizar registro con el error detectado
                    await prisma.registration.update({
                        where: { id: registration.id },
                        data: {
                            paymentStatus: 'failed',
                            metadata: {
                                ...((registration.metadata as any) || {}),
                                culqi_error: culqiResponse
                            }
                        }
                    });

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

        // 2. ACTUALIZACIÓN POST-PAGO
        await prisma.registration.update({
            where: { id: registration.id },
            data: {
                paymentStatus: paymentStatus,
                paymentId: paymentId,
                metadata: {
                    ...((registration.metadata as any) || {}),
                    culqi_response: culqiResponse,
                },
            },
        });

        // 3. EMAIL
        try {

            if (paymentStatus === 'paid') {
                // Enviar correo de confirmación usando Nodemailer
                await sendEmail({
                    to: email,
                    subject: `✅ Confirmación de compra – THE FACES 2026`,
                    html: `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <meta charset="utf-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        </head>
                        <body style="margin: 0; padding: 0; background-color: #f4f7f6; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
                                <tr>
                                    <td align="center" style="padding: 40px 0;">
                                        <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
                                            <!-- Top Accent Bar -->
                                            <tr>
                                                <td height="8" style="background: linear-gradient(90deg, #0d9488 0%, #2dd4bf 100%);"></td>
                                            </tr>
                                            
                                            <tr>
                                                <td style="padding: 40px 50px;">
                                                    <h1 style="margin: 0 0 20px 0; color: #01121d; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">¡Gracias por tu compra, ${fullName.split(' ')[0]}!</h1>
                                                    <p style="margin: 0; font-size: 16px; line-height: 24px; color: #475569;">Tu inscripción para el mayor congreso de inyectores está oficialmente confirmada. Estamos felices de que formes parte de <strong>THE FACES 2026</strong>.</p>
                                                    
                                                    <!-- Details Card -->
                                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 35px; background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
                                                        <tr>
                                                            <td style="padding: 25px;">
                                                                <h2 style="margin: 0 0 15px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #0d9488; font-weight: 700;">Detalle de la compra</h2>
                                                                
                                                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                                    <tr>
                                                                        <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7; color: #64748b; font-size: 14px;">Evento</td>
                                                                        <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7; color: #0f172a; font-size: 14px; font-weight: 600; text-align: right;">THE FACES 2026</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7; color: #64748b; font-size: 14px;">Paquete</td>
                                                                        <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7; color: #0f172a; font-size: 14px; font-weight: 600; text-align: right;">${checkoutConfig.packageName}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7; color: #64748b; font-size: 14px;">Entradas</td>
                                                                        <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7; color: #0f172a; font-size: 14px; font-weight: 600; text-align: right;">${quantity}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Total Pagado</td>
                                                                        <td style="padding: 8px 0; color: #0d9488; font-size: 18px; font-weight: 700; text-align: right;">${checkoutConfig.currency} ${totalPrice.toFixed(2)}</td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>

                                                    <!-- Extra Info -->
                                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 30px;">
                                                        <tr>
                                                            <td style="padding: 20px; background-color: #f0fdfa; border-radius: 12px; border-left: 4px solid #0d9488;">
                                                                <p style="margin: 0; font-size: 14px; line-height: 22px; color: #134e4a;">
                                                                    <strong>Próximos pasos:</strong> En las próximas horas recibirás un correo con las indicaciones de acceso y cronograma detallado.
                                                                </p>
                                                            </td>
                                                        </tr>
                                                    </table>

                                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 30px;">
                                                        <tr>
                                                            <td style="color: #64748b; font-size: 13px;">
                                                                Fecha: ${new Date().toLocaleString('es-PE', { timeZone: 'America/Lima', day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}<br>
                                                                Código: <span style="font-family: monospace; color: #0f172a; font-weight: bold;">${paymentId}</span>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>

                                            <!-- Footer Section -->
                                            <tr>
                                                <td style="padding: 30px 50px; background-color: #fafafa; border-top: 1px solid #f1f5f9; text-align: center;">
                                                    <p style="margin: 0 0 10px 0; font-size: 14px; color: #475569;">¿Tienes dudas? Escríbenos a:</p>
                                                    <a href="mailto:info@thefacescongreso.com" style="display: inline-block; padding: 10px 20px; background-color: #ffffff; color: #0d9488; text-decoration: none; border: 1px solid #0d9488; border-radius: 8px; font-weight: 600; font-size: 14px;">info@thefacescongreso.com</a>
                                                    <p style="margin: 20px 0 0 0; font-size: 12px; color: #94a3b8;">
                                                        © 2026 THE FACES - Master Inyector<br>
                                                        <a href="https://thefacescongreso.com" style="color: #94a3b8; text-decoration: none;">thefacescongreso.com</a>
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </body>
                        </html>
                    `,
                });
            }

        } catch (e) {
            console.error('Post-payment logic error:', e);
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
