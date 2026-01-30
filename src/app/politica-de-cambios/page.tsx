import { HeroBanner, FooterSection } from '@/components/sections';

export default function PoliticaDeCambiosPage() {
    return (
        <>
            <HeroBanner
                title="Politica de Cambios, Reprogramacion y Cancelacion"
                showMeta={false}
                showCta={false}
                minHeightClass="min-h-[400px]"
            />
            <main className="min-h-screen bg-background">
                <div className="mx-auto max-w-4xl px-6 py-12 font-isidora text-base leading-relaxed text-neutral-800 sm:px-10">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-secondary">
                        THE FACES MASTER INYECTOR 2026
                    </p>

                    <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                        <ol className="space-y-6 text-sm text-neutral-700">
                            <li className="pl-6 relative">
                                <span className="absolute left-0 top-0 text-base font-semibold text-neutral-900">1.</span>
                                <h2 className="text-lg font-semibold text-neutral-900">No hay devoluciones por desistimiento</h2>
                                <p className="mt-2 text-sm text-neutral-600">
                                    Una vez adquirido el pase, no se aceptan devoluciones ni reembolsos por decision del comprador, al tratarse de un servicio con fecha determinada.
                                </p>
                            </li>

                            <li className="pl-6 relative">
                                <span className="absolute left-0 top-0 text-base font-semibold text-neutral-900">2.</span>
                                <h2 className="text-lg font-semibold text-neutral-900">Cambio de titularidad</h2>
                                <p className="mt-2 text-sm text-neutral-600">
                                    El cambio de titular del pase podra solicitarse hasta 7 dias calendario antes del evento, escribiendo al correo thefacescongreso@gmail.com.
                                </p>
                                <p className="mt-2 text-sm text-neutral-600">
                                    El cambio de titularidad no genera reembolso ni devolucion alguna.
                                </p>
                            </li>

                            <li className="pl-6 relative">
                                <span className="absolute left-0 top-0 text-base font-semibold text-neutral-900">3.</span>
                                <h2 className="text-lg font-semibold text-neutral-900">Cambio de modalidad (presencial ↔ virtual)</h2>
                                <p className="mt-2 text-sm text-neutral-600">
                                    El cambio de modalidad podra solicitarse hasta 7 dias calendario antes del evento, sujeto a disponibilidad y validacion por parte del organizador.
                                </p>
                                <p className="mt-2 text-sm text-neutral-600">
                                    El cambio de modalidad no genera reembolso, devolucion ni compensacion economica, incluso si existiera diferencia de precio entre modalidades.
                                </p>
                            </li>

                            <li className="pl-6 relative">
                                <span className="absolute left-0 top-0 text-base font-semibold text-neutral-900">4.</span>
                                <h2 className="text-lg font-semibold text-neutral-900">Reprogramacion del evento</h2>
                                <p className="mt-2 text-sm text-neutral-600">
                                    En caso de reprogramacion del evento, el pase adquirido seguira siendo valido para la nueva fecha establecida, sin derecho a reembolso.
                                </p>
                            </li>

                            <li className="pl-6 relative">
                                <span className="absolute left-0 top-0 text-base font-semibold text-neutral-900">5.</span>
                                <h2 className="text-lg font-semibold text-neutral-900">Cancelacion definitiva del evento</h2>
                                <p className="mt-2 text-sm text-neutral-600">
                                    En caso de cancelacion definitiva del evento por causas de fuerza mayor o caso fortuito, ajenas al control del organizador, no se efectuara reembolso del monto pagado.
                                </p>
                                <p className="mt-2 text-sm text-neutral-600">
                                    En dichos supuestos, el organizador ofrecera al consumidor, a su criterio: la reprogramacion del evento, o el uso del pase para una edicion futura de THE FACES MASTER INYECTOR, en condiciones equivalentes.
                                </p>
                                <p className="mt-2 text-sm text-neutral-600">
                                    La aceptacion de cualquiera de estas alternativas sustituye cualquier derecho a reembolso.
                                </p>
                            </li>

                            <li className="pl-6 relative">
                                <span className="absolute left-0 top-0 text-base font-semibold text-neutral-900">6.</span>
                                <h2 className="text-lg font-semibold text-neutral-900">Contacto</h2>
                                <p className="mt-2 text-sm text-neutral-600">
                                    Correo: thefacescongreso@gmail.com | Telefono: +51 958 113 344
                                </p>
                            </li>
                        </ol>
                    </div>
                </div>
            </main>
            <FooterSection
                content={{}}
            />
        </>
    );
}
