@props(['calendar' => null])

@if($calendar->isLinked())
    <ul class="list-group">
        @php
            $leap_days = Arr::get($calendar->static_data, 'year_data.leap_days');
        @endphp

        @foreach ($leap_days as $leap_day)
            <li class="list-group-item">
                <div class="d-flex justify-content-between align-items-center">
                    <strong>{{ $leap_day['name'] }}</strong>
                    <small>{{ $leap_day['intercalary'] ? "Intercalary" : "" }}</small>
                </div>
                <div class='mt-2'>
                    Interval: {{ str_replace(",", ", ", $leap_day['interval']) }}
                </div>
                <div>
                    Offset: {{ $leap_day['offset'] }}
                </div>
                @if($leap_day['intercalary'])
                    <div>
                        @if($leap_day['day'] == 0)
                            Added before day 1
                        @else
                            Added after day {{ $leap_day['day'] }}
                        @endif
                    </div>
                @else
                    @if($leap_day['adds_week_day'])
                        <div>
                            Adds a weekday named: {{ $leap_day['week_day'] }}
                        </div>
                    @endif
                @endif
            </li>
        @endforeach
    </ul>

    <p class='mb-0 mt-3'><a onclick="linked_popup();" href='#'>Why can't I edit the leap days?</a></p>
@else
    <div class='input-group'>
        <input type='text' class='form-control' placeholder='New leap day' x-model="name">

        <select class='custom-select form-control' x-model="type">
            <option value=''>Normal day</option>
            <option value='intercalary'>Intercalary</option>
        </select>

        <div class='input-group-append'>
            <button type='button' class='btn btn-primary full' @click="addLeapDay">
                <i class="fa fa-plus"></i>
            </button>
        </div>
    </div>

    <div class="my-2">
        <button class="full btn btn-secondary" @click="reordering = true" x-show="!reordering && (leap_days.length > 1)">
            <i class="fa fa-arrows-alt-v"></i> Change order
        </button>
        <button class="full btn btn-secondary" @click="reordering = false" x-show="reordering">
            <i class="fa fa-check"></i> Done
        </button>
    </div>

    <div class="sortable list-group" x-ref="leap-days-sortable">
        <template x-for="(leap_day, index) in leap_days" :key="index" x-ref="leap-days-sortable-template">
            <x-sortable-item
                highlight-row-when="leap_day.intercalary"
                delete-function="removeLeapDay(index)"
                >
                <x-slot:inputs>
                    <input type='text' class='name-input small-input form-control' x-model.lazy='leap_day.name'/>
                </x-slot:inputs>

                <div x-text="'Intercalary: ' + (leap_day.intercalary ? 'Yes' : 'No')"></div>

                <div class='flex flex-col'>
                    <div class='w-full'>Add to month:</div>

                    {{-- TODO: Fix this input, if it's the problem --}}
                    <select class='custom-select form-control w-full'
                        x-model='leap_day.timespan'>
                        <template x-for="(timespan, timespanIndex) in timespans">
                            <option :value="timespanIndex" :selected="timespanIndex === leap_day.timespan" x-text="timespan.name"></option>
                        </template>
                    </select>
                </div>

                <div class='separator'></div>

                <div class='flex flex-col space-y-1'>
                    <div class='form-check py-2 border rounded' x-show="leap_day.intercalary">
                        <input type='checkbox'
                            :id='`${index}_not_numbered`'
                            class='form-check-input'
                            x-model='leap_day.not_numbered'
                        />
                        <label :for='`${index}_not_numbered`' class='form-check-label ml-1'>
                            Not numbered
                        </label>
                    </div>

                    <div class='form-check py-2 border rounded' x-show="leap_day.intercalary">
                        <input type='checkbox'
                            :id='`${index}_show_text`'
                            class='form-check-input'
                            x-model='leap_day.show_text'
                        />
                        <label :for='`${index}_show_text`' class='form-check-label ml-1'>
                            Show leap day text
                        </label>
                    </div>

                    <div class='form-check py-2 border rounded' x-show="!leap_day.intercalary">
                        <input type='checkbox'
                            :id='`${index}_adds_week_day`'
                            class='form-check-input'
                            x-model='leap_day.adds_week_day'
                        />
                        <label :for='`${index}_adds_week_day`' class='form-check-label ml-1'>
                            Adds week day
                        </label>
                    </div>
                </div>

                <div class='flex flex-col space-y-2' x-show="leap_day.adds_week_day && !leap_day.intercalary">
                    <div class='flex flex-col'>
                        <div>Week day name:</div>

                        <input type='text' class='form-control' x-model.lazy='leap_day.week_day'/>
                    </div>

                    <div class='flex flex-col'>
                        <div>After which weekday:</div>

                        <select type='number' class='custom-select form-control' x-model.number='leap_day.day'>
                            <option value='0' x-text="'Before ' + getLeapdayValidWeekdays(leap_day)[0]"></option>
                            <template x-for="(weekday, dayIndex) in getLeapdayValidWeekdays(leap_day)">
                                <option :value='dayIndex+1' :selected="dayIndex+1 === leap_day.day" x-text="weekday"></option>
                            </template>
                        </select>
                    </div>
                </div>

                <div class='flex flex-col' x-show="leap_day.intercalary">
                    <div>Appears after:</div>

                    <select type='number' class='custom-select form-control full'
                        x-model.number='leap_day.day'>
                        <option value='0'>Before day 0</option>
                        <template x-for="dayIndex in getLeapdayValidDays(leap_day)">
                            <option :value='dayIndex' :selected="dayIndex === leap_day.day" x-text='"Day " + (dayIndex)'></option>
                        </template>
                    </select>
                </div>

                <div class='separator'></div>

                <div class='flex flex-col'>
                    <div class='grid grid-cols-12'>
                        <div class='col-span-8'>Leap interval:</div>
                        <div class='col-span-4'>Leap offset:</div>
                    </div>

                    <div class='grid grid-cols-12'>
                        <x-alpine.text-input
                            x-model.lazy="leap_day.interval"
                            wrapper-class="col-span-8"
                            class="rounded-r-none"
                            path="`leap_days.${index}.interval`"
                            tooltip="Every nth year this leap day appears. Multiple intervals can be separated by commas, like the gregorian leap day: 400,!100,4. Every 4th year, unless it is divisible by 100, but again if it is divisible by 400.">
                        </x-alpine.text-input>

                        <x-alpine.text-input
                            class="rounded-l-none border-l-0"
                            wrapper-class="col-span-4"
                            type='number'
                            step="1"
                            ::value='leap_day.offset'
                            @change="leap_day.offset = Math.max(0, Number($event.target.value))"
                            ::disabled="leap_day.interval === '1'">
                        </x-alpine.text-input>
                    </div>
                </div>

                <div class='flex flex-col' x-show="!hasError(`leap_days.${index}.interval`)">
                    <div class='italics-text' x-text="interval_main_texts?.[index]"></div>

                    <ul class='italics-text list-disc pl-4'>
                        <template x-for="text in interval_subtexts?.[index]">
                            <li x-text="text"></li>
                        </template>
                    </ul>
                </div>
            </x-sortable-item>
        </template>
    </div>
@endif
