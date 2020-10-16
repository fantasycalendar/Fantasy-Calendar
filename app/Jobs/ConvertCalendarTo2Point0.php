<?php

namespace App\Jobs;

use App\Calendar;
use App\OldCalendar;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ConvertCalendarTo2Point0 implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $old_calendar;

    protected $new_calendar;

    protected $conversion_batch;

    private $created_season_events;

    /**
     * Create a new job instance.
     * @param OldCalendar $old_calendar
     * @param int $conversion_batch
     *
     * @return void
     */
    public function __construct(OldCalendar $old_calendar, int $conversion_batch = 0)
    {
        $this->old_calendar = $old_calendar;
        $this->conversion_batch = $conversion_batch;
        $this->created_season_events = false;
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $old = json_decode($this->old_calendar->data);

        Calendar::hash($this->old_calendar->hash)->delete();

        if($old == null){
            throw new \Exception("JSON data malformed!");
        }

        $dynamic = [];
        $static = [];
        $events = [];
        $categories = [];

        $dynamic['year'] = $old->year;
        $dynamic['timespan'] = $old->month-1;
        $dynamic['day'] = $old->day;

        $static['year_data'] = [
            'first_day' => $old->first_day+1,
            'global_week' => $old->weekdays,
            'overflow' => $old->overflow,
            'timespans' => [],
            'leap_days' => [],
        ];
        $static['eras'] = [];
        $static['moons'] = [];
        $static['cycles'] = [
            'format' => "",
            'data' => []
        ];

        foreach($old->months as $index => $month) {
            $static['year_data']['timespans'][] = [
                'name' => $month,
                'type' => 'month',
                'interval' => 1,
                'offset' => 0,
                'length' => $old->month_len[$index]
            ];
        }

        $this->moons = [];
        if(isset($old->moons)){
            foreach($old->moons as $index => $moon) {
                $static['moons'][] = [
                    'name' => $moon,
                    'cycle' => $old->lunar_cyc[$index],
                    'shift' => $old->lunar_shf[$index]-1,
                    'granularity' => 16,
                    'color' => $old->lunar_color[$index] ?? '#ffffff',
                    'hidden' => false,
                    'custom_phase' => false
                ];
                $this->moons[] = 16;
            }
        }

        if(isset($old->year_leap) && $old->year_leap > 1) {
            $static['year_data']['leap_days'][] = [
                'name' => 'Leap day',
			    'intercalary' => false,
			    'timespan' => $old->month_leap-1,
			    'adds_week_day' => false,
			    'day' => 0,
			    'week_day' => '',
			    'interval' => "$old->year_leap",
			    'offset' => 0
            ];
        }

        $dynamic['epoch'] = 0;

        foreach($static['year_data']['timespans'] as $timespan_index => $timespan){

            if($timespan_index < $dynamic['timespan']){
                $actual_year = $dynamic['year']+1;
            }else{
                $actual_year = $dynamic['year'];
            }

            $dynamic['epoch'] += $timespan['length'] * $actual_year;

        }

        if(!empty($static['year_data']['leap_days'])){
            $dynamic['epoch'] += floor($old->year / intval($static['year_data']['leap_days'][0]['interval']));
            if($dynamic['year'] > 0 || $dynamic['timespan'] > $static['year_data']['leap_days'][0]['timespan']){
                $dynamic['epoch']++;
            }
        }

        $dynamic['epoch'] += $old->day - 1;

        if($old->clock_enabled) {
            $static['clock'] = [
                'enabled' => true,
                'hours' => $old->n_hours,
                'minutes' => 60,
                'offset' => 0,
                'render' => true,
                'crowding' => 0
            ];

            $dynamic['hour'] = $old->hour;
            $dynamic['minute'] = $old->minute;
        }

        if($old->era != "") {
            $static['eras'][] = [
                "name" => $old->era,
                "formatting" => "Year {{year}} {{era_name}}",
                "description" => "",
                "settings" => [
                    "show_as_event" => false,
                    "use_custom_format" => true,
                    "starting_era" => true,
                    "event_category_id" => -1,
                    "ends_year" => false,
                    "restart" => false
                ],
                "date" => [
                    "year" => 0,
                    "timespan" => 0,
                    "day" => 1
                ]
           ];
        }

        if($old->solstice_enabled) {

            $inverse = $old->winter_month < $old->summer_month || ($old->winter_month == $old->summer_month && $old->winter_day < $old->summer_day);

            $static['seasons']['locations'] = [];

            $static['seasons']['global_settings'] = [
                "season_offset" => 0,
                "weather_offset" => 0,
                "periodic_seasons" => false,
                "seed" => $old->weather->weather_seed ?? rand(20, 200000000),
                "temp_sys" => $old->weather->weather_temp_sys ?? "imperial",
                "wind_sys" => $old->weather->weather_wind_sys ?? "imperial",
                "cinematic" => $old->weather->weather_cinematic ?? false,
                'enable_weather' => $old->weather_enabled ?? false,
            ];

            $winter = [
                'name' => 'Winter',
                'timespan' => $old->winter_month-1,
                'day' => $old->winter_day,
                'time' => [
                    'sunrise' => [
                        'hour' => $old->winter_rise,
                        'minute' => 0
                    ],
                    'sunset' => [
                        'hour' => $old->winter_set,
                        'minute' => 0
                    ]
                ],
                'transition_length' => $old->year_len/2,
                'duration' => 0
            ];

            $summer = [
                'name' => 'Summer',
                'timespan' => $old->summer_month-1,
                'day' => $old->summer_day,
                'time' => [
                    'sunrise' => [
                        'hour' => $old->summer_rise,
                        'minute' => 0
                    ],
                    'sunset' => [
                        'hour' => $old->summer_set,
                        'minute' => 0
                    ]
                ],
                'transition_length' => $old->year_len/2,
                'duration' => 0
            ];

            $static['seasons']['data'] = $inverse ? [$winter, $summer] :  [$summer, $winter];

            if(isset($old->weather_enabled) && $old->weather_enabled) {

                if($inverse) {
                    $first_season = [
                        'name' => 'winter',
                        'rise' => $old->winter_rise,
                        'set' => $old->winter_set,
                        'timespan' => $old->winter_month-1,
                        'day' => $old->winter_day
                    ];
                    $second_season = [
                        'name' => 'summer',
                        'rise' => $old->summer_rise,
                        'set' => $old->summer_set,
                        'timespan' => $old->summer_month-1,
                        'day' => $old->summer_day
                    ];
                }else{
                    $first_season = [
                        'name' => 'summer',
                        'rise' => $old->summer_rise,
                        'set' => $old->summer_set,
                        'timespan' => $old->summer_month-1,
                        'day' => $old->summer_day
                    ];
                    $second_season = [
                        'name' => 'winter',
                        'rise' => $old->winter_rise,
                        'set' => $old->winter_set,
                        'timespan' => $old->winter_month-1,
                        'day' => $old->winter_day
                    ];
                }

                foreach($old->weather->custom_climates as $name => $data) {

                    $data = json_decode(json_encode($data), true);

                    if($data == null){
                        throw new \Exception("Climate JSON data malformed!");
                    }

                    $static['seasons']['locations'][] = [
                        'name' => $name,
                        'seasons' => [
                            [
                                'name' => '',
                                'custom_name' => false,
                                'time' => [
                                    'sunrise' => [
                                        'hour' => $first_season['rise'],
                                        'minute' => 0
                                    ],
                                    'sunset' => [
                                        'hour' => $first_season['set'],
                                        'minute' => 0
                                    ]
                                ],
                                'weather' => [
                                    'temp_low' => $data[$first_season['name']]['temperature']['cold'],
                                    'temp_high' => $data[$first_season['name']]['temperature']['hot'],
                                    'precipitation' => $data[$first_season['name']]['precipitation'],
                                    'precipitation_intensity' => $data[$first_season['name']]['precipitation'] * 0.5
                                ]
                            ],
                            [
                                'name' => '',
                                'custom_name' => false,
                                'time' => [
                                    'sunrise' => [
                                        'hour' => $second_season['rise'],
                                        'minute' => 0
                                    ],
                                    'sunset' => [
                                        'hour' => $second_season['set'],
                                        'minute' => 0
                                    ]
                                ],
                                'weather' => [
                                    'temp_low' => $data[$second_season['name']]['temperature']['cold'],
                                    'temp_high' => $data[$second_season['name']]['temperature']['hot'],
                                    'precipitation' => $data[$second_season['name']]['precipitation'],
                                    'precipitation_intensity' => $data[$second_season['name']]['precipitation'] * 0.5
                                ]
                            ],
                        ],
                        'settings' => [
                            'timezone' => ['hour' => 0, 'minute' => 0],
                            'large_noise_frequency' => $old->weather->weather_temp_scale*0.1,
                            'large_noise_amplitude' => $old->weather->weather_temp_scale*5,

                            'medium_noise_frequency' => $old->weather->weather_temp_scale*3,
                            'medium_noise_amplitude' => $old->weather->weather_temp_scale*2,

                            'small_noise_frequency' => $old->weather->weather_temp_scale*8,
                            'small_noise_amplitude' => $old->weather->weather_temp_scale*3
                        ]
                    ];
                }

                $dynamic['custom_location'] = ($old->weather->current_climate_type === 'custom');

                if($old->settings->auto_events){

                    $events[] = [
                        "name" => $inverse ? "Winter Solstice" : "Summer Solstice",
                        "description" =>  '',
                        "data" => [
                            'has_duration' =>  false,
                            'duration' =>  0,
                            'show_first_last' =>  false,
                            'limited_repeat' =>  false,
                            'limited_repeat_num' =>  0,
                            'connected_events' =>  [],
                            'date' =>  [],
                            "conditions" => [
                                ["Season","0",[0]],
                                ["&&"],
                                ["Season","8",[1]],
                            ]
                        ],
                        "event_category_id" => "-1",
                        "settings" => [
                            "color" => "Green",
                            "text" => "text",
                            "hide" => false,
                            "hide_full" => false,
                            "print" => false
                        ]
                    ];

                    $events[] = [
                        "name" => $inverse ? "Spring Equinox" : "Autumn Equinox",
                        "description" =>  '',
                        "data" => [
                            'has_duration' =>  false,
                            'duration' =>  0,
                            'show_first_last' =>  false,
                            'limited_repeat' =>  true,
                            'limited_repeat_num' =>  5,
                            'connected_events' =>  [],
                            'date' =>  [],
                            "conditions" => [
                                ["Season","0",[0]],
                                ["&&"],
                                ["Season","2",[50]],
                            ]
                        ],
                        "event_category_id" => "-1",
                        "settings" => [
                            "color" => "Green",
                            "text" => "text",
                            "hide" => false,
                            "hide_full" => false,
                            "print" => false
                        ]
                    ];

                    $events[] = [
                        "name" => $inverse ? "Summer Solstice" : "Winter Solstice",
                        "description" =>  '',
                        "data" => [
                            'has_duration' =>  false,
                            'duration' =>  0,
                            'show_first_last' =>  false,
                            'limited_repeat' =>  false,
                            'limited_repeat_num' =>  0,
                            'connected_events' =>  [],
                            'date' =>  [],
                            "conditions" => [
                                ["Season","0",[1]],
                                ["&&"],
                                ["Season","8",[1]],
                            ]
                        ],
                        "event_category_id" => "-1",
                        "settings" => [
                            "color" => "Green",
                            "text" => "text",
                            "hide" => false,
                            "hide_full" => false,
                            "print" => false
                        ]
                    ];

                    $events[] = [
                        "name" => $inverse ? "Autumn Equinox" : "Spring Equinox",
                        "description" =>  '',
                        "data" => [
                            'has_duration' =>  false,
                            'duration' =>  0,
                            'show_first_last' =>  false,
                            'limited_repeat' =>  true,
                            'limited_repeat_num' =>  5,
                            'connected_events' =>  [],
                            'date' =>  [],
                            "conditions" => [
                                ["Season","0",[1]],
                                ["&&"],
                                ["Season","2",[50]],
                            ]
                        ],
                        "event_category_id" => "-1",
                        "settings" => [
                            "color" => "Green",
                            "text" => "text",
                            "hide" => false,
                            "hide_full" => false,
                            "print" => false
                        ]
                    ];

                    $this->created_season_events = true;

                }

            }

        }

        $dynamic['location'] = (isset($dynamic['custom_location']) && $dynamic['custom_location']) ?
            array_search($old->weather->current_climate, array_keys(json_decode(json_encode($old->weather->custom_climates), true))) :
            $old->weather->current_climate ?? 'Cool and Rainy';

        $dynamic['custom_location'] = $dynamic['custom_location'] ?? false;

        $static['settings'] = [
            'layout' => 'grid',
            'year_zero_exists' => true,
            'show_current_month' => $old->settings->show_current_month ?? false,
            'allow_view' => $old->settings->allow_view ?? false,
            'only_backwards' => $old->settings->only_backwards ?? false,
            'only_reveal_today' => $old->settings->only_reveal_today ?? false,
            'hide_moons' => $old->settings->hide_moons ?? false,
            'hide_clock' => $old->settings->hide_clock ?? false,
            'hide_events' => $old->settings->hide_events ?? false,
            'hide_eras' => false,
            'hide_all_weather' => $old->settings->hide_weather ?? false,
            'hide_future_weather' => false,
            'add_month_number' => $old->settings->add_month_number ?? false,
            'add_year_day_number' => $old->settings->add_year_day_number ?? false
        ];

        foreach($old->events as $event) {
            $new_event_data = $this->convertEvent($event);
            if($new_event_data){
                $events[] = $new_event_data;
            }
        }

        $this->new_calendar = Calendar::create([
            'user_id' => $this->old_calendar->user_id,
            'name' => $old->name,
            'dynamic_data' => $dynamic,
            'static_data' => $static,
            'hash' => $this->old_calendar->hash,
            'converted_at' => Carbon::now(),
            'conversion_batch' => $this->conversion_batch ? $this->conversion_batch : Calendar::max('conversion_batch') + 1,
        ]);

        $eventids = SaveCalendarEvents::dispatchNow($events, [], $this->new_calendar->id);

        $this->sanityCheck();
        return $this->new_calendar;
    }

    public function sanityCheck() {
        $this->assertSameYearLength();
        $this->assertSameNumberOfMonths();
        $this->assertSameGlobalWeek();
        $this->assertSameMoons();
        $this->assertSameEvents();
    }

    public function assertSameYearLength() {
        $old_year_length = !json_decode($this->old_calendar->data, true)['year_len'];
        $new_year_length = 0;

        foreach($this->new_calendar->static_data['year_data']['timespans'] as $timespan) {
            $new_year_length += $timespan['length'];
        }

        if($old_year_length == $new_year_length) {
            throw new \Exception("Year length is not the same! Expected $old_year_length and got $new_year_length on calendar {$this->new_calendar->name}");
        }

        return true;
    }

    public function assertSameNumberOfMonths() {
        $old_months = count(json_decode($this->old_calendar->data, true)['months']);
        $new_months = count($this->new_calendar->static_data['year_data']['timespans']);

        if($old_months !== $new_months) {
            throw new \Exception("The new calendar has the wrong number of months! Expected $old_months and got $new_months on calendar {$this->new_calendar->name}");
        }
    }

    public function assertSameGlobalWeek() {
        $old_weekdays = json_decode($this->old_calendar->data, true)['weekdays'];
        $new_weekdays = $this->new_calendar->static_data['year_data']['global_week'];

        if($old_weekdays !== $new_weekdays) {
            throw new \Exception("The new calendar has the wrong number of week days! Expected $old_weekdays and got $new_weekdays on calendar {$this->new_calendar->name}");
        }
    }

    public function assertSameMoons() {
        $old = json_decode($this->old_calendar->data, true);

        if(array_key_exists('moons', $old)){

            $old_moons = count($old['moons']);
            $new_moons = count($this->new_calendar->static_data['moons']);

            if($old_moons !== $new_moons) {
                throw new \Exception("The new calendar has the wrong number of moons! Expected $old_moons and got $new_moons on calendar {$this->new_calendar->name}");
            }

        }
    }

    public function assertSameEvents() {
        $old_events = count(json_decode($this->old_calendar->data, true)['events']);
        $new_events = count($this->new_calendar->events);

        if($this->created_season_events){
            $new_events = $new_events-4;
        }

        if($old_events !== $new_events) {
            throw new \Exception("The new calendar has the wrong number of events! Expected $old_events and got $new_events on calendar {$this->new_calendar->name}");
        }
    }

    public function convertEvent($event) {
        $conditions = [];
        $date = [];

        if(!property_exists($event, "data")){
            return false;
        }

        $data = $event->data;

        if(isset($data->moon_name)) {
            if(!isset($data->moons)) {
                $data->moon_id = 0;
            } else {
                $data->moon_id = array_search($data->moon_name, $data->moons);
            }
        }

        $conditions = [];

        $arrayified = json_decode(json_encode($event->data),true);

        if(!empty($arrayified)){
            switch($event->repeats) {
                case 'once':
                    $conditions = [
                        ['Year', '0', ["{$data->year}"]],
                        ['&&'],
                        ['Month', '0', [strval($data->month-1)]],
                        ['&&'],
                        ['Day', '0', ["{$data->day}"]]
                    ];
                    $date = [$data->year, $data->month-1, $data->day];
                    break;
                case 'daily':
                    $conditions = [
                        ['Epoch', '6', ['1', '0']]
                    ];
                    break;
                case 'weekly':
                    $conditions = [
                        ['Weekday', '0', [strval($data->week_day+1)]]
                    ];
                    break;
                case 'fortnightly':
                    $conditions = [
                        ['Weekday', '0', [strval($data->week_day+1)]],
                        ['&&'],
                        ['Week', '13', [$data->week_even ? '2' : '1', '0']]
                    ];
                    break;
                case 'monthly_date':
                    $conditions = [
                        ['Day', '0', ["{$data->day}"]]
                    ];
                    break;
                case 'annually_date':
                    $conditions = [
                        ['Month', '0', [strval($data->month-1)]],
                        ['&&'],
                        ['Day', '0', ["{$data->day}"]]
                    ];
                    break;
                case 'monthly_weekday':
                    $conditions = [
                        ['Weekday', '0', [strval($data->week_day+1)]],
                        ['&&'],
                        ['Week', '0', ["{$data->week_day_number}"]]
                    ];
                    break;
                case 'annually_month_weekday':
                    $conditions = [
                        ['Month', '0', [strval($data->month-1)]],
                        ['&&'],
                        ['Weekday', '0', [strval($data->week_day+1)]],
                        ['&&'],
                        ['Week', '0', [$data->week_day_number]]
                    ];
                    break;

                case 'every_x_day':
                    $conditions = [
                        ['Epoch', '6', ["{$data->every}", strval($data->modulus+1)]]
                    ];
                    break;

                case 'every_x_weekday':
                    $conditions = [
                        ['Weekday', '0', ["{$data->week_day}"]],
                        ['&&'],
                        ['Week', '20', ["{$data->every}", strval($data->modulus+1)]]
                    ];
                    break;

                case 'every_x_monthly_date':
                    $conditions = [
                        ['Day', '0', ["{$data->day}"]],
                        ['&&'],
                        ['Month', '13', ["{$data->every}", strval($data->modulus+1)]]
                    ];
                    break;

                case 'every_x_monthly_weekday':
                    $conditions = [
                        ['Weekday', '0', [strval($data->week_day+1)]],
                        ['&&'],
                        ['Week', '0', [$data->week_day_number]],
                        ['&&'],
                        ['Month', '13', ["{$data->every}", strval($data->modulus+1)]]
                    ];
                    break;

                case 'every_x_annually_date':
                    $conditions = [
                        ['Day', '0', ["{$data->day}"]],
                        ['&&'],
                        ['Month', '0', [strval($data->month-1)]],
                        ['&&'],
                        ['Year', '6', ["{$data->every}", strval($data->modulus+1)]]
                    ];
                    break;

                case 'every_x_annually_weekday':
                    $conditions = [
                        ['Weekday', '0', [strval($data->week_day+1)]],
                        ['&&'],
                        ['Week', '0', [$data->week_day_number]],
                        ['&&'],
                        ['Month', '0', [strval($data->month-1)]],
                        ['&&'],
                        ['Year', '6', ["{$data->every}", strval($data->modulus+1)]]
                    ];
                    break;

                case 'moon_every':
                    if(isset($this->moons[$data->moon_id])){
                        $conditions = [
                            ['Moons', '0', ["{$data->moon_id}", $data->moon_phase]]
                        ];
                    }
                    break;

                case 'moon_monthly':
                    if(isset($this->moons[$data->moon_id])){
                        $conditions = [
                            ['Moons', '0', ["{$data->moon_id}", $data->moon_phase]],
                            ['&&'],
                            ['Moons', '7', ["{$data->moon_id}", $data->moon_phase_number]]
                        ];
                    }
                    break;

                case 'moon_anually':
                    if(isset($this->moons[$data->moon_id])){
                        $conditions = [
                            ['Moons', '0', ["{$data->moon_id}", $data->moon_phase]],
                            ['&&'],
                            ['Moons', '7', ["{$data->moon_id}", $data->moon_phase_number]],
                            ['&&'],
                            ['Month', '0', [strval($data->month-1)]]
                        ];
                    }
                    break;

                case 'multimoon_every':
                case 'multimoon_anually':

                    $conditions = ($event->repeats == 'multimoon_every') ? [] : [['Month', '0', strval($data->month-1)], ['&&']];
                    foreach($data->moons as $index => $moon) {

                        if(isset($this->moons[$index])){

                            $conditions[] = [
                                'Moons',
                                '0',
                                ["$index", $moon->moon_phase]
                            ];

                            if(count($conditions) % 2 != 0) {
                                $conditions[] = ['&&'];
                            }

                        }

                    }
                    break;

            }
        }


        $group = ["", []];

        if(isset($event->from_date)){

            if(count($conditions) > 0){
                $conditions[] = ['&&'];
            }

            $group[1][] = ['', [
                    ['Year', '2', [strval($event->from_date->year)]],
                    ['&&'],
                    ['Month', '2', [strval($event->from_date->month)]],
                    ['&&'],
                    ['Day', '2', [strval($event->from_date->day)]]
                ]
            ];
        }

        if(isset($event->to_date)){

            if(count($group[1]) > 0){
                $group[1][] = ['&&'];
            }

            $group[1][] = ['', [
                    ['Year', '3', [strval($event->to_date->year)]],
                    ['&&'],
                    ['Month', '3', [strval($event->to_date->month)]],
                    ['&&'],
                    ['Day', '3', [strval($event->to_date->day)]]
                ]
            ];

        }

        if(isset($event->from_date) || isset($event->to_date)){
            if(count($conditions) > 0){
                $conditions[] = ['&&'];
            }
            $conditions[] = $group;
        }

        return [
            'name' => $event->name,
            'description' => $event->description,
            'data' => [
                'has_duration' => false,
                'duration' => 0,
                'show_first_last' => false,
                'only_happen_once' => false,
                'connected_events' => [],
                'date' => $date,
                'conditions' => $conditions
            ],
            'event_category_id' => '-1',
            'settings' => [
                'color' => 'Dark-Solid',
                'text' => 'text',
                'hide_full' => false,
                'hide' => $event->hide ?? false,
                'print' => $event->print ?? false,
            ]
        ];
    }
}
