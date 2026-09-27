<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;

/**
 * Centralized cache service backed by Redis.
 *
 * Listing endpoints (products/foods/services) are cached per filter
 * combination, so a plain Cache::forget() can never reach every variant.
 * Each remember() call below is tagged with its resource (and 'home',
 * since the homepage aggregates all of them); clearing a resource flushes
 * every cached variant for it in one call via Cache::tags(...)->flush().
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
        return Cache::tags(['home', 'products', 'foods', 'services'])
            ->remember('home.page', self::HOME_TTL, $callback);
    }

    public static function rememberProducts(string $key, callable $callback): mixed
    {
        return Cache::tags(['products'])->remember("products.{$key}", self::PRODUCTS_TTL, $callback);
    }

    public static function rememberProduct(int|string $id, callable $callback): mixed
    {
        return Cache::tags(['products'])->remember("product.{$id}", self::PRODUCT_TTL, $callback);
    }

    public static function rememberRelatedProducts(int|string $id, callable $callback): mixed
    {
        return Cache::tags(['products'])->remember("product.related.{$id}", 600, $callback);
    }

    public static function rememberServices(string $key, callable $callback): mixed
    {
        return Cache::tags(['services'])->remember("services.{$key}", self::SERVICES_TTL, $callback);
    }

    public static function rememberService(int|string $id, callable $callback): mixed
    {
        return Cache::tags(['services'])->remember("service.{$id}", self::SERVICE_TTL, $callback);
    }

    public static function rememberRelatedServices(int|string $id, callable $callback): mixed
    {
        return Cache::tags(['services'])->remember("service.related.{$id}", 600, $callback);
    }

    public static function rememberFoods(string $key, callable $callback): mixed
    {
        return Cache::tags(['foods'])->remember("foods.{$key}", self::FOODS_TTL, $callback);
    }

    public static function rememberFood(int|string $id, callable $callback): mixed
    {
        return Cache::tags(['foods'])->remember("food.{$id}", self::FOOD_TTL, $callback);
    }

    public static function rememberRelatedFoods(int|string $id, callable $callback): mixed
    {
        return Cache::tags(['foods'])->remember("food.related.{$id}", 600, $callback);
    }

    /**
     * @param string $type product|food|service — each type gets its own key
     *                      so listings never leak each other's categories.
     */
    public static function rememberCategories(string $type, callable $callback): mixed
    {
        return Cache::tags(['categories'])->remember("categories.{$type}", self::CATEGORIES_TTL, $callback);
    }

    public static function rememberShops(callable $callback): mixed
    {
        return Cache::tags(['shops'])->remember('shops.active', self::SHOPS_TTL, $callback);
    }

    public static function rememberAdminShopsList(callable $callback): mixed
    {
        return Cache::tags(['shops'])->remember('admin.shops_list', 300, $callback);
    }

    public static function rememberReviews(callable $callback): mixed
    {
        return Cache::tags(['reviews', 'home'])->remember('reviews.active', self::REVIEWS_TTL, $callback);
    }

    public static function rememberAdminStats(callable $callback): mixed
    {
        return Cache::remember('admin.stats', self::STATS_TTL, $callback);
    }

    // ── Cache invalidation helpers ──
    // Flushing a tag removes every key ever stored under it, including
    // every filtered listing variant and the homepage aggregate.

    public static function clearProducts(): void
    {
        Cache::tags(['products'])->flush();
        Cache::tags(['home'])->flush();
    }

    public static function clearServices(): void
    {
        Cache::tags(['services'])->flush();
        Cache::tags(['home'])->flush();
    }

    public static function clearFoods(): void
    {
        Cache::tags(['foods'])->flush();
        Cache::tags(['home'])->flush();
    }

    // Kept for call-site clarity; a single item's cache is covered by its
    // resource tag, but editing one item should still invalidate listings
    // (stock/price/is_active changes affect what shows up there too).
    public static function clearProduct(int $id): void
    {
        self::clearProducts();
    }

    public static function clearService(int $id): void
    {
        self::clearServices();
    }

    public static function clearFood(int $id): void
    {
        self::clearFoods();
    }

    public static function clearShops(): void
    {
        Cache::tags(['shops'])->flush();
        Cache::tags(['home'])->flush();
    }

    public static function clearCategories(): void
    {
        Cache::tags(['categories'])->flush();
    }

    public static function clearHomepage(): void
    {
        Cache::tags(['home'])->flush();
    }
}
