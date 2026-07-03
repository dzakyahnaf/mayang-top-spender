<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Transaction;
use Inertia\Inertia;
use Inertia\Response;

class MySpendingController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();

        $customer = Customer::where('email', $user->email)->first();

        $transactions = [];
        $totalSpending = 0;

        if ($customer) {
            $transactions = Transaction::with(['period' => fn ($query) => $query->withTrashed()])
                ->where('customer_id', $customer->id)
                ->orderByDesc('created_at')
                ->get();

            $totalSpending = $transactions->sum('amount');
        }

        return Inertia::render('my-spending', [
            'customer' => [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
            ],
            'transactions' => $transactions,
            'totalSpending' => $totalSpending,
        ]);
    }
}
