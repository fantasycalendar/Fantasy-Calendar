<?php

use Illuminate\Database\Seeder;

class PresetsSeeder extends Seeder
{
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

        DB::table('presets')->insert([
            'id' => 1,
            'name' => 'Gregorian Calendar',
            'description' => 'The calendar for the real world. Meat space. Earth.',
            'dynamic_data' => '{"year":date.getFullYear(),"timespan":date.getMonth(),"day":date.getDate(),"epoch":0,"custom_location":false,"location":"Cool and Rainy","hour":date.getHours(),"minute":date.getMinutes()}',
            'static_data' => '{"year_data": {"first_day": 1,"overflow": true,"global_week": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],"timespans": [{"name": "January","type": "month","length": 31,"interval": 1,"offset": 1},{"name": "February","type": "month","length": 28,"interval": 1,"offset": 1},{"name": "March","type": "month","length": 31,"interval": 1,"offset": 1},{"name": "April","type": "month","length": 30,"interval": 1,"offset": 1},{"name": "May","type": "month","length": 31,"interval": 1,"offset": 1},{"name": "June","type": "month","length": 30,"interval": 1,"offset": 1},{"name": "July","type": "month","length": 31,"interval": 1,"offset": 1},{"name": "August","type": "month","length": 31,"interval": 1,"offset": 1},{"name": "September","type": "month","length": 30,"interval": 1,"offset": 1},{"name": "October","type": "month","length": 31,"interval": 1,"offset": 1},{"name": "November","type": "month","length": 30,"interval": 1,"offset": 1},{"name": "December","type": "month","length": 31,"interval": 1,"offset": 1}], "leap_days": [{"name": "Leap Day","intercalary": false,"timespan": 1,"adds_week_day": false,"interval": "400,!100,4","offset": 0}]},"moons": [{"name": "Moon","cycle": 29.530588853,"shift": 10.24953,"granularity":24,"color": "#ffffff","hidden": false}],"clock": {"hours": 24,"minutes": 60,"offset": 0,"enabled": true, "crowding": 0},"seasons": {"data": [{"name": "Winter","time": {"sunrise": {"hour": 9,"minute": 0},"sunset": {"hour": 18,"minute": 0}},"transition_length": 182.62125,"duration": 0},{"name": "Summer","time": {"sunrise": {"hour": 7,"minute": 0},"sunset": {"hour": 20,"minute": 0}},"transition_length": 182.62125,"duration": 0}],"locations": [],"global_settings": {"season_offset": -12,"weather_offset": 56,"seed": 826116802,"temp_sys": "both_m","wind_sys": "both","periodic_seasons":true, "cinematic": true,"enable_weather": true}},"eras": [{"name": "Before Christ","format": "Year {{year}} - B.C.","description": "","settings": {"show_as_event": false,"use_custom_format": true,"event_category": -1,"ends_year": false,"restart": false, "starting_era": true},"date": {"year": -9000,"timespan": 0,"day": 0, }},{"name": "Anno Domini","format": "Year {{year}} - A.D.","description": "","settings": {"use_custom_format": true, "show_as_event": false,"event_category": -1,"ends_year": false,"restart": false, "starting_era": false},"date": {"year": 1,"timespan": 0,"day": 1,"era_year": 1,"epoch": 0}}],"settings": {"layout": "grid","show_current_month": false,"allow_view": false,"only_backwards": false,"only_reveal_today": false,"hide_moons": false,"hide_clock": false,"hide_events": false,"hide_eras": false,"hide_all_weather": false,"hide_future_weather": false,"add_month_number": false,"add_year_day_number": false},"cycles": {"format": "","data": []}}',
        ]);


        foreach($this->categories() as $category) {

            foreach($category as $property => $value) {
                $category[$property] = is_array($value) ? json_encode($value) : $value;
            }

            DB::table('preset_event_categories')->insert($category);
        }

        foreach($this->events() as $event) {
            foreach($event as $property => $value) {
                $event[$property] = is_array($value) ? json_encode($value) : $value;
            }

            DB::table('preset_events')->insert($event);
        }
    }

    
    /** 
     * We're just putting this here to clean things up in the run() method.
     * 
     * @return array
     */
    public function events()
    {
        return [
            [
                "name" => "Work on This Calendar Started",
                "description" => "Aecius started work on the Gregorian Calendar for Fantasy Calendar on this day.<br>",
                "data" => [
                    "has_duration" => false,
                    "duration" => 0,
                    "show_first_last" => false,
                    "limited_repeat" => false,
                    "limited_repeat_num" => 0,
                    "conditions" => [
                        [
                            "Year",
                            "0",
                            [
                                "2019"
                            ]
                        ],
                        [
                            "&&"
                        ],
                        [
                            "Month",
                            "0",
                            [
                                "5"
                            ]
                        ],
                        [
                            "&&"
                        ],
                        [
                            "Day",
                            "0",
                            [
                                "23"
                            ]
                        ]
                    ],
                    "connected_events" => []
                ],
                "preset_event_category_id" => 4,
                "event_category_id" => "miscellaneous-event",
                "preset_id" => 1,
                "settings" => [
                    "hide" => false,
                    "print" => false,
                    "color" => "Teal",
                    "text" => "dot"
                ]
            ],
            [
                "name" => "Christmas",
                "description" => "Christmas is a Christian holiday celebrating the birth of Christ. Due to a combination of marketability and long lasting traditions, it is popular even among many non-Christians, especially in countries that have a strong Christian tradition.&lt;br&gt;",
                "data" => [
                    "has_duration" => false,
                    "duration" => 0,
                    "show_first_last" => false,
                    "limited_repeat" => false,
                    "limited_repeat_num" => 0,
                    "conditions" => [
                        [
                            "Month",
                            "0",
                            [
                                "11"
                            ]
                        ],
                        [
                            "&&"
                        ],
                        [
                            "Day",
                            "0",
                            [
                                "25"
                            ]
                        ]
                    ],
                    "connected_events" => [],
                    "date" => []
                ],
                "preset_event_category_id" => 1,
                "event_category_id" => "christian-holiday",
                "preset_id" => 1,
                "settings" => [
                    "hide" => false,
                    "print" => false,
                    "color" => "Orange",
                    "text" => "dot"
                ]
            ],
            [
                "name" => "Winter Solstice",
                "description" => "The Winter Solstice is the day of the year with the least time between sunrise and sunset. Many western cultures consider it the official start of winter.&lt;br&gt;",
                "data" => [
                    "has_duration" => false,
                    "duration" => 0,
                    "show_first_last" => false,
                    "limited_repeat" => false,
                    "limited_repeat_num" => 0,
                    "conditions" => [
                        [
                            "Season",
                            "16",
                            [
                                "1"
                            ]
                        ]
                    ],
                    "connected_events" => [],
                    "date" => []
                ],
                "preset_event_category_id" => 5,
                "event_category_id" => "natural-event",
                "preset_id" => 1,
                "settings" => [
                    "color" => "Cyan",
                    "text" => "text",
                    "hide" => false,
                    "print" => false
                ]
            ],
            [
                "name" => "Summer Solstice",
                "description" => "&lt;p&gt;The Summer Solstice is the day of the year with the most time between \nsunrise and sunset. Many western cultures consider it the official start\n of summer.&lt;&#x2F;p&gt;",
                "data" => [
                    "has_duration" => false,
                    "duration" => 0,
                    "show_first_last" => false,
                    "limited_repeat" => false,
                    "limited_repeat_num" => 0,
                    "conditions" => [
                        [
                            "Season",
                            "15",
                            [
                                "1"
                            ]
                        ]
                    ],
                    "connected_events" => [],
                    "date" => []
                ],
                "preset_event_category_id" => 5,
                "event_category_id" => "natural-event",
                "preset_id" => 1,
                "settings" => [
                    "color" => "Cyan",
                    "text" => "text",
                    "hide" => false,
                    "print" => false
                ]
            ],
            [
                "name" => "Spring Equinox",
                "description" => "The Spring Equinox,\nalso called the Vernal Equinox, is the day between the winter and\nsummer solstices where the day is the exact same length as the night.\nMany western cultures consider it the official start of Spring.\n",
                "data" => [
                    "has_duration" => false,
                    "duration" => 0,
                    "show_first_last" => false,
                    "limited_repeat" => true,
                    "limited_repeat_num" => 5,
                    "conditions" => [
                        [
                            "Season",
                            "17",
                            [
                                "1"
                            ]
                        ]
                    ],
                    "connected_events" => [],
                    "date" => []
                ],
                "preset_event_category_id" => 5,
                "event_category_id" => "natural-event",
                "preset_id" => 1,
                "settings" => [
                    "color" => "Cyan",
                    "text" => "text",
                    "hide" => false,
                    "hide_full" => false,
                    "print" => false
                ]
            ],
            [
                "name" => "Autumnal Equinox",
                "description" => "The Autumnal Equinox,\nalso called the Fall Equinox, is the midpoint between the summer and\nwinter solstices, where the day is the exact same length as the night.\nMany western cultures consider it the official start of Autumn.\n",
                "data" => [
                    "has_duration" => false,
                    "duration" => 0,
                    "show_first_last" => false,
                    "limited_repeat" => true,
                    "limited_repeat_num" => 5,
                    "conditions" => [
                        [
                            "Season",
                            "18",
                            [
                                "1"
                            ]
                        ]
                    ],
                    "connected_events" => [],
                    "date" => []
                ],
                "preset_event_category_id" => 5,
                "event_category_id" => "natural-event",
                "preset_id" => 1,
                "settings" => [
                    "color" => "Cyan",
                    "text" => "text",
                    "hide" => false,
                    "print" => false
                ]
            ],
            [
                "name" => "Valentine&#39;s Day",
                "description" => "Valentine&#39;s day is a celebration of love and romance that is popular across the world. Many more cynically minded people mostly consider it an attempt to monetize the expecation of romantic gestures on the holiday through gift cards, flowers, chocolate and dates.&lt;br&gt;",
                "data" => [
                    "has_duration" => false,
                    "duration" => 0,
                    "show_first_last" => false,
                    "limited_repeat" => false,
                    "limited_repeat_num" => 0,
                    "conditions" => [
                        [
                            "Month",
                            "0",
                            [
                                "1"
                            ]
                        ],
                        [
                            "&&"
                        ],
                        [
                            "Day",
                            "0",
                            [
                                "14"
                            ]
                        ]
                    ],
                    "connected_events" => [],
                    "date" => []
                ],
                "preset_event_category_id" => 2,
                "event_category_id" => "secular-holiday",
                "preset_id" => 1,
                "settings" => [
                    "hide" => false,
                    "print" => false,
                    "color" => "Lime",
                    "text" => "dot"
                ]
            ],
            [
                "name" => "New Year&#39;s Day",
                "description" => "New Year&#39;s day marks the start of a new year on the Gregorian Calendar. It starts when the clock strikes midnight and is often celebrated with fireworks, champagne, and affection.&lt;br&gt;",
                "data" => [
                    "has_duration" => false,
                    "duration" => 0,
                    "show_first_last" => false,
                    "limited_repeat" => false,
                    "limited_repeat_num" => 0,
                    "conditions" => [
                        [
                            "Day",
                            "7",
                            [
                                "1"
                            ]
                        ]
                    ],
                    "connected_events" => [],
                    "date" => []
                ],
                "preset_event_category_id" => 2,
                "event_category_id" => "secular-holiday",
                "preset_id" => 1,
                "settings" => [
                    "hide" => false,
                    "print" => false,
                    "color" => "Orange",
                    "text" => "dot"
                ]
            ],
            [
                "name" => "Halloween",
                "description" => "&lt;p&gt;Halloween is holiday popular in the US, Canada, and Ireland that has gradually been adopted by more and more countries. It is often celebrated by people dressing up, usually as something scary. Children will often go from door to door shouting &quot;trick or treat&quot; in the hopes of receiving candy, while adults tend to go to parties.&lt;br&gt;&lt;&#x2F;p&gt;",
                "data" => [
                    "has_duration" => false,
                    "duration" => 0,
                    "show_first_last" => false,
                    "limited_repeat" => false,
                    "limited_repeat_num" => 0,
                    "conditions" => [
                        [
                            "Month",
                            "0",
                            [
                                "9"
                            ]
                        ],
                        [
                            "&&"
                        ],
                        [
                            "Day",
                            "0",
                            [
                                "31"
                            ]
                        ]
                    ],
                    "connected_events" => [],
                    "date" => []
                ],
                "preset_event_category_id" => 2,
                "event_category_id" => "secular-holiday",
                "preset_id" => 1,
                "settings" => [
                    "hide" => false,
                    "print" => false,
                    "color" => "Orange",
                    "text" => "dot"
                ]
            ],
            [
                "name" => "Paschal Full Moon",
                "description" => "The first full moon after march 21st, which is considered the fixed date for the spring equinox.&lt;br&gt;",
                "data" => [
                    "has_duration" => false,
                    "duration" => 0,
                    "show_first_last" => false,
                    "limited_repeat" => true,
                    "limited_repeat_num" => 200,
                    "conditions" => [
                        [
                            "",
                            [
                                [
                                    "",
                                    [
                                        [
                                            "Month",
                                            "0",
                                            [
                                                "2"
                                            ]
                                        ],
                                        [
                                            "&&"
                                        ],
                                        [
                                            "Day",
                                            "2",
                                            [
                                                "21"
                                            ]
                                        ]
                                    ]
                                ],
                                [
                                    "||"
                                ],
                                [
                                    "",
                                    [
                                        [
                                            "Month",
                                            "0",
                                            [
                                                "3"
                                            ]
                                        ],
                                        [
                                            "&&"
                                        ],
                                        [
                                            "Day",
                                            "5",
                                            [
                                                "21"
                                            ]
                                        ]
                                    ]
                                ]
                            ]
                        ],
                        [
                            "&&"
                        ],
                        [
                            "Moons",
                            "0",
                            [
                                "0",
                                "12"
                            ]
                        ]
                    ],
                    "connected_events" => [],
                    "date" => []
                ],
                "preset_event_category_id" => 5,
                "event_category_id" => "natural-event",
                "preset_id" => 1,
                "settings" => [
                    "color" => "Purple",
                    "text" => "text",
                    "hide" => false,
                    "hide_full" => true,
                    "print" => false
                ]
            ],
            [
                "name" => "Easter",
                "description" => "<p>Easter is considered the most important feast for Christians, \ncelebrating the resurrection of Christ. It is classed as a moveable \nfeast occurring on the first full moon after the spring equinox, which \nis considered to be fixed at March 21st for the sake of computing the \ndate.</p>",
                "data" => [
                    "has_duration" => false,
                    "duration" => 0,
                    "show_first_last" => false,
                    "limited_repeat" => false,
                    "limited_repeat_num" => 0,
                    "conditions" => [
                        [
                            "Events",
                            "3",
                            [
                                0,
                                "7"
                            ]
                        ],
                        [
                            "&&"
                        ],
                        [
                            "Weekday",
                            "0",
                            [
                                "Sunday"
                            ]
                        ]
                    ],
                    "connected_events" => [
                        9
                    ]
                ],
                "preset_event_category_id" => 1,
                "event_category_id" => "christian-holiday",
                "preset_id" => 1,
                "settings" => [
                    "hide" => false,
                    "print" => false,
                    "color" => "Blue-Grey",
                    "text" => "dot"
                ]
            ],
            [
                "name" => "Easter Monday",
                "description" => "The monday following the Easter Sunday is often considered part of the Easter Celebration and is a free day in many countries with a strong Christian tradition.&lt;br&gt;",
                "data" => [
                    "has_duration" => false,
                    "duration" => 0,
                    "show_first_last" => false,
                    "limited_repeat" => false,
                    "limited_repeat_num" => 0,
                    "conditions" => [
                        [
                            "Events",
                            "0",
                            [
                                0,
                                "1"
                            ]
                        ]
                    ],
                    "connected_events" => [
                        10
                    ],
                    "date" => []
                ],
                "preset_event_category_id" => 1,
                "event_category_id" => "christian-holiday",
                "preset_id" => 1,
                "settings" => [
                    "hide" => false,
                    "print" => false,
                    "color" => "Blue-Grey",
                    "text" => "dot"
                ]
            ],
            [
                "name" => "Good Friday",
                "description" => "Good Friday is the friday preceding Easter. It comemmorates the crucifixion of Christ according to the Bible.&lt;br&gt;",
                "data" => [
                    "has_duration" => false,
                    "duration" => 0,
                    "show_first_last" => false,
                    "limited_repeat" => false,
                    "limited_repeat_num" => 0,
                    "conditions" => [
                        [
                            "Events",
                            "1",
                            [
                                0,
                                "2"
                            ]
                        ]
                    ],
                    "connected_events" => [
                        10
                    ],
                    "date" => []
                ],
                "preset_event_category_id" => 1,
                "event_category_id" => "christian-holiday",
                "preset_id" => 1,
                "settings" => [
                    "hide" => false,
                    "print" => false,
                    "color" => "Blue-Grey",
                    "text" => "dot"
                ]
            ]
        ];
    }

    /** 
     * We're just putting this here to clean things up in the run() method.
     * 
     * @return array
     */
    private function categories()
    {
        return [
            [
                "name" => "Christian Holiday",
                "category_settings" => [
                    "hide" => false,
                    "player_usable" => false
                ],
                "event_settings" => [
                    "hide" => false,
                    "print" => false,
                    "color" => "Blue-Grey",
                    "text" => "dot"
                ],
                "preset_id" => 1,
                "label" => "christian-holiday",
                "id" => 1
            ],
            [
                "name" => "Secular Holiday",
                "category_settings" => [
                    "hide" => false,
                    "player_usable" => false
                ],
                "event_settings" => [
                    "hide" => false,
                    "print" => false,
                    "color" => "Orange",
                    "text" => "dot"
                ],
                "preset_id" => 1,
                "label" => "secular-holiday",
                "id" => 2
            ],
            [
                "name" => "Historical Event",
                "category_settings" => [
                    "hide" => false,
                    "player_usable" => false
                ],
                "event_settings" => [
                    "hide" => false,
                    "print" => false,
                    "color" => "Lime",
                    "text" => "dot"
                ],
                "preset_id" => 1,
                "label" => "historical-event",
                "id" => 3
            ],
            [
                "name" => "Miscellaneous event",
                "category_settings" => [
                    "hide" => false,
                    "player_usable" => false
                ],
                "event_settings" => [
                    "hide" => false,
                    "print" => false,
                    "color" => "Teal",
                    "text" => "dot"
                ],
                "preset_id" => 1,
                "label" => "miscellaneous-event",
                "id" => 4
            ],
            [
                "name" => "Natural Event",
                "category_settings" => [
                    "hide" => false,
                    "player_usable" => false
                ],
                "event_settings" => [
                    "color" => "Cyan",
                    "text" => "text",
                    "hide" => false,
                    "print" => false
                ],
                "preset_id" => 1,
                "label" => "natural-event",
                "id" => 5
            ]
        ];
    }
}
