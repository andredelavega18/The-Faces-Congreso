'use client';

import { motion } from 'framer-motion';

interface IntroCardProps {
    badge?: string;
    title?: string;
    description?: string;
    imageSrc?: string;
    imageAlt?: string;
}

const DEFAULT_DESCRIPTION = 'Año tras año, The Faces convoca a referentes internacionales de la medicina estética, seleccionados por su respaldo científico, experiencia clínica comprobada y aporte real al desarrollo del sector.';

export function IntroCard({
    badge = 'THE FACES MASTER INYECTOR',
    title = 'LOS MEJORES EN UN SOLO LUGAR',
    description,
    imageSrc = '/placeholders/speakers.webp',
    imageAlt = 'Speakers',
}: IntroCardProps) {
    const safeDescription = description?.trim() || DEFAULT_DESCRIPTION;

    return (
        <div className="mx-auto mt-16 flex w-full max-w-[81.25rem] flex-col gap-10 px-4 pb-0 md:mt-20 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="relative overflow-visible rounded-[34px] border border-slate-200 bg-white/80 shadow-[0_32px_90px_rgba(120,120,180,0.2)] backdrop-blur-xl"
                style={{ backgroundImage: 'url(/backgrounds/background_1.svg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
                <div className="relative z-10 flex flex-col items-center md:flex-row md:items-end">
                    <div className="flex flex-1 flex-col items-center justify-center px-4 py-8 text-center sm:px-8 md:px-[3rem] md:py-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        >
                            <p className="font-isidora text-xs font-semibold uppercase tracking-[0.3em] text-fuchsia-500/80">
                                {badge}
                            </p>
                            <h2 className="mt-3 font-averox text-2xl font-bold uppercase tracking-[0.12em] text-slate-600 md:text-3xl">
                                {title}
                            </h2>
                            <p className="mt-4 w-full text-sm leading-relaxed text-slate-500 text-center md:text-base">
                                {safeDescription}
                            </p>
                        </motion.div>
                    </div>

                    <motion.div
                        className="flex-1 px-4 sm:px-6 md:pl-0 md:pr-[3rem]"
                        initial={{ opacity: 0, scale: 0.95, x: 20 }}
                        whileInView={{ opacity: 1, scale: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                    >
                        <img
                            src={imageSrc}
                            alt={imageAlt}
                            className="w-full object-contain object-bottom transition-all duration-700 hover:scale-105 origin-bottom"
                            width="682"
                            height="341"
                            style={{
                                filter: "brightness(1.15) contrast(1.05) saturate(1.1)",
                            }}
                        />
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
