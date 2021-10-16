<?php

namespace App\Observers;

use App\Calendar;
use App\Events\DateChanged;

class CalendarObserver
{
    public function saving(Calendar $calendar) {
        if($calendar->isDirty('dynamic_data')) {
            $calendar->last_dynamic_change = date('Y-m-d h:i:s');
            $calendar->dynamic('epoch', $calendar->epoch->epoch);

            DateChanged::dispatchIf($calendar->children()->exists(), $calendar, $calendar->dynamic('epoch'));
        }

        if($calendar->isDirty('static_data')) {
            $calendar->last_static_change = date('Y-m-d h:i:s');
        }
    }

    public function replicating(Calendar $calendar) {
        $calendar->hash = md5($calendar->name.json_encode($calendar->dynamic_data).json_encode($calendar->static_data).date('D M d, Y G:i'));
    }

    public function deleted(Calendar $calendar) {

    }
}
