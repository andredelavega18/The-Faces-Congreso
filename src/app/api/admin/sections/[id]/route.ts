import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        const section = await prisma.eventSection.update({
            where: { id },
            data: {
                ...(body.sectionKey !== undefined && { sectionKey: body.sectionKey }),
                ...(body.sectionName !== undefined && { sectionName: body.sectionName }),
                ...(body.content !== undefined && { content: body.content }),
                ...(body.isVisible !== undefined && { isVisible: body.isVisible }),
                ...(body.displayOrder !== undefined && { displayOrder: body.displayOrder }),
            },
        });
        return NextResponse.json(section);
    } catch (error) {
        console.error('Error updating section:', error);
        return NextResponse.json({ error: 'Error updating section' }, { status: 500 });
    }
}

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.eventSection.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting section:', error);
        return NextResponse.json({ error: 'Error deleting section' }, { status: 500 });
    }
}

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const section = await prisma.eventSection.findUnique({ where: { id } });

        if (!section) {
            return NextResponse.json({ error: 'Section not found' }, { status: 404 });
        }

        return NextResponse.json(section);
    } catch (error) {
        console.error('Error fetching section:', error);
        return NextResponse.json({ error: 'Error fetching section' }, { status: 500 });
    }
}
