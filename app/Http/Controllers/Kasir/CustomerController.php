<?php

namespace App\Http\Controllers\Kasir;

use App\Http\Controllers\Concerns\CreatesCustomerAccount;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCustomerRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    use CreatesCustomerAccount;

    public function create(): Response
    {
        return Inertia::render('kasir/customer/create');
    }

    public function store(StoreCustomerRequest $request): RedirectResponse
    {
        $this->createCustomerFromRequest($request);

        return redirect()->route('kasir.customer.create')
            ->with('success', 'Customer berhasil didaftarkan.');
    }
}
