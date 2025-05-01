@props(['calendar' => null])

<div class='row bold-text'>
    <div class="col">
        New moon:
    </div>
</div>

<div class='add_inputs moon'>
    <div class='row no-gutters'>
        <input type='text'
               class='form-control name protip mb-1'
               data-pt-position="top"
               data-pt-title="The moon's name."
               id='moon_name_input'
               placeholder='Moon name' x-model="name">
        <div class='input-group'>

            <input type='number'
                   class='form-control cycle protip'
                   data-pt-position="top"
                   data-pt-title='How many days it takes for this moon go from Full Moon to the next Full Moon.'
                   min='1'
                   id='moon_cycle_input'
                   placeholder='Cycle' x-model="cycle">

            <input type='number'
                   class='form-control shift protip'
                   data-pt-position="top"
                   data-pt-title='This is how many days the cycle is offset by.'
                   id='moon_shift_input'
                   placeholder='Shift' x-model="shift">

            <div class='input-group-append'>
                <button type='button' class='btn btn-primary add' @click="addMoon">
                    <i class="fa fa-plus"></i>
                </button>
            </div>
        </div>
    </div>
</div>

<div class="list-group">
    <template x-for="(moon, index) in moons">
        <div class="list-group-item p-2 first-of-type:rounded-t">
            <div class='flex items-center w-full gap-x-2' x-show="deleting !== index">
                <input type='text' class='form-control' x-model.lazy="moon.name"/>
                <button class="btn btn-danger w-10" @click="deleting = index">
                    <i class="fa fa-trash text-lg"></i>
                </button>
            </div>

            <div x-show="deleting === index" class="flex items-center w-full gap-x-2.5" x-cloak>
                <button class="btn btn-success w-10 !px-0 text-center" @click="removeMoon(index)">
                    <i class="fa fa-check text-lg"></i>
                </button>

                <div class="flex-grow">Are you sure?</div>

                <button class="btn btn-danger w-10 !px-0 text-center" @click="deleting = -1">
                    <i class="fa fa-times text-lg"></i>
                </button>
            </div>

            <div x-show="deleting !== index">
                <div class='row no-gutters my-1'>
                    <div class='form-check col-12 py-2 border rounded'>
                        <input type='checkbox' :id="`${index}_custom_phase_moon`" class='form-check-input'
                               :checked="moon.custom_phase" @change="customPhaseChanged(moon)"/>
                        <label :for="`${index}_custom_phase_moon`" class='form-check-label ml-1'>
                            Custom phase count
                        </label>
                    </div>
                </div>
                <div x-show="!moon.custom_phase">
                    <div class='row no-gutters my-1'>
                        <div class='col-7'>Cycle:</div>
                        <div class='col-5'>Shift:</div>
                    </div>
                    <div class='row no-gutters mb-1'>
                        <div class='col-7 pr-1'>
                            <input type='number' min='1' step="any" class='form-control protip' data-pt-position="top"
                                   data-pt-title='How many days it takes for this moon go from Full Moon to the next Full Moon.'
                                   x-model="moon.cycle"/>
                        </div>
                        <div class='col-5 pl-1'>
                            <input type='number' step="any" class='form-control protip' data-pt-position="top"
                                   data-pt-title='This is how many days the cycle is offset by.' x-model='moon.shift'/>
                        </div>
                    </div>
                    <div class='row no-gutters mb-1'>
                        <select class='form-control protip' data-pt-position="top"
                                data-pt-title='This determines the way this moon calculates its phases, as in which way it rounds the phase value to the closest sprite.'
                                x-model='moon.cycle_rounding'>
                            <option value='floor'>Floor (0.7 becomes 0.0)</option>
                            <option value='round'>Round (< 0.49 becomes 0.0, 0.5 > becomes 1.0)</option>
                            <option value='ceil'>Ceiling (0.3 becomes 1.0)</option>
                        </select>
                    </div>
                </div>
                <div class='row no-gutters' x-show="moon.custom_phase">
                    <div class='col'>
                        <div class='my-1'>Custom phase:</div>
                        <div class='input-group my-1'>
                            <div class='input-group-prepend'>
                                <button type='button' class='btn btn-sm btn-danger' @click="shiftCustomCycle(moon, -1)">
                                    <
                                </button>
                            </div>
                            <input type='text' class='form-control form-control-sm' :value='moon.custom_cycle'
                                   @change="customCycleChanged(moon, $event)"/>
                            <div class='input-group-append'>
                                <button type='button' class='btn btn-sm btn-success' @click="shiftCustomCycle(moon, 1)">
                                    >
                                </button>
                            </div>
                        </div>
                        <div class='italics-text small-text my-1' :class="{ 'invalid': !!getCustomCycleErrorMsg(moon) }"
                             :error_msg="getCustomCycleErrorMsg(moon)" x-text="getCustomCycleMessage(moon)"></div>
                    </div>
                </div>
                <div class='row no-gutters my-2'>
                    <div class='col'>
                        <div class='separator'></div>
                    </div>
                </div>
                <div class='row no-gutters mt-1'>
                    <div class='col-6'>Moon color:</div>
                    <div class='col-6'>Shadow color:</div>
                </div>
                <div class='row no-gutters mb-1'>
                    <div class='col-6 pr-1'>
                        <input type='color' x-model.lazy='moon.color'/>
                    </div>
                    <div class='col-6 pl-1'>
                        <input type='color' x-model.lazy='moon.shadow_color'/>
                    </div>
                </div>
                <div class='row no-gutters my-1'>
                    <div class='form-check col-12 py-2 border rounded'>
                        <input type='checkbox' :id='`${index}_hidden_moon`' class='form-check-input'
                               x-model='moon.hidden'/>
                        <label :for='`${index}_hidden_moon`' class='form-check-label ml-1'>
                            Hide from guest viewers
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </template>
</div>
