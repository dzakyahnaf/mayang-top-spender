<?php

namespace Database\Seeders;

use App\Models\Reward;
use Illuminate\Database\Seeder;

class RewardSeeder extends Seeder
{
    public function run(): void
    {
        $rewards = [
            ['rank_start' => 1, 'rank_end' => 1, 'title' => 'Emas Antam 10 gram', 'description' => 'Hadiah utama untuk Top Spender peringkat 1.', 'sort_order' => 1],
            ['rank_start' => 2, 'rank_end' => 2, 'title' => 'Voucher Belanja Rp 5.000.000', 'description' => 'Voucher belanja Mayang Modest Wear.', 'sort_order' => 2],
            ['rank_start' => 3, 'rank_end' => 5, 'title' => 'Voucher Belanja Rp 2.000.000', 'description' => 'Voucher belanja Mayang Modest Wear.', 'sort_order' => 3],
            ['rank_start' => 6, 'rank_end' => 10, 'title' => 'Voucher Belanja Rp 1.000.000', 'description' => 'Voucher belanja Mayang Modest Wear.', 'sort_order' => 4],
            ['rank_start' => 11, 'rank_end' => 20, 'title' => 'Voucher Belanja Rp 500.000', 'description' => 'Voucher belanja Mayang Modest Wear.', 'sort_order' => 5],
            ['rank_start' => 21, 'rank_end' => 50, 'title' => 'Voucher Belanja Rp 250.000', 'description' => 'Voucher belanja Mayang Modest Wear.', 'sort_order' => 6],
            ['rank_start' => 51, 'rank_end' => 100, 'title' => 'Voucher Belanja Rp 100.000', 'description' => 'Voucher belanja Mayang Modest Wear.', 'sort_order' => 7],
        ];

        foreach ($rewards as $reward) {
            Reward::updateOrCreate(
                ['rank_start' => $reward['rank_start'], 'rank_end' => $reward['rank_end']],
                $reward
            );
        }
    }
}
