import CalculatesAndCachesProperties from "../Traits/CalculatesAndCachesProperties.js";

export default class State {

    constructor(calendar){

        this.calendar = calendar;
        this.year = calendar.year;
        this.stateCache = collect();
        this.previousState = collect();

        return CalculatesAndCachesProperties(this);
    }

    flushCache(){
        this.previousState = this.stateCache;
        this.stateCache = collect();
    }

    getState(){
        return this.stateCache;
    }

    disableEras(){
        this.withEras = false;
        this.previousState.put('months', this.calendar.monthsWithoutEras);
        return this;
    }

    initialize(){
        this.stateCache = this.buildInitialState();
    }

    buildInitialState(){
        const initialStateClass = this.withEras
            ? InitialStateWithEras
            : InitialState;

        return initialStateClass.generateFor(this.calendar.clone());
    }

    stepForward() {
        this.flushCache();
        this.incrementDay();
        this.incrementMonth();
        this.incrementHistoricalIntercalaryCount();
    }

    toArray() {
        return {
            'year': this.year,
            'eraYear': this.eraYear,
            'monthIndexOfYear': this.monthIndexOfYear,
            'day': this.day,
            'visualDay': this.visualDay,
            'isNumbered': this.isNumbered(),
            'epoch': this.epoch,
            'monthId': this.monthId,
            'dayOfYear': this.dayOfYear,
            'month': this.currentMonth(),
            'timespanCounts': this.timespanCounts,
            'historicalIntercalaryCount': this.historicalIntercalaryCount,
            'numberTimespans': this.numberTimespans,
            'weekdayName': this.weekdays().get(this.weekdayIndex),
            'weekdayIndex': this.weekdayIndex,
            'visualWeekdayIndex': (this.isIntercalary()) ? this.visualWeekdayIndex : this.weekdayIndex,
            'visualWeekIndex': this.visualWeekIndex,
            'weeksSinceMonthStart': this.weeksSinceMonthStart,
            'weeksTilMonthEnd': this.totalWeeksInMonth - (this.weeksSinceMonthStart - 1),
            'weeksSinceYearStart': this.weeksSinceYearStart,
            'weeksTilYearEnd': this.totalWeeksInYear - (this.weeksSinceYearStart - 1),
            'isIntercalary': this.isIntercalary(),
        }
    }

    incrementDay() {
        if(this.isNumbered()){
            this.visualDay++;
        }

        this.day++;
        this.epoch++;
        this.dayOfYear++;
    }

    incrementWeekday(){
        if(this.isIntercalary()){
            this.visualWeekdayIndex++;
            if(this.day >= 1 && ! this.previousState.get('isIntercalary')
                || this.visualWeekdayIndex > this.weekdayCount()-1
                || this.day === 1){
                this.visualWeekdayIndex = 0;
                this.visualWeekIndex++;
            }
            return;
        }

        if(this.previousState.get('isIntercalary') && this.isIntercalary()){
            this.visualWeekdayIndex++;
        }

        this.weekdayIndex++;
        this.incrementWeek();
        this.visualWeekdayIndex = this.weekdayIndex;

    }

    incrementWeek(force = false){
        if(this.weekdayIndex >= this.weekDayCount() || force){
            this.weekDayIndex = 0;
            this.visualWeekdayIndex++;
            this.weeksSinceMonthStart++;
            this.weeksSinceYearStart++;
        }
    }

    incrementMonth(){
        if(this.day < this.currentMonth().daysInYear.count()){
            this.incrementWeekday();
            return;
        }

        this.timespanCounts[this.monthId] = this.timespanCounts.get(this.monthId) + 1;
        this.numberTimespans++;

        this.day = 1;
        this.visualDay = 1;
        this.monthIndexOfYear++;

        if(this.monthIndexOfYear === this.months.count()){
            this.incrementYear();
        }

        if(this.calendar.overflowsWeek){
            this.incrementWeekday();
        }else{
            this.incrementWeek(!this.isIntercalary());
        }

        if(this.previousState.get('isIntercalary') && this.isIntercalary()){
            this.visualWeekdayIndex = 0;
        }

        this.visualWeekIndex = 0;

    }

    incrementHistoricalIntercalaryCount(){
        if(this.isIntercalary()){
            this.historicalIntercalaryCount++;
        }
    }

    incrementYear(){
        this.monthIndexOfYear = 0;
        this.year++;
        this.previousState.forget('months');
        this.previousState.forget('totalWeeksInYear');
        this.previousState.forget('dayOfYear');
    }

    /*
     * -------------------------------------------------------------
     * Methods for Fetching Values
     *-------------------------------------------------------------
     */

    weekdays() {
        return (this.calendar.overflowsWeek)
            ? this.calendar.global_week
            : this.currentMonth().weekdays;
    }

    weekdayCount(){
        return this.weekdays().count();
    }

    currentMonth()
    {
        return this.months.get(this.monthIndexOfYear);
    }

    isNumbered()
    {
        return this.currentMonth().daysInYear[this.day-1].isNumbered;
    }

    /*
     * -------------------------------------------------------------
     * Methods for Calculating Values
     *-------------------------------------------------------------
     */

    calculateMonthIndexOfYear(){
        return this.previousState.get('monthIndexOfYear', 0);
    }

    calculateMonths() {
        return (this.previousState.has('months'))
            ? this.previousState.get('months')
            : this.calendar.months;
    }

    calculateMonthId(){
        return this.currentMonth().id;
    }

    calculateWeeksSinceYearStart(){
        return this.previousState.get('weeksSinceYearStart', 1);
    }

    calculateTotalWeeksInYear(){

        if(this.previousState.has('totalWeeksInYear')){
            return this.previousState.get('totalWeeksInYear');
        }

        if(this.calendar.overflowsWeek){
            const totalDaysInYear = this.months.sum(month => month.countNormalDays());

            return Math.abs(Math.ceil((totalDaysInYear + this.weekdayIndex) / this.calendar.global_week.count()));
        }

        return this.months.sum(month => month.countWeeksInYear());
    }

    calculateWeeksSinceMonthStart(){
        return this.previousState.get('weeksSinceMonthStart', 1);
    }

    calculateTotalWeeksInMonth(){

        if(this.previousState.has('totalWeeksInMonth')){
            return this.previousState.get('totalWeeksInMonth');
        }

        const totalWeekdaysBeforeToday = (this.currentMonth().countNormalDays() + this.weekdayIndex);

        return Math.abs(Math.ceil(totalWeekdaysBeforeToday / this.currentMonth().weekdays.count()));
    }

    calculateDayOfYear(){
        return this.previousState.get('daysOfYear', 1);
    }

    calculateEpoch(){
        return this.previousState.get("epoch");
    }

    calculateTimespanCounts()
    {
        return this.previousState.get('timespanCounts');
    }

    calculateNumberTimespans()
    {
        return this.previousState.get('numberTimespans');
    }

    calculateHistoricalIntercalaryCount()
    {
        return this.previousState.get('historicalIntercalaryCount');
    }

    calculateWeekdayIndex()
    {
        return this.previousState.get('weekdayIndex');
    }

    calculateEraYear()
    {
        return this.previousState.get('eraYear');
    }

    calculateVisualWeekdayIndex()
    {
        return this.previousState.get('visualWeekdayIndex');
    }
}
