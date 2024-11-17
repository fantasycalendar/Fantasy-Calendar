import CollapsibleComponent from "./collapsible_component.js";
import { avg_month_length, avg_year_length } from "./calendar_functions.js";

class StatisticsCollapsible extends CollapsibleComponent {

    average_year_length = 0;
    average_month_length = 0;

    loads = {
        "months": "year_data.timespans",
        "leap_days": "year_data.leap_days",
    }

    watchers = {
        'months': this.updateStatistics,
        'leap_days': this.updateStatistics,
    };

    loaded() {
        this.updateStatistics();
    }

    updateStatistics(){
        this.average_year_length = avg_year_length(this.months, this.leap_days);
        this.average_month_length = avg_month_length(this.months, this.leap_days);
    }


}

export default () => new StatisticsCollapsible();
