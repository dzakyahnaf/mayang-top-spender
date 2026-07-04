<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateTransactionRequest;
use App\Models\Period;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->get('q', ''));

        $query = Transaction::with(['customer', 'cashier', 'period' => fn ($q) => $q->withTrashed()]);

        if ($request->filled('period_id')) {
            $query->where('period_id', $request->period_id);
        }

        if ($request->filled('customer_id')) {
            $query->where('customer_id', $request->customer_id);
        }

        if ($request->filled('cashier_id')) {
            $query->where('cashier_id', $request->cashier_id);
        }

        if ($search !== '') {
            $query->whereHas('customer', function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('phone', 'LIKE', "%{$search}%");
            });
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $transactions = $query->orderByDesc('created_at')->paginate(20)->withQueryString();
        $periods = Period::orderByDesc('created_at')->get();
        $cashiers = User::where('role', 'kasir')->orderBy('name')->get(['id', 'name']);

        return Inertia::render('admin/transaksi/index', [
            'transactions' => $transactions,
            'periods' => $periods,
            'cashiers' => $cashiers,
            'filters' => $request->only(['period_id', 'cashier_id', 'q', 'date_from', 'date_to']),
        ]);
    }

    public function edit(Transaction $transaction): Response
    {
        $transaction->load(['customer', 'period' => fn ($q) => $q->withTrashed()]);

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
        Gate::authorize('delete', $transaction);

        $transaction->delete();

        return redirect()->route('admin.transaksi.index')
            ->with('success', 'Transaksi berhasil dihapus.');
    }
}
