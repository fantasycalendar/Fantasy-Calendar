import { evaluated_static_data } from "./calendar/calendar_manager";
import { show_loading_screen_buffered, hide_loading_screen } from "./calendar/header";
import { execution_time } from "./calendar/calendar_functions";

export default () => ({

    loaded: false,
    loading_message: "Initializing...",
    rerendering: false,

    last_scroll_height: 0,

    render_callbacks: [],
    scroll_attempts: 0,

    prev_current_epoch: 0,
    prev_preview_epoch: 0,

    render_data: {
        year: 0,
        current_epoch: 0,
        preview_epoch: 0,
        render_style: "grid",
        timespans: [],
        event_epochs: [],
        timespan_event_epochs: [],
        only_reveal_today: false,
        hide_moons: false,
        hide_events: false,
        hide_all_weather: false,
        hide_future_weather: false,
        add_month_number: false,
        add_year_day_number: false,
        hide_weekdays: false
    },

    register_render_callback(callback) {
        this.render_callbacks.push(callback)
    },

    load_calendar: function (event) {
        this.loading_message = "Building calendar...";
        this.render_data = event.detail;
    },

    view_event: function (event) {
        show_event_ui.clicked_event($(event.target));
    },

    weather_click: function (day, event) {
        window.calendar_weather.tooltip.sticky($(event.target));
    },

    weather_mouse_enter: function (day, event) {
        window.calendar_weather.tooltip.show($(event.target));
    },

    weather_mouse_leave: function () {
        window.calendar_weather.tooltip.hide();
    },

    moon_mouse_enter: function (moon, event) {
        let title = moon.name + ', ' + moon.phase;
        window.dispatchEvent(new CustomEvent('moon-mouse-enter', {
            detail: {
                element: event.target,
                title: title
            }
        }));
    },

    moon_mouse_leave: function () {
        window.dispatchEvent(new CustomEvent('moon-mouse-leave'));
    },

    update_epochs: function (event) {
        this.loading_message = "Structuring days...";
        this.render_data.current_epoch = event.detail.current_epoch;
        this.render_data.preview_epoch = event.detail.preview_epoch;
        window.calendar_year_header.update(
            window.static_data,
            window.dynamic_data,
            preview_date,
            evaluated_static_data.epoch_data
        );
        this.scroll_to_epoch();
    },

    pre_render: function () {
        show_loading_screen_buffered();
    },

    post_render: function ($dispatch) {
        this.loading_message = "Wrapping up rendering...";

        hide_loading_screen();

        this.rerendering = this.prev_current_epoch !== this.render_data.current_epoch || this.prev_preview_epoch !== this.render_data.preview_epoch;

        if (!this.loaded || this.rerendering) {
            this.scroll_to_epoch();
        }

        window.calendar_year_header.update(
            window.static_data,
            window.dynamic_data,
            preview_date,
            evaluated_static_data.epoch_data
        );

        for (let index in this.render_callbacks) {
            let callback = this.render_callbacks[index];
            if (callback) {
                callback();
            }
        }
        this.render_callbacks = [];
        this.loaded = true;
        this.rerendering = false;
        this.prev_current_epoch = this.render_data.current_epoch;
        this.prev_preview_epoch = this.render_data.preview_epoch;

        $dispatch('layout-change', { apply: this.render_data.current_month_only ? 'single_month' : '' });

        execution_time.end("Calculating and rendering calendar took:")
    },

    scroll_to_epoch: function () {

        const previewEpochElement = $(`[epoch=${this.render_data.preview_epoch}]`);
        const currentEpochElement = $(`[epoch=${this.render_data.current_epoch}]`);

        if (previewEpochElement.length && this.render_data.preview_epoch !== this.render_data.current_epoch) {

            this.scroll_attempts = 0;
            return setTimeout(() => {
                previewEpochElement[0].scrollIntoView({ block: "center", inline: "nearest" });
            }, 350)

        } else if (currentEpochElement.length) {

            this.scroll_attempts = 0;
            return setTimeout(() => {
                currentEpochElement[0].scrollIntoView({ block: "center", inline: "nearest" });
            }, 350)

        }

        this.scroll_attempts++;

        if (this.scroll_attempts < 10) {
            setTimeout(this.scroll_to_epoch.bind(this), 500);
        } else {
            this.scroll_attempts = 0;
        }

    },

    scroll_to_last: function () {
        $("#calendar_container").scrollTop(this.last_scroll_height);
    }

})
