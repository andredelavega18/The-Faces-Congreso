'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const formSchema = z.object({
    consumerName: z.string().min(3, 'Ingresa tus nombres y apellidos'),
    documentType: z.enum(['DNI', 'CE', 'PASAPORTE']),
    documentNumber: z.string().min(5, 'Ingresa tu documento').regex(/^[0-9]+$/, 'Solo numeros'),
    email: z.string().email('Email invalido'),
    phone: z.string().min(6, 'Ingresa tu telefono'),
    address: z.string().min(3, 'Ingresa tu direccion'),
    requestType: z.enum(['RECLAMO', 'QUEJA']),
    serviceType: z.enum(['PRESENCIAL', 'VIRTUAL']),
    orderNumber: z.string().optional(),
    incidentDate: z.string().min(1, 'Selecciona una fecha'),
    claimedAmount: z.string().optional(),
    description: z.string().min(10, 'Describe el hecho'),
    requestDetail: z.string().min(10, 'Indica tu pedido concreto'),
    acceptPrivacy: z.boolean().refine((val) => val === true, {
        message: 'Debes aceptar la politica de datos',
    }),
});

type FormValues = z.infer<typeof formSchema>;

export function ClaimsForm() {
    const [submitting, setSubmitting] = useState(false);
    const [resultCode, setResultCode] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const maxDate = useMemo(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    }, []);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            documentType: 'DNI',
            requestType: 'RECLAMO',
            serviceType: 'PRESENCIAL',
            acceptPrivacy: false,
        },
    });

    async function onSubmit(values: FormValues) {
        setSubmitting(true);
        setError(null);
        setResultCode(null);

        const claimedAmountNumber = values.claimedAmount
            ? Number(values.claimedAmount)
            : undefined;

        const payload = {
            ...values,
            claimedAmount: claimedAmountNumber,
        };

        try {
            const res = await fetch('/api/reclamos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data?.error || 'Error al enviar el reclamo');
            }
            setResultCode(data.claimCode);
            form.reset({
                documentType: 'DNI',
                requestType: 'RECLAMO',
                serviceType: 'PRESENCIAL',
                acceptPrivacy: false,
            });
        } catch (err: any) {
            setError(err.message || 'Error al enviar el reclamo');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 font-isidora text-base leading-relaxed text-neutral-800">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="space-y-10">
                    <div>
                        <h2 className="text-lg font-semibold text-neutral-900">Datos del consumidor</h2>
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2 sm:col-span-2">
                                <Label>Nombres y apellidos</Label>
                                <Input {...form.register('consumerName')} />
                                {form.formState.errors.consumerName && (
                                    <p className="text-xs text-destructive">{form.formState.errors.consumerName.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Tipo de documento</Label>
                                <Select
                                    value={form.watch('documentType')}
                                    onValueChange={(value) => form.setValue('documentType', value as FormValues['documentType'])}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="DNI">DNI</SelectItem>
                                        <SelectItem value="CE">Carné de Extranjeria</SelectItem>
                                        <SelectItem value="PASAPORTE">Pasaporte</SelectItem>
                                    </SelectContent>
                                </Select>
                                {form.formState.errors.documentType && (
                                    <p className="text-xs text-destructive">{form.formState.errors.documentType.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Numero de documento</Label>
                                <Input {...form.register('documentNumber')} />
                                {form.formState.errors.documentNumber && (
                                    <p className="text-xs text-destructive">{form.formState.errors.documentNumber.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Correo electronico</Label>
                                <Input type="email" {...form.register('email')} />
                                {form.formState.errors.email && (
                                    <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Telefono</Label>
                                <Input {...form.register('phone')} />
                                {form.formState.errors.phone && (
                                    <p className="text-xs text-destructive">{form.formState.errors.phone.message}</p>
                                )}
                            </div>

                            <div className="space-y-2 sm:col-span-2">
                                <Label>Direccion (distrito/ciudad)</Label>
                                <Input {...form.register('address')} />
                                {form.formState.errors.address && (
                                    <p className="text-xs text-destructive">{form.formState.errors.address.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="h-px w-full bg-slate-200" />

                    <div>
                        <h2 className="text-lg font-semibold text-neutral-900">Datos del reclamo</h2>
                        <div className="mt-4 space-y-4">
                            <div className="space-y-2">
                                <Label>Tipo de solicitud</Label>
                                <div className="flex flex-wrap gap-4">
                                    <label className="flex items-center gap-2 text-sm text-neutral-700">
                                        <input
                                            type="radio"
                                            value="RECLAMO"
                                            checked={form.watch('requestType') === 'RECLAMO'}
                                            onChange={() => form.setValue('requestType', 'RECLAMO')}
                                        />
                                        Reclamo
                                    </label>
                                    <label className="flex items-center gap-2 text-sm text-neutral-700">
                                        <input
                                            type="radio"
                                            value="QUEJA"
                                            checked={form.watch('requestType') === 'QUEJA'}
                                            onChange={() => form.setValue('requestType', 'QUEJA')}
                                        />
                                        Queja
                                    </label>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Servicio contratado</Label>
                                    <Select
                                        value={form.watch('serviceType')}
                                        onValueChange={(value) => form.setValue('serviceType', value as FormValues['serviceType'])}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PRESENCIAL">Pase Presencial</SelectItem>
                                            <SelectItem value="VIRTUAL">Pase Virtual</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Numero de pedido / operacion (opcional)</Label>
                                    <Input {...form.register('orderNumber')} />
                                </div>

                                <div className="space-y-2">
                                    <Label>Fecha del hecho</Label>
                                    <Input type="date" max={maxDate} {...form.register('incidentDate')} />
                                    {form.formState.errors.incidentDate && (
                                        <p className="text-xs text-destructive">{form.formState.errors.incidentDate.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Monto reclamado (S/.) (opcional)</Label>
                                    <Input type="number" step="0.01" min="0" {...form.register('claimedAmount')} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="h-px w-full bg-slate-200" />

                    <div>
                        <h2 className="text-lg font-semibold text-neutral-900">Detalle obligatorio</h2>
                        <div className="mt-4 space-y-4">
                            <div className="space-y-2">
                                <Label>Descripcion del hecho</Label>
                                <Textarea rows={4} {...form.register('description')} />
                                {form.formState.errors.description && (
                                    <p className="text-xs text-destructive">{form.formState.errors.description.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Pedido concreto del consumidor</Label>
                                <Textarea
                                    rows={4}
                                    placeholder="Indique claramente que solicita (ejemplo: reprogramacion, acceso, aclaracion, etc.)"
                                    {...form.register('requestDetail')}
                                />
                                {form.formState.errors.requestDetail && (
                                    <p className="text-xs text-destructive">{form.formState.errors.requestDetail.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="h-px w-full bg-slate-200" />

                    <div className="space-y-3">
                        <label className="flex items-start gap-3 text-sm text-neutral-700">
                            <input
                                type="checkbox"
                                checked={form.watch('acceptPrivacy')}
                                onChange={(e) => form.setValue('acceptPrivacy', e.target.checked)}
                            />
                            <span>
                                Declaro haber leido y acepto el tratamiento de mis datos personales conforme a la Ley N.° 29733.
                                <a className="ml-2 text-primary underline" href="/terminos-y-condiciones">
                                    Politica de privacidad
                                </a>
                            </span>
                        </label>
                        {form.formState.errors.acceptPrivacy && (
                            <p className="text-xs text-destructive">{form.formState.errors.acceptPrivacy.message}</p>
                        )}
                    </div>

                    {error && (
                        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {resultCode && (
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                            Tu reclamo ha sido registrado correctamente. <strong>Codigo de reclamo: {resultCode}</strong>
                        </div>
                    )}

                    <div className="flex items-center justify-end">
                        <Button type="submit" disabled={submitting}>
                            {submitting ? 'Enviando...' : 'Enviar reclamo'}
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
}
