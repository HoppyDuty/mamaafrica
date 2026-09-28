import React, { useState } from 'react';
import { Head, Link, router, usePage, Deferred } from '@inertiajs/react';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import StoreSelectorModal from '../../Components/StoreSelectorModal';
import ProductCard from '../../Components/ProductCard';
import Snackbar from '../../Components/Snackbar';
import { useCurrency } from '../../Contexts/CurrencyContext';
import { useLanguage } from '../../Contexts/LanguageContext';
import { cloudinaryUrl } from '../../utils/cloudinaryUrl';

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
        <div className="flex min-h-screen flex-col bg-brand-light">
            <Head title={product.name} />
            <Navbar user={auth?.user} />

            <main className="mx-auto w-full max-w-7xl flex-grow px-3 py-6 sm:px-6 sm:py-10 lg:px-8">

                <nav className="mb-4 flex flex-wrap text-sm text-gray-500 sm:mb-6">
                    <Link href="/" className="hover:text-brand-brown">Home</Link>
                    <span className="mx-2">/</span>
                    <Link href="/shop" className="hover:text-brand-brown">Shop</Link>
                    <span className="mx-2">/</span>
                    <Link href={`/shop?category=${product.category?.slug}`} className="hover:text-brand-brown">{product.category?.name}</Link>
                    <span className="mx-2">/</span>
                    <span className="text-brand-dark">{product.name}</span>
                </nav>

                <div className="mb-10 overflow-hidden rounded-2xl border border-brand-brown/10 bg-white sm:mb-16 animate-fadeInUp">
                    <div className="grid grid-cols-1 gap-0 md:grid-cols-2">

                        <div className="border-brand-brown/10 p-4 sm:p-6 md:border-r md:p-8">
                            <div className="relative mb-4 h-[420px] w-full overflow-hidden rounded-2xl bg-brand-light md:h-[520px]">
                                <img src={cloudinaryUrl(mainImage, 800)} alt={product.name} className="h-full w-full object-cover" />
                                {product.stock <= 0 && (
                                    <div className="absolute right-4 top-4 rounded-full bg-brand-dark px-3 py-1 text-sm font-bold text-white">
                                        Out of stock
                                    </div>
                                )}
                                <button
                                    type="button"
                                    onClick={handleAddToCart}
                                    disabled={product.stock <= 0}
                                    className={`absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50 ${isInCart ? 'bg-brand-dark text-white' : 'bg-white text-brand-brown hover:bg-brand-light'}`}
                                >
                                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                    </svg>
                                    {isInCart ? 'In cart' : 'Add to cart'}
                                </button>
                            </div>

                            {product.images?.length > 1 && (
                                <div className="flex gap-3 overflow-x-auto pb-2">
                                    {product.images.map((img, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setMainImage(img)}
                                            className={`h-20 min-w-[85px] overflow-hidden rounded-xl border-2 transition ${mainImage === img ? 'border-brand-gold' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                        >
                                            <img src={cloudinaryUrl(img, 90)} alt="" loading="lazy" className="h-full w-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col justify-center p-4 sm:p-6 md:p-8 lg:p-10">
                            <h1 className="mb-3 font-serif text-2xl font-bold text-brand-dark sm:mb-4 sm:text-3xl md:text-4xl">{product.name}</h1>

                            <div className="mb-4 text-2xl font-bold text-brand-brown sm:mb-6 sm:text-3xl">
                                {formatPrice(product.price_eur, product.price_ghs)}
                            </div>

                            <div className="mb-5 sm:mb-8">
                                <h3 className="mb-2 text-sm font-semibold text-brand-brown">Description</h3>
                                <p className="whitespace-pre-line leading-relaxed text-gray-600">
                                    {product.description || 'No description available for this product.'}
                                </p>
                            </div>

                            <div className="mb-5 grid grid-cols-2 gap-3 border-y border-brand-brown/10 py-3 sm:mb-8 sm:gap-4 sm:py-4">
                                <div>
                                    <span className="block text-sm text-gray-500">Availability</span>
                                    <span className="font-medium text-brand-dark">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
                                </div>
                                <div>
                                    <span className="block text-sm text-gray-500">Location</span>
                                    <span className="font-medium text-brand-dark">{product.shop?.city}, {product.shop?.country}</span>
                                </div>
                            </div>

                            <div className="mt-auto space-y-4">
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    disabled={product.stock <= 0}
                                    className="flex w-full items-center justify-center gap-2 rounded-full bg-green-500 py-3 text-sm font-semibold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50 sm:py-3.5 sm:text-base"
                                >
                                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                                    Message on WhatsApp
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <Deferred data="related" fallback={(
                    <div className="mt-20 rounded-2xl border border-brand-brown/10 bg-white p-8 text-sm text-gray-500">
                        Loading related products…
                    </div>
                )}>
                    {related?.length > 0 && (
                        <div className="mt-20">
                            <div className="mb-8 text-center">
                                <h2 className="font-serif text-2xl font-bold text-brand-dark">You may also like</h2>
                                <p className="mt-2 text-sm text-gray-500">{Math.min(4, related.length)} similar item{Math.min(4, related.length) === 1 ? '' : 's'} from the same category</p>
                            </div>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                {related.slice(0, 4).map((rel, index) => (
                                    <div key={rel.id} className="animate-fadeInUp" style={{ animationDelay: `${index * 60}ms` }}>
                                        <ProductCard product={rel} />
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
                item={product}
                type="product"
            />
            <Snackbar message={snackbarMessage} open={snackbarOpen} />
        </div>
    );
}
