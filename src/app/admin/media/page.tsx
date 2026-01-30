'use client';

import { useState, useEffect, useRef } from 'react';
import { Upload, Image, Video, File, Trash2, Copy, ExternalLink, Grid, List, Search, FolderOpen, Layout, Users, Building, Film, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface MediaAsset {
    id: string;
    assetType: string;
    assetCategory: string | null;
    fileName: string;
    fileUrl: string;
    fileSize: number | null;
    mimeType: string | null;
    createdAt: string;
}

// Bucket configuration with icons and size recommendations
const bucketConfig = {
    'hero-images': {
        label: 'Hero / Banners',
        description: 'Imagenes de cabecera y banners principales',
        icon: <Layout className="h-5 w-5" />,
        sizes: [
            { name: 'Desktop', width: 1920, height: 1080 },
            { name: 'Tablet', width: 1024, height: 768 },
            { name: 'Mobile', width: 750, height: 1334 },
        ],
    },
    speakers: {
        label: 'Speakers',
        description: 'Fotos de ponentes e instructores',
        icon: <Users className="h-5 w-5" />,
        sizes: [
            { name: 'Perfil', width: 400, height: 400 },
            { name: 'Detalle', width: 800, height: 1000 },
        ],
    },
    sponsors: {
        label: 'Sponsors',
        description: 'Logos de patrocinadores',
        icon: <Building className="h-5 w-5" />,
        sizes: [
            { name: 'Logo', width: 300, height: 150 },
            { name: 'Logo Grande', width: 600, height: 300 },
        ],
    },
    videos: {
        label: 'Videos',
        description: 'Videos del evento y promocionales',
        icon: <Film className="h-5 w-5" />,
        sizes: [
            { name: 'HD', width: 1920, height: 1080 },
            { name: '4K', width: 3840, height: 2160 },
        ],
    },
    documents: {
        label: 'Documentos',
        description: 'PDFs y archivos descargables',
        icon: <FileText className="h-5 w-5" />,
        sizes: [],
    },
};

type BucketKey = keyof typeof bucketConfig;

export default function MediaPage() {
    const [assets, setAssets] = useState<MediaAsset[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [selectedBucket, setSelectedBucket] = useState<BucketKey>('hero-images');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [previewAsset, setPreviewAsset] = useState<MediaAsset | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchAssets();
    }, []);

    async function fetchAssets() {
        try {
            const res = await fetch('/api/admin/media');
            const data = await res.json();
            setAssets(data);
        } catch (error) {
            console.error('Error fetching assets:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        const formData = new FormData();

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file) {
                formData.append('files', file);
            }
        }
        formData.append('category', selectedBucket);

        try {
            const res = await fetch('/api/admin/media/upload', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                fetchAssets();
            } else {
                console.error('Upload failed');
            }
        } catch (error) {
            console.error('Error uploading:', error);
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Eliminar este archivo?')) return;

        try {
            await fetch(`/api/admin/media/${id}`, { method: 'DELETE' });
            fetchAssets();
            setPreviewAsset(null);
        } catch (error) {
            console.error('Error deleting:', error);
        }
    }

    function copyUrl(url: string) {
        navigator.clipboard.writeText(url);
    }

    function formatFileSize(bytes: number | null): string {
        if (!bytes) return '-';
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    function getAssetIcon(type: string) {
        switch (type) {
            case 'image': return <Image className="h-8 w-8 text-primary" />;
            case 'video': return <Video className="h-8 w-8 text-secondary" />;
            default: return <File className="h-8 w-8 text-muted-foreground" />;
        }
    }

    // Filter assets by selected bucket/category
    const filteredAssets = assets.filter((asset) => {
        const matchesBucket = asset.assetCategory === selectedBucket ||
            (selectedBucket === 'hero-images' && !asset.assetCategory);
        const matchesSearch = asset.fileName.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesBucket && matchesSearch;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Media</h1>
                    <p className="text-muted-foreground">
                        Gestiona imagenes, videos y archivos del evento
                    </p>
                </div>
            </div>

            {/* Bucket Tabs */}
            <Tabs value={selectedBucket} onValueChange={(v) => setSelectedBucket(v as BucketKey)}>
                <TabsList className="grid w-full grid-cols-5 h-auto">
                    {Object.entries(bucketConfig).map(([key, config]) => (
                        <TabsTrigger key={key} value={key} className="flex flex-col gap-1 py-3">
                            {config.icon}
                            <span className="text-xs">{config.label}</span>
                        </TabsTrigger>
                    ))}
                </TabsList>

                {Object.entries(bucketConfig).map(([key, config]) => (
                    <TabsContent key={key} value={key} className="mt-6 space-y-6">
                        {/* Bucket Info Card */}
                        <Card>
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {config.icon}
                                        <div>
                                            <CardTitle>{config.label}</CardTitle>
                                            <CardDescription>{config.description}</CardDescription>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleUpload}
                                            className="hidden"
                                            multiple
                                            accept={key === 'videos' ? 'video/*' : key === 'documents' ? '.pdf,.doc,.docx' : 'image/*'}
                                        />
                                        <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                                            <Upload className="mr-2 h-4 w-4" />
                                            {uploading ? 'Subiendo...' : 'Subir'}
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            {config.sizes.length > 0 && (
                                <CardContent>
                                    <div className="flex flex-wrap gap-4">
                                        {config.sizes.map((size) => (
                                            <div key={size.name} className="flex items-center gap-2 text-sm bg-muted px-3 py-2 rounded-lg">
                                                <FolderOpen className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-medium">{size.name}:</span>
                                                <span className="text-muted-foreground">{size.width} x {size.height}px</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            )}
                        </Card>

                        {/* Search and View */}
                        <div className="flex items-center justify-between gap-4">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar archivo..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <div className="flex gap-1">
                                <Button
                                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                    size="icon"
                                    onClick={() => setViewMode('grid')}
                                >
                                    <Grid className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                                    size="icon"
                                    onClick={() => setViewMode('list')}
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Assets Grid/List */}
                        {loading ? (
                            <div className="p-8 text-center text-muted-foreground">Cargando...</div>
                        ) : filteredAssets.length === 0 ? (
                            <Card className="p-12 text-center">
                                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                                <p className="text-muted-foreground mb-2">No hay archivos en {config.label}</p>
                                {config.sizes.length > 0 && (
                                    <p className="text-sm text-muted-foreground">
                                        Tamanos recomendados: {config.sizes.map((s) => `${s.name} (${s.width}x${s.height})`).join(', ')}
                                    </p>
                                )}
                            </Card>
                        ) : viewMode === 'grid' ? (
                            <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
                                {filteredAssets.map((asset) => (
                                    <Card
                                        key={asset.id}
                                        className="group cursor-pointer overflow-hidden transition-all hover:ring-2 hover:ring-primary"
                                        onClick={() => setPreviewAsset(asset)}
                                    >
                                        <div className="aspect-square bg-muted flex items-center justify-center relative">
                                            {asset.assetType === 'image' ? (
                                                <img
                                                    src={asset.fileUrl}
                                                    alt={asset.fileName}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : asset.assetType === 'video' ? (
                                                <video
                                                    src={asset.fileUrl}
                                                    className="w-full h-full object-cover"
                                                    muted
                                                />
                                            ) : (
                                                getAssetIcon(asset.assetType)
                                            )}
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <ExternalLink className="h-6 w-6 text-white" />
                                            </div>
                                        </div>
                                        <div className="p-2">
                                            <p className="text-xs truncate">{asset.fileName}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatFileSize(asset.fileSize)}
                                            </p>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Card>
                                <CardContent className="p-0">
                                    <div className="divide-y">
                                        {filteredAssets.map((asset) => (
                                            <div
                                                key={asset.id}
                                                className="flex items-center gap-4 p-4 hover:bg-muted/50 cursor-pointer"
                                                onClick={() => setPreviewAsset(asset)}
                                            >
                                                <div className="flex-shrink-0">
                                                    {asset.assetType === 'image' ? (
                                                        <img
                                                            src={asset.fileUrl}
                                                            alt={asset.fileName}
                                                            className="h-12 w-12 rounded object-cover"
                                                        />
                                                    ) : asset.assetType === 'video' ? (
                                                        <video
                                                            src={asset.fileUrl}
                                                            className="h-12 w-12 rounded object-cover"
                                                            muted
                                                        />
                                                    ) : (
                                                        <div className="h-12 w-12 rounded bg-muted flex items-center justify-center">
                                                            {getAssetIcon(asset.assetType)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium truncate">{asset.fileName}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {asset.mimeType} - {formatFileSize(asset.fileSize)}
                                                    </p>
                                                </div>
                                                <span className="inline-block px-2 py-1 rounded bg-muted text-xs">
                                                    {asset.assetType}
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        copyUrl(asset.fileUrl);
                                                    }}
                                                >
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>
                ))}
            </Tabs>

            {/* Preview Dialog */}
            <Dialog open={!!previewAsset} onOpenChange={() => setPreviewAsset(null)}>
                <DialogContent className="max-w-2xl">
                    {previewAsset && (
                        <>
                            <DialogHeader>
                                <DialogTitle>{previewAsset.fileName}</DialogTitle>
                                <DialogDescription>
                                    {previewAsset.mimeType} - {formatFileSize(previewAsset.fileSize)}
                                    {previewAsset.assetCategory && ` - Bucket: ${previewAsset.assetCategory}`}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="py-4">
                                {previewAsset.assetType === 'image' ? (
                                    <img
                                        src={previewAsset.fileUrl}
                                        alt={previewAsset.fileName}
                                        className="w-full max-h-96 object-contain rounded bg-muted"
                                    />
                                ) : previewAsset.assetType === 'video' ? (
                                    <video
                                        src={previewAsset.fileUrl}
                                        controls
                                        autoPlay
                                        muted
                                        className="w-full max-h-96 rounded bg-muted"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-48 bg-muted rounded">
                                        {getAssetIcon(previewAsset.assetType)}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Input value={previewAsset.fileUrl} readOnly className="flex-1 font-mono text-xs" />
                                    <Button variant="outline" onClick={() => copyUrl(previewAsset.fileUrl)}>
                                        <Copy className="mr-2 h-4 w-4" />
                                        Copiar
                                    </Button>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button
                                    variant="destructive"
                                    onClick={() => handleDelete(previewAsset.id)}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Eliminar
                                </Button>
                                <Button onClick={() => window.open(previewAsset.fileUrl, '_blank')}>
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    Abrir
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
