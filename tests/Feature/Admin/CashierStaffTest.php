<?php

namespace Tests\Feature\Admin;

use App\Models\CashierStaff;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CashierStaffTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_add_staff_to_an_outlet()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $kasir = User::factory()->create(['role' => 'kasir']);

        $response = $this->actingAs($admin)->post(route('admin.kasir.staff.store', $kasir), [
            'name' => 'Rina Wulandari',
        ]);

        $response->assertRedirect(route('admin.kasir.staff.index', $kasir));
        $this->assertDatabaseHas('cashier_staff', [
            'user_id' => $kasir->id,
            'name' => 'Rina Wulandari',
        ]);
    }

    public function test_admin_can_remove_staff_from_an_outlet()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $kasir = User::factory()->create(['role' => 'kasir']);
        $staff = CashierStaff::create(['user_id' => $kasir->id, 'name' => 'Rina Wulandari']);

        $response = $this->actingAs($admin)->delete(route('admin.kasir.staff.destroy', [$kasir, $staff]));

        $response->assertRedirect(route('admin.kasir.staff.index', $kasir));
        $this->assertDatabaseMissing('cashier_staff', ['id' => $staff->id]);
    }

    public function test_admin_cannot_delete_staff_belonging_to_a_different_outlet()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $kasirA = User::factory()->create(['role' => 'kasir']);
        $kasirB = User::factory()->create(['role' => 'kasir']);
        $staff = CashierStaff::create(['user_id' => $kasirA->id, 'name' => 'Rina Wulandari']);

        $response = $this->actingAs($admin)->delete(route('admin.kasir.staff.destroy', [$kasirB, $staff]));

        $response->assertNotFound();
        $this->assertDatabaseHas('cashier_staff', ['id' => $staff->id]);
    }

    public function test_kasir_role_cannot_access_staff_management()
    {
        $kasir = User::factory()->create(['role' => 'kasir']);
        $otherKasir = User::factory()->create(['role' => 'kasir']);

        $response = $this->actingAs($kasir)->get(route('admin.kasir.staff.index', $otherKasir));

        $response->assertForbidden();
    }
}
