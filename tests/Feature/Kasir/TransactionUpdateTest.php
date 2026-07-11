<?php

namespace Tests\Feature\Kasir;

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

    public function test_kasir_can_update_customer_staff_period_amount_and_notes()
    {
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

        $response = $this->actingAs($kasir)->put(route('kasir.transaksi.update', $transaction), [
            'customer_id' => $newCustomer->id,
            'staff_id' => $newStaff->id,
            'period_id' => $newPeriod->id,
            'amount' => 250000,
            'notes' => 'Diperbarui',
        ]);

        $response->assertRedirect(route('kasir.transaksi.history'));

        $transaction->refresh();
        $this->assertSame($newCustomer->id, $transaction->customer_id);
        $this->assertSame($newStaff->id, $transaction->staff_id);
        $this->assertSame($newPeriod->id, $transaction->period_id);
        $this->assertEquals(250000, $transaction->amount);
        $this->assertSame('Diperbarui', $transaction->notes);
        $this->assertEquals(100000, $transaction->original_amount);
    }

    public function test_edit_page_shows_the_customers_total_spending_for_the_active_period()
    {
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

        $this->actingAs($kasir)
            ->get(route('kasir.transaksi.edit', $transaction))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('transaction.customer.total_spending', 150000)
            );
    }

    public function test_kasir_can_edit_a_transaction_from_a_previous_day()
    {
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
            'created_at' => now()->subDays(3),
        ]);

        $editResponse = $this->actingAs($kasir)->get(route('kasir.transaksi.edit', $transaction));
        $editResponse->assertOk();

        $response = $this->actingAs($kasir)->put(route('kasir.transaksi.update', $transaction), [
            'customer_id' => $customer->id,
            'staff_id' => $staff->id,
            'period_id' => $period->id,
            'amount' => 120000,
            'notes' => null,
        ]);

        $response->assertRedirect(route('kasir.transaksi.history'));
        $this->assertEquals(120000, $transaction->fresh()->amount);
    }

    public function test_kasir_cannot_update_another_kasirs_transaction()
    {
        $owner = User::factory()->create(['role' => 'kasir']);
        $otherKasir = User::factory()->create(['role' => 'kasir']);
        $staff = CashierStaff::create(['user_id' => $owner->id, 'name' => 'Rina']);
        $period = $this->makePeriod();
        $customer = Customer::create(['name' => 'Siti', 'email' => 'siti@example.com', 'phone' => '081111111111']);

        $transaction = Transaction::create([
            'customer_id' => $customer->id,
            'period_id' => $period->id,
            'cashier_id' => $owner->id,
            'staff_id' => $staff->id,
            'amount' => 100000,
        ]);

        $response = $this->actingAs($otherKasir)->put(route('kasir.transaksi.update', $transaction), [
            'customer_id' => $customer->id,
            'staff_id' => $staff->id,
            'period_id' => $period->id,
            'amount' => 999999,
        ]);

        $response->assertForbidden();
        $this->assertEquals(100000, $transaction->fresh()->amount);
    }

    public function test_kasir_can_add_a_missing_receipt_photo_when_editing()
    {
        Storage::fake('local');

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

        $response = $this->actingAs($kasir)->put(route('kasir.transaksi.update', $transaction), [
            'customer_id' => $customer->id,
            'staff_id' => $staff->id,
            'period_id' => $period->id,
            'amount' => 100000,
            'receipt_photos' => [UploadedFile::fake()->image('struk.jpg')],
        ]);

        $response->assertRedirect(route('kasir.transaksi.history'));
        $this->assertCount(1, $transaction->fresh()->photos);
    }

    public function test_kasir_can_delete_an_existing_photo_and_the_file_is_removed()
    {
        Storage::fake('local');

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
        $path = UploadedFile::fake()->image('struk.jpg')->store('receipts', 'local');
        $photo = $transaction->photos()->create(['path' => $path]);

        Storage::disk('local')->assertExists($path);

        $response = $this->actingAs($kasir)->put(route('kasir.transaksi.update', $transaction), [
            'customer_id' => $customer->id,
            'staff_id' => $staff->id,
            'period_id' => $period->id,
            'amount' => 100000,
            'delete_photo_ids' => [$photo->id],
        ]);

        $response->assertRedirect(route('kasir.transaksi.history'));
        $this->assertCount(0, $transaction->fresh()->photos);
        Storage::disk('local')->assertMissing($path);
    }

    public function test_editing_is_rejected_when_total_photos_would_exceed_three()
    {
        Storage::fake('local');

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

        foreach (range(1, 3) as $i) {
            $transaction->photos()->create([
                'path' => UploadedFile::fake()->image("struk{$i}.jpg")->store('receipts', 'local'),
            ]);
        }

        $response = $this->actingAs($kasir)->put(route('kasir.transaksi.update', $transaction), [
            'customer_id' => $customer->id,
            'staff_id' => $staff->id,
            'period_id' => $period->id,
            'amount' => 100000,
            'receipt_photos' => [UploadedFile::fake()->image('struk-baru.jpg')],
        ]);

        $response->assertSessionHasErrors('receipt_photos');
        $this->assertCount(3, $transaction->fresh()->photos);
    }
}
