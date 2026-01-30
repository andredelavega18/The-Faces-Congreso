'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Save, ArrowLeft, EyeOff, Video, Image as ImageIcon, ArrowUp, ArrowDown, Layout, Users, Ticket, MapPin, HelpCircle, Mail, FileText, TestTube, BookOpen, PlayCircle, Calendar, Award, Instagram, BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface EventSection {
    id: string;
    sectionKey: string;
    sectionName: string;
    content: Record<string, unknown>;
    isVisible: boolean;
    displayOrder: number;
}

// Section schema definitions with icons
const sectionSchemas: Record<string, {
    label: string;
    icon: React.ReactNode;
    description: string;
    fields: { key: string; label: string; type: 'text' | 'textarea' | 'url' | 'image' | 'video'; placeholder?: string; hint?: string }[]
}> = {
    hero: {
        label: 'Hero Banner',
        icon: <Layout className="h-5 w-5" />,
        description: 'Seccion principal con video o imagen de fondo',
        fields: [
            { key: 'title', label: 'Titulo Principal', type: 'text', placeholder: 'THE FACES MASTER INYECTOR 2026' },
            { key: 'subtitle', label: 'Subtitulo', type: 'text', placeholder: 'SAVE THE DATE!' },
            { key: 'tagline', label: 'Tagline', type: 'text', placeholder: 'LOS MEJORES EN UN SOLO LUGAR' },
            { key: 'videoUrl', label: 'Video de Fondo (URL)', type: 'video', placeholder: 'https://...supabase.co/storage/.../video.webm' },
            { key: 'imageDesktop', label: 'Imagen Desktop', type: 'image', hint: '1920x1080px' },
            { key: 'imageMobile', label: 'Imagen Mobile', type: 'image', hint: '750x1334px' },
            { key: 'imageTablet', label: 'Imagen Tablet', type: 'image', hint: '1024x768px' },
        ],
    },
    intro: {
        label: 'Metodologia',
        icon: <BookOpen className="h-5 w-5" />,
        description: 'Metodologia y pilares del congreso',
        fields: [
            { key: 'title', label: 'Titulo', type: 'text', placeholder: 'METODOLOGIA THE FACES' },
            { key: 'subtitle', label: 'Subtitulo', type: 'text', placeholder: 'El conocimiento se demuestra en vivo' },
            { key: 'description', label: 'Descripcion (parrafos)', type: 'textarea' },
            {
                key: 'items',
                label: 'Items (titulo | descripcion)',
                type: 'textarea',
                placeholder: 'Conferencias magistrales | Accede a ponencias dictadas por speakers internacionales...',
            },
            { key: 'highlights', label: 'Pilares (uno por linea)', type: 'textarea' },
            { key: 'closing', label: 'Detalle (parrafos)', type: 'textarea' },
            { key: 'signatureName', label: 'Firma - Nombre', type: 'text' },
            { key: 'signatureRole', label: 'Firma - Cargo', type: 'text' },
        ],
    },
    founders: {
        label: 'Fundadoras',
        icon: <Users className="h-5 w-5" />,
        description: 'Seccion de fundadoras del congreso',
        fields: [
            { key: 'title', label: 'Titulo', type: 'text', placeholder: 'Fundadoras' },
            { key: 'subtitle', label: 'Subtitulo', type: 'text', placeholder: 'EQUIPO' },
            { key: 'description', label: 'Descripcion', type: 'textarea' },
            { key: 'founder1Name', label: 'Nombre 1', type: 'text', placeholder: 'DRA YEZENIA PARIONA SIHUIN' },
            { key: 'founder1Role', label: 'Cargo 1', type: 'text', placeholder: '' },
            { key: 'founder1Image', label: 'Foto 1', type: 'image' },
            { key: 'founder2Name', label: 'Nombre 2', type: 'text', placeholder: 'DRA CESVI VILLENA BEJAR' },
            { key: 'founder2Role', label: 'Cargo 2', type: 'text', placeholder: '' },
            { key: 'founder2Image', label: 'Foto 2', type: 'image' },
        ],
    },
    video: {
        label: 'Video',
        icon: <PlayCircle className="h-5 w-5" />,
        description: 'Video principal debajo del hero',
        fields: [
            { key: 'title', label: 'Titulo', type: 'text', placeholder: 'VIDEO 1' },
            { key: 'subtitle', label: 'Subtitulo', type: 'text', placeholder: 'VIDEO' },
            { key: 'description', label: 'Descripcion', type: 'textarea' },
            { key: 'videoUrl', label: 'Video URL (YouTube/Vimeo/mp4)', type: 'video' },
            { key: 'posterUrl', label: 'Poster URL', type: 'image' },
        ],
    },
    speakers: {
        label: 'Speakers',
        icon: <Users className="h-5 w-5" />,
        description: 'Muestra los ponentes desde la tabla speakers',
        fields: [
            { key: 'title', label: 'Titulo', type: 'text', placeholder: 'Conoce a los Expertos' },
            { key: 'subtitle', label: 'Subtitulo', type: 'text', placeholder: 'INSTRUCTORES' },
            { key: 'description', label: 'Descripcion', type: 'textarea' },
        ],
    },
    schedule: {
        label: 'Detalle del Contenido',
        icon: <Calendar className="h-5 w-5" />,
        description: 'Listado de contenidos y temas principales',
        fields: [
            { key: 'title', label: 'Titulo', type: 'text', placeholder: 'Detalle del contenido del evento' },
            { key: 'subtitle', label: 'Subtitulo', type: 'text', placeholder: 'PROGRAMA' },
            { key: 'description', label: 'Descripcion', type: 'textarea' },
            {
                key: 'items',
                label: 'Items (uno por linea)',
                type: 'textarea',
                placeholder: 'Conferencias magistrales de alto nivel',
            },
        ],
    },
    tickets: {
        label: 'Entradas',
        icon: <Ticket className="h-5 w-5" />,
        description: 'Muestra los precios desde checkout_configs',
        fields: [
            { key: 'title', label: 'Titulo', type: 'text', placeholder: 'Reserva tu Lugar' },
            { key: 'subtitle', label: 'Subtitulo', type: 'text', placeholder: 'ENTRADAS' },
            { key: 'description', label: 'Descripcion', type: 'textarea' },
            { key: 'introTitle', label: 'Intro - Titulo', type: 'text', placeholder: 'Inscripciones' },
            { key: 'introDescription', label: 'Intro - Descripcion', type: 'textarea' },
            { key: 'paymentNote', label: 'Nota de pago', type: 'text', placeholder: 'Valor especial hasta el 28/02/2026' },
            { key: 'featureTitle', label: 'Titulo incluye', type: 'text', placeholder: 'Incluye' },
            { key: 'features', label: 'Incluye (uno por linea)', type: 'textarea' },
            { key: 'onlineTitle', label: 'Online - Titulo', type: 'text', placeholder: 'Modalidad Online' },
            { key: 'onlineDescription', label: 'Online - Descripcion', type: 'textarea' },
        ],
    },
    awards: {
        label: 'Awards',
        icon: <Award className="h-5 w-5" />,
        description: 'Premios y bases',
        fields: [
            { key: 'title', label: 'Titulo', type: 'text', placeholder: 'Presentacion de Trabajos a Premio' },
            { key: 'subtitle', label: 'Subtitulo', type: 'text', placeholder: 'AWARDS' },
            { key: 'description', label: 'Descripcion', type: 'textarea' },
            {
                key: 'items',
                label: 'Items (uno por linea)',
                type: 'textarea',
                placeholder: 'Mejor Proyecto de Investigacion | Presenta una propuesta... | Ver bases | https://...',
            },
        ],
    },
    sponsors: {
        label: 'Sponsors',
        icon: <BadgeCheck className="h-5 w-5" />,
        description: 'Sponsors y respaldo academico',
        fields: [
            { key: 'title', label: 'Titulo', type: 'text', placeholder: 'Sponsors 2025' },
            { key: 'subtitle', label: 'Subtitulo', type: 'text', placeholder: 'SPONSORS' },
            { key: 'description', label: 'Descripcion', type: 'textarea' },
            {
                key: 'sponsors',
                label: 'Sponsors (uno por linea)',
                type: 'textarea',
                placeholder: 'Laboratorio X | https://.../logo.png | https://web.com',
            },
            { key: 'academicTitle', label: 'Titulo respaldo', type: 'text', placeholder: 'Respaldo Academico' },
            {
                key: 'academicSponsors',
                label: 'Respaldo (uno por linea)',
                type: 'textarea',
                placeholder: 'Universidad X | https://.../logo.png | https://web.com',
            },
        ],
    },
    companies: {
        label: 'Empresas',
        icon: <BadgeCheck className="h-5 w-5" />,
        description: 'Empresas con las que trabajamos (logos en loop)',
        fields: [
            { key: 'title', label: 'Titulo', type: 'text', placeholder: 'Laboratorios participantes' },
            { key: 'subtitle', label: 'Subtitulo', type: 'text', placeholder: 'EMPRESAS' },
            { key: 'description', label: 'Descripcion', type: 'textarea' },
            {
                key: 'logos',
                label: 'Logos (URL | alt | href opcional)',
                type: 'textarea',
                placeholder: 'https://.../logo.png | Empresa X | https://empresa.com',
            },
        ],
    },
    instagram: {
        label: 'Instagram',
        icon: <Instagram className="h-5 w-5" />,
        description: 'CTA a Instagram',
        fields: [
            { key: 'title', label: 'Titulo', type: 'text', placeholder: 'Seguinos en Instagram' },
            { key: 'description', label: 'Descripcion', type: 'textarea' },
            { key: 'handle', label: 'Handle', type: 'text', placeholder: '@dr_felicef' },
            { key: 'ctaLabel', label: 'Texto del boton', type: 'text', placeholder: 'Ir a Instagram' },
            { key: 'ctaUrl', label: 'URL del boton', type: 'url', placeholder: 'https://instagram.com/...' },
        ],
    },
    additional: {
        label: 'Informacion adicional',
        icon: <FileText className="h-5 w-5" />,
        description: 'Texto completo con objetivos y beneficios del congreso',
        fields: [
            { key: 'title', label: 'Titulo', type: 'text', placeholder: 'QUIENES SOMOS' },
            { key: 'subtitle', label: 'Subtitulo', type: 'text', placeholder: 'THE FACES 2026' },
            { key: 'description', label: 'Descripcion (parrafos)', type: 'textarea' },
            { key: 'objectiveTitle', label: 'Titulo objetivo', type: 'text', placeholder: 'Objetivo principal' },
            { key: 'objectiveDescription', label: 'Descripcion objetivo', type: 'textarea' },
            { key: 'benefitsTitle', label: 'Titulo beneficios', type: 'text', placeholder: 'Beneficios principales' },
            { key: 'benefits', label: 'Beneficios (uno por linea)', type: 'textarea' },
            { key: 'detailsTitle', label: 'Titulo detalle', type: 'text', placeholder: 'Detalle del contenido del evento' },
            { key: 'details', label: 'Detalle (uno por linea)', type: 'textarea' },
            { key: 'detailsNote', label: 'Nota detalle', type: 'textarea' },
            { key: 'includedTitle', label: 'Titulo incluidos', type: 'text', placeholder: 'Beneficios incluidos' },
            { key: 'included', label: 'Incluidos (uno por linea)', type: 'textarea' },
        ],
    },
    about: {
        label: 'Quienes Somos',
        icon: <FileText className="h-5 w-5" />,
        description: 'Identidad del congreso y beneficios principales',
        fields: [
            { key: 'title', label: 'Titulo', type: 'text', placeholder: 'QUIENES SOMOS' },
            { key: 'description', label: 'Descripcion (parrafos)', type: 'textarea' },
            { key: 'features', label: 'Beneficios (uno por linea)', type: 'textarea' },
            { key: 'imageDesktop', label: 'Imagen Desktop', type: 'image', hint: '1200x600px' },
            { key: 'imageMobile', label: 'Imagen Mobile', type: 'image', hint: '600x400px' },
        ],
    },
    venue: {
        label: 'Ubicacion',
        icon: <MapPin className="h-5 w-5" />,
        description: 'Mapa y direccion del evento',
        fields: [
            { key: 'title', label: 'Nombre del Venue', type: 'text', placeholder: 'Convention Center - Hotel Westin' },
            { key: 'address', label: 'Direccion', type: 'text', placeholder: 'Lima - Peru' },
            { key: 'mapUrl', label: 'URL de Google Maps (link o embed)', type: 'url' },
            { key: 'description', label: 'Descripcion', type: 'textarea' },
            { key: 'imageDesktop', label: 'Imagen', type: 'image' },
        ],
    },
    labs: {
        label: 'Laboratorios',
        icon: <TestTube className="h-5 w-5" />,
        description: 'Lista de laboratorios que participan en el congreso',
        fields: [
            { key: 'title', label: 'Titulo', type: 'text', placeholder: 'Laboratorios Participantes' },
            { key: 'subtitle', label: 'Subtitulo', type: 'text', placeholder: 'ALIADOS' },
            { key: 'description', label: 'Descripcion', type: 'textarea' },
            {
                key: 'labs',
                label: 'Laboratorios (uno por linea)',
                type: 'textarea',
                placeholder: 'Laboratorio X | https://.../logo.png | https://laboratoriox.com',
            },
        ],
    },
    faq: {
        label: 'FAQ',
        icon: <HelpCircle className="h-5 w-5" />,
        description: 'Preguntas frecuentes',
        fields: [
            { key: 'title', label: 'Titulo', type: 'text', placeholder: 'Preguntas Frecuentes' },
        ],
    },
    contact: {
        label: 'Contacto / Footer',
        icon: <Mail className="h-5 w-5" />,
        description: 'Informacion de contacto y footer',
        fields: [
            { key: 'title', label: 'Titulo footer', type: 'text', placeholder: 'MASTERHUB 2026' },
            { key: 'organization', label: 'Organizacion', type: 'text', placeholder: 'ESMG-USA LLC' },
            { key: 'address', label: 'Direccion', type: 'text', placeholder: 'Hotel Hilton, Macacha Guemes 351, CABA' },
            { key: 'email', label: 'Email', type: 'text', placeholder: 'info@thefaces.com' },
            { key: 'phone', label: 'Telefono', type: 'text', placeholder: '+51 999 999 999' },
            { key: 'whatsapp', label: 'WhatsApp', type: 'text' },
            { key: 'claimsUrl', label: 'Libro de reclamaciones (URL)', type: 'url' },
            { key: 'termsUrl', label: 'Terminos y condiciones (URL)', type: 'url' },
            { key: 'changesUrl', label: 'Politica de cambios (URL)', type: 'url' },
            { key: 'facebookUrl', label: 'Facebook (URL)', type: 'url' },
            { key: 'instagramUrl', label: 'Instagram (URL)', type: 'url' },
            { key: 'tiktokUrl', label: 'TikTok (URL)', type: 'url' },
            { key: 'ctaUrl', label: 'Boton Inscribete ahora (URL)', type: 'url' },
        ],
    },
};

export default function SectionsPage() {
    const [sections, setSections] = useState<EventSection[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingSection, setEditingSection] = useState<EventSection | null>(null);
    const [formContent, setFormContent] = useState<Record<string, string>>({});
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [uploadingField, setUploadingField] = useState<string | null>(null);

    useEffect(() => {
        fetchSections();
    }, []);

    async function fetchSections() {
        try {
            const res = await fetch('/api/admin/sections');
            const data = await res.json();
            setSections(data);
        } catch (error) {
            console.error('Error fetching sections:', error);
        } finally {
            setLoading(false);
        }
    }

    function openEditor(section: EventSection) {
        setEditingSection(section);
        const flatContent: Record<string, string> = {};
        Object.entries(section.content).forEach(([key, value]) => {
            flatContent[key] = typeof value === 'string' ? value : JSON.stringify(value);
        });
        setFormContent(flatContent);
    }

    function closeEditor() {
        setEditingSection(null);
        setFormContent({});
    }

    async function handleSave() {
        if (!editingSection) return;

        try {
            await fetch(`/api/admin/sections/${editingSection.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: formContent }),
            });
            fetchSections();
            closeEditor();
        } catch (error) {
            console.error('Error saving section:', error);
        }
    }

    async function createSection(key: string) {
        const schema = sectionSchemas[key];
        if (!schema) return;

        const defaultContent: Record<string, string> = {};
        schema.fields.forEach((field) => {
            defaultContent[field.key] = '';
        });

        try {
            await fetch('/api/admin/sections', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sectionKey: key,
                    sectionName: schema.label,
                    content: defaultContent,
                    isVisible: true,
                }),
            });
            setShowCreateDialog(false);
            fetchSections();
        } catch (error) {
            console.error('Error creating section:', error);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Eliminar esta seccion?')) return;
        try {
            await fetch(`/api/admin/sections/${id}`, { method: 'DELETE' });
            fetchSections();
        } catch (error) {
            console.error('Error deleting section:', error);
        }
    }

    async function toggleVisibility(id: string, isVisible: boolean) {
        try {
            await fetch(`/api/admin/sections/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isVisible }),
            });
            fetchSections();
        } catch (error) {
            console.error('Error toggling visibility:', error);
        }
    }

    async function moveSection(id: string, direction: 'up' | 'down') {
        const index = sections.findIndex((s) => s.id === id);
        if (index === -1) return;

        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= sections.length) return;

        const currentSection = sections[index];
        const targetSection = sections[targetIndex];

        if (!currentSection || !targetSection) return;

        try {
            // Swap display orders
            await Promise.all([
                fetch(`/api/admin/sections/${currentSection.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ displayOrder: targetSection.displayOrder }),
                }),
                fetch(`/api/admin/sections/${targetSection.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ displayOrder: currentSection.displayOrder }),
                }),
            ]);
            fetchSections();
        } catch (error) {
            console.error('Error moving section:', error);
        }
    }

    function getMediaCategory(sectionKey: string, fieldKey: string, type: string) {
        if (type === 'video') return 'videos';
        if (sectionKey === 'hero') return 'hero-images';
        if (sectionKey === 'about') return 'hero-images';
        if (sectionKey === 'venue') return 'hero-images';
        if (sectionKey === 'video' && fieldKey === 'posterUrl') return 'hero-images';
        return 'hero-images';
    }

    async function handleMediaUpload(
        fieldKey: string,
        file: File | null,
        sectionKey: string,
        type: 'image' | 'video'
    ) {
        if (!file) return;
        setUploadingField(fieldKey);

        const formDataUpload = new FormData();
        formDataUpload.append('files', file);
        formDataUpload.append('category', getMediaCategory(sectionKey, fieldKey, type));

        try {
            const res = await fetch('/api/admin/media/upload', {
                method: 'POST',
                body: formDataUpload,
            });

            if (res.ok) {
                const data = await res.json();
                const uploadedUrl = data?.assets?.[0]?.fileUrl as string | undefined;
                if (uploadedUrl) {
                    setFormContent((prev) => ({ ...prev, [fieldKey]: uploadedUrl }));
                }
            } else {
                console.error('Upload failed');
            }
        } catch (error) {
            console.error('Error uploading media:', error);
        } finally {
            setUploadingField(null);
        }
    }

    // Editor View
    if (editingSection) {
        const schema = sectionSchemas[editingSection.sectionKey];
        const fields = schema?.fields || [];

        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={closeEditor}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            {schema?.icon}
                            <h1 className="text-3xl font-bold">{schema?.label || editingSection.sectionName}</h1>
                        </div>
                        <p className="text-muted-foreground mt-1">{schema?.description}</p>
                    </div>
                    <Button onClick={handleSave}>
                        <Save className="mr-2 h-4 w-4" />
                        Guardar
                    </Button>
                </div>

                {/* Video Preview */}
                {editingSection.sectionKey === 'hero' && formContent.videoUrl && (
                    <Card className="overflow-hidden">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Video className="h-4 w-4" />
                                Vista Previa del Video
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <video
                                src={formContent.videoUrl}
                                autoPlay
                                muted
                                loop
                                className="w-full h-48 object-cover rounded-lg"
                            />
                        </CardContent>
                    </Card>
                )}

                {/* Form Fields */}
                <div className="grid gap-6 md:grid-cols-2">
                    {fields.map((field) => (
                        <Card key={field.key} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm flex items-center gap-2">
                                    {field.type === 'image' && <ImageIcon className="h-4 w-4 text-primary" />}
                                    {field.type === 'video' && <Video className="h-4 w-4 text-secondary" />}
                                    {field.label}
                                </CardTitle>
                                {field.hint && (
                                    <CardDescription className="text-xs">
                                        Tamano recomendado: {field.hint}
                                    </CardDescription>
                                )}
                            </CardHeader>
                            <CardContent>
                                {field.type === 'textarea' ? (
                                    <Textarea
                                        value={formContent[field.key] || ''}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormContent({ ...formContent, [field.key]: e.target.value })}
                                        placeholder={field.placeholder}
                                        rows={4}
                                    />
                                ) : field.type === 'image' ? (
                                    <div className="space-y-3">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) =>
                                                handleMediaUpload(field.key, e.target.files?.[0] ?? null, editingSection.sectionKey, 'image')
                                            }
                                        />
                                        {uploadingField === field.key && (
                                            <span className="text-xs text-muted-foreground">Subiendo...</span>
                                        )}
                                        {formContent[field.key] && (
                                            <img
                                                src={formContent[field.key]}
                                                alt={field.label}
                                                className="h-24 w-auto rounded border object-cover"
                                            />
                                        )}
                                    </div>
                                ) : field.type === 'video' ? (
                                    <div className="space-y-3">
                                        <input
                                            type="file"
                                            accept="video/*"
                                            onChange={(e) =>
                                                handleMediaUpload(field.key, e.target.files?.[0] ?? null, editingSection.sectionKey, 'video')
                                            }
                                        />
                                        {uploadingField === field.key && (
                                            <span className="text-xs text-muted-foreground">Subiendo...</span>
                                        )}
                                        {formContent[field.key] && (
                                            <video
                                                src={formContent[field.key]}
                                                className="h-24 w-auto rounded border object-cover"
                                                muted
                                                controls
                                            />
                                        )}
                                    </div>
                                ) : (
                                    <Input
                                        value={formContent[field.key] || ''}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormContent({ ...formContent, [field.key]: e.target.value })}
                                        placeholder={field.placeholder}
                                    />
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Raw JSON Editor */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Editor JSON Avanzado</CardTitle>
                        <CardDescription>Edita el JSON directamente para campos adicionales</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            value={JSON.stringify(formContent, null, 2)}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                                try {
                                    const parsed = JSON.parse(e.target.value);
                                    setFormContent(parsed);
                                } catch {
                                    // Invalid JSON
                                }
                            }}
                            rows={8}
                            className="font-mono text-sm"
                        />
                    </CardContent>
                </Card>
            </div>
        );
    }

    // List View
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Secciones</h1>
                    <p className="text-muted-foreground">
                        Gestiona las secciones del landing page. El orden aqui es el orden en el sitio.
                    </p>
                </div>
                <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nueva Seccion
                </Button>
            </div>

            {/* Create Dialog */}
            {showCreateDialog && (
                <Card>
                    <CardHeader>
                        <CardTitle>Crear Nueva Seccion</CardTitle>
                        <CardDescription>Selecciona el tipo de seccion a agregar al landing</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-3 md:grid-cols-3">
                            {Object.entries(sectionSchemas).map(([key, schema]) => {
                                const exists = sections.some((s) => s.sectionKey === key);
                                return (
                                    <Button
                                        key={key}
                                        variant={exists ? 'outline' : 'secondary'}
                                        disabled={exists}
                                        onClick={() => createSection(key)}
                                        className="justify-start h-auto py-4"
                                    >
                                        <div className="flex items-start gap-3 w-full">
                                            <div className="flex-shrink-0 mt-0.5">{schema.icon}</div>
                                            <div className="text-left">
                                                <div className="font-semibold">{exists ? 'Agregado' : schema.label}</div>
                                                <div className="text-xs text-muted-foreground">{schema.description}</div>
                                            </div>
                                        </div>
                                    </Button>
                                );
                            })}
                        </div>
                        <div className="mt-4 flex justify-end">
                            <Button variant="ghost" onClick={() => setShowCreateDialog(false)}>
                                Cancelar
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Sections List */}
            <div className="space-y-3">
                {loading ? (
                    <Card className="p-8 text-center text-muted-foreground">Cargando...</Card>
                ) : sections.length === 0 ? (
                    <Card className="p-8 text-center text-muted-foreground">
                        No hay secciones. Crea la primera usando el boton de arriba.
                    </Card>
                ) : (
                    sections.map((section, index) => {
                        const schema = sectionSchemas[section.sectionKey];
                        const hasVideo = section.content.videoUrl as string;
                        const hasImage = section.content.imageDesktop as string;

                        return (
                            <Card
                                key={section.id}
                                className={`transition-all hover:ring-1 hover:ring-primary/50 ${!section.isVisible ? 'opacity-50' : ''
                                    }`}
                            >
                                <div className="flex items-center gap-4 p-4">
                                    {/* Order Controls */}
                                    <div className="flex flex-col gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6"
                                            disabled={index === 0}
                                            onClick={() => moveSection(section.id, 'up')}
                                        >
                                            <ArrowUp className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6"
                                            disabled={index === sections.length - 1}
                                            onClick={() => moveSection(section.id, 'down')}
                                        >
                                            <ArrowDown className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    {/* Icon */}
                                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                                        {schema?.icon || <Layout className="h-5 w-5" />}
                                    </div>

                                    {/* Thumbnail */}
                                    <div className="flex-shrink-0 w-20 h-14 rounded bg-muted overflow-hidden">
                                        {hasVideo ? (
                                            <video src={hasVideo} className="w-full h-full object-cover" muted />
                                        ) : hasImage ? (
                                            <img src={hasImage} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                <ImageIcon className="h-5 w-5" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div
                                        className="flex-1 min-w-0 cursor-pointer"
                                        onClick={() => openEditor(section)}
                                    >
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold">{schema?.label || section.sectionName}</h3>
                                            {!section.isVisible && (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-muted text-muted-foreground text-xs">
                                                    <EyeOff className="h-3 w-3" />
                                                    Oculto
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-0.5">
                                            {Object.keys(section.content).filter((k) => section.content[k]).length} campos configurados
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={section.isVisible}
                                            onCheckedChange={(checked: boolean) => toggleVisibility(section.id, checked)}
                                        />
                                        <Button variant="ghost" size="icon" onClick={() => openEditor(section)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(section.id)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
}
