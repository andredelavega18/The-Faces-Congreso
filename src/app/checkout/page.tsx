import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { HeroBanner, FooterSection } from '@/components/sections';

interface CheckoutPageProps {
    searchParams: Promise<{ key?: string; source?: string }>;
}

async function CheckoutContent({ searchParams }: CheckoutPageProps) {
    const params = await searchParams;
    const key = params.key;
    const source = params.source || 'website';

    if (!key) {
        redirect('/');
    }

    const checkoutConfig = await prisma.checkoutConfig.findUnique({
        where: { checkoutKey: key },
    });

    if (!checkoutConfig || !checkoutConfig.isActive) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center px-4">
                <h1 className="text-3xl font-bold">Paquete no encontrado</h1>
                <p className="text-muted-foreground">
                    Lo sentimos, el paquete que buscas no está disponible o el enlace ha expirado.
                </p>
                <a href="/" className="text-primary hover:underline font-medium">
                    Volver al inicio
                </a>
            </div>
        );
    }

    return (
        <section className="container mx-auto max-w-7xl px-4 py-12 md:px-8">
            <CheckoutForm
                checkoutKey={key}
                packageName={checkoutConfig.packageName}
                price={Number(checkoutConfig.price)}
                currency={checkoutConfig.currency}
                source={source}
                redirectUrl={checkoutConfig.redirectUrl || undefined}
            />
        </section>
    );
}

export default async function CheckoutPage(props: CheckoutPageProps) {
    const footerContent = {
        title: 'THE FACES',
        email: 'contacto@thefaces.com',
        phone: '+51 999 999 999',
        organization: 'The Faces Master Inyector',
    };

    return (
        <main className="min-h-screen bg-slate-50">
            <HeroBanner
                title="Finaliza tu Inscripción"
                showMeta={false}
                showCta={false}
                minHeightClass="min-h-[400px]"
            />
            <Suspense fallback={<div className="flex h-[60vh] items-center justify-center">Cargando...</div>}>
                <CheckoutContent {...props} />
            </Suspense>
            <FooterSection content={footerContent} />
        </main>
    );
}
