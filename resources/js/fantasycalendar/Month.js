import Timespan from "./Timespan.js";
import MonthDay from "./MonthDay.js";
import IntervalsCollection from "./Collections/IntervalsCollection.js";

export default class Month extends Timespan {

    constructor(month, id) {
        super(month, id);
    }

    initialize(calendar) {

        super.initialize(calendar);

        this.activeLeapDays = this.leapDays
            .filter(leapDay => leapDay.intersectsYear(this.occurrences(calendar.year)));

        this.weekdays = this.buildWeekdays(calendar);

        this.daysInYear = this.buildDaysInYear();

        return this;

    }

    buildWeekdays(calendar) {
        let weekdays = collect(clone(calendar.globalWeek));
        return this.insertLeapDaysIntoWeek(weekdays);
    }

    insertLeapDaysIntoWeek(weekdays) {

        let additiveLeapDays = this.activeLeapDays
            .filter(leapDay => {
                return leapDay.adds_week_day
            })
            .sortBy('day');

        if (!additiveLeapDays.length) return weekdays;

        const leapDays = additiveLeapDays.map((leapDay, leapDayIndex) => {
            const key = (leapDay.day * (additiveLeapDays.length + 1)) + (leapDayIndex + 1);
            return [key, leapDay.week_day];
        });

        const newWeekdays = weekdays.map((weekday, weekdayIndex) => {
            const key = (weekdayIndex + 1) * (additiveLeapDays.length + 1);
            return [key, weekday];
        });

        const finalWeekdays = [...leapDays, ...newWeekdays];

        finalWeekdays.sort((a, b) => Number(a[0]) - Number(b[0]))

        return finalWeekdays.map(weekday => weekday[1]);

    }

    buildDaysInYear() {

        let baseLength = 0;
        if (this.intercalary) {
            baseLength = this.baseLength + this.activeLeapDays.length;
        } else {
            baseLength = this.baseLength + this.activeLeapDays.reject(leapDay => leapDay.intercalary).length;
        }

        let daysInYear = collect().times(baseLength, (index) => {
            return new MonthDay(index, this.intercalary);
        });

        if (this.intercalary) {
            return daysInYear;
        }

        return this.insertLeapDaysIntoDaysInYear(daysInYear);

    }

    insertLeapDaysIntoDaysInYear(daysInYear) {

        const intercalaryLeapDays = this.leapDays.filter(leapDay => leapDay.intercalary);

        if (intercalaryLeapDays.length) {
            let offset = 1 / (intercalaryLeapDays.length + 1);
            intercalaryLeapDays.forEach((leapDay) => {
                const day = new MonthDay(
                    leapDay.day + offset,
                    true,
                    !leapDay.not_numbered,
                    leapDay.show_text ? leapDay.name : false
                );
                daysInYear.push(day);
                offset += 1 / (intercalaryLeapDays.length + 1);
            });
            daysInYear.sortBy("order");
        }

        return daysInYear;
    }

}
