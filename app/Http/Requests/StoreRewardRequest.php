<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRewardRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'rank_start' => ['required', 'integer', 'min:1'],
            'rank_end' => ['required', 'integer', 'gte:rank_start'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:500'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'rank_start.required' => 'Peringkat awal harus diisi.',
            'rank_start.min' => 'Peringkat awal minimal 1.',
            'rank_end.required' => 'Peringkat akhir harus diisi.',
            'rank_end.gte' => 'Peringkat akhir harus lebih besar atau sama dengan peringkat awal.',
            'title.required' => 'Nama hadiah harus diisi.',
        ];
    }
}
