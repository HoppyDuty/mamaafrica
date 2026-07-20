import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';

export default function AdminDashboard({ stats, recentOrders }) {
    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />
            
            <div className="mb-8">
                <h1 className="text-3xl font-semibold text-gray-900">Dashboard Overview</h1>
                <p className="mt-2 text-sm text-gray-500">Welcome back. Here is what is happening across your marketplace.</p>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {Object.entries(stats || {}).map(([key, val]) => (
                    <div key={key} className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gray-400">{key}</p>
                        <p className="mt-3 text-3xl font-semibold text-brand-dark">{val}</p>
                    </div>
                ))}
            </div>

            <div className="overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-sm">
                <div className="border-b border-gray-100 px-6 py-5">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Orders (All Shops)</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shop</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {recentOrders?.map(order => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-dark">#{order.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.shop?.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customer_name || order.user?.name || 'Guest'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">€{order.total_eur}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {!recentOrders?.length && <div className="p-8 text-center text-gray-500">No recent orders.</div>}
            </div>
        </AdminLayout>
    );
}
