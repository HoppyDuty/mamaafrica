import React from 'react';
import { Link } from '@inertiajs/react';

export default function Footer() {
    return (
        <footer className="bg-brand-dark text-white pt-12 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="font-serif font-bold text-2xl mb-4 text-brand-gold">Mama Africa</h3>
                    <p className="text-gray-400 text-sm mb-4">
                        Beauty, Fashion & Care — All in One Place. Authentic African and European styles.
                    </p>
                    <p className="text-sm text-gray-400">
                        📍 Holstenstraße 6a, 25335 Elmshorn, Germany
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                        📞 +49 163 2197541
                    </p>
                    <div className="flex gap-4 mt-6">
                        <a href="#" className="text-gray-400 hover:text-brand-gold transition">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-brand-gold transition">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.20 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-brand-gold transition">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        </a>
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li><Link href="/" prefetch={['hover', 'viewport']} instant className="hover:text-brand-gold">Home</Link></li>
                        <li><Link href="/shop" prefetch={['hover', 'viewport']} instant className="hover:text-brand-gold">Shop</Link></li>
                        <li><Link href="/foods" prefetch={['hover', 'viewport']} instant className="hover:text-brand-gold">Food</Link></li>
                        <li><Link href="/services" prefetch={['hover', 'viewport']} instant className="hover:text-brand-gold">Services</Link></li>
                        <li><Link href="/about" prefetch={['hover', 'viewport']} instant className="hover:text-brand-gold">About Us</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold text-lg mb-4">Categories</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li><Link href="/shop?category=beauty-products" prefetch={['hover', 'viewport']} instant className="hover:text-brand-gold">Beauty Products</Link></li>
                        <li><Link href="/shop?category=fashion" prefetch={['hover', 'viewport']} instant className="hover:text-brand-gold">Fashion</Link></li>
                        <li><Link href="/foods?category=local-dishes" prefetch={['hover', 'viewport']} instant className="hover:text-brand-gold">Traditional Dishes</Link></li>
                        <li><Link href="/foods?category=spices-seasonings" prefetch={['hover', 'viewport']} instant className="hover:text-brand-gold">Spices & Seasonings</Link></li>
                        <li><Link href="/services?category=hair-salon" prefetch={['hover', 'viewport']} instant className="hover:text-brand-gold">Hair Salon</Link></li>
                        <li><Link href="/services?category=spa" prefetch={['hover', 'viewport']} instant className="hover:text-brand-gold">Spa & Care</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold text-lg mb-4">Newsletter</h4>
                    <p className="text-sm text-gray-400 mb-4">Subscribe to get special offers and updates.</p>
                    <form className="flex flex-col sm:flex-row gap-2">
                        <input type="email" placeholder="Your email" className="w-full px-3 py-2 rounded-md text-gray-900 focus:outline-none" />
                        <button type="button" className="bg-brand-gold px-4 py-2 rounded-md text-white text-sm font-semibold hover:bg-yellow-600 transition">
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>
            <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Mama Africa. All rights reserved.
            </div>
        </footer>
    );
}
