import React from 'react';
import { Head } from '@inertiajs/react';
import AttendantLayout from '../../Layouts/AttendantLayout';

export default function AttendantDashboard({ shop, stats, recentOrders }) {
    return (
        <AttendantLayout shop={shop} title="Store Dashboard" subtitle="Realtime overview of store activity and sales indicators.">
            <Head title="Attendant Dashboard" />

            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {Object.entries(stats || {}).map(([key, val]) => (
                    <div key={key} className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gray-400">{key}</p>
                        <p className="mt-3 text-3xl font-semibold text-gray-900">{val}</p>
                    </div>
                ))}
            </div>

            <div className="overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-sm">
                <div className="border-b border-gray-100 px-6 py-5">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Incoming Orders</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">ID</th>
                                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Customer</th>
                                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
                                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Total (EUR)</th>
                                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Total (GHS)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {recentOrders?.map((order) => (
                                <tr key={order.id} className="transition hover:bg-gray-50/50">
                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-900">#{order.id}</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{order.customer_name || order.user?.name || 'Guest'}</td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : order.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">€{order.total_eur}</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">₵{order.total_ghs}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!recentOrders?.length && <p className="p-6 text-center text-sm text-gray-500">No orders received yet.</p>}
                </div>
            </div>
        </AttendantLayout>
    );
}
