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

			$('#preset_select').change(function(){
				$('#json_container').toggleClass('hidden', true);
				$('#json_input').val('');
				$('#json_apply').prop('disabled', $(this).val() === 'Presets');
				if($(this).val() == 'Custom JSON'){
					$('#json_container').toggleClass('hidden', false);
				}
			});

			$('#json_apply').click(function(){
				if($('#preset_select').val() == 'Custom JSON'){
					var calendar = parse_json($('#json_input').val());
					if(calendar){
						prev_dynamic_data = {}
						prev_static_data = {}
						calendar_name = clone(calendar.name);
						static_data = clone(calendar.static_data);
						dynamic_data = clone(calendar.dynamic_data);
						dynamic_data.epoch = evaluate_calendar_start(static_data, convert_year(static_data, dynamic_data.year), dynamic_data.timespan, dynamic_data.day).epoch;
						empty_edit_values();
						set_up_edit_values();
						set_up_view_values();
						set_up_visitor_values();
						$('#json_input').val('');
						do_error_check('calendar', true);
					}else{
						alert("Unrecognized JSON format.")
					}
				}else if($('#preset_select').val() == 'Random Calendar'){

					swal.fire({
						title: "Are you sure?",
						text: `This will randomly generate new weekdays, months, leap days, moons, and seasons which will override what you have, are you sure you want to do this?`,
						showCancelButton: true,
						confirmButtonColor: '#3085d6',
						cancelButtonColor: '#d33',
						confirmButtonText: 'Generate',
						icon: "warning",
					})
					.then((result) => {
						if(result.value) {

							calendar_name = "Random Calendar";
							static_data = randomizer.randomize(static_data);
							dynamic_data = {
								"year": 1,
								"timespan": 0,
								"day": 1,
								"epoch": 0,
								"custom_location": false,
								"location": "Equatorial"
							};
							empty_edit_values();
							set_up_edit_values();
							set_up_view_values();
							set_up_visitor_values();
							do_error_check('calendar', true);
						}
					});

				}else{

					if(preset_applied){
						swal.fire({
							title: "Are you sure?",
							text: `Applying this preset will overwrite all of your current progress.`,
							showCancelButton: true,
							confirmButtonColor: '#3085d6',
							cancelButtonColor: '#d33',
							confirmButtonText: 'Yes',
							icon: "warning",
						})
						.then((result) => {
							if(result.value) {
								get_preset_data($('#preset_select').val(), apply_preset);
							}
						});
					}else{
					
						get_preset_data($('#preset_select').val(), apply_preset);

					}
				}
			});

		});

		function apply_preset(data){
			preset_applied = true;
			calendar_name = data.name;
			static_data = data.static_data;
			dynamic_data = data.dynamic_data;
			events = data.events;
			event_categories = data.categories;
			dynamic_data.epoch = evaluate_calendar_start(static_data, convert_year(static_data, dynamic_data.year), dynamic_data.timespan, dynamic_data.day).epoch;
			empty_edit_values();
			set_up_edit_values();
			set_up_view_values();
			set_up_visitor_values();
			$('#preset_select').val('Presets');
			do_error_check('calendar', true);
			evaluate_save_button();
			do_error_check();
			$.notify(
				"Calendar preset loaded!",
				"success"
			);
		}

	</script>
@endpush

@section('content')
	<div id="generator_container" class="step-1">
		@include('layouts.day_data_tooltip')
		@include('layouts.weather_tooltip')
		@include('layouts.event')
		@include('inputs.sidebar.create')
	</div>
@endsection
