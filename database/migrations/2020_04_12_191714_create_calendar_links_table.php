<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCalendarLinksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('calendar_links', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('master_id');
            $table->bigInteger('child_id');
            $table->bigInteger('offset');
            $table->string('parent_start_date');
            $table->timestamps();
            $table->softDeletes();
        });

        $table-unique(['master_id', 'child_id']);

        $table-foreign('master_id')->references('id')->on('calendars_beta')->onDelete('cascade');
        $table-foreign('child_id')->references('id')->on('calendars_beta')->onDelete('cascade');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('calendar_links');
    }
}
