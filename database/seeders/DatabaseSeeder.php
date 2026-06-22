<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Admin Mayang',
            'email' => 'admin@mayang.com',
            'password' => 'password',
            'role' => 'admin',
        ]);

        User::factory()->create([
            'name' => 'Kasir Demo',
            'email' => 'kasir@mayang.com',
            'password' => 'password',
            'role' => 'kasir',
        ]);
    }
}
