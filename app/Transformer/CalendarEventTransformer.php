<?php

namespace App\Transformer;

use App\CalendarEvent;
use League\Fractal;

use Auth;

class CalendarEventTransformer extends Fractal\TransformerAbstract {
    public function transform(CalendarEvent $event) {
        $event_data = [
            'has_duration' => (bool) $event->data['has_duration'] ?? false,
            'duration' => $event->data['duration'] ?? 0,
            'show_first_last' => (bool) $event->data['show_first_last'] ?? false,
            'limited_repeat' => (bool) $event->data['limited_repeat'] ?? false,
            'limited_repeat_num' => (int) $event->data['limited_repeat_num'] ?? 0,
            'conditions' => $event->data['conditions'] ?? [],
            'date' => $event->data['date'] ?? [],
            'search_distance' => (int) $event->data['search_distance'] ?? 0
        ];

        $event_settings = [
            "color" => $event->setting("color", "Dark-Solid"),
            "text" => $event->setting("text", "text"),
            "hide" => (bool) $event->setting("hide"),
            "hide_full" => (bool) $event->setting("hide_full"),
            "print" => (bool) $event->setting("print")
        ];

        return [
            'name' => $event->name,
            'description' => $event->description,
            'data' => $event_data,
            'event_category_id' => $event->event_category_id ?? -1,
            'settings' => $event_settings,
            'calendar_id' => $event->calendar_id,
            'sort_by' => (int) $event->sort_by ?? 0,
            'updated_at' => $event->updated_at,
            'created_at' => $event->created_at,
            'id' => (int) $event->id,
            'creator_id' => (int) $event->creator->id
        ];
    }
}
