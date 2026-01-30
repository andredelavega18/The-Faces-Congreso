import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function normalizeCountry(input: string) {
    return input
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

function flagFromCountryCode(code: string) {
    if (code.length !== 2) return null;
    const upper = code.toUpperCase();
    const first = upper.codePointAt(0);
    const second = upper.codePointAt(1);
    if (!first || !second) return null;
    return String.fromCodePoint(0x1f1e6 + (first - 65), 0x1f1e6 + (second - 65));
}

function getCountryFlag(country?: string | null) {
    if (!country) return null;
    const normalized = normalizeCountry(country);

    const map: Record<string, string> = {
        argentina: '🇦🇷',
        bolivia: '🇧🇴',
        brasil: '🇧🇷',
        brazil: '🇧🇷',
        chile: '🇨🇱',
        colombia: '🇨🇴',
        ecuador: '🇪🇨',
        espana: '🇪🇸',
        francia: '🇫🇷',
        mexico: '🇲🇽',
        paraguay: '🇵🇾',
        peru: '🇵🇪',
        uruguay: '🇺🇾',
        venezuela: '🇻🇪',
        'estados unidos': '🇺🇸',
        'united states': '🇺🇸',
        usa: '🇺🇸',
        canada: '🇨🇦',
        alemania: '🇩🇪',
        italia: '🇮🇹',
        'reino unido': '🇬🇧',
        uk: '🇬🇧',
        corea: '🇰🇷',
        'corea del sur': '🇰🇷',
        korea: '🇰🇷',
        dubai: '🇦🇪',
        'emiratos arabes unidos': '🇦🇪',
        uae: '🇦🇪',
    };

    if (map[normalized]) return map[normalized];
    if (normalized.length === 2) return flagFromCountryCode(normalized) ?? null;
    return null;
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const country = body.country;
        const countryFlag = country !== undefined ? getCountryFlag(country) : undefined;

        const speaker = await prisma.speaker.update({
            where: { id },
            data: {
                ...(body.name !== undefined && { name: body.name }),
                ...(body.title !== undefined && { title: body.title || null }),
                ...(body.country !== undefined && { country: body.country || null }),
                ...(countryFlag !== undefined && { countryFlag }),
                ...(body.bio !== undefined && { bio: body.bio || null }),
                ...(body.description !== undefined && { description: body.description || null }),
                ...(body.specialties !== undefined && { specialties: body.specialties }),
                ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl || null }),
                ...(body.mainImageUrl !== undefined && { mainImageUrl: body.mainImageUrl || null }),
                ...(body.isActive !== undefined && { isActive: body.isActive }),
                ...(body.displayOrder !== undefined && { displayOrder: body.displayOrder }),
            },
        });
        return NextResponse.json(speaker);
    } catch (error) {
        console.error('Error updating speaker:', error);
        return NextResponse.json({ error: 'Error updating speaker' }, { status: 500 });
    }
}

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.speaker.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting speaker:', error);
        return NextResponse.json({ error: 'Error deleting speaker' }, { status: 500 });
    }
}
