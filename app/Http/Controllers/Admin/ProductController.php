<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Jobs\UploadMediaToCloudinary;
use App\Models\Category;
use App\Models\Product;
use App\Models\Shop;
use App\Services\CacheService;
use App\Services\CloudinaryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['shop:id,name,country', 'category:id,name']);

        if ($request->search)  $query->where('name', 'like', "%{$request->search}%");
        if ($request->shop_id) $query->where('shop_id', $request->shop_id);

        return Inertia::render('Admin/Products/Index', [
            'products' => $query->latest()->paginate(30)->withQueryString(),
            'shops'    => Cache::remember('admin.shops_list', 300, fn () => Shop::all(['id', 'name', 'country'])),
            'filters'  => $request->only(['search', 'shop_id']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Products/Form', [
            'product'    => null,
            'shops'      => Shop::where('is_active', true)->get(['id', 'name', 'country']),
            'categories' => Category::where('type', 'product')->with('children')->get(),
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
        $data['images'] = []; // Images arrive via background job

        $product = Product::create($data);

        // Store uploaded files to local disk, then queue the Cloudinary upload
        if ($request->hasFile('images')) {
            $paths = CloudinaryService::storeTemporary($request->file('images'));
            if (! empty($paths)) {
                UploadMediaToCloudinary::dispatch($paths, 'mama-africa/products', $product->id, 'Product');
            }
        }

        CacheService::clearProducts();

        return redirect()->route('admin.products.index')
            ->with('success', 'Product created. Images are uploading in the background.');
    }

    public function edit(Product $product)
    {
        return Inertia::render('Admin/Products/Form', [
            'product'    => $product,
            'shops'      => Shop::where('is_active', true)->get(['id', 'name', 'country']),
            'categories' => Category::where('type', 'product')->with('children')->get(),
        ]);
    }

    public function update(Request $request, Product $product)
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

        // Keep images that the admin did not remove
        $data['images'] = array_values($request->input('existing_images', []));

        // Queue new uploads if any
        if ($request->hasFile('images')) {
            $paths = CloudinaryService::storeTemporary($request->file('images'));
            if (! empty($paths)) {
                UploadMediaToCloudinary::dispatch($paths, 'mama-africa/products', $product->id, 'Product');
            }
        }

        $product->update($data);
        CacheService::clearProduct($product->id);

        return redirect()->route('admin.products.index')
            ->with('success', 'Product updated.' . ($request->hasFile('images') ? ' New images uploading in the background.' : ''));
    }

    public function destroy(Product $product)
    {
        $product->delete();
        CacheService::clearProducts();

        return redirect()->route('admin.products.index')->with('success', 'Product deleted.');
    }
}