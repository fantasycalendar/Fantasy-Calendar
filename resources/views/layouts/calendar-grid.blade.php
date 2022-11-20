<div id='calendar' x-data="CalendarRenderer" :class="{ 'single_month': render_data.current_month_only }" x-ref="calendar_renderer">

    <div class="modal_background w-100" x-show="!loaded && render_data.timespans.length">
        <div id="modal" class="creation mt-5 py-5 d-flex flex-column align-items-center justify-content-center">
            <h3 class="text-center" x-text="loading_message"></h3>
            <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
        </div>
    </div>

    <template
        @render-data-change.window="
            pre_render();
            load_calendar($event);
            $nextTick(() => { post_render($dispatch) });
        "
        @update-epochs.window="update_epochs"
        x-for="(timespan, index) in render_data.timespans"
        :key="timespan.id"
    >
        <div class="timespan_container"
             :class='render_data.render_style'
             x-show='loaded && render_data.timespans.length'
             x-cloak
        >

            <div class='timespan_name' x-text='timespan.title' x-show="timespan.show_title"></div>

            <div class="timespan_row_container">
                <div class="timespan_row_names" x-show="timespan.show_weekdays">
                    <template x-for="weekday in timespan.weekdays">
                        <div class="week_day_name" x-text="weekday"></div>
                    </template>
                </div>

                <template x-for="(week, index) in timespan.days">
                    <div class="timespan_row">
                        <template x-for="day in week">
                            <div :class="{
                            'timespan_day': day.type == 'day',
                            'timespan_overflow': day.type == 'overflow',
                            'timespan_day empty_timespan_day': day.type == 'empty',
                            'current_day': day.epoch == render_data.current_epoch,
                            'season_color_enabled': day.season_color,
                            'preview_day': day.epoch == render_data.preview_epoch && render_data.preview_epoch != render_data.current_epoch,
                        }" :epoch="day.epoch">
                                <div class="day_row text" x-show="day.text" x-text="day.text"></div>
                                <div class="day_row d-flex justify-content-between">
                                    <div class="number" x-text="day.number"></div>

                                    <div class="weather_popup center"
                                         x-show="day.weather_icon"
                                         @click="weather_click(day, $event)"
                                         @mouseenter="weather_mouse_enter(day, $event)"
                                         @mouseleave="weather_mouse_leave"
                                    ><i :class="day.weather_icon"></i></div>

                                    <div class="season_color" x-show="day.season_color" :style="'background-color:'+day.season_color"></div>
                                </div>

                                <div class="day_row flex justify-content-center flex-wrap" x-show="day.moons.length > 0">
                                    <template x-for="moon in day.moons">
                                        <svg class="moon"
                                             :moon_id="moon.index"
                                             preserveAspectRatio="xMidYMid"
                                             width="28"
                                             height="28"
                                             viewBox="0 0 32 32"
                                             @mouseenter="moon_mouse_enter(moon, $event)"
                                             @mouseleave="moon_mouse_leave"
                                        >
                                            <circle cx="16" cy="16" r="10" class="lunar_background" :style="`fill: ${moon.color};`" />
                                            <path class="lunar_shadow" :style="`fill: ${moon.shadow_color};`" x-show="moon.path" :d="moon.path"/>
                                            <circle cx="16" cy="16" r="10" class="lunar_border"/>
                                        </svg>
                                    </template>
                                </div>

                                <div class="day_row event_container" x-show="day.events">
                                    <template x-for="calendar_event in day.events">
                                        <div class="event"
                                            :class="calendar_event.class"
                                            x-text="calendar_event.name"
                                            :event_id="calendar_event.index"
                                            @click="$dispatch('event-viewer-modal-view-event', { event_id: calendar_event.index, era: calendar_event.era, epoch: day.epoch })"
                                        ></div>
                                    </template>
                                </div>

                                <button class="btn_create_event btn btn-success day_row flex-grow" @click="$dispatch('event-editor-modal-new-event', { epoch: day.epoch })" :epoch="day.epoch" x-show="day.show_event_button">Create event</button>

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
