import React from 'react';
import { Head, Link, router } from '@inertiajs/react';

export default function NoShop() {
    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6 text-center">
            <Head title="Shop Unassigned" />
            <div className="max-w-md bg-white p-8 rounded-2xl shadow-soft border border-gray-150 space-y-6">
                <div className="w-16 h-16 bg-brand-gold/10 text-brand-brown rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
                    !
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Shop Assignment Required</h1>
                <p className="text-gray-500 text-sm leading-relaxed">
                    Welcome to Mama Africa! Your account is registered as an <strong>Attendant</strong>, but you have not yet been assigned to a shop location by the Admin.
                </p>
                <p className="text-xs text-gray-400">
                    Please contact your system administrator to assign you to your retail location.
                </p>
                <div className="pt-4 flex flex-col gap-2">
                    <Link href="/" className="text-sm font-semibold text-brand-brown hover:underline">Go to Front Store</Link>
                    <button onClick={handleLogout} className="text-sm font-semibold text-red-500 hover:text-red-700 underline">Logout</button>
                </div>
            </div>
        </div>
    );
}
