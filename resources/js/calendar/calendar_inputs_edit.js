import { error_message, evaluate_background_size } from "./header";
import {
    update_name,
    update_dynamic,
    update_all,
    link_child_calendar,
    unlink_child_calendar,
    get_calendar_users,
    add_calendar_user,
    update_calendar_user,
    remove_calendar_user,
    resend_calendar_invite,
    get_owned_calendars,
    delete_calendar,
    create_calendar,
} from "./calendar_ajax_functions";
import {
    escapeHtml,
    unescapeHtml,
    get_colors_for_season,
    fahrenheit_to_celcius,
    celcius_to_fahrenheit,
    debounce,
    ordinal_suffix_of,
    precisionRound,
    lerp,
    fract,
    get_moon_granularity,
    get_current_era,
    date_manager,
    convert_year,
    unconvert_year,
    get_timespans_in_year,
    does_timespan_appear,
    avg_year_length,
    avg_month_length,
    clone,
    evaluate_calendar_start,
    get_calendar_data,
} from "./calendar_functions";
import { preset_data } from "./calendar_variables";
import { climate_charts } from "./calendar_weather_layout";
import {
    set_up_visitor_values,
    preview_date_follow,
    update_preview_calendar,
    set_preview_date,
    update_current_day,
    evaluate_settings,
    evaluate_sun,
    repopulate_event_category_lists,
    repopulate_timespan_select,
    repopulate_day_select,
    eval_clock,
} from "./calendar_inputs_visitor";
import { evaluate_dynamic_change, repopulate_location_select_list, set_up_view_values } from "./calendar_inputs_view";
import { pre_rebuild_calendar, rebuild_calendar, rebuild_climate } from "./calendar_manager";
import CalendarRenderer from "../calendar-renderer";

export var changes_applied = true;

let save_button = null;
let log_in_button = null;
let create_button = null;
let calendar_container = null;
let weather_container = null;
let removing = false;

let input_container = null;
let timespan_sortable = null;
let first_day = null;
let global_week_sortable = null;
let leap_day_list = null;
let moon_list = null;
let periodic_seasons_checkbox = null;
let season_sortable = null;
let cycle_sortable = null;
let era_list = null;
let event_category_list = null;
let location_list = null;
let calendar_link_select = null;
let calendar_link_list = null;
let calendar_new_link_list = null;

let previous_view_type = 'owner';
let view_type = 'owner';

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

    window.onbeforeunload = function(e) {

        window.calendar_name_same = window.calendar_name == window.prev_calendar_name;
        window.static_same = JSON.stringify(window.static_data) === JSON.stringify(window.prev_static_data);
        window.dynamic_same = JSON.stringify(window.dynamic_data) === JSON.stringify(window.prev_dynamic_data);
        window.events_same = JSON.stringify(window.events) === JSON.stringify(window.prev_events);
        window.event_categories_same = JSON.stringify(window.event_categories) === JSON.stringify(window.prev_event_categories);
        window.advancement_same = JSON.stringify(window.advancement) === JSON.stringify(window.prev_advancement);

        var not_changed = static_same && dynamic_same && calendar_name_same && events_same && event_categories_same && advancement_same;

        if (!not_changed) {

            var confirmationMessage = "It looks like you have unsaved changes, are you sure you want to navigate away from this page?";

            (e || window.event).returnValue = confirmationMessage; //Gecko + IE
            return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.

        }

    };

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

    input_container = $('#input_container');
    timespan_sortable = $('#timespan_sortable');
    first_day = $('#first_day');
    global_week_sortable = $('#global_week_sortable');
    leap_day_list = $('#leap_day_list');
    moon_list = $('#moon_list');
    periodic_seasons_checkbox = $('#periodic_seasons_checkbox');
    season_sortable = $('#season_sortable');
    cycle_sortable = $('#cycle_sortable');
    era_list = $('#era_list');
    event_category_list = $('#event_category_list');
    location_list = $('#location_list');
    calendar_link_select = $('#calendar_link_select');
    calendar_link_list = $('#calendar_link_list');
    calendar_new_link_list = $('#calendar_new_link_list');

    var previous_view_type = 'owner';
    view_type = 'owner';

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
                        if (!preview_date.follow) {
                            update_preview_calendar();
                            pre_rebuild_calendar('preview', preview_date);
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
                        if (!preview_date.follow) {
                            update_preview_calendar();
                            pre_rebuild_calendar('preview', preview_date);
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

        // if(isMobile() && deviceType() == "Mobile Phone") {
        //     toggle_sidebar();
        // }

    });

    // global_week_sortable.sortable({
    //     placeholder: "highlight",
    //     handle: '.handle',
    //     opacity: 0.5,
    //     update: function() {
    //         input_container.change();
    //         reindex_weekday_sortable();
    //     },
    //     start: function(e, ui) {
    //         ui.placeholder.height(ui.item.height());
    //     }
    // });

    // timespan_sortable.sortable({
    //     placeholder: "highlight",
    //     handle: '.handle',
    //     opacity: 0.5,
    //     update: function() {
    //         input_container.change();
    //         reindex_timespan_sortable();
    //     },
    //     start: function(e, ui) {
    //         ui.placeholder.height(ui.item.height());
    //     }
    // });

    // season_sortable.sortable({
    //     placeholder: "highlight",
    //     handle: '.handle',
    //     opacity: 0.5,
    //     update: function() {
    //         input_container.change();
    //         reindex_season_sortable();
    //         do_error_check(season_sortable);
    //     },
    //     start: function(e, ui) {
    //         ui.placeholder.height(ui.item.height());
    //     }
    // });

    // cycle_sortable.sortable({
    //     placeholder: "highlight",
    //     handle: '.handle',
    //     opacity: 0.5,
    //     update: function() {
    //         input_container.change();
    //         reindex_cycle_sortable();
    //     },
    //     start: function(e, ui) {
    //         ui.placeholder.height(ui.item.height());
    //     }
    // });

    // cycle_sortable.sortable({
    //     placeholder: "highlight",
    //     handle: '.handle',
    //     opacity: 0.5,
    //     update: function() {
    //         input_container.change();
    //         reindex_cycle_sortable();
    //     },
    //     start: function(e, ui) {
    //         ui.placeholder.height(ui.item.height());
    //     }
    // });

    /* ------------------- Dynamic and static callbacks ------------------- */

    $('#calendar_name').change(function() {
        window.calendar_name = $(this).val();
        do_error_check();
    });

    $(document).on('change', '.length-input, .interval, .offset', function() {
        recalc_stats();
    });

    $(document).on('change', '.disable_local_season_name', function() {
        var checked = $(this).prop('checked');
        var parent = $(this).closest('.wrap-collapsible');
        var index = parent.attr('index') | 0;
        var name_input = parent.find('input[fc-index="name"]');
        if (checked) {
            name_input.prop('disabled', false);
        } else {
            name_input.val(window.static_data.seasons.data[index].name).prop('disabled', true);
        }
    });

    $('#enable_clock').change(function() {

        window.static_data.clock.enabled = $(this).is(':checked');
        window.static_data.clock.render = $(this).is(':checked');
        $('#render_clock').prop('checked', window.static_data.clock.render);

        window.dynamic_data.hour = 0;
        window.dynamic_data.minute = 0;

        evaluate_clock_inputs();

        $('#create_season_events').prop('disabled', !window.static_data.clock.enabled);

        var no_locations = (window.static_data.seasons.data.length == 0 || !window.static_data.seasons.global_settings.enable_weather) && !window.static_data.clock.enabled;
        $('#locations_warning_hidden').toggleClass('hidden', no_locations).find('select, input').prop('disabled', no_locations);
        $('#locations_warning').toggleClass('hidden', !no_locations);

        $('.season_middle_btn').toggleClass('hidden', !window.static_data.clock.enabled || window.static_data.seasons.data.length < 3);
        $('.location_middle_btn').toggleClass('hidden', (!window.static_data.seasons.global_settings.enable_weather && !window.static_data.clock.enabled) || window.static_data.seasons.data.length < 3);

        eval_clock();

        window.dispatchEvent(new CustomEvent("clock-changed", { detail: { enabled: window.static_data.clock.enabled } }));

    });

    $('#collapsible_clock').change(function() {
        if ($(this).is(':checked')) {
            $('#clock').appendTo($(this).parent().children('.collapsible-content'));
        } else {
            $('#clock').prependTo($('#collapsible_date').parent().children('.collapsible-content'));
        }
    });

    /* ------------------- Layout callbacks ------------------- */

    $('.add_inputs').keyup(function(e) {
        if (e.keyCode == 13) {
            $(this).find('.add').click();
        }
    });


    $('.add_inputs.global_week .add').click(function() {
        var name = $("#weekday_name_input");
        var id = global_week_sortable.children().length;
        var name_val = name.val() == "" ? `Weekday ${id + 1}` : name.val();
        add_weekday_to_sortable(global_week_sortable, id, name_val);
        window.static_data.year_data.global_week.push(name_val);
        var hidden = !window.static_data.year_data.overflow || window.static_data.year_data.global_week.length == 0;
        $('#first_week_day_container').toggleClass('hidden', hidden).find('select').prop('disabled', hidden);
        // global_week_sortable.sortable('refresh');
        reindex_weekday_sortable();
        name.val("");
        set_up_view_values();
    });

    $(document).on('change', '.week_day_name', function() {
        populate_first_day_select(window.static_data.year_data.first_day);
    });

    $('.add_inputs.timespan .add').click(function() {
        var name = $('#timespan_name_input');
        var type = $('#timespan_type_input');
        var id = timespan_sortable.children().length;
        if (type.val() == "month") {
            var name_val = name.val() == "" ? `Month ${id + 1}` : name.val();
        } else {
            var name_val = name.val() == "" ? `Intercalary Month ${id + 1}` : name.val();
        }

        var length = 1;
        if (window.static_data.year_data.timespans.length == 0) {
            if (window.static_data.year_data.global_week.length > 0) {
                length = window.static_data.year_data.global_week.length;
            }
        } else {
            length = window.static_data.year_data.timespans[window.static_data.year_data.timespans.length - 1].length;
        }

        stats = {
            'name': name_val,
            'type': type.val(),
            'length': length,
            'interval': 1,
            'offset': 0
        };

        add_timespan_to_sortable(timespan_sortable, id, stats);
        window.static_data.year_data.timespans.push(stats);
        // timespan_sortable.sortable('refresh');
        reindex_timespan_sortable();
        name.val("");
        set_up_view_values();
    });

    $('.add_inputs.leap .add').click(function() {
        var name = $('#leap_day_name_input');
        var type = $('#leap_day_type_input');
        var id = leap_day_list.children().length;
        var name_val = name.val() == "" ? `Leap day ${id + 1}` : name.val();
        stats = {
            'name': name_val,
            'intercalary': type.val() == 'intercalary',
            'timespan': 0,
            'adds_week_day': false,
            'day': 0,
            'week_day': '',
            'interval': '1',
            'offset': 0,
            'not_numbered': false,
        };

        if (!window.static_data.year_data.leap_days) {
            window.static_data.year_data.leap_days = [];
        }
        window.static_data.year_data.leap_days.push(stats);

        add_leap_day_to_list(leap_day_list, id, stats);

        if (stats.intercalary) {
            repopulate_day_select(leap_day_list.children().last().find('.timespan-day-list'), stats.day, false);
        } else {
            repopulate_day_select(leap_day_list.children().last().find('.week-day-select'), window.static_data.year_data.leap_days[id].day, false);
        }

        do_error_check();

        name.val("");
        set_up_view_values();

    });


    $(document).on('click', '.expand', function() {
        var parent = $(this).closest('.collapsible');
        if (parent.hasClass('collapsed')) {
            $(this).removeClass('icon-expand').addClass('icon-collapse');
            parent.removeClass('collapsed').addClass('expanded');
        } else {
            $(this).removeClass('icon-collapse').addClass('icon-expand');
            parent.removeClass('expanded').addClass('collapsed');
        }
    });

    $(document).on('click', '.location_toggle', function() {
        var checked = $(this).is(':checked');
        $(this).parent().find('.icon').toggleClass('icon-collapse', checked).toggleClass('icon-expand', !checked);
    });

    $('.add_inputs.moon .add').click(function() {
        var name = $('#moon_name_input');
        var cycle = $('#moon_cycle_input');
        var shift = $('#moon_shift_input');
        var cycle_val = cycle.val() | 0;
        var id = moon_list.children().length;

        var name_val = name.val() == "" ? `Moon ${id + 1}` : name.val();

        var cycle_val = cycle.val();
        var shift_val = shift.val();

        if (cycle_val == "") {
            var len = avg_month_length(window.static_data);
            cycle_val = len ? len : 32;
        }

        if (shift_val == "") {
            shift_val = 0;
        }

        var granularity = get_moon_granularity(cycle_val);

        stats = {
            'name': name_val,
            'cycle': cycle_val,
            'cycle_rounding': "round",
            'shift': shift_val,
            'granularity': granularity,
            'color': '#ffffff',
            'shadow_color': '#292b4a',
            'hidden': false
        };
        if (window.static_data.moons === undefined) {
            window.static_data.moons = [];
        }
        window.static_data.moons.push(stats);
        add_moon_to_list(moon_list, id, stats);
        name.val("");
        cycle.val("");
        shift.val("");
        recreate_moon_colors();
        do_error_check();
    });

    periodic_seasons_checkbox.change(function() {

        var checked = $(this).prop('checked');
        $(this).prop('checked', !checked);

        var ends_year = false;
        for (var era_index in window.static_data.eras) {
            var era = window.static_data.eras[era_index];
            if (era.settings.ends_year) {
                ends_year = true;
                break;
            }
        }

        if (ends_year) {
            swal.fire({
                title: "Error!",
                text: `You have eras that end years - you cannot switch to dated seasons with year-ending eras as the dates might disappear, and that kinda defeats the whole purpose.`,
                icon: "error"
            });
            return;
        }

        swal.fire({
            title: "Are you sure?",
            text: `Are you sure you want to switch to ${checked ? "PERIODIC" : "DATED"} seasons? Your current seasons will be deleted so you can re-create them.`,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Okay',
            icon: "warning",
        })
            .then((result) => {
                if (!result.dismiss) {
                    $(this).prop('checked', checked);
                    season_sortable.empty();
                    window.static_data.seasons.data = [];
                    reindex_location_list();
                    evaluate_season_lengths();
                    evaluate_season_daylength_warning();
                    window.static_data.seasons.global_settings.periodic_seasons = checked;

                    $('.season_text.dated').toggleClass('active', !checked);
                    $('.season_text.periodic').toggleClass('active', checked);

                    $('.season_offset_container').prop('disabled', !checked).toggleClass('hidden', !checked);

                    $('#has_seasons_container').toggleClass('hidden', true).find('select, input').prop('disabled', true);
                    $('#no_seasons_container').toggleClass('hidden', false);

                    var no_locations = !window.static_data.seasons.global_settings.enable_weather && !window.static_data.clock.enabled;
                    $('#locations_warning_hidden').toggleClass('hidden', no_locations).find('select, input').prop('disabled', no_locations);
                    $('#locations_warning').toggleClass('hidden', !no_locations);

                    era_list.children().each(function() {
                        var input = $(this).find('.ends_year');
                        var text = $(this).find('.ends_year_explaination');
                        var parent = input.parent();
                        input.prop('disabled', !checked);
                        parent.toggleClass('disabled', !checked);
                        text.toggleClass('hidden', checked);
                    });

                    error_check("calendar", true);
                }
            });

    });

    $('.add_inputs.seasons .add').click(function() {

        var fract_year_len = avg_year_length(window.static_data);

        var name = $("#season_name_input");
        var id = season_sortable.children().length;

        var name_val = name.val() == "" ? `Season ${id + 1}` : name.val();

        stats = {
            "name": name_val,
            "color": [
                "#" + Math.floor(Math.random() * 16777215).toString(16).toString(),
                "#" + Math.floor(Math.random() * 16777215).toString(16).toString()
            ],
            "time": {
                "sunrise": {
                    "hour": 6,
                    "minute": 0
                },
                "sunset": {
                    "hour": 18,
                    "minute": 0
                }
            }
        };

        if (window.static_data.seasons.global_settings.periodic_seasons) {

            if (season_sortable.children().length == 0) {
                stats.transition_length = fract_year_len;
            } else {
                if (season_sortable.children().length > 0) {
                    season_sortable.children().each(function() {
                        var val = $(this).find('.transition_length').val()
                        if (val == fract_year_len / (season_sortable.children().length)) {
                            $(this).find('.transition_length').val(fract_year_len / (season_sortable.children().length + 1));
                        }
                    })
                }
                stats.transition_length = fract_year_len / (season_sortable.children().length + 1);
            }

            stats.duration = 0;

        } else {

            if (season_sortable.children().length == 0) {

                stats.timespan = 0;
                stats.day = 1;

            } else {

                stats.timespan = Math.floor(window.static_data.year_data.timespans.length / (season_sortable.children().length + 1))
                stats.day = 1;

            }

        }

        add_season_to_sortable(season_sortable, id, stats);

        // season_sortable.children().last().find('.start_color').spectrum({
        //     color: stats.color[0],
        //     preferredFormat: "hex",
        //     showInput: true
        // });

        // season_sortable.children().last().find('.end_color').spectrum({
        //     color: stats.color[1],
        //     preferredFormat: "hex",
        //     showInput: true
        // });

        if (!window.static_data.seasons.global_settings.periodic_seasons) {

            repopulate_timespan_select(season_sortable.children().last().find('.timespan-list'), stats.timespan, false, false);
            repopulate_day_select(season_sortable.children().last().find('.timespan-day-list'), stats.day, false, false);
            sort_list_by_partial_date(season_sortable);

        }

        // season_sortable.sortable('refresh');
        reindex_season_sortable();
        populate_preset_season_list();
        evaluate_season_lengths();
        evaluate_season_daylength_warning();
        reindex_location_list();
        name.val("");
        do_error_check();

        var no_seasons = window.static_data.seasons.data.length == 0;
        $('#has_seasons_container').toggleClass('hidden', no_seasons).find('select, input').prop('disabled', no_seasons);
        $('#no_seasons_container').toggleClass('hidden', !no_seasons);

        $('#create_season_events').prop('disabled', window.static_data.seasons.data.length == 0 && !window.static_data.clock.enabled);

        $('#season_color_enabled').prop("disabled", window.static_data.seasons.data.length == 0);

        $('.season_middle_btn').toggleClass('hidden', !window.static_data.clock.enabled || window.static_data.seasons.data.length < 3);

    });

    $('#create_season_events').prop('disabled', window.static_data.seasons.data.length == 0 && !window.static_data.clock.enabled);

    $('#create_season_events').click(function() {

        new Promise((resolve, reject) => {

            let found = false;
            for (let i in window.events) {
                if (['spring equinox', 'summer solstice', 'autumn equinox', 'winter solstice'].indexOf(window.events[i].name.toLowerCase()) > -1) {
                    found = true;
                }
            }

            if (found) {

                swal.fire({
                    title: `Events exist!`,
                    text: "You already have solstice and equinox events, are you sure you want to create another set?",
                    showCloseButton: false,
                    showCancelButton: true,
                    cancelButtonColor: '#3085d6',
                    confirmButtonColor: '#d33',
                    confirmButtonText: 'Yes',
                    icon: "warning"
                })
                    .then((result) => {
                        if (result.dismiss === "close" || result.dismiss === "cancel") {
                            reject();
                        } else {
                            resolve();
                        }
                    });

            } else {
                resolve();
            }

        }).then(() => {

            var html = '<strong><span style="color:#4D61B3;">Simple</span></strong> season events are based on the <strong>specific start dates</strong> of the seasons.<br><br>';

            html += '<strong><span style="color:#84B356;">Complex</span></strong> season events are based on the <strong>longest and shortest day</strong> of the year.<br>';
            if (!window.static_data.clock.enabled) {
                html += '<span style="font-style:italic;font-size:0.8rem;">You need to <strong>enable the clock</strong> for this button to be enabled.</span><br>';
            }
            html += '<br>';
            html += '<span style="font-size:0.9rem;">Still unsure? <a href="https://helpdocs.fantasy-calendar.com/topic/seasons#Create_solstice_and_equinox_events" target="_blank">Read more on the Wiki (opens in a new window)</a>.</span><br>';

            swal.fire({
                title: `Simple or Complex?`,
                html: html,
                showCloseButton: true,
                showCancelButton: true,
                confirmButtonColor: '#4D61B3',
                cancelButtonColor: window.static_data.clock.enabled ? '#84B356' : '#999999',
                confirmButtonText: 'Simple',
                cancelButtonText: 'Complex',
                icon: "question",
                onOpen: function() {
                    $(swal.getCancelButton()).prop("disabled", !window.static_data.clock.enabled);
                }
            })
                .then((result) => {

                    if (result.dismiss !== "close") {

                        var complex = result.dismiss === "cancel";

                        var season_events = create_season_events(complex);

                        for (index in season_events) {
                            window.events.push(season_events[index])
                        }

                        window.dispatchEvent(new CustomEvent("events-changed"));

                        do_error_check();

                    }
                });

        });
    })

    $('.add_inputs.locations .add').click(function() {

        var name = $('#location_name_input');
        var id = location_list.children().length;

        var name_value = name.val() == "" ? `Location ${id + 1}` : name.val();

        stats = {
            "name": name_value,
            "seasons": [],

            "settings": {
                "timezone": {
                    "hour": 0,
                    "minute": 0,
                },

                "season_based_time": true,

                "large_noise_frequency": 0.015,
                "large_noise_amplitude": 5.0,

                "medium_noise_frequency": 0.3,
                "medium_noise_amplitude": 2.0,

                "small_noise_frequency": 0.8,
                "small_noise_amplitude": 3.0
            }
        };

        for (var i = 0; i < window.static_data.seasons.data.length; i++) {

            stats.seasons[i] = {
                "time": window.static_data.seasons.data[i].time,
                "weather": {
                    "temp_low": 0,
                    "temp_high": 0,
                    "precipitation": 0,
                    "precipitation_intensity": 0
                }
            }
        }

        add_location_to_list(location_list, id, stats);

        window.static_data.seasons.locations.push(stats);

        repopulate_location_select_list();

        name.val('');

        // location_list.children().last().find('.slider_percentage').slider({
        //     min: 0,
        //     max: 100,
        //     step: 1,
        //     change: function(event, ui) {
        //         $(this).parent().parent().find('.slider_input').val($(this).slider('value')).change();
        //     },
        //     slide: function(event, ui) {
        //         $(this).parent().parent().find('.slider_input').val($(this).slider('value'));
        //     }
        // });

        // location_list.children().last().find('.slider_percentage').each(function() {
        //     $(this).slider('option', 'value', parseInt($(this).parent().parent().find('.slider_input').val()));
        // });

        location_select.find(`option[value="${id}"]`).prop('selected', true).change();

        $('.location_middle_btn').toggleClass('hidden', (!window.static_data.seasons.global_settings.enable_weather && !window.static_data.clock.enabled) || window.static_data.seasons.data.length < 3);

    });

    $(document).on('focus', '.season_selector', function() {
        $(this).prop('prev_value', $(this).val());
    });

    $(document).on('change', '.season_selector', function() {

        var prev_value = $(this).prop('prev_value')
        var new_value = $(this).val();

        $('.season_selector').not($(this)).each(function(i) {
            if ($(this).val() == new_value) {
                $(this).val(prev_value)
            }
        });

        $(this).prop('prev_value', $(this).val());

    });

    $('#copy_location_data').click(function() {

        var type = location_select.find('option:selected').parent().attr('value');
        var location = location_select.val();

        if (type === "custom") {

            var stats = clone(window.static_data.seasons.locations[location]);

        } else {

            var location = clone(preset_data.locations[window.static_data.seasons.data.length][location]);
            var stats = {
                name: location.name
            };

            if (window.static_data.seasons.data.length == 2) {
                var preset_seasons = ['winter', 'summer'];
            } else {
                var preset_seasons = ['winter', 'spring', 'summer', 'autumn'];
            }

            var valid_preset_order = window.static_data.seasons.global_settings.preset_order !== undefined && window.static_data.seasons.global_settings.preset_order.length == window.static_data.seasons.data.length;

            var preset_order = undefined;

            if (!valid_preset_order) {

                let season_test = [];
                for (var index in window.static_data.seasons.data) {
                    var season = window.static_data.seasons.data[index];
                    let preset_index = preset_seasons.indexOf(season.name.toLowerCase());
                    if (preset_index == -1 && season.name.toLowerCase() == "fall" && window.static_data.seasons.data.length == 4) {
                        preset_index = 3;
                    }
                    if (preset_index > -1) {
                        season_test.push(preset_index)
                    }
                }

                if (season_test.length == window.static_data.seasons.data.length) {
                    preset_order = season_test;
                    valid_preset_order = true;
                }

            } else {

                preset_order = window.static_data.seasons.global_settings.preset_order;

            }

            stats.settings = clone(preset_data.curves);
            stats.settings.season_based_time = true;
            stats.seasons = [];

            for (var i = 0; i < window.static_data.seasons.data.length; i++) {

                var index = i;
                if (preset_order !== undefined && preset_order.length == window.static_data.seasons.data.length) {
                    index = preset_order[i];
                }
                stats.seasons.push(clone(location.seasons[index]));

                stats.seasons[i].time = {}
                stats.seasons[i].time.sunset = window.static_data.seasons.data[i].time.sunset;
                stats.seasons[i].time.sunrise = window.static_data.seasons.data[i].time.sunrise;

                if (window.static_data.seasons.global_settings.temp_sys === "metric" || window.static_data.seasons.global_settings.temp_sys === "both_m") {
                    stats.seasons[i].weather.temp_low = fahrenheit_to_celcius(stats.seasons[i].weather.temp_low);
                    stats.seasons[i].weather.temp_high = fahrenheit_to_celcius(stats.seasons[i].weather.temp_high);
                }

            }

        }

        var id = location_list.children().length;

        add_location_to_list(location_list, id, stats);

        window.static_data.seasons.locations.push(stats);

        // location_list.children().last().find('.slider_percentage').slider({
        //     min: 0,
        //     max: 100,
        //     step: 1,
        //     change: function(event, ui) {
        //         $(this).parent().parent().find('.slider_input').val($(this).slider('value')).change();
        //     },
        //     slide: function(event, ui) {
        //         $(this).parent().parent().find('.slider_input').val($(this).slider('value'));
        //     }
        // });

        // location_list.children().last().find('.slider_percentage').each(function() {
        //     $(this).slider('option', 'value', parseInt($(this).parent().parent().find('.slider_input').val()));
        // });

        repopulate_location_select_list();

        location_select.find('optgroup[value="custom"]').children().eq(id).prop('selected', true).change();

        $('.location_middle_btn').toggleClass('hidden', (!window.static_data.seasons.global_settings.enable_weather && !window.static_data.clock.enabled) || window.static_data.seasons.data.length < 3);

    });

    $(document).on('click', '.location_middle_btn', function() {

        var container = $(this).closest('.sortable-container');

        var current_season = $(this).closest('.location_season');

        var season_id = current_season.attr('fc-index') | 0;

        var location_id = container.attr('index') | 0;

        var prev_id = (season_id - 1) % window.static_data.seasons.data.length
        if (prev_id < 0) prev_id += window.static_data.seasons.data.length

        var next_id = (season_id + 1) % window.static_data.seasons.data.length;

        if (window.static_data.seasons.global_settings.periodic_seasons) {

            var season_length = window.static_data.seasons.data[prev_id].duration + window.static_data.seasons.data[prev_id].transition_length + window.static_data.seasons.data[season_id].duration + window.static_data.seasons.data[season_id].transition_length;
            var target = window.static_data.seasons.data[prev_id].duration + window.static_data.seasons.data[prev_id].transition_length;
            var perc = target / season_length;

        } else {

            let prev_season = window.static_data.seasons.data[prev_id];
            let curr_season = window.static_data.seasons.data[season_id];
            let next_season = window.static_data.seasons.data[next_id];

            let prev_year = 2;
            if (prev_id > season_id) {
                prev_year--;
            }

            let next_year = 2;
            if (next_id < season_id) {
                next_year++;
            }

            let prev_day = evaluate_calendar_start(window.static_data, prev_year, prev_season.timespan, prev_season.day).epoch;
            let curr_day = evaluate_calendar_start(window.static_data, 2, curr_season.timespan, curr_season.day).epoch - prev_day;
            let next_day = evaluate_calendar_start(window.static_data, next_year, next_season.timespan, next_season.day).epoch - prev_day;

            var perc = curr_day / next_day;

        }

        var prev_season = window.static_data.seasons.locations[location_id].seasons[prev_id];
        var next_season = window.static_data.seasons.locations[location_id].seasons[next_id];

        if (window.static_data.clock.enabled) {

            var prev_sunrise = prev_season.time.sunrise.hour + (prev_season.time.sunrise.minute / window.static_data.clock.minutes);
            var next_sunrise = next_season.time.sunrise.hour + (next_season.time.sunrise.minute / window.static_data.clock.minutes);

            var middle = lerp(prev_sunrise, next_sunrise, perc)

            var sunrise_h = Math.floor(middle)
            var sunrise_m = Math.floor(fract(middle) * window.static_data.clock.minutes)

            current_season.find("input[clocktype='sunrise_hour']").val(sunrise_h)
            current_season.find("input[clocktype='sunrise_minute']").val(sunrise_m)

            window.static_data.seasons.locations[location_id].seasons[season_id].time.sunrise.hour = sunrise_h;
            window.static_data.seasons.locations[location_id].seasons[season_id].time.sunrise.minute = sunrise_m;


            var prev_sunset = prev_season.time.sunset.hour + (prev_season.time.sunset.minute / window.static_data.clock.minutes);
            var next_sunset = next_season.time.sunset.hour + (next_season.time.sunset.minute / window.static_data.clock.minutes);

            var middle = lerp(prev_sunset, next_sunset, perc)

            var sunset_h = Math.floor(middle)
            var sunset_m = Math.floor(fract(middle) * window.static_data.clock.minutes)

            current_season.find("input[clocktype='sunset_hour']").val(sunset_h)
            current_season.find("input[clocktype='sunset_minute']").val(sunset_m)

            window.static_data.seasons.locations[location_id].seasons[season_id].time.sunset.hour = sunset_h;
            window.static_data.seasons.locations[location_id].seasons[season_id].time.sunset.minute = sunset_m;

        }

        if (window.static_data.seasons.global_settings.enable_weather) {

            var temp_low = precisionRound(lerp(prev_season.weather.temp_low, next_season.weather.temp_low, perc), 2);
            var temp_high = precisionRound(lerp(prev_season.weather.temp_high, next_season.weather.temp_high, perc), 2);
            var precipitation = precisionRound(lerp(prev_season.weather.precipitation, next_season.weather.precipitation, perc), 2);
            var precipitation_intensity = precisionRound(lerp(prev_season.weather.precipitation_intensity, next_season.weather.precipitation_intensity, perc), 2);

            // current_season.find("input[fc-index='precipitation']").parent().parent().find('.slider_percentage').slider('option', 'value', precipitation * 100);
            // current_season.find("input[fc-index='precipitation_intensity']").parent().parent().find('.slider_percentage').slider('option', 'value', precipitation_intensity * 100);

            current_season.find("input[fc-index='temp_high']").val(temp_high)
            current_season.find("input[fc-index='temp_low']").val(temp_low)

            window.static_data.seasons.locations[location_id].seasons[season_id].weather.temp_low = temp_low;
            window.static_data.seasons.locations[location_id].seasons[season_id].weather.temp_high = temp_high;
            window.static_data.seasons.locations[location_id].seasons[season_id].weather.precipitation = precipitation;
            window.static_data.seasons.locations[location_id].seasons[season_id].weather.precipitation_intensity = precipitation_intensity;

        }

        do_error_check('seasons');

    });

    $(document).on('click', '.season_middle_btn', function() {

        var container = $(this).closest('.sortable-container');

        var season_id = container.attr('index') | 0;

        var prev_id = (season_id - 1) % window.static_data.seasons.data.length
        if (prev_id < 0) prev_id += window.static_data.seasons.data.length

        var next_id = (season_id + 1) % window.static_data.seasons.data.length;

        var prev_season = window.static_data.seasons.data[prev_id];
        var next_season = window.static_data.seasons.data[next_id];

        if (window.static_data.seasons.global_settings.periodic_seasons) {

            var season_length = window.static_data.seasons.data[prev_id].duration + window.static_data.seasons.data[prev_id].transition_length + window.static_data.seasons.data[season_id].duration + window.static_data.seasons.data[season_id].transition_length;
            var target = window.static_data.seasons.data[prev_id].duration + window.static_data.seasons.data[prev_id].transition_length;
            var perc = target / season_length;

        } else {

            let prev_season = window.static_data.seasons.data[prev_id];
            let curr_season = window.static_data.seasons.data[season_id];
            let next_season = window.static_data.seasons.data[next_id];

            let prev_year = 2;
            if (prev_id > season_id) {
                prev_year--;
            }

            let next_year = 2;
            if (next_id < season_id) {
                next_year++;
            }

            let prev_day = evaluate_calendar_start(window.static_data, prev_year, prev_season.timespan, prev_season.day).epoch;
            let curr_day = evaluate_calendar_start(window.static_data, 2, curr_season.timespan, curr_season.day).epoch - prev_day;
            let next_day = evaluate_calendar_start(window.static_data, next_year, next_season.timespan, next_season.day).epoch - prev_day;

            var perc = curr_day / next_day;

        }

        if (window.static_data.clock.enabled) {

            var prev_sunrise = prev_season.time.sunrise.hour + (prev_season.time.sunrise.minute / window.static_data.clock.minutes);
            var next_sunrise = next_season.time.sunrise.hour + (next_season.time.sunrise.minute / window.static_data.clock.minutes);

            var middle = lerp(prev_sunrise, next_sunrise, perc)

            var sunrise_h = Math.floor(middle)
            var sunrise_m = Math.floor(fract(middle) * window.static_data.clock.minutes)

            container.find("input[clocktype='sunrise_hour']").val(sunrise_h)
            container.find("input[clocktype='sunrise_minute']").val(sunrise_m)

            window.static_data.seasons.data[season_id].time.sunrise.hour = sunrise_h;
            window.static_data.seasons.data[season_id].time.sunrise.minute = sunrise_m;

            var prev_sunset = prev_season.time.sunset.hour + (prev_season.time.sunset.minute / window.static_data.clock.minutes);
            var next_sunset = next_season.time.sunset.hour + (next_season.time.sunset.minute / window.static_data.clock.minutes);

            var middle = lerp(prev_sunset, next_sunset, perc)

            var sunset_h = Math.floor(middle)
            var sunset_m = Math.floor(fract(middle) * window.static_data.clock.minutes)

            container.find("input[clocktype='sunset_hour']").val(sunset_h)
            container.find("input[clocktype='sunset_minute']").val(sunset_m)

            window.static_data.seasons.data[season_id].time.sunset.hour = sunset_h;
            window.static_data.seasons.data[season_id].time.sunset.minute = sunset_m;

            for (let location_index in window.static_data.seasons.locations) {
                let location = window.static_data.seasons.locations[location_index];
                if (location.settings.season_based_time) {
                    location.seasons[season_id].time["sunrise"]["hour"] = sunrise_h;
                    location.seasons[season_id].time["sunrise"]["minute"] = sunrise_m;
                    location.seasons[season_id].time["sunset"]["hour"] = sunset_h;
                    location.seasons[season_id].time["sunset"]["minute"] = sunset_m;
                    location_list.children().eq(location_index).find(`input[clocktype="sunrise_hour"]`).val(sunrise_h);
                    location_list.children().eq(location_index).find(`input[clocktype="sunrise_minute"]`).val(sunrise_m);
                    location_list.children().eq(location_index).find(`input[clocktype="sunset_hour"]`).val(sunset_h);
                    location_list.children().eq(location_index).find(`input[clocktype="sunset_minute"]`).val(sunset_m);
                }
            }
        }

        do_error_check('seasons');

    });

    $(document).on('change', '.season_based_time', function() {
        let checked = $(this).is(':checked');
        if (checked) {
            $(this).closest('.sortable-container').find('.location_season').each(function(season_index) {
                $(this).find('.clock_inputs input').each(function() {
                    let [type, time] = $(this).attr('clocktype').split('_');
                    $(this).val(window.static_data.seasons.data[season_index].time[type][time]).change();
                }).prop('disabled', true);
            });
        } else {
            $(this).closest('.sortable-container').find('.location_season').each(function(season_index) {
                $(this).find('.clock_inputs input').prop('disabled', false).change();
            });
        }
    });

    $(document).on('change', '.season_time', function() {

        let index = $(this).closest('.sortable-container').attr('index');

        let [type, time] = $(this).attr('clocktype').split('_');

        let value = $(this).val();

        for (let location_index in window.static_data.seasons.locations) {
            let location = window.static_data.seasons.locations[location_index];
            if (location.settings.season_based_time) {
                location.seasons[index].time[type][time] = Number(value);
                location_list.children().eq(location_index).find(`input[clocktype="${$(this).attr('clocktype')}"]`).val(Number(value));
            }
        }

    });


    $('.add_inputs.cycle .add').click(function() {

        var id = cycle_sortable.children().length;
        var stats = {
            'length': 1,
            'offset': 0,
            'names': ["Name 1"]
        };

        if (window.static_data.cycles === undefined) {
            window.static_data.cycles = {
                format: $('#cycle_format').val(),
                data: []
            };
        }
        window.static_data.cycles.data.push(stats);
        add_cycle_to_sortable(cycle_sortable, id, stats);
        do_error_check();

        if ($('#cycle_format').val() == "") {
            $('#cycle_format').val("Cycle {{1}}").change();
        }

    });


    $('.add_inputs.eras .add').click(function() {

        var id = era_list.children().length;

        var name = $('#era_name_input');

        var name_val = name.val() == "" ? `Era ${id + 1}` : name.val();

        var stats = {
            "name": name_val,
            "formatting": "",
            "description": "",
            "settings": {
                "show_as_event": false,
                "use_custom_format": false,
                "starting_era": false,
                "event_category_id": -1,
                "ends_year": false,
                "restart": false
            },
            "date": {
                "year": window.dynamic_data.year,
                "timespan": window.dynamic_data.timespan,
                "day": window.dynamic_data.day,
                "epoch": window.dynamic_data.epoch
            }
        };

        if (window.static_data.eras === undefined) {
            window.static_data.eras = [];
        }

        window.static_data.eras.push(stats);
        var era = add_era_to_list(era_list, id, stats);
        repopulate_timespan_select(era.find('.timespan-list'), window.dynamic_data.timespan, false);
        repopulate_day_select(era.find('.timespan-day-list'), window.dynamic_data.day, false);
        reindex_era_list();
        name.val("");
        do_error_check("eras");
        window.dynamic_data.current_era = get_current_era(window.static_data, window.dynamic_data.epoch);

    });

    $(document).on('click', '.html_edit', function() {
        let era_id = $(this).closest('.sortable-container').attr('index') | 0;
        window.dispatchEvent(new CustomEvent('html-editor-modal-edit-html', { detail: { era_id: era_id } }));
    });

    $('.add_inputs.event_categories .add').click(function() {

        var name = $('#event_category_name_input');

        var sort_by = window.event_categories.length;

        var name_val = name.val() == "" ? `Category ${sort_by + 1}` : name.val();

        var slug = slugify(name_val);

        var stats = {
            "name": name_val,
            "category_settings": {
                "hide": false,
                "player_usable": false
            },
            "event_settings": {
                "color": "Dark-Solid",
                "text": "text",
                "hide": false,
                "print": false
            },
            "calendar_id": typeof window.calendar_id != "undefined" ? window.calendar_id : null,
            "id": slug
        };

        add_category_to_list(event_category_list, sort_by, stats);

        window.event_categories[sort_by] = stats;

        repopulate_event_category_lists();

        name.val('');

        do_error_check();

    });

    $(document).on('change', '.category_name_input', function() {

        let new_name = $(this).val();

        let category_index = $(this).closest('.sortable-container').attr('index') | 0;

        window.event_categories[category_index].name = new_name;

        if (isNaN(window.event_categories[category_index].id)) {
            let slug = slugify(new_name);

            for (let index in window.events) {
                if (window.events[index].event_category_id == window.event_categories[category_index].id) {
                    window.events[index].event_category_id = slug;
                }
            }

            var default_event_category = window.static_data.settings.default_category !== undefined ? window.static_data.settings.default_category : -1;
            if (default_event_category == window.event_categories[category_index].id) {
                window.static_data.settings.default_category = slug;
            }

            window.event_categories[category_index].id = slug;
        }

        repopulate_event_category_lists();

        do_error_check();

    });

    $('#default_event_category').change(function() {
        let new_default_event_category = $(this).val();
        if (isNaN(new_default_event_category)) {
            let slug = slugify(new_default_event_category);
            window.static_data.settings.default_category = slug;
        } else {
            window.static_data.settings.default_category = new_default_event_category;
        }
        evaluate_save_button();
    });

    $(document).on('click', '.btn_remove', function() {

        if (!$(this).hasClass('disabled')) {

            var parent = $(this).parent().parent().parent();

            if ($(this).parent().parent().hasClass('expanded')) {
                $(this).parent().prev().find('.expand').click();
            }

            if (removing !== null) {
                removing.click();
            }
            removing = $(this).next();
            $(this).parent().parent().find('.main-container').addClass('hidden');
            $(this).parent().parent().find('.collapse-container').addClass('hidden');
            $(this).css('display', 'none');
            $(this).prev().css('display', 'block');
            $(this).next().css('display', 'block');
            $(this).next().next().css('display', 'block');

        }

    });

    $(document).on('click', '.btn_cancel', function() {
        $(this).parent().parent().find('.main-container').removeClass('hidden');
        $(this).parent().parent().find('.collapse-container').removeClass('hidden');
        $(this).css('display', 'none');
        $(this).prev().prev().css('display', 'none');
        $(this).prev().css('display', 'block');
        $(this).next().css('display', 'none');
        removing = null;
    });

    $(document).on('click', '.btn_accept', function() {

        var parent = $(this).closest('.sortable-container').parent();
        var type = parent.attr('id');
        var index = $(this).closest('.sortable-container').attr('index') | 0;

        var callback = false;

        switch (type) {
            case "timespan_sortable":
                $(this).closest('.sortable-container').remove();
                // $(this).closest('.sortable-container').parent().sortable('refresh');
                reindex_timespan_sortable();
                window.dynamic_date_manager.cap_timespan();
                window.dynamic_data.timespan = window.dynamic_date_manager.timespan;
                window.dynamic_data.epoch = window.dynamic_date_manager.epoch;
                recalc_stats();
                break;

            case "global_week_sortable":
                $(this).closest('.sortable-container').remove();
                // $(this).closest('.sortable-container').parent().sortable('refresh');
                reindex_weekday_sortable();
                break;

            case "season_sortable":
                $(this).closest('.sortable-container').remove();
                // $(this).closest('.sortable-container').parent().sortable('refresh');
                type = 'seasons';
                reindex_season_sortable(index);
                reindex_location_list();
                $('#season_color_enabled').prop("disabled", window.static_data.seasons.data.length == 0);
                if (window.static_data.seasons.data.length == 0) {
                    $('#season_color_enabled').prop("checked", false).change();
                }
                break;

            case "location_list":
                $(this).closest('.sortable-container').remove();
                // $(this).closest('.sortable-container').parent().sortable('refresh');
                type = 'seasons';
                reindex_location_list();
                break;

            case "cycle_sortable":
                $(this).closest('.sortable-container').remove();
                // $(this).closest('.sortable-container').parent().sortable('refresh');
                reindex_cycle_sortable();
                break;

            case "moon_list":
                $(this).closest('.sortable-container').remove();
                // $(this).closest('.sortable-container').parent().sortable('refresh');
                reindex_moon_list();
                break;

            case "era_list":
                $(this).closest('.sortable-container').remove();
                // $(this).closest('.sortable-container').parent().sortable('refresh');
                reindex_era_list();
                window.dynamic_data.current_era = get_current_era(window.static_data, window.dynamic_data.epoch);
                break;

            case "event_category_list":
                $(this).closest('.sortable-container').remove();
                // $(this).closest('.sortable-container').parent().sortable('refresh');

                var category = window.event_categories[index];

                for (var event in window.events) {
                    if (window.events[event].category == category.id) {
                        window.events[event].category = -1;
                    }
                }

                for (var era in window.static_data.eras) {
                    if (window.static_data.eras[era].settings.event_category_id == index) {
                        window.static_data.eras[era].settings.event_category_id = -1;
                    }
                }

                reindex_event_category_list();
                window.event_categories = window.event_categories.filter(function(category) { return category; });
                repopulate_event_category_lists();

                window.dispatchEvent(new CustomEvent("events-changed"));

                break;

            case "leap_day_list":
                $(this).closest('.sortable-container').remove();
                // $(this).closest('.sortable-container').parent().sortable('refresh');
                window.static_data.year_data.leap_days.splice(index, 1)
                window.dynamic_data.epoch = window.dynamic_date_manager.epoch;
                reindex_leap_day_list();
                recalc_stats();
                break;

        }

        if (!callback) {

            evaluate_remove_buttons();

            do_error_check(type);

            removing = null;

            input_container.change();

        }

    });

    /* ------------------- Custom callbacks ------------------- */


    $(document).on('change', '.moon_inputs .cycle', function() {

        var index = $(this).closest('.sortable-container').attr('index') | 0;

        var cycle = $(this).val() | 0;

        window.static_data.moons[index].granularity = get_moon_granularity(cycle);

    });

    $(document).on('change', '.custom_phase', function() {

        var checked = $(this).is(':checked');

        var index = $(this).closest('.sortable-container').attr('index') | 0;

        $(this).closest('.sortable-container').find('.no_custom_phase_container').toggleClass('hidden', checked);
        $(this).closest('.sortable-container').find('.custom_phase_container').toggleClass('hidden', !checked);

        if (checked) {

            var value = "";

            for (var i = 0; i < window.static_data.moons[index].granularity - 1; i++) {
                value += `${i},`
            }

            value += `${i}`

            delete window.static_data.moons[index].cycle;
            delete window.static_data.moons[index].shift;

            $(this).closest('.sortable-container').find('.custom_cycle').val(value).change();

        } else {

            var strings = $(this).closest('.sortable-container').find('.custom_cycle').val().split(',');

            var cycle = (strings.length | 0);

            var offset = (strings[0] | 0);

            $(this).closest('.sortable-container').find('.cycle').val(cycle).change();
            $(this).closest('.sortable-container').find('.shift').val(offset).change();

            delete window.static_data.moons[index].custom_cycle;
        }

    });



    $(document).on('keyup', '.custom_cycle', function(e) {

        $(this).val($(this).val().replace(/[`!+~@#$%^&*()_|\-=?;:'".<>\{\}\[\]\\\/A-Za-z ]/g, '').replace(/,{2,}/g, ","));

    });

    $(document).on('change', '.custom_cycle', function(e) {

        $(this).val($(this).val().replace(/[`!+~@#$%^&*()_|\-=?;:'".<>\{\}\[\]\\\/A-Za-z ]/g, '').replace(/,{2,}/g, ","));

        var value = $(this).val();

        var index = $(this).closest('.sortable-container').attr('index') | 0;

        var cycle = Math.max.apply(null, value.split(',')) + 1;

        var invalid = cycle > 40;

        $(this).toggleClass('invalid', invalid).attr('error_msg', invalid ? `${window.static_data.moons[index].name} has an invalid custom cycle. 39 is the highest possible number.` : '');

        if (!invalid) {

            if (cycle <= 4) {
                var granularity = 4;
            } else if (cycle <= 8) {
                var granularity = 8;
            } else if (cycle <= 16) {
                var granularity = 16;
            } else if (cycle <= 24) {
                var granularity = 24;
            } else {
                var granularity = 40;
            }

            window.static_data.moons[index].granularity = granularity;

            let text = `This moon has ${value.split(',').length} phases, with a granularity of ${window.static_data.moons[index].granularity} moon sprites.`;

            $(this).closest('.sortable-container').find('.custom_phase_text').text(text);

            do_error_check();

        }

    });

    $(document).on('click', '.moon_shift_back, .moon_shift_forward', function(e) {

        if ($(this).hasClass('invalid')) return;

        var value = $(this).closest('.sortable-container').find('.custom_cycle').val().split(',');

        if ($(this).hasClass('moon_shift_back')) {

            value = [...value.slice(value.length - 1), ...value.slice(0, value.length - 1)];

        } else {

            value = [...value.slice(1, value.length), ...value.slice(0, 1)];

        }

        var value = value.join(',');

        $(this).closest('.sortable-container').find('.custom_cycle').val(value);

        do_custom_cycle_change($(this).closest('.sortable-container').find('.custom_cycle'));

    });

    var do_custom_cycle_change = debounce(function(element) {
        element.change();
    }, 350);


    $(document).on('change', '.leap-day .timespan-list', function() {
        repopulate_weekday_select($(this).closest('.sortable-container').find('.week-day-select'));
    });

    $(document).on('change', '.adds-week-day', function() {
        var container = $(this).closest('.sortable-container');
        var checked = $(this).is(':checked');
        container.find('.week_day_select_container').toggleClass('hidden', !checked);
        container.find('.adds_week_day_data_container').toggleClass('hidden', !checked);
        container.find('.adds_week_day_data_container input, .adds_week_day_data_container select').prop('disabled', !checked);
        container.find('.week-day-select').toggleClass('inclusive', checked).prop('disabled', !checked);
        $('#first_week_day_container').toggleClass('hidden', !checked).find('select').prop('disabled', !checked);
        repopulate_weekday_select($(this).closest('.sortable-container').find('.week-day-select'));
        container.find('.internal-list-name').change();
        evaluate_custom_weeks();
    });

    $('#month_overflow').change(function() {
        var checked = $(this).is(':checked');
        $('#first_week_day_container').toggleClass('hidden', !checked).find('select').prop('disabled', !checked);
    });

    $(document).on('change', '.unique-week-input', function() {
        var parent = $(this).closest('.sortable-container');
        var timespan_index = parent.attr('index');
        if ($(this).is(':checked')) {
            var element = [];
            window.static_data.year_data.timespans[timespan_index].week = [];
            for (index = 0; index < window.static_data.year_data.global_week.length; index++) {
                window.static_data.year_data.timespans[timespan_index].week.push(window.static_data.year_data.global_week[index]);
                element.push(`<input type='text' class='form-control internal-list-name dynamic_input custom_week_day' data='year_data.timespans.${timespan_index}.week' fc-index='${index}'/>`);
            }
            parent.find(".week_list").html(element).parent().parent().removeClass('hidden');
            parent.find(".week_list").children().each(function(i) {
                $(this).val(window.static_data.year_data.global_week[i])
            });

            parent.find(".week-length").prop('disabled', false).val(window.static_data.year_data.global_week.length);
            parent.find(".weekday_quick_add").prop('disabled', false);
        } else {
            parent.find(".week_list").html('').parent().parent().addClass('hidden');
            parent.find(".week-length").prop('disabled', true).val(0);
            parent.find(".weekday_quick_add").prop('disabled', true);
            delete window.static_data.year_data.timespans[timespan_index].week;
            do_error_check();
        }

        evaluate_custom_weeks();

    });

    $(document).on('click', '.weekday_quick_add', function() {

        var container = $(this).closest('.sortable-container');
        var week_day_list = container.find('.week_list');

        var id = (container.attr('index') | 0);

        var timespan = window.static_data.year_data.timespans[id];

        swal.fire({
            title: "Weekday Names",
            text: "Each line entered below creates one week day in this month.",
            input: "textarea",
            inputValue: timespan.week.join('\n'),
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Okay',
            icon: "info"
        }).then((result) => {

            if (result.dismiss) return;

            if (result.value === "") {
                swal.fire({
                    title: "Error",
                    text: "You didn't enter any values!",
                    icon: "warning"
                });
            }

            var weekdays = result.value.split('\n');

            timespan.week = weekdays;

            container.find('.week-length').val(weekdays.length);

            week_day_list.empty();

            var element = [];
            for (i = 0; i < timespan.week.length; i++) {
                element.push(`<input type='text' class='form-control internal-list-name custom_week_day dynamic_input' data='year_data.timespans.${index}.week' fc-index='${i}'/>`);
            }

            week_day_list.append(element.join(""));
            week_day_list.children().each(function(i) {
                $(this).val(timespan.week[i])
            });

            do_error_check('calendar');

        });

    });

    $(document).on('change', '.show_as_event', function() {
        var parent = $(this).closest('.sortable-container');
        var index = parent.attr('index') | 0;
        if ($(this).is(':checked')) {
            parent.find('.era_description').parent().parent().removeClass('hidden');
            parent.find('.event-category-list').parent().parent().parent().removeClass('hidden');
            parent.find('.event-category-list').prop('disabled', false).val(-1).change();
        } else {
            parent.find('.era_description').parent().parent().addClass('hidden');
            parent.find('.event-category-list').parent().parent().parent().addClass('hidden');
            parent.find('.event-category-list').prop('disabled', true);
            delete window.static_data.eras[index].settings.event_category_id;
        }
    });

    $(document).on('change', '.restart_era', function() {
        let parent = $(this).closest('.sortable-container');
        let index = parent.attr('index') | 0;
        let checked = $(this).is(':checked')
        if (!window.static_data.eras[index].settings.use_custom_format) {
            let text = "";
            if (checked) {
                text = 'Era year {{era_year}} (year {{year}}) - {{era_name}}';
            } else {
                text = 'Year {{era_year}} - {{era_name}}';
            }
            parent.find('.era_formatting').val(text).change();
        }
    });

    $(document).on('change', '.use_custom_format', function() {
        var parent = $(this).closest('.sortable-container');
        var index = parent.attr('index') | 0;
        if (window.static_data.eras[index].settings.restart) {
            var text = 'Era year {{era_year}} (year {{year}}) - {{era_name}}';
        } else {
            var text = 'Year {{era_year}} - {{era_name}}';
        }
        parent.find('.era_formatting').prop('disabled', !$(this).is(':checked')).val(text).change();
    });

    $(document).on('change', '.starting_era', function() {

        var changed_era = $(this);

        era_list.children().each(function(i) {
            if ($(this).find('.starting_era')[0] != changed_era[0] && $(this).find('.starting_era').is(':checked')) {
                $(this).find('.starting_era').prop('checked', false);
                $(this).find('.starting_era').closest('.sortable-container').find('.date_control_container').removeClass('hidden');
                window.static_data.eras[i].settings.starting_era = false;
            }
        });

        if (changed_era.is(':checked')) {
            changed_era.closest('.sortable-container').find('.date_control_container').addClass('hidden');
        } else {
            changed_era.closest('.sortable-container').find('.date_control_container').removeClass('hidden');
        }

        reindex_era_list();

        window.dynamic_data.current_era = get_current_era(window.static_data, window.dynamic_data.epoch);

    });


    $(document).on('change', '#era_list .date_control', function() {
        debounce_era_reindex();
    });

    const debounce_era_reindex = debounce(function() {
        reindex_era_list();
        window.dynamic_data.current_era = get_current_era(window.static_data, window.dynamic_data.epoch);
    }, 50)

    $(document).on('change', '#era_list .ends_year', function() {
        evaluate_dynamic_change();
        var index = $(this).closest('.sortable-container').attr('index') | 0;
        window.static_data.eras[index].settings.ends_year = $(this).is(":checked");
        for (var i in window.static_data.eras) {
            var era = window.static_data.eras[i];
            era.date.epoch = evaluate_calendar_start(window.static_data, convert_year(window.static_data, era.date.year), era.date.timespan, era.date.day).epoch;
        }
        window.dynamic_data.current_era = get_current_era(window.static_data, window.dynamic_data.epoch);
        window.dynamic_date_manager = new date_manager(window.dynamic_data.year, window.dynamic_data.timespan, window.dynamic_data.day);
    });

    $(document).on('change', '#era_list .starting_era', function() {
        evaluate_dynamic_change();
        var index = $(this).closest('.sortable-container').attr('index') | 0;
        window.static_data.eras[index].settings.ends_year = $(this).is(":checked");
        for (var i in window.static_data.eras) {
            var era = window.static_data.eras[i];
            era.date.epoch = evaluate_calendar_start(window.static_data, convert_year(window.static_data, era.date.year), era.date.timespan, era.date.day).epoch;
        }
        window.dynamic_data.current_era = get_current_era(window.static_data, window.dynamic_data.epoch);
        window.dynamic_date_manager = new date_manager(window.dynamic_data.year, window.dynamic_data.timespan, window.dynamic_data.day);
    });

    $(document).on('click', '.preview_era_date', function() {
        let era_id = $(this).closest('.sortable-container').attr('index') | 0;
        let era = window.static_data.eras[era_id];
        set_preview_date(era.date.year, era.date.timespan, era.date.day, era.date.epoch)
    });


    $(document).on('change', '#season_sortable .date_control', function() {
        season_debounce();
    });

    const season_debounce = debounce(function() {
        reindex_season_sortable();
    }, 50);

    $(document).on('change', '#season_color_enabled', function() {

        var checked = $(this).is(":checked");

        let colors = []
        for (let index = 0; index < window.static_data.seasons.data.length; index++) {
            colors.push([])
            if (index == 0) {
                colors[index][0] = get_colors_for_season(window.static_data.seasons.data[index].name);
                colors[index][1] = get_colors_for_season(window.static_data.seasons.data[index + 1].name);
            } else if (index == window.static_data.seasons.data.length - 1) {
                colors[index][0] = clone(colors[index - 1][1]);
                colors[index][1] = clone(colors[0][0]);
            } else {
                colors[index][0] = clone(colors[index - 1][1])
                colors[index][1] = get_colors_for_season(window.static_data.seasons.data[index + 1].name);
            }
        }

        season_sortable.children().each(function(i) {

            if (checked) {

                window.static_data.seasons.data[i].color = clone(colors[i]);

                // $(this).find('.season_color_enabled').find('.start_color').spectrum("set", window.static_data.seasons.data[i].color[0]);
                // $(this).find('.season_color_enabled').find('.end_color').spectrum("set", window.static_data.seasons.data[i].color[1]);

            } else {
                delete window.static_data.seasons.data[i].color;
            }

            $(this).find('.season_color_enabled').toggleClass("hidden", !checked);
            $(this).find('.season_color_enabled input').prop("disabled", !checked);
        });

        do_error_check();

    });

    $(document).on('change', '.week-length', function() {

        var parent = $(this).closest('.sortable-container');
        var week_list = parent.find('.week_list');
        var timespan_index = parent.attr('index');

        var new_val = ($(this).val() | 0);
        var current_val = (week_list.children().length | 0);

        if (new_val < 1) {
            $(this).val(current_val);
            return;
        }

        if (new_val > current_val) {
            var element = [];
            for (index = current_val; index < new_val; index++) {
                window.static_data.year_data.timespans[timespan_index].week.push(`Week day ${(index + 1)}`);
                element.push(`<input type='text' class='form-control internal-list-name custom_week_day dynamic_input' data='year_data.timespans.${index}.week' fc-index='${index}' value='Week day ${(index + 1)}'/>`);
            }
            week_list.append(element.join(""));
        } else if (new_val < current_val) {
            window.static_data.year_data.timespans[timespan_index].week = window.static_data.year_data.timespans[timespan_index].week.slice(0, new_val);
            week_list.children().slice(new_val).remove();
        }

        evaluate_custom_weeks();

    });

    $(document).on('change', '.custom_week_day', function() {

        populate_first_day_select();

    });


    $(document).on('change', '.cycle-name-length', function() {
        var parent = $(this).closest('.sortable-container');
        var cycle_index = parent.attr('index');
        var cycle_list = parent.find(".cycle_list");
        var new_val = ($(this).val() | 0);
        var current_val = (parent.find(".cycle_list").children().length | 0);
        if (new_val > current_val) {
            var element = [];
            for (index = current_val; index < new_val; index++) {
                element.push(`<input type='text' class='form-control internal-list-name dynamic_input' data='cycles.data.${cycle_index}.names' fc-index='${index}' value='Name ${(index + 1)}'/>`);
            }
            cycle_list.append(element.join(""));
            cycle_list.find(".internal-list-name").first().change();
        } else if (new_val < current_val) {
            cycle_list.children().slice(new_val).remove();
            cycle_list.find(".internal-list-name").first().change();
        }
    });

    $(document).on('click', '.cycle_quick_add', function() {

        var container = $(this).closest('.sortable-container');
        var cycle_name_list = container.find('.cycle_list');

        var id = (container.attr('index') | 0);

        var cycle = window.static_data.cycles.data[id];

        swal.fire({
            title: "Cycle Names",
            text: "Each line entered below creates one name in the cycle list.",
            input: "textarea",
            inputValue: cycle.names.join('\n'),
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Okay',
            icon: "info"
        }).then((result) => {

            if (result.dismiss) return;

            if (result.value === "") {
                swal.fire({
                    title: "Error",
                    text: "You didn't enter any values!",
                    icon: "warning"
                });
            }

            var names = result.value.split('\n');

            cycle.names = names;

            container.find('.cycle-name-length').val(names.length);

            cycle_name_list.empty();

            var element = [];
            for (i = 0; i < cycle.names.length; i++) {
                element.push(`<input type='text' class='form-control internal-list-name dynamic_input' data='cycles.data.${index}.names' fc-index='${i}'/>`);
            }

            cycle_name_list.append(element.join(""));
            cycle_name_list.children().each(function(i) {
                $(this).val(cycle.names[i]);
            })

            do_error_check('calendar');

        });

    });

    $(document).on('focusin', '.timespan_occurance_input', function(e) {
        $(this).data('prev', $(this).val());
    });

    $(document).on('change', '.timespan_occurance_input', function(e) {

        var interval = $(this).closest('.sortable-container').find('.interval');
        var interval_val = interval.val() | 0;
        var offset = $(this).closest('.sortable-container').find('.offset');
        var offset_val = offset.val() | 0;

        if (interval_val === undefined || offset_val === undefined) return;

        if (interval_val > 1) {
            offset.prop('disabled', false);
        } else {
            offset.prop('disabled', true).val(0);
        }

        var data = {
            'interval': interval_val,
            'offset': offset_val
        }

        $(this).closest('.sortable-container').find('.timespan_variance_output').html(get_interval_text(true, data));

        $('.leap_day_occurance_input').change();

        window.dynamic_date_manager.cap_timespan();
        window.dynamic_data.timespan = window.dynamic_date_manager.timespan;
        window.dynamic_data.epoch = window.dynamic_date_manager.epoch;

    });

    $(document).on('keyup', '.leap_day_occurance_input', function() {
        var interval = $(this).closest('.sortable-container').find('.interval');
        interval.val(interval.val().replace(/[ `~@#$%^&*()_|\-=?;:'".<>\{\}\[\]\\\/A-Za-z]/g, ""));
    });

    function sorter(a, b) {
        if (a < b) return -1;  // any negative number works
        if (a > b) return 1;   // any positive number works
        return 0; // equal values MUST yield zero
    }


    $(document).on('change', '.leap_day_occurance_input', function(e) {

        var index = $(this).closest('.sortable-container').attr('index') | 0;
        var interval = $(this).closest('.sortable-container').find('.interval');
        var interval_val = interval.val();
        var offset = $(this).closest('.sortable-container').find('.offset');
        var offset_val = (offset.val() | 0);
        var timespan = $(this).closest('.sortable-container').find('.timespan-list');
        var timespan_val = timespan.val();

        interval_val = interval_val.replace(/,\s*$/, "");

        if (offset_val === undefined || interval_val === undefined) return;

        if (interval_val == "") {
            interval.toggleClass('invalid', true).attr('error_msg', true ? `${window.static_data.year_data.leap_days[index].name} interval is empty, please enter at least one number.` : '');
            return;
        }

        if (interval_val == "0") {
            interval.toggleClass('invalid', true).attr('error_msg', true ? `${window.static_data.year_data.leap_days[index].name}'s interval is 0, please enter a positive number.` : '');
            return;
        }

        if (offset_val < 0) {
            offset.toggleClass('invalid', true).attr('error_msg', true ? `${window.static_data.year_data.leap_days[index].name} cannot have a negative offset number.` : '');
            return;
        }

        var global_regex = /[ `~@#$%^&*()_|\-=?;:'".<>\{\}\[\]\\\/A-Za-z]/g;
        var local_regex = /^\+*\!*[1-9]+[0-9]{0,}$/;
        var numbers_regex = /([1-9]+[0-9]{0,})/;

        var invalid = global_regex.test(interval_val);
        var values = interval_val.split(',');

        $(this).toggleClass('invalid', invalid).attr('error_msg', invalid ? `${window.static_data.year_data.leap_days[index].name} has an invalid interval formula.` : '');

        if (invalid) return;

        if ($(this).hasClass('interval')) {

            for (var i = 0; i < values.length; i++) {
                if (!local_regex.test(values[i])) {
                    invalid = true;
                    break;
                }
            }

            $(this).toggleClass('invalid', invalid).attr('error_msg', invalid ? `${window.static_data.year_data.leap_days[index].name} has an invalid interval formula. Plus before exclamation point.` : '');

            if (invalid) return;

            var unsorted = [];

            for (var i = 0; i < values.length; i++) {
                unsorted.push(Number(values[i].match(numbers_regex)[0]));
            }

            var sorted = unsorted.slice(0).sort(sorter).reverse();

            var result = [];

            for (var i = 0; i < sorted.length; i++) {
                var index = unsorted.indexOf(sorted[i]);
                result.push(values[index]);
                delete unsorted[index];
            }

            $(this).val(result.join(','));

            values = result;

        } else {

            var unsorted = [];

            for (var i = 0; i < values.length; i++) {
                unsorted.push(Number(values[i].match(numbers_regex)[0]));
            }

            var sorted = unsorted.slice(0).sort(sorter).reverse();
            var result = [];

            for (var i = 0; i < sorted.length; i++) {
                var index = unsorted.indexOf(sorted[i]);
                result.push(values[index]);
                delete unsorted[index];
            }

            values = result;

        }

        var values = values.reverse();
        sorted = sorted.reverse();

        if (values.length == 1 && Number(values[0]) == 1) {
            offset.val(0).prop('disabled', true);
        } else {
            offset.prop('disabled', false);
        }

        var data = {
            'interval': interval_val,
            'offset': offset_val,
            'timespan': timespan_val
        }

        $(this).toggleClass('invalid', false).attr('error_msg', '');

        $(this).closest('.sortable-container').find('.leap_day_variance_output').html(get_interval_text(false, data));

        window.dynamic_data.epoch = window.dynamic_date_manager.epoch;

        do_error_check();

    });

    $(document).on('change', '.timespan_length', function() {
        var index = $(this).closest('.sortable-container').attr('index') | 0;
        repopulate_day_select($(`.timespan-day-list`), undefined, undefined, undefined, undefined, index);
        window.dynamic_data.epoch = evaluate_calendar_start(window.static_data, convert_year(window.static_data, window.dynamic_data.year), window.dynamic_data.timespan, window.dynamic_data.day).epoch;
        preview_date.epoch = evaluate_calendar_start(window.static_data, convert_year(window.static_data, preview_date.year), preview_date.timespan, preview_date.day).epoch;
    });

    $('#enable_weather').change(function() {
        var checked = $(this).prop('checked');
        window.static_data.seasons.global_settings.enable_weather = checked;
        $('.weather_inputs').toggleClass('hidden', !checked);
        $('.weather_inputs').find('select, input').prop('disabled', !checked);
        $('.location_middle_btn').toggleClass('hidden', (!window.static_data.seasons.global_settings.enable_weather && !window.static_data.clock.enabled) || window.static_data.seasons.data.length < 3);

        var no_locations = (window.static_data.seasons.data.length == 0 || !window.static_data.seasons.global_settings.enable_weather) && !window.static_data.clock.enabled;
        $('#locations_warning_hidden').toggleClass('hidden', no_locations).find('select, input').prop('disabled', no_locations);
        $('#locations_warning').toggleClass('hidden', !no_locations);

        repopulate_location_select_list();
    });

    $(document).on('change', '.year-input', function() {
        repopulate_timespan_select($(this).closest('.date_control').find('.timespan-list'));
        repopulate_day_select($(this).closest('.date_control').find('.timespan-day-list'))
    });

    $(document).on('change', '.timespan-list', function() {
        repopulate_day_select($(this).closest('.date_control').find('.timespan-day-list'))
    });

    $('#reseed_seasons').click(function() {
        $('#seasons_seed').val(Math.abs((Math.random().toString().substr(7) | 0))).change();
    });


    $(document).on('change', '.sortable-container.leap-day', function() {

        var changed_timespan = $(this).find('.timespan-list');
        var changed_days = $(this).find('.timespan-day-list');

        $('.timespan-list').each(function() {
            repopulate_timespan_select($(this), $(this).val(), changed_timespan == $(this));
        });

        $('.timespan-day-list').each(function() {
            repopulate_day_select($(this), $(this).val(), changed_days == $(this));
        });

        window.dynamic_data.epoch = evaluate_calendar_start(window.static_data, convert_year(window.static_data, window.dynamic_data.year), window.dynamic_data.timespan, window.dynamic_data.day).epoch;
        preview_date.epoch = evaluate_calendar_start(window.static_data, convert_year(window.static_data, preview_date.year), preview_date.timespan, preview_date.day).epoch;

    });




    $('#temp_sys').change(function() {

        var new_val = $(this).val();
        var old_val = window.static_data.seasons.global_settings.temp_sys;

        if ((new_val == "metric" || new_val == "both_m") && (old_val == "imperial" || old_val == "both_i")) {

            $('input[fc-index="temp_low"], input[fc-index="temp_high"]').each(function() {

                var val = $(this).val() | 0;

                $(this).val(precisionRound(fahrenheit_to_celcius(val), 4));

            }).change();

        } else if ((new_val == "imperial" || new_val == "both_i") && (old_val == "metric" || old_val == "both_m")) {

            $('input[fc-index="temp_low"], input[fc-index="temp_high"]').each(function() {

                var val = $(this).val() | 0;

                $(this).val(precisionRound(celcius_to_fahrenheit(val), 4)).change;

            }).change();

        }

    })

    $(document).on('change', '.invalid', function() {
        if ($(this).val() !== null) {
            $(this).removeClass('invalid');
        }
    });

    $(document).on('change', '.season-duration', function() {
        evaluate_season_lengths();
        evaluate_season_daylength_warning();
        rebuild_climate();
    });


    $(document).on('change', '.season .name-input', function() {
        populate_preset_season_list();
    });

    $(document).on('focusin', '.preset-season-list', function(e) {
        $(this).data('prev', $(this).val());
    });

    $(document).on('change', '.preset-season-list', function() {
        evaluate_clashing_preset_seasons($(this));
        $(this).data('prev', $(this).val());
    });




    $('#refresh_calendar_list_select').click(function() {
        populate_calendar_lists();
    });

    $('#link_calendar').prop('disabled', true);

    calendar_link_select.change(function() {
        calendar_new_link_list.empty();
        if ($(this).val() != "None") {
            var calendar_hash = $(this).val();
            var calendar = window.owned_calendars[calendar_hash];
            add_link_to_list(calendar_new_link_list, calendar_new_link_list.children().length, false, calendar);
        }
    });

    $(document).on('click', '.link_calendar', function() {

        calendar_link_select.prop('disabled', true);

        var calendar_hash = $(this).attr('hash');

        var year = Number($(this).closest('.collapse-container').find('.year-input').val());
        year = convert_year(window.static_data, year);
        var timespan = Number($(this).closest('.collapse-container').find('.timespan-list').val());
        var day = Number($(this).closest('.collapse-container').find('.timespan-day-list').val());

        swal.fire({
            title: "Linking Calendar",
            html: "<p>Linking calendars will disable all structural inputs on both calendars (month lengths, week lengths, hours per day, minutes) so the link can be preserved. The link can be broken again at any point.</p>" +
                "<p>Are you sure you want link and save this calendar?</p>",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, link and save calendar',
            cancelButtonText: 'Leave unlinked',
            icon: "info"
        })
            .then((result) => {

                if (!result.dismiss) {

                    calendar_new_link_list.empty();

                    var date = [year, timespan, day];

                    var epoch_offset = evaluate_calendar_start(window.static_data, year, timespan, day).epoch;

                    link_child_calendar(calendar_hash, date, epoch_offset);

                } else {
                    calendar_link_select.prop('disabled', false);
                }

            })

    });

    $(document).on('click', '.unlink_calendar', function() {

        swal.fire({
            title: "Unlinking Calendar",
            html: "<p>Are you sure you want to break the link to this calendar?</p><p>This cannot be undone.</p>",
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, unlink',
            cancelButtonText: 'Leave linked',
            icon: "warning"
        })
            .then((result) => {

                if (!result.dismiss) {

                    var calendar_hash = $(this).attr('hash');

                    unlink_child_calendar(populate_calendar_lists, calendar_hash);

                }
            });
    });

    window.user_list_opened = false;

    $('#collapsible_users').change(function() {
        if (!window.user_list_opened) {
            set_up_user_list();
        }
    });

    $('#refresh_calendar_users').click(function() {

        var button = $(this);
        button.prop('disabled', true);
        set_up_user_list();

        setTimeout(() => {
            button.prop('disabled', false);
        }, 2000);

    });

    $('#email_input').on('keypress', function(e) {
        $('#btn_send_invite').prop('disabled', false);

        if (e.which === 13) {
            $('#btn_send_invite').click();
        }
    });

    $('#btn_send_invite').click(function() {

        var email = $('#email_input').val();

        $(this).prop('disabled', true);

        let valid_email = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);

        $('#email_input').toggleClass('invalid', !valid_email);

        if (valid_email) {
            add_calendar_user(email, function(success, text) {
                $('.email_text').text(text).parent().toggleClass('hidden', text.length === 0);
                $('#email_input').toggleClass('invalid', !success);
                $('.email_text').toggleClass('alert-danger', !success);
                $('#btn_send_invite').prop('disabled', false);
                if (success) {
                    $('#email_input').val('');
                    set_up_user_list();
                }
            });
        } else {
            $(this).prop('disabled', false);
            $('.email_text').text(!valid_email ? "This email is invalid!" : "").toggleClass('alert-danger', !valid_email).parent().toggleClass('hidden', valid_email);
        }

        setTimeout(() => {
            $('.email_text').text("").parent().toggleClass('hidden', true);
        }, 5000);

    });

    $(document).on('click', '.update_user_permissions', function() {

        var button = $(this);
        var container = button.closest('.sortable-container');
        var dropdown = container.find('.user_permissions_select');

        button.prop('disabled', true);

        var user_id = button.attr('user_id');
        var permissions = dropdown.val();

        update_calendar_user(user_id, permissions, function(success, text) {

            button.prop('disabled', success);
            button.attr('permissions_val', permissions);

            container.find('.user_permissions_text').parent().toggleClass('hidden', false);
            container.find('.user_permissions_text').parent().toggleClass('error', !success);
            container.find('.user_permissions_text').text(text);

            setTimeout(() => {
                container.find('.user_permissions_text').parent().toggleClass('hidden', true);
                container.find('.user_permissions_text').text("");
            }, 5000);

        });


    });

    $(document).on('click', '.remove_user', function() {

        var user_name = $(this).attr('username');
        var user_role = $(this).attr('role');
        var user_id = $(this).attr('user_id') | 0;

        if (user_role != "invited") {

            swal.fire({
                title: "Removing User",
                html: `<p>Are you sure you want to remove <strong>${user_name}</strong> from this calendar?</p>`,
                input: 'checkbox',
                inputPlaceholder: 'Remove all of their contributions as well',
                inputClass: "form-control",
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, remove',
                cancelButtonText: 'Cancel',
                icon: "warning"
            })
                .then((result) => {

                    if (!result.dismiss) {

                        var remove_all = result.value == 1;

                        remove_calendar_user(user_id, remove_all, function() {
                            set_up_user_list();
                        });

                    }
                });

        } else {

            swal.fire({
                title: "Cancel Invititation",
                html: `<p>Are you sure you want to cancel the invitation for <strong>${user_name}</strong>?</p>`,
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, cancel it',
                cancelButtonText: 'Nah, leave it',
                icon: "warning"
            })
                .then((result) => {

                    if (!result.dismiss) {

                        remove_calendar_user(user_id, false, function() {
                            set_up_user_list();
                        }, user_name);

                    }
                });

        }

    });

    $(document).on('click', '.resend_invitation', function() {

        var button = $(this);
        var container = button.closest('.sortable-container');
        button.prop('disabled', true);

        var email = button.attr('user_email');

        resend_calendar_invite(email, function(success, text) {

            button.prop('disabled', success);

            container.find('.user_permissions_text').parent().toggleClass('hidden', false);
            container.find('.user_permissions_text').parent().toggleClass('error', !success);
            container.find('.user_permissions_text').text(text);

            setTimeout(() => {
                container.find('.user_permissions_text').parent().toggleClass('hidden', true);
                container.find('.user_permissions_text').text("");
            }, 5000);

        });

    });


    $('#apply_changes_btn').click(function() {

        var errors = get_errors();

        if (errors.length == 0 && $('.invalid').length == 0) {

            changes_applied = true;

            if (!preview_date.follow) {

                update_preview_calendar();

                pre_rebuild_calendar('preview', preview_date);

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

            if (!preview_date.follow) {

                update_preview_calendar();

                rebuild_calendar('preview', preview_date);

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

    input_container.change(function(e) {

        update_data(e);

    });


    document.addEventListener("advancement-changed", function(event) {
        advancement = event.detail.data;
        evaluate_save_button();
    });
}

function update_data(e) {
    if (block_inputs) return;

    if (e.originalEvent) {
        var target = $(e.originalEvent.target);
    } else {
        var target = $(e.target);
    }

    if (target.hasClass('invalid')) {
        return;
    }

    if (target.attr('class') !== undefined && target.attr('class').indexOf('dynamic_input') > -1) {

        var data = target.attr('data');
        var type = data.split('.');

        if (target.hasClass('category_dynamic_input')) {
            var current_calendar_data = window.event_categories[type[0]];
        } else {
            var current_calendar_data = window.static_data[type[0]];
        }

        for (var i = 1; i < type.length - 1; i++) {
            current_calendar_data = current_calendar_data[type[i]];
        }

        var key = target.attr('fc-index');

        if (type.includes('cycles') && type.includes('names')) {

            current_calendar_data[type[type.length - 1]] = [];

            target.closest('.cycle_list').children().each(function(i) {
                current_calendar_data[type[type.length - 1]][i] = $(this).val();
            });

        } else {

            var set = true;

            if (!target.is(':disabled')) {

                switch (target.attr('type')) {
                    case "number":
                        if (target.attr('step') === "any") {
                            var value = parseFloat(target.val());
                            var min = undefined;
                            var max = undefined;
                            if (target.attr('min')) {
                                var min = parseFloat(target.attr('min'));
                            }
                            if (target.attr('max')) {
                                var max = parseFloat(target.attr('max'));
                            }
                        } else {
                            var value = parseInt(target.val().split('.')[0]);
                            var min = undefined;
                            var max = undefined;
                            if (target.attr('min')) {
                                var min = parseInt(target.attr('min'));
                            }
                            if (target.attr('max')) {
                                var max = parseInt(target.attr('max'));
                            }
                        }
                        if (value < min || value > max) {
                            if (target.data('prev')) {
                                target.val(target.data('prev'));
                                return;
                            } else {
                                set = false;
                            }
                        }
                        target.val(value);
                        break;

                    case "checkbox":
                        var value = target.is(":checked");
                        break;

                    case "color":
                        var value = "#00CBFC"; // target.spectrum("get").toString();
                        break;

                    default:
                        var value = target.val();
                        break;
                }

                if (target.attr('class').indexOf('slider_input') > -1) {
                    value = value / 100;
                }

                if (type.length > 1) {
                    current_calendar_data = current_calendar_data[type[type.length - 1]];
                }

                if (set) current_calendar_data[key] = value;

            }
        }

        if (target.hasClass('category_dynamic_input')) {
            var key = type[0];
            for (var eventkey in window.events) {
                if (window.events[eventkey].event_category_id == window.event_categories[key].id) {
                    window.events[eventkey].settings.hide_full = window.event_categories[key].event_settings.hide_full;
                    window.events[eventkey].settings.print = window.event_categories[key].event_settings.print;
                    window.events[eventkey].settings.hide = window.event_categories[key].event_settings.hide;
                    window.events[eventkey].settings.color = window.event_categories[key].event_settings.color;
                    window.events[eventkey].settings.text = window.event_categories[key].event_settings.text;
                }
            }

            window.dispatchEvent(new CustomEvent("events-changed"));

            repopulate_event_category_lists();
        }

        var refresh = target.attr('refresh') === "true" || refresh === undefined;

        if (type[0] === "seasons" && key == "name") {
            location_list.children().each(function(i) {
                $(this).find('.location_season').each(function(j) {
                    $(this).prop('key', j);
                    $(this).children().first().prop('id', `collapsible_seasons_${i}_${j}`);
                    $(this).children().first().next().prop('for', `collapsible_seasons_${i}_${j}`).text(`Season name: ${window.static_data.seasons.data[j].name}`);
                });
            });
            repopulate_location_select_list();
        }

        do_error_check(type[0], refresh);

    } else if (target.attr('class') !== undefined && target.attr('class').indexOf('static_input') > -1) {


        var type = target.attr('data').split('.');

        var current_calendar_data = window.static_data;

        for (var i = 0; i < type.length; i++) {
            current_calendar_data = current_calendar_data[type[i]];
        }

        var key = target.attr('fc-index');
        var key2 = false;

        switch (target.attr('type')) {
            case "number":
                var value = parseFloat(target.val());
                break;

            case "checkbox":
                var value = target.is(":checked");
                break;

            case "color":
                var value = "#00CBFC"; // target.spectrum("get").toString();
                break;

            default:
                value = escapeHtml(target.val());
                break;
        }

        current_calendar_data[key] = value;

        var refresh = target.attr('refresh');
        refresh = refresh === "true" || refresh === undefined;

        if (type.includes('clock')) {
            evaluate_clock_inputs();
        }

        if (key == "year_zero_exists") {
            refresh_interval_texts();
            set_up_view_values();
            set_up_visitor_values();
            window.dynamic_data.epoch = evaluate_calendar_start(window.static_data, convert_year(window.static_data, window.dynamic_data.year), window.dynamic_data.timespan, window.dynamic_data.day).epoch;
            preview_date.epoch = evaluate_calendar_start(window.static_data, convert_year(window.static_data, preview_date.year), preview_date.timespan, preview_date.day).epoch;
        }

        if (target.attr('refresh') == "clock") {
            eval_clock();
            evaluate_save_button();
        }

        evaluate_settings();

        do_error_check(type[0], refresh);
    }
}

function add_weekday_to_sortable(parent, key, name) {
    var element = [];

    element.push("<div class='sortable-container list-group-item week_day'>");
    element.push("<div class='main-container'>");
    element.push("<div class='handle icon-reorder'></div>");
    element.push("<div class='name-container'>");
    element.push(`<input type='text' class='form-control name-input small-input dynamic_input week_day_name' data='year_data.global_week' fc-index='${key}' tabindex='${(key + 1)}'/>`);
    element.push("</div>");
    element.push("<div class='remove-spacer'></div>");
    element.push("</div>");
    element.push("<div class='remove-container'>");
    element.push("<div class='remove-container-text'>Are you sure you want to remove this?</div>");
    element.push("<div class='btn_remove btn btn-danger icon-trash'></div>");
    element.push("<div class='btn_cancel btn btn-danger icon-remove'></div>");
    element.push("<div class='btn_accept btn btn-success icon-ok'></div>");
    element.push("</div>");

    element.push("</div>");

    element = $(element.join(""))

    element.find('.name-input').val(name);

    parent.append(element);
}

function add_timespan_to_sortable(parent, key, data) {
    if (key == 0) $('.timespan_sortable_header').removeClass('hidden');

    const weekBase64 = btoa(encodeURIComponent(JSON.stringify(data.week ?? [])));

    var element = $(
        `<div class='sortable-container list-group-item ${data.type} collapsed collapsible' type='${data.type}' index='${key}' x-data="{ type: '${data.type}', week: JSON.parse(decodeURIComponent(atob('${weekBase64}'))) }">
            <div class='main-container' x-data="{ deleting: false }">
			<div class='handle icon-reorder' x-show="reordering && !deleting"></div>
			<div class='expand icon-expand' x-show="!reordering && !deleting"></div>
			<div class='name-container input-group' x-show="!deleting">
                <input value="${data.name}" type='text' step='1.0' tabindex='${(100 + key)}' class='flex-grow-1 name-input small-input form-control dynamic_input pr-0' data='year_data.timespans.${key}' fc-index='name'/>
                <input @blur="if ((!$event.target.value) || $event.target.value < 1) { $event.target.value = 1; } else { console.log($event.target.value) }" type='number' min='1' class='flex-shrink-1 length-input form-control dynamic_input timespan_length' data='year_data.timespans.${key}' fc-index='length' tabindex='${(100 + key)}' value='${data.length}'/>
			</div>
            <div class='d-flex align-items-center justify-content-between full' :class="{ 'hidden': !deleting }">
                <div class='pl-1'>Are you sure?</div>
                <div class='d-flex align-items-center'>
                    <div @click='deleting = false' class='btn btn-danger icon-remove mx-1'></div>
                    <div class='btn_accept btn btn-success icon-ok d-block'></div>
                </div>
            </div>
            <div @click='deleting = true' class='btn btn-danger icon-trash ml-1' x-show="reordering && !deleting"></div>
		</div>

		<div class='collapse-container container pb-2'>

			<div class='row no-gutters'>
                <div class='col'>Type: ${(data.type == "month" ? "Month" : "Intercalary month")}</div>
			</div>

			<div class='row no-gutters mt-1'>
				<div class='col-6 pr-1'>
					<div>Leap interval:</div>
				</div>

				<div class='col-6 pl-1'>
					<div>Leap offset:</div>
				</div>
			</div>

			<div class='row no-gutters mb-1'>
				<div class='col-6 pr-1'>
					<input type='number' step="1" min='1' class='form-control timespan_occurance_input interval dynamic_input small-input' data='year_data.timespans.${key}' fc-index='interval' value='${data.interval}' />
				</div>

				<div class='col-6 pl-1'>
					<input type='number' step="1" min='0' class='form-control timespan_occurance_input offset dynamic_input small-input' min='0' data='year_data.timespans.${key}' fc-index='offset' value='${data.interval === 1 ? 0 : data.offset}'
					${data.interval === 1 ? " disabled" : ""}
					/>
				</div>
			</div>

			<div class='row no-gutters my-1'>
				<div class='col-12 italics-text timespan_variance_output'>
					${get_interval_text(true, data)}
				</div>
			</div>

            <div x-show="type === 'month'">
                <div class='row no-gutters my-1'>
                    <div class='col-12'><div class='separator'></div></div>
                </div>

                <div class='row no-gutters my-1'>
                    <div class='form-check col-12 py-2 border rounded'>
                        <input type='checkbox' id='${key}_custom_week' class='form-check-input unique-week-input'
                        ${data.week ? "checked" : ""}
                        />
                        <label for='${key}_custom_week' class='form-check-label ml-1'>
                            Use custom week
                        </label>
                    </div>
                </div>

                <div class='custom-week-container ${(!data.week ? "hidden" : "")}'>

                    <div class='row no-gutters my-1'>
                        <div class='col-12'>
                            Custom week length:
                        </div>
                    </div>

                    <div class='row no-gutters mb-1'>
                        <div class='input-group'>
                            <input @blur="do_error_check('calendar')" type='number' min='1' step="1" class='form-control week-length small-input' ${(!data.week ? "disabled" : "")} value='${(data.week ? data.week.length : 0)}'/>
                            <div class="input-group-append">
                                <button type='button' class='full btn btn-primary weekday_quick_add' ${(!data.week ? "disabled" : "")}>Quick add</button>
                            </div>
                        </div>
                    </div>

                    <div class='row no-gutters border'>
                        <div class='week_list col-12 p-1'>
                            <template x-for='(day, index) in week' :key='index'>
                                <input :value='day' type='text' class='form-control internal-list-name dynamic_input custom_week_day' data='year_data.timespans.${key}.week' :fc-index='index'/>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
		</div>
	</div>`);

    if (data.week) {
        element.find('.week_list').children().each(function(i) {
            $(this).val(data.week[i]);
        });
    }

    parent.append(element);
}

function add_leap_day_to_list(parent, key, data) {
    var element = [];

    element.push(`<div class='sortable-container list-group-item ${(data.intercalary ? 'intercalary leap-day' : 'leap-day')} collapsed collapsible' type='${(data.intercalary ? 'intercalary' : 'normal')}' index='${key}'>`);
    element.push("<div class='main-container'>");
    element.push("<div class='expand icon-expand'></div>");
    element.push("<div class='name-container'>");
    element.push(`<input type='text' class='name-input small-input form-control dynamic_input' data='year_data.leap_days.${key}' fc-index='name' tabindex='${(200 + key)}'/>`);
    element.push("</div>");
    element.push('<div class="remove-spacer"></div>');
    element.push("</div>");
    element.push("<div class='remove-container'>");
    element.push("<div class='remove-container-text'>Are you sure you want to remove this?</div>");
    element.push("<div class='btn_remove btn btn-danger icon-trash'></div>");
    element.push("<div class='btn_cancel btn btn-danger icon-remove'></div>");
    element.push("<div class='btn_accept btn btn-success icon-ok'></div>");
    element.push("</div>");

    element.push("<div class='collapse-container container mb-2'>");

    element.push("<div class='row my-2 bold-text big-text italics-text'>");
    element.push("<div class='col'>");
    element.push(!data.intercalary ? "Leap day" : "Intercalary leap day");
    element.push("</div>");
    element.push("</div>");

    element.push("<div class='row my-2'>");
    element.push("<div class='col'>");
    element.push("<div class='bold-text'>Leap day settings</div>");
    element.push("</div>");
    element.push("</div>");

    element.push("<div class='date_control'>");

    element.push(`<input type='hidden' class='form-control year-input hidden' value='0'>`);

    element.push("<div class='row no-gutters'>");
    element.push("<div class='col'>");
    element.push("Month to add to:");
    element.push(`<select type='number' class='custom-select form-control leap_day_occurance_input timespan-list dynamic_input full timespan_special' data='year_data.leap_days.${key}' fc-index='timespan'>`);
    for (var j = 0; j < window.static_data.year_data.timespans.length; j++) {
        element.push(`<option value="${j}" ${(j == data.timespan ? "selected" : "")}>${window.static_data.year_data.timespans[j].name}</option>`);
    }
    element.push("</select>");
    element.push("</div>");
    element.push("</div>");

    element.push("<div class='row no-gutters mt-2 mb-1'>");
    element.push("<div class='col'>");
    element.push("<div class='separator'></div>");
    element.push("</div>");
    element.push("</div>");

    element.push(`<div class='row no-gutters my-1 ${data.intercalary ? "" : "hidden"}'>`);
    element.push(`<div class='form-check col-12 py-2 border rounded protip' data-pt-position="right" data-pt-title="This setting toggles whether this intercalary leap day should continue its parent month's day count (for example, day 1, day 2, intercalary, day 3).">`);
    element.push(`<input type='checkbox' id='${key}_not_numbered' class='form-check-input dynamic_input' data='year_data.leap_days.${key}' fc-index='not_numbered' ${(data.intercalary ? "" : "disabled")} ${(data.not_numbered ? "checked" : "")}/>`);
    element.push(`<label for='${key}_not_numbered' class='form-check-label ml-1'>`);
    element.push("Not numbered");
    element.push("</label>");
    element.push("</div>");
    element.push("</div>");

    element.push(`<div class='row no-gutters my-1 ${data.intercalary ? "" : "hidden"}'>`);
    element.push(`<div class='form-check col-12 py-2 border rounded protip' data-pt-position="right" data-pt-title="This setting toggles whether this intercalary leap day should show its name in the calendar.">`);
    element.push(`<input type='checkbox' id='${key}_show_text' class='form-check-input dynamic_input' data='year_data.leap_days.${key}' fc-index='show_text' ${(data.intercalary ? "" : "disabled")} ${(data.show_text ? "checked" : "")}/>`);
    element.push(`<label for='${key}_show_text' class='form-check-label ml-1'>`);
    element.push("Show leap day text");
    element.push("</label>");
    element.push("</div>");
    element.push("</div>");

    element.push(`<div class='row no-gutters my-1 ${!data.intercalary ? "" : "hidden"}'>`);
    element.push("<div class='form-check col-12 py-2 border rounded'>");
    element.push(`<input type='checkbox' id='${key}_adds_week_day' class='form-check-input adds-week-day dynamic_input' data='year_data.leap_days.${key}' fc-index='adds_week_day' ${(!data.intercalary ? "" : "disabled")} ${(data.adds_week_day ? "checked" : "")} />`);
    element.push(`<label for='${key}_adds_week_day' class='form-check-label ml-1'>`);
    element.push("Adds week day");
    element.push("</label>");
    element.push("</div>");
    element.push("</div>");

    element.push(`<div class='adds_week_day_data_container ${(data.adds_week_day && !data.intercalary ? "" : "hidden")}'>`);
    element.push("<div class='row no-gutters mt-2'>");
    element.push("<div class='col'>");
    element.push("Week day name:");
    element.push(`<input type='text' class='form-control internal-list-name dynamic_input' data='year_data.leap_days.${key}' fc-index='week_day' ${(data.adds_week_day && !data.intercalary ? "" : "disabled")}/>`);
    element.push("</div>");
    element.push("</div>");
    element.push("</div>");

    element.push(`<div class='week_day_select_container ${(data.adds_week_day && !data.intercalary) ? "" : "hidden"}'>`);
    element.push("<div class='row no-gutters mt-2'>");
    element.push("<div class='col'>");
    element.push("After which weekday:");
    element.push(`<select type='number' class='custom-select form-control dynamic_input full week-day-select inclusive' ${(data.adds_week_day && !data.intercalary) ? "" : "disabled"} data='year_data.leap_days.${key}' fc-index='day'>`);

    if (data.timespan === undefined) {
        var week = window.static_data.year_data.global_week;
    } else {
        if (data.timespan <= window.static_data.year_data.timespans.length) {
            var week = window.static_data.year_data.timespans[data.timespan].week ? window.static_data.year_data.timespans[data.timespan].week : window.static_data.year_data.global_week;
        }
    }
    if (data.adds_week_day) {
        element.push(`<option ${data.day == 0 ? 'selected' : ''} value='0'>Before ${week[0]}</option>`);
    }
    for (var i = 0; i < week.length; i++) {
        element.push(`<option ${data.day == i ? 'selected' : ''} value='${i + 1}'>${week[i]}</option>`);
    }

    element.push("</select>");
    element.push("</div>");
    element.push("</div>");
    element.push("</div>");

    element.push(`<div class='${(!data.intercalary ? "hidden" : "")}'>`);
    element.push("<div class='row my-1'>");
    element.push("<div class='col'>");
    element.push("Select after which day:");
    element.push(`<select type='number' class='custom-select form-control dynamic_input full timespan-day-list exclude_self no_leap' data='year_data.leap_days.${key}' ${(!data.intercalary ? "disabled" : "")} fc-index='day'>`);
    element.push("</select>");
    element.push("</div>");
    element.push("</div>");
    element.push("</div>");

    element.push("<div class='row no-gutters mt-2 mb-1'>");
    element.push("<div class='col'>");
    element.push("<div class='separator'></div>");
    element.push("</div>");
    element.push("</div>");

    element.push("<div class='row no-gutters my-1'>");
    element.push("<div class='col'>");
    element.push("<div class='bold-text'>Leaping settings</div>");
    element.push("</div>");
    element.push("</div>");

    element.push("<div class='row no-gutters mt-2'>");
    element.push("<div class='col-8'>Interval:</div>");
    element.push("<div class='col-4'>Offset:</div>");
    element.push("</div>");

    element.push("<div class='row no-gutters mb-2'>");
    element.push("<div class='col-8 pr-1'>");
    element.push(`<input type='text' class='form-control leap_day_occurance_input interval dynamic_input protip' data-pt-position="top" data-pt-title='Every nth year this leap day appears. Multiple intervals can be separated by commas, like the gregorian leap day: 400,!100,4. Every 4th year, unless it is divisible by 100, but again if it is divisible by 400.' data='year_data.leap_days.${key}' fc-index='interval' value='${data.interval}' />`);
    element.push("</div>");
    element.push("<div class='col-4 pl-1 '>");
    element.push(`<input type='number' step="1" class='form-control leap_day_occurance_input offset dynamic_input' min='0' data='year_data.leap_days.${key}' fc-index='offset' value='${data.interval == "1" ? 0 : data.offset}'/>`);
    element.push("</div>");
    element.push("</div>");

    element.push("<div class='row no-gutters'>");
    element.push("<div class='col'>");
    element.push(`<div class='italics-text leap_day_variance_output'>${get_interval_text(false, data)}</div>`);
    element.push("</div>");
    element.push("</div>");
    element.push("</div>");
    element.push("</div>");
    element.push("</div>");

    element = $(element.join(""))

    element.find('.name-input').val(data.name);
    element.find('.internal-list-name').val(`${data.week_day && !data.intercalary ? data.week_day : 'Weekday'}`)
    element.find('.leap_day_occurance_input.offset').prop('disabled', data.interval == "1" || data.interval == 1)

    parent.append(element);
}

function add_moon_to_list(parent, key, data) {
    var element = [];

    element.push(`<div class='sortable-container list-group-item moon_inputs expanded' index='${key}'>`);
    element.push("<div class='main-container'>");
    element.push("<div class='name-container'>");
    element.push(`<input type='text' class='form-control name-input small-input dynamic_input' data='moons.${key}' fc-index='name' tabindex='${(300 + key)}'/>`);
    element.push("</div>");
    element.push('<div class="remove-spacer"></div>');
    element.push("</div>");
    element.push("<div class='remove-container'>");
    element.push("<div class='remove-container-text'>Are you sure you want to remove this?</div>");
    element.push("<div class='btn_remove btn btn-danger icon-trash'></div>");
    element.push("<div class='btn_cancel btn btn-danger icon-remove'></div>");
    element.push("<div class='btn_accept btn btn-success icon-ok'></div>");
    element.push("</div>");

    element.push("<div class='collapse-container container mb-2'>");

    element.push(`<div class='row no-gutters my-1'>`);
    element.push("<div class='form-check col-12 py-2 border rounded'>");
    element.push(`<input type='checkbox' id='${key}_custom_phase_count' class='form-check-input dynamic_input custom_phase' data='moons.${key}' fc-index='custom_phase'`);
    element.push(data.custom_phase ? "checked" : "");
    element.push("/>");
    element.push(`<label for='${key}_custom_phase_count' class='form-check-label ml-1'>`);
    element.push("Custom phase count");
    element.push("</label>");
    element.push("</div>");
    element.push("</div>");

    element.push(`<div class='no_custom_phase_container ${data.custom_phase ? "hidden" : ""}'>`);

    element.push(`<div class='row no-gutters my-1'>`);

    element.push("<div class='col-7'>Cycle:</div>");

    element.push("<div class='col-5'>Shift:</div>");

    element.push("</div>");

    element.push(`<div class='row no-gutters mb-1'>`);

    element.push("<div class='col-7 pr-1'>");
    element.push(`<input type='number' min='1' step="any" class='form-control dynamic_input cycle protip' data-pt-position="top" data-pt-title='How many days it takes for this moon go from Full Moon to the next Full Moon.' data='moons.${key}' fc-index='cycle' value='${!data.custom_phase ? data.cycle : ''}' />`);
    element.push("</div>");

    element.push("<div class='col-5 pl-1'>");
    element.push(`<input type='number' step="any" class='form-control dynamic_input shift protip' data-pt-position="top" data-pt-title='This is how many days the cycle is offset by.' data='moons.${key}' fc-index='shift' value='${!data.custom_phase ? data.shift : ''}' />`);
    element.push("</div>");

    element.push("</div>");

    element.push(`<div class='row no-gutters mb-1'>`);

    element.push(`<select class='form-control dynamic_input protip' data-pt-position="top" data-pt-title='This determines the way this moon calculates its phases, as in which way it rounds the phase value to the closest sprite.' data='moons.${key}' fc-index='cycle_rounding'>`);
    element.push(`<option ${data.cycle_rounding == "floor" ? "selected" : ""} value='floor'>Floor (0.7 becomes 0.0)</option>`);
    element.push(`<option ${data.cycle_rounding == "round" || data.cycle_rounding === undefined ? "selected" : ""} value='round'>Round (< 0.49 becomes 0.0, 0.5 > becomes 1.0)</option>`);
    element.push(`<option ${data.cycle_rounding == "ceil" ? "selected" : ""} value='ceil'>Ceiling (0.3 becomes 1.0)</option>`);
    element.push("</select>");

    element.push("</div>");

    element.push("</div>");

    element.push(`<div class='row no-gutters custom_phase_container ${!data.custom_phase ? "hidden" : ""}'>`);

    element.push("<div class='col'>");

    element.push("<div class='my-1'>Custom phase:</div>");

    element.push("<div class='input-group my-1'>");

    element.push("<div class='input-group-prepend'>");
    element.push("<button type='button' class='btn btn-sm btn-danger moon_shift_back'><</button>");
    element.push("</div>");

    element.push(`<input type='text' class='form-control form-control-sm dynamic_input custom_cycle full' data='moons.${key}' fc-index='custom_cycle' value='${data.custom_phase ? data.custom_cycle : ''}' />`);

    element.push("<div class='input-group-append'>");
    element.push("<button type='button' class='btn btn-sm btn-success moon_shift_forward'>></button>");
    element.push("</div>");

    element.push("</div>");

    element.push(`<div class='custom_phase_text italics-text small-text my-1'>${data.custom_phase ? `This moon has ${data.custom_cycle.split(',').length} phases, with a granularity of ${data.granularity} moon sprites.` : ''}</div>`);

    element.push("</div>");

    element.push("</div>");

    element.push("<div class='row no-gutters my-2'>");
    element.push("<div class='col'>");
    element.push("<div class='separator'></div>");
    element.push("</div>");
    element.push("</div>");

    element.push(`<div class='row no-gutters mt-1'>`);

    element.push("<div class='col-6'>Moon color:</div>");

    element.push("<div class='col-6'>Shadow color:</div>");

    element.push("</div>");

    element.push(`<div class='row no-gutters mb-1'>`);

    element.push("<div class='col-6 pr-1'>");
    element.push(`<input type='color' class='dynamic_input color' data='moons.${key}' fc-index='color'/>`);
    element.push("</div>");

    element.push("<div class='col-6 pl-1'>");
    element.push(`<input type='color' class='dynamic_input shadow_color' data='moons.${key}' fc-index='shadow_color'/>`);
    element.push("</div>");

    element.push("</div>");

    element.push(`<div class='row no-gutters my-1'>`);
    element.push("<div class='form-check col-12 py-2 border rounded'>");
    element.push(`<input type='checkbox' id='${key}_hidden_moon' class='form-check-input dynamic_input moon-hidden' data='moons.${key}' fc-index='hidden'`);
    element.push(data.hidden ? "checked" : "");
    element.push("/>");
    element.push(`<label for='${key}_hidden_moon' class='form-check-label ml-1'>`);
    element.push("Hide from guest viewers");
    element.push("</label>");
    element.push("</div>");
    element.push("</div>");
    element.push("</div>");
    element.push("</div>");

    element = $(element.join(""))

    element.find('.name-input').val(data.name);

    parent.append(element);
}

function add_season_to_sortable(parent, key, data) {
    var element = [];
    element.push(`<div class='sortable-container list-group-item season collapsed collapsible' index='${key}'>`);
    element.push("<div class='main-container'>");
    if (window.static_data.seasons.global_settings.periodic_seasons) {
        element.push("<div class='handle icon-reorder'></div>");
    }
    element.push("<div class='expand icon-expand'></div>");
    element.push("<div class='name-container'>");
    element.push(`<input type='text' tabindex='${(400 + key)}'class='name-input small-input form-control dynamic_input' data='seasons.data.${key}' fc-index='name'/>`);
    element.push("</div>");
    element.push('<div class="remove-spacer"></div>');
    element.push("</div>");
    element.push("<div class='remove-container'>");
    element.push("<div class='remove-container-text'>Are you sure you want to remove this?</div>");
    element.push("<div class='btn_remove btn btn-danger icon-trash'></div>");
    element.push("<div class='btn_cancel btn btn-danger icon-remove'></div>");
    element.push("<div class='btn_accept btn btn-success icon-ok'></div>");
    element.push("</div>");
    element.push("<div class='collapse-container container mb-2'>");

    element.push("<div class='row no-gutters my-1 preset-season-list-container'>");
    element.push("<div class='col-4 pt-1'>Season type:</div>");
    element.push("<div class='col'>");
    element.push(`<select type='number' class='form-control dynamic_input preset-season-list' data='seasons.global_settings.preset_order' fc-index='${key}'>`);
    element.push("</select>");
    element.push("</div>");
    element.push("</div>");

    if (window.static_data.seasons.global_settings.periodic_seasons) {

        element.push(`<div class='row no-gutters mt-2'>`);

        element.push("<div class='col-md-6 col-sm-12 pl-0 pr-1'>");
        element.push("Duration:");
        var transition_length = data.transition_length == '' || data.transition_length == undefined ? 90 : data.transition_length;
        element.push(`<input type='number' step='any' class='form-control dynamic_input transition_length protip' data='seasons.data.${key}' fc-index='transition_length' min='1' value='${transition_length}' data-pt-position="right" data-pt-title='How many days until this season ends, and the next begins.'/>`);
        element.push("</div>");

        element.push("<div class='col-md-6 col-sm-12 pl-1 pr-0'>");
        element.push("Peak duration:");
        var duration = data.duration == '' || data.duration == undefined ? 0 : data.duration;
        element.push(`<input type='number' step='any' class='form-control dynamic_input duration protip' data='seasons.data.${key}' fc-index='duration' min='0' value='${duration}' data-pt-position="right" data-pt-title='If the duration is the path up a mountain, the peak duration is a flat summit. This is how many days the season will pause before going down the other side of the mountain.'/>`);
        element.push("</div>");

        element.push("</div>");

    } else {

        element.push(`<div class='date_control season-date full'>`);

        element.push("<div class='row no-gutters my-1'>");
        element.push("<div class='col-4 pt-1'>Month:</div>");
        element.push("<div class='col'>");
        element.push(`<select type='number' class='date form-control timespan-list dynamic_input' data='seasons.data.${key}' fc-index='timespan'>`);
        element.push("</select>");
        element.push("</div>");
        element.push("</div>");

        element.push("<div class='row no-gutters my-1'>");
        element.push("<div class='col-4 pt-1'>Day:</div>");
        element.push("<div class='col'>");
        element.push(`<select type='number' class='date form-control timespan-day-list dynamic_input' data='seasons.data.${key}' fc-index='day'>`);
        element.push("</select>");
        element.push("</div>");
        element.push("</div>");

        element.push("</div>");

    }

    element.push(`<div class='mt-1 p-2 border rounded season_color_enabled ${!window.static_data.seasons.global_settings.color_enabled ? "hidden" : ""}'>`);

    element.push(`<div class='row no-gutters'>`);
    element.push("<div class='col-6 pr-1'>Start color:</div>");
    element.push("<div class='col-6 pl-1'>End color:</div>");
    element.push("</div>");

    element.push(`<div class='row no-gutters my-1'>`);
    element.push("<div class='col-6 pr-1'>");
    element.push(`<input type='color' class='dynamic_input start_color full' data='seasons.data.${key}.color' fc-index='0'/>`);
    element.push("</div>")
    element.push("<div class='col-6 pl-1'>");
    element.push(`<input type='color' class='dynamic_input end_color full' data='seasons.data.${key}.color' fc-index='1'/>`);
    element.push("</div>");
    element.push("</div>");
    element.push("</div>");

    element.push(`<div class='clock_inputs ${!window.static_data.clock.enabled ? "hidden" : ""}'>`);

    element.push(`<div class='row no-gutters mt-2'>`);

    element.push("<div class='col-12'>Sunrise:</div>");

    element.push("</div>");

    element.push(`<div class='row no-gutters sortable-header'>`);

    element.push("<div class='col-6 pr-1'>");
    element.push(`Hour`);
    element.push("</div>");

    element.push("<div class='col-6 pl-1'>");
    element.push(`Minute`);
    element.push("</div>");

    element.push("</div>");

    element.push(`<div class='row no-gutters mb-2 protip' data-pt-position="right" data-pt-title="What time the sun rises at the peak of this season">`);

    element.push("<div class='col-6 pr-1 clock-input'>");
    element.push(`<input type='number' step="1.0" class='form-control full dynamic_input season_time hour_input' clocktype='sunrise_hour' data='seasons.data.${key}.time.sunrise' fc-index='hour' value='${data.time.sunrise.hour}' />`);
    element.push("</div>");

    element.push("<div class='col-6 pl-1 clock-input'>");
    element.push(`<input type='number' step="1.0" class='form-control full dynamic_input season_time' clocktype='sunrise_minute' data='seasons.data.${key}.time.sunrise' fc-index='minute' value='${data.time.sunrise.minute}' />`);
    element.push("</div>");

    element.push("</div>");

    element.push(`<div class='row no-gutters mt-2'>`);

    element.push("<div class='col-12 '>Sunset:</div>");

    element.push("</div>");

    element.push(`<div class='row no-gutters sortable-header'>`);

    element.push("<div class='col-6 pr-1'>");
    element.push(`Hour`);
    element.push("</div>");

    element.push("<div class='col-6 pl-1'>");
    element.push(`Minute`);
    element.push("</div>");

    element.push("</div>");

    element.push(`<div class='row no-gutters mb-2 protip' data-pt-position="right" data-pt-title="What time the sun sets at the peak of this season">`);

    element.push("<div class='col-6 pr-1 clock-input'>");
    element.push(`<input type='number' step="1.0" class='form-control full dynamic_input season_time hour_input' clocktype='sunset_hour' data='seasons.data.${key}.time.sunset' fc-index='hour' value='${data.time.sunset.hour}' />`);
    element.push("</div>");

    element.push("<div class='col-6 pl-1 clock-input'>");
    element.push(`<input type='number' step="1.0" class='form-control full dynamic_input season_time' clocktype='sunset_minute' data='seasons.data.${key}.time.sunset' fc-index='minute' value='${data.time.sunset.minute}' />`);
    element.push("</div>");

    element.push("</div>");

    element.push("<div class='row no-gutters my-1'>");
    element.push(`<button type="button" class="btn btn-sm btn-info season_middle_btn full protip" data-pt-delay-in="100" data-pt-title="Use the median values from the previous and next seasons' time data. This season will act as a transition between the two, similar to Spring or Autumn">Interpolate sunrise & sunset from surrounding seasons</button>`);
    element.push("</div>");

    element.push("</div>");

    element.push("</div>");

    element = $(element.join(""))

    element.find('.name-input').val(data.name);

    parent.append(element);
}

function add_location_to_list(parent, key, data) {
    var element = [];

    element.push(`<div class='sortable-container list-group-item location collapsed collapsible' index='${key}'>`);
    element.push("<div class='main-container'>");
    element.push("<div class='expand icon-expand'></div>");
    element.push("<div class='name-container'>");
    element.push(`<input type='text' tabindex='${(500 + key)}' class='name-input small-input form-control dynamic_input location-name' data='seasons.locations.${key}' fc-index='name'/>`);
    element.push("</div>");
    element.push('<div class="remove-spacer"></div>');
    element.push("</div>");

    element.push("<div class='remove-container'>");
    element.push("<div class='remove-container-text'>Are you sure you want to remove this?</div>");
    element.push("<div class='btn_remove btn btn-danger icon-trash'></div>");
    element.push("<div class='btn_cancel btn btn-danger icon-remove'></div>");
    element.push("<div class='btn_accept btn btn-success icon-ok'></div>");
    element.push("</div>");
    element.push("<div class='collapse-container container mb-2'>");

    for (var i = 0; i < data.seasons.length; i++) {

        element.push(`<div class='m-0 my-2 cycle-container wrap-collapsible location_season' fc-index='${i}'>`);
        element.push(`<input id='collapsible_seasons_${key}_${i}' class='toggle location_toggle' type='checkbox'>`);
        element.push(`<label for='collapsible_seasons_${key}_${i}' class='lbl-toggle location_name'><div class='icon icon-expand'></div>${window.static_data.seasons.data[i].name} weather</label>`);

        element.push("<div class='collapsible-content container p-0'>");

        element.push(`<div class='weather_inputs ${!window.static_data.seasons.global_settings.enable_weather ? "hidden" : ""}'>`);

        element.push("<div class='row no-gutters'>");
        element.push("<div class='col-lg-6 my-1'>");
        element.push("Temperature low:");
        element.push(`<input type='number' step="any" class='form-control full dynamic_input' data='seasons.locations.${key}.seasons.${i}.weather' fc-index='temp_low' value='${data.seasons[i].weather.temp_low}'>`);
        element.push("</div>");
        element.push("<div class='col-lg-6 my-1'>");
        element.push("Temperature high:");
        element.push(`<input type='number' step="any" class='form-control full dynamic_input' data='seasons.locations.${key}.seasons.${i}.weather' fc-index='temp_high' value='${data.seasons[i].weather.temp_high}'>`);
        element.push("</div>");
        element.push("</div>");

        element.push("<div class='row no-gutters my-2'>");
        element.push("<div class='separator'></div>");
        element.push("</div>");

        element.push("<div class='row no-gutters mt-2'>");
        element.push("Precipitation chance: (%)");
        element.push("</div>");

        element.push("<div class='row no-gutters mb-2'>");
        element.push("<div class='col-9 pt-1'>");
        element.push("<div class='slider_percentage'></div>");
        element.push("</div>");
        element.push("<div class='col-3 pl-1'>");
        element.push(`<input type='number' step="any" class='form-control form-control-sm full dynamic_input slider_input' data='seasons.locations.${key}.seasons.${i}.weather' fc-index='precipitation' value='${data.seasons[i].weather.precipitation * 100}'>`);
        element.push("</div>");
        element.push("</div>");


        element.push("<div class='row no-gutters mt-2'>");
        element.push("Precipitation intensity: (%)");
        element.push("</div>");

        element.push("<div class='row no-gutters mb-2'>");
        element.push("<div class='col-9 pt-1'>");
        element.push("<div class='slider_percentage'></div>");
        element.push("</div>");
        element.push("<div class='col-3 pl-1'>");
        element.push(`<input type='number' step="any" class='form-control form-control-sm full dynamic_input slider_input' data='seasons.locations.${key}.seasons.${i}.weather' fc-index='precipitation_intensity' value='${data.seasons[i].weather.precipitation_intensity * 100}'>`);
        element.push("</div>");
        element.push("</div>");

        element.push("<div class='row no-gutters my-2'>");
        element.push("<div class='separator'></div>");
        element.push("</div>");
        element.push("</div>");

        element.push(`<div class='clock_inputs ${!window.static_data.clock.enabled ? "hidden" : ""}'>`);

        element.push(`<div class='row no-gutters mt-2'>`);

        element.push("<div class='col-12 pl-0 pr-0'>Sunrise:</div>");

        element.push("</div>");

        element.push(`<div class='row no-gutters sortable-header'>`);

        element.push("<div class='col-6 pr-1'>");
        element.push(`Hour`);
        element.push("</div>");

        element.push("<div class='col-6 pl-1'>");
        element.push(`Minute`);
        element.push("</div>");

        element.push("</div>");

        element.push(`<div class='row no-gutters mb-2 protip'  data-pt-position="right" data-pt-title="What time the sun rises at the peak of this season, in this location">`);

        element.push("<div class='col-6 pl-0 pr-1 clock-input'>");
        element.push(`<input type='number' step="1.0" class='form-control text-right full dynamic_input hour_input' clocktype='sunrise_hour' ${data.settings.season_based_time ? "disabled" : ""} data='seasons.locations.${key}.seasons.${i}.time.sunrise' fc-index='hour' value='${data.seasons[i].time.sunrise.hour}' />`);
        element.push("</div>");

        element.push("<div class='col-auto pt-1'>:</div>");

        element.push("<div class='col pl-1 pr-0 clock-input'>");
        element.push(`<input type='number' step="1.0" class='form-control full dynamic_input' clocktype='sunrise_minute' ${data.settings.season_based_time ? "disabled" : ""} data='seasons.locations.${key}.seasons.${i}.time.sunrise' fc-index='minute' value='${data.seasons[i].time.sunrise.minute}' />`);
        element.push("</div>");

        element.push("</div>");

        element.push(`<div class='row no-gutters mt-2'>`);

        element.push("<div class='col-12 pl-0 pr-0'>Sunset:</div>");

        element.push("</div>");

        element.push(`<div class='row no-gutters sortable-header'>`);

        element.push("<div class='col-6 pr-1'>");
        element.push(`Hour`);
        element.push("</div>");

        element.push("<div class='col-6 pl-1'>");
        element.push(`Minute`);
        element.push("</div>");

        element.push("</div>");

        element.push(`<div class='row no-gutters mb-2 protip' data-pt-position="right" data-pt-title="What time the sun sets at the peak of this season, in this location">`);

        element.push("<div class='col-6 pl-0 pr-1 clock-input'>");
        element.push(`<input type='number' step="1.0" class='form-control text-right full dynamic_input hour_input' clocktype='sunset_hour' ${data.settings.season_based_time ? "disabled" : ""} data='seasons.locations.${key}.seasons.${i}.time.sunset' fc-index='hour' value='${data.seasons[i].time.sunset.hour}' />`);
        element.push("</div>");

        element.push("<div class='col-auto pt-1'>:</div>");

        element.push("<div class='col pl-1 pr-0 clock-input'>");
        element.push(`<input type='number' step="1.0" class='form-control full dynamic_input' clocktype='sunset_minute' ${data.settings.season_based_time ? "disabled" : ""} data='seasons.locations.${key}.seasons.${i}.time.sunset' fc-index='minute' value='${data.seasons[i].time.sunset.minute}' />`);
        element.push("</div>");

        element.push("</div>");
        element.push("</div>");
        element.push("<div class='row no-gutters my-2'>");
        element.push(`<button type="button" class="btn btn-sm btn-info location_middle_btn full protip" data-pt-position="right" data-pt-title="Use the median values from the previous and next seasons' weather and time data. This season will act as a transition between the two, similar to Spring or Autumn">Interpolate data from surrounding seasons</button>`);
        element.push("</div>");

        element.push("</div>");

        element.push("<div class='separator'></div>");

        element.push("</div>");

    }

    element.push(`<div class='clock_inputs ${!window.static_data.clock.enabled ? "hidden" : ""}'>`);

    element.push(`<div class='row no-gutters my-1 protip' data-pt-position="right" data-pt-title="Checking this will base this location's sunrise and sunset times on your season's sunrise and sunset times, and keep them the same">`);
    element.push("<div class='form-check col-12 py-2 border rounded'>");
    element.push(`<input type='checkbox' id='${key}_season_based_time' class='form-check-input dynamic_input season_based_time' data='seasons.locations.${key}.settings' fc-index='season_based_time' ${(data.settings.season_based_time ? "checked" : "")} />`);
    element.push(`<label for='${key}_season_based_time' class='form-check-label ml-1'>`);
    element.push("Lock sunset/rise times to season");
    element.push("</label>");
    element.push("</div>");
    element.push("</div>");

    element.push(`<div class='row my-1'>`);
    element.push("<div class='col'>Timezone:</div>");
    element.push("</div>");

    element.push(`<div class='row no-gutters sortable-header'>`);

    element.push("<div class='col-6 pr-1'>");
    element.push(`Hour`);
    element.push("</div>");

    element.push("<div class='col-6 pl-1'>");
    element.push(`Minute`);
    element.push("</div>");

    element.push("</div>");

    element.push(`<div class='row no-gutters mb-2 protip' data-pt-position="right" data-pt-title="When this location becomes active, the current time will change this much to reflect the new location.">`);

    element.push("<div class='col-6 pr-1 clock-input'>");
    element.push(`<input type='number' step="1.0" min='${window.static_data.clock.hours * -0.5}' max='${window.static_data.clock.hours * 0.5}' class='form-control right-text form-control full dynamic_input hour_input' data='seasons.locations.${key}.settings.timezone' clocktype='timezone_hour' fc-index='hour' value='${data.settings.timezone.hour}' />`);
    element.push("</div>");

    element.push("<div class='col-auto pt-1'>:</div>");

    element.push("<div class='col pl-1 clock-input'>");
    element.push(`<input type='number' step="1.0" min='${window.static_data.clock.minutes * -0.5}' max='${window.static_data.clock.minutes * 0.5}' class='form-control full dynamic_input' data='seasons.locations.${key}.settings.timezone' clocktype='timezone_minute' fc-index='minute' value='${data.settings.timezone.minute}' />`);
    element.push("</div>");

    element.push("</div>");

    element.push("</div>");

    element.push(`<div class='weather_inputs ${!window.static_data.seasons.global_settings.enable_weather ? "hidden" : ""}'>`);
    element.push("<div class='row no-gutters my-1'>");
    element.push("<div class='col'>");
    element.push("Curve noise settings:");
    element.push("</div>");
    element.push("</div>");

    element.push("<div class='row no-gutters my-1'>");
    element.push("<div class='col-6 pr-1'>");
    element.push("Large frequency:");
    element.push("</div>");
    element.push("<div class='col-6 pl-1'>");
    element.push("Large amplitude:");
    element.push("</div>");
    element.push("</div>");
    element.push("<div class='row no-gutters my-1'>");
    element.push("<div class='col-6 pr-1'>");
    element.push(`<input type='float' class='form-control full dynamic_input' data='seasons.locations.${key}.settings' fc-index='large_noise_frequency' value='${data.settings.large_noise_frequency}' />`);
    element.push("</div>");
    element.push("<div class='col-6 pl-1'>");
    element.push(`<input type='float' class='form-control full dynamic_input' data='seasons.locations.${key}.settings' fc-index='large_noise_amplitude' value='${data.settings.large_noise_amplitude}'>`);
    element.push("</div>");
    element.push("</div>");

    element.push("<div class='row no-gutters my-1'>");
    element.push("<div class='col-6 pr-1'>");
    element.push("Medium frequency:");
    element.push("</div>");
    element.push("<div class='col-6 pl-1'>");
    element.push("Medium amplitude:");
    element.push("</div>");
    element.push("</div>");
    element.push("<div class='row no-gutters my-1'>");
    element.push("<div class='col-6 pr-1'>");
    element.push(`<input type='float' class='form-control full dynamic_input' data='seasons.locations.${key}.settings' fc-index='medium_noise_frequency' value='${data.settings.medium_noise_frequency}' />`);
    element.push("</div>");
    element.push("<div class='col-6 pl-1'>");
    element.push(`<input type='float' class='form-control full dynamic_input' data='seasons.locations.${key}.settings' fc-index='medium_noise_amplitude' value='${data.settings.medium_noise_amplitude}'>`);
    element.push("</div>");
    element.push("</div>");

    element.push("<div class='row no-gutters my-1'>");
    element.push("<div class='col-6 pr-1'>");
    element.push("Small frequency:");
    element.push("</div>");
    element.push("<div class='col-6 pl-1'>");
    element.push("Small amplitude:");
    element.push("</div>");
    element.push("</div>");
    element.push("<div class='row no-gutters my-1'>");
    element.push("<div class='col-6 pr-1'>");
    element.push(`<input type='float' class='form-control full dynamic_input' data='seasons.locations.${key}.settings' fc-index='small_noise_frequency' value='${data.settings.small_noise_frequency}' />`);
    element.push("</div>");
    element.push("<div class='col-6 pl-1'>");
    element.push(`<input type='float' class='form-control full dynamic_input' data='seasons.locations.${key}.settings' fc-index='small_noise_amplitude' value='${data.settings.small_noise_amplitude}'>`);
    element.push("</div>");
    element.push("</div>");
    element.push("</div>");

    element.push("</div>");

    element = $(element.join(""))

    element.find('.name-input').val(data.name);

    parent.append(element);
}

function add_cycle_to_sortable(parent, key, data) {

    var element = [];

    element.push(`<div class='sortable-container list-group-item cycle_inputs collapsed collapsible' index='${key}'>`);
    element.push("<div class='main-container'>");
    element.push("<div class='handle icon-reorder'></div>");
    element.push("<div class='expand icon-expand'></div>");
    element.push(`<div class='name-container cycle-text center-text'>Cycle #${(key + 1)} - Using {{${(key + 1)}}}</div>`);
    element.push('<div class="remove-spacer"></div>');
    element.push("</div>");
    element.push("<div class='remove-container'>");
    element.push("<div class='remove-container-text'>Are you sure you want to remove this?</div>");
    element.push("<div class='btn_remove btn btn-danger icon-trash'></div>");
    element.push("<div class='btn_cancel btn btn-danger icon-remove'></div>");
    element.push("<div class='btn_accept btn btn-success icon-ok'></div>");
    element.push("</div>");

    element.push("<div class='collapse-container container'>");

    element.push("<div class='col-12 mb-3'>");

    element.push("<div class='row my-2 center-text bold-text'>Cycle settings</div>");

    element.push("<div class='row mt-2'>Cycle is based on:</div>");
    element.push("<div class='row mb-2'>");
    element.push(`<select class='form-control full dynamic_input cycle_type' data='cycles.data.${key}' fc-index='type'>`);
    element.push(`<option ${data.type == "year" ? "selected" : ""} value='year'>Year</option>`);
    element.push(`<option ${data.type == "era_year" ? "selected" : ""} value='era_year'>Era year</option>`);
    element.push(`<option ${data.type == "timespan_index" ? "selected" : ""} value='timespan_index'>Month in year</option>`);
    element.push(`<option ${data.type == "num_timespans" ? "selected" : ""} value='num_timespans'>Month count (since 1/1/1)</option>`);
    element.push(`<option ${data.type == "day" ? "selected" : ""} value='day'>Day in month</option>`);
    element.push(`<option ${data.type == "year_day" ? "selected" : ""} value='year_day'>Year day</option>`);
    element.push(`<option ${data.type == "epoch" ? "selected" : ""} value='epoch'>Epoch (days since 1/1/1)</option>`);
    element.push(`</select>`);
    element.push("</div>");

    element.push("<div class='row mt-2'>");
    element.push("<div class='col-6 pr-1 pl-0'>");
    element.push("<div>Length:</div>");
    element.push("</div>");

    element.push("<div class='col-6 pr-0 pl-1'>");
    element.push("<div>Offset:</div>");
    element.push("</div>");
    element.push("</div>");

    element.push("<div class='row mb-1'>");
    element.push("<div class='col-6 pr-1 pl-0'>");
    element.push(`<input type='number' step="1.0" class='form-control length dynamic_input' min='1' data='cycles.data.${key}' fc-index='length' value='${data.length}' />`);
    element.push("</div>");

    element.push("<div class='col-6 pr-0 pl-1'>");
    element.push(`<input type='number' step="1.0" class='form-control offset dynamic_input' min='0' data='cycles.data.${key}' fc-index='offset' value='${data.offset}'/>`);
    element.push("</div>");
    element.push("</div>");

    element.push("<div class='row mt-3 mb-2'>Number of names:</div>");

    element.push("<div class='row my-2'>");
    element.push("<div class='col-6 pl-0 pr-1'>");
    element.push(`<input type='number' step="1.0" class='form-control cycle-name-length' value='${data.names.length}' fc-index='${key}'/>`);
    element.push("</div>");
    element.push("<div class='col-6 pl-1 pr-0'>");
    element.push("<button type='button' class='full btn btn-primary cycle_quick_add'>Quick add</button>");
    element.push("</div>");
    element.push("</div>");
    element.push("<div class='row my-2 cycle-container border'>");
    element.push("<div class='cycle_list'>");
    for (index = 0; index < data.names.length; index++) {
        element.push(`<input type='text' class='form-control internal-list-name dynamic_input' data='cycles.data.${key}.names' fc-index='${index}'/>`);
    }
    element.push("</div>");
    element.push("</div>");
    element.push("</div>");
    element.push("</div>");

    element.push("</div>");

    element = $(element.join(""));

    element.find('.cycle_list').children().each(function(i) {
        $(this).val(data.names[i])
    });

    parent.append(element);

}

function add_era_to_list(parent, key, data) {

    var element = [];

    element.push(`<div class='sortable-container list-group-item era_inputs collapsed collapsible' index='${key}'>`);
    element.push("<div class='main-container'>");
    element.push("<div class='expand icon-expand'></div>");
    element.push("<div class='name-container'>");
    element.push(`<input type='text' class='form-control name-input small-input dynamic_input' data='eras.${key}' fc-index='name' tabindex='${(800 + key)}'/>`);
    element.push("</div>");
    element.push('<div class="remove-spacer"></div>');
    element.push("</div>");
    element.push("<div class='remove-container'>");
    element.push("<div class='remove-container-text'>Are you sure you want to remove this?</div>");
    element.push("<div class='btn_remove btn btn-danger icon-trash'></div>");
    element.push("<div class='btn_cancel btn btn-danger icon-remove'></div>");
    element.push("<div class='btn_accept btn btn-success icon-ok'></div>");
    element.push("</div>");

    element.push("<div class='collapse-container container mb-2'>");

    element.push(`<div class='row no-gutters my-1'>`);
    element.push("<div class='form-check col-12 py-2 border rounded'>");
    element.push(`<input type='checkbox' id='${key}_use_custom_format' class='form-check-input dynamic_input use_custom_format' data='eras.${key}.settings' fc-index='use_custom_format' ${(data.settings.use_custom_format ? "checked" : "")} />`);
    element.push(`<label for='${key}_use_custom_format' class='form-check-label ml-1'>`);
    element.push("Custom year header formatting");
    element.push("</label>");
    element.push("</div>");
    element.push("</div>");

    element.push("<div class='row mt-1'>");
    element.push("<div class='col'>");
    element.push("Format:");
    element.push(`<input type='text' class='form-control small-input dynamic_input era_formatting protip' data='eras.${key}' fc-index='formatting' ${!data.settings.use_custom_format ? "disabled" : ""} data-pt-position="right" data-pt-title="Check out the wiki on this by clicking on the question mark on the 'Eras' bar!"/>`);
    element.push("</div>");
    element.push("</div>");

    element.push("<div class='row my-1 no-gutters'>");
    element.push("<div class='col'>");
    element.push("<div class='separator'></div>");
    element.push("</div>");
    element.push("</div>");

    element.push(`<div class='row no-gutters my-1'>`);
    element.push("<div class='form-check col-12 py-2 border rounded'>");
    element.push(`<input type='checkbox' id='${key}_show_as_event' class='form-check-input dynamic_input show_as_event' data='eras.${key}.settings' fc-index='show_as_event' ${(data.settings.show_as_event ? "checked" : "")} />`);
    element.push(`<label for='${key}_show_as_event' class='form-check-label ml-1'>`);
    element.push("Show as event");
    element.push("</label>");
    element.push("</div>");
    element.push("</div>");

    element.push(`<div class='row my-2 ${(!data.settings.show_as_event ? "hidden" : "")}'>`);
    element.push("<div class='col'>");
    element.push(`<div class='btn btn-outline-primary full era_description html_edit' value='${data.description}' data='eras.${key}' fc-index='description'>Edit event description</div>`);
    element.push("</div>");
    element.push("</div>");

    element.push(`<div class='era_event_category_container ${(!data.settings.show_as_event ? "hidden" : "")}'>`);
    element.push("<div class='row mt-2'>");
    element.push("<div class='col'>");
    element.push("Event category:");
    element.push(`<select type='text' class='custom-select form-control event-category-list dynamic_input' data='eras.${key}.settings' fc-index='event_category_id'>`);
    for (var catkey in window.event_categories) {
        var name = window.event_categories[catkey].name;
        var id = window.event_categories[catkey].id;
        element.push(`<option value="${id}" ${(catkey == data.event_category_id ? "selected" : "")}>${name}</option>`);
    }
    element.push("</select>");
    element.push("</div>");
    element.push("</div>");
    element.push("</div>");

    element.push("<div class='row my-1 no-gutters'>");
    element.push("<div class='col'>");
    element.push("<div class='separator'></div>");
    element.push("</div>");
    element.push("</div>");

    element.push(`<div class='row no-gutters my-1'>`);
    element.push("<div class='form-check col-12 py-2 border rounded'>");
    element.push(`<input type='checkbox' for='${key}_starting_era' class='form-check-input dynamic_input starting_era' data='eras.${key}.settings' fc-index='starting_era' ${(data.settings.starting_era ? "checked" : "")} />`);
    element.push(`<label for='${key}_starting_era' class='form-check-label ml-1'>`);
    element.push("Is starting era (like B.C.)");
    element.push("</label>");
    element.push("</div>");
    element.push("</div>");

    element.push(`<div class='date_control_container ${data.settings.starting_era ? "hidden" : ""}'>`);

    element.push("<div class='row my-2 '>");
    element.push("<div class='col'>");
    element.push("<strong>Date:</strong>");

    element.push(`<div class='date_control'>`);
    element.push(`<div class='row my-2'>`);
    element.push("<div class='col'>");
    element.push(`<input type='number' step="1.0" class='date form-control small-input dynamic_input year-input' refresh data='eras.${key}.date' fc-index='year' value='${data.date.year}'/>`);
    element.push("</div>");
    element.push("</div>");

    element.push(`<div class='row my-2'>`);
    element.push("<div class='col'>");
    element.push(`<select type='number' class='date custom-select form-control timespan-list dynamic_input timespan_special' refresh data='eras.${key}.date' fc-index='timespan'>`);
    element.push("</select>");
    element.push("</div>");
    element.push("</div>");

    element.push(`<div class='row my-2'>`);
    element.push("<div class='col'>");
    element.push(`<select type='number' class='date custom-select form-control timespan-day-list dynamic_input day_special' refresh data='eras.${key}.date' fc-index='day'>`);
    element.push("</select>");
    element.push("</div>");
    element.push("</div>");
    element.push("</div>");
    element.push("</div>");
    element.push("</div>");

    element.push(`<div class='row my-2'>`);
    element.push("<div class='col'>");
    element.push(`<div class='btn btn-secondary full preview_era_date'>Preview era start date</div>`);
    element.push("</div>");
    element.push("</div>");

    element.push("<div class='row my-2 bold-text'>");
    element.push("<div class='col'>");
    element.push("Date settings:");
    element.push("</div>");
    element.push("</div>");

    element.push(`<div class='row no-gutters my-1'>`);
    element.push("<div class='form-check col-12 py-2 border rounded'>");
    element.push(`<input type='checkbox' id='${key}_restart_year' class='form-check-input dynamic_input restart_era' data='eras.${key}.settings' fc-index='restart' ${(data.settings.restart ? "checked" : "")} />`);
    element.push(`<label for='${key}_restart_year' class='form-check-label ml-1'>`);
    element.push("Restarts year count");
    element.push("</label>");
    element.push("</div>");
    element.push("</div>");

    element.push(`<div class='row no-gutters my-1'>`);
    element.push(`<div class='form-check col-12 py-2 border rounded ${!window.static_data.seasons.global_settings.periodic_seasons ? "disabled" : ""}'>`);
    element.push(`<input type='checkbox' id='${key}_ends_year' class='form-check-input dynamic_input ends_year' ${!window.static_data.seasons.global_settings.periodic_seasons ? "disabled" : ""} data='eras.${key}.settings' fc-index='ends_year' ${(data.settings.ends_year ? "checked" : "")} />`);
    element.push(`<label for='${key}_ends_year' class='form-check-label ml-1'>`);
    element.push("Ends year prematurely");
    element.push("</label>");
    element.push(`<p class='m-0 mt-2 ends_year_explaination font-italic small-text ${window.static_data.seasons.global_settings.periodic_seasons ? "hidden" : ""}'>This is disabled because you have seasons based on dates - that means that the calendar cannot end its years early because some seasons could disappear.</p>`);
    element.push("</div>");
    element.push("</div>");

    element.push("</div>");

    element.push("</div>");

    element.push("</div>");

    var element = $(element.join(""));

    element.find('.name-input').val(data.name);

    var formatting = data.settings.use_custom_format ? data.formatting : 'Year {{year}} - {{era_name}}';
    element.find('.era_formatting').val(formatting);

    parent.append(element);

    return element;

}

function add_category_to_list(parent, key, data) {
    parent.append(`<div class='sortable-container list-group-item category_inputs collapsed collapsible' index='${key}' x-data='{ color: "${data.event_settings.color}", text_style: "${data.event_settings.text}" }'>

		<div class='main-container'>
			<div class='expand icon-expand'></div>
			<div class='name-container'>
				<input value='${data.name}' type='text' name='name_input' fc-index='name' class='form-control name-input small-input category_name_input' data='${key}' tabindex='${(700 + key)}'/>
			</div>
			<div class="remove-spacer"></div>
		</div>
		<div class='remove-container'>
			<div class='remove-container-text'>Are you sure you want to remove this?</div>
			<div class='btn_remove btn btn-danger icon-trash'></div>
			<div class='btn_cancel btn btn-danger icon-remove'></div>
			<div class='btn_accept btn btn-success icon-ok'></div>
		</div>
		<div class='collapse-container container mb-2'>

			<div class='row no-gutters my-1 bold-text'>
				<div class='col'>
					Settings:
				</div>
			</div>

			<input type='hidden' class='category_id' value='${key}'>

			<div class='row no-gutters mt-1 mb-2'>
                <div class="list-group col-12">
                    <div class='form-check list-group-item py-2'>
                        <input type='checkbox' id='${key}_cat_global_hide' class='form-check-input category_dynamic_input dynamic_input global_hide' data='${key}.category_settings' fc-index='hide' ${(data.category_settings.hide ? "checked" : "")} />
                        <label for='${key}_cat_global_hide' class='form-check-label ml-1'>
                            Hide category from viewers
                        </label>
                    </div>

                    <div class='form-check list-group-item py-2'>
                        <input type='checkbox' id='${key}_cat_player_usable' class='form-check-input category_dynamic_input dynamic_input player_usable' data='${key}.category_settings' fc-index='player_usable' ${(data.category_settings.player_usable ? "checked" : "")} />
                        <label for='${key}_cat_player_usable' class='form-check-label ml-1'>
                            Category usable by players
                        </label>
                    </div>
                </div>
			</div>

			<div class='row no-gutters bold-text'>
				<div class='col'>
					Event overrides:
				</div>
			</div>

			<div class='row no-gutters mt-1 mb-2'>
                <div class="list-group col-12">
                    <div class='form-check list-group-item py-2'>
                        <input type='checkbox' id='${key}_cat_hide_full' class='form-check-input category_dynamic_input dynamic_input' data='${key}.event_settings' fc-index='hide_full' ${(data.event_settings.hide_full ? "checked" : "")} />
                        <label for='${key}_cat_hide_full' class='form-check-label ml-1'>
                            Fully hide event
                        </label>
                    </div>

                    <div class='form-check list-group-item py-2'>
                        <input type='checkbox' id='${key}_cat_hide' class='form-check-input category_dynamic_input dynamic_input' data='${key}.event_settings' fc-index='hide' ${(data.event_settings.hide ? "checked" : "")} />
                        <label for='${key}_cat_hide' class='form-check-label ml-1'>
                            Hide event
                        </label>
                    </div>

                    <div class='form-check list-group-item py-2'>
                        <input type='checkbox' id='${key}_cat_print' class='form-check-input category_dynamic_input dynamic_input' data='${key}.event_settings' fc-index='print' ${(data.event_settings.noprint ? "checked" : "")} />
                        <label for='${key}_cat_print' class='form-check-label ml-1'>
                            Show event when printing
                        </label>
                    </div>
                </div>
			</div>

			<div class='row no-gutters my-2'>
				<div class='col-md-6 col-sm-12'>
					Color:
				</div>

				<div class='col-md-6 col-sm-12'>
                    Display:
				</div>

                <div class='input-group col-12 mt-1 mb-2' x-data="{ colorOptions: ['Dark-Solid', 'Red', 'Pink', 'Purple', 'Deep-Purple', 'Blue', 'Light-Blue', 'Cyan', 'Teal', 'Green', 'Light-Green', 'Lime', 'Yellow', 'Orange', 'Blue-Grey'] }">
                    <select x-model='color' class='custom-select form-control category_dynamic_input dynamic_input event-text-input color_display' data='${key}.event_settings' fc-index='color'>
                        <template x-for="colorOption in colorOptions">
                            <option x-text="colorOption" :value="colorOption" :selected="colorOption == color"></option>
                        </template>
                    </select>
                    <select x-model='text_style' class='custom-select form-control category_dynamic_input dynamic_input event-text-input text_display' data='${key}.event_settings' fc-index='text'>
                        <option value="text"${(data.event_settings.text == 'text' ? ' selected' : '')}>Just text</option>
                        <option value="dot"${(data.event_settings.text == 'dot' ? ' selected' : '')}>• Dot with text</option>
                        <option value="background"${(data.event_settings.text == 'background' ? ' selected' : '')}>Background</option>
                    </select>
                </div>
			</div>

			<div class='row no-gutters mt-1'>
				<div class='col'>
					Event appearance:
				</div>
			</div>

			<div class='row no-gutters'>
				<div class='col-6'>
                    <div class='event-text-output event' :class='color + " " + text_style'>Event (visible)</div>
				</div>
				<div class='col-6 px-1'>
					<div class='event-text-output hidden_event event' :class='color + " " + text_style'>Event (hidden)</div>
				</div>
			</div>
		</div>

	</div>`);
}


function add_link_to_list(parent, key, locked, calendar) {

    var element = [];

    element.push(`<div class='sortable-container list-group-item collapsible ${locked ? "collapsed" : "expanded"}' index='${key}'>`);
    element.push("<div class='main-container'>");
    element.push(`<div class='expand icon-${locked ? "expand" : "collapse"} ml-2'></div>`);
    element.push("<div class='name-container'>");
    element.push(`<div><a href="${window.baseurl}calendars/${calendar.hash}/edit" target="_blank">${calendar.name}</a></div>`);
    element.push(`</div>`);
    element.push("</div>");

    element.push("<div class='collapse-container container mb-2'>");

    element.push("<div class='row my-1 bold-text'>");

    element.push("<div class='col'>");

    element.push("Relative Start Date:");

    element.push(`<div class='date_control'>`);
    element.push(`<div class='row my-2'>`);
    element.push("<div class='col'>");
    element.push(`<input type='number' step="1.0" class='date form-control small-input year-input' ${(locked ? 'disabled' : '')}>`);
    element.push("</div>");
    element.push("</div>");

    element.push(`<div class='row my-2'>`);
    element.push("<div class='col'>");
    element.push(`<select type='number' class='date custom-select form-control timespan-list' ${(locked ? 'disabled' : '')}>`);
    element.push("</select>");
    element.push("</div>");
    element.push("</div>");

    element.push(`<div class='row my-2'>`);
    element.push("<div class='col'>");
    element.push(`<select type='number' class='date custom-select form-control timespan-day-list' ${(locked ? 'disabled' : '')}>`);
    element.push("</select>");
    element.push("</div>");
    element.push("</div>");
    element.push("</div>");
    element.push("</div>");
    element.push("</div>");

    element.push("<div class='row no-gutters my-1'>");
    if (locked) {
        element.push(`<button type='button' class='btn btn-danger full unlink_calendar' hash='${calendar.hash}'>Unlink</button>`);
    } else {
        element.push(`<button type='button' class='btn btn-primary full link_calendar' hash='${calendar.hash}'>Link</button>`);
    }
    element.push("</div>");

    element.push("</div>");

    var element = $(element.join(""));

    parent.append(element);

    if (locked) {
        var parent_link_date = JSON.parse(calendar.parent_link_date);
    } else {
        var parent_link_date = [0, 0, 1];
    }

    element.find('.year-input').val(unconvert_year(window.static_data, Number(parent_link_date[0])));
    repopulate_timespan_select(element.find('.timespan-list'), Number(parent_link_date[1]), false)
    repopulate_day_select(element.find('.timespan-day-list'), Number(parent_link_date[2]), false)

    return element;
}

function add_user_to_list(parent, key, data) {

    var element = [];

    element.push(`<div class='sortable-container list-group-item' index='${key}'>`);

    element.push("<div class='collapse-container container mb-2'>");

    element.push("<div class='row no-gutters my-2'>");
    element.push("<div class='col-md'>");
    element.push(`<h4 class='m-0'>${data.username}</h4>`);
    element.push("</div>");
    element.push("<div class='col-md-auto'>");
    element.push(`<button type='button' class='btn btn-sm btn-danger full remove_user' role='${data.user_role}' username='${data.username}' user_id='${data.id}'><i class='fas fa-trash'></i></button>`);
    element.push("</div>");
    element.push("</div>");

    element.push("<div class='row no-gutters my-2'>");
    element.push("<div class='col'>");
    element.push("<div class='separator'></div>");
    element.push("</div>");
    element.push("</div>");

    if (data.user_role != "invited") {

        element.push("<div class='row no-gutters mt-1'>");
        element.push(`<p class='m-0'>Permissions:</p>`);
        element.push("</div>");

        element.push("<div class='row no-gutters mb-1'>");
        element.push("<div class='col-md'>");
        element.push("<select class='form-control user_permissions_select' onchange='user_permissions_select(this)'>");
        element.push(`<option ${data.user_role == 'observer' ? "selected" : ""} value='observer'>Observer</option>`);
        element.push(`<option ${data.user_role == 'player' ? "selected" : ""} value='player'>Player</option>`);
        element.push(`<option ${data.user_role == 'co-owner' ? "selected" : ""} value='co-owner'>CO-GM</option>`);
        element.push("</select>");
        element.push("</div>");
        element.push("<div class='col-md-auto'>");
        element.push(`<button type='button' class='btn btn btn-primary full update_user_permissions' disabled permissions_val='${data.user_role}' user_id='${data.id}'>Update</button>`);
        element.push("</div>");
        element.push("</div>");

    } else {

        element.push("<div class='row no-gutters my-1'>");
        element.push(`<p class='m-0'>We've sent them an invitation to your calendar, and now we're just waiting for them to accept it!</p>`);
        element.push("</div>");

        element.push("<div class='row no-gutters my-2'>");
        element.push(`<button type="button" class="btn btn-primary resend_invitation" user_email='${data.username}'>Resend invitation email</button>`);
        element.push("</div>");

    }

    element.push("<div class='row no-gutters my-1 hidden'>");
    element.push(`<p class='m-0 user_permissions_text'></p>`);
    element.push("</div>");

    element.push("</div>");

    element.push("</div>");

    var element = $(element.join(""));

    parent.append(element);

    return element;
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

        var text = [];

        text.push(`<h3 style="opacity: 0.7;">Calendar Creation (${creation.current_step}/${creation.steps})</h3><ol>`);

        for (var i = 0; i < creation.text.length; i++) {

            text.push(`<li>${creation.text[i]}</li>`);

        }
        text.push(`</ol class="mb-4">`);

        text.push(`<img class="w-100" src='/resources/calendar_create.svg'>`);

        $('#modal_text').empty().append(message);
        $('#modal_background').removeClass().addClass('flexible_background transparent').css('display', 'flex');
        $('#modal').removeClass().addClass('creation');

        evaluate_background_size();

        $('#generator_container').removeClass();
        $('#generator_container').addClass('step-' + (creation.current_step));

    } else {

        $('#generator_container').removeClass();

        var errors = get_errors();

        if (errors.length == 0 && $('.static_input.invalid').length == 0 && $('.dynamic_input.invalid').length == 0) {

            $('#modal_background').removeClass().addClass('flexible_background').css('display', 'none');

            error_check(type, rebuild);
            recalc_stats();

        } else {

            var text = [];

            $('.static_input.invalid').each(function() {
                errors.push($(this).attr('error_msg'));
            })

            $('.dynamic_input.invalid').each(function() {
                errors.push($(this).attr('error_msg'));
            })

            text.push(`Errors:<ol>`);

            for (var i = 0; i < errors.length; i++) {

                text.push(`<li>${errors[i]}</li>`);

            }
            text.push(`</ol>`);

            error_message(text.join(''));

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

        if (!preview_date.follow) {

            update_preview_calendar();

            pre_rebuild_calendar('preview', preview_date);

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
            evaluate_sun();
        }
    }

}

function evaluate_remove_buttons() {
    $('.month .btn_remove, .week_day .btn_remove').each(function() {
        $(this).toggleClass('disabled', $(this).closest('.sortable').children().length == 1);
    });
}

function reindex_weekday_sortable() {
    var tabindex = 1;

    window.static_data.year_data.global_week = [];

    global_week_sortable.children().each(function(i) {

        $(this).find(".name-input").attr("key", i);
        $(this).find(".name-input").prop("tabindex", tabindex)
        tabindex++;

        window.static_data.year_data.global_week[i] = $(this).find('.name-input').val();

    });

    populate_first_day_select();

    do_error_check();
    evaluate_remove_buttons();
}

function populate_first_day_select(val) {
    var custom_week = false;
    timespan_sortable.children().each(function() {
        if ($(this).find('.unique-week-input').is(':checked')) {
            custom_week = true;
        }
    });

    var i = 0;

    var timespan = false;

    if (custom_week) {
        while (true) {
            var timespans = get_timespans_in_year(window.static_data, i, true);
            if (timespans.length > 0) {
                if (window.static_data.year_data.timespans[timespans[0].id].week !== undefined) {
                    timespan = timespans[0].id;
                }
                break;
            }
            if (i > 1000) break;
            i++;
        }
    }

    var week = timespan === false ? window.static_data.year_data.global_week : window.static_data.year_data.timespans[timespan].week;

    var html = [];

    for (var i = 0; i < week.length; i++) {

        html.push(`<option value='${i + 1}'>${week[i]}</option>`);

    }

    if (val !== undefined) {
        var selected_first_day = val;
    } else {
        var selected_first_day = first_day.val() ? first_day.val() : 1;
    }

    first_day.html(html.join('')).val(selected_first_day);
}

function repopulate_weekday_select(elements, value, change) {
    change = change === undefined ? true : change;

    elements.each(function() {

        var timespan = $(this).attr('timespan') | 0;

        var inclusive = $(this).hasClass('inclusive');

        if (timespan === undefined) {

            var week = window.static_data.year_data.global_week;

        } else {

            var week = window.static_data.year_data.timespans[timespan].week ? window.static_data.year_data.timespans[timespan].week : window.static_data.year_data.global_week;

        }

        var selected = value === undefined ? $(this).val() | 0 : value;

        selected = selected > week.length ? week.length - 1 : selected;

        var html = [];

        if (inclusive) {
            html.push(`<option value='0'>Before ${week[0]}</option>`);
        } else {
            selected = selected == 0 ? 1 : selected;
        }

        for (var i = 0; i < week.length; i++) {

            html.push(`<option value='${i + 1}'>${week[i]}</option>`);

        }

        $(this).html(html.join('')).val(selected);

        if (change) {
            $(this).change();
        }
    });
}

function reindex_timespan_sortable() {
    var tabindex = 100;

    timespan_sortable.children().each(function(i) {

    });

    window.static_data.year_data.timespans = [];

    var previous_indexes = [];

    timespan_sortable.children().each(function(i) {

        $('.dynamic_input', this).each(function() {
            $(this).attr('data', $(this).attr('data').replace(/[0-9]+/g, i));
        });

        let previous_index = $(this).attr('index');

        previous_indexes.push(previous_index)

        $(this).attr('index', i);

        $(this).find('.name-input').prop('tabindex', tabindex + 1)
        tabindex++;
        $(this).find('.length-input').prop('tabindex', tabindex + 1)
        tabindex++;

        window.static_data.year_data.timespans[i] = {
            'name': $(this).find('.name-input').val(),
            'type': $(this).attr('type'),
            'length': Number($(this).find('.length-input').val()),
            'interval': Number($(this).find('.interval').val()),
            'offset': Number($(this).find('.offset').val())
        };

        $(this).find('.unique-week-input').prop('id', i + '_custom_week')
        $(this).find('.unique-week-input').next().prop('for', i + '_custom_week')

        if ($(this).find('.unique-week-input').is(':checked')) {
            window.static_data.year_data.timespans[i].week = [];
            $(this).find('.week_list').children().each(function(j) {
                window.static_data.year_data.timespans[i].week[j] = $(this).val();
            });
        }

    });

    repopulate_timespan_select();

    leap_day_list.children().each(function() {
        var index = $(this).find('.timespan-list').val() | 0;
        var new_index = previous_indexes[index];
        $(this).find('.timespan-list').val(new_index);
    });

    do_error_check();

    evaluate_remove_buttons();

    evaluate_custom_weeks();
}

function reindex_leap_day_list() {
    var tabindex = 200;

    window.static_data.year_data.leap_days = [];

    leap_day_list.children().each(function(i) {

        $('.dynamic_input', this).each(function() {
            $(this).attr('data', $(this).attr('data').replace(/[0-9]+/g, i));
        });

        $(this).find('.name-input').prop('tabindex', tabindex + 1)
        tabindex++;

        var intercalary = $(this).attr('type') == 'intercalary';

        window.static_data.year_data.leap_days[i] = {
            'name': $(this).find('.name-input').val(),
            'intercalary': intercalary,
            'timespan': Number($(this).find('.timespan-list').val()),
            'adds_week_day': $(this).find('.adds-week-day').is(':checked'),
            'day': intercalary ? Number($(this).find('.timespan-day-list').val()) : Number($(this).find('.week-day-select').val()),
            'week_day': $(this).find('.internal-list-name').val(),
            'interval': $(this).find('.interval').val(),
            'offset': Number($(this).find('.offset').val())
        };

    });

    do_error_check();

    evaluate_remove_buttons();
}

function evaluate_custom_weeks() {
    var custom_week = false;
    timespan_sortable.children().each(function(i) {
        if ($(this).find('.unique-week-input').is(':checked')) {
            custom_week = true;
        }
    });

    leap_day_list.children().each(function(i) {
        if ($(this).find('.adds-week-day').is(':checked')) {
            custom_week = true;
        }
    });

    if (custom_week) {
        $('#month_overflow').prop('checked', !custom_week);
        window.static_data.year_data.overflow = false;
    }

    $('#month_overflow').prop('disabled', custom_week);
    $('.month_overflow_container').toggleClass("hidden", custom_week)
    $('#overflow_explanation').toggleClass('hidden', !custom_week);

    populate_first_day_select();
}

function reindex_season_sortable(key) {
    var tabindex = 400;

    if (!window.static_data.seasons.global_settings.periodic_seasons) {
        sort_list_by_partial_date(season_sortable);
    }

    window.static_data.seasons.data = [];

    season_sortable.children().each(function(i) {

        $(this).attr("index", i);

        $('.dynamic_input', this).each(function() {
            $(this).attr('data', $(this).attr('data').replace(/[0-9]+/g, i));
            $(this).attr('fc-index', $(this).attr('fc-index').replace(/[0-9]+/g, i));
        });

        $(this).find(".name-input").prop("tabindex", tabindex)
        tabindex++;

        window.static_data.seasons.data[i] = {
            "name": $(this).find('.name-input').val(),
            "color": [
                "#00CBFC",
                "#00CBFC",
                // $(this).find('.start_color').spectrum('get', 'hex').toString(),
                // $(this).find('.end_color').spectrum('get', 'hex').toString(),
            ],
            "time": {
                "sunrise": {
                    "hour": ($(this).find('input[clocktype="sunrise_hour"]').val() | 0),
                    "minute": ($(this).find('input[clocktype="sunrise_minute"]').val() | 0)
                },
                "sunset": {
                    "hour": ($(this).find('input[clocktype="sunset_hour"]').val() | 0),
                    "minute": ($(this).find('input[clocktype="sunset_minute"]').val() | 0)
                }
            }
        };

        if (window.static_data.seasons.global_settings.periodic_seasons) {

            window.static_data.seasons.data[i].transition_length = parseFloat($(this).find('.transition_length').val());
            window.static_data.seasons.data[i].duration = parseFloat($(this).find('.duration').val());

        } else {

            window.static_data.seasons.data[i].timespan = ($(this).find('.timespan-list').val() | 0);
            window.static_data.seasons.data[i].day = ($(this).find('.timespan-day-list').val() | 0);

        }

        if ($(this).find('.preset-season-list').children().length > 0) {
            if (window.static_data.seasons.global_settings.preset_order === undefined) {
                window.static_data.seasons.global_settings.preset_order = [];
            }
            window.static_data.seasons.global_settings.preset_order[i] = $(this).find('.preset-season-list').val() | 0;
        }

    });

    var no_seasons = window.static_data.seasons.data.length == 0;
    $('#has_seasons_container').toggleClass('hidden', no_seasons).find('select, input').prop('disabled', no_seasons);
    $('#no_seasons_container').toggleClass('hidden', !no_seasons);

    if (no_seasons) {
        window.static_data.seasons.global_settings.preset_order = undefined;
    }

    populate_preset_season_list();

    if (key !== undefined) {
        location_list.find(`.location_season[fc-index="${key}"]`).remove();
    }

    eval_clock();

    var no_locations = (window.static_data.seasons.data.length == 0 || !window.static_data.seasons.global_settings.enable_weather) && !window.static_data.clock.enabled;
    $('#locations_warning_hidden').toggleClass('hidden', no_locations).find('select, input').prop('disabled', no_locations);
    $('#locations_warning').toggleClass('hidden', !no_locations);

    do_error_check('seasons');
}

function populate_preset_season_list() {
    let length = window.static_data.seasons.data.length;
    let preset_seasons;

    if (length === 2) {
        preset_seasons = ['Winter', 'Summer'];
    } else if (length === 4) {
        preset_seasons = ['Winter', 'Spring', 'Summer', 'Autumn'];
    } else {
        window.static_data.seasons.global_settings.preset_order = undefined;
        $('.preset-season-list-container').toggleClass('hidden', true).prop('disabled', true);
        return;
    }

    let automatic = detect_automatic_mapping();

    if (!automatic) {

        $('.preset-season-list-container').toggleClass('hidden', false).prop('disabled', false);

        let preset_order = []

        if (new Set((window.static_data.seasons.global_settings.preset_order ?? [])).size !== length) {
            window.static_data.seasons.global_settings.preset_order = undefined;
        }

        $('.preset-season-list').each(function(i) {

            $(this).empty();

            for (let j in preset_seasons) {
                let name = preset_seasons[j];
                let o = new Option(name, j);
                $(o).html(name);
                $(this).append(o);
            }

            if (window.static_data.seasons.global_settings.preset_order === undefined) {
                $(this)[0].selectedIndex = i;
                preset_order.push(i);
            } else {
                $(this)[0].selectedIndex = window.static_data.seasons.global_settings.preset_order[i];
            }

        });

        if (window.static_data.seasons.global_settings.preset_order === undefined) {
            window.static_data.seasons.global_settings.preset_order = clone(preset_order);
        }
    } else {
        $('.preset-season-list').empty();
        $('.preset-season-list-container').toggleClass('hidden', true).prop('disabled', true);
    }
}

function detect_automatic_mapping() {
    if (window.static_data.seasons.data.length == 2) {
        var preset_seasons = ['winter', 'summer'];
    } else if (window.static_data.seasons.data.length == 4) {
        var preset_seasons = ['winter', 'spring', 'summer', 'autumn'];
    } else {
        return false;
    }

    let season_test = [];
    for (var index in window.static_data.seasons.data) {
        var season = window.static_data.seasons.data[index];
        let preset_index = preset_seasons.indexOf(season.name.toLowerCase());
        if (preset_index == -1 && season.name.toLowerCase() == "fall" && window.static_data.seasons.data.length == 4) {
            preset_index = 3;
        }
        if (preset_index > -1) {
            season_test.push(preset_index)
        }
    }

    if (season_test.length == window.static_data.seasons.data.length) {
        window.static_data.seasons.global_settings.preset_order = season_test;
        return true;
    }

    return false;
}

function evaluate_clashing_preset_seasons(element) {
    let season_index = element.closest('.sortable-container').attr('index') | 0;
    let prev_preset_index = element.data('prev') | 0;
    let preset_index = element.val() | 0;

    for (var switch_season_index in window.static_data.seasons.global_settings.preset_order) {
        if (switch_season_index == season_index) {
            continue;
        }
        if (window.static_data.seasons.global_settings.preset_order[switch_season_index] == preset_index) {
            break;
        }
    }

    window.static_data.seasons.global_settings.preset_order[switch_season_index] = prev_preset_index;

    season_sortable.children().eq(switch_season_index).find('.preset-season-list')[0].selectedIndex = prev_preset_index;
}

function reindex_location_list() {
    var tabindex = 500;

    window.static_data.seasons.locations = [];

    location_list.children().each(function(i) {

        var data = {};

        $(this).attr("key", i);
        $(this).find(".name-input").prop("tabindex", tabindex);
        tabindex++;

        data = {
            "name": $(this).find(".name-input").val(),
            "seasons": [],
            "settings": {
                "timezone": {
                    "hour": ($(this).find("input[fc-index='timezone_hour']").val() | 0),
                    "minute": ($(this).find("input[fc-index='timezone_minute']").val() | 0),
                },

                "season_based_time": $(this).find("input[fc-index='season_based_time']").is(":checked"),

                "large_noise_frequency": Number($(this).find("input[fc-index='large_noise_frequency']").val()),
                "large_noise_amplitude": Number($(this).find("input[fc-index='large_noise_amplitude']").val()),

                "medium_noise_frequency": Number($(this).find("input[fc-index='medium_noise_frequency']").val()),
                "medium_noise_amplitude": Number($(this).find("input[fc-index='medium_noise_amplitude']").val()),

                "small_noise_frequency": Number($(this).find("input[fc-index='small_noise_frequency']").val()),
                "small_noise_amplitude": Number($(this).find("input[fc-index='small_noise_amplitude']").val())
            }
        };

        $(this).find('.location_season').each(function(j) {

            data.seasons[j] = {};

            data.seasons[j].time = {
                "sunrise": {
                    "hour": $(this).find('input[clocktype="sunrise_hour"]').val() | 0,
                    "minute": $(this).find('input[clocktype="sunrise_minute"]').val() | 0,
                },
                "sunset": {
                    "hour": $(this).find('input[clocktype="sunset_hour"]').val() | 0,
                    "minute": $(this).find('input[clocktype="sunset_minute"]').val() | 0,
                }
            };
            data.seasons[j].weather = {
                "temp_low": $(this).find('input[fc-index="temp_low"]').val() | 0,
                "temp_high": $(this).find('input[fc-index="temp_high"]').val() | 0,
                "precipitation": ($(this).find('input[fc-index="precipitation"]').val() | 0) / 100,
                "precipitation_intensity": ($(this).find('input[fc-index="precipitation_intensity"]').val() | 0) / 100
            };

        });

        var old_season_num = $(this).find('.location_season').length;
        var new_season_num = window.static_data.seasons.data.length;

        if (old_season_num != new_season_num) {

            if (new_season_num > old_season_num) {

                for (var j = $(this).find('.location_season').length; j < window.static_data.seasons.data.length; j++) {

                    data.seasons[j] = {
                        "time": window.static_data.seasons.data[i].time,
                        "weather": {
                            "temp_low": 0,
                            "temp_high": 0,
                            "precipitation": 0,
                            "precipitation_intensity": 0
                        }
                    }
                }

            } else {

                data.seasons.splice(window.static_data.seasons.data.length, $(this).find('.location_season').length);

            }

        }

        window.static_data.seasons.locations[i] = data;

    });

    if (window.static_data.seasons.locations.length == 0) {
        window.dynamic_data.location = "";
        window.dynamic_data.custom_location = false;
    }

    location_list.empty();

    for (var i = 0; i < window.static_data.seasons.locations.length; i++) {
        add_location_to_list(location_list, i, window.static_data.seasons.locations[i]);
    }

    // $('.slider_percentage').slider({
    //     min: 0,
    //     max: 100,
    //     step: 1,
    //     change: function(event, ui) {
    //         $(this).parent().parent().find('.slider_input').val($(this).slider('value')).change();
    //     },
    //     slide: function(event, ui) {
    //         $(this).parent().parent().find('.slider_input').val($(this).slider('value'));
    //     }
    // });

    // $('.slider_percentage').each(function() {
    //     $(this).slider('option', 'value', parseInt($(this).parent().parent().find('.slider_input').val()));
    // });

    repopulate_location_select_list();
}

function reindex_cycle_sortable() {
    window.static_data.cycles.data = [];

    $('#cycle_sortable').children().each(function(i) {
        $('.dynamic_input', this).each(function() {
            $(this).attr('data', $(this).attr('data').replace(/[0-9]+/g, i));
        });
        $(this).attr('key', i);
        $(this).find('.main-container').find('.cycle-text').text(`Cycle #${i + 1} - Using {{${i + 1}}}`)

        window.static_data.cycles.data[i] = {
            'length': ($(this).find('.length').val() | 0),
            'offset': ($(this).find('.offset').val() | 0),
            'type': $(this).find('.cycle_type').val(),
            'names': []
        };

        $(this).find('.cycle_list').children().each(function(j) {
            window.static_data.cycles.data[i].names[j] = $(this).val();
        });

    });

    do_error_check();
}

function reindex_moon_list() {
    window.static_data.moons = [];

    $('#moon_list').children().each(function(i) {

        $('.dynamic_input', this).each(function() {
            $(this).attr('data', $(this).attr('data').replace(/[0-9]+/g, i));
        });

        $(this).attr('key', i);

        window.static_data.moons[i] = {
            'name': $(this).find('.name-input').val(),
            'custom_phase': $(this).find('.custom_phase').is(':checked'),
            'color': "#00CBFC",
            // 'color': $(this).find('.color').spectrum('get', 'hex').toString(),
            'hidden': $(this).find('.moon-hidden').is(':checked'),
            'custom_cycle': $(this).find('.custom_cycle').val(),
            'cycle': ($(this).find('.cycle').val() | 0),
            'shift': ($(this).find('.shift').val() | 0),

        };

        if (window.static_data.moons[i].custom_phase) {

            window.static_data.moons[i].granularity = Math.max.apply(null, window.static_data.moons[i].custom_cycle.split(',')) + 1;

        } else {

            window.static_data.moons[i].granularity = get_moon_granularity(window.static_data.moons[i].cycle)
        }

    });

    do_error_check();
}

function reindex_era_list() {
    sort_list_by_date(era_list);

    era_list.children().each(function() {

        var starting_era = $(this).find('.starting_era').is(':checked');

        if (starting_era) {
            $(this).insertBefore(era_list.children().eq(0))
        }

    });

    window.static_data.eras = [];

    era_list.children().each(function(i) {

        $('.dynamic_input', this).each(function() {
            $(this).attr('data', $(this).attr('data').replace(/[0-9]+/g, i));
        });

        $(this).attr('key', i);

        const starting_era = $(this).find('.starting_era').is(':checked');

        window.static_data.eras[i] = {
            'name': $(this).find('.name-input').val(),
            'formatting': $(this).find('.era_formatting').val(),
            'description': $(this).find('.era_description').attr('value'),
            'settings': {
                'use_custom_format': $(this).find('.use_custom_format').is(':checked'),
                'show_as_event': $(this).find('.show_as_event').is(':checked'),
                'starting_era': starting_era || $(this).find('.starting_era').val() === "1",
                'event_category_id': $(this).find('.event-category-list').val(),
                'ends_year': !starting_era && ($(this).find('.ends_year').is(':checked') || $(this).find('.ends_year').val() === "1"),
                'restart': !starting_era && ($(this).find('.restart_era').is(':checked'))
            },
            'date': {
                'year': ($(this).find('.year-input').val() | 0),
                'timespan': ($(this).find('.timespan-list').val() | 0),
                'day': ($(this).find('.timespan-day-list').val() | 0)
            }
        };

        window.static_data.eras[i].date.epoch = evaluate_calendar_start(window.static_data, convert_year(window.static_data, window.static_data.eras[i].date.year), window.static_data.eras[i].date.timespan, window.static_data.eras[i].date.day).epoch;

    });

    window.dynamic_date_manager = new date_manager(window.dynamic_data.year, window.dynamic_data.timespan, window.dynamic_data.day);
    window.dynamic_data.epoch = window.dynamic_date_manager.epoch;

    window.preview_date_manager = new date_manager(window.dynamic_data.year, window.dynamic_data.timespan, window.dynamic_data.day);
    preview_date.epoch = window.preview_date_manager.epoch;

    do_error_check();
}

function sort_list_by_date(list) {
    let array = [];

    list.children().each(function(i) {
        let element = $(this);
        array.push({
            year: (element.find('.year-input').val() | 0),
            timespan: (element.find('.timespan-list').val() | 0),
            day: (element.find('.timespan-day-list').val() | 0),
            element: element,
            order: i
        });
    });

    array.sort((a, b) => {
        if (a.year >= b.year) {
            if (a.year == b.year) {
                if (a.timespan >= b.timespan) {
                    if (a.timespan == b.timespan) {
                        return a.day > b.day ? 1 : -1;
                    }
                } else {
                    return -1;
                }
            } else {
                return 1;
            }
        } else {
            return -1;
        }
    });

    let change = false;
    for (let i = 0; i < array.length - 1; i++) {
        if (array[i].order != (array[i + 1].order - 1)) {
            change = true;
            break;
        }
    }

    if (!change) {
        return;
    }

    let elements = [];
    for (let i in array) {
        elements.push(array[i].element)
    }

    list.empty().append(elements);
}

function sort_list_by_partial_date(list) {
    let array = [];

    list.children().each(function(i) {
        let element = $(this);
        array.push({
            timespan: (element.find('.timespan-list').val() | 0),
            day: (element.find('.timespan-day-list').val() | 0),
            element: element,
            order: i
        });
    });

    array.sort((a, b) => {
        if (a.timespan >= b.timespan) {
            if (a.timespan == b.timespan) {
                return a.day > b.day ? 1 : -1;
            }
        } else {
            return -1;
        }
    });

    let change = false;
    for (let i = 0; i < array.length - 1; i++) {
        if (array[i].order != (array[i + 1].order - 1)) {
            change = true;
            break;
        }
    }

    if (!change) {
        return;
    }

    let elements = [];
    for (let i in array) {
        elements.push(array[i].element)
    }

    list.empty().append(elements).change();
}

function reindex_event_category_list() {
    var new_order = [];

    event_category_list.children().each(function(i) {

        var index = $(this).attr('index');

        if (isNaN(index)) {
            $(this).attr('index', index);
        } else {
            $(this).attr('index', i);
        }


        new_order[index] = window.event_categories[index];

    });

    window.event_categories = clone(new_order);

    return;
}

function recreate_moon_colors() {
    // $('.moon_inputs .color').spectrum({
    //     color: "#FFFFFF",
    //     preferredFormat: "hex",
    //     showInput: true
    // });

    // $('.moon_inputs .shadow_color').spectrum({
    //     color: "#292b4a",
    //     preferredFormat: "hex",
    //     showInput: true
    // });

    // $('#moon_list').children().each(function(i) {
    //     $(this).find('.color').spectrum("set", window.static_data.moons[i].color ? window.static_data.moons[i].color : "#FFFFFF");
    //     $(this).find('.shadow_color').spectrum("set", window.static_data.moons[i].shadow_color ? window.static_data.moons[i].shadow_color : "#292b4a");
    // });
}

function evaluate_season_lengths() {
    var disable = window.static_data.seasons.data.length == 0 || (!window.static_data.seasons.global_settings.periodic_seasons && window.static_data.seasons.global_settings.periodic_seasons !== undefined);

    $('#season_length_text').toggleClass('hidden', disable).empty();

    if (disable) {
        return;
    }

    var data = {
        'season_length': 0
    };

    var epoch_start = evaluate_calendar_start(window.static_data, convert_year(window.static_data, window.dynamic_data.year)).epoch;
    var epoch_end = evaluate_calendar_start(window.static_data, convert_year(window.static_data, window.dynamic_data.year) + 1).epoch - 1;
    var season_length = epoch_end - epoch_start;

    for (var i = 0; i < window.static_data.seasons.data.length; i++) {
        window.current_season = window.static_data.seasons.data[i];
        data.season_length += window.current_season.transition_length;
        data.season_length += window.current_season.duration;
    }

    data.season_offset = window.static_data.seasons.global_settings.offset;

    var equal = avg_year_length(window.static_data) == data.season_length;

    var html = []
    html.push(`<div class='container'>`)
    html.push(`<div class='row py-1'>`)
    html.push(equal ? '<i class="col-auto px-0 mr-1 fas fa-check-circle" style="line-height:1.5;"></i>' : '<i class="col-auto px-0 mr-2 fas fa-exclamation-circle" style="line-height:1.5;"></i>');
    html.push(`<div class='col px-0'>Season length: ${data.season_length} / ${avg_year_length(window.static_data)} (year length)</div></div>`)
    html.push(`<div class='row'>${equal ? "The season length and year length are the same, and will not drift away from each other." : "The season length and year length at not the same, and will diverge over time. Use with caution."}</div>`)
    html.push(`</div>`)

    $('#season_length_text').toggleClass('warning', !equal).toggleClass('valid', equal);
    $('#season_length_text').html(html.join(''));
}

export function evaluate_season_daylength_warning() {
    if (!$('#season_daylength_text').length) return;

    let disable = window.static_data.seasons.data.length == 0 || (!window.static_data.seasons.global_settings.periodic_seasons && window.static_data.seasons.global_settings.periodic_seasons !== undefined);

    $('#season_daylength_text').toggleClass('hidden', disable).empty();

    if (disable || !window.dynamic_data.custom_location) return;

    let custom_location = window.static_data.seasons.locations[window.dynamic_data.location];

    if (custom_location.season_based_time) return;

    let html = []
    html.push(`<div class='container'>`)
    html.push(`<div class='row py-1'>`)
    html.push('<i class="col-auto px-0 mr-2 fas fa-exclamation-circle" style="line-height:1.5;"></i>');
    html.push(`<div class='col px-0'>You are currently using a custom location with custom season sunrise and sunset times. Solstices and equinoxes may behave unexpectedly.</div>`)
    html.push(`</div></div>`);

    $('#season_daylength_text').html(html.join(''));
}

function recalc_stats() {
    var year_length = avg_year_length(window.static_data);
    var month_length = avg_month_length(window.static_data);
    $('#fract_year_length').text(year_length);
    $('#fract_year_length').prop('title', year_length);
    $('#avg_month_length').text(month_length);
    $('#avg_month_length').prop('title', month_length);
    evaluate_season_lengths();
    evaluate_season_daylength_warning();
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

function populate_calendar_lists() {
    get_owned_calendars(function(calendars) {

        window.owned_calendars = calendars;

        calendar_link_list.html('');

        for (var calendar_hash in window.owned_calendars) {

            var calendar = window.owned_calendars[calendar_hash];

            if (calendar.hash == window.hash) {

                for (var index in calendar.children) {

                    var child_hash = calendar.children[index];
                    var child = window.owned_calendars[child_hash];

                    add_link_to_list(calendar_link_list, index, true, child);

                }

            }

        }

        var html = [];

        html.push(`<option>None</option>`);

        for (var calendar_hash in window.owned_calendars) {

            var child_calendar = window.owned_calendars[calendar_hash];

            if (child_calendar.hash != window.hash) {

                if (child_calendar.parent_hash) {

                    var calendar_owner = clone(window.owned_calendars[child_calendar.parent_hash]);

                    if (calendar_owner.hash == window.hash) {
                        calendar_owner.name = "this calendar";
                    }

                } else {

                    var calendar_owner = false;

                }

                html.push(`<option ${calendar_owner ? "disabled" : ""} value="${child_calendar.hash}">${child_calendar.name}${calendar_owner ? ` | Linked to ${calendar_owner.name}` : ""}</option>`);
            }
        }

        calendar_link_select.html(html.join(''));
        calendar_link_select.prop('disabled', false);

    });
}

export function evaluate_clock_inputs() {
    $('.clock_inputs :input, .clock_inputs :button, .render_clock').not('[clocktype]').prop('disabled', !window.static_data.clock.enabled);
    $('.clock_inputs, .render_clock').toggleClass('hidden', !window.static_data.clock.enabled);

    $('.do_render_clock :input, .do_render_clock :button').prop('disabled', !window.static_data.clock.render);
    $('.do_render_clock').toggleClass('hidden', !window.static_data.clock.render);

    $('.hour_input').each(function() {
        $(this).prop('min', 0).prop('max', window.static_data.clock.hours).not('[clocktype]').prop('disabled', !window.static_data.clock.enabled).toggleClass('hidden', !window.static_data.clock.enabled);
    });
    $('.minute_input').each(function() {
        $(this).prop('min', 1).prop('max', window.static_data.clock.minutes - 1).not('[clocktype]').prop('disabled', !window.static_data.clock.enabled).toggleClass('hidden', !window.static_data.clock.enabled);
    });

    $('input[clocktype="timezone_hour"]').each(function() {
        $(this).prop('min', window.static_data.clock.hours * -0.5).prop('max', window.static_data.clock.hours * 0.5).prop('disabled', !window.static_data.clock.enabled).toggleClass('hidden', !window.static_data.clock.enabled);
    });
    $('input[clocktype="timezone_minute"]').each(function() {
        $(this).prop('min', window.static_data.clock.minutes * -0.5).prop('max', window.static_data.clock.minutes * 0.5).prop('disabled', !window.static_data.clock.enabled).toggleClass('hidden', !window.static_data.clock.enabled);
    });

    $('#create_season_events').prop('disabled', window.static_data.seasons.data.length == 0 && !window.static_data.clock.enabled);
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

    for (var i = 0; i < window.static_data.year_data.global_week.length; i++) {
        let weekdayname = window.static_data.year_data.global_week[i];
        add_weekday_to_sortable(global_week_sortable, i, weekdayname);
    }

    let custom_week = window.static_data.year_data.timespans.filter(t => t?.week?.length > 0).length > 0
        || window.static_data.year_data.leap_days.filter(l => l.adds_week_day).length > 0;

    if (custom_week) {
        $('#month_overflow').prop('checked', !custom_week);
        window.static_data.year_data.overflow = false;
    }

    $('#month_overflow').prop('disabled', custom_week);
    $('.month_overflow_container').toggleClass("hidden", custom_week)
    $('#overflow_explanation').toggleClass('hidden', !custom_week);

    populate_first_day_select(window.static_data.year_data.first_day);
    $('#first_week_day_container').toggleClass('hidden', !window.static_data.year_data.overflow || window.static_data.year_data.global_week.length == 0).find('select').prop('disabled', !window.static_data.year_data.overflow || window.static_data.year_data.global_week.length == 0);
    // global_week_sortable.sortable('refresh');

    if (window.static_data.year_data.timespans.length > 0) {

        for (var i = 0; i < window.static_data.year_data.timespans.length; i++) {
            add_timespan_to_sortable(timespan_sortable, i, window.static_data.year_data.timespans[i]);
        }
        // timespan_sortable.sortable('refresh');

    }

    evaluate_custom_weeks();

    if (window.static_data.seasons) {

        for (var i = 0; i < window.static_data.seasons.data.length; i++) {
            add_season_to_sortable(season_sortable, i, window.static_data.seasons.data[i]);

            repopulate_timespan_select(season_sortable.children().last().find('.timespan-list'), window.static_data.seasons.data[i].timespan, false, false);
            repopulate_day_select(season_sortable.children().last().find('.timespan-day-list'), window.static_data.seasons.data[i].day, false, false);
        }

        populate_preset_season_list();

        $('.season_middle_btn').toggleClass('hidden', !window.static_data.clock.enabled || window.static_data.seasons.data.length < 3);

        $('.season_offset_container').prop('disabled', !window.static_data.seasons.global_settings.periodic_seasons).toggleClass('hidden', !window.static_data.seasons.global_settings.periodic_seasons);

        $('.season_text.dated').toggleClass('active', !window.static_data.seasons.global_settings.periodic_seasons);
        $('.season_text.periodic').toggleClass('active', window.static_data.seasons.global_settings.periodic_seasons);

        var no_seasons = window.static_data.seasons.data.length == 0;
        $('#has_seasons_container').toggleClass('hidden', no_seasons).find('select, input').prop('disabled', no_seasons);
        $('#no_seasons_container').toggleClass('hidden', !no_seasons);

        var no_locations = (window.static_data.seasons.data.length == 0 || !window.static_data.seasons.global_settings.enable_weather) && !window.static_data.clock.enabled;
        $('#locations_warning_hidden').toggleClass('hidden', no_locations).find('select, input').prop('disabled', no_locations);
        $('#locations_warning').toggleClass('hidden', !no_locations);

        evaluate_season_lengths();
        evaluate_season_daylength_warning()

        for (var i = 0; i < window.static_data.seasons.locations.length; i++) {
            add_location_to_list(location_list, i, window.static_data.seasons.locations[i]);
        }

        periodic_seasons_checkbox.prop("checked", window.static_data.seasons.global_settings.periodic_seasons);

        // $('.slider_percentage').slider({
        //     min: 0,
        //     max: 100,
        //     step: 1,
        //     change: function(event, ui) {
        //         $(this).parent().parent().find('.slider_input').val($(this).slider('value')).change();
        //     },
        //     slide: function(event, ui) {
        //         $(this).parent().parent().find('.slider_input').val($(this).slider('value'));
        //     }
        // });

        // $('.slider_percentage').each(function() {
        //     $(this).slider('option', 'value', parseInt($(this).parent().parent().find('.slider_input').val()));
        // });

        // $('.season .start_color').spectrum({
        //     color: "#FFFFFF",
        //     preferredFormat: "hex",
        //     showInput: true
        // });

        // $('.season .end_color').spectrum({
        //     color: "#FFFFFF",
        //     preferredFormat: "hex",
        //     showInput: true
        // });

        if (window.static_data.seasons.global_settings.color_enabled) {

            // $('#season_sortable').children().each(function(i) {

            //     $(this).find('.start_color').spectrum("set", window.static_data.seasons.data[i].color[0]);
            //     $(this).find('.end_color').spectrum("set", window.static_data.seasons.data[i].color[1]);

            // });

        }

        if (!window.static_data.seasons.global_settings.periodic_seasons) {
            sort_list_by_partial_date($('#season_sortable'));
        }

    }

    $('#create_season_events').prop('disabled', !window.static_data.clock.enabled);

    if (window.static_data.cycles) {
        for (var i = 0; i < window.static_data.cycles.data.length; i++) {
            add_cycle_to_sortable(cycle_sortable, i, window.static_data.cycles.data[i]);
        }
    }

    if ($('#collapsible_clock').is(':checked')) {
        $('#clock').appendTo($('#collapsible_clock').parent().children('.collapsible-content'));
    } else {
        $('#clock').prependTo($('#collapsible_date').parent().children('.collapsible-content'));
    }

    if (window.static_data.year_data.leap_days) {

        for (var i = 0; i < window.static_data.year_data.leap_days.length; i++) {

            var leap_day = clone(window.static_data.year_data.leap_days[i]);

            add_leap_day_to_list(leap_day_list, i, leap_day);

        }

        leap_day_list.children().each(function(i) {

            var leap_day = clone(window.static_data.year_data.leap_days[i]);

            if (!leap_day.intercalary && leap_day.adds_week_day) {
                repopulate_weekday_select($(this).find('.week-day-select'), leap_day.day, false);
            }
            if (leap_day.intercalary) {
                repopulate_day_select($(this).find('.timespan-day-list'), leap_day.day, false);
            }
        })
    }

    if (window.static_data.moons) {
        for (var i = 0; i < window.static_data.moons.length; i++) {
            add_moon_to_list(moon_list, i, window.static_data.moons[i]);
        }
        recreate_moon_colors();
    }

    if (window.static_data.eras) {

        for (var i = 0; i < window.static_data.eras.length; i++) {
            add_era_to_list(era_list, i, window.static_data.eras[i])
        }

        era_list.children().each(function(i) {

            repopulate_timespan_select($(this).find('.timespan-list'), window.static_data.eras[i].date.timespan, false);
            repopulate_day_select($(this).find('.timespan-day-list'), window.static_data.eras[i].date.day, false);

        })
    }

    if (window.event_categories) {
        for (var key in window.event_categories) {
            var category = window.event_categories[key];
            var catkey = (typeof category.sort_by !== "undefined") ? category.sort_by : slugify(category.name);
            add_category_to_list(event_category_list, catkey, category);
        }
    }


    $('.weather_inputs').toggleClass('hidden', !window.static_data.seasons.global_settings.enable_weather);
    $('.weather_inputs').find('select, input').prop('disabled', !window.static_data.seasons.global_settings.enable_weather);

    $('.location_middle_btn').toggleClass('hidden', (!window.static_data.seasons.global_settings.enable_weather && !window.static_data.clock.enabled) || window.static_data.seasons.data.length < 3);

    $('#season_color_enabled').prop("disabled", window.static_data.seasons.data.length == 0);

    if (window.location.pathname != '/calendars/create') {

        populate_calendar_lists();

        if ($("#collapsible_users").is(":checked")) {
            set_up_user_list();
        }

    }

    evaluate_remove_buttons();

    $('#cycle_test_input').click();

    recalc_stats();

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

export function empty_edit_values() {
    timespan_sortable.empty()
    first_day.empty()
    global_week_sortable.empty()
    leap_day_list.empty()
    moon_list.empty()
    season_sortable.empty()
    cycle_sortable.empty()
    era_list.empty()
    event_category_list.empty()
    location_list.empty()
    calendar_link_select.empty()
    calendar_link_list.empty()
    calendar_new_link_list.empty()
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
        empty_edit_values();
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

function refresh_interval_texts() {
    timespan_sortable.children().each(function(index) {

        var timespan = window.static_data.year_data.timespans[index];

        $(this).find('.timespan_variance_output').text(get_interval_text(true, timespan));

    });


    leap_day_list.children().each(function(index) {

        var leap_day = window.static_data.year_data.leap_days[index];

        $(this).find('.leap_day_variance_output').text(get_interval_text(false, leap_day));

    });
}


function get_interval_text(timespan, data) {
    var text = "";

    if (timespan) {

        text = "This timespan will appear every";

        if (data.interval > 1) {
            text += " " + ordinal_suffix_of(data.interval)
        }

        text += " year";

        if (data.interval > 1) {

            if (data.interval == 1) {
                data.offset = 0;
            }

            var original_offset = ((data.interval + data.offset) % data.interval);
            if (original_offset === 0) {
                var start_year = data.interval;
            } else {
                var start_year = original_offset;
            }
            text += ", starting year " + start_year + `. (${window.static_data.settings.year_zero_exists && original_offset == 0 ? "year 0," : "year"} ${start_year}, ${data.interval + start_year}, ${(data.interval * 2) + start_year}...)`;

        }

        text += ".";

    } else {

        var values = data.interval.split(',').reverse();
        var sorted = [];

        var numbers_regex = /([1-9]+[0-9]*)/;

        for (var i = 0; i < values.length; i++) {
            sorted.push(Number(values[i].match(numbers_regex)[0]));
        }

        text = "This leap day will appear every";

        var timespan_interval = window.static_data.year_data.timespans[data.timespan].interval;
        if (timespan_interval == 1) {
            var timespan_offset = 0;
        } else {
            var timespan_offset = window.static_data.year_data.timespans[data.timespan].offset;
        }

        var year_offset = timespan_offset % timespan_interval;

        for (var i = 0; i < values.length; i++) {

            var leap_interval = sorted[i];
            var leap_offset = data.offset;

            var original_offset = ((leap_interval + leap_offset) % leap_interval);

            if (original_offset == 0) {
                var total_offset = sorted[i];
            } else {
                var total_offset = original_offset;
            }

            total_offset = (total_offset * timespan_interval) + timespan_offset;

            if (i == 0 && sorted[i] == 1) {

                if (timespan_interval == 1) {
                    text += " year"
                } else {
                    text += ` ${ordinal_suffix_of(timespan_interval * sorted[i])} year (leaping month)`;
                }

            } else if (i == 0) {

                if (values.length > 1) {
                    text += ": <br>•";
                }

                if (window.static_data.year_data.timespans[data.timespan].interval == 1) {
                    text += ` ${ordinal_suffix_of(sorted[i])} year`;
                } else {
                    text += ` ${ordinal_suffix_of(timespan_interval * sorted[i])} ${window.static_data.year_data.timespans[data.timespan].name}`;
                }

                if (values[i].indexOf('+') == -1 || year_offset != 0) {
                    text += ` (${window.static_data.settings.year_zero_exists && original_offset == 0 ? `year ${year_offset},` : "year"} ${total_offset}, ${total_offset + sorted[i] * timespan_interval}, ${total_offset + sorted[i] * 2 * timespan_interval}...)`;
                }

            }

            if (i > 0 && sorted[i] > 1) {

                if (values[i].indexOf('!') != -1) {
                    if (timespan_interval == 1) {
                        text += `<br>• but not every ${ordinal_suffix_of(sorted[i])} year`;
                    } else {
                        text += `<br>• but not every ${ordinal_suffix_of(timespan_interval * sorted[i])} ${window.static_data.year_data.timespans[data.timespan].name}`;
                    }

                    if (values[i].indexOf('+') == -1 || year_offset != 0) {
                        text += ` (${window.static_data.settings.year_zero_exists && original_offset == 0 ? `year ${year_offset},` : "year"} ${total_offset}, ${total_offset + sorted[i] * timespan_interval}, ${total_offset + sorted[i] * 2 * timespan_interval}...)`;
                    }

                } else {

                    if (timespan_interval == 1) {
                        text += `<br>• but also every ${ordinal_suffix_of(sorted[i])} year`;
                    } else {
                        text += `<br>• but also every ${ordinal_suffix_of(timespan_interval * sorted[i])} ${window.static_data.year_data.timespans[data.timespan].name}`;
                    }

                    if (values[i].indexOf('+') == -1 || year_offset != 0) {
                        text += ` (${window.static_data.settings.year_zero_exists && original_offset == 0 ? `year ${year_offset},` : "year"} ${total_offset}, ${total_offset + sorted[i] * timespan_interval}, ${total_offset + sorted[i] * 2 * timespan_interval}...)`;
                    }

                }

            }

        }

    }

    return text;
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

function set_up_user_list() {
    if ($('#calendar_user_list').length) {

        $('#calendar_user_list').empty();

        get_calendar_users(function(userlist) {

            for (var index in userlist) {
                var user = userlist[index];
                add_user_to_list($('#calendar_user_list'), index, user)
            }

            window.user_list_opened = true;

        });
    }
}

function user_permissions_select(select) {
    var button = $(select).closest('.sortable-container').find('.update_user_permissions');

    var new_value = $(select).val();
    var curr_value = button.attr('permissions_val');

    button.prop('disabled', new_value === curr_value);
}
