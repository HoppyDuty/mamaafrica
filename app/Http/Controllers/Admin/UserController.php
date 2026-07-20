<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with('roles');
        if ($request->search) $query->where('name', 'like', "%{$request->search}%");
        if ($request->role) $query->role($request->role);

        return Inertia::render('Admin/Users/Index', [
            'users'   => $query->latest()->paginate(30)->withQueryString(),
            'filters' => $request->only(['search', 'role']),
        ]);
    }

    public function updateRole(Request $request, User $user)
    {
        $request->validate(['role' => 'required|in:admin,attendant,customer']);
        $user->syncRoles([$request->role]);
        return back()->with('success', 'Role updated.');
    }

    public function destroy(User $user)
    {
        $user->delete();
        return back()->with('success', 'User deleted.');
    }
}
