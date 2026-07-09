<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
}
