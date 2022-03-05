import IntervalsCollection from "./Collections/IntervalsCollection.js";

export default class Calendar{

    constructor(static_data, dynamic_data, events, event_categories) {
        this.static_data = static_data;
        this.dynamic_data = dynamic_data;
        this.preview_date = clone(dynamic_data);
        this.preview_date.follow = false;
        this.event_categories = event_categories;
        this.events = events;
    }

    getTimespansInYear(year){
        return this.static_data.year_data.timespans.map((timespan, index) => {
            timespan.index = index;
            return timespan;
        }).filter(timespan => {
            return IntervalsCollection.make(timespan).intersectsYear(year);
        });
    }

    getDaysForTimespanInYear(timespan_index, year){

        const timespan = this.static_data.year_data.timespans[timespan_index];

        const timespanOccurrences = IntervalsCollection.make(timespan).occurrences(year, this.static_data.settings.year_zero_exists);

        const numDays = this.static_data.year_data.leap_days.reduce((acc, leap_day) => {
            return acc + IntervalsCollection.make(leap_day).intersectsYear(timespanOccurrences);
        }, timespan.length);

        return Array.from(Array(numDays).keys()).map(num => `${num+1}`);

    }

    getNonLeapingDaysInTimespan(timespan_index){

        const timespan = this.static_data.year_data.timespans[timespan_index];

        const numDays = this.static_data.year_data.leap_days.reduce((acc, leap_day) => {
            return acc + (leap_day.interval === "1")
        }, timespan.length);

        return Array.from(Array(numDays).keys()).map(num => `Day ${num+1}`);

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