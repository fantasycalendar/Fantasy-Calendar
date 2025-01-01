import CollapsibleComponent from "./collapsible_component.js";

class StatisticsCollapsible extends CollapsibleComponent {

    average_year_length = 0;
    average_month_length = 0;

    inboundProperties = {
        "months": "static_data.year_data.timespans",
        "leap_days": "static_data.year_data.leap_days",
    };

    loaded() {
        this.average_year_length = this.$store.calendar.average_year_length;
        this.average_month_length = this.$store.calendar.average_month_length;
    };

}

export default () => new StatisticsCollapsible();
