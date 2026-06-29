<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedUser('admin@mayang.com', 'Admin Mayang', 'admin', 'SEED_ADMIN_PASSWORD');
        $this->seedUser('kasir@mayang.com', 'Kasir Demo', 'kasir', 'SEED_KASIR_PASSWORD');

        $this->call(RewardSeeder::class);
    }

    /**
     * Create a staff account only if it does not already exist, so re-running the
     * seeder on deploy never resets a password that has since been rotated. The
     * initial password is taken from an env var, or a strong random one is
     * generated and printed once — never a hardcoded weak default.
     */
    private function seedUser(string $email, string $name, string $role, string $envKey): void
    {
        if (User::where('email', $email)->exists()) {
            return;
        }

        $password = env($envKey) ?: Str::password(16);

        // role & email_verified_at are not mass-assignable on the User model, so
        // they are set explicitly to guarantee the staff role is applied.
        $user = new User([
            'name' => $name,
            'email' => $email,
            'password' => $password,
        ]);
        $user->role = $role;
        $user->email_verified_at = now();
        $user->save();

        $this->command?->warn("Seeded {$role} [{$email}] — initial password: {$password}");
        $this->command?->warn('Simpan password ini sekarang & segera ganti setelah login pertama.');
    }
}
