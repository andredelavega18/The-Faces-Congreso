'use client';

import { Card } from '@/components/ui/card';
import LogoLoop from '@/components/animations/LogoLoop';

interface LaboratoriesSectionProps {
    content: {
        title?: string;

        description?: string;
    };
    assets?: { fileUrl: string; fileName: string }[];
}

export function LaboratoriesSection({ content, assets = [] }: LaboratoriesSectionProps) {
    const {
        title = 'Laboratorios Patrocinadores',

        description = 'Empresas y laboratorios que respaldan el congreso',
    } = content;

    // Use ONLY bucket assets - no manual content needed
    const logos = assets.map(asset => ({
        src: asset.fileUrl,
        alt: asset.fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
    }));

    return (
        <section id="labs" className="relative py-20 overflow-hidden bg-slate-50">
            <div className="relative z-10 mx-auto max-w-7xl px-6">
                {/* Header */}
                <div className="mb-16 text-center max-w-3xl mx-auto">
                    <h2 className="font-averox text-4xl font-bold md:text-5xl mb-6">
                        <span className="text-gradient">{title}</span>
                    </h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        {description}
                    </p>
                </div>

                {/* Logos Carousel - LogoLoop */}
                <div className="w-full">
                    {logos.length === 0 ? (
                        <Card className="bg-white/80 backdrop-blur border-slate-200 p-8 text-center text-slate-500 max-w-lg mx-auto shadow-sm">
                            Sube las imágenes de los laboratorios al bucket "sponsors" en Supabase.
                        </Card>
                    ) : (
                        <div className="py-4">
                            <LogoLoop
                                logos={logos}
                                speed={85} // Increased speed to be visible (was 1.5)
                                direction="left"
                                logoHeight={80} // Larger size
                                gap={80} // More breathing room
                                pauseOnHover={true}
                                fadeOut={true}
                                fadeOutColor="#f8fafc" // Updated fade color to match bg-slate-50 (#f8fafc)
                                scaleOnHover={true}
                                ariaLabel="Laboratorios Patrocinadores"
                                className="opacity-80 hover:opacity-100 transition-opacity duration-500"
                            />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
