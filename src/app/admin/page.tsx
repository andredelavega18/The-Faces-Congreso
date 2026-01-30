import { Suspense } from 'react';
import { Users, CreditCard, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { prisma } from '@/lib/prisma';

async function getStats() {
    const [speakersCount, checkoutsCount, registrationsCount, recentRegistrations] = await Promise.all([
        prisma.speaker.count({ where: { isActive: true } }),
        prisma.checkoutConfig.count({ where: { isActive: true } }),
        prisma.registration.count(),
        prisma.registration.findMany({
            take: 5,
            orderBy: { registeredAt: 'desc' },
            include: { checkout: true },
        }),
    ]);

    // Calculate days until event (June 5, 2026)
    const eventDate = new Date('2026-06-05');
    const today = new Date();
    const daysUntilEvent = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    return {
        speakers: speakersCount,
        checkouts: checkoutsCount,
        registrations: registrationsCount,
        daysUntilEvent: daysUntilEvent > 0 ? daysUntilEvent : 0,
        recentRegistrations,
    };
}

function StatCard({
    title,
    value,
    description,
    icon: Icon,
    color,
}: {
    title: string;
    value: string | number;
    description?: string;
    icon: React.ElementType;
    color: 'primary' | 'secondary' | 'accent' | 'warning';
}) {
    const colorClasses = {
        primary: 'text-primary',
        secondary: 'text-secondary',
        accent: 'text-accent',
        warning: 'text-warning',
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                <Icon className={`h-5 w-5 ${colorClasses[color]}`} />
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold">{value}</div>
                {description && <p className="text-xs text-muted-foreground">{description}</p>}
            </CardContent>
        </Card>
    );
}

function StatsLoading() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                    <CardHeader className="pb-2">
                        <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                    </CardHeader>
                    <CardContent>
                        <div className="h-8 w-16 animate-pulse rounded bg-muted" />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

async function DashboardStats() {
    const stats = await getStats();

    return (
        <>
            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Registros"
                    value={stats.registrations}
                    description="Total de inscripciones"
                    icon={Calendar}
                    color="primary"
                />
                <StatCard
                    title="Speakers"
                    value={stats.speakers}
                    description="Instructores activos"
                    icon={Users}
                    color="accent"
                />
                <StatCard
                    title="Checkouts"
                    value={stats.checkouts}
                    description="Configuraciones activas"
                    icon={CreditCard}
                    color="secondary"
                />
                <StatCard
                    title="Días para el evento"
                    value={stats.daysUntilEvent}
                    description="5-6 de Junio, 2026"
                    icon={TrendingUp}
                    color="warning"
                />
            </div>

            {/* Recent Registrations */}
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Registros Recientes</CardTitle>
                    <CardDescription>Últimas 5 inscripciones</CardDescription>
                </CardHeader>
                <CardContent>
                    {stats.recentRegistrations.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No hay registros aún</p>
                    ) : (
                        <div className="space-y-4">
                            {stats.recentRegistrations.map((reg) => (
                                <div key={reg.id} className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium">{reg.fullName}</p>
                                        <p className="text-xs text-muted-foreground">{reg.email}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={reg.paymentStatus === 'completed' ? 'default' : 'secondary'}>
                                            {reg.paymentStatus}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">
                                            {reg.checkout?.packageName || 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    );
}

export default function AdminDashboardPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">
                    Bienvenido al panel de administración de The Faces 2026
                </p>
            </div>

            {/* Stats with Suspense */}
            <Suspense fallback={<StatsLoading />}>
                <DashboardStats />
            </Suspense>
        </div>
    );
}
