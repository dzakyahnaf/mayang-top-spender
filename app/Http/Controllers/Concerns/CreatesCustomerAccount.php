<?php

namespace App\Http\Controllers\Concerns;

use App\Http\Requests\StoreCustomerRequest;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Support\Facades\DB;

trait CreatesCustomerAccount
{
    protected function createCustomerFromRequest(StoreCustomerRequest $request): Customer
    {
        return DB::transaction(function () use ($request): Customer {
            $customer = Customer::create([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'registered_by' => $request->user()->id,
            ]);

            if ($request->filled('password')) {
                $user = new User($request->only('name', 'email', 'phone', 'password'));
                $user->role = 'customer';
                $user->save();

                $customer->update(['user_id' => $user->id]);
            }

            return $customer;
        });
    }
}
