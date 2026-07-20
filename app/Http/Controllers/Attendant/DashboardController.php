<?php

namespace App\Http\Controllers\Attendant;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\Food;
use App\Models\Service;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    private function getShop()
    {
        return Auth::user()->shop;
    }

    public function index()
    {
        $shop = $this->getShop();
        if (!$shop) {
            return Inertia::render('Attendant/NoShop');
        }

        return Inertia::render('Attendant/Dashboard', [
            'shop'  => $shop,
            'stats' => [
                'orders'   => Order::where('shop_id', $shop->id)->count(),
                'pending'  => Order::where('shop_id', $shop->id)->where('status', 'pending')->count(),
                'products' => Product::where('shop_id', $shop->id)->count(),
                'foods'    => Food::where('shop_id', $shop->id)->count(),
                'services' => Service::where('shop_id', $shop->id)->count(),
            ],
            'recentOrders' => Order::with('user')
                ->where('shop_id', $shop->id)
                ->latest()->take(10)->get(),
        ]);
    }

    public function orders(Request $request)
    {
        $shop  = $this->getShop();
        $query = Order::with('user')->where('shop_id', $shop->id);
        if ($request->status) $query->where('status', $request->status);

        return Inertia::render('Attendant/Orders', [
            'orders'  => $query->latest()->paginate(30)->withQueryString(),
            'shop'    => $shop,
            'filters' => $request->only(['status']),
        ]);
    }

    public function products()
    {
        $shop     = $this->getShop();
        $products = Product::with('category')
            ->where('shop_id', $shop->id)
            ->latest()->paginate(30);

        return Inertia::render('Attendant/Products', [
            'products' => $products,
            'shop'     => $shop,
        ]);
    }

    public function services()
    {
        $shop     = $this->getShop();
        $services = Service::with('category')
            ->where('shop_id', $shop->id)
            ->latest()->paginate(30);

        return Inertia::render('Attendant/Services', [
            'services' => $services,
            'shop'     => $shop,
        ]);
    }

    public function foods()
    {
        $shop  = $this->getShop();
        $foods = Food::with('category')
            ->where('shop_id', $shop->id)
            ->latest()->paginate(30);

        return Inertia::render('Attendant/Foods', [
            'foods' => $foods,
            'shop'  => $shop,
        ]);
    }
}
