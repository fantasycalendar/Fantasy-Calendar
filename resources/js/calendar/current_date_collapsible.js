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

    // Commented for now.
    //  In short: We tell the calendar to update its values,
    //  and then let those waterfall back down.
    //
    //  That's to avoid needing to care about much more than we need to (such as year zero)
    //
    // outboundProperties = {
    //     'current_date': "dynamic_data",
    // }

    set current_year(value) {
        this.$store.calendar.set_current_year(value);
    };

    get current_year() {
        return this.current_date.year;
    };

    set current_month(value) {
        this.$store.calendar.set_current_month(value);
    };

    get current_month() {
        return this.current_date.timespan;
    };

    set current_day(value) {
        this.$store.calendar.set_current_day(value);
    }

    get current_day() {
        return this.current_date.day;
    }

    get current_year_months() {
        return this.$store.calendar.get_timespans_in_year_as_select_options(this.current_year);
    }

    get current_month_days() {
        return this.$store.calendar.get_days_in_timespan_in_year_as_select_options(this.current_year, this.current_month);
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
