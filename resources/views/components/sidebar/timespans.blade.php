<div>

    <script lang="js">

        function monthList($data){

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
                        timespan.num_weekdays = timespan.week.length;
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

                timespansChanged(){

                }

            }
        }

    </script>

    <div
        x-data="monthList($data)"
        @add-timespan.window="add($event.detail)"
        @remove-timespan.window="remove($event.detail.index)"
        @set-timespan-weekdays.window="setWeekdays"
    >

        <div class='row bold-text'>
            <div class="col">
                New month:
            </div>
        </div>

        <div class='add_inputs timespan row no-gutters mb-2'>

            <div class='col-md-6'>
                <input type='text' class='form-control name' x-model="newTimespan.name" placeholder='Name'>
            </div>

            <div class='col'>
                <select class='custom-select form-control' x-model="newTimespan.type">
                    <option selected value='month'>Month</option>
                    <option value='intercalary'>Intercalary</option>
                </select>
            </div>

            <div class='col-auto'>
                <button type='button' class='btn btn-primary add full' @click="add(newTimespan)"><i class="fa fa-plus"></i></button>
            </div>
        </div>

        <div class="row sortable-header timespan_sortable_header">
            <div class='col-6' style="padding-left:25%;">Name</div>
            <div class='col-6' style="padding-left:15%;">Length</div>
        </div>

        <div class="sortable list-group" @change="timespansChanged">
            <template x-for="(timespan, index) in timespans">
                <div class='sortable-container list-group-item' :class="timespan.type">

                    <div class='main-container' x-show="deleting !== timespan">
                        <div class='handle icon-reorder'></div>
                        <div class='expand' :class="expanded[index] ? 'icon-collapse' : 'icon-expand'" @click="expanded[index] = !expanded[index]"></div>
                        <div class="name-container">
                            <input class='name-input small-input form-control' x-model="timespan.name">
                        </div>
                        <div class='length_input'>
                            <input type='number' min='1' class='length-input form-control' x-model='timespan.length'/>
                        </div>
                        <div class="remove-spacer"></div>
                    </div>

                    <div class='remove-container'>
                        <div class='remove-container-text' x-show="deleting === timespan">Are you sure you want to remove this?</div>
                        <div class='btn_remove btn btn-danger icon-trash' @click="deleting = timespan" x-show="deleting !== timespan"></div>
                        <div class='btn_cancel btn btn-danger icon-remove' @click="deleting = null" x-show="deleting === timespan"></div>
                        <div class='btn_accept btn btn-success icon-ok' @click="remove(index)" x-show="deleting === timespan"></div>
                    </div>

                    <div class='container pb-2' x-show="expanded[index] && deleting === null">

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

                                    <div class='row no-gutters mb-1'>
                                        <div class='col-6 pr-1'>
                                            <input type='number' min='1' step="1" class='form-control small-input' :disabled="!timespan.week" :value="timespan.week?.length" @change="numberWeekdaysChanged($event, timespan)"/>
                                        </div>
                                        <div class='col-6 pl-1'>
                                            <button type='button' class='full btn btn-primary' :disabled="!timespan.week" @click="quickAddWeekdays(index)">Quick add</button>
                                        </div>
                                    </div>

                                    <div class='row no-gutters border'>
                                        <div class='week_list col-12 p-1'>
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