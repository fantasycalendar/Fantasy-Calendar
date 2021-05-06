<?php


namespace App\Services\CalendarService\Month;


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

    public function insertLeaps($leapdays): SectionsCollection
    {
        $this->fresh();
        $this->sections->push($leapdays->map->toArray()->toArray());

        return $this;
    }

    public function build(Month $month)
    {
        $sectionBreaks = $month->getSectionBreaks();
        $nonIntercalaryLength = $month->baseLength + $month->leapdays->reject->intercalary->count();

        foreach(range(1, $nonIntercalaryLength) as $day) {
            $offset = $month->leapdays
                ->filter->intercalary
                ->reject->not_numbered
                ->where('day', '<', $day)
                ->count();

            $this->push($day + $offset);

            if($sectionBreaks->has($day)) {
                $this->insertLeaps($sectionBreaks->get($day));
            }
        }

        return $this->fresh();
    }
}
