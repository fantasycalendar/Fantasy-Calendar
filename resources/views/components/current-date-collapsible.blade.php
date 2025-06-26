@props(['calendar' => null])

<x-clock-canvas name="current_date"></x-clock-canvas>

<div>
    <ul class="nav justify-content-center nav-tabs mt-3">
        <li class="nav-item"><a href="javascript:;" class="nav-link px-2 small" :class="{ 'active': activeDateAdjustment === 'current' }" @click="activeDateAdjustment = 'current'">Current date</a></li>
        <li class="nav-item"><a href="javascript:;" class="nav-link px-2 small" :class="{ 'active': activeDateAdjustment === 'selected' }" @click="activeDateAdjustment = 'selected'">Selected date</a></li>
        <li class="nav-item"><a href="javascript:;" class="nav-link px-2 small" :class="{ 'active': activeDateAdjustment === 'relative' }" @click="activeDateAdjustment = 'relative'">Relative math</a></li>
    </ul>

    <div class='date_control mt-3' id='date_inputs' :class="{ 'd-flex flex-column': activeDateAdjustment === 'current', 'd-none': activeDateAdjustment !== 'current' }">
        <!-- TODO: Revisit childed calendar -->
        @if(isset($calendar) && $calendar?->isChild())
            <div class='mb-3 center-text calendar_link_explanation'>
                <p class='m-0'>This calendar follows the date of a <a href='/calendars/{{ $calendar->parent->hash }}' target="_blank">parent calendar</a>.</p>
            </div>

            <div class="input-group">
                <select class='form-control'></select>
                <select class='form-control'></select>
                <input class='form-control' type='number'>
            </div>

            <div class="input-group mt-2">
                <input class='form-control text-right protip' type='number' id='current_hour' data-pt-position='top' data-pt-title="The current hour of day">
                <div class="input-group-prepend input-group-append"><span class="input-group-text">:</span></div>
                <input class='form-control protip' type='number' id='current_minute' data-pt-position='top' data-pt-title="The current minute of the hour">
            </div>
        @else
            <div class='input-group mt-2'>
                <div class='input-group-prepend'>
                    <button type='button' class='btn btn-danger' @click="decrement_current_year"><i class="fa fa-minus"></i></button>
                </div>

                <input class='form-control' type='number' :value="current_year" @change="set_current_year(Number($event.target.value))">

                <div class='input-group-append'>
                    <button type='button' class='btn btn-success' @click="increment_current_year"><i class="fa fa-plus"></i></button>
                </div>
            </div>

            <div class='input-group mt-2'>
                <div class='input-group-prepend'>
                    <button type='button' class='btn btn-danger' @click="decrement_current_month"><i class="fa fa-minus"></i></button>
                </div>

                <select class='form-control' @change="set_current_month(Number($event.target.value))">
                    <template x-for="(month, index) in current_year_months">
                        <option :value="index" x-text="month.name"
                                :selected="index === current_month"></option>
                    </template>
                </select>

                <div class='input-group-append'>
                    <button type='button' class='btn btn-success' @click="increment_current_month"><i class="fa fa-plus"></i></button>
                </div>
            </div>

            <div class='input-group mt-2'>
                <div class='input-group-prepend'>
                    <button type='button' class='btn btn-danger' @click="decrement_current_day"><i class="fa fa-minus"></i></button>
                </div>

                <select class='form-control' @change="set_current_day(Number($event.target.value))">
                    <template
                        x-for="(day, index) in current_month_days">
                        <option :value="index+1" x-text="day"
                        :selected="index+1 === current_day"></option>
                    </template>
                </select>

                <div class='input-group-append'>
                    <button type='button' class='btn btn-success' @click="increment_current_day"><i class="fa fa-plus"></i></button>
                </div>
            </div>

            <div class='input-group mt-2'>
                <div class='input-group-prepend'>
                    <button type='button' class='btn btn-danger' @click="decrement_current_hour">1hr</button>
                    <button type='button' class='btn border-left btn-danger' @click="decrement_current_minute">30m</button>
                </div>

                <input class='form-control text-right protip' type='number' :value="current_hour" @change="set_current_hour(Number($event.target.value))">
                <div class="input-group-prepend input-group-append"><span class="input-group-text">:</span></div>
                <input class='form-control protip' type='number' :value="current_minute" @change="set_current_minute(Number($event.target.value))">

                <div class='input-group-append'>
                    <button type='button' class='btn small-text btn-success' @click="increment_current_minute">30m</button>
                    <button type='button' class='btn small-text border-left btn-success'@click="increment_current_hour">1h</button>
                </div>
            </div>
        @endif
    </div>


    <div class='date_control selected_date_controls mt-3' :class="{ 'd-flex flex-column': activeDateAdjustment === 'selected', 'd-none': activeDateAdjustment !== 'selected' }">
        <div class='input-group mt-2'>
            <div class='input-group-prepend'>
                <button type='button' class='btn btn-danger' @click="decrement_selected_year"><i class="fa fa-minus"></i></button>
            </div>

            <input class='form-control' type='number' :value="selected_year" @change="set_selected_year(Number($event.target.value))">

            <div class='input-group-append'>
                <button type='button' class='btn btn-success' @click="increment_selected_year"><i class="fa fa-plus"></i></button>
            </div>
        </div>

        <div class='input-group mt-2'>
            <div class='input-group-prepend'>
                <button type='button' class='btn btn-danger' @click="decrement_selected_month"><i class="fa fa-minus"></i></button>
            </div>

            <select class='form-control' @change="set_selected_month(Number($event.target.value))">
                <template x-for="(month, index) in selected_year_months">
                    <option :value="index" x-text="month.name"
                            :selected="index === selected_month"></option>
                </template>
            </select>

            <div class='input-group-append'>
                <button type='button' class='btn btn-success' @click="increment_selected_month"><i class="fa fa-plus"></i></button>
            </div>
        </div>

        <div class='input-group mt-2'>
            <div class='input-group-prepend'>
                <button type='button' class='btn btn-danger' @click="decrement_selected_day"><i class="fa fa-minus"></i></button>
            </div>

            <select class='form-control' @change="set_selected_day(Number($event.target.value))">
                <template
                    x-for="(day, index) in selected_month_days">
                    <option :value="index+1" x-text="day"
                            :selected="index+1 === selected_day"></option>
                </template>
            </select>

            <div class='input-group-append'>
                <button type='button' class='btn btn-success' @click="increment_selected_day"><i class="fa fa-plus"></i></button>
            </div>
        </div>

        <div class='btn btn-success full mt-2' x-show="selected_date.follow" @click="set_selected_date_active(true)">Select date</div>
        <div class='btn btn-warning full mt-2' x-show="!selected_date.follow" @click="set_selected_date_active(false)">Select current date</div>
    </div>

    <div class="flex flex-col mt-3" :class="{ 'd-flex flex-column': activeDateAdjustment === 'relative', 'd-none': activeDateAdjustment !== 'relative' }">
        <div class="input-group">
            <input type='number' class="form-control mt-2 px-2" x-model.number="date_adjustment_units.years" placeholder="Years (+/-)">
            <input type='number' class="form-control mt-2 px-2" x-model.number="date_adjustment_units.months" placeholder="Months (+/-)">
            <input type='number' class="form-control mt-2 px-2" x-model.number="date_adjustment_units.days" placeholder="Days (+/-)">
        </div>

        <div class="input-group my-2">
            <input type='number' class="form-control px-2" x-model.number="date_adjustment_units.hours" placeholder="Hours (+/-)">
            <div class="input-group-prepend input-group-append"><span class="input-group-text">:</span></div>
            <input type='number' class="form-control px-2" x-model.number="date_adjustment_units.minutes" placeholder="Minutes (+/-)">
        </div>

        <span class="full text-center">Apply to</span>

        <div class="flex space-x-2">
            @if(request()->is('calendars/*/edit') && $calendar?->parent == null)
                <button type="button" class="btn btn-primary btn-block mt-2" @click="adjust_current_date" :disabled="dateAdjustmentEnabled">Current date</button>
            @endif

            <button type="button" class="btn btn-secondary btn-block mt-2" @click="adjust_selected_date" :disabled="dateAdjustmentEnabled">Selected date</button>
        </div>
    </div>
</div>
