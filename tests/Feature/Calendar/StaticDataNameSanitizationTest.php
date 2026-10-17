<?php

namespace Tests\Feature\Calendar;

use App\Models\Calendar;
use Tests\TestCase;

/**
 * Defense-in-depth for the user-controlled NAME strings stored inside the
 * `calendars.static_data` JSON (month/weekday/leap-day/moon/era/season/location/
 * cycle names). Every known render site already escapes them, but the storage
 * layer leaves them raw. We strip tags at the model's `static_data` read
 * boundary (`getStaticDataAttribute`).
 *
 * `strip_tags` (not the Purifier cast) is deliberate: the frontend escapes names
 * exactly once, so backend entity-encoding would produce `&amp;` artifacts.
 *
 * Format/template/syntax fields (eras[].format, cycles.format,
 * leap_days[].interval, colors, enums) must be left byte-for-byte intact.
 *
 * The accessor reads `$this->attributes['static_data']` directly, so these
 * tests need no DB round-trip.
 */
class StaticDataNameSanitizationTest extends TestCase
{
    private function calendarWithStaticData(array $staticData): Calendar
    {
        $calendar = new Calendar();
        $calendar->setRawAttributes(['static_data' => json_encode($staticData)]);

        return $calendar;
    }

    private function payload(): array
    {
        $evil = 'X<script>alert(1)</script>';

        return [
            'year_data' => [
                'global_week' => [$evil],
                'timespans' => [
                    ['name' => $evil, 'type' => 'month', 'week' => [$evil]],
                ],
                'leap_days' => [
                    ['name' => $evil, 'interval' => '400,!100,4'],
                ],
            ],
            'moons' => [
                ['name' => $evil, 'color' => '#ffffff'],
            ],
            'eras' => [
                ['name' => $evil, 'format' => 'Year {{year}} - B.C.'],
            ],
            'seasons' => [
                'data' => [['name' => $evil]],
                'locations' => [['name' => $evil]],
            ],
            'cycles' => [
                'format' => 'Cycle {{1}}',
                'data' => [['names' => [$evil]]],
            ],
        ];
    }

    public function test_all_name_fields_have_tags_stripped()
    {
        $sd = $this->calendarWithStaticData($this->payload())->static_data;

        $names = [
            $sd['year_data']['global_week'][0],
            $sd['year_data']['timespans'][0]['name'],
            $sd['year_data']['timespans'][0]['week'][0],
            $sd['year_data']['leap_days'][0]['name'],
            $sd['moons'][0]['name'],
            $sd['eras'][0]['name'],
            $sd['seasons']['data'][0]['name'],
            $sd['seasons']['locations'][0]['name'],
            $sd['cycles']['data'][0]['names'][0],
        ];

        foreach ($names as $name) {
            $this->assertStringNotContainsString('<script', $name);
            $this->assertStringNotContainsString('<', $name);
        }
    }

    public function test_template_and_syntax_fields_are_left_untouched()
    {
        $sd = $this->calendarWithStaticData($this->payload())->static_data;

        $this->assertSame('Year {{year}} - B.C.', $sd['eras'][0]['format']);
        $this->assertSame('Cycle {{1}}', $sd['cycles']['format']);
        $this->assertSame('400,!100,4', $sd['year_data']['leap_days'][0]['interval']);
        $this->assertSame('#ffffff', $sd['moons'][0]['color']);
        $this->assertSame('month', $sd['year_data']['timespans'][0]['type']);
    }

    public function test_names_are_not_entity_encoded()
    {
        $staticData = $this->payload();
        $staticData['year_data']['timespans'][0]['name'] = 'June & July';

        $sd = $this->calendarWithStaticData($staticData)->static_data;

        $this->assertSame('June & July', $sd['year_data']['timespans'][0]['name']);
    }
}
