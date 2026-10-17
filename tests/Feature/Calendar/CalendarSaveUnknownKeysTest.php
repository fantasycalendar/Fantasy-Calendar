<?php

namespace Tests\Feature\Calendar;

use App\Models\Calendar;
use App\Models\CalendarEvent;
use App\Models\EventCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * The editor attaches client-only keys (e.g. the synthetic `_id` used for
 * stable list keys) to the objects it sends back on "Save Calendar". The
 * update paths in SaveCalendarEvents / SaveEventCategories use query-builder
 * `update()`, which has no fillable guard — an unknown key becomes an
 * "Unknown column" SQL error and the whole save is lost.
 */
class CalendarSaveUnknownKeysTest extends TestCase
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

    private function save(Calendar $calendar, array $categories, array $events)
    {
        $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class);

        return $this->actingAs($calendar->user)->patch(
            route('calendars.update', ['calendar' => $calendar]),
            [
                'event_categories' => json_encode($categories),
                'events' => json_encode($events),
            ]
        );
    }

    public function test_existing_events_and_categories_save_despite_client_only_keys()
    {
        $calendar = $this->makeCalendar();

        $category = $calendar->event_categories()->create([
            'name' => 'Holidays',
            'category_settings' => [],
            'event_settings' => [],
            'sort_by' => 0,
        ]);

        $event = $calendar->events()->create([
            'name' => 'Old name',
            'description' => '',
            'data' => ['conditions' => []],
            'settings' => [],
            'event_category_id' => $category->id,
            'creator_id' => $calendar->user->id,
            'sort_by' => 0,
        ]);

        $response = $this->save($calendar, [
            array_merge($category->only(['id', 'category_settings', 'event_settings', 'sort_by']), [
                'name' => 'Festivals',
                '_id' => 'row7',
            ]),
        ], [
            array_merge($event->only(['id', 'description', 'data', 'settings', 'event_category_id', 'sort_by']), [
                'name' => 'New name',
                '_id' => 'row8',
            ]),
        ]);

        $response->assertOk();
        $this->assertSame('Festivals', EventCategory::find($category->id)->name);
        $this->assertSame('New name', CalendarEvent::find($event->id)->name);
    }

    public function test_event_update_cannot_reassign_calendar_or_creator()
    {
        $calendar = $this->makeCalendar();
        $other = $this->makeCalendar();

        $event = $calendar->events()->create([
            'name' => 'Mine',
            'description' => '',
            'data' => ['conditions' => []],
            'settings' => [],
            'creator_id' => $calendar->user->id,
            'sort_by' => 0,
        ]);

        $this->save($calendar, [], [
            array_merge($event->only(['id', 'name', 'description', 'data', 'settings', 'sort_by']), [
                'calendar_id' => $other->id,
                'creator_id' => $other->user->id,
            ]),
        ])->assertOk();

        $fresh = CalendarEvent::find($event->id);
        $this->assertSame($calendar->id, $fresh->calendar_id);
        $this->assertSame($calendar->user->id, $fresh->creator_id);
    }
}
