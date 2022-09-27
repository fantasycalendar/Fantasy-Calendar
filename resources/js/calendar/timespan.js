export default class Timespan {
    constructor(attributes, calendar) {
        this.attributes = attributes;

        this.name = attributes['name'] ?? '';
        // Best guess at all the attributes we'll need:
        this.interval = attributes['interval'] ?? 1;
        this.offset = attributes['offset'] ?? 0;
        this.length = attributes['length'] ?? 1;

        this.weekdays = attributes['weekdays'] ?? calendar.year_structure.global_week;
        // There are ostensibly better ways to do this. For now, we'll just truncate.
        this.short_weekdays = this.weekdays.map((weekday) => weekday.substring(0, 3));

        this.intercalary = (attributes['type'] === 'intercalary');
        this.calendar = calendar;
        this.year_zero_exists = (calendar.setting('year_zero_exists') ?? false);
        this.leap_days = calendar.leapDaysFor(this.attributes.id);

        this.average_length = this.calculateAverageLength();
    }

    /**
     * Determines whether this timespan intersects a particular year
     * @param year
     * @returns {boolean}
     */
    intersectsYear(year) {
        if(this.interval === 1) return true;

        let mod = year - (this.offset % this.interval);

        if(year < 0 && !this.year_zero_exists) {
            mod++;
        }

        return (mod % this.interval) === 0;
    }

    structureForYear(year) {
        console.log(this);

        let rowCount = Math.ceil(this.length / this.weekdays.length);
        let days = Array(this.length)
            .fill(null)
            .map((day, index) => {
                let intercalaryDay = ((index + 1) > this.length);

                return {
                    number: intercalaryDay ? null : index + 1,
                    name: this.weekdays[index % this.weekdays.length],
                    type: intercalaryDay ? "overflow" : "day",
                    events: [],
                };
            });

        let rows = [];
        for (let i = 0; i < days.length; i += this.weekdays.length) {
            rows.push(days.slice(i, i + this.weekdays.length));
        }

        return {
            name: this.name,
            show_title: true,
            weekdays: this.weekdays,
            short_weekdays: this.short_weekdays,
            show_weekdays: true,
            rows: rows,
            rowCount,
        };
    }

    /**
     * Determines how many times this timespan has occurred up to this year
     * @param year
     * @returns {*|number|number}
     */
    occurrences(year) {
        year = (this.year_zero_exists || year < 0)
            ? year
            : year - 1;

        if(this.interval <= 1) return year;

        let boundOffset = this.offset % this.interval;

        if(this.year_zero_exists) {
            return Math.ceil((year - boundOffset) / this.interval);
        } else if(year < 0) {
            let occurrences = Math.ceil((year - (boundOffset - 1)) / this.interval);

            if(boundOffset === 0) occurrences--;

            return occurrences;
        } else if (boundOffset > 0) {
            return Math.floor((year + this.interval - boundOffset) / this.interval);
        }

        return Math.floor(year / this.interval);
    }

    /**
     * Determines the average length of this timespan, taking leap days into account.
     * @returns {number}
     */
    calculateAverageLength() {
        let leapDaysContributionSum = 0;

        this.leap_days.forEach((leap_day) => {
            leapDaysContributionSum += leap_day.average_year_contribution;
        });

        return (this.length / this.interval) + leapDaysContributionSum;
    }
}
