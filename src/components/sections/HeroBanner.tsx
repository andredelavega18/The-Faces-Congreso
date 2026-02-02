'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

interface HeroBannerProps {
    title?: string;
    date?: string;
    location?: string;
    tagline?: string;
    logo?: string;
    logoSrc?: string;
    showCta?: boolean;
    showMeta?: boolean;
    minHeightClass?: string;
    titleClassName?: string;
    useTypewriter?: boolean;
}

import { BackgroundGradientAnimation } from '@/components/ui/background-gradient-animation';
import { motion } from 'framer-motion';

// Simple Typewriter component
const Typewriter = ({ text, delay = 0 }: { text: string; delay?: number }) => {
    const letters = text.split("");
    return (
        <motion.span
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        staggerChildren: 0.05,
                        delayChildren: delay,
                    },
                },
            }}
        >
            {letters.map((char, index) => (
                <motion.span key={index} variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                    {char}
                </motion.span>
            ))}
        </motion.span>
    );
};

export function HeroBanner({
    title = 'THE FACES MASTER INYECTOR',
    date = '5 y 6 de junio de 2026',
    location = 'Convention Center - Hotel Westin - Lima - Perú',
    tagline = 'SAVE THE DATE!',
    logo = 'THE FACES',
    logoSrc = '/logos/logo.svg',
    showCta = true,
    showMeta = true,
    minHeightClass = 'min-h-[600px]',
    titleClassName = 'font-averox text-3xl font-bold uppercase tracking-[0.22em] text-white sm:text-5xl md:text-6xl drop-shadow-lg',
    useTypewriter = true,
}: HeroBannerProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('/');

    const safeTitle = title?.trim() || 'THE FACES MASTER INYECTOR';
    const safeDate = date?.trim() || '5 y 6 de junio de 2026';
    const safeLocation = location?.trim() || 'Convention Center - Hotel Westin - Lima - Perú';
    const safeTagline = tagline?.trim() || 'SAVE THE DATE!';

    const navLinks = [
        { href: '/', label: 'Inicio' },
        { href: '/#methodology', label: 'Metodologia' },
        { href: '/#speakers', label: 'Speakers' },
        { href: '/#venue', label: 'Ubicacion' },
    ];

    return (
        <div className={`relative w-full overflow-hidden flex flex-col ${minHeightClass}`}>
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 z-0">
                <BackgroundGradientAnimation
                    gradientBackgroundStart="rgb(10, 5, 30)" // Darker start for contrast
                    gradientBackgroundEnd="rgb(20, 10, 60)"  // Dark purple/blueish
                    firstColor="232, 48, 206"    // Brand Pink (#e830ce)
                    secondColor="35, 35, 255"    // Brand Blue (#2323ff)
                    thirdColor="255, 100, 255"   // Lighter Pink
                    fourthColor="80, 80, 255"    // Lighter Blue
                    pointerColor="232, 48, 206"
                    size="50%"                   // Medium size blobs (was 80%)
                    blendingValue="hard-light"
                    className="opacity-100"      // Max opacity for liquid effect
                />
            </div>

            {/* Background Texture Overlay */}
            <div className="absolute inset-0 z-[1] bg-[url('/backgrounds/banner.svg')] bg-cover bg-center opacity-10 mix-blend-overlay pointer-events-none" />


            {/* Navbar Embebido */}
            <nav className="relative z-20 w-full pt-4 sm:pt-6">
                <div className="mx-auto max-w-[62.5rem] px-3 sm:px-4">
                    <div className="flex h-12 items-center justify-between rounded-full border border-white/20 bg-white/10 px-4 shadow-[0_8px_32px_rgba(31,38,135,0.15)] backdrop-blur-md sm:h-14 sm:px-10">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3">
                            {logoSrc ? (
                                <img
                                    src={logoSrc}
                                    alt={logo}
                                    className="h-8 w-auto brightness-0 invert" // Make logo white if image
                                />
                            ) : (
                                <span className="font-averox text-lg font-semibold uppercase tracking-[0.2em] text-white">
                                    {logo}
                                </span>
                            )}
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden items-center gap-8 md:flex">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setActiveSection(link.href)}
                                    className="relative px-3 py-2"
                                >
                                    {activeSection === link.href && (
                                        <motion.div
                                            layoutId="navbar-indicator"
                                            className="absolute inset-0 rounded-full bg-white/10"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative z-10 text-xs font-semibold uppercase tracking-[0.18em] text-white/90 hover:text-white transition-colors">
                                        {link.label}
                                    </span>
                                </Link>
                            ))}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 text-white hover:text-white/80"
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl md:hidden">
                    <div className="flex flex-col items-center justify-center h-full gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-2xl font-medium text-white hover:text-primary transition-colors"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="relative z-10 flex flex-1 w-full flex-col items-center justify-center px-4 py-10 text-center sm:px-8 sm:py-12 md:px-12 md:py-16">
                <div className="flex max-w-4xl flex-col items-center gap-4 text-center sm:gap-6">
                    <h1 className={titleClassName}>
                        {useTypewriter ? (
                            <Typewriter text={safeTitle} delay={0.2} />
                        ) : (
                            <span className="whitespace-pre-line">{safeTitle}</span>
                        )}
                    </h1>

                    {showMeta && (
                        <>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1, duration: 0.8 }}
                                className="flex flex-col gap-2"
                            >
                                <p className="font-isidora text-sm font-semibold uppercase tracking-[0.32em] text-white/90 sm:text-xl">
                                    {safeDate}
                                </p>
                                <p className="font-isidora text-xs font-medium uppercase tracking-[0.28em] text-white/80 sm:text-sm">
                                    {safeLocation}
                                </p>
                            </motion.div>

                            <motion.p
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1.5, duration: 0.5 }}
                                className="pt-4 font-isidora text-sm font-semibold uppercase tracking-[0.3em] text-white sm:text-base"
                            >
                                {safeTagline}
                            </motion.p>
                        </>
                    )}

                    {showCta && (
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.8, duration: 0.6 }}
                            className="pt-6"
                        >
                            <a
                                href="https://master.thefacescongreso.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center rounded-full bg-white/95 px-8 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-slate-900 shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition-all duration-300 border-2 border-transparent hover:scale-105 hover:bg-transparent hover:border-white hover:text-white sm:text-base"
                            >
                                Adquiere tu entrada
                            </a>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
