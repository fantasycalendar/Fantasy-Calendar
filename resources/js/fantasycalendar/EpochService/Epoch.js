export default class Epoch {

    constructor(attributes) {
        this.monthIndexOfYear = attributes['monthIndexOfYear'];
        this.year = attributes['year'];
        this.month = attributes['month'];
        this.day = attributes['day'];
        this.visualDay = attributes['visualDay'];
        this.isNumbered = attributes['isNumbered'];
        this.epoch = attributes['epoch'];
        this.dayOfYear = attributes['dayOfYear'];
        this.timespanCounts = attributes['timespanCounts'];
        this.historicalIntercalaryCount = attributes['historicalIntercalaryCount'];
        this.numberTimespans = attributes['numberTimespans'];
        this.monthId = attributes['monthId'];
        this.weekdayName = attributes['weekdayName'];
        this.weekdayIndex = attributes['weekdayIndex'];
        this.visualWeekdayIndex = attributes['visualWeekdayIndex'];
        this.visualWeekIndex = attributes['visualWeekIndex'];
        this.weeksSinceMonthStart = attributes['weeksSinceMonthStart'];
        this.weeksTilMonthEnd = attributes['weeksTilMonthEnd'];
        this.weeksSinceYearStart = attributes['weeksSinceYearStart'];
        this.weeksTilYearEnd = attributes['weeksTilYearEnd'];
        this.isIntercalary = attributes['isIntercalary'];

        this.slug = this.slugify();
        this.attributes = attributes;
    }

    toArray() {
        return this.attributes;
    }

    yearIs(year) {
        return this.year === year;
    }

    slugify() {
        return `${this.year}-${this.monthIndexOfYear}-${this.day}`;
    }

}
