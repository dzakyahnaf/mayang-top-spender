<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Period;
use App\Models\Reward;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;
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

        $period = Period::getActive();
        $myRank = null;
        $nextReward = null;

        if ($period) {
            $myRank = $this->resolvePeriodRank($period->id, $user->email);
            $nextReward = $this->resolveNextReward($period->id, $myRank['ranking'], $myRank['total_spending']);
        }

        return Inertia::render('my-spending', [
            'customer' => [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
            ],
            'transactions' => $transactions,
            'totalSpending' => $totalSpending,
            'period' => $period,
            'myRank' => $myRank,
            'nextReward' => $nextReward,
        ]);
    }

    /**
     * @return array{ranking: int|null, total_spending: float}
     */
    private function resolvePeriodRank(int $periodId, string $email): array
    {
        $row = DB::selectOne('
            SELECT ranking, total_spending
            FROM (
                SELECT
                    c.email,
                    ROW_NUMBER() OVER (ORDER BY SUM(t.amount) DESC) AS ranking,
                    SUM(t.amount) AS total_spending
                FROM transactions t
                JOIN customers c ON t.customer_id = c.id
                WHERE t.period_id = ?
                GROUP BY c.id, c.email
            ) ranked
            WHERE ranked.email = ?
        ', [$periodId, $email]);

        return [
            'ranking' => $row ? (int) $row->ranking : null,
            'total_spending' => $row ? (float) $row->total_spending : 0,
        ];
    }

    /**
     * Find the best reward tier the customer hasn't reached yet, and how much
     * more spending (in the active period) is needed to break into it.
     *
     * @return array{title: string, rank_label: string, amount_needed: float}|null
     */
    private function resolveNextReward(int $periodId, ?int $ranking, float $myTotalSpending): ?array
    {
        $target = Reward::where('rank_end', '<', $ranking ?? PHP_INT_MAX)
            ->orderByDesc('rank_end')
            ->first();

        if (! $target) {
            return null;
        }

        $cutoff = DB::selectOne('
            SELECT total_spending
            FROM (
                SELECT
                    ROW_NUMBER() OVER (ORDER BY SUM(t.amount) DESC) AS ranking,
                    SUM(t.amount) AS total_spending
                FROM transactions t
                WHERE t.period_id = ?
                GROUP BY t.customer_id
            ) ranked
            WHERE ranked.ranking = ?
        ', [$periodId, $target->rank_end]);

        $amountNeeded = $cutoff ? max((float) $cutoff->total_spending - $myTotalSpending, 0) : 0;

        return [
            'title' => $target->title,
            'rank_label' => $target->rankLabel(),
            'amount_needed' => $amountNeeded,
        ];
    }
}
