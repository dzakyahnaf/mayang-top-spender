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
            'customer_id' => ['required', 'exists:customers,id'],
            'staff_id' => ['required', 'exists:cashier_staff,id'],
            'period_id' => ['required', 'exists:periods,id'],
            'amount' => ['required', 'numeric', 'gt:0', 'max:100000000'],
            'notes' => ['nullable', 'string', 'max:500'],
            'receipt_photos' => ['nullable', 'array'],
            'receipt_photos.*' => ['image', 'mimes:jpeg,jpg,png,webp', 'max:8192'],
            'delete_photo_ids' => ['nullable', 'array'],
            'delete_photo_ids.*' => ['integer'],
        ];
    }

    public function messages(): array
    {
        return [
            'customer_id.required' => 'Customer harus dipilih.',
            'customer_id.exists' => 'Customer tidak ditemukan.',
            'staff_id.required' => 'Nama kasir harus dipilih.',
            'staff_id.exists' => 'Nama kasir tidak valid.',
            'period_id.required' => 'Periode harus dipilih.',
            'period_id.exists' => 'Periode tidak ditemukan.',
            'amount.required' => 'Nominal belanja harus diisi.',
            'amount.gt' => 'Nominal belanja harus lebih dari Rp 0.',
            'amount.max' => 'Nominal belanja melebihi batas wajar.',
            'receipt_photos.*.image' => 'File harus berupa gambar.',
            'receipt_photos.*.max' => 'Ukuran tiap foto maksimal 8MB.',
        ];
    }
}
