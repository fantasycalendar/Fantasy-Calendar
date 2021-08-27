<?php

namespace Tests\Unit;

use App\Calendar;
use App\Facades\Epoch as EpochFactory;
use PHPUnit\Framework\TestCase;

class EpochTest extends TestCase
{
    /**
     * A basic unit test example.
     *
     * @return void
     */
    public function test_example()
    {

        $calendar = new Calendar([
            "dynamic_data" => [
                "epoch" => 0,
                "year" => 0,
                "timespan" => 0,
                "day" => 1
            ],
            "static_data" => [
                "first_day" => 1,
                "overflow" => true,
                "year_data" => [
                    "timespans" => [
                        [
                            "name" => "No leap",
                            "type" => "month",
                            "interval" => 1,
                            "offset" => 0,
                            "length" => 6
                        ],
                        [
                            "name" => "-9, -6, -3, 0, 3, 6, 9",
                            "type" => "month",
                            "interval" => 3,
                            "offset" => 0,
                            "length" => 5
                        ],
                        [
                            "name" => "-10, -7, -4, -1, 2, 5, 8",
                            "type" => "month",
                            "interval" => 3,
                            "offset" => 2,
                            "length" => 10
                        ]
                    ],
                    "leap_days" => [
                        [
                            "intercalary" => false,
                            "timespan" => 0,
                            "interval" => "50,+2",
                            "offset" => 1
                        ]
                    ],
                    "global_week" => [
                        "Weekday 1",
                        "Weekday 2",
                        "Weekday 3",
                        "Weekday 4",
                        "Weekday 5",
                        "Weekday 6"
                    ]
                ],
                "settings" => [
                    "year_zero_exists" => true
                ]
            ]
        ]);

        $fromYear = -100;
        $toYear = 100;

        $calendar->setDate($fromYear);

        $epochs = EpochFactory::forCalendarYear($calendar);

        $lastYearEndEpoch = $epochs->last()->epoch;

        dump($fromYear . ": " . $epochs->first()->epoch . " - " . $epochs->last()->epoch);

        $fromYear++;
        $failed = false;
        for($year = $fromYear; $year < $toYear; $year++){

            $calendar->setDate($year);

            $epochs = EpochFactory::forCalendarYear($calendar);

            $thisYearStartEpoch = $epochs->first()->epoch;

            dump($year . ": " . $thisYearStartEpoch . " - " . $epochs->last()->epoch);

            if($lastYearEndEpoch !== $thisYearStartEpoch-1){
                $failed = true;
                break;
            }

            $lastYearEndEpoch = $epochs->last()->epoch;

        }

        $this->assertFalse($failed);

    }
}
