<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTransactionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('transaction'));
    }

    public function rules(): array
    {
        return [
            'amount' => ['required', 'numeric', 'gt:0', 'max:100000000'],
            'notes' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'amount.required' => 'Nominal belanja harus diisi.',
            'amount.gt' => 'Nominal belanja harus lebih dari Rp 0.',
            'amount.max' => 'Nominal belanja melebihi batas wajar.',
        ];
    }
}
