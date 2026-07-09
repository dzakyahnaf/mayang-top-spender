<?php

namespace App\Http\Controllers\Kasir;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTransactionRequest;
use App\Http\Requests\UpdateTransactionRequest;
use App\Models\CashierStaff;
use App\Models\Customer;
use App\Models\Period;
use App\Models\Transaction;
use App\Models\TransactionPhoto;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

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

    /**
     * Downscale (max 1600px on the longest side) and re-encode the uploaded
     * receipt photo as a quality-75 JPEG so stored files stay small,
     * regardless of the original format or resolution.
     */
    private function compressAndStoreReceipt(UploadedFile $file): string
    {
        $source = match ($file->getMimeType()) {
            'image/jpeg', 'image/jpg' => function_exists('imagecreatefromjpeg') ? imagecreatefromjpeg($file->getRealPath()) : null,
            'image/png' => function_exists('imagecreatefrompng') ? imagecreatefrompng($file->getRealPath()) : null,
            'image/webp' => function_exists('imagecreatefromwebp') ? imagecreatefromwebp($file->getRealPath()) : null,
            default => null,
        };

        if (! $source) {
            return $file->store('receipts', 'local');
        }

        $width = imagesx($source);
        $height = imagesy($source);
        $maxDimension = 1600;
        $ratio = min(1, $maxDimension / max($width, $height));
        $newWidth = (int) round($width * $ratio);
        $newHeight = (int) round($height * $ratio);

        $canvas = imagecreatetruecolor($newWidth, $newHeight);
        imagefill($canvas, 0, 0, imagecolorallocate($canvas, 255, 255, 255));
        imagecopyresampled($canvas, $source, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
        imagedestroy($source);

        $path = 'receipts/'.Str::random(32).'.jpg';
        Storage::disk('local')->makeDirectory('receipts');
        imagejpeg($canvas, Storage::disk('local')->path($path), 75);
        imagedestroy($canvas);

        return $path;
    }

    public function history(Request $request): Response
    {
        $search = trim((string) $request->get('q', ''));

        $query = Transaction::with(['customer', 'staff', 'period' => fn ($q) => $q->withTrashed()])
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

        $transaction->load(['customer', 'period' => fn ($q) => $q->withTrashed()]);

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

    public function searchStaff(Request $request): JsonResponse
    {
        $keyword = $request->get('q', '');

        if (strlen($keyword) < 2) {
            return response()->json([]);
        }

        $staff = CashierStaff::query()
            ->where('name', 'LIKE', "%{$keyword}%")
            ->limit(10)
            ->get(['id', 'name']);

        return response()->json($staff);
    }
}
