<?php

namespace Tests\Feature\Admin;

use App\Models\CashierStaff;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class StaffTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_add_staff_to_an_outlet()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $kasir = User::factory()->create(['role' => 'kasir']);

        $response = $this->actingAs($admin)->post(route('admin.staff.store'), [
            'user_id' => $kasir->id,
            'name' => 'Rina Wulandari',
        ]);

        $response->assertRedirect(route('admin.staff.index'));
        $this->assertDatabaseHas('cashier_staff', [
            'user_id' => $kasir->id,
            'name' => 'Rina Wulandari',
        ]);
    }

    public function test_admin_cannot_add_staff_to_a_non_kasir_user()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $otherAdmin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->post(route('admin.staff.store'), [
            'user_id' => $otherAdmin->id,
            'name' => 'Rina Wulandari',
        ]);

        $response->assertSessionHasErrors('user_id');
        $this->assertDatabaseMissing('cashier_staff', ['name' => 'Rina Wulandari']);
    }

    public function test_admin_can_remove_staff()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $kasir = User::factory()->create(['role' => 'kasir']);
        $staff = CashierStaff::create(['user_id' => $kasir->id, 'name' => 'Rina Wulandari']);

        $response = $this->actingAs($admin)->delete(route('admin.staff.destroy', $staff));

        $response->assertRedirect(route('admin.staff.index'));
        $this->assertDatabaseMissing('cashier_staff', ['id' => $staff->id]);
    }

    public function test_staff_list_shows_staff_from_all_outlets_with_outlet_name()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $kasirA = User::factory()->create(['role' => 'kasir', 'name' => 'Outlet A']);
        $kasirB = User::factory()->create(['role' => 'kasir', 'name' => 'Outlet B']);
        CashierStaff::create(['user_id' => $kasirA->id, 'name' => 'Rina']);
        CashierStaff::create(['user_id' => $kasirB->id, 'name' => 'Budi']);

        $response = $this->actingAs($admin)->get(route('admin.staff.index'));

        $response->assertInertia(fn (Assert $page) => $page
            ->component('admin/staff/index')
            ->has('staff.data', 2)
        );
    }

    public function test_staff_list_can_be_searched_by_staff_name()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $kasirA = User::factory()->create(['role' => 'kasir', 'name' => 'Outlet A']);
        $kasirB = User::factory()->create(['role' => 'kasir', 'name' => 'Outlet B']);
        CashierStaff::create(['user_id' => $kasirA->id, 'name' => 'Sabrina Kraksaan']);
        CashierStaff::create(['user_id' => $kasirB->id, 'name' => 'Budi']);

        $response = $this->actingAs($admin)->get(route('admin.staff.index', ['q' => 'sabrina']));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('admin/staff/index')
            ->has('staff.data', 1)
            ->where('staff.data.0.name', 'Sabrina Kraksaan')
        );
    }

    public function test_staff_list_can_be_searched_by_outlet_name()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $kasirA = User::factory()->create(['role' => 'kasir', 'name' => 'Outlet Kraksaan']);
        $kasirB = User::factory()->create(['role' => 'kasir', 'name' => 'Outlet Pandaan']);
        CashierStaff::create(['user_id' => $kasirA->id, 'name' => 'Sabrina K']);
        CashierStaff::create(['user_id' => $kasirB->id, 'name' => 'Sabrina P']);

        $response = $this->actingAs($admin)->get(route('admin.staff.index', ['q' => 'kraksaan']));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('admin/staff/index')
            ->has('staff.data', 1)
            ->where('staff.data.0.name', 'Sabrina K')
        );
    }

    public function test_kasir_role_cannot_access_staff_management()
    {
        $kasir = User::factory()->create(['role' => 'kasir']);

        $response = $this->actingAs($kasir)->get(route('admin.staff.index'));

        $response->assertForbidden();
    }
}
