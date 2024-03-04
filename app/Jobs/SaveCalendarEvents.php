<?php

namespace App\Jobs;

use App\Models\Calendar;

use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Mews\Purifier\Facades\Purifier;

use App\Models\CalendarEvent;

class SaveCalendarEvents
{
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(public $events = [], public $categoryids = [], public $calendarId = null)
    {
    }

    public static function dispatchSync($events, $categoryids, $calendarId)
    {
        return (new static($events, $categoryids, $calendarId))->handle();
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $eventids = [];
        foreach ($this->events as $sort_by => $event) {
            $event['sort_by'] = $sort_by;

            $event['event_category_id'] = $this->resolveCategoryId(Arr::get($event, 'event_category_id'));

            if (array_key_exists('id', $event)) {
                $eventids[] = $event['id'];

                $event['data'] = json_encode(Arr::get($event, 'data'));
                $event['settings'] = json_encode(Arr::get($event, 'settings'));

                CalendarEvent::where('id', $event['id'])->update($event);
            } else {
                $event['creator_id'] = Auth::user()->id ?? auth()->user()->id ?? Calendar::find($this->calendarId)->user->id;
                $event['calendar_id'] = $this->calendarId;

                $event = CalendarEvent::create($event);
                $eventids[] = $event->id;
            }
        }

        CalendarEvent::where('calendar_id', $this->calendarId)
            ->whereNotIn('id', $eventids)
            ->delete();

        return $eventids;
    }

    private function resolveCategoryId($value)
    {
        if (empty($value) || $value === "-1" || $value < 0) {
            return null;
        }

        if (!is_numeric($value)) {
            return Arr::get($this->categoryids, $value, null);
        }

        if (in_array($value, $this->categoryids)) {
            return $value;
        }

        return null;
    }
}
