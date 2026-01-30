'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Save, Trash, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { getSupabaseClient } from '@/lib/supabase/client';

interface CheckoutConfig {
    id: string;
    packageName: string;
    packageType: string;
    checkoutKey: string;
    price: number;
    currency: string;
    isActive: boolean;
    redirectUrl?: string;
    metadata?: {
        imageUrl?: string;
        badge?: string;
        features?: string[];
        description?: string;
        isRedirectOnly?: boolean;
        isSoldOut?: boolean;
    };
}

export default function EditCheckoutPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [config, setConfig] = useState<CheckoutConfig | null>(null);
    const [uploading, setUploading] = useState(false);

    // Form state
    const [packageName, setPackageName] = useState('');
    const [price, setPrice] = useState('0');
    const [currency, setCurrency] = useState('USD');
    const [isActive, setIsActive] = useState(true);
    const [redirectUrl, setRedirectUrl] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [badge, setBadge] = useState('');
    const [description, setDescription] = useState('');
    const [isSoldOut, setIsSoldOut] = useState(false);
    // const [isRedirectOnly, setIsRedirectOnly] = useState(false); // Unused
    const [features, setFeatures] = useState<string[]>([]);
    const [newFeature, setNewFeature] = useState('');

    useEffect(() => {
        loadConfig();
    }, []);

    async function loadConfig() {
        try {
            const { id } = await params;
            // Assuming we fetch list as per previous implementation logic
            const listRes = await fetch('/api/admin/checkouts');
            const list = await listRes.json();
            const found = list.find((c: any) => c.id === id);

            if (found) {
                setConfig(found);
                setPackageName(found.packageName);
                setPrice(String(found.price));
                setCurrency(found.currency);
                setIsActive(found.isActive);
                setRedirectUrl(found.redirectUrl || '');
                setImageUrl(found.metadata?.imageUrl || '');
                setBadge(found.metadata?.badge || '');
                setDescription(found.metadata?.description || '');
                // setIsRedirectOnly(found.metadata?.isRedirectOnly || false);
                setFeatures(found.metadata?.features || []);
                setIsSoldOut(Boolean(found.metadata?.isSoldOut));
            } else {
                toast({ title: 'Error', description: 'Paquete no encontrado', variant: 'destructive' });
                router.push('/admin/checkouts');
            }
        } catch (error) {
            console.error(error);
            toast({ title: 'Error', description: 'Error al cargar datos', variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    }

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files || e.target.files.length === 0) return;

        try {
            setUploading(true);
            const file = e.target.files[0];
            if (!file) return;
            const fileExt = file.name.split('.').pop();
            const fileName = `ticket-${Date.now()}.${fileExt}`;

            const supabase = getSupabaseClient();
            const { error: uploadError } = await supabase.storage
                .from('tickets')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('tickets').getPublicUrl(fileName);
            setImageUrl(data.publicUrl);
            toast({ title: 'Imagen subida correctamente' });
        } catch (error) {
            console.error('Upload failed:', error);
            toast({ title: 'Error', description: 'No se pudo subir la imagen', variant: 'destructive' });
        } finally {
            setUploading(false);
        }
    }

    function addFeature() {
        if (!newFeature.trim()) return;
        setFeatures([...features, newFeature.trim()]);
        setNewFeature('');
    }

    function removeFeature(index: number) {
        setFeatures(features.filter((_, i) => i !== index));
    }

    async function handleSave() {
        if (!config) return;
        setSaving(true);
        try {
            const { id } = await params;
            const res = await fetch(`/api/admin/checkouts/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    packageName,
                    price: parseFloat(price),
                    currency,
                    isActive,
                    redirectUrl,
                    metadata: {
                        imageUrl,
                        badge,
                        description,
                        features,
                        isRedirectOnly: false, // Fixed to false as feature hidden
                        isSoldOut,
                    },
                }),
            });

            if (!res.ok) throw new Error('Failed to update');

            toast({ title: 'Guardado', description: 'El paquete se actualizó correctamente.' });
            router.refresh();
        } catch (error) {
            console.error(error);
            toast({ title: 'Error', description: 'No se pudo guardar los cambios', variant: 'destructive' });
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin" /></div>;
    if (!config) return <div>Paquete no encontrado</div>;

    return (
        <div className="space-y-6 pb-20">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Editar Entrada</h1>
                    <p className="text-muted-foreground">{config.packageName}</p>
                </div>
                <div className="ml-auto">
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Guardar Cambios
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Información Básica</CardTitle>
                            <CardDescription>Detalles principales del ticket</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Nombre del Paquete</Label>
                                <Input value={packageName} onChange={(e) => setPackageName(e.target.value)} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Precio</Label>
                                    <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Moneda</Label>
                                    <Input value={currency} onChange={(e) => setCurrency(e.target.value)} maxLength={3} />
                                </div>
                            </div>
                            <div className="flex items-center justify-between rounded-lg border p-3">
                                <Label>Activo (Visible al público)</Label>
                                <Switch checked={isActive} onCheckedChange={setIsActive} />
                            </div>
                            <div className="flex items-center justify-between rounded-lg border p-3">
                                <div>
                                    <Label>Agotado</Label>
                                    <p className="text-xs text-muted-foreground">Muestra "AGOTADO" y desactiva compra.</p>
                                </div>
                                <Switch checked={isSoldOut} onCheckedChange={setIsSoldOut} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Contenido Visual</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Badge (Etiqueta superior)</Label>
                                <Input
                                    value={badge}
                                    onChange={(e) => setBadge(e.target.value)}
                                    placeholder="Ej: RECOMENDADO, SOLD OUT"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Imagen del Ticket</Label>
                                <div className="flex gap-4">
                                    {imageUrl && (
                                        <img src={imageUrl} alt="Preview" className="h-24 w-24 rounded-md object-cover border" />
                                    )}
                                    <div className="flex-1">
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            disabled={uploading}
                                        />
                                        <p className="mt-1 text-xs text-muted-foreground">Recomendado: 800x800px transparente o fondo solido.</p>
                                        {uploading && <p className="text-xs text-blue-500 mt-1">Subiendo...</p>}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Detalles y Características</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Descripción Corta</Label>
                                <Textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Características (Lista de beneficios)</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={newFeature}
                                        onChange={(e) => setNewFeature(e.target.value)}
                                        placeholder="Ej: Acceso a talleres"
                                        onKeyDown={(e) => e.key === 'Enter' && addFeature()}
                                    />
                                    <Button type="button" onClick={addFeature} size="icon" variant="secondary">
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <ul className="space-y-2 mt-2">
                                    {features.map((feat, idx) => (
                                        <li key={idx} className="flex items-center justify-between rounded-md bg-slate-50 p-2 text-sm">
                                            <span>{feat}</span>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeFeature(idx)}
                                                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                            >
                                                <Trash className="h-3 w-3" />
                                            </Button>
                                        </li>
                                    ))}
                                    {features.length === 0 && <p className="text-xs text-muted-foreground italic">Sin características añadidas.</p>}
                                </ul>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Redirección Post-Compra</CardTitle>
                            <CardDescription>
                                Configura una página de agradecimiento externa (ej: Systeme.io).
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>URL de Página de Gracias</Label>
                                <Input
                                    value={redirectUrl}
                                    onChange={(e) => setRedirectUrl(e.target.value)}
                                    placeholder="https://..."
                                />
                                <p className="text-xs text-muted-foreground">
                                    Si se llena, el usuario será redirigido a esta URL <strong>después del pago exitoso</strong>.
                                    Si se deja vacío, irá a la página de gracias interna.
                                </p>
                            </div>
                            {/* Hidden as per user request: "la unica redireccion es asia paginas de gracias"
                            <div className="flex items-center justify-between rounded-lg border p-3 bg-blue-50/50">
                                <div className="space-y-0.5">
                                    <Label>Modo Solo Redirección</Label>
                                    <p className="text-xs text-muted-foreground">
                                        Omitir formulario interno y enviar directamente a la URL.
                                    </p>
                                </div>
                                <Switch checked={isRedirectOnly} onCheckedChange={setIsRedirectOnly} />
                            </div>
                            */}
                        </CardContent>
                    </Card>

                    <Card className="border-blue-200 bg-blue-50/20">
                        <CardHeader>
                            <CardTitle className="text-blue-700">Enlaces para Compartir</CardTitle>
                            <CardDescription>
                                Copia estos enlaces para usarlos en tus botones de Systeme.io o redes sociales.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Helper to get base URL */}
                            {(() => {
                                const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : '');

                                return (
                                    <>
                                        <div className="space-y-2">
                                            <Label>Enlace Directo (General)</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    readOnly
                                                    value={`${baseUrl}/checkout?key=${config.checkoutKey}`}
                                                    className="bg-white"
                                                />
                                                <Button
                                                    variant="outline"
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(`${baseUrl}/checkout?key=${config.checkoutKey}`);
                                                        toast({ title: 'Enlace copiado' });
                                                    }}
                                                >
                                                    Copiar
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-blue-700 font-bold">Enlace para Systeme.io (Recomendado)</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    readOnly
                                                    value={`${baseUrl}/checkout?key=${config.checkoutKey}&source=systemio`}
                                                    className="bg-white border-blue-200"
                                                />
                                                <Button
                                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(`${baseUrl}/checkout?key=${config.checkoutKey}&source=systemio`);
                                                        toast({ title: 'Enlace Systeme copiado' });
                                                    }}
                                                >
                                                    Copiar
                                                </Button>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Incluye la etiqueta <code>source=systemio</code> para rastrear que la venta vino de ahí.
                                            </p>
                                        </div>
                                    </>
                                );
                            })()}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
