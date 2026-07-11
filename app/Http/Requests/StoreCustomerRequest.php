<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules;

class StoreCustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $passwordRules = ['nullable', 'string', Rules\Password::defaults()];

        if ($this->filled('password')) {
            $passwordRules[] = 'confirmed';
        }

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:customers,email'],
            'phone' => ['required', 'string', 'max:20', 'unique:customers,phone'],
            'password' => $passwordRules,
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama lengkap harus diisi.',
            'email.required' => 'Email harus diisi.',
            'email.unique' => 'Email sudah terdaftar.',
            'phone.required' => 'Nomor HP harus diisi.',
            'phone.unique' => 'Nomor HP sudah terdaftar.',
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $accountExists = User::where('email', $this->email)
                ->orWhere('phone', $this->phone)
                ->exists();

            if ($accountExists) {
                $message = 'Email/No HP ini sudah terdaftar sebagai akun. Minta customer untuk login sendiri.';
                $validator->errors()->add('email', $message);
                $validator->errors()->add('phone', $message);
            }
        });
    }
}
