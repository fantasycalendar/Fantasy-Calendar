@props(['calendar' => null])

<!---------------------------------------------->
<!------------------- WEEKDAYS ----------------->
<!---------------------------------------------->

<div class='wrap-collapsible card settings-weekdays step-2-step'>
    <input id="collapsible_globalweek" class="toggle" type="checkbox">
    <label for="collapsible_globalweek" class="lbl-toggle py-2 pr-3 card-header">
        <i class="mr-2 fas fa-calendar-week"></i> Weekdays
        <a target="_blank" data-pt-position="right" data-pt-title='More Info: Weekdays' href='{{ helplink("weekdays") }}'
            class="wiki protip">
            <i class="fa fa-question-circle"></i>
        </a>
    </label>

    <!-- Put collapsible-content back -->
    <div class="card-body"
        x-data="global_week"
        x-init="$nextTick(() => load(window.static_data))"
        @calendar-loaded.window="$nextTick(() => load(window.static_data))"
        @calendar-structure-changed.window="$nextTick(() => load(window.static_data))">

        <div class='row center-text' x-show="show_custom_week_warning" x-cloak>
            This calendar has a custom week in some months or a leap day is adding a week-day, this will disable
            overflows between months, because it makes no sense for two weeks that do not go together to
            overflow into each other. Sorry.
        </div>

        <div class='row protip month_overflow_container' data-pt-position="right"
            data-pt-title='Enabling this will continue the week in the next month, and disabling overflow will restart the week so that each month starts with the first week day.'>
            <div class='col-8 pr-1 bold-text'>
                Overflow weekdays:
            </div>
            @if (request()->is('calendars/*/edit') && $calendar->isLinked())
                {{ Arr::get($calendar->static_data, 'year_data.overflow') ? 'Enabled' : 'Disabled' }}
            @else
                <div class='col-4'>
                    <label class="custom-control custom-checkbox right-text">
                        <input type="checkbox" class="custom-control-input" x-model="overflow_weekdays">
                        <span class="custom-control-indicator"></span>
                    </label>
                </div>
            @endif
        </div>

        <div class='row no-gutters my-2'>
            <div class='separator'></div>
        </div>

        @if (request()->is('calendars/*/edit') && $calendar->isLinked())
            <ul class="list-group">

                @php
                    $weekdays = Arr::get($calendar->static_data, 'year_data.global_week');
                @endphp

                @foreach ($weekdays as $weekday)
                    <li class="list-group-item">{{ $weekday }}</li>
                @endforeach

            </ul>
        @else
            <div class='row no-gutters mt-2 bold-text'>
                <div class="col">
                    New weekday:
                </div>
            </div>

            <div class='row no-gutters add_inputs global_week'>
                <div class='col input-group'>
                    <input type='text' class='form-control' placeholder='Weekday name' x-model="new_weekday_name">
                    <div class="input-group-append">
                        <button type='button' class='btn btn-primary add'><i class="fa fa-plus"></i></button>
                    </div>
                </div>
            </div>

            <div class="list-group">
                <template x-for="weekday in weekdays">
                    <div class="list-group-item py-1 px-1 first-of-type:rounded-t !flex items-center">
                        <i class="fa fa-bars pl-2 pr-2.5 text-xl hover:text-black hover:dark:text-white cursor-move"></i>

                        <input class="form-control" type="text" x-model="weekday">

                        <i class="fa fa-trash pr-2 pl-2.5 text-xl text-red-600/60 dark:text-red-400/60 hover:text-red-600 hover:dark:text-red-400 cursor-pointer"></i>
                    </div>
                </template>
            </div>

        @endif

        <div id='first_week_day_container' class='hidden'>

            <div class='row no-gutters my-2'>
                <div class='separator'></div>
            </div>

            <div class='row no-gutters my-2'>
                <div class='col'>
                    <p class='bold-text m-0'>First week day:</p>
                    @if (request()->is('calendars/*/edit') && $calendar->isLinked())
                        <ul class="list-group">
                            <li class="list-group-item">
                                {{ Arr::get($calendar->static_data, 'year_data.global_week')[
                                    Arr::get($calendar->static_data, 'year_data.first_day') - 1
                                ] }}
                            </li>
                        </ul>
                    @else
                        <select type='number' class='form-control static_input protip' data-pt-position="right"
                            data-pt-title='This sets the first weekday of the first year.' id='first_day'
                            data='year_data' fc-index='first_day'></select>
                        @endif
                </div>
            </div>
        </div>
        @if (request()->is('calendars/*/edit') && $calendar->isLinked())
            <p class="mb-0 mt-3"><a onclick="linked_popup();" href='#'>Why can't I edit the weekdays?</a></p>
        @endif

    </div>

</div>
