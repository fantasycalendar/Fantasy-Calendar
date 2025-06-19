// TODO: ABSOLUTELY rewrite this
import {
    avg_month_length,
    avg_year_length, convert_year, does_day_appear,
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
            "dynamic_data.year",
        ];
        let structureChanged = false;

        for (const [key, value] of Object.entries(incomingChanges)) {
            _.set(this, key, _.cloneDeep(value));

            console.log(key);
            structureChanged = structureChanged || rerenderKeys.some(structuralKey => key.startsWith(structuralKey));
        }

        if(this.preview_date.follow) {
            this.set_preview_date(this.dynamic_data.year, this.dynamic_data.timespan, this.dynamic_data.day);
        }

        // First of many rules, I'm sure.
        this.static_data.year_data.overflow = this.static_data.year_data.overflow
            && !this.static_data.year_data.leap_days.some(leapDay => leapDay.adds_week_day)
            && !this.static_data.year_data.timespans.some(month => month?.week?.length);

        return structureChanged;
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
        window.set_preview_date(year, timespan, day);
    }

    decrement_current_month() {
        window.dynamic_date_manager.subtract_timespan();

        this.handleDateChanged();
    };

    decrement_current_year() {
        window.dynamic_date_manager.subtract_year();

        this.handleDateChanged();
    };

    decrement_current_day() {
        window.dynamic_date_manager.subtract_day();

        this.handleDateChanged();
    }

    increment_current_day() {
        window.dynamic_date_manager.add_day();

        this.handleDateChanged();
    };

    increment_current_month() {
        window.dynamic_date_manager.add_timespan();

        this.handleDateChanged();
    };

    increment_current_year() {
        window.dynamic_date_manager.add_year();

        this.handleDateChanged();
    };

    handleDateChanged(){

        let data = window.dynamic_date_manager.compare(this.dynamic_data);

        window.dispatchEvent(new CustomEvent('calendar-updating', {
            detail: {
                calendar: {
                    "dynamic_data.year": data.year,
                    "dynamic_data.timespan": data.timespan,
                    "dynamic_data.day": data.day,
                    "dynamic_data.epoch": data.epoch,
                    "dynamic_data.current_era": get_current_era(this.static_data, data.epoch),
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
