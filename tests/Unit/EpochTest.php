<?php

namespace Tests\Unit;

use App\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Calendar;
use App\Facades\Epoch as EpochFactory;
use PHPUnit\Framework\TestCase;

class EpochTest extends TestCase
{
    use RefreshDatabase;

    /**
     * A basic unit test example.
     *
     * @return void
     */
    public function test_example()
    {

        $user = User::Factory()->create();

        $harptos = Calendar::Factory()
            ->for($user)
            ->create([
                "dynamic_data" => [
                    "epoch" => 0,
                    "year" => 0,
                    "timespan" => 0,
                    "day" => 1
                ],
                "static_data" => [
                    "first_day" => 1,
                    "overflow" => false,
                    "year_data" => [
                        "timespans" => [
                            [
                                "name" => "Hammer",
                                "type" => "month",
                                "length" => 30,
                                "interval" => 1,
                                "offset" => 0
                            ],
                            [
                                "name" => "Midwinter",
                                "type" => "intercalary",
                                "length" => 1,
                                "interval" => 1,
                                "offset" => 0
                            ],
                            [
                                "name" => "Alturiak (The Claw of Winter)",
                                "type" => "month",
                                "length" => 30,
                                "interval" => 1,
                                "offset" => 0
                            ],
                            [
                                "name" => "Ches (The Claw of the Sunsets)",
                                "type" => "month",
                                "length" => 30,
                                "interval" => 1,
                                "offset" => 0
                            ],
                            [
                                "name" => "Tarsakh (The Claw of Storms)",
                                "type" => "month",
                                "length" => 30,
                                "interval" => 1,
                                "offset" => 0
                            ],
                            [
                                "name" => "Greengrass",
                                "type" => "intercalary",
                                "length" => 1,
                                "interval" => 1,
                                "offset" => 0
                            ],
                            [
                                "name" => "Mirtul (The Melting)",
                                "type" => "month",
                                "length" => 30,
                                "interval" => 1,
                                "offset" => 0
                            ],
                            [
                                "name" => "Kythorn (The Time of Flowers)",
                                "type" => "month",
                                "length" => 30,
                                "interval" => 1,
                                "offset" => 0
                            ],
                            [
                                "name" => "Flamerule (Summertide)",
                                "type" => "month",
                                "length" => 30,
                                "interval" => 1,
                                "offset" => 0
                            ],
                            [
                                "name" => "Midsummer",
                                "type" => "intercalary",
                                "length" => 1,
                                "interval" => 1,
                                "offset" => 0
                            ],
                            [
                                "name" => "Eleasis (Highsun)",
                                "type" => "month",
                                "length" => 30,
                                "interval" => 1,
                                "offset" => 0
                            ],
                            [
                                "name" => "Eleint (The Fading)",
                                "type" => "month",
                                "length" => 30,
                                "interval" => 1,
                                "offset" => 0
                            ],
                            [
                                "name" => "Highharvestide",
                                "type" => "intercalary",
                                "length" => 1,
                                "interval" => 1,
                                "offset" => 0
                            ],
                            [
                                "name" => "Marpenoth (Leaffall)",
                                "type" => "month",
                                "length" => 30,
                                "interval" => 1,
                                "offset" => 0
                            ],
                            [
                                "name" => "Uktar (The Rotting)",
                                "type" => "month",
                                "length" => 30,
                                "interval" => 1,
                                "offset" => 0
                            ],
                            [
                                "name" => "The Feast of the Moon",
                                "type" => "intercalary",
                                "length" => 1,
                                "interval" => 1,
                                "offset" => 0
                            ],
                            [
                                "name" => "Nightal (The Drawing Down)",
                                "type" => "month",
                                "length" => 30,
                                "interval" => 1,
                                "offset" => 0
                            ]
                        ],
                        "leap_days" => [
                            [
                                "intercalary" => false,
                                "timespan" => 9,
                                "interval" => "4",
                                "offset" => 0
                            ]
                        ],
                        "global_week" => [
                            "Weekday 1",
                            "Weekday 2",
                            "Weekday 3",
                            "Weekday 4",
                            "Weekday 5",
                            "Weekday 6",
                            "Weekday 7",
                            "Weekday 8",
                            "Weekday 9",
                            "Weekday 10"
                        ]
                    ],
                    "settings" => [
                        "year_zero_exists" => false
                    ]
                ]
            ]);

        $this->testCalendar($harptos);

        $crazyLeapCalendar = Calendar::Factory()
            ->for($user)
            ->create([
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

        $this->testCalendar($crazyLeapCalendar);

    }

    private function testCalendar($calendar)
    {

        $fromYear = -100;
        $toYear = 100;

        $calendar->setDate($fromYear);

        $epochs = EpochFactory::forCalendarYear($calendar);

        $lastYearEndEpoch = $epochs->last()->epoch;

        // dump($fromYear . ": " . $epochs->first()->epoch . " - " . $epochs->last()->epoch);

        $fromYear++;
        for($year = $fromYear; $year < $toYear; $year++){

            if(!$calendar->setting("year_zero_exists") && $year === 0){
                continue;
            }

            $calendar->setDate($year);

            $epochs = EpochFactory::forCalendarYear($calendar);

            $thisYearStartEpoch = $epochs->first()->epoch;

            if(($calendar->setting("year_zero_exists") && $year === 0) || (!$calendar->setting("year_zero_exists") && $year === 1)){
                $this->assertTrue($thisYearStartEpoch === 0);
            }

            // dump($year . ": " . $lastYearEndEpoch . " : " . $thisYearStartEpoch);

            $this->assertTrue($lastYearEndEpoch === $thisYearStartEpoch-1);

            $lastYearEndEpoch = $epochs->last()->epoch;

        }

    }
}
