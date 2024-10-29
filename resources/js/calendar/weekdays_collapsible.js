import { do_error_check, populate_first_day_select } from "./calendar_inputs_edit";
import { set_up_view_values } from "./calendar_inputs_view";

export default () => ({
    overflow_weekdays: false,
    new_weekday_name: '',
    weekdays: [],
    show_custom_week_warning: false,
    deleting: -1,
    load(static_data) {
		if(!static_data){
			return;
		}
        this.refreshWeekdays(static_data);
        this.customWeekWarningCheck(static_data);
    },
    refreshWeekdays(static_data) {
        this.weekdays = static_data ? [...static_data.year_data.global_week] : [];
        this.deleting = -1;
    },
    customWeekWarningCheck(static_data) {
        this.show_custom_week_warning = static_data.year_data.timespans.some(timespan => timespan.week !== undefined)
            || static_data.year_data.leap_days.some(leapDay => leapDay.adds_week_day);
    },
    addNewDay() {
        window.static_data.year_data.global_week.push(this.new_weekday_name);
        this.refreshWeekdays(window.static_data);

        this.new_weekday_name = '';

        set_up_view_values();
        populate_first_day_select(window.static_data.year_data.first_day);
        do_error_check();
    },
    removeWeekday(index) {
        window.static_data.year_data.global_week.splice(index, 1);
        this.refreshWeekdays(window.static_data);

        this.deleting = -1;
        do_error_check();
    }
});
