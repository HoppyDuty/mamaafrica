<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;

/**
 * Centralized cache service with aggressive TTLs.
 * All public-facing data is cached in Redis.
 */
class CacheService
{
    // TTL constants (seconds)
    const HOME_TTL       = 300;   // 5 min
    const PRODUCTS_TTL   = 600;   // 10 min
    const PRODUCT_TTL    = 900;   // 15 min
    const FOODS_TTL      = 600;   // 10 min
    const FOOD_TTL       = 900;   // 15 min
    const SERVICES_TTL   = 600;   // 10 min
    const SERVICE_TTL    = 900;   // 15 min
    const CATEGORIES_TTL = 3600;  // 1 hour
    const SHOPS_TTL      = 1800;  // 30 min
    const REVIEWS_TTL    = 3600;  // 1 hour
    const STATS_TTL      = 60;    // 1 min (admin dashboard)

    public static function rememberHome(callable $callback): mixed
    {
        return Cache::remember('home.page', self::HOME_TTL, $callback);
    }

    public static function rememberProducts(string $key, callable $callback): mixed
    {
        return Cache::remember("products.{$key}", self::PRODUCTS_TTL, $callback);
    }

    public static function rememberProduct(int|string $id, callable $callback): mixed
    {
        return Cache::remember("product.{$id}", self::PRODUCT_TTL, $callback);
    }

    public static function rememberServices(string $key, callable $callback): mixed
    {
        return Cache::remember("services.{$key}", self::SERVICES_TTL, $callback);
    }

    public static function rememberService(int|string $id, callable $callback): mixed
    {
        return Cache::remember("service.{$id}", self::SERVICE_TTL, $callback);
    }

    public static function rememberFoods(string $key, callable $callback): mixed
    {
        return Cache::remember("foods.{$key}", self::FOODS_TTL, $callback);
    }

    public static function rememberFood(int|string $id, callable $callback): mixed
    {
        return Cache::remember("food.{$id}", self::FOOD_TTL, $callback);
    }

    public static function rememberCategories(callable $callback): mixed
    {
        return Cache::remember('categories.all', self::CATEGORIES_TTL, $callback);
    }

    public static function rememberShops(callable $callback): mixed
    {
        return Cache::remember('shops.active', self::SHOPS_TTL, $callback);
    }

    public static function rememberReviews(callable $callback): mixed
    {
        return Cache::remember('reviews.active', self::REVIEWS_TTL, $callback);
    }

    public static function rememberAdminStats(callable $callback): mixed
    {
        return Cache::remember('admin.stats', self::STATS_TTL, $callback);
    }

    // ── Cache invalidation helpers ──

    public static function clearProducts(): void
    {
        Cache::forget('home.page');
        Cache::forget('products.all');
        Cache::forget('admin.shops_list');
    }

    public static function clearServices(): void
    {
        Cache::forget('home.page');
        Cache::forget('services.all');
    }

    public static function clearFoods(): void
    {
        Cache::forget('home.page');
        Cache::forget('foods.all');
    }

    public static function clearProduct(int $id): void
    {
        Cache::forget("product.{$id}");
        Cache::forget('home.page');
    }

    public static function clearService(int $id): void
    {
        Cache::forget("service.{$id}");
        Cache::forget('home.page');
    }

    public static function clearFood(int $id): void
    {
        Cache::forget("food.{$id}");
        Cache::forget('home.page');
        Cache::forget('foods.all');
    }

    public static function clearShops(): void
    {
        Cache::forget('shops.active');
        Cache::forget('home.page');
    }

    public static function clearHomepage(): void
    {
        Cache::forget('home.page');
    }
}
