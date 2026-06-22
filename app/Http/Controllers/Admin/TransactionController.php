<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateTransactionRequest;
use App\Models\Period;
use App\Models\Transaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Transaction::with(['customer', 'cashier', 'period']);

        if ($request->filled('period_id')) {
            $query->where('period_id', $request->period_id);
        }

        if ($request->filled('customer_id')) {
            $query->where('customer_id', $request->customer_id);
        }

        $transactions = $query->orderByDesc('created_at')->paginate(20)->withQueryString();
        $periods = Period::orderByDesc('created_at')->get();

        return Inertia::render('admin/transaksi/index', [
            'transactions' => $transactions,
            'periods' => $periods,
            'filters' => $request->only(['period_id', 'customer_id']),
        ]);
    }

    public function edit(Transaction $transaction): Response
    {
        $transaction->load(['customer', 'period']);

        return Inertia::render('admin/transaksi/edit', [
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

        return redirect()->route('admin.transaksi.index')
            ->with('success', 'Transaksi berhasil diperbarui.');
    }

    public function destroy(Transaction $transaction): RedirectResponse
    {
        $this->authorize('delete', $transaction);

        $transaction->delete();

        return redirect()->route('admin.transaksi.index')
            ->with('success', 'Transaksi berhasil dihapus.');
    }
}
