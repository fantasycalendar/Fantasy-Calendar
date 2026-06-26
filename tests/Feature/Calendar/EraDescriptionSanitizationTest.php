<?php

namespace Tests\Feature\Calendar;

use App\Models\Calendar;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Era descriptions are user-authored rich HTML stored inside the
 * `calendars.static_data` JSON. Unlike `CalendarEvent::description` (protected
 * by the CleanHtml cast), they are rendered via `x-html` (layouts/event.blade.php)
 * with no other sanitization, on a route that is public/unauthenticated for
 * non-private calendars. They must therefore be HTML-purified at the model's
 * `static_data` read boundary so dangerous markup never reaches the DOM, while
 * legitimate rich-text markup is preserved.
 */
class EraDescriptionSanitizationTest extends TestCase
{
    use RefreshDatabase;

    private function calendarWithEraDescription(string $description): Calendar
    {
        $staticData = [
            'eras' => [
                [
                    'name' => 'First Age',
                    'description' => $description,
                    'formatting' => 'Year {{era_year}} of the {{era_name}}',
                ],
            ],
        ];

        // Set the raw stored JSON directly, simulating a payload persisted
        // without sanitization. Reading `->static_data` exercises the model's
        // `getStaticDataAttribute()` boundary, which is where purification must
        // happen (it is the single read funnel both PHP and the frontend store
        // go through). No DB round-trip is needed to test the accessor.
        $calendar = new Calendar();
        $calendar->setRawAttributes(['static_data' => json_encode($staticData)]);

        return $calendar;
    }

    public function test_era_description_strips_script_tags()
    {
        $calendar = $this->calendarWithEraDescription(
            'Hello <script>alert(document.cookie)</script> world'
        );

        $description = $calendar->static_data['eras'][0]['description'];

        $this->assertStringNotContainsString('<script', $description);
        $this->assertStringNotContainsString('alert(document.cookie)', $description);
    }

    public function test_era_description_strips_event_handler_attributes()
    {
        $calendar = $this->calendarWithEraDescription(
            '<img src=x onerror="alert(1)">'
        );

        $description = $calendar->static_data['eras'][0]['description'];

        $this->assertStringNotContainsString('onerror', $description);
        $this->assertStringNotContainsString('alert(1)', $description);
    }

    public function test_era_description_preserves_legitimate_rich_text_markup()
    {
        $calendar = $this->calendarWithEraDescription(
            '<p>The <strong>Sundering</strong> of the <em>world</em>.</p>'
        );

        $description = $calendar->static_data['eras'][0]['description'];

        $this->assertStringContainsString('<strong>Sundering</strong>', $description);
        $this->assertStringContainsString('<em>world</em>', $description);
    }

    public function test_era_formatting_template_is_left_untouched()
    {
        $calendar = $this->calendarWithEraDescription('A plain description');

        $formatting = $calendar->static_data['eras'][0]['formatting'];

        // Mustache-style format templates must not be purified/escaped.
        $this->assertSame('Year {{era_year}} of the {{era_name}}', $formatting);
    }
}
