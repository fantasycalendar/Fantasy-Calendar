<?php

namespace Tests\Feature\Calendar;

use App\Jobs\SaveCalendarEvents;
use App\Models\Calendar;
use App\Models\CalendarEvent;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Event descriptions are user-authored rich HTML rendered via `x-html` on the
 * calendar view page — visible to ANY visitor of a public calendar. That makes
 * them a stored-XSS surface with two historically broken legs:
 *
 * 1. WRITE: the bulk-save update path (SaveCalendarEvents) uses a query-builder
 *    `update()` that bypasses the model's CleanHtml cast, so malicious HTML
 *    could be stored raw. (Same bypass EventNameSanitizationTest covers for
 *    `name`.)
 * 2. READ: a `getDescriptionAttribute` accessor ran `html_entity_decode`,
 *    which (a) shadowed the CleanHtml cast's get() so purification never ran
 *    on read, and (b) RESURRECTED markup a user typed as plain text — Purifier
 *    correctly stores typed-as-text `<img onerror=...>` entity-encoded, and
 *    the decode turned it back into live markup. That leg required no cast
 *    bypass at all: the API v1 event endpoints (Eloquent, players can post)
 *    were enough to plant a payload.
 *
 * The contract these tests lock: whatever `$event->description` returns is
 * safe to feed to `x-html`, and legitimate rich text survives. Purifier's
 * exact serialization (e.g. AutoParagraph wrapping) is deliberately NOT
 * pinned — we assert absence of dangerous constructs and presence of allowed
 * tags, plus round-trip stability.
 *
 * Descriptions use Purifier (unlike names, which use strip_tags) because they
 * are legitimately HTML; stripping would destroy user formatting.
 */
class EventDescriptionSanitizationTest extends TestCase
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

    private function createEvent(Calendar $calendar, array $overrides = []): CalendarEvent
    {
        SaveCalendarEvents::dispatchSync(
            [$this->eventPayload($overrides)],
            collect(),
            $calendar->id
        );

        return CalendarEvent::where('calendar_id', $calendar->id)->firstOrFail();
    }

    /**
     * The RAW stored bytes, untouched by accessors/casts. Eloquent's
     * `Builder::value()` hydrates a model (accessors run!), so it must not be
     * used for this — reading "raw" through the model is exactly how the
     * original bug hid.
     */
    private function rawDescription(int $eventId): string
    {
        return CalendarEvent::whereKey($eventId)->firstOrFail()->getRawOriginal('description');
    }

    public function test_description_is_purified_on_update()
    {
        $calendar = $this->makeCalendar();
        $event = $this->createEvent($calendar, ['description' => '<p>Original</p>']);

        // Update that same event (id present) — the query-builder `update()`
        // path that bypasses model casts.
        SaveCalendarEvents::dispatchSync(
            [$this->eventPayload([
                'id' => $event->id,
                'description' => '<p>Hi</p><script>alert(1)</script><img src=x onerror="alert(1)">',
            ])],
            collect(),
            $calendar->id
        );

        // Assert against the RAW stored value — asserting through the model
        // read would let read-side purification mask a dirty write.
        $raw = $this->rawDescription($event->id);

        $this->assertStringNotContainsString('<script', $raw);
        $this->assertStringNotContainsString('onerror', $raw);
        $this->assertStringContainsString('Hi', $raw);
    }

    public function test_description_is_purified_on_create()
    {
        $calendar = $this->makeCalendar();

        $event = $this->createEvent($calendar, [
            'description' => '<p>Hi</p><script>alert(1)</script>',
        ]);

        $raw = $this->rawDescription($event->id);

        $this->assertStringNotContainsString('<script', $raw);
        $this->assertStringContainsString('Hi', $raw);
    }

    public function test_entity_encoded_text_is_not_resurrected_on_read()
    {
        $calendar = $this->makeCalendar();

        // A user typing markup as PLAIN TEXT in the editor is stored
        // entity-encoded (that is Purifier doing its job). Reading it back
        // must keep it text — the old html_entity_decode accessor turned it
        // into live markup.
        $event = $this->createEvent($calendar, [
            'description' => '&lt;img src=x onerror=alert(1)&gt;',
        ]);

        // Confirm the setup actually stored entity-encoded text.
        $raw = $this->rawDescription($event->id);
        $this->assertStringContainsString('&lt;img', $raw);

        $read = CalendarEvent::whereKey($event->id)->firstOrFail()->description;

        // The typed-as-text markup must stay text: no live <img> tag may
        // appear. (The literal substring "onerror=alert(1)" legitimately
        // remains — as entity-encoded TEXT, which is harmless.)
        $this->assertStringNotContainsString('<img', $read);
    }

    public function test_legacy_raw_descriptions_are_neutralized_on_read()
    {
        $calendar = $this->makeCalendar();
        $event = $this->createEvent($calendar, ['description' => '<p>Placeholder</p>']);

        // Simulate a row written before this fix existed: raw malicious HTML
        // planted directly, bypassing all model machinery.
        CalendarEvent::whereKey($event->id)->update([
            'description' => '<p>Hello</p><script>alert(1)</script><img src=x onerror="alert(1)">',
        ]);

        // Self-check: the payload really is stored raw.
        $raw = $this->rawDescription($event->id);
        $this->assertStringContainsString('<script', $raw);

        // The model read boundary must neutralize it (CleanHtml::get), so
        // legacy rows are covered without a data migration.
        $read = CalendarEvent::whereKey($event->id)->firstOrFail()->description;

        $this->assertStringNotContainsString('<script', $read);
        $this->assertStringNotContainsString('onerror', $read);
        $this->assertStringContainsString('Hello', $read);
    }

    public function test_legitimate_rich_text_is_preserved()
    {
        $calendar = $this->makeCalendar();

        $description = '<p>A <strong>bold</strong> and <em>emphatic</em> plan:</p>'
            . '<ul><li>March at dawn</li></ul>'
            . '<p><a href="https://example.com" title="map">The map</a></p>';

        $event = $this->createEvent($calendar, ['description' => $description]);
        $read = CalendarEvent::whereKey($event->id)->firstOrFail()->description;

        $this->assertStringContainsString('<strong>bold</strong>', $read);
        $this->assertStringContainsString('<em>emphatic</em>', $read);
        $this->assertStringContainsString('<li>March at dawn</li>', $read);
        $this->assertStringContainsString('<a href="https://example.com"', $read);
    }

    public function test_description_is_stable_across_save_read_cycles()
    {
        $calendar = $this->makeCalendar();

        $event = $this->createEvent($calendar, [
            'description' => '<p>Fireworks &amp; feasting</p><p>See the <strong>notes</strong>.</p>',
        ]);

        $firstRead = CalendarEvent::whereKey($event->id)->firstOrFail()->description;

        // Re-save what we read, through the update path — the editor does the
        // equivalent every time a user opens and saves an event untouched.
        SaveCalendarEvents::dispatchSync(
            [$this->eventPayload([
                'id' => $event->id,
                'description' => $firstRead,
            ])],
            collect(),
            $calendar->id
        );

        $secondRead = CalendarEvent::whereKey($event->id)->firstOrFail()->description;

        // No progressive entity encoding/decoding drift (the PHP-layer
        // analogue of the frontend's double-escape bug).
        $this->assertSame($firstRead, $secondRead);
    }
}
