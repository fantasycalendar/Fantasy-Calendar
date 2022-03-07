@props([ "calendar" ])

@push('head')
    <script lang="js">

        function cycleSection($data){

            return {

                cycles: $data.static_data.cycles.data,
                format: $data.static_data.cycles.format,

                expanded: {},
                deleting: null,
                reordering: false,

                add(){
                    this.cycles.push({
                        length: 1,
                        offset: 0,
                        names: [ "Name 1" ]
                    })
                    window.dispatchEvent(new CustomEvent('added-cycle', { detail: { cycle: this.cycles[this.cycles.length-1] } }));
                },

                remove(index){
                    this.cycles.splice(index, 1);
                    window.dispatchEvent(new CustomEvent('removed-cycle', { detail: { index } }));
                },

                numberCycleNamesChanged($event, cycle, index){
                    const numNames = Number($event.target.value);

                    if(numNames > cycle.names.length){
                        // Create an array
                        const newWeekdays = Array.from(Array(numNames - cycle.names.length).keys())
                            .map(num => `Name ${cycle.names.length + num + 1}`);
                        return this.setCycleNames({ index, names: cycle.names.concat(newWeekdays) });
                    }

                    return this.setCycleNames({ index, names: cycle.names.slice(0, (cycle.names.length - numNames)*-1) });
                },

                setCycleNames({ index, names }={}){
                    this.cycles[index].names = names;
                    window.dispatchEvent(new CustomEvent('updated-cycle-names', { detail: { cycle: this.cycles[index] } }));
                },

                quickAddNames(cycle){

                    swal.fire({
                        title: "Cycle Names",
                        text: "Each line entered below creates one name in this cycle.",
                        input: "textarea",
                        inputValue: cycle.names.join("\n"),
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

                        const names = result.value.split('\n').map(str => str.trim());

                        window.dispatchEvent(new CustomEvent('set-cycle-names', { detail: { index: this.cycles.indexOf(cycle), names } }));

                    })

                }

            }
        }

    </script>
@endpush


<x-sidebar.collapsible
    class="settings-cycles"
    name="cycles"
    title="Cycles"
    icon="fas fa-redo"
    tooltip-title="More Info: Cycles"
    helplink="cycles"
    checked="true"
>

    <div
        x-data="cycleSection($data)"
        @add-cycle.window="add($event.detail)"
        @remove-cycle.window="add($event.detail.index)"
        @set-cycle-names.window="setCycleNames($event.detail)"
    >

        <div class='row no-gutters bold-text'>
            Cycle format:
        </div>
        <div class="row no-gutters">
            <input type='text' class='form-control protip' x-model="format" placeholder='Cycle &lcub;&lcub;1&rcub;&rcub;' data-pt-position="right" data-pt-title="This is the template for the cycles you have. Each cycle part has a set of names which you can add to the top of the calendar. Add one with this field empty to see how this works!">
        </div>

        <div class='row no-gutters my-2'>
            <div class='separator'></div>
        </div>

        <div class='add_inputs cycle row no-gutters'>
            <input type='button' value='Add new cycle' @click="add()" class='btn btn-primary full'>
        </div>


        <div class="row sortable-header no-gutters align-items-center" x-show="cycles.length">
            <div x-show="!reordering" @click="reordering = true" class="btn btn-outline-secondary p-1 border col-1 rounded text-center cursor-pointer"><i class="fa fa-sort"></i></div>
            <div x-show="reordering" @click="reordering = false" class="btn btn-outline-secondary p-1 border col-1 rounded text-center cursor-pointer "><i class="fa fa-times"></i></div>
            <div class="col-11 pl-2">Your Cycles</div>
        </div>

        <div class="sortable list-group">
            <template x-for="(cycle, index) in cycles">

                <div class='sortable-container list-group-item cycle_inputs collapsed collapsible'>

                    <div class='main-container' x-show="deleting !== cycle">
                        <i class='handle icon-reorder' x-show="reordering"></i>
                        <i class='expand' x-show="!reordering" :class="expanded[index] ? 'icon-collapse' : 'icon-expand'" @click="expanded[index] = !expanded[index]"></i>
                        <div class="input-group">
                            <div class='name-container cycle-text flex items-center justify-center' x-text="`Cycle #${index+1} - Using \{\{${index+1}\}\}`"></div>
                            <div class="input-group-append">
                                <div class='btn btn-danger icon-trash' @click="deleting = cycle" x-show="deleting !== cycle"></div>
                            </div>
                        </div>
                    </div>

                    <div class='d-flex justify-content-between align-items-center w-100 px-1'>
                        <div class='btn_cancel btn btn-danger icon-remove' @click="deleting = null" x-show="deleting === cycle"></div>
                        <div class='remove-container-text' x-show="deleting === cycle">Are you sure?</div>
                        <div class='btn_accept btn btn-success icon-ok' @click="remove(index)" x-show="deleting === cycle"></div>
                    </div>

                    <div class='container pb-2' x-show="expanded[index] && deleting !== cycle && !reordering">

                        <div class='row no-gutters mt-2'>Cycle is based on:</div>
                        <div class='row no-gutters mb-2'>
                            <select class='form-control full dynamic_input cycle_type' x-model="cycle.type">
                                <option value='year'>Year</option>
                                <option value='era_year'>Era year</option>
                                <option value='timespan_index'>Month in year</option>
                                <option value='num_timespans'>Month count (since 1/1/1)</option>
                                <option value='day'>Day in month</option>
                                <option value='year_day'>Year day</option>
                                <option value='epoch'>Epoch (days since 1/1/1)</option>
                            </select>
                        </div>

                        <div class='row no-gutters mt-2'>
                            <div class='col-6 pr-1 pl-0'>
                                <div>Length:</div>
                            </div>

                            <div class='col-6 pr-0 pl-1'>
                                <div>Offset:</div>
                            </div>
                        </div>

                        <div class='row no-gutters mb-1 input-group'>
                            <input type='number' step="1.0" class='form-control' min='1' x-model.number='cycle.length' />
                            <input type='number' step="1.0" class='form-control' min='0' x-model.number='cycle.offset' />
                        </div>

                        <div class='row no-gutters mt-3 mb-2'>Number of names:</div>

                        <div class='row no-gutters my-2 input-group'>
                            <input type='number' step="1.0" class='form-control' :value='cycle.names.length' @input="numberCycleNamesChanged($event, cycle, index)"/>

                            <div class='col-6 input-group-append'>
                                <button type='button' class='full btn btn-primary' @click="quickAddNames(cycle)">Quick add</button>
                            </div>
                        </div>
                        <div class='row no-gutters mb-2'>
                            <div class='col-12 vertical-input-group'>
                                <template x-for="name in cycle.names">
                                    <input type='text' class='form-control internal-list-name' x-model="name"/>
                                </template>
                            </div>
                        </div>

                    </div>

                </div>
            </template>
        </div>


    </div>

</x-sidebar.collapsible>
