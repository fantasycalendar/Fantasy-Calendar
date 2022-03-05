import IntervalsCollection from "./Collections/IntervalsCollection.js";

export default class Calendar{

    constructor(hash, static_data, dynamic_data, events, event_categories, link_data) {
        this.hash = hash;
        this.static_data = static_data;
        this.dynamic_data = dynamic_data;
        this.preview_date = clone(dynamic_data);
        this.preview_date.follow = false;
        this.events = events;
        this.event_categories = event_categories;
        this.link_data = link_data;
    }

    getEpochForDate(year, timespan = 0, day = 1){
        return evaluate_calendar_start(
            this.static_data,
            convert_year(this.static_data, year),
            timespan,
            day
        );
    }

    getTimespansInYear(year){
        return this.static_data.year_data.timespans.map((timespan, index) => {
            timespan.index = index;
            return timespan;
        }).filter(timespan => {
            return IntervalsCollection.make(timespan).intersectsYear(year);
        });
    }

    getDaysForTimespanInYear(year, timespan_index){

        const timespan = this.static_data.year_data.timespans[timespan_index];

        const timespanOccurrences = IntervalsCollection.make(timespan).occurrences(year, this.static_data.settings.year_zero_exists);

        const numDays = this.getLeapDaysForTimespan(timespan_index).reduce((acc, leap_day) => {
            return acc + IntervalsCollection.make(leap_day).intersectsYear(timespanOccurrences);
        }, timespan.length);

        return Array.from(Array(numDays).keys()).map(num => `${num+1}`);

    }

    getNonLeapingDaysInTimespan(timespan_index){

        const timespan = this.static_data.year_data.timespans[timespan_index];

        const numDays = this.getLeapDaysForTimespan(timespan_index).reduce((acc, leap_day) => {
            return acc + (leap_day.interval === "1")
        }, timespan.length);

        return Array.from(Array(numDays).keys()).map(num => `Day ${num+1}`);

    }

    getLeapDaysForTimespan(index){
        return this.static_data.year_data.leap_days
            .filter(leap_day => leap_day.timespan === index || leap_day.timespan === index.toString());
    }

    getAverageYearLength(){

        let avg_length = 0;

        for(let timespan of this.static_data.year_data.timespans){
            avg_length += timespan.length * IntervalsCollection.make(timespan).totalFraction;
        }

        for(let leap_day of this.static_data.year_data.leap_days){
            avg_length += IntervalsCollection.make(leap_day).totalFraction;
        }

        return precisionRound(avg_length, 10);

    }

}