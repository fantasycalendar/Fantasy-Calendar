// TODO: ABSOLUTELY rewrite this
import _ from "lodash";

import {
    avg_month_length,
    avg_year_length,
    convert_year,
    date_manager,
    does_day_appear,
    does_timespan_appear,
    evaluate_calendar_start, execution_time,
    fract,
    get_current_era,
    get_days_in_timespan,
    get_timespans_in_year,
    precisionRound
} from "./calendar/calendar_functions.js";

import { render_data_generator } from './render-data-generator.js';
import { calendar_data_generator } from './calendar/calendar_workers.js';
import { preset_data } from "./calendar/calendar_variables.js";

export default class Calendar {

    setup() {
        window.dynamic_date_manager = new date_manager(this.static_data, this.dynamic_data.year, this.dynamic_data.timespan, this.dynamic_data.day);
        window.preview_date_manager = new date_manager(this.static_data, this.preview_date.year, this.preview_date.timespan, this.preview_date.day);
    }

    update(incomingChanges) {
        console.log("Updating calendar...")

        // TODO: Make recalculation more atomic
        let rerenderKeys = [
            "static_data.year_data",
            "static_data.eras",
            "static_data.seasons",
            "static_data.moons",
            "static_data.settings",
            "event_categories",
        ];

        let incomingKeys = Object.keys(incomingChanges);

        let previous_location = this.dynamic_data.location;

        let structureChanged = rerenderKeys.some(key => {
            return incomingKeys.some(incomingKey => incomingKey.startsWith(key));
        });

        let selectedDateChanged = incomingKeys.some(incomingKey => incomingKey.startsWith("preview_date"));

        let prev_dynamic_data = _.cloneDeep(this.dynamic_data);
        let prev_preview_date = _.cloneDeep(this.preview_date);

        for (const [key, value] of Object.entries(incomingChanges)) {
            let original_value = _.cloneDeep(_.get(this, key));
            // Using cloneDeep to avoid JS "everything is a reference" issues
            let new_value = _.cloneDeep(value);

            // Note 1: Arrays are 'object'
            // Note 2: _.merge([{id: 1}, {id: 2}], [{id:1}])
            //      >> [{id: 1}, {id: 2}]
            //
            // Ergo: This check alows deleting items from arrays
            if (!Array.isArray(value) && typeof value === 'object') {
                new_value = _.merge(original_value, new_value);
            }

            _.set(this, key, new_value);
        }

        let current_location = this.dynamic_data.location;
        if(current_location !== previous_location && this.static_data.clock.enabled) {
            const curr_timezone = this.get_location_data(current_location)?.settings?.timezone;
            const prev_timezone = this.get_location_data(previous_location)?.settings?.timezone;
            if(curr_timezone || prev_timezone) {
                let adjusted_timezone_date = this.get_adjusted_date(this.dynamic_data, {
                    hours: (curr_timezone?.hour ?? 0) - (prev_timezone?.hour ?? 0),
                    minutes: (curr_timezone?.minute ?? 0) - (prev_timezone?.minute ?? 0),
                })
                this.dynamic_data.year = adjusted_timezone_date.year;
                this.dynamic_data.timespan = adjusted_timezone_date.month;
                this.dynamic_data.day = adjusted_timezone_date.day;
                this.dynamic_data.hour = adjusted_timezone_date.hour;
                this.dynamic_data.minute = adjusted_timezone_date.minute;
            }
        }

        let reconciled_current_date = window.dynamic_date_manager.reconcileCalendarChange(this.static_data, this.dynamic_data);
        this.dynamic_data.year = reconciled_current_date.year;
        this.dynamic_data.timespan = reconciled_current_date.timespan;
        this.dynamic_data.day = reconciled_current_date.day;
        this.dynamic_data.epoch = reconciled_current_date.epoch;
        this.dynamic_data.current_era = get_current_era(this.static_data, reconciled_current_date.epoch);

        structureChanged = structureChanged || reconciled_current_date.rebuild;

        let dateChanged = reconciled_current_date.year !== prev_dynamic_data.year || reconciled_current_date.timespan !== prev_dynamic_data.timespan || reconciled_current_date.day !== prev_dynamic_data.day;

        if (this.preview_date.follow && (!selectedDateChanged || !prev_preview_date.follow)) {
            this.preview_date.year = reconciled_current_date.year;
            this.preview_date.timespan = reconciled_current_date.timespan;
            this.preview_date.day = reconciled_current_date.day;
            this.preview_date.epoch = reconciled_current_date.epoch;
            let reconciled_selected_date = window.preview_date_manager.reconcileCalendarChange(this.static_data, this.preview_date);
            structureChanged = structureChanged || reconciled_selected_date.rebuild;
            dateChanged = dateChanged || !prev_preview_date.follow || reconciled_current_date.year !== prev_preview_date.year || reconciled_current_date.timespan !== prev_preview_date.timespan || reconciled_current_date.day !== prev_preview_date.day;
        } else if (!this.preview_date.follow) {
            let reconciled_selected_date = window.preview_date_manager.reconcileCalendarChange(this.static_data, this.preview_date);
            this.preview_date.year = reconciled_selected_date.year;
            this.preview_date.timespan = reconciled_selected_date.timespan;
            this.preview_date.day = reconciled_selected_date.day;
            this.preview_date.epoch = reconciled_selected_date.epoch;
            this.preview_date.current_era = get_current_era(this.static_data, reconciled_selected_date.epoch);
            structureChanged = structureChanged || reconciled_selected_date.rebuild;
            dateChanged = dateChanged || prev_preview_date.follow || reconciled_selected_date.year !== prev_preview_date.year || reconciled_selected_date.timespan !== prev_preview_date.timespan || reconciled_selected_date.day !== prev_preview_date.day;
        }

        // First of many rules, I'm sure.
        this.static_data.year_data.overflow = this.static_data.year_data.overflow
            && !this.static_data.year_data.leap_days.some(leapDay => leapDay.adds_week_day)
            && !this.static_data.year_data.timespans.some(month => month?.week?.length);

        document.title = this.calendar_name + " - Fantasy Calendar";

        if (structureChanged) {
            this.rebuild_calendar()
        } else if (dateChanged) {
            this.update_epochs()
        }

        window.dispatchEvent(new CustomEvent('calendar-updated'));
    }

    rebuild_calendar() {
        console.log("Rebuilding calendar...")
        execution_time.start()
        return calendar_data_generator.run({
            static_data: this.static_data,
            dynamic_data: this.active_date,
            owner: this.perms.player_at_least('co-owner'),
            events: this.events,
            event_categories: this.event_categories
        }).then(calendar_data => {
            execution_time.end("Rebuilding calendar took:")
            this.evaluated_static_data = calendar_data;
            this.render_calendar(calendar_data);
        });
    }

    render_calendar(calendar_data) {
        if (!calendar_data) calendar_data = this.evaluated_static_data;
        if(this.setting('prompt_for_redraw', false)) {
            return window.dispatchEvent(new CustomEvent('display-redraw-warning'));
        }
        window.dispatchEvent(new CustomEvent('hide-redraw-warning'));
        console.log("Rendering calendar...")
        execution_time.start()
        return render_data_generator.create_render_data(calendar_data).then((result) => {
            window.dispatchEvent(new CustomEvent('render-data-change', { detail: result }));
        }).catch((err) => {
            window.dispatchEvent(new CustomEvent("notify", {
                detail: {
                    message: err,
                    type: "error"
                }
            }));
        });
    }

    update_epochs() {
        if(this.setting('prompt_for_redraw', false)) {
            return window.dispatchEvent(new CustomEvent('display-redraw-warning'));
        }
        window.dispatchEvent(new CustomEvent('hide-redraw-warning'));
        window.dispatchEvent(new CustomEvent('update-epochs', {
            detail: {
                current_epoch: this.dynamic_data.epoch,
                preview_epoch: this.active_date.epoch
            }
        }));
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
        return does_day_appear(this.static_data, convert_year(this.static_data, year), timespan, day);
    }

    get_location_data(location) {
        let location_data =  this.static_data.seasons.locations[location];
        if(!location_data) {
            let preset_locations = Object.values(preset_data.locations[this.static_data.seasons.data.length]);
            location_data = preset_locations.find(preset_location => preset_location.name === location);
        }
        return location_data;
    }

    get_adjusted_date(date, { years = 0, months = 0, days = 0, hours = 0, minutes = 0 } = {}) {
        let extra_days = 0;
        let hour = date.hour;
        let minute = date.minute;

        if (this.static_data.clock.enabled && (hours || minutes)) {
            let extra_hours = (hours ?? 0) + ((date.minute + (minutes ?? 0)) / this.static_data.clock.minutes);
            extra_days = (extra_hours + date.hour) / this.static_data.clock.hours;

            hour = precisionRound(fract(extra_days) * this.static_data.clock.hours, 4);
            minute = Math.floor(fract(hour) * this.static_data.clock.minutes);

            extra_days = Math.floor(extra_days);
            hour = Math.floor(hour);

            days += extra_days;
        }

        let { adjusted_year, timespan, day } = new date_manager(
            this.static_data,
            date.year,
            date.timespan,
            date.day,
        )
            .adjust_years(years)
            .adjust_months(months)
            .adjust_days(days);

        return { year: adjusted_year, month: timespan, day, hour, minute };
    }

    adjust_selected_date({ years = 0, months = 0, days = 0, hours = 0, minutes = 0 } = {}) {
        this.set_selected_date({
            ...this.get_adjusted_date(this.preview_date, { years, months, days, hours, minutes }),
            follow: false
        });
    }

    set_selected_date({
        year = this.preview_date.year,
        month = this.preview_date.timespan,
        day = this.preview_date.day,
        follow = this.preview_date.follow
    } = {}) {
        const newPreviewDate = date_manager.reconcileDateChange(
            this.static_data,
            this.preview_date,
            { year, timespan: month, day }
        )

        newPreviewDate.follow = follow;

        window.dispatchEvent(new CustomEvent('calendar-updating', {
            detail: {
                calendar: {
                    preview_date: {
                        ...this.preview_date,
                        ...newPreviewDate
                    }
                }
            }
        }))
    }

    set_selected_date_active(active) {
        let date = this.preview_date;
        if (!active) {
            date = this.dynamic_data;
        }
        window.dispatchEvent(new CustomEvent('calendar-updating', {
            detail: {
                calendar: {
                    preview_date: {
                        ...date,
                        follow: !active
                    }
                }
            }
        }))
    }

    set_selected_day(day) {
        this.set_selected_date({ day });
    }

    set_selected_month(month) {
        this.set_selected_date({ month });
    }

    set_selected_year(year) {
        this.set_selected_date({ year });
    }

    decrement_selected_day(follow) {
        this.set_selected_date({ day: this.preview_date.day - 1, follow: follow ?? this.preview_date.follow });
    };

    decrement_selected_month(follow) {
        this.set_selected_date({ month: this.preview_date.timespan - 1, follow: follow ?? this.preview_date.follow });
    };

    decrement_selected_year(follow) {
        this.set_selected_date({ year: this.preview_date.year - 1, follow: follow ?? this.preview_date.follow });
    };

    increment_selected_day(follow) {
        this.set_selected_date({ day: this.preview_date.day + 1, follow: follow ?? this.preview_date.follow });
    };

    increment_selected_month(follow) {
        this.set_selected_date({ month: this.preview_date.timespan + 1, follow: follow ?? this.preview_date.follow });
    };

    increment_selected_year(follow) {
        this.set_selected_date({ year: this.preview_date.year + 1, follow: follow ?? this.preview_date.follow });
    };

    set_current_minute(minute) {
        this.set_current_date({
            minute: Math.max(0, Math.min(minute, this.static_data.clock.minutes - 1))
        });
    }

    set_current_hour(hour) {
        this.set_current_date({
            hour: Math.max(0, Math.min(hour, this.static_data.clock.hours - 1))
        });
    }

    set_current_day(day) {
        this.set_current_date({ day });
    }

    set_current_month(month) {
        this.set_current_date({ month });
    }

    set_current_year(year) {
        this.set_current_date({ year });
    }

    decrement_current_minute() {
        this.set_current_date({ minute: this.dynamic_data.minute - 30 });
    };

    decrement_current_hour() {
        this.set_current_date({ hour: this.dynamic_data.hour - 1 });
    };

    decrement_current_day() {
        this.set_current_date({ day: this.dynamic_data.day - 1 });
    };

    decrement_current_month() {
        this.set_current_date({ month: this.dynamic_data.timespan - 1 });
    };

    decrement_current_year() {
        this.set_current_date({ year: this.dynamic_data.year - 1 });
    };

    increment_current_minute() {
        this.set_current_date({ minute: this.dynamic_data.minute + 30 });
    };

    increment_current_hour() {
        this.set_current_date({ hour: this.dynamic_data.hour + 1 });
    };

    increment_current_day() {
        this.set_current_date({ day: this.dynamic_data.day + 1 });
    };

    increment_current_month() {
        this.set_current_date({ month: this.dynamic_data.timespan + 1 });
    };

    increment_current_year() {
        this.set_current_date({ year: this.dynamic_data.year + 1 });
    };

    adjust_current_date({ years = 0, months = 0, days = 0, hours = 0, minutes = 0 } = {}) {
        this.set_current_date(this.get_adjusted_date(this.dynamic_data, { years, months, days, hours, minutes }));
    }

    set_current_date({
        year = this.dynamic_data.year,
        month = this.dynamic_data.timespan,
        day = this.dynamic_data.day,
        hour = this.dynamic_data.hour,
        minute = this.dynamic_data.minute,
    } = {}) {
        if (minute >= this.static_data.clock.minutes) {
            hour += 1;
            minute = minute - this.static_data.clock.minutes;
        } else if (minute < 0) {
            hour -= 1;
            minute = this.static_data.clock.minutes + minute;
        }

        if (hour >= this.static_data.clock.hours) {
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
    set evaluated_static_data(value) {
        window.evaluated_static_data = value;
    }

    set perms(value) {
        window.Perms = value;
    }

    set calendar_name(value) {
        window.calendar_name = value;
    }

    set static_data(value) {
        window.static_data = value;
    }

    set dynamic_data(value) {
        window.dynamic_data = value;
    }

    set preview_date(value) {
        window.preview_date = value;
    }

    set event_categories(value) {
        console.log('Setting event categories');
        console.log(JSON.parse(JSON.stringify(value)));
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
    get active_date() {
        return this.preview_date.follow ? this.dynamic_data : this.preview_date;
    }

    get perms() {
        return window.Perms;
    }

    get calendar_name() {
        return window.calendar_name;
    }

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
