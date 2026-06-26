<?php

namespace Tests\Feature\Calendar;

use App\Jobs\SaveCalendarEvents;
use App\Models\Calendar;
use App\Models\CalendarEvent;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Event names are user-controlled and surface across many UI contexts. Every
 * known render site escapes them, but the storage layer leaves `name` raw. We
 * harden at the save boundary (SaveCalendarEvents) so tags are stripped on both
 * the create AND update paths — the update path uses a query-builder `update()`
 * that bypasses model casts/mutators, so a model mutator alone is insufficient.
 *
 * `strip_tags` (not the CleanHtml/Purifier cast) is used so names are not
 * entity-encoded on the backend — the frontend escapes exactly once, and
 * backend entity-encoding would produce double-encoded `&amp;` artifacts.
 */
class EventNameSanitizationTest extends TestCase
{
    use RefreshDatabase;

    private function makeCalendar(): Calendar
    {
        $user = User::factory()->create();

        // Use a real, valid calendar shape so saving doesn't trip the epoch/date
        // machinery (the factory default has empty timespans).
        $staticData = json_decode(
            file_get_contents(base_path('database/seeders/presets/gregorian.json')),
            true
        )['static_data'];

        return Calendar::factory()->create([
            'user_id' => $user->id,
            'static_data' => $staticData,
        ]);
    }

    private function eventPayload(array $overrides = []): array
    {
        return array_merge([
            'name' => 'Test Event',
            'description' => '',
            'data' => ['conditions' => []],
            'settings' => [],
            'sort_by' => 0,
        ], $overrides);
    }

    public function test_event_name_tags_are_stripped_on_create()
    {
        $calendar = $this->makeCalendar();

        SaveCalendarEvents::dispatchSync(
            [$this->eventPayload(['name' => 'Evil <script>alert(1)</script>'])],
            collect(),
            $calendar->id
        );

        $name = CalendarEvent::where('calendar_id', $calendar->id)->value('name');

        $this->assertStringNotContainsString('<script', $name);
        $this->assertStringNotContainsString('<', $name);
    }

    public function test_event_name_tags_are_stripped_on_update()
    {
        $calendar = $this->makeCalendar();

        // Create a clean event first.
        SaveCalendarEvents::dispatchSync(
            [$this->eventPayload(['name' => 'Original'])],
            collect(),
            $calendar->id
        );

        $event = CalendarEvent::where('calendar_id', $calendar->id)->firstOrFail();

        // Update that same event (id present) with a malicious name. This is the
        // query-builder `update()` path that bypasses model casts.
        SaveCalendarEvents::dispatchSync(
            [$this->eventPayload([
                'id' => $event->id,
                'name' => 'Pwned <img src=x onerror="alert(1)">',
            ])],
            collect(),
            $calendar->id
        );

        $name = CalendarEvent::whereKey($event->id)->value('name');

        $this->assertStringNotContainsString('<img', $name);
        $this->assertStringNotContainsString('onerror', $name);
        $this->assertStringNotContainsString('<', $name);
    }

    public function test_event_name_ampersand_is_not_entity_encoded()
    {
        $calendar = $this->makeCalendar();

        SaveCalendarEvents::dispatchSync(
            [$this->eventPayload(['name' => 'Smith & Sons'])],
            collect(),
            $calendar->id
        );

        $name = CalendarEvent::where('calendar_id', $calendar->id)->value('name');

        $this->assertSame('Smith & Sons', $name);
    }
}
