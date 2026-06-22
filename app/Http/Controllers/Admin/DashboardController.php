<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Period;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $period = Period::getActive();
        $totalCustomers = Customer::count();

        $periodStats = null;
        $topSpenders = [];

        if ($period) {
            $periodStats = DB::selectOne("
                SELECT
                    COUNT(t.id) AS total_transactions,
                    COALESCE(SUM(t.amount), 0) AS total_nominal
                FROM transactions t
                WHERE t.period_id = ?
            ", [$period->id]);

            $topSpenders = DB::select("
                SELECT
                    ROW_NUMBER() OVER (ORDER BY SUM(t.amount) DESC) AS rank,
                    c.name,
                    SUM(t.amount) AS total_spending
                FROM transactions t
                JOIN customers c ON t.customer_id = c.id
                WHERE t.period_id = ?
                GROUP BY c.id, c.name
                ORDER BY SUM(t.amount) DESC
                LIMIT 5
            ", [$period->id]);
        }

        return Inertia::render('admin/dashboard', [
            'period' => $period,
            'totalCustomers' => $totalCustomers,
            'periodStats' => $periodStats,
            'topSpenders' => $topSpenders,
        ]);
    }
}
