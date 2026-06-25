<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRewardRequest;
use App\Http\Requests\UpdateRewardRequest;
use App\Models\Reward;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class RewardController extends Controller
{
    public function index(): Response
    {
        $rewards = Reward::orderBy('sort_order')->orderBy('rank_start')->get();

        return Inertia::render('admin/hadiah/index', [
            'rewards' => $rewards,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/hadiah/create');
    }

    public function store(StoreRewardRequest $request): RedirectResponse
    {
        Reward::create($request->validated());

        return redirect()->route('admin.hadiah.index')
            ->with('success', 'Hadiah berhasil ditambahkan.');
    }

    public function edit(Reward $hadiah): Response
    {
        return Inertia::render('admin/hadiah/edit', [
            'reward' => $hadiah,
        ]);
    }

    public function update(UpdateRewardRequest $request, Reward $hadiah): RedirectResponse
    {
        $hadiah->update($request->validated());

        return redirect()->route('admin.hadiah.index')
            ->with('success', 'Hadiah berhasil diperbarui.');
    }

    public function destroy(Reward $hadiah): RedirectResponse
    {
        $hadiah->delete();

        return redirect()->route('admin.hadiah.index')
            ->with('success', 'Hadiah berhasil dihapus.');
    }
}
