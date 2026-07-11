<?php

namespace Tests\Feature\Admin;

use App\Models\Customer;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Tests\TestCase;

class CustomerStoreTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_register_a_customer_without_a_password()
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->post(route('admin.customer.store'), [
            'name' => 'Siti Nurhaliza',
            'email' => 'siti@example.com',
            'phone' => '081234567890',
        ]);

        $response->assertRedirect(route('admin.customer.index'));
        $customer = Customer::first();
        $this->assertNotNull($customer);
        $this->assertNull($customer->user_id);
        $this->assertDatabaseCount('users', 1);
    }

    public function test_admin_can_register_a_customer_with_a_password_and_the_customer_can_log_in()
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->post(route('admin.customer.store'), [
            'name' => 'Siti Nurhaliza',
            'email' => 'siti@example.com',
            'phone' => '081234567890',
            'password' => 'password123',
        ]);

        $response->assertRedirect(route('admin.customer.index'));

        $customer = Customer::first();
        $user = User::where('email', 'siti@example.com')->first();

        $this->assertNotNull($user);
        $this->assertSame('customer', $user->role);
        $this->assertSame($user->id, $customer->user_id);

        Auth::logout();
        $this->assertTrue(Auth::attempt(['email' => 'siti@example.com', 'password' => 'password123']));
    }

    public function test_admin_cannot_register_a_customer_whose_email_or_phone_already_has_an_account()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        User::factory()->create(['role' => 'customer', 'email' => 'siti@example.com', 'phone' => '081234567890']);

        $response = $this->actingAs($admin)->post(route('admin.customer.store'), [
            'name' => 'Siti Nurhaliza',
            'email' => 'siti@example.com',
            'phone' => '081234567890',
            'password' => 'password123',
        ]);

        $response->assertSessionHasErrors(['email', 'phone']);
        $this->assertDatabaseCount('customers', 0);
    }
}
