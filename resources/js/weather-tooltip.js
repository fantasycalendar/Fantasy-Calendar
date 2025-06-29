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



// TODO: reimplement this
/*
window._calendar_weather = {
    epoch_data: {},

    start_epoch: null,
    end_epoch: null,

    processed_weather: true,

    tooltip: {
        set_up: function() {
            this.weather_tooltip_box = $('#weather_tooltip_box');
            this.base_height = parseInt(this.weather_tooltip_box.css('height'));
            this.weather_title = $('.weather_title');
            this.day_title = $('.day_title');
            this.day_container = $('.day_container');
            this.moon_title = $('.moon_title');
            this.moon_container = $('.moon_container');
            this.weather_temp_desc = $('.weather_temp_desc');
            this.weather_temp = $('.weather_temp');
            this.weather_wind = $('.weather_wind');
            this.weather_precip = $('.weather_precip');
            this.weather_clouds = $('.weather_clouds');
            this.weather_feature = $('.weather_feature');
            this.stop_hide = false;
            this.sticky_icon = false;
        },

        sticky: function(icon) {

            if (window.registered_click_callbacks['sticky_weather_ui']) {
                return;
            }

            this.sticky_icon = icon;

            this.sticky_icon.addClass('sticky');

            this.stop_hide = true;

            window.registered_click_callbacks['sticky_weather_ui'] = this.sticky_callback;

        },

        sticky_callback: function(event) {

            if ($(event.target).closest('#weather_tooltip_box').length == 0 && $(event.target).closest('.sticky').length == 0) {

                window.calendar_weather.tooltip.stop_hide = false;

                window.calendar_weather.tooltip.hide();

                delete window.registered_click_callbacks['sticky_weather_ui'];

                window.calendar_weather.tooltip.sticky_icon.removeClass('sticky');

                if ($(event.target).closest('.has_weather_popup').length != 0) {
                    window.calendar_weather.tooltip.show($(event.target).closest('.has_weather_popup'));
                    window.calendar_weather.tooltip.sticky($(event.target).closest('.has_weather_popup'));
                }

            }

        },

        show: function(icon) {

            if (window.registered_click_callbacks['sticky_weather_ui']) {
                return;
            }

            var day_container = icon.closest(".timespan_day");

            var epoch = day_container.attr('epoch');

            if (epoch === undefined) {
                return;
            }

            this.moon_title.toggleClass('hidden', !icon.hasClass('moon_popup'));
            this.moon_container.toggleClass('hidden', !icon.hasClass('moon_popup'));

            this.day_title.toggleClass('hidden', !icon.hasClass('day_title_popup'));
            this.day_container.toggleClass('hidden', !icon.hasClass('day_title_popup'));

            if (icon.hasClass('day_title_popup')) {
                let epoch_data = window.calendar_weather.epoch_data[epoch];
                if (epoch_data.leap_day !== undefined) {
                    let index = epoch_data.leap_day;
                    let leap_day = $event.detail.static_data.year_data.leap_days[index];
                    if (leap_day.show_text) {
                        this.day_container.text(leap_day.name);
                    }
                }
            }

            if (icon.hasClass('moon_popup')) {
                this.moon_container.html(this.insert_moons(epoch));
            }

            this.stop_hide = false;
            this.sticky_icon = false;

            if (window.calendar_weather.processed_weather && !icon.hasClass('noweather')) {

                this.weather_title.toggleClass('hidden', !icon.hasClass('moon_popup'));
                this.weather_temp_desc.parent().toggleClass('hidden', false);
                this.weather_temp.parent().toggleClass('hidden', false);
                this.weather_wind.parent().toggleClass('hidden', false);
                this.weather_precip.parent().toggleClass('hidden', false);
                this.weather_clouds.parent().toggleClass('hidden', false);
                this.weather_feature.parent().toggleClass('hidden', false);

                if (window.static_data.seasons.global_settings.cinematic) {
                    this.weather_temp_desc.parent().css('display', '');
                } else {
                    this.weather_temp_desc.parent().css('display', 'none');
                }

                var weather = window.calendar_weather.epoch_data[epoch].weather;

                var desc = weather.temperature.cinematic;

                var temp_sys = window.static_data.seasons.global_settings.temp_sys;

                var temp = "";
                if (!window.static_data.settings.hide_weather_temp || window.Perms.player_at_least('co-owner')) {
                    if (temp_sys == 'imperial') {
                        temp_symbol = '°F';
                        var temp = `${precisionRound(weather.temperature[temp_sys].value[0], 1).toString() + temp_symbol} to ${precisionRound(weather.temperature[temp_sys].value[1], 1).toString() + temp_symbol}`;
                    } else if (temp_sys == 'metric') {
                        temp_symbol = '°C';
                        var temp = `${precisionRound(weather.temperature[temp_sys].value[0], 1).toString() + temp_symbol} to ${precisionRound(weather.temperature[temp_sys].value[1], 1).toString() + temp_symbol}`;
                    } else {
                        var temp_f = `<span class='newline'>${precisionRound(weather.temperature['imperial'].value[0], 1).toString()}°F to ${precisionRound(weather.temperature['imperial'].value[1], 1).toString()}°F</span>`;
                        var temp_c = `<span class='newline'>${precisionRound(weather.temperature['metric'].value[0], 1).toString()}°C to ${precisionRound(weather.temperature['metric'].value[1], 1).toString()}°C</span>`;
                        var temp = `${temp_f}${temp_c}`;
                    }
                }
                this.weather_temp.toggleClass('newline', (temp_sys == 'both_i' || temp_sys == 'both_m') && (!window.static_data.settings.hide_weather_temp || window.Perms.player_at_least('co-owner')));


                var wind_sys = window.static_data.seasons.global_settings.wind_sys;

                var wind_text = ""
                if (wind_sys == 'both') {
                    wind_text = `${weather.wind_speed} (${weather.wind_direction})`;
                    if (!window.static_data.settings.hide_wind_velocity || window.Perms.player_at_least('co-owner')) {
                        wind_text += `<span class='newline'>(${weather.wind_velocity.imperial} MPH | ${weather.wind_velocity.metric} KPH | ${weather.wind_velocity.knots} KN)</span>`;
                    }
                } else {
                    var wind_symbol = wind_sys == "imperial" ? "MPH" : "KPH";
                    wind_text = `${weather.wind_speed} (${weather.wind_direction})`
                    if (!window.static_data.settings.hide_wind_velocity || window.Perms.player_at_least('co-owner')) {
                        wind_text += `<span class='newline'>(${weather.wind_velocity[wind_sys]} ${wind_symbol} | ${weather.wind_velocity.knots} KN)</span>`;
                    }
                }

                this.weather_temp_desc.each(function() {
                    $(this).text(desc);
                });

                this.weather_temp.each(function() {
                    $(this).html(temp);
                }).parent().toggleClass('hidden', window.static_data.settings.hide_weather_temp !== undefined && static_data.settings.hide_weather_temp && !window.Perms.player_at_least('co-owner'));

                this.weather_wind.each(function() {
                    $(this).html(wind_text);
                });

                this.weather_precip.each(function() {
                    $(this).text(weather.precipitation.key);
                });

                this.weather_clouds.each(function() {
                    $(this).text(weather.clouds);
                });

                this.weather_feature.each(function() {
                    $(this).text(weather.feature);
                });

                this.weather_feature.parent().toggleClass('hidden', weather.feature == "" || weather.feature == "None");

            } else {

                this.weather_title.toggleClass('hidden', true);
                this.weather_temp_desc.parent().toggleClass('hidden', true);
                this.weather_temp.parent().toggleClass('hidden', true);
                this.weather_wind.parent().toggleClass('hidden', true);
                this.weather_precip.parent().toggleClass('hidden', true);
                this.weather_clouds.parent().toggleClass('hidden', true);
                this.weather_feature.parent().toggleClass('hidden', true);
            }

            if ((window.calendar_weather.processed_weather && !icon.hasClass('noweather')) || icon.hasClass('moon_popup')) {

                this.popper = new Popper(icon, this.weather_tooltip_box, {
                    placement: 'top',
                    modifiers: {
                        preventOverflow: {
                            boundariesElement: $('#calendar')[0],
                        },
                        offset: {
                            enabled: true,
                            offset: '0, 14px'
                        }
                    }
                });

                this.weather_tooltip_box.show();

            }
        },

        insert_moons: function(epoch) {

            let render_data = CalendarRenderer.render_data.event_epochs[epoch];

            var moon_text = [];

            for (let index = 0; index < render_data.moons.length; index++) {

                var moon = render_data.moons[index];

                moon_text.push(`<svg class='moon protip' moon="${moon.index}" preserveAspectRatio="xMidYMid" width="32" height="32" viewBox="0 0 32 32" data-pt-position="top" data-pt-title='${moon.name}, ${moon.phase}'>`);
                moon_text.push(`<circle cx="16" cy="16" r="10" style="fill: ${moon.color};"/>`);
                if (moon.path) moon_text.push(`<path style="fill: ${moon.shadow_color};" d="${moon.path}"/>`);
                moon_text.push(`<circle cx="16" cy="16" r="10" class="lunar_border"/>`);
                moon_text.push("</svg>");

            }

            return moon_text.join('');

        },

        hide: function() {

            document.removeEventListener('click', function() { });

            if (!this.stop_hide) {
                this.weather_tooltip_box.hide();
                this.weather_tooltip_box.css({ "top": "", "left": "" });
                this.weather_tooltip_box.removeClass();
            }
        }
    }
};*/
