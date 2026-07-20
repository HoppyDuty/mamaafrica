import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import StoreSelectorModal from '../Components/StoreSelectorModal';

export default function Cart({ auth, cart = [], cartCount = 0 }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedType, setSelectedType] = useState('product');
    const [removing, setRemoving] = useState(null);
    const [message, setMessage] = useState(null);

    const subtotal = cart.reduce((sum, item) => sum + (Number(item.price_eur) || 0) * (item.quantity || 1), 0);

    const handleOpenItem = (item) => {
        const path = item.type === 'service' ? `/services/${item.slug}` : `/shop/${item.slug}`;
        router.visit(path);
    };

    const handleOpenMessageModal = (event, item) => {
        event.stopPropagation();
        setSelectedItem({
            ...item,
            images: item.image ? [item.image] : [],
        });
        setSelectedType(item.type || 'product');
        setIsModalOpen(true);
    };

    const handleRemoveItem = async (event, item) => {
        event.stopPropagation();
        setRemoving(item.id);

        try {
            const response = await fetch('/cart/remove', {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                },
                body: JSON.stringify({
                    key: item.id,
                }),
            });

            if (response.ok) {
                // Reload the page to reflect changes using Inertia reload
                router.reload();
            } else {
                setMessage({ type: 'error', text: 'Failed to remove item' });
                setRemoving(null);
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error removing item' });
            setRemoving(null);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-brand-light">
            <Head title="Cart" />
            <Navbar user={auth?.user} />

            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 w-full">
                {message && (
                    <div className={`mb-4 rounded-lg p-4 ${message.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {message.text}
                    </div>
                )}

                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-brown">Your basket</p>
                        <h2 className="text-3xl font-serif font-bold text-brand-dark">{cartCount > 0 ? `You have ${cartCount} item${cartCount === 1 ? '' : 's'} in your cart` : 'Your cart is empty'}</h2>
                    </div>
                    {cartCount > 0 && (
                        <a href="/shop" className="rounded-full border border-brand-brown/20 px-4 py-2 text-sm font-semibold text-brand-brown transition hover:bg-brand-brown hover:text-white inline-flex justify-center">
                            Continue shopping
                        </a>
                    )}
                </div>

                {cartCount > 0 ? (
                    <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
                        <div className="space-y-4">
                            {cart.map((item) => (
                                <div
                                    key={item.id}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => handleOpenItem(item)}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter' || event.key === ' ') {
                                            event.preventDefault();
                                            handleOpenItem(item);
                                        }
                                    }}
                                    className="flex flex-col gap-4 rounded-3xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-brown/30 hover:shadow-md sm:flex-row sm:items-center"
                                >
                                    <img src={item.image || 'https://placehold.co/120x120/8B4513/FFFFFF?text=Item'} alt={item.name} className="mx-auto h-28 w-full max-w-[112px] rounded-3xl object-cover sm:h-28 sm:w-28" />
                                    <div className="flex flex-1 flex-col justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-semibold text-brand-brown">{item.type === 'service' ? 'Service' : item.type === 'food' ? 'Food' : 'Product'}</p>
                                            <h3 className="mt-1 text-lg font-semibold text-gray-900">{item.name}</h3>
                                            <p className="mt-1 text-sm text-gray-500">Qty {item.quantity || 1}</p>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                type="button"
                                                onClick={(event) => handleOpenMessageModal(event, item)}
                                                className="rounded-full bg-green-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-green-600"
                                            >
                                                {item.type === 'service' ? 'Book Appointment' : 'Message on WhatsApp'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={(event) => handleRemoveItem(event, item)}
                                                disabled={removing === item.id}
                                                className="rounded-full border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
                                            >
                                                {removing === item.id ? 'Removing...' : 'Remove'}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-start gap-2 text-left sm:items-end sm:text-right">
                                        <p className="text-lg font-semibold text-brand-brown">€{Number(item.price_eur || 0).toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-900">Order summary</h3>
                            <div className="mt-4 space-y-4 text-sm text-gray-600">
                                <div className="flex items-center justify-between">
                                    <span>Subtotal</span>
                                    <span>€{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="rounded-2xl bg-brand-light p-4">
                                    <p className="text-xs uppercase tracking-[0.25em] text-gray-400">Need help?</p>
                                    <p className="mt-2 text-sm text-gray-500">Tap an item to view it or message us directly about your order.</p>
                                </div>
                            </div>
                            <a href="/shop" className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-brand-brown px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark">
                                Continue shopping
                            </a>
                        </div>
                    </div>
                ) : (
                    <div className="mx-auto max-w-2xl rounded-2xl bg-white p-12 text-center shadow-soft">
                        <svg className="mx-auto mb-6 h-24 w-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        <h2 className="mb-4 text-3xl font-serif font-bold text-brand-dark">Your cart is empty</h2>
                        <p className="mb-8 text-gray-500">
                            Sign in and tap the cart icon on any product or service to add it to your basket.
                        </p>
                        <a href="/shop" className="inline-block rounded-full bg-brand-brown px-8 py-3 font-medium text-white transition hover:bg-brand-dark">
                            Browse shop
                        </a>
                    </div>
                )}
            </main>

            <Footer />

            <StoreSelectorModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                item={selectedItem}
                type={selectedType}
            />
        </div>
    );
}
