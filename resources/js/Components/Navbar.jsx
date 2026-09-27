import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { ShoppingCart, Menu, X, Sun } from 'lucide-react';
import { useLanguage } from '../Contexts/LanguageContext';
import { useCurrency } from '../Contexts/CurrencyContext';

function Mark() {
    return (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-dark">
            <Sun className="h-5 w-5 text-brand-gold" strokeWidth={2} />
        </span>
    );
}

export default function Navbar({ user: propUser }) {
    const [isOpen, setIsOpen] = useState(false);
    const { language, setLanguage, t } = useLanguage();
    const { currency } = useCurrency();
    const { url, props } = usePage();

    const user = propUser ?? props.auth?.user;
    const cartCount = props.cartCount ?? 0;
    const isAuthenticated = Boolean(user);

    useEffect(() => {
        setIsOpen(false);
    }, [url]);

    // Lock body scroll while the mobile drawer is open so the page behind
    // it can't scroll independently and bleed through the backdrop.
    useEffect(() => {
        if (isOpen) {
            const previousOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = previousOverflow;
            };
        }
    }, [isOpen]);

    const navLinks = [
        { name: t('nav.home'), path: '/' },
        { name: t('nav.shop'), path: '/shop' },
        { name: t('nav.foods'), path: '/foods' },
        { name: t('nav.services'), path: '/services' },
        { name: t('nav.about'), path: '/about' },
    ];

    return (
        <nav className="sticky top-0 z-50 border-b border-brand-brown/10 bg-white/95 backdrop-blur">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-[68px] items-center justify-between">
                    {/* Logo & Desktop Nav */}
                    <div className="flex items-center">
                        <Link href="/" prefetch={['hover', 'viewport']} instant className="flex flex-shrink-0 items-center gap-2.5">
                            <Mark />
                            <span className="font-serif font-bold text-xl text-brand-dark tracking-tight">Mama Africa</span>
                        </Link>
                        <div className="hidden sm:ml-9 sm:flex sm:items-center sm:gap-1">
                            {navLinks.map((link) => {
                                const isActive = url === link.path || (link.path !== '/' && url.startsWith(link.path));
                                return (
                                    <Link
                                        key={link.path}
                                        href={link.path}
                                        prefetch={['hover', 'viewport']}
                                        instant
                                        className={`relative px-3.5 py-2 text-[13.5px] font-semibold transition-colors duration-150 ${
                                            isActive
                                                ? 'text-brand-dark'
                                                : 'text-gray-500 hover:text-brand-brown'
                                        }`}
                                    >
                                        {link.name}
                                        <span className={`absolute inset-x-3 -bottom-px h-[2px] rounded-full bg-brand-gold transition-opacity duration-150 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right side: i18n, Currency, Cart, Profile */}
                    <div className="hidden sm:flex sm:items-center sm:gap-3">
                        <div className="flex items-center rounded-full border border-brand-brown/15 bg-brand-light">
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="rounded-full border-0 bg-transparent py-1.5 pl-3.5 pr-7 text-xs font-semibold text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                            >
                                <option value="en">EN</option>
                                <option value="de">DE</option>
                                <option value="tw">TW</option>
                            </select>
                            <span className="h-4 w-px bg-brand-brown/15" />
                            <span className="px-3.5 text-xs font-semibold text-brand-brown">
                                {currency === 'GHS' ? '₵ GHS' : '€ EUR'}
                            </span>
                        </div>

                        <Link href="/cart" prefetch={['hover', 'viewport']} instant className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-brand-brown transition hover:bg-brand-light focus:outline-none focus:ring-2 focus:ring-brand-gold/40">
                            <ShoppingCart className="h-[19px] w-[19px]" strokeWidth={1.75} />
                            {cartCount > 0 && (
                                <span className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand-gold px-1 text-[10px] font-bold text-white">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        {isAuthenticated ? (
                            <Link href="/profile" prefetch={['hover', 'viewport']} instant className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-dark text-sm font-bold text-brand-gold transition hover:bg-brand-brown focus:outline-none focus:ring-2 focus:ring-brand-gold/40">
                                {(user?.name?.[0] || '?').toUpperCase()}
                            </Link>
                        ) : (
                            <Link href="/login" prefetch={['hover', 'viewport']} instant className="inline-flex items-center rounded-full bg-brand-brown px-5 py-2.5 text-[13.5px] font-semibold text-white transition hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:ring-offset-2">
                                {t('nav.login')}
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center sm:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center rounded-full p-2 text-brand-brown transition hover:bg-brand-light focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                        >
                            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <>
                    <div className="sm:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-all duration-300" onClick={() => setIsOpen(false)} />
                    <div className={`sm:hidden fixed inset-y-0 left-0 z-50 w-[88%] max-w-xs transform bg-white shadow-2xl transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`} onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between border-b border-brand-brown/10 px-4 py-4">
                            <div className="flex items-center gap-2.5">
                                <Mark />
                                <span className="font-serif font-bold text-lg text-brand-dark">Mama Africa</span>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="rounded-full p-2 text-brand-brown hover:bg-brand-light">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="space-y-0.5 px-2 pt-3 pb-2">
                            {navLinks.map((link) => {
                                const isActive = url === link.path || (link.path !== '/' && url.startsWith(link.path));
                                return (
                                    <Link
                                        key={link.path}
                                        href={link.path}
                                        onClick={() => setIsOpen(false)}
                                        className={`block rounded-xl px-3.5 py-2.5 text-[15px] font-semibold transition ${
                                            isActive ? 'bg-brand-light text-brand-dark' : 'text-gray-500 hover:bg-brand-light hover:text-brand-brown'
                                        }`}
                                    >
                                        {link.name}
                                    </Link>
                                );
                            })}
                            <Link href="/cart" onClick={() => setIsOpen(false)} className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-[15px] font-semibold text-gray-500 transition hover:bg-brand-light hover:text-brand-brown">
                                <span className="flex items-center gap-2.5">
                                    <ShoppingCart className="h-[18px] w-[18px]" strokeWidth={1.75} />
                                    {t('nav.cart')}
                                </span>
                                {cartCount > 0 && (
                                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-gold px-1 text-[10px] font-bold text-white">{cartCount}</span>
                                )}
                            </Link>
                            {isAuthenticated ? (
                                <Link href="/profile" onClick={() => setIsOpen(false)} className="block rounded-xl px-3.5 py-2.5 text-[15px] font-semibold text-gray-500 transition hover:bg-brand-light hover:text-brand-brown">
                                    {t('nav.profile')}
                                </Link>
                            ) : (
                                <Link href="/login" onClick={() => setIsOpen(false)} className="mx-3.5 mt-2 block rounded-full bg-brand-brown px-4 py-2.5 text-center text-[15px] font-semibold text-white transition hover:bg-brand-dark">
                                    {t('nav.login')}
                                </Link>
                            )}
                        </div>
                        <div className="flex items-center gap-3 border-t border-brand-brown/10 px-4 py-4">
                            <div className="flex flex-1 items-center rounded-full border border-brand-brown/15 bg-brand-light">
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="flex-1 rounded-full border-0 bg-transparent py-2 pl-3.5 pr-2 text-sm font-semibold text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                                >
                                    <option value="en">EN</option>
                                    <option value="de">DE</option>
                                    <option value="tw">TW</option>
                                </select>
                                <span className="h-4 w-px bg-brand-brown/15" />
                                <span className="px-3.5 text-sm font-semibold text-brand-brown">
                                    {currency === 'GHS' ? '₵ GHS' : '€ EUR'}
                                </span>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </nav>
    );
}
