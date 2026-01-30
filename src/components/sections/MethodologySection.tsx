'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Mic2, Activity, Star, FlaskConical, Store, MonitorPlay } from 'lucide-react';

function parseParagraphs(input: unknown): string[] {
    if (!input) return [];

    if (Array.isArray(input)) {
        return input.map((item) => String(item)).filter(Boolean);
    }

    if (typeof input === 'string') {
        const trimmed = input.trim();
        if (!trimmed) return [];
        return trimmed
            .split(/\n\s*\n/)
            .map((paragraph) => paragraph.trim())
            .filter(Boolean);
    }

    return [];
}

function parseLines(input: unknown): string[] {
    if (!input) return [];

    if (Array.isArray(input)) {
        return input.map((item) => String(item)).filter(Boolean);
    }

    if (typeof input === 'string') {
        const trimmed = input.trim();
        if (!trimmed) return [];
        return trimmed
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean);
    }

    return [];
}

type MethodItem = {
    title: string;
    description: string;
};

function parseItems(input: unknown): MethodItem[] {
    if (!input) return [];

    const lines = Array.isArray(input)
        ? input.map((item) => String(item))
        : typeof input === 'string'
            ? input.split('\n')
            : [];

    return lines
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
            const parts = line.split('|').map((part) => part.trim());
            if (parts.length === 1) {
                return { title: parts[0] || '', description: '' };
            }
            const [title, ...rest] = parts;
            return { title: title || '', description: rest.join(' | ').trim() };
        })
        .filter((item): item is MethodItem => !!item.title);
}

interface MethodologySectionProps {
    content: {
        title?: string;
        subtitle?: string;
        description?: string;
        highlights?: unknown;
        items?: unknown;
        closing?: string;
        signatureName?: string;
        signatureRole?: string;
    };
}

export function MethodologySection({ content }: MethodologySectionProps) {
    const {
        title = 'METODOLOGIA THE FACES',
        subtitle = 'En The Faces 2026 el conocimiento no solo se expone: se demuestra en vivo.',
        description = `Nuestro congreso combina formacion academica de alto nivel, demostraciones clinicas reales y experiencias exclusivas, creando un entorno unico donde los medicos aprenden directamente de los referentes internacionales de la medicina estetica.`,
        items = `Conferencias magistrales | Accede a ponencias dictadas por speakers internacionales de primer nivel, donde se desarrollan los fundamentos cientificos, la anatomia aplicada y los protocolos mas actuales en medicina estetica avanzada, siempre con un enfoque en seguridad, criterio medico y resultados naturales.
Live Demos con pacientes reales | Observa procedimientos en vivo realizados sobre pacientes reales, donde los expertos muestran tecnicas avanzadas de inyectables paso a paso, explicando cada decision clinica en tiempo real. Aprende como trabajan los lideres del sector exactamente como en el consultorio.
Workshops VIP | Vive una experiencia premium en grupos reducidos, con acceso directo a los principales speakers del evento. Demostraciones en vivo, interaccion personalizada y analisis profundo de tecnicas avanzadas para quienes buscan un aprendizaje mas exclusivo y especializado.
Workshops de laboratorios | Conoce de primera mano las ultimas innovaciones, productos y tecnologias de los laboratorios lideres en medicina estetica, con demostraciones practicas y protocolos de aplicacion clinica.
Feria comercial | Explora una feria comercial de alto nivel donde podras interactuar con marcas, distribuidores y aliados estrategicos, descubrir novedades del sector y generar oportunidades profesionales.
Modalidad online - Transmision en vivo | Si no puedes asistir de forma presencial, accede a The Faces 2026 en modalidad online, con transmision en vivo de las principales conferencias y demostraciones seleccionadas, manteniendo una experiencia formativa de alto impacto desde cualquier lugar.`,
        highlights = '',
    } = content;

    const paragraphs = parseParagraphs(description);
    const highlightItems = parseLines(highlights);
    const methodItems = parseItems(items);

    // Scroll Animation Logic
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Line fill animation: height fills as we scroll
    const lineHeight = useTransform(scrollYProgress, [0.1, 0.9], ["0%", "100%"]);

    return (
        <section id="methodology" className="relative overflow-hidden px-4 py-12 sm:px-6 sm:py-16 md:px-10 md:py-20" ref={containerRef} style={{ position: 'relative' }}>
            {/* Background: Gradient matching SpeakersSection */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(135deg, #e830ce 0%, #2323ff 50%, #2ef8a0 100%)',
                }}
            />
            {/* Modern Glass Overlay */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

            <div className="relative mx-auto max-w-7xl">
                <div className="text-center relative z-10 mb-10 sm:mb-16 md:mb-20">
                    <h2 className="font-averox text-2xl font-bold uppercase tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl mb-4 sm:mb-6 drop-shadow-lg">
                        {title}
                    </h2>
                    <p className="mx-auto mt-3 max-w-3xl text-base text-white/90 leading-relaxed font-medium drop-shadow-md sm:mt-4 sm:text-lg">
                        {subtitle}
                    </p>
                    <div className="mx-auto mt-4 max-w-4xl text-sm text-white/80 leading-relaxed font-light sm:mt-6 sm:text-base">
                        {paragraphs.map((paragraph, index) => (
                            <p key={index} className="mb-4 last:mb-0">
                                {paragraph}
                            </p>
                        ))}
                    </div>
                </div>

                {methodItems.length > 0 && (
                    <div className="relative mx-auto">

                        {/* Central Timeline Container */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 hidden md:block bg-gradient-to-b from-transparent via-white/20 to-transparent rounded-full">
                            {/* Animated Inner Line */}
                            <motion.div
                                style={{ height: lineHeight }}
                                className="w-full bg-gradient-to-b from-transparent via-white to-transparent shadow-[0_0_15px_rgba(255,255,255,0.8)] origin-top"
                            />
                        </div>

                        <div className="flex flex-col gap-6 sm:gap-8 md:gap-0 relative z-10">
                            {methodItems.map((item, index) => {
                                const icons = [Mic2, Activity, Star, FlaskConical, Store, MonitorPlay];
                                const Icon = icons[index % icons.length] as React.ElementType;
                                const isRight = index % 2 !== 0;

                                return (
                                    <div key={`${item.title}-${index}`} className={`flex w-full ${isRight ? 'md:justify-end' : 'md:justify-start'} justify-center relative last:pb-24`}>

                                        {/* Timeline Dot (Centered on Line) */}
                                        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center z-20">
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                whileInView={{ scale: 1 }}
                                                viewport={{ once: true }}
                                                className="h-5 w-5 rounded-full bg-white border-[3px] border-[#2323ff] shadow-[0_0_15px_rgba(255,255,255,0.6)]"
                                            >
                                            </motion.div>
                                        </div>

                                        <motion.div
                                            initial={{ opacity: 0, y: 20, x: 0 }}
                                            whileInView={{ opacity: 1, y: 0, x: 0 }}
                                            viewport={{ once: true, margin: "-50px" }}
                                            transition={{ duration: 0.5, delay: 0.1 }}
                                            className="relative w-full max-w-[500px] md:max-w-[calc(50%-40px)] rounded-2xl sm:rounded-[2rem] border border-white/20 bg-white/10 p-5 sm:p-6 md:p-8 shadow-xl backdrop-blur-md hover:bg-white/15 hover:border-white/30 transition-all duration-300"
                                        >
                                            {/* Header: Icon + Title */}
                                            <div className="mb-4 flex items-center gap-3 sm:mb-6 sm:gap-5">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white shadow-inner border border-white/20 sm:h-12 sm:w-12 sm:rounded-2xl">
                                                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                                                </div>
                                                <h3 className="font-bold text-base uppercase tracking-tight text-white leading-tight drop-shadow-md sm:text-lg md:text-xl">
                                                    {item.title}
                                                </h3>
                                            </div>

                                            <div className="w-full h-[1px] bg-white/10 mb-4 sm:mb-6" />

                                            <p className="text-sm leading-relaxed text-white/80 font-light sm:text-[0.95rem]">
                                                {item.description}
                                            </p>
                                        </motion.div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {highlightItems.length > 0 && (
                    <div className="mt-24 mx-auto w-full max-w-3xl rounded-3xl border border-white/20 bg-white/5 p-10 shadow-2xl backdrop-blur-md text-center">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-8 drop-shadow-md">
                            Que puedes esperar
                        </h3>
                        <div className="grid sm:grid-cols-2 gap-4 text-left">
                            {highlightItems.map((item) => (
                                <div key={item} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
                                    <span className="mt-2 h-2 w-2 rounded-full bg-[#2ef8a0] shrink-0 shadow-[0_0_10px_#2ef8a0]" />
                                    <span className="text-white/90 font-medium">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
