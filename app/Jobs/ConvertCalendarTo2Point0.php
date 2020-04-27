<?php

namespace App\Jobs;

use App\Calendar;
use App\OldCalendar;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ConvertCalendarTo2Point0 implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     * @param OldCalendar $calendar
     *
     * @return void
     */
    public function __construct(OldCalendar $calendar)
    {
        $this->old_calendar = $calendar;
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $old = json_decode($this->old_calendar->data);

//        dd($old);

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
            'timespans' => []
        ];
        $static['eras'] = [];
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

        foreach($old->moons as $index => $moon) {
            $static['moons'][] = [
                'name' => $moon,
                'cycle' => $old->lunar_cyc[$index],
                'shift' => $old->lunar_shf[$index],
                'granularity' => $this->determineMoonGranularity($old->lunar_cyc[$index]),
                'color' => $old->lunar_color[$index],
                'hidden' => false,
                'custom_phase' => false
            ];
        }

        foreach($old->events as $event) {
            $events[] = $this->convertEvent($event);
        }

        if(isset($old->year_leap) && $old->year_leap > 1) {
            $static['year_data']['leap_days'][] = [
                'name' => 'Leap day',
			    'intercalary' => false,
			    'timespan' => $old->month_leap-1,
			    'adds_week_day' => false,
			    'day' => 0,
			    'week_day' => '',
			    'interval' => "{$old->year_leap}",
			    'offset' => 0
            ];
        }

        if($old->clock_enabled) {
            $static['clock'] = [
                'enabled' => true,
                'hours' => $old->n_hours,
                'minutes' => 60,
                'offset' => 0,
                'render' => true,
            ];

            $dynamic['hour'] = $old->hour;
            $dynamic['minute'] = $old->minute;
        }

        if($old->solstice_enabled) {
            $static['seasons']['global_settings'] = [
                "season_offset" => 0,
                "weather_offset" => 0,
                "seed" => $old->weather->weather_seed,
                "temp_sys" => $old->weather->weather_temp_sys,
                "wind_sys" => $old->weather->weather_wind_sys,
                "cinematic" => $old->weather->weather_cinematic,
                "periodic_seasons" => false,
                'enable_weather' => $old->weather_enabled,
            ];

            $winter = [
                'Name' => 'Winter',
                'timespan' => $old->winter_month,
                'day' => $old->winter_day,
                'time' => [
                    'sunrise' => [
                        'hour' => $old->winter_rise,
                        'minute' => 0
                    ],
                    'sunset' => [
                        'hour' => $old->winter_set
                    ]
                ]
            ];

            $summer = [
                'Name' => 'Summer',
                'timespan' => $old->summer_month,
                'day' => $old->summer_day,
                'time' => [
                    'sunrise' => [
                        'hour' => $old->summer_rise,
                        'minute' => 0
                    ],
                    'sunset' => [
                        'hour' => $old->summer_set
                    ]
                ]
            ];

            $static['seasons']['data'] = ($old->winter_month > $old->summer_month) ? [$summer, $winter] : [$winter, $summer];
        }

        if($old->weather_enabled) {
            $static['seasons']['locations'] = [];

            if($old->winter_month > $old->summer_month) {
                $first_season = [
                    'name' => 'summer',
                    'rise' => $old->summer_rise,
                    'set' => $old->summer_set,
                    'timespan' => $old->summer_month,
                    'day' => $old->summer_day
                ];
                $second_season = [
                    'name' => 'winter',
                    'rise' => $old->winter_rise,
                    'set' => $old->winter_set,
                    'timespan' => $old->winter_month,
                    'day' => $old->winter_day
                ];
            }else{
                $first_season = [
                    'name' => 'winter',
                    'rise' => $old->winter_rise,
                    'set' => $old->winter_set,
                    'timespan' => $old->winter_month,
                    'day' => $old->winter_day
                ];
                $second_season = [
                    'name' => 'summer',
                    'rise' => $old->summer_rise,
                    'set' => $old->summer_set,
                    'timespan' => $old->summer_month,
                    'day' => $old->summer_day
                ];
            }

            foreach($old->weather->custom_climates as $name => $data) {
                $data = json_decode(json_encode($data), true);

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

            $dynamic['location'] = ($dynamic['custom_location']) ?
                array_search($old->weather->current_climate, array_keys(json_decode(json_encode($old->weather->custom_climates), true))) :
                $old->weather->current_climate;
        }

        $static['settings'] = [
            'layout' => 'grid',
            'show_current_month' => $old->settings->show_current_month,
            'allow_view' => $old->settings->allow_view,
            'only_backwards' => $old->settings->only_backwards,
            'only_reveal_today' => $old->settings->only_reveal_today,
            'hide_moons' => $old->settings->hide_moons,
            'hide_clock' => $old->settings->hide_clock,
            'hide_events' => $old->settings->hide_events,
            'hide_eras' => false,
            'hide_all_weather' => $old->settings->hide_weather,
            'hide_future_weather' => false,
            'add_month_number' => $old->settings->add_month_number,
            'add_year_day_number' => $old->settings->add_year_day_number
        ];

        $calendar = Calendar::create([
            'user_id' => $this->old_calendar->user_id,
            'name' => $old->name,
            'dynamic_data' => $dynamic,
            'static_data' => $static,
            'hash' => $this->old_calendar->hash
        ]);

        $eventids = SaveCalendarEvents::dispatchNow($events, [], $calendar->id);

        return view('calendar.edit', ['calendar' => $calendar]);
    }

    public function convertEvent($event) {
        $conditions = [];
        $date = [];

        $data = $event->data;

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
                $conditions = [
                    ['Moons', '0', ["{$data->moon_id}", $this->determineMoonGranularity($data->moon_phase)]]
                ];
                break;

            case 'moon_monthly':
                $conditions = [
                    ['Moons', '0', ["{$data->moon_id}", $this->determineMoonGranularity($data->moon_phase)]],
                    ['&&'],
                    ['Moons', '7', ["{$data->moon_id}", $this->determineMoonGranularity($data->moon_phase_number)]]
                ];
                break;

            case 'moon_anually':
                $conditions = [
                    ['Moons', '0', ["{$data->moon_id}", $this->determineMoonGranularity($data->moon_phase)]],
                    ['&&'],
                    ['Moons', '7', ["{$data->moon_id}", $data->moon_phase_number]],
                    ['&&'],
                    ['Month', '0', [strval($data->month-1)]]
                ];
                break;

            case 'multimoon_every':
            case 'multimoon_anually':
                $conditions = ($event->repeats == 'multimoon_every') ? [] : [['Month', '0', strval($data->month-1)], ['&&']];
                foreach($data->moons as $index => $moon) {
                    $conditions[] = [
                        'Moons',
                        '0',
                        ["$index", $this->determineMoonGranularity($moon->moon_phase)]
                    ];

                    if($index >= count($data->moons)) {
                        $conditions[] = ['&&'];
                    }
                }
                break;

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

    public function determineMoonGranularity($cycle) {
        if($cycle >= 40) return "40";
        if($cycle >= 24) return "24";
        if($cycle >= 8) return "8";
        return "4";
    }
}
