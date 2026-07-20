import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function ServicesIndex({ services, shops, filters }) {
    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this service?')) {
            router.delete(`/admin/services/${id}`);
        }
    };

    const handleFilterChange = (key, value) => {
        router.get('/admin/services', { ...filters, [key]: value }, { preserveState: true });
    };

    return (
        <AdminLayout>
            <Head title="Admin - Services" />

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Manage Services</h1>
                    <p className="text-gray-500 mt-1">Configure premium salon bookings, braid stylings, and footcare treatments.</p>
                </div>
                <div className="flex gap-4">
                    <Link href="/admin/services/create" className="bg-brand-brown hover:bg-brand-dark text-white font-bold py-2.5 px-5 rounded-xl text-sm transition shadow-md">
                        + Add Service
                    </Link>
                </div>
            </div>

                {/* Filters */}
                <div className="mb-6 flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:flex-row lg:items-end">
                    <div className="w-full lg:flex-1">
                        <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-700">Search Services</label>
                        <input 
                            type="text"
                            placeholder="Type service title..."
                            value={filters?.search || ''}
                            onChange={e => handleFilterChange('search', e.target.value)}
                            className="w-full rounded-xl border-gray-300 py-2 px-4 text-sm focus:border-brand-gold focus:ring-brand-gold"
                        />
                    </div>
                    <div className="w-full lg:w-64">
                        <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-700">Filter by Shop</label>
                        <select 
                            value={filters?.shop_id || ''}
                            onChange={e => handleFilterChange('shop_id', e.target.value)}
                            className="w-full rounded-xl border-gray-300 bg-white py-2 px-4 text-sm focus:border-brand-gold focus:ring-brand-gold"
                        >
                            <option value="">All Shops</option>
                            {shops.map(sh => (
                                <option key={sh.id} value={sh.id?.toString() || ''}>{sh.name} ({sh.country})</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-left">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Preview</th>
                                    <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Title</th>
                                    <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Shop Location</th>
                                    <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Price (EUR)</th>
                                    <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Price (GHS)</th>
                                    <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Duration</th>
                                    <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {services.data.map(service => (
                                    <tr key={service.id} className="hover:bg-gray-50/50 transition">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <img 
                                                src={service.image || 'https://placehold.co/80x80/8B4513/FFFFFF?text=Service'} 
                                                alt={service.name}
                                                className="w-10 h-10 object-cover rounded-lg border border-gray-100"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{service.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.shop?.name || 'Unassigned'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">€{service.price_eur}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₵{service.price_ghs}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.duration_minutes} mins</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${service.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {service.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right space-x-3">
                                            <Link href={`/admin/services/${service.id}/edit`} className="text-brand-brown hover:text-brand-gold font-bold">Edit</Link>
                                            <button onClick={() => handleDelete(service.id)} className="text-red-600 hover:text-red-800 font-bold">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {services.links?.length > 3 && (
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-center gap-2">
                            {services.links.map((link, i) => (
                                link.url ? (
                                    <Link 
                                        key={i} 
                                        href={link.url}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1 text-xs rounded ${link.active ? 'bg-brand-brown text-white font-bold' : 'bg-white text-gray-700 hover:bg-gray-100 border'}`}
                                    />
                                ) : (
                                    <span 
                                        key={i} 
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className="px-3 py-1 text-xs rounded bg-white text-gray-400 border opacity-40 cursor-not-allowed"
                                    />
                                )
                            ))}
                        </div>
                    )}
                </div>
        </AdminLayout>
    );
}
