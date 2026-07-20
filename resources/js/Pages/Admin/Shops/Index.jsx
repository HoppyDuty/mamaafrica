import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function ShopsIndex({ shops, filters }) {
    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this shop?')) {
            router.delete(`/admin/shops/${id}`);
        }
    };

    return (
        <AdminLayout>
            <Head title="Manage Shops" />
            
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Manage Shops</h1>
                    <p className="text-gray-500 mt-1">Configure and manage geographic retail shops & attendants.</p>
                </div>
                <div className="flex gap-4">
                    <Link href="/admin/shops/create" className="bg-brand-brown hover:bg-brand-dark text-white font-bold py-2.5 px-5 rounded-xl text-sm transition shadow-md">
                        + Add New Shop
                    </Link>
                </div>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Location</th>
                                <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Attendant</th>
                                <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">WhatsApp Contact</th>
                                <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {shops.data.map(shop => (
                                <tr key={shop.id} className="hover:bg-gray-50/50 transition">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{shop.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{shop.city}, {shop.country}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{shop.attendant?.name || 'Unassigned'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{shop.phone_whatsapp}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${shop.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {shop.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right space-x-3">
                                        <Link href={`/admin/shops/${shop.id}/edit`} className="text-brand-brown hover:text-brand-gold font-bold">Edit</Link>
                                        <button onClick={() => handleDelete(shop.id)} className="text-red-600 hover:text-red-800 font-bold">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {shops.links?.length > 3 && (
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-center gap-2">
                        {shops.links.map((link, i) => (
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
