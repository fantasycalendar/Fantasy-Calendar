@props([ "calendar" ])

@push('head')
    <script lang="js">

        function locationSection($data){

            return {

                newLocationName: "",

                seasons: $data.static_data.seasons.data,
                season_settings: $data.static_data.seasons.global_settings,
                locations: $data.static_data.seasons.locations,
                clock: $data.static_data.clock,
                current_location: $data.dynamic_data.location,
                custom_location: $data.dynamic_data.custom_location,


                expanded: {},
                deleting: null,
                reordering: false,

                add(data = {}){

                    const location = {
                        name: `Location ${this.locations.length+1}`,
                        seasons: this.seasons.map(season => {
                            return {
                                time: clone(season.time),
                                weather:{
                                    temp_low: 0,
                                    temp_high: 0,
                                    precipitation: 0,
                                    precipitation_intensity: 0
                                }
                            }
                        }),

                        settings: {

                            timezone: {
                                hour: 0,
                                minute: 0,
                            },

                            season_based_time: true,

                            large_noise_frequency: 0.015,
                            large_noise_amplitude: 5.0,

                            medium_noise_frequency: 0.3,
                            medium_noise_amplitude: 2.0,

                            small_noise_frequency: 0.8,
                            small_noise_amplitude: 3.0
                        },
                        ...data
                    }

                    this.locations.push(location);

                    window.dispatchEvent(new CustomEvent('added-location', { detail: { location: this.locations[this.locations.length-1] }}));
                },

                remove(index){
                    this.locations.splice(index, 1);

                    window.dispatchEvent(new CustomEvent('removed-location', { detail: { index }}));
                },

                copyLocation(){

                },

                get preset_locations(){
                    const validSeasons = (this.seasons.length === 2 || this.seasons.length === 4) && this.season_settings.enable_weather;
                    const length = validSeasons ? this.seasons.length : 4;
                    return preset_data.locations[length];
                },

                changeCurrentLocation($event){
                    this.current_location = $event.target.value;
                    this.custom_location = $event.target.options[$event.target.selectedIndex].parentElement.getAttribute("value") === "custom";

                    window.dispatchEvent(new CustomEvent('change-current-location', { detail: {
                        current_location: this.current_location,
                        custom_location: this.custom_location
                    }}));
                }
            }
        }

    </script>
@endpush


<x-sidebar.collapsible
    class="settings-locations"
    name="locations"
    title="Locations"
    icon="fas fa-compass"
    tooltip-title="More Info: Locations"
    helplink="locations"
>

    <div x-data="locationSection($data)">

        <div class='row no-gutters mb-2' x-show="(seasons.length === 0 || !season_settings.enable_weather) && !clock.enabled">
            You need weather enabled (temperatures, precipitation) or the clock enabled (timezone, sunrise/sunset) for locations to function.
        </div>

        <div class='row no-gutters mb-4'>
            <p class="mb-2">Preset locations work only with four or two seasons and weather enabled.</p>
            <x-alert padding="2">If you name your seasons winter, spring, summer, and autumn/fall, the system matches them with the presets' seasons, no matter which order.</x-alert>
        </div>

        <div x-show="(seasons.length > 0 && season_settings.enable_weather) || clock.enabled">

            <div class='row no-gutters bold-text'>
                Current location:
            </div>
            <div class='row no-gutters mb-2'>
                <select class='form-control' @change="changeCurrentLocation" :value="current_location">
                    <optgroup label="Custom" value="custom" x-show="locations.length">
                        <template x-for="(location, index) in locations">
                            <option :value="index" x-text="location.name"></option>
                        </template>
                    </optgroup>
                    <optgroup label="Location Presets" value="preset_location">
                        <template x-for="(location, index) in preset_locations">
                            <option x-text="location.name"></option>
                        </template>
                    </optgroup>
                </select>
            </div>
            <div class='row no-gutters my-2'>
                <input type='button' value='Copy current location' class='btn btn-info w-100'>
            </div>

            <div class='row no-gutters my-4'>
                <div class='separator'></div>
            </div>

            <div class='row no-gutters bold-text'>
                <div class='col'>New location:</div>
            </div>

            <div class='row no-gutters input-group mb-4'>
                <input type='text' class='form-control name' placeholder='Location name' x-model="newLocationName">
                <div class="col-auto input-group-append">
                    <button type='button' class='btn btn-primary' @click="add({ name: newLocationName })"><i class="fa fa-plus"></i></button>
                </div>
            </div>


            <div class="sortable list-group">
                <template x-for="(location, index) in locations">

                    <div class='sortable-container list-group-item collapsed collapsible'>

                        <div class='main-container' x-show="deleting !== location">
                            <i class='handle icon-reorder' x-show="reordering"></i>
                            <i class='expand' x-show="!reordering" :class="expanded[index] ? 'icon-collapse' : 'icon-expand'" @click="expanded[index] = !expanded[index]"></i>
                            <div class="input-group">
                                <input class='name-input small-input form-control' x-model="location.name">
                                <div class="input-group-append">
                                    <div class='btn btn-danger icon-trash' @click="deleting = location" x-show="deleting !== location"></div>
                                </div>
                            </div>
                        </div>

                        <div class='d-flex justify-content-between align-items-center w-100 px-1'>
                            <div class='btn_cancel btn btn-danger icon-remove' @click="deleting = null" x-show="deleting === location"></div>
                            <div class='remove-container-text' x-show="deleting === location">Are you sure?</div>
                            <div class='btn_accept btn btn-success icon-ok' @click="remove(index)" x-show="deleting === location"></div>
                        </div>

                        <div class='container pb-2' x-show="expanded[index] && deleting !== location">

                            <template x-for="(season, season_index) in seasons">

                                <div class='m-0 my-2 cycle-container wrap-collapsible location_season'>
                                    <input :id='`collapsible_seasons_${index}_${season_index}`' class='toggle location_toggle' type='checkbox'>
                                    <label :for='`collapsible_seasons_${index}_${season_index}`' class='lbl-toggle location_name'><div class='icon icon-expand'></div> <span x-text="'Weather settings: ' + season.name"></span></label>

                                    <div class='collapsible-content container p-0'>

                                        <div x-show="season_settings.enable_weather">

                                            <div class='row no-gutters'>
                                                <div class='col-lg-6 my-1'>
                                                    Temperature low:
                                                </div>
                                                <div class='col-lg-6 my-1'>
                                                    Temperature high:
                                                </div>
                                            </div>

                                            <div class="my-2 input-group">
                                                <input type='number' step="any" class='form-control' x-model="location.seasons[season_index].weather.temp_low">
                                                <input type='number' step="any" class='form-control' x-model="location.seasons[season_index].weather.temp_high">
                                            </div>

                                            <div class='row no-gutters my-2'>
                                                <div class='separator'></div>
                                            </div>

                                            <div class='row no-gutters mt-2'>
                                                Precipitation chance:
                                            </div>

                                            <div class='row no-gutters mb-2'>
                                                <div class='col-8 pt-1'>
                                                    <input type="range" class="custom-range" min="0" max="1" step="0.01" x-model='location.seasons[season_index].weather.precipitation'>
                                                </div>
                                                <div class='col-4 pl-1 input-group'>
                                                    <input type='number' step="any" class='form-control' min="0" max="100"
                                                       :value='Math.floor(location.seasons[season_index].weather.precipitation*100)'
                                                       @input="location.seasons[season_index].weather.precipitation = Number($event.target.value) / 100"
                                                    >

                                                    <div class="input-group-append">
                                                        <span class="input-group-text border">%</span>
                                                    </div>
                                                </div>
                                            </div>


                                            <div class='row no-gutters mt-2'>
                                                Precipitation intensity:
                                            </div>

                                            <div class='row no-gutters mb-2'>
                                                <div class='col-8 pt-1'>
                                                    <input type="range" class="custom-range" min="0" max="1" step="0.01" x-model='location.seasons[season_index].weather.precipitation_intensity'>
                                                </div>
                                                <div class='col-4 pl-1 input-group'>
                                                    <input type='number' step="any" class='form-control' min="0" max="100"
                                                       :value='Math.floor(location.seasons[season_index].weather.precipitation_intensity*100)'
                                                       @input="location.seasons[season_index].weather.precipitation_intensity = Number($event.target.value) / 100"
                                                    >

                                                    <div class="input-group-append">
                                                        <span class="input-group-text border">%</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class='row no-gutters my-2'>
                                                <div class='separator'></div>
                                            </div>
                                        </div>

                                        <div x-show="clock.enabled && !location.settings.season_based_time">

                                            <div class='row no-gutters mt-2'>
                                                <div class='col-12 pl-0 pr-0'>Sunrise:</div>
                                            </div>

                                            <div class='row no-gutters sortable-header'>
                                                <div class='col-6 pr-1'>Hour</div>
                                                <div class='col-6 pl-1'>Minute</div>
                                            </div>

                                            <div class='mb-2 protip input-group' data-pt-position="right" data-pt-title="What time the sun rises at the peak of this season, in this location">
                                                <input type='number' step="1.0" class='form-control text-right' min="0" :max="clock.hours" :disabled="location.settings.season_based_time" x-model='location.seasons[season_index].time.sunrise.hour' />

                                                <div class="input-group-append">
                                                    <span class="input-group-text border">:</span>
                                                    <span class="input-group-text hidden">
                                                        <!-- Empty span is here to trick bootstrap into square-ifying the ':' above -->
                                                    </span>
                                                </div>

                                                <input type='number' step="1.0" class='form-control text-left border-left-0' min="0" :max="clock.minutes" :disabled="location.settings.season_based_time" x-model='location.seasons[season_index].time.sunrise.minute' />
                                            </div>

                                            <div class='row no-gutters mt-2'>
                                                <div class='col-12 pl-0 pr-0'>Sunset:</div>
                                            </div>

                                            <div class='row no-gutters sortable-header'>
                                                <div class='col-6 pr-1'>Hour</div>
                                                <div class='col-6 pl-1'>Minute</div>
                                            </div>

                                            <div class='mb-2 protip input-group' data-pt-position="right" data-pt-title="What time the sun sets at the peak of this season, in this location">
                                                <input type='number' step="1.0" class='form-control text-right' min="0" :max="clock.hours" :disabled="location.settings.season_based_time" x-model='location.seasons[season_index].time.sunset.hour' />

                                                <div class="input-group-append">
                                                    <span class="input-group-text border">:</span>
                                                    <span class="input-group-text hidden">
                                                        <!-- Empty span is here to trick bootstrap into square-ifying the ':' above -->
                                                    </span>
                                                </div>

                                                <input type='number' step="1.0" class='form-control text-left border-left-0' min="0" :max="clock.minutes" :disabled="location.settings.season_based_time" x-model='location.seasons[season_index].time.sunset.minute' />
                                            </div>
                                        </div>
                                        <div class='row no-gutters my-2'>
                                            <button type="button" class="btn btn-sm btn-info full protip" data-pt-position="right" data-pt-title="Use the median values from the previous and next seasons' weather and time data. This season will act as a transition between the two, similar to Spring or Autumn">Interpolate data from surrounding seasons</button>
                                        </div>

                                        <div class='separator'></div>

                                    </div>

                                </div>

                            </template>

                            <div x-show="clock.enabled">

                                <div class='row no-gutters my-1 protip' data-pt-position="right" data-pt-title="Checking this will base this location's sunrise and sunset times on your season's sunrise and sunset times, and keep them the same">
                                    <div class='form-check col-12 py-2 border rounded'>
                                        <input type='checkbox' :id='index + "_season_based_time"' class='form-check-input' x-model='location.settings.season_based_time' />
                                        <label :for='index + "_season_based_time"' class='form-check-label ml-1'>
                                            Lock sunset/rise times to season
                                        </label>
                                    </div>
                                </div>

                                <div class='row my-1'>
                                    <div class='col'>Timezone:</div>
                                </div>

                                <div class='row no-gutters sortable-header'>
                                    <div class='col-6 pr-1'>Hour</div>
                                    <div class='col-6 pl-1'>Minute</div>
                                </div>

                                <div class='mb-2 protip input-group' data-pt-position="right" data-pt-title="When this location becomes active, the current time will change this much to reflect the new location.">
                                    <input type='number' step="1.0" :min="Math.floor(clock.hours*-0.5)" :max="Math.floor(clock.hours*0.5)" class='form-control right-text ' x-model='location.settings.timezone.hour' />

                                    <div class="input-group-append">
                                        <span class="input-group-text border">:</span>
                                        <span class="input-group-text hidden">
                                            <!-- Empty span is here to trick bootstrap into square-ifying the ':' above -->
                                        </span>
                                    </div>

                                    <input type='number' step="1.0" :min="Math.floor(clock.minutes*-0.5)" :max="Math.floor(clock.minutes*0.5)" class='form-control border-l-0' x-model='location.settings.timezone.minute' />
                                </div>

                            </div>

                            <div x-show="season_settings.enable_weather">
                                <div class='row no-gutters my-1'>
                                    <div class='col'>Curve noise settings:</div>
                                </div>

                                <div class='row no-gutters my-1'>
                                    <div class='col-6 pr-1'>Large frequency:</div>
                                    <div class='col-6 pl-1'>Large amplitude:</div>
                                </div>
                                <div class='row no-gutters my-1 input-group'>
                                    <input step="0.0000001" type="number" class='form-control' x-model.number='location.settings.large_noise_frequency'/>
                                    <input step="0.0000001" type="number" class='form-control' x-model.number='location.settings.large_noise_amplitude'/>
                                </div>

                                <div class='row no-gutters my-1'>
                                    <div class='col-6 pr-1'>
                                        Medium frequency:
                                    </div>
                                    <div class='col-6 pl-1'>
                                        Medium amplitude:
                                    </div>
                                </div>
                                <div class='row no-gutters my-1 input-group'>
                                    <input step="0.0000001" type="number" class='form-control' x-model.number='location.settings.medium_noise_frequency'/>
                                    <input step="0.0000001" type="number" class='form-control' x-model.number='location.settings.medium_noise_amplitude'/>
                                </div>

                                <div class='row no-gutters my-1'>
                                    <div class='col-6 pr-1'>
                                        Small frequency:
                                    </div>
                                    <div class='col-6 pl-1'>
                                        Small amplitude:
                                    </div>
                                </div>
                                <div class='row no-gutters my-1 input-group'>
                                    <input step="0.0000001" type="number" class='form-control' x-model.number='location.settings.small_noise_frequency'/>
                                    <input step="0.0000001" type="number" class='form-control' x-model.number='location.settings.small_noise_amplitude'/>
                                </div>
                            </div>

                        </div>

                    </div>
                </template>
            </div>

        </div>


    </div>

</x-sidebar.collapsible>
