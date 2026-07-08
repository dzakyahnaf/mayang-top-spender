<?php

namespace Tests\Feature\Admin;

use App\Models\Customer;
use App\Models\Period;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CustomerRankSortTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_list_is_sorted_by_ranking_when_period_is_active()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $kasir = User::factory()->create(['role' => 'kasir']);
        $period = Period::create([
            'name' => 'Periode Testing',
            'start_date' => now()->subDay(),
            'end_date' => now()->addMonth(),
            'is_active' => true,
        ]);

        $low = Customer::create(['name' => 'Customer Rendah', 'email' => 'rendah@example.com', 'phone' => '081111111111']);
        $high = Customer::create(['name' => 'Customer Tinggi', 'email' => 'tinggi@example.com', 'phone' => '082222222222']);
        $none = Customer::create(['name' => 'Customer Tanpa Transaksi', 'email' => 'kosong@example.com', 'phone' => '083333333333']);

        Transaction::create(['customer_id' => $low->id, 'cashier_id' => $kasir->id, 'period_id' => $period->id, 'amount' => 100000]);
        Transaction::create(['customer_id' => $high->id, 'cashier_id' => $kasir->id, 'period_id' => $period->id, 'amount' => 500000]);

        $response = $this->actingAs($admin)->get(route('admin.customer.index'));

        $response->assertInertia(fn (Assert $page) => $page
            ->where('customers.data.0.id', $high->id)
            ->where('customers.data.1.id', $low->id)
            ->where('customers.data.2.id', $none->id)
        );
    }

    public function test_customer_list_falls_back_to_created_at_without_active_period()
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $older = Customer::create(['name' => 'Lama', 'email' => 'lama@example.com', 'phone' => '081111111111']);
        $older->forceFill(['created_at' => now()->subDay()])->save();

        $newer = Customer::create(['name' => 'Baru', 'email' => 'baru@example.com', 'phone' => '082222222222']);

        $response = $this->actingAs($admin)->get(route('admin.customer.index'));

        $response->assertInertia(fn (Assert $page) => $page
            ->where('customers.data.0.id', $newer->id)
            ->where('customers.data.1.id', $older->id)
        );
    }

    public function test_customer_list_can_be_sorted_by_name_ascending()
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $zeta = Customer::create(['name' => 'Zeta', 'email' => 'zeta@example.com', 'phone' => '081111111111']);
        $alpha = Customer::create(['name' => 'Alpha', 'email' => 'alpha@example.com', 'phone' => '082222222222']);

        $response = $this->actingAs($admin)->get(route('admin.customer.index', ['sort' => 'name', 'direction' => 'asc']));

        $response->assertInertia(fn (Assert $page) => $page
            ->where('customers.data.0.id', $alpha->id)
            ->where('customers.data.1.id', $zeta->id)
            ->where('filters.sort', 'name')
            ->where('filters.direction', 'asc')
        );
    }

    public function test_customer_list_can_be_sorted_by_total_spending_ascending()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $kasir = User::factory()->create(['role' => 'kasir']);
        $period = Period::create([
            'name' => 'Periode Testing',
            'start_date' => now()->subDay(),
            'end_date' => now()->addMonth(),
            'is_active' => true,
        ]);

        $low = Customer::create(['name' => 'Customer Rendah', 'email' => 'rendah@example.com', 'phone' => '081111111111']);
        $high = Customer::create(['name' => 'Customer Tinggi', 'email' => 'tinggi@example.com', 'phone' => '082222222222']);

        Transaction::create(['customer_id' => $low->id, 'cashier_id' => $kasir->id, 'period_id' => $period->id, 'amount' => 100000]);
        Transaction::create(['customer_id' => $high->id, 'cashier_id' => $kasir->id, 'period_id' => $period->id, 'amount' => 500000]);

        $response = $this->actingAs($admin)->get(route('admin.customer.index', ['sort' => 'total_spending', 'direction' => 'asc']));

        $response->assertInertia(fn (Assert $page) => $page
            ->where('customers.data.0.id', $low->id)
            ->where('customers.data.1.id', $high->id)
        );
    }

    public function test_invalid_sort_parameter_falls_back_to_default()
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->get(route('admin.customer.index', ['sort' => 'email']));

        $response->assertInertia(fn (Assert $page) => $page
            ->where('filters.sort', 'created_at')
        );
    }
}
