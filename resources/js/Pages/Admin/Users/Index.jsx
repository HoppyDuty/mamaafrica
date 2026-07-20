import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function UsersIndex({ users, filters }) {
    const handleRoleChange = (id, newRole) => {
        router.put(`/admin/users/${id}/role`, { role: newRole }, { preserveScroll: true });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this user?')) {
            router.delete(`/admin/users/${id}`);
        }
    };

    const handleFilterChange = (key, value) => {
        router.get('/admin/users', { ...filters, [key]: value }, { preserveState: true });
    };

    return (
        <AdminLayout>
            <Head title="Admin - Users" />

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
                <p className="text-gray-500 mt-1">Manage platform accounts, register attendants, and assign system access levels.</p>
            </div>

                {/* Filters */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-grow">
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Search Users</label>
                        <input 
                            type="text"
                            placeholder="Type user name or email..."
                            value={filters?.search || ''}
                            onChange={e => handleFilterChange('search', e.target.value)}
                            className="w-full border-gray-300 rounded-xl text-sm focus:ring-brand-gold focus:border-brand-gold py-2 px-4"
                        />
                    </div>
                    <div className="w-full md:w-64">
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Filter by Role</label>
                        <select 
                            value={filters?.role || ''}
                            onChange={e => handleFilterChange('role', e.target.value)}
                            className="w-full border-gray-300 rounded-xl text-sm focus:ring-brand-gold focus:border-brand-gold py-2 px-4 bg-white"
                        >
                            <option value="">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="attendant">Attendant</option>
                            <option value="customer">Customer</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-left">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Assigned Role</th>
                                    <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.data.map(user => (
                                    <tr key={user.id} className="hover:bg-gray-50/50 transition">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{user.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{user.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select 
                                                value={user.roles?.[0]?.name || 'customer'}
                                                onChange={e => handleRoleChange(user.id, e.target.value)}
                                                className="text-xs font-bold py-1 px-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-gold bg-white"
                                            >
                                                <option value="customer">Customer</option>
                                                <option value="attendant">Attendant</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                                            <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-800 font-bold">Delete Account</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {users.links?.length > 3 && (
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-center gap-2">
                            {users.links.map((link, i) => (
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
