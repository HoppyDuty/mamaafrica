import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { ShoppingCart, Menu, X, User as UserIcon } from 'lucide-react';
import { useLanguage } from '../Contexts/LanguageContext';
import { useCurrency } from '../Contexts/CurrencyContext';

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

    const navLinks = [
        { name: t('nav.home'), path: '/' },
        { name: t('nav.shop'), path: '/shop' },
        { name: t('nav.foods'), path: '/foods' },
        { name: t('nav.services'), path: '/services' },
        { name: t('nav.about'), path: '/about' },
    ];

    return (
        <nav className="bg-white shadow-soft sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo & Desktop Nav */}
                    <div className="flex items-center">
                        <Link href="/" prefetch={['hover', 'viewport']} instant className="flex-shrink-0 flex items-center">
                            <span className="font-serif font-bold text-2xl text-brand-brown tracking-tight">Mama Africa</span>
                        </Link>
                        <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
                            {navLinks.map((link) => {
                                const isActive = url === link.path || (link.path !== '/' && url.startsWith(link.path));
                                return (
                                    <Link 
                                        key={link.path}
                                        href={link.path} 
                                        prefetch={['hover', 'viewport']}
                                        instant
                                        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-semibold transition-colors duration-200 ${
                                            isActive 
                                                ? 'border-brand-gold text-brand-dark' 
                                                : 'border-transparent text-gray-500 hover:text-brand-brown hover:border-brand-gold/50'
                                        }`}
                                    >
                                        {link.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right side: i18n, Currency, Cart, Profile */}
                    <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
                        <select 
                            value={language} 
                            onChange={(e) => setLanguage(e.target.value)}
                            className="block w-full pl-3 pr-10 py-1 text-sm border-gray-300 focus:outline-none focus:ring-brand-gold focus:border-brand-gold rounded-md"
                        >
                            <option value="en">🇬🇧 EN</option>
                            <option value="de">🇩🇪 DE</option>
                            <option value="tw">🇬🇭 TW</option>
                        </select>

                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-brand-gold/10 text-brand-brown border border-brand-gold/20">
                            {currency === 'GHS' ? '₵ GHS' : '€ EUR'}
                        </span>

                        <Link href="/cart" prefetch={['hover', 'viewport']} instant className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand-brown/20 bg-brand-brown/5 text-brand-brown shadow-sm transition hover:bg-brand-brown/10 focus:outline-none focus:ring-2 focus:ring-brand-gold">
                            <ShoppingCart className="h-5 w-5" />
                            {cartCount > 0 && (
                                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-gold px-1 text-[10px] font-bold text-white">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        {isAuthenticated ? (
                            <Link href="/profile" prefetch={['hover', 'viewport']} instant className="p-2 text-gray-400 hover:text-brand-brown">
                                <UserIcon className="h-6 w-6" />
                            </Link>
                        ) : (
                            <Link href="/login" prefetch={['hover', 'viewport']} instant className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-brown hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold">
                                {t('nav.login')}
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center sm:hidden">
                        <button 
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-gold"
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
                    <div className={`sm:hidden fixed inset-y-0 left-0 z-50 w-[88%] max-w-xs transform bg-white border-r border-gray-100 shadow-2xl transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`} onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-200">
                            <div>
                                <p className="text-sm font-semibold text-gray-900">Mama Africa</p>
                                <p className="text-xs text-gray-500">Navigation</p>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="pt-2 pb-3 space-y-1">
                            <Link href="/" onClick={() => setIsOpen(false)} className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                                {t('nav.home')}
                            </Link>
                            <Link href="/shop" onClick={() => setIsOpen(false)} className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                                {t('nav.shop')}
                            </Link>
                            <Link href="/services" onClick={() => setIsOpen(false)} className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                                {t('nav.services')}
                            </Link>
                            <Link href="/foods" onClick={() => setIsOpen(false)} className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                                {t('nav.foods')}
                            </Link>
                            <Link href="/about" onClick={() => setIsOpen(false)} className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                                {t('nav.about')}
                            </Link>
                            <Link href="/cart" onClick={() => setIsOpen(false)} className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                                {t('nav.cart')}
                                {cartCount > 0 && (
                                    <span className="ml-2 inline-flex rounded-full bg-brand-gold px-2 py-0.5 text-[10px] font-bold text-white">{cartCount}</span>
                                )}
                            </Link>
                            {isAuthenticated ? (
                                <Link href="/profile" onClick={() => setIsOpen(false)} className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                                    {t('nav.profile')}
                                </Link>
                            ) : (
                                <Link href="/login" onClick={() => setIsOpen(false)} className="border-transparent text-brand-brown font-bold hover:bg-gray-50 hover:border-gray-300 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                                    {t('nav.login')}
                                </Link>
                            )}
                        </div>
                        <div className="pt-4 pb-3 border-t border-gray-200 px-4">
                            <div className="flex items-center justify-between gap-3">
                                <select 
                                    value={language} 
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-base text-gray-700 focus:border-brand-gold focus:outline-none focus:ring-brand-gold"
                                >
                                    <option value="en">EN</option>
                                    <option value="de">DE</option>
                                    <option value="tw">TW</option>
                                </select>
                            </div>
                            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-gold/10 px-3 py-2 text-xs font-bold text-brand-brown border border-brand-gold/20">
                                {currency === 'GHS' ? '₵ GHS' : '€ EUR'}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </nav>
    );
}
