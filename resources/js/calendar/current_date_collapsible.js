import CollapsibleComponent from "./collapsible_component";

class CurrentDateCollapsible extends CollapsibleComponent {
    collapsible_name = "CurrentDateCollapsible";

    current_date = {};

    inboundProperties = {
        'current_date': "dynamic_data",
    };

    outboundProperties = {
        'current_date': "dynamic_data",
    }

    sub_current_day() {
        this.$store.calendar.subtractDay();
    };

    sub_current_timespan() {
        if (window.preview_date_manager.timespan == window.dynamic_date_manager.timespan) {
            window.preview_date_manager.subtract_timespan();
        }

        window.dynamic_date_manager.subtract_timespan();

        evaluate_dynamic_change();
    };

    sub_current_year() {
        window.dynamic_date_manager.subtract_year();

        evaluate_dynamic_change();
    };

    add_current_day() {
        window.dynamic_date_manager.add_day();

        evaluate_dynamic_change();
    };

    add_current_timespan() {
        window.dynamic_date_manager.add_timespan();

        evaluate_dynamic_change();
    };

    add_current_year() {
        window.dynamic_date_manager.add_year();

        evaluate_dynamic_change();
    };
}
