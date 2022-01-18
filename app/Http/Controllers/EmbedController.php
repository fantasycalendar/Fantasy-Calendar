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
                'settings' => request()->only([
                    'padding',
                    'shadow_offset',
                    'shadow_size_difference',
                    'shadow_strength',
                    'grid_line_width',
                    'debug',
                    'snapshot',
                    'theme',
                    'quality',
                    'size',
                    'header_height',
                    'weekday_header_height',
                    'header_divider_width',
                    'weekday_header_divider_width',
                    'intercalary_spacing',
                ])
            ],
            request()->only(['size', 'height', 'width'])
        ));
    }

    public function embedExample()
    {
        return view('pages.embed_example');
    }
}
