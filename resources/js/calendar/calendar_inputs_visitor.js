import $ from 'jquery';
import {
    get_calendar_data,
    convert_year,
    get_days_in_timespan,
    does_timespan_appear,
    evaluate_calendar_start,
} from "./calendar_functions";

export function copy_link(epoch_data) {

    var year = epoch_data.year;
    var timespan = epoch_data.timespan_number;
    var day = epoch_data.day;

    var link = `${window.location.origin}/calendars/${window.hash}?year=${year}&month=${timespan}&day=${day}`;

    const el = document.createElement('textarea');
    el.value = link;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    if (window.hide_copy_warning) {
        $.notify(
            "Quick reminder: The copied date will not be visible to\nguests or players due to your calendar's settings.",
            "warn"
        );
    } else {
        $.notify(
            "Copied to clipboard!",
            "success"
        );
    }

}


export function set_up_visitor_inputs() {

    $('#calendar_container').scroll(function(event) {
        if ($('#top_follower').height() < $(this).scrollTop()) {
            $('#top_follower').addClass('follower_shadow');
        } else {
            $('#top_follower').removeClass('follower_shadow');
        }
    });

}


export function update_current_day(recalculate) {

    if (recalculate) {
        window.dynamic_data.epoch = evaluate_calendar_start(window.static_data, convert_year(static_data, window.dynamic_data.year), window.dynamic_data.timespan, window.dynamic_data.day).epoch;
    }

    window.dispatchEvent(new CustomEvent('update-epochs', {
        detail: {
            current_epoch: window.dynamic_data.epoch,
            preview_epoch: preview_date.follow ? window.dynamic_data.epoch : preview_date.epoch
        }
    }));

}


export function repopulate_timespan_select(select, val, change, max) {
    if (window.static_data.year_data.timespans.length == 0 || window.static_data.year_data.global_week.length == 0) return;

    var select = select === undefined ? $('.timespan-list') : select;
    var change = change === undefined ? true : change;
    var max = max === undefined ? false : max;

    select.each(function() {

        var year = convert_year(window.static_data, $(this).closest('.date_control').find('.year-input').val() | 0);

        var special = $(this).hasClass('timespan_special');

        var html = [];

        for (var i = 0; i < window.static_data.year_data.timespans.length; i++) {

            var is_there = does_timespan_appear(window.static_data, year, i);

            if (special) {

                html.push(`<option value='${i}'>${sanitizeHtml(window.static_data.year_data.timespans[i].name)}</option>`);

            } else {

                var days = get_days_in_timespan(window.static_data, year, i);

                if (days.length == 0) {
                    is_there.result = false;
                    is_there.reason = "no days";
                }

                if (max && i > max) break;

                html.push(`<option ${!is_there.result ? 'disabled' : ''} value='${i}'>`);
                html.push(sanitizeHtml(window.static_data.year_data.timespans[i].name + (!is_there.result ? ` (${is_there.reason})` : '')));
                html.push('</option>');

            }
        }

        if (val === undefined) {
            var value = $(this).val() | 0;
        } else {
            var value = val;
        }

        $(this).html(html.join('')).val(value);
        if ($(this).find('option:selected').prop('disabled') || $(this).val() == null) {
            internal_loop:
            if (value >= $(this).children().length) {
                var new_val = $(this).children().length - 1;
            } else {
                for (var i = value, j = value + 1; i >= 0 || j < $(this).children().length; i--, j++) {
                    if (!$(this).children().eq(i).prop('disabled')) {
                        var new_val = i;
                        break internal_loop;
                    }
                    if (!$(this).children().eq(j).prop('disabled')) {
                        var new_val = j;
                        break internal_loop;
                    }
                }
            }
            $(this).val(new_val);
        }
        if (change) {
            $(this).change();
        }
    });
}

export function repopulate_day_select(select, val, change, no_leaps, max, filter_timespan) {
    if (window.static_data.year_data.timespans.length == 0 || window.static_data.year_data.global_week.length == 0) return;

    var select = select === undefined ? $('.timespan-day-list') : select;
    var change = change === undefined ? true : change;
    var no_leaps = no_leaps === undefined ? false : no_leaps;
    var max = max === undefined ? false : max;

    select.each(function() {

        var year = convert_year(window.static_data, $(this).closest('.date_control').find('.year-input').val() | 0);
        var timespan = $(this).closest('.date_control').find('.timespan-list').val() | 0;
        var special = $(this).hasClass('day_special');

        if (filter_timespan === undefined || timespan == filter_timespan) {

            var exclude_self = $(this).hasClass('exclude_self');
            var no_leaps = no_leaps || $(this).hasClass('no_leap');

            if (exclude_self) {

                var self_object = get_calendar_data($(this).attr('data'));

                if (self_object) {
                    var days = get_days_in_timespan(window.static_data, year, timespan, self_object, no_leaps, special);
                }

            } else {
                var days = get_days_in_timespan(window.static_data, year, timespan, undefined, no_leaps, special);
            }

            var html = [];

            if (!$(this).hasClass('date')) {
                html.push(`<option value="${0}">Before 1</option>`);
            }

            for (var i = 0, offset = 0; i < days.length; i++) {

                var day = days[i];
                let number = i - offset + 1;

                if (!day.normal_day && day.not_numbered) offset++;

                if (max && i >= max) break;

                html.push(`<option value='${i + 1}'>`);
                html.push(day.normal_day ? `Day ${number}` : day.not_numbered ? day.text : `Day ${number} (${day.text})`);
                html.push('</option>');

            }

            if (val === undefined) {
                var value = $(this).val() | 0;
            } else {
                var value = val;
            }

            $(this).html(html.join('')).val(value);

            if ($(this).find('option:selected').prop('disabled') || $(this).val() == null) {
                internal_loop:
                for (var i = value, j = value + 1; i >= 0 || j < $(this).children().length; i--, j++) {
                    if ($(this).children().eq(i).length && !$(this).children().eq(i).prop('disabled')) {
                        var new_val = i;
                        break internal_loop;
                    }
                    if ($(this).children().eq(j).length && !$(this).children().eq(j).prop('disabled')) {
                        var new_val = j;
                        break internal_loop;
                    }
                }
                $(this).val(new_val + 1);
            }
            if (change) {
                $(this).change();
            }
        }

    });
}
