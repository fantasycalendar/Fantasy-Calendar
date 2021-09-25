<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

use Carbon\Carbon;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PresetsSeeder extends Seeder
{


    public $presets_to_seed = [
        'database/seeders/presets/gregorian'
    ];

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::delete('delete from presets');
        DB::delete('delete from preset_events');
        DB::delete('delete from preset_event_categories');

        foreach($this->presetsToSeed() as $name) {
            $preset = $this->retrieveJson($name);
            $events = $this->retrieveJson($name.'-events');
            $categories = $this->retrieveJson($name.'-categories');

            DB::table('presets')->insert([
                'id' => Arr::get($preset, 'id'),
                'name' => Arr::get($preset, 'name'),
                'creator_id' => 1,
                'description' => Arr::get($preset, 'description'),
                'dynamic_data' => json_encode(Arr::get($preset, 'dynamic_data')),
                'static_data' => json_encode(Arr::get($preset, 'static_data')),
                'created_at' => Carbon::now(),
                'featured' => Arr::get($preset, 'featured', 0),
            ]);

            foreach($categories as $category) {

                foreach($category as $property => $value) {
                    $category[$property] = is_array($value) ? json_encode($value) : $value;
                }

                $category['created_at'] = Carbon::now();

                DB::table('preset_event_categories')->insert($category);
            }

            foreach($events as $event) {

                foreach($event as $property => $value) {
                    $event[$property] = is_array($value) ? json_encode($value) : $value;
                }

                $event['created_at'] = Carbon::now();

                DB::table('preset_events')->insert($event);
            }
        }
    }

    public function retrieveJson($presetFile)
    {
        return json_decode(file_get_contents(base_path($presetFile). '.json'), true);
    }

    private function presetsToSeed()
    {
        $presets = [];

        if(Storage::disk('base')->has('setup/extra-preset-jsons/presets')) {
            $presets = collect(Storage::disk('base')->files('setup/extra-preset-jsons/presets'))->reject(function($file){
                return Str::endsWith($file, ['-categories.json', '-events.json', '.git']);
            })->map(function($file){
                return Str::replace('.json', '', $file);
            })->toArray();

        }

        return array_merge($this->presets_to_seed, $presets);
    }
}
