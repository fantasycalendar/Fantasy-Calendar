<?php


namespace App\Services\EpochService\Processor;


use App\Facades\Epoch;

class InitialState extends State
{
    public static function generateFor($calendar)
    {
        return (new self($calendar))->generateInitialProperties()->getState();
    }

    public function generateInitialProperties()
    {
        // Generate and set any initial properties used for the initial state



        return $this;
    }
}

// |------------|---------------------|
//              ^                     ^
//          Era start           Next year start
