import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { useCurrency } from '../Contexts/CurrencyContext';
import { useLanguage } from '../Contexts/LanguageContext';
import StoreSelectorModal from './StoreSelectorModal';
import Snackbar from './Snackbar';

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
                className="block bg-white rounded-xl shadow-soft overflow-hidden hover:-translate-y-1 transition-transform duration-300 group cursor-pointer"
            >
                <div className="relative h-64 overflow-hidden bg-gray-100">
                    <img 
                        src={service.images && service.images.length > 0 ? service.images[0] : 'https://placehold.co/400x400/D4AF37/FFFFFF?text=Service'} 
                        alt={service.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                        type="button"
                        onClick={handleAddToCart}
                        className={`absolute right-3 top-3 rounded-full p-2.5 shadow-md transition hover:scale-105 ${isInCart ? 'bg-brand-brown text-white' : 'bg-white/90 text-brand-brown hover:bg-white'}`}
                        aria-label="Add to cart"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </button>
                </div>
                <div className="p-5">
                    <div className="text-xs text-gray-500 mb-1">{service.category?.name}</div>
                    <h3 className="font-semibold text-lg text-brand-dark mb-2 hover:text-brand-brown truncate">{service.name}</h3>
                    <div className="flex justify-between items-center mb-4 gap-2">
                        <span className="font-bold text-xl text-brand-brown">
                            {formatPrice(service.price_eur, service.price_ghs)}
                        </span>
                        <span className="text-xs text-gray-500 text-right leading-5">
                            {locationText}
                        </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-4">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        {service.duration_minutes} min
                    </div>
                    
                    <button 
                        type="button"
                        onClick={handleBookClick}
                        className="w-full bg-brand-brown hover:bg-brand-dark text-white py-2 rounded-md font-medium transition flex justify-center items-center gap-2"
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
