import React, { useState } from 'react';
import { Head, Link, router, usePage, Deferred } from '@inertiajs/react';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import StoreSelectorModal from '../../Components/StoreSelectorModal';
import ProductCard from '../../Components/ProductCard';
import Snackbar from '../../Components/Snackbar';
import { useCurrency } from '../../Contexts/CurrencyContext';
import { useLanguage } from '../../Contexts/LanguageContext';

export default function ProductShow({ product, related, auth }) {
    const { formatPrice } = useCurrency();
    const { t } = useLanguage();
    const { props } = usePage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [mainImage, setMainImage] = useState(product.images?.[0] || 'https://placehold.co/800x800/8B4513/FFFFFF?text=Product');
    const cartKeys = props.cartKeys || [];
    const [isInCart, setIsInCart] = useState(cartKeys.includes(`product:${product.id}`));

    const handleAddToCart = () => {
        if (!auth?.user) {
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

    return (
        <div className="min-h-screen flex flex-col bg-brand-light">
            <Head title={product.name} />
            <Navbar user={auth?.user} />

            <main className="flex-grow max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 w-full">
                
                {/* Breadcrumbs */}
                <nav className="flex flex-wrap text-sm text-gray-500 mb-4 sm:mb-6">
                    <Link href="/" className="hover:text-brand-brown">Home</Link>
                    <span className="mx-2">/</span>
                    <Link href="/shop" className="hover:text-brand-brown">Shop</Link>
                    <span className="mx-2">/</span>
                    <Link href={`/shop?category=${product.category?.slug}`} className="hover:text-brand-brown">{product.category?.name}</Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900">{product.name}</span>
                </nav>

                <div className="bg-white rounded-2xl shadow-soft overflow-hidden mb-10 sm:mb-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                        
                        {/* Images */}
                        <div className="p-4 sm:p-6 md:p-8 md:border-r border-gray-100">
                            <div className="h-[420px] md:h-[520px] w-full overflow-hidden rounded-[28px] bg-gray-100 mb-4 relative">
                                <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
                                {product.stock <= 0 && (
                                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded font-bold">
                                        Out of Stock
                                    </div>
                                )}
                                <button
                                    type="button"
                                    onClick={handleAddToCart}
                                    disabled={product.stock <= 0}
                                    className={`absolute left-4 bottom-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed ${isInCart ? 'bg-brand-brown text-white' : 'bg-brand-brown text-white hover:bg-brand-dark'}`}
                                >
                                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                    </svg>
                                    Add to Cart
                                </button>
                            </div>
                            
                            {/* Thumbnails */}
                            {product.images?.length > 1 && (
                                <div className="flex gap-3 overflow-x-auto pb-2">
                                    {product.images.map((img, i) => (
                                        <button 
                                            key={i} 
                                            onClick={() => setMainImage(img)}
                                            className={`h-20 min-w-[85px] rounded-xl overflow-hidden border-2 transition ${mainImage === img ? 'border-brand-gold' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                        >
                                            <img src={img} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col justify-center">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-brand-dark mb-3 sm:mb-4">{product.name}</h1>
                            
                            <div className="text-2xl sm:text-3xl font-bold text-brand-brown mb-4 sm:mb-6">
                                {formatPrice(product.price_eur, product.price_ghs)}
                            </div>
                            
                            <div className="mb-5 sm:mb-8">
                                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">Description</h3>
                                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                    {product.description || 'No description available for this product.'}
                                </p>
                            </div>
                            
                            <div className="mb-5 sm:mb-8 grid grid-cols-2 gap-3 sm:gap-4 border-y border-gray-100 py-3 sm:py-4">
                                <div>
                                    <span className="block text-sm text-gray-500">Availability</span>
                                    <span className="font-medium text-gray-900">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
                                </div>
                                <div>
                                    <span className="block text-sm text-gray-500">Location</span>
                                    <span className="font-medium text-gray-900">{product.shop?.city}, {product.shop?.country}</span>
                                </div>
                            </div>

                            <div className="space-y-4 mt-auto">
                                <button 
                                    onClick={() => setIsModalOpen(true)}
                                    disabled={product.stock <= 0}
                                    className="w-full bg-green-500 hover:bg-green-600 text-white py-3 sm:py-3.5 rounded-xl font-semibold text-sm sm:text-base transition flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/30"
                                >
                                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                                    Message on WhatsApp
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                <Deferred data="related" fallback={(
                    <div className="mt-20 rounded-2xl border border-gray-200 bg-white p-8 text-sm text-gray-500 shadow-soft">
                        Loading related products…
                    </div>
                )}>
                    {related?.length > 0 && (
                        <div className="mt-20">
                            <div className="mb-8 text-center">
                                <h2 className="text-2xl font-serif font-bold text-brand-dark">You May Also Like</h2>
                                <p className="mt-2 text-sm text-gray-500">Showing {related.length} of {Math.min(4, related.length)} similar item{related.length === 1 ? '' : 's'}</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {related.slice(0, 4).map(rel => (
                                    <ProductCard key={rel.id} product={rel} />
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
                item={product}
                type="product"
            />
            <Snackbar message={snackbarMessage} open={snackbarOpen} />
        </div>
    );
}
