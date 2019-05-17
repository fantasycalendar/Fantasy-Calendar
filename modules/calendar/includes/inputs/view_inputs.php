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
	set_up_view_inputs();
	bind_calendar_events();
	rebuild_calendar('calendar');

});

</script>

<div id="input_container_parent">
	<form id="input_container">


		<div class='wrap-collapsible'>
			<div class='title-text center-text'>View Calendar</div>
		</div>


		<div class='wrap-collapsible'>
			<div class='detail-row form-inline'>
				<input type='text' class='form-control form-control-lg full static_input' data='' key='name' placeholder='Calendar name' />
			</div>
		</div>


		<div class='wrap-collapsible margin-below'>

			<button disabled id='btn_save' class='btn btn-lg btn-primary btn-block'>Save</button>

		</div>

		<div class='wrap-collapsible'>
			<div class='separator'></div>
		</div>

		<div class='wrap-collapsible'>
			<input id="collapsible_globalweek" class="toggle" type="checkbox">
			<label for="collapsible_globalweek" class="lbl-toggle lbl-text">Global Week <a target="_blank" title='Fantasy Calendar Wiki: Global week' href='https://wiki.fantasy-calendar.com/index.php?title=Global_week' class="wiki"><i class="icon-question-sign"></i></a></label>
			<div class="collapsible-content">

				<div class='form-inline global_week'>

					<input type='text' class='form-control name' placeholder='Weekday name'>

					<input type='button' value='Add' class='btn btn-primary add'>

				</div>

				<div class='sortable' id='global_week_sortable'>
				</div>

			</div>

			<div class='separator'></div>

		</div>
	</form>
	<div class="input_collapse_btn btn btn-outline-primary"></div>
</div>

<div id="calendar_container">

	<div id="calendar">

	</div>

	<?php include('footnote.php') ?>

</div>