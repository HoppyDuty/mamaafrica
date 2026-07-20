import React, { useState, useEffect } from 'react';
import { Head, Link, Deferred } from '@inertiajs/react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import ProductCard from '../Components/ProductCard';
import FoodCard from '../Components/FoodCard';
import ServiceCard from '../Components/ServiceCard';
import { useLanguage } from '../Contexts/LanguageContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Home({ heroContent, featuredProducts, featuredFoods, featuredServices, reviews, categories, auth }) {
    const { t } = useLanguage();
    const [currentSlide, setCurrentSlide] = useState(0);

    // Fallback default slides if admin has not populated database heroContent
    const defaultSlides = [
        {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=1920',
            title: t('hero.welcome'),
            subtitle: t('hero.tagline'),
            cta_text: t('hero.cta'),
            cta_link: '/shop',
        },
        {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=1920',
            title: t('home.featured_products'),
            subtitle: t('home.featured_products_sub'),
            cta_text: t('hero.cta'),
            cta_link: '/shop?category=fashion',
        },
        {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1640555900713-3ee749c4a9a0?auto=format&fit=crop&q=80&w=1920',
            title: t('home.featured_services'),
            subtitle: t('home.featured_services_sub'),
            cta_text: t('services.book'),
            cta_link: '/services',
        }
    ];

    const slides = heroContent?.slides || defaultSlides;

    // Auto-advance carousel slide every 7 seconds
    useEffect(() => {
        if (slides.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 7000);
        return () => clearInterval(interval);
    }, [slides]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    return (
        <div className="min-h-screen flex flex-col bg-brand-light">
            <Head title="Home" />
            <Navbar user={auth?.user} />

            <main className="flex-grow">
                {/* Stunning Hero Carousel Section */}
                <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-brand-dark select-none">
                    {slides.map((slide, index) => (
                        <div 
                            key={index} 
                            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                        >
                            {/* Media: Image or Video */}
                            {slide.type === 'video' ? (
                                <video 
                                    src={slide.url} 
                                    autoPlay 
                                    loop 
                                    muted 
                                    playsInline
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <img 
                                    src={slide.url} 
                                    alt={slide.title} 
                                    className="w-full h-full object-cover transform scale-105 transition-transform duration-[7000ms] ease-out"
                                />
                            )}
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent md:bg-black/40"></div>

                            {/* Carousel Slide Content Card */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center px-4 max-w-4xl mx-auto z-20 transition-transform duration-700 transform translate-y-0">
                                    <span className="inline-block text-xs md:text-sm font-bold tracking-widest text-brand-gold uppercase bg-brand-brown/40 border border-brand-gold/30 px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm animate-pulse">
                                        Mama Africa Luxury
                                    </span>
                                    <h1 className="text-4xl md:text-7xl font-serif font-bold text-white mb-6 drop-shadow-xl leading-tight">
                                        {slide.title}
                                    </h1>
                                    <p className="text-base md:text-xl text-gray-200 mb-10 text-balance max-w-2xl mx-auto drop-shadow-md">
                                        {slide.subtitle}
                                    </p>
                                    <Link 
                                        href={slide.cta_link} 
                                        prefetch={['hover', 'viewport']}
                                        instant
                                        className="inline-block bg-brand-gold hover:bg-yellow-600 text-white font-bold py-4 px-10 rounded-full text-lg transition duration-300 shadow-glow transform hover:scale-105"
                                    >
                                        {slide.cta_text || t('hero.cta')}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Navigation Arrows */}
                    {slides.length > 1 && (
                        <>
                            <button 
                                onClick={prevSlide}
                                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white transition backdrop-blur-sm cursor-pointer"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button 
                                onClick={nextSlide}
                                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white transition backdrop-blur-sm cursor-pointer"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}

                    {/* Navigation Dots */}
                    {slides.length > 1 && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex space-x-2.5">
                            {slides.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentSlide(idx)}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === currentSlide ? 'bg-brand-gold w-8' : 'bg-white/40 hover:bg-white/60'}`}
                                />
                            ))}
                        </div>
                    )}
                </section>

                {/* Categories Overview Section */}
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-serif font-bold text-brand-dark mb-4">
                                {t('home.explore')}
                            </h2>
                            <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-base">
                                {t('home.explore_sub')}
                            </p>
                            <div className="w-24 h-1 bg-brand-gold mx-auto mt-4"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {categories?.slice(0, 3).map(cat => (
                                <Link 
                                    key={cat.id} 
                                    href={`/${cat.type === 'service' ? 'services' : 'shop'}?category=${cat.slug}`} 
                                    prefetch={['hover', 'viewport']}
                                    instant
                                    className="group relative h-80 rounded-2xl overflow-hidden shadow-soft"
                                >
                                    <img 
                                        src={`https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=600&text=${encodeURIComponent(cat.name)}`} 
                                        alt={cat.name} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 p-8">
                                        <h3 className="text-2xl font-bold text-white mb-2">{cat.name}</h3>
                                        <span className="text-brand-gold group-hover:text-white transition">
                                            {t('home.view_details')}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Featured Summer & New Products */}
                {featuredProducts?.length > 0 && (
                    <section className="py-20 bg-brand-light">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex justify-between items-end mb-12">
                                <div>
                                    <h2 className="text-4xl font-serif font-bold text-brand-dark mb-2">
                                        {t('home.featured_products')}
                                    </h2>
                                    <p className="text-xs md:text-sm text-gray-500">
                                        {t('home.featured_products_sub')}
                                    </p>
                                    <div className="w-24 h-1 bg-brand-gold mt-4"></div>
                                </div>
                                <Link href="/shop" prefetch={['hover', 'viewport']} instant className="text-brand-brown hover:text-brand-gold font-bold text-sm hidden sm:block">
                                    {t('cart.continue')} →
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                {featuredProducts.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Featured Services */}
                {featuredServices?.length > 0 && (
                    <section className="py-20 bg-white">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex justify-between items-end mb-12">
                                <div>
                                    <h2 className="text-4xl font-serif font-bold text-brand-dark mb-2">
                                        {t('home.featured_services')}
                                    </h2>
                                    <p className="text-xs md:text-sm text-gray-500">
                                        {t('home.featured_services_sub')}
                                    </p>
                                    <div className="w-24 h-1 bg-brand-gold mt-4"></div>
                                </div>
                                <Link href="/services" prefetch={['hover', 'viewport']} instant className="text-brand-brown hover:text-brand-gold font-bold text-sm hidden sm:block">
                                    {t('services.book')} →
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {featuredServices.map(service => (
                                    <ServiceCard key={service.id} service={service} />
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Reviews Section */}
                <Deferred data="reviews" fallback={(
                    <section className="py-20 bg-brand-dark text-white">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="rounded-2xl border border-white/10 bg-white/10 p-8 text-sm text-gray-200">
                                Loading client reviews…
                            </div>
                        </div>
                    </section>
                )}>
                    {reviews?.length > 0 && (
                        <section className="py-20 bg-brand-dark text-white">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="text-center mb-16">
                                    <h2 className="text-4xl font-serif font-bold mb-4">What Our Clients Say</h2>
                                    <div className="w-24 h-1 bg-brand-gold mx-auto"></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {reviews.map(review => (
                                        <div key={review.id} className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm border border-white/10">
                                            <div className="flex text-brand-gold mb-4">
                                                {[...Array(5)].map((_, i) => (
                                                    <svg key={i} className={`w-5 h-5 ${i < review.rating ? 'fill-current' : 'text-gray-600'}`} viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                ))}
                                            </div>
                                            <p className="text-gray-300 italic mb-6">"{review.comment}"</p>
                                            <p className="font-medium">— {review.reviewer_name}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}
                </Deferred>
            </main>

            <Footer />
        </div>
    );
}
