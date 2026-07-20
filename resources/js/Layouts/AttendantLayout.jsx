import React, { useEffect, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';

export default function AttendantLayout({ children, shop, title, subtitle }) {
    const { url } = usePage();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        router.post('/logout');
    };

    useEffect(() => {
        setIsMenuOpen(false);
    }, [url]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const navItems = [
        { href: '/attendant', label: 'Dashboard', key: 'dashboard' },
        { href: '/attendant/orders', label: 'Manage Orders', key: 'orders' },
        { href: '/attendant/products', label: 'Shop Inventory', key: 'products' },
        { href: '/attendant/foods', label: 'Food Items', key: 'foods' },
        { href: '/attendant/services', label: 'Shop Services', key: 'services' },
    ];

    const renderSidebar = () => (
        <div className="flex h-full flex-col">
            <div className="px-6 py-5">
                <span className="font-serif text-2xl font-bold tracking-tight text-brand-gold">Mama Africa</span>
                <p className="mt-1 text-xs uppercase tracking-[0.3em] text-gray-400">Attendant Panel</p>
            </div>

            <div className="mx-4 rounded-2xl border border-white/10 bg-white/10 p-4 shadow-inner">
                <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gray-400">Active Location</div>
                <div className="mt-2 truncate text-sm font-semibold text-brand-gold">{shop?.name || 'Your Shop'}</div>
                <div className="truncate text-xs text-gray-300">{shop ? `${shop.city}, ${shop.country}` : 'Pending assignment'}</div>
            </div>

            <nav className="space-y-1 px-4 py-4">
                {navItems.map((item) => {
                    const isActive = url === item.href || (item.href !== '/attendant' && url.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsMenuOpen(false)}
                            className={`flex items-center rounded-xl px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-brand-brown/40 text-white shadow-sm' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}
                        >
                            <span className="mr-3 inline-flex h-2.5 w-2.5 rounded-full bg-brand-gold" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(212,175,55,0.12),_transparent_28%),linear-gradient(135deg,_#f7f3ea_0%,_#fdfcf9_100%)]">
            <div className="mx-auto flex min-h-screen max-w-7xl flex-col lg:flex-row">
                <aside className="hidden border-b border-white/10 bg-brand-dark text-white shadow-xl lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-72 lg:flex-col lg:border-b-0 lg:border-r lg:border-white/10">
                    {renderSidebar()}
                </aside>

                {isMenuOpen && <button type="button" aria-label="Close attendant menu" className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setIsMenuOpen(false)} />}

                <aside className={`fixed inset-y-0 left-0 z-40 w-72 transform border-r border-white/10 bg-brand-dark text-white shadow-2xl transition-transform duration-300 ease-out lg:hidden ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    {renderSidebar()}
                </aside>

                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    <div className="mb-6 flex flex-col gap-3 rounded-3xl border border-gray-200/80 bg-white/80 p-4 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-brown">Store operations</p>
                            <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
                            {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
                        </div>
                        <div className="flex items-center gap-2">
                            <button type="button" className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 lg:hidden" onClick={() => setIsMenuOpen((prev) => !prev)}>
                                {isMenuOpen ? 'Close' : 'Menu'}
                            </button>
                            <button type="button" onClick={handleLogout} className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50">
                                Logout
                            </button>
                        </div>
                    </div>
                    {children}
                </main>
            </div>
        </div>
    );
}
