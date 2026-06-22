<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCashierRequest;
use App\Http\Requests\UpdateCashierRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class CashierController extends Controller
{
    public function index(): Response
    {
        $cashiers = User::where('role', 'kasir')->orderByDesc('created_at')->get();

        return Inertia::render('admin/kasir/index', [
            'cashiers' => $cashiers,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/kasir/create');
    }

    public function store(StoreCashierRequest $request): RedirectResponse
    {
        User::create([
            ...$request->validated(),
            'role' => 'kasir',
        ]);

        return redirect()->route('admin.kasir.index')
            ->with('success', 'Akun kasir berhasil dibuat.');
    }

    public function edit(User $kasir): Response
    {
        return Inertia::render('admin/kasir/edit', [
            'cashier' => $kasir,
        ]);
    }

    public function update(UpdateCashierRequest $request, User $kasir): RedirectResponse
    {
        $data = $request->safe()->except('password');

        if ($request->filled('password')) {
            $data['password'] = $request->password;
        }

        $kasir->update($data);

        return redirect()->route('admin.kasir.index')
            ->with('success', 'Akun kasir berhasil diperbarui.');
    }

    public function destroy(User $kasir): RedirectResponse
    {
        $kasir->delete();

        return redirect()->route('admin.kasir.index')
            ->with('success', 'Akun kasir berhasil dihapus.');
    }

    public function resetPassword(Request $request, User $kasir): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'string', 'min:8'],
        ]);

        $kasir->update([
            'password' => $request->password,
        ]);

        return redirect()->route('admin.kasir.index')
            ->with('success', "Password kasir \"{$kasir->name}\" berhasil direset.");
    }
}
