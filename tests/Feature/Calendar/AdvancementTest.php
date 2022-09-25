<?php

namespace Tests\Feature\Calendar;

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
                dump($testCalendar->current_date);

                $testCalendar->update([
                    'advancement_enabled' => $testCase['advancement_settings']['advancement_enabled'],
                    'advancement_real_rate' => $testCase['advancement_settings']['advancement_real_rate'],
                    'advancement_real_rate_unit' => $testCase['advancement_settings']['advancement_real_rate_unit'],
                    'advancement_rate' => $testCase['advancement_settings']['advancement_rate'],
                    'advancement_rate_unit' => $testCase['advancement_settings']['advancement_rate_unit'],
                    'advancement_next_due' => now()->subMinute()->startOfMinute(),
                ]);

                AdvanceCalendarWithRealTime::dispatchSync($testCalendar);

                dump($testCalendar->fresh()->current_date);
            });
        });
    }
}
