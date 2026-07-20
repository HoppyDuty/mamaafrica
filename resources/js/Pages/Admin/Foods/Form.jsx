import React, { useEffect } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function FoodForm({ food, shops, categories }) {
    const { data, setData, processing, errors, reset } = useForm({
        shop_id: food?.shop_id?.toString() ?? (shops[0]?.id?.toString() ?? ''),
        category_id: food?.category_id?.toString() ?? '',
        name: food?.name ?? '',
        description: food?.description ?? '',
        price_eur: food?.price_eur ?? '',
        price_ghs: food?.price_ghs ?? '',
        stock: food?.stock ?? 0,
        is_active: food ? !!food.is_active : true,
        images: [],
        existing_images: food?.images ?? [],
    });

    useEffect(() => {
        reset({
            shop_id: food?.shop_id?.toString() ?? (shops[0]?.id?.toString() ?? ''),
            category_id: food?.category_id?.toString() ?? '',
            name: food?.name ?? '',
            description: food?.description ?? '',
            price_eur: food?.price_eur ?? '',
            price_ghs: food?.price_ghs ?? '',
            stock: food?.stock ?? 0,
            is_active: food ? !!food.is_active : true,
            images: [],
            existing_images: food?.images ?? [],
        });
    }, [food?.id, food?.shop_id, food?.category_id, food?.name, food?.description, food?.price_eur, food?.price_ghs, food?.stock, food?.is_active, shops]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            if (value === null || value === undefined) {
                return;
            }

            if (key === 'images') {
                (value || []).forEach((file) => formData.append('images[]', file));
                return;
            }

            if (key === 'existing_images') {
                (value || []).forEach((image) => formData.append('existing_images[]', image));
                return;
            }

            if (typeof value === 'boolean') {
                formData.append(key, value ? '1' : '0');
                return;
            }

            formData.append(key, value);
        });

        if (food) {
            formData.append('_method', 'PUT');
            router.post(`/admin/foods/${food.id}`, formData, {
                forceFormData: true,
                preserveScroll: true,
            });
        } else {
            router.post('/admin/foods', formData, {
                forceFormData: true,
                preserveScroll: true,
            });
        }
    };

    return (
        <AdminLayout>
            <Head title={food ? 'Edit Food Item' : 'Add Food Item'} />

            <div className="mx-auto max-w-4xl">
                <div className="mb-8 rounded-3xl border border-gray-200/80 bg-white/80 p-6 shadow-sm backdrop-blur">
                    <Link href="/admin/foods" className="text-sm font-bold text-brand-brown hover:underline">← Back to Foods</Link>
                    <h1 className="mt-2 text-3xl font-semibold text-gray-900">{food ? 'Edit Food Item' : 'Add New Food Item'}</h1>
                    <p className="mt-2 text-sm text-gray-500">Configure food menu items, pricing, and images.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-gray-200/80 bg-white p-8 shadow-sm">
                    {/* Name */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Food Item Title *</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            className="w-full border-gray-300 rounded-xl text-sm focus:ring-brand-gold focus:border-brand-gold py-2.5 px-4"
                            required
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    {/* Grid - Shop & Category */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Shop Assignment */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Assigned Shop Location *</label>
                            <select
                                value={data.shop_id || ''}
                                onChange={e => setData('shop_id', e.target.value)}
                                className="w-full border-gray-300 rounded-xl text-sm focus:ring-brand-gold focus:border-brand-gold py-2.5 px-4 bg-white"
                                required
                            >
                                {shops.map(sh => (
                                    <option key={sh.id} value={sh.id?.toString() || ''}>{sh.name} ({sh.country})</option>
                                ))}
                            </select>
                            {errors.shop_id && <p className="text-red-500 text-xs mt-1">{errors.shop_id}</p>}
                        </div>

                        {/* Category Selection */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Category Assignment</label>
                            <select
                                value={data.category_id || ''}
                                onChange={e => setData('category_id', e.target.value)}
                                className="w-full border-gray-300 rounded-xl text-sm focus:ring-brand-gold focus:border-brand-gold py-2.5 px-4 bg-white"
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <optgroup key={cat.id} label={cat.name}>
                                        <option value={cat.id?.toString() || ''}>{cat.name}</option>
                                        {cat.children?.map(child => (
                                            <option key={child.id} value={child.id?.toString() || ''}>-- {child.name}</option>
                                        ))}
                                    </optgroup>
                                ))}
                            </select>
                            {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id}</p>}
                        </div>
                    </div>

                    {/* Grid - Prices & Stock */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Price EUR */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Price (€ EUR) *</label>
                            <input
                                type="number"
                                step="0.01"
                                value={data.price_eur}
                                onChange={e => setData('price_eur', e.target.value)}
                                className="w-full border-gray-300 rounded-xl text-sm focus:ring-brand-gold focus:border-brand-gold py-2.5 px-4"
                                required
                            />
                            {errors.price_eur && <p className="text-red-500 text-xs mt-1">{errors.price_eur}</p>}
                        </div>

                        {/* Price GHS */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Price (₵ GHS) *</label>
                            <input
                                type="number"
                                step="0.01"
                                value={data.price_ghs}
                                onChange={e => setData('price_ghs', e.target.value)}
                                className="w-full border-gray-300 rounded-xl text-sm focus:ring-brand-gold focus:border-brand-gold py-2.5 px-4"
                                required
                            />
                            {errors.price_ghs && <p className="text-red-500 text-xs mt-1">{errors.price_ghs}</p>}
                        </div>

                        {/* Stock */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Stock Count *</label>
                            <input
                                type="number"
                                value={data.stock}
                                onChange={e => setData('stock', e.target.value)}
                                className="w-full border-gray-300 rounded-xl text-sm focus:ring-brand-gold focus:border-brand-gold py-2.5 px-4"
                                required
                            />
                            {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
                        </div>
                    </div>

                    {/* Image Uploads */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Upload Food Images</label>
                        <input
                            type="file"
                            multiple
                            onChange={e => setData('images', Array.from(e.target.files))}
                            className="w-full border border-gray-300 bg-gray-50 rounded-xl text-sm focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-brown file:text-white file:cursor-pointer hover:file:bg-brand-dark cursor-pointer py-1.5 px-3"
                            accept="image/*"
                        />
                        {data.existing_images?.length > 0 && (
                            <div className="mt-3">
                                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Current Images</p>
                                <div className="flex flex-wrap gap-2">
                                    {data.existing_images.map((img, idx) => (
                                        <div key={`${img}-${idx}`} className="relative">
                                            <img src={img} alt="Current" className="h-16 w-16 rounded-lg border border-gray-200 object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => setData('existing_images', data.existing_images.filter((image) => image !== img))}
                                                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white"
                                                aria-label="Remove image"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {data.images?.length > 0 && (
                            <p className="mt-2 text-xs text-gray-500">{data.images.length} new file{data.images.length > 1 ? 's' : ''} selected</p>
                        )}
                        {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Food Description</label>
                        <textarea
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            className="w-full border-gray-300 rounded-xl text-sm focus:ring-brand-gold focus:border-brand-gold py-2.5 px-4"
                            rows="4"
                        ></textarea>
                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                    </div>

                    {/* Active checkbox */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="is_active"
                            checked={data.is_active}
                            onChange={e => setData('is_active', e.target.checked)}
                            className="h-4.5 w-4.5 text-brand-brown focus:ring-brand-gold border-gray-300 rounded"
                        />
                        <label htmlFor="is_active" className="ml-2 block text-sm font-bold text-gray-900">Food Item is Active</label>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-brand-brown hover:bg-brand-dark text-white font-bold py-3.5 px-4 rounded-xl text-sm transition shadow-md disabled:opacity-50"
                    >
                        {processing ? 'Saving...' : food ? 'Update Food Item' : 'Create Food Item'}
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
}
