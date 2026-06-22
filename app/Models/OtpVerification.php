<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OtpVerification extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'phone',
        'otp_code',
        'purpose',
        'is_used',
        'expires_at',
    ];

    protected function casts(): array
    {
        return [
            'is_used' => 'boolean',
            'expires_at' => 'datetime',
            'created_at' => 'datetime',
        ];
    }
}
