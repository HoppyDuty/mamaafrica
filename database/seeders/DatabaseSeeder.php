<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Food;
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
        $womenFashion = Category::firstOrCreate(['slug' => 'women-fashion', 'parent_id' => $fashion->id], ['name' => 'Women', 'type' => 'product']);
        $menFashion = Category::firstOrCreate(['slug' => 'men-fashion', 'parent_id' => $fashion->id], ['name' => 'Men', 'type' => 'product']);
        $kidsFashion = Category::firstOrCreate(['slug' => 'kids-fashion', 'parent_id' => $fashion->id], ['name' => 'Kids', 'type' => 'product']);
        $accessories = Category::firstOrCreate(['slug' => 'accessories'], ['name' => 'Accessories', 'type' => 'product']);
        $bags = Category::firstOrCreate(['slug' => 'bags'], ['name' => 'Bags', 'type' => 'product']);
        $shoes = Category::firstOrCreate(['slug' => 'shoes'], ['name' => 'Shoes', 'type' => 'product']);

        $hairSalon = Category::firstOrCreate(['slug' => 'hair-salon'], ['name' => 'Hair Salon', 'type' => 'service']);
        $spa = Category::firstOrCreate(['slug' => 'spa'], ['name' => 'Spa & Care', 'type' => 'service']);
        $nailsWigs = Category::firstOrCreate(['slug' => 'nails-wigs'], ['name' => 'Nails & Wigs', 'type' => 'service']);

        $localDishes = Category::firstOrCreate(['slug' => 'local-dishes'], ['name' => 'Traditional Dishes', 'type' => 'food']);
        $beverages = Category::firstOrCreate(['slug' => 'drinks-beverages'], ['name' => 'Drinks & Beverages', 'type' => 'food']);
        $spices = Category::firstOrCreate(['slug' => 'spices-seasonings'], ['name' => 'Spices & Seasonings', 'type' => 'food']);
        $fruitsVeg = Category::firstOrCreate(['slug' => 'fruits-vegetables'], ['name' => 'Fresh Fruits & Vegetables', 'type' => 'food']);
        $grains = Category::firstOrCreate(['slug' => 'grains-ingredients'], ['name' => 'Grains & Ingredients', 'type' => 'food']);

        // 5. Products — Fashion, Bags, Shoes & Accessories
        $products = [
            ['slug' => 'holland-wax', 'shop' => $shopDE, 'category' => $beauty,
                'name' => 'Holland Sugaring Wax', 'description' => 'Premium sugaring wax from Holland, suitable for sensitive skin.',
                'price_eur' => 15.99, 'price_ghs' => 200, 'stock' => 50,
                'images' => ['https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=600']],
            ['slug' => 'organic-shea-butter', 'shop' => $shopDE, 'category' => $beauty,
                'name' => 'Organic Golden Shea Butter', 'description' => '100% natural, raw unrefined shea butter directly harvested in Northern Ghana. Deeply hydrates and restores skin vitality.',
                'price_eur' => 18.50, 'price_ghs' => 220, 'stock' => 80,
                'images' => ['https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=600']],
            ['slug' => 'ankara-fabric', 'shop' => $shopDE, 'category' => $fashion,
                'name' => 'Classic Ankara Fabric (6 Yards)', 'description' => 'Beautiful authentic 100% cotton Ankara wax print fabric featuring high-vibrancy motifs.',
                'price_eur' => 45.00, 'price_ghs' => 550, 'stock' => 20,
                'images' => ['https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=600']],
            ['slug' => 'ankara-maxi-dress', 'shop' => $shopDE, 'category' => $womenFashion,
                'name' => 'Elegant Ankara Maxi Dress', 'description' => 'Flowing floor-length gown cut from vibrant Ankara print, tailored with a flattering waist wrap.',
                'price_eur' => 55.00, 'price_ghs' => 600, 'stock' => 18,
                'images' => ['https://images.unsplash.com/photo-1583846717393-dc2412c95ed7?auto=format&fit=crop&q=80&w=600']],
            ['slug' => 'agbada-traditional-gown', 'shop' => $shopGH, 'category' => $menFashion,
                'name' => 'Agbada Traditional Gown', 'description' => 'Regal three-piece flowing agbada robe with rich embroidery, worn for weddings and ceremonies.',
                'price_eur' => 90.00, 'price_ghs' => 950, 'stock' => 10,
                'images' => ['https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=600']],
            ['slug' => 'dashiki-print-shirt', 'shop' => $shopGH, 'category' => $menFashion,
                'name' => 'Dashiki Print Shirt', 'description' => 'Relaxed-fit short-sleeve dashiki shirt with bold geometric print, perfect for everyday wear.',
                'price_eur' => 30.00, 'price_ghs' => 280, 'stock' => 25,
                'images' => ['https://images.unsplash.com/photo-1622445275576-721325763afe?auto=format&fit=crop&q=80&w=600']],
            ['slug' => 'kids-ankara-outfit-set', 'shop' => $shopDE, 'category' => $kidsFashion,
                'name' => 'Kids Ankara Outfit Set', 'description' => 'Matching top and shorts set in playful Ankara print, sized for toddlers and young children.',
                'price_eur' => 25.00, 'price_ghs' => 220, 'stock' => 22,
                'images' => ['https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&q=80&w=600']],
            ['slug' => 'kaftan-robe-unisex', 'shop' => $shopGH, 'category' => $fashion,
                'name' => 'Kaftan Robe (Unisex)', 'description' => 'Loose, breathable embroidered kaftan robe suited to warm-weather styling for any gender.',
                'price_eur' => 48.00, 'price_ghs' => 500, 'stock' => 15,
                'images' => ['https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=600']],
            ['slug' => 'kente-luxury-scarf', 'shop' => $shopGH, 'category' => $accessories,
                'name' => 'Handwoven Luxury Kente Scarf', 'description' => 'Masterfully handwoven royal Kente scarf made from premium silk and cotton threads. A symbol of royalty and prestige.',
                'price_eur' => 25.00, 'price_ghs' => 300, 'stock' => 15,
                'images' => ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=600']],
            ['slug' => 'premium-gele-headwrap', 'shop' => $shopGH, 'category' => $accessories,
                'name' => 'Premium Gele Head Wrap', 'description' => 'Stiff, shimmering fabric pre-cut for elaborate gele head wrap styling at parties and ceremonies.',
                'price_eur' => 20.00, 'price_ghs' => 180, 'stock' => 30,
                'images' => ['https://images.unsplash.com/photo-1621786030484-4c855eed6974?auto=format&fit=crop&q=80&w=600']],
            ['slug' => 'african-waist-beads-set', 'shop' => $shopGH, 'category' => $accessories,
                'name' => 'African Waist Beads Set', 'description' => 'Traditional adjustable waist beads in a set of five colorways, handcrafted with glass beads.',
                'price_eur' => 12.00, 'price_ghs' => 100, 'stock' => 60,
                'images' => ['https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&q=80&w=600']],
            ['slug' => 'beaded-jewelry-set', 'shop' => $shopDE, 'category' => $accessories,
                'name' => 'Beaded Jewelry Set', 'description' => 'Matching handcrafted necklace and earring set in recycled glass beads with brass accents.',
                'price_eur' => 28.00, 'price_ghs' => 260, 'stock' => 24,
                'images' => ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600']],
            ['slug' => 'wooden-tribal-sunglasses', 'shop' => $shopDE, 'category' => $accessories,
                'name' => 'Wooden Tribal Sunglasses', 'description' => 'Hand-carved wooden frame sunglasses with UV-protected polarized lenses and tribal engravings.',
                'price_eur' => 22.00, 'price_ghs' => 190, 'stock' => 20,
                'images' => ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=600']],
            ['slug' => 'handwoven-ankara-tote-bag', 'shop' => $shopDE, 'category' => $bags,
                'name' => 'Handwoven Ankara Tote Bag', 'description' => 'Spacious everyday tote lined in cotton, outer shell handwoven from durable Ankara print fabric.',
                'price_eur' => 35.00, 'price_ghs' => 320, 'stock' => 20,
                'images' => ['https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=600']],
            ['slug' => 'leather-crossbody-kente-trim', 'shop' => $shopGH, 'category' => $bags,
                'name' => 'Leather Crossbody Bag with Kente Trim', 'description' => 'Genuine leather crossbody bag accented with a woven Kente strap panel.',
                'price_eur' => 65.00, 'price_ghs' => 650, 'stock' => 12,
                'images' => ['https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&q=80&w=600']],
            ['slug' => 'woven-raffia-beach-bag', 'shop' => $shopGH, 'category' => $bags,
                'name' => 'Woven Raffia Beach Bag', 'description' => 'Lightweight hand-woven raffia beach tote with leather handles, perfect for market days.',
                'price_eur' => 27.00, 'price_ghs' => 240, 'stock' => 18,
                'images' => ['https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600']],
            ['slug' => 'handmade-leather-sandals', 'shop' => $shopGH, 'category' => $shoes,
                'name' => 'Handmade Leather Sandals (Ahenema)', 'description' => 'Classic Ghanaian ahenema sandals, hand-stitched from genuine leather with cushioned soles.',
                'price_eur' => 40.00, 'price_ghs' => 380, 'stock' => 22,
                'images' => ['https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&q=80&w=600']],
            ['slug' => 'african-print-canvas-sneakers', 'shop' => $shopDE, 'category' => $shoes,
                'name' => 'African Print Canvas Sneakers', 'description' => 'Low-top canvas sneakers featuring bold wax-print panels with a rubber sole for everyday comfort.',
                'price_eur' => 55.00, 'price_ghs' => 500, 'stock' => 16,
                'images' => ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=600']],
            ['slug' => 'beaded-slide-sandals', 'shop' => $shopGH, 'category' => $shoes,
                'name' => 'Beaded Slide Sandals', 'description' => 'Comfortable open-toe slides finished with a hand-beaded strap in traditional patterns.',
                'price_eur' => 30.00, 'price_ghs' => 260, 'stock' => 20,
                'images' => ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=600']],
        ];

        foreach ($products as $p) {
            Product::firstOrCreate(['slug' => $p['slug']], [
                'shop_id' => $p['shop']->id,
                'category_id' => $p['category']->id,
                'name' => $p['name'],
                'description' => $p['description'],
                'price_eur' => $p['price_eur'],
                'price_ghs' => $p['price_ghs'],
                'stock' => $p['stock'],
                'images' => $p['images'],
                'is_active' => true,
            ]);
        }

        // 6. Food — Dishes, Drinks, Spices, Fruits/Veg & Grains
        $foods = [
            ['slug' => 'jollof-rice-chicken', 'shop' => $shopDE, 'category' => $localDishes,
                'name' => 'Mama Africa Jollof Rice with Grilled Chicken', 'description' => 'Richly spiced smoky Jollof rice cooked in authentic tomato sauce. Served with a tender quarter leg of grilled herb chicken and sweet fried plantains (kelewele).',
                'price_eur' => 12.50, 'price_ghs' => 120.00, 'stock' => 25,
                'images' => ['https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&q=80&w=600']],
            ['slug' => 'waakye-deluxe', 'shop' => $shopGH, 'category' => $localDishes,
                'name' => 'Waakye Deluxe Special', 'description' => 'Traditional Ghanaian cooked rice and beans prepared with dried millet stalk leaves. Complete with spaghetti (talia), hard-boiled egg, fried fish, cow skin (wele) stew, and authentic black pepper sauce (shito).',
                'price_eur' => 10.00, 'price_ghs' => 95.00, 'stock' => 30,
                'images' => ['https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600']],
            ['slug' => 'banku-grilled-tilapia', 'shop' => $shopGH, 'category' => $localDishes,
                'name' => 'Banku with Grilled Tilapia and Pepper Sauce', 'description' => 'Fermented corn and cassava dough banku, served with whole grilled tilapia and fresh onion-tomato pepper sauce.',
                'price_eur' => 14.00, 'price_ghs' => 130.00, 'stock' => 20,
                'images' => ['https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=600']],
            ['slug' => 'fufu-light-soup-goat', 'shop' => $shopGH, 'category' => $localDishes,
                'name' => 'Fufu with Light Soup and Goat Meat', 'description' => 'Smooth pounded cassava and plantain fufu served in a peppery light soup with tender goat meat.',
                'price_eur' => 13.50, 'price_ghs' => 125.00, 'stock' => 20,
                'images' => ['https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&q=80&w=600']],
            ['slug' => 'egusi-soup-pounded-yam', 'shop' => $shopDE, 'category' => $localDishes,
                'name' => 'Egusi Soup with Pounded Yam', 'description' => 'Ground melon seed soup simmered with leafy greens, smoked fish and assorted meat, served with pounded yam.',
                'price_eur' => 12.00, 'price_ghs' => 115.00, 'stock' => 18,
                'images' => ['https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=600']],
            ['slug' => 'kelewele-spiced-plantain', 'shop' => $shopDE, 'category' => $localDishes,
                'name' => 'Kelewele (Spiced Fried Plantain)', 'description' => 'Ripe plantain cubes marinated in ginger, cayenne and cloves, then fried to a sticky-sweet crisp.',
                'price_eur' => 6.00, 'price_ghs' => 50.00, 'stock' => 35,
                'images' => ['https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=600']],
            ['slug' => 'sobolo-drink', 'shop' => $shopDE, 'category' => $beverages,
                'name' => 'Sobolo Spiced Hibiscus Juice', 'description' => 'Refreshing chilled drink brewed from organic dried Roselle hibiscus leaves, ginger root, cloves, and pineapple chunks.',
                'price_eur' => 3.50, 'price_ghs' => 35.00, 'stock' => 100,
                'images' => ['https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&q=80&w=600']],
            ['slug' => 'chapman-cocktail-mix', 'shop' => $shopDE, 'category' => $beverages,
                'name' => 'Chapman Cocktail Mix (Non-Alcoholic)', 'description' => 'Bottled fruity blend of grenadine, bitters, and citrus soda in the classic West African party mocktail style.',
                'price_eur' => 4.00, 'price_ghs' => 32.00, 'stock' => 60,
                'images' => ['https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&q=80&w=600']],
            ['slug' => 'ginger-spice-beer', 'shop' => $shopGH, 'category' => $beverages,
                'name' => 'Ginger Spice Beer (Bottled)', 'description' => 'Fiery, naturally fermented ginger beer bottled with a touch of lime and honey.',
                'price_eur' => 3.20, 'price_ghs' => 28.00, 'stock' => 70,
                'images' => ['https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&q=80&w=600']],
            ['slug' => 'zobo-concentrate-bottle', 'shop' => $shopGH, 'category' => $beverages,
                'name' => 'Bissap/Zobo Concentrate Bottle', 'description' => 'Ready-to-dilute hibiscus concentrate, just add water and ice for an instant chilled zobo drink.',
                'price_eur' => 5.00, 'price_ghs' => 38.00, 'stock' => 55,
                'images' => ['https://images.unsplash.com/photo-1546171753-97d7676e4602?auto=format&fit=crop&q=80&w=600']],
            ['slug' => 'african-malt-drink', 'shop' => $shopGH, 'category' => $beverages,
                'name' => 'African Malt Drink', 'description' => 'Rich, non-alcoholic malted barley drink packed with B vitamins, served ice cold.',
                'price_eur' => 2.50, 'price_ghs' => 20.00, 'stock' => 90,
                'images' => ['https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&q=80&w=600']],
            ['slug' => 'suya-spice-mix-yaji', 'shop' => $shopDE, 'category' => $spices,
                'name' => 'Suya Spice Mix (Yaji)', 'description' => 'Authentic roasted peanut and pepper suya spice blend for grilling meat and skewers.',
                'price_eur' => 6.50, 'price_ghs' => 45.00, 'stock' => 80,
                'images' => ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=600']],
            ['slug' => 'dried-scotch-bonnet-peppers', 'shop' => $shopDE, 'category' => $spices,
                'name' => 'Dried Scotch Bonnet Peppers (100g)', 'description' => 'Sun-dried scotch bonnet peppers, ground or whole, for authentic West African heat.',
                'price_eur' => 4.50, 'price_ghs' => 30.00, 'stock' => 70,
                'images' => ['https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?auto=format&fit=crop&q=80&w=600']],
            ['slug' => 'ground-egusi-melon-seeds', 'shop' => $shopGH, 'category' => $spices,
                'name' => 'Ground Egusi (Melon Seeds), 500g', 'description' => 'Finely ground melon seeds, the base ingredient for authentic egusi soup.',
                'price_eur' => 8.00, 'price_ghs' => 70.00, 'stock' => 45,
                'images' => ['https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&q=80&w=600']],
            ['slug' => 'curry-thyme-seasoning-pack', 'shop' => $shopDE, 'category' => $spices,
                'name' => 'Curry & Thyme African Seasoning Pack', 'description' => 'Classic curry powder and dried thyme duo used in stews, jollof rice and soups.',
                'price_eur' => 5.00, 'price_ghs' => 40.00, 'stock' => 65,
                'images' => ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=601']],
            ['slug' => 'grains-of-selim-uda-spice', 'shop' => $shopGH, 'category' => $spices,
                'name' => 'Grains of Selim (Uda Spice)', 'description' => 'Smoky, peppery West African spice pods used in pepper soups and stews.',
                'price_eur' => 7.00, 'price_ghs' => 55.00, 'stock' => 40,
                'images' => ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=602']],
            ['slug' => 'fresh-plantains-bunch', 'shop' => $shopGH, 'category' => $fruitsVeg,
                'name' => 'Fresh Plantains (Bunch)', 'description' => 'A full bunch of ripening plantains, perfect for frying, boiling or roasting.',
                'price_eur' => 3.50, 'price_ghs' => 25.00, 'stock' => 50,
                'images' => ['https://images.unsplash.com/photo-1571771019784-3ff35f4f4277?auto=format&fit=crop&q=80&w=600']],
            ['slug' => 'fresh-scotch-bonnet-peppers', 'shop' => $shopGH, 'category' => $fruitsVeg,
                'name' => 'Fresh Scotch Bonnet Peppers (250g)', 'description' => 'Vibrant fresh scotch bonnet peppers, hand-picked for maximum heat and flavor.',
                'price_eur' => 3.00, 'price_ghs' => 20.00, 'stock' => 60,
                'images' => ['https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?auto=format&fit=crop&q=80&w=601']],
            ['slug' => 'garden-eggs-african-eggplant', 'shop' => $shopDE, 'category' => $fruitsVeg,
                'name' => 'Garden Eggs (African Eggplant, 1kg)', 'description' => 'Small, slightly bitter African garden eggs, traditionally eaten fresh with pepper sauce.',
                'price_eur' => 4.00, 'price_ghs' => 28.00, 'stock' => 40,
                'images' => ['https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&q=80&w=600']],
            ['slug' => 'fresh-okra', 'shop' => $shopDE, 'category' => $fruitsVeg,
                'name' => 'Fresh Okra (500g)', 'description' => 'Tender fresh okra pods, ideal for soups, stews and stir-fries.',
                'price_eur' => 3.20, 'price_ghs' => 22.00, 'stock' => 55,
                'images' => ['https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=600']],
            ['slug' => 'premium-gari-cassava-flakes', 'shop' => $shopGH, 'category' => $grains,
                'name' => 'Premium Gari (Cassava Flakes, 1kg)', 'description' => 'Toasted cassava flakes, a pantry staple for eba, gari fortor and quick meals.',
                'price_eur' => 6.00, 'price_ghs' => 40.00, 'stock' => 60,
                'images' => ['https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600']],
            ['slug' => 'palm-oil-unrefined', 'shop' => $shopGH, 'category' => $grains,
                'name' => 'Palm Oil (Unrefined, 1L)', 'description' => 'Rich, unrefined red palm oil pressed from fresh palm fruit, the base for authentic stews.',
                'price_eur' => 9.00, 'price_ghs' => 60.00, 'stock' => 45,
                'images' => ['https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?auto=format&fit=crop&q=80&w=600']],
            ['slug' => 'groundnut-paste-peanut-butter', 'shop' => $shopDE, 'category' => $grains,
                'name' => 'Groundnut Paste (Natural Peanut Butter)', 'description' => 'Stone-ground natural groundnut paste, unsweetened, used in soups and as a spread.',
                'price_eur' => 7.50, 'price_ghs' => 50.00, 'stock' => 50,
                'images' => ['https://images.unsplash.com/photo-1567113463300-102a7eb3cb26?auto=format&fit=crop&q=80&w=600']],
            ['slug' => 'jollof-rice-parboiled-long-grain', 'shop' => $shopDE, 'category' => $grains,
                'name' => 'Jollof Rice, Parboiled Long Grain (2kg)', 'description' => 'Aged parboiled long-grain rice that holds its shape and soaks up flavor for perfect Jollof.',
                'price_eur' => 8.50, 'price_ghs' => 65.00, 'stock' => 70,
                'images' => ['https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=601']],
            ['slug' => 'dried-stockfish-whole', 'shop' => $shopGH, 'category' => $grains,
                'name' => 'Dried Stockfish (Whole)', 'description' => 'Air-dried whole stockfish, a prized protein for soups and traditional stews.',
                'price_eur' => 15.00, 'price_ghs' => 130.00, 'stock' => 25,
                'images' => ['https://images.unsplash.com/photo-1544943910-4c1dc44aab44?auto=format&fit=crop&q=80&w=600']],
            ['slug' => 'tiger-nuts-dried', 'shop' => $shopGH, 'category' => $grains,
                'name' => 'Tiger Nuts (Dried, 500g)', 'description' => 'Naturally sweet dried tiger nuts, snack on them raw or blend into tiger nut milk (kunun aya).',
                'price_eur' => 6.50, 'price_ghs' => 45.00, 'stock' => 40,
                'images' => ['https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&q=80&w=600']],
            ['slug' => 'kola-nuts-fresh-pack', 'shop' => $shopDE, 'category' => $grains,
                'name' => 'Kola Nuts (Fresh Pack)', 'description' => 'Fresh bitter kola nuts, traditionally shared as a gesture of hospitality and respect.',
                'price_eur' => 5.00, 'price_ghs' => 35.00, 'stock' => 30,
                'images' => ['https://images.unsplash.com/photo-1580013759032-c96505e24c1f?auto=format&fit=crop&q=80&w=600']],
        ];

        foreach ($foods as $f) {
            Food::firstOrCreate(['slug' => $f['slug']], [
                'shop_id' => $f['shop']->id,
                'category_id' => $f['category']->id,
                'name' => $f['name'],
                'description' => $f['description'],
                'price_eur' => $f['price_eur'],
                'price_ghs' => $f['price_ghs'],
                'stock' => $f['stock'],
                'images' => $f['images'],
                'is_active' => true,
            ]);
        }

        // 7. Services — Hair Salon, Spa & Nails/Wigs
        $services = [
            ['slug' => 'mens-haircut', 'shop' => $shopDE, 'category' => $hairSalon,
                'name' => 'Men\'s Haircut & Razor Fade', 'description' => 'Clean premium cut, detailed hairline shaping, and custom razor fade.',
                'price_eur' => 20.00, 'price_ghs' => 150, 'duration_minutes' => 30,
                'images' => ['https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=600']],
            ['slug' => 'signature-box-braids', 'shop' => $shopDE, 'category' => $hairSalon,
                'name' => 'Signature Knotless Box Braids', 'description' => 'Sleek, painless, and lightweight box braids tailored to any length and parting style.',
                'price_eur' => 120.00, 'price_ghs' => 1200, 'duration_minutes' => 180,
                'images' => ['https://images.unsplash.com/photo-1519415387722-a1c3bbef716c?auto=format&fit=crop&q=80&w=600']],
            ['slug' => 'cornrows-traditional-braiding', 'shop' => $shopGH, 'category' => $hairSalon,
                'name' => 'Cornrows & Traditional Braiding', 'description' => 'Neat, long-lasting cornrow patterns styled by experienced braiders, custom design included.',
                'price_eur' => 60.00, 'price_ghs' => 650, 'duration_minutes' => 120,
                'images' => ['https://images.unsplash.com/photo-1523263685509-57c1d050d19b?auto=format&fit=crop&q=80&w=600']],
            ['slug' => 'dreadlock-retwist-style', 'shop' => $shopGH, 'category' => $hairSalon,
                'name' => 'Dreadlock Retwist & Style', 'description' => 'Root-to-tip retwisting, cleansing and styling for healthy, defined locs.',
                'price_eur' => 45.00, 'price_ghs' => 480, 'duration_minutes' => 90,
                'images' => ['https://images.unsplash.com/photo-1620331311520-246422fd82f9?auto=format&fit=crop&q=80&w=600']],
            ['slug' => 'wig-installation-styling', 'shop' => $shopDE, 'category' => $hairSalon,
                'name' => 'Wig Installation & Styling', 'description' => 'Seamless lace-front wig install with customized cutting, tinting and styling.',
                'price_eur' => 55.00, 'price_ghs' => 600, 'duration_minutes' => 75,
                'images' => ['https://images.unsplash.com/photo-1595475207225-428b62bda831?auto=format&fit=crop&q=80&w=600']],
            ['slug' => 'kids-haircut', 'shop' => $shopDE, 'category' => $hairSalon,
                'name' => 'Kids Haircut', 'description' => 'Gentle, quick haircut and shape-up for children in a friendly environment.',
                'price_eur' => 12.00, 'price_ghs' => 100, 'duration_minutes' => 20,
                'images' => ['https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&q=80&w=600']],
            ['slug' => 'medizinische-fusspflege', 'shop' => $shopDE, 'category' => $spa,
                'name' => 'Medizinische Fußpflege', 'description' => 'Professional medical foot care, cleansing treatment, and massage.',
                'price_eur' => 35.00, 'price_ghs' => 450, 'duration_minutes' => 45,
                'images' => ['https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&q=80&w=600']],
            ['slug' => 'full-body-shea-massage', 'shop' => $shopDE, 'category' => $spa,
                'name' => 'Full Body African Shea Massage', 'description' => 'Deeply relaxing full-body massage using warmed organic shea butter and essential oils.',
                'price_eur' => 65.00, 'price_ghs' => 700, 'duration_minutes' => 60,
                'images' => ['https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=600']],
            ['slug' => 'relaxing-facial-treatment', 'shop' => $shopGH, 'category' => $spa,
                'name' => 'Relaxing Facial Treatment', 'description' => 'Deep-cleansing facial with steam, exfoliation and a hydrating natural mask.',
                'price_eur' => 40.00, 'price_ghs' => 420, 'duration_minutes' => 45,
                'images' => ['https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80&w=600']],
            ['slug' => 'gel-manicure-pedicure', 'shop' => $shopGH, 'category' => $nailsWigs,
                'name' => 'Gel Manicure & Pedicure', 'description' => 'Full hand and foot care with long-lasting gel polish in your choice of color.',
                'price_eur' => 35.00, 'price_ghs' => 380, 'duration_minutes' => 60,
                'images' => ['https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=600']],
            ['slug' => 'custom-wig-making-human-hair', 'shop' => $shopDE, 'category' => $nailsWigs,
                'name' => 'Custom Wig Making (Human Hair)', 'description' => 'Bespoke wig construction using 100% human hair, built to your preferred length, density and part.',
                'price_eur' => 150.00, 'price_ghs' => 1600, 'duration_minutes' => 240,
                'images' => ['https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=600']],
            ['slug' => 'eyebrow-threading-shaping', 'shop' => $shopGH, 'category' => $nailsWigs,
                'name' => 'Eyebrow Threading & Shaping', 'description' => 'Precise thread-based brow shaping for clean, natural-looking arches.',
                'price_eur' => 15.00, 'price_ghs' => 130, 'duration_minutes' => 20,
                'images' => ['https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=600']],
        ];

        foreach ($services as $s) {
            Service::firstOrCreate(['slug' => $s['slug']], [
                'shop_id' => $s['shop']->id,
                'category_id' => $s['category']->id,
                'name' => $s['name'],
                'description' => $s['description'],
                'price_eur' => $s['price_eur'],
                'price_ghs' => $s['price_ghs'],
                'duration_minutes' => $s['duration_minutes'],
                'images' => $s['images'],
                'is_active' => true,
            ]);
        }

        // 8. Homepage Content (Carousel Slides)
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
                        'url' => 'https://images.unsplash.com/photo-1519415387722-a1c3bbef716c?auto=format&fit=crop&q=80&w=1920',
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

        // 9. Reviews
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
