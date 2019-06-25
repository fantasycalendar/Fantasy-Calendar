<?php

header('Cache-Control: no-cache');

$calendar_name = 'New Calendar';

$owner = "true";

$title = $calendar_name;

include('header.php');

?>

<script>

hash = getUrlParameter('id');

calendar_name = 'New Calendar';
owner = <?php echo $owner ?>;
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
			"seed":(Math.random().toString().substr(7)|0),
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
	"month": 0,
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

		set_up_edit_inputs();
		bind_calendar_events();
		rebuild_calendar('calendar', dynamic_data);
		
	}else{

		set_up_edit_inputs();
		bind_calendar_events();

	}

	edit_event_ui.bind_events();
	edit_HTML_ui.bind_events();

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