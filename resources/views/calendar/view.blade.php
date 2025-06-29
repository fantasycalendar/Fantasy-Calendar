@extends('templates._calendar')

@push('head')
    <script>
        function generatorData() {
            return {
                init() {
                    @include('calendar._loadcalendar')

                    window.preview_date = _.cloneDeep(dynamic_data);
                    window.preview_date.follow = true;

                    bind_calendar_events();

                    if(!evaluate_queryString(window.location.search)){
                        rebuild_calendar('calendar', window.dynamic_data);
                    }else{
                        rebuild_calendar('calendar', window.preview_date);
                    }

                    $('#current_year, #current_timespan, #current_day, #current_hour, #current_minute, #location_select')
                        .change(debounce(function(type){
                            window.update_view_dynamic(window.hash);
                        }, 500));

                    last_mouse_move = Date.now();
                    poll_timer = setTimeout(check_dates, 5000);
                    instapoll = false;

                    window.addEventListener('focus', function(){
                        check_dates();
                    });

                    window.registered_mousemove_callbacks['view_update'] = function () {
                        last_mouse_move = Date.now();
                        if (instapoll) {
                            instapoll = false;
                            check_dates();
                        }
                    }

                    window.dispatchEvent(new CustomEvent("events-changed"));
                },
            }
        }

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

                    if(year === 0 && !window.static_data.settings.year_zero_exists){
                        return false;
                    }
                    window.preview_date_manager.year = convert_year(window.static_data, year);

                    if(timespan < 0 || timespan > window.preview_date_manager.last_timespan){
                        return false;
                    }
                    window.preview_date_manager.timespan = timespan;

                    if(day < 0 || day > window.preview_date_manager.num_days){
                        return false;
                    }
                    window.preview_date_manager.day = day;

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

            if((document.hasFocus() && (Date.now() - last_mouse_move) < 10000) || advancement.advancement_enabled){

                instapoll = false;

                check_last_change(hash).then((result) => {

                    new_dynamic_change = new Date(result.data.last_dynamic_change)
                    new_static_change = new Date(result.data.last_static_change)

                    if(new_static_change > window.last_static_change){

                        window.last_dynamic_change = new_dynamic_change
                        window.last_static_change = new_static_change

                        get_all_data(hash, function(result){

                            if(result.error){
                                throw result.message;
                            }

                            window.static_data = clone(result.static_data);
                            dynamic_data = clone(result.dynamic_data);

                            check_update(true);
                            poll_timer = setTimeout(check_dates, 5000);

                        });

                    }else if(new_dynamic_change > window.last_dynamic_change){

                        window.last_dynamic_change = new_dynamic_change

                        get_dynamic_data(hash, function(result){

                            if(result.error){
                                throw result.message;
                            }
                            dynamic_data = clone(result.dynamic_data);

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

            var data = window.dynamic_date_manager.reconcileCalendarChange(window.static_data, dynamic_data);

            window.dynamic_date_manager = new date_manager(window.static_data, dynamic_data.year, dynamic_data.timespan, dynamic_data.day);

            if(preview_date.follow){
                preview_date = clone(dynamic_data);
                preview_date.follow = true;
                window.preview_date_manager = new date_manager(window.static_data, preview_date.year, preview_date.timespan, preview_date.day);
            }

            window.current_year.val(dynamic_data.year);

            repopulate_timespan_select(current_timespan, dynamic_data.timespan, false);

            repopulate_day_select(current_day, dynamic_data.day, false);

            display_preview_back_button();

            if(rebuild || ((data.rebuild || window.static_data.settings.only_reveal_today) && preview_date.follow)){
                rebuild_calendar('calendar', dynamic_data);
            }

        }
    </script>
@endpush

@section('content')
    <div id="generator_container" x-data="generatorData()">
        @include('layouts.weather_tooltip')
        @include('layouts.day_data_tooltip')
        @include('layouts.moon_tooltip')
        @include('layouts.event')
        @include('inputs.sidebar.view')
    </div>
@endsection
