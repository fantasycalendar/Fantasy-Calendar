<?php

namespace App\Http\Controllers\Api;

use App\Calendar;
use App\Http\Controllers\Controller;
use App\Services\RendererService\MonthRenderer;
use Illuminate\Http\Request;

class CalendarRendererController extends Controller
{
    public function month(Calendar $calendar)
    {
        $renderer = new MonthRenderer($calendar);

        return $renderer->render();
    }
}
