@props(['calendar' => null])

<strong>Season type:</strong>

<div class='border rounded mb-2 grid py-2 px-2 sm:grid-cols-12'>
    <div class='sm:col-span-5 text-center'>
        Date Based
    </div>

    <div class='sm:col-span-2 text-center'>
        <label class="custom-control custom-checkbox flexible">
            <input type="checkbox" class="custom-control-input" :checked="settings.periodic_seasons" @click.prevent="switchPeriodicSeason">
            <span class="custom-control-indicator"></span>
        </label>
    </div>

    <div class='sm:col-span-5 text-center'>
        Length Based
    </div>
</div>

<div>
    <x-alpine.check-input
        wrapper-class="mb-4"
        id="'season_color_enabled'"
        x-model="settings.color_enabled"
        @change="$nextTick(() => seasonColorChanged())">
        Enable season day color
    </x-alpine.check-input>
</div>

<div class="separator"></div>

<div class='mt-3.5'>
    <strong>New season:</strong>

    <div class='input-group'>
        <input type='text' class='form-control' placeholder='Season name' x-model="season_name" @keyup.enter="addSeason">

        <div class="input-group-append">
            <button type='button' class='btn btn-primary' @click="addSeason"><i class="fa fa-plus"></i></button>
        </div>
    </div>
</div>

<div class="flex my-2" x-show="settings.periodic_seasons">
    <button class="w-full btn btn-secondary" @click="reordering = true; expandedSeasons = []; deleting = -1;" x-show="!reordering">
        <i class="fa fa-arrows-alt-v"></i> Change order
    </button>
    <button class="w-full btn btn-secondary" @click="reordering = false" x-show="reordering">
        <i class="fa fa-check"></i> Done
    </button>
</div>

<div class='sortable list-group my-2' x-ref="seasons-sortable">
    <template x-for="(season, index) in seasons" x-ref="seasons-sortable-template" :key="index">
        <x-sortable-item deleteFunction="removeSeason(index)">
            <x-slot:inputs>
                <input type='text' class='name-input small-input form-control' x-model.lazy='season.name'></input>
            </x-slot:inputs>

            <div class='flex flex-col' x-show="seasons.length === 4 || seasons.length === 2">
                <div>Type:</div>

                <select class='form-control preset-season-list' @change='ensureMutualTypeExclusivity($event.target.value, index)'>
                    <option value="winter" :selected="season.type === 'winter'">Winter</option>
                    <option value="spring" :selected="season.type === 'spring'" :disabled="seasons.length < 4">Spring</option>
                    <option value="summer" :selected="season.type === 'summer'">Summer</option>
                    <option value="autumn" :selected="season.type === 'autumn'" :disabled="seasons.length < 4">Autumn</option>
                </select>
            </div>

            <div class='grid sm:gap-2 sm:grid-cols-2' x-show="settings.periodic_seasons">
                <div>
                    Duration:
                    <input type='number'
                        step='any'
                        class='form-control'
                        x-model.debounce.500='season.transition_length'
                        min='1' />
                </div>
                <div>
                    Peak duration:
                    <input type='number'
                        step='any'
                        class='form-control'
                        x-model.debounce.500='season.duration'
                        min='0' />
                </div>
            </div>

            <div class="grid grid-cols-3" x-show="!settings.periodic_seasons">
                <div class="col-span-2">Month:</div>
                <div class='col-span-1'>Day:</div>
            </div>

            <div class="input-group !grid grid-cols-3" x-show="!settings.periodic_seasons">
                <select class='form-control col-span-2 !w-full' x-model.number='season.timespan'>
                    <template x-for="(month, month_index) in months" :key="month_index">
                        <option :value="month_index" :selected="month_index === season.timespan" x-text="month.name"></option>
                    </template>
                </select>

                <select class='form-control col-span-1 !w-full' x-model.number='season.day'>
                    <template x-for="(day, day_index) in _.range(1, months[season.timespan ?? 0].length + 1)" :key="day_index">
                        <option :value="day"  :selected="day === season.day" x-text="day"></option>
                    </template>
                </select>
            </div>

            <template x-if="settings.color_enabled && season.color?.length == 2">
                <div class='grid grid-cols-2 gap-x-2'>
                    <div>Start color:</div>
                    <div>End color:</div>

                    <input type='color' class="w-full" :value="season.color[0]" @change="season.color[0] = $event.target.value;"/>
                    <input type='color' class="w-full" :value='season.color[1]' @change="season.color[1] = $event.target.value;"/>
                </div>
            </template>

            <div class='flex flex-col space-y-2' x-show="clock.enabled">
                <div class='grid grid-cols-2'>
                    <div>Sunrise hour</div>
                    <div>Sunrise minute</div>

                    <div class="!grid grid-cols-2 col-span-2 input-group">
                        <input type='number' step="1.0" class='form-control !w-full' x-model.debounce.500='season.time.sunrise.hour'/>
                        <input type='number' step="1.0" class='form-control !w-full' x-model.debounce.500='season.time.sunrise.minute'/>
                    </div>
                </div>

                <div class='grid grid-cols-2'>
                    <div>Sunset hour</div>
                    <div>Sunset minute</div>

                    <div class="!grid grid-cols-2 input-group col-span-2">
                        <input type='number' step="1.0" class='form-control !w-full' x-model.debounce.500='season.time.sunset.hour'/>
                        <input type='number' step="1.0" class='form-control !w-full' x-model.debounce.500='season.time.sunset.minute'/>
                    </div>
                </div>

                <button type="button" class="btn btn-sm btn-info" @click="interpolateSeasonTimes(index)">
                    Interpolate sunrise & sunset from surrounding seasons
                </button>
            </div>
        </x-sortable-item>
    </template>
</div>

<div class='my-1 text-xs flex flex-col space-y-2' x-show="settings.periodic_seasons && seasons.length">
    <div>
        <i class="mr-1 fas"
            :class="{
                'fa-check-circle text-green-400 dark:text-green-500': show_equal_season_length,
                'fa-exclamation-circle text-orange-400 dark:text-orange-500': !show_equal_season_length
            }"
            style="line-height:1.5;"></i>
        <span x-text="season_length_text"></span>
    </div>
    <div class='flex pl-6' x-text="season_subtext"></div>
</div>

<div class='my-1 text-xs flex'
    :class="{ 'warning': show_location_season_warning }"
     x-show="show_location_season_warning">
    <i class="mr-1 fas fa-exclamation-circle" style="line-height:1.5;"></i>
    <span>
        You are currently using a custom location with custom season sunrise and sunset times. Solstices and
        equinoxes may behave unexpectedly.
    </span>
</div>

<div class="my-1" x-show="settings.periodic_seasons">
    <div>Season offset (days):</div>
    <input class='form-control' type='number' x-model.debounce.500="settings.season_offset"/>
</div>

<button type='button' class='btn btn-secondary w-full mt-1' @click="createSeasonEvents">
    Create solstice and equinox events
</button>
