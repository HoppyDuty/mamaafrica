<?php

namespace App\Providers;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // API resource collections stay flat arrays instead of {"data": [...]}
        JsonResource::withoutWrapping();

        Inertia::share([
            'cartCount' => fn () => (int) count(session('cart', [])),
            'cartKeys' => fn () => array_keys(session('cart', [])),
        ]);
    }
}
