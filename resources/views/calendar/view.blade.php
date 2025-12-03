@extends('templates._calendar')

@push('head')
    <script>
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

        function getCalendarStructure() {
            return {
                userId: @js(Auth::user()?->id),
                owned: @js(!$calendar || $calendar->owned),
                paymentLevel: @js(strtolower(Auth::user()->paymentLevel() ?? "free")),
                userRole: @js($calendar->users->find(Auth::user())?->pivot?->user_role ?? "guest"),
                darkTheme: @js(auth()->user()?->setting("dark_theme") ?? true),
                hash: @js($calendar->hash),
                calendar_name: @js($calendar->name),
                calendar_id: @js($calendar->id),
                static_data: @js($calendar->static_data),
                dynamic_data: @js($calendar->dynamic_data),
                is_linked: @js($calendar->isLinked()),
                has_parent: @js($calendar->parent),
                parent_hash: @js($calendar->parent?->hash),
                parent_offset: @js($calendar->parent_offset),
                events: @js($calendar->events),
                event_categories: @js($calendar->event_categories),
                last_static_change: @js($calendar->last_static_change),
                last_dynamic_change: @js($calendar->last_dynamic_change),
                advancement_enabled: @js($calendar->advancement_enabled),
                advancement_real_rate: @js($calendar->advancement_real_rate ?? 1),
                advancement_real_rate_unit: @js($calendar->advancement_real_rate_unit ?? "minutes"),
                advancement_rate: @js($calendar->advancement_rate ?? 1),
                advancement_rate_unit: @js($calendar->advancement_rate_unit ?? "minutes"),
                advancement_webhook_url: @js($calendar->advancement_webhook_url),
                advancement_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            }
        }
    </script>
@endpush

@section('content')
    <div id="generator_container" x-data="calendar_view_page(getCalendarStructure())">
        @include('layouts.weather_tooltip')
        @include('layouts.day_data_tooltip')
        @include('layouts.moon_tooltip')
        @include('layouts.event')
        @include('inputs.sidebar.view')
    </div>
@endsection
