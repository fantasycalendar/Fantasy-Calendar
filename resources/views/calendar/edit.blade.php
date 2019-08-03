@extends('templates._page')

@push('head')
    <script>
    owner = "{{ $calendar->owned }}";

    $(document).ready(function() {
        wizard = false;

        @include('calendar._loadcalendar')
        
        set_up_edit_inputs(true);
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