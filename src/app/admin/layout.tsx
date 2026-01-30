import type { Metadata } from 'next';
import Link from 'next/link';
import {
    LayoutDashboard,
    Users,
    CreditCard,
    Calendar,
    Settings,
    Image as ImageIcon,
    BarChart3,
    FileText,
    ChevronLeft,
    Menu,
    LogOut,
} from 'lucide-react';
import { signout } from '@/app/login/actions';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
    title: 'Admin Dashboard',
    description: 'Panel de administración de The Faces 2026',
    robots: { index: false, follow: false },
};

const sidebarLinks = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/speakers', label: 'Speakers', icon: Users },
    { href: '/admin/checkouts', label: 'Checkouts', icon: CreditCard },
    { href: '/admin/registrations', label: 'Registros', icon: Calendar },
    { href: '/admin/claims', label: 'Reclamos', icon: FileText },
    { href: '/admin/sections', label: 'Secciones', icon: FileText },
    { href: '/admin/media', label: 'Media', icon: ImageIcon },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/admin/config', label: 'Configuración', icon: Settings },
];

function SidebarContent() {
    return (
        <div className="flex h-full flex-col">
            {/* Logo */}
            <div className="flex h-16 items-center gap-2 border-b border-border px-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                    <span className="text-sm font-bold text-white">TF</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-foreground">The Faces</span>
                    <span className="text-xs text-muted-foreground">Admin Panel</span>
                </div>
            </div>

            {/* Navigation */}
            <ScrollArea className="flex-1 px-3 py-4">
                <nav className="flex flex-col gap-1">
                    {sidebarLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                            <link.icon className="h-4 w-4" />
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </ScrollArea>

            {/* Footer */}
            <Separator />
            <div className="p-4">
                <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                    <ChevronLeft className="h-4 w-4" />
                    Volver al sitio
                </Link>
            </div>
        </div>
    );
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-background">
            {/* Desktop Sidebar */}
            <aside className="hidden w-64 border-r border-border bg-card lg:block">
                <SidebarContent />
            </aside>

            {/* Main Content */}
            <div className="flex flex-1 flex-col">
                {/* Header */}
                <header className="flex h-16 items-center gap-4 border-b border-border bg-card px-6">
                    {/* Mobile menu */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="lg:hidden">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-64 p-0">
                            <SidebarContent />
                        </SheetContent>
                    </Sheet>

                    <div className="flex-1" />

                    {/* User info placeholder */}
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-sm font-medium">Admin</p>
                            <p className="text-xs text-muted-foreground">admin@thefaces.com</p>
                        </div>
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                            A
                        </div>
                        <form action={signout}>
                            <Button variant="ghost" size="icon" title="Cerrar Sesión">
                                <LogOut className="h-5 w-5" />
                            </Button>
                        </form>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-auto p-6">{children}</main>
            </div>
            <Toaster />
        </div>
    );
}
