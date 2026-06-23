<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@mayang.com'],
            [
                'name' => 'Admin Mayang',
                'password' => 'password',
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        User::updateOrCreate(
            ['email' => 'kasir@mayang.com'],
            [
                'name' => 'Kasir Demo',
                'password' => 'password',
                'role' => 'kasir',
                'email_verified_at' => now(),
            ]
        );
    }
}
