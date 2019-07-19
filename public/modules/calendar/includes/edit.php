<?php

header('Cache-Control: no-cache');

$calendar_name = $calendar_data['calendar_name'];

if(isset($_SESSION['user_id']) && $calendar_data['owner'] || $_SESSION['permission'] == "Admin"){
	$owner = "true";
}else{
	$owner = "false";
}

$title = $calendar_name;

include('header.php');

?>

<script>

wizard = false;

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

	set_up_edit_inputs(true);
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