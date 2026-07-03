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
            ['rank_start' => 1, 'rank_end' => 1, 'title' => 'Paket Umrah', 'description' => 'Hadiah utama untuk Top Spender Utama — perjalanan ibadah Umrah.', 'sort_order' => 1],
            ['rank_start' => 2, 'rank_end' => 3, 'title' => 'Logam Mulia', 'description' => 'Logam Mulia untuk 2 orang.', 'sort_order' => 2],
            ['rank_start' => 4, 'rank_end' => 5, 'title' => 'Microwave & Bolde Set Panci', 'description' => 'Microwave untuk peringkat 4, Bolde Set Panci untuk peringkat 5.', 'sort_order' => 3],
            ['rank_start' => 6, 'rank_end' => 8, 'title' => 'Voucher Belanja Rp 1.000.000', 'description' => 'Voucher belanja produk Mayang.', 'sort_order' => 4],
            ['rank_start' => 9, 'rank_end' => 15, 'title' => 'Voucher Belanja Rp 500.000', 'description' => 'Voucher belanja produk Mayang.', 'sort_order' => 5],
            ['rank_start' => 16, 'rank_end' => 20, 'title' => 'Voucher Belanja Rp 250.000', 'description' => 'Voucher belanja produk Mayang.', 'sort_order' => 6],
            ['rank_start' => 21, 'rank_end' => 30, 'title' => 'Voucher Belanja Rp 100.000', 'description' => 'Voucher belanja produk Mayang.', 'sort_order' => 7],
        ];

        Reward::insert($rewards);
    }
}
