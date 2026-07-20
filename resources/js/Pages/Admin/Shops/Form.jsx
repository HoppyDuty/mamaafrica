import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function ShopForm({ shop, attendants }) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: shop?.name || '',
        country: shop?.country || 'DE',
        city: shop?.city || '',
        address: shop?.address || '',
        phone_whatsapp: shop?.phone_whatsapp || '',
        description: shop?.description || '',
        attendant_id: shop?.attendant_id?.toString() || '',
        is_active: shop ? !!shop.is_active : true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (shop) {
            put(`/admin/shops/${shop.id}`);
        } else {
            post('/admin/shops');
        }
    };

    return (
        <AdminLayout>
            <Head title={shop ? 'Edit Shop' : 'Add Shop'} />

            <div className="mx-auto max-w-4xl">
                <div className="mb-8 rounded-3xl border border-gray-200/80 bg-white/80 p-6 shadow-sm backdrop-blur">
                    <Link href="/admin/shops" className="text-sm font-bold text-brand-brown hover:underline">← Back to Shops</Link>
                    <h1 className="mt-2 text-3xl font-semibold text-gray-900">{shop ? 'Edit Shop' : 'Add New Shop'}</h1>
                    <p className="mt-2 text-sm text-gray-500">Enter shop details and assign an attendant to handle localized sales.</p>
                </div>

                    <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-gray-200/80 bg-white p-8 shadow-sm">
                        {/* Name */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Shop Name *</label>
                            <input 
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="w-full border-gray-300 rounded-xl text-sm focus:ring-brand-gold focus:border-brand-gold py-2.5 px-4"
                                required
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Country */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Country *</label>
                                <select 
                                    value={data.country || 'DE'}
                                    onChange={e => setData('country', e.target.value)}
                                    className="w-full border-gray-300 rounded-xl text-sm focus:ring-brand-gold focus:border-brand-gold py-2.5 px-4 bg-white"
                                    required
                                >
                                    <option value="DE">Germany (DE)</option>
                                    <option value="GH">Ghana (GH)</option>
                                </select>
                                {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                            </div>

                            {/* City */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">City</label>
                                <input 
                                    type="text"
                                    value={data.city}
                                    onChange={e => setData('city', e.target.value)}
                                    className="w-full border-gray-300 rounded-xl text-sm focus:ring-brand-gold focus:border-brand-gold py-2.5 px-4"
                                />
                                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                            </div>
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Full Address</label>
                            <input 
                                type="text"
                                value={data.address}
                                onChange={e => setData('address', e.target.value)}
                                className="w-full border-gray-300 rounded-xl text-sm focus:ring-brand-gold focus:border-brand-gold py-2.5 px-4"
                                placeholder="Holstenstraße 6a, 25335 Elmshorn, Germany"
                            />
                            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                        </div>

                        {/* WhatsApp Contact */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">WhatsApp Phone Number *</label>
                            <input 
                                type="text"
                                value={data.phone_whatsapp}
                                onChange={e => setData('phone_whatsapp', e.target.value)}
                                className="w-full border-gray-300 rounded-xl text-sm focus:ring-brand-gold focus:border-brand-gold py-2.5 px-4"
                                placeholder="e.g. +491632197541"
                                required
                            />
                            {errors.phone_whatsapp && <p className="text-red-500 text-xs mt-1">{errors.phone_whatsapp}</p>}
                        </div>

                        {/* Attendant Selection */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Assign Attendant</label>
                            <select 
                                value={data.attendant_id || ''}
                                onChange={e => setData('attendant_id', e.target.value)}
                                className="w-full border-gray-300 rounded-xl text-sm focus:ring-brand-gold focus:border-brand-gold py-2.5 px-4 bg-white"
                            >
                                <option value="">Unassigned (None)</option>
                                {attendants.map(att => (
                                    <option key={att.id} value={att.id?.toString() || ''}>{att.name} ({att.email})</option>
                                ))}
                            </select>
                            {errors.attendant_id && <p className="text-red-500 text-xs mt-1">{errors.attendant_id}</p>}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Description / Notes</label>
                            <textarea 
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                className="w-full border-gray-300 rounded-xl text-sm focus:ring-brand-gold focus:border-brand-gold py-2.5 px-4"
                                rows="3"
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
                            <label htmlFor="is_active" className="ml-2 block text-sm font-bold text-gray-900">Shop is Active</label>
                        </div>

                        {/* Submit */}
                        <button 
                            type="submit"
                            disabled={processing}
                            className="w-full bg-brand-brown hover:bg-brand-dark text-white font-bold py-3.5 px-4 rounded-xl text-sm transition shadow-md disabled:opacity-50"
                        >
                            {processing ? 'Saving...' : shop ? 'Update Shop' : 'Create Shop'}
                        </button>
                    </form>
                </div>
        </AdminLayout>
    );
}
