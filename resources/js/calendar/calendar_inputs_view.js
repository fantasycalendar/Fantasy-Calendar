import { precisionRound, fract, get_current_era, date_manager, convert_year } from "./calendar_functions";
import { preset_data } from "./calendar_variables";
import {
    set_up_visitor_inputs,
    preview_date_follow,
    evaluate_preview_change,
    go_to_preview_date,
    update_current_day,
    eval_current_time,
    repopulate_timespan_select,
    repopulate_day_select,
    eval_clock,
} from "./calendar_inputs_visitor";

import {
    creation,
    do_error_check,
    evaluate_season_daylength_warning,
    evaluate_save_button,
} from "./calendar_inputs_edit";
import { pre_rebuild_calendar } from "./calendar_manager";

export function set_up_view_inputs() {
    set_up_visitor_inputs();

    window.calendar_container = $('#calendar');

    window.current_year = $('#current_year');
    window.current_timespan = $('#current_timespan');
    window.current_day = $('#current_day');

    window.current_hour = $('#current_hour');
    window.current_minute = $('#current_minute');

    window.location_select = $('#location_select');

    window.sub_current_year = $('#sub_current_year');
    window.add_current_year = $('#add_current_year');

    window.sub_current_timespan = $('#sub_current_timespan');
    window.add_current_timespan = $('#add_current_timespan');

    window.sub_current_day = $('#sub_current_day');
    window.add_current_day = $('#add_current_day');

    window.sub_current_day.click(function() {

        window.dynamic_date_manager.subtract_day();

        evaluate_dynamic_change();

    });

    window.sub_current_timespan.click(function() {

        if (window.preview_date_manager.timespan == window.dynamic_date_manager.timespan) {
            window.preview_date_manager.subtract_timespan();
        }

        window.dynamic_date_manager.subtract_timespan();

        evaluate_dynamic_change();

    });

    window.sub_current_year.click(function() {

        window.dynamic_date_manager.subtract_year();

        evaluate_dynamic_change();

    });

    window.add_current_day.click(function() {

        window.dynamic_date_manager.add_day();

        evaluate_dynamic_change();

    });

    window.add_current_timespan.click(function() {

        window.dynamic_date_manager.add_timespan();

        evaluate_dynamic_change();

    });

    window.add_current_year.click(function() {

        window.dynamic_date_manager.add_year();

        evaluate_dynamic_change();

    });


    window.current_year.change(function(e) {

        if (e.originalEvent) {
            window.dynamic_date_manager.year = convert_year(window.static_data, $(this).val() | 0);
            evaluate_dynamic_change();
        }

        var year = $(this).val() | 0;

        if (year != window.dynamic_date_manager.adjusted_year) {
            $(this).val(window.dynamic_date_manager.adjusted_year);
            repopulate_timespan_select(window.current_timespan, window.dynamic_date_manager.timespan, false);
            repopulate_day_select(window.current_day, window.dynamic_date_manager.day, false);
        }

    });

    window.current_timespan.change(function(e) {

        if (e.originalEvent) {
            window.dynamic_date_manager.timespan = $(this).val() | 0;
            evaluate_dynamic_change();
        } else {
            window.current_timespan.children().eq(window.dynamic_date_manager.timespan).prop('selected', true);
        }
        repopulate_day_select(window.current_day, window.dynamic_date_manager.day, false);

    });

    window.current_day.change(function(e) {

        if (e.originalEvent) {
            window.dynamic_date_manager.day = $(this).val() | 0;
            evaluate_dynamic_change();
        } else {
            window.current_day.children().eq(window.dynamic_date_manager.day - 1).prop('selected', true);
        }

    });



    $('.adjust_hour').click(function() {

        var adjust = $(this).attr('val') | 0;
        var curr_hour = window.current_hour.val() | 0;
        curr_hour = curr_hour + adjust;

        if (curr_hour < 0) {
            window.sub_current_day.click();
            curr_hour = window.static_data.clock.hours - 1;
        } else if (curr_hour >= window.static_data.clock.hours) {
            window.add_current_day.click();
            curr_hour = 0;
        }

        window.current_hour.val(curr_hour).change();

    });

    window.current_hour.change(function() {

        var curr_hour = window.current_hour.val() | 0;

        if (curr_hour < 0) {
            window.sub_current_day.click();
            curr_hour = window.static_data.clock.hours - 1;
        } else if (curr_hour >= window.static_data.clock.hours) {
            window.add_current_day.click();
            curr_hour = 0;
        }

        window.dynamic_data.hour = curr_hour;
        window.current_hour.val(curr_hour);

        var apply_changes_immediately = $('#apply_changes_immediately');

        if (apply_changes_immediately.length == 0) {
            apply_changes_immediately = true;
        } else {
            apply_changes_immediately = apply_changes_immediately.is(':checked');
        }

        if (!apply_changes_immediately) {
            evaluate_apply_show_hide();
            return;
        }

        eval_current_time();
        evaluate_save_button();

    });


    $('.adjust_minute').click(function() {

        var adjust = $(this).attr('val') | 0;
        var curr_minute = window.current_minute.val() | 0;
        curr_minute = curr_minute + adjust;

        if (curr_minute < 0) {
            $('.adjust_hour[val=-1]').click();
            curr_minute = Math.abs(window.static_data.clock.minutes + curr_minute);
        } else if (curr_minute >= window.static_data.clock.minutes) {
            $('.adjust_hour[val=1]').click();
            curr_minute = Math.abs(window.static_data.clock.minutes - curr_minute);
        }

        window.current_minute.val(curr_minute).change();

    });

    window.current_minute.change(function() {

        var curr_minute = window.current_minute.val() | 0;

        if (curr_minute < 0) {
            $('.adjust_hour[val=-1]').click();
            curr_minute = Math.abs(window.static_data.clock.minutes + curr_minute);
        } else if (curr_minute >= window.static_data.clock.minutes) {
            $('.adjust_hour[val=1]').click();
            curr_minute = Math.abs(window.static_data.clock.minutes - curr_minute);
        }

        window.dynamic_data.minute = curr_minute;
        window.current_minute.val(curr_minute);

        var apply_changes_immediately = $('#apply_changes_immediately');

        if (apply_changes_immediately.length == 0) {
            apply_changes_immediately = true;
        } else {
            apply_changes_immediately = apply_changes_immediately.is(':checked');
        }

        if (!apply_changes_immediately) {
            evaluate_apply_show_hide();
            return;
        }

        eval_current_time();
        evaluate_save_button();
    });

    window.location_select.change(function() {

        var prev_location_type = window.dynamic_data.custom_location;

        if (prev_location_type) {
            var prev_location = window.static_data.seasons.locations[window.dynamic_data.location];
        } else {
            var prev_location = preset_data.locations[window.dynamic_data.location];
        }

        window.dynamic_data.custom_location = window.location_select.find('option:selected').parent().attr('value') === "custom" && !window.location_select.find('option:selected').prop('disabled');

        window.dynamic_data.location = window.location_select.val();

        if (window.dynamic_data.custom_location) {
            var location = window.static_data.seasons.locations[window.dynamic_data.location];
        } else {
            var location = preset_data.locations[window.dynamic_data.location];
        }

        if (prev_location_type) {
            window.dynamic_data.hour -= prev_location.settings.timezone.hour;
            window.dynamic_data.minute -= prev_location.settings.timezone.minute;
        }

        if (window.dynamic_data.custom_location) {
            window.dynamic_data.hour += location.settings.timezone.hour;
            window.dynamic_data.minute += location.settings.timezone.minute;
        }

        if (window.dynamic_data.minute < 0) {
            window.dynamic_data.minute = Math.abs(window.static_data.clock.minutes + window.dynamic_data.minute);
            window.dynamic_data.hour--;
        } else if (window.dynamic_data.minute >= window.static_data.clock.minutes) {
            window.dynamic_data.minute = Math.abs(window.static_data.clock.minutes - window.dynamic_data.minute);
            window.dynamic_data.hour++;
        }

        var day_adjust = 0;
        if (window.dynamic_data.hour < 0) {
            window.dynamic_data.hour = Math.abs(window.static_data.clock.hours + window.dynamic_data.hour);
            day_adjust = -1;
        } else if (window.dynamic_data.hour >= window.static_data.clock.hours) {
            window.dynamic_data.hour = Math.abs(window.static_data.clock.hours - window.dynamic_data.hour);
            day_adjust = 1;
        }

        window.current_hour.val(window.dynamic_data.hour);
        window.current_minute.val(window.dynamic_data.minute);

        if (day_adjust != 0) {
            if (day_adjust > 0) {
                window.dynamic_date_manager.add_day();
            } else {
                window.dynamic_date_manager.subtract_day();
            }
            evaluate_dynamic_change();
        }

        do_error_check('seasons');

        evaluate_season_daylength_warning();

    });



    $('#current_date_btn').click(function() {
        if (!Perms.player_at_least('co-owner') && !window.static_data.settings.allow_view) {
            return;
        }
        increment_date_units(true);
    });

    $('#preview_date_btn').click(function() {
        if (!Perms.player_at_least('co-owner') && !window.static_data.settings.allow_view) {
            return;
        }
        increment_date_units(false);
    });


    $('#unit_years').val("");
    $('#unit_months').val("");
    $('#unit_days').val("");
    $('#unit_hours').val("");
    $('#unit_minutes').val("");

}


function increment_date_units(current) {
    var unit_years = $('#unit_years').val() | 0;
    var unit_months = $('#unit_months').val() | 0;
    var unit_days = $('#unit_days').val() | 0;
    var unit_hours = $('#unit_hours').val() | 0;
    var unit_minutes = $('#unit_minutes').val() | 0;

    if (current) {
        var manager = window.dynamic_date_manager;
    } else {
        var manager = window.preview_date_manager;
    }

    for (var years = 1; years <= Math.abs(unit_years); years++) {
        if (unit_years < 0) {
            manager.subtract_year();
        } else if (unit_years > 0) {
            manager.add_year();
        }
    }

    for (var months = 1; months <= Math.abs(unit_months); months++) {
        if (unit_months < 0) {
            manager.subtract_timespan();
        } else if (unit_months > 0) {
            manager.add_timespan();
        }
    }

    let extra_days = 0;

    if (window.static_data.clock.enabled) {

        let extra_hours = (unit_minutes + window.dynamic_data.minute) / window.static_data.clock.minutes;
        extra_days = (unit_hours + extra_hours + window.dynamic_data.hour) / window.static_data.clock.hours;

        var new_hour = precisionRound(fract(extra_days) * window.static_data.clock.hours, 4);
        var new_minute = Math.floor(fract(new_hour) * window.static_data.clock.minutes);

        extra_days = Math.floor(extra_days);
        new_hour = Math.floor(new_hour);

    }

    unit_days += extra_days;

    for (var days = 1; days <= Math.abs(unit_days); days++) {
        if (unit_days < 0) {
            manager.subtract_day();
        } else if (unit_days > 0) {
            manager.add_day();
        }
    }

    if (current) {

        if (window.static_data.clock.enabled) {
            if (window.dynamic_data.hour != new_hour || window.dynamic_data.minute != new_minute) {
                window.dynamic_data.hour = new_hour
                window.dynamic_data.minute = new_minute;
                window.current_hour.val(new_hour);
                window.current_minute.val(new_minute);
                eval_clock();
            }
        }

        evaluate_dynamic_change();
    } else {
        evaluate_preview_change();
        go_to_preview_date();
    }
}

export function evaluate_dynamic_change() {
    if (window.dynamic_date_manager.adjusted_year != window.current_year.val() | 0) {
        window.current_year.change()
    } else if (window.dynamic_date_manager.timespan != window.current_timespan.val() | 0) {
        window.current_timespan.change()
    } else if (window.dynamic_date_manager.day != window.current_day.val() | 0) {
        window.current_day.change()
    }

    let data = window.dynamic_date_manager.compare(window.dynamic_data);

    window.dynamic_data.year = data.year;
    window.dynamic_data.timespan = data.timespan;
    window.dynamic_data.day = data.day;
    window.dynamic_data.epoch = data.epoch;
    window.dynamic_data.current_era = get_current_era(window.static_data, dynamic_data.epoch);

    var apply_changes_immediately = $('#apply_changes_immediately');

    if (apply_changes_immediately.length == 0) {
        apply_changes_immediately = true;
    } else {
        apply_changes_immediately = apply_changes_immediately.is(':checked');
    }

    window.changes_applied = false;

    if (window.preview_date.follow) {

        window.preview_date.year = data.year;
        window.preview_date.timespan = data.timespan;
        window.preview_date.day = data.day;
        window.preview_date.epoch = data.epoch;

        if (data.rebuild || (!Perms.owner && window.static_data.settings.only_reveal_today) || !apply_changes_immediately) {
            pre_rebuild_calendar('calendar', window.dynamic_data)
        } else {
            update_current_day(false);
        }

        preview_date_follow();

    } else {

        if (!apply_changes_immediately) {
            pre_rebuild_calendar('calendar', window.preview_date)
        } else {
            update_current_day(false);
        }

    }

    evaluate_save_button();
}

export function repopulate_location_select_list() {
    if (!creation.is_done()) {
        return;
    }

    var html = [];

    if (window.static_data.seasons.locations.length > 0) {

        html.push('<optgroup label="Custom" value="custom">');
        for (var i = 0; i < window.static_data.seasons.locations.length; i++) {
            let name = sanitizeHtml(window.static_data.seasons.locations[i].name);
            html.push(`<option value='${i}'>${name}</option>`);
        }
        html.push('</optgroup>');

    }

    let validSeasons = (window.static_data.seasons.data.length === 2 || static_data.seasons.data.length === 4) && static_data.seasons.global_settings.enable_weather;
    let length = validSeasons ? window.static_data.seasons.data.length : 4;

    html.push(`<optgroup label="Location Presets" value="preset">`);
    for (var i = 0; i < Object.keys(preset_data.locations[length]).length; i++) {
        html.push(`<option ${!validSeasons ? "disabled" : ""}>${Object.keys(preset_data.locations[length])[i]}</option>`);
    }
    html.push('</optgroup>');


    if (html.length > 0) {

        window.location_select.prop('disabled', false).html(html.join('')).val(window.dynamic_data.location);

    } else {

        window.location_select.prop('disabled', true).html(html.join(''));

    }

    if (window.location_select.val() === null) {
        window.location_select.children().find('option').first().prop('selected', true);
        window.dynamic_data.location = window.location_select.val();
        window.dynamic_data.custom_location = window.location_select.find('option:selected').parent().attr('value') === 'custom';
    }
}

export function set_up_view_values() {
    window.dynamic_date_manager = new date_manager(window.dynamic_data.year, window.dynamic_data.timespan, window.dynamic_data.day);

    window.current_year.val(window.dynamic_date_manager.adjusted_year);

    repopulate_timespan_select(window.current_timespan, window.dynamic_data.timespan, false);

    repopulate_day_select(window.current_day, window.dynamic_data.day, false);

    if (window.static_data.clock && window.dynamic_data.hour !== undefined && window.dynamic_data.minute !== undefined) {

        window.current_hour.val(window.dynamic_data.hour).prop('min', -1).prop('max', window.static_data.clock.hours);
        window.current_minute.val(window.dynamic_data.minute).prop('min', -1).prop('max', window.static_data.clock.minutes);

    }

    repopulate_location_select_list();

    // evaluate_clock_inputs();

    window.dynamic_data.epoch = window.dynamic_date_manager.epoch;
}
