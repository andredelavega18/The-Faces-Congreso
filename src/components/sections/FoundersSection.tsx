'use client';

import ProfileCard from '@/components/ui/ProfileCard';
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

export function FoundersSection({ content, embedded = false }: FoundersSectionProps) {
    const {
        title = 'Fundadoras The Faces',
        subtitle = 'Liderazgo y visiÃ³n que impulsan The Faces.',
        description = '',
        founder1Name = 'DRA YEZENIA PARIONA SIHUIN',
        founder1Role = 'CEO â€¢ Fundadora',
        founder1Image: _founder1ImageFromDb = '',
        founder2Name = 'DRA CESVI VILLENA BEJAR',
        founder2Role = 'CEO â€¢ Fundadora',
        founder2Image: _founder2ImageFromDb = '',
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

                <div
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-center justify-items-center"
                >
                    <div className="flex justify-center w-full">
                        <ProfileCard
                            className="w-full max-w-[320px] sm:max-w-[360px] md:max-w-[380px] lg:max-w-[420px]"
                            avatarUrl={founder1Image}
                            name={founder1Name}
                            title={founder1Role}
                            showUserInfo={false}
                            iconUrl=""
                            grainUrl=""
                            enableTilt={true}
                            enableMobileTilt={false}
                            behindGlowEnabled={true}
                            behindGlowColor="rgba(232, 48, 206, 0.6)"
                            innerGradient="linear-gradient(135deg, rgba(232, 48, 206, 0.8) 0%, rgba(35, 35, 255, 0.8) 50%, rgba(46, 248, 160, 0.8) 100%)"
                        />
                    </div>
                    <div className="flex justify-center w-full">
                        <ProfileCard
                            className="w-full max-w-[320px] sm:max-w-[360px] md:max-w-[380px] lg:max-w-[420px]"
                            avatarUrl={founder2Image}
                            name={founder2Name}
                            title={founder2Role}
                            showUserInfo={false}
                            iconUrl=""
                            grainUrl=""
                            enableTilt={true}
                            enableMobileTilt={false}
                            behindGlowEnabled={true}
                            behindGlowColor="rgba(46, 248, 160, 0.6)"
                            innerGradient="linear-gradient(135deg, rgba(46, 248, 160, 0.8) 0%, rgba(35, 35, 255, 0.8) 50%, rgba(232, 48, 206, 0.8) 100%)"
                        />
                    </div>
                </div>
            </div>
        </Wrapper>
    );
}
