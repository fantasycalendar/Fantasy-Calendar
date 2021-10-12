<?php

namespace Tests\Unit;

use App\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Calendar;
use App\Facades\Epoch as EpochFactory;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use phpDocumentor\Reflection\Types\Collection;
use Tests\TestCase;

class EdgeCaseCalendarsTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Tests the accuracy of a number of known edge case calendars, testing their epoch flow between years, and weekday
     * flow, and any additional test cases within the calendar against known hard values
     */
    public function testEdgeCaseCalendars()
    {
        $user = User::Factory()->create();

        foreach($this->getEdgeCases() as $filename){

            $calendarData = $this->retrieveJson($filename);

            $testcases = $calendarData['testcases'];
            unset($calendarData["testcases"]);

            $calendar = Calendar::Factory()
                ->for($user)
                ->create($calendarData);

            foreach($testcases as $testcase){

                $testCaseYear = $testcase['year'] ?? 0;
                $testCaseMonth = $testcase['month'] ?? 0;
                $testCaseDay = $testcase['day'] ?? 1;

                $calendar->setDate(
                    $testCaseYear,
                    $testCaseMonth,
                    $testCaseDay
                );

                $epochs = EpochFactory::forCalendarYear($calendar);

                foreach($testcase['expected_values'] as $key => $value){

                    $epoch = $epochs->getByDate($testCaseYear, $testCaseMonth, $testCaseDay);

                    $this->assertTrue($epoch->$key === $value);

                }

            }

            $this->testCalendar($calendar);

        }
    }

    private function getEdgeCases():
    {
        return collect(Storage::disk('base')->files('setup/extra-preset-jsons/edge-case-calendars'))
            ->map(function($file){
                return Str::replace('.json', '', $file);
            })->toArray();
    }

    private function retrieveJson($presetFile)
    {
        return json_decode(file_get_contents(base_path($presetFile). '.json'), true);
    }

    private function testCalendar($calendar, $fromYear = -100, $toYear = 100)
    {
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

            if(($calendar->setting("year_zero_exists") && $year === 0) || (!$calendar->setting("year_zero_exists") && $year === 1)){
                $this->assertTrue($thisYearStartEpoch->epoch === 0);
                $expectedVisualWeekdayIndex = $thisYearStartEpoch->isIntercalary ? 0 : (intval($calendar->static_data['year_data']['first_day'])-1);
                $this->assertTrue(
                    $thisYearStartEpoch->visualWeekdayIndex === $expectedVisualWeekdayIndex
                    ||
                    ($thisYearStartEpoch->visualWeekdayIndex === 0 && $thisYearStartEpoch->isIntercalary)
                );
            }

            $this->assertTrue($lastYearEndEpoch->epoch == $thisYearStartEpoch->epoch-1);

            if($calendar->overflows_week) {

                $weekdayIndexSame = ($lastYearEndEpoch->weekdayIndex == $thisYearStartEpoch->weekdayIndex - 1);
                $weekdayIndexResetOK = ($lastYearEndEpoch->weekdayIndex === ($calendar->weekdays->count()-1) && $thisYearStartEpoch->weekdayIndex === 0);
                $visualWeekdayIndexSame = ($lastYearEndEpoch->visualWeekdayIndex == $thisYearStartEpoch->visualWeekdayIndex - 1);
                $visualWeekdayIndexResetOK = ($lastYearEndEpoch->visualWeekdayIndex === ($calendar->weekdays->count()-1) && $thisYearStartEpoch->visualWeekdayIndex === 0);
                $visualWeekdayIndexResetIntercalary = ($thisYearStartEpoch->visualWeekdayIndex === 0 && $thisYearStartEpoch->isIntercalary);

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

                    $weekdayIndexSame = ($endWeekdayLastMonth->weekdayIndex == $startWeekdayThisMonth->weekdayIndex - 1);
                    $weekdayIndexResetOK = ($endWeekdayLastMonth->weekdayIndex === ($calendar->weekdays->count()-1) && $startWeekdayThisMonth->weekdayIndex === 0);
                    $visualWeekdayIndexSame = ($endWeekdayLastMonth->visualWeekdayIndex == $startWeekdayThisMonth->visualWeekdayIndex - 1);
                    $visualWeekdayIndexResetOK = ($endWeekdayLastMonth->visualWeekdayIndex === ($calendar->weekdays->count()-1) && $startWeekdayThisMonth->visualWeekdayIndex === 0);
                    $visualWeekdayIndexResetIntercalary = ($startWeekdayThisMonth->visualWeekdayIndex === 0 && $startWeekdayThisMonth->isIntercalary);

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
