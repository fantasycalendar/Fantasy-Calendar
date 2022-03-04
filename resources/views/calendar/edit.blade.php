@extends('templates._calendar')

@push('head')
    <script>

    function sidebar() {
        return {
            static_data: {{ Illuminate\Support\Js::from($calendar->static_data) }},
            dynamic_data: {{ Illuminate\Support\Js::from($calendar->dynamic_data) }},
            preview_date: {{ Illuminate\Support\Js::from($calendar->dynamic_data) }},
            event_categories: {{ Illuminate\Support\Js::from($calendar->event_categories) }},

            init(){
                this.preview_date.follow = true;
            },

            // I know, these should be on a calendar class - but we ain't got one.
            getTimespansInYear(year){
                return this.static_data.year_data.timespans.map((timespan, index) => {
                    timespan.index = index;
                    return timespan;
                }).filter(timespan => {
                    return IntervalsCollection.make(timespan).intersectsYear(year);
                });
            },

            getDaysForTimespanInYear(timespan_index, year){

                const timespan = this.static_data.year_data.timespans[timespan_index];

                const timespanOccurrences = IntervalsCollection.make(timespan).occurrences(year, this.static_data.settings.year_zero_exists);

                const numDays = this.static_data.year_data.leap_days.reduce((acc, leap_day) => {
                    return acc + IntervalsCollection.make(leap_day).intersectsYear(timespanOccurrences);
                }, timespan.length);

                return Array.from(Array(numDays).keys()).map(num => `Day ${num+1}`);

            },

            getNonLeapingDaysInTimespan(timespan_index){

                const timespan = this.static_data.year_data.timespans[timespan_index];

                const numDays = this.static_data.year_data.leap_days.reduce((acc, leap_day) => {
                    return acc + (leap_day.interval === "1")
                }, timespan.length);

                return Array.from(Array(numDays).keys()).map(num => `Day ${num+1}`);

            },

            getAverageYearLength(){

                let avg_length = 0;

                for(let timespan of this.static_data.year_data.timespans){
                    avg_length += timespan.length * IntervalsCollection.make(timespan).totalFraction;
                }

                for(let leap_day of this.static_data.year_data.leap_days){
                    avg_length += IntervalsCollection.make(leap_day).totalFraction;
                }

                return precisionRound(avg_length, 10);

            }
        }
    }

    $(document).ready(function() {
        @include('calendar._loadcalendar')
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
