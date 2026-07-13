<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'period_id',
        'cashier_id',
        'staff_id',
        'idempotency_key',
        'amount',
        'notes',
        'receipt_photo',
        'original_amount',
        'edited_by',
        'edited_at',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'original_amount' => 'decimal:2',
            'edited_at' => 'datetime',
        ];
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function period(): BelongsTo
    {
        return $this->belongsTo(Period::class);
    }

    public function cashier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'cashier_id');
    }

    public function editor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'edited_by');
    }

    public function photos(): HasMany
    {
        return $this->hasMany(TransactionPhoto::class);
    }

    public function staff(): BelongsTo
    {
        return $this->belongsTo(CashierStaff::class, 'staff_id');
    }

    public function scopeWithRunningCoinTotal(Builder $query): Builder
    {
        return $query->addSelect([
            'running_coin_total' => DB::table('transactions as t2')
                ->selectRaw('COALESCE(SUM(t2.amount), 0)')
                ->whereColumn('t2.customer_id', 'transactions.customer_id')
                ->whereColumn('t2.period_id', 'transactions.period_id')
                ->where(function (QueryBuilder $q) {
                    $q->whereColumn('t2.created_at', '<', 'transactions.created_at')
                        ->orWhere(function (QueryBuilder $q2) {
                            $q2->whereColumn('t2.created_at', '=', 'transactions.created_at')
                                ->whereColumn('t2.id', '<=', 'transactions.id');
                        });
                }),
        ]);
    }

    protected static function booted(): void
    {
        static::deleting(function (Transaction $transaction): void {
            $transaction->photos->each->delete();

            if ($transaction->receipt_photo) {
                Storage::disk('local')->delete($transaction->receipt_photo);
            }
        });
    }
}
