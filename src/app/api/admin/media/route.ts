import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const assets = await prisma.mediaAsset.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(assets);
    } catch (error) {
        console.error('Error fetching media:', error);
        return NextResponse.json({ error: 'Error fetching media' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const asset = await prisma.mediaAsset.create({
            data: {
                assetType: body.assetType,
                assetCategory: body.assetCategory || null,
                fileName: body.fileName,
                fileUrl: body.fileUrl,
                fileSize: body.fileSize || null,
                mimeType: body.mimeType || null,
                metadata: body.metadata || null,
            },
        });
        return NextResponse.json(asset, { status: 201 });
    } catch (error) {
        console.error('Error creating media:', error);
        return NextResponse.json({ error: 'Error creating media' }, { status: 500 });
    }
}
