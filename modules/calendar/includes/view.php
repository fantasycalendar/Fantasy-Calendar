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


data = {
	name: "<?php echo $calendar_data['calendar_name'] ?>",
	dynamic_data: <?php echo $calendar_data['dynamic_data']; ?>,
	static_data: <?php echo $calendar_data['static_data']; ?>
};
last_dynamic_change = new Date("<?php echo $calendar_data['last_dynamic_change']; ?>");
last_static_change = new Date("<?php echo $calendar_data['last_static_change']; ?>");

owner = <?php echo $owner ?>;
static_data = {};
dynamic_data = {};

$(document).ready(function(){

	reload_calendar(data);
	set_up_edit_inputs();
	bind_calendar_events();
	rebuild_calendar('calendar', dynamic_data);

	timer = setTimeout('check_last_change_forced()', 100);
	
	$(window).focus(function() {
		if(!timer)
			timer = setTimeout('check_last_change_forced()', 1500);
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