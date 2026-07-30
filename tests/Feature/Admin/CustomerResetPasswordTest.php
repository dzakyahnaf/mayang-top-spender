<?php

namespace Tests\Feature\Admin;

use App\Models\Customer;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Tests\TestCase;

class CustomerResetPasswordTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_reset_password_for_a_customer_with_an_account_and_the_customer_can_log_in_with_it()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create(['role' => 'customer', 'email' => 'siti@example.com']);
        $customer = Customer::create([
            'name' => 'Siti Nurhaliza',
            'email' => 'siti@example.com',
            'phone' => '081234567890',
            'user_id' => $user->id,
        ]);

        $response = $this->actingAs($admin)->put(route('admin.customer.reset-password', $customer), [
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertRedirect(route('admin.customer.edit', $customer));

        Auth::logout();
        $this->assertTrue(Auth::attempt(['email' => 'siti@example.com', 'password' => 'newpassword123']));
    }

    public function test_admin_cannot_reset_password_for_a_customer_without_an_account()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $customer = Customer::create([
            'name' => 'Tanpa Akun',
            'email' => 'tanpa-akun@example.com',
            'phone' => '081234567891',
        ]);

        $response = $this->actingAs($admin)->put(route('admin.customer.reset-password', $customer), [
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertNotFound();
    }

    public function test_reset_password_requires_matching_confirmation()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create(['role' => 'customer']);
        $customer = Customer::create([
            'name' => 'Siti Nurhaliza',
            'email' => 'siti2@example.com',
            'phone' => '081234567892',
            'user_id' => $user->id,
        ]);

        $response = $this->actingAs($admin)->put(route('admin.customer.reset-password', $customer), [
            'password' => 'newpassword123',
            'password_confirmation' => 'different123',
        ]);

        $response->assertSessionHasErrors('password');
    }

    public function test_kasir_cannot_reset_a_customer_password()
    {
        $kasir = User::factory()->create(['role' => 'kasir']);
        $user = User::factory()->create(['role' => 'customer']);
        $customer = Customer::create([
            'name' => 'Siti Nurhaliza',
            'email' => 'siti3@example.com',
            'phone' => '081234567893',
            'user_id' => $user->id,
        ]);

        $response = $this->actingAs($kasir)->put(route('admin.customer.reset-password', $customer), [
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertForbidden();
    }
}
