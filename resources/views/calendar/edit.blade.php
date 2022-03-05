@extends('templates._calendar')

@push('head')
    <script>

    @include('calendar._loadcalendar');

    window.calendar = new window.FantasyCalendar(
        {{ Illuminate\Support\Js::from($calendar->static_data) }},
        {{ Illuminate\Support\Js::from($calendar->dynamic_data) }},
        {{ Illuminate\Support\Js::from($calendar->events) }},
        {{ Illuminate\Support\Js::from($calendar->event_categories) }}
    )

    function sidebar() {
        return {

            static_data: window.calendar.static_data,
            dynamic_data: window.calendar.dynamic_data,
            preview_date: window.calendar.preview_date,
            events: window.calendar.events,
            event_categories: window.calendar.event_categories

        }
    }

    $(document).ready(function() {
        // preview_date = clone(dynamic_data);
        // preview_date.follow = true;
        // rebuild_calendar('calendar', dynamic_data);
    });

    </script>
@endpush

@section('content')
    <div id="generator_container" x-data="sidebar()">
        @include('layouts.layouts')
        @include('layouts.weather_tooltip')
        @include('layouts.day_data_tooltip')
        @include('layouts.moon_tooltip')
        @include('layouts.event')
        @include('inputs.sidebar.edit')
    </div>
@endsection
