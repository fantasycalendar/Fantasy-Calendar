@extends('templates._calendar')

@push('head')
    <script>
        function getCalendarStructure(){
            return {
                userId: @js(Auth::check() ? Auth::user()->id : Null),
                owned: true,
                paymentLevel: "free",
                userRole: "guest",
                darkTheme: @js(auth()->user()?->setting("dark_theme") ?? true),
                hash: null,
                calendar_name: "",
                calendar_id: null,
                static_data: {
                    "year_data":{
                        "first_day":1,
                        "overflow":true,
                        "global_week":[],
                        "timespans":[],
                        "leap_days":[]
                    },
                    "moons":[],
                    "clock":{
                        "enabled":false,
                        "render":false,
                        "hours":24,
                        "minutes":60,
                        "offset":0,
                        "crowding":0,
                    },
                    "seasons":{
                        "data":[],
                        "locations":[],
                        "global_settings":{
                            "season_offset":0,
                            "weather_offset":0,
                            "seed":Math.abs(Math.random().toString().substr(7)|0),
                            "temp_sys":"metric",
                            "wind_sys":"metric",
                            "cinematic":false,
                            "enable_weather":false,
                            "periodic_seasons":true,
                            "color_enabled": false
                        }
                    },
                    "eras":[],
                    "settings":{
                        "layout":"grid",
                        "comments":"none",
                        "show_current_month":false,
                        "private":false,
                        "allow_view":true,
                        "only_backwards":true,
                        "only_reveal_today":false,
                        "hide_moons":false,
                        "hide_clock":false,
                        "hide_events":false,
                        "hide_eras":false,
                        "hide_all_weather":false,
                        "hide_future_weather":false,
                        "add_month_number":false,
                        "add_year_day_number":false,
                        "default_category":-1
                    },
                    "cycles":{
                        "format":"",
                        "data":[]
                    }
                },
                dynamic_data: {
                    "year": 1,
                    "timespan": 0,
                    "day": 1,
                    "epoch": 0,
                    "custom_location": false,
                    "location": "Equatorial"
                },
                is_linked: false,
                has_parent: false,
                parent_hash: null,
                parent_offset: null,
                events: [],
                event_categories: [],
                last_static_change: null,
                last_dynamic_change: null,
                advancement_enabled: false,
                advancement_real_rate: null,
                advancement_real_rate_unit: null,
                advancement_rate: null,
                advancement_rate_unit: null,
                advancement_webhook_url: null,
                advancement_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            }
        }
    </script>
@endpush

@section('content')
    <div id="generator_container"
         x-data='calendar_create_page(getCalendarStructure())'
         @calendar-updating.window="update_calendar"
         @rebuild-calendar.window="rebuild_calendar"
         @render-calendar.window="render_calendar"
         @calendar-updated.window="calendar_updated"
    >
        @include('layouts.layouts')
        @include('layouts.events_manager')
        @include('layouts.weather_tooltip')
        @include('layouts.day_data_tooltip')
        @include('layouts.moon_tooltip')
        @include('layouts.event')
        @include('inputs.sidebar.create')
    </div>
@endsection
