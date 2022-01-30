<?php


namespace App\Services\CalendarService;


use App\Facades\Epoch;
use App\Facades\Mustache;
use App\Services\EpochService\Processor\InitialState;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;

class Era
{
    public $name;
    public $formatting;
    public $description;
    public $settings;
    public $date;
    public $year;
    public $day;
    public $month;

    public function __construct($attributes)
    {
        $this->name = $attributes['name'];
        $this->formatting = $attributes['formatting'] ?? "";
        $this->description = $attributes['description'];
        $this->settings = $attributes['settings'];
        $this->date = $attributes['date'];
        $this->year = $attributes['date']['year'];
        $this->day = $attributes['date']['day'];
        $this->month = $attributes['date']['timespan'];
    }

    /**
     * Determines the data that is missing from the era ending the year early, and calculates
     * the differences from a normal year so that the state of the epoch is kept accurate
     *
     * @param $calendar
     * @return Collection
     */
    public function getEpochSubtractables($calendar): Collection
    {
        $eraEpoch = Epoch::forEra($this);

        $eraFreeCalendar = $calendar
            ->replicate()
            ->setDate($this->year + 1)
            ->startOfYear();

        $eraFreeEpoch = InitialState::generateFor($eraFreeCalendar);

        $timespanCounts = $eraFreeEpoch->get('timespanCounts')->map(function($timespanCount, $index) use ($eraEpoch) {
            return $timespanCount - $eraEpoch->timespanCounts->get($index);
        });

        return collect([
            'timespanCounts' => $timespanCounts,
            'epoch' => $eraFreeEpoch->get('epoch') - $eraEpoch->epoch - 1,
            'historicalIntercalaryCount' => $eraFreeEpoch->get('historicalIntercalaryCount') - $eraEpoch->historicalIntercalaryCount,
            'numberTimespans' => $eraFreeEpoch->get('numberTimespans') - $eraEpoch->numberTimespans
        ]);
    }

    /**
     * @return bool
     */
    public function isStartingEra(): bool
    {
        return $this->getSetting('starting_era', false) !== false;
    }

    /**
     * @return bool
     */
    public function restartsYearCount(): bool
    {
        return $this->getSetting('restart', false) !== false;
    }

    /**
     * @param $year
     * @return bool
     */
    public function beforeYear($year): bool
    {
        return $year > $this->year;
    }

    /**
     * @param $year
     * @return bool
     */
    public function beforeYearInclusive($year): bool
    {
        return $year >= $this->year;
    }

    /**
     * @return bool
     */
    public function endsYear(): bool
    {
        return $this->getSetting('ends_year', false) !== false;
    }

    /**
     * @param $year
     * @return bool
     */
    public function endsGivenYear($year): bool
    {
        return $this->endsYear() && $year == $this->year;
    }

    public function getSetting($name, $default = false)
    {
        return Arr::get($this->settings, $name, $default);
    }

    public function calculateEraYear(Collection $eras)
    {
        $eras->pop();

        if(!$eras->count()) return $this->year;

        return $eras->sum->calculateEraYear($eras);
    }

    /**
     * @param $year
     * @param $eraYear
     * @return mixed
     */
    public function getFormat($year, $eraYear)
    {
        return Mustache::render($this->formatting, [
            'year' => $year,
            'abs_year' => abs($year),
            'nth_year' => ordinal($year),
            'abs_nth_year' => ordinal(abs($year)),
            'era_year' => $eraYear,
            'era_nth_year' => ordinal($eraYear),
            'era_name' => $this->name
        ]);
    }
}
