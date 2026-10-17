<?php

namespace Tests\Feature\Calendar;

use App\Models\Calendar;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * `structureWouldBeModified()` blocks structural edits on LINKED calendars
 * (returns 405 in the controller). List items (eras/timespans/leap_days) carry
 * a synthetic `_id` for stable Alpine keys; that id must NOT count as a
 * structural change, or the first save of a linked child after ids are
 * backfilled would be spuriously rejected.
 */
class StructureWouldBeModifiedTest extends TestCase
{
    use RefreshDatabase;

    private function gregorianStaticData(): array
    {
        return json_decode(
            file_get_contents(base_path('database/seeders/presets/gregorian.json')),
            true
        )['static_data'];
    }

    private function linkedChild(array $staticData): Calendar
    {
        $user = User::factory()->create();
        $parent = Calendar::factory()->create([
            'user_id' => $user->id,
            'static_data' => $this->gregorianStaticData(),
        ]);
        $child = Calendar::factory()->create([
            'user_id' => $user->id,
            'parent_id' => $parent->id,
            'static_data' => $staticData,
        ]);

        return $child->fresh();
    }

    public function test_adding_only_synthetic_ids_is_not_a_structural_change()
    {
        $stored = $this->gregorianStaticData();
        $child = $this->linkedChild($stored);

        // Same structure, but every era / timespan / leap_day gains an `_id`
        // (as the editor's stable-id backfill would produce).
        $incoming = $this->gregorianStaticData();
        foreach ($incoming['eras'] as &$era) {
            $era['_id'] = 'row' . uniqid();
        }
        unset($era);
        foreach ($incoming['year_data']['timespans'] as &$ts) {
            $ts['_id'] = 'row' . uniqid();
        }
        unset($ts);
        foreach ($incoming['year_data']['leap_days'] as &$ld) {
            $ld['_id'] = 'row' . uniqid();
        }
        unset($ld);

        $this->assertFalse(
            $child->structureWouldBeModified($incoming),
            'Backfilling synthetic _id keys must not count as a structural change'
        );
    }

    public function test_a_real_structural_change_is_still_detected()
    {
        $stored = $this->gregorianStaticData();
        $child = $this->linkedChild($stored);

        // Genuinely change the structure: drop a month.
        $incoming = $this->gregorianStaticData();
        array_pop($incoming['year_data']['timespans']);

        $this->assertTrue(
            $child->structureWouldBeModified($incoming),
            'Removing a month must still be detected as a structural change'
        );
    }
}
