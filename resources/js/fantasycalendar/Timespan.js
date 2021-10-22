import IntervalsCollection from "./Collections/IntervalsCollection.js";

export default class Timespan {

    constructor(attributes, id) {
        this.id = id;
        this.baseLength = attributes.length;
        this.intercalary = (attributes['type'] === "intercalary");
        this.attributes = attributes;

        this.intervals = IntervalsCollection.make(attributes);
    }

    intersectsYear(year) {
        return this.intervals.intersectsYear(year, this.yearZeroExists);
    }

    occurrences(year) {
        return this.intervals.occurrences(year, this.yearZeroExists);
    }

    get averageYearContribution() {
        return this.intervals.totalFraction();
    }

    setCalendar(calendar) {
        return this.initialize(calendar);
    }

    initialize(calendar) {
        this.yearZeroExists = calendar.yearZeroExists;
        this.leapDays = calendar.leapDays.filter(leapDay => leapDay.timespanIs(this.id));
        return this;
    }

}
