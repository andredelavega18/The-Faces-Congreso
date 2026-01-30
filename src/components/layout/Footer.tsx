interface FooterSectionProps {
    content: {
        title?: string;
        email?: string;
        phone?: string;
        whatsapp?: string;
        organization?: string;
        address?: string;
        claimsUrl?: string;
        termsUrl?: string;
        changesUrl?: string;
        facebookUrl?: string;
        instagramUrl?: string;
        tiktokUrl?: string;
        ctaUrl?: string;
    };

}

export function Footer({ content }: FooterSectionProps) {
    const {
        claimsUrl = '/libro-de-reclamaciones',
        termsUrl = '/terminos-y-condiciones',
        changesUrl = '/politica-de-cambios',
    } = content;


    return (
        <footer className="border-t border-slate-200 bg-white">
            <div className="mx-auto max-w-7xl px-6 pb-8 pt-12 sm:px-10">
                <div className="grid gap-10 lg:grid-cols-3 justify-items-center text-center">
                    <div className="flex flex-col items-center">
                        <p className="text-xs font-extrabold tracking-[0.3em] text-gradient">THE FACES MASTER</p>
                        <div className="mt-3 flex items-baseline gap-2">
                            <p className="text-2xl font-light uppercase tracking-[0.2em] text-secondary">
                                INYECTOR
                            </p>
                            <span className="text-sm font-semibold text-neutral-600">2026</span>
                        </div>
                        <p className="mt-4 text-sm text-neutral-600">Master Inyector Congress</p>
                    </div>

                    <div className="flex flex-col items-center">
                        <p className="text-sm font-semibold text-neutral-700">Políticas</p>
                        <div className="mt-3 space-y-2 text-sm text-neutral-600 flex flex-col items-center">
                            <a href={claimsUrl} className="block w-fit rounded-lg px-2 py-1 hover:bg-primary/5 hover:text-primary">
                                Libro de Reclamaciones
                            </a>
                            <a href={termsUrl} className="block w-fit rounded-lg px-2 py-1 hover:bg-primary/5 hover:text-primary">
                                Terminos y Condiciones
                            </a>
                            <a href={changesUrl} className="block w-fit rounded-lg px-2 py-1 hover:bg-primary/5 hover:text-primary">
                                Politica de Cambios
                            </a>
                        </div>
                    </div>

                    <div className="flex flex-col items-center">
                        <p className="text-sm font-semibold text-neutral-700">Metodos de pago</p>
                        <div className="mt-3 flex flex-wrap gap-4 items-center justify-center">
                            <img src="/icons/icon-visa.svg" alt="Visa" className="h-10 w-auto" loading="lazy" />
                            <img src="/icons/icon-mastercard.svg" alt="Mastercard" className="h-8 w-auto" loading="lazy" />
                            <img src="/icons/icon-american-express.svg" alt="American Express" className="h-10 w-auto" loading="lazy" />
                            <img src="/icons/icon-diners.svg" alt="Diners Club" className="h-10 w-auto" loading="lazy" />
                        </div>
                    </div>
                </div>


                <div className="mt-8 border-t border-slate-200 pt-6 flex flex-col md:flex-row justify-center items-center gap-4 text-xs text-neutral-600">
                    <p>© 2026 The Faces. Todos los derechos reservados.</p>
                    <span className="hidden md:block text-slate-300">|</span>
                    <p>Desarrollado por Acrovtech</p>
                </div>
            </div>
        </footer>
    );
}
