<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('calendars', function (Blueprint $table) {
            $table->index('user_id');
            $table->index('parent_id');
            $table->index('disabled');
            $table->index('advancement_enabled');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('calendars', function (Blueprint $table) {
            //
        });
    }
};
