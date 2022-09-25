<?php

namespace Tests\Feature\Calendar;

use App\Exceptions\ClockNotEnabledException;
use App\Jobs\AdvanceCalendarWithRealTime;
use App\Models\Calendar;
use Tests\TestCase;

class AdvancementTest extends TestCase
{
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_automatic_advancement()
    {
        $calendars = $this->getEdgeCases('advancement_testcases');

        if(!$calendars->count()) {
            return;
        }

        $calendars->each(function(Calendar $calendar){
            dump("Testing advancement for {$calendar->name}");

            collect($calendar->static_data['advancement_testcases'])->each(function($testCase) use ($calendar) {
                $testCalendar = clone($calendar);

                /**
                 * 1. Set the current date ✓
                 * 2. Set calendar advancement settings appropriately ✓
                 * 3. Tell the calendar it should have updated 1 minute ago
                 * 4. Synchronously run the advancement job on the calendar
                 * 5. Assert the current date is the desired date
                 */

                $testCalendar->setDate(...$testCase['start_datetime']);
                $startingDynamicData = $testCalendar->dynamic_data;

                // Verify that our test-case has a good initial state
                $this->assertEquals(
                    $testCase['start_datetime']['targetYear'],
                    $startingDynamicData['year']
                );
                $this->assertEquals(
                    $testCase['start_datetime']['timespanId'],
                    $startingDynamicData['timespan']
                );
                $this->assertEquals(
                    $testCase['start_datetime']['day'],
                    $startingDynamicData['day']
                );
                $this->assertEquals(
                    $testCase['start_datetime']['hour'],
                    $startingDynamicData['hour']
                );
                $this->assertEquals(
                    $testCase['start_datetime']['minute'],
                    $startingDynamicData['minute']
                );


                $testCalendar->update([
                    'advancement_enabled' => $testCase['advancement_settings']['advancement_enabled'],
                    'advancement_real_rate' => $testCase['advancement_settings']['advancement_real_rate'],
                    'advancement_real_rate_unit' => $testCase['advancement_settings']['advancement_real_rate_unit'],
                    'advancement_rate' => $testCase['advancement_settings']['advancement_rate'],
                    'advancement_rate_unit' => $testCase['advancement_settings']['advancement_rate_unit'],
                    'advancement_next_due' => now()->subMinute()->startOfMinute(),
                ]);

                /**
                 * To the astute:
                 * Yes, we realize this isn't exactly how this is "supposed" to be done.
                 *
                 * However, this is a direct result of the way we're creating our dynamic
                 * test-cases. Since we test by looping through examples, if we were
                 * to use $this->assertThrows(), the loop would be broken upon the thrown
                 * exception. As a compromise, we've decided to simply verify the
                 * class of the exception is what we would expect.
                 */
                try {
                    (new AdvanceCalendarWithRealTime($testCalendar))->handle();
                } catch (\Throwable $thrown) {
                    if(!$testCalendar->clock_enabled) {
                        $this->assertTrue($thrown instanceof ClockNotEnabledException);
                    }
                }

                $resultingDynamicData = $testCalendar->dynamic_data;

                // Verify that our test-case has a good initial state
                $this->assertEquals(
                    $testCase['expected_datetime']['targetYear'],
                    $resultingDynamicData['year']
                );
                $this->assertEquals(
                    $testCase['expected_datetime']['timespanId'],
                    $resultingDynamicData['timespan']
                );
                $this->assertEquals(
                    $testCase['expected_datetime']['day'],
                    $resultingDynamicData['day']
                );
                $this->assertEquals(
                    $testCase['expected_datetime']['hour'],
                    $resultingDynamicData['hour']
                );
                $this->assertEquals(
                    $testCase['expected_datetime']['minute'],
                    $resultingDynamicData['minute']
                );
            });
        });
    }
}
