@props(['calendar' => null])

<div class="space-y-3">
    <div>
        <strong class="mb-0.5">Layout Settings:</strong>

        <button type='button' class='btn btn-primary w-full my-2.5' @click="$dispatch('open-layouts-modal')">
            Select Layout
        </button>

        <div class="flex flex-col">
            <x-alpine.check-input id="settings_show_current_month" x-model="settings.show_current_month">
                Show only current month
            </x-alpine.check-input>

            <x-alpine.check-input id="settings_add_month_number" x-model="settings.add_month_number">
                Add month number to months
            </x-alpine.check-input>

            <x-alpine.check-input id="settings_add_year_day_number" x-model="settings.add_year_day_number">
                Add year day to each day
            </x-alpine.check-input>
        </div>
    </div>

    <!------------------------------------------------------->

    <div>
        <strong class="mb-0.5">Guest View Settings:</strong>

        <div class="flex flex-col">
            <x-alpine.check-input id="settings_private" x-model="settings.private">
                Make calendar private
            </x-alpine.check-input>

            <x-alpine.check-input id="settings_allow_view" x-model="settings.allow_view">
                Enable previewing dates in calendar
            </x-alpine.check-input>


            <x-alpine.check-input id="settings_only_backwards" x-model="settings.only_backwards">
                Limit previewing to only past dates
            </x-alpine.check-input>


            <x-alpine.check-input id="settings_only_reveal_today" x-model="settings.only_reveal_today">
                Show only up to current day
            </x-alpine.check-input>
        </div>
    </div>

    <!------------------------------------------------------->

    <div>
        <strong class="mb-0.5">Hiding Settings:</strong>

        <div class="flex flex-col">
            <x-alpine.check-input id="settings_hide_moons" x-model="settings.hide_moons">
                Hide all moons from guest viewers
            </x-alpine.check-input>


            <x-alpine.check-input id="settings_hide_clock" x-model="settings.hide_clock">
                Hide time from guest viewers
            </x-alpine.check-input>


            <x-alpine.check-input id="settings_hide_events" x-model="settings.hide_events">
                Hide all events from guest viewers
            </x-alpine.check-input>


            <x-alpine.check-input id="settings_hide_eras" x-model="settings.hide_eras">
                Hide era from guest viewers
            </x-alpine.check-input>


            <x-alpine.check-input id="settings_hide_all_weather" x-model="settings.hide_all_weather">
                Hide all weather from guest viewers
            </x-alpine.check-input>


            <x-alpine.check-input id="settings_hide_future_weather" x-model="settings.hide_future_weather">
                Hide future weather from guest viewers
            </x-alpine.check-input>


            <x-alpine.check-input id="settings_hide_weather_temp" x-model="settings.hide_weather_temp">
                Hide temperature from guest viewers
            </x-alpine.check-input>


            <x-alpine.check-input id="settings_hide_wind_velocity" x-model="settings.hide_wind_velocity">
                Hide wind velocity from guest viewers
            </x-alpine.check-input>


            <x-alpine.check-input id="settings_hide_weekdays" x-model="settings.hide_weekdays">
                Hide weekdays in calendar
            </x-alpine.check-input>
        </div>
    </div>

    @if(isset($calendar) && Auth::user()->can('add-users', $calendar))
        <div>
        <strong class="mb-0.5">Event Settings:</strong>

            <div>
                <x-alpine.check-input id="settings_comments" x-model="settings.comments">
                    Allow user comments on events
                </x-alpine.check-input>
            </div>
        </div>
    @endif

    <div>
        <strong class="mb-0.5">Advanced Settings:</strong>

        <div>
            <x-alpine.check-input id="settings_year_zero_exists" x-model="settings.year_zero_exists">
                Year zero exists
            </x-alpine.check-input>
        </div>
    </div>

    @if(request()->is('calendars/*/edit') && $calendar->isLinked())
        <p class=""><a onclick="linked_popup();" href='#'>Why are some settings disabled?</a></p>
    @endif

</div>
