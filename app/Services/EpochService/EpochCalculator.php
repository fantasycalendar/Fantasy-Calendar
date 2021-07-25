<?php


namespace App\Services\EpochService;


use App\Calendar;
use App\Facades\Epoch as EpochFactory;
use App\Services\EpochService\Processor\InitialStateWithEras;
use Illuminate\Support\Collection;

class EpochCalculator
{
    private Calendar $calendar;
    private Collection $initialStates;
    private $targetEpoch;

    /**
     * EpochCalculator constructor.
     * @param Calendar $calendar
     */
    public function __construct(Calendar $calendar)
    {
        $this->calendar = $calendar;
        $this->initialStates = collect();
    }

    public static function forCalendar(Calendar $calendar)
    {
        return new self($calendar);
    }

    public function calculate(int $epoch)
    {
        $this->targetEpoch = $epoch;
        // Make a best guess of epoch's year, based on year length
        // Hard-coded to 365 until average year length is implemented.
        $guessYear = floor($epoch / $this->calendar->average_year_length);

        logger()->debug("Starting guess process.\nAverage year length: {$this->calendar->average_year_length}\nSearching for epoch: {$epoch}");

        $year = $this->resolveYear($guessYear);
        logger()->debug("Landed on {$year} after our checking");

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

            logger()->debug("Checking between {$guessYear} and " . ($guessYear + 1));

            if($lowerGuess > $this->targetEpoch) {
                $guessYear--;
            } elseif ($higherGuess <= $this->targetEpoch) {
                $guessYear++;
            }

        } while($lowerGuess > $this->targetEpoch || $higherGuess <= $this->targetEpoch);

        return $guessYear;
    }
}
