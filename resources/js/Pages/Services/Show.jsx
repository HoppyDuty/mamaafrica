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
        <div className="flex min-h-screen flex-col bg-brand-light">
            <Head title={service.name} />
            <Navbar user={auth?.user} />

            <main className="mx-auto w-full max-w-5xl flex-grow px-3 py-6 sm:px-6 sm:py-10 lg:px-8">

                <nav className="mb-4 flex flex-wrap text-sm text-gray-500 sm:mb-6">
                    <Link href="/" className="hover:text-brand-brown">Home</Link>
                    <span className="mx-2">/</span>
                    <Link href="/services" className="hover:text-brand-brown">Services</Link>
                    <span className="mx-2">/</span>
                    <span className="text-brand-dark">{service.name}</span>
                </nav>

                <div className="overflow-hidden rounded-2xl border border-brand-brown/10 bg-white animate-fadeInUp">
                    <div className="relative h-[420px] sm:h-[520px] md:h-[620px]">
                        <img
                            src={mainImage}
                            alt={service.name}
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                        <button
                            type="button"
                            onClick={handleAddToCart}
                            className={`absolute right-4 top-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition ${isInCart ? 'bg-brand-dark text-white' : 'bg-white text-brand-brown hover:bg-brand-light'}`}
                        >
                            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                            {isInCart ? 'In cart' : 'Add to cart'}
                        </button>
                        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 md:p-8">
                            <div className="mb-2 text-sm font-semibold text-brand-gold">
                                {service.category?.name}
                            </div>
                            <h1 className="font-serif text-2xl font-bold text-white drop-shadow-md sm:text-3xl md:text-4xl lg:text-5xl">
                                {service.name}
                            </h1>
                        </div>
                    </div>

                    {service.images?.length > 1 && (
                        <div className="flex gap-3 overflow-x-auto px-4 pb-2 pt-4 sm:px-6 sm:pt-5 md:px-8 lg:px-10">
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
                        <div className="flex flex-col gap-6 sm:gap-8 md:flex-row md:gap-10">

                            <div className="flex-grow">
                                <h3 className="mb-3 font-serif text-xl font-bold text-brand-dark sm:mb-4 sm:text-2xl">About this service</h3>
                                <div className="prose max-w-none whitespace-pre-line text-gray-600">
                                    {service.description || 'Experience premium care with our professional staff.'}
                                </div>
                            </div>

                            <div className="w-full flex-shrink-0 md:w-80">
                                <div className="rounded-2xl border border-brand-brown/10 bg-brand-light p-4 sm:p-5">
                                    <div className="mb-4 border-b border-brand-brown/10 pb-4">
                                        <span className="mb-1 block text-sm text-gray-500">Price</span>
                                        <span className="text-2xl font-bold text-brand-brown sm:text-3xl">
                                            {formatPrice(service.price_eur, service.price_ghs)}
                                        </span>
                                    </div>

                                    <div className="mb-5 space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Duration</span>
                                            <span className="font-medium text-brand-dark">{service.duration_minutes} min</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Location</span>
                                            <span className="font-medium text-brand-dark">{service.shop?.city}, {service.shop?.country}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="w-full rounded-full bg-green-500 py-2.5 font-semibold text-white shadow-md transition hover:bg-green-600 sm:py-3"
                                    >
                                        Book appointment
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <Deferred data="related" fallback={(
                    <div className="mt-16 rounded-2xl border border-brand-brown/10 bg-white p-8 text-sm text-gray-500">
                        Loading related services…
                    </div>
                )}>
                    {related?.length > 0 && (
                        <div className="mt-16">
                            <div className="mb-8 text-center">
                                <h2 className="font-serif text-2xl font-bold text-brand-dark">You may also like</h2>
                                <p className="mt-2 text-sm text-gray-500">{Math.min(4, related.length)} similar service{Math.min(4, related.length) === 1 ? '' : 's'} from the same category</p>
                            </div>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                {related.slice(0, 4).map((item, index) => (
                                    <div key={item.id} className="animate-fadeInUp" style={{ animationDelay: `${index * 60}ms` }}>
                                        <ServiceCard service={item} />
                                    </div>
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
