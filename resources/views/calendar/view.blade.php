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
        rebuild_calendar('calendar', dynamic_data);

        timer = setTimeout(function(){
            check_last_change(function(output){
                check_dates(output);
            })
        }, 100);

        $(window).focus(function() {
            if(!timer)
                check_last_change(function(output){
                    check_dates(output);
                });
                timer = setTimeout(function(){
                    check_last_change(function(output){
                        check_dates(output);
                    });
                }, 2500);
        });

        $(window).blur(function() {
            clearTimeout(timer);
            timer = 0;
        });

        $('#current_year, #current_timespan, #current_day, #current_hour, #current_minute, #location_select').change(function(){
            do_update_dynamic();
        });

    });

    var do_update_dynamic = debounce(function(type){
        update_dynamic();
    }, 250);

    function check_dates(output){

        new_static_change = new Date(output.last_static_change)
        new_dynamic_change = new Date(output.last_dynamic_change)

        if(new_static_change > last_static_change){

            get_all_data(function(result){

                static_data = clone(result.static_data);
                dynamic_data = clone(result.dynamic_data);

                last_static_change = new Date(result.last_static_change)
                last_dynamic_change = new Date(result.last_dynamic_change)
        
                set_up_view_values();

                set_date(dynamic_data.year, dynamic_data.timespan, dynamic_data.day);

            });

        }else if(new_dynamic_change > last_dynamic_change){

            get_dynamic_data(function(result){

                dynamic_data = clone(result);

                last_dynamic_change = new_dynamic_change;
        
                set_up_view_values();

                set_date(dynamic_data.year, dynamic_data.timespan, dynamic_data.day);

            });

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