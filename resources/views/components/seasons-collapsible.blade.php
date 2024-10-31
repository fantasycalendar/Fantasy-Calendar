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
				<input type="checkbox" class="custom-control-input" id='periodic_seasons_checkbox'>
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
		<input type='checkbox' id='season_color_enabled' refresh="true"
					 class='form-check-input static_input' data="seasons.global_settings"
					 fc-index="color_enabled"/>
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
		<input type='text' class='form-control name' id='season_name_input' placeholder='Season name'>
		<div class="input-group-append">
			<button type='button' class='btn btn-primary add'><i class="fa fa-plus"></i></button>
		</div>
	</div>
</div>

<div class='sortable' id='season_sortable'></div>

<div class='my-1 small-text' id='season_length_text'></div>

<div class='my-1 small-text warning' id='season_daylength_text'></div>

<div class='container season_offset_container'>
	<div class='row mt-2'>
		Season offset (days):
	</div>
	<div class='row mb-2'>
		<input class='form-control static_input' type='number' data='seasons.global_settings'
					 fc-index='season_offset'/>
	</div>
</div>

<div>
	<button type='button' class='btn btn-secondary full' id='create_season_events'>Create solstice and
		equinox events
	</button>
</div>
