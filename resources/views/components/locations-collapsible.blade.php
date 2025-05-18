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
                    <button class="btn btn-danger w-10" @click="deleting = index" :disabled="using_custom_location && current_location == index" :title="(using_custom_location && current_location == index) ? 'Cannot delete the current loation' : 'Delete this location'">
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
                                    <div class='flex'>
                                        <div class='col-lg-6 my-1'>
                                            Temperature low:
                                            <input type='number' step="any" class='form-control full' x-model.number.lazy='season.weather.temp_low'>
                                        </div>
                                        <div class='col-lg-6 my-1'>
                                            Temperature high:
                                            <input type='number' step="any" class='form-control full' x-model.number.lazy='season.weather.temp_high'>
                                        </div>
                                    </div>
                                    <div class='flex my-2'>
                                        <div class='separator'></div>
                                    </div>
                                    <div class='flex mt-2'>
                                        Precipitation chance: (%)
                                    </div>
                                    <!-- TODO: Maybe make this into a component? -->
                                    <div class='flex mb-2' x-data="{
                                        value: Math.round(season.weather.precipitation*100),
                                        change($event){
                                            season.weather.precipitation = Math.max(0.0, Math.min(1.0, Number($event.target.value)/100.0))
                                        }
                                    }">
                                        <div class='col-9 pt-1'>
                                            <!-- TODO: Style these properly -->
                                            <input type='range' class="form-control form-control-sm full" step="1" min="0" max="100" x-model.number="value" @change='change'/>
                                        </div>
                                        <div class='col-3 pl-1'>
                                            <input type='number' step="any" class='form-control form-control-sm full slider_input' x-model.number="value" @change='change'/>
                                        </div>
                                    </div>
                                    <div class='flex mt-2'>
                                        Precipitation intensity: (%)
                                    </div>
                                    <div class='flex mb-2' x-data="{
                                        value: Math.round(season.weather.precipitation_intensity*100),
                                        change($event){
                                            season.weather.precipitation_intensity = Math.max(0.0, Math.min(1.0, Number($event.target.value)/100.0))
                                        }
                                    }">
                                        <div class='col-9 pt-1'>
                                            <!-- TODO: Style these properly -->
                                            <input type='range' class="form-control form-control-sm full"  step="1" min="0" max="100" x-model.number="value" @change='change'/>
                                        </div>
                                        <div class='col-3 pl-1'>
                                            <input type='number' step="any" class='form-control form-control-sm full slider_input' x-model.number="value" @change='change'/>
                                        </div>
                                    </div>
                                    <div class='flex my-2'>
                                        <div class='separator'></div>
                                    </div>
                                </div>
                                <div class='clock_inputs' x-show="clock.enabled">
                                    <div class='flex mt-2'>
                                        <div class='col-12 pl-0 pr-0'>Sunrise:</div>
                                    </div>
                                    <div class='flex sortable-header'>
                                        <div class='col-6 pr-1'>
                                            Hour
                                        </div>
                                        <div class='col-6 pl-1'>
                                            Minute
                                        </div>
                                    </div>
                                    <div class='flex mb-2 protip'  data-pt-position="right" data-pt-title="What time the sun rises at the peak of this season, in this location">
                                        <div class='col-6 pl-0 pr-1'>
                                            <input type='number' step="1.0" class='form-control text-right full' x-model.number.lazy="season.time.sunrise.hour" :disabled="location.settings.season_based_time ?? false"/>
                                        </div>
                                        <div class='col-auto pt-1'>:</div>
                                        <div class='col pl-1 pr-0'>
                                            <input type='number' step="1.0" class='form-control full' x-model.number.lazy="season.time.sunrise.minute" :disabled="location.settings.season_based_time ?? false"/>
                                        </div>
                                    </div>
                                    <div class='flex mt-2'>
                                        <div class='col-12 pl-0 pr-0'>Sunset:</div>
                                    </div>
                                    <div class='flex sortable-header'>
                                        <div class='col-6 pr-1'>
                                            Hour
                                        </div>
                                        <div class='col-6 pl-1'>
                                            Minute
                                        </div>
                                    </div>
                                    <div class='flex mb-2 protip' data-pt-position="right" data-pt-title="What time the sun sets at the peak of this season, in this location">
                                        <div class='col-6 pl-0 pr-1'>
                                            <input type='number' step="1.0" class='form-control text-right full' x-model.number.lazy="season.time.sunset.hour" :disabled="location.settings.season_based_time ?? false"/>
                                        </div>
                                        <div class='col-auto pt-1'>:</div>
                                        <div class='col pl-1 pr-0'>
                                            <input type='number' step="1.0" class='form-control full' x-model.number.lazy="season.time.sunset.minute" :disabled="location.settings.season_based_time ?? false"/>
                                        </div>
                                    </div>
                                </div>

                                <div class='flex my-2' x-show="(clock.enabled || season_settings.enable_weather) && location.seasons.length >= 3">
                                    <button type="button" class="btn btn-sm btn-info full protip" @click="interpolateSeasonTimes(index, season_index)" data-pt-position="right" data-pt-title="Use the median values from the previous and next seasons' weather and time data. This season will act as a transition between the two, similar to Spring or Autumn">
                                        Interpolate data from surrounding seasons
                                    </button>
                                </div>
                            </div>
                            <div class='separator'></div>
                        </div>
                    </template>
                    <div class='clock_inputs' x-show="clock.enabled">
                        <div class='flex my-1 protip' data-pt-position="right" data-pt-title="Checking this will base this location's sunrise and sunset times on your season's sunrise and sunset times, and keep them the same">
                            <div class='form-check col-12 py-2 border rounded'>
                                <input type='checkbox' :id='`${index}_season_based_time`' class='form-check-input' x-model='location.settings.season_based_time' @change="updateSeasonBasedTime(index)"/>
                                <label :for='`${index}_season_based_time`' class='form-check-label ml-1'>
                                    Lock sunset/rise times to season
                                </label>
                            </div>
                        </div>
                        <div class='row my-1'>
                            <div class='col'>Timezone:</div>
                        </div>
                        <div class='flex sortable-header'>
                            <div class='col-6 pr-1'>
                                Hour
                            </div>
                            <div class='col-6 pl-1'>
                                Minute
                            </div>
                        </div>
                        <div class='flex mb-2 protip' data-pt-position="right" data-pt-title="When this location becomes active, the current time will change this much to reflect the new location.">
                            <div class='col-6 pr-1'>
                                <input type='number' step="1.0" class='form-control full' x-model.number.lazy='location.settings.timezone.hour' />
                            </div>
                            <div class='col-auto pt-1'>:</div>
                            <div class='col pl-1'>
                                <input type='number' step="1.0" class='form-control full' x-model.number.lazy='location.settings.timezone.minute' />
                            </div>
                        </div>
                    </div>
                    <div class='weather_inputs' x-show="season_settings.enable_weather">
                        <div class='flex my-1'>
                            <div class='col'>
                                Curve noise settings:
                            </div>
                        </div>
                        <div class='flex my-1'>
                            <div class='col-6 pr-1'>
                                Large frequency:
                            </div>
                            <div class='col-6 pl-1'>
                                Large amplitude:
                            </div>
                        </div>
                        <div class='flex my-1'>
                            <div class='col-6 pr-1'>
                                <input type='number' class='form-control full' x-model.number.lazy='location.settings.large_noise_frequency'/>
                            </div>
                            <div class='col-6 pl-1'>
                                <input type='number' class='form-control full' x-model.number.lazy='location.settings.large_noise_amplitude'/>
                            </div>
                        </div>
                        <div class='flex my-1'>
                            <div class='col-6 pr-1'>
                                Medium frequency:
                            </div>
                            <div class='col-6 pl-1'>
                                Medium amplitude:
                            </div>
                        </div>
                        <div class='flex my-1'>
                            <div class='col-6 pr-1'>
                                <input type='number' class='form-control full' x-model.number.lazy='location.settings.medium_noise_frequency'/>
                            </div>
                            <div class='col-6 pl-1'>
                                <input type='number' class='form-control full' x-model.number.lazy='location.settings.medium_noise_amplitude'/>
                            </div>
                        </div>
                        <div class='flex my-1'>
                            <div class='col-6 pr-1'>
                                Small frequency:
                            </div>
                            <div class='col-6 pl-1'>
                                Small amplitude:
                            </div>
                        </div>
                        <div class='flex my-1'>
                            <div class='col-6 pr-1'>
                                <input type='number' class='form-control full' x-model.number.lazy='location.settings.small_noise_frequency'/>
                            </div>
                            <div class='col-6 pl-1'>
                                <input type='number' class='form-control full' x-model.number.lazy='location.settings.small_noise_amplitude'/>
                            </div>
                        </div>
                    </div>
                </div>

        </template>
    </div>

</div>
