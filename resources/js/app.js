/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

import './bootstrap';

import CalendarClock from './clock';
window.CalendarClock = CalendarClock;

import RandomCalendar from './random-calendar';
window.RandomCalendar = RandomCalendar;

import CalendarPresets from './calendar-presets';
window.CalendarPresets = CalendarPresets;

import Perms from './perms';
window.Perms = Perms;

import RenderDataGenerator from './render-data-generator';
window.RenderDataGenerator = RenderDataGenerator;

import CalendarRenderer from './calendar-renderer';
window.CalendarRenderer = CalendarRenderer;

import CalendarLayouts from './calendar-layouts';
window.CalendarLayouts = CalendarLayouts;

import EventsManager from './events-manager';
window.EventsManager = EventsManager;

import CalendarEventEditor from './calendar-events-editor';
window.CalendarEventEditor = CalendarEventEditor;

import CalendarEventViewer from './calendar-events-viewer';
window.CalendarEventViewer = CalendarEventViewer;

import CalendarHTMLEditor from './calendar-html-editor';
window.CalendarHTMLEditor = CalendarHTMLEditor;

import CalendarYearHeader from './calendar-year-header';
window.CalendarYearHeader = CalendarYearHeader;

import './calendar/calendar_functions.js';
import './calendar/calendar_inputs_view.js';
import './calendar/calendar_inputs_visitor.js';


// Calendar specific modules
import IntervalsCollection from "./fantasycalendar/Collections/IntervalsCollection.js";
window.IntervalsCollection = IntervalsCollection;

import Sortable from 'sortablejs';
window.Sortable = Sortable;
