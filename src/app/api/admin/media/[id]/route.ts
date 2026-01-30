import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Get the asset to find its URL (for storage deletion if needed)
        const asset = await prisma.mediaAsset.findUnique({ where: { id } });

        if (!asset) {
            return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
        }

        // TODO: Delete from Supabase Storage if needed
        // const { error } = await supabase.storage.from('media').remove([asset.fileName]);

        // Delete from database
        await prisma.mediaAsset.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting media:', error);
        return NextResponse.json({ error: 'Error deleting media' }, { status: 500 });
    }
}

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const asset = await prisma.mediaAsset.findUnique({ where: { id } });

        if (!asset) {
            return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
        }

        return NextResponse.json(asset);
    } catch (error) {
        console.error('Error fetching media:', error);
        return NextResponse.json({ error: 'Error fetching media' }, { status: 500 });
    }
}
