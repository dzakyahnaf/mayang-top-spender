<?php

namespace App\Http\Controllers\Concerns;

use App\Models\CashierStaff;
use App\Models\Customer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

trait SearchesCustomersAndStaff
{
    public function searchCustomers(Request $request): JsonResponse
    {
        $keyword = $request->get('q', '');

        if (strlen($keyword) < 2) {
            return response()->json([]);
        }

        $customers = Customer::query()
            ->where('name', 'LIKE', "%{$keyword}%")
            ->orWhere('phone', 'LIKE', "%{$keyword}%")
            ->orWhere('email', 'LIKE', "%{$keyword}%")
            ->limit(10)
            ->get(['id', 'name', 'email', 'phone']);

        return response()->json($customers);
    }

    public function searchStaff(Request $request): JsonResponse
    {
        $keyword = $request->get('q', '');

        if (strlen($keyword) < 2) {
            return response()->json([]);
        }

        $staff = CashierStaff::query()
            ->where('name', 'LIKE', "%{$keyword}%")
            ->limit(10)
            ->get(['id', 'name']);

        return response()->json($staff);
    }
}
