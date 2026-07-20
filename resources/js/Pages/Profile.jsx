import React from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

export default function Profile({ user: propUser }) {
    const { props } = usePage();
    const handleLogout = () => {
        router.post('/logout');
    };

    const currentUser = propUser || props.auth?.user;

    return (
        <div className="min-h-screen flex flex-col bg-brand-light">
            <Head title="Profile" />
            <Navbar user={currentUser} />

            <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20 w-full">
                <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-soft border border-gray-150">
                    <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 border-b border-gray-100 pb-8 text-center sm:text-left">
                        <img 
                            src={currentUser?.avatar || 'https://ui-avatars.com/api/?background=8B4513&color=fff&name=' + encodeURIComponent(currentUser?.name || 'User')} 
                            alt={currentUser?.name || 'User'} 
                            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-brand-gold/30 shadow-md object-cover"
                        />
                        <div className="space-y-1">
                            <span className="inline-block text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-brand-gold/20 text-brand-brown">
                                Platform Account
                            </span>
                            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-brand-dark mt-1">{currentUser?.name || 'Mama Africa Member'}</h1>
                            <p className="text-gray-500 text-sm sm:text-base">{currentUser?.email || 'N/A'}</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <h3 className="text-lg font-bold text-brand-dark mb-2 uppercase tracking-wide border-l-4 border-brand-gold pl-3">Account Preferences</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Currency and language preferences are synchronized reactively directly from the top navigation bar. Select your language badge to automatically update local values.
                            </p>
                        </div>

                        <div className="bg-brand-light p-4 rounded-xl border border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Account Role</span>
                                <span className="text-sm font-semibold text-brand-dark capitalize">Customer</span>
                            </div>
                            <div>
                                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Default Locale</span>
                                <span className="text-sm font-semibold text-brand-dark uppercase">Auto (GeoIP/Nav)</span>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
                            <button 
                                onClick={handleLogout}
                                className="w-full sm:w-auto bg-red-50 hover:bg-red-100 text-red-600 px-8 py-3 rounded-xl font-bold transition text-center text-sm shadow-sm"
                            >
                                Sign Out Account
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
