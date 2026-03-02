'use client';

import { useState } from 'react';
import { Mail, Loader2, Check, X, Download, Filter } from 'lucide-react';
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

interface Registration {
    id: string;
    fullName: string;
    email: string;
    phone: string | null;
    country: string | null;
    paymentStatus: string;
    paymentId: string | null;
    amountPaid: number | null;
    registeredAt: string;
    checkout: {
        packageName: string;
        currency: string;
    } | null;
}

function ResendEmailButton({ registration }: { registration: Registration }) {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    async function handleResend() {
        if (status === 'loading') return;
        setStatus('loading');

        try {
            const res = await fetch('/api/admin/registrations/resend-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ registrationId: registration.id }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                setTimeout(() => setStatus('idle'), 3000);
            } else {
                setStatus('error');
                alert(`Error al enviar correo: ${data.error || 'Error desconocido'}`);
                setTimeout(() => setStatus('idle'), 3000);
            }
        } catch (err) {
            setStatus('error');
            alert(`Error de conexión: ${err instanceof Error ? err.message : String(err)}`);
            setTimeout(() => setStatus('idle'), 3000);
        }
    }

    return (
        <Button
            variant={status === 'success' ? 'default' : status === 'error' ? 'destructive' : 'ghost'}
            size="icon"
            onClick={handleResend}
            disabled={status === 'loading'}
            title={
                status === 'success'
                    ? 'Correo enviado'
                    : status === 'error'
                        ? 'Error al enviar'
                        : 'Reenviar correo de confirmación'
            }
            className="h-8 w-8"
        >
            {status === 'loading' && <Loader2 className="h-4 w-4 animate-spin" />}
            {status === 'success' && <Check className="h-4 w-4" />}
            {status === 'error' && <X className="h-4 w-4" />}
            {status === 'idle' && <Mail className="h-4 w-4" />}
        </Button>
    );
}

export default function RegistrationsClient({ registrations }: { registrations: Registration[] }) {
    const statusColors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
        completed: 'default',
        paid: 'default',
        pending: 'secondary',
        failed: 'destructive',
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Registros</h1>
                    <p className="text-muted-foreground">
                        Lista de inscripciones al evento ({registrations.length})
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
                                    <TableHead className="text-center">Correo</TableHead>
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
                                            {new Date(reg.registeredAt).toLocaleString('es-PE', {
                                                timeZone: 'America/Lima',
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                            })}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <ResendEmailButton registration={reg} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
