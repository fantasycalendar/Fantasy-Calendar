@props(['calendar' => null])

<div class='flex mb-2' x-show="!season_settings.enable_weather && !clock.enabled">
    You need weather enabled (temperatures, precipitation) or the clock enabled (timezone, sunrise/sunset) for locations
    to function.
</div>

<div class='flex' x-show="(season_settings.enable_weather || clock.enabled) && !preset_locations.length">
    <p class="m-0">Preset locations work only with four or two seasons and weather enabled.</p>
    <p>
        <small>If you name your seasons winter, spring, summer, and autumn/fall, the system matches them with the
            presets' seasons, no matter which order.</small>
    </p>
</div>

<div x-show="season_settings.enable_weather || clock.enabled">
    <div class='mb-2'>
        Current location:
        <!--
        TODO: make this select update current location in dynamic data - maybe this is a lil component by itself?
        -->
        <select class='form-control' @change="locationChanged" x-model="location_selection_value">
            <optgroup label="Custom" x-show="locations.length">
                <template x-for="(location, index) in locations">
                    <option :value="index + '-custom'" x-text="location.name"></option>
                </template>
            </optgroup>
            <optgroup label="Preset" x-show="preset_locations.length">
                <template x-for="(location, index) in preset_locations">
                    <option :value="index + '-preset'" x-text="location.name" :disabled="!can_use_preset_locations"></option>
                </template>
            </optgroup>
        </select>
    </div>

    <div class='separator'></div>

    <div class="mb-2">
        <div class='bold-text'>
            New location:
        </div>

        <div class='input-group'>
            <input type='text' class='form-control' placeholder='Location name' x-model="newLocation"/>

            <div class="input-group-append">
                <button type='button' class='btn btn-secondary' @click="copyCurrentLocation" title="Copy current location">
                    <i class="fa fa-copy"></i>
                </button>
            </div>

            <div class="input-group-append">
                <button type='button' class='btn btn-primary' @click="addLocation" title="Create new location">
                    <i class="fa fa-plus"></i>
                </button>
            </div>
        </div>
    </div>

    <div>
        <template x-for="(location, index) in locations">
            <div class="list-group-item p-2 first-of-type:rounded-t" x-data="{ collapsed: true }">
                <div class='flex items-center w-full gap-x-2' x-show="deleting !== index">
                    <div class='cursor-pointer text-xl fa'
                         :class="{ 'fa-caret-square-up': !collapsed, 'fa-caret-square-down': collapsed }"
                         @click="collapsed = !collapsed"></div>
                    <input type='text' class='name-input small-input form-control location-name' x-model.lazy='location.name'/>
                    <button class="btn btn-danger w-10" @click="deleting = index" :disabled="using_custom_location && current_location == index" :title="(using_custom_location && current_location == index) ? 'Cannot delete the current location' : 'Delete this location'">
                        <i class="fa fa-trash text-lg"></i>
                    </button>
                </div>

                <div x-show="deleting === index" class="flex items-center w-full gap-x-2.5" x-cloak>
                    <button class="btn btn-success w-10 !px-0 text-center" @click="removeLocation(index)">
                        <i class="fa fa-check text-lg"></i>
                    </button>

                    <div class="flex-grow">Are you sure?</div>

                    <button class="btn btn-danger w-10 !px-0 text-center" @click="deleting = -1">
                        <i class="fa fa-times text-lg"></i>
                    </button>
                </div>

                <div x-show="!collapsed && deleting === -1">
                    <template x-for="(season, season_index) in location.seasons">
                        <div class='m-0 my-2 cycle-container' x-data="{ seasonCollapsed: true }">
                            <div class='lbl-toggle' @click="seasonCollapsed = !seasonCollapsed">
                                <div class='cursor-pointer text-xl fa mr-2'
                                     :class="{ 'fa-caret-square-up': !seasonCollapsed, 'fa-caret-square-down': seasonCollapsed }"></div>
                                <span x-text='(seasons?.[season_index]?.name ?? "Unknown") + " weather"'></span>
                            </div>
                            <div class='p-0' x-show="!seasonCollapsed">
                                <div x-show="season_settings.enable_weather">
                                    <div class='flex gap-2 mb-2'>
                                        <div>
                                            Temperature low
                                            <input type='number' step="any" class='form-control full' x-model.number.lazy='season.weather.temp_low'>
                                        </div>

                                        <div>
                                            Temperature high
                                            <input type='number' step="any" class='form-control full' x-model.number.lazy='season.weather.temp_high'>
                                        </div>
                                    </div>

                                    <div class='separator'></div>

                                    <div class='flex mt-2'>
                                        Precipitation chance (%)
                                    </div>
                                    <!-- TODO: Maybe make this into a component? -->
                                    <div class='flex gap-2 mb-2' x-data="{
                                        value: Math.round(season.weather.precipitation*100),
                                        change($event){
                                            season.weather.precipitation = Math.max(0.0, Math.min(1.0, Number($event.target.value)/100.0))
                                        }
                                    }">
                                        <input type='range' class="form-control form-control-sm" step="1" min="0" max="100" x-model.number="value" @change='change'/>
                                        <input type='number' step="any" class='form-control form-control-sm slider_input basis-[25%]' x-model.number="value" @change='change'/>
                                    </div>

                                    <div class='flex mt-2'>
                                        Precipitation intensity (%)
                                    </div>
                                    <div class='flex gap-2 mb-2' x-data="{
                                        value: Math.round(season.weather.precipitation_intensity*100),
                                        change($event){
                                            season.weather.precipitation_intensity = Math.max(0.0, Math.min(1.0, Number($event.target.value)/100.0))
                                        }
                                    }">
                                        <!-- TODO: Style these properly -->
                                        <input type='range' class="form-control form-control-sm"  step="1" min="0" max="100" x-model.number="value" @change='change'/>
                                        <input type='number' step="any" class='form-control form-control-sm slider_input basis-[25%]' x-model.number="value" @change='change'/>
                                    </div>

                                    <div class='separator'></div>
                                </div>
                                <div class='clock_inputs' x-show="clock.enabled">
                                    <div class='flex gap-[24px] justify-evenly'>
                                        <div class="w-full">
                                            Sunrise hour
                                        </div>
                                        <div class="w-full">
                                            Sunrise minute
                                        </div>
                                    </div>

                                    <div class='flex mb-2 gap-[8px]'>
                                        <input type='number' step="1.0" class='form-control text-right full' x-model.number.lazy="season.time.sunrise.hour" :disabled="location.settings.season_based_time ?? false"/>

                                        <div class="basis-[20px] text-center grid items-center">:</div>

                                        <input type='number' step="1.0" class='form-control full' x-model.number.lazy="season.time.sunrise.minute" :disabled="location.settings.season_based_time ?? false"/>
                                    </div>

                                    <div class='flex gap-[24px] justify-evenly'>
                                        <div class="w-full">
                                            Sunset hour
                                        </div>
                                        <div class="w-full">
                                            Sunset minute
                                        </div>
                                    </div>

                                    <div class='flex mb-2 gap-[8px]'>
                                        <input type='number' step="1.0" class='form-control text-right full' x-model.number.lazy="season.time.sunset.hour" :disabled="location.settings.season_based_time ?? false"/>

                                        <div class="basis-[20px] text-center grid items-center">:</div>

                                        <input type='number' step="1.0" class='form-control full' x-model.number.lazy="season.time.sunset.minute" :disabled="location.settings.season_based_time ?? false"/>
                                    </div>
                                </div>

                                <div class='flex my-2' x-show="(clock.enabled || season_settings.enable_weather) && location.seasons.length >= 3">
                                    <button type="button" class="btn btn-sm btn-info full" @click="interpolateSeasonTimes(index, season_index)">
                                        Interpolate data from surrounding seasons
                                    </button>
                                </div>
                            </div>

                            <div class='separator'></div>
                        </div>
                    </template>

                    <div class='clock_inputs' x-show="clock.enabled">
                        <div>
                            <x-alpine.check-input id="`${index}_season_based_time`"
                                x-model='location.settings.season_based_time'
                                @change="updateSeasonBasedTime(index)"
                            >
                                Lock sunset/rise times to season
                            </x-alpine.check-input>
                        </div>

                        <div class='flex gap-[24px] justify-evenly'>
                            <div class="w-full">
                                Timezone hour
                            </div>
                            <div class="w-full">
                                Timezone minute
                            </div>
                        </div>

                        <div class='flex mb-2 gap-[8px]'>
                            <input type='number' step="1.0" class='form-control text-right full' x-model.number.lazy="location.settings.timezone.hour" />

                            <div class="basis-[20px] text-center grid items-center">:</div>

                            <input type='number' step="1.0" class='form-control full' x-model.number.lazy="location.settings.timezone.minute" />
                        </div>
                    </div>

                    <div class='weather_inputs flex flex-col' x-show="season_settings.enable_weather">
                        <div>
                            Curve noise settings:
                        </div>

                        <div class='flex gap-2 mt-2'>
                            <div class='w-full'>
                                Large frequency
                            </div>
                            <div class='w-full'>
                                Large amplitude
                            </div>
                        </div>

                        <div class='flex gap-2'>
                            <input type='number' class='form-control' x-model.number.lazy='location.settings.large_noise_frequency'/>
                            <input type='number' class='form-control' x-model.number.lazy='location.settings.large_noise_amplitude'/>
                        </div>

                        <div class='flex gap-2 mt-2'>
                            <div class='w-full'>
                                Medium frequency
                            </div>
                            <div class='w-full'>
                                Medium amplitude
                            </div>
                        </div>

                        <div class='flex gap-2'>
                            <input type='number' class='form-control' x-model.number.lazy='location.settings.medium_noise_frequency'/>
                            <input type='number' class='form-control' x-model.number.lazy='location.settings.medium_noise_amplitude'/>
                        </div>

                        <div class='flex gap-2 mt-2'>
                            <div class='w-full'>
                                Small frequency
                            </div>
                            <div class='w-full'>
                                Small amplitude
                            </div>
                        </div>

                        <div class='flex gap-2'>
                            <input type='number' class='form-control' x-model.number.lazy='location.settings.small_noise_frequency'/>
                            <input type='number' class='form-control' x-model.number.lazy='location.settings.small_noise_amplitude'/>
                        </div>
                    </div>
                </div>

        </template>
    </div>

</div>
