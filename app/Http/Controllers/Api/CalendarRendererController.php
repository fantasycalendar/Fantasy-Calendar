<?php

namespace App\Http\Controllers\Api;

use App\Calendar;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CalendarRendererController extends Controller
{
    public function month(Calendar $calendar)
    {
        return $calendar;
    }
}
