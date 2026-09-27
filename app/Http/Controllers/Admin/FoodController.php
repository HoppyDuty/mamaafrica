<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Jobs\UploadMediaToCloudinary;
use App\Models\Category;
use App\Models\Food;
use App\Models\Shop;
use App\Services\CacheService;
use App\Services\CloudinaryService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FoodController extends Controller
{
    public function index(Request $request)
    {
        $query = Food::with(['shop:id,name,country', 'category:id,name']);

        if ($request->search)  $query->where('name', 'like', "%{$request->search}%");
        if ($request->shop_id) $query->where('shop_id', $request->shop_id);

        return Inertia::render('Admin/Foods/Index', [
            'foods'   => $query->latest()->paginate(30)->withQueryString(),
            'shops'   => CacheService::rememberAdminShopsList(fn () => Shop::all(['id', 'name', 'country'])),
            'filters' => $request->only(['search', 'shop_id']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Foods/Form', [
            'food'       => null,
            'shops'      => Shop::where('is_active', true)->get(['id', 'name', 'country']),
            'categories' => Category::where('type', 'food')->with('children')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'shop_id'     => 'required|exists:shops,id',
            'category_id' => 'nullable|exists:categories,id',
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'price_eur'   => 'required|numeric|min:0',
            'price_ghs'   => 'required|numeric|min:0',
            'stock'       => 'required|integer|min:0',
            'is_active'   => 'boolean',
            'images'      => 'nullable|array',
            'images.*'    => 'image|max:5120',
        ]);

        $data['slug']   = \Str::slug($data['name']) . '-' . uniqid();
        $data['images'] = []; // Will be populated by the background job

        $food = Food::create($data);

        // Store files to local disk first, then queue the Cloudinary upload
        if ($request->hasFile('images')) {
            $paths = CloudinaryService::storeTemporary($request->file('images'));
            if (! empty($paths)) {
                UploadMediaToCloudinary::dispatch($paths, 'mama-africa/foods', $food->id, 'Food');
            }
        }

        CacheService::clearFoods();

        return redirect()->route('admin.foods.index')
            ->with('success', 'Food item created. Images are uploading in the background.');
    }

    public function edit(Food $food)
    {
        return Inertia::render('Admin/Foods/Form', [
            'food'       => $food,
            'shops'      => Shop::where('is_active', true)->get(['id', 'name', 'country']),
            'categories' => Category::where('type', 'food')->with('children')->get(),
        ]);
    }

    public function update(Request $request, Food $food)
    {
        $data = $request->validate([
            'shop_id'           => 'required|exists:shops,id',
            'category_id'       => 'nullable|exists:categories,id',
            'name'              => 'required|string|max:255',
            'description'       => 'nullable|string',
            'price_eur'         => 'required|numeric|min:0',
            'price_ghs'         => 'required|numeric|min:0',
            'stock'             => 'required|integer|min:0',
            'is_active'         => 'boolean',
            'existing_images'   => 'nullable|array',
            'existing_images.*' => 'string',
            'images'            => 'nullable|array',
            'images.*'          => 'image|max:5120',
        ]);

        // Preserve images the admin did not remove
        $data['images'] = array_values($request->input('existing_images', []));

        // Queue any new file uploads
        if ($request->hasFile('images')) {
            $paths = CloudinaryService::storeTemporary($request->file('images'));
            if (! empty($paths)) {
                UploadMediaToCloudinary::dispatch($paths, 'mama-africa/foods', $food->id, 'Food');
            }
        }

        $food->update($data);
        CacheService::clearFood($food->id);

        return redirect()->route('admin.foods.index')
            ->with('success', 'Food item updated.' . ($request->hasFile('images') ? ' New images uploading in the background.' : ''));
    }

    public function destroy(Food $food)
    {
        $food->delete();
        CacheService::clearFoods();

        return redirect()->route('admin.foods.index')->with('success', 'Food item deleted.');
    }
}
