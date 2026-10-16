<?php

namespace Tests\Feature\Calendar;

use App\Jobs\SaveCalendarEvents;
use App\Models\Calendar;
use App\Models\CalendarEvent;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Event names are stored as decoded plain text on every write path: the
 * calendar save job (create + query-builder update) and plain Eloquent writes
 * (API v1, Discord).
 */
class EventNameNormalizationTest extends TestCase
{
    use RefreshDatabase;

    private function makeCalendar(): Calendar
    {
        $staticData = json_decode(
            file_get_contents(base_path('database/seeders/presets/gregorian.json')),
            true
        )['static_data'];

        return Calendar::factory()->create([
            'user_id' => User::factory()->create()->id,
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

    private function rawName(int $eventId): string
    {
        return CalendarEvent::whereKey($eventId)->firstOrFail()->getRawOriginal('name');
    }

    public function test_save_job_normalizes_names_on_create()
    {
        $calendar = $this->makeCalendar();

        $ids = SaveCalendarEvents::dispatchSync(
            [$this->eventPayload(['name' => 'Rock &amp; Roll <b>live</b>'])],
            collect(),
            $calendar->id
        );

        $this->assertSame('Rock & Roll live', $this->rawName($ids->first()));
    }

    public function test_save_job_normalizes_names_on_update()
    {
        $calendar = $this->makeCalendar();
        $event = $calendar->events()->create($this->eventPayload(['creator_id' => $calendar->user_id]));

        SaveCalendarEvents::dispatchSync(
            [$this->eventPayload(['id' => $event->id, 'name' => 'Teleport -&gt; Library &lt;3'])],
            collect(),
            $calendar->id
        );

        $this->assertSame('Teleport -> Library <3', $this->rawName($event->id));
    }

    public function test_eloquent_writes_normalize_names()
    {
        $calendar = $this->makeCalendar();

        $event = $calendar->events()->create($this->eventPayload([
            'name' => 'O&#039;Brien&#39;s &amp; Sons',
            'creator_id' => $calendar->user_id,
        ]));

        $this->assertSame("O'Brien's & Sons", $this->rawName($event->id));
    }

    public function test_update_cannot_reassign_calendar_or_creator()
    {
        $calendar = $this->makeCalendar();
        $other = $this->makeCalendar();
        $event = $calendar->events()->create($this->eventPayload(['creator_id' => $calendar->user_id]));

        SaveCalendarEvents::dispatchSync(
            [$this->eventPayload([
                'id' => $event->id,
                'calendar_id' => $other->id,
                'creator_id' => $other->user_id,
            ])],
            collect(),
            $calendar->id
        );

        $fresh = CalendarEvent::find($event->id);
        $this->assertSame($calendar->id, $fresh->calendar_id);
        $this->assertSame($calendar->user_id, $fresh->creator_id);
    }

    public function test_update_ignores_unknown_keys()
    {
        $calendar = $this->makeCalendar();
        $event = $calendar->events()->create($this->eventPayload(['creator_id' => $calendar->user_id]));

        SaveCalendarEvents::dispatchSync(
            [$this->eventPayload(['id' => $event->id, 'name' => 'Renamed', 'not_a_column' => 'x'])],
            collect(),
            $calendar->id
        );

        $this->assertSame('Renamed', $this->rawName($event->id));
    }
}
