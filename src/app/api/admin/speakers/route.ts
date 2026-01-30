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
        'corea': '🇰🇷',
        'corea del sur': '🇰🇷',
        'korea': '🇰🇷',
        'dubai': '🇦🇪',
        'emiratos arabes unidos': '🇦🇪',
        uae: '🇦🇪',
    };

    if (map[normalized]) return map[normalized];
    if (normalized.length === 2) return flagFromCountryCode(normalized) ?? null;
    return null;
}

export async function GET() {
    try {
        const speakers = await prisma.speaker.findMany({
            orderBy: { displayOrder: 'asc' },
        });
        return NextResponse.json(speakers);
    } catch (error) {
        console.error('Error fetching speakers:', error);
        return NextResponse.json({ error: 'Error fetching speakers' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const country = body.country || null;
        const countryFlag = getCountryFlag(country);
        const speaker = await prisma.speaker.create({
            data: {
                name: body.name,
                title: body.title || null,
                country,
                countryFlag,
                bio: body.bio || null,
                description: body.description || null,
                specialties: body.specialties || [],
                imageUrl: body.imageUrl || null,
                mainImageUrl: body.mainImageUrl || null,
                isActive: body.isActive ?? true,
                displayOrder: body.displayOrder || 0,
            },
        });
        return NextResponse.json(speaker, { status: 201 });
    } catch (error) {
        console.error('Error creating speaker:', error);
        return NextResponse.json({ error: 'Error creating speaker' }, { status: 500 });
    }
}
