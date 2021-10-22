export default class InitialState {

    constructor(calendar) {
        this.calendar = calendar;
        this.year = calendar.year;
    }

    static generateFor(calendar){
        return new this(calendar).generateInitialProperties();
    }

    generateInitialProperties(){
        return this.collect();
    }

    collect(){
        return collect(this.toArray());
    }

    toArray(){
        return {
            'epoch': this.calculateEpoch(),
            'numberTimespans': this.calculateNumberTimespans(),
            'historicalIntercalaryCount': this.calculateHistoricalIntercalaryCount(),
            'weekdayIndex': this.calculateWeekdayIndex(),
            'timespanCounts': this.calculateTimespanCounts(),
            'eraYear': this.calculateEraYear()
        }
    }

    calculateEpoch(){
        return this.calculateTotalDaysFromTimespans()
            + this.calculateTotalLeapDayOccurrences();
    }

    calculateTotalDaysFromTimespans(){
        let _this = this;
        return this.calendar.timespans.sum((timespan) => {
            return timespan.occurrences(_this.year) * timespan.baseLength;
        })
    }

    calculateTotalLeapDayOccurrences(){
        let _this = this;
        return this.calendar.timespans.sum((timespan) => {
            const timespanOccurrences = timespan.occurrences(_this.year);
            return timespan.leapDays.sum((leapDay) => {
                return leapDay.occurrences(timespanOccurrences);
            })
        })
    }

    calculateHistoricalIntercalaryCount(){
        let _this = this;
        return this.calendar.timespans.sum(function(timespan){
            const timespanOccurrences = timespan.occurrences(_this.year);
            const timespanIntercalaryDays = timespan.intercalary ? timespanOccurrences * timespan.length : 0;
            const leapDayIntercalaryDays = timespan.leapDays.sum(function(leapDay){
                return leapDay.intercalary || timespan.intercalary ? leapDay.occurrences(timespanOccurrences) : 0;
            });
            return timespanIntercalaryDays + leapDayIntercalaryDays;
        });
    }

    calculateTimespanCounts(){
        return this.calendar.timespans.map(timespan => timespan.occurrences(this.year));
    }

    calculateNumberTimespans(){
        return this.calculateTimespanCounts().sum();
    }

    calculateWeekdayIndex(){
        return this.determineWeekdayIndex(this.calculateEpoch(), this.calculateHistoricalIntercalaryCount());
    }

    determineWeekdayIndex(epoch, historicalIntercalaryCount){
        if(!this.calendar.overflowsWeek) return 0;

        const weekdaysCount = this.calendar.globalWeek.count();
        const totalWeeksBeforeToday = (epoch - historicalIntercalaryCount - this.calendar.firstDay - 1);

        const weekday = totalWeeksBeforeToday % weekdaysCount;

        return (weekday < 0)
            ? weekday + weekdaysCount
            : weekday;
    }

    calculateEraYear(){
        const eras = this.calendar.eras
            .filter(era => era.restartsYearCount)
            .filter(era => era.beforeYearInclusive(this.year))
            .sortByDesc('year');

        if(!eras.count()) return this.calendar.year;

        const eraYear = this.calendar.year - eras.last().calculateEraYear(eras);

        return eraYear + this.calendar.yearZeroExists;
    }




}
