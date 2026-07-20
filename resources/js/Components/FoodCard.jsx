import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCurrency } from '../Contexts/CurrencyContext';

export default function FoodCard({ food, onAddToCart }) {
    const { currency } = useCurrency();
    const [isAdding, setIsAdding] = useState(false);
    const [liked, setLiked] = useState(false);

    const price = currency === 'EUR' ? food.price_eur : food.price_ghs;
    const symbol = currency === 'EUR' ? '€' : '₵';

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!onAddToCart) {
            router.visit('/login');
            return;
        }

        setIsAdding(true);
        try {
            const response = await fetch('/cart/add', {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                },
                body: JSON.stringify({
                    type: 'food',
                    item_id: food.id,
                    name: food.name,
                    slug: food.slug,
                    price_eur: food.price_eur,
                    price_ghs: food.price_ghs,
                    image: food.images?.[0] || null,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || 'Failed to add to cart');
            } else {
                router.visit('/cart');
            }
        } catch (error) {
            alert('Error adding to cart');
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <Link
            href={`/foods/${food.slug}`}
            className="group relative h-full overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-300"
        >
            {/* Image */}
            <div className="relative h-64 w-full overflow-hidden bg-gray-100">
                <img
                    src={food.images?.[0] || 'https://placehold.co/400x300/FF6B35/FFFFFF?text=Food'}
                    alt={food.name}
                    className="h-full w-full object-cover group-hover:scale-110 transition duration-500"
                />

                {/* Stock Badge */}
                {food.stock <= 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">Out of Stock</span>
                    </div>
                )}

                {/* Like Button */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setLiked(!liked);
                    }}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition"
                >
                    <Heart size={18} className={liked ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
                </button>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col h-full">
                {/* Category */}
                {food.category && (
                    <p className="text-xs font-semibold text-brand-brown uppercase tracking-wide mb-1">
                        {food.category.name}
                    </p>
                )}

                {/* Name */}
                <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-brand-brown transition">
                    {food.name}
                </h3>

                {/* Description */}
                {food.description && (
                    <p className="text-xs text-gray-600 line-clamp-2 mb-3 flex-grow">
                        {food.description}
                    </p>
                )}

                {/* Shop Name */}
                <p className="text-xs text-gray-500 mb-3">
                    {food.shop?.name}
                </p>

                {/* Price and Cart Button */}
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                    <div className="flex flex-col">
                        <p className="text-sm font-bold text-brand-brown">
                            {symbol}{Number(price).toFixed(2)}
                        </p>
                        {food.stock > 0 && (
                            <p className="text-xs text-gray-500">{food.stock} available</p>
                        )}
                    </div>

                    {food.stock > 0 && (
                        <button
                            onClick={handleAddToCart}
                            disabled={isAdding}
                            className="p-2 rounded-full bg-brand-brown text-white hover:bg-brand-dark transition disabled:opacity-50"
                            title="Add to cart"
                        >
                            <ShoppingCart size={18} />
                        </button>
                    )}
                </div>
            </div>
        </Link>
    );
}
