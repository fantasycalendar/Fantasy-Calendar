<?php


namespace App\Models\Concerns;


use App\Calendar;
use App\Facades\Epoch;

trait HasDate
{
    public function addDay(): Calendar
    {
        return $this->addDays(1);
    }

    public function addDays($number): Calendar
    {
        $epoch = Epoch::incrementDays($this, $this->epoch, $number);

        return $this->setDate($epoch->year, $epoch->monthId, $epoch->day);
    }

    /**
     * Add a year to the current date of this calendar
     *
     * @return $this
     */
    public function addYear(): Calendar
    {
        return $this->addYears(1);
    }

    /**
     * Add a year to the current date of this calendar
     *
     * @return $this
     */
    public function subYear(): Calendar
    {
        return $this->addYears(-1);
    }

    /**
     * Add a set number of years to the current date of this calendar
     *
     * @param int $years
     * @return $this
     */
    public function addYears(int $years): Calendar
    {
        return $this->setDate($this->year + $years, $this->month_id, $this->day);
    }

    /**
     * Set this calendar to the start of the calendar year
     *
     * @return $this
     */
    public function startOfYear(): Calendar
    {
        $this->setDate($this->year, 0, 0);

        return $this;
    }

    /**
     * Set the full range of the date on this calendar
     *
     * @param $year
     * @param null $timespan
     * @param null $day
     * @return $this
     */
    public function setDate($year, $timespan = null, $day = null): Calendar
    {
        $dynamic_data = $this->dynamic_data;

        $dynamic_data['year'] = $year ?? $dynamic_data['year'];
        $dynamic_data['timespan'] = $timespan ?? $dynamic_data['timespan'];
        $dynamic_data['day'] = $day ?? $dynamic_data['day'];

        $this->dynamic_data = $dynamic_data;

        return $this;
    }
}
