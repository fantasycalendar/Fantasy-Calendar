@props(['calendar' => null])

<div class='row no-gutters bold-text'>
    Cycle format:
</div>

<input type='text'
    id='cycle_format'
    class='form-control name'
    x-model.lazy="format"
    placeholder='Cycle &lcub;&lcub;1&rcub;&rcub;'
/>

<div class='separator my-2'></div>

<input type='button' value='Add new cycle' class='btn btn-primary w-full' @click="addCycle">

<div class="sortable list-group my-2" x-ref="cycle-categories-sortable">
    <template x-for="(cycle, index) in cycles" :key="index" x-ref="cycle-categories-sortable-template">
        <x-sortable-item deleteFunction="removeCycle(index)">
            <x-slot:inputs>
                <div class="leading-loose" x-text="`Cycle ${index+1}`"></div>
            </x-slot:inputs>

            <div class='flex flex-col mb-3'>
                <div class='mt-2'>Cycle is based on:</div>
                <div class='mb-2'>
                    <select class='form-control w-full' x-model="cycle.type">
                        <option value='year'>Year</option>
                        <option value='era_year'>Era year</option>
                        <option value='timespan_index'>Month in year</option>
                        <option value='num_timespans'>Month count (since 1/1/1)</option>
                        <option value='day'>Day in month</option>
                        <option value='year_day'>Year day</option>
                        <option value='epoch'>Epoch (days since 1/1/1)</option>
                    </select>
                </div>

                <div class='flex gap-2'>
                    <div class="w-full">Length:</div>
                    <div class="w-full">Offset:</div>
                </div>
                <div class='flex gap-2'>
                    <input type='number' step="1.0" class='form-control w-full' min='1' x-model.debounce.500='cycle.length'/>
                    <input type='number' step="1.0" class='form-control w-full' min='0' x-model.debounce.500='cycle.offset'/>
                </div>

                <div class='flex mt-3'>
                    Number of names:
                </div>

                <div class='flex gap-2'>
                    <input type='number'
                        step="1.0"
                        class='form-control'
                        :value='cycle.names.length'
                        @change="setNumberOfCycleNames(cycle, $event.target.value)"/>

                    <button type='button' class='btn btn-primary shrink-0' @click="openCycleNameModal(cycle)">Quick add</button>
                </div>

                <div class='w-full max-h-[350px] overflow-y-scroll mt-2 p-2.5 border rounded'>
                    <template x-for="name in cycle.names">
                        <input type='text' class='form-control rounded-none first-of-type:rounded-t last-of-type:rounded-b mb-0.5' x-model.debounce.1000='name'/>
                    </template>
                </div>
            </div>
        </x-sortable-item>
    </template>
</div>
