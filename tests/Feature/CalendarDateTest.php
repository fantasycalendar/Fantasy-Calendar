<?php

namespace Tests\Feature;

use App\Models\Calendar;
use App\Models\User;
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
        $this->getEdgeCases()->each(function($calendar){
            collect($calendar->static_data['date_testcases'])->each(function($testCase) use ($calendar) {
                dump("testCalendarDateAdd - Testing " . $calendar->name);

                $testCaseYear = $testCase['year'] ?? 0;
                $testCaseMonth = $testCase['month'] ?? 0;
                $testCaseDay = $testCase['day'] ?? 1;

                $calendar->setDate(
                    $testCaseYear,
                    $testCaseMonth,
                    $testCaseDay
                );

                if(isset($testCase['sub'])) {
                    $subYears = $testCase['sub']['year'] ?? false;
                    $subMonths = $testCase['sub']['month'] ?? false;
                    $subDays = $testCase['sub']['day'] ?? false;

                    if ($subYears) $calendar->subYears($subYears);
                    if ($subMonths) $calendar->subMonths($subMonths);
                    if ($subDays) $calendar->subDays($subDays);
                }

                if(isset($testCase['add'])) {
                    $addYears = $testCase['add']['year'] ?? false;
                    $addMonths = $testCase['add']['month'] ?? false;
                    $addDays = $testCase['add']['day'] ?? false;

                    if ($addYears) $calendar->addYears($addYears);
                    if ($addMonths) $calendar->addMonths($addMonths);
                    if ($addDays) $calendar->addDays($addDays);
                }

                $this->assertTrue($calendar->current_date == $testCase['expected_result']);
            });
        });
    }

}
