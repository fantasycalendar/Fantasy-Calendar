<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('discord_webhooks', function (Blueprint $table) {
            $table->id();

            $table->string("name");
            $table->string("access_token");
            $table->string("webhook_id");
            $table->string("webhook_token");
            $table->string("refresh_token");
            $table->string("expires_in");
            $table->boolean('active')->default(0);

            $table->boolean('error')->default(false);
            $table->string('error_message')->nullable();

            $table->foreignIdFor(\App\Models\Calendar::class);
            $table->foreignIdFor(\App\Models\User::class);
            $table->foreignIdFor(\App\Services\Discord\Models\DiscordAuthToken::class);
            $table->foreignIdFor(\App\Services\Discord\Models\DiscordGuild::class);

            $table->boolean('persistent_message')->default(false);
            $table->string('persistent_message_id')->nullable();

            $table->string("channel_id");
            $table->integer("type");
            $table->string("avatar")->nullable();

            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('discord_webhooks');
    }
};
