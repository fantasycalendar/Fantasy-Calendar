@extends('templates._calendar')

@push('head')
    <script>
        wizard = false;

        hash = getUrlParameter('id');

        calendar_name = 'New Calendar';
        owner = true;
        static_data = {
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
                "link_scale":true,
                "hours":24,
                "minutes":60,
                "offset":0
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
                    "periodic_seasons":false
                }
            },
            "eras":[],
            "settings":{
                "layout":"grid",
                "show_current_month":false,
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
                "add_year_day_number":false
            },
            "cycles":{
                "format":"",
                "data":[]
            },
            "event_data":{
                "categories":[],
                "events":[]
            }
        };

        randomizer = new RandomCalendar();

        dynamic_data = {
            "year": 1,
            "timespan": 0,
            "day": 1,
            "epoch": 0,
            "custom_location": false,
            "location": "Equatorial"
        };

        link_data = {
            master_hash: "",
            children: []
        };

        $(document).ready(function(){
            set_up_edit_inputs(false);
            set_up_edit_values();

            bind_calendar_events();
            edit_event_ui.bind_events();
            edit_HTML_ui.bind_events();

            autoload();

            var html = [];
            for(var i = 0; i < Object.keys(calendar_presets).length; i++){
                var name = Object.keys(calendar_presets)[i];
                var preset = calendar_presets[name];
                html.push(`<option>${name}</option>`)
            }
            $('#presets').append(html.join(''));

            $('#presets').change(function(){
                $('#json_container').toggleClass('hidden', true);
                $('#json_input').val('');
                $('#json_apply').prop('disabled', $(this).val() === 'Presets');
                if($(this).val() == 'Custom JSON'){
                    $('#json_container').toggleClass('hidden', false);
                }
            });

            $('#json_apply').click(function(){
                if($('#presets').val() == 'Custom JSON'){
                    var calendar = parse_json($('#json_input').val());
                    if(calendar){
                        prev_dynamic_data = {}
                        prev_static_data = {}
                        calendar_name = clone(calendar.name);
                        static_data = clone(calendar.static_data);
                        dynamic_data = clone(calendar.dynamic_data);
                        dynamic_data.epoch = evaluate_calendar_start(static_data, convert_year(dynamic_data.year), dynamic_data.timespan, dynamic_data.day).epoch;
                        empty_edit_values();
                        set_up_edit_values();
                        set_up_view_values();
                        set_up_visitor_values();
                        $('#json_input').val('');
                        error_check('calendar', true);
                    }else{
                        alert("Unrecognized JSON format.")
                    }
                }else if($('#presets').val() == 'Random'){

                    swal.fire({
                        title: "Are you sure?",
                        text: `This will randomly generate new weekdays, months, leap days, moons, and seasons which will override what you have, are you sure you want to do this?`,
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Generate',
                        icon: "warning",
                    })
                    .then((result) => {
                        if(result.value) {

                            static_data = randomizer.randomize(static_data);
                            dynamic_data = {
                                "year": 1,
                                "timespan": 0,
                                "day": 1,
                                "epoch": 0,
                                "custom_location": false,
                                "location": "Equatorial"
                            };
                            empty_edit_values();
                            set_up_edit_values();
                            set_up_view_values();
                            set_up_visitor_values();
                            error_check('calendar', true);
                        }
                    });

                }else{
                    calendar_name = clone(calendar_presets[$('#presets').val()].name);
                    static_data = clone(calendar_presets[$('#presets').val()].static_data);
                    dynamic_data = clone(calendar_presets[$('#presets').val()].dynamic_data);
                    dynamic_data.epoch = evaluate_calendar_start(static_data, convert_year(dynamic_data.year), dynamic_data.timespan, dynamic_data.day).epoch;
                    empty_edit_values();
                    set_up_edit_values();
                    set_up_view_values();
                    set_up_visitor_values();
                    error_check('calendar', true);
                }
            });

        });
    </script>
@endpush

@section('content')
    <div id="generator_container">
        @include('layouts.weather_tooltip')
        @include('layouts.event')
        @include('inputs.sidebar.create')
    </div>
@endsection
