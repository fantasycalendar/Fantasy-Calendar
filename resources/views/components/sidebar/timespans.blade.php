@props([ "calendar" ])

@push('head')
    <script lang="js">

        function monthSection($data){

            return {

                newTimespan: {
                    name: "",
                    type: "month"
                },

                timespans: $data.static_data.year_data.timespans,
                global_week: $data.static_data.year_data.global_week,
                deleting: null,
                expanded: {},

                add({ name, type, length = false, interval = 1, offset = 0 }={}){
                    this.timespans.push({
                        'name': name || (`Month ${this.timespans.length}`),
                        'type': type,
                        'length': length || this.timespans?.[this.timespans.length-1]?.length || this.global_week.length,
                        'interval': interval,
                        'offset': offset
                    })
                },

                remove(index){
                    this.timespans.splice(index, 1);
                },

                toggleWeek(timespan){
                    if(timespan.week){
                        delete timespan.week;
                    }else{
                        timespan.week = clone(this.global_week);
                        $data.static_data.year_data.overflow = false;
                    }
                },

                numberWeekdaysChanged($event, timespan){
                    const numWeekdays = Number($event.target.value);

                    if(!timespan.week) return;

                    if(numWeekdays > timespan.week.length){
                        // Create an array
                        const newWeekdays = Array.from(Array(numWeekdays - timespan.week.length).keys())
                            .map(num => `Weekday ${timespan.week.length + num + 1}`);
                        timespan.week = timespan.week.concat(newWeekdays);
                    }else{
                        timespan.week = timespan.week.slice(0, (timespan.week.length - numWeekdays)*-1);
                    }
                },

                setWeekdays($event){
                    this.timespans[$event.detail.timespanIndex].week = $event.detail.newWeekdays;
                },

                quickAddWeekdays(timespanIndex){

                    swal.fire({
                        title: "Weekday Names",
                        text: "Each line entered below creates one week day in this month.",
                        input: "textarea",
                        inputValue: this.timespans[timespanIndex].week.join("\n"),
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Okay",
                        icon: "info"
                    }).then((result) => {

                        if(result.dismiss) return;

                        if(result.value === ""){
                            swal.fire({
                                title: "Error",
                                text: "You didn't enter any values!",
                                icon: "warning"
                            });
                            return;
                        }

                        const newWeekdays = result.value.split('\n').map(str => str.trim());

                        window.dispatchEvent(new CustomEvent('set-timespan-weekdays', { detail: { timespanIndex, newWeekdays } }));

                    })
                },

                getLeapingText(timespan){
                    if(timespan.interval.toString() === "1") return false;
                    const timespan_interval = IntervalsCollection.make(timespan);
                    return `This month appears every ${ordinal_suffix_of(timespan.interval)} year, which adds on average ${timespan_interval.totalFraction * timespan.length} days per year.`
                }
            }
        }

    </script>

@endpush

<x-sidebar.collapsible
    class="settings-timespans step-3-step"
    name="timespans"
    title="Months"
    icon="fas fa-calendar-alt"
    tooltip-title="More Info: Months & Intercalaries"
    helplink="months"
>

    @if(request()->is('calendars/*/edit') && $calendar->isLinked())

        <ul class="list-group">

            @foreach (Arr::get($calendar->static_data, 'year_data.timespans') as $timespan)
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

        <div
            x-data="monthSection($data)"
            @add-timespan.window="add($event.detail)"
            @remove-timespan.window="remove($event.detail.index)"
            @set-timespan-weekdays.window="setWeekdays"
        >

            <div class='row bold-text'>
                <div class="col">
                    New month:
                </div>
            </div>

            <div class='add_inputs timespan row no-gutters mb-2 input-group'>
                <input type='text' class='form-control name' x-model="newTimespan.name" placeholder='Name'>

                <select class='custom-select form-control' x-model="newTimespan.type">
                    <option selected value='month'>Month</option>
                    <option value='intercalary'>Intercalary</option>
                </select>

                <div class='col-auto input-group-append'>
                    <button type='button' class='btn btn-primary add full' @click="add(newTimespan)"><i class="fa fa-plus"></i></button>
                </div>
            </div>

            <div x-data="sortableList($data.static_data.year_data.timespans, 'timespans-sortable', 'calendar-structure-changed')">

                <div class="row sortable-header timespan_sortable_header no-gutters align-items-center">
                    <div x-show="!reordering" @click="reordering = true; deleting = null;" class="btn btn-outline-secondary p-1 border col-1 rounded text-center cursor-pointer"><i class="fa fa-sort"></i></div>
                    <div x-show="reordering" @click="reordering = false;" class="btn btn-outline-secondary p-1 border col-1 rounded text-center cursor-pointer "><i class="fa fa-times"></i></div>
                    <div class='py-2 col-6 text-center'>Name</div>
                    <div class='py-2 col-5 text-center'>Length</div>
                </div>

                <div class="sortable list-group border-t border-gray-600" x-ref="timespans-sortable">
                    <template x-for="(timespan, index) in timespans" x-ref="timespans-sortable-template">
                        <div class='sortable-container border-t -mt-px list-group-item draggable-source' :class="timespan.type" :data-id="index">

                            <div class='main-container' x-show="deleting !== index">
                                <i class='handle icon-reorder' x-show="reordering"></i>
                                <i class='expand' x-show="!reordering" :class="expanded[index] ? 'icon-collapse' : 'icon-expand'" @click="expanded[index] = !expanded[index]"></i>
                                <div class="input-group">
                                    <input :disabled="reordering" class='name-input small-input form-control' x-model="timespan.name" @change="$dispatch('timespan-name-changed')"/>
                                    <input :disabled="reordering" type='number' min='1' class='length-input form-control' x-model='timespan.length' style="max-width: 50px;" />
                                    <div class="input-group-append">
                                        <button type="button" :disabled="reordering" class='btn btn-danger icon-trash' @click.prevent="deleting = timespan" x-show="deleting !== timespan"></button>
                                    </div>
                                </div>
                            </div>

                            <div class='d-flex justify-content-between align-items-center w-100 px-1'>
                                <div class='btn_cancel btn btn-danger icon-remove' @click="deleting = null" x-show="deleting === index"></div>
                                <div class='remove-container-text' x-show="deleting === index">Are you sure?</div>
                                <div class='btn_accept btn btn-success icon-ok' @click="remove(index)" x-show="deleting === index"></div>
                            </div>

                            <div class='container pb-2' x-show="expanded[index] && deleting !== index && !reordering">

                                <div class='row no-gutters bold-text big-text italics-text'>
                                    <div class='col-12' x-text='timespan.type === "month" ? "Month" : "Intercalary month"'></div>
                                </div>

                                <div class='row no-gutters my-1 bold-text'><div class='col-12'>Leaping settings</div></div>

                                <div class='row no-gutters mt-1'>
                                    <div class='col-6 pr-1'>
                                        <div>Interval:</div>
                                    </div>

                                    <div class='col-6 pl-1'>
                                        <div>Offset:</div>
                                    </div>
                                </div>

                                <div class='row no-gutters mb-1'>
                                    <div class='col-6 pr-1'>
                                        <input type='number' step="1" min='1' class='form-control small-input' x-model='timespan.interval'/>
                                    </div>

                                    <div class='col-6 pl-1'>
                                        <input type='number' step="1" min='0' class='form-control small-input' x-model='timespan.offset'/>
                                    </div>
                                </div>

                                <div class='row no-gutters mb-1' x-show="getLeapingText(timespan)" x-text="getLeapingText(timespan)"></div>

                                <template x-if="timespan.type === 'month'">

                                    <div>

                                        <div class='row no-gutters my-1'>
                                            <div class='col-12'><div class='separator'></div></div>
                                        </div>

                                        <div class='row no-gutters my-1'>
                                            <div class='col-12 bold-text'>Week settings</div>
                                        </div>

                                        <div class='row no-gutters my-1'>
                                            <div class='form-check col-12 py-2 border rounded'>
                                                <input type='checkbox' class='form-check-input' :checked="timespan.week?.length > 0" @click="toggleWeek(timespan)"/>
                                                <label for='${key}_custom_week' class='form-check-label ml-1'>
                                                    Use custom week
                                                </label>
                                            </div>
                                        </div>

                                        <div x-show="timespan.week?.length">

                                            <div class='row no-gutters my-1'>
                                                <div class='col-12'>
                                                    Length:
                                                </div>
                                            </div>

                                            <div class='row no-gutters mb-2'>
                                                <div class='col-6 pr-1'>
                                                    <input type='number' min='1' step="1" class='form-control small-input' :disabled="!timespan.week" :value="timespan.week?.length" @change="numberWeekdaysChanged($event, timespan)"/>
                                                </div>
                                                <div class='col-6 pl-1'>
                                                    <button type='button' class='full btn btn-primary' :disabled="!timespan.week" @click="quickAddWeekdays(index)">Quick add</button>
                                                </div>
                                            </div>

                                            <div class='row no-gutters mb-2'>
                                                <div class='col-12 vertical-input-group'>
                                                    <template x-for="weekday in (timespan.week ?? [])">
                                                        <input type='text' class='form-control internal-list-name' x-model="weekday"/>
                                                    </template>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </div>

                        </div>
                    </template>
                </div>
            </div>
        </div>

    @endif

</x-sidebar.collapsible>
