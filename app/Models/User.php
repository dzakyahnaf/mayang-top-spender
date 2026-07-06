<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isKasir(): bool
    {
        return $this->role === 'kasir';
    }

    public function isCustomer(): bool
    {
        return $this->role === 'customer';
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class, 'cashier_id');
    }

    public function registeredCustomers(): HasMany
    {
        return $this->hasMany(Customer::class, 'registered_by');
    }

    public function staff(): HasMany
    {
        return $this->hasMany(CashierStaff::class);
    }
}
