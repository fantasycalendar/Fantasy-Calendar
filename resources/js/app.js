/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

import _ from 'lodash';
window._ = _;

import $default, { jQuery, $ } from "jquery";
window.$ = $;
window.jQuery = jQuery;

import 'chart.js';

window.$.notify = (name, type) => {
    window.dispatchEvent(new CustomEvent('notify', {
        detail: {
            content: name,
            type,
        }
    }));
}

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

import Sortable from 'sortablejs';
window.Sortable = Sortable

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


// import sanitizeHtml from 'sanitize-html';
// window.sanitizeHtml = sanitizeHtml;

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

// DIRTY, TEMPORARY HACK
// This is *only* here to stop sanitize-html from barfing a bunch of "Module x has been externalized for browser compatibility"
// to the JS console _during the massive refactor we're doing to vite_.
//
// Either put back sanitize-html before merging in this rework or find a better alternative.
window.sanitizeHtml = function(value) {
    return value;
}

/**
 * Convenient and dependency free wrapper for working with arrays and objects.
 */
import collectJS from 'collect.js';

window.Collection = collectJS.Collection;
window.collect = collectJS.collect;

import Perms from './perms.js';
window.Perms = Perms;

import { changes_applied } from './calendar/calendar_inputs_edit.js';
window.changes_applied = changes_applied;

// Calendar specific modules
import IntervalsCollection from "./fantasycalendar/Collections/IntervalsCollection.js";
window.IntervalsCollection = IntervalsCollection;

import { header_initialize, toggle_sidebar } from './calendar/header.js';
window.toggle_sidebar = toggle_sidebar;
window.header_initialize = header_initialize;

import { update_dynamic, update_view_dynamic, get_all_data, get_dynamic_data, check_last_change, submit_hide_show_event } from './calendar/calendar_ajax_functions.js';
window.update_dynamic = update_dynamic;
window.update_view_dynamic = update_view_dynamic;
window.get_all_data = get_all_data;
window.get_dynamic_data = get_dynamic_data;
window.check_last_change = check_last_change;
window.submit_hide_show_event = submit_hide_show_event;

import {
    debounce,
    date_manager,
    valid_preview_date,
    convert_year,
    linked_popup
} from './calendar/calendar_functions.js';
window.debounce = debounce;
window.date_manager = date_manager;
window.valid_preview_date = valid_preview_date;
window.convert_year = convert_year;

import {
    repopulate_timespan_select,
    repopulate_day_select,
    copy_link,
} from './calendar/calendar_inputs_visitor.js';
window.repopulate_timespan_select = repopulate_timespan_select;
window.repopulate_day_select = repopulate_day_select;
window.copy_link = copy_link;

import {
    set_up_edit_inputs,
    query_autoload,
    autoload,
} from './calendar/calendar_inputs_edit.js';
window.set_up_edit_inputs = set_up_edit_inputs;
window.query_autoload = query_autoload;
window.autoload = autoload;
window.linked_popup = linked_popup;

import { bind_calendar_events } from './calendar/calendar_manager.js';
window.bind_calendar_events = bind_calendar_events;

import { calendar_data_generator } from './calendar/calendar_workers.js';
window.calendar_data_generator = calendar_data_generator;

import { render_data_generator } from './render-data-generator.js';
window.render_data_generator = render_data_generator;

$(() => header_initialize());

import Alpine from 'alpinejs'
import sort from '@alpinejs/sort';
Alpine.plugin(sort);

import Calendar from "./calendar.js";
Alpine.store("calendar", new Calendar());

import CalendarPresets from './calendar-presets.js';
import CalendarRenderer from './calendar-renderer.js';
import CalendarHTMLEditor from './calendar-html-editor.js';
import CalendarLayouts from './calendar-layouts.js';
import EventsManager from './events-manager.js';
import CalendarEventEditor from './calendar-events-editor.js';
import CalendarEventViewer from './calendar-events-viewer.js';
import CalendarYearHeader from './calendar-year-header.js';
import CalendarGridDay from './calendar-grid-day.js';

Alpine.data('CalendarPresets', CalendarPresets);
Alpine.data('CalendarRenderer', CalendarRenderer);
Alpine.data('CalendarHTMLEditor', CalendarHTMLEditor);
Alpine.data('CalendarLayouts', CalendarLayouts);
Alpine.data('EventsManager', EventsManager);
Alpine.data('CalendarEventEditor', CalendarEventEditor);
Alpine.data('CalendarEventViewer', CalendarEventViewer);
Alpine.data('CalendarGridDay', CalendarGridDay);
Alpine.data('CalendarYearHeader', CalendarYearHeader);

import ViewOptions from "./calendar/view_options.js"
Alpine.data('ViewOptions', ViewOptions);

import SaveButton from './calendar/save_button.js';
Alpine.data('SaveButton', SaveButton)

import WeatherGraphs from './calendar/calendar_weather_graphs.js';
Alpine.data('WeatherGraphs', WeatherGraphs);

Alpine.data('MainApp', () => ({
    init: function() {
        this.$nextTick(() => {
            window.onerror = (error, url, line) => {
                this.notify("Error:\n " + error + " \nin file " + url + " \non line " + line);
            }

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

import CalendarEditPage from "./calendar/calendar_edit_page.js";
Alpine.data('calendar_edit_page', CalendarEditPage);

import ContextMenu from './context-menu.js';
Alpine.data('context_menu', ContextMenu);

import RichEditor from './rich-editor.js';
Alpine.data('rich_editor', RichEditor);

import MoonTooltip from './moon-tooltip.js';
Alpine.data('moon_tooltip', MoonTooltip);

import WeatherTooltip from './weather-tooltip.js';
Alpine.data("weather_tooltip", WeatherTooltip);

import StatisticsCollapsible from './calendar/statistics_collapsible.js';
Alpine.data('statistics_collapsible', StatisticsCollapsible);

import CurrentDateCollapsible from './calendar/current_date_collapsible.js';
Alpine.data('current_date_collapsible', CurrentDateCollapsible);

import ClockCanvas from "./clock-canvas.js";
Alpine.data("clock_canvas", ClockCanvas);

import ClockCollapsible from './calendar/clock_collapsible.js';
Alpine.data('clock_collapsible', ClockCollapsible);

import RealTimeAdvancementCollapsible from './calendar/real_time_advancement_collapsible.js';
Alpine.data('real_time_advancement_collapsible', RealTimeAdvancementCollapsible);

import WeekdaysCollapsible from './calendar/weekdays_collapsible.js';
Alpine.data('weekdays_collapsible', WeekdaysCollapsible);

import MonthsCollapsible from './calendar/months_collapsible.js';
Alpine.data('months_collapsible', MonthsCollapsible);

import LeapDaysCollapsible from './calendar/leap_days_collapsible.js';
Alpine.data('leap_days_collapsible', LeapDaysCollapsible);

import ErasCollapsible from './calendar/eras_collapsible.js';
Alpine.data('eras_collapsible', ErasCollapsible);

import MoonsCollapsible from './calendar/moons_collapsible.js';
Alpine.data('moons_collapsible', MoonsCollapsible);

import SeasonsCollapsible from './calendar/seasons_collapsible.js';
Alpine.data('seasons_collapsible', SeasonsCollapsible);

import WeatherCollapsible from './calendar/weather_collapsible.js';
Alpine.data('weather_collapsible', WeatherCollapsible);

import LocationsCollapsible from './calendar/locations_collapsible.js';
Alpine.data('locations_collapsible', LocationsCollapsible);

import CyclesCollapsible from './calendar/cycles_collapsible.js';
Alpine.data('cycles_collapsible', CyclesCollapsible);

import EventCategoriesCollapsible from './calendar/event_categories_collapsible.js';
Alpine.data('event_categories_collapsible', EventCategoriesCollapsible);

import EventsCollapsible from './calendar/events_collapsible.js';
Alpine.data('events_collapsible', EventsCollapsible);

import SettingsCollapsible from './calendar/settings_collapsible.js';
Alpine.data('settings_collapsible', SettingsCollapsible);

import UserManagementCollapsible from './calendar/user_management_collapsible.js';
Alpine.data('user_management_collapsible', UserManagementCollapsible);

import CalendarLinkingCollapsible from './calendar/calendar_linking_collapsible.js';
import Save_button from "./calendar/save_button.js";
Alpine.data('calendar_linking_collapsible', CalendarLinkingCollapsible);

Alpine.start();

