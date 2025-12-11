@props(['calendar' => null])

<strong>New moon:</strong>

<div class='flex flex-col'>
    <input type='text'
        class='form-control name mb-1'
        placeholder='Moon name' x-model="name">

    <div class='input-group'>
        <input type='number'
            class='form-control'
            min='1'
            placeholder='Cycle'
            x-model="cycle" />

        <input type='number'
            class='form-control'
            placeholder='Shift'
            x-model="shift" />

        <div class='input-group-append'>
            <button type='button' class='btn btn-primary' @click="addMoon">
                <i class="fa fa-plus"></i>
            </button>
        </div>
    </div>
</div>

<div class="list-group mt-2">
    <template x-for="(moon, index) in moons">
        <div class="list-group-item p-2 first-of-type:rounded-t">
            <div class='flex items-center w-full gap-x-2' x-show="deleting !== index">
                <input type='text' class='form-control' x-model.lazy="moon.name"/>

                <div class="cursor-pointer w-6 text-center">
                    <i class="fa fa-trash text-lg hover:text-red-400 hover:dark:text-red-600" @click="deleting = index"></i>
                </div>
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

            <div x-show="deleting !== index" class="flex flex-col px-2.5 py-2.5 space-y-3">
                <div>
                    <x-alpine.check-input id="`${index}_custom_phase_moon`"
                        ::checked="moon.custom_phase"
                        @change="customPhaseChanged(moon)"
                    >
                        Custom phase count
                    </x-alpine.check-input>
                </div>

                <div class="grid grid-cols-7" x-show="!moon.custom_phase">
                    <div class="flex flex-col col-span-4">
                        <div>Cycle:</div>
                    </div>

                    <div class="flex flex-col col-span-3">
                        <div>Shift:</div>
                    </div>

                    <div class="input-group col-span-7">
                        <input type='number' min='1' class='form-control' x-model.debounce.500.number="moon.cycle"/>
                        <input type='number' class='form-control' x-model.debounce.500.number='moon.shift'/>
                    </div>

                    <div class='flex flex-col mt-1 col-span-7'>
                        Sprite rounding:
                        <select class='form-control' x-model.debounce.500='moon.cycle_rounding'>
                            <option value='floor'>Always round down</option>
                            <option value='round'>Round nearest</option>
                            <option value='ceil'>Always round up</option>
                        </select>
                    </div>
                </div>

                <div class='flex flex-col' x-show="moon.custom_phase">
                    <div>Custom phase:</div>

                    <div class='input-group'
                         x-data="moon_custom_cycle_input" x-modelable="custom_cycle" x-model="moon.custom_cycle">
                        <div class='input-group-prepend'>
                            <button type='button' class='btn btn-sm btn-secondary' @click="shiftCustomCycle(-1)">
                                <i class="fa fa-angle-double-left"></i>
                            </button>
                        </div>

                        <input type='text' class='form-control form-control-sm' x-model='_custom_cycle'/>

                        <div class='input-group-append'>
                            <button type='button' class='btn btn-sm btn-secondary' @click="shiftCustomCycle(1)">
                                <i class="fa fa-angle-double-right"></i>
                            </button>
                        </div>
                    </div>

                    <div class='italics-text small-text my-1'
                        :class="{ 'invalid': !!getCustomCycleErrorMsg(moon) }"
                        :error_msg="getCustomCycleErrorMsg(moon)"
                        x-text="getCustomCycleMessage(moon)">
                    </div>
                </div>

                <div class='separator'></div>

                <div class='grid grid-cols-2 gap-x-2'>
                    <div>Moon color:</div>
                    <div>Shadow color:</div>

                    <input type='color' class="w-full rounded-sm bg-transparent h-[32px]" x-model.debounce.500='moon.color'/>
                    <input type='color' class="w-full rounded-sm bg-transparent h-[32px]" x-model.debounce.500='moon.shadow_color'/>
                </div>

                <div>
                    <x-alpine.check-input id="`${index}_hidden_moon`" x-model='moon.hidden'>
                        Hide from guest viewers
                    </x-alpine.check-input>
                </div>
            </div>
        </div>
    </template>
</div>
