@extends('templates._calendar')

@push('head')
    <script>
    owner = {{ $calendar->owned }};

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

        if(static_data.seasons.global_settings.periodic_seasons === undefined){
            static_data.seasons.global_settings.periodic_seasons = true;
        }

        if(static_data.clock.render === undefined){
            static_data.clock.render = static_data.clock.enable;
        }

        set_up_edit_inputs();
        set_up_edit_values();
        set_up_view_values();
        set_up_visitor_values();
        
        bind_calendar_events();
        rebuild_calendar('calendar', dynamic_data);

        edit_event_ui.bind_events();
        edit_HTML_ui.bind_events();

    })
    </script>
@endpush

@section('content')
    <div id="generator_container">
        @include('layouts.weather_tooltip')
        @include('layouts.event')
        @include('inputs.sidebar.edit')
    </div>
@endsection
