'use client';

import { useState, useEffect } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface ConfigItem {
    id: string;
    key: string;
    value: unknown;
}

const DEFAULT_CONFIGS = [
    { key: 'event_title', label: 'Título del Evento', type: 'text' },
    { key: 'event_date', label: 'Fecha del Evento', type: 'text' },
    { key: 'event_location', label: 'Ubicación', type: 'text' },
    { key: 'event_tagline', label: 'Tagline', type: 'text' },
    { key: 'hero_video_url', label: 'URL Video Hero', type: 'text' },
];

export default function ConfigPage() {
    const [configs, setConfigs] = useState<ConfigItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState<Record<string, string>>({});

    useEffect(() => {
        fetchConfigs();
    }, []);

    async function fetchConfigs() {
        try {
            const res = await fetch('/api/admin/config');
            const data = await res.json();
            setConfigs(data);

            // Populate form data
            const form: Record<string, string> = {};
            data.forEach((item: ConfigItem) => {
                form[item.key] = typeof item.value === 'string'
                    ? item.value
                    : JSON.stringify(item.value, null, 2);
            });
            setFormData(form);
        } catch (error) {
            console.error('Error fetching configs:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleSave() {
        setSaving(true);
        try {
            const updates = Object.entries(formData).map(([key, value]) => ({
                key,
                value: tryParseJSON(value),
            }));

            await fetch('/api/admin/config', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });

            fetchConfigs();
        } catch (error) {
            console.error('Error saving configs:', error);
        } finally {
            setSaving(false);
        }
    }

    function tryParseJSON(value: string): unknown {
        try {
            return JSON.parse(value);
        } catch {
            return value;
        }
    }

    function handleInputChange(key: string, value: string) {
        setFormData((prev) => ({ ...prev, [key]: value }));
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Configuración del Sitio</h1>
                    <p className="text-muted-foreground">
                        Edita los textos y configuraciones globales
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={fetchConfigs} disabled={loading}>
                        <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        Recargar
                    </Button>
                    <Button onClick={handleSave} disabled={saving}>
                        <Save className="mr-2 h-4 w-4" />
                        {saving ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                </div>
            </div>

            {/* Quick Configs */}
            <Card>
                <CardHeader>
                    <CardTitle>Configuración Básica</CardTitle>
                    <CardDescription>Textos principales del evento</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {DEFAULT_CONFIGS.map((config) => (
                        <div key={config.key} className="space-y-2">
                            <Label htmlFor={config.key}>{config.label}</Label>
                            <Input
                                id={config.key}
                                value={formData[config.key] || ''}
                                onChange={(e) => handleInputChange(config.key, e.target.value)}
                                placeholder={`Ingresa ${config.label.toLowerCase()}`}
                            />
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Colors Configuration */}
            <Card>
                <CardHeader>
                    <CardTitle>Paleta de Colores</CardTitle>
                    <CardDescription>Personaliza los colores del sitio</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4 mb-4">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary" title="Primary" />
                            <span className="text-sm text-muted-foreground">#e830ce</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-secondary" title="Secondary" />
                            <span className="text-sm text-muted-foreground">#2323ff</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-accent" title="Accent" />
                            <span className="text-sm text-muted-foreground">#2ef8a0</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full" style={{ backgroundColor: '#dd2b3a' }} title="Danger" />
                            <span className="text-sm text-muted-foreground">#dd2b3a</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full" style={{ backgroundColor: '#f26222' }} title="Warning" />
                            <span className="text-sm text-muted-foreground">#f26222</span>
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Los colores se configuran en <code>tailwind.config.ts</code> y <code>globals.css</code>
                    </p>
                </CardContent>
            </Card>

            {/* Advanced: All Configs */}
            <Card>
                <CardHeader>
                    <CardTitle>Configuración Avanzada (JSON)</CardTitle>
                    <CardDescription>Todas las configuraciones almacenadas</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p className="text-muted-foreground">Cargando...</p>
                    ) : configs.length === 0 ? (
                        <p className="text-muted-foreground">No hay configuraciones. Agrega las primeras.</p>
                    ) : (
                        <div className="space-y-4">
                            {configs.map((config) => (
                                <div key={config.id} className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline">{config.key}</Badge>
                                    </div>
                                    <Textarea
                                        value={formData[config.key] || ''}
                                        onChange={(e) => handleInputChange(config.key, e.target.value)}
                                        rows={typeof config.value === 'object' ? 4 : 1}
                                        className="font-mono text-sm"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
