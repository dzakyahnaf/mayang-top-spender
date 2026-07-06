<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CashierStaff;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CashierStaffController extends Controller
{
    public function index(User $kasir): Response
    {
        abort_unless($kasir->isKasir(), 404);

        return Inertia::render('admin/kasir/staff', [
            'cashier' => $kasir,
            'staff' => $kasir->staff()->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request, User $kasir): RedirectResponse
    {
        abort_unless($kasir->isKasir(), 404);

        $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ], [
            'name.required' => 'Nama staff harus diisi.',
        ]);

        $kasir->staff()->create([
            'name' => $request->name,
        ]);

        return redirect()->route('admin.kasir.staff.index', $kasir)
            ->with('success', 'Staff berhasil ditambahkan.');
    }

    public function destroy(User $kasir, CashierStaff $staff): RedirectResponse
    {
        abort_unless($kasir->isKasir(), 404);
        abort_unless($staff->user_id === $kasir->id, 404);

        $staff->delete();

        return redirect()->route('admin.kasir.staff.index', $kasir)
            ->with('success', 'Staff berhasil dihapus.');
    }
}
