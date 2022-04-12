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

    $(document).ready(() => {
        set_up_context_menu();
    });

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

            rerenderableProperties: [
                "static_data",
                "events",
                "event_categories",
                "dynamic_data.year",
                "preview_date.year",
            ],

            watchProperties: [
                "preview_date.timespan",
                "preview_date.day",
                "dynamic_data.timespan",
                "dynamic_data.day",
                "dynamic_data.hour",
                "dynamic_data.minute",
                "dynamic_data.current_location",
                "dynamic_data.custom_location"
            ],

            init(){
                const self = this;
                this.$watch(this.rerenderableProperties.join(', '), () => { this.calendarChanged(true) });
                this.$watch(this.watchProperties.join(', '), () => { this.calendarChanged() });
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

            calendarChanged(rerender = false){
                // To avoid data updates re-triggering the initial render
                if(!this.initialized) return;
                this.calendar_changed = window.calendar.hasDataChanged();
                this.errors = window.calendar.getErrors();
                this.calendar_valid = !this.errors.length;
                if(!this.calendar_valid) return;
                window.calendar.calendarChanged(rerender);
            },

            currentViewType: "owner",

            changeViewType(type){

                Perms.owner = type !== "player";
                climate_charts.active_view = type === "weather";

                if(this.currentViewType !== type && (type === "player" || this.currentViewType === "player")){
                    window.calendar.render();
                }

                this.currentViewType = type;

            },

            dateOpen: false,

            moveClock($event, location){

                const { checked } = $event.target;

                if(location === "date"){
                    this.dateOpen = checked;
                }

                const clock = document.getElementById("clock");
                const clock_container = document.getElementById("clock_container");
                const alt_clock_container = document.getElementById("alt_clock_container");

                if(!this.dateOpen && alt_clock_container){
                    alt_clock_container.appendChild(clock);
                }else{
                    clock_container.appendChild(clock);
                }

            },

            changeCurrentDate($event){

                this.dynamic_data.year = $event.detail.year;
                this.dynamic_data.timespan = $event.detail.timespan;
                this.dynamic_data.day = $event.detail.day;

                window.dispatchEvent(new CustomEvent('changed-current-date', { detail: clone(this.dynamic_data) } ));

                // TODO Adam: set up secondary debounced event for re-render based on dates

            }

        }

    }



    function sortableList(data, element, eventName){

        return {

            reordering: false,
            dragging: null,
            dropping: null,

            draggable: null,

            dropped(start, end){

                if(start === end) return;

                let order = this.draggable.toArray()
                order.shift()

                const elem = data.splice(start, 1)[0];

                data.splice(end, 0, elem);

                this.$refs[element+"-template"]._x_prevKeys = order;

                if(eventName){
                    if(Array.isArray(eventName)){
                        eventName.forEach((evtName) => {
                            window.dispatchEvent(new CustomEvent(evtName, { detail: { start, end }}));
                        })
                    }else{
                        window.dispatchEvent(new CustomEvent(eventName, { detail: { start, end }}));
                    }
                }

            },

            init() {
                if(element) {
                    this.draggable = Sortable.create(this.$refs[element], {
                        animation: 300,
                        ghostClass: "dragged-placeholder",  // Class name for the drop placeholder
                        dragClass: "dragged-item",  // Class name for the dragging item
                        handle: ".handle",
                        onEnd: (event) => {
                            this.dropped(event.oldIndex, event.newIndex);
                        },
                    });
                }
            }
        }
    }

    </script>
@endpush

@section('content')
    <div
        id="generator_container"
        x-data="sidebar()"
        @change-current-date.window="changeCurrentDate"
    >
        @include('layouts.layouts')
        @include('layouts.weather_tooltip')
        @include('layouts.day_data_tooltip')
        @include('layouts.moon_tooltip')
        @include('layouts.event')
        @include('inputs.sidebar.edit')
    </div>
@endsection
