<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\HomepageContent;
use App\Models\Product;
use App\Models\Review;
use App\Models\Service;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Roles
        Role::firstOrCreate(['name' => 'admin']);
        Role::firstOrCreate(['name' => 'attendant']);
        Role::firstOrCreate(['name' => 'customer']);

        // 2. Users
        $admin = User::firstOrCreate(['email' => 'admin@mamaafrica.de'], [
            'name'     => 'Admin',
            'password' => Hash::make('password'),
            'preferred_currency' => 'EUR',
            'preferred_language' => 'en',
        ]);
        $admin->assignRole('admin');

        $attendantDE = User::firstOrCreate(['email' => 'de@mamaafrica.de'], [
            'name'     => 'Elmshorn Attendant',
            'password' => Hash::make('password'),
            'preferred_currency' => 'EUR',
            'preferred_language' => 'de',
        ]);
        $attendantDE->assignRole('attendant');

        $attendantGH = User::firstOrCreate(['email' => 'gh@mamaafrica.de'], [
            'name'     => 'Accra Attendant',
            'password' => Hash::make('password'),
            'preferred_currency' => 'GHS',
            'preferred_language' => 'tw',
        ]);
        $attendantGH->assignRole('attendant');

        // 3. Shops
        $shopDE = Shop::firstOrCreate(['country' => 'DE'], [
            'name'           => 'Mama Africa - Elmshorn',
            'city'           => 'Elmshorn',
            'address'        => 'Holstenstraße 6a, 25335 Elmshorn, Germany',
            'phone_whatsapp' => '+491632197541',
            'attendant_id'   => $attendantDE->id,
            'is_active'      => true,
        ]);

        $shopGH = Shop::firstOrCreate(['country' => 'GH'], [
            'name'           => 'Mama Africa - Accra',
            'city'           => 'Accra',
            'address'        => 'Osu, Accra, Ghana',
            'phone_whatsapp' => '+233550000000',
            'attendant_id'   => $attendantGH->id,
            'is_active'      => true,
        ]);

        // 4. Categories
        $beauty = Category::firstOrCreate(['slug' => 'beauty-products'], ['name' => 'Beauty Products', 'type' => 'product']);
        $fashion = Category::firstOrCreate(['slug' => 'fashion'], ['name' => 'Fashion', 'type' => 'product']);
        Category::firstOrCreate(['slug' => 'women-fashion', 'parent_id' => $fashion->id], ['name' => 'Women', 'type' => 'product']);
        Category::firstOrCreate(['slug' => 'men-fashion', 'parent_id' => $fashion->id], ['name' => 'Men', 'type' => 'product']);
        Category::firstOrCreate(['slug' => 'kids-fashion', 'parent_id' => $fashion->id], ['name' => 'Kids', 'type' => 'product']);
        $accessories = Category::firstOrCreate(['slug' => 'accessories'], ['name' => 'Accessories', 'type' => 'product']);
        $hairSalon = Category::firstOrCreate(['slug' => 'hair-salon'], ['name' => 'Hair Salon', 'type' => 'service']);
        $spa = Category::firstOrCreate(['slug' => 'spa'], ['name' => 'Spa & Care', 'type' => 'service']);
        
        // Food Categories
        $localDishes = Category::firstOrCreate(['slug' => 'local-dishes'], ['name' => 'Traditional Dishes', 'type' => 'food']);
        $beverages = Category::firstOrCreate(['slug' => 'drinks-beverages'], ['name' => 'Drinks & Beverages', 'type' => 'food']);

        // 5. Products
        Product::firstOrCreate(['slug' => 'holland-wax'], [
            'shop_id'     => $shopDE->id,
            'category_id' => $beauty->id,
            'name'        => 'Holland Sugaring Wax',
            'description' => 'Premium sugaring wax from Holland, suitable for sensitive skin.',
            'price_eur'   => 15.99,
            'price_ghs'   => 200,
            'stock'       => 50,
            'images'      => ['https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=600'],
            'is_active'   => true,
        ]);
        Product::firstOrCreate(['slug' => 'organic-shea-butter'], [
            'shop_id'     => $shopDE->id,
            'category_id' => $beauty->id,
            'name'        => 'Organic Golden Shea Butter',
            'description' => '100% natural, raw unrefined shea butter directly harvested in Northern Ghana. Deeply hydrates and restores skin vitality.',
            'price_eur'   => 18.50,
            'price_ghs'   => 220,
            'stock'       => 80,
            'images'      => ['https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=600'],
            'is_active'   => true,
        ]);
        Product::firstOrCreate(['slug' => 'ankara-fabric'], [
            'shop_id'     => $shopDE->id,
            'category_id' => $fashion->id,
            'name'        => 'Classic Ankara Fabric (6 Yards)',
            'description' => 'Beautiful authentic 100% cotton Ankara wax print fabric featuring high-vibrancy motifs.',
            'price_eur'   => 45.00,
            'price_ghs'   => 550,
            'stock'       => 20,
            'images'      => ['https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=600'],
            'is_active'   => true,
        ]);
        Product::firstOrCreate(['slug' => 'kente-luxury-scarf'], [
            'shop_id'     => $shopGH->id,
            'category_id' => $accessories->id,
            'name'        => 'Handwoven Luxury Kente Scarf',
            'description' => 'Masterfully handwoven royal Kente scarf made from premium silk and cotton threads. A symbol of royalty and prestige.',
            'price_eur'   => 25.00,
            'price_ghs'   => 300,
            'stock'       => 15,
            'images'      => ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=600'],
            'is_active'   => true,
        ]);

        // Food Items
        \App\Models\Food::firstOrCreate(['slug' => 'jollof-rice-chicken'], [
            'shop_id'     => $shopDE->id,
            'category_id' => $localDishes->id,
            'name'        => 'Mama Africa Jollof Rice with Grilled Chicken',
            'description' => 'Richly spiced smoky Jollof rice cooked in authentic tomato sauce. Served with a tender quarter leg of grilled herb chicken and sweet fried plantains (kelewele).',
            'price_eur'   => 12.50,
            'price_ghs'   => 120.00,
            'stock'       => 25,
            'images'      => ['https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&q=80&w=600'],
            'is_active'   => true,
        ]);
        \App\Models\Food::firstOrCreate(['slug' => 'waakye-deluxe'], [
            'shop_id'     => $shopGH->id,
            'category_id' => $localDishes->id,
            'name'        => 'Waakye Deluxe Special',
            'description' => 'Traditional Ghanaian cooked rice and beans prepared with dried millet stalk leaves. Complete with spaghetti (talia), hard-boiled egg, fried fish, cow skin (wele) stew, and authentic black pepper sauce (shito).',
            'price_eur'   => 10.00,
            'price_ghs'   => 95.00,
            'stock'       => 30,
            'images'      => ['https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600'],
            'is_active'   => true,
        ]);
        \App\Models\Food::firstOrCreate(['slug' => 'sobolo-drink'], [
            'shop_id'     => $shopDE->id,
            'category_id' => $beverages->id,
            'name'        => 'Sobolo Spiced Hibiscus Juice',
            'description' => 'Refreshing chilled drink brewed from organic dried Roselle hibiscus leaves, ginger root, cloves, and pineapple chunks.',
            'price_eur'   => 3.50,
            'price_ghs'   => 35.00,
            'stock'       => 100,
            'images'      => ['https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&q=80&w=600'],
            'is_active'   => true,
        ]);

        // 6. Services
        Service::firstOrCreate(['slug' => 'mens-haircut'], [
            'shop_id'          => $shopDE->id,
            'category_id'      => $hairSalon->id,
            'name'             => 'Men\'s Haircut & Razor Fade',
            'description'      => 'Clean premium cut, detailed hairline shaping, and custom razor fade.',
            'price_eur'        => 20.00,
            'price_ghs'        => 150,
            'duration_minutes' => 30,
            'images'           => ['https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=600'],
            'is_active'        => true,
        ]);
        Service::firstOrCreate(['slug' => 'signature-box-braids'], [
            'shop_id'          => $shopDE->id,
            'category_id'      => $hairSalon->id,
            'name'             => 'Signature Knotless Box Braids',
            'description'      => 'Sleek, painless, and lightweight box braids tailored to any length and parting style.',
            'price_eur'        => 120.00,
            'price_ghs'        => 1200,
            'duration_minutes' => 180,
            'images'           => ['https://images.unsplash.com/photo-1640555900713-3ee749c4a9a0?auto=format&fit=crop&q=80&w=600'],
            'is_active'        => true,
        ]);
        Service::firstOrCreate(['slug' => 'medizinische-fusspflege'], [
            'shop_id'          => $shopDE->id,
            'category_id'      => $spa->id,
            'name'             => 'Medizinische Fußpflege',
            'description'      => 'Professional medical foot care, cleansing treatment, and massage.',
            'price_eur'        => 35.00,
            'price_ghs'        => 450,
            'duration_minutes' => 45,
            'images'           => ['https://images.unsplash.com/photo-1519415510236-8a5940029b6f?auto=format&fit=crop&q=80&w=600'],
            'is_active'        => true,
        ]);

        // 7. Homepage Content (Carousel Slides)
        HomepageContent::firstOrCreate(['section' => 'hero'], [
            'content' => [
                'slides' => [
                    [
                        'type' => 'image',
                        'url' => 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=1920',
                        'title' => 'Summer Beauty & Gold Collection',
                        'subtitle' => 'Discover organic golden shea butters and premium cosmetics directly imported for you.',
                        'cta_text' => 'Shop New Arrivals',
                        'cta_link' => '/shop?category=beauty-products',
                    ],
                    [
                        'type' => 'image',
                        'url' => 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=1920',
                        'title' => 'Vibrant African Ankara & Fashion',
                        'subtitle' => 'Classic cotton prints, royal scarves, and high-vibrancy designs hand-selected in Ghana.',
                        'cta_text' => 'Explore Modern Ankara',
                        'cta_link' => '/shop?category=fashion',
                    ],
                    [
                        'type' => 'image',
                        'url' => 'https://images.unsplash.com/photo-1640555900713-3ee749c4a9a0?auto=format&fit=crop&q=80&w=1920',
                        'title' => 'Master Salon & Braiding Care',
                        'subtitle' => 'Professional knotless box braids, custom wig styling, and medically-certified spa care.',
                        'cta_text' => 'Book a Care Session',
                        'cta_link' => '/services',
                    ]
                ]
            ],
            'is_active' => true,
            'sort_order' => 1,
        ]);

        // 8. Reviews
        Review::firstOrCreate(['reviewer_name' => 'Sarah M.'], [
            'rating'  => 5,
            'comment' => 'Incredible medical foot care session and beautiful Ankara prints. The WhatsApp support is extremely friendly!',
            'is_active' => true,
        ]);
        Review::firstOrCreate(['reviewer_name' => 'Kwame D.'], [
            'rating'  => 5,
            'comment' => 'Golden unrefined Shea butter is amazing for my skin! Quick pick-up at the Elmshorn store.',
            'is_active' => true,
        ]);
    }
}
