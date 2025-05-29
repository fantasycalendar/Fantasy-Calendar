import { evaluate_background_size } from "./header";
import {
    update_name,
    update_dynamic,
    update_all,
    delete_calendar,
    create_calendar,
} from "./calendar_ajax_functions";
import {
    unescapeHtml,
    debounce,
    convert_year,
    does_timespan_appear,
    clone,
    evaluate_calendar_start,
    get_calendar_data,
} from "./calendar_functions";
import { climate_charts } from "./calendar_weather_layout";
import {
    set_up_visitor_values,
    preview_date_follow,
    update_preview_calendar,
    update_current_day,
    evaluate_settings,
} from "./calendar_inputs_visitor";
import { set_up_view_values } from "./calendar_inputs_view";
import { pre_rebuild_calendar, rebuild_calendar, rebuild_climate } from "./calendar_manager";
import CalendarRenderer from "../calendar-renderer";

export var changes_applied = true;

let save_button = null;
let log_in_button = null;
let create_button = null;
let calendar_container = null;
let weather_container = null;

export function set_up_edit_inputs() {

    window.prev_calendar_name = clone(window.calendar_name);
    window.prev_dynamic_data = clone(window.dynamic_data);
    window.prev_static_data = clone(window.static_data);
    window.prev_events = clone(window.events);
    window.prev_event_categories = clone(window.event_categories);
    window.prev_advancement = clone(window.advancement);

    window.owned_calendars = {};

    window.calendar_name_same = window.calendar_name == window.prev_calendar_name;
    window.static_same = JSON.stringify(window.static_data) === JSON.stringify(window.prev_static_data);
    window.dynamic_same = JSON.stringify(window.dynamic_data) === JSON.stringify(window.prev_dynamic_data);
    window.events_same = JSON.stringify(window.events) === JSON.stringify(window.prev_events);
    window.event_categories_same = JSON.stringify(window.event_categories) === JSON.stringify(window.prev_event_categories);
    window.advancement_same = JSON.stringify(window.advancement) === JSON.stringify(window.advancement);

    // window.onbeforeunload = function(e) {

    //     window.calendar_name_same = window.calendar_name == window.prev_calendar_name;
    //     window.static_same = JSON.stringify(window.static_data) === JSON.stringify(window.prev_static_data);
    //     window.dynamic_same = JSON.stringify(window.dynamic_data) === JSON.stringify(window.prev_dynamic_data);
    //     window.events_same = JSON.stringify(window.events) === JSON.stringify(window.prev_events);
    //     window.event_categories_same = JSON.stringify(window.event_categories) === JSON.stringify(window.prev_event_categories);
    //     window.advancement_same = JSON.stringify(window.advancement) === JSON.stringify(window.prev_advancement);

    //     var not_changed = static_same && dynamic_same && calendar_name_same && events_same && event_categories_same && advancement_same;

    //     if (!not_changed) {

    //         var confirmationMessage = "It looks like you have unsaved changes, are you sure you want to navigate away from this page?";

    //         (e || window.event).returnValue = confirmationMessage; //Gecko + IE
    //         return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.

    //     }

    // };

    set_up_view_inputs();

    save_button = $('#btn_save');

    save_button.click(function() {

        var text = "Saving..."

        save_button.prop('disabled', true).toggleClass('btn-secondary', true).toggleClass('btn-primary', false).toggleClass('btn-success', false).toggleClass('btn-warning', false).text(text);

        if (!events_same || !event_categories_same || !static_same || !advancement_same) {
            update_all();
        } else if (!dynamic_same) {
            update_dynamic(window.hash);
        } else if (!calendar_name_same) {
            update_name();
        }

    });

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

    save_button.prop('disabled', true);
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


        let owner = true;

        $('.view-tabs .btn-primary').removeClass('btn-primary').addClass('btn-secondary');

        $(this).removeClass('btn-secondary').addClass('btn-primary');

        var errors = get_errors();

        switch (view_type) {
            case "owner":
                Perms.owner = true;
                if (creation.is_done() && errors.length == 0) {
                    if (previous_view_type !== 'owner') {
                        evaluate_settings();
                        if (!window.preview_date.follow) {
                            update_preview_calendar();
                            pre_rebuild_calendar('preview', window.preview_date);
                        } else {
                            pre_rebuild_calendar('calendar', window.dynamic_data);
                            preview_date_follow();
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
                if (creation.is_done() && errors.length == 0) {
                    if (previous_view_type !== 'player') {
                        evaluate_settings();
                        if (!window.preview_date.follow) {
                            update_preview_calendar();
                            pre_rebuild_calendar('preview', window.preview_date);
                        } else {
                            pre_rebuild_calendar('calendar', window.dynamic_data);
                            preview_date_follow();
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
                if (creation.is_done() && errors.length == 0) {
                    evaluate_settings();
                    climate_charts.active_view = true;
                }
                calendar_container.addClass('hidden');
                weather_container.removeClass('hidden');
                break;

        }

    });

    /* ------------------- Dynamic and static callbacks ------------------- */

    $('#calendar_name').change(function() {
        window.calendar_name = $(this).val();
        do_error_check();
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

        var errors = get_errors();

        if (errors.length == 0 && $('.invalid').length == 0) {

            changes_applied = true;

            if (!window.preview_date.follow) {

                update_preview_calendar();

                pre_rebuild_calendar('preview', window.preview_date);

            } else {

                pre_rebuild_calendar('calendar', window.dynamic_data);

                preview_date_follow();

            }

        }

    });

    $('#apply_changes_immediately').change(function() {

        var checked = $(this).is(':checked');

        var errors = get_errors();

        if (errors.length > 0) {
            return;
        }

        if (checked) {

            changes_applied = false;

            $('#reload_background').addClass('hidden').css('display', 'none');
            evaluate_save_button(true);

            if (!window.preview_date.follow) {

                update_preview_calendar();

                rebuild_calendar('preview', window.preview_date);

            } else {

                rebuild_calendar('calendar', window.dynamic_data);

                preview_date_follow();

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

    document.addEventListener("advancement-changed", function(event) {
        advancement = event.detail.data;
        evaluate_save_button();
    });
}


function get_errors() {

    var errors = [];

    if (window.calendar_name == "") {
        errors.push("The calendar name cannot be empty.")
    }

    if (window.static_data.year_data.timespans.length != 0) {
        for (var era_i = 0; era_i < window.static_data.eras.length; era_i++) {
            var era = window.static_data.eras[era_i];
            if (window.static_data.year_data.timespans[era.date.timespan]) {
                var appears = does_timespan_appear(window.static_data, convert_year(window.static_data, era.date.year), era.date.timespan);
                if (!appears.result) {
                    if (appears.reason == 'era ended') {
                        errors.push(`Era <i>${era.name}</i> is on a date that doesn't exist due to a previous era ending the year. Please move it to another year.`);
                    } else {
                        errors.push(`Era <i>${era.name}</i> is currently on a month that is leaping on that year. Please change its year or move it to another month.`);
                    }
                }
            } else {
                errors.push(`Era <i>${era.name}</i> doesn't have a valid month.`);
            }
        }

        for (var era_i = 0; era_i < window.static_data.eras.length - 1; era_i++) {
            var curr = window.static_data.eras[era_i];
            var next = window.static_data.eras[era_i + 1];
            if (!curr.settings.starting_era && !next.settings.starting_era) {
                if (curr.year == next.date.year && curr.settings.ends_year && next.settings.ends_year) {
                    errors.push(`Eras <i>${curr.name}</i> and <i>${next.name}</i> both end the same year. This is not possible.`);
                }
                if (curr.date.year == next.date.year && curr.date.timespan == next.date.timespan && curr.date.day == next.date.day) {
                    errors.push(`Eras <i>${window.static_data.eras[era_i].name}</i> and <i>${window.static_data.eras[era_i + 1].name}</i> both share the same date. One has to come after another.`);
                }
            }
        }
    }

    if (window.static_data.year_data.timespans.length != 0) {

        if (window.static_data.seasons.global_settings.periodic_seasons) {
            for (var season_i = 0; season_i < window.static_data.seasons.data.length; season_i++) {
                var season = window.static_data.seasons.data[season_i];
                if (window.static_data.seasons.global_settings.periodic_seasons) {
                    if (season.transition_length == 0) {
                        errors.push(`Season <i>${season.name}</i> can't have 0 transition length.`);
                    }
                } else {
                    if (window.static_data.year_data.timespans[season.timespan].interval != 1) {
                        errors.push(`Season <i>${season.name}</i> can't be on a leaping month.`);
                    }
                }
            }
        } else {

            for (var season_i = 0; season_i < window.static_data.seasons.data.length - 1; season_i++) {
                var curr_season = window.static_data.seasons.data[season_i];
                var next_season = window.static_data.seasons.data[season_i + 1];
                if (curr_season.timespan == next_season.timespan && curr_season.day == next_season.day) {
                    errors.push(`Season <i>${curr_season.name}</i> and <i>${next_season.name}</i> cannot be on the same month and day.`);
                }
            }
        }
    }

    if (window.static_data.clock.enabled) {

        if (window.static_data.clock.hours === 0) {
            errors.push(`If the clock is enabled, you need to have more than 0 hours per day.`);
        }

        if (window.static_data.clock.minutes === 0) {
            errors.push(`If the clock is enabled, you need to have more than 0 minutes per hour.`);
        }

    }

    return errors;

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

export var do_error_check = debounce(function(type, rebuild) {
    evaluate_save_button();

    if (!creation.is_done()) {

        evaluate_background_size();

        $('#generator_container').removeClass();
        $('#generator_container').addClass('step-' + (creation.current_step));

    } else {

        $('#generator_container').removeClass();

        var errors = get_errors();

        if (errors.length == 0 && $('.static_input.invalid').length == 0 && $('.dynamic_input.invalid').length == 0) {

            error_check(type, rebuild);

        }

    }
}, 150);

function error_check(parent, rebuild) {

    changes_applied = false;

    if (parent === "eras") {
        for (var i = 0; i < window.static_data.eras.length; i++) {
            window.static_data.eras[i].date.epoch = evaluate_calendar_start(window.static_data, convert_year(window.static_data, window.static_data.eras[i].date.year), window.static_data.eras[i].date.timespan, window.static_data.eras[i].date.day).epoch;
        }
    }
    if (rebuild === undefined || rebuild) {

        if (!window.preview_date.follow) {

            update_preview_calendar();

            pre_rebuild_calendar('preview', window.preview_date);

        } else {

            pre_rebuild_calendar('calendar', window.dynamic_data);

            preview_date_follow();

        }

    } else {

        if (parent !== undefined && (parent === "seasons")) {
            rebuild_climate();
        } else {
            pre_rebuild_calendar('calendar', window.dynamic_data);
            update_current_day(true);
        }
    }

}

function evaluate_remove_buttons() {
    $('.month .btn_remove, .week_day .btn_remove').each(function() {
        $(this).toggleClass('disabled', $(this).closest('.sortable').children().length == 1);
    });
}


export function adjustInput(element, target, int) {
    var target = $(target);
    target.val((target.val() | 0) + int).change();
}

export function calendar_saved() {
    var text = "Saved!"

    save_button.prop('disabled', true).toggleClass('btn-secondary', false).toggleClass('btn-success', true).toggleClass('btn-primary', false).toggleClass('btn-warning', false).toggleClass('btn-danger', false).text(text);

    setTimeout(evaluate_save_button, 3000);
}

export function calendar_save_failed() {
    var text = "Failed to save!"

    save_button.prop('disabled', true).toggleClass(['btn-secondary', 'btn-primary', 'btn-danger'], false).toggleClass(['btn-success', 'btn-warning'], true).text(text);
    setInterval(function() {
        evaluate_save_button(true);
    }, 10000);
}

export function evaluate_save_button(override) {
    if (!creation.is_done()) {
        return;
    }

    var errors = get_errors();

    if ($('#btn_save').length) {

        if (errors.length > 0 || $('.static_input.invalid').length > 0 || $('.dynamic_input.invalid').length > 0) {

            var text = "Calendar has errors - can't save"

            save_button.prop('disabled', true).toggleClass('btn-secondary', false).toggleClass('btn-success', false).toggleClass('btn-primary', false).toggleClass('btn-warning', false).toggleClass('btn-danger', true).text(text);

        } else {

            calendar_name_same = window.calendar_name == window.prev_calendar_name;
            static_same = JSON.stringify(window.static_data) === JSON.stringify(window.prev_static_data);
            dynamic_same = JSON.stringify(window.dynamic_data) === JSON.stringify(window.prev_dynamic_data);
            events_same = JSON.stringify(window.events) === JSON.stringify(window.prev_events);
            event_categories_same = JSON.stringify(window.event_categories) === JSON.stringify(window.prev_event_categories);
            advancement_same = JSON.stringify(window.advancement) === JSON.stringify(window.prev_advancement);

            var not_changed = static_same && dynamic_same && calendar_name_same && events_same && event_categories_same && advancement_same;

            var text = not_changed ? "No changes to save" : "Save calendar";

            var apply_changes_immediately = $('#apply_changes_immediately').is(':checked');

            if (!apply_changes_immediately && !override) {

                var text = not_changed ? "No changes to save" : "Apply changes to save";

                save_button.prop('disabled', true);

            } else {

                save_button.prop('disabled', not_changed);

            }

            save_button.toggleClass('btn-secondary', false).toggleClass('btn-success', not_changed).toggleClass('btn-primary', !not_changed).toggleClass('btn-warning', false).toggleClass('btn-danger', false).text(text);

            return not_changed;

        }

    } else if ($('#btn_create').length) {

        var invalid = errors.length > 0;

        var text = invalid ? "Cannot create yet" : "Save Calendar";

        var apply_changes_immediately = $('#apply_changes_immediately').is(':checked');

        if (!apply_changes_immediately && !override && !invalid) {

            var text = "Apply changes to create";

            create_button.prop('disabled', true);

        } else {

            create_button.prop('disabled', invalid);

        }

        autosave();

        create_button.toggleClass('btn-danger', invalid).toggleClass('btn-success', !invalid).text(text);

    } else if ($('.login-button').length) {

        var invalid = errors.length > 0;

        var apply_changes_immediately = $('#apply_changes_immediately').is(':checked');

        if (!apply_changes_immediately && !override && !invalid) {

            log_in_button.prop('disabled', true);

        } else {

            log_in_button.prop('disabled', invalid);

        }

        autosave();

    }
}

var block_inputs = false;

export function set_up_edit_values() {
    block_inputs = true;

    $('#calendar_name').val(window.calendar_name);

    $('.static_input').each(function() {
        var data = $(this).attr('data');
        var key = $(this).attr('fc-index');

        var current_calendar_data = get_calendar_data(data);

        if (current_calendar_data[key] !== undefined) {

            switch ($(this).attr('type')) {
                case "checkbox":
                    $(this).prop("checked", current_calendar_data[key]);
                    break;

                case "color":
                    // $(this).spectrum("set", current_calendar_data[key]);
                    break;

                default:
                    $(this).val(unescapeHtml(current_calendar_data[key]));
                    break;
            }
        }

    });

    $('input[fc-index="only_backwards"]').prop('disabled', !window.static_data.settings.allow_view);
    $('input[fc-index="only_backwards"]').closest('.setting').toggleClass('disabled', !window.static_data.settings.allow_view);

    let custom_week = window.static_data.year_data.timespans.filter(t => t?.week?.length > 0).length > 0
        || window.static_data.year_data.leap_days.filter(l => l.adds_week_day).length > 0;

    if (custom_week) {
        $('#month_overflow').prop('checked', !custom_week);
        window.static_data.year_data.overflow = false;
    }

    $('#month_overflow').prop('disabled', custom_week);
    $('.month_overflow_container').toggleClass("hidden", custom_week)
    $('#overflow_explanation').toggleClass('hidden', !custom_week);

    $('#first_week_day_container').toggleClass('hidden', !window.static_data.year_data.overflow || window.static_data.year_data.global_week.length == 0).find('select').prop('disabled', !window.static_data.year_data.overflow || window.static_data.year_data.global_week.length == 0);
    // global_week_sortable.sortable('refresh');

    evaluate_remove_buttons();

    block_inputs = false;
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
        set_up_edit_values();
        set_up_view_values();
        set_up_visitor_values();

        do_error_check("calendar", true);

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
