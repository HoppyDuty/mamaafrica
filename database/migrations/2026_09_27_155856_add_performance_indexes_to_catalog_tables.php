<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Listing queries filter on is_active and sort by created_at (latest()).
        // A composite index lets both happen without a filesort/full scan.
        Schema::table('products', function (Blueprint $table) {
            $table->index(['is_active', 'created_at'], 'products_is_active_created_at_index');
            $table->index('price_eur', 'products_price_eur_index');
        });

        Schema::table('foods', function (Blueprint $table) {
            $table->index(['is_active', 'created_at'], 'foods_is_active_created_at_index');
            $table->index('price_eur', 'foods_price_eur_index');
        });

        Schema::table('services', function (Blueprint $table) {
            $table->index(['is_active', 'created_at'], 'services_is_active_created_at_index');
            $table->index('price_eur', 'services_price_eur_index');
        });

        Schema::table('reviews', function (Blueprint $table) {
            $table->index(['is_active', 'created_at'], 'reviews_is_active_created_at_index');
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->index(['type', 'parent_id'], 'categories_type_parent_id_index');
        });

        Schema::table('shops', function (Blueprint $table) {
            $table->index('is_active', 'shops_is_active_index');
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->index(['shop_id', 'status'], 'orders_shop_id_status_index');
            $table->index('status', 'orders_status_index');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex('products_is_active_created_at_index');
            $table->dropIndex('products_price_eur_index');
        });

        Schema::table('foods', function (Blueprint $table) {
            $table->dropIndex('foods_is_active_created_at_index');
            $table->dropIndex('foods_price_eur_index');
        });

        Schema::table('services', function (Blueprint $table) {
            $table->dropIndex('services_is_active_created_at_index');
            $table->dropIndex('services_price_eur_index');
        });

        Schema::table('reviews', function (Blueprint $table) {
            $table->dropIndex('reviews_is_active_created_at_index');
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->dropIndex('categories_type_parent_id_index');
        });

        Schema::table('shops', function (Blueprint $table) {
            $table->dropIndex('shops_is_active_index');
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex('orders_shop_id_status_index');
            $table->dropIndex('orders_status_index');
        });
    }
};
