import { populate_first_day_select } from "./calendar_inputs_edit";

import CollapsibleComponent from "./collapsible_component";

class WeekdaysCollapsible extends CollapsibleComponent {
    overflow_weekdays = false;
    new_weekday_name = '';
    show_custom_week_warning = false;
    deleting = -1;

    weekdays = [];
    leap_days = [];
    first_day;

    inboundProperties = {
        'weekdays': 'year_data.global_week',
        'first_day': 'year_data.first_day',
        'leap_days': 'year_data.leap_days',
        'overflow_weekdays': 'year_data.overflow',
    };
    changeHandlers = {
        'weekdays': this.weekdaysChanged
    };
    outboundProperties = {
        "overflow_weekdays": "year_data.overflow",
        "weekdays": "year_data.global_week"
    };

    loaded(static_data) {
        this.deleting = -1;
        this.show_custom_week_warning = static_data.year_data.timespans.some(timespan => timespan?.week?.length)
            || static_data.year_data.leap_days.some(leapDay => leapDay.adds_week_day);
    }

    weekdaysChanged() {
        this.new_weekday_name = '';
        this.deleting = -1;

        populate_first_day_select(this.first_day);
    }

    addNewDay() {
        this.weekdays.push(this.new_weekday_name);
    }

    removeWeekday(index) {
        this.weekdays.splice(index, 1);
        this.deleting = -1;
    }
}

export default () => new WeekdaysCollapsible();
