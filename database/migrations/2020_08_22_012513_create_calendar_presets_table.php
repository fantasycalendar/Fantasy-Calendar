<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCalendarPresetsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('calendar_presets', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('source_calendar_id')->nullable();
            $table->string('name');
            $table->string('description');
            $table->longText('dynamic_data');
            $table->longText('static_data');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('calendar_presets');
    }
}
