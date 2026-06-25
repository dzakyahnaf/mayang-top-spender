<?php

use App\Http\Controllers\Admin\CashierController;
use App\Http\Controllers\Admin\CustomerController as AdminCustomerController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\PeriodController;
use App\Http\Controllers\Admin\RewardController as AdminRewardController;
use App\Http\Controllers\Admin\TransactionController as AdminTransactionController;
use App\Http\Controllers\Kasir\CustomerController as KasirCustomerController;
use App\Http\Controllers\Kasir\TransactionController as KasirTransactionController;
use App\Http\Controllers\LeaderboardController;
use App\Http\Controllers\MySpendingController;
use App\Http\Controllers\RewardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public pages
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/leaderboard', [LeaderboardController::class, 'index'])->name('leaderboard');

Route::get('/daftar-hadiah', [RewardController::class, 'index'])->name('daftar-hadiah');

Route::get('/faq', fn () => Inertia::render('faq'))->name('faq');

Route::get('/syarat', fn () => Inertia::render('syarat'))->name('syarat');

Route::get('/my-spending', [MySpendingController::class, 'index'])->name('my-spending')->middleware('auth');

// Auth redirect after login
Route::middleware(['auth'])->get('/dashboard', function () {
    $user = auth()->user();

    if ($user->isAdmin()) {
        return redirect()->route('admin.dashboard');
    }

    if ($user->isKasir()) {
        return redirect()->route('kasir.transaksi.create');
    }

    return redirect()->route('my-spending');
})->name('dashboard');

// Admin routes
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('periode', PeriodController::class)->except(['show']);
    Route::put('/periode/{periode}/activate', [PeriodController::class, 'activate'])->name('periode.activate');

    Route::resource('kasir', CashierController::class)->except(['show']);
    Route::put('/kasir/{kasir}/reset-password', [CashierController::class, 'resetPassword'])->name('kasir.reset-password');

    Route::get('/transaksi', [AdminTransactionController::class, 'index'])->name('transaksi.index');
    Route::get('/transaksi/{transaction}/edit', [AdminTransactionController::class, 'edit'])->name('transaksi.edit');
    Route::put('/transaksi/{transaction}', [AdminTransactionController::class, 'update'])->name('transaksi.update');
    Route::delete('/transaksi/{transaction}', [AdminTransactionController::class, 'destroy'])->name('transaksi.destroy');

    Route::resource('hadiah', AdminRewardController::class)->except(['show']);

    Route::get('/customer', [AdminCustomerController::class, 'index'])->name('customer.index');
});

// Kasir routes
Route::middleware(['auth', 'role:kasir'])->prefix('kasir')->name('kasir.')->group(function () {
    Route::get('/transaksi', [KasirTransactionController::class, 'create'])->name('transaksi.create');
    Route::post('/transaksi', [KasirTransactionController::class, 'store'])->name('transaksi.store');
    Route::get('/transaksi/history', [KasirTransactionController::class, 'history'])->name('transaksi.history');
    Route::get('/transaksi/{transaction}/edit', [KasirTransactionController::class, 'edit'])->name('transaksi.edit');
    Route::put('/transaksi/{transaction}', [KasirTransactionController::class, 'update'])->name('transaksi.update');

    Route::get('/customer/create', [KasirCustomerController::class, 'create'])->name('customer.create');
    Route::post('/customer', [KasirCustomerController::class, 'store'])->name('customer.store');

    Route::get('/api/customers/search', [KasirTransactionController::class, 'searchCustomers'])->name('api.customers.search');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
