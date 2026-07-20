import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AttendantLayout from '../../Layouts/AttendantLayout';

export default function AttendantOrders({ orders, shop, filters }) {
    const handleStatusChange = (id, newStatus) => {
        router.put(`/admin/orders/${id}`, { status: newStatus }, { preserveScroll: true });
    };

    const handleFilterChange = (key, value) => {
        router.get('/attendant/orders', { ...filters, [key]: value }, { preserveState: true });
    };

    return (
        <AttendantLayout shop={shop} title="Shop Orders" subtitle="Review orders routed to your shop location and update statuses.">
            <Head title="Attendant - Orders" />

            <div className="mb-6 rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm">
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.3em] text-gray-700">Filter by Status</label>
                <select
                    value={filters?.status || ''}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20 md:w-64"
                >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            <div className="overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Order ID</th>
                                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Customer</th>
                                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">WhatsApp Phone</th>
                                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Total (EUR)</th>
                                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Total (GHS)</th>
                                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {orders.data.map((order) => (
                                <tr key={order.id} className="transition hover:bg-gray-50/50">
                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-900">#{order.id}</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-950">{order.customer_name || order.user?.name || 'Guest'}</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{order.customer_phone || 'N/A'}</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">€{order.total_eur}</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">₵{order.total_ghs}</td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            className={`rounded-full border border-transparent px-3.5 py-1 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-gold ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : order.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
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

                {orders.links?.length > 3 && (
                    <div className="flex justify-center gap-2 border-t border-gray-200 bg-gray-50 px-6 py-4">
                        {orders.links.map((link, i) => (
                            link.url ? (
                                <Link key={i} href={link.url} dangerouslySetInnerHTML={{ __html: link.label }} className={`rounded px-3 py-1 text-xs ${link.active ? 'bg-brand-brown font-bold text-white' : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-100'}`} />
                            ) : (
                                <span key={i} dangerouslySetInnerHTML={{ __html: link.label }} className="cursor-not-allowed rounded border border-gray-200 bg-white px-3 py-1 text-xs text-gray-400 opacity-40" />
                            )
                        ))}
                    </div>
                )}
            </div>
        </AttendantLayout>
    );
}
