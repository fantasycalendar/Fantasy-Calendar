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

	private function calculateEpoch(int $year, int $month = null, int $day = null){

		$epoch = 0;
		$intercalary = 0;
		$actual_year = $year;
		$month = $month === null ? 0 : $month;
		$day = $day === null ? 0 : $day;
		$num_timespans = 0;
		$count_timespans = [];
		$total_week_num = 1;

		foreach($this->calendar->timespans as $timespan_index => $timespan){

			$year = $timespan_index < $month ? $actual_year+1 : $actual_year;

			// Get the current timespan's fractional appearances since the first year
			$timespan_fraction = $timespan->occurrences($year);

			// Get the number of weeks for that month (check if it has a custom week or not)
			if($this->calendar->overflows_week){
				$total_week_num += abs(floor(($timespan->length * $timespan_fraction)/count($timespan->weekdays)));
			}

			// Count the number of times each month has appeared
			$count_timespans[$timespan_index] = abs($timespan_fraction);

			// Add the month's length to the epoch, adjusted by its interval
			$epoch += $timespan->length * $timespan_fraction;

			// If the month is intercalary, add it to the variable to be subtracted when calculating first day of the year
			if($timespan->intercalary){
				$intercalary += $timespan->length * $timespan_fraction;
			}else{
				$num_timespans += $timespan_fraction;
			}

			foreach($timespan->leap_days as $leap_day){

				$added_leap_day = $leap_day->occurrences($timespan_fraction);

				// If we have leap days days that are intercalary (eg, do not affect the flow of the static_data, add them to the overall epoch, but remove them from the start of the year week day selection)
				if($leap_day->intercalary || $timespan->intercalary){
					$intercalary += $added_leap_day;
				}

				$epoch += $added_leap_day;

			}

		}

		$epoch += $day;

		if($this->calendar->overflows_week){
			$total_week_num += floor(($epoch-$intercalary) / count($this->calendar->weekdays));
		}

		return [
			"epoch" => $epoch,
			"intercalary" => $intercalary,
			"count_timespans" => $count_timespans,
			"num_timespans" => $num_timespans,
			"total_week_num" => $total_week_num
		];

	}

	private function calculateEpochDetails(int $year, int $month = null, int $day = null){

		$month = $month === null ? 0 : $month;
		$day = $day === null ? 0 : $day;

		$era_year = $year;
		
		$data = $this->calculateEpoch($year, $month, $day);
		$epoch = $data['epoch'];
		$intercalary = $data['intercalary'];
		$count_timespans = $data['count_timespans'];
		$num_timespans = $data['num_timespans'];
		$total_week_num = $data['total_week_num'];
		$era_years = [];

		/* Since eras can end years prematurely, we need to make sure we're subtracting
		   data from the epoch details so that it remains accurate */
		   
		foreach($this->calendar->eras as $era_index => $era){

			if($era->setting('starting_era')) continue;

			if($era->ends_year && $year > $era->date->year){

				$era_exact_data = $era->date->calculateEpoch($era->date->year, $era->date->timespan, $era->date->day);
				$era_normal_data = $era->date->calculateEpoch($era->date->year+1);

				$epoch -= ($era_normal_data->epoch - $era_exact_data->epoch);

				$intercalary -= ($era_normal_data->intercalary - $era_exact_data->intercalary);

				for($i = 0; $i < count($era_normal_data->count_timespans); i++){
					$count_timespans[$i] = $era_normal_data->count_timespans[$i] - $era_exact_data->count_timespans[$i];
				}

				$num_timespans -= ($era_normal_data->num_timespans - $era_exact_data->num_timespans);
				$total_week_num -= ($era_normal_data->total_week_num - $era_exact_data->total_week_num);

			}

		}

		$current_era = -1;

		foreach($this->calendar->eras as $era_index => $era){

			$era_years[$era_index] = $era->date->year;

			if(!$era->setting('starting_era') && $era->setting('restart')
				&&
				(
					$year > $era->date->year
					||
					($year == $era->date->year && $timespan > $era->date->timespan)
					||
					($year == $era->date->year && $timespan == $era->date->timespan && $day == $era->date->day)
					||
					($epoch == $era->date->epoch)
				)
			){

				for($i = 0; $i < $era_index; $i++){

					if($era->setting('starting_era')) continue;

					$prev_era = $this->calendar->eras[$i];

					if($prev_era->setting('restarts_year_count')){

						$era_years[$era_index] -= $era_years[$i];

					}

				}

				$era_year = $era_year - $era_years[$era_index];

			}

			if(!$era->settings->starting_era && $epoch >= $era->date->epoch && $current_era == -1){
				$current_era = $era_index;
			}

		}

		if($era->settings->starting_era && $current_era == -1){
			$current_era = 0;
		}


		if($this->calendar->overflows_week){

			$week_day = ($epoch-1-$intercalary+(Number($this->calendar->first_day))) % count($this->calendar->global_week);

			if ($week_day < 0) $week_day += count($this->calendar->global_week);

			$week_day += 1;

		}else{

			$week_day = 1;

		}

		return [
			"epoch" => $epoch,
			"era_year" => $era_year,
			"week_day" => $week_day,
			"count_timespans" => $count_timespans,
			"num_timespans" => $num_timespans,
			"total_week_num" => $total_week_num,
			"current_era" => $current_era
		];

	}

	private function getEpochDetailsAttribute()
	{

		if(!$this->epoch_details){
			$this->epoch_details = $this-calculateEpochDetails($this->year, $this->month, $this->day);
		}

		return $this->epoch_details;

	}

	public function __get($name)
	{
		return Arr::get($this->epoch_details, $name);
	}
	
}