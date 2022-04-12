@props(['calendar'])

@push('head')
    <script lang="js">

        function settingsSection($data){

            return {
                settings: $data.static_data.settings
            }
        }

    </script>
@endpush

<x-sidebar.collapsible
    class="settings-settings"
    name="settings"
    title="Settings"
    icon="fas fa-cog"
    tooltip-title="More Info: Settings"
    helplink="settings"
>

    <div x-data="settingsSection($data)">

        <div class='bold-text'>Layout Settings:</div>

        @if(request()->is('calendars/*/edit'))
            <label class="row no-gutters setting">
                <button x-data type='button' class='btn btn-primary full' @click="$dispatch('open-layouts-modal')">Select Layout</button>
            </label>
        @endif

        <label class="row no-gutters setting border rounded py-1 px-2 protip" data-pt-position="right" data-pt-title="Makes the calendar only show the current month. Enhances calendar loading performance, especially with many moons.">
            <div class='col'>
                <input type='checkbox' class='margin-right' x-model='settings.show_current_month'>
                <span>Show only current month</span>
            </div>
        </label>

        <label class="row no-gutters setting border rounded py-1 px-2 protip" data-pt-position="right" data-pt-title="This will add 'Month 1' and so on to each month in the calendar">
            <div class='col'>
                <input type='checkbox' class='margin-right' x-model='settings.add_month_number'>
                <span>Add month number to months</span>
            </div>
        </label>

        <label class="row no-gutters setting border rounded py-1 px-2 protip" data-pt-position="right" data-pt-title="This adds a small number at the bottom left of the days in the calendar showing which year-day it is">
            <div class='col'>
                <input type='checkbox' class='margin-right' x-model='settings.add_year_day_number'>
                <span>Add year day to each day</span>
            </div>
        </label>

        <!------------------------------------------------------->

        <div class='bold-text'>Guest View Settings:</div>

        <label class="row no-gutters setting border rounded py-1 px-2 protip" data-pt-position="right" data-pt-title="This makes it so that no one can view your calendar, unless you have added them as a user to the calendar">
            <div class='col'>
                <input type='checkbox' class='margin-right' x-model='settings.private'>
                <span>Make calendar private</span>
            </div>
        </label>

        <label class="row no-gutters setting border rounded py-1 px-2 protip" data-pt-position="right" data-pt-title="Allows guests viewing your calendar to check past and future dates with the preview date">
            <div class='col'>
                <input type='checkbox' checked class='margin-right' x-model='settings.allow_view'>
                <span>Enable previewing dates in calendar</span>
            </div>
        </label>

        <label class="row no-gutters setting border rounded py-1 px-2 protip" data-pt-position="right" data-pt-title="Similar to the previous setting, but this limits the viewer to only preview backwards, not forwards. This setting needs Allowing advancing view in calendar to be enabled.">
            <div class='col'>
                <input type='checkbox' class='margin-right' x-model='settings.only_backwards'>
                <span>Limit previewing to only past dates</span>
            </div>
        </label>

        <label class="row no-gutters setting border rounded py-1 px-2 protip" data-pt-position="right" data-pt-title="Guest viewers will not be able to see past the current date. Any future days will be grayed out.">
            <div class='col'>
                <input type='checkbox' class='margin-right' x-model='settings.only_reveal_today'>
                <span>Show only up to current day</span>
            </div>
        </label>

        <!------------------------------------------------------->

        <div class='bold-text'>Hiding Settings:</div>

        <label class="row no-gutters setting border rounded py-1 px-2 protip" data-pt-position="right" data-pt-title="Hides all of the moons from guest viewers">
            <div class='col'>
                <input type='checkbox' class='margin-right' x-model='settings.hide_moons'>
                <span>Hide all moons from guest viewers</span>
            </div>
        </label>

        <label class="row no-gutters setting border rounded py-1 px-2 protip" data-pt-position="right" data-pt-title="Hides the clock from guest viewers">
            <div class='col'>
                <input type='checkbox' class='margin-right' x-model='settings.hide_clock'>
                <span>Hide time from guest viewers</span>
            </div>
        </label>

        <label class="row no-gutters setting border rounded py-1 px-2 protip" data-pt-position="right" data-pt-title="Hides all events from guest viewers">
            <div class='col'>
                <input type='checkbox' class='margin-right' x-model='settings.hide_events'>
                <span>Hide all events from guest viewers</span>
            </div>
        </label>

        <label class="row no-gutters setting border rounded py-1 px-2 protip" data-pt-position="right" data-pt-title="Hides the era text at the top of the calendar and only shows the year instead to guest viewers">
            <div class='col'>
                <input type='checkbox' class='margin-right' x-model='settings.hide_eras'>
                <span>Hide era from guest viewers</span>
            </div>
        </label>

        <label class="row no-gutters setting border rounded py-1 px-2 protip" data-pt-position="right" data-pt-title="Prevents all weather from appearing on the calendar for guest viewers">
            <div class='col'>
                <input type='checkbox' class='margin-right' x-model='settings.hide_all_weather'>
                <span>Hide all weather from guest viewers</span>
            </div>
        </label>

        <label class="row no-gutters setting border rounded py-1 px-2 protip" data-pt-position="right" data-pt-title="Prevents any future weather from appearing on the calendar for guest viewers">
            <div class='col'>
                <input type='checkbox' class='margin-right' x-model='settings.hide_future_weather'>
                <span>Hide future weather from guest viewers</span>
            </div>
        </label>

        <label class="row no-gutters setting border rounded py-1 px-2 protip" data-pt-position="right" data-pt-title='This hides the exact temperature from guest viewers - this is really useful with the cinematic temperature setting as guests will only see "cold", "sweltering" and the like'>
            <div class='col'>
                <input type='checkbox' class='margin-right' x-model='settings.hide_weather_temp'>
                <span>Hide temperature from guest viewers</span>
            </div>
        </label>

        <label class="row no-gutters setting border rounded py-1 px-2 protip" data-pt-position="right" data-pt-title="This hides the exact wind velocity from guest viewers">
            <div class='col'>
                <input type='checkbox' class='margin-right' x-model='settings.hide_wind_velocity'>
                <span>Hide wind velocity from guest viewers</span>
            </div>
        </label>

        <label class="row no-gutters setting border rounded py-1 px-2 protip" data-pt-position="right" data-pt-title="This will hide the weekday bar at the top of each month">
            <div class='col'>
                <input type='checkbox' class='margin-right' x-model='settings.hide_weekdays'>
                <span>Hide weekdays in calendar</span>
            </div>
        </label>

        @if(isset($calendar) && Auth::user()->can('add-users', $calendar))

            <div class='bold-text'>Event Settings:</div>

            <label class="row no-gutters setting border rounded py-1 px-2 protip" data-pt-position="right" data-pt-title="This will change whether users can comment on the events of your calendar. When disabled, only the owner can comment on events.">
                <div class='col'>
                    <input type='checkbox' class='margin-right' x-model='settings.comments'>
                    <span>Allow user comments on events</span>
                </div>
            </label>

        @endif

        <div class='bold-text'>Advanced Settings:</div>

        <label class="row no-gutters setting border rounded py-1 px-2 protip" data-pt-position="right" data-pt-title="Normally, the year count is -2, -1, 1, 2, and so on. This makes it so that 0 exists, so -2, -1, 0, 1, 2.">
            <div class='col'>
                @if(request()->is('calendars/*/edit') && $calendar->isLinked())
                    <input type='checkbox' class='margin-right' {{ Arr::get($calendar->static_data, 'settings.year_zero_exists') ? "checked" : "" }} disabled>
                @else
                    <input type='checkbox' class='margin-right' x-model='settings.year_zero_exists'>
                @endif
                <span>Year zero exists</span>
            </div>
        </label>

        @if(request()->is('calendars/*/edit') && $calendar->isLinked())
            <p class=""><a onclick="linked_popup();" href='#'>Why are some settings disabled?</a></p>
        @endif

    </div>

</x-sidebar.collapsible>