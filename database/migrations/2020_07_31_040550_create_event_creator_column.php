<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEventCreatorColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('calendar_events', function (Blueprint $table) {
            $table->integer('creator_id')->default(0);
        });

        $events = DB::table('calendar_events')->whereNull('deleted_at')->get();

        foreach($events as $event) {
            $calendar = DB::table('calendars_beta')->where('id', $event->calendar_id)->get()->first();

            $id = ($calendar) ? $calendar->user_id : 0;

            DB::table('calendar_events')->where('id', $event->id)->update([
                'creator_id' => $id
            ]);
        }

//        Schema::table('calendar_events', function(Blueprint $table) {
//            $table->foreign('creator_id')->references('id')->on('users');
//        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('calendar_events', function(Blueprint $table){
            $table->dropColumn('creator_id');
        });
    }
}
