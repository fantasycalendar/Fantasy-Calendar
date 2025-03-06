@props(['calendar' => null])

<!---------------------------------------------->
<!------------------- WEEKDAYS ----------------->
<!---------------------------------------------->

<div class='row center-text' x-show="show_custom_week_warning" x-cloak>
    This calendar has a custom week in some months or a leap day is adding a week-day, this will disable
    overflows between months, because it makes no sense for two weeks that do not go together to
    overflow into each other. Sorry.
</div>

<div class='row protip' data-pt-position="right"
    data-pt-title='Enabling this will continue the week in the next month, and disabling overflow will restart the week so that each month starts with the first week day.'
    x-show="!show_custom_week_warning">
    <div class='col-8 pr-1 bold-text'>
        Overflow weekdays:
    </div>
    @if ($calendar->isLinked())
        {{ Arr::get($calendar->static_data, 'year_data.overflow') ? 'Enabled' : 'Disabled' }}
    @else
        <div class='col-4'>
            <label class="custom-control custom-checkbox right-text">
                <input type="checkbox" class="custom-control-input" x-model="overflow_weekdays" :disabled="show_custom_week_warning">
                <span class="custom-control-indicator"></span>
            </label>
        </div>
    @endif
</div>

<div class='row no-gutters my-2'>
    <div class='separator'></div>
</div>

@if ($calendar->isLinked())
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
            <input type='text' class='form-control' placeholder='Weekday name' x-model="new_weekday_name" @keyup.enter="addNewDay">

            <div class="input-group-append">
                <button type='button' class='btn btn-primary' @click="addNewDay"><i class="fa fa-plus"></i></button>
            </div>
        </div>
    </div>

    <div class="list-group" x-ref="weekdays-sortable">
        <template x-for="(weekday, index) in weekdays" x-ref="weekdays-sortable-template" :key="index">
            <div class="list-group-item py-1 px-2 first-of-type:rounded-t draggable-source" :data-id="index">
                <div x-show="deleting !== index" class="flex items-center w-full gap-x-2">
                    <div class="w-[40px] grid place-items-center self-stretch flex-shrink-0 text-center cursor-move">
                        <i class="handle fa fa-bars text-xl hover:text-black hover:dark:text-white"></i>
                    </div>

                    <input class="form-control" type="text" x-model="weekday">

                    <button class="btn btn-danger w-10" @click="deleting = index">
                        <i class="fa fa-trash text-lg"></i>
                    </button>
                </div>

                <div x-show="deleting === index" class="flex items-center w-full gap-x-2.5" x-cloak>
                    <button class="btn btn-success w-10 !px-0 text-center" @click="removeWeekday(index)">
                        <i class="fa fa-check text-lg"></i>
                    </button>

                    <div class="flex-grow">Are you sure?</div>

                    <button class="btn btn-danger w-10 !px-0 text-center" @click="deleting = -1">
                        <i class="fa fa-times text-lg"></i>
                    </button>
                </div>
            </div>
        </template>
    </div>

@endif

<div x-show='overflow_weekdays'>
    <div class='row no-gutters my-2'>
        <div class='separator'></div>
    </div>

    <div class='row no-gutters my-2'>
        <div class='col'>
            <p class='bold-text m-0'>First week day:</p>
            @if ($calendar->isLinked())
                <ul class="list-group">
                    <li class="list-group-item">
                        {{ Arr::get($calendar->static_data, 'year_data.global_week')[
                            Arr::get($calendar->static_data, 'year_data.first_day') - 1
                        ] }}
                    </li>
                </ul>
            @else
                <select type='number'
                    class='form-control protip'
                    data-pt-position="right"
                    data-pt-title='This sets the first weekday of the first year.'
                    x-model="first_day">
                    <template x-for="(weekday, index) in weekdays" :key="index">
                        <option :value="index + 1" x-text="weekday" :selected="console.log(weekday, index, first_day) || (index + 1) === first_day"></option>
                    </template>
                </select>
                @endif
        </div>
    </div>
</div>

@if ($calendar->isLinked())
    <p class="mb-0 mt-3"><a @click="linked_popup();" href='#'>Why can't I edit the weekdays?</a></p>
@endif
