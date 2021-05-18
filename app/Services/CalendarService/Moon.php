<?php


namespace App\Services\CalendarService;


class Moon
{

    public $name;
    public $custom_phase;
    public $color;
    public $hidden;
    public $custom_cycle;
    public $cycle_rounding;
    public $cycle;
    public $shift;
    public $granularity;
    private $epoch;

    public function __construct($attributes)
    {
        $this->name = $attributes['name'];
        $this->custom_phase = $attributes['custom_phase'] ?? false;
        $this->color = $attributes['color'];
        $this->hidden = $attributes['hidden'];
        $this->custom_cycle = $attributes['custom_cycle'] ?? "";
        $this->cycle_rounding = $attributes['cycle_rounding'] ?? "round";
        $this->cycle = $attributes['cycle'];
        $this->shift = $attributes['shift'];
        $this->granularity = $attributes['granularity'];
    }

    public function setEpoch(int $epoch)
    {
        $this->epoch = $epoch;
        return $this;
    }

    public function getPhases()
    {

        if($this->custom_phase)
        {
            $cycle = explode(",", $this->custom_cycle);
            $cycleLength = count($cycle);

            $cycleIndex = abs($this->epoch % $cycleLength);
            $phase = $cycle[$cycleIndex];

            $totalPhases = abs($this->epoch / $cycleLength)+1;
            $totalPhaseCount = round($totalPhases);
        }
        else
        {

            $totalCyclePosition = ($this->epoch - $this->shift) / $this->cycle;
            $normalizedCyclePosition = $totalCyclePosition - floor($totalCyclePosition);

            if($this->cycle_rounding === "floor")
            {
                $phase = floor($normalizedCyclePosition * $this->granularity) % $this->granularity;
                $totalPhaseCount = floor(abs($totalCyclePosition)+1);
            }
            else if($this->cycle_rounding == "round")
            {
                $phase = round($normalizedCyclePosition * $this->granularity) % $this->granularity;
                $totalPhaseCount = round(abs($totalCyclePosition)+1);
            }
            else
            {
                $phase = ceil($normalizedCyclePosition * $this->granularity) % $this->granularity;
                $totalPhaseCount = ceil(abs($totalCyclePosition)+1);
            }

        }


        return [
            "phase" => $phase,
            "totalPhaseCount" => $totalPhaseCount
        ];
    }
}
