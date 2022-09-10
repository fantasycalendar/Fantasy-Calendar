<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

use App\Models\Calendar;

class CalendarsTableSoftDeletes extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('calendars_beta', function(Blueprint $table) {
            $table->softDeletes();
        });

        $calendars = Calendar::where('deleted', 1)->get();
        foreach($calendars as $calendar) {
            $calendar->deleted_at = date('Y-m-d H:i:s');
            $calendar->save();
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('calendars_beta', function(Blueprint $table) {
            $table->dropSoftDeletes();
        });
    }
}
