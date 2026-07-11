<?php

namespace Tests\Feature\Admin;

use App\Models\CashierStaff;
use App\Models\Customer;
use App\Models\Period;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TransactionSearchTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_search_customers()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        Customer::create(['name' => 'Siti Nurhaliza', 'email' => 'siti@example.com', 'phone' => '081234567890']);

        $response = $this->actingAs($admin)->get(route('admin.api.customers.search', ['q' => 'siti']));

        $response->assertOk();
        $response->assertJsonFragment(['name' => 'Siti Nurhaliza']);
    }

    public function test_admin_customer_search_only_counts_spending_from_the_active_period()
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

        Transaction::create(['customer_id' => $customer->id, 'period_id' => $activePeriod->id, 'cashier_id' => $kasir->id, 'amount' => 100000]);
        Transaction::create(['customer_id' => $customer->id, 'period_id' => $oldPeriod->id, 'cashier_id' => $kasir->id, 'amount' => 500000]);

        $response = $this->actingAs($admin)->get(route('admin.api.customers.search', ['q' => 'siti']));

        $response->assertOk();
        $response->assertJsonFragment(['total_spending' => 100000]);
    }

    public function test_admin_can_search_staff()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $kasir = User::factory()->create(['role' => 'kasir']);
        CashierStaff::create(['user_id' => $kasir->id, 'name' => 'Rina']);

        $response = $this->actingAs($admin)->get(route('admin.api.staff.search', ['q' => 'rina']));

        $response->assertOk();
        $response->assertJsonFragment(['name' => 'Rina']);
    }
}
