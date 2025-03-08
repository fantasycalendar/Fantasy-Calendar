@props(['calendar' => null])

<!---------------------------------------------->
<!------------------- WEEKDAYS ----------------->
<!---------------------------------------------->


<x-alert type="warning" x-show="show_custom_week_warning" x-cloak>
    <p><strong>Note:</strong> It's only possible to overflow remaining weekdays from one month to the next when a calendar's whole structure uses the same weekdays.</p>

    <p>However, this calendar either has a custom week set on one or more months, or a leap day that adds a weekday to its month.</p>
</x-alert>

@if ($calendar->isLinked())
    <div class='flex justify-between mt-[1rem]' data-pt-position="right">
        <div class='pr-1 bold-text'>
            Overflow weekdays:
        </div>

        <div>{{ Arr::get($calendar->static_data, 'year_data.overflow') ? 'Enabled' : 'Disabled' }}</div>
    </div>
@else
    <x-input-toggle class="flex justify-between" x-model="overflow_weekdays" label="Overflow weekdays:" name="overflow_weekdays" x-show="!show_custom_week_warning"></x-input-toggle>
@endif

<x-separator></x-separator>

@if ($calendar->isLinked())
    <ul class="list-group">
        @foreach (Arr::get($calendar->static_data, 'year_data.global_week') as $weekday)
            <li class="list-group-item">{{ $weekday }}</li>
        @endforeach
    </ul>
@else
    <strong> New weekday: </strong>

    <div class='input-group mb-[1rem] mt-[0.25rem]'>
        <input type='text' class='form-control' placeholder='Weekday name' x-model="new_weekday_name" @keyup.enter="addNewDay">

        <div class="input-group-append">
            <button type='button' class='btn btn-primary' @click="addNewDay"><i class="fa fa-plus"></i></button>
        </div>
    </div>

    <div class="list-group mb-[1rem]" x-ref="weekdays-sortable">
        <template x-for="(weekday, index) in weekdays" x-ref="weekdays-sortable-template" :key="index">
            <div class="list-group-item py-1 px-2 first-of-type:rounded-t draggable-source" :data-id="index">
                <div x-show="deleting !== index" class="flex items-center w-full gap-x-2">
                    <div class="handle w-[40px] grid place-items-center self-stretch flex-shrink-0 text-center cursor-move">
                        <i class="fa fa-bars text-xl hover:text-black hover:dark:text-white"></i>
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

<div class="flex flex-col" x-show='overflow_weekdays'>
    <x-separator class="mt-[1rem]"></x-separator>

    <strong>Start the first year on:</strong>

    @if ($calendar->isLinked())
        <ul class="list-group mt-[0.25rem]">
            <li class="list-group-item">
                {{ Arr::get($calendar->static_data, 'year_data.global_week')[
                    Arr::get($calendar->static_data, 'year_data.first_day') - 1
                ] }}
            </li>
        </ul>
    @else
        <select type='number'
            class='form-control protip'
            title='This sets the first weekday of the first year.'
            x-model="first_day">
            <template x-for="(weekday, index) in weekdays" :key="index">
                <option :value="index + 1" x-text="weekday" :selected="(index + 1) === first_day"></option>
            </template>
        </select>
    @endif
</div>

@if ($calendar->isLinked())
    <p class="mb-0 mt-[1.25rem]"><a @click="linked_popup();" href='#'>Why can't I edit the weekdays?</a></p>
@endif

