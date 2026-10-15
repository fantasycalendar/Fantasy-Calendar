<?php

namespace Tests\Feature\Calendar;

use App\Models\Calendar;
use App\Models\EventCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;
use Tests\TestCase;

/**
 * A failed "Save Calendar" must (a) be reported to the frontend as a failure
 * rather than an HTTP 200 the UI reads as success, and (b) not leave the
 * calendar half-saved.
 */
class CalendarSaveFailureTest extends TestCase
{
    use RefreshDatabase;

    private function makeCalendar(): Calendar
    {
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

    public function test_query_exception_on_an_xhr_request_is_a_json_500()
    {
        Route::middleware('web')->get('/__test/query-exception', function () {
            return DB::select('select * from table_that_does_not_exist');
        });

        $response = $this->get('/__test/query-exception', [
            'X-Requested-With' => 'XMLHttpRequest',
            'Accept' => 'application/json, text/plain, */*',
        ]);

        $response->assertStatus(500);
        $response->assertJsonStructure(['message']);
        // Don't leak SQL to the client.
        $this->assertStringNotContainsString('table_that_does_not_exist', $response->json('message'));
    }

    public function test_query_exception_on_a_page_request_is_an_error_page_with_500()
    {
        Route::middleware('web')->get('/__test/query-exception', function () {
            return DB::select('select * from table_that_does_not_exist');
        });

        $response = $this->get('/__test/query-exception');

        $response->assertStatus(500);
        $response->assertViewIs('errors.default');
    }

    public function test_failed_event_save_rolls_back_category_changes()
    {
        $calendar = $this->makeCalendar();

        $category = $calendar->event_categories()->create([
            'name' => 'Holidays',
            'category_settings' => [],
            'event_settings' => [],
            'sort_by' => 0,
        ]);

        $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class);

        $response = $this->actingAs($calendar->user)->patch(
            route('calendars.update', ['calendar' => $calendar]),
            [
                'event_categories' => json_encode([
                    array_merge($category->only(['id', 'category_settings', 'event_settings', 'sort_by']), [
                        'name' => 'Festivals',
                    ]),
                ]),
                // varchar(255) in strict mode: the event insert fails AFTER the
                // categories have already been written.
                'events' => json_encode([[
                    'name' => Str::repeat('x', 300),
                    'description' => '',
                    'data' => ['conditions' => []],
                    'settings' => [],
                    'sort_by' => 0,
                ]]),
            ],
            ['X-Requested-With' => 'XMLHttpRequest', 'Accept' => 'application/json']
        );

        $response->assertStatus(500);
        $this->assertSame('Holidays', EventCategory::find($category->id)->name);
    }
}
