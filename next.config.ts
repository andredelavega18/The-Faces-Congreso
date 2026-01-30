import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    // Standalone output para BanaHosting
    output: 'standalone',

    // Configuración de imágenes para Supabase Storage
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*.supabase.co',
                port: '',
                pathname: '/storage/v1/object/public/**',
            },
            {
                protocol: 'https',
                hostname: '*.supabase.in',
                port: '',
                pathname: '/storage/v1/object/public/**',
            },
        ],
        formats: ['image/avif', 'image/webp'],
        minimumCacheTTL: 60,
    },

    // Optimizaciones experimentales
    experimental: {
        optimizePackageImports: ['lucide-react', '@supabase/supabase-js'],
        serverActions: {
            bodySizeLimit: '10mb',
        },
    },

    turbopack: {
        root: __dirname,
    },

    // Seguridad
    poweredByHeader: false,

    // Compresión
    compress: true,

    // TypeScript estricto
    typescript: {
        ignoreBuildErrors: false,
    },

};

export default nextConfig;
