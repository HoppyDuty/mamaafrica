import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { useCurrency } from '../Contexts/CurrencyContext';
import { useLanguage } from '../Contexts/LanguageContext';
import StoreSelectorModal from './StoreSelectorModal';
import Snackbar from './Snackbar';

export default function FoodCard({ food }) {
    const { formatPrice } = useCurrency();
    const { t } = useLanguage();
    const { props } = usePage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const isAuthenticated = Boolean(props.auth?.user);
    const cartKeys = props.cartKeys || [];
    const [isInCart, setIsInCart] = useState(cartKeys.includes(`food:${food.id}`));

    const handleBuyClick = (event) => {
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
            type: 'food',
            item_id: food.id,
            name: food.name,
            slug: food.slug,
            price_eur: food.price_eur,
            price_ghs: food.price_ghs,
            image: food.images?.[0] || null,
        }, {
            preserveScroll: true,
            preserveState: true,
            showProgress: false,
        });

        setIsInCart(true);
        setSnackbarMessage('Food added to cart');
        setSnackbarOpen(true);
        setTimeout(() => setSnackbarOpen(false), 2500);
    };

    const locationText = food.shop?.name
        ? `Available at ${food.shop.name}`
        : food.shop?.city
            ? `Available in ${food.shop.city}`
            : food.shop?.country
                ? `Available in ${food.shop.country}`
                : 'Available now';

    return (
        <>
            <Link
                href={`/foods/${food.slug}`}
                prefetch={['hover', 'viewport']}
                instant
                className="group block overflow-hidden rounded-2xl border border-brand-brown/10 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-brown/10"
            >
                <div className="relative aspect-[4/5] overflow-hidden bg-brand-light">
                    <img
                        src={food.images?.[0] || 'https://placehold.co/400x400/FF6B35/FFFFFF?text=Food'}
                        alt={food.name}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={food.stock <= 0}
                        className={`absolute right-3 top-3 rounded-full p-2.5 shadow-sm transition hover:scale-105 ${isInCart ? 'bg-brand-brown text-white' : 'bg-white/90 text-brand-brown hover:bg-white'} disabled:cursor-not-allowed disabled:opacity-50`}
                        aria-label="Add to cart"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </button>
                    {food.stock <= 0 && (
                        <div className="absolute left-3 top-3 rounded-full bg-brand-dark px-2.5 py-1 text-xs font-bold text-white">
                            Out of stock
                        </div>
                    )}
                </div>
                <div className="p-5">
                    <div className="mb-1 text-xs font-medium text-brand-brown/70">{food.category?.name}</div>
                    <h3 className="mb-2 truncate font-semibold text-lg text-brand-dark transition group-hover:text-brand-brown">{food.name}</h3>
                    <div className="mb-4 flex items-center justify-between gap-2">
                        <span className="text-xl font-bold text-brand-brown">
                            {formatPrice(food.price_eur, food.price_ghs)}
                        </span>
                        <span className="text-right text-xs leading-5 text-gray-500">
                            {locationText}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={handleBuyClick}
                        disabled={food.stock <= 0}
                        className="flex w-full items-center justify-center gap-2 rounded-full bg-green-500 py-2.5 font-medium text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                        {t('shop.whatsapp')}
                    </button>
                </div>
            </Link>

            <StoreSelectorModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                item={food}
                type="food"
            />
            <Snackbar message={snackbarMessage} open={snackbarOpen} />
        </>
    );
}
