<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:users',
            'phone' => 'required|string|max:20|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ], [
            'name.required' => 'Nama lengkap harus diisi.',
            'email.unique' => 'Email sudah terdaftar.',
            'phone.required' => 'Nomor HP harus diisi.',
            'phone.unique' => 'Nomor HP sudah terdaftar.',
        ]);

        $user = new User($request->only('name', 'email', 'phone', 'password'));
        $user->role = 'customer';
        $user->save();

        Customer::create([
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
        ]);

        event(new Registered($user));

        Auth::login($user);

        return to_route('dashboard');
    }
}
