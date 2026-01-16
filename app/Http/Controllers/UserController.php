<?php

namespace App\Http\Controllers;

use App\Http\Traits\HasCrudResponses;
use App\Models\User;
use App\Models\Poste;
use App\Models\Magasin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class UserController extends Controller
{
    use HasCrudResponses;
    /**
     * Display a listing of the users.
     */
    public function index(Request $request)
    {
        $users = User::with(['poste', 'magasin'])
            ->filter($request->only('search', 'role', 'poste', 'magasin'))
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Users/Index', [
            'users' => $users,
            'postes' => Poste::all(),
            'magasins' => Magasin::all(),
            'filters' => $request->only('search', 'role', 'poste', 'magasin'),
        ]);
    }



    /**
     * Show the form for creating a new user.
     */
    public function create()
    {
        $postes = Poste::all();
        $magasins = Magasin::all();

        return Inertia::render('Users/Create', [
            'postes' => $postes,
            'magasins' => $magasins,
        ]);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:users,email',
            'phonenumber' => 'required|string|unique:users,phonenumber',
            'password' => 'required|string|min:6|confirmed',
            'poste_id' => 'nullable|exists:postes,id',
            'magasin_id' => 'nullable|exists:magasins,id',
            'role' => 'nullable|string',
        ]);

        $validated['password'] = Hash::make($validated['password']);

        User::create($validated);

        return $this->successResponse('users.index', [], 'User created successfully.');
    }

    /**
     * Display the specified user.
     */
    public function show(User $user)
    {
        $user->load(['poste', 'magasin']);

        return Inertia::render('Users/Show', [
            'user' => $user,
        ]);
    }

    /**
     * Show the form for editing the specified user.
     */
    public function edit(User $user)
    {
        $postes = Poste::all();
        $magasins = Magasin::all();

        return Inertia::render('Users/Edit', [
            'user' => $user,
            'postes' => $postes,
            'magasins' => $magasins,
        ]);
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:users,email,' . $user->id,
            'phonenumber' => 'required|string|unique:users,phonenumber,' . $user->id,
            'password' => 'nullable|string|min:6|confirmed',
            'poste_id' => 'nullable|exists:postes,id',
            'magasin_id' => 'nullable|exists:magasins,id',
            'role' => 'nullable|string',
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return $this->successResponse('users.index', [], 'User updated successfully.');
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();

        return $this->successResponse('users.index', [], 'User deleted successfully.');
    }
}
