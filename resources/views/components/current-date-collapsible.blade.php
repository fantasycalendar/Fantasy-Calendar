@props(['calendar' => null])

<div id='clock'>
    <canvas style="z-index: 2;" id="clock_face"></canvas>
    <canvas style="z-index: 1;" id="clock_sun"></canvas>
    <canvas style="z-index: 0;" id="clock_background"></canvas>
</div>

<div x-data="{ activeDateAdjustment: 'current' }">
    <ul class="nav justify-content-center nav-tabs mt-3">
        <li class="nav-item"><a href="javascript:;" class="nav-link px-2 small" :class="{ 'active': activeDateAdjustment === 'current' }" @click="activeDateAdjustment = 'current'">Current date</a></li>
        <li class="nav-item"><a href="javascript:;" class="nav-link px-2 small" :class="{ 'active': activeDateAdjustment === 'preview' }" @click="activeDateAdjustment = 'preview'">Preview date</a></li>
        <li class="nav-item"><a href="javascript:;" class="nav-link px-2 small" :class="{ 'active': activeDateAdjustment === 'relative' }" @click="activeDateAdjustment = 'relative'">Relative math</a></li>
    </ul>

    <div class='date_control mt-3' id='date_inputs' :class="{ 'd-flex flex-column': activeDateAdjustment === 'current', 'd-none': activeDateAdjustment !== 'current' }">
        @if(isset($calendar) && $calendar?->isChild())
            <div class='mb-3 center-text hidden calendar_link_explanation'>
                <p class='m-0'>This calendar follows the date of a <a href='/calendars/{{ $calendar->parent->hash }}' target="_blank">parent calendar</a>.</p>
            </div>

            <div class="input-group">
                <select class='form-control timespan-list inclusive date' id='current_timespan'></select>
                <select class='form-control timespan-day-list inclusive date' id='current_day'></select>
                <input class='form-control year-input' id='current_year' type='number'>
            </div>

            <div class="input-group mt-2">
                <input class='form-control text-right protip' type='number' id='current_hour' data-pt-position='top' data-pt-title="The current hour of day">
                <div class="input-group-prepend input-group-append"><span class="input-group-text">:</span></div>
                <input class='form-control protip' type='number' id='current_minute' data-pt-position='top' data-pt-title="The current minute of the hour">
            </div>
        @else
            <div class='input-group protip mt-2' value='current' data-pt-position='right' data-pt-title="The current year">
                <div class='input-group-prepend'>
                    <button type='button' class='btn btn-danger sub_year' id='sub_current_year'><i class="fa fa-minus"></i></button>
                </div>
                <input class='form-control year-input' id='current_year' type='number'>
                <div class='input-group-append'>
                    <button type='button' class='btn btn-success add_year' id='add_current_year'><i class="fa fa-plus"></i></button>
                </div>
            </div>

            <div class='input-group protip mt-2' value='current' data-pt-position='right' data-pt-title="The current month in the year">
                <div class='input-group-prepend'>
                    <button type='button' class='btn btn-danger sub_timespan' id='sub_current_timespan'><i class="fa fa-minus"></i></button>
                </div>
                <select class='form-control timespan-list inclusive date' id='current_timespan'></select>
                <div class='input-group-append'>
                    <button type='button' class='btn btn-success add_timespan' id='add_current_timespan'><i class="fa fa-plus"></i></button>
                </div>
            </div>

            <div class='input-group protip mt-2' value='current' data-pt-position='right' data-pt-title="The current day in the month">
                <div class='input-group-prepend'>
                    <button type='button' class='btn btn-danger sub_day' id='sub_current_day'><i class="fa fa-minus"></i></button>
                </div>
                <select class='form-control timespan-day-list inclusive date' id='current_day'></select>
                <div class='input-group-append'>
                    <button type='button' class='btn btn-success add_day' id='add_current_day'><i class="fa fa-plus"></i></button>
                </div>
            </div>

            <div class='input-group protip mt-2'>
                <div class='input-group-prepend'>
                    <button type='button' class='btn btn-danger adjust_hour' val='-1'>1hr</button>
                    <button type='button' class='btn border-left btn-danger adjust_minute' val='-30'>30m</button>
                </div>

                <input class='form-control text-right protip' type='number' id='current_hour' data-pt-position='top' data-pt-title="The current hour of day">
                <div class="input-group-prepend input-group-append"><span class="input-group-text">:</span></div>
                <input class='form-control protip' type='number' id='current_minute' data-pt-position='top' data-pt-title="The current minute of the hour">

                <div class='input-group-append'>
                    <button type='button' class='btn small-text btn-success adjust_minute' val='30'>30m</button>
                    <button type='button' class='btn small-text border-left btn-success adjust_hour' val='1'>1h</button>
                </div>
            </div>
        @endif
    </div>


    <div class='date_control preview_date_controls mt-3' :class="{ 'd-flex flex-column': activeDateAdjustment === 'preview', 'd-none': activeDateAdjustment !== 'preview' }">
        <div class='input-group protip mt-2' value='target' data-pt-position='right' data-pt-title="The preview year">
            <div class='input-group-prepend'>
                <button type='button' class='btn btn-danger sub_year' id='sub_target_year'><i class="fa fa-minus"></i></button>
            </div>
            <input class='form-control year-input' id='target_year' type='number'>
            <div class='input-group-append'>
                <button type='button' class='btn btn-success add_year' id='add_target_year'><i class="fa fa-plus"></i></button>
            </div>
        </div>

        <div class='input-group protip mt-2' value='target' data-pt-position='right' data-pt-title="The preview month of the preview year">
            <div class='input-group-prepend'>
                <button type='button' class='btn btn-danger sub_timespan' id='sub_target_timespan'><i class="fa fa-minus"></i></button>
            </div>
            <select class='form-control timespan-list inclusive date' id='target_timespan'></select>
            <div class='input-group-append'>
                <button type='button' class='btn btn-success add_timespan' id='add_target_timespan'><i class="fa fa-plus"></i></button>
            </div>
        </div>

        <div class='input-group protip mt-2' value='target' data-pt-position='right' data-pt-title="The current day of the preview month">
            <div class='input-group-prepend'>
                <button type='button' class='btn btn-danger sub_day' id='sub_target_day'><i class="fa fa-minus"></i></button>
            </div>
            <select class='form-control timespan-day-list inclusive date' id='target_day'></select>
            <div class='input-group-append'>
                <button type='button' class='btn btn-success add_day' id='add_target_day'><i class="fa fa-plus"></i></button>
            </div>
        </div>

        <div class='btn btn-success full mt-2' id='go_to_preview_date'>Jump to preview date</div>
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
