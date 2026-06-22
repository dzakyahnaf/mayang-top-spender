<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Period;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function index(): Response
    {
        $period = Period::getActive();

        $customers = Customer::query()
            ->when($period, function ($query) use ($period) {
                $query->addSelect([
                    'total_spending' => DB::table('transactions')
                        ->selectRaw('COALESCE(SUM(amount), 0)')
                        ->whereColumn('transactions.customer_id', 'customers.id')
                        ->where('period_id', $period->id),
                ]);
            })
            ->orderByDesc('created_at')
            ->paginate(20);

        return Inertia::render('admin/customer/index', [
            'customers' => $customers,
            'period' => $period,
        ]);
    }
}
