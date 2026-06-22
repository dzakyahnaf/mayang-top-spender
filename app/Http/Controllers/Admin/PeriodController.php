<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePeriodRequest;
use App\Http\Requests\UpdatePeriodRequest;
use App\Models\Period;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PeriodController extends Controller
{
    public function index(): Response
    {
        $periods = Period::orderByDesc('created_at')->get();

        return Inertia::render('admin/periode/index', [
            'periods' => $periods,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/periode/create');
    }

    public function store(StorePeriodRequest $request): RedirectResponse
    {
        Period::create($request->validated());

        return redirect()->route('admin.periode.index')
            ->with('success', 'Periode berhasil dibuat.');
    }

    public function edit(Period $periode): Response
    {
        return Inertia::render('admin/periode/edit', [
            'period' => $periode,
        ]);
    }

    public function update(UpdatePeriodRequest $request, Period $periode): RedirectResponse
    {
        $periode->update($request->validated());

        return redirect()->route('admin.periode.index')
            ->with('success', 'Periode berhasil diperbarui.');
    }

    public function destroy(Period $periode): RedirectResponse
    {
        $periode->delete();

        return redirect()->route('admin.periode.index')
            ->with('success', 'Periode berhasil dihapus.');
    }

    public function activate(Period $periode): RedirectResponse
    {
        DB::transaction(function () use ($periode) {
            Period::where('deleted_at', null)->update(['is_active' => false]);
            $periode->update(['is_active' => true]);
        });

        return redirect()->route('admin.periode.index')
            ->with('success', "Periode \"{$periode->name}\" berhasil diaktifkan.");
    }
}
