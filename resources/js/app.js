/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

import calendar_events_editor from "./calendar-events-editor.js";

require('./bootstrap');

window.CalendarClock = require('./clock')
window.RandomCalendar = require('./random-calendar')
window.CalendarPresets = require('./calendar-presets')
window.Perms = require('./perms');
window.RenderDataGenerator = require('./render-data-generator')
window.CalendarRenderer = require('./calendar-renderer')
window.CalendarLayouts = require('./calendar-layouts')
window.CalendarEventEditor = calendar_events_editor;
window.CalendarEventViewer = require('./calendar-events-viewer')
window.CalendarHTMLEditor = require('./calendar-html-editor')
window.CalendarYearHeader = require('./calendar-year-header')

window.fc = {
    utils: require('./calendar/calendar_functions.js'),
    workers: require('./calendar/calendar_workers.js'),
    seasons: require('./calendar/calendar_season_generator.js'),
    variables: require('./calendar/calendar_variables.js')
}

// Calendar specific modules
import IntervalsCollection from "./fantasycalendar/Collections/IntervalsCollection.js";
window.IntervalsCollection = IntervalsCollection;
