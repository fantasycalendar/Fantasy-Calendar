<?php

$calendar = new calendar();

$calendar_name = $calendar->get($_GET['id'])['data']['calendar']['name'];

$title = 'Editing \'' . $calendar_name . '\'';

include('header.php');

?>

<script>

$(document).ready(function(){

	//timeoutID = window.setTimeout(load_calendar, 150);

});

function load_calendar(){

	var hash = getUrlParameter('id');

	$.ajax({
		url:window.baseurl+"modules/calendar/ajax/ajax_calendar",
		type: "post",
		dataType: 'json',
		proccessData: false,
		data: {action: 'load', hash: hash},
		success: function(result){
			calendar = JSON.parse(result.data.calendar.data);
			console.log(result.data);
			set_up_edit_inputs();
			bind_calendar_events();
			rebuild_calendar('calendar');
			
		},
		error: function ( log )
		{
			console.log(log);
		}
	});
}

</script>

<div id="generator_container">

	<?php

	include('modules/calendar/layouts/weather_tooltip_layout.html');
	include('modules/calendar/layouts/event_layout.html');
	include('modules/calendar/layouts/input_layout.php');

	?>

	<div id="calendar_container">

		<div id="calendar">

		</div>

		<div id="weather_container" class="hidden">

			<canvas class='chart' id='temperature'></canvas>

			<canvas class='chart' id='precipitation'></canvas>

		</div>

		<footer id='footer'>fantasy-calendar.com version <?php echo $jsversion; ?> - Copyright © <?php if(date("Y") === '2018'){ echo date("Y"); }else{ echo '2018-'.date("Y"); } ?> Adam Oresten - <a href='privacypolicy.php'>Privacy Policy</a> — <a href='https://twitter.com/FantasyCalendar/'>Twitter</a></footer>

	</div>

</div>


<?php
include('footer.php');

?>