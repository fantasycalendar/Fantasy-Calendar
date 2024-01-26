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
        Schema::table('discord_auths', function (Blueprint $table) {
            $table->index('user_id');
            $table->index('discord_user_id');
            $table->index('discord_email');
        });

        Schema::table('discord_guilds', function (Blueprint $table) {
            $table->index('user_id');
            $table->index('discord_auth_id');
            $table->index('guild_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('discord_auths', function (Blueprint $table) {
            //
        });
    }
};
