<?php

namespace App\Http\Controllers;

use App\Models\Reward;
use Inertia\Inertia;
use Inertia\Response;

class RewardController extends Controller
{
    public function index(): Response
    {
        $rewards = Reward::orderBy('sort_order')->orderBy('rank_start')->get();

        return Inertia::render('daftar-hadiah', [
            'rewards' => $rewards,
        ]);
    }
}
