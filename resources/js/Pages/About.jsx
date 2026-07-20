import React from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

export default function About({ auth }) {
    return (
        <div className="min-h-screen flex flex-col bg-brand-light">
            <Head title="About Us" />
            <Navbar user={auth?.user} />

            <main className="flex-grow">
                {/* Hero */}
                <div className="bg-brand-dark text-white py-20 text-center px-4">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 text-brand-gold">About Mama Africa</h1>
                    <p className="text-xl max-w-2xl mx-auto text-gray-300">
                        Bridging cultures through beauty, fashion, and care. Bringing the vibrant spirit of Africa to Germany and beyond.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto px-4 py-16">
                    <div className="prose prose-lg text-gray-700">
                        <h2 className="text-3xl font-serif font-bold text-brand-dark mb-6">Our Story</h2>
                        <p>
                            Mama Africa started with a simple vision: to create a space where authentic African culture meets premium European standards. What began as a small boutique has grown into a comprehensive marketplace offering top-tier beauty products, stunning fashion pieces, and professional salon services.
                        </p>
                        <p>
                            With locations in Elmshorn, Germany, and Accra, Ghana, we bridge the gap between continents, ensuring our customers always have access to the highest quality products and care, no matter where they are.
                        </p>

                        <h2 className="text-3xl font-serif font-bold text-brand-dark mt-12 mb-6">Visit Us</h2>
                        
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-white p-6 rounded-xl shadow-soft border-t-4 border-brand-gold">
                                <h3 className="font-bold text-xl mb-2 text-brand-brown">Elmshorn, Germany</h3>
                                <p className="mb-4">Holstenstraße 6a<br/>25335 Elmshorn</p>
                                <p className="font-medium text-gray-900">📞 +49 163 2197541</p>
                            </div>
                            
                            <div className="bg-white p-6 rounded-xl shadow-soft border-t-4 border-brand-gold">
                                <h3 className="font-bold text-xl mb-2 text-brand-brown">Accra, Ghana</h3>
                                <p className="mb-4">Osu, Oxford Street<br/>Greater Accra Region</p>
                                <p className="font-medium text-gray-900">📞 +233 55 000 0000</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
