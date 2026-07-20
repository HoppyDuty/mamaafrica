<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Jobs\UploadMediaToCloudinary;
use App\Models\Category;
use App\Models\Service;
use App\Models\Shop;
use App\Services\CacheService;
use App\Services\CloudinaryService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServiceController extends Controller
{
    public function index(Request $request)
    {
        $query = Service::with(['shop', 'category']);

        if ($request->search)  $query->where('name', 'like', "%{$request->search}%");
        if ($request->shop_id) $query->where('shop_id', $request->shop_id);

        return Inertia::render('Admin/Services/Index', [
            'services' => $query->latest()->paginate(30)->withQueryString(),
            'shops'    => Shop::all(['id', 'name', 'country']),
            'filters'  => $request->only(['search', 'shop_id']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Services/Form', [
            'service'    => null,
            'shops'      => Shop::where('is_active', true)->get(['id', 'name', 'country']),
            'categories' => Category::where('type', 'service')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'shop_id'          => 'required|exists:shops,id',
            'category_id'      => 'nullable|exists:categories,id',
            'name'             => 'required|string|max:255',
            'description'      => 'nullable|string',
            'price_eur'        => 'required|numeric|min:0',
            'price_ghs'        => 'required|numeric|min:0',
            'duration_minutes' => 'required|integer|min:5',
            'is_active'        => 'boolean',
            'images'           => 'nullable|array',
            'images.*'         => 'image|max:5120',
        ]);

        $data['slug']   = \Str::slug($data['name']) . '-' . uniqid();
        $data['images'] = []; // Will be populated by the background job

        $service = Service::create($data);

        if ($request->hasFile('images')) {
            $paths = CloudinaryService::storeTemporary($request->file('images'));
            if (! empty($paths)) {
                UploadMediaToCloudinary::dispatch($paths, 'mama-africa/services', $service->id, 'Service');
            }
        }

        CacheService::clearServices();

        return redirect()->route('admin.services.index')
            ->with('success', 'Service created. Images are uploading in the background.');
    }

    public function edit(Service $service)
    {
        return Inertia::render('Admin/Services/Form', [
            'service'    => $service,
            'shops'      => Shop::where('is_active', true)->get(['id', 'name', 'country']),
            'categories' => Category::where('type', 'service')->get(),
        ]);
    }

    public function update(Request $request, Service $service)
    {
        $data = $request->validate([
            'shop_id'           => 'required|exists:shops,id',
            'category_id'       => 'nullable|exists:categories,id',
            'name'              => 'required|string|max:255',
            'description'       => 'nullable|string',
            'price_eur'         => 'required|numeric|min:0',
            'price_ghs'         => 'required|numeric|min:0',
            'duration_minutes'  => 'required|integer|min:5',
            'is_active'         => 'boolean',
            'existing_images'   => 'nullable|array',
            'existing_images.*' => 'string',
            'images'            => 'nullable|array',
            'images.*'          => 'image|max:5120',
        ]);

        $data['images'] = array_values($request->input('existing_images', []));

        if ($request->hasFile('images')) {
            $paths = CloudinaryService::storeTemporary($request->file('images'));
            if (! empty($paths)) {
                UploadMediaToCloudinary::dispatch($paths, 'mama-africa/services', $service->id, 'Service');
            }
        }

        $service->update($data);
        CacheService::clearService($service->id);

        return redirect()->route('admin.services.index')
            ->with('success', 'Service updated.' . ($request->hasFile('images') ? ' New images uploading in the background.' : ''));
    }

    public function destroy(Service $service)
    {
        $service->delete();
        CacheService::clearServices();

        return redirect()->route('admin.services.index')->with('success', 'Service deleted.');
    }
}