<?php

namespace App\Services\CalendarService;

use App\Calendar;
use Illuminate\Support\Arr;

/**
 * Class Date
 * @package App\Services\CalendarService
 * @property $year
 * @property $month
 * @property $day
 * @property $monthsOfYear
 * @property $daysOfMonth
 */

class Date
{

    private Calendar $calendar;

	public int $year;
	public int $month;
	public int $day;
	public $monthsOfYear;
	public $daysOfMonth;

    /**
     * @param $calendar
	 * @param $year 
	 * @param $month
	 * @param $day
     */
	public function __construct(Calendar $calendar, int $year = null, int $month = null, int $day = null){

		$this->calendar = $calendar;

		$this->year = $year ?? $calendar->year;
		$this->month = $month ?? $calendar->month;
		$this->day = $day ?? $calendar->day;
	    
        $this->monthsOfYear = $this->calendar->get_months_of_year($this->year);
		$this->daysOfMonth = $this->calendar->get_days_of_month($this->year, $this->month);
		
	}

	/**
	 * This function sets the current year, and in case of leaping months, ensures that the current month stays within bounds
	 *
	 * @param  int  year
	 */
	public function setYear(int $year){
        
        // $date = $date->setYear(1491)->setMonth(30);
		if($year == $this->year) return $this;

		$monthsOfYear = $this->calendar->get_months_of_year($year);

		if(count($monthsOfYear) > 0){

			$this->year = $year;

			$this->monthsOfYear = $monthsOfYear;

			if($this->month >= count($this->monthsOfYear)){
				$this->setMonth(count($this->monthsOfYear)-1);
			}

		}else{

			$newYear = $year > $this->year ? $year+1 : $year-1;
			
			$this->setYear($newYear);

		}

	}

	/**
	 * This function sets the current month, and in case of leap days, ensures that the current day stays within bounds
	 *
	 * @param  int  month
	 */
	public function setMonth(int $month){

		if($month == $this->month) return $this;

		if($month > count($this->monthsOfYear)){
			
			$this->addYear(1);

			$difference = count($this->monthsOfYear) - $month - 1;

			$this->setMonth($difference);

		}else if($month < 0){
			
			$this->subtractYear(1);

			$difference = $month + count($this->monthsOfYear);

			$this->setMonth($difference);

		}else{

			$this->month = $month;

			$this->daysOfMonth = $this->calendar->get_days_of_month($this->year, $this->month);

			if($this->day > count($this->daysOfMonth)){
				$this->setDay(count($this->daysOfMonth));
			}

		}

	}

	/**
	 * This function sets the current day, and ensures the date stays within the bounds of the calendar, considering leap months, years without months, and leap days
	 *
	 * @param  int  day
	 */
	public function setDay(int $day){

		if($day == $this->day) return $this;

		if($day >= count($this->daysOfMonth)){
			
			$this->addMonth(1);

			$difference = count($this->daysOfMonth) - $day - 1;

			$this->setDay($difference);

		}else if($day < 0){
			
			$this->subtractMonth(1);

			$difference = $day + count($this->daysOfMonth);

			$this->setDay($difference);
			
		}else{

			$this->day = $day;

		}

	}

	public function addYear(int $year){

		$this->setYear($this->year + $year);

	}

	public function subtractMear(int $year){

		$this->setYear($this->year - $year);

	}

	public function addMonth(int $month){

		$this->setMonth($this->month + $month);

	}

	public function subtractMonth(int $month){

		$this->setMonth($this->month - $month);

	}

	public function addDay(int $day){

		$this->setDay($this->day + $day);

	}

	public function subtractDay(int $day){

		$this->setDay($this->day - $day);

	}

	public function addWeeks(int $weeks){

		// to-do

	}

	public function subtractWeeks(int $weeks){

		// to-do

	}

}