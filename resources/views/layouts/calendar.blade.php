<div id='calendar' x-data="CalendarRenderer">

    <template
        @calendar-change.window="load_calendar"
        @event-change.window="register_event"
        x-if='loaded'
        x-for="timespan in render_data.timespans"
    >

        <div class="timespan_container grid">
            <div class='timespan_name' x-text='timespan.title'>
                <span class='timespan_number'>
                </span>
            </div>
            <div class='timespan_row_container'>
                <div x-show='timespan.show_weekdays' class='timespan_row_names'>
                    <template x-for="weekday in timespan.weekdays">
                        <div class='week_day_name' x-text='weekday'></div>
                    </template>
                </div>
                <template x-for="week in timespan.days">
                    <div class='timespan_row'>
                        <template x-for="day in week">
                            <div :class="['timespan_' + day.type]" :epoch="day.epoch">
                                <div class='day_row'>
                                    <div class='toprow left'>
                                     <div class='number' x-text='day.number_text'></div>
                                    </div>
                                </div>
                                <div class='toprow center'>
                                    <template x-if="day.weather_icon">
                                        <div class='weather_popup'><i x-bind:class='day.weather_icon'></i></div>
                                    </template>
                                </div>
                                <div class='toprow right'>
                                    <div class='season_color'></div>
                                </div>
                                <div class='day_row'>
                                    <template x-for="moon in day.moons">
                                        <div class='moon_container protip'
                                             :moon_id="moon.index"
                                             data-pt-position="top"
                                             data-pt-title=''>
                                            <i class='wi wi-moon-full'></i>
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </template>
                    </div>
                </template>
            </div>
        </div>
    </template>
</div>