<?php


namespace App\Services\CalendarService;


class Moon
{

    public $name;
    public $custom_phase;
    public $color;
    public $hidden;
    public $custom_cycle;
    public $cycle;
    public $shift;
    public $granularity;

    public function __construct($attributes)
    {
        $this->name = $attributes['name'];
        $this->custom_phase = $attributes['custom_phase'];
        $this->color = $attributes['color'];
        $this->hidden = $attributes['hidden'];
        $this->custom_cycle = $attributes['custom_cycle'];
        $this->cycle = $attributes['cycle'];
        $this->shift = $attributes['shift'];
        $this->granularity = $attributes['granularity'];
    }

    public function setEpoch($epoch){
        return $this;
    }

    public function getHistoricalPhaseCounts(){
        return 0;
    }

    public function getPhase(){
        return 0;
    }
}
