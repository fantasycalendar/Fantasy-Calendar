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
                        }"
                        @contextmenu.prevent="$dispatch('context-menu', {
                            element: $el,
                            items: [
                                {
                                    name: 'Set as Current Date',
                                    icon: 'fas fa-hourglass-half',
                                    callback: function() {
                                        var epoch_data = evaluated_static_data.epoch_data[day.epoch];

                                        window.dynamic_date_manager.year = convert_year(window.static_data, epoch_data.year);
                                        window.dynamic_date_manager.timespan = epoch_data.timespan_number;
                                        window.dynamic_date_manager.day = epoch_data.day;
                                        window.dynamic_date_manager.epoch = epoch_data.epoch;

                                        window.evaluate_dynamic_change();
                                    },
                                    disabled: function() {
                                        return day.epoch == window.dynamic_data.epoch || !Perms.player_at_least('co-owner');
                                    },
                                    visible: function() {
                                        return Perms.player_at_least('co-owner');
                                    }
                                },
                                {
                                    name: 'Set as Preview Date',
                                    icon: 'fas fa-hourglass',
                                    callback: function() {
                                        var epoch_data = evaluated_static_data.epoch_data[day.epoch];

                                        window.set_preview_date(epoch_data.year, epoch_data.timespan_number, epoch_data.day, epoch_data.epoch);
                                    },
                                    disabled: function() {
                                        return day.epoch == preview_date.epoch || !window.static_data.settings.allow_view && !Perms.player_at_least('co-owner');
                                    },
                                    visible: function() {
                                        return window.static_data.settings.allow_view || Perms.player_at_least('co-owner');
                                    }
                                },
                                {
                                    name: 'Add new event',
                                    icon: 'fas fa-calendar-plus',
                                    callback: function() {
                                        $dispatch('event-editor-modal-new-event', { name: '', epoch: day.epoch });
                                    },
                                    disabled: function() {
                                        return !Perms.player_at_least('player');
                                    },
                                    visible: function() {
                                        return Perms.player_at_least('player');
                                    }
                                },
                                {
                                    name: 'Copy link to date',
                                    icon: 'fas fa-link',
                                    callback: function() {
                                        var epoch_data = window.evaluated_static_data.epoch_data[day.epoch];

                                        if (!valid_preview_date(epoch_data.year, epoch_data.timespan_number, epoch_data.day) && !window.hide_copy_warning) {
                                            swal.fire({
                                                title: 'Date inaccessible',
                                                html: `<p>This date is not visible to guests or players, settings such as 'Allow advancing view in calendar' and 'Show only up to current day' can affect this.</p><p>Are you sure you want to copy a link to it?</p>`,
                                                input: 'checkbox',
                                                inputPlaceholder: 'Remember this choice',
                                                inputClass: 'form-control',
                                                showCancelButton: true,
                                                confirmButtonColor: '#3085d6',
                                                cancelButtonColor: '#d33',
                                                confirmButtonText: 'Yes',
                                                icon: 'info'
                                            })
                                                .then((result) => {
                                                    if (!result.dismiss) {
                                                        window.copy_link(epoch_data);
                                                        if (result.value) {
                                                            window.hide_copy_warning = true;
                                                        }
                                                    }
                                                });
                                        } else {
                                            window.copy_link(epoch_data);
                                        }
                                    },
                                    disabled: function() {
                                        return !window.static_data.settings.allow_view && !Perms.player_at_least('co-owner');
                                    },
                                    visible: function() {
                                        return window.static_data.settings.allow_view || Perms.player_at_least('co-owner');
                                    }
                                },
                                {
                                    name: 'View events on this date',
                                    icon: 'fas fa-eye',
                                    callback: function() {
                                        let found_events = CalendarRenderer.render_data.event_epochs[day.epoch].events;

                                        $dispatch('event-viewer-modal-view-event', {
                                            event_id: found_events[0].index,
                                            era: found_events[0].era,
                                            epoch: day.epoch
                                        });
                                    }
                                }
                            ]
                        })"
                        :epoch="day.epoch"
                        >
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
                                            :title="calendar_event.name"
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
