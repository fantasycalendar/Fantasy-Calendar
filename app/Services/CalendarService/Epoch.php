<?php

namespace App\Services\CalendarService;

use App\Calendar;
use Illuminate\Support\Arr;
use Illuminate\Database\Eloquent\Concerns\HasAttributes;

/**
 * Class Epoch
 * @package App\Services\CalendarService
 * @property $year
 * @property $month
 * @property $day
 * @property $epoch
 * @property $intercalary
 * @property $timespanCounts
 * @property $numTimespans
 * @property $totalWeekNum
 * @property $currentEra
 * @property $weekday
 */

class Epoch
{

    private Calendar $calendar;

	public int $year;
	public int $month;
	public int $day;
	
	public int $year;
    public int $month;
    public int $day;
    public int $epoch;
    public int $intercalary;
    public array $timespanCounts;
    public int $numTimespans;
    public int $totalWeekNum;
    public int $currentEra;
    public int $weekday;

	private array $details;

    /**
     * @param $calendar
	 * @param $year 
	 * @param $month
	 * @param $day
     */
	public function __construct(Calendar $calendar, int $year = null, int $month = null, int $day = null){

		$this->calendar = $calendar;

		$this->year = $year ?? $this->calendar->year;
		$this->month = $month ?? $this->calendar->month_index;
		$this->day = $day ?? $this->calendar->day;

		$this->initialize();
	}

    /**
	  * Master function to calculate the overall epoch details based on the given date
      */
	public function initialize(){
		
		$this->initializeAttributes();

		$this->subtractYearEndingEras();

		$this->weekday = $this->calculateCurrentWeekday();

		$this->eraYear = $this->calculateEraYear();

		$this->currentEra = $this->calculateCurrentEra();

		$this->month_id = $this->calculateCurrentMonthId();

	}

	private function initializeAttributes()
	{
        $initialDetails = $this->calculateEpoch($this->year, $this->month, $this->day);
        foreach($initialDetails as $key => $value) {
            $this->$key = $value;        
        }        
	}

	private function calculateCurrentMonthId()
	{
        return $this->calendar->timespans->reject(function($timespan){
			return (($this->year + $timespan['offset']) % $timespan['interval']) != 0;
        })
        ->values()
        ->pull($this->month);
	}

    /**
	  * This function takes a date (or a partial one), and calculates the required data
	  * from the start of the calendar up to the given date
	  *
	  * It calculates the following:
	  * - The current epoch based on the occurrences of each month and leap day
	  * - The number of intercalary days in that total epochs
	  * - The number of times each month appears
	  * - The number of months that has appeared
	  * - The total number of weeks
	  * 
	  * This is only a helper function for the calculateDetails function
      *
      * @param  int              year
      * @param  int  optional    month
      * @param  int  optional    day
      * @return bool                     An object containing the epoch data relating to the date
      */
	private function calculateEpoch(int $year, int $month = 0, int $day = 0)
	{
		$epoch = 0;
		$intercalary = 0;
		$actualYear = $year;
		$numTimespans = 0;
		$timespanCounts = [];
		$totalWeekNum = 1;
		
		foreach($this->calendar->timespans as $timespan_index => $timespan){

			// If month was provided, add one more year to account for their occurrence during the given year 
			$year = $timespan_index < $month ? $actualYear+1 : $actualYear;

			// Get the number of occurrences of this month up to the given year
			$timespanOccurrences = $timespan->occurrences($year);

			// Get the number of weeks for that month, based on its occurrences
			if($this->calendar->overflows_week){
				$totalWeekNum += abs(floor(($timespan->length * $timespanOccurrences)/count($timespan->weekdays)));
			}

			// Count the number of times each month has appeared up to the given year
			$timespanCounts[$timespan_index] = abs($timespanOccurrences);

			// Add the month's length to the epoch, adjusted by its interval
			$epoch += $timespan->length * $timespanOccurrences;

			// If the month is intercalary, add it to the variable to be subtracted when calculating first day of the year
			if($timespan->intercalary){
				$historicalIntercalaryCount += $timespan->length * $timespanOccurrences;
			}else{
				// Intercalary timespans aren't counted as 'real' months, so only include non-intercalary when counting number of total timespans
				$numTimespans += $timespanOccurrences;
			}

			foreach($timespan->leap_days as $leap_day){

				// Based on the month's occurrences, we can calculate the leap day's occurrences
				$leapDayOccurrences = $leap_day->occurrences($timespanOccurrences);

				// If we have leap days days that are intercalary, add them to the overall epoch
				// but also count them separately to remove them from the current week day calculation
				if($leap_day->intercalary || $timespan->intercalary){
					$historicalIntercalaryCount += $leapDayOccurrences;
				}

				$epoch += $leapDayOccurrences;

			}

		}

		$epoch += $day;

		if($this->calendar->overflows_week){
			$totalWeekNum += floor(($epoch-$historicalIntercalaryCount) / count($this->calendar->weekdays));
		}

		return [
			"year" => $year,
			"month" => $month,
			"day" => $day,
			"epoch" => $epoch,
			"historicalIntercalaryCount" => $historicalIntercalaryCount,
			"timespanCounts" => $timespanCounts,
			"numTimespans" => $numTimespans,
			"totalWeekNum" => $totalWeekNum
		];

	}

    /**
	  * Subtracts data from the epoch details due to year ending eras 
	  *
	  * Since eras can end years prematurely, we need to calculate what data SHOULD have happened during the cut off portion
	  * and then subtract that from the details so that it remains accurrate as if those days/weeks/months are actually missing
      */
	private function subtractYearEndingEras()
		   
		foreach($this->calendar->eras as $era){

			if($era['settings']['starting_era']) continue;

			if($era['settings']['ends_year'] && $year > $era['date']['year']){

				$era_exact_data = $this->calculateEpoch($era['date']['year'], $era['date']['timespan'], $era['date']['day']);
				$era_normal_data = $this->calculateEpoch($era['date']['year']+1);

				$this->epoch -= ($era_normal_data['epoch'] - $era_exact_data['epoch']);

				$this->historicalIntercalaryCount -= ($era_normal_data['intercalary'] - $era_exact_data['intercalary']);

				for($i = 0; $i < count($era_normal_data['timespanCounts']); i++){
					$this->timespanCounts[$i] = $era_normal_data['timespanCounts'][$i] - $era_exact_data['timespanCounts'][$i];
				}

				$this->numTimespans -= ($era_normal_data['numTimespans'] - $era_exact_data['numTimespans']);
				$this->totalWeekNum -= ($era_normal_data['totalWeekNum'] - $era_exact_data['totalWeekNum']);

			}
		
		}

	}

    /**
	  * Calculates the era year for the given date, and reset it each time it should have been reset, based on the era setting 'restarts_year_count'
	  *
      */
	private function calculateEraYear()
	{

		$eraYear = $this->year;

		$eraYears = [];

		foreach($this->calendar->eras as $era_index => $era){

			$eraYears[$era_index] = $era['date']['year'];

			if(!$era['settings']['starting_era'] && $era['settings']['restart']
				&&
				(
					$year > $era['date']['year']
					||
					($year == $era['date']['year'] && $timespan > $era['date']['timespan'])
					||
					($year == $era['date']['year'] && $timespan == $era['date']['timespan'] && $day == $era['date']['day'])
					||
					($this->epoch == $era['date']['epoch'])
				)
			){

				for($i = 0; $i < $era_index; $i++){

					if($era['settings']['starting_era']) continue;

					$prev_era = $this->calendar->eras[$i];

					if($prev_era['settings']['restarts_year_count'){]

						$eraYears[$era_index] -= $eraYears[$i];

					}

				}

				$eraYear = $eraYear - $eraYears[$era_index];

			}

		}

		return $eraYear;

	}

    /**
	  * Calculates the current era based on the epoch and whether the era is the starting era
	  *
      */
	private function calculateCurrentEra(){

		$currentEra = -1;

		foreach($this->calendar->eras as $era_index => $era){

			if(!$era['settings']['starting_era'] && $this->epoch >= $era->epoch && $currentEra == -1){
				$currentEra = $era_index;
			}

		}

		if($currentEra == -1 && $this->calendar->eras[$currentEra]['settings']['starting_era']){
			$currentEra = 0;
		}

		return $currentEra;

	}

    /**
	  * If the calendar has overflowing weeks, this calculates the current weekday based on the epoch, number of intercalary days,
	  * and the first weekday of the first year. If it doesn't have overflowing weeks, it is the first day of the week.
      */
	private function calculateCurrentWeekday()
	{
        return ($this->calendar->overflows_week)
            ? $this->calculateOverflowedWeekday()
            : 0;
	}
	
	private function calculateOverflowedWeekday()
	{
        $weekdaysCount = count($this->calendar->global_week);
        $calendarFirstWeekdayIndex = intval($this->calendar->first_day) - 1; // Subtract one from the calendar first_day because days are 1-indexed and we need them to start at 0 for mathz
        $totalWeekdaysBeforeToday = ($this->epoch - $this->historicalIntercalaryCount + $calendarFirstWeekdayIndex);

        $weekday = $totalWeekdaysBeforeToday % $weekdaysCount;

        // If we're on a negative year, the result is negative, so add weekdays to result	    
	    return ($weekday < 0)
	        ? $weekday + $weekdaysCount
	        : $weekday;
	}
}