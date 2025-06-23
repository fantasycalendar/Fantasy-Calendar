import { precisionRound, fract, get_current_era, date_manager, convert_year } from "./calendar_functions";
import { preset_data } from "./calendar_variables";
import {
    set_up_visitor_inputs,
    update_current_day,
} from "./calendar_inputs_visitor";

import {
    creation,
    do_error_check,
    evaluate_save_button,
} from "./calendar_inputs_edit";
import { pre_rebuild_calendar } from "./calendar_manager";

export function set_up_view_inputs() {
    set_up_visitor_inputs();

    window.calendar_container = $('#calendar');

}


export function evaluate_dynamic_change() {


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


export function set_up_view_values() {
    window.dynamic_date_manager = new date_manager(window.static_data, window.dynamic_data.year, window.dynamic_data.timespan, window.dynamic_data.day);

    // evaluate_clock_inputs();

    window.dynamic_data.epoch = window.dynamic_date_manager.epoch;
}
