<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

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
            'staff_id' => [
                'nullable',
                Rule::exists('cashier_staff', 'id')->where('user_id', $this->user()->id),
            ],
            'amount' => ['required', 'numeric', 'gt:0', 'max:100000000'],
            'notes' => ['nullable', 'string', 'max:500'],
            'receipt_photos' => ['nullable', 'array', 'max:3'],
            'receipt_photos.*' => ['image', 'mimes:jpeg,jpg,png,webp', 'max:8192'],
        ];
    }

    public function messages(): array
    {
        return [
            'customer_id.required' => 'Customer harus dipilih.',
            'customer_id.exists' => 'Customer tidak ditemukan.',
            'staff_id.exists' => 'Nama kasir tidak valid.',
            'amount.required' => 'Nominal belanja harus diisi.',
            'amount.gt' => 'Nominal belanja harus lebih dari Rp 0.',
            'amount.max' => 'Nominal belanja melebihi batas wajar.',
            'receipt_photos.max' => 'Maksimal 3 foto struk per transaksi.',
            'receipt_photos.*.image' => 'File harus berupa gambar.',
            'receipt_photos.*.max' => 'Ukuran tiap foto maksimal 8MB.',
        ];
    }
}
