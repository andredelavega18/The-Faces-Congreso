import { CheckCircle, Calendar, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { prisma } from '@/lib/prisma';
import { HeroBanner, TicketsSection, FooterSection } from '@/components/sections';

interface PageProps {
    searchParams: Promise<{ key?: string }>;
}

async function getCheckoutInfo(key: string | undefined) {
    if (!key) return null;

    try {
        return await prisma.checkoutConfig.findUnique({
            where: { checkoutKey: key },
        });
    } catch {
        return null;
    }
}

async function getPrePostCheckouts() {
    const checkouts = await prisma.checkoutConfig.findMany({
        where: { isActive: true },
        orderBy: [{ packageType: 'asc' }, { price: 'desc' }],
    });

    const pre = checkouts.filter(
        (c) => c.packageName.includes('Pre Congreso') || c.packageName.includes('Structural Anatomy')
    );
    const post = checkouts.filter(
        (c) => c.packageName.includes('Post Congreso') || c.packageName.includes('Masterclass')
    );

    return [...pre, ...post].map((checkout) => ({
        ...checkout,
        price: checkout.price.toNumber(),
    }));
}

export default async function ThankYouPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const checkout = await getCheckoutInfo(params.key);
    const prePost = await getPrePostCheckouts();

    return (
        <main className="min-h-screen bg-background">
            <HeroBanner
                title={"¡YA ESTAS LISTO PARA LA EXPERIENCIA\nTHE FACES MASTER INYECTOR 2026!"}
                showMeta={false}
                showCta={false}
                minHeightClass="min-h-[400px]"
                titleClassName="font-isidora text-lg font-bold uppercase tracking-[0.04em] text-white sm:text-2xl md:text-3xl drop-shadow-lg max-w-5xl leading-tight"
                useTypewriter={false}
            />

            <div className="relative mx-auto w-full max-w-4xl px-6 py-12 text-center sm:px-10">
                <div className="mb-8 flex justify-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/20 shadow-[0_0_30px_rgba(46,248,160,0.35)]">
                        <CheckCircle className="h-10 w-10 text-accent" />
                    </div>
                </div>

                {checkout && (
                    <div className="mb-6">
                        <p className="text-lg text-neutral-700">
                            Has seleccionado el paquete{' '}
                            <span className="font-semibold text-primary">{checkout.packageName}</span>
                        </p>
                        <p className="mt-2 text-2xl font-bold text-accent">
                            {checkout.currency} ${Number(checkout.price).toLocaleString()}
                        </p>
                    </div>
                )}

                <p className="mb-6 text-base text-neutral-600 sm:text-lg">
                    Pronto recibirás un correo con los detalles de tu inscripción y los próximos pasos.
                </p>

                <p className="mb-6 whitespace-nowrap text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-neutral-700">
                    THE FACES MASTER INYECTOR
                </p>

                <Card className="mb-8 border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col items-center gap-4 text-neutral-600 md:flex-row md:justify-center">
                        <div className="flex items-center gap-2 text-sm sm:text-base">
                            <Calendar className="h-5 w-5 text-primary" />
                            <span>5 y 6 de Junio, 2026</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm sm:text-base">
                            <MapPin className="h-5 w-5 text-accent" />
                            <span>Hotel Westin, Lima, Perú</span>
                        </div>
                    </div>
                </Card>
            </div>

            {prePost.length > 0 && (
                <div className="w-full">
                    <TicketsSection
                        content={{
                            title: 'Pre y Post Congreso',
                            description: 'No pierdas la oportunidad e inscribete AHORA y seras parte del mejor congreso.',
                        }}
                        checkouts={prePost as any}
                        centerCarousel
                        hideGroupTitles
                    />
                </div>
            )}

            <FooterSection
                content={{}}
            />
        </main>
    );
}
