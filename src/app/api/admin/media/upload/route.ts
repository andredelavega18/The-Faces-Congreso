import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';

// Create Supabase client with service role for storage operations
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Bucket mapping based on schema.sql:
// - speakers: fotos de ponentes
// - hero-images: imágenes del hero/landing
// - sponsors: logos de patrocinadores
// - documents: PDFs y documentos (privado)
// - videos: videos del evento

function getBucketForFile(mimeType: string, category?: string): string {
    // If category is specified, use it
    if (category) {
        const categoryMap: Record<string, string> = {
            'speaker': 'speakers',
            'speakers': 'speakers',
            'hero': 'hero-images',
            'sponsor': 'sponsors',
            'sponsors': 'sponsors',
            'document': 'documents',
            'documents': 'documents',
            'video': 'videos',
            'videos': 'videos',
        };
        return categoryMap[category.toLowerCase()] || 'hero-images';
    }

    // Auto-detect based on mime type
    if (mimeType.startsWith('video/')) {
        return 'videos';
    }
    if (mimeType === 'application/pdf' || mimeType.includes('document')) {
        return 'documents';
    }
    // Default to hero-images for general images
    return 'hero-images';
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const files = formData.getAll('files') as File[];
        const category = formData.get('category') as string | null;

        if (!files || files.length === 0) {
            return NextResponse.json({ error: 'No files provided' }, { status: 400 });
        }

        const uploadedAssets = [];

        for (const file of files) {
            // Determine asset type
            let assetType = 'document';
            if (file.type.startsWith('image/')) {
                assetType = 'image';
            } else if (file.type.startsWith('video/')) {
                assetType = 'video';
            }

            // Determine bucket
            const bucket = getBucketForFile(file.type, category || undefined);

            // Generate unique filename
            const timestamp = Date.now();
            const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
            const fileName = `${timestamp}-${cleanName}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false,
                });

            if (uploadError) {
                console.error('Upload error:', uploadError);
                continue; // Skip this file but continue with others
            }

            // Get public URL
            const { data: urlData } = supabase.storage
                .from(bucket)
                .getPublicUrl(fileName);

            // Save to database
            const asset = await prisma.mediaAsset.create({
                data: {
                    assetType,
                    assetCategory: category || bucket,
                    fileName: file.name,
                    fileUrl: urlData.publicUrl,
                    fileSize: file.size,
                    mimeType: file.type,
                },
            });

            uploadedAssets.push(asset);
        }

        return NextResponse.json({
            success: true,
            uploaded: uploadedAssets.length,
            assets: uploadedAssets,
        });
    } catch (error) {
        console.error('Error uploading files:', error);
        return NextResponse.json({ error: 'Error uploading files' }, { status: 500 });
    }
}
