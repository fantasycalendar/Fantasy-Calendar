<?php


namespace App\Services\CalendarService\Month;


use App\Services\CalendarService\Epoch;
use App\Services\CalendarService\Month;
use Illuminate\Support\Collection;

class SectionsCollection extends \Illuminate\Support\Collection
{
    public Collection $sections;

    public function __construct() {
        $this->sections = collect();

        parent::__construct();
    }

    public function fresh(): SectionsCollection
    {
        $this->sections->push($this->all());
        $this->items = [];

        return $this;
    }

    public function insertLeaps($leapdays, $month, $day): SectionsCollection
    {
        $this->fresh();

        $leapdaysWithEpochs = $leapdays->map(function($leapDay, $index) use ($month, $day){
            $epoch = Epoch::forMonth($month, null, $day + $index + 1)->toArray();
            $epoch['leap_day'] = $leapDay->toArray();

            return $epoch;
        });

        $this->sections->push($leapdaysWithEpochs);

        return $this;
    }

    public function build(Month $month)
    {
        $sectionBreaks = $month->getSectionBreaks();

        foreach(range(1, $month->length) as $day) {
            $offset = $month->leapdays
                ->filter->intercalary
                ->reject->not_numbered
                ->where('day', '<', $day)
                ->count();

            $trueDay = $day + $offset;

            $this->push(Epoch::forMonth($month, null, $trueDay)->toArray());

            if($sectionBreaks->has($day)) {
                $this->insertLeaps($sectionBreaks->get($day), $month, $day);
            }
        }

        return $this->fresh();
    }
}
