<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('otp_verifications', function (Blueprint $table) {
            $table->id();
            $table->string('phone');
            $table->string('otp_code');
            $table->string('purpose')->default('my_spending');
            $table->boolean('is_used')->default(false);
            $table->timestamp('expires_at');
            $table->timestamp('created_at')->useCurrent();
        });

        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE otp_verifications ADD CONSTRAINT chk_otp_purpose CHECK (purpose IN ('my_spending'))");
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('otp_verifications');
    }
};
