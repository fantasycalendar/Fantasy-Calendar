<div id="input_container" class='d-print-none' x-cloak :class='{ "inputs_collapsed": !sidebar_open }'>
    @include('inputs.sidebar.header')

    @yield('label')

    <div class="accordion mt-3">
        <x-collapsible :calendar="$calendar ?? null" contains="Statistics" icon="fa-chart-pie"></x-collapsible>

        <x-collapsible :calendar="$calendar ?? null" contains="Current Date" icon="fa-hourglass-half"></x-collapsible>

        <x-collapsible :calendar="$calendar ?? null" contains="Clock" icon="fa-clock"></x-collapsible>

        @if(request()->is('calendars/*/edit'))
            <x-collapsible :calendar="$calendar ?? null" contains="Real-Time Advancement" icon="fa-history"
                           premium_feature="true"></x-collapsible>
        @endif

        <x-collapsible :calendar="$calendar ?? null" contains="Weekdays" step="2" icon="fa-calendar-week"></x-collapsible>

        <x-collapsible :calendar="$calendar ?? null" contains="Months" step="3" icon="fa-calendar-alt"></x-collapsible>

        <x-collapsible :calendar="$calendar ?? null" contains="Leap Days" icon="fa-calendar-day"></x-collapsible>

        <x-collapsible :calendar="$calendar ?? null" contains="Eras" icon="fa-infinity"></x-collapsible>

        <x-collapsible :calendar="$calendar ?? null" contains="Moons" icon="fa-moon"></x-collapsible>

        <x-collapsible :calendar="$calendar ?? null" contains="Seasons" icon="fa-snowflake"></x-collapsible>

        <x-collapsible :calendar="$calendar ?? null" contains="Weather" icon="fa-cloud-sun-rain"></x-collapsible>

        <x-collapsible :calendar="$calendar ?? null" contains="Locations" icon="fa-compass"></x-collapsible>

        <x-collapsible :calendar="$calendar ?? null" contains="Cycles" icon="fa-redo"></x-collapsible>

        <x-collapsible :calendar="$calendar ?? null" contains="Event Categories" icon="fa-th-list"></x-collapsible>

        <x-collapsible :calendar="$calendar ?? null" contains="Events" icon="fa-calendar-check"></x-collapsible>

        <x-collapsible :calendar="$calendar ?? null" contains="Settings" icon="fa-cog"></x-collapsible>

        @if(request()->is('calendars/*/edit'))
            <x-collapsible :calendar="$calendar ?? null" contains="User Management" icon="fa-user"
                           premium_feature="true"></x-collapsible>

            <x-collapsible :calendar="$calendar ?? null" contains="Calendar Linking" icon="fa-link"
                           premium_feature="true"></x-collapsible>
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
