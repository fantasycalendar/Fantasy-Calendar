@extends('templates._calendar')

@push('head')
    <script>

    $(document).ready(function(){

        @include('calendar._loadcalendar')

        preview_date = clone(dynamic_data);
        preview_date.follow = true;


        set_up_view_inputs();
        set_up_view_values();
        set_up_visitor_values();

        bind_calendar_events();

        if(!evaluate_queryString(window.location.search)){
            rebuild_calendar('calendar', dynamic_data);
        }else{
            rebuild_calendar('calendar', preview_date);
        }

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

    function evaluate_queryString(queryString){

        const urlParams = new URLSearchParams(queryString);

        if(urlParams.has("year") && urlParams.has("month") && urlParams.has("day")){
            let year = Number(urlParams.get('year'));
            let timespan = Number(urlParams.get('month'));
            let day = Number(urlParams.get('day'));

            if(isNaN(year) || isNaN(timespan) || isNaN(day)) {
                return false;
            }

            if(valid_preview_date(year, timespan, day) || window.Perms.player_at_least('co-owner')){

                if(year === 0 && !static_data.settings.year_zero_exists){
                    return false;
                }
                preview_date_manager.year = convert_year(static_data, year);

                if(timespan < 0 || timespan > preview_date_manager.last_timespan){
                    return false;
                }
                preview_date_manager.timespan = timespan;

                if(day < 0 || day > preview_date_manager.num_days){
                    return false;
                }
                preview_date_manager.day = day;

                go_to_preview_date(true);
                refresh_preview_inputs();

                return true;
            }

            return false;
        }

        if(urlParams.has('print')){
            window.dispatchEvent(new CustomEvent('register-render-callback', {detail: print()}));
            return true;
        }

    }

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
                        eval_clock();
                        poll_timer = setTimeout(check_dates, 5000);

                    });

                }else if(new_dynamic_change > last_dynamic_change){

                    last_dynamic_change = new_dynamic_change

                    get_dynamic_data(hash, function(result){

                        if(dynamic_data.is_linked !== is_linked){
                            window.location.reload();
                            return;
                        }

                        if(result.error){
                            throw result.message;
                        }

                        dynamic_data = clone(result.dynamic_data);


                        check_update(false);
                        evaluate_settings();
                        eval_clock();
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
            rebuild_calendar('calendar', dynamic_data);
            set_up_visitor_values();
        }else{
            update_current_day(false);
            scroll_to_epoch();
        }

        set_up_view_values();

    }
    if(debounce !== undefined){
        var do_update_dynamic = debounce(function(type){
            update_view_dynamic(hash);
        }, 500);
    }

    </script>
@endpush

@section('content')
    <div id="generator_container">
        @include('layouts.weather_tooltip')
        @include('layouts.day_data_tooltip')
        @include('layouts.moon_tooltip')
        @include('layouts.event')
        @include('inputs.sidebar.view')
    </div>
@endsection
