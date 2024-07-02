/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

// Calendar specific modules
import IntervalsCollection from "./fantasycalendar/Collections/IntervalsCollection.js";
window.IntervalsCollection = IntervalsCollection;

import Sortable from 'sortablejs';
window.Sortable = Sortable;
