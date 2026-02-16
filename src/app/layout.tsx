import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
    title: {
        default: 'The Faces 2026 | Master Inyector Congress',
        template: '%s | The Faces 2026',
    },
    description:
        'THE FACES MASTER INYECTOR 2026 - Los mejores en un solo lugar. 5 y 6 de junio de 2026, Lima, Perú.',
    keywords: [
        'The Faces',
        'Master Inyector',
        'congreso',
        'medicina estética',
        '2026',
        'Lima',
        'Perú',
        'inyectables',
        'anatomía facial',
    ],
    authors: [{ name: 'The Faces Team' }],
    creator: 'The Faces Team',
    publisher: 'The Faces',
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    openGraph: {
        type: 'website',
        locale: 'es_PE',
        url: process.env.NEXT_PUBLIC_APP_URL,
        siteName: 'The Faces 2026',
        title: 'The Faces 2026 | Master Inyector Congress',
        description:
            'THE FACES MASTER INYECTOR 2026 - Los mejores en un solo lugar. 5 y 6 de junio de 2026.',
        images: [
            {
                url: '/backgrounds/banner.svg',
                width: 1200,
                height: 630,
                alt: 'The Faces 2026 - Master Inyector Congress',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'The Faces 2026 | Master Inyector Congress',
        description:
            'THE FACES MASTER INYECTOR 2026 - Los mejores en un solo lugar.',
        images: ['/backgrounds/banner.svg'],
    },
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon.ico',
        apple: '/favicon.ico',
    },
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#ffffff' },
        { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
    ],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es" suppressHydrationWarning data-scroll-behavior="smooth">
            <body
                className={`${geistSans.variable} ${geistMono.variable} min-h-screen font-sans antialiased relative`}
            >
                {children}
            </body>
        </html>
    );
}
