<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class TransactionPhoto extends Model
{
    protected $fillable = [
        'transaction_id',
        'path',
    ];

    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }

    protected static function booted(): void
    {
        static::deleting(function (TransactionPhoto $photo): void {
            Storage::disk('local')->delete($photo->path);
        });
    }
}
