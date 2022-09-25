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
