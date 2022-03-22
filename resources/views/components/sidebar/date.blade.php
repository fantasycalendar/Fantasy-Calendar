@props([ "calendar" ])

@push('head')
    <script lang="js">

        function dateSection($data){

            return {

                static_data: $data.static_data,
                current_date: $data.dynamic_data,
                preview_date: $data.preview_date,
                clock: $data.static_data.clock,

                clockRenderer: null,

                get validCalendar(){
                    return !!this.static_data.year_data.timespans.length && !!this.static_data.year_data.global_week.length;
                },

                get shouldRenderClock(){
                    return this.clock.enabled && this.clock.render && window.Perms.user_can_see_clock();
                },

                init(){
                    this.$watch("static_data.clock", this.renderClock.bind(this));
                    this.$watch("dynamic_data", this.updateClockTime.bind(this));
                    this.renderClock()
                },

                renderClock(){
                    if(this.renderClock){
                        this.clockRenderer = new CalendarClock(
                            this.$refs.clock_face,
                            this.$refs.clock_sun,
                            this.$refs.clock_background,
                            this.$refs.clock.offsetWidth,
                            this.clock.hours,
                            this.clock.minutes,
                            this.clock.offset,
                            this.clock.crowding,
                            this.dynamic_data.hour,
                            this.dynamic_data.minute,
                            false,
                            6,
                            18
                        );
                    }
                },

                updateClockTime(){
                    if(!this.renderClock) return;
                    this.clockRenderer.set_time(this.dynamic_data.hour, this.dynamic_data.minute);
                },

                updateSunriseSunset({ sunrise = 6, sunset = 18 }={}){
                    if(!this.renderClock) return;
                    if(sunrise !== undefined) this.clockRenderer.sunrise = sunrise;
                    if(sunset !== undefined) this.clockRenderer.sunset = sunset;
                }
            }
        }

        function dateSelector($data, date_object, { hasTime = false, hasButtons = true, actualDate = true }={}){

            return {

                date: date_object,
                get hasTime(){
                    return hasTime && $data.static_data.clock.enabled;
                },

                hasButtons: hasButtons,

                calendarTimespans: $data.static_data.year_data.timespans,
                clock: $data.static_data.clock,

                get currentTimespan(){
                    return this.static_data.year_data.timespans[this.date.timespan];
                },

                get timespanInYearIndex(){
                    return this.timespans.indexOf(this.currentTimespan);
                },

                _next_year_timespans: false,
                get next_year_timespans(){
                    if(!this._next_year_timespans) {
                        this._next_year_timespans = window.calendar.getTimespansInYear(this.date.year + 1);
                    }
                    return this._next_year_timespans;
                },

                _prev_year_timespans: false,
                get prev_year_timespans(){
                    if(!this._prev_year_timespans) {
                        this._prev_year_timespans = window.calendar.getTimespansInYear(this.date.year-1);
                    }
                    return this._prev_year_timespans;
                },

                prev_timespan: "",
                timespans: [],
                next_timespan: "",

                _next_month_days: false,
                get next_month_days(){
                    if(!this._next_month_days) {
                        if ((this.timespanInYearIndex + 1) > this.timespans.length - 1) {
                            const firstMonthNextYear = this.next_year_timespans[0];
                            this._next_month_days = window.calendar.getDaysForTimespanInYear(this.date.year + 1, firstMonthNextYear.index);
                        }else{
                            const nextMonth = this.timespans[this.timespanInYearIndex + 1];
                            this._next_month_days = window.calendar.getDaysForTimespanInYear(this.date.year, nextMonth.index);
                        }
                    }
                    return this._next_month_days;
                },

                _prev_month_days: false,
                get prev_month_days() {
                    if(!this._prev_month_days){
                        if ((this.timespanInYearIndex - 1) < 0) {
                            const lastMonthNextYear = this.prev_year_timespans[this.prev_year_timespans.length - 1];
                            this._prev_month_days = window.calendar.getDaysForTimespanInYear(this.date.year - 1, lastMonthNextYear.index);
                        } else {
                            const lastMonthIndex = this.timespans[this.timespanInYearIndex - 1].index;
                            this._prev_month_days = window.calendar.getDaysForTimespanInYear(this.date.year, lastMonthIndex);
                        }
                    }
                    return this._prev_month_days;
                },

                prev_day: "",
                days: [],
                next_day: "",

                init(){
                    this.timespans = window.calendar.getTimespansInYear(this.date.year);
                    this.days = window.calendar.getDaysForTimespanInYear(this.date.year, this.date.timespan);
                    this.updatePrevNextTimespans();
                    this.updatePrevNextDays();
                    if(actualDate) {
                        this.$watch("date", this.updateCalendarDate.bind(this))
                    }
                },

                updateCalendarDate(){
                    window.calendar.dateChanged();
                },

                dateUpdated({ year, timespan, day, hour, minute }={}){
                    this.date.year = year;
                    this.date.timespan = timespan;
                    this.date.day = day;
                    this.date.hour = hour;
                    this.date.minute = minute;
                    this.updateTimespans();
                },

                updateTimespans(){
                    this.timespans = window.calendar.getTimespansInYear(this.date.year);
                    this.days = window.calendar.getDaysForTimespanInYear(this.date.year, this.date.timespan);
                    this.clearCache();
                },

                clearCache(){
                    this._next_month_days = false;
                    this._prev_month_days = false;
                    this._next_year_timespans = false;
                    this._prev_year_timespans = false;
                    this.updatePrevNextTimespans();
                    this.updatePrevNextDays();
                },

                updatePrevNextTimespans(){

                    if((this.timespanInYearIndex+1) >= this.timespans.length){
                        this.next_timespan = this.next_year_timespans[0].name;
                    }else{
                        this.next_timespan = this.timespans[this.timespanInYearIndex+1].name;
                    }

                    if((this.timespanInYearIndex-1) < 0){
                        this.prev_timespan = this.prev_year_timespans[this.prev_year_timespans.length-1].name;
                    }else{
                        this.prev_timespan = this.timespans[this.timespanInYearIndex-1].name;
                    }

                },

                updatePrevNextDays(){

                    if(this.date.day >= this.days.length){
                        this.next_day = this.next_month_days[0];
                    }else{
                        this.next_day = this.days[this.date.day];
                    }

                    if((this.date.day-1) <= 0){
                        this.prev_day = this.prev_month_days[this.prev_month_days.length-1];
                    }else{
                        this.prev_day = this.days[this.date.day-2];
                    }

                },

                setYear(target){
                    this.date.year = target;
                    this.clearCache();
                },

                setMonth(target){

                    this._next_month_days = false;
                    this._prev_month_days = false;

                    if(target >= this.timespans.length){
                        this.setYear(this.date.year+1);
                        this.timespans = window.calendar.getTimespansInYear(this.date.year);
                        this.date.timespan = this.timespans[0].index;
                    }else if(target < 0){
                        this.setYear(this.date.year-1);
                        this.timespans = window.calendar.getTimespansInYear(this.date.year);
                        this.date.timespan = this.timespans[this.timespans.length-1].index;
                    }else{
                        this.date.timespan = this.timespans[target].index;
                    }

                    this.days = window.calendar.getDaysForTimespanInYear(this.date.year, this.date.timespan);
                    this.date.day = Math.min(this.date.day, this.days.length)

                    this.updatePrevNextTimespans();
                    this.updatePrevNextDays();

                },

                setDay(target){

                    if(target > this.days.length){
                        this.setMonth(this.timespanInYearIndex+1);
                        this.date.day = 1;
                    }else if(target <= 0){
                        this.setMonth(this.timespanInYearIndex-1);
                        this.date.day = this.days.length;
                    }else{
                        this.date.day = target;
                    }

                    this.updatePrevNextDays();

                },

                setHour(target){

                    // TODO: We need to reimplement the time inputs

                },

                setMinute(target){

                    // TODO: We need to reimplement the time inputs

                },

                addToDate({ years = 0, months = 0, days = 0, hours = 0, minutes = 0 }={}){

                    // TODO: Add to date handling - will need an epoch factory to have an easier time to do this

                },
            }
        }

        function fixedUnitsHandler(){

            return {

                fixedUnits: {
                    years: null,
                    months: null,
                    days: null,
                    hours: null,
                    minutes: null,
                },

                targetEpoch: null,

                addDateUnits(toPreviewDate = false){

                    const dateObject = toPreviewDate ? window.calendar.preview_date : window.calendar.dynamic_data;

                    let { years, months, days, hours, minutes } = this.fixedUnits;

                    const averageYearLength = window.calendar.getAverageYearLength();
                    const averageMonthLength = window.calendar.getAverageMonthLength();

                    days += Math.floor(averageYearLength * years);
                    days += Math.floor(averageMonthLength * months);

                    let currentHour = 0;
                    let currentMinute = 0;

                    if(window.calendar.static_data.clock.enabled) {

                        let hoursAdded = (dateObject.minute + minutes) / window.calendar.static_data.clock.minutes;
                        let daysAdded = (dateObject.hour + hoursAdded + hours) / window.calendar.static_data.clock.hours;

                        currentHour = fract(daysAdded) * window.calendar.static_data.clock.hours;

                        if(currentHour < 0){
                            currentHour += window.calendar.static_data.clock.hours;
                        }

                        currentMinute = Math.round(fract(currentHour) * window.calendar.static_data.clock.minutes);
                        currentHour = Math.floor(currentHour);

                        if(currentMinute === window.calendar.static_data.clock.minutes){
                            currentHour++;
                            currentMinute = 0;
                            if(currentHour === window.calendar.static_data.clock.hours){
                                daysAdded++;
                                currentHour = 0;
                            }
                        }

                        days += Math.floor(daysAdded);

                    }

                    this.targetEpoch = dateObject.epoch + Math.floor(days);

                    const guessYear = Math.floor(this.targetEpoch / averageYearLength) + window.calendar.static_data.settings.year_zero_exists + 1;

                    const year = this.resolveYear(guessYear);
                    let foundEpoch = window.calendar.getEpochForDate(year).epoch;

                    let timespansInYear = window.calendar.getTimespansInYear(year);
                    let timespanIndex = timespansInYear[0].index;
                    if(foundEpoch < this.targetEpoch) {
                        for (let timespan of timespansInYear) {
                            const days = window.calendar.getDaysForTimespanInYear(year, timespan.index).length;
                            if((foundEpoch+days) <= this.targetEpoch){
                                foundEpoch += days;
                            }else{
                                timespanIndex = timespan.index;
                                break;
                            }
                        }
                    }

                    const day = this.targetEpoch - foundEpoch + 1;

                    const targetEpoch = this.targetEpoch;

                    window.dispatchEvent(new CustomEvent("current-date-changed", { detail: {
                        year: year,
                        timespan: timespanIndex,
                        day: day,
                        hour: currentHour,
                        minute: currentMinute,
                        epoch: targetEpoch
                    }}));

                    if(window.calendar.preview_date.follow) {
                        window.dispatchEvent(new CustomEvent("preview-date-changed", { detail: {
                            year: year,
                            timespan: timespanIndex,
                            day: day,
                            hour: currentHour,
                            minute: currentMinute,
                            epoch: targetEpoch
                        }}));
                    }
                },

                resolveYear(guessYear){

                    let lowerGuess;
                    let higherGuess;

                    do {
                        lowerGuess = window.calendar.getEpochForDate(guessYear).epoch;
                        higherGuess = window.calendar.getEpochForDate(guessYear + 1).epoch;

                        guessYear += this.refinedEstimationDistance(lowerGuess, higherGuess);

                    } while(lowerGuess > this.targetEpoch || higherGuess <= this.targetEpoch);

                    return guessYear;

                },

                refinedEstimationDistance(lowerGuess, higherGuess){

                    if(lowerGuess <= this.targetEpoch && higherGuess > this.targetEpoch) return 0;

                    const distance = Math.abs(lowerGuess - this.targetEpoch);
                    const offByYears = distance / window.calendar.getAverageYearLength();

                    if(offByYears <= 1){
                        return 1;
                    }

                    if(higherGuess <= this.targetEpoch){
                        return Math.floor(offByYears);
                    }

                    return -Math.ceil(offByYears)

                }

            }


        }

    </script>
@endpush


<x-sidebar.collapsible
    class="settings-date"
    name="current_date"
    title="Current Date"
    icon="fas fa-hourglass-half"
    tooltip-title="More Info: Date"
    helplink="current_date_and_time"
    @change="moveClock($event, 'date')"
>

    <div
        x-data="dateSection($data)"
    >

        <div id="clock_container">
            <div class='mb-2' x-ref="clock" id="clock" x-show="shouldRenderClock">
                <canvas style="z-index: 2;" x-ref="clock_face"></canvas>
                <canvas style="z-index: 1;" x-ref="clock_sun"></canvas>
                <canvas style="z-index: 0;" x-ref="clock_background"></canvas>
            </div>
        </div>

        <div class='center-text mb-2' x-show="!validCalendar">
            This calendar doesn't have any weekdays or months yet, so you can't change the date.
        </div>

        <div class='date_inputs date_control container' x-show="validCalendar">

            <div class='row'>
                <h5>Current date:</h5>
            </div>

            <div class='row my-2 center-text hidden calendar_link_explanation'>
                @if(request()->is('calendars/*/edit') && $calendar->parent != null)
                    <p class='m-0'>This calendar is using a different calendar's date to calculate the current date. Only the <a href='/calendars/{{ $calendar->parent->hash }}/edit' target="_blank">parent calendar</a> can set the date for this calendar.</p>
                @endif
            </div>

            <div
                x-data="dateSelector($data, dynamic_data, { hasTime: true, hasButtons: true })"
                @current-date-changed.window="dateUpdated($event.detail)"
                @calendar-structure-changed.window="updateTimespans()"
                @timespan-name-changed.window="updateTimespans()"
            >

                <div class="row my-2 divide-x divide-gray-500">
                    <div class="col-2">
                        <div class="row text-center py-1">
                            <span class="opacity-40 hover:opacity-100 w-100 cursor-pointer select-none" @click="setDay(date.day - 1)" x-text="prev_day"></span>
                        </div>
                        <div class="row text-center py-1">
                            <select class='ring-0 ring-offset-0 appearance-none w-100 border-0 bg-gray-800 text-inherit px-1 text-center truncate' x-model.number="date.day">
                                <template x-for="(day, index) in days">
                                    <option :selected="date.day === (index+1)" :value="index+1" x-text="day"></option>
                                </template>
                            </select>
                        </div>
                        <div class="row text-center py-1">
                            <span class="opacity-40 hover:opacity-100 w-100 cursor-pointer select-none" @click="setDay(date.day + 1)" x-text="next_day"></span>
                        </div>
                    </div>
                    <div class="col-8">
                        <div class="row text-center py-1">
                            <span class="opacity-40 hover:opacity-100 w-100 cursor-pointer select-none" @click="setMonth(timespanInYearIndex - 1)" x-text="prev_timespan"></span>
                        </div>
                        <div class="row text-center py-1">
                            <select class='ring-0 ring-offset-0 appearance-none w-100 border-0 bg-gray-800 text-inherit px-1 text-center truncate' x-model.number="date.timespan">
                                <template x-for="(timespan, index) in timespans">
                                    <option :selected="date.timespan === timespan.index" :value="timespan.index" x-text="timespan.name"></option>
                                </template>
                            </select>
                        </div>
                        <div class="row text-center py-1">
                            <span class="opacity-40 hover:opacity-100 w-100 cursor-pointer select-none" @click="setMonth(timespanInYearIndex + 1)" x-text="next_timespan"></span>
                        </div>
                    </div>
                    <div class="col-2">
                        <div class="row text-center py-1">
                            <span class="opacity-40 hover:opacity-100 w-100 cursor-pointer select-none" @click="setYear(date.year - 1)" x-text="date.year - 1"></span>
                        </div>
                        <div class="row text-center py-1">
                            <input type="number" class='no-spinner appearance-none w-100 border-0 bg-gray-800 text-inherit px-1 text-center' x-model.number="date.year">
                        </div>
                        <div class="row text-center py-1">
                            <span class="opacity-40 hover:opacity-100 w-100 cursor-pointer select-none" @click="setYear(date.year + 1)" x-text="date.year + 1"></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <div class='date_inputs date_control preview_date_controls container mt-3'>

            <div class='row'>
                <h5 class="my-0 py-0">Preview date:</h5>
            </div>

            <div
                x-data="dateSelector($data, preview_date, { hasTime: true, hasButtons: true, actualDate: false })"
                @preview-date-changed.window="dateUpdated($event.detail)"
                @calendar-structure-changed.window="updateTimespans()"
                @timespan-name-changed.window="updateTimespans()"
            >

                <div class="row my-2 divide-x divide-gray-500">
                    <div class="col-2">
                        <div class="row text-center py-1">
                            <span class="opacity-40 hover:opacity-100 w-100 cursor-pointer select-none" @click="setDay(date.day - 1)" x-text="date.day - 1"></span>
                        </div>
                        <div class="row text-center py-1">
                            <select class='ring-0 ring-offset-0 appearance-none w-100 border-0 bg-gray-800 text-inherit px-1 text-center truncate' x-model.number="date.day">
                                <template x-for="(day, index) in days">
                                    <option :selected="date.day === (index+1)" :value="index+1" x-text="day"></option>
                                </template>
                            </select>
                        </div>
                        <div class="row text-center py-1">
                            <span class="opacity-40 hover:opacity-100 w-100 cursor-pointer select-none" @click="setDay(date.day + 1)" x-text="date.day + 1"></span>
                        </div>
                    </div>
                    <div class="col-8">
                        <div class="row text-center py-1">
                            <span class="opacity-40 hover:opacity-100 w-100 cursor-pointer select-none" @click="setMonth(date.timespan - 1)" x-text="prev_timespan"></span>
                        </div>
                        <div class="row text-center py-1">
                            <select class='ring-0 ring-offset-0 appearance-none w-100 border-0 bg-gray-800 text-inherit px-1 text-center truncate' x-model.number="date.timespan">
                                <template x-for="(timespan, index) in timespans">
                                    <option :selected="date.timespan === index" :value="index" x-text="timespan.name"></option>
                                </template>
                            </select>
                        </div>
                        <div class="row text-center py-1">
                            <span class="opacity-40 hover:opacity-100 w-100 cursor-pointer select-none" @click="setMonth(date.timespan + 1)" x-text="next_timespan"></span>
                        </div>
                    </div>
                    <div class="col-2">
                        <div class="row text-center py-1">
                            <span class="opacity-40 hover:opacity-100 w-100 cursor-pointer select-none" @click="setYear(date.year - 1)" x-text="date.year - 1"></span>
                        </div>
                        <div class="row text-center py-1">
                            <input type="number" class='no-spinner appearance-none w-100 border-0 bg-gray-800 text-inherit px-1 text-center' x-model.number="date.year">
                        </div>
                        <div class="row text-center py-1">
                            <span class="opacity-40 hover:opacity-100 w-100 cursor-pointer select-none" @click="setYear(date.year + 1)" x-text="date.year + 1"></span>
                        </div>
                    </div>
                </div>

            </div>

            <div class="grid grid-cols-2">
                <div class='col-span-2 my-2' :class="{'col-span-2': preview_date.follow}">
                    <div class='btn btn-success full' @click="preview_date.follow = false; window.calendar.dateChanged();">Go To Preview date</div>
                </div>

                <div class='my-2'>
                    <div class='btn btn-info full' x-show="!preview_date.follow" @click="preview_date.follow = true; window.calendar.dateChanged();">Go To Current Date</div>
                </div>
            </div>
        </div>

        <div class='wrap-collapsible card full' x-data="fixedUnitsHandler()">
            <input class="toggle" type="checkbox" id="collapsible_add_units">
            <label for="collapsible_add_units" class="lbl-toggle card-header small-lbl-text center-text">Add or subtract fixed datetime amounts</label>
            <div class="collapsible-content container card-body">

                <div class='input-group no-gutters mx-0'>
                    <input type='number' class="form-control form-control-sm" x-model.number="fixedUnits.years" placeholder="Years">
                    <input type='number' class="form-control form-control-sm" x-model.number="fixedUnits.months" placeholder="Months">
                    <input type='number' class="form-control form-control-sm" x-model.number="fixedUnits.days" placeholder="Days">
                </div>
                <div class='input-group no-gutters mx-0 my-2' x-show="static_data.clock.enabled">
                    <input type='number' class="form-control form-control-sm" x-model.number="fixedUnits.hours" placeholder="Hours">
                    <input type='number' class="form-control form-control-sm" x-model.number="fixedUnits.minutes" placeholder="Minutes">
                </div>

                <div class="grid grid-cols-2 gap-2">
                    <div>
                        <button type="button" step="1.0" class="btn btn-secondary btn-block my-2" @click="addDateUnits(true)">To preview</button>
                    </div>
                    @if(request()->is('calendars/*/edit') && $calendar->parent == null)
                        <div>
                            <button type="button" step="1.0" class="btn btn-primary btn-block my-2" @click="addDateUnits()">To current</button>
                        </div>
                    @endif

                </div>
            </div>

        </div>


    </div>

</x-sidebar.collapsible>
