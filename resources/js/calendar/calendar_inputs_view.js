import { date_manager } from "./calendar_functions";
import { set_up_visitor_inputs } from "./calendar_inputs_visitor";

export function set_up_view_inputs() {
    set_up_visitor_inputs();
}

export function set_up_view_values() {
    window.dynamic_date_manager = new date_manager(window.static_data, window.dynamic_data.year, window.dynamic_data.timespan, window.dynamic_data.day);
    window.dynamic_data.epoch = window.dynamic_date_manager.epoch;
}
