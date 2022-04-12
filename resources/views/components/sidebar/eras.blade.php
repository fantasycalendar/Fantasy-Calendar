@props([ "calendar" ])

@push("head")
    <script lang="js">

        function eraSection($data){

            return {


                newEraName: "",

                season_settings: $data.static_data.seasons.global_settings,
                eras: $data.static_data.eras,
                event_categories: $data.event_categories,

                deleting: null,
                expanded: {},

                add({ name, date }={}){
                    this.eras.push({
                        "name": name || `Era ${this.eras.length+1}`,
                        "formatting": "",
                        "description": "",
                        "settings": {
                            "show_as_event": false,
                            "use_custom_format": false,
                            "starting_era": false,
                            "event_category_id": -1,
                            "ends_year": false,
                            "restart": false
                        },
                        "date": date || {
                            "year": $data.dynamic_data.year,
                            "timespan": $data.dynamic_data.timespan,
                            "day": $data.dynamic_data.day,
                            "epoch": $data.dynamic_data.epoch
                        }
                    });
                    this.sortErasByDate();
                },

                remove(index){
                    this.eras.splice(index, 1);
                },

                sortErasByDate(){
                    // Map each expanded index to the era it represents
                    const expanded = Object.entries(clone(this.expanded)).filter(entry => entry[1]).map(entry => [entry[0], this.eras[entry[0]]])

                    // Sort the eras by year, month, and day, with starting eras always coming first
                    this.eras.sort((a, b) => {
                        if(a.settings.starting_era) return -1;
                        return ((a.date.year+100000) - (b.date.year+100000)) - ((a.date.timespan+1000) - (b.date.timespan+1000)) - (a.date.day - b.date.day);
                    });

                    // Map each era back to its new index so that the right era remains expanded
                    this.expanded = Object.fromEntries(expanded.map(entry => [this.eras.indexOf(entry[1]), true]));
                },

                editEventDescription(era){
                    /* TODO: refactor CalendarHTMLEditor to initialize with the calendar sidebar's root component,
                             which will enable CalendarHTMLEditor to be used to edit the era's description */
                }

            }

        }

    </script>
@endpush



<x-sidebar.collapsible
    class="settings-eras"
    name="eras"
    title="Eras"
    icon="fas fa-infinity"
    tooltip-title="Eras"
    helplink="eras"
>

    @if(request()->is('calendars/*/edit') && $calendar->isLinked())

        <ul class="list-group">

            @php
                $eras = Arr::get($calendar->static_data, 'eras');
            @endphp

            @foreach ($eras as $era)
                <li class="list-group-item">
                    <div class="d-flex justify-content-between align-items-center">
                        <strong>{{ $era['name'] }}</strong>
                        @if($era['settings']['starting_era'])
                            <small>Starting Era</small>
                        @endif
                    </div>
                    @if(!$era['settings']['starting_era'])
                        <div class='mt-2'>
                            Year: {{ $era['date']['year'] }}<br>
                            Month: {{ $era['date']['timespan']+1 }}<br>
                            Day: {{ $era['date']['day'] }}<br>
                        </div>
                    @endif
                </li>
            @endforeach

        </ul>

        <p class='mb-0 mt-3'><a onclick="linked_popup();" href='#'>Why can't I edit the eras?</a></p>

    @else

        <div x-data="eraSection($data)">

            <div class='row no-gutters bold-text'>
                <div class='col'>
                    New Era:
                </div>
            </div>

            <div class='add_inputs eras row no-gutters input-group'>
                <div class="col">
                    <input type='text' class='form-control name' placeholder='Era name' x-model="newEraName">
                </div>
                <div class="col-auto input-group-append">
                    <button type='button' class='btn btn-primary' @click="add({ name: newEraName })"><i class="fa fa-plus"></i></button>
                </div>
            </div>

            <div class="sortable list-group">
                <template x-for="(era, index) in eras">
                    <div class='sortable-container list-group-item'>

                        <div class='main-container' x-show="deleting !== era">
                            <i class='expand' :class="expanded[index] ? 'icon-collapse' : 'icon-expand'" @click="expanded[index] = !expanded[index]"></i>
                            <div class="input-group">
                                <input class='name-input small-input form-control' x-model="era.name">
                                <div class="input-group-append">
                                    <div class='btn btn-danger icon-trash' @click="deleting = era" x-show="deleting !== era"></div>
                                </div>
                            </div>
                        </div>

                        <div class='d-flex justify-content-between align-items-center w-100 px-1'>
                            <div class='btn_cancel btn btn-danger icon-remove' @click="deleting = null" x-show="deleting === era"></div>
                            <div class='remove-container-text' x-show="deleting === era">Are you sure?</div>
                            <div class='btn_accept btn btn-success icon-ok' @click="remove(index)" x-show="deleting === era"></div>
                        </div>

                        <div class='container pb-2' x-show="expanded[index] && deleting !== era">

                            <div class='row no-gutters my-1'>
                                <div class='form-check col-12 py-2 border rounded'>
                                    <input type='checkbox' :id='index + "_use_custom_format"' class='form-check-input' x-model="era.settings.use_custom_format"/>
                                    <label :for='index + "_use_custom_format"' class='form-check-label ml-1'>
                                        Custom year header formatting
                                    </label>
                                </div>
                            </div>

                            <div class='row mt-1'>
                                <div class='col'>
                                    Format:
                                    <input type='text' class='form-control small-input protip' x-model="era.formatting" :disabled="era.settings.use_custom_format" data-pt-position="right" data-pt-title="Check out the wiki on this by clicking on the question mark on the 'Eras' bar!"/>
                                </div>
                            </div>

                            <div class='row my-1 no-gutters'>
                                <div class='col'>
                                    <div class='separator'></div>
                                </div>
                            </div>

                            <div class='row no-gutters my-1'>
                                <div class='form-check col-12 py-2 border rounded'>
                                    <input type='checkbox' :id='index + "_show_as_event"' class='form-check-input' x-model='era.settings.show_as_event'/>
                                    <label :for='index + "_show_as_event"' class='form-check-label ml-1'>
                                        Show as event
                                    </label>
                                </div>
                            </div>

                            <div class='row my-2' x-show="era.settings.show_as_event">
                                <div class='col'>
                                    <div class='btn btn-outline-accent full era_description html_edit' @click="editEventDescription(era)">Edit event description</div>
                                </div>
                            </div>

                            <div class='era_event_category_container' x-show="era.settings.show_as_event">
                                <div class='row mt-2'>
                                    <div class='col'>
                                        Event category:
                                        <select type='text' class='custom-select form-control' x-model="era.settings.event_category_id">
                                            <template x-for="category in event_categories">
                                                <option :value="category.id" x-text="category.name"></option>
                                            </template>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div class='row my-1 no-gutters'>
                                <div class='col'>
                                    <div class='separator'></div>
                                </div>
                            </div>

                            <div class='row no-gutters my-1'>
                                <div class='form-check col-12 py-2 border rounded'>
                                    <input type='checkbox' :for='index + "_starting_era"' class='form-check-input' x-model='era.settings.starting_era'/>
                                    <label :for='index + "_starting_era"' class='form-check-label ml-1'>
                                        Is starting era (like B.C.)
                                    </label>
                                </div>
                            </div>

                            <div class='date_control_container' x-show="!era.settings.starting_era">

                                <div class='row my-2 '>
                                    <div class='col'>
                                        <strong>Date:</strong>

                                        <div class='date_control'>
                                            <div class='row my-2'>
                                                <div class='col'>
                                                    <input type='number' step="1.0" class='date form-control small-input' x-model='era.date.year' @change="sortErasByDate()"/>
                                                </div>
                                            </div>

                                            <div class='row my-2'>
                                                <div class='col'>
                                                    <select type='number' class='date custom-select form-control' x-model='era.date.timespan' @change="sortErasByDate()">
                                                        <template x-for="(timespan, index) in window.calendar.getTimespansInYear(era.date.year)">
                                                            <option :value="index" x-text="timespan.name"></option>
                                                        </template>
                                                    </select>
                                                </div>
                                            </div>

                                            <div class='row my-2'>
                                                <div class='col'>
                                                    <select type='number' class='date custom-select form-control' x-model='era.date.day'>
                                                        <template x-for="(day, index) in window.calendar.getDaysForTimespanInYear(era.date.year, era.date.timespan)" @change="sortErasByDate()">
                                                            <option :value="index+1" x-text="day"></option>
                                                        </template>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class='row my-2'>
                                    <div class='col'>
                                        <div class='btn btn-secondary full'>Preview era start date</div>
                                    </div>
                                </div>

                                <div class='row my-2 bold-text'>
                                    <div class='col'>
                                        Date settings:
                                    </div>
                                </div>

                                <div class='row no-gutters my-1'>
                                    <div class='form-check col-12 py-2 border rounded'>
                                        <input type='checkbox' :id='index + "_restart_year"' class='form-check-input' x-model='era.settings.restart' />
                                        <label :for='index + "_restart_year"' class='form-check-label ml-1'>
                                            Restarts year count
                                        </label>
                                    </div>
                                </div>

                                <div class='row no-gutters my-1'>
                                    <div class='form-check col-12 py-2 border rounded' :class="!season_settings.periodic_seasons ? 'disabled' : ''">
                                        <input type='checkbox' :id='index + "_ends_year"' class='form-check-input' :disabled="!season_settings.periodic_seasons" x-model='era.settings.ends_year' />
                                        <label :for='index + "_ends_year"' class='form-check-label ml-1'>
                                            Ends year prematurely
                                        </label>
                                        <p class='m-0 mt-2 ends_year_explaination font-italic small-text' x-show="!season_settings.periodic_seasons">This is disabled because you have seasons based on dates - that means that the calendar cannot end its years early because some seasons could disappear.</p>
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>
                </template>
            </div>

        </div>

    @endif


</x-sidebar.collapsible>