@props(['calendar' => null])

<div id='locations_warning' class='row no-gutters mb-2'>
	You need weather enabled (temperatures, precipitation) or the clock enabled (timezone,
	sunrise/sunset) for locations to function.
</div>

<div class='row no-gutters'>
	<p class="m-0">Preset locations work only with four or two seasons and weather enabled.</p>
	<p><small>If you name your seasons winter, spring, summer, and autumn/fall, the system matches them
			with the presets' seasons, no matter which order.</small></p>
</div>

<div id='locations_warning_hidden' class='hidden'>

	<div class='row no-gutters bold-text'>
		Current location:
	</div>
	<div class='row no-gutters mb-2'>
		<select class='form-control' id='location_select'>
		</select>
	</div>
	<div class='row no-gutters my-2'>
		<input type='button' value='Copy current location' class='btn btn-info full'
					 id='copy_location_data'>
	</div>

	<div class='row no-gutters my-2'>
		<div class='separator'></div>
	</div>

	<div class='row no-gutters bold-text'>
		<div class='col'>
			New location:
		</div>
	</div>

	<div class='row no-gutters add_inputs locations input-group'>
		<input type='text' class='form-control name' id='location_name_input'
					 placeholder='Location name'>
		<div class="input-group-append">
			<button type='button' class='btn btn-primary add'><i class="fa fa-plus"></i></button>
		</div>
	</div>

	<div class='sortable' id='location_list'></div>

</div>
