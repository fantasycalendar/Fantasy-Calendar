import IntervalsCollection from "./Collections/IntervalsCollection.js";

export default class LeapDay {

    constructor(calendar, attributes) {
        this.yearZeroExists = calendar.yearZeroExists;
        this.name = attributes['name'];
        this.timespan_id = attributes['timespan'];
        this.intercalary = attributes['intercalary'];
        this.adds_week_day = attributes['adds_week_day'];
        this.day = attributes['day'];
        this.week_day = attributes['week_day'];
        this.not_numbered = attributes['not_numbered'];
        this.show_text = attributes['show_text'];
        this.interval = attributes['interval'];
        this.offset = attributes['offset'];

        this.intervals = IntervalsCollection.make(this);
    }

    intersectsYear(year) {
        return this.intervals.intersectsYear(year, this.yearZeroExists);
    }

    occurrences(parentOccurrences) {
        return this.intervals.occurrences(parentOccurrences, this.yearZeroExists);
    }

    get averageYearContribution() {
        return this.intervals.totalFraction();
    }

    timespanIs(id) {
        return this.timespan_id === id;
    }

}
