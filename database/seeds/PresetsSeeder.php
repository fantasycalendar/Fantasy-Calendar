<?php

use Illuminate\Database\Seeder;

use Carbon\Carbon;

class PresetsSeeder extends Seeder
{


    public $presets_to_seed = [
        'gregorian'
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

        $index = 1;
        foreach($this->presets_to_seed as $name) {

            $data = json_decode(file_get_contents(__DIR__ . '/presets/' . $name . '.json'), true);
            $events = json_decode(file_get_contents(__DIR__ . '/presets/' . $name . '-events.json'), true);
            $categories = json_decode(file_get_contents(__DIR__ . '/presets/' . $name . '-categories.json'), true);
            
            DB::table('presets')->insert([
                'id' => $index,
                'name' => $data['name'],
                'description' => $data['description'],
                'dynamic_data' => json_encode($data['dynamic_data']),
                'static_data' => json_encode($data['static_data']),
                'created_at' => Carbon::now()
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

            $index++;

        }
    }
}
