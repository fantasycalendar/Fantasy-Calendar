<?php

namespace Tests\Feature\Rendering;

use App\Models\Calendar;
use App\Services\RendererService\TextRenderer;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Tests\TestCase;

class TextRendererTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Tests a number of known edge case calendars by rendering specific calendar dates in text format
     * comparing it against known outputs
     */
    public function testTextRenderer()
    {
        $this->getEdgeCases()->each(function($calendar){
            collect($calendar->static_data['textrenderer_testcases'])->each(function($testCase) use ($calendar) {

                dump("testTextRenderer - Testing " . $calendar->name);

                $testCaseYear = $testCase['year'] ?? 0;
                $testCaseMonth = $testCase['month'] ?? 0;
                $testCaseDay = $testCase['day'] ?? 1;

                $calendar->setDate(
                    $testCaseYear,
                    $testCaseMonth,
                    $testCaseDay
                );

                $renderedMonth = TextRenderer::renderMonth($calendar);

                $this->assertEquals($renderedMonth, $testCase['expected_result']);

            });
        });
    }
}
