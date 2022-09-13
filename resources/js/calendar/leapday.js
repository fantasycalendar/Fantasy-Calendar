import Interval from "@/calendar/interval";
import IntervalsCollection from "@/calendar/collections/IntervalsCollection";

export default class Leapday {
    constructor(attributes, calendar) {
        this.calendar = calendar;

        this.originalAttributes = attributes;
        this.year_zero_exists = calendar.setting('year_zero_exists');
        this.name = attributes["name"] ?? '';
        this.intercalary = attributes["intercalary"] ?? false;
        this.timespan_id = attributes["timespan"] ?? 0;
        this.adds_week_day = attributes["adds_week_day"] ?? false;
        this.day = attributes["day"] ?? 0;
        this.week_day = attributes["week_day"] ?? false;
        this.interval = attributes["interval"] ?? "1";
        this.offset = attributes["offset"] ?? "0";
        this.not_numbered = attributes["not_numbered"] ?? false;
        this.show_text = attributes["show_text"] ?? false;

        this.intervals = new IntervalsCollection(this.interval, this.offset);

        this.average_year_contribution = this.calculateAverageYearContribution();
    }

    timespanIs(timespan_id) {
        return this.timespan_id === timespan_id;
    }

    intersectsYear(year) {
        // We need to un-normalize the year as otherwise 0 month occurrences results in leap day appearing
        year = year >= 0 && !this.year_zero_exists
            ? year + 1
            : year;

        let votes = this.interval.split(',').map((interval) => {
            return (new Interval(interval, this.offset)).voteOnYear(year);
        });

        votes.forEach((vote) => {
            if(vote === 'allow') return true;
            if(vote === 'deny') return false;
        })

        return false;
    }

    calculateAverageYearContribution() {
        return this.intervals.sum((interval) => interval.fraction());
    }
}
