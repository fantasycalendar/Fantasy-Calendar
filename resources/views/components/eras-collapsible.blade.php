@props(['calendar' => null])

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

	<div class='row no-gutters bold-text'>
		<div class='col'>
			New Era:
		</div>
	</div>

	<div class='add_inputs eras row no-gutters'>
		<div class="input-group">
			<input type='text' class='form-control name' id='era_name_input' placeholder='Era name'>
			<div class="input-group-append">
				<button type='button' class='btn btn-primary add'><i class="fa fa-plus"></i></button>
			</div>
		</div>
	</div>

	<div class='sortable' id='era_list'></div>

@endif
