<?php

namespace Tests\Unit;

use App\Calendar;
use App\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class CalendarDateTest extends TestCase
{
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function testCalendarDateAdd()
    {
        $user = User::Factory()->create();

        foreach($this->getEdgeCases() as $filename) {

            $calendarData = $this->retrieveJson($filename);

            $calendar = Calendar::Factory()
                ->for($user)
                ->create($calendarData);

            dump("testCalendarDateAdd - Testing " . $calendar->name);

            foreach($calendarData['static_data']["date_testcases"] as $testcase){

                $testCaseYear = $testcase['year'] ?? 0;
                $testCaseMonth = $testcase['month'] ?? 0;
                $testCaseDay = $testcase['day'] ?? 1;

                $calendar->setDate(
                    $testCaseYear,
                    $testCaseMonth,
                    $testCaseDay
                );

                if(isset($testcase['sub'])) {
                    $subYears = $testcase['sub']['year'] ?? false;
                    $subMonths = $testcase['sub']['month'] ?? false;
                    $subDays = $testcase['sub']['day'] ?? false;

                    if ($subYears) $calendar->subYears($subYears);
                    if ($subMonths) $calendar->subMonths($subMonths);
                    if ($subDays) $calendar->subDays($subDays);
                }

                if(isset($testcase['add'])) {
                    $addYears = $testcase['add']['year'] ?? false;
                    $addMonths = $testcase['add']['month'] ?? false;
                    $addDays = $testcase['add']['day'] ?? false;

                    if ($addYears) $calendar->addYears($addYears);
                    if ($addMonths) $calendar->addMonths($addMonths);
                    if ($addDays) $calendar->addDays($addDays);
                }

                $this->assertTrue($calendar->current_date == $testcase['expected_result']);

            }
        }
    }
}
