import * as utils from "../utils.js";
import { IntervalsCollection } from "./interval.js";

export default class FantasyCalendar {

    constructor(static_data, dynamic_data) {

        this.static_data = static_data;
        this.dynamic_data = dynamic_data;

        this._timespans = undefined;
        this._months = undefined;
        this._monthsCached = {};
        this._leapDays = undefined;
        this._eras = undefined;

    }

    setting(setting_name, fallback = false) {
        return this.static_data['settings'][setting_name] ?? fallback;
    }

    get year() {
        return this.dynamic_data['year'];
    }

    get monthId() {
        return this.dynamic_data['timespan'];
    }

    get day() {
        return clamp(this.dynamic_data['day'], 1, this.month.daysInYear.length);
    }

    get yearZeroExists() {
        return this.setting('year_zero_exists');
    }

    get yearLength() {
        return this.months.sum((month) => {
            return month.daysInYear.length;
        })
    }

    get yearData() {
        return this.static_data['year_data'];
    }

    get clock() {
        return this.static_data['clock'];
    }

    get firstDay() {
        return this.yearData['first_day']
    }

    get timespans() {
        if(!this._timespans) {
            this._timespans = this.yearData['timespans'].map((timespan, index) => {
                return new Timespan(timespan, index);
            }).map(timespan => timespan.setCalendar(this));
        }

        return this._timespans;
    }

    get months() {
        if(this._monthsCached[this.year]) return this._monthsCached[this.year];

        const yearEndingEra = this.eras.filter(era => era.endsGivenYear(this.year)).shift();

        this._monthsCached[this.year] = this.monthsWithoutEras
            .filter(month => month.intersectsYear(this.year))
            .endsOn(yearEndingEra);

        return this._monthsCached[this.year];
    }

    get monthsWithoutEras() {
        return MonthsCollection.fromArray(this.yearData['timespans'], this);
    }

    get eras() {
        return utils.Collection.from(this.static_data['eras']).map(era => {
            return new Era(era);
        }).sortBy('year');
    }

    get globalWeek() {
        return this.yearData['global_week'];
    }

    get overflowsWeek() {
        return this.yearData['overflow'] ?? false;
    }

    get month() {
        return this.months.find(month => month.id === this.monthId);
    }

    get moons() {
        return this.static_data['moons'].map(moon => new Moon(moon));
    }

    get leapDays() {
        if(!this._leapDays) {
            this._leapDays = utils.Collection.from(this.yearData['leap_days'].map(leap_day => {
                return new LeapDay(this, leap_day);
            }))
        }
        return this._leapDays;
    }

}

// ---------------------------------------------------------------------------------------------

class LeapDay {

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

class Moon {
    constructor(attributes) {
        this.name = attributes['name'];
        this.cycle = attributes['cycle'];
        this.custom_cycle = attributes['custom_cycle'];
        this.offset = attributes['offset'];
        this.color = attributes['color'];
        this.shadow_color = attributes['shadow_color'];
    }
}

class Era {

    constructor(attributes) {
        this.name = attributes['name'];
        this.description = attributes['description'];
        this.formatting = attributes['formatting'];
        this.settings = attributes['settings'];
        this.date = attributes['date'];
        this.year = this.date.year;
        this.month = this.date.timespan;
        this.day = this.date.day;
    }

    get endsYear() {
        return this.getSetting("ends_year", false) !== false;
    }

    endsGivenYear(year) {
        return this.endsYear && year === this.year;
    }

    getSetting(name, fallback = false) {
        return this.settings[name] ?? fallback;
    }

}

class Timespan {

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

class Month extends Timespan {

    constructor(month, id) {
        super(month, id);
        this.intervals = IntervalsCollection.make(month);
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

    initialize(calendar) {

        super.initialize(calendar);

        this.activeLeapDays = this.leapDays.filter(leapDay => leapDay.intersectsYear(this.occurrences(calendar.year)));

        this.weekdays = this.buildWeekdays(calendar);

        this.daysInYear = this.buildDaysInYear();

        return this;

    }

    buildWeekdays(calendar) {
        let weekdays = utils.Collection.from(clone(calendar.globalWeek));
        return this.insertLeapDaysIntoWeek(weekdays);
    }

    insertLeapDaysIntoWeek(weekdays) {

        let additiveLeapDays = this.activeLeapDays
            .filter(leapDay => {
                return leapDay.adds_week_day
            })
            .sortBy('day');

        if(!additiveLeapDays.length) return weekdays;

        const leapDays = additiveLeapDays.map((leapDay, leapDayIndex) => {
            const key = (leapDay.day * (additiveLeapDays.length+1)) + (leapDayIndex + 1);
            return [key, leapDay.week_day];
        });

        const newWeekdays = weekdays.map((weekday, weekdayIndex) => {
            const key = (weekdayIndex + 1) * (additiveLeapDays.length+1);
            return [key, weekday];
        });

        const finalWeekdays = [...leapDays, ...newWeekdays];

        finalWeekdays.sort((a,b) => Number(a[0]) - Number(b[0]))

        return finalWeekdays.map(weekday => weekday[1]);

    }

    buildDaysInYear() {

        let baseLength = 0;
        if(this.intercalary){
            baseLength = this.baseLength + this.activeLeapDays.length;
        }else{
            baseLength = this.baseLength + this.activeLeapDays.reject(leapDay => leapDay.intercalary).length;
        }

        let daysInYear = new utils.Collection().times(baseLength, (index) => {
            return new MonthDay(index, this.intercalary);
        });

        if(this.intercalary){
            return daysInYear;
        }

        return this.insertLeapDaysIntoDaysInYear(daysInYear);

    }

    insertLeapDaysIntoDaysInYear(daysInYear){

        const intercalaryLeapDays = this.leapDays.filter(leapDay => leapDay.intercalary);

        if(intercalaryLeapDays.length){
            let offset = 1 / (intercalaryLeapDays.length+1);
            intercalaryLeapDays.forEach((leapDay) => {
                const day = new MonthDay(
                    leapDay.day + offset,
                    true,
                    !leapDay.not_numbered,
                    leapDay.show_text ? leapDay.name : false
                );
                daysInYear.push(day);
                offset += 1 / (intercalaryLeapDays.length+1);
            });
            daysInYear.sortBy("order");
        }

        return daysInYear;
    }

}

class MonthDay{

    constructor(order, intercalary, isNumbered = true, name = false){
        this.order = order;
        this.intercalary = intercalary;
        this.isNumbered = isNumbered;
        this.name = name;
    }

}

class MonthsCollection extends utils.Collection{

    static fromArray(array, calendar) {
        return MonthsCollection.from(array.map((month, index) => {
            return new Month(month, index).setCalendar(calendar);
        }));
    }

    endsOn(era) {
        return (!era)
            ? this
            : MonthsCollection.from(this.slice(0, era.month+1)).trimLastMonth(era);
    }

    trimLastMonth(era) {
        this.last().daysInYear = this.last().daysInYear.slice(0, era.day);
        return this;
    }

    last() {
        return this[this.length-1];
    }

    hasId(id) {
        return this.filter((month) => {
            return month.id === id;
        }).length === 1;
    }

}


function MagicGetter(obj) {
    return new Proxy(obj, {
        get: function(target, prop) {
            if(prop in target) return Reflect.get(target, prop);

            if(target['attributes'] && prop in target['attributes']) {
                return Reflect.get(target, target['attributes'][prop]);
            }

            const magicProp = `get${capitalizeFirstLetter(prop)}Attribute`;
            if(magicProp in target) return Reflect.get(target, magicProp);

            throw new Error(`${prop} does not exist in ${obj.constructor.name}`)
        }
    })
}
