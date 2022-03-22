<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

use App\Models\EventCategory;

class CalendarDataToEventCategories extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $calendars = DB::table('calendars_beta')->get();
        foreach ($calendars as $calendar) {
            $static_data = json_decode($calendar->static_data, true);
            if(!array_key_exists('event_data', $static_data)) continue;
            if(!array_key_exists('categories', $static_data['event_data'])) continue;

            $categories = $static_data['event_data']['categories'];
            foreach ($categories as $category) {
                EventCategory::create([
                    'name' => $category['name'],
                    'category_settings' => $category['category_settings'],
                    'event_settings' => $category['event_settings'],
                    'calendar_id' => $calendar->id
                ]);
            }

            unset($static_data['event_data']['categories']);

            DB::table('calendars_beta')->where('id', $calendar->id)->update([
                'static_data' => json_encode($static_data)
            ]);
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        $categories = DB::table('event_categories')->get();
        foreach ($categories as $category) {
            $calendar = DB::table('calendars_beta')->find($category->calendar_id);

            $category_calendar_restore_data = [
                'name' => $category->name,
                'category_settings' => json_decode($category->category_settings, true),
                'event_settings' => json_decode($category->event_settings, true)
            ];

            $static_data = json_decode($calendar->static_data, true);
            $static_data['event_data']['categories'][] = $category_calendar_restore_data;

            DB::table('calendars_beta')->where('id', $calendar->id)->update([
                'static_data' => json_encode($static_data)
            ]);
        }
    }
}
