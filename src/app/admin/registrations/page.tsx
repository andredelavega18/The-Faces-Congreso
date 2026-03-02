import { Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { prisma } from '@/lib/prisma';
import RegistrationsClient from './RegistrationsClient';

async function getRegistrations() {
    const registrations = await prisma.registration.findMany({
        orderBy: { registeredAt: 'desc' },
        include: { checkout: true },
    });

    // Serialize for client component
    return registrations.map((reg) => ({
        id: reg.id,
        fullName: reg.fullName,
        email: reg.email,
        phone: reg.phone,
        country: reg.country,
        paymentStatus: reg.paymentStatus,
        paymentId: reg.paymentId,
        amountPaid: reg.amountPaid ? Number(reg.amountPaid) : null,
        registeredAt: reg.registeredAt.toISOString(),
        checkout: reg.checkout
            ? {
                packageName: reg.checkout.packageName,
                currency: reg.checkout.currency,
            }
            : null,
    }));
}

function RegistrationsLoading() {
    return (
        <Card>
            <CardContent className="p-8">
                <div className="h-8 w-32 animate-pulse rounded bg-muted" />
            </CardContent>
        </Card>
    );
}

async function RegistrationsData() {
    const registrations = await getRegistrations();
    return <RegistrationsClient registrations={registrations} />;
}

export default function RegistrationsPage() {
    return (
        <Suspense fallback={<RegistrationsLoading />}>
            <RegistrationsData />
        </Suspense>
    );
}
