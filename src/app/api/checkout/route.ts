import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const key = searchParams.get('key');

        if (!key) {
            return NextResponse.json(
                { error: 'Checkout key is required' },
                { status: 400 }
            );
        }

        // Find the checkout configuration
        const checkout = await prisma.checkoutConfig.findUnique({
            where: { checkoutKey: key },
        });

        if (!checkout) {
            return NextResponse.json(
                { error: 'Checkout not found' },
                { status: 404 }
            );
        }

        if (!checkout.isActive) {
            return NextResponse.json(
                { error: 'This checkout is not available' },
                { status: 403 }
            );
        }

        // Log analytics event
        try {
            await prisma.analyticsEvent.create({
                data: {
                    eventType: 'checkout_redirect',
                    eventData: {
                        checkoutKey: key,
                        packageName: checkout.packageName,
                        price: checkout.price,
                    },
                },
            });
        } catch (analyticsError) {
            console.error('Error logging analytics:', analyticsError);
            // Don't fail the redirect if analytics fails
        }

        // Redirect to System.io checkout URL
        return NextResponse.redirect(checkout.redirectUrl);
    } catch (error) {
        console.error('Error processing checkout:', error);
        return NextResponse.json(
            { error: 'Error processing checkout' },
            { status: 500 }
        );
    }
}
