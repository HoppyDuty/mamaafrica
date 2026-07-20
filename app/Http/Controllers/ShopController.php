<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Food;
use App\Models\Category;
use App\Models\Shop;
use App\Services\CacheService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShopController extends Controller
{
    public function index(Request $request)
    {
        $deferProps = $request->header('X-Inertia') === 'true' || $request->header('X-Inertia') === '1';

        // Build a cache key from filters so each filter combo is cached separately
        $cacheKey = md5(json_encode($request->only(['category', 'search', 'min_price', 'max_price', 'country', 'page'])));

        $products = CacheService::rememberProducts($cacheKey, function () use ($request) {
            $query = Product::with(['shop:id,name,country,city', 'category:id,name,slug'])
                ->where('is_active', true)
                ->select(['id', 'shop_id', 'category_id', 'name', 'slug', 'price_eur', 'price_ghs', 'stock', 'images']);

            if ($request->category) {
                $query->whereHas('category', fn($q) => $q->where('slug', $request->category));
            }
            if ($request->search) {
                $query->where('name', 'like', "%{$request->search}%");
            }
            if ($request->min_price) {
                $query->where('price_eur', '>=', $request->min_price);
            }
            if ($request->max_price) {
                $query->where('price_eur', '<=', $request->max_price);
            }
            if ($request->country) {
                $query->whereHas('shop', fn($q) => $q->where('country', $request->country));
            }

            return $query->latest()->paginate(20)->withQueryString();
        });

        $categories = CacheService::rememberCategories(function () {
            return Category::where('type', 'product')
                ->with('children')
                ->whereNull('parent_id')
                ->get(['id', 'name', 'slug', 'icon']);
        });

        return Inertia::render('Shop/Index', [
            'products'   => $deferProps ? Inertia::defer(fn () => $products) : $products,
            'categories' => $deferProps ? Inertia::defer(fn () => $categories) : $categories,
            'filters'    => $request->only(['category', 'search', 'min_price', 'max_price', 'country']),
        ]);
    }

    public function show(Request $request, Product $product)
    {
        $deferProps = $request->header('X-Inertia') === 'true' || $request->header('X-Inertia') === '1';

        $productData = CacheService::rememberProduct($product->id, function () use ($product) {
            return $product->load(['shop:id,name,country,city,phone_whatsapp', 'category:id,name,slug']);
        });

        $related = \Illuminate\Support\Facades\Cache::remember(
            "product.related.{$product->id}",
            600,
            fn() => Product::with('shop:id,name,country')
                ->where('category_id', $product->category_id)
                ->where('id', '!=', $product->id)
                ->where('is_active', true)
                ->select(['id', 'shop_id', 'category_id', 'name', 'slug', 'price_eur', 'price_ghs', 'images'])
                ->take(4)->get()
        );

        $shops = CacheService::rememberShops(
            fn() => Shop::where('is_active', true)->get(['id', 'name', 'country', 'city', 'phone_whatsapp'])
        );

        return Inertia::render('Shop/Show', [
            'product' => $productData,
            'related' => $deferProps ? Inertia::defer(fn () => $related) : $related,
            'shops'   => $deferProps ? Inertia::defer(fn () => $shops) : $shops,
        ]);
    }

    public function apiList()
    {
        $shops = CacheService::rememberShops(
            fn() => Shop::where('is_active', true)->get(['id', 'name', 'country', 'city', 'phone_whatsapp'])
        );
        return response()->json($shops);
    }

    public function apiFoods()
    {
        $foods = CacheService::rememberFoods('all', function () {
            return Food::with(['shop:id,name,country,city', 'category:id,name,slug'])
                ->where('is_active', true)
                ->select(['id', 'shop_id', 'category_id', 'name', 'slug', 'price_eur', 'price_ghs', 'stock', 'images'])
                ->latest()
                ->get();
        });
        return response()->json($foods);
    }
}
