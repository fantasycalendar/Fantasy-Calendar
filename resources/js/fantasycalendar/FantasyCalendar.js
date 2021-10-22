import LeapDay from "./LeapDay.js";
import Moon from "./Moon.js";
import Era from "./Era.js";
import Timespan from "./Timespan.js";
import MonthsCollection from "./Collections/MonthsCollection.js";
import HasDates from "./Traits/HasDates.js";

export default class FantasyCalendar {

    constructor(static_data, dynamic_data) {

        this.static_data = static_data;
        this.dynamic_data = dynamic_data;

        this._timespans = undefined;
        this._months = undefined;
        this._monthsCached = {};
        this._leapDays = undefined;
        this._eras = undefined;

        this.applyTraits();

    }

    applyTraits(){
        Object.assign(this, HasDates);
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

    get clockEnabled() {
        return this.clock['enabled'];
    }

    dynamic(input, value = null){
        if(typeof input === "string" && value === null) return this.dynamic_data[input];

        if(typeof input !== "object"){
            input = {
                [input]: value
            }
        }

        for(let [key, value] of Object.entries(input)){
            this.dynamic_data[key] = value;
        }

        return this.dynamic_data;
    }

    get timespans() {
        if(!this._timespans) {
            this._timespans = collect(this.yearData['timespans'])
                .map((timespan, index) => {
                    return new Timespan(timespan, index).setCalendar(this);
                })
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

    yearIsValid(year) {
        return this.timespans.filter(timespan => timespan.intersectsYear(year)).length > 0;
    }

    get monthsWithoutEras() {
        return MonthsCollection.fromArray(this.yearData['timespans'], this);
    }

    get monthIndex(){
        return Object.keys(this.months.filter(month => month.id === this.monthId)).shift();
    }

    get averageMonthsCount(){
        return this.timespans.sum("averageYearContribution");
    }

    get averageMonthLength(){
        return this.averageYearLength / this.timespans.count();
    }

    get averageYearLength(){
        return this.timespans.sum(timespan => {
            return (timespan.averageYearContribution * timespan.baseLength) + timespan.leapDays.sum('averageYearContribution');
        })
    }

    get eras() {
        return collect(this.static_data['eras']).map(era => {
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
            this._leapDays = collect(this.yearData['leap_days']).map(leap_day => {
                return new LeapDay(this, leap_day);
            })
        }
        return this._leapDays;
    }

}

// ---------------------------------------------------------------------------------------------


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
