<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class SortEventCategories extends Migration
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
            $categories = DB::table('event_categories')->where('calendar_id', $calendar->id)->whereNull('deleted_at')->get();
            foreach($categories as $category) {
                DB::table('event_categories')->where('id', $category->id)->update([
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
