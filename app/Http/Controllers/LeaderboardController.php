<?php

namespace App\Http\Controllers;

use App\Models\Period;
use App\Models\Reward;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class LeaderboardController extends Controller
{
    public function index(): Response
    {
        $period = Period::getActive();

        $leaderboard = [];
        $myRank = null;

        if ($period) {
            $leaderboard = DB::select('
                SELECT
                    ROW_NUMBER() OVER (ORDER BY SUM(t.amount) DESC) AS ranking,
                    c.name,
                    SUM(t.amount) AS total_spending
                FROM transactions t
                JOIN customers c ON t.customer_id = c.id
                WHERE t.period_id = ?
                GROUP BY c.id, c.name
                ORDER BY SUM(t.amount) DESC
                LIMIT 50
            ', [$period->id]);

            $user = auth()->user();

            if ($user) {
                $myRank = $this->resolveMyRank($period->id, $user->email, $user->name);
            }
        }

        return Inertia::render('leaderboard', [
            'period' => $period,
            'leaderboard' => $leaderboard,
            'rewards' => Reward::orderBy('sort_order')->orderBy('rank_start')->get(),
            'myRank' => $myRank,
        ]);
    }

    /**
     * @return array{ranking: int|null, name: string, total_spending: float}
     */
    private function resolveMyRank(int $periodId, string $email, string $name): array
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
            'name' => $name,
            'total_spending' => $row ? (float) $row->total_spending : 0,
        ];
    }
}
