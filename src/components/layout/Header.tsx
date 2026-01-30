'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
    logo?: string;
    logoSrc?: string;
    transparent?: boolean;
    variant?: 'light' | 'dark';
}

export function Navbar({
    logo = 'THE FACES',
    logoSrc,
    variant = 'light',
}: NavbarProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const isDark = variant === 'dark';

    const navLinks = [
        { href: '/', label: 'Inicio' },
        { href: '/#intro', label: 'Metodologia' },
        { href: '/#speakers', label: 'Speakers' },
        { href: '/#tickets', label: 'Entradas' },
        { href: '/#venue', label: 'Ubicacion' },
        { href: '/libro-de-reclamaciones', label: 'Libro de Reclamaciones' },
    ];

    const linkClasses = isDark
        ? 'text-xs font-semibold uppercase tracking-[0.18em] text-white/80 hover:text-white transition-colors'
        : 'text-xs font-semibold uppercase tracking-[0.18em] text-slate-500/80 hover:text-slate-700 transition-colors';

    const containerClasses = isDark
        ? 'flex h-14 items-center justify-between rounded-full border border-white/20 bg-white/10 px-10 shadow-[0_8px_32px_rgba(31,38,135,0.15)] backdrop-blur-md'
        : 'flex h-14 items-center justify-between rounded-full border border-white/50 bg-white/30 px-10 shadow-[0_8px_32px_rgba(31,38,135,0.15)] backdrop-blur-sm backdrop-saturate-150';

    return (
        <>
            <nav
                className="fixed left-0 right-0 top-4 z-50 transition-all duration-300"
            >
                <div className="mx-auto max-w-[81.25rem] px-4 sm:px-6 lg:px-8">
                    <div className={containerClasses}>
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3">
                            {logoSrc ? (
                                <img
                                    src={logoSrc}
                                    alt={logo}
                                    width={120}
                                    height={32}
                                    className={`h-8 w-auto${isDark ? ' brightness-0 invert' : ''}`}
                                />
                            ) : null}
                            {logoSrc ? (
                                <span className="sr-only">{logo}</span>
                            ) : (
                                <span className={`font-averox text-lg font-semibold uppercase tracking-[0.2em] ${isDark ? 'text-white' : 'text-slate-500'}`}>
                                    {logo}
                                </span>
                            )}
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden items-center gap-8 md:flex">
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className={linkClasses}
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>

                        {/* CTA Button */}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className={`md:hidden p-2 ${isDark ? 'text-white hover:text-white/80' : 'text-slate-600 hover:text-slate-900'}`}
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
                <div className={`fixed inset-0 z-[60] backdrop-blur-xl md:hidden ${isDark ? 'bg-black/95' : 'bg-white/95'}`}>
                    {/* Explicit Close Button for better UX */}
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`absolute top-6 right-6 p-2 rounded-full border transition-all ${isDark ? 'border-white/20 text-white hover:bg-white/10' : 'border-slate-200 text-slate-800 hover:bg-slate-100'}`}
                        aria-label="Cerrar menú"
                    >
                        <X className="h-8 w-8" />
                    </button>

                    <div className="flex flex-col items-center justify-center h-full gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`text-2xl font-medium transition-colors ${isDark ? 'text-white hover:text-primary' : 'text-slate-800 hover:text-primary'}`}
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
