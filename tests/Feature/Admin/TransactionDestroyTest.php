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
use Tests\TestCase;

class TransactionDestroyTest extends TestCase
{
    use RefreshDatabase;

    public function test_deleting_a_transaction_also_deletes_its_receipt_photo_files()
    {
        Storage::fake('local');

        $admin = User::factory()->create(['role' => 'admin']);
        $kasir = User::factory()->create(['role' => 'kasir']);
        $staff = CashierStaff::create(['user_id' => $kasir->id, 'name' => 'Rina']);
        Period::create([
            'name' => 'Periode Testing',
            'start_date' => now()->subDay(),
            'end_date' => now()->addMonth(),
            'is_active' => true,
        ]);
        $customer = Customer::create(['name' => 'Siti Nurhaliza', 'email' => 'siti@example.com', 'phone' => '081234567890']);

        $this->actingAs($kasir)->post(route('kasir.transaksi.store'), [
            'customer_id' => $customer->id,
            'staff_id' => $staff->id,
            'amount' => 150000,
            'idempotency_key' => Str::uuid()->toString(),
            'receipt_photos' => [UploadedFile::fake()->image('struk.jpg')],
        ]);

        $transaction = Transaction::firstOrFail();
        $photoPath = $transaction->photos->first()->path;
        Storage::disk('local')->assertExists($photoPath);

        $this->actingAs($admin)->delete(route('admin.transaksi.destroy', $transaction));

        Storage::disk('local')->assertMissing($photoPath);
        $this->assertDatabaseCount('transaction_photos', 0);
        $this->assertDatabaseCount('transactions', 0);
    }
}
