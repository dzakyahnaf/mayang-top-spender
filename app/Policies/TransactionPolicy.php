<?php

namespace App\Policies;

use App\Models\Transaction;
use App\Models\User;

class TransactionPolicy
{
    public function view(User $user, Transaction $transaction): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $user->isKasir() && $transaction->cashier_id === $user->id;
    }

    public function update(User $user, Transaction $transaction): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $user->isKasir()
            && $transaction->cashier_id === $user->id
            && $transaction->created_at->isToday();
    }

    public function delete(User $user, Transaction $transaction): bool
    {
        return $user->isAdmin();
    }
}
