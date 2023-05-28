<?php


namespace App\Transformer;

use App\Models\Calendar;
use App\Models\User;
use Illuminate\Support\Arr;

class CalendarCoreTransformer extends \League\Fractal\TransformerAbstract
{
    public function transform(Calendar $calendar)
    {
        return [
            'name' => $calendar->name,
            'description' => $calendar->description ?? "",

            'current_date' => $calendar->current_date,
            'current_time' => $calendar->current_time,

            'weekdays' => Arr::get($calendar->static_data, 'year_data.global_week'),
        ];
    }
}
