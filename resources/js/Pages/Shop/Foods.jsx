import React, { useState } from 'react';
import { Head, Link, router, Deferred } from '@inertiajs/react';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import FoodCard from '../../Components/FoodCard';

const FoodCardSkeleton = () => (
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

export default function FoodsIndex({ foods = { data: [], links: [], total: 0 }, categories = [], filters = {}, auth }) {
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const [priceDraft, setPriceDraft] = useState({ min: filters.min_price || '', max: filters.max_price || '' });

    const foodCollection = foods ?? { data: [], links: [], total: 0 };
    const foodItems = Array.isArray(foodCollection.data) ? foodCollection.data : [];
    const foodLinks = Array.isArray(foodCollection.links) ? foodCollection.links : [];

    const visitFoods = (params) => {
        router.get('/foods', params, { preserveState: true, preserveScroll: true, only: ['foods', 'filters'] });
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
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 md:p-0 md:border-0 md:bg-transparent">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <input 
                    type="text" 
                    placeholder="Search delicacies..." 
                    value={filters.search || ''}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-gold focus:border-brand-gold text-sm"
                />
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 md:p-0 md:border-0 md:bg-transparent">
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <div className="space-y-1">
                    <button 
                        onClick={() => handleFilterChange('category', '')}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition ${!filters.category ? 'bg-brand-brown text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        All Foods
                    </button>
                    {categories.map(cat => (
                        <div key={cat.id} className="space-y-1">
                            <button 
                                onClick={() => handleFilterChange('category', cat.slug)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition ${filters.category === cat.slug ? 'bg-brand-brown text-white shadow-sm' : 'text-brand-dark hover:bg-gray-50'}`}
                            >
                                {cat.name}
                            </button>
                            {cat.children && cat.children.map(child => (
                                <button
                                    key={child.id}
                                    onClick={() => handleFilterChange('category', child.slug)}
                                    className={`w-full text-left pl-6 pr-3 py-1.5 rounded-lg text-xs font-medium transition ${filters.category === child.slug ? 'bg-brand-gold/20 text-brand-brown font-bold' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    • {child.name}
                                </button>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 md:p-0 md:border-0 md:bg-transparent">
                <label className="block text-sm font-medium text-gray-700 mb-2">Country Location</label>
                <div className="flex gap-2">
                    <button 
                        onClick={() => handleFilterChange('country', '')}
                        className={`flex-1 text-center py-2 rounded-lg text-xs font-medium border transition ${!filters.country ? 'bg-brand-brown border-brand-brown text-white' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                        All
                    </button>
                    <button 
                        onClick={() => handleFilterChange('country', 'DE')}
                        className={`flex-1 text-center py-2 rounded-lg text-xs font-medium border transition ${filters.country === 'DE' ? 'bg-brand-brown border-brand-brown text-white' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                        Germany
                    </button>
                    <button 
                        onClick={() => handleFilterChange('country', 'GH')}
                        className={`flex-1 text-center py-2 rounded-lg text-xs font-medium border transition ${filters.country === 'GH' ? 'bg-brand-brown border-brand-brown text-white' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                        Ghana
                    </button>
                </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 md:p-0 md:border-0 md:bg-transparent">
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Limit (€)</label>
                <div className="flex items-center gap-2">
                    <input 
                        type="number" 
                        placeholder="Min" 
                        value={priceDraft.min}
                        onChange={(e) => setPriceDraft(prev => ({ ...prev, min: e.target.value }))}
                        className="w-full border-gray-300 rounded-md text-xs"
                    />
                    <span className="text-gray-400">-</span>
                    <input 
                        type="number" 
                        placeholder="Max" 
                        value={priceDraft.max}
                        onChange={(e) => setPriceDraft(prev => ({ ...prev, max: e.target.value }))}
                        className="w-full border-gray-300 rounded-md text-xs"
                    />
                </div>
                <button 
                    onClick={handlePriceApply}
                    className="w-full mt-3 bg-brand-brown text-white py-2 rounded-lg text-xs font-bold hover:bg-brand-dark transition"
                >
                    Apply Price Range
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col bg-brand-light">
            <Head title="Food Menu - Mama Africa" />
            <Navbar user={auth?.user} />

            <div className="relative bg-brand-dark text-white py-16 px-4 text-center overflow-hidden">
                <div className="absolute top-[-50%] left-[-20%] w-[60vw] h-[60vw] rounded-full bg-brand-gold/10 blur-3xl"></div>
                <div className="relative z-10 max-w-3xl mx-auto">
                    <span className="text-xs font-bold tracking-widest text-brand-gold uppercase bg-brand-brown/40 border border-brand-gold/30 px-4 py-1.5 rounded-full mb-4 inline-block">
                        African & International Cuisine
                    </span>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">Taste of Home</h1>
                    <p className="text-gray-300 text-sm md:text-base max-w-xl mx-auto">
                        Indulge in delicious traditional dishes, local grills, drinks, and snacks prepared fresh at our kitchen locations.
                    </p>
                </div>
            </div>

            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex flex-col lg:flex-row gap-8">
                <aside className="hidden lg:block w-64 flex-shrink-0">
                    <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm sticky top-24">
                        <div className="flex items-center justify-between mb-4 border-b pb-2">
                            <h3 className="font-bold text-lg text-brand-dark">Filters</h3>
                            {hasActiveFilters && (
                                <Link href="/foods" className="text-xs text-red-500 hover:text-red-700 font-semibold">
                                    Reset All
                                </Link>
                            )}
                        </div>
                        {renderFilterContent()}
                    </div>
                </aside>

                <div className="lg:hidden flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-gray-200">
                    <span className="text-sm font-semibold text-gray-700">{totalCount} items found</span>
                    <button 
                        onClick={() => setIsMobileFiltersOpen(true)}
                        className="bg-brand-brown text-white text-xs font-bold px-4 py-2 rounded-lg"
                    >
                        Filters / Search
                    </button>
                </div>

                <div className="flex-grow">
                    <div className="mb-4 hidden lg:flex items-center justify-between text-sm text-gray-500">
                        <span>Showing {totalCount} gourmet items</span>
                    </div>

                    <Deferred data="foods" fallback={
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            <FoodCardSkeleton />
                            <FoodCardSkeleton />
                            <FoodCardSkeleton />
                        </div>
                    }>
                        {foodItems.length === 0 ? (
                            <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center shadow-sm">
                                <p className="text-gray-500 text-lg">No culinary items match your criteria.</p>
                                <Link href="/foods" className="mt-4 inline-block text-brand-brown font-semibold underline">
                                    Clear all filters
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {foodItems.map(food => (
                                        <FoodCard key={food.id} food={food} onAddToCart={auth?.user} />
                                    ))}
                                </div>

                                {foodLinks.length > 3 && (
                                    <div className="mt-12 flex flex-wrap justify-center gap-2">
                                        {foodLinks.map((link, i) => (
                                            <Link 
                                                key={i} 
                                                href={link.url || '#'}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${link.active ? 'bg-brand-brown text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'} ${!link.url ? 'opacity-40 cursor-not-allowed' : ''}`}
                                                disabled={!link.url}
                                            />
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </Deferred>
                </div>
            </main>

            {isMobileFiltersOpen && (
                <div className="fixed inset-0 z-50 lg:hidden flex">
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileFiltersOpen(false)} />
                    <div className="relative flex flex-col w-[80%] max-w-sm bg-white h-full p-6 shadow-2xl overflow-y-auto">
                        <div className="flex items-center justify-between mb-6 border-b pb-3">
                            <h3 className="font-bold text-lg text-brand-dark font-serif">Filters</h3>
                            <button 
                                onClick={() => setIsMobileFiltersOpen(false)}
                                className="text-gray-400 hover:text-gray-600 font-bold"
                            >
                                Close
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
