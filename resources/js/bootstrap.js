import _ from 'lodash';
window._ = _;

import $ from 'jquery';

/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */
import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.withCredentials = true;
/**
 * Next we will register the CSRF Token as a common header with Axios so that
 * all outgoing HTTP requests automatically have it attached. This is just
 * a simple convenience so we don't have to attach every token manually.
 */

let token = document.head.querySelector('meta[name="csrf-token"]');

if (token) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} else {
    console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
}

// let authorization = document.head.querySelector('meta[name="api-token"]');
//
// if (authorization) {
//     window.axios.defaults.headers.common['Authorization'] = 'Bearer ' + authorization.content;
// } else {
//     console.log('No API token.');
// }

/**
 * Sweet Alert provides rich alerts that are much nicer than is provided by
 * most browsers. swalert Prompts nicer both visually and in the exposed
 * API, allowing confirmations and very much more. (sweetalert.js.org)
 */

import swal from 'sweetalert2';
window.swal = swal;

/**
 * Select2 is a jQuery-based replacement for select boxes. It supports searching,
 * remote data sets, and pagination of results.
 */

import 'select2';

/**
 * With ProgressBar.js, it's easy to create responsive and stylish progress
 * bars for the web. Animations perform well even on mobile devices. It provides
 * a few built‑in shapes like Line, Circle and SemiCircle but you can also create
 * custom shaped progress bars with any vector graphic editor.
 */

import ProgressBar from 'progressbar.js';
window.ProgressBar = ProgressBar;

/**
 * mustache.js is an implementation of the mustache template system in JavaScript.
 * Mustache is a logic-less template syntax. It can be used for HTML, config files,
 * source code - anything. It works by expanding tags in a template using values
 * provided in a hash or object.
 */

import Mustache from 'mustache';
window.Mustache = Mustache;

/**
 * Sanitize HTML inputs browser-side using sanitize-html!
 */


import sanitizeHtml from 'sanitize-html';
window.sanitizeHtml = sanitizeHtml;

/**
 * $.contextMenu is a management facility for - you guessed it - context menus.
 * It was designed for an application where there are hundreds of elements that may show a context menu,
 * so intialization speed and memory usage are kept fairly small. It also allows to register context
 * menus without providing actual markup, as $.contextMenu generates DOMElements as needed.
 */

import 'jquery-contextmenu';

/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

// import Echo from 'laravel-echo'

// window.Pusher = require('pusher-js');

// window.Echo = new Echo({
//     broadcaster: 'pusher',
//     key: process.env.MIX_PUSHER_APP_KEY,
//     cluster: process.env.MIX_PUSHER_APP_CLUSTER,
//     encrypted: true
// });

import tailwindColors from 'tailwindcss/colors';
window.tailwindColors = tailwindColors;

/**
 * Convenient and dependency free wrapper for working with arrays and objects.
 */
import collectJS from 'collect.js';

window.Collection = collectJS.Collection;
window.collect = collectJS.collect;

import Perms from './perms.js';
window.Perms = Perms;

import Alpine from 'alpinejs'
import CalendarPresets from './calendar-presets.js';
import CalendarRenderer from './calendar-renderer.js';
import CalendarHTMLEditor from './calendar-html-editor.js';
import CalendarLayouts from './calendar-layouts.js';
import EventsManager from './events-manager.js';
import CalendarEventEditor from './calendar-events-editor.js';
import CalendarEventViewer from './calendar-events-viewer.js';
import CalendarYearHeader from './calendar-year-header.js';

Alpine.data('CalendarPresets', CalendarPresets);
Alpine.data('CalendarRenderer', CalendarRenderer);
Alpine.data('CalendarHTMLEditor', CalendarHTMLEditor);
Alpine.data('CalendarLayouts', CalendarLayouts);
Alpine.data('EventsManager', EventsManager);
Alpine.data('CalendarEventEditor', CalendarEventEditor);
Alpine.data('CalendarEventViewer', CalendarEventViewer);
Alpine.data('CalendarYearHeader', CalendarYearHeader);

Alpine.data('MainApp', () => ({
    init: function() {
        this.$nextTick(() => {
            console.log("here");

            window.onerror = (error, url, line) => {
                this.notify("Error:\n " + error + " \nin file " + url + " \non line " + line);
            }

            // $.protip({
            //     defaults: {
            //         "delay-in": 2000,
            //         position: "bottom",
            //         scheme: "leaf",
            //         classes: "box-shadow accent-bg-color",
            //         animate: "bounceIn",
            //         target: "#protip_container"
            //     }
            // });

            var cookiedomain = window.location.hostname.split(".")[window.location.hostname.split(".").length - 2] + "." + window.location.hostname.split(".")[window.location.hostname.split(".").length - 1];
            document.cookie = "fantasycalendar_remember=; Max-Age=0; path=/; domain=" + cookiedomain;

            if (window.localStorage.getItem("inputs_collapsed") != null) {
                this.$dispatch('toggle_sidebar', {
                    force: window.localStorage.getItem("inputs_collapsed") == "true"
                });
            } else {
                if (deviceType() == "Mobile Phone") {
                    this.$dispatch('toggle_sidebar');
                }
            }

            if (window.navigator.userAgent.includes("LM-G850")) {
                $("#input_container").addClass("sidebar-mobile-half");
            }

            if (window.navigator.userAgent.includes("Surface Duo") && !window.navigator.userAgent.includes("Surface Duo 2")) {
                $("#input_container").addClass("sidebar-surface-duo");
                $("#input_collapse_btn").addClass("sidebar-surface-duo");
            }

            if (window.navigator.userAgent.includes("Surface Duo 2")) {
                $("#input_container").addClass("sidebar-surface-duo-2");
                $("#input_collapse_btn").addClass("sidebar-surface-duo-2");
            }
        })
    },
    notify(content, type = "success") {
        window.dispatchEvent(new CustomEvent("notify", {
            bubbles: true,
            detail: { content, type }
        }));
    }
}));

Alpine.data('moon_tooltip', () => ({
    element: false,
    title: "",
    show: false,

    init: function() {
        this.tooltip_box = $('#moon_tooltip_box');
    },

    set_popper: function() {
        if (this.element) {
            this.popper = new Popper(this.element, this.tooltip_box, {
                placement: 'top',
                modifiers: {
                    preventOverflow: {
                        boundariesElement: $('#calendar')[0],
                    },
                    offset: {
                        enabled: true,
                        offset: '0, 5px'
                    }
                }
            });
        }
    }
}));

Alpine.data('calendar_weather', () => ({

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

            if (registered_click_callbacks['sticky_weather_ui']) {
                return;
            }

            this.sticky_icon = icon;

            this.sticky_icon.addClass('sticky');

            this.stop_hide = true;

            registered_click_callbacks['sticky_weather_ui'] = this.sticky_callback;

        },

        sticky_callback: function(event) {

            if ($(event.target).closest('#weather_tooltip_box').length == 0 && $(event.target).closest('.sticky').length == 0) {

                calendar_weather.tooltip.stop_hide = false;

                calendar_weather.tooltip.hide();

                delete registered_click_callbacks['sticky_weather_ui'];

                calendar_weather.tooltip.sticky_icon.removeClass('sticky');

                if ($(event.target).closest('.has_weather_popup').length != 0) {
                    calendar_weather.tooltip.show($(event.target).closest('.has_weather_popup'));
                    calendar_weather.tooltip.sticky($(event.target).closest('.has_weather_popup'));
                }

            }

        },

        show: function(icon) {

            if (registered_click_callbacks['sticky_weather_ui']) {
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
                let epoch_data = calendar_weather.epoch_data[epoch];
                if (epoch_data.leap_day !== undefined) {
                    let index = epoch_data.leap_day;
                    leap_day = static_data.year_data.leap_days[index];
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

            if (calendar_weather.processed_weather && !icon.hasClass('noweather')) {

                this.weather_title.toggleClass('hidden', !icon.hasClass('moon_popup'));
                this.weather_temp_desc.parent().toggleClass('hidden', false);
                this.weather_temp.parent().toggleClass('hidden', false);
                this.weather_wind.parent().toggleClass('hidden', false);
                this.weather_precip.parent().toggleClass('hidden', false);
                this.weather_clouds.parent().toggleClass('hidden', false);
                this.weather_feature.parent().toggleClass('hidden', false);

                if (static_data.seasons.global_settings.cinematic) {
                    this.weather_temp_desc.parent().css('display', '');
                } else {
                    this.weather_temp_desc.parent().css('display', 'none');
                }

                var weather = calendar_weather.epoch_data[epoch].weather;

                var desc = weather.temperature.cinematic;

                var temp_sys = static_data.seasons.global_settings.temp_sys;

                var temp = "";
                if (!static_data.settings.hide_weather_temp || Perms.player_at_least('co-owner')) {
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
                this.weather_temp.toggleClass('newline', (temp_sys == 'both_i' || temp_sys == 'both_m') && (!static_data.settings.hide_weather_temp || Perms.player_at_least('co-owner')));


                var wind_sys = static_data.seasons.global_settings.wind_sys;

                var wind_text = ""
                if (wind_sys == 'both') {
                    wind_text = `${weather.wind_speed} (${weather.wind_direction})`;
                    if (!static_data.settings.hide_wind_velocity || Perms.player_at_least('co-owner')) {
                        wind_text += `<span class='newline'>(${weather.wind_velocity.imperial} MPH | ${weather.wind_velocity.metric} KPH | ${weather.wind_velocity.knots} KN)</span>`;
                    }
                } else {
                    var wind_symbol = wind_sys == "imperial" ? "MPH" : "KPH";
                    wind_text = `${weather.wind_speed} (${weather.wind_direction})`
                    if (!static_data.settings.hide_wind_velocity || Perms.player_at_least('co-owner')) {
                        wind_text += `<span class='newline'>(${weather.wind_velocity[wind_sys]} ${wind_symbol} | ${weather.wind_velocity.knots} KN)</span>`;
                    }
                }

                this.weather_temp_desc.each(function() {
                    $(this).text(desc);
                });

                this.weather_temp.each(function() {
                    $(this).html(temp);
                }).parent().toggleClass('hidden', static_data.settings.hide_weather_temp !== undefined && static_data.settings.hide_weather_temp && !Perms.player_at_least('co-owner'));

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

            if ((calendar_weather.processed_weather && !icon.hasClass('noweather')) || icon.hasClass('moon_popup')) {

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

}));

Alpine.start();
