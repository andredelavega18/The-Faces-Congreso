import { MapPin } from 'lucide-react';


interface VenueSectionProps {
    content: {
        title?: string;
        address?: string;
        mapUrl?: string;
        description?: string;
        imageDesktop?: string;
        imageMobile?: string;
    };
}

export function VenueSection({ content }: VenueSectionProps) {
    const {
        address = 'The Westin Lima Hotel & Convention Center',
        mapUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.29855393425!2d-77.0247784!3d-12.091702099999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c865a8d3d26d%3A0xf87e112951b3169c!2sThe%20Westin%20Lima%20Hotel%20%26%20Convention%20Center!5e0!3m2!1ses-419!2spe!4v1768966286339!5m2!1ses-419!2spe',
        description = '',
        imageDesktop = '',
    } = content;

    const title = content.title || 'UBICACIÓN';
    const resolvedMapUrl =
        mapUrl?.trim() ||
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.29855393425!2d-77.0247784!3d-12.091702099999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c865a8d3d26d%3A0xf87e112951b3169c!2sThe%20Westin%20Lima%20Hotel%20%26%20Convention%20Center!5e0!3m2!1ses-419!2spe!4v1768966286339!5m2!1ses-419!2spe';

    return (
        <section id="venue" className="relative bg-slate-50 py-14">
            <div className="mb-16 text-center max-w-3xl mx-auto px-6 sm:px-10">
                <h2 className="font-averox text-4xl font-bold md:text-5xl mb-6">
                    <span className="text-gradient">{title}</span>
                </h2>
                {address && <p className="text-lg text-slate-600 leading-relaxed">{address}</p>}
            </div>

            <div className="mx-auto mt-10 w-full max-w-[1280px] px-6 sm:px-10">
                <div className="relative h-[380px] w-full overflow-hidden rounded-[28px] border border-white/80 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.12)] sm:h-[460px]">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_20%_10%,rgba(255,255,255,0.9),rgba(255,255,255,0)_60%)]" />
                    {resolvedMapUrl && resolvedMapUrl.includes('google.com/maps') ? (
                        <iframe
                            src={resolvedMapUrl}
                            title="Mapa de ubicación del evento"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="absolute inset-0"
                        />
                    ) : imageDesktop ? (
                        <img
                            src={imageDesktop}
                            alt={title}
                            className="h-full w-full object-cover"
                            loading="lazy"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center">
                            <MapPin className="h-16 w-16 text-slate-500" />
                        </div>
                    )}
                </div>
            </div>

            {description ? (
                <div className="px-6 py-10 text-center sm:px-10">
                    <p className="mx-auto max-w-3xl text-neutral-600">{description}</p>
                </div>
            ) : null}

        </section>
    );
}

