<div>

    <script lang="js">

        function monthList(){
            return {
                'timespans': {!! $attributes->get('months') !!},

                init(){
                    for(let timespan of this.timespans){
                        timespan.offset = timespan.interval === 1 ? 0 : timespan.offset;
                    }
                },

                remove_timespan(index){
                    this.timespans.splice(index, 1);
                },

                toggle_timespan_week(timespan){

                    if(timespan.week){
                        delete timespan.week;
                    }else{
                        timespan.week = clone(static_data.year_data.global_week);
                        timespan.num_weekdays = timespan.week.length;
                    }
                },

                custom_weekday_length_changed(timespan){
                    if(!timespan.week) return;
                    if(timespan.num_weekdays > timespan.week.length){
                        const newWeekdays = Array.from(Array(timespan.num_weekdays - timespan.week.length).keys()).map(num => `Weekday ${timespan.week.length + num + 1}`);
                        timespan.week = timespan.week.concat(newWeekdays);
                    }else{
                        timespan.week = timespan.week.slice(0, (timespan.week.length - timespan.num_weekdays)*-1);
                    }
                },

                custom_weekday_changed($event){
                    this.timespans[$event.detail.timespanIndex].week = $event.detail.newWeekdays;
                },

                quick_weekday_add(timespanIndex){

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
                        }

                        const newWeekdays = result.value.split('\n').map(str => str.trim());

                        window.dispatchEvent(new CustomEvent('month-list-custom-weekdays-changed', { detail: { timespanIndex, newWeekdays } }));

                    })
                }

            }
        }

    </script>

    <div x-data="monthList()" x-init="init()" @month-list-custom-weekdays-changed.window="custom_weekday_changed">
        <div class="sortable list-group">
            <template x-for="(timespan, index) in timespans">
                <div class='sortable-container list-group-item' :class="timespan.type">

                    <div class='main-container' x-show="!timespan.deleting">
                        <div class='handle icon-reorder'></div>
                        <div class='expand' :class="timespan.show ? 'icon-collapse' : 'icon-expand'" @click="timespan.show = !timespan.show"></div>
                        <div class="name-container">
                            <input class='name-input small-input form-control' x-model="timespan.name">
                        </div>
                        <div class='length_input'>
                            <input type='number' min='1' class='length-input form-control' x-model='timespan.length'/>
                        </div>
                        <div class="remove-spacer"></div>
                    </div>

                    <div class='remove-container'>
                        <div class='remove-container-text' x-show="timespan.deleting">Are you sure you want to remove this?</div>
                        <div class='btn_remove btn btn-danger icon-trash' @click="timespan.deleting = true" x-show="!timespan.deleting"></div>
                        <div class='btn_cancel btn btn-danger icon-remove' @click="timespan.deleting = false" x-show="timespan.deleting"></div>
                        <div class='btn_accept btn btn-success icon-ok' @click="remove_timespan(index)" x-show="timespan.deleting"></div>
                    </div>

                    <div class='container pb-2' x-show="timespan.show && !timespan.deleting">

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
                                <input type='number' step="1" min='0' class='form-control small-input' x-model='timespan.offset' :disabled="timespan.interval === 1"/>
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
                                        <input type='checkbox' class='form-check-input' :checked="timespan.week" @click="toggle_timespan_week(timespan)"/>
                                        <label for='${key}_custom_week' class='form-check-label ml-1'>
                                            Use custom week
                                        </label>
                                    </div>
                                </div>

                                <div x-show="timespan.week">

                                    <div class='row no-gutters my-1'>
                                        <div class='col-12'>
                                            Length:
                                        </div>
                                    </div>

                                    <div class='row no-gutters mb-1'>
                                        <div class='col-6 pr-1'>
                                            <input type='number' min='1' step="1" class='form-control small-input' :disabled="!timespan.week" x-model="timespan.num_weekdays" @change="custom_weekday_length_changed(timespan)"/>
                                        </div>
                                        <div class='col-6 pl-1'>
                                            <button type='button' class='full btn btn-primary' :disabled="!timespan.week" @click="quick_weekday_add(index)">Quick add</button>
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