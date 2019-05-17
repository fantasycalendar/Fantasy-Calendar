<?php

$title = 'Generate Calendar';

include('header.php');


include('calendar_event_layout.php');
include('calendar_weather_layout.php');

?>
	

	<link rel='stylesheet' href='css/calendar_generation_style.css'>
	<link rel='stylesheet' href='css/calendar_display_style.css'>

	<div id='generator_container'>
	
		<div id='left_container'>

			<div id='left_scrollbox'>
				
				<?php

					include('calendar_input_layout.php');

				?>
				
			</div>
		</div>
		<div id='right_container'>
			<div id='calendar_container'>
				<div id='calendar'>
				</div>
				<div id='weather_tooltip_box'>
					<div><span class='bold-text'>Temperature:</span> <span class='weather_temp'></span></div>
					<div><span class='bold-text'>Wind:</span> <span class='weather_wind'></span></div>
					<div><span class='bold-text'>Precipitation:</span> <span class='weather_precip'></span></div>
					<div><span class='bold-text'>Clouds:</span> <span class='weather_clouds'></span></div>
				</div>
			</div>
			<canvas id='weather_display_container'></canvas>
			<div id='all_event_container'>
			</div>
		</div>
	
	</div>
	<script src='js/calendar_display.js?ver=<?php echo $jsversion; ?>'></script>
	<script src='js/calendar_generate.js?ver=<?php echo $jsversion; ?>'></script>
	<script src='js/calendar_functions.js?ver=<?php echo $jsversion; ?>'></script>
	<script src='js/calendar_input_layout.js?ver=<?php echo $jsversion; ?>'></script>
	
<?php
	
include('footer.php');

?>