<?php

namespace App\Http\Controllers;

use App\Models\Period;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class LeaderboardController extends Controller
{
    public function index(): Response
    {
        $period = Period::getActive();

        $leaderboard = [];

        if ($period) {
            $leaderboard = DB::select("
                SELECT
                    ROW_NUMBER() OVER (ORDER BY SUM(t.amount) DESC) AS rank,
                    c.name,
                    SUM(t.amount) AS total_spending
                FROM transactions t
                JOIN customers c ON t.customer_id = c.id
                WHERE t.period_id = ?
                GROUP BY c.id, c.name
                ORDER BY SUM(t.amount) DESC
            ", [$period->id]);
        }

        return Inertia::render('leaderboard', [
            'period' => $period,
            'leaderboard' => $leaderboard,
        ]);
    }
}
