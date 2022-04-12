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
                },

                goToPreviewDate(){
                    window.calendar.goToPreviewDate();
                },

                goToCurrentDate(){
                    window.calendar.goToCurrentDate();
                }
            }
        }

        function dateSelector($data, date_object){

            const date = clone(date_object);

            return {

                static_data: $data.static_data,

                current_year: date.year,
                current_timespan: date.timespan,
                current_day: date.day,

                timespans: [],
                days: [],

                prev: {
                    year: 0,
                    timespan: "Test",
                    day: "1",
                },

                prev_year: { year: 0, timespan: 0, day: 0 },
                prev_timespan: { year: 0, timespan: 0, day: 0 },
                prev_day: { year: 0, timespan: 0, day: 0 },

                next_year: { year: 0, timespan: 0, day: 0 },
                next_timespan: { year: 0, timespan: 0, day: 0 },
                next_day: { year: 0, timespan: 0, day: 0 },

                init(){
                    this.populateTimespans();
                    this.populateDays();
                    this.updatePlaceholders();
                },

                populateTimespans(){
                    this.timespans = collect(window.calendar.getTimespansInYear(this.current_year));
                },

                populateDays(){
                    this.days = window.calendar.getDaysForTimespanInYear(this.current_year, this.current_timespan);
                },

                updatePlaceholders() {
                    this.getYearPlaceholders();
                    this.getTimespanPlaceholders();
                    this.getDayPlaceholders();
                },

                getYearPlaceholders() {

                    /*  Years  */
                    this.prev_year = {
                        year: this.current_year - 1,
                        timespan: this.current_timespan,
                        day: this.current_day
                    };

                    const prevYearTimespans = window.calendar.getTimespansInYear(this.prev_year.year).map(timespan => timespan.index);
                    if(!prevYearTimespans.includes(this.current_timespan)){
                        this.prev_year.timespan = prevYearTimespans.reduce((prev, curr) => {
                            return (Math.abs(curr - this.current_timespan) < Math.abs(prev - this.current_timespan) ? curr : prev);
                        });
                    }

                    const prevDaysInPrevTimespan = window.calendar.getDaysForTimespanInYear(this.prev_year.year, this.prev_year.timespan);
                    this.prev_year.day = Math.max(1, Math.min(prevDaysInPrevTimespan.length, this.current_day));


                    this.next_year = {
                        year: this.current_year + 1,
                        timespan: this.current_timespan,
                        day: this.current_day
                    };

                    const nextYearTimespans = window.calendar.getTimespansInYear(this.next_year.year).map(timespan => timespan.index);
                    if(!nextYearTimespans.includes(this.current_timespan)){
                        this.next_year.timespan = nextYearTimespans.reduce((prev, curr) => {
                            return (Math.abs(curr - this.current_timespan) < Math.abs(prev - this.current_timespan) ? curr : prev);
                        });
                    }

                    const nextDaysInNextTimespan = window.calendar.getDaysForTimespanInYear(this.next_year.year, this.next_year.timespan);
                    this.next_year.day = Math.max(1, Math.min(nextDaysInNextTimespan.length, this.current_day));

                },

                getTimespanPlaceholders() {

                    /*  Timespans  */
                    const timespanIndexInYear = Array.from(this.timespans).find(timespan => timespan.index === this.current_timespan).index;

                    const prevTimespanIsInLastYear = (timespanIndexInYear - 1) < 0;
                    const prevTimespanYear = prevTimespanIsInLastYear ? this.current_year - 1 : this.current_year;
                    const prevTimespan = prevTimespanIsInLastYear
                        ? collect(window.calendar.getTimespansInYear(this.current_year - 1)).last()
                        : this.timespans.get(timespanIndexInYear - 1);

                    const prevTimespanDays = window.calendar.getDaysForTimespanInYear(prevTimespanYear, prevTimespan.index);

                    this.prev_timespan = {
                        year: prevTimespanYear,
                        timespan: prevTimespan.index,
                        day: Math.max(1, Math.min(prevTimespanDays.length, this.current_day))
                    };

                    const nextTimespanIsInNextYear = (timespanIndexInYear + 1) >= this.timespans.count();
                    const nextTimespanYear = nextTimespanIsInNextYear ? this.current_year + 1 : this.current_year;
                    const nextTimespan = nextTimespanIsInNextYear
                        ? collect(window.calendar.getTimespansInYear(this.current_year + 1)).first()
                        : this.timespans.get(timespanIndexInYear + 1);

                    const nextTimespanDays = window.calendar.getDaysForTimespanInYear(nextTimespanYear, nextTimespan.index)

                    this.next_timespan = {
                        year: nextTimespanYear,
                        timespan: nextTimespan.index,
                        day: Math.max(1, Math.min(nextTimespanDays.length, this.current_day))
                    };

                },

                getDayPlaceholders(){

                    /*  Days  */
                    const timespanIndexInYear = Array.from(this.timespans).find(timespan => timespan.index === this.current_timespan).index;

                    this.prev_day = {
                        year: this.current_year,
                        timespan: this.current_timespan,
                        day: this.current_day - 1
                    }

                    const prevDayIsInLastTimespan = (this.current_day - 1) < 1;
                    if(prevDayIsInLastTimespan){

                        const prevTimespanIsInLastYear = (timespanIndexInYear - 1) < 0;

                        const prevYear = prevTimespanIsInLastYear ? this.current_year - 1 : this.current_year;

                        const prevTimespan = prevTimespanIsInLastYear
                            ? collect(window.calendar.getTimespansInYear(this.current_year - 1)).last()
                            : this.timespans.get(timespanIndexInYear - 1);

                        const days = window.calendar.getDaysForTimespanInYear(prevYear, prevTimespan.index);

                        this.prev_day = {
                            year: prevYear,
                            timespan: prevTimespan.index,
                            day: days.length
                        };

                    }


                    this.next_day = {
                        year: this.current_year,
                        timespan: this.current_timespan,
                        day: this.current_day + 1
                    }

                    const nextDayIsInNextTimespan = (this.current_day + 1) >= this.days.length;
                    if(nextDayIsInNextTimespan){

                        const nextTimespanIsInNextYear = (timespanIndexInYear + 1) >= this.timespans.count();
                        const nextTimespan = nextTimespanIsInNextYear
                            ? collect(window.calendar.getTimespansInYear(this.current_year + 1)).first()
                            : this.timespans.get(timespanIndexInYear + 1);

                        this.next_day = {
                            year: nextTimespanIsInNextYear ? this.current_year + 1 : this.current_year,
                            timespan: nextTimespan.index,
                            day: 1
                        };

                    }

                },

                changedDate($event){
                    if($event.detail.year !== undefined){
                        this.current_year = $event.detail.year;
                        this.populateTimespans();
                        if($event.detail.timespan === undefined){
                            this.populateDays();
                        }
                    }
                    if($event.detail.timespan !== undefined){
                        this.current_timespan = $event.detail.timespan;
                        this.populateDays();
                    }
                    if($event.detail.day !== undefined){
                        this.current_day = $event.detail.day;
                    }
                    this.updatePlaceholders();
                }

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

                    window.dispatchEvent(new CustomEvent("change-current-date", { detail: {
                        year: year,
                        timespan: timespanIndex,
                        day: day,
                        hour: currentHour,
                        minute: currentMinute,
                        epoch: targetEpoch
                    }}));

                    if(window.calendar.preview_date.follow) {
                        window.dispatchEvent(new CustomEvent("change-preview-date", { detail: {
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
        @go-to-preview-date.window="goToPreviewDate()"
        @go-to-current-date.window="goToCurrentDate()"
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
                x-data="dateSelector($data, dynamic_data)"
                @changed-current-date.window="changedDate"
                @calendar-structure-changed.window="updateTimespans()"
                @timespan-name-changed.window="updateTimespans()"
            >

                <div class="row my-2 divide-x divide-gray-500">
                    <div class="col-2">
                        <div class="row text-center py-1">
                            <span class="opacity-40 hover:opacity-100 w-100 cursor-pointer select-none" @click="$dispatch('change-current-date', prev_day)" x-text="prev_day.day"></span>
                        </div>
                        <div class="row text-center py-1">
                            <select class='ring-0 ring-offset-0 appearance-none w-100 border-0 bg-gray-800 text-inherit px-1 text-center truncate' x-model.number="current_day">
                                <template x-for="(day, index) in days">
                                    <option :selected="current_day === (index+1)" :value="index+1" x-text="day"></option>
                                </template>
                            </select>
                        </div>
                        <div class="row text-center py-1">
                            <span class="opacity-40 hover:opacity-100 w-100 cursor-pointer select-none" @click="$dispatch('change-current-date', next_day)" x-text="next_day.day"></span>
                        </div>
                    </div>
                    <div class="col-8">
                        <div class="row text-center py-1">
                            <span class="opacity-40 hover:opacity-100 w-100 cursor-pointer select-none" @click="$dispatch('change-current-date', prev_timespan)" x-text="static_data.year_data.timespans[prev_timespan.timespan].name"></span>
                        </div>
                        <div class="row text-center py-1">
                            <select class='ring-0 ring-offset-0 appearance-none w-100 border-0 bg-gray-800 text-inherit px-1 text-center truncate' x-model.number="current_timespan">
                                <template x-for="(timespan, index) in Array.from(timespans)">
                                    <option :selected="current_timespan === timespan.index" :value="timespan.index" x-text="timespan.name"></option>
                                </template>
                            </select>
                        </div>
                        <div class="row text-center py-1">
                            <span class="opacity-40 hover:opacity-100 w-100 cursor-pointer select-none" @click="$dispatch('change-current-date', next_timespan)" x-text="static_data.year_data.timespans[next_timespan.timespan].name"></span>
                        </div>
                    </div>
                    <div class="col-2">
                        <div class="row text-center py-1">
                            <span class="opacity-40 hover:opacity-100 w-100 cursor-pointer select-none" @click="$dispatch('change-current-date', prev_year)" x-text="prev_year.year"></span>
                        </div>
                        <div class="row text-center py-1">
                            <input type="number" class='no-spinner appearance-none w-100 border-0 bg-gray-800 text-inherit px-1 text-center' x-model.number="current_year">
                        </div>
                        <div class="row text-center py-1">
                            <span class="opacity-40 hover:opacity-100 w-100 cursor-pointer select-none" @click="$dispatch('change-current-date', next_year)" x-text="next_year.year"></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        {{--<div class='date_inputs date_control preview_date_controls container mt-3'>

            <div class='row'>
                <h5 class="my-0 py-0">Preview date:</h5>
            </div>

            <div
                x-data="dateSelector($data, preview_date, { hasButtons: true, previewDate: true})"
                @changed-preview-date.window="dateUpdated($event.detail)"
                @calendar-structure-changed.window="updateTimespans()"
                @timespan-name-changed.window="updateTimespans()"
            >

                <div class="row my-2 divide-x divide-gray-500">
                    <div class="col-2">
                        <div class="row text-center py-1">
                            <span class="opacity-40 hover:opacity-100 w-100 cursor-pointer select-none" @click="setDay(current_day - 1)" x-text="current_day - 1"></span>
                        </div>
                        <div class="row text-center py-1">
                            <select class='ring-0 ring-offset-0 appearance-none w-100 border-0 bg-gray-800 text-inherit px-1 text-center truncate' x-model.number="current_day">
                                <template x-for="(day, index) in days">
                                    <option :selected="current_day === (index+1)" :value="index+1" x-text="day"></option>
                                </template>
                            </select>
                        </div>
                        <div class="row text-center py-1">
                            <span class="opacity-40 hover:opacity-100 w-100 cursor-pointer select-none" @click="setDay(current_day + 1)" x-text="current_day + 1"></span>
                        </div>
                    </div>
                    <div class="col-8">
                        <div class="row text-center py-1">
                            <span class="opacity-40 hover:opacity-100 w-100 cursor-pointer select-none" @click="setMonth(current_timespan - 1)" x-text="prev_timespan"></span>
                        </div>
                        <div class="row text-center py-1">
                            <select class='ring-0 ring-offset-0 appearance-none w-100 border-0 bg-gray-800 text-inherit px-1 text-center truncate' x-model.number="current_timespan">
                                <template x-for="(timespan, index) in timespans">
                                    <option :selected="current_timespan === index" :value="index" x-text="timespan.name"></option>
                                </template>
                            </select>
                        </div>
                        <div class="row text-center py-1">
                            <span class="opacity-40 hover:opacity-100 w-100 cursor-pointer select-none" @click="setMonth(current_timespan + 1)" x-text="next_timespan"></span>
                        </div>
                    </div>
                    <div class="col-2">
                        <div class="row text-center py-1">
                            <span class="opacity-40 hover:opacity-100 w-100 cursor-pointer select-none" @click="setYear(current_year - 1)" x-text="current_year - 1"></span>
                        </div>
                        <div class="row text-center py-1">
                            <input type="number" class='no-spinner appearance-none w-100 border-0 bg-gray-800 text-inherit px-1 text-center' x-model.number="current_year">
                        </div>
                        <div class="row text-center py-1">
                            <span class="opacity-40 hover:opacity-100 w-100 cursor-pointer select-none" @click="setYear(current_year + 1)" x-text="date.year + 1"></span>
                        </div>
                    </div>
                </div>

            </div>

            <div class="grid grid-cols-2">
                <div class='col-span-2 my-2' :class="{'col-span-2': preview_date.follow}">
                    <div class='btn btn-success full' @click="$dispatch('go-to-preview-date')">Go To Preview date</div>
                </div>

                <div class='my-2'>
                    <div class='btn btn-info full' x-show="!preview_date.follow" @click="$dispatch('go-to-current-date')">Go To Current Date</div>
                </div>
            </div>
        </div>--}}

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
