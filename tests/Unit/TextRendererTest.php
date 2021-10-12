<?php

namespace Tests\Unit;

use App\Calendar;
use App\Services\RendererService\TextRenderer;
use App\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Tests\TestCase;

class TextRendererTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Tests a number of known edge case calendars by render specific dates of the calendar's month in text format
     * comparing it against known outputs
     */
    public function testTextRenderer()
    {
        $user = User::Factory()->create();

        foreach($this->getEdgeCases() as $filename) {

            $calendarData = $this->retrieveJson($filename);

            $calendar = Calendar::Factory()
                ->for($user)
                ->create($calendarData);

            dump("testTextRenderer - Testing " . $calendar->name);

            foreach($calendarData['static_data']["textrenderer_testcases"] as $testcase){

                $testCaseYear = $testcase['year'] ?? 0;
                $testCaseMonth = $testcase['month'] ?? 0;
                $testCaseDay = $testcase['day'] ?? 1;

                $calendar->setDate(
                    $testCaseYear,
                    $testCaseMonth,
                    $testCaseDay
                );

                $renderedMonth = TextRenderer::renderMonth($calendar);

                $this->assertTrue($renderedMonth == $testcase['expected_result']);

            }
        }
    }

    private function getEdgeCases()
    {
        return collect(Storage::disk('base')->files('setup/extra-preset-jsons/edge-case-calendars'))
            ->map(function($file){
                return Str::replace('.json', '', $file);
            })->toArray();
    }

    private function retrieveJson($presetFile)
    {
        return json_decode(file_get_contents(base_path($presetFile). '.json'), true);
    }
}
