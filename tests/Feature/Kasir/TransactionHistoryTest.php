<?php

namespace Tests\Feature\Kasir;

use App\Models\Customer;
use App\Models\Period;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class TransactionHistoryTest extends TestCase
{
    use RefreshDatabase;

    private function period(): Period
    {
        return Period::create([
            'name' => 'Periode Testing',
            'start_date' => now()->subDay(),
            'end_date' => now()->addMonth(),
            'is_active' => true,
        ]);
    }

    private function transaction(User $cashier, Period $period, string $customerName): Transaction
    {
        $customer = Customer::create([
            'name' => $customerName,
            'email' => strtolower(str_replace(' ', '', $customerName)).'@example.com',
            'phone' => '08'.random_int(100000000, 999999999),
        ]);

        return Transaction::create([
            'customer_id' => $customer->id,
            'period_id' => $period->id,
            'cashier_id' => $cashier->id,
            'amount' => 150000,
        ]);
    }

    public function test_kasir_only_sees_own_transactions()
    {
        $kasir = User::factory()->create(['role' => 'kasir']);
        $otherKasir = User::factory()->create(['role' => 'kasir']);
        $period = $this->period();

        $this->transaction($kasir, $period, 'Siti Nurhaliza');
        $this->transaction($otherKasir, $period, 'Aisyah Putri');

        $this->actingAs($kasir)
            ->get(route('kasir.transaksi.history'))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->has('transactions.data', 1)
                ->where('transactions.data.0.customer.name', 'Siti Nurhaliza')
            );
    }

    public function test_search_filter_matches_customer_name()
    {
        $kasir = User::factory()->create(['role' => 'kasir']);
        $period = $this->period();

        $this->transaction($kasir, $period, 'Siti Nurhaliza');
        $this->transaction($kasir, $period, 'Aisyah Putri');

        $this->actingAs($kasir)
            ->get(route('kasir.transaksi.history', ['q' => 'Siti']))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->has('transactions.data', 1)
                ->where('transactions.data.0.customer.name', 'Siti Nurhaliza')
                ->where('filters.q', 'Siti')
            );
    }

    public function test_date_range_filter_excludes_transactions_outside_range()
    {
        $kasir = User::factory()->create(['role' => 'kasir']);
        $period = $this->period();

        $inRange = $this->transaction($kasir, $period, 'Siti Nurhaliza');
        $outOfRange = $this->transaction($kasir, $period, 'Aisyah Putri');
        $outOfRange->forceFill(['created_at' => now()->subDays(10)])->save();

        $this->actingAs($kasir)
            ->get(route('kasir.transaksi.history', ['date_from' => now()->subDay()->toDateString()]))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->has('transactions.data', 1)
                ->where('transactions.data.0.id', $inRange->id)
            );
    }

    public function test_history_shows_each_transactions_own_amount_not_a_customer_total()
    {
        $kasir = User::factory()->create(['role' => 'kasir']);
        $activePeriod = $this->period();

        $transaction = $this->transaction($kasir, $activePeriod, 'Siti Nurhaliza');
        $transaction->forceFill(['created_at' => now()->subMinute()])->save();
        Transaction::create([
            'customer_id' => $transaction->customer_id,
            'period_id' => $activePeriod->id,
            'cashier_id' => $kasir->id,
            'amount' => 500000,
        ]);

        $this->actingAs($kasir)
            ->get(route('kasir.transaksi.history'))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->has('transactions.data', 2)
                ->where('transactions.data.0.amount', '500000.00')
                ->where('transactions.data.1.amount', '150000.00')
            );
    }
}
