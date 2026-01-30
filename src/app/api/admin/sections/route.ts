import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const sections = await prisma.eventSection.findMany({
            orderBy: { displayOrder: 'asc' },
        });
        return NextResponse.json(sections);
    } catch (error) {
        console.error('Error fetching sections:', error);
        return NextResponse.json({ error: 'Error fetching sections' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Get next display order
        const lastSection = await prisma.eventSection.findFirst({
            orderBy: { displayOrder: 'desc' },
        });
        const nextOrder = (lastSection?.displayOrder ?? 0) + 1;

        const section = await prisma.eventSection.create({
            data: {
                sectionKey: body.sectionKey,
                sectionName: body.sectionName,
                content: body.content,
                isVisible: body.isVisible ?? true,
                displayOrder: nextOrder,
            },
        });
        return NextResponse.json(section, { status: 201 });
    } catch (error) {
        console.error('Error creating section:', error);
        return NextResponse.json({ error: 'Error creating section' }, { status: 500 });
    }
}
