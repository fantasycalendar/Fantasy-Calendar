import CollapsibleComponent from "./collapsible_component";

/*
* 1. Just try and hook up the minimum possible to make the current UI work
*       (Same thing we've done elsewhere, more or less)
*       (Without jQuery)
* 2. Think about the flow of data, and responsibility over that data
*       - `calendar.date`?
*       - `$store.date`?
*
*
* ----
*  Options:
*   - decrement_current_day = () { this.current_date = this.store.calendar.subtract_day_from(year, timespan, day) }
*       - Have to build out `subtract_day_from`. Discuss what'd be required?
*       - Follows existing pattern by having the `outboundProperties` be the thing that drives the upstream state
*       - Data more consistently flows through `outboundProperties`
*
*   - decrement_current_day = () { this.$store.calendar.subtract_day(); }
*       - Minimal effort up-front, leverages existing data structures
*       - Has two general update paths for data
*
*/
class CurrentDateCollapsible extends CollapsibleComponent {
    collapsible_name = "CurrentDateCollapsible";

    current_date = {};

    inboundProperties = {
        'current_date': "dynamic_data",
    };

    outboundProperties = {
        'current_date': "dynamic_data",
    }

    decrement_current_day() {
        this.$store.calendar.subtract_day();
    };

    decrement_current_timespan() {
        this.$store.calendar.decrement_current_timespan();
    };

    decrement_current_year() {
        this.$store.calendar.decrement_current_year();
    };

    increment_current_day() {
        this.$store.calendar.increment_current_day();
    };

    increment_current_timespan() {
        this.$store.calendar.increment_current_timespan();
    };

    increment_current_year() {
        this.$store.calendar.increment_current_year();
    };
}

export default () => new CurrentDateCollapsible();
