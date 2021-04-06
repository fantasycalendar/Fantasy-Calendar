<?php

namespace App\Services\CalendarService;

use App\Calendar;
use Illuminate\Support\Arr;
use Illuminate\Database\Eloquent\Concerns\HasAttributes;

class Date
{

	use HasAttributes;

    private Calendar $calendar;

	public int $year;
	public int $timespan;
	public int $day;

	private array $epoch_data;

    /**
     * @param $calendar
	 * @param $year 
	 * @param $month
	 * @param $day
     */
	public function __construct(Calendar $calendar, int $year, int $month = null, int $day = null){

		$this->calendar = $calendar;

		$this->year = $year;
		$this->month = $month;
		$this->day = $day;
		
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
	  * This is only a helper function for the calculateEpochDetails function
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

		$this->epochDetails['eraYears'] = [];
		   
		foreach($this->calendar->eras as $era_index => $era){

			if($era->setting('starting_era')) continue;

			if($era->ends_year && $year > $era->date->year){

				$era_exact_data = $era->date->calculateEpoch($era->date->year, $era->date->timespan, $era->date->day);
				$era_normal_data = $era->date->calculateEpoch($era->date->year+1);

				$this->epochDetails['epoch'] -= ($era_normal_data->epoch - $era_exact_data->epoch);

				$this->epochDetails['intercalary'] -= ($era_normal_data->intercalary - $era_exact_data->intercalary);

				for($i = 0; $i < count($era_normal_data->countTimespans); i++){
					$this->epochDetails['countTimespans'][$i] = $era_normal_data->countTimespans[$i] - $era_exact_data->countTimespans[$i];
				}

				$this->epochDetails['numTimespans'] -= ($era_normal_data->numTimespans - $era_exact_data->numTimespans);
				$this->epochDetails['totalWeekNum'] -= ($era_normal_data->totalWeekNum - $era_exact_data->totalWeekNum);

			}
		
		}

	}

    /**
	  * Calculates the era year for the given date, and reset it each time it should have
	  * In addition, it figures out the current era's index based on the date
      */
	private function calculateEraYear(int $year){

		$this->epochDetails['eraYear'] = $year;

		$this->epochDetails['currentEra'] = -1;

		foreach($this->calendar->eras as $era_index => $era){

			$this->epochDetails['eraYears'][$era_index] = $era->date->year;

			if(!$era->setting('starting_era') && $era->setting('restart')
				&&
				(
					$year > $era->date->year
					||
					($year == $era->date->year && $timespan > $era->date->timespan)
					||
					($year == $era->date->year && $timespan == $era->date->timespan && $day == $era->date->day)
					||
					($this->epochDetails['epoch'] == $era->date->epoch)
				)
			){

				for($i = 0; $i < $era_index; $i++){

					if($era->setting('starting_era')) continue;

					$prev_era = $this->calendar->eras[$i];

					if($prev_era->setting('restarts_year_count')){

						$this->epochDetails['eraYears'][$era_index] -= $this->epochDetails['eraYears'][$i];

					}

				}

				$this->epochDetails['eraYear'] = $this->epochDetails['eraYear'] - $this->epochDetails['eraYears'][$era_index];

			}

			if(!$era->settings->starting_era && $this->epochDetails['epoch'] >= $era->date->epoch && $this->epochDetails['currentEra'] == -1){
				$this->epochDetails['currentEra'] = $era_index;
			}

		}

		if($era->settings->starting_era && $this->epochDetails['currentEra'] == -1){
			$this->epochDetails['currentEra'] = 0;
		}

	}

    /**
	  * If the calendar has overflowing weeks, this calculates the current weekday based on the epoch, number of intercalary days,
	  * and the first weekday of the first year. If it doesn't have overflowing weeks, it is the first day of the week.
      */
	private function calculateCurrentWeekday(){

		$this->epochDetails['weekday'] = 1; // TO-DO Adam: Figure out how to determine the weekday if $this-day is not 0

		if($this->calendar->overflows_week){

			$this->epochDetails['weekday'] = ($this->epochDetails['epoch']-1-$this->epochDetails['intercalary']+intval($this->calendar->first_day)) % count($this->calendar->global_week);

			if ($this->epochDetails['weekday'] < 0) $this->epochDetails['weekday'] += count($this->calendar->global_week);

			$this->epochDetails['weekday'] += 1;

		}

	}

    /**
	  * Master function to calculate the overall epoch details based on the given date
      */
	public function calculateEpochDetails(){
		
		$this->epochDetails = $this->calculateEpoch($this->year, $this->month, $this->day);

		$this->subtractYearEndingEras();

		$this->calculateEraYear();

		$this->calculateCurrentWeekday();

	}

	private function getEpochDetailsAttribute()
	{

		if(!$this->epochDetails){
			$this-calculateEpochDetails();
		}

		return $this->epochDetails;

	}

	public function __get($name)
	{
		return Arr::get($this->epochDetails, $name);
	}
	
}