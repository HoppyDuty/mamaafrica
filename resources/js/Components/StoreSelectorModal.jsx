import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../Contexts/LanguageContext';

// Rotating premium geometric tribal African sun logo/shield
const AfricanLogoLoader = () => (
    <div className="text-center py-8">
        <svg className="w-16 h-16 animate-spin text-brand-gold mx-auto mb-4" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 10 L55 25 L65 15 L67 30 L80 20 L75 35 L90 35 L80 47 L95 50 L80 53 L90 65 L75 65 L80 80 L67 70 L65 85 L55 75 L50 90 L45 75 L35 85 L33 70 L20 80 L25 65 L10 65 L20 53 L5 50 L20 47 L10 35 L25 35 L20 20 L33 30 L35 15 L45 25 Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="50" cy="50" r="18" stroke="#8B4513" strokeWidth="4" strokeDasharray="6 4"/>
            <path d="M46 45 C46 43 54 43 54 45 L54 55 C54 57 46 57 46 55 Z" fill="currentColor"/>
        </svg>
        <p className="text-sm font-semibold text-brand-brown animate-pulse">Connecting to Store...</p>
    </div>
);

// Shimmer skeleton loader for shops
const ShimmerSkeletons = () => (
    <div className="space-y-3 animate-pulse">
        {[1, 2, 3].map((n) => (
            <div key={n} className="p-3 border border-gray-100 rounded-xl bg-gray-50/50 flex items-center justify-between">
                <div className="space-y-2 w-2/3">
                    <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
            </div>
        ))}
    </div>
);

export default function StoreSelectorModal({ isOpen, onClose, item, type = 'product' }) {
    const { t } = useLanguage();
    const [shops, setShops] = useState([]);
    const [selectedShopId, setSelectedShopId] = useState('');
    const [loadingShops, setLoadingShops] = useState(false);
    const [processingOrder, setProcessingOrder] = useState(false);
    
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (isOpen) {
            setLoadingShops(true);
            axios.get('/api/shops')
                .then(response => {
                    const data = response.data || [];
                    setShops(data);
                    if (data.length > 0) {
                        // Pre-select the item's original shop if available, otherwise first shop
                        const defaultShop = data.find(s => s?.id === item?.shop_id) || data[0];
                        setSelectedShopId(defaultShop?.id?.toString() || '');
                    }
                })
                .catch(err => {
                    console.error('Failed to load stores', err);
                })
                .finally(() => {
                    setLoadingShops(false);
                });
        }
    }, [isOpen, item]);

    if (!isOpen) return null;

    const handleCheckout = async (e) => {
        e.preventDefault();
        
        if (!name.trim()) {
            alert('Please enter your name');
            return;
        }

        const shop = shops.find(s => s?.id?.toString() === selectedShopId);
        if (!shop) {
            alert('Please select a store/location');
            return;
        }

        setProcessingOrder(true);
        try {
            // Log order to database (public guest-friendly POST route)
            await axios.post('/orders', {
                shop_id: shop.id,
                type: type,
                items: [{ id: item?.id, name: item?.name, quantity: 1, price: item?.price_eur }],
                total_eur: item?.price_eur || 0,
                total_ghs: item?.price_ghs || 0,
                customer_name: name,
                customer_phone: phone,
                notes: notes,
            });

            // Clean phone number for WhatsApp
            const waPhone = (shop?.phone_whatsapp || '').toString().replace(/[^0-9]/g, '');
            
            // Format WhatsApp Message details
            const messageText = type === 'product' 
                ? `Hello Mama Africa! I am interested in buying the product: *${item?.name || 'Item'}*.\n\n👤 *Customer*: ${name}\n📞 *Phone*: ${phone || 'Not provided'}\n📍 *Store Location*: ${shop.name} (${shop.city}, ${shop.country})\n📝 *Notes*: ${notes || 'None'}`
                : `Hello Mama Africa! I would like to book a session for the service: *${item?.name || 'Service'}*.\n\n👤 *Customer*: ${name}\n📞 *Phone*: ${phone || 'Not provided'}\n📍 *Store Location*: ${shop.name} (${shop.city}, ${shop.country})\n📝 *Notes*: ${notes || 'None'}`;
            
            const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(messageText)}`;
            
            // Open WhatsApp Chat
            window.open(waUrl, '_blank');
            onClose();
        } catch (error) {
            console.error('Failed to log order', error);
            alert('Unable to process your request at this moment. Please try again.');
        } finally {
            setProcessingOrder(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 animate-slideUp">
                {/* Header */}
                <div className="px-6 py-4 bg-brand-dark text-white flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-serif font-bold text-brand-gold">Complete Booking</h3>
                        <p className="text-xs text-gray-300 mt-0.5">Choose your store location and proceed to WhatsApp</p>
                    </div>
                    <button onClick={onClose} className="text-gray-300 hover:text-white transition">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                
                <div className="p-6 space-y-6">
                    {/* Item Preview */}
                    <div className="bg-brand-light p-4 rounded-xl flex gap-4 border border-gray-100">
                        <img 
                            src={item?.images?.[0] || 'https://placehold.co/120x120/8B4513/FFFFFF?text=' + encodeURIComponent(item?.name || 'Item')} 
                            alt={item?.name || 'Item'} 
                            className="w-16 h-16 object-cover rounded-lg shadow-sm border border-white" 
                        />
                        <div>
                            <span className="inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-brand-gold/20 text-brand-brown mb-1">
                                {type}
                            </span>
                            <p className="font-semibold text-gray-900 leading-snug">{item?.name || 'Item'}</p>
                            <p className="text-xs text-gray-500 mt-1">Direct checkout logs an audit trail in our database.</p>
                        </div>
                    </div>

                    {processingOrder ? (
                        <AfricanLogoLoader />
                    ) : (
                        <form onSubmit={handleCheckout} className="space-y-4">
                            {/* Contact Name */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Your Full Name *</label>
                                <input 
                                    type="text" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition"
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>

                            {/* Contact Phone */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">WhatsApp Phone Number</label>
                                <input 
                                    type="tel" 
                                    value={phone} 
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition"
                                    placeholder="e.g. +49 176 1234567"
                                />
                            </div>

                            {/* Location Dropdown */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Select Store Location (Closest to You) *</label>
                                {loadingShops ? (
                                    <ShimmerSkeletons />
                               ) : (
                                    <select 
                                        value={selectedShopId} 
                                        onChange={(e) => setSelectedShopId(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition"
                                        required
                                    >
                                        {shops.map(shop => (
                                            <option key={shop.id} value={shop?.id?.toString() || ''}>
                                                {shop.name} — {shop.city}, {shop.country}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            {/* Additional Notes */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Order Notes / Preferences</label>
                                <textarea 
                                    value={notes} 
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition"
                                    placeholder="Specify preferred timing, size, hair type or special requests..."
                                    rows="2"
                                ></textarea>
                            </div>

                            {/* CTA Action */}
                            <button 
                                type="submit"
                                disabled={loadingShops || processingOrder}
                                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition flex justify-center items-center gap-2 disabled:opacity-50 shadow-lg shadow-green-500/20 mt-6"
                            >
                                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                                Message to Buy on WhatsApp
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
