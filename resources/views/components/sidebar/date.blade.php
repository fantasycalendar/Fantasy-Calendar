@props([ "calendar" ])

@push('head')
    <script lang="js">

        function dateSection($data){

            return {

                getTimespansInYear: $data.getTimespansInYear,
                getDaysForTimespanInYear: $data.getDaysForTimespanInYear,

                static_data: $data.static_data,
                current_date: $data.dynamic_data,
                preview_date: $data.preview_date,
                clock: $data.static_data.clock,

                fixedUnits: {
                    years: null,
                    months: null,
                    days: null,
                    hours: null,
                    minutes: null,
                },

                clockRenderer: null,

                get validCalendar(){
                    return !!this.static_data.year_data.timespans.length && !!this.static_data.year_data.global_week.length;
                },

                get renderClock(){
                    return this.clock.enabled && this.clock.render && window.Perms.user_can_see_clock();
                },

                init(){

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

        function dateSelector($data, date_object, { hasTime = false, hasButtons = true }={}){

            return {

                date: date_object,
                get hasTime(){
                    return hasTime && $data.static_data.clock.enabled;
                },

                hasButtons: hasButtons,

                getTimespansInYear: $data.getTimespansInYear,
                getDaysForTimespanInYear: $data.getDaysForTimespanInYear,

                calendarTimespans: $data.static_data.year_data.timespans,
                clock: $data.static_data.clock,

                timespans: [],
                days: [],

                init(){
                    this.timespans = this.getTimespansInYear(this.date.year);
                    this.days = this.getDaysForTimespanInYear(this.date.timespan, this.date.year);
                },

                setYear(target){
                    this.timespans = this.getTimespansInYear(target)
                    this.date.year = target;
                },

                addToDate({ years = 0, months = 0, days = 0, hours = 0, minutes = 0 }={}){

                    // TODO: Add to date handling - will need an epoch factory to have an easier time to do this

                },

                setMonth(target){
                    // TODO: This does not yet handle adding multiple years, months or days

                    if(target >= this.timespans.length){
                        this.setYear(this.date.year+1)
                        const timespan = this.timespans[0];
                        this.date.timespan = this.calendarTimespans.indexOf(timespan);
                    }else if(target < 0){
                        this.setYear(this.date.year-1)
                        const timespan = this.timespans[this.timespans.length-1];
                        this.date.timespan = this.calendarTimespans.indexOf(timespan);
                    }else{
                        this.date.timespan = target;
                    }

                    this.days = this.getDaysForTimespanInYear(this.date.timespan, this.date.year)
                    this.date.day = Math.min(this.date.day, this.days.length)
                },

                setDay(target){
                    if(target > this.days.length){
                        this.date.day = 1;
                        this.setMonth(this.date.timespan+1)
                    }else if(target <= 0){
                        this.setMonth(this.date.timespan-1)
                        this.date.day = this.days.length;
                    }else{
                        this.date.day = target;
                    }
                },

                setHour(target){
                    const daysToAdd = Math.floor(target / this.clock.hours)
                    if(daysToAdd){
                        this.setDay(this.date.day+daysToAdd);
                    }
                    const targetHour = target % this.clock.hours;
                    this.date.hour = targetHour < 0 ? this.clock.hours + targetHour : targetHour;
                    window.dispatchEvent(new CustomEvent('time-changed'));
                },

                setMinute(target){
                    const hoursToAdd = Math.floor(target / this.clock.minutes)
                    if(hoursToAdd){
                        this.setHour(this.date.hour+hoursToAdd);
                    }
                    const targetMinute = target % this.clock.minutes;
                    this.date.minute = targetMinute < 0 ? this.clock.minutes + targetMinute : targetMinute;
                    window.dispatchEvent(new CustomEvent('time-changed'));
                },
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
    checked="true"
>

    <div
        x-data="dateSection($data)"
        @time-changed.window="updateClockTime()"
    >

        <div class='mb-2' x-ref="clock" id="clock" x-show="renderClock">
            <canvas style="z-index: 2;" x-ref="clock_face"></canvas>
            <canvas style="z-index: 1;" x-ref="clock_sun"></canvas>
            <canvas style="z-index: 0;" x-ref="clock_background"></canvas>
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
                @add-to-current-date.window="addToDate($event.detail.data)"

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
                            <span class="opacity-40 hover:opacity-100 w-100 cursor-pointer select-none" @click="setMonth(date.timespan - 1)">Prev. month</span>
                        </div>
                        <div class="row text-center py-1">
                            <select class='ring-0 ring-offset-0 appearance-none w-100 border-0 bg-gray-800 text-inherit px-1 text-center truncate' x-model.number="date.timespan">
                                <template x-for="(timespan, index) in timespans">
                                    <option :selected="date.timespan === index" :value="index" x-text="timespan.name"></option>
                                </template>
                            </select>
                        </div>
                        <div class="row text-center py-1">
                            <span class="opacity-40 hover:opacity-100 w-100 cursor-pointer select-none" @click="setMonth(date.timespan + 1)">Next month</span>
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
                x-data="dateSelector($data, preview_date, { hasTime: true, hasButtons: true })"
                @add-to-preview-date.window="addToDate($event.detail.data)"
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
                            <span class="opacity-40 hover:opacity-100 w-100 cursor-pointer select-none" @click="setMonth(date.timespan - 1)">Prev. month</span>
                        </div>
                        <div class="row text-center py-1">
                            <select class='ring-0 ring-offset-0 appearance-none w-100 border-0 bg-gray-800 text-inherit px-1 text-center truncate' x-model.number="date.timespan">
                                <template x-for="(timespan, index) in timespans">
                                    <option :selected="date.timespan === index" :value="index" x-text="timespan.name"></option>
                                </template>
                            </select>
                        </div>
                        <div class="row text-center py-1">
                            <span class="opacity-40 hover:opacity-100 w-100 cursor-pointer select-none" @click="setMonth(date.timespan + 1)">Next month</span>
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

            <div class='row my-2'>
                <div class='btn btn-success full' @click="preview_date.follow = false">Go To Preview date</div>
            </div>

            <div class='row my-2'>
                <div class='btn btn-info full' x-show="!preview_date.follow" @click="preview_date.follow = true">Go To Current Date</div>
            </div>

        </div>

        <div class='wrap-collapsible card full date_inputs'>
            <input class="toggle" type="checkbox" id="collapsible_add_units">
            <label for="collapsible_add_units" class="lbl-toggle card-header small-lbl-text center-text">Add or subtract fixed datetime units</label>
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
                    @if(request()->is('calendars/*/edit') && $calendar->parent == null)
                        <div>
                            <button type="button" step="1.0" class="btn btn-primary btn-block my-2" @click="$dispatch('add-to-current-date', { data: fixedUnits })">To current</button>
                        </div>
                    @endif
                    <div>
                        <button type="button" step="1.0" class="btn btn-secondary btn-block my-2" @click="$dispatch('add-to-preview-date', { data: fixedUnits })">To preview</button>
                    </div>

                </div>
            </div>

        </div>


    </div>

</x-sidebar.collapsible>
