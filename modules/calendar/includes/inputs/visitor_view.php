<script>

function reload_calendar(data){
	calendar 	  = data.structure;
	calendar.name = data.name;
	calendar.date = data.date;
}

$(document).ready(function(){

	hash = getUrlParameter('id');

	data = {};
	data.name = "<?php echo $calendar_data['calendar_name'] ?>";
	data.date = JSON.parse(<?php echo json_encode($calendar_data['date']); ?>);
	data.structure = JSON.parse(<?php echo json_encode($calendar_data['structure']); ?>);
	last_date_changed = new Date("<?php echo $calendar_data['last_date_changed']; ?>");
	last_structure_changed = new Date("<?php echo $calendar_data['last_structure_changed']; ?>");

	reload_calendar(data);
	bind_calendar_events();
	rebuild_calendar('calendar');

});

</script>

<div id="input_container_parent">

	<form id="input_container">

		<div class='wrap-collapsible'>
			<div class='title-text center-text'>View Calendar</div>
		</div>

	</form>

	<div class="input_collapse_btn btn btn-outline-primary"></div>

</div>

<div id="calendar_container">

	<div id="calendar">

	</div>

	<?php include('footnote.php') ?>

</div>