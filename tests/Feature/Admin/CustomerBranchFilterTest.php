<?php

namespace Tests\Feature\Admin;

use App\Models\Customer;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CustomerBranchFilterTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_list_can_be_filtered_by_the_kasir_who_registered_them()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $kasirA = User::factory()->create(['role' => 'kasir', 'name' => 'Outlet A']);
        $kasirB = User::factory()->create(['role' => 'kasir', 'name' => 'Outlet B']);

        $fromA = Customer::create(['name' => 'Dari A', 'email' => 'a@example.com', 'phone' => '081111111111', 'registered_by' => $kasirA->id]);
        Customer::create(['name' => 'Dari B', 'email' => 'b@example.com', 'phone' => '082222222222', 'registered_by' => $kasirB->id]);

        $response = $this->actingAs($admin)->get(route('admin.customer.index', ['registered_by' => $kasirA->id]));

        $response->assertInertia(fn (Assert $page) => $page
            ->has('customers.data', 1)
            ->where('customers.data.0.id', $fromA->id)
            ->where('customers.data.0.registrar.name', 'Outlet A')
        );
    }

    public function test_non_cabang_filter_includes_self_registered_and_admin_registered_customers()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $kasir = User::factory()->create(['role' => 'kasir']);

        $selfRegistered = Customer::create(['name' => 'Daftar Sendiri', 'email' => 'web@example.com', 'phone' => '081111111111']);
        $adminRegistered = Customer::create(['name' => 'Oleh Admin', 'email' => 'admin-reg@example.com', 'phone' => '082222222222', 'registered_by' => $admin->id]);
        Customer::create(['name' => 'Dari Outlet', 'email' => 'outlet@example.com', 'phone' => '083333333333', 'registered_by' => $kasir->id]);

        $response = $this->actingAs($admin)->get(route('admin.customer.index', ['registered_by' => 'non_cabang']));

        $response->assertInertia(fn (Assert $page) => $page
            ->has('customers.data', 2)
        );

        $ids = collect($response->viewData('page')['props']['customers']['data'])->pluck('id');

        $this->assertTrue($ids->contains($selfRegistered->id));
        $this->assertTrue($ids->contains($adminRegistered->id));
    }

    public function test_cashiers_list_is_passed_for_the_branch_filter_dropdown()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $kasir = User::factory()->create(['role' => 'kasir', 'name' => 'Outlet Utama']);

        $response = $this->actingAs($admin)->get(route('admin.customer.index'));

        $response->assertInertia(fn (Assert $page) => $page
            ->has('cashiers', 1)
            ->where('cashiers.0.name', 'Outlet Utama')
        );
    }
}
