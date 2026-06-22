<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MySpendingController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('my-spending');
    }

    public function search(Request $request): Response
    {
        $request->validate([
            'phone' => ['required', 'string'],
        ], [
            'phone.required' => 'Nomor HP harus diisi.',
        ]);

        $customer = Customer::where('phone', $request->phone)->first();

        if (! $customer) {
            return Inertia::render('my-spending', [
                'error' => 'Nomor HP tidak ditemukan. Pastikan kamu sudah terdaftar sebagai member.',
            ]);
        }

        $transactions = Transaction::with('period')
            ->where('customer_id', $customer->id)
            ->orderByDesc('created_at')
            ->get();

        $totalSpending = $transactions->sum('amount');

        return Inertia::render('my-spending', [
            'customer' => $customer->only(['name', 'email', 'phone']),
            'transactions' => $transactions,
            'totalSpending' => $totalSpending,
        ]);
    }
}
