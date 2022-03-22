<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Calendar;
use App\Http\Controllers\Controller;
use App\Services\RendererService\MonthRenderer;
use Illuminate\Http\Request;

class CalendarRendererController extends Controller
{
    public function month(Calendar $calendar, $year = null, $month = null, $day = null)
    {
        $date = ( $year || $month || $day )
            ? [ $year, $month, $day ]
            : null;

        $renderer = new MonthRenderer($calendar);

        return $renderer->render($date);
    }
}
