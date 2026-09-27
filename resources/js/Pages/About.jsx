import React from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const LOCATIONS = [
    {
        city: 'Elmshorn, Germany',
        address: ['Holstenstraße 6a', '25335 Elmshorn'],
        phone: '+49 163 2197541',
        whatsapp: '491632197541',
        image: 'https://images.unsplash.com/photo-1571771019784-3ff35f4f4277?auto=format&fit=crop&q=80&w=800',
    },
    {
        city: 'Accra, Ghana',
        address: ['Osu, Oxford Street', 'Greater Accra Region'],
        phone: '+233 55 000 0000',
        whatsapp: '233550000000',
        image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800',
    },
];

export default function About({ auth }) {
    return (
        <div className="flex min-h-screen flex-col bg-brand-light">
            <Head title="About Us" />
            <Navbar user={auth?.user} />

            <main className="flex-grow">
                <div className="relative overflow-hidden bg-brand-dark px-4 py-20 text-center text-white">
                    <div className="pointer-events-none absolute -left-16 -top-24 h-72 w-72 rounded-full bg-brand-gold/10 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-brand-brown/20 blur-3xl" />
                    <div className="relative animate-fadeInUp">
                        <h1 className="mb-6 font-serif text-4xl font-bold text-brand-gold md:text-6xl">About Mama Africa</h1>
                        <p className="mx-auto max-w-2xl text-xl text-gray-300">
                            Bridging cultures through beauty, fashion, and care — bringing the vibrant spirit of Africa to Germany and beyond.
                        </p>
                    </div>
                </div>

                <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="grid items-center gap-10 md:grid-cols-2">
                        <div className="animate-fadeInUp">
                            <h2 className="mb-4 font-serif text-3xl font-bold text-brand-dark">Our story</h2>
                            <p className="leading-relaxed text-gray-600">
                                Mama Africa started with a simple vision: a space where authentic African culture meets premium European standards. What began as a small boutique has grown into a comprehensive marketplace offering top-tier beauty products, stunning fashion pieces, home-cooked dishes, and professional salon services.
                            </p>
                            <p className="mt-4 leading-relaxed text-gray-600">
                                With kitchens and stores in Elmshorn, Germany, and Accra, Ghana, we bridge the gap between continents, so our customers always have access to the highest quality products and care, no matter where they are.
                            </p>
                        </div>
                        <div className="animate-fadeInUp overflow-hidden rounded-2xl border border-brand-brown/10" style={{ animationDelay: '100ms' }}>
                            <img
                                src="https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=800"
                                alt="Mama Africa product craftsmanship"
                                loading="lazy"
                                decoding="async"
                                className="aspect-[4/3] w-full object-cover"
                            />
                        </div>
                    </div>

                    <div className="mt-20">
                        <div className="mb-10 text-center">
                            <h2 className="font-serif text-3xl font-bold text-brand-dark">Visit us</h2>
                            <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-brand-gold" />
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            {LOCATIONS.map((loc, index) => (
                                <div
                                    key={loc.city}
                                    className="animate-fadeInUp overflow-hidden rounded-2xl border border-brand-brown/10 bg-white transition hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-brown/10"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="relative h-40 overflow-hidden bg-brand-light">
                                        <img src={loc.image} alt={loc.city} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        <h3 className="absolute bottom-3 left-5 text-xl font-bold text-white">{loc.city}</h3>
                                    </div>
                                    <div className="p-6">
                                        <p className="mb-4 text-gray-600">
                                            {loc.address.map((line, i) => (
                                                <React.Fragment key={i}>
                                                    {line}
                                                    {i < loc.address.length - 1 && <br />}
                                                </React.Fragment>
                                            ))}
                                        </p>
                                        <a
                                            href={`https://wa.me/${loc.whatsapp}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 rounded-full bg-green-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-600"
                                        >
                                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                                            {loc.phone}
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
