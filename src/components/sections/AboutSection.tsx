

interface AboutSectionProps {
    content: {
        title?: string;
        description?: string;
        imageDesktop?: string;
        imageMobile?: string;
        imageTablet?: string;
        features?: string[];
    };
}

function parseParagraphs(input: string | undefined): string[] {
    if (!input) return [];
    return input
        .split(/\n\s*\n/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean);
}

export function AboutSection({ content }: AboutSectionProps) {
    const {
        title = 'QUIENES SOMOS',
        description = `El congreso internacional de medicina estética más influyente de Latinoamérica.

Un punto de encuentro para profesionales que buscan excelencia clínica, pensamiento crítico y liderazgo real en el sector estético.

The Faces 2026 reunirá a expertos nacionales e internacionales con trayectoria científica sólida para compartir contenido de vanguardia, análisis clínico, enfoques innovadores y casos aplicados que marcarán la agenda científica y de práctica clínica del continente.`,

    } = content;

    const paragraphs = parseParagraphs(description);

    return (
        <section
            id="about"
            className="relative py-16 px-4 sm:py-20 sm:px-6 md:py-24 md:px-8 bg-fixed bg-center bg-cover bg-neutral-950"
            style={{
                backgroundImage: "url('https://bcwkitzndcbwnxidmxbx.supabase.co/storage/v1/object/public/hero-images/1769493287587-Background_Quienes_Somos.webp')"
            }}
        >
            <div className="absolute inset-0 bg-black/85" />

            <div className="relative z-10 mx-auto max-w-5xl text-center">
                {/* Main Title (H2) */}
                <h2 className="font-averox text-2xl font-bold sm:text-3xl md:text-4xl lg:text-6xl mb-3 sm:mb-4 text-white drop-shadow-lg">
                    {title}
                </h2>

                {/* Subtitle with mixed fonts for numeric support */}
                <div className="font-averox text-xl md:text-2xl lg:text-3xl text-white/90 mb-6 sm:mb-8 md:mb-10 drop-shadow-md tracking-wider">
                    THE FACES <span className="font-sans font-bold">2026</span>
                </div>

                {paragraphs.length > 0 && (
                    <div className="space-y-4 text-base text-gray-200 leading-relaxed max-w-3xl mx-auto font-light sm:space-y-5 sm:text-lg md:space-y-6 md:text-xl">
                        {paragraphs.map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
