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
use Illuminate\Support\Str;
use Tests\TestCase;

class TransactionStoreTest extends TestCase
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

    public function test_kasir_can_upload_up_to_three_receipt_photos()
    {
        Storage::fake('local');

        $kasir = User::factory()->create(['role' => 'kasir']);
        $staff = CashierStaff::create(['user_id' => $kasir->id, 'name' => 'Rina']);
        $this->activePeriod();
        $customer = Customer::create(['name' => 'Siti Nurhaliza', 'email' => 'siti@example.com', 'phone' => '081234567890']);

        $response = $this->actingAs($kasir)->post(route('kasir.transaksi.store'), [
            'customer_id' => $customer->id,
            'staff_id' => $staff->id,
            'amount' => 150000,
            'idempotency_key' => Str::uuid()->toString(),
            'receipt_photos' => [
                UploadedFile::fake()->image('struk1.jpg', 2000, 2000)->size(4000),
                UploadedFile::fake()->image('struk2.jpg', 2000, 2000)->size(4000),
                UploadedFile::fake()->image('struk3.jpg', 2000, 2000)->size(4000),
            ],
        ]);

        $response->assertRedirect(route('kasir.transaksi.create'));

        $transaction = Transaction::firstOrFail();
        $this->assertSame($staff->id, $transaction->staff_id);
        $this->assertCount(3, $transaction->photos);

        foreach ($transaction->photos as $photo) {
            Storage::disk('local')->assertExists($photo->path);
            $this->assertStringEndsWith('.jpg', $photo->path);
        }
    }

    public function test_more_than_three_receipt_photos_is_rejected()
    {
        Storage::fake('local');

        $kasir = User::factory()->create(['role' => 'kasir']);
        $staff = CashierStaff::create(['user_id' => $kasir->id, 'name' => 'Rina']);
        $this->activePeriod();
        $customer = Customer::create(['name' => 'Siti Nurhaliza', 'email' => 'siti@example.com', 'phone' => '081234567890']);

        $response = $this->actingAs($kasir)->post(route('kasir.transaksi.store'), [
            'customer_id' => $customer->id,
            'staff_id' => $staff->id,
            'amount' => 150000,
            'idempotency_key' => Str::uuid()->toString(),
            'receipt_photos' => [
                UploadedFile::fake()->image('struk1.jpg'),
                UploadedFile::fake()->image('struk2.jpg'),
                UploadedFile::fake()->image('struk3.jpg'),
                UploadedFile::fake()->image('struk4.jpg'),
            ],
        ]);

        $response->assertSessionHasErrors('receipt_photos');
        $this->assertDatabaseCount('transactions', 0);
    }

    public function test_receipt_photo_is_downscaled_to_max_dimension()
    {
        Storage::fake('local');

        $kasir = User::factory()->create(['role' => 'kasir']);
        $staff = CashierStaff::create(['user_id' => $kasir->id, 'name' => 'Rina']);
        $this->activePeriod();
        $customer = Customer::create(['name' => 'Siti Nurhaliza', 'email' => 'siti@example.com', 'phone' => '081234567890']);

        $this->actingAs($kasir)->post(route('kasir.transaksi.store'), [
            'customer_id' => $customer->id,
            'staff_id' => $staff->id,
            'amount' => 150000,
            'idempotency_key' => Str::uuid()->toString(),
            'receipt_photos' => [
                UploadedFile::fake()->image('struk-besar.jpg', 3000, 2000),
            ],
        ]);

        $transaction = Transaction::firstOrFail();
        $path = $transaction->photos->first()->path;
        $fullPath = Storage::disk('local')->path($path);

        [$width, $height] = getimagesize($fullPath);

        $this->assertLessThanOrEqual(1600, $width);
        $this->assertLessThanOrEqual(1600, $height);
    }

    public function test_kasir_can_use_another_outlets_staff_id()
    {
        $kasir = User::factory()->create(['role' => 'kasir']);
        $otherKasir = User::factory()->create(['role' => 'kasir']);
        $otherStaff = CashierStaff::create(['user_id' => $otherKasir->id, 'name' => 'Budi']);
        $this->activePeriod();
        $customer = Customer::create(['name' => 'Siti Nurhaliza', 'email' => 'siti@example.com', 'phone' => '081234567890']);

        $response = $this->actingAs($kasir)->post(route('kasir.transaksi.store'), [
            'customer_id' => $customer->id,
            'staff_id' => $otherStaff->id,
            'amount' => 150000,
            'idempotency_key' => Str::uuid()->toString(),
        ]);

        $response->assertRedirect(route('kasir.transaksi.create'));

        $transaction = Transaction::firstOrFail();
        $this->assertSame($otherStaff->id, $transaction->staff_id);
    }

    public function test_resubmitting_with_the_same_idempotency_key_does_not_create_a_duplicate()
    {
        $kasir = User::factory()->create(['role' => 'kasir']);
        $staff = CashierStaff::create(['user_id' => $kasir->id, 'name' => 'Rina']);
        $this->activePeriod();
        $customer = Customer::create(['name' => 'Siti Nurhaliza', 'email' => 'siti@example.com', 'phone' => '081234567890']);

        $payload = [
            'customer_id' => $customer->id,
            'staff_id' => $staff->id,
            'amount' => 212000,
            'idempotency_key' => Str::uuid()->toString(),
        ];

        $first = $this->actingAs($kasir)->post(route('kasir.transaksi.store'), $payload);
        $first->assertRedirect(route('kasir.transaksi.create'));

        $second = $this->actingAs($kasir)->post(route('kasir.transaksi.store'), $payload);
        $second->assertRedirect(route('kasir.transaksi.create'));
        $second->assertSessionHasNoErrors();

        $this->assertDatabaseCount('transactions', 1);
    }

    public function test_two_genuinely_separate_transactions_with_the_same_data_are_both_saved()
    {
        $kasir = User::factory()->create(['role' => 'kasir']);
        $staff = CashierStaff::create(['user_id' => $kasir->id, 'name' => 'Rina']);
        $this->activePeriod();
        $customer = Customer::create(['name' => 'Siti Nurhaliza', 'email' => 'siti@example.com', 'phone' => '081234567890']);

        $basePayload = [
            'customer_id' => $customer->id,
            'staff_id' => $staff->id,
            'amount' => 212000,
        ];

        $first = $this->actingAs($kasir)->post(route('kasir.transaksi.store'), [
            ...$basePayload,
            'idempotency_key' => Str::uuid()->toString(),
        ]);
        $first->assertRedirect(route('kasir.transaksi.create'));

        $second = $this->actingAs($kasir)->post(route('kasir.transaksi.store'), [
            ...$basePayload,
            'idempotency_key' => Str::uuid()->toString(),
        ]);
        $second->assertRedirect(route('kasir.transaksi.create'));

        $this->assertDatabaseCount('transactions', 2);
    }

    public function test_nonexistent_staff_id_is_rejected()
    {
        $kasir = User::factory()->create(['role' => 'kasir']);
        $this->activePeriod();
        $customer = Customer::create(['name' => 'Siti Nurhaliza', 'email' => 'siti@example.com', 'phone' => '081234567890']);

        $response = $this->actingAs($kasir)->post(route('kasir.transaksi.store'), [
            'customer_id' => $customer->id,
            'staff_id' => 999999,
            'amount' => 150000,
            'idempotency_key' => Str::uuid()->toString(),
        ]);

        $response->assertSessionHasErrors('staff_id');
        $this->assertDatabaseCount('transactions', 0);
    }
}
