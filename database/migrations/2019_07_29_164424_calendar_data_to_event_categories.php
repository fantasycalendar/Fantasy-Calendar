<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

use App\Calendar;
use App\EventCategory;

class CalendarDataToEventCategories extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $calendars = Calendar::all();
        foreach ($calendars as $calendar) {
            $static_data = json_decode($calendar->getOriginal('static_data'), true);
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

            $calendar->update([
                'static_data' => $static_data
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
        $categories = EventCategory::all();
        foreach ($categories as $category) {
            $calendar = Calendar::find($category->calendar_id);

            $category_calendar_restore_data = [
                'name' => $category->name,
                'category_settings' => $category->category_settings,
                'event_settings' => $category->event_settings
            ];

            $static_data = $category->calendar->static_data;
            $static_data['event_data']['categories'][] = $category_calendar_restore_data;

            $calendar->update([
                'static_data' => $static_data
            ]);
        }
    }
}
