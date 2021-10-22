export default class Timespan {

    constructor(attributes, id) {
        this.id = id;
        this.baseLength = attributes.length;
        this.intercalary = (attributes['type'] === "intercalary");
        this.attributes = attributes;
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
