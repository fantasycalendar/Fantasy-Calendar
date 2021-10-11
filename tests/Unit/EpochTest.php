<?php

namespace Tests\Unit;

use App\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Calendar;
use App\Facades\Epoch as EpochFactory;
use Tests\TestCase;

class EpochTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test some example calendars to make sure our epoch calculation is correct
     *
     * @return void
     */
    public function test_example_calendars()
    {

        $user = User::Factory()->create();

        /* ---------------------------------------------------------------------- */

        //
        // public function testOverlappingEdgeCasesTe()
        $calendar = Calendar::Factory()
            ->for($user)
            ->create([
                "name" => "Calendário Sundrianus",
                "static_data" => [
                    "year_data" => [
                        "first_day" => 3,
                        "overflow" => true,
                        "timespans" => [
                            [
                                "name" => "Estrela do amanhã",
                                "type" => "intercalary",
                                "interval" => 1,
                                "offset" => 0,
                                "length" => 31
                            ],
                            [
                                "name" => "Sol do amanhecer",
                                "type" => "intercalary",
                                "interval" => 1,
                                "offset" => 0,
                                "length" => 28
                            ],
                            [
                                "name" => "Coração de fogo",
                                "type" => "intercalary",
                                "interval" => 1,
                                "offset" => 0,
                                "length" => 30
                            ],
                            [
                                "name" => "Primeira semente",
                                "type" => "intercalary",
                                "interval" => 1,
                                "offset" => 0,
                                "length" => 31
                            ],
                            [
                                "name" => "Segunda semente",
                                "type" => "intercalary",
                                "interval" => 1,
                                "offset" => 0,
                                "length" => 30
                            ],
                            [
                                "name" => "Ultima semente",
                                "type" => "intercalary",
                                "interval" => 1,
                                "offset" => 0,
                                "length" => 30
                            ],
                            [
                                "name" => "Meio do ano",
                                "type" => "intercalary",
                                "interval" => 1,
                                "offset" => 0,
                                "length" => 31
                            ],
                            [
                                "name" => "Grandeza solar",
                                "type" => "intercalary",
                                "interval" => 1,
                                "offset" => 0,
                                "length" => 31
                            ],
                            [
                                "name" => "Queda polar",
                                "type" => "intercalary",
                                "interval" => 1,
                                "offset" => 0,
                                "length" => 30
                            ],
                            [
                                "name" => "Garra d'água",
                                "type" => "intercalary",
                                "interval" => 1,
                                "offset" => 0,
                                "length" => 31
                            ],
                            [
                                "name" => "Crepúsculo solar",
                                "type" => "intercalary",
                                "interval" => 1,
                                "offset" => 0,
                                "length" => 30
                            ],
                            [
                                "name" => "Estrela do entardecer",
                                "type" => "intercalary",
                                "interval" => 1,
                                "offset" => 0,
                                "length" => 31
                            ],
                        ],
                        "leap_days" => [],
                        "global_week" => [
                            "Montag",
                            "Dienstag",
                            "Mitvock",
                            "Donnerstag",
                            "Freitag",
                            "Samstag",
                            "Sonntag"
                        ]
                    ],
                    "settings" => [
                        "year_zero_exists" => false
                    ]
                ]
            ]);

        $this->testCalendar($calendar);

        /* ---------------------------------------------------------------------- */

        $calendar = Calendar::Factory()
            ->for($user)
            ->create([
                "name" => "Tal'Dorei Player",
                "static_data" => [
                    "year_data" => [
                        "first_day" => 2,
                        "overflow" => true,
                        "timespans" => [
                            [
                                "name" => "Horisal (January)",
                                "type" => "month",
                                "interval" => 1,
                                "offset" => 0,
                                "length" => 29
                            ],
                            [
                                "name" => "Misuthar (Febuary)",
                                "type" => "month",
                                "interval" => 1,
                                "offset" => 0,
                                "length" => 30
                            ],
                            [
                                "name" => "Dualahei (March)",
                                "type" => "month",
                                "interval" => 1,
                                "offset" => 0,
                                "length" => 30
                            ],
                            [
                                "name" => "Thunsheer (April)",
                                "type" => "month",
                                "interval" => 1,
                                "offset" => 0,
                                "length" => 31
                            ],
                            [
                                "name" => "Unndilar (May)",
                                "type" => "month",
                                "interval" => 1,
                                "offset" => 0,
                                "length" => 28
                            ],
                            [
                                "name" => "Brussendar (June)",
                                "type" => "month",
                                "interval" => 1,
                                "offset" => 0,
                                "length" => 31
                            ],
                            [
                                "name" => "Sydenstar (July)",
                                "type" => "month",
                                "interval" => 1,
                                "offset" => 0,
                                "length" => 32
                            ],
                            [
                                "name" => "Fessuran (August)",
                                "type" => "month",
                                "interval" => 1,
                                "offset" => 0,
                                "length" => 29
                            ],
                            [
                                "name" => "Quen'pillar (September)",
                                "type" => "month",
                                "interval" => 1,
                                "offset" => 0,
                                "length" => 27
                            ],
                            [
                                "name" => "Cuersaar (October)",
                                "type" => "month",
                                "interval" => 1,
                                "offset" => 0,
                                "length" => 29
                            ],
                            [
                                "name" => "Duscar (December)",
                                "type" => "month",
                                "interval" => 1,
                                "offset" => 0,
                                "length" => 32
                            ],
                        ],
                        "leap_days" => [],
                        "global_week" => [
                            "Miresen (Sunday)",
                            "Grissen (Monday)",
                            "Whelsen (Tuesday)",
                            "Conthsen (Wednesday)",
                            "Folsen (Thursday)",
                            "Yulisen (Friday)",
                            "Da'leysen (Saturday)"
                        ]
                    ],
                    "settings" => [
                        "year_zero_exists" => true
                    ]
                ]
            ]);

        $this->testCalendar($calendar);

        $calendar->setDate(1016);

        $epochs = EpochFactory::forCalendarYear($calendar);

        $epoch = $epochs->first();

        dump("Epoch should be 333248, is " . $epoch->epoch);
        $this->assertTrue($epoch->epoch === 333248);
        dump("Weekday index should be 0, is " . $epoch->visualWeekdayIndex);
        $this->assertTrue($epoch->visualWeekdayIndex === 0);

        /* ---------------------------------------------------------------------- */

        $calendar = Calendar::Factory()
            ->for($user)
            ->create([
                "name" => "Hasadria",
                "static_data" => [
                    "year_data" => [
                        "first_day" => 2,
                        "overflow" => true,
                        "timespans" => [
                            [
                                "name" => "Vohault",
                                "type" => "month",
                                "interval" => 1,
                                "offset" => 0,
                                "length" => 30
                            ],
                            [
                                "name" => "Kiradan",
                                "type" => "month",
                                "interval" => 1,
                                "offset" => 0,
                                "length" => 32
                            ],
                            [
                                "name" => "Zihelm",
                                "type" => "month",
                                "interval" => 1,
                                "offset" => 0,
                                "length" => 34
                            ],
                            [
                                "name" => "Felwict",
                                "type" => "month",
                                "interval" => 1,
                                "offset" => 0,
                                "length" => 29
                            ],
                            [
                                "name" => "Shekwick",
                                "type" => "month",
                                "interval" => 1,
                                "offset" => 0,
                                "length" => 33
                            ],
                            [
                                "name" => "Fre",
                                "type" => "month",
                                "interval" => 1,
                                "offset" => 0,
                                "length" => 31
                            ],
                            [
                                "name" => "Xion",
                                "type" => "month",
                                "interval" => 1,
                                "offset" => 0,
                                "length" => 32
                            ],
                            [
                                "name" => "Onna",
                                "type" => "month",
                                "interval" => 1,
                                "offset" => 0,
                                "length" => 31
                            ],
                            [
                                "name" => "Barbok",
                                "type" => "month",
                                "interval" => 1,
                                "offset" => 0,
                                "length" => 28
                            ],
                            [
                                "name" => "Aether",
                                "type" => "month",
                                "interval" => 1,
                                "offset" => 0,
                                "length" => 35
                            ],
                            [
                                "name" => "Vaylex",
                                "type" => "month",
                                "interval" => 1,
                                "offset" => 0,
                                "length" => 33
                            ],
                            [
                                "name" => "Velwim",
                                "type" => "month",
                                "interval" => 1,
                                "offset" => 0,
                                "length" => 34
                            ],
                        ],
                        "leap_days" => [
                            [
                                "intercalary" => false,
                                "timespan" => 1,
                                "interval" => "4",
                                "offset" => 0
                            ]
                        ],
                        "global_week" => [
                            "Sunday",
                            "Monday",
                            "Tuesday",
                            "Wednesday",
                            "Thursday",
                            "Friday",
                            "Saturday"
                        ]
                    ],
                    "settings" => [
                        "year_zero_exists" => true
                    ]
                ]
            ]);

        $this->testCalendar($calendar);

        $calendar->setDate(53);

        $epochs = EpochFactory::forCalendarYear($calendar);

        $epoch = $epochs->getByDate(53, 10, 23);

        dump("Epoch should be 20597, is " . $epoch->epoch);
        $this->assertTrue($epoch->epoch === 20597);
        dump("Weekday index should be 4, is " . $epoch->visualWeekdayIndex);
        $this->assertTrue($epoch->visualWeekdayIndex === 4);

        /* ---------------------------------------------------------------------- */

        $calendar = Calendar::Factory()
            ->for($user)
            ->create([
                "name" => "Haptos",
                "static_data" => [
                    "year_data" => [
                        "first_day" => 1,
                        "overflow" => false,
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

        $this->testCalendar($calendar);

        /* ---------------------------------------------------------------------- */

        $calendar = Calendar::Factory()
            ->for($user)
            ->create([
                "name" => "Crazy Leap Calendar",
                "static_data" => [
                    "year_data" => [
                        "first_day" => 1,
                        "overflow" => true,
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

        $this->testCalendar($calendar, -1000, 1000);

        /* ---------------------------------------------------------------------- */

        $calendar = Calendar::Factory()
            ->for($user)
            ->create([
                "name" => "Leap Day Chaos v1",
                "static_data" => [
                    "year_data" => [
                        "first_day" => 1,
                        "overflow" => true,
                        "timespans" => [
                            [
                                "name" => "Somemonth",
                                "type" => "month",
                                "interval" => 1,
                                "offset" => 0,
                                "length" => 31
                            ],
                            [
                                "name" => "Anothermonth",
                                "type" => "month",
                                "interval" => 1,
                                "offset" => 0,
                                "length" => 30
                            ],
                            [
                                "name" => "Month 3",
                                "type" => "month",
                                "interval" => 1,
                                "offset" => 0,
                                "length" => 29
                            ],
                            [
                                "name" => "Month 4",
                                "type" => "month",
                                "interval" => 1,
                                "offset" => 0,
                                "length" => 28
                            ],
                            [
                                "name" => "Month 5",
                                "type" => "month",
                                "interval" => 1,
                                "offset" => 0,
                                "length" => 27
                            ],
                            [
                                "name" => "Month 6",
                                "type" => "month",
                                "interval" => 1,
                                "offset" => 0,
                                "length" => 32
                            ],
                            [
                                "name" => "Month 7",
                                "type" => "month",
                                "interval" => 1,
                                "offset" => 0,
                                "length" => 33
                            ],
                            [
                                "name" => "Month 8",
                                "type" => "month",
                                "interval" => 1,
                                "offset" => 0,
                                "length" => 31
                            ],
                            [
                                "name" => "Month 9",
                                "type" => "month",
                                "interval" => 1,
                                "offset" => 0,
                                "length" => 31
                            ],
                            [
                                "name" => "Month 10",
                                "type" => "month",
                                "interval" => 1,
                                "offset" => 0,
                                "length" => 30
                            ],
                            [
                                "name" => "Month 11",
                                "type" => "month",
                                "interval" => 1,
                                "offset" => 0,
                                "length" => 31
                            ],
                            [
                                "name" => "Month 12",
                                "type" => "month",
                                "interval" => 1,
                                "offset" => 0,
                                "length" => 20
                            ],
                            [
                                "name" => "Intercalary Month 13",
                                "type" => "intercalary",
                                "interval" => 1,
                                "offset" => 0,
                                "length" => 25
                            ],
                            [
                                "name" => "Intercalary Leap Month",
                                "type" => "intercalary",
                                "interval" => 5,
                                "offset" => 0,
                                "length" => 10
                            ],
                            [
                                "name" => "Intercalary Leap Month",
                                "type" => "month",
                                "interval" => 3,
                                "offset" => 0,
                                "length" => 10
                            ],
                            [
                                "name" => "Final",
                                "type" => "month",
                                "interval" => 1,
                                "offset" => 0,
                                "length" => 31
                            ]
                        ],
                        "leap_days" => [
                            [
                                "intercalary" => false,
                                "timespan" => 7,
                                "interval" => "4",
                                "offset" => 0
                            ],
                            [
                                "intercalary" => false,
                                "timespan" => 9,
                                "interval" => "7",
                                "offset" => 0
                            ],
                            [
                                "intercalary" => true,
                                "day" => 31,
                                "timespan" => 10,
                                "interval" => "6",
                                "offset" => 0
                            ],
                            [
                                "intercalary" => true,
                                "day" => 16,
                                "timespan" => 8,
                                "interval" => "8",
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
                            "Weekday 7"
                        ]
                    ],
                    "settings" => [
                        "year_zero_exists" => false
                    ]
                ]
            ]);

        $this->testCalendar($calendar);

        /* ---------------------------------------------------------------------- */

        $calendar = Calendar::Factory()
            ->for($user)
            ->create([
                "name" => "Simple 2-1 month",
                "static_data" => [
                    "year_data" => [
                        "first_day" => 1,
                        "overflow" => false,
                        "timespans" => [
                            [
                                "name" => "Somemonth",
                                "type" => "month",
                                "interval" => 1,
                                "offset" => 0,
                                "length" => 1
                            ],
                            [
                                "name" => "Anothermonth",
                                "type" => "month",
                                "interval" => 2,
                                "offset" => 1,
                                "length" => 1
                            ]
                        ],
                        "leap_days" => [
                            [
                                "intercalary" => false,
                                "timespan" => 1,
                                "interval" => "2",
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
                            "Weekday 7"
                        ]
                    ],
                    "settings" => [
                        "year_zero_exists" => false
                    ]
                ]
            ]);

        $this->testCalendar($calendar);

    }

    private function testCalendar($calendar, $fromYear = -100, $toYear = 100)
    {

        dump("Testing calendar: " . $calendar->name . " (year range: " . $fromYear . " to " . $toYear . ")");

        $calendar->setDate($fromYear);

        $epochs = EpochFactory::forCalendarYear($calendar);

        $lastYearEndEpoch = $epochs->last();

        $fromYear++;
        for($year = $fromYear; $year < $toYear; $year++){

            $calendar->setDate($year);
            if(!$calendar->setting("year_zero_exists") && $year === 0){
                continue;
            }

            $epochs = EpochFactory::forCalendarYear($calendar);

            $thisYearStartEpoch = $epochs->first();

            //dump($year . " - Last year ended on " . $lastYearEndEpoch->epoch . " and this year started on " . $thisYearStartEpoch->epoch);

            if(($calendar->setting("year_zero_exists") && $year === 0) || (!$calendar->setting("year_zero_exists") && $year === 1)){
                $this->assertTrue($thisYearStartEpoch->epoch === 0);
                $expectedVisualWeekdayIndex = $thisYearStartEpoch->isIntercalary ? 0 : (intval($calendar->static_data['year_data']['first_day'])-1);
                //dump($year . " - First year, got weekday index " . $thisYearStartEpoch->visualWeekdayIndex . " and expected " . $expectedVisualWeekdayIndex);
                $this->assertTrue(
                    $thisYearStartEpoch->visualWeekdayIndex === $expectedVisualWeekdayIndex
                    ||
                    ($thisYearStartEpoch->visualWeekdayIndex === 0 && $thisYearStartEpoch->isIntercalary)
                );
            }

            $this->assertTrue($lastYearEndEpoch->epoch == $thisYearStartEpoch->epoch-1);

            if($calendar->overflows_week) {

                //dump($year . " - Last year ended on weekday index " . $lastYearEndEpoch->visualWeekdayIndex . " and this year started on " . $thisYearStartEpoch->visualWeekdayIndex);

                $weekdayIndexSame = ($lastYearEndEpoch->weekdayIndex == $thisYearStartEpoch->weekdayIndex - 1);
                $weekdayIndexResetOK = ($lastYearEndEpoch->weekdayIndex === ($calendar->weekdays->count()-1) && $thisYearStartEpoch->weekdayIndex === 0);
                $visualWeekdayIndexSame = ($lastYearEndEpoch->visualWeekdayIndex == $thisYearStartEpoch->visualWeekdayIndex - 1);
                $visualWeekdayIndexResetOK = ($lastYearEndEpoch->visualWeekdayIndex === ($calendar->weekdays->count()-1) && $thisYearStartEpoch->visualWeekdayIndex === 0);
                $visualWeekdayIndexResetIntercalary = ($thisYearStartEpoch->visualWeekdayIndex === 0 && $thisYearStartEpoch->isIntercalary);

                /*dump([
                    "weekdayIndexSame" => $weekdayIndexSame,
                    "weekdayIndexResetOK" => $weekdayIndexResetOK,
                    "visualWeekdayIndexSame" => $visualWeekdayIndexSame,
                    "visualWeekdayIndexResetOK" => $visualWeekdayIndexResetOK,
                    "visualWeekdayIndexResetIntercalary" => $visualWeekdayIndexResetIntercalary,
                    "isIntercalary" => $thisYearStartEpoch->isIntercalary
                ]);*/

                $this->assertTrue(
                    $weekdayIndexSame
                    ||
                    $weekdayIndexResetOK
                    ||
                    $visualWeekdayIndexSame
                    ||
                    $visualWeekdayIndexResetOK
                    ||
                    $visualWeekdayIndexResetIntercalary
                );

                $epochsByMonth = $epochs->groupBy->monthId;

                $first = true;
                foreach($epochsByMonth as $epoch){

                    if($first){
                        $first = false;
                        $endWeekdayLastMonth = $epoch->last();
                        continue;
                    }

                    $startWeekdayThisMonth = $epoch->first();

                    //dump($epoch->first()->monthId . " - Last month ended on weekday index " . $endWeekdayLastMonth->visualWeekdayIndex . " and this month started on " . $startWeekdayThisMonth->visualWeekdayIndex);

                    $weekdayIndexSame = ($endWeekdayLastMonth->weekdayIndex == $startWeekdayThisMonth->weekdayIndex - 1);
                    $weekdayIndexResetOK = ($endWeekdayLastMonth->weekdayIndex === ($calendar->weekdays->count()-1) && $startWeekdayThisMonth->weekdayIndex === 0);
                    $visualWeekdayIndexSame = ($endWeekdayLastMonth->visualWeekdayIndex == $startWeekdayThisMonth->visualWeekdayIndex - 1);
                    $visualWeekdayIndexResetOK = ($endWeekdayLastMonth->visualWeekdayIndex === ($calendar->weekdays->count()-1) && $startWeekdayThisMonth->visualWeekdayIndex === 0);
                    $visualWeekdayIndexResetIntercalary = ($startWeekdayThisMonth->visualWeekdayIndex === 0 && $startWeekdayThisMonth->isIntercalary);

                    /*dump([
                        "weekdayIndexSame" => $weekdayIndexSame,
                        "weekdayIndexResetOK" => $weekdayIndexResetOK,
                        "visualWeekdayIndexSame" => $visualWeekdayIndexSame,
                        "visualWeekdayIndexResetOK" => $visualWeekdayIndexResetOK,
                        "visualWeekdayIndexResetIntercalary" => $visualWeekdayIndexResetIntercalary,
                        "isIntercalary" => $startWeekdayThisMonth->isIntercalary
                    ]);*/

                    $this->assertTrue(
                        $weekdayIndexSame
                        ||
                        $weekdayIndexResetOK
                        ||
                        $visualWeekdayIndexSame
                        ||
                        $visualWeekdayIndexResetOK
                        ||
                        $visualWeekdayIndexResetIntercalary
                    );

                    $endWeekdayLastMonth = $epoch->last();

                }

            }

            $lastYearEndEpoch = $epochs->last();

        }

    }
}
