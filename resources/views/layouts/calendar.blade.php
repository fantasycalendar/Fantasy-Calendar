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

        <div :class="{'timespan_outer_container': render_data.render_style == 'minimalistic'}">

            <div class="timespan_container" :class='render_data.render_style'>

                <template x-if='timespan.show_title'>
                    <div class='timespan_name'>
                        <span x-text='timespan.title'></span>
                        <span class='timespan_number' x-show="timespan.number" x-text='["- Month " + timespan.number]'></span>
                    </div>
                </template>

                <div class='timespan_row_container'>

                    <div class="timespan_row_names" x-show="timespan.show_weekdays && render_data.render_style != 'vertical' && render_data.render_style != 'minimalistic'">
                        <template x-for="weekday in timespan.weekdays">
                            <div class="week_day_name" x-text="weekday"></div>
                        </template>
                    </div>

                    <div class="timespan_row_names" x-show="timespan.show_weekdays && render_data.render_style == 'minimalistic'">
                        <template x-for="weekday in timespan.short_weekdays">
                            <div class="week_day_name" x-text="weekday"></div>
                        </template>
                    </div>

                    <template x-if="render_data.render_style == 'grid' || render_data.render_style == 'wide'" x-for="week in timespan.days">
                        <div class="timespan_row">
                            <template x-for="day in week">
                                <div :class="{
                                    'timespan_day': day.type == 'day',
                                    'timespan_overflow': day.type == 'overflow',
                                    'timespan_day empty_timespan_day': day.type == 'empty',
                                    'current_day': day.epoch == render_data.current_epoch,
                                    'preview_day': day.epoch == render_data.preview_epoch && render_data.preview_epoch != render_data.current_epoch,
                                }" :epoch="day.epoch">
                                    <div class="day_row">
                                        <div class="toprow left" x-show="day.number">
                                            <div class="number" x-text="day.number"></div>
                                        </div>
                                        <template x-if="day.weather_icon">
                                            <div class="toprow center">
                                                <div class="weather_popup"><i x-bind:class="day.weather_icon"></i></div>
                                            </div>
                                        </template>
                                        <div class="toprow right">
                                            <div class="season_color"></div>
                                        </div>
                                    </div>
                                    <template x-if="day.moons">
                                        <div class="day_row flex justify-content-center flex-wrap">
                                            <template x-for="moon in day.moons">
                                                <svg class="moon protip" :moon_id="moon.index" preserveAspectRatio="xMidYMid" width="32" height="32" viewBox="0 0 32 32" data-pt-position="top" :data-pt-title='moon.name + ", " + moon.phase'>
                                                    <circle cx="16" cy="16" r="9" class="lunar_background"/>
                                                    <path class="lunar_shadow" x-show="moon.path" :d="moon.path"/>
                                                    <circle cx="16" cy="16" r="10" class="lunar_border"/>
                                                </svg>
                                            </template>
                                        </div>
                                    </template>
                                    <div class="day_row">
                                        <template x-if="day.events">
                                            <div class="event_container">
                                                <template x-for="calendar_event in day.events">
                                                    <div class="event" :class="calendar_event.class" x-text="calendar_event.name" :event_id="calendar_event.index"></div>
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

                    <template x-if="render_data.render_style == 'vertical'" x-for="day in timespan.days[0]">
                        <div :class="{
                            'timespan_day': day.type == 'day',
                            'timespan_overflow': day.type == 'overflow',
                            'timespan_day empty_timespan_day': day.type == 'empty',
                            'current_day': day.epoch == render_data.current_epoch,
                            'preview_day': day.epoch == render_data.preview_epoch && render_data.preview_epoch != render_data.current_epoch,
                        }" :epoch="day.epoch">
                            <div class="day_row">
                                <div class="toprow left" x-show="day.number">
                                    <div class="number" x-text="day.number"></div>
                                    <div class="weekday" x-text="day.weekday"></div>
                                </div>
                                <template x-if="day.weather_icon">
                                    <div class="toprow center">
                                        <div class="weather_popup"><i x-bind:class="day.weather_icon"></i></div>
                                    </div>
                                </template>
                                <div class="toprow right">
                                    <div class="season_color"></div>
                                </div>
                            </div>
                            <template x-if="day.moons">
                                <div class="day_row flex justify-content-center flex-wrap">
                                    <template x-for="moon in day.moons">
                                        <svg class="moon protip" :moon_id="moon.index" preserveAspectRatio="xMidYMid" width="32" height="32" viewBox="0 0 32 32" data-pt-position="top" :data-pt-title='moon.name + ", " + moon.phase'>
                                            <circle cx="16" cy="16" r="9" class="lunar_background"/>
                                            <path class="lunar_shadow" x-show="moon.path" :d="moon.path"/>
                                            <circle cx="16" cy="16" r="10" class="lunar_border"/>
                                        </svg>
                                    </template>
                                </div>
                            </template>
                            <div class="day_row">
                                <template x-if="day.events">
                                    <div class="event_container">
                                        <template x-for="calendar_event in day.events">
                                            <div class="event" :class="calendar_event.class" x-text="calendar_event.name" :event_id="calendar_event.index"></div>
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

                    <template x-if="render_data.render_style == 'minimalistic'" x-for="week in timespan.days">
                        <div class="timespan_row">
                            <template x-for="day in week">
                                <div :class="{
                                    'timespan_day': day.type == 'day',
                                    'timespan_overflow': day.type == 'overflow',
                                    'timespan_day empty_timespan_day': day.type == 'empty',
                                    'current_day': day.epoch == render_data.current_epoch,
                                    'preview_day': day.epoch == render_data.preview_epoch && render_data.preview_epoch != render_data.current_epoch,
                                    'moon_popup': day.moons,
                                    'weather_popup': day.weather_icon,
                                    'has_event': day.events.length > 0
                                }" :epoch="day.epoch">
                                    <div class="number" x-text="day.number"></div>
                                </div>
                            </template>
                        </div>
                    </template>
                </div>
            </div>
            <template x-if="render_data.render_style == 'minimalistic'" x-if="timespan.events">
                <div class="event_container d-inline-flex flex-column">
                    <template x-for="calendar_event in timespan.events">
                        <div class="mx-2 my-0 px-1 py-0 text-left event" :class="calendar_event.class" x-text="calendar_event.name" :event_id="calendar_event.index"></div>
                    </template>
                </div>
            </template>
        </div>
    </template>
</div>
