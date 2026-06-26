<?php

namespace Database\Seeders;

use App\Models\Reward;
use Illuminate\Database\Seeder;

class RewardSeeder extends Seeder
{
    public function run(): void
    {
        Reward::truncate();

        $rewards = [
            ['rank_start' => 1, 'rank_end' => 1, 'title' => 'Umroh', 'description' => 'Hadiah utama untuk Top Spender #1 — perjalanan ibadah Umroh.', 'sort_order' => 1],
            ['rank_start' => 2, 'rank_end' => 2, 'title' => 'Voucher Belanja Rp 1.000.000', 'description' => 'Voucher belanja produk Mayang.', 'sort_order' => 2],
            ['rank_start' => 3, 'rank_end' => 20, 'title' => 'Voucher Belanja Rp 250.000', 'description' => 'Voucher belanja produk Mayang.', 'sort_order' => 3],
            ['rank_start' => 21, 'rank_end' => 50, 'title' => 'Voucher Belanja Rp 100.000', 'description' => 'Voucher belanja produk Mayang.', 'sort_order' => 4],
        ];

        Reward::insert($rewards);
    }
}
