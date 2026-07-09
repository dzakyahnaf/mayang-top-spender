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
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class TransactionShowTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_view_transaction_detail()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $kasir = User::factory()->create(['role' => 'kasir']);
        $period = Period::create([
            'name' => 'Periode Testing',
            'start_date' => now()->subDay(),
            'end_date' => now()->addMonth(),
            'is_active' => true,
        ]);
        $customer = Customer::create(['name' => 'Siti Nurhaliza', 'email' => 'siti@example.com', 'phone' => '081234567890']);
        $transaction = Transaction::create([
            'customer_id' => $customer->id,
            'cashier_id' => $kasir->id,
            'period_id' => $period->id,
            'amount' => 150000,
        ]);

        $response = $this->actingAs($admin)->get(route('admin.transaksi.show', $transaction));

        $response->assertInertia(fn (Assert $page) => $page
            ->component('admin/transaksi/show')
            ->where('transaction.id', $transaction->id)
            ->where('transaction.customer.name', 'Siti Nurhaliza')
        );
    }

    public function test_admin_can_view_receipt_photo_from_any_cashier()
    {
        Storage::fake('local');

        $admin = User::factory()->create(['role' => 'admin']);
        $kasir = User::factory()->create(['role' => 'kasir']);
        $period = Period::create([
            'name' => 'Periode Testing',
            'start_date' => now()->subDay(),
            'end_date' => now()->addMonth(),
            'is_active' => true,
        ]);
        $customer = Customer::create(['name' => 'Siti Nurhaliza', 'email' => 'siti@example.com', 'phone' => '081234567890']);

        $this->actingAs($kasir)->post(route('kasir.transaksi.store'), [
            'customer_id' => $customer->id,
            'staff_id' => CashierStaff::create(['user_id' => $kasir->id, 'name' => 'Rina'])->id,
            'amount' => 150000,
            'idempotency_key' => Str::uuid()->toString(),
            'receipt_photos' => [UploadedFile::fake()->image('struk.jpg')],
        ]);

        $transaction = Transaction::firstOrFail();
        $photo = $transaction->photos->first();

        $response = $this->actingAs($admin)->get(route('admin.transaksi.receipt-photo', [$transaction, $photo]));

        $response->assertOk();
    }
}
