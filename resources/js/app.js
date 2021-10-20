/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

import { IntervalsCollection } from "./calendar/interval.js";

require('./bootstrap');

window.CalendarClock = require('./clock')
window.RandomCalendar = require('./random-calendar')
window.CalendarPresets = require('./calendar-presets')
window.Perms = require('./perms');
window.RenderDataGenerator = require('./render-data-generator')
window.CalendarRenderer = require('./calendar-renderer')
window.CalendarLayouts = require('./calendar-layouts')
window.CalendarEventEditor = require('./calendar-events-editor')
window.CalendarEventViewer = require('./calendar-events-viewer')
window.CalendarHTMLEditor = require('./calendar-html-editor')
window.CalendarYearHeader = require('./calendar-year-header')

// Calendar specific modules
window.IntervalsCollection = IntervalsCollection;

