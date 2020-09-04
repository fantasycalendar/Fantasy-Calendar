<div id='calendar' x-data="CalendarRenderer">

    <template
        @render-data-change.window="
            pre_render();
            load_calendar($event);
            $nextTick(() => { post_render() });
        "
        @events-change.window="
            pre_event_load();
            register_events($event);
            $nextTick(() => { post_event_load() });
        "
        @update-epochs.window="update_epochs"
        x-if='loaded'
        x-for="timespan in render_data.timespans"
    >

        <div class="timespan_container grid">

            <div class='timespan_name'>
                <span x-text='timespan.title'></span>
                <span class='timespan_number' x-show="timespan.number" x-text='[" - " + timespan.number]'></span>
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
                            <div :class="{
                                'timespan_day': day.type == 'day',
                                'timespan_overflow': day.type == 'overflow',
                                'timespan_day empty_timespan_day': day.type == 'empty',
                                'current_day': day.epoch == render_data.current_epoch,
                                'preview_day': day.epoch == render_data.preview_epoch && render_data.preview_epoch != render_data.current_epoch,
                            }" :epoch="day.epoch">
                                <div class='day_row'>
                                    <div class='toprow left' x-show="day.number">
                                        <div class='number' x-text='day.number'></div>
                                    </div>
                                    <div class='toprow center'>
                                        <template x-if="day.weather_icon">
                                            <div class='weather_popup'><i x-bind:class='day.weather_icon'></i></div>
                                        </template>
                                    </div>
                                    <div class='toprow right'>
                                        <div class='season_color'></div>
                                    </div>
                                </div>
                                <div x-show="day.moons" class='day_row flex justify-content-center'>
                                    <template x-if='day.moons'>
                                        <template x-for="moon in day.moons">
                                            <div class='moon_container protip'
                                                :moon_id="moon.index"
                                                data-pt-position="top"
                                                data-pt-title=''>
                                                <i class='wi wi-moon-full'></i>
                                            </div>
                                        </template>
                                    </template>
                                </div>
                                <div class="day_row">
                                    <template x-if="day.events">
                                        <div class="event_container">
                                            <template x-for="calendar_event in day.events">
                                                <div class="event" :class="calendar_event.class" x-text="calendar_event.name" :event_id="calendar_event.id"></div>
                                            </template>
                                        </div>
                                    </template>
                                </div>
                                <div class="day_row flex-grow" x-show="day.type === 'day'">
                                    <button class="btn_create_event btn btn-success full" @click="create_event(day.epoch)" :epoch="day.epoch">Create event</button>
                                </div>
                                <div class="day_row">
                                    <div class="year_day" x-show="day.year_day" x-text="day.year_day"></div>
                                </div>
                            </div>
                        </template>
                    </div>
                </template>
            </div>
        </div>
    </template>
</div>
