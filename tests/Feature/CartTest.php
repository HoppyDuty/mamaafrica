<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CartTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_add_items_to_cart(): void
    {
        $response = $this->withSession(['_token' => 'test'])
            ->post('/cart/add', [
                '_token' => 'test',
                'type' => 'product',
                'item_id' => 1,
                'name' => 'Test Product',
                'slug' => 'test-product',
                'price_eur' => 10.50,
                'price_ghs' => 80.00,
                'image' => 'https://example.com/product.jpg',
            ]);

        $response->assertRedirect('/login');
    }

    public function test_authenticated_users_can_add_items_to_their_cart(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->withSession(['_token' => 'test'])
            ->post('/cart/add', [
                '_token' => 'test',
                'type' => 'product',
                'item_id' => 1,
                'name' => 'Test Product',
                'slug' => 'test-product',
                'price_eur' => 10.50,
                'price_ghs' => 80.00,
                'image' => 'https://example.com/product.jpg',
            ]);

        $response->assertRedirect();
        $this->assertNotEmpty(session('cart'));
        $this->assertSame('Test Product', session('cart')['product:1']['name']);
    }
}
