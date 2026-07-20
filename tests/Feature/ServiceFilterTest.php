<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Service;
use App\Models\Shop;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class ServiceFilterTest extends TestCase
{
    public function test_service_index_can_filter_by_price_range(): void
    {
        $category = Category::create([
            'name' => 'Hair Care',
            'slug' => 'hair-care',
            'type' => 'service',
        ]);

        $shop = Shop::create([
            'name' => 'Mama Beauty',
            'country' => 'GH',
            'city' => 'Accra',
            'address' => '123 Main St',
            'phone_whatsapp' => '+233501234567',
            'is_active' => true,
        ]);

        Service::create([
            'shop_id' => $shop->id,
            'category_id' => $category->id,
            'name' => 'Filtered Service',
            'slug' => 'filtered-service',
            'description' => 'Should be visible',
            'price_eur' => 15.00,
            'price_ghs' => 150.00,
            'duration_minutes' => 45,
            'is_active' => true,
            'images' => [],
        ]);

        Service::create([
            'shop_id' => $shop->id,
            'category_id' => $category->id,
            'name' => 'Out of Range Service',
            'slug' => 'out-of-range-service',
            'description' => 'Should be hidden',
            'price_eur' => 35.00,
            'price_ghs' => 350.00,
            'duration_minutes' => 60,
            'is_active' => true,
            'images' => [],
        ]);

        $response = $this->get('/services?min_price=10&max_price=20');

        $response->assertOk();
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->component('Services/Index')
            ->where('filters.min_price', '10')
            ->where('filters.max_price', '20')
            ->has('services.data', 1)
            ->where('services.data.0.name', 'Filtered Service')
        );
    }
}
