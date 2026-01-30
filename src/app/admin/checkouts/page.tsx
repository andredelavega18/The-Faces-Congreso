'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Edit, Loader2, Plus, Tag, ExternalLink, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
// import { getSupabaseClient } from '@/lib/supabase/client';

interface CheckoutConfig {
    id: string;
    packageName: string;
    packageType: string;
    price: number;
    currency: string;
    isActive: boolean;
    redirectUrl?: string;
    metadata?: {
        imageUrl?: string;
        badge?: string;
        features?: string[];
        isRedirectOnly?: boolean;
    };
}

export default function AdminCheckoutsPage() {
    const router = useRouter();
    const [checkouts, setCheckouts] = useState<CheckoutConfig[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    // Create Dialog State
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [newName, setNewName] = useState('');
    const [newPrice, setNewPrice] = useState('');
    const [newType, setNewType] = useState('PRESENCIAL');
    const [newImage, setNewImage] = useState<File | null>(null);
    const [newThankYouUrl, setNewThankYouUrl] = useState('');
    const [destinationType, setDestinationType] = useState<'default' | 'custom'>('default');
    // Delete State
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    useEffect(() => {
        fetchCheckouts();
    }, []);

    async function fetchCheckouts() {
        try {
            const res = await fetch('/api/admin/checkouts');
            if (res.ok) {
                const data = await res.json();
                setCheckouts(data);
            }
        } catch (error) {
            console.error('Failed to fetch checkouts', error);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleCreate() {
        if (!newName || !newPrice) {
            toast({ title: "Error", description: "Completa todos los campos", variant: "destructive" });
            return;
        }

        setIsCreating(true);
        try {
            let imageUrl = '';

            if (newImage) {
                const formData = new FormData();
                formData.append('file', newImage);

                // Import dynamically if needed or just use the imported action
                const { uploadTicketImage } = await import('@/app/actions/upload');
                const result = await uploadTicketImage(formData);

                if (result.error) throw new Error(result.error);
                if (result.url) imageUrl = result.url;
            }

            const res = await fetch('/api/admin/checkouts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    packageName: newName,
                    price: parseFloat(newPrice),
                    packageType: newType,
                    currency: 'USD',
                    imageUrl: imageUrl || undefined,
                    thankYouUrl: newThankYouUrl || undefined
                })
            });

            if (!res.ok) throw new Error('Failed to create');

            toast({ title: "Éxito", description: "Entrada creada correctamente" });
            setIsCreateOpen(false);
            setNewName('');
            setNewPrice('');
            setNewImage(null);
            fetchCheckouts();
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: error instanceof Error ? error.message : "No se pudo crear la entrada", variant: "destructive" });
        } finally {
            setIsCreating(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('¿Estás seguro de eliminar esta entrada? Esta acción no se puede deshacer.')) return;

        setIsDeleting(id);
        try {
            const res = await fetch(`/api/admin/checkouts/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Error al eliminar');
            }

            toast({ title: "Eliminado", description: "Entrada eliminada correctamente" });
            fetchCheckouts();
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "No se pudo eliminar la entrada", variant: "destructive" });
        } finally {
            setIsDeleting(null);
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Gestión de Entradas</h1>
                    <p className="text-muted-foreground">
                        Administra los paquetes, precios y contenido visual de los tickets.
                    </p>
                </div>
                {/* Checkouts are usually fixed by backend config, but we could allow creating new ones if needed. 
                    For now, focusing on editing existing ones as per plan. */}
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Nueva Entrada
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Crear Nueva Entrada</DialogTitle>
                            <DialogDescription>
                                Configura los detalles básicos. Podrás editar más opciones después.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                    Nombre
                                </Label>
                                <Input
                                    id="name"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="col-span-3"
                                    placeholder="Ej. VIP Presencial"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="price" className="text-right">
                                    Precio (USD)
                                </Label>
                                <Input
                                    id="price"
                                    type="number"
                                    value={newPrice}
                                    onChange={(e) => setNewPrice(e.target.value)}
                                    className="col-span-3"
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="type" className="text-right">
                                    Tipo
                                </Label>
                                <Select value={newType} onValueChange={setNewType}>
                                    <SelectTrigger className="w-[180px] col-span-3">
                                        <SelectValue placeholder="Selecciona tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PRESENCIAL">Presencial</SelectItem>
                                        <SelectItem value="ONLINE">Online</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="image" className="text-right">
                                    Imagen (Opcional)
                                </Label>
                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/png, image/jpeg, image/webp"
                                    onChange={(e) => {
                                        if (e.target.files?.[0]) {
                                            setNewImage(e.target.files[0]);
                                        }
                                    }}
                                    className="col-span-3"
                                />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="destinationType" className="text-right">
                                    Página de Gracias
                                </Label>
                                <Select
                                    value={destinationType}
                                    onValueChange={(v: 'default' | 'custom') => {
                                        setDestinationType(v);
                                        if (v === 'default') setNewThankYouUrl('');
                                    }}
                                >
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Selecciona destino" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="default">Por defecto (Interna)</SelectItem>
                                        <SelectItem value="custom">Personalizada (System.io)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Custom Thank You URL */}
                            {destinationType === 'custom' && (
                                <div className="grid grid-cols-4 items-center gap-4 animate-in fade-in slide-in-from-top-1">
                                    <Label htmlFor="thankYouUrl" className="text-right">
                                        URL Destino
                                    </Label>
                                    <Input
                                        id="thankYouUrl"
                                        value={newThankYouUrl}
                                        onChange={(e) => setNewThankYouUrl(e.target.value)}
                                        className="col-span-3"
                                        placeholder="https://..."
                                    />
                                </div>
                            )}
                        </div>
                        <DialogFooter>
                            <Button onClick={handleCreate} disabled={isCreating}>
                                {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Crear
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Entradas Disponibles ({checkouts.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">Imagen</TableHead>
                                <TableHead>Nombre del Paquete</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Precio</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Redirección</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {checkouts.map((checkout) => (
                                <TableRow key={checkout.id}>
                                    <TableCell>
                                        <div className="h-10 w-10 overflow-hidden rounded-md bg-slate-100">
                                            {checkout.metadata?.imageUrl ? (
                                                <img
                                                    src={checkout.metadata.imageUrl}
                                                    alt={checkout.packageName}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-slate-300">
                                                    <Tag className="h-4 w-4" />
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            {checkout.packageName}
                                            {checkout.metadata?.badge && (
                                                <Badge variant="secondary" className="text-[10px] h-5">
                                                    {checkout.metadata.badge}
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{checkout.packageType}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        {checkout.currency} {Number(checkout.price).toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={checkout.isActive ? 'default' : 'secondary'}
                                            className={!checkout.isActive ? 'bg-slate-200 text-slate-500 hover:bg-slate-200' : ''}
                                        >
                                            {checkout.isActive ? 'Activo' : 'Inactivo'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {checkout.redirectUrl ? (
                                            <div className="flex items-center gap-1 text-xs text-blue-600">
                                                <ExternalLink className="h-3 w-3" />
                                                {checkout.metadata?.isRedirectOnly ? 'Solo Redirect' : 'Híbrido'}
                                            </div>
                                        ) : (
                                            <span className="text-xs text-slate-400">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => router.push(`/admin/checkouts/${checkout.id}`)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(checkout.id)}
                                            disabled={isDeleting === checkout.id}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                        >
                                            {isDeleting === checkout.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash className="h-4 w-4" />}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div >
    );
}
