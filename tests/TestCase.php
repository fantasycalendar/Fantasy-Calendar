<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\User;
use App\Calendar;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    protected function getEdgeCases()
    {
        $user = User::Factory()->create();

        return collect(Storage::disk('base')
            ->files('setup/extra-preset-jsons/edge-case-calendars'))
            ->map(function($file){
                return Str::replace('.json', '', $file);
            })->map(function($filename){
                return $this->retrieveJson($filename);
            })->map(function($calendarData) use ($user) {
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
