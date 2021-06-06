<?php


namespace App\Services\EpochService;


use App\Services\CalendarService\Month;
use Illuminate\Support\Collection;

class Epoch
{
    public int $monthIndexInYear;
    public int $year;
    public Month $month;
    public int $day;
    public int $epoch;
    public Collection $timespanCounts;
    public int $historicalIntercalaryCount;
    public int $numberTimespans;
    public int $monthId;
    public int $weekdayIndex;
    public string $weekdayName;
    public int $weeksSinceMonthStart;
    public int $weeksTilMonthEnd;
    public int $weeksSinceYearStart;
    public int $weeksTilYearEnd;
    public string $slug;
    public bool $isIntercalary;

    public function __construct($attributes)
    {

        $this->monthIndexInYear = $attributes['monthIndexInYear'];
        $this->year = $attributes['year'];
        $this->month = $attributes['month'];
        $this->day = $attributes['day'];
        $this->epoch = $attributes['epoch'];
        $this->timespanCounts = $attributes['timespanCounts'];
        $this->historicalIntercalaryCount = $attributes['historicalIntercalaryCount'];
        $this->numberTimespans = $attributes['numberTimespans'];
        $this->monthId = $attributes['monthId'];
        $this->weekdayIndex = $attributes['weekdayIndex'];
        $this->weekdayName = $attributes['weekdayName'];
        $this->weeksSinceMonthStart = $attributes['weeksSinceMonthStart'];
        $this->weeksTilMonthEnd = $attributes['weeksTilMonthEnd'];
        $this->weeksSinceYearStart = $attributes['weeksSinceYearStart'];
        $this->weeksTilYearEnd = $attributes['weeksTilYearEnd'];
        $this->isIntercalary = $attributes['isIntercalary'];

        $this->slug = $this->slugify();
    }

    /**
     * @param $year
     * @return bool
     */
    public function yearIs($year): bool
    {
        return $this->year === $year;
    }

    /**
     * @return string
     */
    public function slugify(): string
    {
        return date_slug($this->year, $this->monthIndexInYear, $this->day);
    }
}
