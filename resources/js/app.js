/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

import.meta.glob([
    '../images/**',
])

import _ from 'lodash';
window._ = _;

import Chart from 'chart.js/auto';
window.Chart = Chart;

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
 * Escape HTML entities to prevent XSS when inserting user content via innerHTML.
 * This replaces the sanitize-html package, which caused Vite console noise
 * due to Node module externalization.
 */
function escapeHtml(value) {
    if (typeof value !== 'string') return value;
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
window.sanitizeHtml = escapeHtml;

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

import { linked_popup } from './calendar/calendar_functions.js';
window.linked_popup = linked_popup;

import Alpine from 'alpinejs'
window.Alpine = Alpine;
import sort from '@alpinejs/sort';
import persist from '@alpinejs/persist';
Alpine.plugin(sort);
Alpine.plugin(persist);

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

import CreateButton from './calendar/create_button.js';
Alpine.data('CreateButton', CreateButton)

import WeatherGraphs from './calendar/calendar_weather_graphs.js';
Alpine.data('WeatherGraphs', WeatherGraphs);

import LoadingBackground from './loading-background.js';
Alpine.data('LoadingBackground', LoadingBackground);

import Viewport from './viewport.js';
Alpine.data('Viewport', Viewport);

import CalendarEditPage from "./calendar/calendar_edit_page.js";
Alpine.data('calendar_edit_page', CalendarEditPage);

import CalendarViewPage from "./calendar/calendar_view_page.js";
Alpine.data('calendar_view_page', CalendarViewPage);

import CalendarCreatePage from "./calendar/calendar_create_page.js";
Alpine.data('calendar_create_page', CalendarCreatePage);

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

import EventConditionsComponent from './calendar/event_conditions_component.js';
Alpine.data('event_conditions_component', EventConditionsComponent);


Alpine.data('moon_custom_cycle_input', () => {
    return {
        custom_cycle: "",
        _custom_cycle: "",

        init() {
            this.$watch('custom_cycle', (value) => {
              this._custom_cycle = value;
            })
            let debouncedValueChanged = _.debounce((value) => {
                this.custom_cycle = value;
            }, 500);
            this.$watch('_custom_cycle', (value) => {
                if(value !== this.custom_cycle) {
                    value = value.replace(this.validCustomCycleRegex, '').replace(/,{2,}/g, ",");
                    debouncedValueChanged(value)
                }
            })
        },

        validCustomCycleRegex: /[`!+~@#$%^&*()_|\-=?;:'".<>{}\[\]\\\/A-Za-z ]/g,

        shiftCustomCycle(direction){
            let cycle = this._custom_cycle.split(",");

            if (direction > 0) {
                cycle = [...cycle.slice(cycle.length - 1), ...cycle.slice(0, cycle.length - 1)];
            } else {
                cycle = [...cycle.slice(1, cycle.length), ...cycle.slice(0, 1)];
            }

            this._custom_cycle = cycle.join(",");
        }
    }
});



Alpine.start();

