<?php


namespace App\Services\CalendarService;


class Interval
{
    public string $interval;
    public bool $negated;
    public bool $ignores_offset;
    public int $years;

    /**
     * Interval constructor.
     * @param $interval
     */
    public function __construct($interval)
    {
        $this->interval = $interval;
        $this->negated = str_contains($interval, '!');
        $this->ignores_offset = str_contains($interval, '+');
        $this->years = intval(str_replace('!', '', $interval));
    }

    public function voteOnYear($year)
    {
        if(($year % $this->years) === 0) {
            if($this->negated) return 'deny';

            return 'allow';
        }

        return 'abstain';
    }
}
