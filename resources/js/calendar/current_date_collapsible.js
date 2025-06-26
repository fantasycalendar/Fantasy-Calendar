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

    current_date = {}
    selected_date = {}
    date_adjustment_units = {
        years: null,
        months: null,
        days: null,
        hours: null,
        minutes: null
    }

    inboundProperties = {
        'current_date': "dynamic_data",
        'selected_date': "preview_date",
    }

    activeDateAdjustment = "current";

    // Commented for now.
    //  In short: We tell the calendar to update its values,
    //  and then let those waterfall back down.
    //
    //  That's to avoid needing to care about much more than we need to (such as year zero)
    //
    // outboundProperties = {
    //     'current_date': "dynamic_data",
    // }

    /** ------------------- CURRENT DATE ---------------------- **/

    adjust_current_date() {
        this.$store.calendar.adjust_current_date(this.date_adjustment_units);
    }

    set_current_minute(minute) {
        this.$store.calendar.set_current_minute(minute);
    }

    set_current_hour(hour) {
        this.$store.calendar.set_current_hour(hour);
    }

    set_current_month(month) {
        this.$store.calendar.set_current_month(month);
    }

    set_current_day(day) {
        this.$store.calendar.set_current_day(day);
    }

    set_current_year(year) {
        this.$store.calendar.set_current_year(year);
    }

    get current_minute() {
        return this.current_date.minute;
    }

    get current_hour() {
        return this.current_date.hour;
    }

    get current_day() {
        return this.current_date.day;
    }

    get current_month() {
        return this.current_date.timespan;
    }

    get current_year() {
        return this.current_date.year;
    }

    get current_year_months() {
        return this.$store.calendar.get_timespans_in_year_as_select_options(this.current_year);
    }

    get current_month_days() {
        return this.$store.calendar.get_days_in_timespan_in_year_as_select_options(this.current_year, this.current_month);
    }

    decrement_current_minute() {
        this.$store.calendar.decrement_current_minute();
    }

    decrement_current_hour() {
        this.$store.calendar.decrement_current_hour();
    }

    decrement_current_day() {
        this.$store.calendar.decrement_current_day();
    }

    decrement_current_month() {
        this.$store.calendar.decrement_current_month();
    }

    decrement_current_year() {
        this.$store.calendar.decrement_current_year();
    }

    increment_current_minute() {
        this.$store.calendar.increment_current_minute();
    }

    increment_current_hour() {
        this.$store.calendar.increment_current_hour();
    }

    increment_current_day() {
        this.$store.calendar.increment_current_day();
    }

    increment_current_month() {
        this.$store.calendar.increment_current_month();
    }

    increment_current_year() {
        this.$store.calendar.increment_current_year();
    }

    /** ------------------- VIEWED DATE ---------------------- **/

    set_selected_date_active(active) {
        this.$store.calendar.set_selected_date_active(active);
    }

    set_selected_month(month) {
        this.$store.calendar.set_selected_month(month);
    }

    set_selected_day(day) {
        this.$store.calendar.set_selected_day(day);
    }

    set_selected_year(year) {
        this.$store.calendar.set_selected_year(year);
    }

    get selected_day() {
        return this.selected_date.day;
    }

    get selected_month() {
        return this.selected_date.timespan;
    }

    get selected_year() {
        return this.selected_date.year;
    }

    get selected_year_months() {
        return this.$store.calendar.get_timespans_in_year_as_select_options(this.selected_year);
    }

    get selected_month_days() {
        return this.$store.calendar.get_days_in_timespan_in_year_as_select_options(this.selected_year, this.selected_month);
    }

    decrement_selected_day() {
        this.$store.calendar.decrement_selected_day();
    }

    decrement_selected_month() {
        this.$store.calendar.decrement_selected_month();
    }

    decrement_selected_year() {
        this.$store.calendar.decrement_selected_year();
    }

    increment_selected_day() {
        this.$store.calendar.increment_selected_day();
    }

    increment_selected_month() {
        this.$store.calendar.increment_selected_month();
    }

    increment_selected_year() {
        this.$store.calendar.increment_selected_year();
    }

    get dateAdjustmentEnabled() {
        return !Object
            .values(this.date_adjustment_units)
            .every(x => x === null || x === '');
    }
}

export default () => new CurrentDateCollapsible();
