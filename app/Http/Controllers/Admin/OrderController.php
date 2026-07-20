<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with(['shop', 'user']);
        if ($request->status) $query->where('status', $request->status);
        if ($request->shop_id) $query->where('shop_id', $request->shop_id);

        return Inertia::render('Admin/Orders/Index', [
            'orders'  => $query->latest()->paginate(30)->withQueryString(),
            'filters' => $request->only(['status', 'shop_id']),
        ]);
    }

    public function update(Request $request, Order $order)
    {
        $request->validate(['status' => 'required|in:pending,confirmed,cancelled']);
        $order->update(['status' => $request->status]);
        return back()->with('success', 'Order status updated.');
    }
}
