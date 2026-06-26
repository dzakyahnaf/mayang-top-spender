<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\Period;
use App\Models\Transaction;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DummyLeaderboardSeeder extends Seeder
{
    /**
     * Seed 50 dummy customers with one transaction each in the active period,
     * so the leaderboard (Top 50) can be visually tested. Idempotent: re-running
     * updates the same dummy rows instead of duplicating them.
     */
    public function run(): void
    {
        $period = Period::getActive() ?? Period::create([
            'name' => 'Mayang Top Spender 2026',
            'start_date' => '2026-07-01',
            'end_date' => '2026-12-31',
            'is_active' => true,
        ]);

        foreach ($this->dummyNames() as $index => $name) {
            $slug = Str::slug($name, '.');

            $customer = Customer::updateOrCreate(
                ['email' => "{$slug}{$index}@example.com"],
                [
                    'name' => $name,
                    'phone' => '0812'.str_pad((string) (10000000 + $index), 8, '0', STR_PAD_LEFT),
                ]
            );

            // Exponential-ish decay so the top spenders clearly stand out across
            // the reward brackets (1, 2, 3-20, 21-50), with light jitter.
            $amount = (int) round(30_000_000 * (0.93 ** $index)) + random_int(50_000, 400_000);

            Transaction::updateOrCreate(
                [
                    'customer_id' => $customer->id,
                    'period_id' => $period->id,
                    'notes' => '[DUMMY] Data uji leaderboard',
                ],
                ['amount' => $amount]
            );
        }
    }

    /**
     * @return list<string>
     */
    private function dummyNames(): array
    {
        return [
            'Nisa Rahmawati', 'Aisyah Putri', 'Siti Maryam', 'Fatimah Az-Zahra', 'Khadijah Salsabila',
            'Halimah Nur', 'Zahra Amelia', 'Maryam Hanifah', 'Annisa Fitriani', 'Salma Kirana',
            'Hana Permata', 'Laila Ramadhani', 'Dewi Anggraini', 'Rania Syakira', 'Najwa Shihab',
            'Putri Ayu Lestari', 'Indah Permatasari', 'Cahya Ningrum', 'Mutiara Sari', 'Bunga Citra',
            'Alya Nabila', 'Kamila Husna', 'Syifa Aulia', 'Talita Zahira', 'Naura Ayudia',
            'Keisha Amira', 'Dinda Pratiwi', 'Vania Maharani', 'Aurel Hermansyah', 'Gita Savitri',
            'Raisa Andriana', 'Tiara Andini', 'Bella Saphira', 'Citra Kirana', 'Maudy Ayunda',
            'Isyana Sarasvati', 'Prilly Latuconsina', 'Amanda Rawles', 'Yuki Kato', 'Mawar Eva',
            'Sherina Munaf', 'Lesti Kejora', 'Ayu Ting Ting', 'Nagita Slavina', 'Zaskia Mecca',
            'Oki Setiana', 'Shireen Sungkar', 'Natasha Rizki', 'Dian Pelangi', 'Ria Miranda',
        ];
    }
}
