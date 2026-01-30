import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const configs = await prisma.siteConfig.findMany({
            orderBy: { key: 'asc' },
        });
        return NextResponse.json(configs);
    } catch (error) {
        console.error('Error fetching configs:', error);
        return NextResponse.json({ error: 'Error fetching configs' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const updates: Array<{ key: string; value: unknown }> = await request.json();

        // Upsert each config
        const results = await Promise.all(
            updates.map((update) =>
                prisma.siteConfig.upsert({
                    where: { key: update.key },
                    update: { value: update.value as object },
                    create: {
                        key: update.key,
                        value: update.value as object,
                    },
                })
            )
        );

        return NextResponse.json(results);
    } catch (error) {
        console.error('Error updating configs:', error);
        return NextResponse.json({ error: 'Error updating configs' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const config = await prisma.siteConfig.create({
            data: {
                key: body.key,
                value: body.value,
            },
        });
        return NextResponse.json(config, { status: 201 });
    } catch (error) {
        console.error('Error creating config:', error);
        return NextResponse.json({ error: 'Error creating config' }, { status: 500 });
    }
}
