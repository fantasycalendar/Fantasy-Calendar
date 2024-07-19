// import CalendarClock from '../clock.js';
import $ from 'jquery';
import { submit_hide_show_event } from "./calendar_ajax_functions";
import {
    get_calendar_data,
    debounce,
    date_manager,
    valid_preview_date,
    convert_year,
    get_days_in_timespan,
    does_timespan_appear,
    evaluate_calendar_start,
} from "./calendar_functions";
import { day_data_tooltip } from "./calendar_day_data_layout";
import { evaluate_dynamic_change, set_up_view_values } from "./calendar_inputs_view";
import { get_category } from "./calendar_inputs_edit";
import { evaluated_static_data, rebuild_calendar } from "./calendar_manager";
import CalendarClock from '../clock';

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

function context_open_day_data(key, opt) {

    var day_element = $(opt.$trigger[0]);
    var epoch = day_element.attr('epoch') | 0;
    var epoch_data = evaluated_static_data.epoch_data[epoch];
    day_data_tooltip.show(day_element, epoch_data);

}

export function set_up_visitor_inputs() {

    document.addEventListener('keydown', function(event) {
        if (event.code === 'AltLeft') {
            window.altPressed = true;
        }
    });

    document.addEventListener('keyup', function(event) {
        if (event.code === 'AltLeft') {
            window.altPressed = false;
        }
    });

    $('#calendar_container').scroll(function(event) {
        if ($('#top_follower').height() < $(this).scrollTop()) {
            $('#top_follower').addClass('follower_shadow');
        } else {
            $('#top_follower').removeClass('follower_shadow');
        }
    });


    var items = {};



    // $.contextMenu({
    //     selector: ".timespan_day:not(.empty_timespan_day)",
    //     items: items,
    //     zIndex: 1501,
    //     events: {
    //         preShow: function(event) {
    //             return !window.altPressed;
    //         }
    //     },
    //     build: function($trigger, e) {

    //         if (static_data.settings.layout == "minimalistic") {

    //             delete items.view_events['items'];

    //             let epoch = $($trigger[0]).attr('epoch') | 0;
    //             let found_events = CalendarRenderer.render_data.event_epochs[epoch].events;

    //             items.view_events.visible = function() { return found_events.length > 0 };
    //             items.view_events.disabled = found_events.length == 0;

    //             if (found_events.length > 1) {

    //                 items.view_events.name = "View events on this date";
    //                 let sub_items = {};
    //                 for (var i = 0; i < found_events.length; i++) {
    //                     let event_id = found_events[i].index;
    //                     let event_name = sanitizeHtml(found_events[i].name);
    //                     let era_event = found_events[i].era;
    //                     sub_items[event_id] = {
    //                         name: event_name,
    //                         id: event_id,
    //                         callback: function(key, opt) {
    //                             window.dispatchEvent(new CustomEvent('event-viewer-modal-view-event', { detail: { event_id: event_id, era: era_event, epoch: epoch } }));
    //                         }
    //                     }
    //                 }
    //                 items.view_events['items'] = sub_items;

    //             } else if (found_events.length == 1) {

    //                 items.view_events.name = sanitizeHtml(`View event "${events[found_events[0].index].name}"`)

    //             }

    //         } else {
    //             items.view_events.disabled = true;
    //             items.view_events.visible = function() { return false };
    //         }

    //         let show_menu = false;
    //         for (var i in items) {
    //             if (items[i].visible()) {
    //                 show_menu = true
    //             }
    //         }

    //         if (!show_menu) {
    //             return false;
    //         }

    //         return {
    //             items: items
    //         };
    //     }
    // });

    window.target_year = $('#target_year');
    window.target_timespan = $('#target_timespan');
    window.target_day = $('#target_day');

    window.follower_buttons = $('.btn_container');

    window.follower_year_buttons = $('.btn_preview_date[fc-index="year"]');
    window.follower_year_buttons_sub = $('.btn_preview_date[fc-index="year"][value="-1"]');
    window.follower_year_buttons_add = $('.btn_preview_date[fc-index="year"][value="1"]');

    window.follower_timespan_buttons = $('.btn_preview_date[fc-index="timespan"]');
    window.follower_timespan_buttons_sub = $('.btn_preview_date[fc-index="timespan"][value="-1"]');
    window.follower_timespan_buttons_add = $('.btn_preview_date[fc-index="timespan"][value="1"]');

    window.sub_target_year = $('#sub_target_year');
    window.add_target_year = $('#add_target_year');

    window.sub_target_timespan = $('#sub_target_timespan');
    window.add_target_timespan = $('#add_target_timespan');

    window.sub_target_day = $('#sub_target_day');
    window.add_target_day = $('#add_target_day');


    $('.btn_preview_date').click(function() {

        var target = $(this).attr('fc-index');
        var value = $(this).attr('value');

        if (target === 'year') {
            if (value[0] === "-") {
                sub_target_year.click();
            } else {
                add_target_year.click();
            }
        } else if (target === 'timespan') {
            if (value[0] === "-") {
                sub_target_timespan.click();
            } else {
                add_target_timespan.click();
            }
        }

        follower_year_buttons_add.prop('disabled', !window.preview_date_manager.check_max_year(window.preview_date_manager.year + 1));

        follower_timespan_buttons_add.prop('disabled', !window.preview_date_manager.check_max_timespan(window.preview_date_manager.timespan + 1));

        follower_eval();

    });

    var follower_eval = debounce(function() {

        $('#go_to_preview_date').click();

    }, 200);

    sub_target_day.click(function() {

        window.preview_date_manager.subtract_day();

        evaluate_preview_change();

    });

    sub_target_timespan.click(function() {

        window.preview_date_manager.subtract_timespan();

        evaluate_preview_change();

    });

    sub_target_year.click(function() {

        window.preview_date_manager.subtract_year();

        evaluate_preview_change();

    });

    add_target_day.click(function() {

        window.preview_date_manager.add_day();

        evaluate_preview_change();

    });

    add_target_timespan.click(function() {

        window.preview_date_manager.add_timespan();

        evaluate_preview_change();

    });

    add_target_year.click(function() {

        window.preview_date_manager.add_year();

        evaluate_preview_change();

    });


    target_year.change(function(e) {

        if (typeof window.preview_date_manager == "undefined") set_up_visitor_values();

        if (e.originalEvent) {
            window.preview_date_manager.year = convert_year(window.static_data, $(this).val() | 0);
        }

        var year = $(this).val() | 0;

        if (year != window.preview_date_manager.adjusted_year) {
            $(this).val(window.preview_date_manager.adjusted_year);
            repopulate_timespan_select(target_timespan, window.preview_date_manager.timespan, false, window.preview_date_manager.last_valid_timespan);
            repopulate_day_select(target_day, window.preview_date_manager.day, false, false, window.preview_date_manager.last_valid_day);
        }

        add_target_year.prop('disabled', !window.preview_date_manager.check_max_year(target_year.val() | 0));

        add_target_timespan.prop('disabled', !window.preview_date_manager.check_max_timespan((target_timespan.val() | 0) + 1));

        add_target_day.prop('disabled', !window.preview_date_manager.check_max_day((target_day.val() | 0) + 1));

    });

    target_timespan.change(function(e) {

        if (typeof window.preview_date_manager == "undefined") set_up_visitor_values();

        if (e.originalEvent) {
            window.preview_date_manager.timespan = $(this).val() | 0;
        } else {
            target_timespan.children().eq(window.preview_date_manager.timespan).prop('selected', true);
        }
        repopulate_day_select(target_day, window.preview_date_manager.day, false, false, window.preview_date_manager.last_valid_day);

        add_target_timespan.prop('disabled', !window.preview_date_manager.check_max_timespan((target_timespan.val() | 0) + 1));

        add_target_day.prop('disabled', !window.preview_date_manager.check_max_day((target_day.val() | 0) + 1));

    });

    target_day.change(function(e) {

        if (typeof window.preview_date_manager == "undefined") set_up_visitor_values();

        if (e.originalEvent) {
            window.preview_date_manager.day = $(this).val() | 0;
        } else {
            target_day.children().eq(window.preview_date_manager.day - 1).prop('selected', true);
        }

        add_target_day.prop('disabled', !window.preview_date_manager.check_max_day((target_day.val() | 0) + 1));

    });

    $('#go_to_preview_date').click(function() {
        if ($(this).prop('disabled')) return;
        go_to_preview_date();
    });

    $('.reset_preview_date, #reset_preview_date_button').click(function() {
        if ($(this).prop('disabled')) return;
        go_to_dynamic_date();
    });

}


export function preview_date_follow() {
    if (preview_date.follow) {
        if (typeof window.dynamic_date_manager == "undefined") set_up_view_values();
        if (typeof window.preview_date_manager == "undefined") set_up_visitor_values();

        window.preview_date_manager.year = window.dynamic_date_manager.year;
        window.preview_date_manager.timespan = window.dynamic_date_manager.timespan;
        window.preview_date_manager.day = window.dynamic_date_manager.day;

        evaluate_preview_change();
    }
}

export function evaluate_preview_change() {

    if (window.preview_date_manager.adjusted_year != target_year.val() | 0) {
        target_year.change()
    } else if (window.preview_date_manager.timespan != target_timespan.val() | 0) {
        target_timespan.change()
    } else if (window.preview_date_manager.day != target_day.val() | 0) {
        target_day.change()
    }

}

export function refresh_preview_inputs() {
    target_year.val(window.preview_date_manager.adjusted_year);
    repopulate_timespan_select(target_timespan, window.preview_date_manager.timespan, false, window.preview_date_manager.last_valid_timespan);
    repopulate_day_select(target_day, window.preview_date_manager.day, false, false, window.preview_date_manager.last_valid_day);
}


export function update_preview_calendar() {

    window.preview_date_manager = new date_manager(target_year.val() | 0, target_timespan.val() | 0, target_day.val() | 0);

    preview_date.year = window.preview_date_manager.adjusted_year;
    preview_date.timespan = window.preview_date_manager.timespan;
    preview_date.day = window.preview_date_manager.day;
    preview_date.epoch = window.preview_date_manager.epoch;

}

export function set_preview_date(year, timespan, day, epoch) {

    window.preview_date_manager.year = convert_year(window.static_data, year);
    window.preview_date_manager.timespan = timespan;
    window.preview_date_manager.day = day;

    go_to_preview_date();
}


export function go_to_preview_date(rebuild) {
    preview_date.follow = false;

    var data = window.preview_date_manager.compare(preview_date);

    preview_date.year = data.year;
    preview_date.timespan = data.timespan;
    preview_date.day = data.day;
    preview_date.epoch = data.epoch;

    display_preview_back_button();

    add_target_year.prop('disabled', !window.preview_date_manager.check_max_year(window.preview_date_manager.year));

    add_target_timespan.prop('disabled', !window.preview_date_manager.check_max_timespan(window.preview_date_manager.timespan));

    add_target_day.prop('disabled', !window.preview_date_manager.check_max_day(window.preview_date_manager.day));

    follower_year_buttons_add.prop('disabled', !window.preview_date_manager.check_max_year(window.preview_date_manager.year + 1));

    follower_timespan_buttons_add.prop('disabled', !window.preview_date_manager.check_max_timespan(window.preview_date_manager.timespan + 1));

    rebuild = rebuild !== undefined ? rebuild : data.rebuild;

    if (rebuild) {
        rebuild_calendar('preview', preview_date)
    } else {
        update_current_day();
    }

}

export function display_preview_back_button() {

    if (preview_date.epoch != window.dynamic_data.epoch) {
        $('.reset_preview_date_container.right .reset_preview_date')
            .prop("disabled", preview_date.epoch > window.dynamic_data.epoch)
            .toggleClass('hidden', preview_date.epoch > window.dynamic_data.epoch)
            .parent().toggleClass('hidden', preview_date.epoch > window.dynamic_data.epoch);
        $('.reset_preview_date_container.left .reset_preview_date')
            .prop("disabled", preview_date.epoch < window.dynamic_data.epoch)
            .toggleClass('hidden', preview_date.epoch < window.dynamic_data.epoch)
            .parent().toggleClass('hidden', preview_date.epoch < window.dynamic_data.epoch);
        $('#reset_preview_date_button')
            .prop("disabled", false)
            .toggleClass('hidden', false);
    } else {
        $('.reset_preview_date_container.right .reset_preview_date')
            .prop("disabled", true)
            .parent().toggleClass('hidden', true);
        $('.reset_preview_date_container.left .reset_preview_date')
            .prop("disabled", true)
            .parent().toggleClass('hidden', true);
        $('#reset_preview_date_button')
            .prop("disabled", true)
            .toggleClass('hidden', true);

        preview_date.follow = true;
    }

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

    evaluate_sun();

}

export function go_to_dynamic_date(rebuild) {

    preview_date.follow = true

    window.preview_date_manager.year = window.dynamic_date_manager.year;
    window.preview_date_manager.timespan = window.dynamic_date_manager.timespan;
    window.preview_date_manager.day = window.dynamic_date_manager.day;

    evaluate_preview_change();

    var data = window.dynamic_date_manager.compare(preview_date)

    preview_date.year = data.year;
    preview_date.timespan = data.timespan;
    preview_date.day = data.day;
    preview_date.epoch = data.epoch;

    display_preview_back_button();

    rebuild = rebuild !== undefined ? rebuild : data.rebuild;

    if (rebuild) {
        rebuild_calendar('preview', window.dynamic_data)
    } else {
        update_current_day(false)
    }

}

export function evaluate_settings() {
    if (window.static_data) {
        if (window.static_data.year_data.global_week.length == 0 || window.static_data.year_data.timespans.length == 0) {
            $('.date_inputs').toggleClass('hidden', true);
            $('.date_inputs').find('select, input').prop('disabled', true);
            $('#empty_calendar_explaination').toggleClass('hidden', !(window.static_data.year_data.global_week.length == 0 || window.static_data.year_data.timespans.length == 0));
            return;
        }
    }

    $('#empty_calendar_explaination').toggleClass('hidden', true);

    $('.date_control').toggleClass('hidden', (!Perms.player_at_least('co-owner') && !window.static_data.settings.allow_view));
    $('.date_control').find('select, input').not('#current_hour, #current_minute').prop('disabled', !Perms.player_at_least('co-owner') && !window.static_data.settings.allow_view);

    $("#date_inputs :input, #date_inputs :button").prop("disabled", window.has_parent);
    $(".calendar_link_explanation").toggleClass("hidden", !window.has_parent);

    follower_buttons.toggleClass('hidden', (!Perms.player_at_least('co-owner') && !window.static_data.settings.allow_view));
    follower_year_buttons.prop('disabled', (!Perms.player_at_least('co-owner') && !window.static_data.settings.allow_view)).toggleClass('hidden', (!Perms.player_at_least('co-owner') && !static_data.settings.allow_view));
    follower_timespan_buttons.prop('disabled', !window.static_data.settings.show_current_month).toggleClass('hidden', !window.static_data.settings.show_current_month);

    if (!Perms.player_at_least('co-owner') && window.static_data.settings.allow_view && (window.static_data.settings.only_backwards || window.static_data.settings.only_reveal_today)) {

        window.preview_date_manager.max_year = window.dynamic_data.year;

        if (window.static_data.settings.show_current_month) {
            window.preview_date_manager.max_timespan = window.dynamic_data.timespan;
        } else {
            window.preview_date_manager.max_timespan = window.preview_date_manager.last_timespan;
        }

        add_target_year.prop('disabled', !window.preview_date_manager.check_max_year(window.preview_date_manager.year + 1));
        follower_year_buttons_add.prop('disabled', !window.preview_date_manager.check_max_year(window.preview_date_manager.year + 1));

        add_target_timespan.prop('disabled', !window.preview_date_manager.check_max_timespan(window.preview_date_manager.timespan + 1));
        follower_timespan_buttons_add.prop('disabled', !window.preview_date_manager.check_max_timespan(window.preview_date_manager.timespan + 1));

        if (window.static_data.settings.only_reveal_today) {
            window.preview_date_manager.max_day = window.dynamic_data.day;
        } else {
            window.preview_date_manager.max_day = window.preview_date_manager.num_days;
        }

        add_target_day.prop('disabled', !window.preview_date_manager.check_max_day(window.preview_date_manager.day + 1));

    } else {
        window.preview_date_manager.max_year = false;
        window.preview_date_manager.max_timespan = false;
        window.preview_date_manager.max_day = false;
    }
}


export function eval_clock() {
    if (!Perms.user_can_see_clock()) {
        $('#clock').css('display', 'none');
        return;
    }

    var clock_face_canvas = document.getElementById("clock_face");
    var clock_sun_canvas = document.getElementById("clock_sun");
    var clock_background_canvas = document.getElementById("clock_background");

    window.Clock = new CalendarClock(
        clock_face_canvas,
        clock_sun_canvas,
        clock_background_canvas,
        $('#clock').width(),
        window.static_data.clock.hours,
        window.static_data.clock.minutes,
        window.static_data.clock.offset,
        window.static_data.clock.crowding,
        window.dynamic_data.hour,
        window.dynamic_data.minute,
        evaluated_static_data.processed_seasons,
        -1,
        window.static_data.clock.hours + 1,
    );

    $('#clock').css('display', 'block');

    eval_current_time();
}

export function eval_current_time() {
    if (!Perms.user_can_see_clock()) {
        $('#clock').css('display', 'none');
        return;
    }

    window.Clock.set_time(window.dynamic_data.hour, window.dynamic_data.minute);

    evaluate_sun();
}

export function evaluate_sun() {
    if (!Perms.user_can_see_clock()) {
        $('#clock').css('display', 'none');
        return;
    }

    if (evaluated_static_data.processed_seasons && evaluated_static_data.epoch_data[preview_date.epoch] !== undefined && evaluated_static_data.epoch_data[preview_date.epoch].season !== undefined) {

        var sunset = evaluated_static_data.epoch_data[preview_date.epoch].season.time.sunset.data;
        var sunrise = evaluated_static_data.epoch_data[preview_date.epoch].season.time.sunrise.data;

        window.Clock.sunrise = sunrise;
        window.Clock.sunset = sunset;
    }
}

export function repopulate_event_category_lists() {
    var html = [];
    html.push("<option selected value='-1'>None</option>")

    for (var categoryId in window.event_categories) {

        var category = window.event_categories[categoryId];

        if (!category.category_settings.player_usable && !Perms.player_at_least('co-owner')) continue;

        let slug = category.id;

        if (isNaN(category.id)) {
            slug = slugify(category.name);
        }

        html.push(`<option value='${slug}'>`)
        html.push(sanitizeHtml(category.name))
        html.push("</option>")
    }

    $('.event-category-list').each(function() {
        var val = $(this).val();
        $(this).html(html.join("")).val(val);
    });

    var default_event_category = window.static_data.settings.default_category !== undefined ? get_category(window.static_data.settings.default_category) : { id: -1 };

    $('#default_event_category').val(default_event_category.id);
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

export function set_up_visitor_values() {
    preview_date.follow = true;

    $('.reset_preview_date_container.right .reset_preview_date').prop("disabled", preview_date.follow).toggleClass('hidden', preview_date.follow);
    $('.reset_preview_date_container.left .reset_preview_date').prop("disabled", preview_date.follow).toggleClass('hidden', preview_date.follow);

    window.preview_date_manager = new date_manager(window.dynamic_data.year, window.dynamic_data.timespan, window.dynamic_data.day);


    target_year.val(window.preview_date_manager.adjusted_year);
    if (window.preview_date_manager.last_valid_year) {
        target_year.prop('max', window.preview_date_manager.last_valid_year)
    } else {
        target_year.removeAttr('max')
    }

    repopulate_timespan_select(target_timespan, window.preview_date_manager.timespan, false, window.preview_date_manager.last_valid_timespan);
    repopulate_day_select(target_day, window.preview_date_manager.day, false, false, window.preview_date_manager.last_valid_day);

    repopulate_event_category_lists();

    evaluate_settings();
}
