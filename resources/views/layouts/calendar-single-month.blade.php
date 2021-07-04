<div id='calendar' x-data="CalendarRenderer">

    <template x-if="!loaded && render_data.timespans.length">
        <div class="modal_background mt-5 pt-5">
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

        <div class="timespan_outer_container">

            <div class="timespan_container" :class='render_data.render_style'>

                <div class='timespan_name' x-text='timespan.title'></div>

                <div class="timespan_row_names">
                    <template x-for="weekday in timespan.short_weekdays">
                        <div class="week_day_name" x-text="weekday"></div>
                    </template>
                </div>

                <template x-for="week in timespan.days">
                    <div class="timespan_row">
                        <template x-for="day in week">
                            <div :class="{
                                'single_page_day': true,
                                'timespan_day': day.type == 'day',
                                'timespan_overflow': day.type == 'overflow',
                                'timespan_day empty_timespan_day': day.type == 'empty',
                                'current_day': day.epoch == render_data.current_epoch,
                                'preview_day': day.epoch == render_data.preview_epoch && render_data.preview_epoch != render_data.current_epoch
                            }"
                            :epoch="day.epoch"
                            >
                                <div class="number" x-text="day.number"></div>
                            </div>
                        </template>
                    </div>
                </template>
            </div>

        </div>

    </template>
</div>
