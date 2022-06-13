<?php

namespace App\Models\Concerns;

use App\Models\CalendarEvent;
use Mews\Purifier\Facades\Purifier;

trait HasCalendarEvents
{
    public function oneTimeEvent($title, $description = '')
    {
        $category = $this->defaultEventCategory;

        $event = new CalendarEvent([
            'name' => $title,
            'description' => Purifier::clean($description),
            'calendar_id' => $this->id,
            'event_category_id' => $category?->id ?? '-1',
            'settings' => $category?->event_settings ?? ["color" => "Dark-Solid", "text" => "text", "hide" => false, "hide_full" => false, "print" => false],
            'sort_by' => $this->events()->count()
        ]);

        $event->oneTime($this->year, $this->month_id, $this->day);

        $event->save();

        return $event;
    }

    public function getTodaysOneTimeEventsAttribute()
    {
        $year = $this->year;
        $month_id = $this->month_id;
        $day = $this->day;

        return $this->events->filter(fn($event) => $event->detail('date') == [$year, $month_id, $day]);
    }
}
