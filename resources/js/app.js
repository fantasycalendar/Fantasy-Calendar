/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

import CalendarClock from './clock.js';
window.CalendarClock = CalendarClock;

import RandomCalendar from './random-calendar.js';
window.RandomCalendar = RandomCalendar;

import CalendarPresets from './calendar-presets.js';
window.CalendarPresets = CalendarPresets;

import Perms from './perms.js';
window.Perms = Perms;

import RenderDataGenerator from './render-data-generator.js';
window.RenderDataGenerator = RenderDataGenerator;

import CalendarRenderer from './calendar-renderer.js';
window.CalendarRenderer = CalendarRenderer;

import CalendarLayouts from './calendar-layouts.js';
window.CalendarLayouts = CalendarLayouts;

import EventsManager from './events-manager.js';
window.EventsManager = EventsManager;

import CalendarEventEditor from './calendar-events-editor.js';
window.CalendarEventEditor = CalendarEventEditor;

import CalendarEventViewer from './calendar-events-viewer.js';
window.CalendarEventViewer = CalendarEventViewer;

import CalendarHTMLEditor from './calendar-html-editor.js';
window.CalendarHTMLEditor = CalendarHTMLEditor;

import CalendarYearHeader from './calendar-year-header.js';
window.CalendarYearHeader = CalendarYearHeader;

// Calendar specific modules
import IntervalsCollection from "./fantasycalendar/Collections/IntervalsCollection.js";
window.IntervalsCollection = IntervalsCollection;

import Sortable from 'sortablejs';
window.Sortable = Sortable;
