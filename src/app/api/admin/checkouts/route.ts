import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export async function GET() {
    try {
        const checkouts = await prisma.checkoutConfig.findMany({
            orderBy: {
                price: 'asc',
            },
        });
        return NextResponse.json(checkouts);
    } catch (error) {
        console.error('Error fetching checkouts:', error);
        return NextResponse.json(
            { error: 'Error al obtener los paquetes' },
            { status: 500 }
        );
    }
}

const createCheckoutSchema = z.object({
    packageName: z.string().min(1, 'El nombre es requerido'),
    price: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
    currency: z.string().length(3, 'La moneda debe tener 3 caracteres').default('USD'),
    packageType: z.enum(['ONLINE', 'PRESENCIAL']).default('PRESENCIAL'),
    imageUrl: z.string().optional(),
    thankYouUrl: z.string().optional(), // Now using thankYouUrl for post-purchase
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = createCheckoutSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: 'Datos inválidos', details: result.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const data = result.data;
        const checkoutKey = `chk_${Date.now()}_${Math.random().toString(36).substring(7)}`;

        const newCheckout = await prisma.checkoutConfig.create({
            data: {
                checkoutKey,
                packageName: data.packageName,
                price: data.price,
                currency: data.currency,
                packageType: data.packageType,
                isActive: false,
                redirectUrl: '', // Unused for internal checkout, empty by default
                thankYouUrl: data.thankYouUrl || undefined, // Save Custom Thank You URL
                metadata: {
                    features: [],
                    badge: 'NUEVO',
                    imageUrl: data.imageUrl,
                    // isRedirectOnly removed as requested (always internal payment)
                }
            },
        });

        return NextResponse.json(newCheckout);
    } catch (error) {
        console.error('Error creating checkout:', error);
        return NextResponse.json(
            { error: 'Error al crear el paquete' },
            { status: 500 }
        );
    }
}
