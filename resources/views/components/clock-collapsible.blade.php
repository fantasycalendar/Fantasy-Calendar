@props(['calendar' => null])

<div class='row'>
	<div class='col-3 bold-text'>Enable:</div>
	<div class='col-3 text-right'>
		@if(request()->is('calendars/*/edit') && $calendar->isLinked())
			{{ Arr::get($calendar->static_data, 'clock.enabled') ? "Yes" : "No" }}
		@else
			<label class="custom-control custom-checkbox center-text">
				<input type="checkbox" class="custom-control-input static_input" id='enable_clock'
							 data='clock' fc-index='enabled'>
				<span class="custom-control-indicator"></span>
			</label>
		@endif
	</div>
	<div class='render_clock col-3 bold-text'>Render:</div>
	<div class='render_clock col-3 text-right'>
		<label class="custom-control custom-checkbox center-text">
			<input type="checkbox" class="custom-control-input static_input" id='render_clock'
						 refresh='clock' data='clock' fc-index='render'>
			<span class="custom-control-indicator"></span>
		</label>
	</div>
</div>

<div class='clock_inputs'>

	<div class='row mt-2'>
		<div class='col-6 bold-text'>
			Hours:
		</div>
		<div class='col-6 pl-0 bold-text'>
			Minutes:
		</div>
	</div>

	<div class='row mb-2'>
		<div class='col-6 input-group'>
			@if(request()->is('calendars/*/edit') && $calendar->isLinked())
				{{ Arr::get($calendar->static_data, 'clock.hours') }}
			@else
				<div class='input-group-prepend'>
					<button type='button' class='btn btn-sm btn-danger'
									onclick='adjustInput(this, "#clock_hours", -1);'><i class="fa fa-minus"></i>
					</button>
				</div>
				<input class='form-control form-control-sm static_input' min='1' id='clock_hours'
							 data='clock' fc-index='hours' type='number'>
				<div class='input-group-append'>
					<button type='button' class='btn btn-sm btn-success'
									onclick='adjustInput(this, "#clock_hours", +1);'><i class="fa fa-plus"></i>
					</button>
				</div>
			@endif
		</div>

		<div class='col-6 input-group pl-0'>
			@if(request()->is('calendars/*/edit') && $calendar->isLinked())
				{{ Arr::get($calendar->static_data, 'clock.minutes') }}
			@else
				<div class='input-group-prepend'>
					<button type='button' class='btn btn-sm btn-danger'
									onclick='adjustInput(this, "#clock_minutes", -1);'><i
							class="fa fa-minus"></i></button>
				</div>
				<input class='form-control form-control-sm static_input' min='1' id='clock_minutes'
							 data='clock' fc-index='minutes' type='number'>
				<div class='input-group-append'>
					<button type='button' class='btn btn-sm btn-success'
									onclick='adjustInput(this, "#clock_minutes", +1);'><i class="fa fa-plus"></i>
					</button>
				</div>
			@endif
		</div>

	</div>

	<div class='row mt-2 do_render_clock'>
		<div class='col-6 bold-text'>
			Offset hours:
		</div>
		<div class='col-6 pl-0 bold-text'>
			Crowding:
		</div>
	</div>

	<div class='row mb-1 do_render_clock'>

		<div class='col-6 input-group'>
			<div class='input-group-prepend'>
				<button type='button' class='btn btn-sm btn-danger'
								onclick='adjustInput(this, "#clock_offset", -1);'><i class="fa fa-minus"></i>
				</button>
			</div>

			<input class='form-control form-control-sm static_input' id='clock_offset' refresh='clock'
						 data='clock' fc-index='offset' type='number'>

			<div class='input-group-append'>
				<button type='button' class='btn btn-sm btn-success'
								onclick='adjustInput(this, "#clock_offset", +1);'><i class="fa fa-plus"></i>
				</button>
			</div>
		</div>

		<div class='col-6 pl-0 input-group'>
			<div class='input-group-prepend'>
				<button type='button' class='btn btn-sm btn-danger'
								onclick='adjustInput(this, "#clock_crowding", -1);'><i class="fa fa-minus"></i>
				</button>
			</div>

			<input class='form-control form-control-sm static_input' min='0' id='clock_crowding'
						 refresh='clock' data='clock' fc-index='crowding' type='number'>

			<div class='input-group-append'>
				<button type='button' class='btn btn-sm btn-success'
								onclick='adjustInput(this, "#clock_crowding", +1);'><i class="fa fa-plus"></i>
				</button>
			</div>
		</div>

	</div>


</div>

@if(request()->is('calendars/*/edit') && $calendar->isLinked())
	<p class="mb-0 mt-3"><a onclick="linked_popup();" href='#'>Why can't I edit the clock?</a></p>
@endif
