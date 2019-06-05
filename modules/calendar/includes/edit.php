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