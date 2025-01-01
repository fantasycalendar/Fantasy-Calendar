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
                <input type="checkbox" class="custom-control-input" @click.prevent="switchPeriodicSeason">
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
        <input type='checkbox' class='form-check-input' x-model.lazy="settings.color_enabled"/>
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

<div class='sortable' id='season_sortable'></div>

<div class='my-1 small-text container' x-show="settings.periodic_seasons && seasons.length">
    <div class='row py-1'>
        <i class="col-auto px-0 mr-1 fas"
           :class="{ 'a-check-circle': show_equal_season_length, 'fa-exclamation-circle': !show_equal_season_length }"
           style="line-height:1.5;"></i>
        <div class='col px-0' x-text="season_length_text"></div>
    </div>
    <div class='row' x-text="season_subtext"></div>
</div>

<div class='my-1 small-text container' :class="{ 'warning': show_equal_season_length }"
     x-show="show_equal_season_length">
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
