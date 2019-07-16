<?php

header('Cache-Control: no-cache');

$calendar_name = 'New Calendar';

$title = $calendar_name;

include('header.php');

?>

<script>

wizard = false;

hash = getUrlParameter('id');

calendar_name = 'New Calendar';
owner = true;
static_data = {
	"year_data":{
		"first_day":1,
		"overflow":false,
		"global_week":[],
		"timespans":[],
		"leap_days":[]
	},
	"moons":[],
	"clock":{
		"enabled":false,
		"hours":24,
		"minutes":60,
		"offset":0
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
			"enable_weather":false
		}
	},
	"eras":[],
	"settings":{
		"layout":"grid",
		"show_current_month":false,
		"show_era_abbreviation":false,
		"allow_view":false,
		"only_backwards":false,
		"only_reveal_today":false,
		"hide_moons":false,
		"hide_clock":false,
		"hide_events":false,
		"hide_eras":false,
		"hide_all_weather":false,
		"hide_future_weather":false,
		"add_month_number":false,
		"add_year_day_number":false
	},
	"cycles":{
		"format":"",
		"data":[]
	},
	"event_data":{
		"categories":[],
		"events":[]
	}
};

dynamic_data = {
	"year": 1,
	"timespan": 0,
	"day": 1,
	"epoch": 0,
	"custom_location": false,
	"location": "Equatorial"
};

link_data = {
	master_hash: "",
	children: []
};

get_session_data(function(result){

	if(result.success){

		static_data = JSON.parse(result.static_data);
		dynamic_data = JSON.parse(result.dynamic_data);

		if(!result.children){
			result.children = [];
		}else{
			link_data.children = JSON.parse(result.children);
		}

		set_up_edit_inputs(true);
		bind_calendar_events();
		rebuild_calendar('calendar', dynamic_data);
		
	}else{

		set_up_edit_inputs(false);
		bind_calendar_events();

	}

	edit_event_ui.bind_events();
	edit_HTML_ui.bind_events();

});

$(document).ready(function(){
	var html = [];
	for(var i = 0; i < Object.keys(calendar_presets).length; i++){
		var name = Object.keys(calendar_presets)[i];
		var preset = calendar_presets[name];
		html.push(`<option>${name}</option>`)
	}
	$('#presets').append(html.join(''));

	$('#presets').change(function(){
		$('#json_container').toggleClass('hidden', true);
		$('#json_input').val('');
		$('#json_apply').prop('disabled', $(this).val() === 'Presets');
		if($(this).val() == 'Custom JSON'){
			$('#json_container').toggleClass('hidden', false);
		}
	});

	$('#json_apply').click(function(){
		if($('#presets').val() == 'Custom JSON'){
			var calendar = parse_json($('#json_input').val());
			if(calendar){
			    prev_dynamic_data = {}
			    prev_static_data = {}
				dynamic_data = calendar.dynamic_data;
				static_data = calendar.static_data;
				empty_edit_values();
				set_up_edit_values();
				$('#json_input').val('');
			}else{
				alert("Unrecognized JSON format.")
			}
		}else{
			dynamic_data = calendar_presets[$('#presets').val()].dynamic_data;
			static_data = calendar_presets[$('#presets').val()].static_data;
			empty_edit_values();
			set_up_edit_values();
		}
	});

});

</script>

<div id="generator_container">

	<?php

	include('modules/calendar/includes/layouts/weather_tooltip_layout.html');
	include('modules/calendar/includes/layouts/event_layout.html');
	include('modules/calendar/includes/inputs/full_inputs.php');

	?>

</div>



<?php

include('footer.php');

?>