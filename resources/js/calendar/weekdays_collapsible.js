import { populate_first_day_select } from "./calendar_inputs_edit";

import CollapsibleComponent from "./collapsible_component";

class WeekdaysCollapsible extends CollapsibleComponent {
    collapsible_name = "Weekdays";

    overflow_weekdays = false;
    new_weekday_name = '';
    show_custom_week_warning = false;
    deleting = -1;

    weekdays = [];
    leap_days = [];
    first_day;

    inboundProperties = {
        'weekdays': 'static_data.year_data.global_week',
        'first_day': 'static_data.year_data.first_day',
        'leap_days': 'static_data.year_data.leap_days',
        'overflow_weekdays': 'static_data.year_data.overflow',
    };

    changeHandlers = {
        'weekdays': this.weekdaysChanged.bind(this)
    };

    outboundProperties = {
        "overflow_weekdays": "static_data.year_data.overflow",
        "weekdays": "static_data.year_data.global_week"
    };

    draggableRef = "weekdays-sortable";

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
        let weekdays = _.clone(this.weekdays);
        weekdays.push(this.new_weekday_name);
        this.weekdays = weekdays;
    }

    removeWeekday(index) {
        this.weekdays.splice(index, 1);
        this.deleting = -1;
    }

    reorderSortable(start, end) {
        let weekdays = JSON.parse(JSON.stringify(this.weekdays));

        const elem = weekdays.splice(start, 1)[0];
        weekdays.splice(end, 0, elem);

        this.weekdays = weekdays;
    }
}

export default () => new WeekdaysCollapsible();
