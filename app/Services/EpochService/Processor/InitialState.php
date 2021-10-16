<?php


namespace App\Services\EpochService\Processor;


use App\Calendar;
use App\Facades\Epoch;
use App\Services\EpochService\Traits\CalculatesAndCachesProperties;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

class InitialState
{
    protected Calendar $calendar;
    protected int $year;

    /**
     * State constructor.
     * @param $calendar
     */
    public function __construct($calendar)
    {
        $this->calendar = $calendar;
        $this->year = $calendar->year;
    }

    /**
     * @param $calendar
     * @return Collection
     */
    public static function generateFor($calendar): Collection
    {
        return (new static($calendar))->generateInitialProperties();
    }

    /**
     * @return Collection
     */
    public function generateInitialProperties(): Collection
    {
        return $this->collect();
    }

    /**
     * Return this state as a collection
     *
     * @return Collection
     */
    public function collect(): Collection
    {
        return collect($this->toArray());
    }

    /**
     * Provide an initial state in array form
     *
     * @return array
     */
    public function toArray(): array
    {
        return [
            'epoch' => $this->calculateEpoch(),
            'numberTimespans' => $this->calculateNumberTimespans(),
            'historicalIntercalaryCount' => $this->calculateHistoricalIntercalaryCount(),
            'weekdayIndex' => $this->calculateWeekdayIndex(),
            'timespanCounts' => $this->calculateTimespanCounts(),
            'eraYear' => $this->calculateEraYear()
        ];
    }

    /**
     * Calculates the epoch
     *
     * @return int
     */
    private function calculateEpoch(): int
    {
        return $this->calculateTotalDaysFromTimespans()
            + $this->calculateTotalLeapdayOccurrences();
    }

    /**
     * @return int
     */
    private function calculateTotalDaysFromTimespans(): int
    {
        return $this->calendar->timespans->sum(function($timespan){
            return $timespan->occurrences($this->year) * $timespan->length;
        });
    }

    /**
     * @return int
     */
    private function calculateTotalLeapdayOccurrences(): int
    {
        return $this->calendar->timespans->sum(function($timespan){
            $timespanOccurrences = $timespan->occurrences($this->year);
            return $timespan->leapDays->sum(function($leapDay) use ($timespanOccurrences, $timespan){
                return $leapDay->occurrences($timespanOccurrences);
            });
        });
    }

    /**
     * @return int
     */
    private function calculateHistoricalIntercalaryCount(): int
    {
        return $this->calendar->timespans->sum(function($timespan){
            $timespanOccurrences = $timespan->occurrences($this->year);
            $timespanIntercalaryDays = $timespan->intercalary ? $timespanOccurrences * $timespan->length : 0;
            $leapDayIntercalaryDays = $timespan->leapDays->sum(function($leapDay) use ($timespanOccurrences, $timespan){
                return $leapDay->intercalary || $timespan->intercalary ? $leapDay->occurrences($timespanOccurrences) : 0;
            });
            return $timespanIntercalaryDays + $leapDayIntercalaryDays;
        });
    }

    /**
     * @return Collection
     */
    private function calculateTimespanCounts(): Collection
    {
        return $this->calendar->timespans
            ->map->occurrences($this->year);
    }

    /**
     * @return int
     */
    private function calculateNumberTimespans(): int
    {
        return $this->calculateTimespanCounts()->sum();
    }

    /**
     * @return int
     */
    private function calculateWeekdayIndex(): int
    {
        return $this->determineWeekdayIndex($this->calculateEpoch(), $this->calculateHistoricalIntercalaryCount());
    }

    /**
     * @param int $epoch
     * @param int $historicalIntercalaryCount
     * @return int
     */
    protected function determineWeekdayIndex(int $epoch, int $historicalIntercalaryCount): int
    {
        if(!$this->calendar->overflows_week) {
            return 0;
        }

        $weekdaysCount = $this->calendar->global_week->count();
        $totalWeekdaysBeforeToday = ($epoch - $historicalIntercalaryCount + intval($this->calendar->first_day) - 1);

        $weekday = $totalWeekdaysBeforeToday % $weekdaysCount;

        // If we're on a negative year, the result is negative, so add weekdays to result
        return ($weekday < 0)
            ? $weekday + $weekdaysCount
            : $weekday;
    }

    private function calculateEraYear(): int
    {

        $eras = $this->calendar->eras
             ->filter->restartsYearCount()
             ->filter->beforeYearInclusive($this->year)
             ->sortByDesc('year');

        if(!$eras->count()) return $this->calendar->year;

        $eraYear = $this->calendar->year - $eras->last()->calculateEraYear($eras);

        return $this->calendar->setting('year_zero_exists') ? $eraYear : $eraYear+1;
    }
}
