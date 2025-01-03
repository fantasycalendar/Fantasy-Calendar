@extends('templates._calendar')

@push('head')
    <script>
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
    <div id="generator_container" x-data='calendar_edit_page(getCalendarStructure())' @calendar-updating.window="updateCalendar">
        @include('layouts.layouts')
        @include('layouts.events_manager')
        @include('layouts.weather_tooltip')
        @include('layouts.day_data_tooltip')
        @include('layouts.moon_tooltip')
        @include('layouts.event')
        @include('inputs.sidebar.edit')
    </div>
@endsection
