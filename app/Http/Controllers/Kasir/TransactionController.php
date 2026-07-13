<?php

namespace App\Http\Controllers\Kasir;

use App\Http\Controllers\Concerns\CompressesReceiptPhotos;
use App\Http\Controllers\Concerns\SearchesCustomersAndStaff;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTransactionRequest;
use App\Http\Requests\UpdateTransactionRequest;
use App\Models\Period;
use App\Models\Transaction;
use App\Models\TransactionPhoto;
use Illuminate\Database\QueryException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class TransactionController extends Controller
{
    use CompressesReceiptPhotos;
    use SearchesCustomersAndStaff;

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

        if (Transaction::where('idempotency_key', $request->idempotency_key)->exists()) {
            return redirect()->route('kasir.transaksi.create')
                ->with('success', 'Transaksi berhasil disimpan.');
        }

        try {
            DB::transaction(function () use ($request, $period): void {
                $transaction = Transaction::create([
                    'customer_id' => $request->customer_id,
                    'period_id' => $period->id,
                    'cashier_id' => $request->user()->id,
                    'staff_id' => $request->staff_id,
                    'idempotency_key' => $request->idempotency_key,
                    'amount' => $request->amount,
                    'notes' => $request->notes,
                ]);

                foreach ($request->file('receipt_photos', []) as $photo) {
                    $transaction->photos()->create([
                        'path' => $this->compressAndStoreReceipt($photo),
                    ]);
                }
            });
        } catch (QueryException $e) {
            if (! str_contains($e->getMessage(), 'idempotency_key')) {
                throw $e;
            }
        }

        return redirect()->route('kasir.transaksi.create')
            ->with('success', 'Transaksi berhasil disimpan.');
    }

    public function history(Request $request): Response
    {
        $search = trim((string) $request->get('q', ''));

        $query = Transaction::withRunningCoinTotal()
            ->with([
                'customer',
                'staff',
                'period' => fn ($q) => $q->withTrashed(),
            ])
            ->where('cashier_id', $request->user()->id);

        if ($request->filled('period_id')) {
            $query->where('period_id', $request->period_id);
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
        $periods = Period::orderByDesc('created_at')->get(['id', 'name']);

        return Inertia::render('kasir/transaksi/history', [
            'transactions' => $transactions,
            'periods' => $periods,
            'filters' => $request->only(['q', 'period_id', 'date_from', 'date_to']),
        ]);
    }

    public function show(Transaction $transaction): Response
    {
        Gate::authorize('view', $transaction);

        $transaction->load(['customer', 'period' => fn ($q) => $q->withTrashed(), 'cashier', 'staff', 'editor', 'photos']);

        return Inertia::render('kasir/transaksi/show', [
            'transaction' => $transaction,
        ]);
    }

    public function receipt(Transaction $transaction): StreamedResponse
    {
        Gate::authorize('view', $transaction);

        abort_unless($transaction->receipt_photo && Storage::disk('local')->exists($transaction->receipt_photo), 404);

        return Storage::disk('local')->response($transaction->receipt_photo);
    }

    public function receiptPhoto(Transaction $transaction, TransactionPhoto $photo): StreamedResponse
    {
        Gate::authorize('view', $transaction);

        abort_unless($photo->transaction_id === $transaction->id, 404);
        abort_unless(Storage::disk('local')->exists($photo->path), 404);

        return Storage::disk('local')->response($photo->path);
    }

    public function edit(Transaction $transaction): Response
    {
        Gate::authorize('update', $transaction);

        $transaction->load([
            'customer' => fn ($q) => $q->withPeriodSpending(Period::getActive()),
            'staff',
            'period' => fn ($q) => $q->withTrashed(),
            'photos',
        ]);

        return Inertia::render('kasir/transaksi/edit', [
            'transaction' => $transaction,
            'periods' => Period::orderByDesc('created_at')->get(['id', 'name']),
        ]);
    }

    public function update(UpdateTransactionRequest $request, Transaction $transaction): RedirectResponse
    {
        $deleteIds = collect($request->input('delete_photo_ids', []));
        $remainingCount = $transaction->photos()->count() - $transaction->photos()->whereIn('id', $deleteIds)->count();
        $newCount = count($request->file('receipt_photos', []));

        if ($remainingCount + $newCount > 3) {
            return back()->withErrors(['receipt_photos' => 'Maksimal 3 foto struk per transaksi.']);
        }

        DB::transaction(function () use ($request, $transaction, $deleteIds): void {
            $transaction->update([
                'customer_id' => $request->customer_id,
                'staff_id' => $request->staff_id,
                'period_id' => $request->period_id,
                'original_amount' => $transaction->original_amount ?? $transaction->amount,
                'amount' => $request->amount,
                'notes' => $request->notes,
                'edited_by' => $request->user()->id,
                'edited_at' => now(),
            ]);

            if ($deleteIds->isNotEmpty()) {
                $transaction->photos()->whereIn('id', $deleteIds)->get()->each->delete();
            }

            foreach ($request->file('receipt_photos', []) as $photo) {
                $transaction->photos()->create([
                    'path' => $this->compressAndStoreReceipt($photo),
                ]);
            }
        });

        return redirect()->route('kasir.transaksi.history')
            ->with('success', 'Transaksi berhasil diperbarui.');
    }
}
