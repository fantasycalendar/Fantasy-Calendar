@props([ "calendar" ])

@push('head')
    <script lang="js">

        function leapdaySection($data){

            return {

                newLeapday: {
                    name: "",
                    type: "leap-day"
                },

                leapdays: $data.static_data.year_data.leap_days,
                timespans: $data.static_data.year_data.timespans,
                global_week: $data.static_data.year_data.global_week,

                deleting: null,
                reordering: false,
                expanded: {},

                add({ name, type, interval, offset, timespan }={}){
                    this.leapdays.push({
                        'name': name || (`Leap Day ${this.leapdays.length+1}`),
                        'intercalary': (type || "leap-day") === "intercalary",
                        'timespan': timespan ?? 0,
                        'adds_week_day': false,
                        'day': 0,
                        'week_day': '',
                        'interval': interval || "1",
                        'offset': offset ?? 0,
                        'not_numbered': false,
                        'show_text': false
                    })
                },

                remove(index){
                    this.leapdays.splice(index, 1);
                },

                getWeekdays(leapday){
                    const weekdays = this.timespans[leapday.timespan]?.week ?? this.global_week;
                    weekdays.unshift(`Before ${weekdays[0]}`);
                    return weekdays;
                },

                getDaysInTimespan(leapday){
                    return Array.from(Array(this.timespans[leapday.timespan].length+1).keys())
                        .map(num => !num ? `Before day ${num+1}` : `Day ${num}`);
                },

                getLeapingText(leapday){

                    // TODO: take get_interval_text and refactor it
                    let html = "This leap day will appear every:";

                    html += ``

                    return html;

                }

            }

        }

    </script>
@endpush


<x-sidebar.collapsible
    class="settings-timespans step-3-step"
    name="leapdays"
    title="Leap Days"
    icon="fas fa-calendar-day"
    tooltip-title="More Info: Leap Days"
    helplink="leap_days"
>

    @if(request()->is('calendars/*/edit') && $calendar->isLinked())

        <ul class="list-group">

            @php
                $leap_days = Arr::get($calendar->static_data, 'year_data.leap_days');
            @endphp

            @foreach ($leap_days as $leap_day)
                <li class="list-group-item">
                    <div class="d-flex justify-content-between align-items-center">
                        <strong>{{ $leap_day['name'] }}</strong> <small>{{ $leap_day['intercalary'] ? "Intercalary" : "" }}</small>
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

        <div
            x-data="leapdaySection($data)"
            @add-leapday.window="add($event.detail)"
            @remove-leapday.window="remove($event.detail.index)"
        >

            <div class='row bold-text'>
                <div class="col">
                    New leap day:
                </div>
            </div>

            <div class='add_inputs leap row no-gutters'>
                <div class='col-md-6'>
                    <input type='text' class='form-control name' placeholder='Name' x-model="newLeapday.name">
                </div>

                <div class='col'>
                    <select class='custom-select form-control' x-model="newLeapday.type">
                        <option selected value='leap-day'>Normal day</option>
                        <option value='intercalary'>Intercalary</option>
                    </select>
                </div>

                <div class='col-auto'>
                    <button type='button' class='btn btn-primary add full' @click="add(newLeapday)"><i class="fa fa-plus"></i></button>
                </div>
            </div>

            <div class="row">
                <div style='font-style: italic; margin-left:3.5rem'>Name</div>
            </div>

            <div class="sortable list-group">
                <template x-for="(leapday, index) in leapdays">

                    <div class='sortable-container list-group-item collapsed collapsible' x-bind:class="leapday.intercalary ? 'intercalary' : ''">

                        <div class='main-container' x-show="deleting !== leapday">
                            <i class='handle icon-reorder' x-show="reordering"></i>
                            <i class='expand' x-show="!reordering" :class="expanded[index] ? 'icon-collapse' : 'icon-expand'" @click="expanded[index] = !expanded[index]"></i>
                            <div class="input-group">
                                <input class='name-input small-input form-control' x-model="leapday.name">
                                <div class="input-group-append">
                                    <div class='btn btn-danger icon-trash' @click="deleting = leapday" x-show="deleting !== leapday"></div>
                                </div>
                            </div>
                        </div>

                        <div class='d-flex justify-content-between align-items-center w-100 px-1'>
                            <div class='btn_cancel btn btn-danger icon-remove' @click="deleting = null" x-show="deleting === leapday"></div>
                            <div class='remove-container-text' x-show="deleting === leapday">Are you sure?</div>
                            <div class='btn_accept btn btn-success icon-ok' @click="remove(index)" x-show="deleting === leapday"></div>
                        </div>

                        <div class='container pb-2' x-show="expanded[index] && deleting !== leapday">

                            <div class='row my-2 bold-text big-text italics-text'>
                                <div class='col' x-text="leapday.intercalary ? 'Leap day' : 'Intercalary leap day'"></div>
                            </div>

                            <div class='row my-2'>
                                <div class='col'>
                                    <div class='bold-text'>Leap day settings</div>
                                </div>
                            </div>

                            <div class='date_control'>

                                <div class='row no-gutters'>
                                    <div class='col'>
                                        Add leapday to month:
                                        <select type='number' class='custom-select form-control full' x-model="leapday.timespan">
                                            <template x-for="(timespan, index) in timespans">
                                                <option :value="index" x-text="timespan.name"></option>
                                            </template>
                                        </select>
                                    </div>
                                </div>

                                <div class='row no-gutters mt-2 mb-1'>
                                    <div class='col'>
                                        <div class='separator'></div>
                                    </div>
                                </div>

                                <div class='row no-gutters my-1' x-show="leapday.intercalary">
                                    <div class='form-check col-12 py-2 border rounded protip' data-pt-position="right" data-pt-title="This setting toggles whether this intercalary leap day should continue its parent month's day count (for example, day 1, day 2, intercalary, day 3).">
                                        <input type='checkbox' :id="index + '_not_numbered'" class='form-check-input' x-model="leapday.not_numbered" />
                                        <label :for="index + '_not_numbered'" class='form-check-label ml-1'>
                                            Not numbered
                                        </label>
                                    </div>
                                </div>

                                <div class='row no-gutters my-1' x-show="leapday.intercalary">
                                    <div class='form-check col-12 py-2 border rounded protip' data-pt-position="right" data-pt-title="This setting toggles whether this intercalary leap day should show its name in the calendar.">
                                        <input type='checkbox' :id="index + '_show_text'" class='form-check-input' x-model="leapday.show_text"/>
                                        <label :for="index + '_show_text'" class='form-check-label ml-1'>
                                            Show leap day text
                                        </label>
                                    </div>
                                </div>

                                <div class='row no-gutters my-1' x-show="!leapday.intercalary">
                                    <div class='form-check col-12 py-2 border rounded'>
                                        <input type='checkbox' :id="index + '_adds_week_day'" class='form-check-input adds-week-day' x-model="leapday.adds_week_day"/>
                                        <label :for="index + '_adds_week_day'" class='form-check-label ml-1'>
                                            Adds week day
                                        </label>
                                    </div>
                                </div>

                                <div class='adds_week_day_data_container' x-show="leapday.adds_week_day && !leapday.intercalary">
                                    <div class='row no-gutters mt-2'>
                                        <div class='col'>
                                            Week day name:
                                            <input type='text' class='form-control internal-list-name dynamic_input' x-model="leapday.week_day" :disabled="!leapday.adds_week_day || leapday.intercalary"/>
                                        </div>
                                    </div>
                                </div>

                                <div class='week_day_select_container' x-show="leapday.adds_week_day && !leapday.intercalary">
                                    <div class='row no-gutters mt-2'>
                                        <div class='col'>
                                            After which weekday:
                                            <select type='number' class='custom-select form-control full' :disabled="!leapday.adds_week_day || leapday.intercalary" x-model="leapday.day">
                                                <template x-for="(weekday, index) in getWeekdays(leapday)">
                                                    <option :value="index" x-text="weekday"></option>
                                                </template>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div x-show="leapday.intercalary">
                                    <div class='row my-1'>
                                        <div class='col'>
                                            Select after which day:
                                            <select type='number' class='custom-select form-control full' x-model="leapday.day" :disabled="!leapday.intercalary">
                                                <template x-for="(day, index) in getDaysInTimespan(leapday)">
                                                    <option :value="index" x-text="day"></option>
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
                                        <input type='text' class='form-control protip' data-pt-position="top" data-pt-title='Every nth year this leap day appears. Multiple intervals can be separated by commas, like the gregorian leap day: 400,!100,4. Every 4th year, unless it is divisible by 100, but again if it is divisible by 400.' x-model="leapday.interval" />
                                    </div>
                                    <div class='col-4 pl-1 '>
                                        <input type='number' step="1" class='form-control' min='0' x-model="leapday.offset"/>
                                    </div>
                                </div>

                                <div class='row no-gutters'>
                                    <div class='col'>
                                        <div class='italics-text' x-html="getLeapingText(leapday)"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </template>
            </div>

        </div>

    @endif

</x-sidebar.collapsible>