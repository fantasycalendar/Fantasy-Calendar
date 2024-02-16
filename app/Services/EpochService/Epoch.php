<?php


namespace App\Services\EpochService;


use App\Facades\Moons;
use App\Services\CalendarService\Month;
use Illuminate\Support\Collection;

class Epoch
{
    public int $monthIndexOfYear;
    public int $year;
    public Month $month;
    public int $day;
    public int $visualDay;
    public bool $isNumbered;
    public int $epoch;
    public int $dayOfYear;
    public Collection $timespanCounts;
    public int $historicalIntercalaryCount;
    public int $numberTimespans;
    public int $monthId;
    public string $weekdayName;
    public int $weekdayIndex;
    public int $visualWeekdayIndex;
    public int $visualWeekIndex;
    public int $weeksSinceMonthStart;
    public int $weeksTilMonthEnd;
    public int $weeksSinceYearStart;
    public int $weeksTilYearEnd;
    public string $slug;
    public bool $isIntercalary;
    public bool $isCurrentDate;
    public array $attachedAttributes = [];
    private array $attributes;
    public array $moons;

    public function __construct($attributes)
    {
        $this->monthIndexOfYear = $attributes['monthIndexOfYear'];
        $this->year = $attributes['year'];
        $this->month = $attributes['month'];
        $this->day = $attributes['day'];
        $this->visualDay = $attributes['visualDay'];
        $this->isNumbered = $attributes['isNumbered'];
        $this->epoch = $attributes['epoch'];
        $this->dayOfYear = $attributes['dayOfYear'];
        $this->timespanCounts = $attributes['timespanCounts'];
        $this->historicalIntercalaryCount = $attributes['historicalIntercalaryCount'];
        $this->numberTimespans = $attributes['numberTimespans'];
        $this->monthId = $attributes['monthId'];
        $this->weekdayName = $attributes['weekdayName'];
        $this->weekdayIndex = $attributes['weekdayIndex'];
        $this->visualWeekdayIndex = $attributes['visualWeekdayIndex'];
        $this->visualWeekIndex = $attributes['visualWeekIndex'];
        $this->weeksSinceMonthStart = $attributes['weeksSinceMonthStart'];
        $this->weeksTilMonthEnd = $attributes['weeksTilMonthEnd'];
        $this->weeksSinceYearStart = $attributes['weeksSinceYearStart'];
        $this->weeksTilYearEnd = $attributes['weeksTilYearEnd'];
        $this->isIntercalary = $attributes['isIntercalary'];

        $this->slug = $this->slugify();
        $this->attributes = $attributes;
    }

    public function addMoons()
    {
        $this->moons = Moons::forEpoch($this)->toArray();
    }

    /**
     * @return array
     */
    public function toArray(): array
    {
        return $this->attributes;
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
        return date_slug($this->year, $this->monthIndexOfYear, $this->day);
    }

    public function __set($name, $value)
    {
        return $this->attachedAttributes[$name] = $value;
    }

    public function __get($name)
    {
        return $this->attachedAttributes[$name];
    }
}
