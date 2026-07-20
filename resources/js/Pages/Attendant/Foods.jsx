import React from 'react';
import { Head } from '@inertiajs/react';
import AttendantLayout from '../../Layouts/AttendantLayout';

export default function Foods({ foods, shop }) {
    return (
        <AttendantLayout shop={shop}>
            <Head title="Foods" />

            <div className="mb-6">
                <h1 className="text-3xl font-serif font-bold text-brand-dark">Food Items</h1>
                <p className="text-sm text-gray-600">View all foods for {shop.name}</p>
            </div>

            {foods.data.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {foods.data.map((food) => (
                        <div
                            key={food.id}
                            className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition"
                        >
                            {food.images && food.images[0] && (
                                <img
                                    src={food.images[0]}
                                    alt={food.name}
                                    className="h-48 w-full object-cover"
                                />
                            )}
                            <div className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{food.name}</h3>
                                        {food.category && (
                                            <p className="text-sm text-gray-600">{food.category.name}</p>
                                        )}
                                    </div>
                                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                                        food.is_active ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {food.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>

                                {food.description && (
                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{food.description}</p>
                                )}

                                <div className="flex items-center justify-between pt-3 border-t">
                                    <div>
                                        <p className="text-lg font-semibold text-brand-brown">€{parseFloat(food.price_eur).toFixed(2)}</p>
                                        <p className="text-xs text-gray-500">GHS {parseFloat(food.price_ghs).toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">{food.stock}</p>
                                        <p className="text-xs text-gray-500">in stock</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
                    <p className="text-gray-600 mb-4">No food items yet</p>
                    <p className="text-sm text-gray-500">Contact admin to add food items to your shop</p>
                </div>
            )}

            {foods.last_page > 1 && (
                <div className="mt-6 flex justify-center gap-2">
                    {foods.links.map((link, index) => (
                        link.url ? (
                            <a
                                key={index}
                                href={link.url}
                                className={`px-3 py-2 rounded text-sm ${
                                    link.active
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                {link.label}
                            </a>
                        ) : (
                            <span key={index} className="px-3 py-2 text-sm text-gray-400">
                                {link.label}
                            </span>
                        )
                    ))}
                </div>
            )}
        </AttendantLayout>
    );
}
