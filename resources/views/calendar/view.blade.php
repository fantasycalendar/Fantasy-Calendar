@extends('templates._calendar')

@push('head')
    <script>
    const owner = {{ $calendar->owned }};
    
    $(document).ready(function(){

        @include('calendar._loadcalendar')

        for(var moon_index in static_data.moons){
            var moon = static_data.moons[moon_index];

            if(moon.granularity == 16){
                moon.granularity = 8;
            }else if(moon.granularity == 32){
                moon.granularity = 24;
            }
        }

        if(static_data.seasons.global_settings.periodic_seasons === undefined){
            static_data.seasons.global_settings.periodic_seasons = true;
        }

        if(static_data.clock.render === undefined){
            static_data.clock.render = static_data.clock.enable;
        }

        if(typeof static_data.clock.crowding == "undefined"){
            static_data.clock.crowding = 0;
        }

        set_up_view_inputs();
        set_up_view_values();
        set_up_visitor_values();
        bind_calendar_events();
        rebuild_calendar('calendar', dynamic_data);

        $('#current_year, #current_timespan, #current_day, #current_hour, #current_minute, #location_select').change(function(){
            do_update_dynamic(hash);
        });

        last_mouse_move = Date.now();
        poll_timer = setTimeout(check_dates, 5000);
        instapoll = false;

        $(window).focus(function(){
            check_dates();
        })

        registered_mousemove_callbacks['view_update'] = function(){
            last_mouse_move = Date.now();
            if(instapoll){
                instapoll = false;
                check_dates();
            }
        }

    });
    
    function check_dates(){

        if(document.hasFocus() && (Date.now() - last_mouse_move) < 10000){

            instapoll = false;

            check_last_change(hash, function(result){

                new_dynamic_change = new Date(result.last_dynamic_change)
                new_static_change = new Date(result.last_static_change)

                if(new_static_change > last_static_change){

                    last_dynamic_change = new_dynamic_change
                    last_static_change = new_static_change

                    get_all_data(hash, function(result){

                        if(result.error){
                            throw result.message;
                        }

                        static_data = clone(result.static_data);
                        dynamic_data = clone(result.dynamic_data);

                        check_update(true);
                        evaluate_settings();
                        poll_timer = setTimeout(check_dates, 5000);

                    });

                }else if(new_dynamic_change > last_dynamic_change){
                    
                    last_dynamic_change = new_dynamic_change

                    get_dynamic_data(hash, function(result){

                        if(result.error){
                            throw result.message;
                        }

                        dynamic_data = clone(result);

                        check_update(false);
                        poll_timer = setTimeout(check_dates, 5000);

                    });

                }else{

                    poll_timer = setTimeout(check_dates, 5000);

                }

            });

        }else{

            instapoll = true;

        }

    }

    function check_update(rebuild){

        var data = dynamic_date_manager.compare(dynamic_data);

        dynamic_date_manager = new date_manager(dynamic_data.year, dynamic_data.timespan, dynamic_data.day);

        if(preview_date.follow){
            preview_date = clone(dynamic_data);
            preview_date.follow = true;
            preview_date_manager = new date_manager(preview_date.year, preview_date.timespan, preview_date.day);
        }

        current_year.val(dynamic_data.year);

        repopulate_timespan_select(current_timespan, dynamic_data.timespan, false);

        repopulate_day_select(current_day, dynamic_data.day, false);

        display_preview_back_button();

        if(rebuild || ((data.rebuild || static_data.settings.only_reveal_today) && preview_date.follow)){
            show_loading_screen_buffered();
            rebuild_calendar('calendar', dynamic_data)
        }else{
            update_current_day(false);
            scroll_to_epoch();
        }
        
        refresh_view_values();

    }

    var do_update_dynamic = debounce(function(type){
        update_view_dynamic(hash);
    }, 500);



    </script>
@endpush

@section('content')
    <div id="generator_container">
        @include('layouts.weather_tooltip')
        @include('layouts.event')
        @include('inputs.sidebar.view')
    </div>
@endsection