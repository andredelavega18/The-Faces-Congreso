import { HeroBanner, FooterSection } from '@/components/sections';
import { ClaimsForm } from '@/components/claims/ClaimsForm';

export default function LibroDeReclamacionesPage() {
    return (
        <>
            <HeroBanner
                title="Libro de Reclamaciones"
                showMeta={false}
                showCta={false}
                minHeightClass="min-h-[400px]"
            />
            <main className="min-h-screen bg-background">
                <div className="mx-auto max-w-4xl px-6 py-12 sm:px-10">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-secondary">
                        Libro de Reclamaciones Virtual
                    </p>
                    <p className="mt-4 text-base text-neutral-600 sm:text-lg">
                        En cumplimiento de lo dispuesto por el Codigo de Proteccion y Defensa del Consumidor - Ley N.° 29571, este establecimiento pone a disposicion del consumidor su Libro de Reclamaciones Virtual.
                    </p>

                    <div className="mt-10 grid gap-6">
                        <div className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:grid-cols-2">
                            <div className="space-y-2 text-sm text-neutral-700">
                                <h2 className="text-lg font-semibold text-neutral-900">Datos del Proveedor / Organizador</h2>
                                <p><span className="font-semibold">Razon Social:</span> CENTRO DE ESTUDIOS Y CAPACITACIONES EN SALUD S.A.C.</p>
                                <p><span className="font-semibold">RUC:</span> 20610559167</p>
                                <p><span className="font-semibold">Domicilio fiscal:</span> JR. BOLOGNESI NRO. 763, MAGDALENA DEL MAR, LIMA, LIMA - PERU</p>
                                <p><span className="font-semibold">Correo de atencion:</span> thefacescongreso@gmail.com</p>
                                <p><span className="font-semibold">Telefono de atencion:</span> +51 958 113 344</p>
                                <p><span className="font-semibold">Evento:</span> THE FACES MASTER INYECTOR 2026</p>
                                <p><span className="font-semibold">Modalidades:</span> Presencial y Virtual</p>
                            </div>

                            <div className="space-y-4 text-sm text-neutral-700">
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                    La respuesta sera brindada en un plazo maximo de 30 dias calendario.
                                </div>
                                <div className="space-y-2">
                                    <p>La presentacion del reclamo o queja es gratuita.</p>
                                    <p>Los datos personales proporcionados seran tratados conforme a la Ley N.° 29733 - Ley de Proteccion de Datos Personales.</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:grid-cols-2">
                            <div className="space-y-2 text-sm text-neutral-700">
                                <h2 className="text-lg font-semibold text-neutral-900">Definiciones</h2>
                                <p><span className="font-semibold">Reclamo:</span> Disconformidad relacionada directamente con el servicio contratado.</p>
                                <p><span className="font-semibold">Queja:</span> Malestar o descontento no relacionado directamente con el servicio.</p>
                            </div>
                            <div className="space-y-2 text-sm text-neutral-700">
                                <h2 className="text-lg font-semibold text-neutral-900">Aviso importante</h2>
                                <p>El proveedor brindara respuesta al reclamo en un plazo maximo de 30 dias calendario.</p>
                                <p>Completa el formulario a continuacion para registrar tu solicitud.</p>
                            </div>
                        </div>
                    </div>

                    <ClaimsForm />
                </div>
            </main>
            <FooterSection
                content={{}}
            />
        </>
    );
}
