<?php

namespace App\Observers;

use App\Models\CalendarEvent;
use Illuminate\Support\Facades\Auth;

class CalendarEventObserver
{
    public function saving(CalendarEvent $event) {
        if($event->creator_id === 0 || !$event->creator_id) {
            if(request()->is('*api*')) {
                $event->creator_id = auth()->user()->id;
            } else {
                $event->creator_id = Auth::user()->id;
            }
        }
    }
}
