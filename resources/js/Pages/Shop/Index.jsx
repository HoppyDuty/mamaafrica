import React, { useState } from 'react';
import { Head, Link, router, Deferred } from '@inertiajs/react';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import ProductCard from '../../Components/ProductCard';

const ProductCardSkeleton = () => (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-soft animate-pulse">
        <div className="h-40 w-full rounded-lg bg-gray-200" />
        <div className="mt-4 h-4 w-3/4 rounded bg-gray-200" />
        <div className="mt-2 h-4 w-1/2 rounded bg-gray-200" />
        <div className="mt-4 flex items-center justify-between">
            <div className="h-4 w-16 rounded bg-gray-200" />
            <div className="h-8 w-20 rounded bg-gray-200" />
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
        router.get('/shop', params, { preserveState: true, preserveScroll: true, only: ['products', 'filters'] });
    };

    const handleFilterChange = (key, value) => {
        visitShop({ ...filters, [key]: value });
    };

    const handlePriceApply = () => {
        const nextFilters = {
            ...filters,
            min_price: priceDraft.min,
            max_price: priceDraft.max,
        };

        visitShop(nextFilters);
    };

    const hasActiveFilters = Boolean(filters.search || filters.category || filters.country || filters.min_price || filters.max_price);
    const totalCount = productCollection.total ?? productItems.length;

    const renderFilterContent = () => (
        <div className="space-y-6">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 md:p-0 md:border-0 md:bg-transparent">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <input 
                    type="text" 
                    placeholder="Search products..." 
                    value={filters.search || ''}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-gold focus:border-brand-gold text-sm"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select 
                    value={filters.category || ''}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-gold focus:border-brand-gold text-sm"
                >
                    <option value="">All Categories</option>
                    {categories?.map(cat => (
                        <optgroup key={cat.id} label={cat.name}>
                            <option value={cat.slug || ''}>{cat.name}</option>
                            {cat.children?.map(child => (
                                <option key={child.id} value={child.slug || ''}>-- {child.name}</option>
                            ))}
                        </optgroup>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <select 
                    value={filters.country || ''}
                    onChange={(e) => handleFilterChange('country', e.target.value)}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-gold focus:border-brand-gold text-sm"
                >
                    <option value="">All Locations</option>
                    <option value="DE">Germany</option>
                    <option value="GH">Ghana</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price range</label>
                <div className="grid grid-cols-2 gap-2">
                    <input
                        type="number"
                        inputMode="decimal"
                        min="0"
                        placeholder="Min"
                        value={priceDraft.min}
                        onChange={(e) => setPriceDraft((prev) => ({ ...prev, min: e.target.value }))}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-gold focus:border-brand-gold text-sm"
                    />
                    <input
                        type="number"
                        inputMode="decimal"
                        min="0"
                        placeholder="Max"
                        value={priceDraft.max}
                        onChange={(e) => setPriceDraft((prev) => ({ ...prev, max: e.target.value }))}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-gold focus:border-brand-gold text-sm"
                    />
                </div>
                <button
                    type="button"
                    onClick={handlePriceApply}
                    className="mt-3 w-full rounded-lg border border-brand-brown/20 px-3 py-2 text-sm font-medium text-brand-brown hover:bg-brand-brown/5"
                >
                    Apply price filter
                </button>
            </div>

            <div className="flex flex-col gap-3 border-t border-gray-200 pt-4">
                {hasActiveFilters && (
                    <button 
                        type="button"
                        onClick={() => {
                            visitShop({});
                            setIsMobileFiltersOpen(false);
                        }}
                        className="w-full rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                        Clear Filters
                    </button>
                )}
                <button 
                    type="button"
                    onClick={() => setIsMobileFiltersOpen(false)}
                    className="w-full rounded-lg bg-brand-brown px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
                >
                    Show Results
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col bg-brand-light">
            <Head title="Shop" />
            <Navbar user={auth?.user} />

            <div className="bg-brand-dark py-12 text-white text-center">
                <h1 className="text-4xl font-serif font-bold">Shop Our Collection</h1>
                <p className="mt-4 text-gray-300 max-w-2xl mx-auto">Discover premium beauty products, fashion styles, and accessories from Mama Africa.</p>
            </div>

            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 w-full flex flex-col md:flex-row gap-8">
                <div className="md:hidden flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm mb-4">
                    <button
                        type="button"
                        onClick={() => setIsMobileFiltersOpen(true)}
                        className="flex items-center gap-2 text-sm font-semibold text-brand-brown"
                    >
                        <span>Filter & Sort</span>
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
                
                {/* Sidebar Filters */}
                <aside className="hidden md:block w-full md:w-64 flex-shrink-0">
                    <div className="bg-white p-6 rounded-xl shadow-soft sticky top-24">
                        <h3 className="font-bold text-lg mb-4 text-brand-dark border-b pb-2">Filters</h3>
                        {renderFilterContent()}
                    </div>
                </aside>

                {/* Mobile Filter Drawer */}
                {isMobileFiltersOpen && (
                    <>
                        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-all duration-300 md:hidden" onClick={() => setIsMobileFiltersOpen(false)} />
                        <div className={`fixed inset-y-0 left-0 z-50 w-[88%] max-w-sm transform bg-white shadow-2xl overflow-y-auto p-6 transition-transform duration-300 ease-out md:hidden ${isMobileFiltersOpen ? 'translate-x-0' : '-translate-x-full'}`} onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-brand-dark">Filter & Sort</h3>
                                    <p className="text-sm text-gray-500">{totalCount} products available</p>
                                </div>
                                <button type="button" onClick={() => setIsMobileFiltersOpen(false)} className="rounded-full p-2 text-gray-500 hover:bg-gray-100">
                                    ✕
                                </button>
                            </div>
                            {renderFilterContent()}
                        </div>
                    </>
                )}

                {/* Product Grid */}
                <div className="flex-grow">
                    <Deferred
                        data={['products', 'filters']}
                        fallback={(
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <ProductCardSkeleton key={index} />
                                ))}
                            </div>
                        )}
                    >
                        {productItems.length === 0 ? (
                            <div className="bg-white p-12 rounded-xl shadow-soft text-center">
                                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                                <button onClick={() => visitShop({})} className="mt-4 text-brand-brown underline">Clear all filters</button>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {productItems.map(product => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                                
                                {/* Pagination */}
                                <div className="mt-12 flex justify-center gap-2">
                                    {productLinks.map((link, i) => (
                                        link.url ? (
                                            <Link 
                                                key={i} 
                                                href={link.url}
                                                only={['products', 'filters']}
                                                preserveScroll
                                                preserveState
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                className={`px-4 py-2 rounded-md ${link.active ? 'bg-brand-brown text-white' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'}`}
                                            />
                                        ) : (
                                            <span 
                                                key={i} 
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                className="px-4 py-2 rounded-md bg-white text-gray-400 border border-gray-200 opacity-50 cursor-not-allowed"
                                            />
                                        )
                                    ))}
                                </div>
                            </>
                        )}
                    </Deferred>
                </div>
            </main>

            <Footer />
        </div>
    );
}
