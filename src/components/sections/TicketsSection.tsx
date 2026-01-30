'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface Checkout {
    id: string;
    checkoutKey: string;
    packageName: string;
    packageType: string;
    price: number;
    currency: string;
    redirectUrl?: string; // Add redirectUrl
    metadata?: {
        subtitle?: string;
        badge?: string;
        features?: string[] | string;
        imageUrl?: string;
        isRedirectOnly?: boolean; // Add isRedirectOnly
        isSoldOut?: boolean;
    } | null;
}

interface TicketsSectionProps {
    content: {
        title?: string;
        subtitle?: string;
        description?: string;
        introTitle?: string;
        introDescription?: string;
        featureTitle?: string;
        features?: unknown;
        paymentNote?: string;
        onlineTitle?: string;
        onlineDescription?: string;
    };
    checkouts: Checkout[];
    centerCarousel?: boolean;
    hideGroupTitles?: boolean;
}

export function TicketsSection({ content, checkouts, centerCarousel = false, hideGroupTitles = false }: TicketsSectionProps) {
    const {
        title = 'Entradas',

        description = '',
        onlineTitle = 'Virtual',

    } = content;

    // Filter Groups
    // Filter Groups
    // const activeCheckouts = checkouts.filter(c => c.isActive !== false); 
    const activeCheckouts = checkouts;
    // Assuming 'checkouts' passed here might include inactive if not filtered upstream.
    // But usually frontend fetches active. Let's assume passed checkouts are valid to show.

    // Grouping Logic
    const preCongreso = activeCheckouts.filter(c => c.packageName.includes('Pre Congreso') || c.packageName.includes('Structural Anatomy'));
    const postCongreso = activeCheckouts.filter(c => c.packageName.includes('Post Congreso') || c.packageName.includes('Masterclass'));
    const online = activeCheckouts.filter(c => c.packageType === 'ONLINE');

    // Congreso is everything else Presencial
    const congreso = activeCheckouts.filter(c =>
        c.packageType === 'PRESENCIAL' &&
        !c.packageName.includes('Pre Congreso') &&
        !c.packageName.includes('Structural Anatomy') &&
        !c.packageName.includes('Post Congreso') &&
        !c.packageName.includes('Masterclass')
    );
    const congresoOrder = ['silver', 'gold', 'platinum'];
    const congresoSorted = congreso
        .map((item, index) => ({ item, index }))
        .sort((a, b) => {
            const aKey = a.item.packageName.toLowerCase();
            const bKey = b.item.packageName.toLowerCase();
            const aRank = congresoOrder.findIndex((tier) => aKey.includes(tier));
            const bRank = congresoOrder.findIndex((tier) => bKey.includes(tier));
            const normalizedARank = aRank === -1 ? congresoOrder.length : aRank;
            const normalizedBRank = bRank === -1 ? congresoOrder.length : bRank;
            if (normalizedARank !== normalizedBRank) {
                return normalizedARank - normalizedBRank;
            }
            return a.index - b.index;
        })
        .map(({ item }) => item);

    const resolvedTitle = title?.trim() ? title : 'Inscripciones';

    const resolvedDescription = description?.trim()
        ? description
        : 'No pierdas la oportunidad e inscribete AHORA y seras parte del mejor congreso.';

    return (
        <section id="tickets" className="relative pt-12 px-4 sm:pt-16 sm:px-6 md:pt-20 md:px-10 bg-slate-50">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-10 text-center max-w-3xl mx-auto sm:mb-12 md:mb-16"
                >
                    <h2 className="font-averox text-2xl font-bold sm:text-3xl md:text-4xl lg:text-6xl mb-4 sm:mb-6">
                        <span className="text-gradient">{resolvedTitle}</span>
                    </h2>
                    {resolvedDescription && (
                        <p className="text-base text-slate-600 leading-relaxed sm:text-lg md:text-xl">
                            {resolvedDescription}
                        </p>
                    )}
                </motion.div>

                {online.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mb-16 flex justify-center"
                    >
                        {/* Reusing the standard card rendering logic but centered using carousel mode to enforce 400px width */}
                        <RenderTicketGroup items={online} title={onlineTitle || "Virtual"} mode="carousel" centerCarousel={true} hideGroupTitle={hideGroupTitles} />
                    </motion.div>
                )}

                {/* Congreso Main - Carousel Style */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-16"
                >
                    <RenderTicketGroup items={congresoSorted} title="Congreso The Faces" mode="carousel" centerCarousel={centerCarousel} hideGroupTitle={hideGroupTitles} />
                </motion.div>

                {/* Combined Pre & Post Congreso - Carousel Style like Virtual */}
                {([...preCongreso, ...postCongreso].length > 0) && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mb-16 flex justify-center"
                    >
                        <RenderTicketGroup items={[...preCongreso, ...postCongreso]} title="Pre y Post Congreso" mode="carousel" centerCarousel={true} hideGroupTitle={hideGroupTitles} />
                    </motion.div>
                )}
            </div>
        </section>
    );
}


// Helper Interface
interface RenderGroupProps {
    items: Checkout[];
    title: string;
    mode?: 'grid' | 'carousel';
    centerCarousel?: boolean;
    hideGroupTitle?: boolean;
    useColoredShadow?: boolean;
}

function RenderTicketGroup({ items, title, mode = 'grid', hideGroupTitle = false, useColoredShadow = true }: RenderGroupProps) {
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Auto-scroll removed as per user request to implement GRID layout

    if (items.length === 0) return null;

    const Container = mode === 'carousel'
        ? ({ children }: { children: React.ReactNode }) => (
            <div className="relative">
                {/* Mobile: Grid 1 col | Tablet: Grid 2 cols | Desktop: Flex Wrap Centered (GRID behavior) */}
                <div
                    ref={containerRef}
                    className={`
                        grid grid-cols-1 gap-6 px-4 py-6 justify-items-center
                        md:grid-cols-2 md:gap-6 md:px-6 md:py-10 md:max-w-[750px] md:mx-auto
                        lg:grid lg:grid-cols-3 lg:gap-8 lg:max-w-[1400px] lg:mx-auto lg:py-16
                    `}
                >
                    {children}
                </div>
            </div>
        )
        : ({ children }: { children: React.ReactNode }) => (
            <div className="grid gap-4 grid-cols-1 px-4 sm:grid-cols-2 sm:gap-6 sm:px-6 lg:px-0 max-w-[900px] mx-auto justify-items-center">
                {children}
            </div>
        );

    return (
        <div className="mb-16">
            {!hideGroupTitle && (
                <h3 className="mb-3 text-xl font-bold text-center uppercase tracking-tight sm:mb-4 sm:text-2xl md:text-3xl lg:text-5xl">
                    <span className="text-gradient border-b-4 border-transparent">
                        {title}
                    </span>
                </h3>
            )}

            {/* Wrapper to control max-width on carousel too if needed, but carousel usually full width */}
            <div className={mode === 'grid' ? "w-full" : "max-w-[90rem] mx-auto"}>
                <Container>
                    {items.map((checkout) => {
                        const isSoldOut = Boolean(checkout.metadata?.isSoldOut);

                        const linkHref = (checkout.metadata?.isRedirectOnly && checkout.redirectUrl)
                            ? checkout.redirectUrl
                            : `/checkout?key=${checkout.checkoutKey}`;

                        return (
                            <div key={checkout.id} className="h-full w-full md:w-auto">
                                <Card
                                    className={`relative overflow-hidden transition-all duration-500 flex flex-col h-full bg-white rounded-[20px] sm:rounded-[24px] md:rounded-[28px] group ${mode === 'carousel'
                                        ? 'w-full max-w-[350px] md:max-w-none lg:w-auto lg:max-w-[400px]'
                                        : 'w-full max-w-[350px] md:max-w-none'
                                        } ${useColoredShadow
                                            ? 'shadow-[0_10px_40px_-10px_rgba(232,48,206,0.3)] hover:shadow-[0_20px_60px_-15px_rgba(232,48,206,0.5)] border-transparent'
                                            : 'shadow-[0_18px_50px_rgba(0,0,0,0.18)] hover:shadow-2xl'
                                        }`}
                                >
                                    {/* Image Container - Responsive Height */}
                                    <div className="relative w-full h-[400px] sm:h-[340px] md:h-[420px] lg:h-[480px] overflow-hidden bg-slate-50">
                                        {checkout.metadata?.imageUrl ? (
                                            <img
                                                src={checkout.metadata.imageUrl}
                                                alt={checkout.packageName}
                                                className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700 ease-out will-change-transform"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="flex flex-col h-full items-center justify-center text-slate-400 p-4 text-center bg-slate-50">
                                                <span className="text-4xl mb-2">🎫</span>
                                                <span className="text-sm font-bold">{checkout.packageName}</span>
                                            </div>
                                        )}

                                        {/* Badge Removed per user request */}
                                        {/* {badgeText && (
                                            <span className={`absolute top-4 right-4 px-4 py-1.5 rounded-full text-white text-[10px] font-bold shadow-md z-10 tracking-widest uppercase ${isSoldOut ? 'bg-gradient-to-r from-slate-500 to-slate-700' : 'bg-gradient-to-r from-[#e830ce] to-[#8a3dff]'}`}>
                                                {badgeText}
                                            </span>
                                        )} */}
                                    </div>

                                    <div className="px-[20px] pt-[20px] pb-[20px] mt-auto bg-white relative z-10">
                                        {isSoldOut ? (
                                            <Button
                                                disabled
                                                className="w-full h-[44px] rounded-[14px] bg-slate-300 text-slate-600 text-[14px] font-bold tracking-[0.5px] uppercase border-0 cursor-not-allowed"
                                            >
                                                AGOTADO
                                            </Button>
                                        ) : (
                                            <Link href={linkHref} className="block w-full" target={checkout.metadata?.isRedirectOnly ? "_blank" : "_self"}>
                                                <Button className="w-full h-[44px] rounded-[14px] shadow-[0_8px_20px_rgba(232,48,206,0.20)] hover:shadow-[0_8px_20px_rgba(232,48,206,0.35)] hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-r from-[#e830ce] to-[#8a3dff] text-white text-[14px] font-bold tracking-[0.5px] uppercase border-0">
                                                    COMPRAR AHORA
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                </Card>
                            </div>
                        );
                    })}
                </Container>
            </div>
        </div>
    );
}
