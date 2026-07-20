import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { useCurrency } from '../Contexts/CurrencyContext';
import { useLanguage } from '../Contexts/LanguageContext';
import StoreSelectorModal from './StoreSelectorModal';
import Snackbar from './Snackbar';

export default function ProductCard({ product }) {
    const { formatPrice } = useCurrency();
    const { t } = useLanguage();
    const { props } = usePage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const isAuthenticated = Boolean(props.auth?.user);
    const cartKeys = props.cartKeys || [];
    const [isInCart, setIsInCart] = useState(cartKeys.includes(`product:${product.id}`));

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
            type: 'product',
            item_id: product.id,
            name: product.name,
            slug: product.slug,
            price_eur: product.price_eur,
            price_ghs: product.price_ghs,
            image: product.images?.[0] || null,
        }, {
            preserveScroll: true,
            preserveState: true,
            showProgress: false,
        });

        setIsInCart(true);
        setSnackbarMessage('Product added to cart');
        setSnackbarOpen(true);
        setTimeout(() => setSnackbarOpen(false), 2500);
    };

    const locationText = product.shop?.name
        ? `Available at ${product.shop.name}`
        : product.shop?.city
            ? `Available in ${product.shop.city}`
            : product.shop?.country
                ? `Available in ${product.shop.country}`
                : 'Available now';

    return (
        <>
            <Link
                href={`/shop/${product.slug}`}
                prefetch={['hover', 'viewport']}
                instant
                className="block bg-white rounded-xl shadow-soft overflow-hidden hover:-translate-y-1 transition-transform duration-300 group cursor-pointer"
            >
                <div className="relative h-64 overflow-hidden bg-gray-100">
                    <img 
                        src={product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/400x400/8B4513/FFFFFF?text=Product'} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={product.stock <= 0}
                        className={`absolute right-3 top-3 rounded-full p-2.5 shadow-md transition hover:scale-105 ${isInCart ? 'bg-brand-brown text-white' : 'bg-white/90 text-brand-brown hover:bg-white'} disabled:cursor-not-allowed disabled:opacity-50`}
                        aria-label="Add to cart"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </button>
                    {product.stock <= 0 && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                            {t('product.out_of_stock') || 'Out of Stock'}
                        </div>
                    )}
                </div>
                <div className="p-5">
                    <div className="text-xs text-gray-500 mb-1">{product.category?.name}</div>
                    <h3 className="font-semibold text-lg text-brand-dark mb-2 hover:text-brand-brown truncate">{product.name}</h3>
                    <div className="flex justify-between items-center mb-4 gap-2">
                        <span className="font-bold text-xl text-brand-brown">
                            {formatPrice(product.price_eur, product.price_ghs)}
                        </span>
                        <span className="text-xs text-gray-500 text-right leading-5">
                            {locationText}
                        </span>
                    </div>
                    
                    <button 
                        type="button"
                        onClick={handleBuyClick}
                        disabled={product.stock <= 0}
                        className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md font-medium transition flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="css-i6dzq1"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                        {t('shop.whatsapp')}
                    </button>
                </div>
            </Link>

            <StoreSelectorModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                item={product}
                type="product"
            />
            <Snackbar message={snackbarMessage} open={snackbarOpen} />
        </>
    );
}
