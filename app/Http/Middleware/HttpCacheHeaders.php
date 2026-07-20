<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Adds aggressive browser-level HTTP cache headers for public static pages.
 * Only applies to GET requests returning 200, not authenticated users.
 */
class HttpCacheHeaders
{
    private const CACHEABLE_ROUTES = ['home', 'shop.index', 'shop.show', 'services.index', 'services.show', 'about'];

    public function handle(Request $request, Closure $next, int $maxAge = 300): Response
    {
        $response = $next($request);

        // Only cache GET responses for guests
        if ($request->isMethod('GET') && $response->getStatusCode() === 200 && !auth()->check()) {
            $response->headers->set('Cache-Control', "public, max-age={$maxAge}, s-maxage={$maxAge}, stale-while-revalidate=60");
            $response->headers->set('Vary', 'Accept-Encoding, Accept-Language');
        }

        return $response;
    }
}
