@extends('templates._calendar')

@push('head')
	<script>

		hash = getUrlParameter('id');

		preset_applied = false;
		calendar_name = '';
		owner = true;
		has_parent = false;
		is_linked = false;
		static_data = {
			"year_data":{
				"first_day":1,
				"overflow":true,
				"global_week":[],
				"timespans":[],
				"leap_days":[]
			},
			"moons":[],
			"clock":{
				"enabled":false,
				"render":false,
				"hours":24,
				"minutes":60,
				"offset":0,
				"crowding":0,
			},
			"seasons":{
				"data":[],
				"locations":[],
				"global_settings":{
					"season_offset":0,
					"weather_offset":0,
					"seed":Math.abs(Math.random().toString().substr(7)|0),
					"temp_sys":"metric",
					"wind_sys":"metric",
					"cinematic":false,
					"enable_weather":false,
					"periodic_seasons":false
				}
			},
			"eras":[],
			"settings":{
				"layout":"grid",
				"comments":"none",
				"show_current_month":false,
				"allow_view":true,
				"only_backwards":true,
				"only_reveal_today":false,
				"hide_moons":false,
				"hide_clock":false,
				"hide_events":false,
				"hide_eras":false,
				"hide_all_weather":false,
				"hide_future_weather":false,
				"add_month_number":false,
				"add_year_day_number":false,
				"default_category":-1,
			},
			"cycles":{
				"format":"",
				"data":[]
			}
		};

        preview_date = clone(dynamic_data);
        preview_date.follow = true;

		events = [];

		event_categories = [];

		randomizer = new RandomCalendar();

		dynamic_data = {
			"year": 1,
			"timespan": 0,
			"day": 1,
			"epoch": 0,
			"custom_location": false,
			"location": "Equatorial"
		};

		$(document).ready(function(){

			if(static_data){
				$('.date_inputs').toggleClass('hidden', static_data.year_data.global_week.length == 0 || static_data.year_data.timespans.length == 0);
				$('.date_inputs').find('select, input').prop('disabled', static_data.year_data.global_week.length == 0 || static_data.year_data.timespans.length == 0);
				$('#empty_calendar_explaination').toggleClass('hidden', !(static_data.year_data.global_week.length == 0 || static_data.year_data.timespans.length == 0));
			}

			set_up_edit_inputs(false);
			set_up_edit_values();

			bind_calendar_events();
			edit_event_ui.bind_events();
			edit_HTML_ui.bind_events();

			autoload();
			
		});

	</script>

@endpush

@section('content')
	<div id="generator_container" class="step-1" x-data="CalendarPresets">
		@include('layouts.presets')
		@include('layouts.day_data_tooltip')
		@include('layouts.weather_tooltip')
		@include('layouts.event')
		@include('inputs.sidebar.create')
	</div>
@endsection
