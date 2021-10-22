import InitialStateWithEras from "./InitialStateWithEras.js";
import InitialState from "./InitialState.js";

export default class State {

    constructor(calendar){

        this.calendar = calendar;
        this.year = calendar.year;
        this.statecache = collect({});
        this.previousState = collect({});

        this.day = 1;
        this.visualDay = 1;
        this.withEras = true;
        this.visualWeekdayIndex = 0;
        this.visualWeekIndex = 0;
    }

    flushCache() {
        this.previousState = this.statecache;
        this.statecache = collect({});
    }

    getState() {
        return this.statecache;
    }

    disableEras() {
        this.withEras = false;
        this.previousState.put('months', this.calendar.monthsWithoutEras);
        return this;
    }

    initialize() {
        this.statecache = this.buildInitialState();
    }

    buildInitialState() {
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
        };
    }

    incrementDay() {
        if(this.isNumbered()){
            this.visualDay++;
        }

        this.day++;
        this.epoch++;
        this.dayOfYear++;
    }

    incrementWeekday() {
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
        if(this.weekdayIndex >= this.weekdayCount() || force){
            this.weekdayIndex = 0;
            this.visualWeekdayIndex++;
            this.weeksSinceMonthStart++;
            this.weeksSinceYearStart++;
        }
    }

    incrementMonth() {
        if(this.day <= this.currentMonth().daysInYear.count()) {
            this.incrementWeekday();
            return;
        }

        this.timespanCounts.put(this.monthId, this.timespanCounts.get(this.monthId) + 1);
        this.numberTimespans++;

        this.day = 1;
        this.visualDay = 1;
        this.monthIndexOfYear++;

        if(this.monthIndexOfYear === this.months.count()){
            this.incrementYear();
        }

        this.monthId = this.months.get(this.monthIndexOfYear).id;
        this.weeksSinceMonthStart = 0;
        this.previousState.forget('totalWeeksInMonth');

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

    incrementHistoricalIntercalaryCount() {
        if(this.isIntercalary()){
            this.historicalIntercalaryCount++;
        }
    }

    incrementYear() {
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

    weekdayCount() {
        return this.weekdays().count();
    }

    currentMonth() {
        return this.months.get(this.monthIndexOfYear);
    }

    isIntercalary() {
        if(!this.statecache.has('isIntercalary') || this.statecache.get('isIntercalary') == null){
            this.statecache.put('isIntercalary', this.currentMonth().daysInYear.get(this.day-1).intercalary);
        }

        return this.statecache.get('isIntercalary');
    }

    isNumbered() {
        return this.currentMonth().daysInYear.get(this.day-1).isNumbered;
    }

    /*
     * -------------------------------------------------------------
     * Methods for Calculating Values
     *-------------------------------------------------------------
     */


    set monthIndexOfYear(value) {
        this.statecache.put("monthIndexOfYear", value);
    }
    calculateMonthIndexOfYear(){
        return this.previousState.get('monthIndexOfYear', 0);
    }
    get monthIndexOfYear() {
        if(!this.statecache.has('monthIndexOfYear') || this.statecache.get('monthIndexOfYear') == null){
            this.statecache.put('monthIndexOfYear', this.calculateMonthIndexOfYear());
        }
        return this.statecache.get('monthIndexOfYear');
    }


    set months(value) {
        this.statecache.put("months", value);
    }
    get months() {
        return (this.previousState.has('months'))
            ? this.previousState.get('months')
            : this.calendar.months;
    }


    set monthId(value) {
        this.statecache.put("monthId", value);
    }
    get monthId() {
        return this.currentMonth().id;
    }


    set weeksSinceYearStart(value) {
        this.statecache.put("weeksSinceYearStart", value);
    }
    calculateWeeksSinceYearStart(){
        return this.previousState.get('weeksSinceYearStart', 1);
    }
    get weeksSinceYearStart() {
        if(!this.statecache.has('weeksSinceYearStart') || this.statecache.get('weeksSinceYearStart') == null){
            this.statecache.put('weeksSinceYearStart', this.calculateWeeksSinceYearStart());
        }
        return this.statecache.get('weeksSinceYearStart');
    }


    set totalWeeksInYear(value) {
        this.statecache.put("totalWeeksInYear", value);
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
    get totalWeeksInYear() {

        if(!this.statecache.has('totalWeeksInYear') || this.statecache.get('totalWeeksInYear') == null){
            this.statecache.put('totalWeeksInYear', this.calculateTotalWeeksInYear());
        }

        return this.statecache.get('totalWeeksInYear');

    }


    set weeksSinceMonthStart(value) {
        this.statecache.put("weeksSinceMonthStart", value);
    }
    calculateWeeksSinceMonthStart(){
        return this.previousState.get('weeksSinceMonthStart', 0);
    }
    get weeksSinceMonthStart() {
        if(!this.statecache.has('weeksSinceMonthStart') || this.statecache.get('weeksSinceMonthStart') == null){
            this.statecache.put('weeksSinceMonthStart', this.calculateWeeksSinceMonthStart());
        }
        return this.statecache.get('weeksSinceMonthStart');
    }


    set totalWeeksInMonth(value) {
        this.statecache.put("totalWeeksInMonth", value);
    }
    calculateTotalWeeksInMonth(){
        if(this.previousState.has('totalWeeksInMonth')){
            return this.statecache.get('totalWeeksInMonth');
        }

        const totalWeekdaysBeforeToday = (this.currentMonth().countNormalDays() + this.weekdayIndex);

        return Math.abs(Math.ceil(totalWeekdaysBeforeToday / this.currentMonth().weekdays.count()));
    }
    get totalWeeksInMonth() {
        if(!this.statecache.has('totalWeeksInMonth') || this.statecache.get('totalWeeksInMonth') == null){
            this.statecache.put('totalWeeksInMonth', this.previousState.get('totalWeeksInMonth'));
        }
        return this.statecache.get('totalWeeksInMonth');
    }


    set dayOfYear(value) {
        this.statecache.put("dayOfYear", value);
    }
    calculateDayOfYear(){
        return this.previousState.get('daysOfYear', 1);
    }
    get dayOfYear() {
        if(!this.statecache.has('daysOfYear') || this.statecache.get('daysOfYear') == null){
            this.statecache.put('daysOfYear', this.calculateDayOfYear());
        }
        return this.statecache.get('daysOfYear');
    }


    set epoch(value) {
        this.statecache.put("epoch", value);
    }
    calculateEpoch(){
        return this.previousState.get('epoch');
    }
    get epoch() {
        if(!this.statecache.has('epoch') || this.statecache.get('epoch') == null){
            this.statecache.put('epoch', this.calculateEpoch());
        }
        return this.statecache.get("epoch");
    }


    set timespanCounts(value) {
        this.statecache.put("timespanCounts", value);
    }
    calculateTimespanCounts(){
        return this.previousState.get('timespanCounts');
    }
    get timespanCounts() {
        if(!this.statecache.has('timespanCounts') || this.statecache.get('timespanCounts') == null){
            this.statecache.put('timespanCounts', this.calculateTimespanCounts());
        }
        return this.statecache.get('timespanCounts');
    }


    set numberTimespans(value) {
        this.statecache.put("numberTimespans", value);
    }
    calculateNumberTimespans(){
        return this.previousState.get('numberTimespans');
    }
    get numberTimespans() {
        if(!this.statecache.has('numberTimespans') || this.statecache.get('numberTimespans') == null){
            this.statecache.put('numberTimespans', this.calculateNumberTimespans());
        }
        return this.statecache.get('numberTimespans');
    }


    set historicalIntercalaryCount(value) {
        this.statecache.put("historicalIntercalaryCount", value);
    }
    calculateHistoricalIntercalaryCount(){
        return this.previousState.get('historicalIntercalaryCount');
    }
    get historicalIntercalaryCount() {
        if(!this.statecache.has('historicalIntercalaryCount') || this.statecache.get('historicalIntercalaryCount') == null){
            this.statecache.put('historicalIntercalaryCount', this.calculateHistoricalIntercalaryCount());
        }
        return this.statecache.get('historicalIntercalaryCount');
    }


    set weekdayIndex(value) {
        this.statecache.put("weekdayIndex", value);
    }
    calculateWeekdayIndex(){
        return this.previousState.get('weekdayIndex');
    }
    get weekdayIndex() {
        if(!this.statecache.has('weekdayIndex') || this.statecache.get('weekdayIndex') == null){
            this.statecache.put('weekdayIndex', this.calculateWeekdayIndex());
        }
        return this.statecache.get('weekdayIndex');
    }


    set eraYear(value) {
        this.statecache.put("eraYear", value);
    }
    calculateEraYear(){
        return this.previousState.get('eraYear');
    }
    get eraYear() {
        if(!this.statecache.has('eraYear') || this.statecache.get('eraYear') == null){
            this.statecache.put('eraYear', this.calculateEraYear());
        }
        return this.statecache.get('eraYear');
    }


    set visualWeekdayIndex(value) {
        this.statecache.put("visualWeekdayIndex", value);
    }
    calculateVisualWeekdayIndex(){
        return this.previousState.get('visualWeekdayIndex');
    }
    get visualWeekdayIndex() {
        if(!this.statecache.has('visualWeekdayIndex') || this.statecache.get('visualWeekdayIndex') == null){
            this.statecache.put('visualWeekdayIndex', this.calculateVisualWeekdayIndex());
        }
        return this.statecache.get('visualWeekdayIndex');
    }
}
