import React, { useState } from 'react';
import { Head, Link, router, usePage, Deferred } from '@inertiajs/react';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import StoreSelectorModal from '../../Components/StoreSelectorModal';
import ServiceCard from '../../Components/ServiceCard';
import Snackbar from '../../Components/Snackbar';
import { useCurrency } from '../../Contexts/CurrencyContext';
import { useLanguage } from '../../Contexts/LanguageContext';

export default function ServiceShow({ service, related = [], auth }) {
    const { formatPrice } = useCurrency();
    const { t } = useLanguage();
    const { props } = usePage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [mainImage, setMainImage] = useState(service.images?.[0] || 'https://placehold.co/1200x800/D4AF37/FFFFFF?text=Service');
    const cartKeys = props.cartKeys || [];
    const [isInCart, setIsInCart] = useState(cartKeys.includes(`service:${service.id}`));

    const handleAddToCart = () => {
        if (!auth?.user) {
            router.visit('/login', { showProgress: false });
            return;
        }

        router.post('/cart/add', {
            type: 'service',
            item_id: service.id,
            name: service.name,
            slug: service.slug,
            price_eur: service.price_eur,
            price_ghs: service.price_ghs,
            image: service.images?.[0] || null,
        }, {
            preserveScroll: true,
            preserveState: true,
            showProgress: false,
        });

        setIsInCart(true);
        setSnackbarMessage('Service added to cart');
        setSnackbarOpen(true);
        setTimeout(() => setSnackbarOpen(false), 2500);
    };

    return (
        <div className="min-h-screen flex flex-col bg-brand-light">
            <Head title={service.name} />
            <Navbar user={auth?.user} />

            <main className="flex-grow max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 w-full">
                
                {/* Breadcrumbs */}
                <nav className="flex flex-wrap text-sm text-gray-500 mb-4 sm:mb-6">
                    <Link href="/" className="hover:text-brand-brown">Home</Link>
                    <span className="mx-2">/</span>
                    <Link href="/services" className="hover:text-brand-brown">Services</Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900">{service.name}</span>
                </nav>

                <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
                    <div className="relative h-[420px] sm:h-[520px] md:h-[620px]">
                        <img 
                            src={mainImage} 
                            alt={service.name} 
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                        <button
                            type="button"
                            onClick={handleAddToCart}
                            className={`absolute right-4 bottom-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-lg transition ${isInCart ? 'bg-brand-brown text-white' : 'bg-brand-brown text-white hover:bg-brand-dark'}`}
                        >
                            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                            Add to Cart
                        </button>
                        <div className="absolute bottom-0 left-0 p-4 sm:p-6 md:p-8">
                            <div className="text-brand-gold font-medium tracking-wider mb-2 uppercase text-sm">
                                {service.category?.name}
                            </div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white drop-shadow-md">
                                {service.name}
                            </h1>
                        </div>
                    </div>

                    {service.images?.length > 1 && (
                        <div className="px-4 sm:px-6 md:px-8 lg:px-10 pt-4 sm:pt-5 flex gap-3 overflow-x-auto pb-2">
                            {service.images.map((img, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => setMainImage(img)}
                                    className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition ${mainImage === img ? 'border-brand-gold' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                >
                                    <img src={img} alt={`${service.name} preview ${index + 1}`} className="h-full w-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="p-4 sm:p-6 md:p-8 lg:p-10">
                        <div className="flex flex-col md:flex-row gap-6 sm:gap-8 md:gap-10">
                            
                            {/* Main Content */}
                            <div className="flex-grow">
                                <h3 className="text-xl sm:text-2xl font-serif font-bold text-brand-dark mb-3 sm:mb-4">About this service</h3>
                                <div className="prose text-gray-600 max-w-none whitespace-pre-line">
                                    {service.description || 'Experience premium care with our professional staff.'}
                                </div>
                            </div>

                            {/* Booking Sidebar */}
                            <div className="w-full md:w-80 flex-shrink-0">
                                <div className="bg-brand-light p-4 sm:p-5 rounded-xl border border-gray-100">
                                    <div className="mb-4 pb-4 border-b border-gray-200">
                                        <span className="block text-sm text-gray-500 mb-1">Price</span>
                                        <span className="text-2xl sm:text-3xl font-bold text-brand-brown">
                                            {formatPrice(service.price_eur, service.price_ghs)}
                                        </span>
                                    </div>
                                    
                                    <div className="space-y-3 mb-5 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Duration</span>
                                            <span className="font-medium text-gray-900">{service.duration_minutes} min</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Location</span>
                                            <span className="font-medium text-gray-900">{service.shop?.city}, {service.shop?.country}</span>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={() => setIsModalOpen(true)}
                                        className="w-full bg-green-500 hover:bg-green-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold transition shadow-md"
                                    >
                                        Book Appointment
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <Deferred data="related" fallback={(
                    <div className="mt-16 rounded-2xl border border-gray-200 bg-white p-8 text-sm text-gray-500 shadow-soft">
                        Loading related services…
                    </div>
                )}>
                    {related?.length > 0 && (
                        <div className="mt-16 bg-white rounded-2xl shadow-soft px-4 py-8 sm:px-6 lg:px-8">
                            <div className="mb-8 text-center">
                                <h2 className="text-2xl font-serif font-bold text-brand-dark">You May Also Like</h2>
                                <p className="mt-2 text-sm text-gray-500">Showing {related.length} of {Math.min(4, related.length)} similar item{related.length === 1 ? '' : 's'}</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {related.slice(0, 4).map((item) => (
                                    <ServiceCard key={item.id} service={item} />
                                ))}
                            </div>
                        </div>
                    )}
                </Deferred>

            </main>

            <Footer />

            <StoreSelectorModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                item={service}
                type="service"
            />
            <Snackbar message={snackbarMessage} open={snackbarOpen} />
        </div>
    );
}
