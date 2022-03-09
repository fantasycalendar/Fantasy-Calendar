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
        `{{ $calendar->name }}`,
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

            // Set up bindings
            name: window.calendar.name,
            static_data: window.calendar.static_data,
            dynamic_data: window.calendar.dynamic_data,
            preview_date: window.calendar.preview_date,
            events: window.calendar.events,
            event_categories: window.calendar.event_categories,
            link_data: window.calendar.link_data,

            // Defaults
            calendar_changed: false,
            calendar_valid: true,
            initialized: false,
            errors: [],

            init(){
                const self = this;
                this.$watch("static_data, dynamic_data, events, event_categories", this.calendarChanged.bind(this));
                this.$nextTick(() => {
                    window.calendar.render();
                    self.initialized = true;
                });
                bind_calendar_events();
            },

            get save_button_text(){
                if(!this.calendar_valid){
                    return "Calendar has errors - can't save";
                }
                return this.calendar_changed ? "Save calendar" : "No changes to save";
            },

            calendarChanged(){
                // To avoid data updates re-triggering the intial render
                if(!this.initialized) return;
                this.calendar_changed = window.calendar.hasDataChanged();
                this.errors = window.calendar.getErrors();
                this.calendar_valid = !this.errors.length;
                if(!this.calendar_valid) return;
                window.calendar.render();
            }

        }

    }

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
