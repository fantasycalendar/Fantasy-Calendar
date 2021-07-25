<?php

namespace App\Services\EpochService;


use App\Calendar;
use App\Facades\Epoch as EpochFactory;
use App\Services\EpochService\Processor\InitialStateWithEras;

class EpochCalculator
{
    private Calendar $calendar;
    private $targetEpoch;
    private $averageYearLength;

    /**
     * EpochCalculator constructor.
     * @param Calendar $calendar
     */
    public function __construct(Calendar $calendar)
    {
        $this->calendar = $calendar;
    }

    /**
     * @param Calendar $calendar
     * @return EpochCalculator
     */
    public static function forCalendar(Calendar $calendar): EpochCalculator
    {
        return new self($calendar);
    }

    public function calculate(int $epoch)
    {
        $this->averageYearLength= $this->calendar->average_year_length;

        $this->targetEpoch = $epoch;
        // Make a best guess of epoch's year, based on year length
        // Hard-coded to 365 until average year length is implemented.

        $guessYear = floor($epoch / $this->averageYearLength) + $this->calendar->setting('year_zero_exists') + 1;

        $year = $this->resolveYear($guessYear);

        $this->calendar->setDate($year, 0, 1);

        $yearStartEpoch = EpochFactory::forCalendarYear($this->calendar)->first();
        $diff = $epoch - $yearStartEpoch->epoch;

        return EpochFactory::incrementDays($this->calendar, $yearStartEpoch, $diff);
    }

    private function resolveYear($guessYear): int
    {
        $calendar = $this->calendar->replicate();

        do {
            $calendar->setDate($guessYear, 0, 1);

            $lowerGuess = InitialStateWithEras::generateFor($calendar)->get('epoch');
            $higherGuess = InitialStateWithEras::generateFor($calendar->addYear())->get('epoch');


            $guessYear += $this->refinedEstimationDistance($lowerGuess, $higherGuess);
        } while($lowerGuess > $this->targetEpoch || $higherGuess <= $this->targetEpoch);

        return $guessYear;
    }

    private function refinedEstimationDistance($lowerGuess, $higherGuess): int
    {
        if($lowerGuess <= $this->targetEpoch && $higherGuess > $this->targetEpoch) return 0;

        $distance = abs($lowerGuess - $this->targetEpoch);
        $offByYears = $distance / $this->averageYearLength;

        if($offByYears <= 1) {
            return 1;
        }

        if ($higherGuess <= $this->targetEpoch) {
            return floor($offByYears);
        }

        return -ceil($offByYears);
    }
}
