<?php

namespace App\Models\Concerns;

use App\CalendarEvent;
use Mews\Purifier\Facades\Purifier;

trait HasCalendarEvents
{
    public function oneTimeEvent($title, $description = '')
    {
        $event = new CalendarEvent([
            'name' => $title,
            'description' => Purifier::clean($description),
            'calendar_id' => $this->id,
            'event_category_id' => ($this->event_categories()->whereId($this->setting('default_category'))->exists())
                ? $this->setting('default_category')
                : "-1",
            'settings' => ["color" => "Dark-Solid", "text" => "text", "hide" => false, "hide_full" => false, "print" => false]
        ]);

        $event->oneTime($this->year, $this->month_id, $this->day);

        $event->save();

        return $event;
    }
}
