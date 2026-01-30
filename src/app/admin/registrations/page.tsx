import { Suspense } from 'react';
import { Download, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { prisma } from '@/lib/prisma';

async function getRegistrations() {
    return prisma.registration.findMany({
        orderBy: { registeredAt: 'desc' },
        include: { checkout: true },
    });
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

async function RegistrationsTable() {
    const registrations = await getRegistrations();

    const statusColors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
        completed: 'default',
        pending: 'secondary',
        failed: 'destructive',
    };

    return (
        <Card>
            <CardContent className="p-0">
                {registrations.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                        No hay registros aún
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Teléfono</TableHead>
                                <TableHead>País</TableHead>
                                <TableHead>Paquete</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Monto</TableHead>
                                <TableHead>Fecha</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {registrations.map((reg) => (
                                <TableRow key={reg.id}>
                                    <TableCell className="font-medium">{reg.fullName}</TableCell>
                                    <TableCell>{reg.email}</TableCell>
                                    <TableCell>{reg.phone || '-'}</TableCell>
                                    <TableCell>{reg.country || '-'}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {reg.checkout?.packageName || 'N/A'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={statusColors[reg.paymentStatus] || 'secondary'}>
                                            {reg.paymentStatus}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {reg.amountPaid
                                            ? `$${Number(reg.amountPaid).toFixed(2)}`
                                            : '-'}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {new Date(reg.registeredAt).toLocaleDateString('es-PE')}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}

export default function RegistrationsPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Registros</h1>
                    <p className="text-muted-foreground">
                        Lista de inscripciones al evento
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Filter className="mr-2 h-4 w-4" />
                        Filtrar
                    </Button>
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Exportar CSV
                    </Button>
                </div>
            </div>

            {/* Table */}
            <Suspense fallback={<RegistrationsLoading />}>
                <RegistrationsTable />
            </Suspense>
        </div>
    );
}
