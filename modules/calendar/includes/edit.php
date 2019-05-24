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

<script src="calendar_json_02.json?ver=<?php echo $jsversion; ?>"></script>

<script>

function reload_calendar(data){
	calendar		= data.structure;
	calendar.name	= data.name;
	date 			= data.date;
}

function update_date(new_date){
	if(date.year != new_date.year){
		date = new_date;
		rebuild_calendar('calendar', date);
	}else if(date.timespan != new_date.timespan){
		if(calendar.settings.show_current_month){
			rebuild_calendar('calendar', date);
		}else{
			date = new_date;
			update_epoch(true);
		}
	}else if(date.day != new_date.day){
		date.epoch += (new_date.day-date.day);
		date = new_date;
		update_epoch(false);
	}else{
		date = new_date;
	}
}

hash = getUrlParameter('id');

/*data = {};
data.name = "<?php echo $calendar_data['calendar_name'] ?>";
data.date = JSON.parse(<?php echo json_encode($calendar_data['date']); ?>);
data.structure = JSON.parse(<?php echo json_encode($calendar_data['structure']); ?>);*/
last_date_changed = new Date("<?php echo $calendar_data['last_date_changed']; ?>");
last_structure_changed = new Date("<?php echo $calendar_data['last_structure_changed']; ?>");
owner = <?php echo $owner ?>;

$(document).ready(function(){
	//reload_calendar(data);
	set_up_edit_inputs();
	bind_calendar_events();
	rebuild_calendar('calendar', date);
	edit_event_ui.bind_events();
	edit_HTML_ui.bind_events();
	//edit_event_ui.set_current_event(0);

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