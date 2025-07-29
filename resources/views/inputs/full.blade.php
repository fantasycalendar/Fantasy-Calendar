<div id="input_container" class='d-print-none' x-cloak :class='{ "inputs_collapsed": !sidebar_open }'>
    @include('inputs.sidebar.header')

    @yield('label')

    <div class="accordion mt-3">
        <x-collapsible :calendar="$calendar" contains="Statistics" icon="fa-chart-pie" polished></x-collapsible>

        <x-collapsible :calendar="$calendar" contains="Current Date" icon="fa-hourglass-half" polished></x-collapsible>

        <x-collapsible :calendar="$calendar" contains="Clock" icon="fa-clock" polished></x-collapsible>

        @if(request()->is('calendars/*/edit'))
            <x-collapsible :calendar="$calendar" contains="Real-Time Advancement" icon="fa-history"
                           premium_feature="true" polished></x-collapsible>
        @endif

        <x-collapsible :calendar="$calendar" contains="Weekdays" step="2" icon="fa-calendar-week" polished></x-collapsible>

        <x-collapsible :calendar="$calendar" contains="Months" step="3" icon="fa-calendar-alt" polished></x-collapsible>

        <x-collapsible :calendar="$calendar" contains="Leap Days" icon="fa-calendar-day" polished></x-collapsible>

        <x-collapsible :calendar="$calendar" contains="Eras" icon="fa-infinity" polished></x-collapsible>

        <x-collapsible :calendar="$calendar" contains="Moons" icon="fa-moon" polished></x-collapsible>

        <x-collapsible :calendar="$calendar" contains="Seasons" icon="fa-snowflake" polished></x-collapsible>

        <x-collapsible :calendar="$calendar" contains="Weather" icon="fa-cloud-sun-rain" polished></x-collapsible>

        <x-collapsible :calendar="$calendar" contains="Locations" icon="fa-compass" polished></x-collapsible>

        <x-collapsible :calendar="$calendar" contains="Cycles" icon="fa-redo" polished></x-collapsible>

        <x-collapsible :calendar="$calendar" contains="Event Categories" icon="fa-th-list" polished></x-collapsible>

        <x-collapsible :calendar="$calendar" contains="Events" icon="fa-calendar-check" done></x-collapsible>

        <x-collapsible :calendar="$calendar" contains="Settings" icon="fa-cog" polished></x-collapsible>

        @if(request()->is('calendars/*/edit'))
            <x-collapsible :calendar="$calendar" contains="User Management" icon="fa-user"
                           premium_feature="true" polished></x-collapsible>

            <x-collapsible :calendar="$calendar" contains="Calendar Linking" icon="fa-link"
                           premium_feature="true" polished></x-collapsible>
        @endif
    </div>

    <div class="copyright text-center">
        <small class="copyright d-inline-block mb-2">Copyright © {{ date('Y') }} Fantasy Computerworks Ltd <br>
            <a href="{{ route('terms-and-conditions') }}">Terms and Conditions</a> -
            <a href="{{ route('privacy-policy') }}">Privacy and Cookies Policy</a>
        </small>
    </div>
</div>

<div x-show="flattened_errors.length" x-cloak class='order-3 h-full w-full bg-gray-900/50 flex flex-col justify-center items-center'>
    <div class="bg-red-300 dark:bg-red-800 w-96 flex flex-col p-[1.25rem] rounded">
        <template x-for="error in flattened_errors">
            <strong class="text-center border-b-2 border-b-red-500 dark:border-b-red-900 last:border-none mb-[1rem] pb-[1rem] last:mb-0 last:pb-0" x-html="error"></strong>
        </template>
    </div>
</div>

@if(request()->is('calendars/*/edit'))
    <div class='order-3 h-full w-full bg-gray-900/50 flex flex-col justify-center items-center' x-cloak x-show="show_redraw_warning && !flattened_errors.length">
        <div class='p-2 text-white'>While the "Prompt before redrawing calendar" setting is active, the calendar will not re-render.</div>
        <div class='p-2'>
            <button type='button' class='btn btn-primary' @click="$dispatch('calendar-updating', { calendar: { 'static_data.settings.prompt_for_redraw': false }})">
                Update preview & disable setting
            </button>
        </div>
    </div>
@endif

<div id="calendar_container" :class='{ "inputs_collapsed": !sidebar_open }' x-cloak x-show="!flattened_errors.length && !show_redraw_warning">

    <x-calendar-year-header></x-calendar-year-header>

    @include('layouts.calendar-' . (isset($calendar) ? $calendar->setting('layout', 'grid') : 'grid'))

    @if(request()->is('calendars/*/edit'))
        <x-weather-graphs></x-weather-graphs>
    @endif

</div>
<div id='html_edit'></div>
