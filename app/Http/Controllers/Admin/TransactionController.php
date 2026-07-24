<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Concerns\CompressesReceiptPhotos;
use App\Http\Controllers\Concerns\SearchesCustomersAndStaff;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateTransactionRequest;
use App\Models\Period;
use App\Models\Transaction;
use App\Models\TransactionPhoto;
use App\Models\User;
use Illuminate\Contracts\Database\Eloquent\Builder;
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

    private function filteredQuery(Request $request): Builder
    {
        $search = trim((string) $request->get('q', ''));

        $query = Transaction::query();

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

        return $query;
    }

    public function index(Request $request): Response
    {
        $stats = $this->filteredQuery($request)
            ->selectRaw('COUNT(*) AS total_transaksi, COALESCE(SUM(amount), 0) AS total_nominal')
            ->first();

        $query = $this->filteredQuery($request)->withRunningCoinTotal()->with([
            'customer',
            'cashier',
            'staff',
            'period' => fn ($q) => $q->withTrashed(),
        ]);

        $transactions = $query->orderByDesc('created_at')->paginate(20)->withQueryString();
        $periods = Period::orderByDesc('created_at')->get();
        $cashiers = User::where('role', 'kasir')->orderBy('name')->get(['id', 'name']);

        return Inertia::render('admin/transaksi/index', [
            'transactions' => $transactions,
            'periods' => $periods,
            'cashiers' => $cashiers,
            'filters' => $request->only(['period_id', 'cashier_id', 'q', 'date_from', 'date_to']),
            'stats' => [
                'total_transaksi' => (int) $stats->total_transaksi,
                'total_nominal' => (float) $stats->total_nominal,
            ],
        ]);
    }

    public function export(Request $request): StreamedResponse
    {
        $query = $this->filteredQuery($request)->with(['customer', 'cashier', 'staff', 'period']);

        $filename = 'laporan-transaksi-'.now()->format('Y-m-d-His').'.csv';

        return response()->streamDownload(function () use ($query) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['No', 'Tanggal', 'Customer', 'Telepon', 'Outlet', 'Nama Kasir', 'Nominal (Rp)', 'Coin', 'Catatan', 'Periode']);

            $no = 1;
            $query->chunkById(200, function ($transactions) use ($handle, &$no) {
                foreach ($transactions as $transaction) {
                    fputcsv($handle, [
                        $no++,
                        $transaction->created_at->format('d/m/Y H:i'),
                        $transaction->customer->name ?? '-',
                        $transaction->customer->phone ?? '-',
                        $transaction->cashier->name ?? '-',
                        $transaction->staff->name ?? '-',
                        $transaction->amount,
                        intdiv((int) $transaction->amount, 5),
                        $transaction->notes ?? '-',
                        $transaction->period->name ?? '-',
                    ]);
                }
            });

            fclose($handle);
        }, $filename, ['Content-Type' => 'text/csv']);
    }

    public function exportRekap(Request $request): StreamedResponse
    {
        $query = Transaction::query();

        if ($request->filled('period_id')) {
            $query->where('period_id', $request->period_id);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $rekap = $query->selectRaw('cashier_id, COUNT(*) as total_transaksi, SUM(amount) as total_nominal')
            ->groupBy('cashier_id')
            ->with('cashier:id,name')
            ->get()
            ->sortByDesc('total_nominal')
            ->values();

        $filename = 'rekap-outlet-'.now()->format('Y-m-d-His').'.csv';

        return response()->streamDownload(function () use ($rekap) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['No', 'Outlet', 'Jumlah Transaksi', 'Total Nominal (Rp)', 'Total Coin']);

            foreach ($rekap as $i => $row) {
                fputcsv($handle, [
                    $i + 1,
                    $row->cashier->name ?? '-',
                    $row->total_transaksi,
                    $row->total_nominal,
                    intdiv((int) $row->total_nominal, 5),
                ]);
            }

            fclose($handle);
        }, $filename, ['Content-Type' => 'text/csv']);
    }

    public function show(Transaction $transaction): Response
    {
        Gate::authorize('view', $transaction);

        $transaction->load(['customer', 'period' => fn ($q) => $q->withTrashed(), 'cashier', 'staff', 'editor', 'photos']);

        return Inertia::render('admin/transaksi/show', [
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
        $transaction->load([
            'customer' => fn ($q) => $q->withPeriodSpending(Period::getActive()),
            'staff',
            'period' => fn ($q) => $q->withTrashed(),
            'photos',
        ]);

        return Inertia::render('admin/transaksi/edit', [
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
