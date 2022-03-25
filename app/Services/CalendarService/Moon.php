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

    public function toArray()
    {
        return [
            'name' => $this->name,
            'custom_phase' => $this->custom_phase,
            'color' => $this->color,
            'hidden' => $this->hidden,
            'custom_cycle' => $this->custom_cycle,
            'cycle_rounding' => $this->cycle_rounding,
            'cycle' => $this->cycle,
            'shift' => $this->shift,
            'granularity' => $this->granularity,
        ];
    }

    public function calculatePhases(int $epoch)
    {
        if($this->custom_phase) {
            $customCycle = explode(',', $this->custom_cycle);

            return [
                $customCycle[abs($epoch % count($customCycle))],
                round(abs($epoch / count($customCycle)))
            ];
        }

        $totalCyclePosition = ($epoch - $this->shift) / $this->cycle;
        $roundFunc = $this->cycle_rounding;

        return [
            $roundFunc(($totalCyclePosition - floor($totalCyclePosition)) * $this->granularity) % $this->granularity,
            $roundFunc(abs($totalCyclePosition) + 1)
        ];
    }

    public function setEpoch(int $epoch)
    {
        $this->epoch = $epoch;
        return $this;
    }
}
