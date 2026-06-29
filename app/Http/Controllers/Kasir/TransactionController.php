<?php

namespace App\Http\Controllers\Kasir;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTransactionRequest;
use App\Http\Requests\UpdateTransactionRequest;
use App\Models\Customer;
use App\Models\Period;
use App\Models\Transaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    public function create(): Response
    {
        $period = Period::getActive();

        return Inertia::render('kasir/transaksi/create', [
            'period' => $period,
        ]);
    }

    public function store(StoreTransactionRequest $request): RedirectResponse
    {
        $period = Period::getActive();

        if (! $period) {
            return back()->withErrors(['period' => 'Tidak ada periode kompetisi yang aktif saat ini.']);
        }

        $receiptPath = null;
        if ($request->hasFile('receipt_photo')) {
            $receiptPath = $request->file('receipt_photo')->store('receipts', 'local');
        }

        Transaction::create([
            'customer_id' => $request->customer_id,
            'period_id' => $period->id,
            'cashier_id' => $request->user()->id,
            'amount' => $request->amount,
            'notes' => $request->notes,
            'receipt_photo' => $receiptPath,
        ]);

        return redirect()->route('kasir.transaksi.create')
            ->with('success', 'Transaksi berhasil disimpan.');
    }

    public function history(Request $request): Response
    {
        $transactions = Transaction::with(['customer', 'period'])
            ->where('cashier_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->paginate(20);

        return Inertia::render('kasir/transaksi/history', [
            'transactions' => $transactions,
        ]);
    }

    public function edit(Transaction $transaction): Response
    {
        Gate::authorize('update', $transaction);

        $transaction->load(['customer', 'period']);

        return Inertia::render('kasir/transaksi/edit', [
            'transaction' => $transaction,
        ]);
    }

    public function update(UpdateTransactionRequest $request, Transaction $transaction): RedirectResponse
    {
        $transaction->update([
            'original_amount' => $transaction->original_amount ?? $transaction->amount,
            'amount' => $request->amount,
            'notes' => $request->notes,
            'edited_by' => $request->user()->id,
            'edited_at' => now(),
        ]);

        return redirect()->route('kasir.transaksi.history')
            ->with('success', 'Transaksi berhasil diperbarui.');
    }

    public function searchCustomers(Request $request): JsonResponse
    {
        $keyword = $request->get('q', '');

        if (strlen($keyword) < 2) {
            return response()->json([]);
        }

        $customers = Customer::query()
            ->where('name', 'LIKE', "%{$keyword}%")
            ->orWhere('phone', 'LIKE', "%{$keyword}%")
            ->orWhere('email', 'LIKE', "%{$keyword}%")
            ->limit(10)
            ->get(['id', 'name', 'email', 'phone']);

        return response()->json($customers);
    }
}
