import React, { useState } from 'react';
import { Head, Link, router, Deferred } from '@inertiajs/react';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import FoodCard from '../../Components/FoodCard';

const FoodCardSkeleton = () => (
    <div className="overflow-hidden rounded-2xl border border-brand-brown/10 bg-white animate-pulse">
        <div className="aspect-[4/5] w-full bg-gray-100" />
        <div className="p-5">
            <div className="h-3 w-1/3 rounded bg-gray-100" />
            <div className="mt-3 h-4 w-3/4 rounded bg-gray-100" />
            <div className="mt-4 h-8 w-full rounded-full bg-gray-100" />
        </div>
    </div>
);

export default function FoodsIndex({ foods = { data: [], links: [], total: 0 }, categories = [], filters = {}, auth }) {
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const [priceDraft, setPriceDraft] = useState({ min: filters.min_price || '', max: filters.max_price || '' });

    const foodCollection = foods ?? { data: [], links: [], total: 0 };
    const foodItems = Array.isArray(foodCollection.data) ? foodCollection.data : [];
    const foodLinks = Array.isArray(foodCollection.links) ? foodCollection.links : [];

    const visitFoods = (params) => {
        // No preserveScroll: filter changes should always land back at the top of the page.
        router.get('/foods', params, { preserveState: true, only: ['foods', 'filters'] });
    };

    const handleFilterChange = (key, value) => {
        visitFoods({ ...filters, [key]: value });
    };

    const handlePriceApply = () => {
        visitFoods({
            ...filters,
            min_price: priceDraft.min,
            max_price: priceDraft.max,
        });
    };

    const hasActiveFilters = Boolean(filters.category || filters.search || filters.min_price || filters.max_price || filters.country);
    const totalCount = foodCollection.total ?? foodItems.length;

    const renderFilterContent = () => (
        <div className="space-y-6">
            <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Search</label>
                <input
                    type="text"
                    placeholder="Search delicacies..."
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
                        All foods
                    </button>
                    {categories.map(cat => (
                        <div key={cat.id}>
                            <button
                                type="button"
                                onClick={() => handleFilterChange('category', cat.slug)}
                                className={`w-full rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${filters.category === cat.slug ? 'bg-brand-brown text-white' : 'text-brand-dark hover:bg-brand-light'}`}
                            >
                                {cat.name}
                            </button>
                            {cat.children && cat.children.map(child => (
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
                <label className="mb-2 block text-sm font-medium text-gray-700">Price limit (€)</label>
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        placeholder="Min"
                        value={priceDraft.min}
                        onChange={(e) => setPriceDraft(prev => ({ ...prev, min: e.target.value }))}
                        className="w-full text-sm"
                    />
                    <span className="text-gray-400">–</span>
                    <input
                        type="number"
                        placeholder="Max"
                        value={priceDraft.max}
                        onChange={(e) => setPriceDraft(prev => ({ ...prev, max: e.target.value }))}
                        className="w-full text-sm"
                    />
                </div>
                <button
                    type="button"
                    onClick={handlePriceApply}
                    className="mt-3 w-full rounded-full border border-brand-brown/20 px-3 py-2 text-sm font-medium text-brand-brown transition hover:bg-brand-light"
                >
                    Apply price range
                </button>
            </div>

            <div className="flex flex-col gap-3 border-t border-brand-brown/10 pt-4">
                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={() => {
                            visitFoods({});
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
            <Head title="Food Menu - Mama Africa" />
            <Navbar user={auth?.user} />

            <div className="relative overflow-hidden bg-brand-dark py-14 text-center text-white">
                <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-brand-gold/10 blur-3xl" />
                <div className="relative mx-auto max-w-2xl px-4">
                    <h1 className="font-serif text-4xl font-bold md:text-5xl">Taste of home</h1>
                    <p className="mt-4 text-gray-300">Traditional dishes, fresh ingredients, and drinks prepared at our kitchen locations across Germany and Ghana.</p>
                </div>
            </div>

            <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:flex-row lg:px-8">
                <aside className="hidden w-64 flex-shrink-0 lg:block">
                    <div className="sticky top-24 rounded-2xl border border-brand-brown/10 bg-white p-6">
                        <div className="mb-4 flex items-center justify-between border-b border-brand-brown/10 pb-3">
                            <h3 className="text-lg font-bold text-brand-dark">Filters</h3>
                            {hasActiveFilters && (
                                <Link href="/foods" className="text-xs font-semibold text-red-500 hover:text-red-700">
                                    Reset all
                                </Link>
                            )}
                        </div>
                        {renderFilterContent()}
                    </div>
                </aside>

                <div className="flex items-center justify-between rounded-2xl border border-brand-brown/10 bg-white px-4 py-3 lg:hidden">
                    <span className="text-sm font-semibold text-gray-700">{totalCount} items found</span>
                    <button
                        onClick={() => setIsMobileFiltersOpen(true)}
                        className="rounded-full bg-brand-brown px-4 py-2 text-xs font-bold text-white"
                    >
                        Filters / Search
                    </button>
                </div>

                <div className="flex-grow">
                    <div className="mb-4 hidden items-center justify-between text-sm text-gray-500 lg:flex">
                        <span>Showing {totalCount} items</span>
                    </div>

                    <Deferred data="foods" fallback={
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                            <FoodCardSkeleton />
                            <FoodCardSkeleton />
                            <FoodCardSkeleton />
                        </div>
                    }>
                        {foodItems.length === 0 ? (
                            <div className="rounded-2xl border border-brand-brown/10 bg-white p-12 text-center">
                                <p className="text-lg text-gray-500">No items match your criteria.</p>
                                <Link href="/foods" className="mt-4 inline-block font-semibold text-brand-brown underline">
                                    Clear all filters
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                                    {foodItems.map((food, index) => (
                                        <div key={food.id} className="animate-fadeInUp" style={{ animationDelay: `${Math.min(index * 60, 300)}ms` }}>
                                            <FoodCard food={food} />
                                        </div>
                                    ))}
                                </div>

                                {foodLinks.length > 3 && (
                                    <div className="mt-12 flex flex-wrap justify-center gap-2">
                                        {foodLinks.map((link, i) => (
                                            link.url ? (
                                                <Link
                                                    key={i}
                                                    href={link.url}
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

            {isMobileFiltersOpen && (
                <div className="fixed inset-0 z-50 flex lg:hidden">
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileFiltersOpen(false)} />
                    <div className="relative flex h-full w-[80%] max-w-sm flex-col overflow-y-auto bg-white p-6 shadow-2xl">
                        <div className="mb-6 flex items-center justify-between border-b border-brand-brown/10 pb-3">
                            <h3 className="font-serif text-lg font-bold text-brand-dark">Filters</h3>
                            <button
                                onClick={() => setIsMobileFiltersOpen(false)}
                                className="rounded-full p-2 text-gray-500 hover:bg-brand-light"
                            >
                                ✕
                            </button>
                        </div>
                        {renderFilterContent()}
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
