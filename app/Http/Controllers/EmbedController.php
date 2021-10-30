<?php

namespace App\Http\Controllers;

use App\Calendar;
use Illuminate\Http\Request;

class EmbedController extends Controller
{
    public function embedCalendar(Calendar $calendar)
    {
        \Debugbar::disable();

        return view('pages.embed', [
            'calendar' => $calendar
        ]);
    }

    public function embedExample()
    {
        return view('pages.embed_example');
    }
}
