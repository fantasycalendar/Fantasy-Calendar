<?php


namespace App\Services\CalendarService\Month;


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
}
