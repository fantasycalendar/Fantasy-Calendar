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
            <div class="list-group-item p-2 first-of-type:rounded-t draggable-source" x-data="{ collapsed: true }" :data-id="index">

                <div class='flex items-center w-full gap-x-2' x-show="deleting !== index">
                    <div class='handle fa fa-bars' x-show="reordering"></div>
                    <div class='cursor-pointer text-xl fa'
                         :class="{ 'fa-caret-square-up': !collapsed, 'fa-caret-square-down': collapsed }"
                         @click="collapsed = !collapsed"
                         x-show="!reordering"
                         ></div>
                    <input type='text' class='name-input small-input form-control' x-model.lazy='leap_day.name'/>
                    <button class="btn btn-danger w-10" @click="deleting = index" x-show="!reordering">
                        <i class="fa fa-trash text-lg"></i>
                    </button>
                </div>

                <div x-show="deleting === index" class="flex items-center w-full gap-x-2.5" x-cloak>
                    <button class="btn btn-success w-10 !px-0 text-center" @click="removeLeapDay(index)">
                        <i class="fa fa-check text-lg"></i>
                    </button>

                    <div class="flex-grow">Are you sure?</div>

                    <button class="btn btn-danger w-10 !px-0 text-center" @click="deleting = -1">
                        <i class="fa fa-times text-lg"></i>
                    </button>
                </div>

                <div x-show="!collapsed && deleting === -1">
                    <div class='row my-2 bold-text big-text italics-text'>
                        <div class='col' x-text='!leap_day.intercalary ? "Leap day" : "Intercalary leap day"'></div>
                    </div>

                    <div class='date_control'>
                        <div class='row no-gutters'>
                            <div class='col'>
                                Month to add to:
                                <select type='number'
                                        class='custom-select form-control full'
                                        x-model='leap_day.timespan'>
                                    <template x-for="(timespan, timespanIndex) in timespans">
                                        <option :value="timespanIndex" :selected="timespanIndex === leap_day.timespan" x-text="timespan.name"></option>
                                    </template>
                                </select>
                            </div>
                        </div>
                        <div class='row no-gutters mt-2 mb-1'>
                            <div class='col'>
                                <div class='separator'></div>
                            </div>
                        </div>
                        <div class='row no-gutters my-1' x-show="leap_day.intercalary">
                            <div class='form-check col-12 py-2 border rounded protip' data-pt-position="right"
                                 data-pt-title="This setting toggles whether this intercalary leap day should continue its parent month's day count (for example, day 1, day 2, intercalary, day 3).">
                                <input type='checkbox' :id='`${index}_not_numbered`' class='form-check-input'
                                       x-model='leap_day.not_numbered'/>
                                <label :for='`${index}_not_numbered`' class='form-check-label ml-1'>
                                    Not numbered
                                </label>
                            </div>
                        </div>
                        <div class='row no-gutters my-1' x-show="leap_day.intercalary">
                            <div class='form-check col-12 py-2 border rounded protip' data-pt-position="right"
                                 data-pt-title="This setting toggles whether this intercalary leap day should show its name in the calendar.">
                                <input type='checkbox' :id='`${index}_show_text`' class='form-check-input'
                                       x-model='leap_day.show_text'/>
                                <label :for='`${index}_show_text`' class='form-check-label ml-1'>
                                    Show leap day text
                                </label>
                            </div>
                        </div>
                        <div class='row no-gutters my-1' x-show="!leap_day.intercalary">
                            <div class='form-check col-12 py-2 border rounded'>
                                <input type='checkbox' :id='`${index}_adds_week_day`' class='form-check-input'
                                       x-model='leap_day.adds_week_day'>
                                <label :for='`${index}_adds_week_day`' class='form-check-label ml-1'>
                                    Adds week day
                                </label>
                            </div>
                        </div>
                        <div class='adds_week_day_data_container' x-show="leap_day.adds_week_day && !leap_day.intercalary">
                            <div class='row no-gutters mt-2'>
                                <div class='col'>
                                    Week day name:
                                    <input type='text' class='form-control' x-model.lazy='leap_day.week_day'/>
                                </div>
                            </div>
                        </div>
                        <div class='week_day_select_container'
                             x-show="leap_day.adds_week_day && !leap_day.intercalary">
                            <div class='row no-gutters mt-2'>
                                <div class='col'>
                                    After which weekday:
                                    <select type='number' class='custom-select form-control' x-model.number='leap_day.day'>
                                        <option value='0' x-text="'Before ' + getLeapdayValidWeekdays(leap_day)[0]"></option>
                                        <template x-for="(weekday, dayIndex) in getLeapdayValidWeekdays(leap_day)">
                                            <option :value='dayIndex+1' :selected="dayIndex+1 === leap_day.day" x-text="weekday"></option>
                                        </template>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div x-show="leap_day.intercalary">
                            <div class='row my-1'>
                                <div class='col'>
                                    Select after which day:
                                    <select type='number' class='custom-select form-control full'
                                            x-model.number='leap_day.day'>
                                        <option value='0'>Before day 0</option>
                                        <template x-for="dayIndex in getLeapdayValidDays(leap_day)">
                                            <option :value='dayIndex' :selected="dayIndex === leap_day.day" x-text='"Day " + (dayIndex)'></option>
                                        </template>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class='row no-gutters mt-2 mb-1'>
                            <div class='col'>
                                <div class='separator'></div>
                            </div>
                        </div>
                        <div class='row no-gutters my-1'>
                            <div class='col'>
                                <div class='bold-text'>Leaping settings</div>
                            </div>
                        </div>
                        <div class='row no-gutters mt-2'>
                            <div class='col-8'>Interval:</div>
                            <div class='col-4'>Offset:</div>
                        </div>
                        <div class='row no-gutters mb-2'>
                            <div class='col-8 pr-1'>
                                <x-alpine.text-input model="leap_day.interval"
                                                     path="`leap_days.${index}.interval`"
                                                     tooltip="Every nth year this leap day appears. Multiple intervals can be separated by commas, like the gregorian leap day: 400,!100,4. Every 4th year, unless it is divisible by 100, but again if it is divisible by 400.">
                                </x-alpine.text-input>
                            </div>
                            <div class='col-4 pl-1 '>
                                <input type='number' step="1" class='form-control'
                                       :value='leap_day.offset'
                                       @change="leap_day.offset = Math.max(0, Number($event.target.value))"
                                       :disabled="leap_day.interval === '1'"/>
                            </div>
                        </div>
                        <div class='row no-gutters'>
                            <div class='col' x-show="!hasError(`leap_days.${index}.interval`)">
                                <div class='italics-text' x-text="interval_main_texts?.[index]"></div>
                                <ul class='italics-text list-disc pl-4'>
                                    <template x-for="text in interval_subtexts?.[index]">
                                        <li x-text="text"></li>
                                    </template>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
@endif
