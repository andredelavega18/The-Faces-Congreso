interface FloatingActionsProps {
    whatsapp?: string;
}

export function FloatingActions({ whatsapp }: FloatingActionsProps) {
    const normalizedWhatsapp = whatsapp ? whatsapp.replace(/[^0-9]/g, '') : '';
    const whatsappMessage = encodeURIComponent(
        'Hola, quisiera mas informacion sobre THE FACES MASTER INYECTOR 2026.'
    );
    const whatsappLink = normalizedWhatsapp
        ? `https://wa.me/${normalizedWhatsapp}?text=${whatsappMessage}`
        : '#contact';

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3">
            <a
                href="#tickets"
                className="rounded-full bg-primary px-6 py-4 text-base font-semibold text-white shadow-lg shadow-primary/30 transition hover:translate-y-[-1px] hover:bg-primary/90"
            >
                Inscribete ahora
            </a>
            <div className="group relative flex justify-end">
                <a
                    href={whatsappLink}
                    target={whatsapp ? '_blank' : undefined}
                    rel={whatsapp ? 'noreferrer' : undefined}
                    aria-label="WhatsApp"
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/40 transition hover:translate-y-[-1px] hover:bg-[#1fba57]"
                >
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 fill-current">
                        <path d="M20.52 3.48A11.8 11.8 0 0 0 12.01 0C5.38 0 .02 5.36 0 11.98c0 2.11.55 4.18 1.6 6.02L0 24l6.17-1.62a12.01 12.01 0 0 0 5.84 1.49h.01c6.62 0 11.99-5.36 12.01-11.98a11.82 11.82 0 0 0-3.51-8.41ZM12.02 21.5h-.01a9.5 9.5 0 0 1-4.85-1.33l-.35-.21-3.66.96.98-3.56-.23-.37A9.5 9.5 0 0 1 2.5 12c.02-5.23 4.28-9.48 9.52-9.48a9.48 9.48 0 0 1 6.72 2.78A9.42 9.42 0 0 1 21.5 12c-.02 5.24-4.28 9.5-9.48 9.5Zm5.2-7.12c-.29-.14-1.7-.84-1.96-.94-.26-.1-.45-.14-.64.15-.2.29-.74.94-.9 1.13-.17.2-.33.22-.62.08-.29-.14-1.2-.44-2.28-1.41-.84-.75-1.4-1.69-1.57-1.98-.16-.29-.02-.45.12-.6.13-.13.29-.33.43-.5.14-.17.2-.29.3-.48.1-.2.05-.36-.02-.5-.08-.14-.64-1.55-.88-2.12-.23-.56-.46-.48-.64-.49h-.55c-.19 0-.5.07-.76.36-.26.29-1 1-1 2.42 0 1.42 1.03 2.79 1.17 2.98.14.19 2.04 3.12 4.94 4.38.69.3 1.23.48 1.65.62.69.22 1.32.19 1.82.12.55-.08 1.7-.69 1.94-1.35.24-.66.24-1.22.17-1.35-.07-.13-.26-.2-.55-.34Z" />
                    </svg>
                </a>
                <span className="pointer-events-none absolute right-14 top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-lg shadow-black/10 group-hover:block">
                    Tienes dudas?
                </span>
            </div>
        </div>
    );
}
