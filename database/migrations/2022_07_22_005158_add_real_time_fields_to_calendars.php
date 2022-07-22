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
        Schema::table('calendars', function (Blueprint $table) {
            $table->boolean('advancement_enabled')->default(false);
            $table->dateTime('advancement_next_due')->nullable();
            $table->time('advancement_time')->nullable();
            $table->string('advancement_timezone')->nullable();
            $table->float('advancement_scale')->default(1);
            $table->string('advancement_rate')->nullable();
            $table->string('advancement_rate_unit')->nullable();
            $table->string('advancement_webhook_url')->nullable();
            $table->string('advancement_webhook_format')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('calendars', function (Blueprint $table) {
            $table->dropColumn([
                'advancement_enabled',
                'advancement_next_due',
                'advancement_time',
                'advancement_timezone',
                'advancement_scale',
                'advancement_rate',
                'advancement_rate_unit',
                'advancement_webhook_url',
                'advancement_webhook_format',
            ]);
        });
    }
};
