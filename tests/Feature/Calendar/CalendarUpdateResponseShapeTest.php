<?php

namespace Tests\Feature\Calendar;

use App\Models\Calendar;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * The web calendars.update endpoint and the API v1 last_changed endpoint are
 * consumed by the same frontend store, which keeps last_static_change /
 * last_dynamic_change for save-conflict detection. The two endpoints
 * historically returned DIFFERENT shapes (flat vs nested under
 * 'last_changed'), which already caused one reader to be "fixed" onto the
 * wrong shape — producing Invalid Date in the store and silently disabling
 * the "calendar was updated before you saved" prompt.
 *
 * These tests pin ONE flat contract for both endpoints so the readers in
 * calendar_ajax_functions.js (update_view_dynamic, _update_dynamic,
 * do_update_all, check_last_change) can all read identically.
 */
class CalendarUpdateResponseShapeTest extends TestCase
{
    use RefreshDatabase;

    private function makeCalendar(): Calendar
    {
        // The route sits in the 'agreement' middleware group, which redirects
        // (302) any user whose agreement_id is null. The column has no FK and
        // the check is null-vs-not — a literal satisfies it without needing a
        // seeded Agreement row in the testing DB.
        $user = User::factory()->create(['agreement_id' => 1]);

        $staticData = json_decode(
            file_get_contents(base_path('database/seeders/presets/gregorian.json')),
            true
        )['static_data'];

        return Calendar::factory()->create([
            'user_id' => $user->id,
            'static_data' => $staticData,
        ]);
    }

    public function test_update_returns_flat_change_timestamps()
    {
        $calendar = $this->makeCalendar();

        // calendars.update is a web route; skip only the CSRF check.
        $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class);

        $response = $this->actingAs($calendar->user)->patch(
            route('calendars.update', ['calendar' => $calendar]),
            ['dynamic_data' => json_encode($calendar->dynamic_data)]
        );

        $response->assertOk();

        // Flat: same shape as /api/v1/calendar/{hash}/last_changed.
        $response->assertJsonStructure(['last_dynamic_change', 'last_static_change']);
        $this->assertNotNull($response->json('last_dynamic_change'));
        $this->assertNotNull($response->json('last_static_change'));

        // The nested wrapper must be gone — its coexistence with the flat
        // API shape is what caused the reader mix-up.
        $response->assertJsonMissingPath('last_changed');
    }

    public function test_api_last_changed_shape_matches()
    {
        $calendar = $this->makeCalendar();

        $response = $this->actingAs($calendar->user)->getJson(
            "/api/v1/calendar/{$calendar->hash}/last_changed"
        );

        $response->assertOk();
        $response->assertJsonStructure(['last_dynamic_change', 'last_static_change']);
        $response->assertJsonMissingPath('last_changed');
    }
}
