<?php

namespace App\Http\Controllers;

use App\Models\HomepageContent;
use App\Models\Product;
use App\Models\Food;
use App\Models\Service;
use App\Models\Review;
use App\Models\Category;
use App\Services\CacheService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        $deferProps = $request->header('X-Inertia') === 'true' || $request->header('X-Inertia') === '1';

        $data = CacheService::rememberHome(function () {
            $content  = HomepageContent::getAllActive();
            $featured = Product::with(['shop:id,name,country', 'category:id,name,slug'])
                ->where('is_active', true)
                ->latest()->take(8)->get();
            $foods    = Food::with(['shop:id,name,country', 'category:id,name,slug'])
                ->where('is_active', true)
                ->latest()->take(6)->get();
            $services = Service::with(['shop:id,name,country', 'category:id,name,slug'])
                ->where('is_active', true)
                ->latest()->take(6)->get();
            $reviews    = Review::where('is_active', true)->latest()->take(6)->get();
            $categories = Category::whereNull('parent_id')->with('children')->get();

            return compact('content', 'featured', 'foods', 'services', 'reviews', 'categories');
        });

        return Inertia::render('Home', [
            'heroContent'      => $data['content']->get('hero')?->content ?? [],
            'featuredProducts' => $deferProps ? Inertia::defer(fn () => $data['featured']) : $data['featured'],
            'featuredFoods'    => $deferProps ? Inertia::defer(fn () => $data['foods']) : $data['foods'],
            'featuredServices' => $deferProps ? Inertia::defer(fn () => $data['services']) : $data['services'],
            'reviews'          => $deferProps ? Inertia::defer(fn () => $data['reviews']) : $data['reviews'],
            'categories'       => $deferProps ? Inertia::defer(fn () => $data['categories']) : $data['categories'],
        ]);
    }
}
