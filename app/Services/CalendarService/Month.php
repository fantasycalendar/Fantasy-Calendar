<?php

namespace App\Services\CalendarService;

use App\Calendar;
use App\Facades\Epoch as EpochService;
use App\Services\EpochService\Epoch;
use Illuminate\Database\Eloquent\Concerns\HasAttributes;
use Illuminate\Support\Arr;

class Month
{
    use HasAttributes;

    public $calendar;
    public $weeks;
    public $firstWeekday;

    public $weekdays;
    public $id;
    /**
     * @var mixed
     */
    public $baseLength;
    /**
     * @var array|\ArrayAccess|mixed
     */
    public $leapdays;
    /**
     * @var array|\ArrayAccess|mixed
     */
    public $length;
    /**
     * @var Epoch
     */
    private Epoch $firstEpoch;

    public function __construct(Calendar $calendar, $id = null)
    {
        $this->calendar = $calendar;
        $this->weeks = collect();
        $this->id = $id ?? $calendar->month_index;

//        $this->firstEpoch = EpochService::forCalendarYear($calendar)->where('month', '=', $this->id)->first();

//        $this->initialize();
    }

    /*
     * Returns an 2-dimensional array in the format:
     *
     */
    public function getStructure()
    {
        $epochs = EpochService::forCalendarYear($this->calendar);

        dd('EpochService::forCalendarMonth() results:', $epochs->map->month);

//        $sections = (new SectionsCollection())->build($this);
//
//        dd($sections);

        // Loop through all sections
            // headerRow = ['Monday', 'Tuesday', 'etc',]
            // showHeaderRow?
            // numberOfDays
            // startAt = 2  ----- Which means (if($sectionDay < $startAt) { 'x' })
            //
            // 1. Determine number of rows in section

        /*
         *
         *  "sections": {
         *      "1": {
         *          header_row: ['Monday', 'Tuesday', 'etc',],
         *          header_row_visible: true,
         *          number_of_days: 2,
         *          starting_weekday: 2,
         *          rows: [
         *              "1": [
         *                  {
         *                      month_day: 1,
         *                      year: 128
         *                      month: 0
         *                      day: 0
         *                      epoch: 47104
         *                      era_year: 0
         *                      historicalIntercalaryCount: 0
         *                      numTimespans: 1536
         *                      totalWeekNum: 6711
         *                      week_day:  7
         *                  },
         *              ]
         *          ]
         *      },
         *      "2": {
         *
         *      }
         *  }
         */

//        $monthDay = 0;
//        $structure = $weeksInMonth->mapWithKeys(function($weekNumber) use (&$monthDay){
//            return [
//                $weekNumber => collect($this->calendar->month_week)->map(function($day) use (&$monthDay){
//                    $monthDay++;
//
//                    return ['month_day' => ($monthDay > $this->calendar->month_true_length) ? null : $monthDay];
//                })
//            ];
//        });

        return [
            'year' => $this->calendar->year,
            'name' => $this->name,
            'length' => $this->length,
            'weekdays' => $this->weekdays,
            'weeks' => $structure
        ];
    }

    public function getSectionBreaks()
    {
        return $this->leapdays->filter->intercalary->groupBy('day');
    }

    private function initialize()
    {
        $this->leapdays = $this->calendar->leap_days
            ->filter->timespanIs($this->id)
            ->filter->intersectsYear($this->calendar->year);

        $this->weekdays = $this->buildWeekdays();

        $this->length = $this->baseLength + $this->leapdays->count();

        $this->firstWeekday = $this->firstEpoch->weekday;

        return $this;
    }

    private function buildWeekdays()
    {
        $weekdays = collect(Arr::get($this->attributes, 'week', $this->calendar->global_week));

        return $this->insertLeapdaysIntoWeek($weekdays);
    }

    private function insertLeapdaysIntoWeek($weekdays)
	{
        $additiveLeapdays = $this->leapdays
            ->filter->adds_week_day
            ->sortBy('day')
            ->values();

        if(!$additiveLeapdays->count()){
		    return $weekdays;
        }

        $leapDays = $additiveLeapdays->mapWithKeys(function($leapDay, $leapdayIndex) use($additiveLeapdays) {
			return [($leapDay->day * ($additiveLeapdays->count()+1)) + ($leapdayIndex + 1) => $leapDay->week_day];
		});

        $weekdays = $weekdays->mapWithKeys(function($weekday, $weekdayIndex) use ($additiveLeapdays) {
			return [(($weekdayIndex + 1) * ($additiveLeapdays->count()+1)) => $weekday];
		});

		return $weekdays->union($leapDays)->sortKeys()->values();
	}

    public function __get($name)
    {
        return Arr::get($this->attributes, $name);
    }
}
