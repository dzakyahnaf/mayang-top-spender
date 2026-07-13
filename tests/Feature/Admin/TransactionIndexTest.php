<?php

namespace Tests\Feature\Admin;

use App\Models\Customer;
use App\Models\Period;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class TransactionIndexTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_shows_running_coin_total_per_transaction_not_a_flat_customer_total()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $kasir = User::factory()->create(['role' => 'kasir']);
        $customer = Customer::create(['name' => 'Siti Nurhaliza', 'email' => 'siti@example.com', 'phone' => '081234567890']);

        $activePeriod = Period::create([
            'name' => 'Periode Aktif',
            'start_date' => now()->subDay(),
            'end_date' => now()->addMonth(),
            'is_active' => true,
        ]);
        $oldPeriod = Period::create([
            'name' => 'Periode Lama',
            'start_date' => now()->subYear(),
            'end_date' => now()->subMonths(11),
            'is_active' => false,
        ]);

        // Old-period transaction must not leak into the active period's running total.
        Transaction::create(['customer_id' => $customer->id, 'period_id' => $oldPeriod->id, 'cashier_id' => $kasir->id, 'amount' => 999000]);

        $older = Transaction::create(['customer_id' => $customer->id, 'period_id' => $activePeriod->id, 'cashier_id' => $kasir->id, 'amount' => 100000]);
        $older->forceFill(['created_at' => now()->subMinute()])->save();
        Transaction::create(['customer_id' => $customer->id, 'period_id' => $activePeriod->id, 'cashier_id' => $kasir->id, 'amount' => 500000]);

        $this->actingAs($admin)
            ->get(route('admin.transaksi.index', ['period_id' => $activePeriod->id]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('transactions.data', 2)
                ->where('transactions.data.0.amount', '500000.00')
                ->where('transactions.data.0.running_coin_total', 600000)
                ->where('transactions.data.1.amount', '100000.00')
                ->where('transactions.data.1.running_coin_total', 100000)
            );
    }
}
