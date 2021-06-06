<?php


namespace App\Services\CalendarService;


use App\Facades\Epoch;
use App\Facades\Mustache;
use App\Services\EpochService\Processor\InitialState;
use Illuminate\Support\Arr;

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

    public function getEpochSubtractables($calendar)
    {

        $eraEpoch = Epoch::forEra($this);

        $eraFreeCalendar = $calendar
            ->replicate()
            ->setDate($this->year + 1)
            ->startOfYear();

        $eraFreeEpoch = (new InitialState($eraFreeCalendar))
            ->generateInitialProperties()->collect();

        $timespanCounts = $eraFreeEpoch->get('timespanCounts')->map(function($timespanCount, $index) use ($eraEpoch) {
            return $timespanCount - $eraEpoch->timespanCounts->get($index);
        });

        return collect([
            'timespanCounts' => $timespanCounts,
            'epoch' => $eraFreeEpoch->get('epoch') - $eraEpoch->epoch,
            'historicalIntercalaryCount' => $eraFreeEpoch->get('historicalIntercalaryCount') - $eraEpoch->historicalIntercalaryCount,
            'numberTimespans' => $eraFreeEpoch->get('numberTimespans') - $eraEpoch->numberTimespans
        ]);
    }

    public function beforeYear($year)
    {
        return $year > $this->year;
    }

    public function endsYear()
    {
        return $this->getSetting('ends_year', false) !== false;
    }

    public function getSetting($name, $default = false)
    {
        return Arr::get($this->settings, $name, $default);
    }

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
