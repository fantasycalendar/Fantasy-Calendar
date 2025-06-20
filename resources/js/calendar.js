// TODO: ABSOLUTELY rewrite this
import {
    avg_month_length,
    avg_year_length, convert_year, date_manager, does_day_appear,
    does_timespan_appear,
    evaluate_calendar_start, get_current_era, get_days_in_timespan, get_timespans_in_year
} from "./calendar/calendar_functions.js";

export default class Calendar {

    update(incomingChanges) {
        // TODO: Make recalculation more atomic
        let rerenderKeys = [
            "static_data.year_data",
            "static_data.eras",
            "static_data.seasons",
            "static_data.moons",
            "event_categories",
        ];
        let structureChanged = false;
        let dateChanged = false;

        for (const [key, value] of Object.entries(incomingChanges)) {
            _.set(this, key, _.cloneDeep(value));

            console.log(key);
            structureChanged = structureChanged || rerenderKeys.some(structuralKey => key.startsWith(structuralKey));
            dateChanged = dateChanged || key.startsWith("dynamic_data");
        }

        let data = window.dynamic_date_manager.reconcileCalendarChange(this.static_data, this.dynamic_data);
        this.dynamic_data.year = data.year;
        this.dynamic_data.timespan = data.timespan;
        this.dynamic_data.day = data.day;
        this.dynamic_data.epoch = data.epoch;
        this.dynamic_data.current_era = get_current_era(this.static_data, data.epoch);

        structureChanged = structureChanged || data.rebuild;

        if(this.preview_date.follow) {
            this.preview_date.year = data.year;
            this.preview_date.timespan = data.timespan;
            this.preview_date.day = data.day;
            this.preview_date.epoch = data.epoch;
        }

        // First of many rules, I'm sure.
        this.static_data.year_data.overflow = this.static_data.year_data.overflow
            && !this.static_data.year_data.leap_days.some(leapDay => leapDay.adds_week_day)
            && !this.static_data.year_data.timespans.some(month => month?.week?.length);

        return [structureChanged, dateChanged];
    }

    // "Broker" methods
    evaluate_calendar_start(year, month = false, day = false, debug = false) {
        return evaluate_calendar_start(this.static_data, convert_year(this.static_data, year), month, day, debug);
    }

    get_timespans_in_year(year, inclusive = true) {
        // TODO: Replace this with something a bit more holistic?
        return get_timespans_in_year(this.static_data, convert_year(this.static_data, year), inclusive);
    }

    get_timespans_in_year_as_select_options(year, inclusive = true) {
        // TODO: Replace this with something a bit more holistic?
        return get_timespans_in_year(this.static_data, convert_year(this.static_data, year), inclusive)
            .map(({ result, reason }, index) => ({
                name: this.static_data.year_data.timespans[index].name + (!result ? ` (${reason})` : ""),
                disabled: !result
            }));
    }

    does_timespan_appear(year, timespan) {
        // TODO: Replace this with something a bit more holistic?
        return does_timespan_appear(this.static_data, convert_year(this.static_data, year), timespan);
    }

    get_days_in_timespan_in_year(year, timespan) {
        return get_days_in_timespan(this.static_data, convert_year(this.static_data, year), timespan);
    }

    get_days_in_timespan_in_year_as_select_options(year, timespan) {
        return this.get_days_in_timespan_in_year(year, timespan)
            .map((day, index) => `Day ${index + 1}` + (day.text ? ` - ${day.text}` : ""));
    }

    does_day_appear(year, timespan, day) {
        // TODO: Replace this with something a bit more holistic?
        return does_day_appear(this.static_data, convert_year(this.static_data, year), timespan);
    }

    set_preview_date(year, timespan, day) {
        const current_date = this.preview_date.follow
            ? this.dynamic_data
            : this.preview_date;

        const newPreviewDate = date_manager.reconcileDateChange(
            this.static_data,
            current_date,
            {  year, timespan, day }
        )

        // TODO: rip out all of the preview date input shenanigans and reimplement into proper place

        window.dispatchEvent(new CustomEvent('calendar-updating', {
            detail: {
                calendar: {
                    preview_date: {
                        follow: false,
                        ...newPreviewDate
                    }
                }
            }
        }))
    }

    set_current_minute(minute) {
        this.changeDate({
            minute: Math.max(0, Math.min(minute, this.static_data.clock.minutes-1))
        });
    }

    set_current_hour(hour) {
        this.changeDate({
            hour: Math.max(0, Math.min(hour, this.static_data.clock.hours-1))
        });
    }

    set_current_month(month) {
        this.changeDate({ month });
    }

    set_current_day(day) {
        this.changeDate({ day });
    }

    set_current_year(year){
        this.changeDate({ year });
    }

    decrement_current_minute(){
        this.changeDate({ minute: this.dynamic_data.minute - 30 });
    };

    decrement_current_hour(){
        this.changeDate({ hour: this.dynamic_data.hour - 1 });
    };

    decrement_current_day() {
        this.changeDate({ day: this.dynamic_data.day - 1 });
    };

    decrement_current_month() {
        this.changeDate({ month: this.dynamic_data.timespan - 1 });
    };

    decrement_current_year() {
        this.changeDate({ year: this.dynamic_data.year - 1 });
    };

    increment_current_minute(){
        this.changeDate({ minute: this.dynamic_data.minute + 30 });
    };

    increment_current_hour(){
        this.changeDate({ hour: this.dynamic_data.hour + 1 });
    };

    increment_current_day() {
        this.changeDate({ day: this.dynamic_data.day + 1 });
    };

    increment_current_month() {
        this.changeDate({ month: this.dynamic_data.timespan + 1 });
    };

    increment_current_year() {
        this.changeDate({ year: this.dynamic_data.year + 1 });
    };

    changeDate({
        year = this.dynamic_data.year,
        month = this.dynamic_data.timespan,
        day = this.dynamic_data.day,
        hour = this.dynamic_data.hour,
        minute = this.dynamic_data.minute,
    }={}){

        if(minute >= this.static_data.clock.minutes){
            hour += 1;
            minute = minute - this.static_data.clock.minutes;
        } else if (minute < 0) {
            hour -= 1;
            minute = this.static_data.clock.minutes + minute;
        }

        if(hour >= this.static_data.clock.hours){
            day += 1;
            hour = hour - this.static_data.clock.hours;
        } else if (hour < 0) {
            day -= 1;
            hour = this.static_data.clock.hours + hour;
        }

        const newDynamicData = date_manager.reconcileDateChange(
            this.static_data,
            this.dynamic_data,
            { year, timespan: month, day }
        )

        newDynamicData.hour = hour;
        newDynamicData.minute = minute;

        window.dispatchEvent(new CustomEvent('calendar-updating', {
            detail: {
                calendar: {
                    dynamic_data: newDynamicData
                }
            }
        }))
    }

    // Helpers
    api_url(urlstring = "") {
        return window.apiurl + urlstring.replace(":hash", this.hash);
    }

    base_url(urlstring = "") {
        return urlstring.replace(":hash", this.hash);
    }

    setting(name, givenDefault = null) {
        return this.static_data.settings[name] ?? givenDefault;
    }

    find_event_category(category_id) {
        return this.event_categories.find(category => category.id == category_id) ?? null;
    }

    // Setters
    set static_data(value) {
        window.static_data = value;
    }

    set dynamic_data(value) {
        window.dynamic_data = value;
    }

    set event_categories(value) {
        window.event_categories = value;

        window.event_categories
            .forEach(category => {
                window.events
                    .filter(event => event.event_category_id === category.id)
                    .forEach(event => {
                        event.settings = {
                            ...event.settings,
                            ...category.event_settings,
                        };
                    })
            });

        window.events.forEach(event => {
            if (!window.event_categories.some(category => category.id === event.event_category_id)) {
                event.event_category_id = -1;
            }
        });
    }

    set advancement(value) {
        window.advancement = value;
    }

    set events(events) {
        window.events = events;
    }

    // Getters
    get hash() {
        return window.hash;
    }

    get static_data() {
        return window.static_data;
    }

    get dynamic_data() {
        return window.dynamic_data;
    }

    get preview_date() {
        return window.preview_date;
    }

    get events() {
        return window.events;
    }

    get event_categories() {
        return window.event_categories;
    }

    get id() {
        return window.calendar_id;
    }

    get advancement() {
        return window.advancement;
    }

    get evaluated_static_data() {
        return window.evaluated_static_data;
    }

    get average_year_length() {
        return avg_year_length(this.static_data.year_data.timespans, this.static_data.year_data.leap_days);
    }

    get average_month_length() {
        return avg_month_length(this.static_data.year_data.timespans, this.static_data.year_data.leap_days);
    }

    get default_event_category() {
        return this.find_event_category(this.setting('default_category', -1));
    }

}
