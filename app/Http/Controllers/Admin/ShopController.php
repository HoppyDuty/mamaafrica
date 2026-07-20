<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShopController extends Controller
{
    public function index()
    {
        $shops = Shop::with('attendant')->latest()->paginate(20);
        return Inertia::render('Admin/Shops/Index', ['shops' => $shops]);
    }

    public function create()
    {
        $attendants = User::role('attendant')->get(['id', 'name', 'email']);
        return Inertia::render('Admin/Shops/Form', ['attendants' => $attendants, 'shop' => null]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'           => 'required|string|max:255',
            'country'        => 'required|in:DE,GH',
            'city'           => 'nullable|string|max:255',
            'address'        => 'nullable|string',
            'phone_whatsapp' => 'required|string|max:30',
            'description'    => 'nullable|string',
            'attendant_id'   => 'nullable|exists:users,id',
            'is_active'      => 'boolean',
        ]);
        Shop::create($data);
        return redirect()->route('admin.shops.index')->with('success', 'Shop created.');
    }

    public function edit(Shop $shop)
    {
        $attendants = User::role('attendant')->get(['id', 'name', 'email']);
        return Inertia::render('Admin/Shops/Form', ['shop' => $shop->load('attendant'), 'attendants' => $attendants]);
    }

    public function update(Request $request, Shop $shop)
    {
        $data = $request->validate([
            'name'           => 'required|string|max:255',
            'country'        => 'required|in:DE,GH',
            'city'           => 'nullable|string|max:255',
            'address'        => 'nullable|string',
            'phone_whatsapp' => 'required|string|max:30',
            'description'    => 'nullable|string',
            'attendant_id'   => 'nullable|exists:users,id',
            'is_active'      => 'boolean',
        ]);
        $shop->update($data);
        return redirect()->route('admin.shops.index')->with('success', 'Shop updated.');
    }

    public function destroy(Shop $shop)
    {
        $shop->delete();
        return redirect()->route('admin.shops.index')->with('success', 'Shop deleted.');
    }
}
