import { rebuild_calendar } from "./calendar_manager.js";
import { climate_charts } from "./calendar_weather_layout.js";

export default () => ({
    view_type: "owner",
    open: false,

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
        if (type === this.view_type) return;
        this.view_type = type;

        switch (type) {
            case "owner":
                return this.switch_to_owner();
            case "guest":
                return this.switch_to_guest();
            case "climate":
                return this.switch_to_climate();
        }
    },
})
