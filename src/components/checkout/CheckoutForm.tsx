'use client';

import { useState, useTransition, useEffect } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { createRegistration } from '@/app/actions/checkout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
    fullName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    email: z.string().email('Email invalido'),
    phone: z.string().min(6, 'Numero de telefono invalido'),
    country: z.string().min(2, 'Selecciona un pais'),
    quantity: z.number().min(1).max(10),
    acceptTerms: z.boolean().refine((val) => val === true, {
        message: 'Debes aceptar los terminos y condiciones',
    }),
});

type FormData = z.infer<typeof formSchema>;

interface CheckoutFormProps {
    checkoutKey: string;
    packageName: string;
    price: number;
    currency: string;
    source?: string;
    redirectUrl?: string;
}

const COUNTRIES = [
    { value: 'PE', label: 'Peru' },
    { value: 'CO', label: 'Colombia' },
    { value: 'CL', label: 'Chile' },
    { value: 'MX', label: 'Mexico' },
    { value: 'EC', label: 'Ecuador' },
    { value: 'AR', label: 'Argentina' },
    { value: 'BO', label: 'Bolivia' },
    { value: 'US', label: 'Estados Unidos' },
    { value: 'ES', label: 'Espana' },
    { value: 'OTHER', label: 'Otro' },
];

export function CheckoutForm({ checkoutKey, packageName, price, currency, source = 'website', redirectUrl }: CheckoutFormProps) {
    const [isPending, startTransition] = useTransition();
    const [state, setState] = useState<{ success?: boolean; error?: string; registrationId?: string; thankYouUrl?: string | null }>({});

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: '',
            email: '',
            phone: '',
            country: '',
            quantity: 1,
            acceptTerms: false,
        },
    });

    const quantity = form.watch('quantity') || 1;
    const totalPrice = price * quantity;
    const acceptTerms = form.watch('acceptTerms') ?? false;
    const [culqiReady, setCulqiReady] = useState(false);

    // Inicializar Culqi cuando el script carga
    const handleCulqiLoad = () => {
        const publicKey = process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY;

        // @ts-ignore
        if (window.Culqi && publicKey) {
            // @ts-ignore
            window.Culqi.publicKey = publicKey;
            setCulqiReady(true);
        }
    };


    useEffect(() => {
        // @ts-ignore
        window.culqi = async function () {
            // @ts-ignore
            if (window.Culqi.token) {
                // @ts-ignore
                const token = window.Culqi.token.id;

                const formData = new FormData();
                formData.append('checkoutKey', checkoutKey);
                const data = form.getValues();
                formData.append('fullName', data.fullName);
                formData.append('email', data.email);
                formData.append('phone', data.phone);
                formData.append('country', data.country);
                formData.append('quantity', data.quantity.toString());
                formData.append('culqiToken', token);
                formData.append('source', source);
                formData.append('acceptTerms', data.acceptTerms ? 'true' : 'false');

                startTransition(async () => {
                    const result = await createRegistration({}, formData);
                    setState(result);
                    // @ts-ignore
                    window.Culqi.close();
                });
            } else {
                // @ts-ignore
                console.error('Culqi Error:', window.Culqi.error);
                // @ts-ignore
                setState({ error: window.Culqi.error.user_message || 'Error al procesar el pago' });
            }
        };

        return () => {
            // @ts-ignore
            delete window.culqi;
        };
    }, [checkoutKey, form]);

    function onPayClick(data: FormData) {
        const amount = Math.round(price * data.quantity * 100);

        // @ts-ignore
        if (window.Culqi && culqiReady) {
            // @ts-ignore
            window.Culqi.settings({
                title: packageName,
                currency: currency,
                description: `${packageName} x${data.quantity}`,
                amount: amount,
            });
            // @ts-ignore
            window.Culqi.options({
                style: {
                    logo: '/logos/logo.svg',
                    maincolor: '#000000',
                },
            });
            // @ts-ignore
            window.Culqi.open();
        } else {
            console.error('Culqi not loaded');
            setState({ error: 'Error: La pasarela de pago no cargo correctamente. Recarga la pagina.' });
        }
    }


    const router = useRouter();

    useEffect(() => {
        if (state.success) {
            if (state.thankYouUrl) {
                window.location.href = state.thankYouUrl;
            } else if (redirectUrl) {
                window.location.href = redirectUrl;
            } else {
                router.push(`/thank-you?key=${checkoutKey}`);
            }
        }
    }, [state.success, state.thankYouUrl, router, checkoutKey, redirectUrl]);

    if (state.success) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <span className="ml-3 text-lg">Redirigiendo...</span>
            </div>
        );
    }

    return (
        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            <Script src="https://checkout.culqi.com/js/v4" strategy="afterInteractive" onLoad={handleCulqiLoad} />

            <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.12)] p-6">
                    <h2 className="font-averox text-2xl mb-4 text-slate-900">Resumen de Compra</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-start pb-4 border-b">
                            <div>
                                <h3 className="font-bold text-lg">{packageName}</h3>
                                <p className="text-sm text-muted-foreground">Acceso al congreso THE FACES 2026</p>
                            </div>
                            <span className="font-bold text-xl">
                                {currency} {price.toFixed(2)} x {quantity}
                            </span>
                        </div>
                        <div className="flex justify-between items-center font-bold text-lg pt-2 border-t mt-2">
                            <span>Total a pagar</span>
                            <span className="text-2xl text-primary">{currency} {totalPrice.toFixed(2)}</span>
                        </div>
                    </div>
                    <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-muted-foreground">
                        <p className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            Pago seguro garantizado
                        </p>
                        <p className="mt-2 text-xs">
                            Al completar este formulario, aseguraras tu cupo. El pago se coordinara directamente contigo.
                        </p>
                    </div>
                </div>
            </div>

            <Card className="shadow-[0_20px_50px_rgba(15,23,42,0.12)] border-slate-200 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10">
                    <CardTitle>Datos de Registro</CardTitle>
                    <CardDescription>
                        Completa tus datos para finalizar la inscripcion.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onPayClick)} className="space-y-4" id="checkout-form">
                        {state.error && (
                            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                {state.error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="fullName">Nombre Completo</Label>
                            <Input
                                id="fullName"
                                placeholder="Ej. Juan Perez"
                                {...form.register('fullName')}
                                className={form.formState.errors.fullName ? "border-destructive focus-visible:ring-destructive" : ""}
                            />
                            {form.formState.errors.fullName && (
                                <span className="text-xs text-destructive">{form.formState.errors.fullName.message}</span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Correo Electronico</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="tu@email.com"
                                {...form.register('email')}
                                className={form.formState.errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                            />
                            {form.formState.errors.email && (
                                <span className="text-xs text-destructive">{form.formState.errors.email.message}</span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Telefono / WhatsApp</Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="+51 999 999 999"
                                {...form.register('phone')}
                                className={form.formState.errors.phone ? "border-destructive focus-visible:ring-destructive" : ""}
                            />
                            {form.formState.errors.phone && (
                                <span className="text-xs text-destructive">{form.formState.errors.phone.message}</span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="country">Pais</Label>
                            <Select
                                value={form.watch('country') || ''}
                                onValueChange={(value) => form.setValue('country', value)}
                            >
                                <SelectTrigger className={form.formState.errors.country ? "border-destructive" : ""}>
                                    <SelectValue placeholder="Selecciona tu pais" />
                                </SelectTrigger>
                                <SelectContent>
                                    {COUNTRIES.map((country) => (
                                        <SelectItem key={country.value} value={country.label}>
                                            {country.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {form.formState.errors.country && (
                                <span className="text-xs text-destructive">{form.formState.errors.country.message}</span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="quantity">Cantidad de Entradas</Label>
                            <Select
                                value={(form.watch('quantity') || 1).toString()}
                                onValueChange={(value) => form.setValue('quantity', parseInt(value))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Cantidad" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                        <SelectItem key={num} value={num.toString()}>
                                            {num} {num === 1 ? 'Entrada' : 'Entradas'}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <label className="flex items-start gap-3 text-sm text-slate-700">
                                <input
                                    type="checkbox"
                                    {...form.register('acceptTerms')}
                                />
                                <span>
                                    Acepto los <a href="/terminos-y-condiciones" className="text-primary underline">Terminos y Condiciones</a>.
                                </span>
                            </label>
                            {form.formState.errors.acceptTerms && (
                                <span className="mt-2 block text-xs text-destructive">{form.formState.errors.acceptTerms.message}</span>
                            )}
                        </div>

                        <Button type="submit" className="w-full mt-2" size="lg" disabled={isPending || !acceptTerms}>
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Procesando...
                                </>
                            ) : (
                                'Pagar y Confirmar'
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center border-t p-4 text-xs text-muted-foreground bg-muted/20 rounded-b-xl">
                    Tus datos estan protegidos y seran usados solo para el evento.
                </CardFooter>
            </Card>
        </div>
    );
}
