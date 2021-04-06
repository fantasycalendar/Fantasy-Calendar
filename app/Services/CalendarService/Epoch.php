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
 * @property $countTimespans
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

	private array $details;

    /**
     * @param $calendar
	 * @param $year 
	 * @param $month
	 * @param $day
     */
	public function __construct(Calendar $calendar, int $year = null, int $month = null, int $day = null){

		$this->calendar = $calendar;

		$this->year = $year;
		$this->month = $month;
		$this->day = $day;
		
	}

	private function getDetailsAttribute()
	{

		if(!$this->details){
			$this-calculateDetails();
		}

		return $this->details;

	}

    /**
	  * Master function to calculate the overall epoch details based on the given date
      */
	public function calculateDetails(){
		
		$this->details = $this->calculateEpoch($this->year, $this->month, $this->day);

		$this->subtractYearEndingEras();

		$this->calculateEraYear();

		$this->calculateCurrentWeekday();

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
	private function calculateEpoch(int $year, int $month = 0, int $day = 0){

		$epoch = 0;
		$intercalary = 0;
		$actualYear = $year;
		$numTimespans = 0;
		$countTimespans = [];
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
			$countTimespans[$timespan_index] = abs($timespanOccurrences);

			// Add the month's length to the epoch, adjusted by its interval
			$epoch += $timespan->length * $timespanOccurrences;

			// If the month is intercalary, add it to the variable to be subtracted when calculating first day of the year
			if($timespan->intercalary){
				$intercalary += $timespan->length * $timespanOccurrences;
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
					$intercalary += $leapDayOccurrences;
				}

				$epoch += $leapDayOccurrences;

			}

		}

		$epoch += $day;

		if($this->calendar->overflows_week){
			$totalWeekNum += floor(($epoch-$intercalary) / count($this->calendar->weekdays));
		}

		return [
			"year" => $year,
			"month" => $month,
			"day" => $day,
			"epoch" => $epoch,
			"intercalary" => $intercalary,
			"countTimespans" => $countTimespans,
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
	private function subtractYearEndingEras(){

		$this->details['eraYears'] = [];
		   
		foreach($this->calendar->eras as $era_index => $era){

			if($era->setting('starting_era')) continue;

			if($era->ends_year && $year > $era->year){

				$era_exact_data = $this->calculateEpoch($era->year, $era->timespan, $era->day);
				$era_normal_data = $this->calculateEpoch($era->year+1);

				$this->details['epoch'] -= ($era_normal_data['epoch'] - $era_exact_data['epoch']);

				$this->details['intercalary'] -= ($era_normal_data['intercalary'] - $era_exact_data['intercalary']);

				for($i = 0; $i < count($era_normal_data['countTimespans']); i++){
					$this->details['countTimespans'][$i] = $era_normal_data['countTimespans'][$i] - $era_exact_data['countTimespans'][$i];
				}

				$this->details['numTimespans'] -= ($era_normal_data['numTimespans'] - $era_exact_data['numTimespans']);
				$this->details['totalWeekNum'] -= ($era_normal_data['totalWeekNum'] - $era_exact_data['totalWeekNum']);

			}
		
		}

	}

    /**
	  * Calculates the era year for the given date, and reset it each time it should have been reset, based on the era setting 'restarts_year_count'
	  * In addition, it figures out the current era's index based on the date
      */
	private function calculateEraYear(int $year){

		$this->details['eraYear'] = $year;

		$this->details['currentEra'] = -1;

		foreach($this->calendar->eras as $era_index => $era){

			$this->details['eraYears'][$era_index] = $era->year;

			if(!$era->setting('starting_era') && $era->setting('restart')
				&&
				(
					$year > $era->year
					||
					($year == $era->year && $timespan > $era->timespan)
					||
					($year == $era->year && $timespan == $era->timespan && $day == $era->day)
					||
					($this->details['epoch'] == $era->epoch)
				)
			){

				for($i = 0; $i < $era_index; $i++){

					if($era->setting('starting_era')) continue;

					$prev_era = $this->calendar->eras[$i];

					if($prev_era->setting('restarts_year_count')){

						$this->details['eraYears'][$era_index] -= $this->details['eraYears'][$i];

					}

				}

				$this->details['eraYear'] = $this->details['eraYear'] - $this->details['eraYears'][$era_index];

			}

			if(!$era->settings->starting_era && $this->details['epoch'] >= $era->epoch && $this->details['currentEra'] == -1){
				$this->details['currentEra'] = $era_index;
			}

		}

		if($era->settings->starting_era && $this->details['currentEra'] == -1){
			$this->details['currentEra'] = 0;
		}

	}

    /**
	  * If the calendar has overflowing weeks, this calculates the current weekday based on the epoch, number of intercalary days,
	  * and the first weekday of the first year. If it doesn't have overflowing weeks, it is the first day of the week.
      */
	private function calculateCurrentWeekday(){

		$this->details['weekday'] = 1; // TO-DO Adam: Figure out how to determine the weekday if $this-day is not 0

		if($this->calendar->overflows_week){

			$this->details['weekday'] = ($this->details['epoch']-1-$this->details['intercalary']+intval($this->calendar->first_day)) % count($this->calendar->global_week);

			if ($this->details['weekday'] < 0) $this->details['weekday'] += count($this->calendar->global_week);

			$this->details['weekday'] += 1;

		}

	}
	
}