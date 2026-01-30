import type { Config } from 'tailwindcss';

const config: Config = {
    darkMode: ['class'],
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // shadcn/ui theme colors (required for components)
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))',
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))',
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },
                // Brand colors
                primary: {
                    DEFAULT: '#e830ce',
                    foreground: '#ffffff',
                    50: '#fdf2fc',
                    100: '#fce7fb',
                    200: '#f9cef6',
                    300: '#f5a8ed',
                    400: '#ee74e0',
                    500: '#e830ce',
                    600: '#c41fac',
                    700: '#a2188b',
                    800: '#851671',
                    900: '#6e175d',
                    950: '#48043b',
                },
                secondary: {
                    DEFAULT: '#2323ff',
                    foreground: '#ffffff',
                    50: '#eef2ff',
                    100: '#e0e5ff',
                    200: '#c7ceff',
                    300: '#a5a9ff',
                    400: '#8178ff',
                    500: '#6750ff',
                    600: '#5730f7',
                    700: '#4a23db',
                    800: '#3d1eb1',
                    900: '#2323ff',
                    950: '#1a0b5e',
                },
                accent: {
                    DEFAULT: '#2ef8a0',
                    foreground: '#000000',
                    50: '#effef6',
                    100: '#d8ffeb',
                    200: '#b4fdd9',
                    300: '#7af9be',
                    400: '#2ef8a0',
                    500: '#0be07f',
                    600: '#03b965',
                    700: '#079153',
                    800: '#0c7244',
                    900: '#0c5d3a',
                    950: '#00341f',
                },
                danger: {
                    DEFAULT: '#dd2b3a',
                    50: '#fef2f2',
                    100: '#fee2e3',
                    200: '#fecacc',
                    300: '#fca5a9',
                    400: '#f87177',
                    500: '#ef444b',
                    600: '#dd2b3a',
                    700: '#b91c29',
                    800: '#991b26',
                    900: '#7f1d25',
                    950: '#450a0f',
                },
                warning: {
                    DEFAULT: '#f26222',
                    50: '#fff7ed',
                    100: '#ffeed4',
                    200: '#ffd9a8',
                    300: '#ffbc71',
                    400: '#ff9438',
                    500: '#f26222',
                    600: '#e35007',
                    700: '#bc3a08',
                    800: '#962f0f',
                    900: '#792910',
                    950: '#411206',
                },
                neutral: {
                    50: '#fafafa',
                    100: '#f5f5f5',
                    200: '#e5e5e5',
                    300: '#d4d4d4',
                    400: '#a3a3a3',
                    500: '#737373',
                    600: '#525252',
                    700: '#404040',
                    800: '#262626',
                    900: '#171717',
                    950: '#0a0a0a',
                },
                // Chart colors for analytics
                chart: {
                    1: 'hsl(var(--chart-1))',
                    2: 'hsl(var(--chart-2))',
                    3: 'hsl(var(--chart-3))',
                    4: 'hsl(var(--chart-4))',
                    5: 'hsl(var(--chart-5))',
                },
            },
            fontFamily: {
                sans: ['var(--font-geist-sans)', 'Isidora Sans', 'system-ui', 'sans-serif'],
                mono: ['var(--font-geist-mono)', 'monospace'],
                averox: ['Averox', 'sans-serif'],
                isidora: ['Isidora Sans', 'sans-serif'],
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'gradient-primary': 'linear-gradient(135deg, #e830ce 0%, #2323ff 100%)',
                'gradient-accent': 'linear-gradient(135deg, #2ef8a0 0%, #2323ff 100%)',
            },
            keyframes: {
                moveHorizontal: {
                    "0%": {
                        transform: "translateX(-50%) translateY(-10%)",
                    },
                    "50%": {
                        transform: "translateX(50%) translateY(10%)",
                    },
                    "100%": {
                        transform: "translateX(-50%) translateY(-10%)",
                    },
                },
                moveInCircle: {
                    "0%": {
                        transform: "rotate(0deg)",
                    },
                    "50%": {
                        transform: "rotate(180deg)",
                    },
                    "100%": {
                        transform: "rotate(360deg)",
                    },
                },
                moveVertical: {
                    "0%": {
                        transform: "translateY(-50%)",
                    },
                    "50%": {
                        transform: "translateY(50%)",
                    },
                    "100%": {
                        transform: "translateY(-50%)",
                    },
                },
            },
            animation: {
                first: "moveVertical 30s ease infinite",
                second: "moveInCircle 20s reverse infinite",
                third: "moveInCircle 40s linear infinite",
                fourth: "moveHorizontal 40s ease infinite",
                fifth: "moveInCircle 20s ease infinite",
            },
        },
    },
    plugins: [require('tailwindcss-animate')],
};

export default config;
