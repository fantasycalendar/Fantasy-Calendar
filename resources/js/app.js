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

 import { debounce, date_manager, valid_preview_date, convert_year } from './calendar/calendar_functions.js';
window.debounce = debounce;
window.date_manager = date_manager;
window.valid_preview_date = valid_preview_date;
window.convert_year = convert_year;

import { set_up_view_inputs } from './calendar/calendar_inputs_view.js';
window.set_up_view_inputs = set_up_view_inputs;

import {
    set_up_visitor_values,
    refresh_preview_inputs,
    go_to_preview_date,
    display_preview_back_button,
    update_current_day,
    evaluate_settings,
    repopulate_timespan_select,
    repopulate_day_select,
} from './calendar/calendar_inputs_visitor.js';
window.set_up_visitor_values = set_up_visitor_values;
window.refresh_preview_inputs = refresh_preview_inputs;
window.go_to_preview_date = go_to_preview_date;
window.display_preview_back_button = display_preview_back_button;
window.update_current_day = update_current_day;
window.evaluate_settings = evaluate_settings;
window.repopulate_timespan_select = repopulate_timespan_select;
window.repopulate_day_select = repopulate_day_select;

import { set_up_view_values } from './calendar/calendar_inputs_view.js';
window.set_up_view_values = set_up_view_values;
