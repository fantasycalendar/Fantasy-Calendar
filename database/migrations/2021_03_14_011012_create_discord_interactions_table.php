<?php

use App\Calendar;
use App\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDiscordInteractionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('discord_interactions', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('snowflake');
            $table->string('discord_id')->nullable();
            $table->foreignIdFor(User::class)->nullable();
            $table->foreignIdFor(Calendar::class)->nullable();
            $table->string('type');
            $table->json('data');
            $table->string('guild_id')->nullable();
            $table->string('channel_id')->nullable();
            $table->json('discord_user');
            $table->json('payload');
            $table->integer('version');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('discord_interactions');
    }
}
