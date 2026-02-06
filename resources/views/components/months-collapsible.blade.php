@props(['calendar' => null])

@if(isset($calendar) && $calendar->isLinked())

    <ul class="list-group">

        @php
            $timespans = Arr::get($calendar->static_data, 'year_data.timespans');
        @endphp

        @foreach ($timespans as $timespan)
            <li class="list-group-item">
                <div class="d-flex justify-content-between align-items-center">
                    <strong>{{ $timespan['name'] }}</strong>
                </div>
                @if($timespan['interval'] > 1)
                    <div class="d-flex justify-content-start align-items-center mt-2">
                        <div class='mr-4'>
                            Interval: {{ $timespan['interval'] }}
                        </div>
                        <div>
                            Offset: {{ $timespan['offset'] }}
                        </div>
                    </div>
                @endif
                @if(Arr::get($timespan, 'week'))
                    <div class="mt-2">
                        Custom week:
                        <ul>
                            @foreach ($timespan['week'] as $weekday)
                                <li style="list-style-type: circle; font-size:0.8rem;">{{ $weekday }}</li>
                            @endforeach
                        </ul>
                    </div>
                @endif
            </li>
        @endforeach

    </ul>

    <p class="mb-0 mt-3"><a onclick="linked_popup();" href='#'>Why can't I edit the months?</a></p>

@else

    <div class='timespan flex input-group'>

        <input type='text' class='form-control' placeholder='New month' x-model="name">

        <select class='custom-select form-control' x-model="type">
            <option value='month'>Month</option>
            <option value='intercalary'>Intercalary</option>
        </select>

        <div class="input-group-append">
            <button type='button' class='btn btn-primary add w-full' @click="addMonth"><i class="fa fa-plus"></i></button>
        </div>
    </div>

    <div class="flex my-2" x-show="months.length > 1">
        <button class="w-full btn btn-secondary" @click="reordering = true" x-show="!reordering">
            <i class="fa fa-arrows-alt-v"></i> Change order
        </button>
        <button class="w-full btn btn-secondary" @click="reordering = false" x-show="reordering">
            <i class="fa fa-check"></i> Done
        </button>
    </div>
    <div class="flex justify-between sortable-header timespan_sortable_header" x-show="months.length">
        <div class='pl-[36px]'>Name</div>
        <div class='pr-[40px]'>Length</div>
    </div>

    <div class="list-group mb-[1rem]" x-ref="months-sortable">
        <template x-for="(month, index) in months" :key="index" x-ref="months-sortable-template">

            <x-sortable-item
                highlight-row-when="month.type == 'intercalary'"
                delete-function="removeMonth(index)"
                >
                <x-slot:inputs>
                    <input x-model.debounce.1000="month.name" type='text' class='flex-grow-1 w-auto form-control pr-0' placeholder='Month name'/>
                    <input x-model.debounce.500.number="month.length" type='number' min='1' class='flex-shrink-1 form-control'/>
                </x-slot:inputs>

                <div x-text="'Intercalary: ' + (month.type === 'month' ? 'No' : 'Yes')"></div>

                <div class='flex flex-col'>
                    <div class="grid grid-cols-2">
                        <div>Leap interval:</div>
                        <div>Leap offset:</div>
                    </div>

                    <div class='input-group w-full'>
                        <input type='number' step="1" min='1' class='form-control small-input'
                        x-model.debounce.500.number="month.interval"/>
                        <input type='number' step="1" min='0' class='form-control small-input'
                        x-model.debounce.500.number="month.offset" :disabled="month.interval === 1"/>
                    </div>

                </div>

                <div class='flex'>
                    <div class='col-12 italic' x-text="getMonthIntervalText(month)"></div>
                </div>

                <div x-show="type === 'month'">
                    <div class='flex my-1'>
                        <div class='separator'></div>
                    </div>

                    <div class='flex my-1'>
                        <div class='form-check w-full py-2 border rounded'>
                            <input type='checkbox' :id='index + "_custom_week"'
                            class='form-check-input'
                            @click="toggleCustomWeek(month)"
                            :checked="month.week?.length"
                            />
                            <label :for='index + "_custom_week"' class='form-check-label ml-1'>
                                Use custom week
                            </label>
                        </div>
                    </div>

                    <template x-if="month.week?.length">
                        <div class='custom-week-container'>

                            <div class='flex my-1'>
                                Custom week length:
                            </div>

                            <div class='flex mb-1'>
                                <div class='input-group'>
                                    <input type='number' min='1' step="1"
                                    class='form-control small-input'
                                    @change="customWeekLengthChanged($event, month)"
                                    :disabled="!month.week?.length"
                                    :value='(month.week?.length ?? 0)'/>
                                    <div class="input-group-append">
                                        <button type='button' class='w-full btn btn-primary'
                                            @click="quickAddCustomWeekdays(month)"
                                            :disabled="!month.week?.length">Quick add
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div class='flex border'>
                                <div class='week_list w-full p-1'>
                                    <template x-for='(day, index) in (month.week ?? [])' :key='index'>
                                        <input x-model.debounce.500='month.week[index]' type='text'
                                        class='form-control'/>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </x-sortable-item>
        </template>
    </div>

@endif

