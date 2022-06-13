@props([ "calendar" ])

@push("head")
    <script lang="js">

        function seasonSection($data){

            return {

                newSeasonName: "",

                static_data: $data.static_data,
                locations: $data.static_data.seasons.locations,
                seasons: $data.static_data.seasons.data,
                settings: $data.static_data.seasons.global_settings,
                clock: $data.static_data.clock,
                timespans: $data.static_data.year_data.timespans,
                events: $data.events,

                deleting: null,
                expanded: {},
                reordering: false,

                old_order: clone($data.static_data.seasons.global_settings.preset_order) ?? [],
                preset_season_list: [],

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
                        && !this.locations[$data.dynamic_data.location]?.settings?.season_based_time;
                },

                init(){
                    this.populatePresetSeasonList();
                    this.ensureSeasonColorsExist();
                },

                add(name){

                    const data = {
                        name: name || `Season ${this.seasons.length+1}`,
                        color: [
                            "#" + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0'),
                            "#" + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')
                        ],
                        time: {
                            sunrise: {
                                hour: 6,
                                minute: 0
                            },
                            sunset: {
                                hour: 18,
                                minute: 0
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

                    this.populatePresetSeasonList();

                    window.dispatchEvent(new CustomEvent("season-added", { detail: { data } }));

                    // TODO: Investigate why date-based seasons' month selection sometimes doesn't update properly on creation

                },

                remove(index){
                    this.seasons.splice(index, 1);
                    this.populatePresetSeasonList();
                    window.dispatchEvent(new CustomEvent("season-removed", { detail: { index }}));
                },

                querySwitchSeasonType(){

                    this.season_type = this.settings.periodic_seasons;

                    const endsYear = this.static_data.eras.find(era => era.settings.ends_year);

                    if(endsYear){
                        swal.fire({
                            title: "Error!",
                            text: `You have eras that end years - you cannot switch to dated seasons with year-ending eras as the dates might disappear, and that kinda defeats the whole purpose.`,
                            icon: "error"
                        });
                        return;
                    }

                    swal.fire({
                        title: "Are you sure?",
                        text: `Are you sure you want to switch to ${!this.settings.periodic_seasons ? "PERIODIC" : "DATED"} seasons? Your current seasons will be deleted so you can re-create them.`,
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Okay',
                        icon: "warning",
                    })
                    .then((result) => {
                        if (!result.dismiss) {
                            window.dispatchEvent(new CustomEvent('toggle-season-type'));
                        }
                    });
                },

                toggleSeasonType(){
                    this.reordering = false;

                    $data.static_data.seasons.data = [];
                    $data.static_data.seasons.global_settings.periodic_seasons = !this.settings.periodic_seasons;
                    this.seasons = $data.static_data.seasons.data;

                    window.dispatchEvent(new CustomEvent("all-seasons-removed"));
                },

                queryCreateSeasonEvents(){


                    new Promise((resolve, reject) => {

                        const season_event_names = ['spring equinox', 'summer solstice', 'autumn equinox', 'winter solstice'];
                        const has_season_events = window.calendar.events.find(event => season_event_names.indexOf(event.name.toLowerCase()) > -1);

                        if(!has_season_events) {
                            return resolve();
                        }

                        swal.fire({
                            title: `Events exist!`,
                            text: "You already have solstice and equinox events, are you sure you want to create another set?",
                            showCloseButton: false,
                            showCancelButton: true,
                            cancelButtonColor: '#3085d6',
                            confirmButtonColor: '#d33',
                            confirmButtonText: 'Yes',
                            icon: "warning"
                        })
                        .then((result) => {
                            if(result.dismiss === "close" || result.dismiss === "cancel") {
                                reject();
                            }else{
                                resolve();
                            }
                        });

                    }).then(() => {

                        let html = '<strong><span style="color:#4D61B3;">Simple</span></strong> season events are based on the <strong>specific start dates</strong> of the seasons.<br><br>';

                        html += '<strong><span style="color:#84B356;">Complex</span></strong> season events are based on the <strong>longest and shortest day</strong> of the year.<br>';
                        if(!window.calendar.static_data.clock.enabled) {
                            html += '<span style="font-style:italic;font-size:0.8rem;">You need to <strong>enable the clock</strong> for this button to be enabled.</span><br>';
                        }
                        html += '<br>';
                        html += '<span style="font-size:0.9rem;">Still unsure?<br><a href="https://helpdocs.fantasy-calendar.com/topic/seasons#Create_solstice_and_equinox_events" target="_blank">Read more on the Wiki (opens in a new window)</a>.</span><br>';

                        swal.fire({
                            title: `Simple or Complex?`,
                            html: html,
                            showCloseButton: true,
                            showCancelButton: true,
                            confirmButtonColor: '#4D61B3',
                            cancelButtonColor: window.calendar.static_data.clock.enabled ? '#84B356' : '#999999',
                            confirmButtonText: 'Simple',
                            cancelButtonText: 'Complex',
                            icon: "question",
                            onOpen: function() {
                                $(swal.getCancelButton()).prop("disabled", !window.calendar.static_data.clock.enabled);
                            }
                        })
                        .then((result) => {

                            if(result.dismiss !== "close") {

                                window.dispatchEvent(new CustomEvent('create-season-events', {
                                    detail: {
                                        complex: result.dismiss === "cancel"
                                    }
                                }))

                            }
                        });

                    });
                },

                createSeasonEvents(complex){
                    this.events.push(...create_season_events(complex));
                },

                interpolateSeasons(index){

                    const { prev_index, next_index, interpolationPercentage } = window.calendar.getSeasonInterpolation(index);

                    const prev_season = this.seasons[prev_index];
                    const curr_season = this.seasons[index];
                    const next_season = this.seasons[next_index];

                    if(this.clock.enabled){

                        const prev_sunrise = prev_season.time.sunrise.hour+(prev_season.time.sunrise.minute/this.clock.minutes);
                        const next_sunrise = next_season.time.sunrise.hour+(next_season.time.sunrise.minute/this.clock.minutes);

                        const sunrise_middle = lerp(prev_sunrise, next_sunrise, interpolationPercentage);

                        const sunrise_h = Math.floor(sunrise_middle);
                        const sunrise_m = Math.floor(fract(sunrise_middle)*this.clock.minutes);

                        curr_season.time.sunrise.hour = sunrise_h;
                        curr_season.time.sunrise.minute = sunrise_m;

                        const prev_sunset = prev_season.time.sunset.hour+(prev_season.time.sunset.minute/this.clock.minutes);
                        const next_sunset = next_season.time.sunset.hour+(next_season.time.sunset.minute/this.clock.minutes);

                        const sunset_middle = lerp(prev_sunset, next_sunset, interpolationPercentage);

                        const sunset_h = Math.floor(sunset_middle);
                        const sunset_m = Math.floor(fract(sunset_middle)*this.clock.minutes);

                        curr_season.time.sunset.hour = sunset_h;
                        curr_season.time.sunset.minute = sunset_m;

                        window.dispatchEvent(new CustomEvent("season-times-changed", { detail: { index }}));

                    }

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

                },

                show_preset_order: false,

                populatePresetSeasonList(){

                    this.show_preset_order = false;

                    if(this.detectAutomaticMapping()) return;

                    this.show_preset_order = this.preset_season_list.length;

                    if(!this.preset_season_list) return false;

                    if(!this.settings.preset_order.length){
                        this.settings.preset_order = Array.from(Array(this.preset_season_list.length).keys());
                    }

                    if(!this.preset_season_list.length){
                        $data.static_data.seasons.global_settings.preset_order = [];
                        return false;
                    }

                },

                detectAutomaticMapping(){

                    if(this.seasons.length === 2){
                        this.preset_season_list = ['winter', 'summer'];
                    }else if(this.seasons.length === 4){
                        this.preset_season_list = ['winter', 'spring', 'summer', 'autumn'];
                    }else{
                        this.preset_season_list = [];
                        return false;
                    }

                    const season_test = new Set(this.seasons.map(season => {
                        const index = this.preset_season_list.indexOf(season.name.toLowerCase());
                        const isFall = index === -1 && season.name.toLowerCase() === "fall" && this.seasons.length === 4;
                        return isFall ? 3 : index;
                    }).filter(num => num !== -1));

                    if(this.seasons.length === season_test.size){
                        $data.static_data.seasons.global_settings.preset_order = Array.from(season_test);
                        return true;
                    }

                    return false;

                },

                presetOrderChanged(index){

                    const newValue = this.settings.preset_order[index];

                    for(let i = 0; i < this.settings.preset_order.length; i++){
                        if(i === index) continue;
                        const value = this.settings.preset_order[i];
                        if(value === newValue){
                            this.settings.preset_order[i] = this.old_order[index];
                            break;
                        }
                    }

                    this.old_order = clone($data.static_data.seasons.global_settings.preset_order);

                },

                seasonOrderChanged({ start, end }={}){

                    if($data.static_data.seasons.global_settings.preset_order){
                        const value = $data.static_data.seasons.global_settings.preset_order.splice(start, 1)[0];
                        $data.static_data.seasons.global_settings.preset_order.splice(end, 0, value);
                        this.populatePresetSeasonList();
                    }

                },

                ensureSeasonColorsExist() {
                    for(const i in this.seasons) {
                        if(!this.seasons[i].color) {
                            this.seasons[i].color = [
                                '#000000',
                                '#FFFFFF'
                            ]
                        }
                    }
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
        @toggle-season-type.window="toggleSeasonType"
        @season-order-changed.window="seasonOrderChanged($event.detail)"
        @create-season-events.window="createSeasonEvents($event.detail.complex)"
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
                    <label class="custom-control custom-checkbox flexible" @click.prevent="querySwitchSeasonType">
                        <input type="checkbox" class="custom-control-input" x-model="settings.periodic_seasons">
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

        <div x-data="sortableList($data.static_data.seasons.data, 'seasons-sortable', 'season-order-changed')">

            <div class="row sortable-header no-gutters align-items-center" x-show="settings.periodic_seasons">
                <div x-show="!reordering" @click="reordering = true; deleting = null;" class="btn btn-outline-secondary p-1 border col-1 rounded text-center cursor-pointer"><i class="fa fa-sort"></i></div>
                <div x-show="reordering" @click="reordering = false;" class="btn btn-outline-secondary p-1 border col-1 rounded text-center cursor-pointer "><i class="fa fa-times"></i></div>
            </div>

            <div class="sortable list-group border-t border-gray-600" x-ref="seasons-sortable">
                <template x-for="(season, index) in seasons" x-ref="seasons-sortable-template">
                    <div class='sortable-container border-t -mt-px list-group-item draggable-source' :data-id="index">

                        <div class='main-container' x-show="deleting !== season">
                            <i class='handle icon-reorder' x-show="reordering"></i>
                            <i class='expand' x-show="!reordering" :class="expanded[index] ? 'icon-collapse' : 'icon-expand'" @click="expanded[index] = !expanded[index]"></i>
                            <div class="input-group">
                                <input class='name-input small-input form-control' :disabled="reordering" x-model="season.name" @input.debounce="populatePresetSeasonList()">
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

                            <div class='row no-gutters my-1' x-show="show_preset_order">
                                <div class='col-4 pt-1'>Season type:</div>
                                <div class='col'>
                                    <select type='number' class='form-control' x-model.number="settings.preset_order[index]" @change="presetOrderChanged(index)">
                                        <template x-for="(preset_season_name, preset_index) in preset_season_list">
                                            <option :selected="settings.preset_order[index] === preset_index" :value="preset_index" x-text="_.upperFirst(preset_season_name)"></option>
                                        </template>
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
                                {{-- TODO: We need to change this to a lazy change event instead, as constant model updates causes the calendar to re-render --}}
                                <x-color-picker input-class="form-control" model="season.color[0]" name="season_color_start"></x-color-picker>
                                <x-color-picker input-class="form-control" model="season.color[1]" name="season_color_start"></x-color-picker>
                            </div>

                            <div x-show="clock.enabled" @change="$dispatch('season-times-changed', { index: index })">

                                <div class='row no-gutters mt-2'>
                                    <div class='col-12'>Sunrise:</div>
                                </div>

                                <div class='row no-gutters sortable-header'>
                                    <div class='col-6 pr-1'>Hour</div>
                                    <div class='col-6 pl-1'>Minute</div>
                                </div>

                                <div class='mb-2 protip input-group' data-pt-position="right" data-pt-title="What time the sun rises at the peak of this season">
                                    <input type='number' step="1.0" class='form-control text-right' min="0" :max="clock.hours" x-model.number='season.time.sunrise.hour' />

                                    <div class="input-group-append">
                                        <span class="input-group-text border">:</span>
                                        <span class="input-group-text hidden">
                                                        <!-- Empty span is here to trick bootstrap into square-ifying the ':' above -->
                                        </span>
                                    </div>

                                    <input type='number' step="1.0" class='form-control text-left border-left-0' min="0" :max="clock.minutes" x-model.number='season.time.sunrise.minute' />
                                </div>

                                <div class='row no-gutters mt-2'>
                                    <div class='col-12 '>Sunset:</div>
                                </div>

                                <div class='row no-gutters sortable-header'>
                                    <div class='col-6 pr-1'>Hour</div>
                                    <div class='col-6 pl-1'>Minute</div>
                                </div>

                                <div class='mb-2 protip input-group' data-pt-position="right" data-pt-title="What time the sun sets at the peak of this season">
                                    <input type='number' step="1.0" class='form-control text-right' min="0" :max="clock.hours" x-model.number='season.time.sunset.hour' />

                                    <div class="input-group-append">
                                        <span class="input-group-text border">:</span>
                                        <span class="input-group-text hidden">
                                                        <!-- Empty span is here to trick bootstrap into square-ifying the ':' above -->
                                        </span>
                                    </div>

                                    <input type='number' step="1.0" class='form-control text-left border-left-0' min="0" :max="clock.minutes" x-model.number='season.time.sunset.minute' />
                                </div>

                                <div class='row no-gutters my-1' x-show="clock.enabled && seasons.length >= 3">
                                    <button type="button" @click="interpolateSeasons(index)" class="btn btn-sm btn-info full protip" data-pt-title="Use the median values from the previous and next seasons' time data. This season will act as a transition between the two, similar to Spring or Autumn">Interpolate sunrise & sunset from surrounding seasons</button>
                                </div>

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
            <button type='button' class='btn btn-secondary full' @click="queryCreateSeasonEvents()">Create solstice and equinox events</button>
        </div>

    </div>


</x-sidebar.collapsible>
