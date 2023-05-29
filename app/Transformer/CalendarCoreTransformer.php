<?php


namespace App\Transformer;

use App\Models\Calendar;
use App\Models\User;
use Illuminate\Support\Arr;

class CalendarCoreTransformer extends \League\Fractal\TransformerAbstract
{
    public function transform(Calendar $calendar)
    {
        $value = [
            'name' => $calendar->name,
            'description' => $calendar->description ?? "",

            'current_date' => $this->buildCurrentDate($calendar),
            'current_time' => $this->buildCurrentTime($calendar),

            'weekdays' => $this->buildWeekdays($calendar),

            'months' => $this->buildMonths($calendar),
        ];
        // dd($value);
        return $value;
    }

    private function buildCurrentDate(Calendar $calendar)
    {
        return [
            "year" => $calendar->year,
            "month" => [
                "id" => $calendar->month->id
            ],
            "day" => $calendar->day,
        ];
    }

    private function buildCurrentTime(Calendar $calendar)
    {
        $time = explode(':', $calendar->current_time);

        return [
            "hour" => intval($time[0]),
            "minute" => intval($time[1]),
        ];
    }

    private function buildWeekdays(Calendar $calendar)
    {
        return array_map(fn ($weekday) => ['name' => $weekday], Arr::get($calendar->static_data, 'year_data.global_week'));
    }

    private function buildMonths(Calendar $calendar): array
    {
        return $calendar->months->map(fn ($month) => [
            'id' => $month->id,
            'name' => $month->name,
            'length' => $month->length,
            'interval' => $month->interval,
            'offset' => $month->offset,
            'intercalary' => $month->type === 'intercalary',
            'weekdays' => $month->week ?? [],
        ])->toArray();
    }
}
