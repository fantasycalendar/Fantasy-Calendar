@props(['calendar' => null])

<div class='row bold-text'>
    <div class='col'>
        Season type:
    </div>
</div>

<div class='border rounded mb-2'>
    <div class='row protip py-1 px-2 flex-column flex-md-row align-items-center'
         data-pt-position="right"
         data-pt-title='This toggles between having seasons starting on specific dates, or having the seasons last an exact duration with the potential to overflow years.'>
        <div class='col-12 col-md-5 pr-md-0 text-center season_text dated'>
            Date Based
        </div>
        <div class='col-12 col-md-2 px-md-0 text-center'>
            <label class="custom-control custom-checkbox flexible">
                <input type="checkbox" class="custom-control-input" :checked="settings.periodic_seasons" @click.prevent="switchPeriodicSeason">
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
        <input type='checkbox' class='form-check-input' id="season_color_enabled" :checked="settings.color_enabled" @change="seasonColorChanged"/>
        <label for='season_color_enabled' class='form-check-label ml-1'>
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
    <div class='input-group'>
        <input type='text' class='form-control' placeholder='Season name' x-model="season_name">
        <div class="input-group-append">
            <button type='button' class='btn btn-primary' @click="addSeason"><i class="fa fa-plus"></i></button>
        </div>
    </div>
</div>

<div class='sortable list-group my-2' x-ref="seasons-sortable">
    <template x-for="(season, index) in seasons" x-ref="seasons-sortable-template">

        <div class='sortable-container list-group-item collapsible p-2 first-of-type:rounded-t'
             x-data="{ collapsed: true }"
             :class="{'collapsed': collapsed}">

            <div class='flex items-center w-full gap-x-2' x-show="deleting !== index">
                <div class='handle fa fa-bars' x-show="settings.periodic_seasons"></div>
                <div class='cursor-pointer text-xl fa'
                     :class="{ 'fa-caret-square-up': !collapsed, 'fa-caret-square-down': collapsed }"
                     @click="collapsed = !collapsed"></div>
                <input type='text' class='name-input small-input form-control' x-model.lazy='season.name'/>
                <button class="btn btn-danger w-10" @click="deleting = index">
                    <i class="fa fa-trash text-lg"></i>
                </button>
            </div>

            <div x-show="deleting === index" class="flex items-center w-full gap-x-2.5" x-cloak>
                <button class="btn btn-success w-10 !px-0 text-center" @click="removeSeason(index)">
                    <i class="fa fa-check text-lg"></i>
                </button>

                <div class="flex-grow">Are you sure?</div>

                <button class="btn btn-danger w-10 !px-0 text-center" @click="deleting = -1">
                    <i class="fa fa-times text-lg"></i>
                </button>
            </div>

            <div class='collapse-container container mb-2'>
                <div class='row no-gutters my-1' x-show="presetSeasons.length">
                    <div class='col-4 pt-1'>Season type:</div>
                    <div class='col'>
                        <select type='number' class='form-control preset-season-list' @change='handlePresetOrderChanged($event, index)'>
                            <template x-for="(name, preset_index) of presetSeasons">
                                <option :value="preset_index" :selected="preset_index === settings.preset_order[index]" x-text="name"></option>
                            </template>
                        </select>
                    </div>
                </div>

                <div class='row no-gutters mt-2' x-show="settings.periodic_seasons">
                    <div class='col-md-6 col-sm-12 pl-0 pr-1'>
                        Duration:
                        <input type='number' step='any' class='form-control protip'
                               x-model.lazy='season.transition_length' min='1'
                               data-pt-position="right"
                               data-pt-title='How many days until this season ends, and the next begins.'/>
                    </div>
                    <div class='col-md-6 col-sm-12 pl-1 pr-0'>
                        Peak duration:
                        <input type='number' step='any' class='form-control protip'
                               x-model.lazy='season.duration' min='0' data-pt-position="right"
                               data-pt-title='If the duration is the path up a mountain, the peak duration is a flat summit. This is how many days the season will pause before going down the other side of the mountain.'/>
                    </div>
                </div>

                <div class='date_control full' x-show="!settings.periodic_seasons">
                    <div class='row no-gutters my-1'>
                        <div class='col-4 pt-1'>Month:</div>
                        <div class='col'>
                            <select type='number' class='form-control' x-model='season.timespan'>
                                {{-- TODO: Figure out why x-model doesn't work here, have to use :selected --}}
                                <template x-for="(month, month_index) in months">
                                    <option :value="month_index" :selected="month_index === season.timespan" x-text="month.name"></option>
                                </template>
                            </select>
                        </div>
                    </div>
                    <div class='row no-gutters my-1'>
                        <div class='col-4 pt-1'>Day:</div>
                        <div class='col'>
                            <select type='number' class='form-control' x-model.lazy='season.day'>
                                {{-- TODO: Create day list based on selected month above, with no leap days --}}
                            </select>
                        </div>
                    </div>
                </div>
                <template x-if="settings.color_enabled">
                    <div class='mt-1 p-2 border rounded'>
                        <div class='row no-gutters'>
                            <div class='col-6 pr-1'>Start color:</div>
                            <div class='col-6 pl-1'>End color:</div>
                        </div>
                        <div class='row no-gutters my-1'>
                            <div class='col-6 pr-1'>
                                <input type='color' class='form-control full' :value="season.color[0]" @change="season.color[0] = $event.target.value;"/>
                            </div>
                            <div class='col-6 pl-1'>
                                <input type='color' class='form-control full' :value='season.color[1]' @change="season.color[1] = $event.target.value;"/>
                            </div>
                        </div>
                    </div>
                </template>
                <div class='clock_inputs' x-show="clock.enabled">
                    <div class='row no-gutters mt-2'>
                        <div class='col-12'>Sunrise:</div>
                    </div>
                    <div class='row no-gutters sortable-header'>
                        <div class='col-6 pr-1'>
                            Hour
                        </div>
                        <div class='col-6 pl-1'>
                            Minute
                        </div>
                    </div>
                    <div class='row no-gutters mb-2 protip' data-pt-position="right"
                         data-pt-title="What time the sun rises at the peak of this season">
                        <div class='col-6 pr-1 clock-input'>
                            <input type='number' step="1.0" class='form-control full' x-model.lazy='season.time.sunrise'/>
                        </div>
                        <div class='col-6 pl-1 clock-input'>
                            <input type='number' step="1.0" class='form-control full' x-model.lazy='season.time.sunrise'/>
                        </div>
                    </div>
                    <div class='row no-gutters mt-2'>
                        <div class='col-12 '>Sunset:</div>
                    </div>
                    <div class='row no-gutters sortable-header'>
                        <div class='col-6 pr-1'>
                            Hour
                        </div>
                        <div class='col-6 pl-1'>
                            Minute
                        </div>
                    </div>
                    <div class='row no-gutters mb-2 protip' data-pt-position="right"
                         data-pt-title="What time the sun sets at the peak of this season">
                        <div class='col-6 pr-1 clock-input'>
                            <input type='number' step="1.0" class='form-control full' x-model.lazy='season.time.sunset'/>
                        </div>
                        <div class='col-6 pl-1 clock-input'>
                            <input type='number' step="1.0" class='form-control full' x-model.lazy='season.time.sunset'/>
                        </div>
                    </div>
                    <div class='row no-gutters my-1'>
                        <button type="button" class="btn btn-sm btn-info season_middle_btn full protip"
                                data-pt-delay-in="100"
                                data-pt-title="Use the median values from the previous and next seasons' time data. This season will act as a transition between the two, similar to Spring or Autumn"
                                @click="interpolateSeasonTimes(index)">
                            Interpolate sunrise & sunset from surrounding seasons
                        </button>
                    </div>
                </div>
            </div>

    </template>
</div>

<div class='my-1 small-text container' x-show="settings.periodic_seasons && seasons.length">
    <div class='row py-1'>
        <i class="col-auto px-0 mr-1 fas"
           :class="{ 'a-check-circle': show_equal_season_length, 'fa-exclamation-circle': !show_equal_season_length }"
           style="line-height:1.5;"></i>
        <div class='col px-0' x-text="season_length_text"></div>
    </div>
    <div class='row' x-text="season_subtext"></div>
</div>

<div class='my-1 small-text container' :class="{ 'warning': show_location_season_warning }"
     x-show="show_location_season_warning">
    <div class='row py-1'>
        <i class="col-auto px-0 mr-2 fas fa-exclamation-circle" style="line-height:1.5;"></i>
        <div class='col px-0'>
            You are currently using a custom location with custom season sunrise and sunset times. Solstices and
            equinoxes may behave unexpectedly.
        </div>
    </div>
</div>

<div class='container' x-show="settings.periodic_seasons">
    <div class='row mt-2'>
        Season offset (days):
    </div>
    <div class='row mb-2'>
        <input class='form-control' type='number' x-model.lazy="settings.season_offset"/>
    </div>
</div>

<div>
    <button type='button' class='btn btn-secondary full' @click="createSeasonEvents">
        Create solstice and equinox events
    </button>
</div>
