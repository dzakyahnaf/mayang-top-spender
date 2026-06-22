<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTransactionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'customer_id' => ['required', 'exists:customers,id'],
            'amount' => ['required', 'numeric', 'gt:0'],
            'notes' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'customer_id.required' => 'Customer harus dipilih.',
            'customer_id.exists' => 'Customer tidak ditemukan.',
            'amount.required' => 'Nominal belanja harus diisi.',
            'amount.gt' => 'Nominal belanja harus lebih dari Rp 0.',
        ];
    }
}
