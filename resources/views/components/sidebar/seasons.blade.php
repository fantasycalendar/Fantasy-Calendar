@props([ "calendar" ])

@push("head")
    <script lang="js">

        function seasonSection($data){

            return {

                newSeasonName: "",

                locations: $data.static_data.seasons.locations,
                seasons: $data.static_data.seasons.data,
                settings: $data.static_data.seasons.global_settings,
                clock: $data.static_data.clock,
                timespans: $data.static_data.year_data.timespans,

                deleting: null,
                expanded: {},
                reordering: false,

                using_preset_seasons: true,

                get seasonLength(){
                    return this.seasons.reduce((acc, season) => {
                        return acc + season.transition_length + season.duration;
                    }, 0)
                },

                get averageYearLengthEqualToSeasonLength(){
                    return window.calendar.getAverageYearLength() === this.seasonLength;
                },

                /*
                * If the user has a custom location active, and that custom location has override
                * sunrise and sunset times, display a warning that lets them know of this
                */
                get showSeasonTimeWarning(){
                    return this.seasons.length > 0
                        && this.clock.enabled
                        && $data.dynamic_data.custom_location
                        && !this.locations[$data.dynamic_data.location].season_based_time;
                },

                add(name){

                    const data = {
                        "name": name || `Season ${this.seasons.length+1}`,
                        "color": [
                            "#" + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0'),
                            "#" + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')
                        ],
                        "time": {
                            "sunrise": {
                                "hour": 6,
                                "minute": 0
                            },
                            "sunset": {
                                "hour": 18,
                                "minute": 0
                            }
                        },
                        transition_length: 90,
                        duration: 0,
                        timespan: 0,
                        day: 1
                    };

                    if(this.settings.periodic_seasons){

                        const averageYearLength = window.calendar.getAverageYearLength();

                        if(this.seasons.length){
                            data.transition_length = averageYearLength / (this.seasons.length+1);
                            this.seasons.forEach(season => {
                                season.transition_length = season.transition_length === averageYearLength / (this.seasons.length)
                                    ? averageYearLength / (this.seasons.length+1)
                                    : season.transition_length;
                            });
                        }else{
                            data.transition_length = averageYearLength;
                        }
                    }else{

                        if(this.seasons.length > 0){
                            data.timespan = Math.floor(this.timespans.length / (this.seasons.length+1))
                            data.day = 1;
                        }

                    }

                    this.seasons.push(data);

                    if(!this.settings.periodic_seasons) {
                        this.sortSeasonsByDate();
                    }

                    // TODO: Investigate why date-based seasons' month selection sometimes doesn't update properly on creation

                },

                remove(index){
                    this.seasons.splice(index, 1);
                },

                switchSeasonType(){
                    // TODO: Add modal warning when switching season type
                    const newType = !this.settings.periodic_seasons;
                    this.seasons = [];
                    this.reordering = false;
                    this.settings.periodic_seasons = newType;
                },

                createSeasonEvents(){
                    // TODO: Add season event creation on buttons
                },

                interpolateSeasons(){
                    // TODO: This is a monster mammoth function that needs refactoring, just take a look at line 1038 in calendar_inputs_edit.js
                },

                sortSeasonsByDate(){

                    if(this.settings.periodic_seasons) return;

                    // Map each expanded index to the season it represents
                    const expanded = Object.entries(clone(this.expanded)).filter(entry => entry[1]).map(entry => [entry[0], this.seasons[entry[0]]])

                    // Sort the seasons by month and day
                    this.seasons.sort((a, b) => {
                        return ((a.timespan+10000) - (b.timespan+10000)) - (a.day - b.day);
                    });

                    // Map each season back to its new index so that the right seasons remains expanded
                    this.expanded = Object.fromEntries(expanded.map(entry => [this.seasons.indexOf(entry[1]), true]));

                }

            }

        }

    </script>
@endpush


<x-sidebar.collapsible
    class="settings-seasons"
    name="seasons"
    title="Seasons"
    icon="fas fa-snowflake"
    tooltip-title="Seasons"
    helplink="seasons"
>

    <div
        x-data="seasonSection($data)"
        @dragover.prevent="$event.dataTransfer.dropEffect = 'move';"
    >

        <div class='row bold-text'>
            <div class='col'>
                Season type:
            </div>
        </div>

        <div class='border rounded mb-2'>
            <div class='row protip py-1 px-2 flex-column flex-md-row align-items-center' data-pt-position="right" data-pt-title='This toggles between having seasons starting on specific dates, or having the seasons last an exact duration with the potential to overflow years.'>
                <div class='col-12 col-md-5 pr-md-0 text-center season_text dated'>
                    Date Based
                </div>
                <div class='col-12 col-md-2 px-md-0 text-center'>
                    <label class="custom-control custom-checkbox flexible">
                        <input type="checkbox" class="custom-control-input" :checked="settings.periodic_seasons" @change="switchSeasonType">
                        <span class="custom-control-indicator"></span>
                    </label>
                </div>
                <div class='col-12 col-md-5 pl-md-0 text-center season_text periodic'>
                    Length Based
                </div>
            </div>
        </div>

        <div class='row no-gutters my-1'>
            <div class='form-check col-12 py-1 border rounded'>
                <input type='checkbox' class='form-check-input static_input' x-model="settings.color_enabled"/>
                <label for='season_color_enabled' class='form-check-label ml-1' >
                    Enable season day color
                </label>
            </div>
        </div>

        <div class='row mt-2 bold-text'>
            <div class="col">
                New season:
            </div>
        </div>

        <div class='add_inputs seasons row no-gutters'>
            <div class='col'>
                <input type='text' class='form-control name' placeholder='Season name' x-model="newSeasonName">
            </div>
            <div class='col-auto'>
                <button type='button' class='btn btn-primary' @click="add(newSeasonName)"><i class="fa fa-plus"></i></button>
            </div>
        </div>

        <div
            x-data="sortableList($data.static_data.seasons.data, 'season-order-changed')"
            @drop.prevent="dropped"
        >

            <div class="row sortable-header no-gutters align-items-center" x-show="settings.periodic_seasons">
                <div x-show="!reordering" @click="reordering = true; deleting = null;" class="btn btn-outline-secondary p-1 border col-1 rounded text-center cursor-pointer"><i class="fa fa-sort"></i></div>
                <div x-show="reordering" @click="reordering = false;" class="btn btn-outline-secondary p-1 border col-1 rounded text-center cursor-pointer "><i class="fa fa-times"></i></div>
            </div>

            <div class="sortable list-group">
                <template x-for="(season, index) in seasons">
                    <div class='sortable-container list-group-item'>

                        <div class="bg-primary-500 w-full" x-show="reordering && dragging !== null && dropping === index && dragging > index">
                            <div class="border-2 rounded border-primary-800 border-dashed m-1 grid place-items-center p-3">
                                <span class="text-primary-800 font-medium" x-text="seasons[dragging]?.name"></span>
                            </div>
                        </div>

                        <div class='main-container'
                             x-show="deleting !== season"
                             @dragenter.prevent="dropping = index"
                             @dragstart="dragging = index"
                             @dragend="dragging = null; $nextTick(() => {dropping = null})"
                             :draggable="reordering"
                        >
                            <i class='handle icon-reorder' x-show="reordering"></i>
                            <i class='expand' x-show="!reordering" :class="expanded[index] ? 'icon-collapse' : 'icon-expand'" @click="expanded[index] = !expanded[index]"></i>
                            <div class="input-group">
                                <input class='name-input small-input form-control' :disabled="reordering" x-model="season.name">
                                <div class="input-group-append">
                                    <div class='btn btn-danger icon-trash' :disabled="reordering" @click="deleting = season" x-show="deleting !== season"></div>
                                </div>
                            </div>
                        </div>

                        <div class='d-flex justify-content-between align-items-center w-100 px-1'>
                            <div class='btn_cancel btn btn-danger icon-remove' @click="deleting = null" x-show="deleting === season"></div>
                            <div class='remove-container-text' x-show="deleting === season">Are you sure?</div>
                            <div class='btn_accept btn btn-success icon-ok' @click="remove(index)" x-show="deleting === season"></div>
                        </div>

                        <div class='container pb-2' x-show="expanded[index] && deleting !== season && !reordering">

                            <div class='row no-gutters my-1' x-show="!using_preset_seasons">
                                <div class='col-4 pt-1'>Season type:</div>
                                <div class='col'>
                                    <select type='number' class='form-control' x-model='settings.preset_order[index]'>
                                    </select>
                                </div>
                            </div>

                            <div class='row no-gutters mt-2' x-show="settings.periodic_seasons">

                                <div class='col-md-6 col-sm-12 pl-0 pr-1'>
                                    Duration:
                                </div>

                                <div class='col-md-6 col-sm-12 pl-1 pr-0'>
                                    Peak duration:
                                </div>

                                <div class="col-12 input-group">
                                    <input type='number' step='any' class='form-control protip' x-model.number='season.transition_length' min='1' data-pt-position="right" data-pt-title='How many days until this season ends, and the next begins.'/>
                                    <input type='number' step='any' class='form-control protip' x-model.number='season.duration' min='0' data-pt-position="right" data-pt-title='If the duration is the path up a mountain, the peak duration is a flat summit. This is how many days the season will pause before going down the other side of the mountain.'/>
                                </div>

                            </div>

                            <div class='col p-0' x-show="!settings.periodic_seasons">

                                <div class='row no-gutters my-1'>
                                    <div class='col-4 pt-1'>Month:</div>
                                    <div class='col-8'>
                                        <select type='number' class='date form-control full' x-model.number='season.timespan' @change="sortSeasonsByDate()">
                                            <template x-for="(timespan, index) in timespans.filter(timespan => timespan.interval === 1)">
                                                <option :value="index" x-text="timespan.name"></option>
                                            </template>
                                        </select>
                                    </div>
                                </div>

                                <div class='row no-gutters my-1'>
                                    <div class='col-4 pt-1'>Day:</div>
                                    <div class='col-8'>
                                        <select type='number' class='date form-control full' x-model.number='season.day' @change="sortSeasonsByDate()">
                                            <template x-for="(day, index) in window.calendar.getNonLeapingDaysInTimespan(season.timespan ?? 0)">
                                                <option :value="index+1" x-text="day"></option>
                                            </template>
                                        </select>
                                    </div>
                                </div>

                            </div>


                            <div class='row no-gutters mt-2'>
                                <div class='col-6 pr-1'>Start color:</div>
                                <div class='col-6 pl-1'>End color:</div>
                            </div>

                            <div class='grid grid-cols-2 gap-2'>
                                <x-color-picker input-class="form-control" model="season.color[0]" name="season_color_start"></x-color-picker>
                                <x-color-picker input-class="form-control" model="season.color[1]" name="season_color_start"></x-color-picker>
                            </div>

                            <div x-show="clock.enabled">

                                <div class='row no-gutters mt-2'>
                                    <div class='col-12'>Sunrise:</div>
                                </div>

                                <div class='row no-gutters sortable-header'>
                                    <div class='col-6 pr-1'>Hour</div>
                                    <div class='col-6 pl-1'>Minute</div>
                                </div>

                                <div class='row no-gutters mb-2 input-group protip' data-pt-position="right" data-pt-title="What time the sun rises at the peak of this season">
                                    <input type='number' step="1.0" class='form-control' min="0" :max="clock.hours" x-model='season.time.sunrise.hour' />
                                    <input type='number' step="1.0" class='form-control' min="0" :max="clock.minutes" x-model='season.time.sunrise.minute' />
                                </div>

                                <div class='row no-gutters mt-2'>
                                    <div class='col-12 '>Sunset:</div>
                                </div>

                                <div class='row no-gutters sortable-header'>
                                    <div class='col-6 pr-1'>Hour</div>
                                    <div class='col-6 pl-1'>Minute</div>
                                </div>

                                <div class='row no-gutters mb-2 input-group protip' data-pt-position="right" data-pt-title="What time the sun sets at the peak of this season">
                                    <input type='number' step="1.0" class='form-control' min="0" :max="clock.hours" x-model='season.time.sunset.hour' />
                                    <input type='number' step="1.0" class='form-control' min="0" :max="clock.minutes" x-model='season.time.sunset.minute' />
                                </div>

                                <div class='row no-gutters my-1' x-show="clock.enabled && seasons.length >= 3">
                                    <button type="button" @click="interpolateSeasons()" class="btn btn-sm btn-info full protip" data-pt-title="Use the median values from the previous and next seasons' time data. This season will act as a transition between the two, similar to Spring or Autumn">Interpolate sunrise & sunset from surrounding seasons</button>
                                </div>

                            </div>

                        </div>

                        <div class="bg-primary-500 w-full" x-show="reordering && dragging !== null && dropping === index && dragging < index">
                            <div class="border-2 rounded border-primary-800 border-dashed m-1 grid place-items-center p-3">
                                <span class="text-primary-800 font-medium" x-text="seasons[dragging]?.name"></span>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>


        <div class='my-1 small-text' x-show="settings.periodic_seasons" :class="averageYearLengthEqualToSeasonLength ? 'valid' : 'warning'">

           <div class='container'>
               <div class='row py-1'>
               <i class="col-auto px-0 mr-1 fas" style="line-height:1.5;" :class="averageYearLengthEqualToSeasonLength ? 'fa-check-circle' : 'fa-exclamation-circle'"></i>
               <div class='col px-0' x-text="`Season length: ${seasonLength} / ${window.calendar.getAverageYearLength()} (year length)`"></div></div>
               <div class='col px-0' x-text='averageYearLengthEqualToSeasonLength ? "The season length and year length are the same, and will not drift away from each other." : "The season length and year length at not the same, and will diverge over time. Use with caution."'></div>
           </div>

        </div>

        <div class='my-1 small-text warning' x-show="showSeasonTimeWarning">
            <div class='container'>
                <div class='row py-1'>
                    <i class="col-auto px-0 mr-2 fas fa-exclamation-circle" style="line-height:1.5;"></i>
                    <div class='col px-0'>You are currently using a custom location with custom season sunrise and sunset times. Solstices and equinoxes may behave unexpectedly.</div>
                </div>
            </div>
        </div>

        <div class='container season_offset_container'>
            <div class='row mt-2'>
                Season offset (days):
            </div>
            <div class='row mb-2'>
                <input class='form-control static_input' type='number' x-model='settings.season_offset'/>
            </div>
        </div>

        <div>
            <button type='button' class='btn btn-secondary full' @click="createSeasonEvents()">Create solstice and equinox events</button>
        </div>

    </div>


</x-sidebar.collapsible>
