<?php


namespace App\Services\EpochService\Processor;


class InitialState extends State
{
    public static function generateFor($calendar)
    {
        return (new self($calendar))->generateInitialProperties()->getState();
    }

    private function generateInitialProperties()
    {
        // Generate and set any initial properties used for the initial state

        return $this;
    }
}
