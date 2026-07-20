import React, { useEffect, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';

export default function AdminLayout({ children }) {
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

    const links = [
        { href: '/admin', label: 'Dashboard', match: (current) => current === '/admin' },
        { href: '/admin/shops', label: 'Manage Shops', match: (current) => current.startsWith('/admin/shops') },
        { href: '/admin/products', label: 'Manage Products', match: (current) => current.startsWith('/admin/products') },
        { href: '/admin/foods', label: 'Manage Foods', match: (current) => current.startsWith('/admin/foods') },
        { href: '/admin/services', label: 'Manage Services', match: (current) => current.startsWith('/admin/services') },
        { href: '/admin/orders', label: 'Manage Orders', match: (current) => current.startsWith('/admin/orders') },
        { href: '/admin/users', label: 'Manage Users', match: (current) => current.startsWith('/admin/users') },
        { href: '/admin/homepage', label: 'Homepage Settings', match: (current) => current.startsWith('/admin/homepage') },
    ];

    const renderSidebar = () => (
        <div className="flex h-full flex-col">
            <div className="p-6">
                <span className="font-serif text-2xl font-bold tracking-tight text-brand-gold">Mama Africa</span>
                <p className="mt-1 text-xs uppercase tracking-[0.3em] text-gray-400">Admin Control Panel</p>
            </div>
            <div className="mx-4 rounded-2xl border border-white/10 bg-white/10 p-4 shadow-inner">
                <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gray-400">System Status</div>
                <div className="mt-2 truncate text-sm font-semibold text-brand-gold">Fully Operational</div>
                <div className="truncate text-xs text-gray-300">Mama Africa Global Admin</div>
            </div>
            <nav className="space-y-1 px-4 py-4">
                {links.map((link) => {
                    const isActive = link.match(url);
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsMenuOpen(false)}
                            className={`flex items-center rounded-xl px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-brand-brown/40 text-white shadow-sm' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}
                        >
                            <span className="mr-3 inline-flex h-2.5 w-2.5 rounded-full bg-brand-gold" />
                            {link.label}
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

                {isMenuOpen && <button type="button" aria-label="Close admin menu" className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setIsMenuOpen(false)} />}

                <aside className={`fixed inset-y-0 left-0 z-40 w-72 transform border-r border-white/10 bg-brand-dark text-white shadow-2xl transition-transform duration-300 ease-out lg:hidden ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    {renderSidebar()}
                </aside>

                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    <div className="mb-6 flex flex-col gap-3 rounded-3xl border border-gray-200/80 bg-white/80 p-4 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-brown">Management suite</p>
                            <h1 className="text-2xl font-semibold text-gray-900">Operations dashboard</h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <button type="button" className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 lg:hidden" onClick={() => setIsMenuOpen((prev) => !prev)}>
                                {isMenuOpen ? 'Close' : 'Menu'}
                            </button>
                            <button onClick={handleLogout} className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50">Logout</button>
                        </div>
                    </div>
                    {children}
                </main>
            </div>
        </div>
    );
}
