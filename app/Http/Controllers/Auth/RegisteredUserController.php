<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
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

        $existingCustomer = Customer::where('email', $request->email)
            ->orWhere('phone', $request->phone)
            ->first();

        if ($existingCustomer && ($existingCustomer->email !== $request->email || $existingCustomer->phone !== $request->phone)) {
            return back()->withErrors([
                'email' => 'Email atau nomor HP ini sudah terdaftar dengan data customer yang berbeda. Silakan hubungi admin.',
            ]);
        }

        $user = DB::transaction(function () use ($request, $existingCustomer): User {
            $user = new User($request->only('name', 'email', 'phone', 'password'));
            $user->role = 'customer';
            $user->save();

            if (! $existingCustomer) {
                Customer::create([
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                ]);
            }

            return $user;
        });

        event(new Registered($user));

        Auth::login($user);

        return to_route('dashboard');
    }
}
