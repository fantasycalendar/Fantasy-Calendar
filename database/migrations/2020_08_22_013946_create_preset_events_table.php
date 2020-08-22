<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePresetEventsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('preset_events', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name');
            $table->longText('data');
            $table->longText('description');
            $table->bigInteger('preset_event_category_id')->nullable();
            $table->string('event_category_id');
            $table->bigInteger('preset_id');
            $table->longText('settings');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('preset_events');
    }
}
