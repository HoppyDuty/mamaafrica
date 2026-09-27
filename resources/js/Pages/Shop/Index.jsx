import React, { useState } from 'react';
import { Head, Link, router, Deferred } from '@inertiajs/react';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import ProductCard from '../../Components/ProductCard';

const ProductCardSkeleton = () => (
    <div className="overflow-hidden rounded-2xl border border-brand-brown/10 bg-white animate-pulse">
        <div className="aspect-[4/5] w-full bg-gray-100" />
        <div className="p-5">
            <div className="h-3 w-1/3 rounded bg-gray-100" />
            <div className="mt-3 h-4 w-3/4 rounded bg-gray-100" />
            <div className="mt-4 h-8 w-full rounded-full bg-gray-100" />
        </div>
    </div>
);

export default function ShopIndex({ products = { data: [], links: [], total: 0 }, categories = [], filters = {}, auth }) {
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const [priceDraft, setPriceDraft] = useState({ min: filters.min_price || '', max: filters.max_price || '' });

    const productCollection = products ?? { data: [], links: [], total: 0 };
    const productItems = Array.isArray(productCollection.data) ? productCollection.data : [];
    const productLinks = Array.isArray(productCollection.links) ? productCollection.links : [];

    const visitShop = (params) => {
        // No preserveScroll: filter changes should always land back at the top of the page.
        router.get('/shop', params, { preserveState: true, only: ['products', 'filters'] });
    };

    const handleFilterChange = (key, value) => {
        visitShop({ ...filters, [key]: value });
    };

    const handlePriceApply = () => {
        visitShop({
            ...filters,
            min_price: priceDraft.min,
            max_price: priceDraft.max,
        });
    };

    const hasActiveFilters = Boolean(filters.search || filters.category || filters.country || filters.min_price || filters.max_price);
    const totalCount = productCollection.total ?? productItems.length;

    const renderFilterContent = () => (
        <div className="space-y-6">
            <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Search</label>
                <input
                    type="text"
                    placeholder="Search products..."
                    value={filters.search || ''}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full text-sm"
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Category</label>
                <div className="space-y-1">
                    <button
                        type="button"
                        onClick={() => handleFilterChange('category', '')}
                        className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition ${!filters.category ? 'bg-brand-brown text-white' : 'text-gray-600 hover:bg-brand-light'}`}
                    >
                        All categories
                    </button>
                    {categories?.map(cat => (
                        <div key={cat.id}>
                            <button
                                type="button"
                                onClick={() => handleFilterChange('category', cat.slug)}
                                className={`w-full rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${filters.category === cat.slug ? 'bg-brand-brown text-white' : 'text-brand-dark hover:bg-brand-light'}`}
                            >
                                {cat.name}
                            </button>
                            {cat.children?.map(child => (
                                <button
                                    key={child.id}
                                    type="button"
                                    onClick={() => handleFilterChange('category', child.slug)}
                                    className={`w-full rounded-lg py-1.5 pl-6 pr-3 text-left text-xs font-medium transition ${filters.category === child.slug ? 'bg-brand-gold/15 font-bold text-brand-brown' : 'text-gray-500 hover:bg-brand-light'}`}
                                >
                                    {child.name}
                                </button>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Location</label>
                <div className="flex gap-2">
                    {[['', 'All'], ['DE', 'Germany'], ['GH', 'Ghana']].map(([value, label]) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => handleFilterChange('country', value)}
                            className={`flex-1 rounded-lg border py-2 text-xs font-medium transition ${(filters.country || '') === value ? 'border-brand-brown bg-brand-brown text-white' : 'border-brand-brown/15 text-gray-600 hover:bg-brand-light'}`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Price range (€)</label>
                <div className="grid grid-cols-2 gap-2">
                    <input
                        type="number"
                        inputMode="decimal"
                        min="0"
                        placeholder="Min"
                        value={priceDraft.min}
                        onChange={(e) => setPriceDraft((prev) => ({ ...prev, min: e.target.value }))}
                        className="w-full text-sm"
                    />
                    <input
                        type="number"
                        inputMode="decimal"
                        min="0"
                        placeholder="Max"
                        value={priceDraft.max}
                        onChange={(e) => setPriceDraft((prev) => ({ ...prev, max: e.target.value }))}
                        className="w-full text-sm"
                    />
                </div>
                <button
                    type="button"
                    onClick={handlePriceApply}
                    className="mt-3 w-full rounded-full border border-brand-brown/20 px-3 py-2 text-sm font-medium text-brand-brown transition hover:bg-brand-light"
                >
                    Apply price filter
                </button>
            </div>

            <div className="flex flex-col gap-3 border-t border-brand-brown/10 pt-4">
                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={() => {
                            visitShop({});
                            setIsMobileFiltersOpen(false);
                        }}
                        className="w-full rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                        Clear filters
                    </button>
                )}
                <button
                    type="button"
                    onClick={() => setIsMobileFiltersOpen(false)}
                    className="w-full rounded-full bg-brand-brown px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark md:hidden"
                >
                    Show results
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen flex-col bg-brand-light">
            <Head title="Shop" />
            <Navbar user={auth?.user} />

            <div className="relative overflow-hidden bg-brand-dark py-14 text-center text-white">
                <div className="pointer-events-none absolute -left-16 -top-24 h-72 w-72 rounded-full bg-brand-gold/10 blur-3xl" />
                <div className="relative mx-auto max-w-2xl px-4">
                    <h1 className="font-serif text-4xl font-bold">Shop our collection</h1>
                    <p className="mt-4 text-gray-300">Premium beauty products, fashion styles, and accessories from Mama Africa.</p>
                </div>
            </div>

            <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col gap-8 px-4 py-8 sm:px-6 sm:py-12 md:flex-row lg:px-8">
                <div className="flex items-center justify-between rounded-2xl border border-brand-brown/10 bg-white px-4 py-3 md:hidden">
                    <button
                        type="button"
                        onClick={() => setIsMobileFiltersOpen(true)}
                        className="flex items-center gap-2 text-sm font-semibold text-brand-brown"
                    >
                        <span>Filter & sort</span>
                        <span className="rounded-full bg-brand-gold/10 px-2 py-0.5 text-xs text-brand-brown">{totalCount}</span>
                    </button>
                    {hasActiveFilters ? (
                        <button type="button" onClick={() => visitShop({})} className="text-sm text-gray-500 hover:text-brand-brown">
                            Reset
                        </button>
                    ) : (
                        <span className="text-sm text-gray-500">Showing {totalCount}</span>
                    )}
                </div>

                <aside className="hidden w-full flex-shrink-0 md:block md:w-64">
                    <div className="sticky top-24 rounded-2xl border border-brand-brown/10 bg-white p-6">
                        <h3 className="mb-4 border-b border-brand-brown/10 pb-3 text-lg font-bold text-brand-dark">Filters</h3>
                        {renderFilterContent()}
                    </div>
                </aside>

                {isMobileFiltersOpen && (
                    <>
                        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-all duration-300 md:hidden" onClick={() => setIsMobileFiltersOpen(false)} />
                        <div className={`fixed inset-y-0 left-0 z-50 w-[88%] max-w-sm transform overflow-y-auto bg-white p-6 shadow-2xl transition-transform duration-300 ease-out md:hidden ${isMobileFiltersOpen ? 'translate-x-0' : '-translate-x-full'}`} onClick={(e) => e.stopPropagation()}>
                            <div className="mb-6 flex items-center justify-between border-b border-brand-brown/10 pb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-brand-dark">Filter & sort</h3>
                                    <p className="text-sm text-gray-500">{totalCount} products available</p>
                                </div>
                                <button type="button" onClick={() => setIsMobileFiltersOpen(false)} className="rounded-full p-2 text-gray-500 hover:bg-brand-light">
                                    ✕
                                </button>
                            </div>
                            {renderFilterContent()}
                        </div>
                    </>
                )}

                <div className="flex-grow">
                    <Deferred
                        data={['products', 'filters']}
                        fallback={(
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <ProductCardSkeleton key={index} />
                                ))}
                            </div>
                        )}
                    >
                        {productItems.length === 0 ? (
                            <div className="rounded-2xl border border-brand-brown/10 bg-white p-12 text-center">
                                <p className="text-lg text-gray-500">No products found matching your criteria.</p>
                                <button onClick={() => visitShop({})} className="mt-4 font-semibold text-brand-brown underline">Clear all filters</button>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {productItems.map((product, index) => (
                                        <div key={product.id} className="animate-fadeInUp" style={{ animationDelay: `${Math.min(index * 60, 300)}ms` }}>
                                            <ProductCard product={product} />
                                        </div>
                                    ))}
                                </div>

                                {productLinks.length > 3 && (
                                    <div className="mt-12 flex flex-wrap justify-center gap-2">
                                        {productLinks.map((link, i) => (
                                            link.url ? (
                                                <Link
                                                    key={i}
                                                    href={link.url}
                                                    only={['products', 'filters']}
                                                    preserveScroll
                                                    preserveState
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${link.active ? 'bg-brand-brown text-white' : 'border border-brand-brown/15 bg-white text-gray-600 hover:bg-brand-light'}`}
                                                />
                                            ) : (
                                                <span
                                                    key={i}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                    className="cursor-not-allowed rounded-full border border-brand-brown/10 bg-white px-4 py-2 text-sm text-gray-300"
                                                />
                                            )
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </Deferred>
                </div>
            </main>

            <Footer />
        </div>
    );
}
