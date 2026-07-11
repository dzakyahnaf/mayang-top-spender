<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'registered_by',
        'user_id',
    ];

    public function registrar(): BelongsTo
    {
        return $this->belongsTo(User::class, 'registered_by');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    /**
     * Adds a `total_spending` column: the customer's amount spent within the given period.
     * Used to display each customer's Coin balance (1 Coin = Rp 5).
     */
    public function scopeWithPeriodSpending(Builder $query, ?Period $period): Builder
    {
        return $query->when($period, function (Builder $query) use ($period) {
            $query->addSelect([
                'total_spending' => DB::table('transactions')
                    ->selectRaw('COALESCE(SUM(amount), 0)')
                    ->whereColumn('transactions.customer_id', 'customers.id')
                    ->where('period_id', $period->id),
            ]);
        });
    }
}
