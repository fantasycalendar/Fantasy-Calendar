@props(['calendar' => null])


<div id='no_seasons_container' class='row no-gutters'>
	You need at least one season for weather to function.
</div>

<div id='has_seasons_container' class='hidden'>

	<div class='row no-gutters'>
		<div class='col-8'>Enable weather:</div>
		<div class='col-4 text-right'>
			<label class="custom-control custom-checkbox">
				<input type="checkbox" class="custom-control-input" x-model='weather.enable_weather'>
				<span class="custom-control-indicator"></span>
			</label>
		</div>
	</div>

	<div x-show="weather.enable_weather">

		<div class='row no-gutters my-2 small-text'>
			Custom weather can be configured in locations.
		</div>


		<div class='row my-2'>
			<div class='col'>
				Weather offset (days):
				<input class='form-control' :value='weather.weather_offset' type='number'
               @change='weather.weather_offset = Math.floor(Number($event.target.value))'/>
			</div>
		</div>

		<div class="row no-gutters mt-2">
			<div class="col-6">Temperature system:</div>
			<div class="col-6">Wind system:</div>
		</div>

		<div class='row no-gutters my-1 input-group'>
			<select class='custom-select form-control' x-model='weather.temp_sys'>
				<option selected value='metric'>Metric</option>
				<option value='imperial'>Imperial</option>
				<option value='both_m'>Both (inputs metric)</option>
				<option value='both_i'>Both (inputs imperial)</option>
			</select>
			<select class='custom-select form-control type' x-model='weather.wind_sys'>
				<option selected value='metric'>Metric</option>
				<option value='imperial'>Imperial</option>
				<option value='both'>Both</option>
			</select>
		</div>

		<div class='row no-gutters my-2 protip align-items-center' data-pt-position="right"
				 data-pt-title="In addition of the temperature being shown, you'll also see the description for the temperature of that particular day.">
			<div class='col-8'>Cinematic temperature description:</div>
			<div class='col-4 text-right'>
				<label class="custom-control custom-checkbox">
					<input type="checkbox" class="custom-control-input" x-model='weather.cinematic'/>
					<span class="custom-control-indicator"></span>
				</label>
			</div>
		</div>


		<div class='row no-gutters'>
			<div class='col-auto'>Weather generation seed:</div>
		</div>
		<div class='row no-gutters input-group'>
			<input type='number' id='seasons_seed' class='form-control' x-model='weather.seed'/>
			<div class="input-group-append">
				<div class='btn btn-primary' id='reseed_seasons'><i class="fa fa-redo"></i></div>
			</div>
		</div>
	</div>
</div>
