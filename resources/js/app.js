/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

import './bootstrap';

// Calendar specific modules
import IntervalsCollection from "./fantasycalendar/Collections/IntervalsCollection.js";
window.IntervalsCollection = IntervalsCollection;

import Sortable from 'sortablejs';
window.Sortable = Sortable;

import { header_initialize } from './calendar/header.js';
window.header_initialize = header_initialize;

import { update_dynamic, update_view_dynamic, get_all_data, get_dynamic_data, check_last_change } from './calendar/calendar_ajax_functions.js';
window.update_dynamic = update_dynamic;
window.update_view_dynamic = update_view_dynamic;
window.get_all_data = get_all_data;
window.get_dynamic_data = get_dynamic_data;
window.check_last_change = check_last_change;

 import { debounce } from './calendar/calendar_functions.js';
window.debounce = debounce;

import { set_up_view_inputs } from './calendar/calendar_inputs_view.js';
window.set_up_view_inputs = set_up_view_inputs;
