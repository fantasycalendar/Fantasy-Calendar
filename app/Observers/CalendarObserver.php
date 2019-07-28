<?php

namespace App\Observers;

use App\Calendar;

class CalendarObserver
{
    public function saving(Calendar $calendar) {
        if($calendar->isDirty('dynamic_data')) {
            $calendar->last_dynamic_change = date('Y-m-d h:i:s');
        }

        if($calendar->isDirty('static_data')) {
            $calendar->last_static_change = date('Y-m-d h:i:s');
        }
    }
}
