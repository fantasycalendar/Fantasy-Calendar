@props(['calendar' => null])

@if(request()->is('calendars/*/edit') && $calendar->isLinked())

	<ul class="list-group">

		@php
			$leap_days = Arr::get($calendar->static_data, 'year_data.leap_days');
		@endphp

		@foreach ($leap_days as $leap_day)
			<li class="list-group-item">
				<div class="d-flex justify-content-between align-items-center">
					<strong>{{ $leap_day['name'] }}</strong>
					<small>{{ $leap_day['intercalary'] ? "Intercalary" : "" }}</small>
				</div>
				<div class='mt-2'>
					Interval: {{ str_replace(",", ", ", $leap_day['interval']) }}
				</div>
				<div>
					Offset: {{ $leap_day['offset'] }}
				</div>
				@if($leap_day['intercalary'])
					<div>
						@if($leap_day['day'] == 0)
							Added before day 1
						@else
							Added after day {{ $leap_day['day'] }}
						@endif
					</div>
				@else
					@if($leap_day['adds_week_day'])
						<div>
							Adds a weekday named: {{ $leap_day['week_day'] }}
						</div>
					@endif
				@endif
			</li>
		@endforeach

	</ul>

	<p class='mb-0 mt-3'><a onclick="linked_popup();" href='#'>Why can't I edit the leap days?</a></p>

@else

	<div class='row bold-text'>
		<div class="col">
			New leap day:
		</div>
	</div>

	<div class='add_inputs leap input-group'>
		<input type='text' id='leap_day_name_input' class='form-control name' placeholder='Name'>

		<select id='leap_day_type_input' class='custom-select form-control type'>
			<option selected value='leap-day'>Normal day</option>
			<option value='intercalary'>Intercalary</option>
		</select>

		<div class='input-group-append'>
			<button type='button' class='btn btn-primary add full'><i class="fa fa-plus"></i></button>
		</div>
	</div>


	<div class="row">
		<div style='font-style: italic; margin-left:3.5rem'>Name</div>
	</div>

	<div id='leap_day_list'></div>

@endif
