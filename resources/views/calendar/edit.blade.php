@extends('templates._calendar')

@push('head')
    <script>
        function generatorData() {
            return {
                init: () => {
                    @include('calendar._loadcalendar')

                    preview_date = _.cloneDeep(dynamic_data);
                    preview_date.follow = true;

                    rebuild_calendar('calendar', dynamic_data);

                    set_up_edit_inputs();
                    set_up_edit_values();
                    set_up_view_values();
                    set_up_visitor_values();

                    bind_calendar_events();

                    if(has_parent){

                        last_mouse_move = Date.now();
                        poll_timer = setTimeout(check_dates, 5000);
                        instapoll = false;

                        window.addEventListener('focus', function(){
                            check_dates();
                        });

                        registered_mousemove_callbacks['view_update'] = function(){
                            last_mouse_move = Date.now();
                            if(instapoll){
                                instapoll = false;
                                check_dates();
                            }
                        }

                    }

                    window.dispatchEvent(new CustomEvent("events-changed"));
                }
            };
        }

        function check_dates(){

            if((document.hasFocus() && (Date.now() - last_mouse_move) < 10000) || advancement.advancement_enabled){

                instapoll = false;

                check_last_change(hash, function(result){

                    new_dynamic_change = new Date(result.last_dynamic_change)

                    if(new_dynamic_change > last_dynamic_change){

                        last_dynamic_change = new_dynamic_change

                        get_dynamic_data(hash, function(result){

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

            if(rebuild || ((data.rebuild || window.static_data.settings.only_reveal_today) && preview_date.follow)){
                rebuild_calendar('calendar', dynamic_data);
                set_up_visitor_values();
            }else{
                update_current_day(false);
            }

            set_up_view_values();

        }

    </script>
@endpush

@section('content')
    <div id="generator_container" x-data="generatorData()">
        @include('layouts.layouts')
        @include('layouts.events_manager')
        @include('layouts.weather_tooltip')
        @include('layouts.day_data_tooltip')
        @include('layouts.moon_tooltip')
        @include('layouts.event')
        @include('inputs.sidebar.edit')
    </div>
@endsection
