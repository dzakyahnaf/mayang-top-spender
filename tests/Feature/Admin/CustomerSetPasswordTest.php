<?php

namespace Tests\Feature\Admin;

use App\Models\Customer;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Tests\TestCase;

class CustomerSetPasswordTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_set_a_password_for_a_customer_without_an_account_and_the_customer_can_log_in_with_it()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $customer = Customer::create([
            'name' => 'Tanpa Akun',
            'email' => 'tanpa-akun@example.com',
            'phone' => '081234567891',
        ]);

        $response = $this->actingAs($admin)->put(route('admin.customer.set-password', $customer), [
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertRedirect(route('admin.customer.edit', $customer));

        $customer->refresh();
        $this->assertNotNull($customer->user_id);
        $this->assertSame('customer', $customer->user->role);

        Auth::logout();
        $this->assertTrue(Auth::attempt(['email' => 'tanpa-akun@example.com', 'password' => 'newpassword123']));
    }

    public function test_admin_cannot_set_a_password_for_a_customer_that_already_has_an_account()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create(['role' => 'customer']);
        $customer = Customer::create([
            'name' => 'Siti Nurhaliza',
            'email' => 'siti@example.com',
            'phone' => '081234567890',
            'user_id' => $user->id,
        ]);

        $response = $this->actingAs($admin)->put(route('admin.customer.set-password', $customer), [
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertNotFound();
    }

    public function test_set_password_requires_matching_confirmation()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $customer = Customer::create([
            'name' => 'Tanpa Akun',
            'email' => 'tanpa-akun2@example.com',
            'phone' => '081234567892',
        ]);

        $response = $this->actingAs($admin)->put(route('admin.customer.set-password', $customer), [
            'password' => 'newpassword123',
            'password_confirmation' => 'different123',
        ]);

        $response->assertSessionHasErrors('password');
        $this->assertNull($customer->refresh()->user_id);
    }

    public function test_kasir_cannot_set_a_customer_password()
    {
        $kasir = User::factory()->create(['role' => 'kasir']);
        $customer = Customer::create([
            'name' => 'Tanpa Akun',
            'email' => 'tanpa-akun3@example.com',
            'phone' => '081234567893',
        ]);

        $response = $this->actingAs($kasir)->put(route('admin.customer.set-password', $customer), [
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertForbidden();
    }

    public function test_admin_cannot_set_a_password_when_email_or_phone_already_belongs_to_a_user_account()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        User::factory()->create(['email' => 'conflict@example.com', 'role' => 'customer']);
        $customer = Customer::create([
            'name' => 'Tanpa Akun',
            'email' => 'conflict@example.com',
            'phone' => '081234567894',
        ]);

        $response = $this->actingAs($admin)->put(route('admin.customer.set-password', $customer), [
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertSessionHasErrors('password');
        $this->assertNull($customer->refresh()->user_id);
    }
}
