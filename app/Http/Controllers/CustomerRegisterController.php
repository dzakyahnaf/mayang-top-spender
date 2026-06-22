<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCustomerRequest;
use App\Models\Customer;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CustomerRegisterController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('register-member');
    }

    public function store(StoreCustomerRequest $request): RedirectResponse
    {
        Customer::create($request->validated());

        return redirect()->route('customer.register')
            ->with('success', 'Pendaftaran berhasil! Kamu sekarang sudah terdaftar sebagai member Mayang Modest Wear.');
    }
}
