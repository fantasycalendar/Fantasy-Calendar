<?php

namespace Tests\Feature\Calendar;

use App\Models\Calendar;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * The view page's "Current date" controls change the calendar's actual date,
 * which only users allowed to `advance-date` (owner, co-owners) may do. Others
 * still get the preview ("Selected date") controls.
 */
class ViewPageDateControlsTest extends TestCase
{
    use RefreshDatabase;

    private function makeCalendar(): Calendar
    {
        $staticData = json_decode(
            file_get_contents(base_path('database/seeders/presets/gregorian.json')),
            true
        )['static_data'];

        return Calendar::factory()->create([
            'user_id' => User::factory()->create(['agreement_id' => 1])->id,
            'static_data' => $staticData,
        ]);
    }

    private function viewAs(?User $user, Calendar $calendar)
    {
        $request = $user ? $this->actingAs($user) : $this;

        return $request->get(route('calendars.show', ['calendar' => $calendar]))->assertOk();
    }

    public function test_guests_only_get_the_preview_controls()
    {
        $calendar = $this->makeCalendar();

        $this->viewAs(null, $calendar)
            ->assertDontSee("id='date_inputs'", false)
            ->assertDontSee('id="tab-current"', false)
            ->assertSee('id="panel-selected"', false);
    }

    public function test_players_only_get_the_preview_controls()
    {
        $calendar = $this->makeCalendar();
        $player = User::factory()->create(['agreement_id' => 1]);
        $calendar->users()->attach($player, ['user_role' => 'player']);

        $this->viewAs($player, $calendar)
            ->assertDontSee("id='date_inputs'", false)
            ->assertSee('id="panel-selected"', false);
    }

    public function test_the_owner_gets_the_current_date_controls()
    {
        $calendar = $this->makeCalendar();

        $this->viewAs($calendar->user, $calendar)
            ->assertSee("id='date_inputs'", false)
            ->assertSee('id="tab-current"', false);
    }

    public function test_co_owners_get_the_current_date_controls()
    {
        // Calendar roles only apply to premium calendars, and without the
        // stripe feature every calendar counts as premium.
        config(['app.features_enabled' => ['discord']]);

        $calendar = $this->makeCalendar();
        $coOwner = User::factory()->create(['agreement_id' => 1]);
        $calendar->users()->attach($coOwner, ['user_role' => 'co-owner']);

        $this->viewAs($coOwner, $calendar)
            ->assertSee("id='date_inputs'", false);
    }
}
