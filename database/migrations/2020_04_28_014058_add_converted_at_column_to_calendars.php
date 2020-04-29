<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddConvertedAtColumnToCalendars extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('calendars_beta', function (Blueprint $table) {
            $table->date('converted_at')->nullable();
            $table->integer('conversion_batch')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('calendars_beta', function (Blueprint $table) {
            $table->dropColumn('converted_at');
            $table->dropColumn('conversion_batch');
        });
    }
}
