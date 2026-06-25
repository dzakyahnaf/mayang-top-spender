<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rewards', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('rank_start');
            $table->unsignedInteger('rank_end');
            $table->string('title');
            $table->text('description')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        if (DB::getDriverName() === 'mysql') {
            DB::statement('ALTER TABLE rewards ADD CONSTRAINT chk_reward_rank_range CHECK (rank_end >= rank_start)');
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('rewards');
    }
};
