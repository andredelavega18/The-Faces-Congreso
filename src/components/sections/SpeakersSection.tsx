'use client';

import { useState, useEffect } from 'react';

interface Speaker {
    id: string;
    name: string;
    title: string | null;
    country: string | null;
    countryFlag: string | null;
    description: string | null;
    imageUrl: string | null;
    mainImageUrl: string | null;
}

interface SpeakersSectionProps {
    content: {
        title?: string;
        subtitle?: string;
    };
    speakers: Speaker[];
}

// Fallback map for countries if flag is missing in DB
// Map for normalized country names to ISO 2-letter codes
const COUNTRY_CODES: Record<string, string> = {
    'Argentina': 'AR',
    'Bolivia': 'BO',
    'Brasil': 'BR',
    'Brazil': 'BR',
    'Chile': 'CL',
    'Colombia': 'CO',
    'Ecuador': 'EC',
    'España': 'ES',
    'Spain': 'ES',
    'Francia': 'FR',
    'France': 'FR',
    'México': 'MX',
    'Mexico': 'MX',
    'Paraguay': 'PY',
    'Perú': 'PE',
    'Peru': 'PE',
    'Uruguay': 'UY',
    'Venezuela': 'VE',
    'Estados Unidos': 'US',
    'United States': 'US',
    'USA': 'US',
    'Canadá': 'CA',
    'Canada': 'CA',
    'Alemania': 'DE',
    'Germany': 'DE',
    'Italia': 'IT',
    'Italy': 'IT',
    'Reino Unido': 'GB',
    'United Kingdom': 'GB',
    'UK': 'GB',
    'Corea del Sur': 'KR',
    'Corea': 'KR',
    'Korea': 'KR',
    'South Korea': 'KR',
    'Emiratos Árabes Unidos': 'AE',
    'United Arab Emirates': 'AE',
    'Dubai': 'AE',
};

function getCountryCode(country: string | null, savedFlag: string | null): string | null {
    // 1. If we have a saved code (2 letters), use it.
    if (savedFlag && /^[A-Za-z]{2}$/.test(savedFlag)) {
        return savedFlag.toUpperCase();
    }

    if (!country) return null;

    // 2. Try direct match in our map
    if (COUNTRY_CODES[country]) return COUNTRY_CODES[country];

    // 3. Try normalized match (remove accents)
    const normalized = country.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (COUNTRY_CODES[normalized]) return COUNTRY_CODES[normalized];

    // 4. Case-insensitive search
    const lower = country.toLowerCase();
    const foundKey = Object.keys(COUNTRY_CODES).find(k => k.toLowerCase() === lower);
    if (foundKey) return COUNTRY_CODES[foundKey] || null;

    return null;
}


function getDisplayCountry(country: string | null | undefined): string | null {
    if (!country) return null;
    const lower = country.toLowerCase();

    // Override for Dubai/UAE
    if (['emiratos árabes unidos', 'united arab emirates', 'uae', 'ae', 'emiratos'].some(c => c === lower) || lower.includes('emiratos')) {
        return 'Dubai';
    }

    // Override for Korea
    if (['corea', 'korea', 'kr', 'south korea', 'corea del sur'].some(c => c === lower)) {
        return 'Corea del Sur';
    }

    return country;
}

export function SpeakersSection({ content, speakers }: SpeakersSectionProps) {
    const { subtitle = 'SPEAKERS THE FACES' } = content;
    const resolvedSubtitle = subtitle?.trim() ? subtitle : 'SPEAKERS THE FACES';

    // Speaker seleccionado (por defecto el primero)
    const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(true); // Default to mobile for SSR

    // Detect screen size for responsive effects
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // No reordering - usage direct from DB (sorted by displayOrder)
    // The central card logic (index 3) matches the user's expectation 
    // that the 4th item (1-based index 4, 0-based index 3) is center.
    const reorderedSpeakers = speakers;

    // Seleccionar el primer speaker por defecto
    useEffect(() => {
        if (reorderedSpeakers.length > 0 && !selectedSpeaker) {
            setSelectedSpeaker(reorderedSpeakers[0]!);
        }
    }, [reorderedSpeakers, selectedSpeaker]);

    // Cuando se hace hover, mostrar ese speaker temporalmente
    const displayedSpeaker = hoveredId
        ? reorderedSpeakers.find(s => s.id === hoveredId) || selectedSpeaker
        : selectedSpeaker;

    return (
        <section id="speakers" className="relative overflow-hidden py-12 sm:py-16 md:pb-[5.6rem] md:pt-0">
            {/* Fondo con gradiente de colores de marca */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(135deg, #e830ce 0%, #2323ff 50%, #2ef8a0 100%)',
                }}
            />

            {/* Overlay sutil */}
            <div className="absolute inset-0 bg-black/10" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
                {/* FILA SUPERIOR: Título | Imagen Grande | Detalles - proporcional a las cards */}
                {/* Use lg breakpoint for horizontal layout, md and below is stacked */}
                <div className="relative flex flex-col items-center gap-4 sm:gap-5 lg:flex-row lg:items-start lg:justify-center lg:gap-8">
                    {/* Izquierda: Título - ancho de 2 cards (272px) */}
                    <div className="flex w-full flex-col justify-start text-center pt-4 sm:pt-6 lg:pt-0 lg:mt-[5.5rem] lg:w-[272px] lg:flex-shrink-0 lg:text-left">
                        <p className="font-averox text-lg font-bold uppercase tracking-[0.08em] text-white sm:text-xl lg:text-3xl xl:text-4xl">
                            {resolvedSubtitle}
                        </p>
                        <p className="font-isidora text-xs font-semibold uppercase tracking-[0.45em] text-white/80 sm:text-sm lg:text-lg xl:text-xl">
                            2026
                        </p>
                    </div>

                    {/* Centro: Imagen grande */}
                    <div className="relative z-0 flex w-full flex-shrink-0 justify-center lg:w-[424px]">
                        {/* Mobile/Tablet: smaller, Desktop: fixed size */}
                        <div className="relative mt-2 -mb-6 h-[200px] w-full max-w-[180px] sm:mt-4 sm:-mb-10 sm:h-[260px] sm:max-w-[220px] lg:mt-[5.5rem] lg:-mb-24 lg:h-[500px] lg:max-w-[400px] overflow-hidden transition-all duration-500">
                            {(displayedSpeaker?.mainImageUrl || displayedSpeaker?.imageUrl) ? (
                                <img
                                    key={displayedSpeaker.id}
                                    src={displayedSpeaker.mainImageUrl || displayedSpeaker.imageUrl || ''}
                                    alt={displayedSpeaker.name || ''}
                                    className="h-full w-full object-cover object-top animate-fade-in-up"
                                    style={{
                                        animation: 'fadeInUp 0.4s ease-out',
                                        maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
                                        WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)'
                                    }}
                                    loading="lazy"
                                />
                            ) : (
                                // Minimal fallback without heavy gradients
                                <div className="flex h-full w-full items-center justify-center text-8xl font-semibold text-white/20">
                                    {getCountryCode(displayedSpeaker?.country || null, displayedSpeaker?.countryFlag || null) || displayedSpeaker?.name?.charAt(0) || '?'}
                                </div>
                            )}
                            {/* Removed bottom gradient overlay */}
                        </div>
                    </div>

                    {/* Derecha: Detalles - ancho de 2 cards (272px) */}
                    {/* Only show on lg+ screens */}
                    <div className="hidden lg:flex w-full flex-col justify-start space-y-3 text-center lg:mt-[5.5rem] lg:w-[272px] lg:flex-shrink-0 lg:text-left">
                        {/* Title - Glass card */}
                        {displayedSpeaker?.title && (
                            <div
                                className="rounded-full px-4 py-2 backdrop-blur-sm"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 100%)',
                                }}
                            >
                                <p className="text-base font-semibold text-white">
                                    {displayedSpeaker.title}
                                </p>
                            </div>
                        )}

                        {/* Country - Glass card con circulo para bandera */}
                        {displayedSpeaker?.country && (
                            <div
                                className="flex items-center gap-2 rounded-full px-2 py-1.5 backdrop-blur-sm"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 100%)',
                                }}
                            >
                                {/* Circulo para la bandera SVG */}
                                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/20">
                                    {(() => {
                                        const code = getCountryCode(displayedSpeaker.country, displayedSpeaker.countryFlag);
                                        return code ? (
                                            <img
                                                src={`/flags/${code.toLowerCase()}.png`}
                                                alt={displayedSpeaker.country}
                                                className="h-full w-full object-cover"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <span className="text-xs text-white/60">🌍</span>
                                        );
                                    })()}
                                </div>
                                <span className="text-sm font-medium text-white">{getDisplayCountry(displayedSpeaker.country)}</span>
                            </div>
                        )}

                        {/* Description - Glass card */}
                        {displayedSpeaker?.description && (
                            <div
                                className="rounded-2xl px-4 py-3 backdrop-blur-sm"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 100%)',
                                }}
                            >
                                <p className="text-xs leading-relaxed text-white/90">
                                    {displayedSpeaker.description}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile/Tablet: Selected Speaker Info - Show below lg */}
                {displayedSpeaker && (
                    <div className="flex flex-col items-center gap-1.5 pt-2 text-center lg:hidden">
                        <h3 className="font-averox text-sm font-bold text-white sm:text-base">
                            {displayedSpeaker.name}
                        </h3>
                        {displayedSpeaker.title && (
                            <p className="text-[10px] text-white/80 sm:text-xs">{displayedSpeaker.title}</p>
                        )}
                        {displayedSpeaker.country && (
                            <div className="flex items-center gap-1">
                                {(() => {
                                    const code = getCountryCode(displayedSpeaker.country, displayedSpeaker.countryFlag);
                                    return code ? (
                                        <img
                                            src={`/flags/${code.toLowerCase()}.png`}
                                            alt={displayedSpeaker.country}
                                            className="h-3 w-3 rounded-full object-cover sm:h-4 sm:w-4"
                                            loading="lazy"
                                        />
                                    ) : null;
                                })()}
                                <span className="text-[10px] text-white/70 sm:text-xs">{getDisplayCountry(displayedSpeaker.country)}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* FILA INFERIOR: Grid de speakers */}
                <div className="relative z-10 grid grid-cols-4 gap-1.5 pt-4 px-1 sm:grid-cols-7 sm:gap-2 sm:pt-5 lg:flex lg:flex-wrap lg:justify-center lg:gap-6 lg:pt-10 text-white">
                    {reorderedSpeakers.map((speaker, index) => {
                        const isHovered = hoveredId === speaker.id;
                        const isSelected = selectedSpeaker?.id === speaker.id;
                        const isAnyHovered = hoveredId !== null;

                        // El 4to índice (posición central) es el que no tiene skew
                        const isCentralCard = index === 3;

                        // Skew values
                        const getSkewValue = () => {
                            if (isCentralCard) return 0;
                            if (index < 3) return 3;
                            return -3;
                        };
                        const skewValue = getSkewValue();

                        // Calcular transform combinado - solo hover tiene zoom, no selected
                        // Only apply skew on desktop
                        const getTransform = () => {
                            if (isMobile) {
                                return isHovered ? 'scale(1.05)' : '';
                            }
                            const skew = `skewX(${skewValue}deg)`;
                            if (isHovered) {
                                return `${skew} scale(1.05)`;
                            }
                            if (!isHovered && isAnyHovered) {
                                return `${skew} scale(0.95)`;
                            }
                            return skew;
                        };

                        return (
                            <div
                                key={speaker.id}
                                className="group relative flex flex-col items-center"
                                onMouseEnter={() => setHoveredId(speaker.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                onClick={() => speaker && setSelectedSpeaker(speaker)}
                            >
                                {/* CAPA 1: Card exterior con skew */}
                                <div
                                    className={`relative inline-block w-[75px] sm:w-[90px] md:w-[110px] lg:w-[120px] cursor-pointer rounded-lg shadow-lg transition-all duration-500 ease-out
                                    ${isHovered ? 'z-20' : ''} 
                                    ${!isHovered && !isSelected && (isAnyHovered || selectedSpeaker) ? 'opacity-60 grayscale' : ''}
                                `}
                                    style={{
                                        transform: getTransform(),
                                    }}
                                    onMouseEnter={(e) => {
                                        const target = e.currentTarget;
                                        for (let i = 0; i < 10; i++) {
                                            const p = document.createElement("div");
                                            p.className = "absolute w-1 h-1 bg-primary rounded-full pointer-events-none z-50";
                                            const angle = Math.random() * Math.PI * 2;
                                            const distance = 50 + Math.random() * 20;

                                            p.style.left = `${50 + Math.cos(angle) * distance}%`;
                                            p.style.top = `${50 + Math.sin(angle) * distance}%`;

                                            target.appendChild(p);

                                            p.animate([
                                                { opacity: 1, transform: "scale(1)" },
                                                { opacity: 0, transform: "scale(0)" }
                                            ], { duration: 1000, fill: "forwards" }).onfinish = () => p.remove();
                                        }
                                    }}
                                >
                                    {/* CAPA 2: Contenedor con counter-skew para que la imagen esté recta */}
                                    <div
                                        className="relative overflow-hidden rounded-lg"
                                        style={{
                                            transform: `skewX(${-skewValue}deg)`,
                                        }}
                                    >
                                        {/* CAPA 3: Imagen recta */}
                                        {/* CAPA 3: Imagen recta */}
                                        {speaker.imageUrl ? (
                                            <img
                                                src={speaker.imageUrl}
                                                alt={speaker.name}
                                                className="aspect-[3/4] h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="flex aspect-[3/4] h-full w-full items-center justify-center bg-gradient-to-br from-primary/30 to-accent/30 text-4xl font-semibold text-white">
                                                {speaker.countryFlag || speaker.name?.charAt(0) || '?'}
                                            </div>
                                        )}

                                        {/* Degradado blanco en la parte inferior */}
                                        <div
                                            className="pointer-events-none absolute inset-0"
                                            style={{
                                                background: 'linear-gradient(to top, rgba(255,255,255,0.45) 0%, transparent 65%)',
                                            }}
                                        />

                                        {/* Glare Effect */}
                                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-tr from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
                                    </div>

                                    {/* Overlay con nombre (sigue el skew de la card) */}
                                    <div className="absolute inset-0 flex translate-y-2 flex-col items-center justify-end rounded-lg bg-gradient-to-t from-fuchsia-950/90 via-fuchsia-950/40 to-transparent p-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                        <h3 className="text-center text-sm font-bold tracking-wide text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                                            {speaker.name}
                                        </h3>
                                    </div>

                                    {/* Borde rosa en hover (sigue el skew) */}
                                    <div className="absolute inset-0 rounded-lg border-0 border-primary/70 opacity-0 transition-all duration-300 group-hover:border-2 group-hover:opacity-100" />

                                    {/* Línea decorativa abajo */}
                                    <div className="absolute -bottom-1 left-1/2 h-1 w-0 -translate-x-1/2 transform rounded-t-md bg-primary transition-all duration-300 group-hover:w-2/3" />

                                    {/* Corner Brackets (sigue el skew) */}
                                    <div className="pointer-events-none absolute inset-[-4px] z-30 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                        <div
                                            className="h-full w-full animate-pulse"
                                            style={{
                                                background: `
                                                linear-gradient(to right, #fff 4px, transparent 4px) left top / 25px 25px no-repeat,
                                                linear-gradient(#fff 4px, transparent 4px) left top / 25px 25px no-repeat,
                                                linear-gradient(to left, #fff 4px, transparent 4px) right top / 25px 25px no-repeat,
                                                linear-gradient(#fff 4px, transparent 4px) right top / 25px 25px no-repeat,
                                                linear-gradient(to right, #fff 4px, transparent 4px) left bottom / 25px 25px no-repeat,
                                                linear-gradient(to top, #fff 4px, transparent 4px) left bottom / 25px 25px no-repeat,
                                                linear-gradient(to left, #fff 4px, transparent 4px) right bottom / 25px 25px no-repeat,
                                                linear-gradient(to top, #fff 4px, transparent 4px) right bottom / 25px 25px no-repeat
                                            `,
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Mobile: Always visible name below card */}
                                <p className="mt-1.5 text-center text-[10px] leading-tight font-medium text-white/90 line-clamp-2 w-full sm:hidden">
                                    {speaker.name.split(' ').slice(0, 2).join(' ')}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
