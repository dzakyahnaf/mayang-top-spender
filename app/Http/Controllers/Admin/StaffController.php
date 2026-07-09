<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CashierStaff;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class StaffController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->get('q', ''));

        $staff = CashierStaff::query()
            ->with('user:id,name')
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('cashier_staff.name', 'LIKE', "%{$search}%")
                        ->orWhereHas('user', fn ($u) => $u->where('name', 'LIKE', "%{$search}%"));
                });
            })
            ->join('users', 'users.id', '=', 'cashier_staff.user_id')
            ->orderBy('users.name')
            ->orderBy('cashier_staff.name')
            ->select('cashier_staff.*')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('admin/staff/index', [
            'staff' => $staff,
            'cashiers' => User::where('role', 'kasir')->orderBy('name')->get(['id', 'name']),
            'filters' => ['q' => $search],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'user_id' => [
                'required',
                Rule::exists('users', 'id')->where('role', 'kasir'),
            ],
            'name' => ['required', 'string', 'max:255'],
        ], [
            'user_id.required' => 'Outlet harus dipilih.',
            'user_id.exists' => 'Outlet tidak valid.',
            'name.required' => 'Nama staff harus diisi.',
        ]);

        CashierStaff::create($validated);

        return redirect()->route('admin.staff.index')
            ->with('success', 'Staff berhasil ditambahkan.');
    }

    public function destroy(CashierStaff $staff): RedirectResponse
    {
        $staff->delete();

        return redirect()->route('admin.staff.index')
            ->with('success', 'Staff berhasil dihapus.');
    }
}
