// TODO: ABSOLUTELY rewrite this
import {
    avg_month_length,
    avg_year_length, does_day_appear,
    does_timespan_appear,
    evaluate_calendar_start
} from "./calendar/calendar_functions.js";

export default class Calendar {

    update(incomingChanges) {
        let structuralKeys = [
            "static_data.year_data",
        ];
        let structureChanged = false;

        for (const [key, value] of Object.entries(incomingChanges)) {
            _.set(this, key, _.cloneDeep(value));

            console.log(key);
            structureChanged = structureChanged || structuralKeys.some(structuralKey => key.startsWith(structuralKey));
        }

        // First of many rules, I'm sure.
        this.static_data.year_data.overflow = this.static_data.year_data.overflow
            && !this.static_data.year_data.leap_days.some(leapDay => leapDay.adds_week_day)
            && !this.static_data.year_data.timespans.some(month => month?.week?.length);

        return structureChanged;
    }

    evaluate_calendar_start(year, month=false, day=false, debug=false){
        return evaluate_calendar_start(this.static_data, year, month, day, debug);
    }

    does_timespan_appear(year, timespan){
        // TODO: Replace this with something a bit more holistic?
        return does_timespan_appear(this.static_data, year, timespan);
    }

    does_day_appear(year, timespan, day){
        // TODO: Replace this with something a bit more holistic?
        return does_day_appear(this.static_data, year, timespan);
    }

    set static_data(value) {
        window.static_data = value;
    }

    set dynamic_data(value) {
        window.dynamid_data = value;
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
            })
    }

    set advancement(value) {
        window.advancement = value;
    }

    set events(events) {
        window.events = events;
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

    get average_year_length() {
        return avg_year_length(this.static_data.year_data.timespans, this.static_data.year_data.leap_days);
    }

    get average_month_length() {
        return avg_month_length(this.static_data.year_data.timespans, this.static_data.year_data.leap_days);
    }
}
