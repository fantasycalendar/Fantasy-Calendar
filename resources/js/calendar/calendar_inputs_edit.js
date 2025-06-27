import {
    delete_calendar,
    create_calendar,
} from "./calendar_ajax_functions";
import {
    convert_year,
    evaluate_calendar_start,
} from "./calendar_functions";
import { climate_charts } from "./calendar_weather_layout";
import { rebuild_calendar } from "./calendar_manager";
import CalendarRenderer from "../calendar-renderer";

export var changes_applied = true;

let log_in_button = null;
let create_button = null;
let calendar_container = null;
let weather_container = null;

export function set_up_edit_inputs() {

    // window.onbeforeunload = function(e) {

    //     var not_changed = static_same && dynamic_same && calendar_name_same && events_same && event_categories_same && advancement_same;

    //     if (!not_changed) {

    //         var confirmationMessage = "It looks like you have unsaved changes, are you sure you want to navigate away from this page?";

    //         (e || window.event).returnValue = confirmationMessage; //Gecko + IE
    //         return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.

    //     }

    // };

    create_button = $('#btn_create');

    create_button.click(function() {

        // Unhook before unload
        window.onbeforeunload = function() { }

        create_calendar();

    });

    log_in_button = $('.login-button');

    log_in_button.click(function() {

        // Unhook before unload
        window.onbeforeunload = function() { }

        window.location = '/login?postlogin=/calendars/create?resume=1';

    });

    create_button.prop('disabled', true);

    $('#btn_delete').click(function() {
        delete_calendar(window.hash, window.calendar_name, function() { self.location = '/calendars' });
    });

    calendar_container = $('#calendar');
    weather_container = $('#weather_container');

    var previous_view_type = 'owner';
    var view_type = 'owner';

    $('.view-tabs .btn').click(function() {

        view_type = $(this).attr('data-view-type');

        $('.view-tabs .btn-primary').removeClass('btn-primary').addClass('btn-secondary');

        $(this).removeClass('btn-secondary').addClass('btn-primary');

        switch (view_type) {
            case "owner":
                Perms.owner = true;
                if (creation.is_done()) {
                    if (previous_view_type !== 'owner') {
                        if (!window.preview_date.follow) {
                            rebuild_calendar('preview', window.preview_date);
                        } else {
                            rebuild_calendar('calendar', window.dynamic_data);
                        }
                    }
                }
                climate_charts.active_view = false;
                calendar_container.removeClass('hidden');
                weather_container.addClass('hidden');
                $("#calendar_container").scrollTop(this.last_scroll_height);
                previous_view_type = view_type;
                break;

            case "player":
                Perms.owner = false;
                if (creation.is_done()) {
                    if (previous_view_type !== 'player') {
                        if (!window.preview_date.follow) {
                            rebuild_calendar('preview', window.preview_date);
                        } else {
                            rebuild_calendar('calendar', window.dynamic_data);
                        }
                    }
                }
                climate_charts.active_view = false;
                calendar_container.removeClass('hidden');
                weather_container.addClass('hidden');
                $("#calendar_container").scrollTop(this.last_scroll_height);
                previous_view_type = view_type;
                break;

            case "weather":
                CalendarRenderer.last_scroll_height = $("#calendar_container").scrollTop();
                if (creation.is_done()) {
                    climate_charts.active_view = true;
                }
                calendar_container.addClass('hidden');
                weather_container.removeClass('hidden');
                break;

        }

    });

    /* ------------------- Layout callbacks ------------------- */

    $(document).on('click', '.location_toggle', function() {
        var checked = $(this).is(':checked');
        $(this).parent().find('.icon').toggleClass('fa-caret-square-up', checked).toggleClass('fa-caret-square-down', !checked);
    });

    /* ------------------- Custom callbacks ------------------- */

    $(document).on('change', '.invalid', function() {
        if ($(this).val() !== null) {
            $(this).removeClass('invalid');
        }
    });

    $('#apply_changes_btn').click(function() {

        if ($('.invalid').length == 0) {

            changes_applied = true;

            if (!window.preview_date.follow) {

                rebuild_calendar('preview', window.preview_date);

            } else {

                rebuild_calendar('calendar', window.dynamic_data);


            }

        }

    });

    $('input[fc-index="allow_view"]').change(function() {
        var checked = $(this).is(':checked');
        var only_backwards = $('input[fc-index="only_backwards"]');
        only_backwards.prop('disabled', !checked);
        only_backwards.closest('.setting').toggleClass('disabled', !checked);
        var only_backwards_checked = only_backwards.is(':checked');
        if (!checked && only_backwards_checked) {
            only_backwards.prop('checked', false).change();
        }
    });

}


export const creation = {

    text: [],
    current_step: 1,
    steps: 3,

    is_done: function() {

        if (this.current_step > this.steps) {
            return true;
        }

        this.text = [];

        if (this.current_step >= 1) {
            if (window.calendar_name == "") {
                this.text.push(`<span><i class="mr-2 fas fa-calendar"></i> Your calendar must have a name</span>.`)
                this.current_step = 1;
            } else {
                this.text.push(`<span style="opacity: 0.4;"><i class="mr-2 fas fa-calendar-check"></i> Your calendar has a name!</span>`);
                this.current_step = 2;
            }
        }

        if (this.current_step >= 2) {
            if (window.static_data.year_data.global_week.length == 0) {
                $("#collapsible_globalweek").prop("checked", true);

                $("#calendar_name").blur();
                setTimeout(function() { $('#weekday_name_input').focus() }, 200);

                this.text.push(`<span><i class="mr-2 fas fa-calendar"></i> You need at least one week day.</span>`);
            } else {
                this.text.push(`<span style="opacity: 0.4;"><i class="mr-2 fas fa-calendar-check"></i> You have at least one week day!</span>`);
                this.current_step = 3;
            }
        }

        if (this.current_step >= 3) {
            if (window.static_data.year_data.timespans.length == 0) {
                $("#collapsible_timespans").prop("checked", true);

                this.text.push(`<span><i class="mr-2 fas fa-calendar"></i> You need at least one month.</span>`);
            } else {
                $("#collapsible_globalweek").prop("checked", false);
                this.text.push(`<span style="opacity: 0.4;"><i class="mr-2 fas fa-calendar-check"></i> You have at least one month!</span>`);
                this.current_step = 4;
            }
        }

        return this.current_step > this.steps;
    }
}


export function get_category(search) {
    if (window.event_categories.length == 0) {
        return { id: -1 };
    }

    if (isNaN(search)) {
        var results = window.event_categories.filter(function(element) {
            return slugify(element.name) == search;
        });
    } else {
        var results = window.event_categories.filter(function(element) {
            return element.id == search;
        });
    }

    if (results.length < 1) {
        return { id: -1 };
    }

    return results[0];
}


function autosave() {
    var saved_data = JSON.stringify({
        calendar_name: window.calendar_name,
        static_data: window.static_data,
        dynamic_data: window.dynamic_data,
        events: window.events,
        event_categories: window.event_categories
    })

    localStorage.setItem('autosave', saved_data);
}

export function query_autoload() {
    if (localStorage.getItem('autosave')) {

        swal.fire({
            title: "Load unsaved calendar?",
            text: "It looks like you started a new calendar and didn't save it. Would you like to continue where you left off?",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Continue',
            cancelButtonText: 'Start Over',
            icon: "info"
        })
            .then((result) => {

                if (!result.dismiss) {

                    autoload(true);

                } else {

                    localStorage.clear();

                }

            });

    }
}

export function autoload(popup) {
    let saved_data = localStorage.getItem('autosave');

    if (saved_data) {

        var data = JSON.parse(saved_data);
        window.prev_calendar_name = "";
        window.prev_dynamic_data = {};
        window.prev_static_data = {};
        window.prev_events = {};
        window.prev_event_categories = {};
        window.calendar_name = data.calendar_name;
        window.static_data = data.static_data;
        window.dynamic_data = data.dynamic_data;
        window.events = data.events;
        window.event_categories = data.event_categories;
        window.dynamic_data.epoch = evaluate_calendar_start(window.static_data, convert_year(window.static_data, window.dynamic_data.year), window.dynamic_data.timespan, window.dynamic_data.day).epoch;

        rebuild_calendar("calendar", window.dynamic_data);

        if (popup) {
            swal.fire({
                icon: "success",
                title: "Loaded!",
                text: "The calendar " + window.calendar_name + " has been loaded."
            });
        }

        window.dispatchEvent(new CustomEvent("events-changed"));
    }
}


export function linked_popup() {
    var html = [];
    html.push("<p>As you've noticed, some options are missing. Nothing is broken! We promise. This calendar just has its date <strong>linked with another.</strong></p>");
    html.push("<p>Things like month lengths, weekdays, leap days, hours, minutes, and eras are structural to a calendar, and changing them while two calendars are linked would be like changing the wheels on a moving car.</p>");
    html.push("<p>To change this calendar's structure, simply unlink it from any other calendar(s).</p>");

    swal.fire({
        title: "Linked Calendar",
        html: html.join(''),
        icon: "info"
    });
}
