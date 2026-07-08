<?php

namespace Tests\Feature\Admin;

use App\Models\Customer;
use App\Models\Period;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TransactionExportTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_export_transaction_detail_csv()
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
        Transaction::create([
            'customer_id' => $customer->id,
            'cashier_id' => $kasir->id,
            'period_id' => $period->id,
            'amount' => 150000,
        ]);

        $response = $this->actingAs($admin)->get(route('admin.transaksi.export'));

        $response->assertOk();
        $response->assertHeader('Content-Type', 'text/csv; charset=UTF-8');
        $content = $response->streamedContent();
        $this->assertStringContainsString('Siti Nurhaliza', $content);
        $this->assertStringContainsString('150000', $content);
    }

    public function test_admin_can_export_rekap_per_outlet_csv()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $kasirA = User::factory()->create(['role' => 'kasir', 'name' => 'Outlet A']);
        $kasirB = User::factory()->create(['role' => 'kasir', 'name' => 'Outlet B']);
        $period = Period::create([
            'name' => 'Periode Testing',
            'start_date' => now()->subDay(),
            'end_date' => now()->addMonth(),
            'is_active' => true,
        ]);
        $customer = Customer::create(['name' => 'Siti Nurhaliza', 'email' => 'siti@example.com', 'phone' => '081234567890']);
        Transaction::create(['customer_id' => $customer->id, 'cashier_id' => $kasirA->id, 'period_id' => $period->id, 'amount' => 100000]);
        Transaction::create(['customer_id' => $customer->id, 'cashier_id' => $kasirB->id, 'period_id' => $period->id, 'amount' => 300000]);

        $response = $this->actingAs($admin)->get(route('admin.transaksi.export-rekap'));

        $response->assertOk();
        $content = $response->streamedContent();
        $this->assertStringContainsString('Outlet A', $content);
        $this->assertStringContainsString('Outlet B', $content);
        $this->assertStringContainsString('100000', $content);
        $this->assertStringContainsString('300000', $content);
    }

    public function test_kasir_cannot_access_admin_export()
    {
        $kasir = User::factory()->create(['role' => 'kasir']);

        $response = $this->actingAs($kasir)->get(route('admin.transaksi.export'));

        $response->assertForbidden();
    }
}
