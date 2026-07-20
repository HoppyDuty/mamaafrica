<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\Food;
use App\Models\Service;
use App\Models\Shop;
use App\Models\User;
use App\Services\CacheService;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = CacheService::rememberAdminStats(function () {
            return [
                'shops'    => Shop::count(),
                'products' => Product::count(),
                'foods'    => Food::count(),
                'services' => Service::count(),
                'orders'   => Order::count(),
                'users'    => User::count(),
                'revenue'  => Order::where('status', 'confirmed')->sum('total_eur'),
                'pending'  => Order::where('status', 'pending')->count(),
            ];
        });

        $recentOrders = Cache::remember('admin.recent_orders', 30, function () {
            return Order::with(['shop:id,name,country', 'user:id,name,email'])
                ->latest()
                ->take(10)
                ->get();
        });

        return Inertia::render('Admin/Dashboard', [
            'stats'        => $stats,
            'recentOrders' => $recentOrders,
        ]);
    }
}
