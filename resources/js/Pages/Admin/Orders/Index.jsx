import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function OrdersIndex({ orders, filters }) {
    const handleStatusChange = (id, newStatus) => {
        router.put(`/admin/orders/${id}`, { status: newStatus }, { preserveScroll: true });
    };

    const handleFilterChange = (key, value) => {
        router.get('/admin/orders', { ...filters, [key]: value }, { preserveState: true });
    };

    return (
        <AdminLayout>
            <Head title="Admin - Orders" />

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Manage Orders</h1>
                <p className="text-gray-500 mt-1">View guest purchase audits and manage local WhatsApp direct order statuses.</p>
            </div>

                {/* Filters */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-end">
                    <div className="w-full md:w-64">
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Filter by Status</label>
                        <select 
                            value={filters?.status || ''}
                            onChange={e => handleFilterChange('status', e.target.value)}
                            className="w-full border-gray-300 rounded-xl text-sm focus:ring-brand-gold focus:border-brand-gold py-2 px-4 bg-white"
                        >
                            <option value="">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-left">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Order ID</th>
                                    <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Shop</th>
                                    <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">WhatsApp Phone</th>
                                    <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Price (EUR)</th>
                                    <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Price (GHS)</th>
                                    <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {orders.data.map(order => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">#{order.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.shop?.name || 'Unassigned'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-950 font-medium">
                                            {order.customer_name || order.user?.name || 'Guest'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer_phone || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">€{order.total_eur}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₵{order.total_ghs}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select 
                                                value={order.status}
                                                onChange={e => handleStatusChange(order.id, e.target.value)}
                                                className={`text-xs font-bold py-1 px-3.5 rounded-full border border-transparent focus:outline-none focus:ring-2 focus:ring-brand-gold ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : order.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {orders.links?.length > 3 && (
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-center gap-2">
                            {orders.links.map((link, i) => (
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
