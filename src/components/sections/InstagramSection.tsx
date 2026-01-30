import Link from 'next/link';

import { Instagram } from 'lucide-react';

interface InstagramSectionProps {
    content: {
        title?: string;

        handle?: string;
        ctaLabel?: string;
        ctaUrl?: string;
    };
}

export function InstagramSection({ content }: InstagramSectionProps) {
    const {
        title = 'Síguenos en Instagram',

        handle = '@dr_felicef',
        ctaLabel = 'Ir a Instagram',
        ctaUrl = 'https://instagram.com/dr_felicef',
    } = content;

    return (
        <section id="instagram" className="relative py-24 sm:py-32 overflow-hidden">
            {/* Background Gradient */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(135deg, #e830ce 0%, #2323ff 50%, #2ef8a0 100%)',
                }}
            />

            {/* Sparkle Effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 opacity-30">
                    {/* Static particles using radial gradients for performance */}
                    <div className="absolute top-0 left-0 w-full h-full"
                        style={{
                            backgroundImage: `radial-gradient(white 1px, transparent 1px), radial-gradient(white 1.5px, transparent 1.5px)`,
                            backgroundSize: '50px 50px, 90px 90px',
                            backgroundPosition: '0 0, 25px 25px',
                            maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
                            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)'
                        }}
                    />
                </div>
                {/* Floating particles */}
                {Array.from({ length: 20 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-white animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${Math.random() * 3 + 1}px`,
                            height: `${Math.random() * 3 + 1}px`,
                            opacity: Math.random() * 0.5 + 0.2,
                            animationDuration: `${Math.random() * 3 + 2}s`,
                            animationDelay: `${Math.random() * 2}s`,
                        }}
                    />
                ))}
            </div>

            {/* Overlay for contrast */}
            <div className="absolute inset-0 bg-black/10" />

            <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    {/* Instagram Icon - Full Color Gradient Box like Reference */}
                    <div className="mb-8 flex justify-center">
                        <div className="relative group">
                            {/* Inner Glow */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] rounded-[2rem] blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                            {/* Icon Container */}
                            <div className="relative flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] shadow-2xl transform transition-transform duration-500 group-hover:scale-110">
                                <Instagram className="h-12 w-12 text-white" strokeWidth={2} />
                            </div>
                        </div>
                    </div>

                    <span className="block text-3xl font-bold tracking-tight text-white sm:text-5xl mb-4 font-averox drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                        <Link
                            href={ctaUrl}
                            target="_blank"
                            className="hover:opacity-90 transition-opacity duration-300"
                        >
                            {handle.replace('@', '')}
                        </Link>
                    </span>

                    <p className="mb-10 text-lg text-white/90 font-light tracking-wide drop-shadow-md">
                        {title}
                    </p>

                    <div className="flex items-center justify-center pt-6">
                        <Link
                            href={ctaUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center rounded-full bg-white/95 px-10 py-4 text-base font-bold uppercase tracking-[0.25em] text-slate-900 shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition-all duration-300 border-2 border-transparent hover:scale-105 hover:bg-transparent hover:border-white hover:text-white sm:text-lg group"
                        >
                            <Instagram className="mr-3 h-6 w-6 text-[#dc2743] group-hover:text-white transition-colors duration-300" />
                            {ctaLabel}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
