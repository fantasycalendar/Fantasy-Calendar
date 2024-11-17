@props(['calendar' => null])

<div class='row no-gutters bold-text'>
    Cycle format:
</div>
<div class="row no-gutters">
    <input type='text' id='cycle_format' class='form-control name protip' x-model.lazy="format"
           placeholder='Cycle &lcub;&lcub;1&rcub;&rcub;' data-pt-position="right"
           data-pt-title="This is the template for the cycles you have. Each cycle part has a set of names which you can add to the top of the calendar. Add one with this field empty to see how this works!"
    />
</div>

<div class='row no-gutters my-2'>
    <div class='separator'></div>
</div>

<div class='add_inputs cycle row no-gutters'>
    <input type='button' value='Add new cycle' class='btn btn-primary full' @click="addCycle">
</div>

<div>
    <template x-for="(cycle, index) in cycles">
        <div class="list-group-item p-2 first-of-type:rounded-t" x-data="{ collapsed: true }">

            <div class='flex items-center w-full gap-x-2' x-show="deleting !== index">
                <div class='handle fa fa-bars'></div>
                <div class='cursor-pointer text-xl fa'
                     :class="{ 'fa-caret-square-up': !collapsed, 'fa-caret-square-down': collapsed }"
                     @click="collapsed = !collapsed"></div>
                <div class='name-container cycle-text center-text' x-text="`Cycle ${index+1}`"></div>
                <button class="btn btn-danger w-10" @click="deleting = index">
                    <i class="fa fa-trash text-lg"></i>
                </button>
            </div>

            <div x-show="deleting === index" class="flex items-center w-full gap-x-2.5" x-cloak>
                <button class="btn btn-success w-10 !px-0 text-center" @click="removeCycle(index)">
                    <i class="fa fa-check text-lg"></i>
                </button>

                <div class="flex-grow">Are you sure?</div>

                <button class="btn btn-danger w-10 !px-0 text-center" @click="deleting = -1">
                    <i class="fa fa-times text-lg"></i>
                </button>
            </div>

            <div x-show="!collapsed && deleting === -1">
                <div class='col-12 mb-3'>
                    <div class='row my-2 center-text bold-text'>Cycle settings</div>
                    <div class='row mt-2'>Cycle is based on:</div>
                    <div class='row mb-2'>
                        <select class='form-control full' x-model="cycle.type">
                            <option value='year'>Year</option>
                            <option value='era_year'>Era year</option>
                            <option value='timespan_index'>Month in year</option>
                            <option value='num_timespans'>Month count (since 1/1/1)</option>
                            <option value='day'>Day in month</option>
                            <option value='year_day'>Year day</option>
                            <option value='epoch'>Epoch (days since 1/1/1)</option>
                        </select>
                    </div>
                    <div class='row mt-2'>
                        <div class='col-6 pr-1 pl-0'>
                            <div>Length:</div>
                        </div>
                        <div class='col-6 pr-0 pl-1'>
                            <div>Offset:</div>
                        </div>
                    </div>
                    <div class='row mb-1'>
                        <div class='col-6 pr-1 pl-0'>
                            <input type='number' step="1.0" class='form-control length' min='1'
                                   x-model.lazy='cycle.length'/>
                        </div>
                        <div class='col-6 pr-0 pl-1'>
                            <input type='number' step="1.0" class='form-control offset' min='0'
                                   x-model.lazy='cycle.offset'/>
                        </div>
                    </div>
                    <div class='row mt-3 mb-2'>Number of names:</div>
                    <div class='row my-2'>
                        <div class='col-6 pl-0 pr-1'>
                            <input type='number' step="1.0" class='form-control cycle-name-length'
                                   :value='cycle.names.length'
                                   @change="setNumberOfCycleNames(cycle, $event.target.value)"/>
                        </div>
                        <div class='col-6 pl-1 pr-0'>
                            <button type='button' class='full btn btn-primary' @click="openCycleNameModal(cycle)">Quick add</button>
                        </div>
                    </div>
                    <div class='row my-2 cycle-container border'>
                        <div class='cycle_list'>
                            <template x-for="name in cycle.names">
                                <input type='text' class='form-control internal-list-name' x-model.lazy='name'/>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </template>
</div>
