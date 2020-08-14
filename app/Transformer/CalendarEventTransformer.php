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
            "color" => $event->settings["color"] ?? "Dark-Solid",
            "text" => $event->settings["text"] ?? "text",
            "hide" => (bool) $event->settings["hide"] ?? false,
            "hide_full" => (bool) $event->settings["hide_full"] ?? false,
            "print" => (bool) $event->settings["print"] ?? false
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
            'id' => (int) $event->id
        ];
    }
}
