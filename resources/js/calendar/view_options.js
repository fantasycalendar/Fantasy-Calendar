import { delete_calendar } from "./calendar_ajax_functions.js";
import { rebuild_calendar } from "./calendar_manager.js";
import { climate_charts } from "./calendar_weather_layout.js";

export default () => ({
    chosen_view: "owner",
    open: true,
    view_modes: {
        owner: {
            icon: 'fa-user',
            label: 'Calendar as Owner',
        },
        guest: {
            icon: 'fa-users',
            label: 'Calendar as Guest',
        },
        climate: {
            icon: 'fa-chart-line',
            label: 'Climate graphs',
        },
    },

    get view_mode() {
        return this.view_modes[this.chosen_view];
    },

    view_icon(type) {
        switch (type) {
            case "owner":
                return "fa-eye";
            case "guest":
                return "fa-user";
            case "climate":
                return "fa-chart-line";
        }
    },

    switch_to_owner() {
        this.$store.calendar.perms.owner = true;

        // TODO: make this a call to the calendar?
        if (!window.preview_date.follow) {
            rebuild_calendar('preview', window.preview_date);
        } else {
            rebuild_calendar('calendar', window.dynamic_data);
        }

        // TODO: move this into an event-based approach once climate charts are refactored
        climate_charts.active_view = false;
        this.$dispatch("set-calendar-visible", true);
        this.$dispatch("set-weather-graph-visible", false);
    },

    switch_to_guest() {
        this.$store.calendar.perms.owner = false;

        if (!window.preview_date.follow) {
            rebuild_calendar('preview', window.preview_date);
        } else {
            rebuild_calendar('calendar', window.dynamic_data);
        }

        climate_charts.active_view = false;
        this.$dispatch("set-calendar-visible", true);
        this.$dispatch("set-weather-graph-visible", false);
    },

    switch_to_climate() {
        this.$dispatch("set-calendar-visible", false);
        this.$dispatch("set-weather-graph-visible", true);
        climate_charts.active_view = true;
    },

    switch_view(type) {
        if (type === this.chosen_view) return;
        this.chosen_view = type;

        switch (type) {
            case "owner":
                return this.switch_to_owner();
            case "guest":
                return this.switch_to_guest();
            case "climate":
                return this.switch_to_climate();
        }
    },

    call_delete_calendar() {
        delete_calendar(
            this.$store.calendar.hash,
            this.$store.calendar.name,
            function() { self.location = '/calendars' },
        );
    },

    print() {
        print();
    }
})
