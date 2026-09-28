import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { useCurrency } from '../Contexts/CurrencyContext';
import { useLanguage } from '../Contexts/LanguageContext';
import StoreSelectorModal from './StoreSelectorModal';
import Snackbar from './Snackbar';
import { cloudinaryUrl } from '../utils/cloudinaryUrl';

export default function ServiceCard({ service }) {
    const { formatPrice } = useCurrency();
    const { t } = useLanguage();
    const { props } = usePage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const isAuthenticated = Boolean(props.auth?.user);
    const cartKeys = props.cartKeys || [];
    const [isInCart, setIsInCart] = useState(cartKeys.includes(`service:${service.id}`));

    const handleBookClick = (event) => {
        event.stopPropagation();
        setIsModalOpen(true);
    };

    const handleAddToCart = (event) => {
        event.stopPropagation();

        if (!isAuthenticated) {
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
            image: service.images?.[0] || service.image || null,
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

    const locationText = service.shop?.name
        ? `Book at ${service.shop.name}`
        : service.shop?.city
            ? `Book in ${service.shop.city}`
            : service.shop?.country
                ? `Book in ${service.shop.country}`
                : 'Book now';

    return (
        <>
            <Link
                href={`/services/${service.slug}`}
                prefetch={['hover', 'viewport']}
                instant
                className="group block overflow-hidden rounded-2xl border border-brand-brown/10 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-brown/10"
            >
                <div className="relative aspect-[4/5] overflow-hidden bg-brand-light">
                    <img
                        src={service.images && service.images.length > 0 ? cloudinaryUrl(service.images[0], 400) : 'https://placehold.co/400x400/D4AF37/FFFFFF?text=Service'}
                        alt={service.name}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <button
                        type="button"
                        onClick={handleAddToCart}
                        className={`absolute right-3 top-3 rounded-full p-2.5 shadow-sm transition hover:scale-105 ${isInCart ? 'bg-brand-brown text-white' : 'bg-white/90 text-brand-brown hover:bg-white'}`}
                        aria-label="Add to cart"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </button>
                    <div className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-brand-dark">
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        {service.duration_minutes} min
                    </div>
                </div>
                <div className="p-5">
                    <div className="mb-1 text-xs font-medium text-brand-brown/70">{service.category?.name}</div>
                    <h3 className="mb-2 truncate font-semibold text-lg text-brand-dark transition group-hover:text-brand-brown">{service.name}</h3>
                    <div className="mb-4 flex items-center justify-between gap-2">
                        <span className="text-xl font-bold text-brand-brown">
                            {formatPrice(service.price_eur, service.price_ghs)}
                        </span>
                        <span className="text-right text-xs leading-5 text-gray-500">
                            {locationText}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={handleBookClick}
                        className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-brown py-2.5 font-medium text-white transition hover:bg-brand-dark"
                    >
                        {t('services.book')}
                    </button>
                </div>
            </Link>

            <StoreSelectorModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                item={service}
                type="service"
            />
            <Snackbar message={snackbarMessage} open={snackbarOpen} />
        </>
    );
}
