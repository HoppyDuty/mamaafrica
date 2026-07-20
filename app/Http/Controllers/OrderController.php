<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Shop;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Store a new order (called when user clicks "Send via WhatsApp").
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'shop_id'        => 'required|exists:shops,id',
            'type'           => 'required|in:product,service',
            'items'          => 'required|array',
            'total_eur'      => 'required|numeric',
            'total_ghs'      => 'required|numeric',
            'customer_name'  => 'nullable|string|max:255',
            'customer_phone' => 'nullable|string|max:50',
            'customer_email' => 'nullable|email|max:255',
            'notes'          => 'nullable|string',
        ]);

        $order = Order::create([
            ...$validated,
            'user_id'          => Auth::id(),
            'status'           => 'pending',
            'whatsapp_sent_at' => now(),
        ]);

        return response()->json([
            'order_id' => $order->id,
            'message'  => 'Order recorded.',
        ]);
    }

    /**
     * User's order history.
     */
    public function index()
    {
        $orders = Order::with('shop')
            ->where('user_id', Auth::id())
            ->latest()
            ->paginate(20);

        return Inertia::render('Orders/Index', ['orders' => $orders]);
    }
}
