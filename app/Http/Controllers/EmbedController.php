<?php

namespace App\Http\Controllers;

use App\Calendar;
use Illuminate\Http\Request;

class EmbedController extends Controller
{
    public function embedCalendar(Calendar $calendar)
    {
//        \Debugbar::disable();

        return view('pages.embed', array_merge(
            [
                'calendar' => $calendar,
            ],
            request()->only(['size', 'height', 'width'])
        ));
    }

    public function embedExample()
    {
        return view('pages.embed_example');
    }
}
