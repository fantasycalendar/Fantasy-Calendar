<?php

namespace App\Transformer;

use App\CalendarEvent;
use League\Fractal;

use Auth;

class CalendarEventTransformer extends Fractal\TransformerAbstract {
    public function transform(CalendarEvent $event) {
        $event_data = [
            'has_duration' => (bool) $event->data['has_duration'],
            'duration' => $event->data['duration'],
            'show_first_last' => (bool) $event->data['show_first_last'],
            'limited_repeat' => (bool) $event->data['limited_repeat'],
            'limited_repeat_num' => (int) $event->data['limited_repeat_num'],
            'conditions' => $event->data['conditions'],
            'date' => $event->data['date'],
            'search_distance' => (int) $event->data['search_distance']
        ];

        $event_settings = [
            "color" => $event->settings["color"],
            "text" => $event->settings["text"],
            "hide" => (bool) $event->settings["hide"],
            "hide_full" => (bool) $event->settings["hide_full"],
            "print" => (bool) $event->settings["print"]
        ];

        return [
            'name' => $event->name,
            'description' => $event->description,
            'data' => $event_data,
            'event_category_id' => $event->event_category_id,
            'settings' => $event_settings,
            'calendar_id' => $event->calendar_id,
            'sort_by' => (int) $event->sort_by,
            'updated_at' => $event->updated_at,
            'created_at' => $event->created_at,
            'id' => (int) $event->id
        ];
    }
}
