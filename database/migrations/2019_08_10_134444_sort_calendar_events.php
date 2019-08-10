<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class SortCalendarEvents extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $calendars = DB::table('calendars_beta')->get();
        foreach($calendars as $calendar) {
            $sortby = 0;
            $events = DB::table('calendar_events')->where('calendar_id', $calendar->id)->whereNull('deleted_at')->get();
            foreach($events as $event) {
                DB::table('calendar_events')->where('id', $event->id)->update([
                    'sort_by' => $sortby
                ]);

                $sortby++;
            }
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
