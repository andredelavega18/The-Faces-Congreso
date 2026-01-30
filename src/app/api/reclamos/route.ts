import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const claimSchema = z.object({
    consumerName: z.string().min(3),
    documentType: z.enum(['DNI', 'CE', 'PASAPORTE']),
    documentNumber: z.string().min(5).max(30).regex(/^[0-9]+$/),
    email: z.string().email(),
    phone: z.string().min(6).max(50).optional().or(z.literal('')),
    address: z.string().min(3).max(255),
    requestType: z.enum(['RECLAMO', 'QUEJA']),
    serviceType: z.enum(['PRESENCIAL', 'VIRTUAL']),
    orderNumber: z.string().max(50).optional().or(z.literal('')),
    incidentDate: z.string(),
    claimedAmount: z.number().nonnegative().optional(),
    description: z.string().min(10),
    requestDetail: z.string().min(10),
    acceptPrivacy: z.literal(true),
});

function buildClaimCode(sequence: number) {
    const padded = String(sequence).padStart(6, '0');
    return `TFMI-2026-${padded}`;
}

async function sendEmail({
    to,
    subject,
    html,
}: {
    to: string;
    subject: string;
    html: string;
}) {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM || 'no-reply@thefaces2026.com';

    if (!apiKey) {
        return { ok: false, error: 'RESEND_API_KEY not configured' };
    }

    const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            from,
            to,
            subject,
            html,
        }),
    });

    if (!res.ok) {
        const errorText = await res.text();
        return { ok: false, error: errorText };
    }

    return { ok: true };
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const result = claimSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: 'Datos inválidos', details: result.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const data = result.data;
        const incidentDate = new Date(data.incidentDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (Number.isNaN(incidentDate.getTime()) || incidentDate > today) {
            return NextResponse.json(
                { error: 'Fecha del hecho inválida' },
                { status: 400 }
            );
        }

        const created = await prisma.claim.create({
            data: {
                consumerName: data.consumerName,
                documentType: data.documentType,
                documentNumber: data.documentNumber,
                email: data.email,
                phone: data.phone || undefined,
                address: data.address,
                requestType: data.requestType,
                serviceType: data.serviceType,
                orderNumber: data.orderNumber || undefined,
                incidentDate,
                claimedAmount: data.claimedAmount,
                description: data.description,
                requestDetail: data.requestDetail,
            },
        });

        const claimCode = buildClaimCode(created.claimNumber);
        const updated = await prisma.claim.update({
            where: { id: created.id },
            data: { claimCode },
        });

        const emailResult = await sendEmail({
            to: updated.email,
            subject: 'Libro de Reclamaciones - Registro de Reclamo',
            html: `
                <div style="font-family: Arial, sans-serif; line-height:1.6;">
                    <h2>Tu reclamo ha sido registrado correctamente.</h2>
                    <p><strong>Codigo de reclamo:</strong> ${claimCode}</p>
                    <p><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-PE')}</p>
                    <p><strong>Resumen:</strong> ${updated.requestType} - ${updated.serviceType}</p>
                    <p><strong>Detalle:</strong> ${updated.description}</p>
                    <p>Plazo de respuesta: 30 dias calendario.</p>
                </div>
            `,
        });

        return NextResponse.json({
            success: true,
            claimCode,
            emailSent: emailResult.ok,
            emailError: emailResult.ok ? undefined : emailResult.error,
        });
    } catch (error) {
        console.error('Error creating claim:', error);
        return NextResponse.json(
            { error: 'Error al registrar el reclamo' },
            { status: 500 }
        );
    }
}
