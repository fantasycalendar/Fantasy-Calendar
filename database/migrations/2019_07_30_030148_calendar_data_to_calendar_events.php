<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

use App\Calendar;
use App\CalendarEvent;

class CalendarDataToCalendarEvents extends Migration
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
            if(!array_key_exists('events', $static_data['event_data'])) continue;
    
            $categories = DB::table('event_categories')->where('calendar_id', $calendar->id)->get();
            
            $events = $static_data['event_data']['events'];
            foreach ($events as $event) {
                $categoryId = NULL;

                if($event['category'] > 0 && $event['category'] < count($categories)) {
                    $categoryId = $categories[$event['category']]->id;
                }
    
                CalendarEvent::create([
                    'name' => $event['name'],
                    'description' => $event['description'],
                    'data' => $event['data'],
                    'settings' => $event['settings'],
                    'event_category_id' => $categoryId,
                    'calendar_id' => $calendar->id,
                ]);
            }

            unset($static_data['event_data']['events']);

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
        $events = DB::table('calendar_events')->get();
        foreach ($events as $event) {
            $calendar = DB::table('calendars_beta')->find($event->calendar_id);

            $categoryId = -1;
            $count = 0;

            $categories = DB::table('event_categories')->where('calendar_id', $calendar->id)->get();
            foreach($categories as $category) {
                if($category->id = $event->category_id) {
                    $categoryId = $count;
                    continue;
                }
                $count++;
            }

            $event_calendar_restore_data = [
                'name' => $event->name,
                'description' => $event->description,
                'settings' => json_decode($event->settings, true),
                'data'  =>   json_decode($event->data, true),
                'category' => $categoryId,
            ];

            $static_data = json_decode($calendar->static_data, true);
            $static_data['event_data']['events'][] = $event_calendar_restore_data;

            DB::table('calendars_beta')->where('id', $calendar->id)->update([
                'static_data' => json_encode($static_data)
            ]);
        }
    }
}
