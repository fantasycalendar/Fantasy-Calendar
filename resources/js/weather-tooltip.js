import { precisionRound } from "./calendar/calendar_functions.js";
import {
    computePosition,
    flip,
    shift,
} from "@floating-ui/dom";

export default () => ({
    element: false,
    show: false,
    x: 0,
    y: 0,
    opacity: 0,

    epoch_details: {},
    day: {},

    temperature_ranges: [],
    wind_direction: "",
    wind_speeds: [],
    has_weather: false,
    show_moons: false,

    activate: function($event) {

        this.day = $event.detail.day;
        this.epoch_details = $event.detail.epoch_details;
        this.has_weather = $event.detail.has_weather;
        this.show_moons = $event.detail.show_moons;

        let temperature_system = $event.detail.static_data.seasons.global_settings.temp_sys;

        this.temperature_ranges = [];
        if (!$event.detail.static_data.settings.hide_weather_temp || window.Perms.player_at_least('co-owner')) {
            if (temperature_system !== 'metric') {
                let temperatures = this.epoch_details.weather.temperature['imperial'].value;
                this.temperature_ranges.push(`${precisionRound(temperatures[0], 1).toString()}°F to ${precisionRound(temperatures[1], 1).toString()}°F`);
            }
            if (temperature_system !== 'imperial') {
                let temperatures = this.epoch_details.weather.temperature['metric'].value;
                this.temperature_ranges.push(`${precisionRound(temperatures[0], 1).toString()}°C to ${precisionRound(temperatures[1], 1).toString()}°C`);
            }
        }

        this.wind_direction = "";
        this.wind_speeds = [];
        if (!$event.detail.static_data.settings.hide_wind_velocity || window.Perms.player_at_least('co-owner')) {
            this.wind_direction = `${this.epoch_details.weather.wind_speed} (${this.epoch_details.weather.wind_direction})`;

            let wind_system = $event.detail.static_data.seasons.global_settings.wind_sys;
            if (wind_system !== 'metric') {
                this.wind_speeds.push(`${this.epoch_details.weather.wind_velocity.imperial} MPH`);
            }
            if (wind_system !== 'imperial') {
                this.wind_speeds.push(`${this.epoch_details.weather.wind_velocity.metric} KPH`);
            }
            this.wind_speeds.push(`${this.epoch_details.weather.wind_velocity.knots} KN`);
        }

        computePosition(
            $event.detail.element,
            this.$refs.weather_tooltip_box,
            {
                placement: 'top',
                middleware: [flip(), shift()],
            }
        ).then(({ x, y }) => {
            this.x = x;
            this.y = y;
            this.opacity = 1;
        });
    },

    deactivate: function() {
        this.show = false;
        this.day = {};
        this.opacity = 0;
    }
});

