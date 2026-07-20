<?php

namespace App\Http\Controllers;

use App\Models\Food;
use App\Models\Category;
use App\Models\Shop;
use App\Services\CacheService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FoodController extends Controller
{
    public function index(Request $request)
    {
        $deferProps = $request->header('X-Inertia') === 'true' || $request->header('X-Inertia') === '1';

        $cacheKey = md5(json_encode($request->only(['category', 'search', 'min_price', 'max_price', 'country', 'page'])));

        $foods = CacheService::rememberFoods($cacheKey, function () use ($request) {
            $query = Food::with(['shop:id,name,country,city', 'category:id,name,slug'])
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
            return Category::where('type', 'food')
                ->with('children')
                ->whereNull('parent_id')
                ->get(['id', 'name', 'slug', 'icon']);
        });

        return Inertia::render('Shop/Foods', [
            'foods'      => $deferProps ? Inertia::defer(fn () => $foods) : $foods,
            'categories' => $deferProps ? Inertia::defer(fn () => $categories) : $categories,
            'filters'    => $request->only(['category', 'search', 'min_price', 'max_price', 'country']),
        ]);
    }

    public function show(Request $request, Food $food)
    {
        $deferProps = $request->header('X-Inertia') === 'true' || $request->header('X-Inertia') === '1';

        $foodData = $food->load(['shop:id,name,country,city,phone_whatsapp', 'category:id,name,slug']);

        $related = Food::with('shop:id,name,country')
            ->where('category_id', $food->category_id)
            ->where('id', '!=', $food->id)
            ->where('is_active', true)
            ->select(['id', 'shop_id', 'category_id', 'name', 'slug', 'price_eur', 'price_ghs', 'images'])
            ->take(4)->get();

        $shops = CacheService::rememberShops(
            fn() => Shop::where('is_active', true)->get(['id', 'name', 'country', 'city', 'phone_whatsapp'])
        );

        return Inertia::render('Shop/FoodShow', [
            'food'    => $foodData,
            'related' => $deferProps ? Inertia::defer(fn () => $related) : $related,
            'shops'   => $deferProps ? Inertia::defer(fn () => $shops) : $shops,
        ]);
    }
}
