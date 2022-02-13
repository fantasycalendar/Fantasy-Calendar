<div id='calendar' class="minimalistic" x-data="CalendarRenderer" :class="{ 'single_month': render_data.current_month_only }" x-ref="calendar_renderer" x-init="$nextTick(() => $dispatch('layout-change', {apply: render_data.current_month_only ? 'single_month' : ''}))">

    <template x-if="!loaded && render_data.timespans.length">
        <div class="modal_background w-100">
            <div id="modal" class="creation mt-5 py-5 d-flex flex-column align-items-center justify-content-center">
                <h3 class="text-center" x-text="loading_message"></h3>
                <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
            </div>
        </div>
    </template>

    <template
        @render-data-change.window="
            pre_render();
            load_calendar($event);
            $nextTick(() => { post_render($dispatch) });
        "
        @update-epochs.window="update_epochs"
        x-if='loaded'
        x-for="timespan in render_data.timespans"
    >

        <div class="timespan_outer_container">

            <div class="timespan_container" :class='render_data.render_style'>

                <div class='timespan_name' x-text='timespan.title' x-show="timespan.show_title"></div>

                <div class="timespan_row_names" x-show="timespan.show_weekdays">
                    <template x-for="weekday in timespan.short_weekdays">
                        <div class="week_day_name" x-text="weekday"></div>
                    </template>
                </div>

                <template x-for="week in timespan.days">
                    <div class="timespan_row">
                        <template x-for="day in week">
                            <div :class="{
                                'timespan_day': day.type == 'day',
                                'timespan_overflow': day.type == 'overflow',
                                'timespan_day empty_timespan_day': day.type == 'empty',
                                'current_day': day.epoch == render_data.current_epoch,
                                'preview_day': day.epoch == render_data.preview_epoch && render_data.preview_epoch != render_data.current_epoch,
                                'moon_popup': day.moons.length > 0,
                                'day_title_popup': day.text != '',
                                'has_weather_popup': day.weather_icon != '',
                                'has_event': day.events.length > 0
                            }"
                            :epoch="day.epoch"
                            @click="weather_click(day, $event)"
                            @mouseenter="weather_mouse_enter(day, $event)"
                            @mouseleave="weather_mouse_leave"
                            >
                                <div class="number" x-text="day.number" style="z-index: 10;"></div>
                                <div class="w-100 h-100" :style="`opacity: 0.2;position: absolute;top: 0;bottom: 0;right: 0;left: 0; background-color: ${day.season_color};`"></div>
                            </div>
                        </template>
                    </div>
                </template>
            </div>

            <div class="event_container d-inline-flex flex-column" x-show="timespan.events.length > 0">
                <template x-for="calendar_event in timespan.events">
                    <div class="mx-2 my-0 px-1 py-0 text-left event"
                        x-text="calendar_event.name"
                        x-show="calendar_event.print"
                        :class="calendar_event.class"
                        :event_id="calendar_event.index"
                        @click="view_event($event)"
                    ></div>
                </template>
            </div>

        </div>

    </template>
</div>
