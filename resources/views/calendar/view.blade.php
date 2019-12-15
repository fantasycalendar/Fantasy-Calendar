@extends('templates._page')

@push('head')
    <script>
    const owner = {{ $calendar->owned }};
    
    $(document).ready(function(){
        wizard = false;

        @include('calendar._loadcalendar')

        for(var moon_index in static_data.moons){
            var moon = static_data.moons[moon_index];

            if(moon.granularity == 16){
                moon.granularity = 8;
            }else if(moon.granularity == 32){
                moon.granularity = 24;
            }
        }

        set_up_view_inputs();
        set_up_view_values();
        set_up_visitor_values();
        bind_calendar_events();
        do_rebuild('calendar', dynamic_data);
       
        poll_timer = setTimeout(check_dates, 5000);

        registered_mousemove_callbacks['view_update'] = function(){
            last_mouse_move = Date.now();
        }

        $('#current_year, #current_timespan, #current_day, #current_hour, #current_minute, #location_select').change(function(){
            do_update_dynamic();
        });

    });

    var do_update_dynamic = debounce(function(type){
        update_dynamic();
    }, 250);
    
    function check_dates(){

        if(document.hasFocus() && (Date.now() - last_mouse_move) < 10000){

            check_last_change(function(result){

                new_dynamic_change = new Date(result.last_dynamic_change)
                new_static_change = new Date(result.last_static_change)

                if(new_static_change > last_static_change){

                    last_dynamic_change = new_dynamic_change
                    last_static_change = new_static_change

                    get_all_data(function(result){

                        static_data = clone(result.static_data);
                        static_datadynamic_data = clone(result.dynamic_data);

                        check_update();
                        evaluate_settings();
                        poll_timer = setTimeout(check_dates, 5000);

                    });

                }else if(new_dynamic_change > last_dynamic_change){
                    
                    last_dynamic_change = new_dynamic_change

                    get_dynamic_data(function(result){

                        dynamic_data = clone(result);

                        check_update(static_data, result);
                        poll_timer = setTimeout(check_dates, 5000);

                    });

                }else{

                    poll_timer = setTimeout(check_dates, 5000);

                }

            });

        }else{

            poll_timer = setTimeout(check_dates, 5000);

        }

    }

    function check_update(){

        var data = dynamic_date_manager.compare(dynamic_data);

        dynamic_date_manager = new date_manager(dynamic_data.year, dynamic_data.timespan, dynamic_data.day);

        current_year.val(dynamic_data.year);

        repopulate_timespan_select(current_timespan, dynamic_data.timespan, false);

        repopulate_day_select(current_day, dynamic_data.day, false);

        display_preview_back_button();

        if(data.rebuild && preview_date.follow){
            show_loading_screen();
            do_rebuild('calendar', dynamic_data)
        }else{
            update_current_day(false)
            scroll_to_epoch(dynamic_data.epoch)
        }

    }



    </script>
@endpush

@section('content')
    <div id="generator_container">
        @include('layouts.weather_tooltip')
        @include('layouts.event')
        @include('inputs.sidebar.view')
    </div>
@endsection