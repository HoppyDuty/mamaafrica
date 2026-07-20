<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\Category;
use App\Models\Shop;
use App\Services\CacheService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class ServiceController extends Controller
{
    public function index(Request $request)
    {
        $deferProps = $request->header('X-Inertia') === 'true' || $request->header('X-Inertia') === '1';

        $cacheKey = md5(json_encode($request->only(['category', 'search', 'min_price', 'max_price', 'page'])));

        $services = CacheService::rememberServices($cacheKey, function () use ($request) {
            $query = Service::with(['shop:id,name,country,city', 'category:id,name,slug'])
                ->where('is_active', true)
                ->select(['id', 'shop_id', 'category_id', 'name', 'slug', 'price_eur', 'price_ghs', 'duration_minutes', 'images']);

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

            return $query->latest()->paginate(20)->withQueryString();
        });

        $categories = Cache::remember('categories.service', 3600, function () {
            return Category::where('type', 'service')->get(['id', 'name', 'slug', 'icon']);
        });

        return Inertia::render('Services/Index', [
            'services'   => $deferProps ? Inertia::defer(fn () => $services) : $services,
            'categories' => $deferProps ? Inertia::defer(fn () => $categories) : $categories,
            'filters'    => $request->only(['category', 'search', 'min_price', 'max_price']),
        ]);
    }

    public function show(Request $request, Service $service)
    {
        $deferProps = $request->header('X-Inertia') === 'true' || $request->header('X-Inertia') === '1';

        $serviceData = CacheService::rememberService($service->id, function () use ($service) {
            return $service->load(['shop:id,name,country,city,phone_whatsapp', 'category:id,name,slug']);
        });

        $related = Cache::remember(
            "service.related.{$service->id}",
            600,
            fn() => Service::with('shop:id,name,country')
                ->where('category_id', $service->category_id)
                ->where('id', '!=', $service->id)
                ->where('is_active', true)
                ->select(['id', 'shop_id', 'category_id', 'name', 'slug', 'price_eur', 'price_ghs', 'duration_minutes', 'images'])
                ->take(4)
                ->get()
        );

        $shops = CacheService::rememberShops(
            fn() => Shop::where('is_active', true)->get(['id', 'name', 'country', 'city', 'phone_whatsapp'])
        );

        return Inertia::render('Services/Show', [
            'service' => $serviceData,
            'related' => $deferProps ? Inertia::defer(fn () => $related) : $related,
            'shops'   => $deferProps ? Inertia::defer(fn () => $shops) : $shops,
        ]);
    }
}
