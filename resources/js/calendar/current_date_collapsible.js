import CollapsibleComponent from "./collapsible_component";
import { ordinal_suffix_of } from "./calendar_functions.js";

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

    get current_month_name(){
        return this.$store.calendar.static_data.year_data.timespans[this.current_month]?.name ?? '';
    }

    get current_date_string(){
        return `${ordinal_suffix_of(this.current_day)} of ${this.current_month_name}`;
    }

    get current_date_string_full(){
        return `${this.current_date_string}, year ${this.current_year}`;
    }

    get current_time_string(){
        if(!this.$store.calendar.static_data.clock.enabled) return "";
        let currentHour = this.current_hour ?? 0;
        let currentMinute = this.current_minute ?? 0;
        let hours = (this.$store.calendar.static_data.clock.hours ?? 24).toString().length;
        let minutes = (this.$store.calendar.static_data.clock.minutes ?? 60).toString().length;
        let hourString = currentHour.toString().padStart(hours, "0");
        let minuteString = currentMinute.toString().padStart(minutes, "0");
        return `${hourString}:${minuteString}`;
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

    adjust_selected_date() {
        this.$store.calendar.adjust_selected_date(this.date_adjustment_units);
    }

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

    get dateAdjustmentDisabled() {
        return Object
            .values(this.date_adjustment_units)
            .every(x => x === null || x === '');
    }

    get currentDateSelected() {
        return this.current_year === this.selected_year
            && this.current_month === this.selected_month
            && this.current_day === this.selected_day;
    }
}

export default () => new CurrentDateCollapsible();
