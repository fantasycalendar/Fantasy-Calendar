@props(['calendar' => null])

<x-clock-canvas name="current_date"></x-clock-canvas>

<div x-data="{ activeDateAdjustment: 'current' }">
    <ul class="nav justify-content-center nav-tabs mt-3">
        <li class="nav-item"><a href="javascript:;" class="nav-link px-2 small" :class="{ 'active': activeDateAdjustment === 'current' }" @click="activeDateAdjustment = 'current'">Current date</a></li>
        <li class="nav-item"><a href="javascript:;" class="nav-link px-2 small" :class="{ 'active': activeDateAdjustment === 'preview' }" @click="activeDateAdjustment = 'preview'">Preview date</a></li>
        <li class="nav-item"><a href="javascript:;" class="nav-link px-2 small" :class="{ 'active': activeDateAdjustment === 'relative' }" @click="activeDateAdjustment = 'relative'">Relative math</a></li>
    </ul>

    <div class='date_control mt-3' id='date_inputs' :class="{ 'd-flex flex-column': activeDateAdjustment === 'current', 'd-none': activeDateAdjustment !== 'current' }">
        <!-- TODO: Revisit childed calendar -->
        @if(isset($calendar) && $calendar?->isChild())
            <div class='mb-3 center-text hidden calendar_link_explanation'>
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


    <div class='date_control preview_date_controls mt-3' :class="{ 'd-flex flex-column': activeDateAdjustment === 'preview', 'd-none': activeDateAdjustment !== 'preview' }">


        <div class='input-group mt-2'>
            <div class='input-group-prepend'>
                <button type='button' class='btn btn-danger' @click="decrement_viewed_year"><i class="fa fa-minus"></i></button>
            </div>

            <input class='form-control' type='number' :value="viewed_year" @change="set_viewed_year(Number($event.target.value))">

            <div class='input-group-append'>
                <button type='button' class='btn btn-success' @click="increment_viewed_year"><i class="fa fa-plus"></i></button>
            </div>
        </div>

        <div class='input-group mt-2'>
            <div class='input-group-prepend'>
                <button type='button' class='btn btn-danger' @click="decrement_viewed_month"><i class="fa fa-minus"></i></button>
            </div>

            <select class='form-control' @change="set_viewed_month(Number($event.target.value))">
                <template x-for="(month, index) in viewed_year_months">
                    <option :value="index" x-text="month.name"
                            :selected="index === viewed_month"></option>
                </template>
            </select>

            <div class='input-group-append'>
                <button type='button' class='btn btn-success' @click="increment_viewed_month"><i class="fa fa-plus"></i></button>
            </div>
        </div>

        <div class='input-group mt-2'>
            <div class='input-group-prepend'>
                <button type='button' class='btn btn-danger' @click="decrement_viewed_day"><i class="fa fa-minus"></i></button>
            </div>

            <select class='form-control' @change="set_viewed_day(Number($event.target.value))">
                <template
                    x-for="(day, index) in viewed_month_days">
                    <option :value="index+1" x-text="day"
                            :selected="index+1 === viewed_day"></option>
                </template>
            </select>

            <div class='input-group-append'>
                <button type='button' class='btn btn-success' @click="increment_viewed_day"><i class="fa fa-plus"></i></button>
            </div>
        </div>

        <div class='btn btn-success full mt-2' x-show="viewed_date.follow" @click="set_viewed_date_active(true)">View date</div>
        <div class='btn btn-warning full mt-2' x-show="!viewed_date.follow" @click="set_viewed_date_active(false)">Reset</div>
    </div>

    <div class="mt-3" :class="{ 'd-flex flex-column': activeDateAdjustment === 'relative', 'd-none': activeDateAdjustment !== 'relative' }">
        <div class="input-group">
            <input type='number' class="form-control mt-2 px-2" id='unit_years' placeholder="Years (+/-)">
            <input type='number' class="form-control mt-2 px-2" id='unit_months' placeholder="Months (+/-)">
            <input type='number' class="form-control mt-2 px-2" id='unit_days' placeholder="Days (+/-)">
        </div>
        <div class='my-2 row no-gutters'>
            <div class="input-group">
                <input type='number' class="form-control px-2" id='unit_hours' placeholder="Hours (+/-)">
                <div class="input-group-prepend input-group-append"><span class="input-group-text">:</span></div>
                <input type='number' class="form-control px-2" id='unit_minutes' placeholder="Minutes (+/-)">
            </div>
        </div>

        <div class="d-flex mt-3">
            <span class="full text-center">Apply to</span>
        </div>

        <div class="d-flex">
            @if(request()->is('calendars/*/edit') && $calendar?->parent == null)
                <button type="button" step="1.0" class="btn btn-primary btn-block mt-2 mr-1" id='current_date_btn'>Current date</button>
                <button type="button" step="1.0" class="btn btn-secondary btn-block mt-2 ml-1" id='preview_date_btn'>Preview date</button>
            @else
                <button type="button" step="1.0" class="btn btn-secondary btn-block mt-2" id='preview_date_btn'>Preview date</button>
            @endif
        </div>
    </div>

    <div class="d-flex flex-column">
        <div class='btn btn-info hidden mt-2' disabled id='reset_preview_date_button'>Jump to current date</div>
    </div>
</div>
