'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { FileText, Loader2, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Claim {
    id: string;
    claimCode: string;
    consumerName: string;
    email: string;
    requestType: string;
    status: string;
    createdAt: string;
    documentType: string;
    documentNumber: string;
    phone: string;
    address: string;
    serviceType: string;
    orderNumber?: string;
    incidentDate: string;
    description: string;
    requestDetail: string;
    claimedAmount?: number;
}

export default function ClaimsAdminPage() {
    const [claims, setClaims] = useState<Claim[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);
    const { toast } = useToast();

    const fetchClaims = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/claims');
            if (res.ok) {
                const data = await res.json();
                setClaims(data);
            }
        } catch (error) {
            console.error('Error fetching claims:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClaims();
    }, []);

    const updateStatus = async (id: string, newStatus: string) => {
        setUpdating(id);
        try {
            const res = await fetch(`/api/admin/claims/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                setClaims(claims.map(c => c.id === id ? { ...c, status: newStatus } : c));
                toast({
                    title: 'Estado actualizado',
                    description: `El reclamo se marcó como ${newStatus}`,
                });
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'No se pudo actualizar el estado',
                variant: 'destructive',
            });
        } finally {
            setUpdating(null);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Libro de Reclamaciones</h1>
                    <p className="text-muted-foreground">Gestiona las quejas y reclamos de los clientes</p>
                </div>
                <Button variant="outline" size="sm" onClick={fetchClaims}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Actualizar
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Lista de Reclamos</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Fecha</TableHead>
                                <TableHead>Código</TableHead>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {claims.map((claim) => (
                                <TableRow key={claim.id}>
                                    <TableCell>{new Date(claim.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell className="font-medium">{claim.claimCode}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span>{claim.consumerName}</span>
                                            <span className="text-xs text-muted-foreground">{claim.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{claim.requestType}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            defaultValue={claim.status}
                                            onValueChange={(val) => updateStatus(claim.id, val)}
                                            disabled={updating === claim.id}
                                        >
                                            <SelectTrigger className="w-[130px]">
                                                {updating === claim.id ? (
                                                    <Loader2 className="h-3 w-3 animate-spin" />
                                                ) : (
                                                    <SelectValue />
                                                )}
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Pendiente">Pendiente</SelectItem>
                                                <SelectItem value="En proceso">En proceso</SelectItem>
                                                <SelectItem value="Atendido">Atendido</SelectItem>
                                                <SelectItem value="Rechazado">Rechazado</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <FileText className="h-4 w-4 mr-2" />
                                                    Ver Detalle
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                                <DialogHeader>
                                                    <DialogTitle>Detalle del Reclamo - {claim.claimCode}</DialogTitle>
                                                </DialogHeader>
                                                <div className="grid gap-4 py-4">
                                                    <div className="grid grid-cols-2 gap-4 border-b pb-4">
                                                        <div>
                                                            <p className="text-xs font-semibold text-muted-foreground uppercase">Consumidor</p>
                                                            <p className="text-sm">{claim.consumerName}</p>
                                                            <p className="text-sm text-muted-foreground">{claim.documentType} {claim.documentNumber}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-semibold text-muted-foreground uppercase">Contacto</p>
                                                            <p className="text-sm">{claim.email}</p>
                                                            <p className="text-sm text-muted-foreground">{claim.phone}</p>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4 border-b pb-4">
                                                        <div>
                                                            <p className="text-xs font-semibold text-muted-foreground uppercase">Solicitud</p>
                                                            <p className="text-sm">{claim.requestType} - {claim.serviceType}</p>
                                                            {claim.orderNumber && <p className="text-sm text-muted-foreground">Pedido: {claim.orderNumber}</p>}
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-semibold text-muted-foreground uppercase">Fecha Incidente</p>
                                                            <p className="text-sm">{new Date(claim.incidentDate).toLocaleDateString()}</p>
                                                            {claim.claimedAmount && <p className="text-sm text-muted-foreground">Monto: S/ {Number(claim.claimedAmount).toFixed(2)}</p>}
                                                        </div>
                                                    </div>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <p className="text-xs font-semibold text-muted-foreground uppercase">Descripción del hecho</p>
                                                            <div className="mt-1 text-sm bg-muted p-3 rounded-md italic">
                                                                "{claim.description}"
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-semibold text-muted-foreground uppercase">Pedido Concreto</p>
                                                            <div className="mt-1 text-sm bg-primary/5 p-3 border border-primary/10 rounded-md font-medium">
                                                                "{claim.requestDetail}"
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {claims.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                        No se encontraron reclamos registrados.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
