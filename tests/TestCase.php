<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\Calendar;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    /**
     * To the astute: It may not make a ton of sense to have a list of edge-cases
     * that are looped through dynamically from disk in most applications.
     *
     * However, the complexity of problem space that FC has to deal with
     * results in cases where we need a few dozen example calendars to test on.
     * In our case, those calendars come from the main app, and we don't necessarily
     * have peoples' permission to publish the data from those calendars. To avoid
     * violating their wishes, we have our test cases setup in a private repository.
     *
     * Rather than having a single test for every one of the edge cases
     * we can think of, we've just got a bunch of test **calendars** we use for
     * testing, which are looped through by this test.
     *
     * @param string|null $staticDataFilterKey
     * @return mixed
     */
    protected function getEdgeCases(string $staticDataFilterKey = null)
    {
        $user = User::Factory()->create();

        return collect(Storage::disk('base')
            ->files('setup/extra-preset-jsons/edge-case-calendars'))
            ->map(function($file){
                return Str::replace('.json', '', $file);
            })->map(function($filename){
                return $this->retrieveJson($filename);
            })->when(
                $staticDataFilterKey,
                fn($collection) => $collection->filter(fn($calendar) => array_key_exists($staticDataFilterKey, $calendar['static_data']))
            )->map(function($calendarData) use ($user) {
                return Calendar::Factory()
                    ->for($user)
                    ->create($calendarData);
            });
    }

    protected function retrieveJson($presetFile)
    {
        return json_decode(file_get_contents(base_path($presetFile). '.json'), true);
    }
}
