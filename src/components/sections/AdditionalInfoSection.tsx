'use client';

import { type FoundersContent } from './FoundersSection';
import {
    BookOpen,
    Globe,
    Stethoscope,
    Users,
    Award,
    Download,
    TrendingUp,
    CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';

interface AdditionalInfoSectionProps {
    content: {
        title?: string;
        subtitle?: string;
        description?: string;
        objectiveTitle?: string;
        objectiveDescription?: string;
        benefitsTitle?: string;
        benefits?: string;
        detailsTitle?: string;
        details?: string;
        detailsNote?: string;
        includedTitle?: string;
        included?: string;
    };
    foundersContent?: FoundersContent;
}

function parseLines(value?: string): string[] {
    if (!value) return [];
    return value
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
}

export function AdditionalInfoSection({ content }: AdditionalInfoSectionProps) {
    const {
        benefitsTitle = 'Beneficios principales',
        benefits = `Acceso a contenido clinico avanzado y actualizado
Speakers internacionales referentes del sector
Aprendizaje basado en casos reales y practica clinica
Networking estrategico con medicos lideres y marcas premium
Certificacion oficial incluida
Material academico y recursos digitales exclusivos
Impulso a tu crecimiento profesional y posicionamiento en medicina estetica`,
        detailsTitle = 'Detalle del contenido del evento',
        details = `Conferencias magistrales de alto nivel
Analisis de casos clinicos reales y complejos
Paneles de discusion con expertos internacionales
Espacios de interaccion y debate profesional
Sesiones sobre tendencias, innovacion y futuro de la medicina estetica`,
        detailsNote = 'El programa cientifico final estara disponible conforme se confirme la agenda de speakers y contenidos.',
        includedTitle = 'Beneficios incluidos',
        included = `Acceso segun modalidad contratada
Certificacion digital
Acceso a material academico
Networking profesional
Zonas de convivencia y espacios de interaccion`,
    } = content;

    const benefitItems = parseLines(benefits);
    const detailItems = parseLines(details);
    const includedItems = parseLines(included);

    return (
        <section
            id="additional"
            className="relative py-12 px-4 sm:py-16 sm:px-6 md:py-24 md:px-8 bg-slate-50"
        >
            <div className="mx-auto max-w-[76rem]">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-5 md:gap-6 lg:min-h-[500px]">

                    {/* Item 1: Beneficios Importantes - Pink Gradient */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5 }}
                        className="group relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-[#e830ce]/90 via-[#c41fac]/90 to-[#a2188b]/90 p-8 text-white shadow-xl transition-all hover:shadow-2xl md:col-span-5 order-1 backdrop-blur-sm"
                    >
                        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-3xl transition-transform duration-500 group-hover:scale-150" />
                        <div className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-black/10 blur-3xl transition-transform duration-500 group-hover:scale-150" />

                        <div className="relative z-10 flex flex-col items-center text-center">
                            <h3 className="font-averox text-xl font-bold uppercase tracking-[0.15em] text-white sm:text-2xl sm:tracking-[0.2em]">
                                {benefitsTitle}
                            </h3>

                            <div className="mt-8 w-full max-w-4xl grid gap-y-2">
                                {benefitItems.map((item, index) => {
                                    const icons = [BookOpen, Globe, Stethoscope, Users, Award, Download, TrendingUp];
                                    const Icon = icons[index % icons.length] as React.ElementType;

                                    // Separator: Gradient 0-100-0
                                    return (
                                        <div key={`benefit-${index}`} className="group/item flex flex-col items-center">
                                            <div className="flex w-full flex-col items-center gap-2 py-3 sm:flex-row sm:justify-center sm:gap-4">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                                                    <Icon className="h-4 w-4 text-white" />
                                                </div>
                                                <span className="text-sm font-normal leading-snug text-white/90 sm:text-base">
                                                    {item}
                                                </span>
                                            </div>
                                            {/* Gradient Separator (0 -> 100 -> 0) */}
                                            {index !== benefitItems.length - 1 && (
                                                <div className="h-[1px] w-full max-w-[80%] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>

                    {/* Item 2: Detalles - Blue Gradient */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="group relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-[#2323ff]/90 via-[#4a23db]/90 to-[#6750ff]/90 p-8 text-white shadow-xl transition-all hover:shadow-2xl md:col-span-3 order-2 backdrop-blur-sm"
                    >
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_50%)]" />

                        <div className="relative z-10 h-full flex flex-col justify-between text-center items-center">
                            <div className="w-full">
                                <h3 className="font-averox text-xl font-bold uppercase tracking-[0.15em] text-white sm:text-2xl sm:tracking-[0.2em]">
                                    {detailsTitle}
                                </h3>
                                <ul className="mt-6 w-full max-w-[34rem] mx-auto">
                                    {detailItems.map((item, index) => (
                                        <li key={`detail-${index}`} className="flex flex-col items-center">
                                            <div className="w-full py-2 text-center">
                                                <span className="text-[0.86rem] font-normal leading-snug text-white/95 sm:text-base">
                                                    {item}
                                                </span>
                                            </div>
                                            {/* Gradient Separator */}
                                            {index !== detailItems.length - 1 && (
                                                <div className="mx-auto h-[1px] w-3/4 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {detailsNote ? (
                                <p className="mt-6 text-xs text-white/50 italic">
                                    * {detailsNote}
                                </p>
                            ) : null}
                        </div>
                    </motion.div>

                    {/* Item 3: Incluidos - Green Gradient */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="group relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-[#079153]/90 via-[#0c7244]/90 to-[#0c5d3a]/90 p-8 text-white shadow-xl transition-all hover:shadow-2xl md:col-span-2 order-3 flex flex-col text-center items-center backdrop-blur-sm"
                    >
                        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:250%_250%] animate-shine" />

                        <h3 className="relative z-10 font-averox text-lg font-bold uppercase tracking-[0.15em] text-white mb-4 sm:text-xl sm:tracking-[0.2em] sm:mb-6">
                            {includedTitle}
                        </h3>
                        <ul className="relative z-10 flex flex-col w-full items-center flex-1 overflow-y-auto scrollbar-hide">
                            {includedItems.map((item, index) => (
                                <li key={`inc-${index}`} className="flex flex-col w-full items-center max-w-[22rem]">
                                    <div className="flex w-full items-center justify-center gap-3 py-3 text-[0.875rem] font-normal text-white">
                                        <CheckCircle2 className="h-4 w-4 text-[#2ef8a0] shrink-0" />
                                        <span>{item}</span>
                                    </div>
                                    {/* Gradient Separator */}
                                    {index !== includedItems.length - 1 && (
                                        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                                    )}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </div >
        </section >
    );
}
