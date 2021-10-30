<?php

namespace App\Http\Controllers;

use App\Calendar;
use Illuminate\Http\Request;

class EmbedController extends Controller
{
    public function embedCalendar(Calendar $calendar)
    {
        return view('pages.embedtest', [
            'calendar' => $calendar
        ]);
    }
}
