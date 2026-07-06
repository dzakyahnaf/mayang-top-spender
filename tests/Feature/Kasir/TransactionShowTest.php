<?php

namespace Tests\Feature\Kasir;

use App\Models\Customer;
use App\Models\Period;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TransactionShowTest extends TestCase
{
    use RefreshDatabase;

    private function makeTransaction(User $cashier): Transaction
    {
        $period = Period::create([
            'name' => 'Periode Testing',
            'start_date' => now()->subDay(),
            'end_date' => now()->addMonth(),
            'is_active' => true,
        ]);

        $customer = Customer::create([
            'name' => 'Siti Nurhaliza',
            'email' => 'siti@example.com',
            'phone' => '081234567890',
        ]);

        return Transaction::create([
            'customer_id' => $customer->id,
            'period_id' => $period->id,
            'cashier_id' => $cashier->id,
            'amount' => 150000,
        ]);
    }

    public function test_kasir_can_view_own_transaction_detail()
    {
        $kasir = User::factory()->create(['role' => 'kasir']);
        $transaction = $this->makeTransaction($kasir);

        $this->actingAs($kasir)
            ->get(route('kasir.transaksi.show', $transaction))
            ->assertOk();
    }

    public function test_kasir_cannot_view_another_kasirs_transaction_detail()
    {
        $owner = User::factory()->create(['role' => 'kasir']);
        $otherKasir = User::factory()->create(['role' => 'kasir']);
        $transaction = $this->makeTransaction($owner);

        $this->actingAs($otherKasir)
            ->get(route('kasir.transaksi.show', $transaction))
            ->assertForbidden();
    }

    public function test_kasir_cannot_delete_transaction()
    {
        $kasir = User::factory()->create(['role' => 'kasir']);
        $transaction = $this->makeTransaction($kasir);

        $this->assertFalse($kasir->can('delete', $transaction));
    }
}
