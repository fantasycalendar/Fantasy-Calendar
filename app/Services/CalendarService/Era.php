<?php


namespace App\Services\CalendarService;


use App\Facades\Epoch;
use App\Facades\Mustache;
use App\Services\EpochService\Processor\InitialState;
use App\Services\EpochService\Processor\InitialStateWithEras;
use Illuminate\Support\Arr;

class Era
{
    public $name;
    public $formatting;
    public $description;
    public $settings;
    public $date;
    private $year;
    private $day;
    private $timespan;

    public function __construct($attributes)
    {
        $this->name = $attributes['name'];
        $this->formatting = $attributes['formatting'];
        $this->description = $attributes['description'];
        $this->settings = $attributes['settings'];
        $this->date = $attributes['date'];
        $this->year = $attributes['date']['year'];
        $this->day = $attributes['date']['day'];
        $this->timespan = $attributes['date']['timespan'];
    }

    public function getEpochSubtractables($calendar)
    {
        $eraEpoch = Epoch::forEra($this);

        $eraFreeCalendar = $calendar
            ->replicate()
            ->setDate($this->year + 1)
            ->startOfYear();

        $eraFreeEpoch = (new InitialState($eraFreeCalendar))
            ->generateInitialProperties()
            ->getState();
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
