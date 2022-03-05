@extends('templates._calendar')

@push('head')
    <script>

    @if(Auth::check())
        let userData = [
            {{ Auth::user()->id }},
            {{ $calendar ? ($calendar->owned ? "true" : "false") : "true" }},
            '{{ strtolower(Auth::user()->paymentLevel()) }}',
            '{{ $calendar->users->contains(Auth::user()) ? $calendar->users->find(Auth::user())->pivot->user_role : null }}'
        ]
    @else
        let userData = [
            {{ Auth::user() ? Auth::user()->id : "null" }},
            {{ $calendar ? ($calendar->owned ? "true" : "false") : "true" }},
            'free',
            'guest'
        ];
    @endif

    window.calendar = new window.FantasyCalendar(
        `{{ $calendar->hash }}`,
        {{ Illuminate\Support\Js::from($calendar->static_data) }},
        {{ Illuminate\Support\Js::from($calendar->dynamic_data) }},
        {{ Illuminate\Support\Js::from($calendar->events) }},
        {{ Illuminate\Support\Js::from($calendar->event_categories) }},
        {
            is_linked: {!! $calendar->isLinked() ? "true" : "false" !!},
            has_parent: {!! $calendar->parent != null ? "true" : "false" !!},
            parent_hash: {!! $calendar->parent != null ? '"'.$calendar->parent->hash.'"' : "null" !!},
            parent_offset: {!! $calendar->parent != null ? $calendar->parent_offset : "null" !!}
        }
    )

    window.Perms = new Perms(...userData);

    function sidebar() {
        return {

            static_data: window.calendar.static_data,
            dynamic_data: window.calendar.dynamic_data,
            preview_date: window.calendar.preview_date,
            events: window.calendar.events,
            event_categories: window.calendar.event_categories,
            link_data: window.calendar.link_data

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
