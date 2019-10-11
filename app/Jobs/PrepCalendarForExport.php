<?php

namespace App\Jobs;

use App\Calendar;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Str;

class PrepCalendarForExport implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $calendar;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(Calendar $calendar)
    {
        $this->calendar = $calendar;
    }

    /**
     * Execute the job.
     *
     * @return App\Calendar
     */
    public function handle()
    {
        $categorymap = [];
        $calendarId = Str::slug($this->calendar->name);

        foreach($this->calendar->event_categories as $key => $category) {
            $categorymap[$category->id] = Str::slug($category->name);

            $category->id = Str::slug($category->name);
            $category->calendar_id = $calendarId;

            $this->calendar->event_categories[$key] = $category;
        }

        foreach($this->calendar->events as $key => $event) {
            if($event->event_category_id) {
                $event->event_category_id = $categorymap[$event->event_category_id];
            }

            $event->calendar_id = $calendarId;

            $this->calendar->events[$key] = $event;
        }

        return $this->calendar;
    }
}
