<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('kasir')->after('password');
        });

        DB::statement("ALTER TABLE users ADD CONSTRAINT chk_user_role CHECK (role IN ('admin', 'kasir'))");
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE users DROP CONSTRAINT IF EXISTS chk_user_role');

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('role');
        });
    }
};
