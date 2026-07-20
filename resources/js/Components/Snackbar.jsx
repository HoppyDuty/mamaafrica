import React from 'react';

export default function Snackbar({ message, open }) {
    if (!open) return null;

    return (
        <div className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4 sm:bottom-8">
            <div className="max-w-xl rounded-full bg-gray-900/95 px-5 py-3 text-sm font-semibold text-white shadow-xl shadow-black/20 backdrop-blur-sm">
                {message}
            </div>
        </div>
    );
}
