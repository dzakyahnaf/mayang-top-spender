<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use App\Models\Customer;
use App\Models\Period;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function index(Request $request): Response
    {
        $period = Period::getActive();

        $search = trim((string) $request->get('q', ''));
        $status = $request->get('status'); // spending | no_spending | null

        // Rank map for the active period, matching the public leaderboard ordering.
        $rankMap = collect();
        if ($period) {
            $rankRows = DB::select('
                SELECT customer_id, ROW_NUMBER() OVER (ORDER BY SUM(amount) DESC) AS ranking
                FROM transactions
                WHERE period_id = ?
                GROUP BY customer_id
            ', [$period->id]);

            $rankMap = collect($rankRows)->pluck('ranking', 'customer_id');
        }

        $query = Customer::query()
            ->when($period, function ($query) use ($period) {
                $query->addSelect([
                    'total_spending' => DB::table('transactions')
                        ->selectRaw('COALESCE(SUM(amount), 0)')
                        ->whereColumn('transactions.customer_id', 'customers.id')
                        ->where('period_id', $period->id),
                ]);
            })
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'LIKE', "%{$search}%")
                        ->orWhere('email', 'LIKE', "%{$search}%")
                        ->orWhere('phone', 'LIKE', "%{$search}%");
                });
            })
            ->when($period && in_array($status, ['spending', 'no_spending'], true), function ($query) use ($period, $status) {
                $existsQuery = fn ($q) => $q->from('transactions')
                    ->whereColumn('transactions.customer_id', 'customers.id')
                    ->where('period_id', $period->id);

                if ($status === 'spending') {
                    $query->whereExists($existsQuery);
                } else {
                    $query->whereNotExists($existsQuery);
                }
            });

        $rankedIds = $rankMap->keys()->all();

        if ($period && $rankedIds !== []) {
            $cases = [];
            $bindings = [];

            foreach ($rankedIds as $position => $customerId) {
                $cases[] = 'WHEN customers.id = ? THEN ?';
                $bindings[] = $customerId;
                $bindings[] = $position;
            }

            $bindings[] = count($rankedIds);

            $query->orderByRaw('CASE '.implode(' ', $cases).' ELSE ? END', $bindings);
        }

        $customers = $query->orderByDesc('created_at')
            ->paginate(20)
            ->withQueryString()
            ->through(function ($customer) use ($rankMap) {
                $customer->ranking = $rankMap->get($customer->id) !== null ? (int) $rankMap->get($customer->id) : null;

                return $customer;
            });

        return Inertia::render('admin/customer/index', [
            'customers' => $customers,
            'period' => $period,
            'filters' => [
                'q' => $search,
                'status' => $status,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/customer/create');
    }

    public function store(StoreCustomerRequest $request): RedirectResponse
    {
        Customer::create([
            ...$request->validated(),
            'registered_by' => $request->user()->id,
        ]);

        return redirect()->route('admin.customer.index')
            ->with('success', 'Customer berhasil ditambahkan.');
    }

    public function edit(Customer $customer): Response
    {
        return Inertia::render('admin/customer/edit', [
            'customer' => $customer,
        ]);
    }

    public function update(UpdateCustomerRequest $request, Customer $customer): RedirectResponse
    {
        $customer->update($request->validated());

        return redirect()->route('admin.customer.index')
            ->with('success', 'Customer berhasil diperbarui.');
    }

    public function destroy(Customer $customer): RedirectResponse
    {
        if ($customer->transactions()->exists()) {
            return back()->with('error', 'Customer tidak dapat dihapus karena masih memiliki riwayat transaksi.');
        }

        $customer->delete();

        return redirect()->route('admin.customer.index')
            ->with('success', 'Customer berhasil dihapus.');
    }
}
