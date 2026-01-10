import CollapsibleComponent from "./collapsible_component.js";
import { ordinal_suffix_of } from "./calendar_functions.js";

class LeapDaysCollapsible extends CollapsibleComponent {
    collapsible_name = "LeapDaysCollapsible";

    name = "";
    type = "";
    deleting = -1;

    interval_wide_regex = /[ `~@#$%^&*()_|\-=?;:'".<>\{\}\[\]\\\/A-Za-z]/g;
    interval_internal_regex = /^\+*\!*[1-9]+[0-9]{0,}$/;
    interval_numbers_regex = /([1-9]+[0-9]{0,})/;

    leap_days = [];
    weekdays = [];
    timespans = [];

    interval_subtexts = [];
    interval_main_texts = [];

    inboundProperties = {
        "leap_days": "static_data.year_data.leap_days",
        "weekdays": "static_data.year_data.global_week",
        "timespans": "static_data.year_data.timespans"
    }

    outboundProperties = {
        "leap_days": "static_data.year_data.leap_days"
    }

    changeHandlers = {
        "leap_days": this.sanitizeLeapDayIntervals
    }

    validators = {
        "leap_days": this.validateLeapDayIntervals
    };

    draggableRef = "leap-days-sortable";
    reordering = false;

    loaded() {
        this.sanitizeLeapDayIntervals();
        this.ensureWeekdayNamesHaveValues();
    }

    reorderSortable(start, end) {
        const elem = this.leap_days.splice(start, 1)[0];
        this.leap_days.splice(end, 0, elem);
    }

    addLeapDay() {
        let new_name = this.name || `New ${this.type ? this.type + " " : ''}leap day`;

        this.leap_days.push({
            'name': new_name,
            'intercalary': this.type === 'intercalary',
            'timespan': 0,
            'adds_week_day': false,
            'day': 0,
            'week_day': new_name + " week day",
            'interval': '1',
            'offset': 0,
            'not_numbered': false,
        })

        this.name = "";
    }

    removeLeapDay(index) {
        this.leap_days.splice(index, 1);
    }

    getLeapdayValidWeekdays(leapDay) {
        return this.timespans[leapDay.timespan]?.week?.length
            ? this.timespans[leapDay.timespan].week
            : this.weekdays;
    }

    getLeapdayValidDays(leapDay) {
        return this.timespans[leapDay.timespan].length;
    }

    sanitizeLeapDayIntervals() {
        for (let [index, leapDay] of this.leap_days.entries()) {
            let { interval } = leapDay;

            let values = interval.split(',');

            let unsorted = [];

            for (let value of values) {
                unsorted.push(Number(value.match(this.interval_numbers_regex)[0]));
            }

            let sorted = unsorted.slice(0).sort((a, b) => {
                if (a < b) return -1;
                if (a > b) return 1;
                return 0;
            }).reverse();

            let result = [];

            for (let value of sorted) {
                let index = unsorted.indexOf(value);
                result.push(values[index]);
            }

            leapDay.interval = result.join(',');

            let texts = this.getLeapDayIntervalText(leapDay);

            this.interval_main_texts[index] = texts.shift();
            this.interval_subtexts[index] = texts;
        }
    }

    validateLeapDayIntervals() {
        let errors = [];

        for (let [index, leapDay] of this.leap_days.entries()) {
            let { interval } = leapDay;

            if(interval.trim() === ''){
                errors.push({ path: `leap_days.${index}.interval`, message: `${leapDay.name} has no interval formula.` });
                continue;
            }

            interval = interval.trim().replace(/,\s*$/, "");

            if (interval === "0") {
                errors.push({ path: `leap_days.${index}.interval`, message: `${leapDay.name}'s interval is 0, please enter a positive number.` });
                continue;
            }

            let invalid = this.interval_wide_regex.test(interval);

            if (invalid) {
                errors.push({ path: `leap_days.${index}.interval`, message: `${leapDay.name} has an invalid interval formula.` });
                continue;
            }

            let values = interval.split(',');

            for (let value of values) {
                if (!this.interval_internal_regex.test(value)) {
                    invalid = true;
                    break;
                }
            }

            if (invalid) {
                errors.push({ path: `leap_days.${index}.interval`, message: `${leapDay.name} has an invalid interval formula. The plus goes before the exclamation point.` });
            }
        }

        return errors;
    }

    getLeapDayIntervalText(leapDay) {
        if (!this.is_valid) {
            return ["Error detected"];
        }

        let values = leapDay.interval.split(',').reverse();
        let sorted = [];

        let numbers_regex = /([1-9]+[0-9]*)/;

        for (let i = 0; i < values.length; i++) {
            sorted.push(Number(values[i].match(numbers_regex)[0]));
        }

        let text = ["This leap day will "];

        let timespan_interval = this.timespans[leapDay.timespan].interval;
        let timespan_offset = timespan_interval === 1 ? 0 : this.timespans[leapDay.timespan].offset;

        let year_offset = timespan_offset % timespan_interval;

        for (let i = 0; i < values.length; i++) {

            text[i] ??= "";

            let leap_interval = sorted[i];
            let leap_offset = leapDay.offset;

            let original_offset = ((leap_interval + leap_offset) % leap_interval);
            let total_offset = original_offset === 0 ? sorted[i] : original_offset;

            total_offset = (total_offset * timespan_interval) + timespan_offset;

            if (i === 0 && sorted[i] === 1) {

                if(values[i].startsWith('!')){
                    text[i] += "not ";
                }

                text[i] += "appear every ";

                if (timespan_interval === 1) {
                    text[i] += "year"
                } else {
                    text[i] += `${ordinal_suffix_of(timespan_interval * sorted[i])} year`;
                }

            } else if (i === 0) {

                if(values[i].startsWith('!')){
                    text[i] += "not ";
                }

                text[i] += "appear every ";

                if (timespan_interval === 1) {
                    text[i] += `${ordinal_suffix_of(sorted[i])} year`;
                } else {
                    text[i] += `${ordinal_suffix_of(timespan_interval * sorted[i])} ${this.timespans[leapDay.timespan].name}`;
                }

                if (values[i].indexOf('+') === -1 || year_offset !== 0) {
                    text[i] += ` (${this.calendar_settings.year_zero_exists && original_offset === 0 ? `year ${year_offset},` : "year"} ${total_offset}, ${total_offset + sorted[i] * timespan_interval}, ${total_offset + sorted[i] * 2 * timespan_interval}...)`;
                }

            }

            if (i > 0 && sorted[i] > 1) {

                if (values[i].indexOf('!') !== -1) {
                    if (timespan_interval === 1) {
                        text[i] += `but not every ${ordinal_suffix_of(sorted[i])} year`;
                    } else {
                        text[i] += `but not every ${ordinal_suffix_of(timespan_interval * sorted[i])} ${this.timespans[leapDay.timespan].name}`;
                    }

                    if (values[i].indexOf('+') === -1 || year_offset !== 0) {
                        text[i] += ` (${this.calendar_settings.year_zero_exists && original_offset === 0 ? `year ${year_offset},` : "year"} ${total_offset}, ${total_offset + sorted[i] * timespan_interval}, ${total_offset + sorted[i] * 2 * timespan_interval}...)`;
                    }

                } else {

                    if (timespan_interval === 1) {
                        text[i] += `but also every ${ordinal_suffix_of(sorted[i])} year`;
                    } else {
                        text[i] += `but also every ${ordinal_suffix_of(timespan_interval * sorted[i])} ${this.timespans[leapDay.timespan].name}`;
                    }

                    if (values[i].indexOf('+') === -1 || year_offset !== 0) {
                        text[i] += ` (${this.calendar_settings.year_zero_exists && original_offset === 0 ? `year ${year_offset},` : "year"} ${total_offset}, ${total_offset + sorted[i] * timespan_interval}, ${total_offset + sorted[i] * 2 * timespan_interval}...)`;
                    }

                }

            }

        }

        return text;
    }

    ensureWeekdayNamesHaveValues() {
        for (let [index, leapDay] of this.leap_days.entries()) {
            leapDay.week_day = leapDay.week_day || leapDay.name + " week day";
        }
    }
}

export default () => new LeapDaysCollapsible();
