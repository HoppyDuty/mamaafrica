<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\FoodController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\Admin;
use App\Http\Controllers\Attendant;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ─────────────────────────────────────────
// PUBLIC ROUTES
// ─────────────────────────────────────────
Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/shop', [ShopController::class, 'index'])->name('shop.index');
Route::get('/shop/{product:slug}', [ShopController::class, 'show'])->name('shop.show');

Route::get('/foods', [FoodController::class, 'index'])->name('foods.index');
Route::get('/foods/{food:slug}', [FoodController::class, 'show'])->name('foods.show');

Route::get('/services', [ServiceController::class, 'index'])->name('services.index');
Route::get('/services/{service:slug}', [ServiceController::class, 'show'])->name('services.show');

Route::get('/about', fn () => Inertia::render('About'))->name('about');

Route::middleware('throttle:60,1')->group(function () {
    Route::get('/api/shops', [ShopController::class, 'apiList'])->name('api.shops');
    Route::get('/api/foods', [ShopController::class, 'apiFoods'])->name('api.foods');
});

// ─────────────────────────────────────────
// MANUAL LOGIN & REGISTRATION
// ─────────────────────────────────────────
Route::middleware('guest')->group(function () {
    Route::get('/login', [App\Http\Controllers\Auth\LoginController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [App\Http\Controllers\Auth\LoginController::class, 'login'])
        ->withoutMiddleware([VerifyCsrfToken::class]);
    Route::get('/register', [App\Http\Controllers\Auth\RegisterController::class, 'showRegistrationForm'])->name('register');
    Route::post('/register', [App\Http\Controllers\Auth\RegisterController::class, 'register']);
});

Route::post('/logout', function (Request $request) {
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();

    // Force a full browser reload so the navbar can't serve a stale
    // prefetched/authenticated page from the client-side Inertia cache.
    return Inertia::location('/');
})->name('logout');

// Public order log route (accessible to guests and authenticated users)
Route::post('/orders', [OrderController::class, 'store'])->name('orders.store')->middleware('throttle:20,1');

// ─────────────────────────────────────────
// AUTHENTICATED USER ROUTES
// ─────────────────────────────────────────
Route::middleware(['auth'])->group(function () {
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/cart', function () {
        $cart = session('cart', []);

        return Inertia::render('Cart', [
            'cart' => array_values($cart),
            'cartCount' => count($cart),
            'auth' => ['user' => auth()->user()],
        ]);
    })->name('cart');

    Route::post('/cart/add', function (Request $request) {
        $data = $request->validate([
            'type' => ['required', 'string'],
            'item_id' => ['required', 'integer'],
            'name' => ['required', 'string'],
            'slug' => ['nullable', 'string'],
            'price_eur' => ['nullable', 'numeric'],
            'price_ghs' => ['nullable', 'numeric'],
            'image' => ['nullable', 'string'],
        ]);

        $cart = session('cart', []);
        $key = $data['type'] . ':' . $data['item_id'];

        // Check if item already in cart
        if (isset($cart[$key])) {
            return response()->json([
                'success' => false,
                'message' => 'This item is already in your cart',
                'cartCount' => count($cart),
            ], 422);
        }

        $cart[$key] = [
            'id' => $key,
            'type' => $data['type'],
            'item_id' => $data['item_id'],
            'name' => $data['name'],
            'slug' => $data['slug'] ?? null,
            'price_eur' => (float) ($data['price_eur'] ?? 0),
            'price_ghs' => (float) ($data['price_ghs'] ?? 0),
            'image' => $data['image'] ?? null,
            'quantity' => 1,
        ];

        session()->put('cart', $cart);

        return response()->json([
            'success' => true,
            'message' => 'Item added to cart',
            'cartCount' => count($cart),
        ]);
    })->name('cart.add');

    Route::post('/cart/remove', function (Request $request) {
        $data = $request->validate([
            'key' => ['required', 'string'],
        ]);

        $cart = session('cart', []);
        if (isset($cart[$data['key']])) {
            unset($cart[$data['key']]);
            session()->put('cart', $cart);
        }

        return response()->json([
            'success' => true,
            'message' => 'Item removed from cart',
            'cartCount' => count($cart),
        ]);
    })->name('cart.remove');

    Route::get('/profile', fn () => Inertia::render('Profile', ['user' => auth()->user()]))->name('profile');
});

// ─────────────────────────────────────────
// ADMIN ROUTES
// ─────────────────────────────────────────
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [Admin\DashboardController::class, 'index'])->name('dashboard');

    Route::resource('shops', Admin\ShopController::class);
    Route::resource('products', Admin\ProductController::class);
    Route::resource('foods', Admin\FoodController::class);
    Route::resource('services', Admin\ServiceController::class);
    Route::resource('users', Admin\UserController::class)->only(['index', 'destroy']);
    Route::put('users/{user}/role', [Admin\UserController::class, 'updateRole'])->name('users.updateRole');

    Route::get('orders', [Admin\OrderController::class, 'index'])->name('orders.index');
    Route::put('orders/{order}', [Admin\OrderController::class, 'update'])->name('orders.update');

    Route::get('homepage', [Admin\HomepageController::class, 'edit'])->name('homepage.edit');
    Route::put('homepage', [Admin\HomepageController::class, 'update'])->name('homepage.update');
});

// ─────────────────────────────────────────
// ATTENDANT ROUTES
// ─────────────────────────────────────────
Route::middleware(['auth', 'role:attendant'])->prefix('attendant')->name('attendant.')->group(function () {
    Route::get('/', [Attendant\DashboardController::class, 'index'])->name('dashboard');
    Route::get('orders', [Attendant\DashboardController::class, 'orders'])->name('orders');
    Route::get('products', [Attendant\DashboardController::class, 'products'])->name('products');
    Route::get('foods', [Attendant\DashboardController::class, 'foods'])->name('foods');
    Route::get('services', [Attendant\DashboardController::class, 'services'])->name('services');
});
