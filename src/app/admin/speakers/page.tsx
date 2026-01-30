'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Save, X, GripVertical, Image, ImagePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import ReactFlagsSelect from 'react-flags-select';

// Map country names to ISO codes for the flag selector
const COUNTRY_CODES: Record<string, string> = {
    'Argentina': 'AR',
    'Bolivia': 'BO',
    'Brasil': 'BR',
    'Brazil': 'BR',
    'Chile': 'CL',
    'Colombia': 'CO',
    'Ecuador': 'EC',
    'España': 'ES',
    'Espana': 'ES',
    'Francia': 'FR',
    'México': 'MX',
    'Mexico': 'MX',
    'Paraguay': 'PY',
    'Perú': 'PE',
    'Peru': 'PE',
    'Uruguay': 'UY',
    'Venezuela': 'VE',
    'Estados Unidos': 'US',
    'United States': 'US',
    'USA': 'US',
    'Canadá': 'CA',
    'Canada': 'CA',
    'Alemania': 'DE',
    'Italia': 'IT',
    'Reino Unido': 'GB',
    'UK': 'GB',
    'Corea': 'KR',
    'Corea del Sur': 'KR',
    'Korea': 'KR',
    'Dubai': 'AE',
    'Emiratos Árabes Unidos': 'AE',
    'UAE': 'AE',
};

// Reverse map: ISO code to country name
const CODE_TO_COUNTRY: Record<string, string> = {
    'AR': 'Argentina',
    'BO': 'Bolivia',
    'BR': 'Brasil',
    'CL': 'Chile',
    'CO': 'Colombia',
    'EC': 'Ecuador',
    'ES': 'España',
    'FR': 'Francia',
    'MX': 'México',
    'PY': 'Paraguay',
    'PE': 'Perú',
    'UY': 'Uruguay',
    'VE': 'Venezuela',
    'US': 'Estados Unidos',
    'CA': 'Canadá',
    'DE': 'Alemania',
    'IT': 'Italia',
    'GB': 'Reino Unido',
    'KR': 'Corea del Sur',
    'AE': 'Emiratos Árabes Unidos',
};

interface Speaker {
    id: string;
    name: string;
    title: string | null;
    country: string | null;
    countryFlag: string | null;
    bio: string | null;
    description: string | null;
    specialties: string[];
    imageUrl: string | null;
    mainImageUrl: string | null;
    displayOrder: number;
    isActive: boolean;
}

export default function SpeakersPage() {
    const { toast } = useToast();
    const [speakers, setSpeakers] = useState<Speaker[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingSpeaker, setEditingSpeaker] = useState<Speaker | null>(null);
    const [uploading, setUploading] = useState<'card' | 'main' | null>(null);
    const [previewImage, setPreviewImage] = useState<{ type: 'card' | 'main', url: string } | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        title: '',
        countryCode: '',
        bio: '',
        description: '',
        specialties: '',
        imageUrl: '',
        mainImageUrl: '',
        isActive: true,
        displayOrder: 1,
    });

    useEffect(() => {
        fetchSpeakers();
    }, []);

    async function fetchSpeakers() {
        try {
            const res = await fetch('/api/admin/speakers');
            const data = await res.json();
            setSpeakers(data);
        } catch (error) {
            console.error('Error fetching speakers:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'No se pudieron cargar los speakers.',
            });
        } finally {
            setLoading(false);
        }
    }

    function getCountryCodeFromName(countryName: string | null): string {
        if (!countryName) return '';
        if (COUNTRY_CODES[countryName]) return COUNTRY_CODES[countryName];
        if (/^[A-Z]{2}$/.test(countryName)) return countryName;
        const lowerName = countryName.toLowerCase();
        const foundKey = Object.keys(COUNTRY_CODES).find(k => k.toLowerCase() === lowerName);
        if (foundKey) return COUNTRY_CODES[foundKey] || '';
        return '';
    }

    function openCreateDialog() {
        setEditingSpeaker(null);
        setPreviewImage(null);
        setFormData({
            name: '',
            title: '',
            countryCode: '',
            bio: '',
            description: '',
            specialties: '',
            imageUrl: '',
            mainImageUrl: '',
            isActive: true,
            displayOrder: 1,
        });
        setDialogOpen(true);
    }

    function openEditDialog(speaker: Speaker) {
        setEditingSpeaker(speaker);
        setPreviewImage(null);
        setFormData({
            name: speaker.name,
            title: speaker.title || '',
            countryCode: getCountryCodeFromName(speaker.country),
            bio: speaker.bio || '',
            description: speaker.description || '',
            specialties: speaker.specialties.join(', '),
            imageUrl: speaker.imageUrl || '',
            mainImageUrl: speaker.mainImageUrl || '',
            isActive: speaker.isActive,
            displayOrder: speaker.displayOrder || 1,
        });
        setDialogOpen(true);
    }

    // Handle dialog open change to clear preview if closed
    function handleDialogOpenChange(open: boolean) {
        setDialogOpen(open);
        if (!open) {
            setPreviewImage(null);
        }
    }

    async function handleSave() {
        // Validation: Check if order is already taken
        const order = formData.displayOrder;
        const duplicate = speakers.find(s =>
            s.displayOrder === order &&
            s.id !== editingSpeaker?.id // Ignore self if editing
        );

        if (duplicate) {
            toast({
                variant: 'destructive',
                title: 'Orden duplicado',
                description: `El orden #${order} ya está asignado al speaker "${duplicate.name}". Por favor selecciona otro.`,
            });
            return;
        }

        const country = formData.countryCode ? CODE_TO_COUNTRY[formData.countryCode] || formData.countryCode : '';

        const payload = {
            name: formData.name,
            title: formData.title,
            country,
            bio: formData.bio,
            description: formData.description,
            specialties: formData.specialties.split(',').map((s) => s.trim()).filter(Boolean),
            imageUrl: formData.imageUrl,
            mainImageUrl: formData.mainImageUrl,
            isActive: formData.isActive,
            displayOrder: formData.displayOrder,
        };

        try {
            if (editingSpeaker) {
                await fetch(`/api/admin/speakers/${editingSpeaker.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
            } else {
                await fetch('/api/admin/speakers', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
            }
            handleDialogOpenChange(false);
            fetchSpeakers();
            toast({
                title: 'Éxito',
                description: 'Speaker guardado correctamente.',
            });
        } catch (error) {
            console.error('Error saving speaker:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'No se pudo guardar el speaker.',
            });
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('¿Eliminar este speaker?')) return;
        try {
            await fetch(`/api/admin/speakers/${id}`, { method: 'DELETE' });
            fetchSpeakers();
        } catch (error) {
            console.error('Error deleting speaker:', error);
        }
    }

    async function toggleActive(id: string, isActive: boolean) {
        try {
            await fetch(`/api/admin/speakers/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive }),
            });
            fetchSpeakers();
        } catch (error) {
            console.error('Error toggling speaker:', error);
        }
    }

    async function handleImageUpload(file: File | null, type: 'card' | 'main') {
        if (!file) return;
        setUploading(type);

        const formDataUpload = new FormData();
        formDataUpload.append('files', file);
        formDataUpload.append('category', 'speakers');

        try {
            const res = await fetch('/api/admin/media/upload', {
                method: 'POST',
                body: formDataUpload,
            });

            if (res.ok) {
                const data = await res.json();
                const uploadedUrl = data?.assets?.[0]?.fileUrl as string | undefined;
                if (uploadedUrl) {
                    if (type === 'card') {
                        setFormData((prev) => ({ ...prev, imageUrl: uploadedUrl }));
                    } else {
                        setFormData((prev) => ({ ...prev, mainImageUrl: uploadedUrl }));
                    }
                }
            } else {
                console.error('Upload failed');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
        } finally {
            setUploading(null);
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Speakers</h1>
                    <p className="text-muted-foreground">Gestiona los instructores del evento</p>
                </div>
                <Button onClick={openCreateDialog}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Speaker
                </Button>
            </div>

            {/* Table */}
            <Card>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="p-8 text-center text-muted-foreground">Cargando...</div>
                    ) : speakers.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                            No hay speakers. Crea el primero.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">#</TableHead>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Título</TableHead>
                                    <TableHead>País</TableHead>
                                    <TableHead>Visible</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {speakers.map((speaker) => (
                                    <TableRow key={speaker.id}>
                                        <TableCell className="text-muted-foreground">
                                            <GripVertical className="h-4 w-4" />
                                        </TableCell>
                                        <TableCell className="font-medium">{speaker.name}</TableCell>
                                        <TableCell>{speaker.title || '-'}</TableCell>
                                        <TableCell>
                                            {speaker.countryFlag} {speaker.country || '-'}
                                        </TableCell>
                                        <TableCell>
                                            <Switch
                                                checked={speaker.isActive}
                                                onCheckedChange={(checked) => toggleActive(speaker.id, checked)}
                                            />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => openEditDialog(speaker)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(speaker.id)}
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Dialog - Compact Layout */}
            <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl">
                            {editingSpeaker ? 'Editar Speaker' : 'Nuevo Speaker'}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4 py-2">
                        {/* ROW 1: ORDEN | NOMBRE | TITULO | PAIS */}
                        <div className="grid gap-3 md:grid-cols-[80px_2fr_1.5fr_1fr]">
                            <div className="space-y-1">
                                <Label htmlFor="displayOrder" className="text-xs">Orden</Label>
                                <Select
                                    value={formData.displayOrder.toString()}
                                    onValueChange={(val) => setFormData({ ...formData, displayOrder: parseInt(val) })}
                                >
                                    <SelectTrigger className="h-9">
                                        <SelectValue placeholder="#" />
                                    </SelectTrigger>
                                    <SelectContent className="min-w-0 w-[--radix-select-trigger-width]">
                                        {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                                            <SelectItem key={num} value={num.toString()}>
                                                {num}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="name" className="text-xs">Nombre *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Dr. John Doe"
                                    className="h-9"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="title" className="text-xs">Título</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Especialista en..."
                                    className="h-9"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">País</Label>
                                <ReactFlagsSelect
                                    selected={formData.countryCode}
                                    onSelect={(code) => setFormData({ ...formData, countryCode: code })}
                                    placeholder="Selecciona"
                                    searchable
                                    searchPlaceholder="Buscar..."
                                    className="flags-select-compact"
                                />
                            </div>
                        </div>

                        {/* ROW 2: IMG_1 | IMG_2 | DESCRIPCION (images smaller, description larger) */}
                        <div className="grid gap-3 md:grid-cols-[1fr_1fr_2fr]">
                            {/* IMG_1 - Card Image */}
                            <div className="space-y-1 relative">
                                <Label className="flex items-center gap-1 text-xs">
                                    <Image className="h-3 w-3" />
                                    Imagen Card
                                </Label>
                                {/* Preview Popover - Shows above when active */}
                                {previewImage?.type === 'card' && (
                                    <div className="absolute bottom-full left-0 mb-2 z-50 rounded-lg border bg-background p-2 shadow-xl animate-in fade-in zoom-in-95 duration-200">
                                        <div className="relative">
                                            <button
                                                onClick={() => setPreviewImage(null)}
                                                className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-white shadow-sm hover:bg-destructive/90 z-10"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                            <img
                                                src={previewImage.url}
                                                alt="Preview"
                                                className="h-48 w-auto rounded-md object-contain"
                                            />
                                        </div>
                                        <div className="absolute -bottom-2 left-4 h-4 w-4 rotate-45 border-b border-r bg-background"></div>
                                    </div>
                                )}

                                <div className="relative h-24 overflow-hidden rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/30">
                                    {formData.imageUrl ? (
                                        <>
                                            <img
                                                src={formData.imageUrl}
                                                alt="Card"
                                                className="h-full w-full cursor-pointer object-cover transition-opacity hover:opacity-80"
                                                onClick={() => setPreviewImage(previewImage?.type === 'card' ? null : { type: 'card', url: formData.imageUrl })}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setFormData((prev) => ({ ...prev, imageUrl: '' }))}
                                                className="absolute right-1 top-1 rounded-full bg-destructive p-1 text-white shadow hover:bg-destructive/90"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </>
                                    ) : (
                                        <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center text-muted-foreground transition-colors hover:bg-muted/50">
                                            <Image className="h-6 w-6 opacity-40" />
                                            <span className="mt-1 text-xs opacity-60">
                                                {uploading === 'card' ? 'Subiendo...' : 'Click para subir'}
                                            </span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => handleImageUpload(e.target.files?.[0] ?? null, 'card')}
                                                disabled={uploading !== null}
                                            />
                                        </label>
                                    )}
                                </div>
                            </div>

                            {/* IMG_2 - Main Image */}
                            <div className="space-y-1 relative">
                                <Label className="flex items-center gap-1 text-xs">
                                    <ImagePlus className="h-3 w-3" />
                                    Imagen Principal
                                </Label>
                                {/* Preview Popover */}
                                {previewImage?.type === 'main' && (
                                    <div className="absolute bottom-full left-0 mb-2 z-50 rounded-lg border bg-background p-2 shadow-xl animate-in fade-in zoom-in-95 duration-200">
                                        <div className="relative">
                                            <button
                                                onClick={() => setPreviewImage(null)}
                                                className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-white shadow-sm hover:bg-destructive/90 z-10"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                            <img
                                                src={previewImage.url}
                                                alt="Preview"
                                                className="h-48 w-auto rounded-md object-contain"
                                            />
                                        </div>
                                        <div className="absolute -bottom-2 left-4 h-4 w-4 rotate-45 border-b border-r bg-background"></div>
                                    </div>
                                )}

                                <div className="relative h-24 overflow-hidden rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/30">
                                    {formData.mainImageUrl ? (
                                        <>
                                            <img
                                                src={formData.mainImageUrl}
                                                alt="Main"
                                                className="h-full w-full cursor-pointer object-cover transition-opacity hover:opacity-80"
                                                onClick={() => setPreviewImage(previewImage?.type === 'main' ? null : { type: 'main', url: formData.mainImageUrl })}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setFormData((prev) => ({ ...prev, mainImageUrl: '' }))}
                                                className="absolute right-1 top-1 rounded-full bg-destructive p-1 text-white shadow hover:bg-destructive/90"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </>
                                    ) : (
                                        <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center text-muted-foreground transition-colors hover:bg-muted/50">
                                            <ImagePlus className="h-6 w-6 opacity-40" />
                                            <span className="mt-1 text-xs opacity-60">
                                                {uploading === 'main' ? 'Subiendo...' : 'Click para subir'}
                                            </span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => handleImageUpload(e.target.files?.[0] ?? null, 'main')}
                                                disabled={uploading !== null}
                                            />
                                        </label>
                                    )}
                                </div>
                            </div>

                            {/* DESCRIPCION */}
                            <div className="space-y-1">
                                <Label htmlFor="description" className="text-xs">Descripción</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Descripción del speaker..."
                                    className="h-24 resize-none text-sm"
                                />
                            </div>
                        </div>

                        {/* ROW 3: BIO | ESPECIALIDADES */}
                        <div className="grid gap-3 md:grid-cols-2">
                            <div className="space-y-1">
                                <Label htmlFor="bio" className="text-xs">Bio</Label>
                                <Textarea
                                    id="bio"
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    placeholder="Bio breve..."
                                    className="h-16 resize-none text-sm"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="specialties" className="text-xs">Especialidades (separadas por coma)</Label>
                                <Textarea
                                    id="specialties"
                                    value={formData.specialties}
                                    onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                                    placeholder="Anatomía, Inyectables, Toxina..."
                                    className="h-16 resize-none text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="grid grid-cols-2 gap-3">
                        <Button variant="outline" className="w-full" onClick={() => handleDialogOpenChange(false)}>
                            <X className="mr-1 h-4 w-4" />
                            Cancelar
                        </Button>
                        <Button className="w-full" onClick={handleSave} disabled={!formData.name}>
                            <Save className="mr-1 h-4 w-4" />
                            Guardar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Custom styles for react-flags-select compact */}
            <style jsx global>{`
                .flags-select-compact button {
                    border: 1px solid hsl(var(--border));
                    border-radius: 0.375rem;
                    background: hsl(var(--background));
                    height: 36px;
                    padding: 0 8px;
                    font-size: 0.875rem;
                }
                .flags-select-compact button:hover {
                    border-color: hsl(var(--primary));
                }
                .flags-select-compact ul {
                    background: hsl(var(--background));
                    border: 1px solid hsl(var(--border));
                    border-radius: 0.375rem;
                    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
                    max-height: 200px;
                }
                .flags-select-compact li {
                    padding: 6px 8px;
                    font-size: 0.875rem;
                }
                .flags-select-compact li:hover {
                    background: hsl(var(--muted));
                }
                .flags-select-compact input {
                    background: hsl(var(--background));
                    border: 1px solid hsl(var(--border));
                    border-radius: 0.25rem;
                    padding: 4px 8px;
                    font-size: 0.875rem;
                }
            `}</style>
        </div>
    );
}
