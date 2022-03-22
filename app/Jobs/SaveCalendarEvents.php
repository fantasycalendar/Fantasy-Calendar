<?php

namespace App\Jobs;

use App\Models\Calendar;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Mews\Purifier\Facades\Purifier;

use App\Models\CalendarEvent;

class SaveCalendarEvents implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($events, $categoryids, $calendarId)
    {
        $this->events = ($events ?? []);
        $this->categoryids = $categoryids;
        $this->calendarId = $calendarId;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $eventids = [];
        foreach($this->events as $sort_by => $event) {
            $event['sort_by'] = $sort_by;

            $event['event_category_id'] = $this->resolveCategoryId($event['event_category_id']);

            $event['description'] = Purifier::clean($event['description']);

            if(array_key_exists('id', $event)) {
                $eventids[] = $event['id'];
                $event['data'] = json_encode($event['data']);
                $event['settings'] = json_encode($event['settings']);
                CalendarEvent::where('id', $event['id'])->update($event);
            } else {
                $event['creator_id'] = Auth::user()->id ?? auth()->user()->id ?? Calendar::find($this->calendarId)->user->id;
                $event['calendar_id'] = $this->calendarId;
                $event = CalendarEvent::Create($event);
                $eventids[] = $event->id;
            }
        }
        CalendarEvent::where('calendar_id', $this->calendarId)->whereNotIn('id', $eventids)->delete();

        return $eventids;
    }

    private function resolveCategoryId($value) {
        if(empty($value) || $value === "-1" || $value < 0) {
            return null;
        }

        if(!is_numeric($value)) {
            return Arr::get($this->categoryids, $value, null);
        }

        if(in_array($value, $this->categoryids)) {
            return $value;
        }

        return null;
    }
}
