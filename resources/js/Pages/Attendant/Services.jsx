import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AttendantLayout from '../../Layouts/AttendantLayout';

export default function AttendantServices({ services, shop }) {
    return (
        <AttendantLayout shop={shop} title="Shop Salon Services" subtitle="Review active salon styles, braids, and appointments for your shop branch.">
            <Head title="Attendant - Shop Services" />

            <div className="overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Preview</th>
                                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Service Title</th>
                                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Category</th>
                                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Price (EUR)</th>
                                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Price (GHS)</th>
                                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Duration</th>
                                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {services.data.map((service) => (
                                <tr key={service.id} className="transition hover:bg-gray-50/50">
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <img src={service.images?.[0] || 'https://placehold.co/80x80/8B4513/FFFFFF?text=Service'} alt={service.name} className="h-10 w-10 rounded-lg border border-gray-100 object-cover" />
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-900">{service.name}</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{service.category?.name || 'General'}</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">€{service.price_eur}</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">₵{service.price_ghs}</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{service.duration_minutes} mins</td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${service.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {service.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!services.data.length && <p className="p-6 text-center text-sm text-gray-500">No beauty services listed in this shop location.</p>}
                </div>

                {services.links?.length > 3 && (
                    <div className="flex justify-center gap-2 border-t border-gray-200 bg-gray-50 px-6 py-4">
                        {services.links.map((link, i) => (
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
