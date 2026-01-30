import { HeroBanner, FooterSection } from '@/components/sections';

export default function TerminosYCondicionesPage() {
    return (
        <>
            <HeroBanner
                title="Terminos y Condiciones"
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
                                <h2 className="text-lg font-semibold text-neutral-900">Identificacion del proveedor</h2>
                                <p className="mt-2 text-sm text-neutral-600">
                                    El presente sitio web es operado por CENTRO DE ESTUDIOS Y CAPACITACIONES EN SALUD S.A.C., identificado con RUC N.° 20610559167, con domicilio fiscal en JR. BOLOGNESI NRO. 763, MAGDALENA DEL MAR, LIMA, LIMA - PERU.
                                </p>
                                <p className="mt-2 text-sm text-neutral-600">
                                    Canales de atencion: Correo: thefacescongreso@gmail.com | Telefono: +51 958 113 344
                                </p>
                            </li>

                            <li className="pl-6 relative">
                                <span className="absolute left-0 top-0 text-base font-semibold text-neutral-900">2.</span>
                                <h2 className="text-lg font-semibold text-neutral-900">Objeto</h2>
                                <p className="mt-2 text-sm text-neutral-600">
                                    Los presentes Terminos y Condiciones regulan el acceso, uso y la compra de pases de acceso al evento THE FACES MASTER INYECTOR 2026, en sus modalidades presencial y virtual.
                                </p>
                            </li>

                            <li className="pl-6 relative">
                                <span className="absolute left-0 top-0 text-base font-semibold text-neutral-900">3.</span>
                                <h2 className="text-lg font-semibold text-neutral-900">Aceptacion</h2>
                                <p className="mt-2 text-sm text-neutral-600">
                                    La navegacion por el sitio web y/o la adquisicion de un pase implica la aceptacion expresa de estos Terminos y Condiciones.
                                </p>
                            </li>

                            <li className="pl-6 relative">
                                <span className="absolute left-0 top-0 text-base font-semibold text-neutral-900">4.</span>
                                <h2 className="text-lg font-semibold text-neutral-900">Naturaleza del servicio</h2>
                                <p className="mt-2 text-sm text-neutral-600">
                                    El pase adquirido constituye un derecho de acceso a un evento, no un producto fisico.
                                </p>
                            </li>

                            <li className="pl-6 relative">
                                <span className="absolute left-0 top-0 text-base font-semibold text-neutral-900">5.</span>
                                <h2 className="text-lg font-semibold text-neutral-900">Informacion del evento</h2>
                                <p className="mt-2 text-sm text-neutral-600">
                                    Evento: THE FACES MASTER INYECTOR 2026 | Modalidades: Presencial y Virtual | Fechas: 5 y 6 de junio de 2026 | Lugar (presencial): Convention Center - Hotel Westin, Lima - Peru | Plataforma (virtual): Plataforma oficial del evento.
                                </p>
                                <p className="mt-2 text-sm text-neutral-600">
                                    El organizador podra realizar ajustes razonables en la programacion (ponentes, horarios u orden) sin alterar la naturaleza del servicio contratado.
                                </p>
                            </li>

                            <li className="pl-6 relative">
                                <span className="absolute left-0 top-0 text-base font-semibold text-neutral-900">6.</span>
                                <h2 className="text-lg font-semibold text-neutral-900">Compra y confirmacion</h2>
                                <p className="mt-2 text-sm text-neutral-600">
                                    La compra se considerara confirmada una vez aprobado el pago por la pasarela correspondiente y enviada la confirmacion al correo del usuario.
                                </p>
                                <p className="mt-2 text-sm text-neutral-600">
                                    El usuario es responsable de ingresar correctamente sus datos personales.
                                </p>
                            </li>

                            <li className="pl-6 relative">
                                <span className="absolute left-0 top-0 text-base font-semibold text-neutral-900">7.</span>
                                <h2 className="text-lg font-semibold text-neutral-900">Acceso y uso del pase</h2>
                                <p className="mt-2 text-sm text-neutral-600">
                                    Modalidad presencial: Se podra solicitar documento de identidad para validar el ingreso. El pase es personal e intransferible, salvo indicacion expresa.
                                </p>
                                <p className="mt-2 text-sm text-neutral-600">
                                    Modalidad virtual: El acceso es individual y no compartible. El organizador podra restringir accesos indebidos.
                                </p>
                            </li>

                            <li className="pl-6 relative">
                                <span className="absolute left-0 top-0 text-base font-semibold text-neutral-900">8.</span>
                                <h2 className="text-lg font-semibold text-neutral-900">Conducta durante el evento</h2>
                                <p className="mt-2 text-sm text-neutral-600">
                                    El organizador podra restringir el acceso a quienes afecten el normal desarrollo del evento, sin derecho a compensacion o reembolso.
                                </p>
                            </li>

                            <li className="pl-6 relative">
                                <span className="absolute left-0 top-0 text-base font-semibold text-neutral-900">9.</span>
                                <h2 className="text-lg font-semibold text-neutral-900">Responsabilidad</h2>
                                <p className="mt-2 text-sm text-neutral-600">
                                    El organizador no sera responsable por fallas de conectividad del usuario ni por causas de fuerza mayor o caso fortuito.
                                </p>
                            </li>

                            <li className="pl-6 relative">
                                <span className="absolute left-0 top-0 text-base font-semibold text-neutral-900">10.</span>
                                <h2 className="text-lg font-semibold text-neutral-900">Propiedad intelectual</h2>
                                <p className="mt-2 text-sm text-neutral-600">
                                    Todo el contenido del evento y del sitio web es propiedad de CENTRO DE ESTUDIOS Y CAPACITACIONES EN SALUD S.A.C., quedando prohibida su reproduccion sin autorizacion.
                                </p>
                            </li>

                            <li className="pl-6 relative">
                                <span className="absolute left-0 top-0 text-base font-semibold text-neutral-900">11.</span>
                                <h2 className="text-lg font-semibold text-neutral-900">Libro de Reclamaciones</h2>
                                <p className="mt-2 text-sm text-neutral-600">
                                    El consumidor cuenta con un Libro de Reclamaciones Virtual disponible en este sitio web.
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
