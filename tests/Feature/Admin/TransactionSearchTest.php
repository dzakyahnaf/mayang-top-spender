<?php

namespace Tests\Feature\Admin;

use App\Models\CashierStaff;
use App\Models\Customer;
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
