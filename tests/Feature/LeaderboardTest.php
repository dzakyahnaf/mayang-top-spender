<?php

namespace Tests\Feature;

use App\Models\Customer;
use App\Models\Period;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class LeaderboardTest extends TestCase
{
    use RefreshDatabase;

    private function activePeriod(): Period
    {
        return Period::create([
            'name' => 'Periode Testing',
            'start_date' => now()->subDay(),
            'end_date' => now()->addMonth(),
            'is_active' => true,
        ]);
    }

    public function test_guests_see_leaderboard_without_my_rank_card()
    {
        $this->activePeriod();

        $this->get('/leaderboard')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page->where('myRank', null));
    }

    public function test_admin_sees_public_leaderboard_without_my_rank_card()
    {
        $this->activePeriod();
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)
            ->get('/leaderboard')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page->where('myRank', null));
    }

    public function test_kasir_sees_public_leaderboard_without_my_rank_card()
    {
        $this->activePeriod();
        $kasir = User::factory()->create(['role' => 'kasir']);

        $this->actingAs($kasir)
            ->get('/leaderboard')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page->where('myRank', null));
    }

    public function test_customer_sees_their_own_rank_card()
    {
        $period = $this->activePeriod();
        $customerUser = User::factory()->create(['role' => 'customer']);
        $customer = Customer::create([
            'name' => $customerUser->name,
            'email' => $customerUser->email,
            'phone' => '081234567890',
        ]);
        $customer->transactions()->create([
            'period_id' => $period->id,
            'amount' => 100000,
        ]);

        $this->actingAs($customerUser)
            ->get('/leaderboard')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page->where('myRank.ranking', 1));
    }
}
