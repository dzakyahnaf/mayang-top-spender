<?php

namespace Tests\Feature\Admin;

use App\Models\CashierStaff;
use App\Models\Customer;
use App\Models\Period;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class TransactionUpdateTest extends TestCase
{
    use RefreshDatabase;

    private function makePeriod(): Period
    {
        return Period::create([
            'name' => 'Periode Testing',
            'start_date' => now()->subMonth(),
            'end_date' => now()->addMonth(),
            'is_active' => true,
        ]);
    }

    public function test_admin_can_update_customer_staff_period_amount_and_notes()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $kasir = User::factory()->create(['role' => 'kasir']);
        $staff = CashierStaff::create(['user_id' => $kasir->id, 'name' => 'Rina']);
        $newStaff = CashierStaff::create(['user_id' => $kasir->id, 'name' => 'Budi']);
        $period = $this->makePeriod();
        $newPeriod = $this->makePeriod();
        $customer = Customer::create(['name' => 'Siti', 'email' => 'siti@example.com', 'phone' => '081111111111']);
        $newCustomer = Customer::create(['name' => 'Wati', 'email' => 'wati@example.com', 'phone' => '082222222222']);

        $transaction = Transaction::create([
            'customer_id' => $customer->id,
            'period_id' => $period->id,
            'cashier_id' => $kasir->id,
            'staff_id' => $staff->id,
            'amount' => 100000,
        ]);

        $response = $this->actingAs($admin)->put(route('admin.transaksi.update', $transaction), [
            'customer_id' => $newCustomer->id,
            'staff_id' => $newStaff->id,
            'period_id' => $newPeriod->id,
            'amount' => 250000,
            'notes' => 'Diperbarui admin',
        ]);

        $response->assertRedirect(route('admin.transaksi.index'));

        $transaction->refresh();
        $this->assertSame($newCustomer->id, $transaction->customer_id);
        $this->assertSame($newStaff->id, $transaction->staff_id);
        $this->assertSame($newPeriod->id, $transaction->period_id);
        $this->assertEquals(250000, $transaction->amount);
    }

    public function test_admin_can_delete_an_existing_photo_and_add_a_new_one_in_one_edit()
    {
        Storage::fake('local');

        $admin = User::factory()->create(['role' => 'admin']);
        $kasir = User::factory()->create(['role' => 'kasir']);
        $staff = CashierStaff::create(['user_id' => $kasir->id, 'name' => 'Rina']);
        $period = $this->makePeriod();
        $customer = Customer::create(['name' => 'Siti', 'email' => 'siti@example.com', 'phone' => '081111111111']);

        $transaction = Transaction::create([
            'customer_id' => $customer->id,
            'period_id' => $period->id,
            'cashier_id' => $kasir->id,
            'staff_id' => $staff->id,
            'amount' => 100000,
        ]);
        $oldPath = UploadedFile::fake()->image('struk-lama.jpg')->store('receipts', 'local');
        $oldPhoto = $transaction->photos()->create(['path' => $oldPath]);

        $response = $this->actingAs($admin)->put(route('admin.transaksi.update', $transaction), [
            'customer_id' => $customer->id,
            'staff_id' => $staff->id,
            'period_id' => $period->id,
            'amount' => 100000,
            'delete_photo_ids' => [$oldPhoto->id],
            'receipt_photos' => [UploadedFile::fake()->image('struk-baru.jpg')],
        ]);

        $response->assertRedirect(route('admin.transaksi.index'));

        $transaction->refresh();
        $this->assertCount(1, $transaction->photos);
        $this->assertNotSame($oldPhoto->id, $transaction->photos->first()->id);
        Storage::disk('local')->assertMissing($oldPath);
    }

    public function test_edit_page_shows_the_customers_total_spending_for_the_active_period()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $kasir = User::factory()->create(['role' => 'kasir']);
        $staff = CashierStaff::create(['user_id' => $kasir->id, 'name' => 'Rina']);
        $period = $this->makePeriod();
        $customer = Customer::create(['name' => 'Siti', 'email' => 'siti@example.com', 'phone' => '081111111111']);

        $transaction = Transaction::create([
            'customer_id' => $customer->id,
            'period_id' => $period->id,
            'cashier_id' => $kasir->id,
            'staff_id' => $staff->id,
            'amount' => 100000,
        ]);
        Transaction::create([
            'customer_id' => $customer->id,
            'period_id' => $period->id,
            'cashier_id' => $kasir->id,
            'staff_id' => $staff->id,
            'amount' => 50000,
        ]);

        $response = $this->actingAs($admin)->get(route('admin.transaksi.edit', $transaction));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->where('transaction.customer.total_spending', 150000)
        );
    }

    public function test_edit_page_lists_all_periods_for_reassignment()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $kasir = User::factory()->create(['role' => 'kasir']);
        $staff = CashierStaff::create(['user_id' => $kasir->id, 'name' => 'Rina']);
        $activePeriod = $this->makePeriod();
        Period::create([
            'name' => 'Periode Lama',
            'start_date' => now()->subYear(),
            'end_date' => now()->subMonths(11),
            'is_active' => false,
        ]);
        $customer = Customer::create(['name' => 'Siti', 'email' => 'siti@example.com', 'phone' => '081111111111']);

        $transaction = Transaction::create([
            'customer_id' => $customer->id,
            'period_id' => $activePeriod->id,
            'cashier_id' => $kasir->id,
            'staff_id' => $staff->id,
            'amount' => 100000,
        ]);

        $response = $this->actingAs($admin)->get(route('admin.transaksi.edit', $transaction));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('admin/transaksi/edit')
            ->has('periods', 2)
        );
    }
}
