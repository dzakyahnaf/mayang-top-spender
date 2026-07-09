<?php

namespace Tests\Feature\Auth;

use App\Models\Customer;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_screen_can_be_rendered()
    {
        $response = $this->get('/register');

        $response->assertStatus(200);
    }

    public function test_new_users_can_register()
    {
        $response = $this->post('/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'phone' => '081234567890',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));
    }

    public function test_registering_with_email_and_phone_of_an_existing_customer_profile_reuses_it_instead_of_erroring()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $customer = Customer::create([
            'name' => 'Ika Sofitri',
            'email' => 'ika@example.com',
            'phone' => '081234567890',
            'registered_by' => $admin->id,
        ]);

        $response = $this->post('/register', [
            'name' => 'Ika Sofitri',
            'email' => 'ika@example.com',
            'phone' => '081234567890',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));
        $this->assertDatabaseCount('customers', 1);
        $this->assertSame($customer->id, Customer::first()->id);
    }

    public function test_registering_reuses_existing_customer_even_when_stored_email_has_different_casing()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $customer = Customer::create([
            'name' => 'Ika Sofitri',
            'email' => 'Ika@Example.com',
            'phone' => '081234567890',
            'registered_by' => $admin->id,
        ]);

        $response = $this->post('/register', [
            'name' => 'Ika Sofitri',
            'email' => 'ika@example.com',
            'phone' => '081234567890',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));
        $this->assertDatabaseCount('customers', 1);
        $this->assertSame($customer->id, Customer::first()->id);
    }

    public function test_registering_with_email_matching_a_customer_but_different_phone_is_rejected()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        Customer::create([
            'name' => 'Ika Sofitri',
            'email' => 'ika@example.com',
            'phone' => '081234567890',
            'registered_by' => $admin->id,
        ]);

        $response = $this->post('/register', [
            'name' => 'Ika Sofitri',
            'email' => 'ika@example.com',
            'phone' => '089999999999',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $this->assertGuest();
        $response->assertSessionHasErrors('email');
        $this->assertDatabaseMissing('users', ['email' => 'ika@example.com']);
        $this->assertDatabaseCount('customers', 1);
    }
}
