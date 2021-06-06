<?php


namespace App\Services\EpochService;


use Illuminate\Support\Collection;

class Epoch
{
    public int $year;
    public int $month;
    public int $day;
    public int $epoch;
    public Collection $timespanCounts;
    public int $historicalIntercalaryCount;
    public int $numberTimespans;
    public int $totalWeekNumber;
    public int $monthIndex;
    public int $weekday;
    public string $slug;
    public bool $isIntercalary;

    public function __construct($attributes)
    {

        $this->year = $attributes['year'];
        $this->month = $attributes['month'];
        $this->day = $attributes['day'];
        $this->epoch = $attributes['epoch'];
        $this->timespanCounts = $attributes['timespanCounts'];
        $this->historicalIntercalaryCount = $attributes['historicalIntercalaryCount'];
        $this->numberTimespans = $attributes['numberTimespans'];
        $this->totalWeekNumber = $attributes['totalWeekNumber'];
        $this->monthIndex = $attributes['monthIndex'];
        $this->weekday = $attributes['weekday'];
        $this->isIntercalary = $attributes['isIntercalary'];

        $this->slug = $this->slugify();
    }

    public function slugify(): string
    {
        return date_slug($this->year, $this->month, $this->day);
    }
}
