<?php

header('Cache-Control: no-cache');

$calendar_name = $calendar_data['calendar_name'];

if(isset($_SESSION['user_id']) && $_SESSION['user_id'] == $calendar_data['owner']){
	$owner = "true";
}else{
	$owner = "false";
}

$title = $calendar_name;

include('header.php');

?>

<script>

hash = getUrlParameter('id');

calendar_name = "<?php echo $calendar_data['calendar_name'] ?>";
owner = <?php echo $owner ?>;
static_data = {};
dynamic_data = {};
link_data = {
	master_hash: "",
	children: []
};

get_all_data(function(result){

	static_data = JSON.parse(result.static_data);
	dynamic_data = JSON.parse(result.dynamic_data);

	last_static_change = new Date(result.last_static_change)
	last_dynamic_change = new Date(result.last_dynamic_change)

	if(!result.children){
		result.children = [];
	}else{
		link_data.children = JSON.parse(result.children);
	}

	link_data.master_hash = result.master_hash;

	set_up_view_inputs();
	bind_calendar_events();
	rebuild_calendar('calendar', dynamic_data);

	timer = setTimeout(function(){
		check_last_change(function(output){
			check_dates(output);
		})
	}, 100);
	
	$(window).focus(function() {
		if(!timer)
			check_last_change(function(output){
				check_dates(output);
			});
			timer = setTimeout(function(){
				check_last_change(function(output){
					check_dates(output);
				});
			}, 2500);
	});

	$(window).blur(function() {
		clearTimeout(timer);
		timer = 0;
	});

	$('#current_year, #current_timespan, #current_day, #current_hour, #current_minute, #location_select').change(function(){
		do_update_dynamic();
	});

	var do_update_dynamic = debounce(function(type){
		update_dynamic();
	}, 250);

});

function check_dates(output){

	new_static_change = new Date(output.last_static_change)
	new_dynamic_change = new Date(output.last_dynamic_change)

	if(new_static_change > last_static_change){

		get_all_data(function(output){

			static_data = JSON.parse(result.static_data);
			dynamic_data = JSON.parse(result.dynamic_data);

			last_static_change = new Date(result.last_static_change)
			last_dynamic_change = new Date(result.last_dynamic_change)
	
			set_up_view_values();

			set_date(dynamic_data.year, dynamic_data.timespan, dynamic_data.day);

		});

	}else if(new_dynamic_change > last_dynamic_change){

		get_dynamic_data(function(output){

			dynamic_data = JSON.parse(output.dynamic_data);

			last_dynamic_change = new_dynamic_change;
	
			set_up_view_values();

			set_date(dynamic_data.year, dynamic_data.timespan, dynamic_data.day);

		});

	}

}



</script>

<div id="generator_container">

	<?php

	include('modules/calendar/includes/layouts/weather_tooltip_layout.html');
	include('modules/calendar/includes/layouts/event_layout.html');
	include('modules/calendar/includes/inputs/view_inputs.php');

	?>

</div>


<?php

include('footer.php');

?>