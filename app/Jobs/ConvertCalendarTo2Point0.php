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
        $this->old = json_decode($this->old_calendar->data);

        Calendar::hash($this->old_calendar->hash)->delete();

        if($this->old == null){
            throw new \Exception("JSON data malformed in " . $this->old_calendar->hash);
        }

        $this->dynamic = [];
        $this->static = [];
        $events = [];
        $categories = [];

        $this->dynamic['year'] = $this->old->year;
        $this->dynamic['timespan'] = $this->old->month-1;
        $this->dynamic['day'] = $this->old->day;

        $this->static['year_data'] = [
            'first_day' => $this->old->first_day+1,
            'global_week' => $this->old->weekdays,
            'overflow' => $this->old->overflow,
            'timespans' => [],
            'leap_days' => [],
        ];
        $this->static['eras'] = [];
        $this->static['moons'] = [];
        $this->static['cycles'] = [
            'format' => "",
            'data' => []
        ];

        foreach($this->old->months as $index => $month) {
            $this->static['year_data']['timespans'][] = [
                'name' => $month,
                'type' => 'month',
                'interval' => 1,
                'offset' => 0,
                'length' => $this->old->month_len[$index]
            ];
        }

        $this->moons = [];
        if(isset($this->old->moons)){
            foreach($this->old->moons as $index => $moon) {
                $this->static['moons'][] = [
                    'name' => $moon,
                    'cycle' => $this->old->lunar_cyc[$index],
                    'shift' => $this->old->lunar_shf[$index]-1,
                    'granularity' => 16,
                    'color' => $this->old->lunar_color[$index] ?? '#ffffff',
                    'hidden' => false,
                    'custom_phase' => false,
                    'cycle_rounding' => "floor"
                ];
                $this->moons[] = 16;
            }
        }

        if(isset($this->old->year_leap) && $this->old->year_leap > 1) {
            $this->static['year_data']['leap_days'][] = [
                'name' => 'Leap day',
			    'intercalary' => false,
			    'timespan' => $this->old->month_leap-1,
			    'adds_week_day' => false,
			    'day' => 0,
			    'week_day' => '',
			    'interval' => strval($this->old->year_leap),
			    'offset' => 0
            ];
        }

        $this->dynamic['epoch'] = $this->get_epoch($this->dynamic['year'], $this->dynamic['timespan'], $this->dynamic['day']);

        $this->static['clock'] = [
            'enabled' => $this->old->clock_enabled,
            'hours' => $this->old->n_hours ?? 24,
            'minutes' => 60,
            'offset' => 0,
            'render' => true,
            'crowding' => 0
        ];

        $this->dynamic['hour'] = $this->old->hour ?? 0;
        $this->dynamic['minute'] = $this->old->minute ?? 0;

        if($this->old->era != "") {
            $this->static['eras'][] = [
                "name" => $this->old->era,
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

        $this->static['seasons']['data'] = [];

        $this->static['seasons']['locations'] = [];

        $this->static['seasons']['global_settings'] = [
            "season_offset" => 0,
            "weather_offset" => 0,
            "periodic_seasons" => false,
            "seed" => $this->old->weather->weather_seed ?? rand(20, 200000000),
            "temp_sys" => $this->old->weather->weather_temp_sys ?? "imperial",
            "wind_sys" => $this->old->weather->weather_wind_sys ?? "imperial",
            "cinematic" => $this->old->weather->weather_cinematic ?? false,
            'enable_weather' => $this->old->weather_enabled ?? false,
        ];

        $this->dynamic['custom_location'] = false;

        if($this->old->solstice_enabled) {

            $inverse = $this->old->winter_month < $this->old->summer_month || ($this->old->winter_month == $this->old->summer_month && $this->old->winter_day < $this->old->summer_day);

            $winter = [
                'name' => 'Winter',
                'timespan' => $this->old->winter_month-1,
                'day' => $this->old->winter_day,
                'time' => [
                    'sunrise' => [
                        'hour' => $this->old->winter_rise,
                        'minute' => 0
                    ],
                    'sunset' => [
                        'hour' => $this->old->winter_set,
                        'minute' => 0
                    ]
                ],
                'transition_length' => $this->old->year_len/2,
                'duration' => 0
            ];

            $summer = [
                'name' => 'Summer',
                'timespan' => $this->old->summer_month-1,
                'day' => $this->old->summer_day,
                'time' => [
                    'sunrise' => [
                        'hour' => $this->old->summer_rise,
                        'minute' => 0
                    ],
                    'sunset' => [
                        'hour' => $this->old->summer_set,
                        'minute' => 0
                    ]
                ],
                'transition_length' => $this->old->year_len/2,
                'duration' => 0
            ];

            $this->static['seasons']['data'] = $inverse ? [$winter, $summer] :  [$summer, $winter];

            if(isset($this->old->weather_enabled) && $this->old->weather_enabled) {

                $this->dynamic['custom_location'] = ($this->old->weather->current_climate_type === 'custom');

                if($inverse) {
                    $first_season = [
                        'name' => 'winter',
                        'rise' => $this->old->winter_rise,
                        'set' => $this->old->winter_set,
                        'timespan' => $this->old->winter_month-1,
                        'day' => $this->old->winter_day
                    ];
                    $second_season = [
                        'name' => 'summer',
                        'rise' => $this->old->summer_rise,
                        'set' => $this->old->summer_set,
                        'timespan' => $this->old->summer_month-1,
                        'day' => $this->old->summer_day
                    ];
                }else{
                    $first_season = [
                        'name' => 'summer',
                        'rise' => $this->old->summer_rise,
                        'set' => $this->old->summer_set,
                        'timespan' => $this->old->summer_month-1,
                        'day' => $this->old->summer_day
                    ];
                    $second_season = [
                        'name' => 'winter',
                        'rise' => $this->old->winter_rise,
                        'set' => $this->old->winter_set,
                        'timespan' => $this->old->winter_month-1,
                        'day' => $this->old->winter_day
                    ];
                }

                foreach($this->old->weather->custom_climates as $name => $data) {

                    $data = json_decode(json_encode($data), true);

                    if($data == null){
                        throw new \Exception("Climate JSON data malformed!");
                    }

                    $this->static['seasons']['locations'][] = [
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
                            'large_noise_frequency' => $this->old->weather->weather_temp_scale*0.1,
                            'large_noise_amplitude' => $this->old->weather->weather_temp_scale*5,

                            'medium_noise_frequency' => $this->old->weather->weather_temp_scale*3,
                            'medium_noise_amplitude' => $this->old->weather->weather_temp_scale*2,

                            'small_noise_frequency' => $this->old->weather->weather_temp_scale*8,
                            'small_noise_amplitude' => $this->old->weather->weather_temp_scale*3
                        ]
                    ];
                }

                if($this->old->settings->auto_events){

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

        $this->dynamic['location'] = (isset($this->dynamic['custom_location']) && $this->dynamic['custom_location']) ?
            array_search($this->old->weather->current_climate, array_keys(json_decode(json_encode($this->old->weather->custom_climates), true))) :
            $this->old->weather->current_climate ?? 'Cool and Rainy';

        $this->dynamic['custom_location'] = $this->dynamic['custom_location'] ?? false;

        $this->static['settings'] = [
            'layout' => 'grid',
            'year_zero_exists' => true,
            'show_current_month' => $this->old->settings->show_current_month ?? false,
            'allow_view' => $this->old->settings->allow_view ?? false,
            'only_backwards' => $this->old->settings->only_backwards ?? false,
            'only_reveal_today' => $this->old->settings->only_reveal_today ?? false,
            'hide_moons' => $this->old->settings->hide_moons ?? false,
            'hide_clock' => $this->old->settings->hide_clock ?? false,
            'hide_events' => $this->old->settings->hide_events ?? false,
            'hide_eras' => false,
            'hide_all_weather' => $this->old->settings->hide_weather ?? false,
            'hide_future_weather' => false,
            'add_month_number' => $this->old->settings->add_month_number ?? false,
            'add_year_day_number' => $this->old->settings->add_year_day_number ?? false
        ];

        foreach($this->old->events as $event) {
            $new_event_data = $this->convertEvent($event);
            if($new_event_data){
                $events[] = $new_event_data;
            }
        }

        $this->new_calendar = Calendar::create([
            'user_id' => $this->old_calendar->user_id,
            'name' => $this->old->name,
            'dynamic_data' => $this->dynamic,
            'static_data' => $this->static,
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
                        ['Date', '0', [
                            strval($data->year),
                            strval($data->month-1),
                            strval($data->day),
                            $this->get_epoch($data->year, $data->month-1, $data->day)
                        ]]
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
                        ['Weekday', '0', [$this->static['year_data']['global_week'][$data->week_day]]]
                    ];
                    break;
                case 'fortnightly':
                    $conditions = [
                        ['Weekday', '0', [$this->static['year_data']['global_week'][$data->week_day]]],
                        ['&&'],
                        ['Week', '13', [$data->week_even ? '2' : '1', '0']]
                    ];
                    break;
                case 'monthly_date':
                    $conditions = [
                        ['Day', '0', ["$data->day"]]
                    ];
                    break;
                case 'annually_date':
                    $conditions = [
                        ['Month', '0', [strval($data->month-1)]],
                        ['&&'],
                        ['Day', '0', ["$data->day"]]
                    ];
                    break;
                case 'monthly_weekday':
                    $conditions = [
                        ['Weekday', '0', [$this->static['year_data']['global_week'][$data->week_day]]],
                        ['&&'],
                        ['Week', '0', ["$data->week_day_number"]]
                    ];
                    break;
                case 'annually_month_weekday':
                    $conditions = [
                        ['Month', '0', [strval($data->month-1)]],
                        ['&&'],
                        ['Weekday', '0', [$this->static['year_data']['global_week'][$data->week_day]]],
                        ['&&'],
                        ['Week', '0', [$data->week_day_number]]
                    ];
                    break;

                case 'every_x_day':
                    $conditions = [
                        ['Epoch', '6', ["$data->every", strval($data->modulus+1)]]
                    ];
                    break;

                case 'every_x_weekday':
                    $conditions = [
                        ['Weekday', '0', ["$data->week_day"]],
                        ['&&'],
                        ['Week', '20', ["$data->every", strval($data->modulus+1)]]
                    ];
                    break;

                case 'every_x_monthly_date':
                    $conditions = [
                        ['Day', '0', ["$data->day"]],
                        ['&&'],
                        ['Month', '13', ["$data->every", strval($data->modulus+1)]]
                    ];
                    break;

                case 'every_x_monthly_weekday':
                    $conditions = [
                        ['Weekday', '0', [$this->static['year_data']['global_week'][$data->week_day]]],
                        ['&&'],
                        ['Week', '0', [$data->week_day_number]],
                        ['&&'],
                        ['Month', '13', ["$data->every", strval($data->modulus+1)]]
                    ];
                    break;

                case 'every_x_annually_date':
                    $conditions = [
                        ['Day', '0', ["$data->day"]],
                        ['&&'],
                        ['Month', '0', [strval($data->month-1)]],
                        ['&&'],
                        ['Year', '6', ["$data->every", strval($data->modulus+1)]]
                    ];
                    break;

                case 'every_x_annually_weekday':
                    $conditions = [
                        ['Weekday', '0', [$this->static['year_data']['global_week'][$data->week_day]]],
                        ['&&'],
                        ['Week', '0', [$data->week_day_number]],
                        ['&&'],
                        ['Month', '0', [strval($data->month-1)]],
                        ['&&'],
                        ['Year', '6', ["$data->every", strval($data->modulus+1)]]
                    ];
                    break;

                case 'moon_every':
                    if(isset($this->moons[$data->moon_id])){
                        $conditions = [
                            ['Moons', '0', ["$data->moon_id", $data->moon_phase]]
                        ];
                    }
                    break;

                case 'moon_monthly':
                    if(isset($this->moons[$data->moon_id])){
                        $conditions = [
                            ['Moons', '0', ["$data->moon_id", $data->moon_phase]],
                            ['&&'],
                            ['Moons', '7', ["$data->moon_id", $data->moon_phase_number]]
                        ];
                    }
                    break;

                case 'moon_anually':
                    if(isset($this->moons[$data->moon_id])){
                        $conditions = [
                            ['Moons', '0', ["$data->moon_id", $data->moon_phase]],
                            ['&&'],
                            ['Moons', '7', ["$data->moon_id", $data->moon_phase_number]],
                            ['&&'],
                            ['Month', '0', [strval($data->month-1)]]
                        ];
                    }
                    break;

                case 'multimoon_every':
                case 'multimoon_anually':

                    if($event->repeats == 'multimoon_every'){

                        $conditions = [];

                    }else{

                        $conditions = [['Month', '0', strval($data->month-1)], ['&&']];

                    }

                    foreach($data->moons as $index => $moon) {

                        if(isset($this->moons[$index])){

                            if(count($conditions) % 2 == 1) {
                                $conditions[] = ['&&'];
                            }

                            $conditions[] = [
                                'Moons',
                                '0',
                                ["$index", $moon->moon_phase]
                            ];

                        }

                    }
                    break;

            }
        }

        $group = ["", []];

        if(isset($event->from_date)){

            $group[1][] = ['Date', '2', [
                    strval($event->from_date->year),
                    strval($event->from_date->month-1),
                    strval($event->from_date->day),
                    $this->get_epoch($event->from_date->year, $event->from_date->month-1, $event->from_date->day)
                ]
            ];

            if(isset($event->to_date)){
    
                if(count($group[1]) > 0){
                    $group[1][] = ['&&'];
                }
    
                $group[1][] = ['Date', '3', [
                        strval($event->to_date->year),
                        strval($event->to_date->month-1),
                        strval($event->to_date->day),
                        $this->get_epoch($event->to_date->year, $event->to_date->month-1, $event->to_date->day)
                    ]
                ];
    
            }

            if(isset($event->from_date) || isset($event->to_date)){
                $conditions[] = ['&&'];
                $conditions[] = $group;
            }

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

    private function get_epoch($year, $month, $day){

        $epoch = 0;

        foreach($this->static['year_data']['timespans'] as $timespan_index => $timespan){

            if($timespan_index < $month){
                $actual_year = $year+1;
            }else{
                $actual_year = $year;
            }

            $epoch += $timespan['length'] * $actual_year;

        }

        if(!empty($this->static['year_data']['leap_days'])){
            $interval = intval($this->static['year_data']['leap_days'][0]['interval']);
            $leap_month = $this->static['year_data']['leap_days'][0]['timespan'];
            $epoch += floor($year / $interval);
            if(
                ($year > 0 && $year % $interval != 0)
                ||
                ($year % $interval == 0 && $month > $leap_month)
            ){
                $epoch++;
            }
        }

        $epoch += $day - 1;

        return $epoch;

    }
}
