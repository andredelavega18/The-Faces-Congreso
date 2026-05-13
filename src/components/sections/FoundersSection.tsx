'use client';

import { motion } from 'framer-motion';

export interface FoundersContent {
    title?: string;
    subtitle?: string;
    description?: string;
    founder1Name?: string;
    founder1Role?: string;
    founder1Image?: string;
    founder2Name?: string;
    founder2Role?: string;
    founder2Image?: string;
}

interface FoundersSectionProps {
    content: FoundersContent;
    embedded?: boolean;
}

interface FounderCardProps {
    name: string;
    role: string;
    imageUrl: string;
    gradientDirection?: 'left' | 'right';
    delay?: number;
}

function FounderCard({ name, role, imageUrl, gradientDirection = 'left', delay = 0 }: FounderCardProps) {
    const gradient = gradientDirection === 'left'
        ? 'linear-gradient(135deg, #2323ff 0%, #8a3dff 30%, #e830ce 60%, #ff6b6b 100%)'
        : 'linear-gradient(225deg, #2323ff 0%, #8a3dff 30%, #e830ce 60%, #ff8c42 100%)';

    return (
        <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay, ease: 'easeOut' }}
            className="group relative w-full max-w-[380px] lg:max-w-[420px]"
        >
            <div
                className="relative overflow-hidden rounded-[24px] sm:rounded-[28px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] transition-all duration-500 group-hover:shadow-[0_30px_80px_-15px_rgba(232,48,206,0.4)] group-hover:-translate-y-2"
                style={{ background: gradient }}
            >
                {/* Subtle noise texture overlay */}
                <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
                    style={{ backgroundImage: 'url(/backgrounds/banner.svg)', backgroundSize: 'cover' }}
                />

                {/* Top section - Name and Role */}
                <div className="relative z-10 pt-8 pb-4 px-6 sm:pt-10 sm:pb-5 sm:px-8 text-center" style={{ minHeight: '90px' }}>
                    <h3 className="font-averox text-lg sm:text-xl md:text-2xl font-bold uppercase tracking-[0.08em] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] leading-tight">
                        {name}
                    </h3>
                    <p className="mt-1.5 sm:mt-2 text-sm sm:text-base font-semibold uppercase tracking-[0.25em] text-white/90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.2)]">
                        {role}
                    </p>
                </div>

                {/* Bottom section - Photo */}
                <div className="relative z-10 flex justify-center items-end overflow-hidden"
                    style={{ minHeight: '340px' }}
                >
                    <img
                        src={imageUrl}
                        alt={name}
                        className="w-full max-w-[90%] object-contain object-bottom transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        loading="lazy"
                        style={{
                            filter: 'brightness(1.05) contrast(1.02)',
                            transformOrigin: 'bottom center',
                        }}
                    />
                </div>

                {/* Subtle gradient overlay at the bottom for depth */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/10 to-transparent pointer-events-none z-[5]" />
            </div>
        </motion.div>
    );
}

export function FoundersSection({ content, embedded = false }: FoundersSectionProps) {
    const {
        title = 'Fundadoras The Faces',
        subtitle = 'Liderazgo y visión que impulsan The Faces.',
        description = '',
        founder1Name = 'DRA YEZENIA PARIONA',
        founder1Role = 'CEO',
        founder2Name = 'DRA CESVI VILLENA BEJAR',
        founder2Role = 'CEO',
    } = content;

    // Force local image override
    const founder1Image = '/fundadoras/dra-yezenia.webp';
    const founder2Image = '/fundadoras/dra-cesvi.webp';

    const Wrapper = embedded ? 'div' : 'section';
    const wrapperProps = embedded
        ? {
            className: 'relative mt-12 px-6 py-12 sm:px-10',
        }
        : {
            id: 'founders',
            className: 'relative py-10 sm:py-[56px] lg:py-[80px] bg-slate-50',
        };

    return (
        <Wrapper {...wrapperProps}>
            <div className="relative mx-auto max-w-[1200px] px-4 sm:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-8 sm:mb-12 md:mb-16 relative z-10"
                >
                    <h2 className="font-averox text-2xl font-bold sm:text-3xl md:text-4xl lg:text-5xl tracking-tight">
                        <span className="bg-gradient-to-r from-[#e830ce] via-[#2323ff] to-[#2ef8a0] bg-clip-text text-transparent">
                            {title || 'Fundadoras The Faces'}
                        </span>
                    </h2>
                    <p className="mt-3 text-sm font-medium text-slate-600 sm:mt-4 sm:text-base md:text-lg tracking-wide uppercase">
                        {subtitle}
                    </p>
                    {description ? (
                        <p className="mt-4 text-sm text-slate-500 max-w-2xl mx-auto">
                            {description}
                        </p>
                    ) : null}
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-start justify-items-center">
                    <div className="flex justify-center w-full">
                        <FounderCard
                            name={founder1Name}
                            role={founder1Role}
                            imageUrl={founder1Image}
                            gradientDirection="left"
                            delay={0.1}
                        />
                    </div>
                    <div className="flex justify-center w-full">
                        <FounderCard
                            name={founder2Name}
                            role={founder2Role}
                            imageUrl={founder2Image}
                            gradientDirection="right"
                            delay={0.3}
                        />
                    </div>
                </div>
            </div>
        </Wrapper>
    );
}
