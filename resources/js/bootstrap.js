window._ = require('lodash');

/**
 * We'll load jQuery and the Bootstrap jQuery plugin which provides support
 * for JavaScript based Bootstrap features such as modals and tabs. This
 * code may be modified to fit the specific needs of your application.
 */

import $ from 'jquery';
window.$ = $;

import 'jquery-ui';

import Popper from 'popper.js';
window.Popper = Popper;

import 'chart.js';
import 'trumbowyg';
import 'notifyjs';

/**
 * Protip is a tooltip solution that works well with jQuery, but takes a modern
 * approach to the way you actually create tooltips. In this case that means
 * using attributes on elements in HTML, not direct javascript controls.
 */
// require('protip');


import 'bootstrap';

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


import Alpine from 'alpinejs'
import CalendarPresets from './calendar-presets.js';

Alpine.data('CalendarPresets', CalendarPresets)

Alpine.start()
