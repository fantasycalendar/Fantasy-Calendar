<?php

$calendar_name = "New calendar";

$title = $calendar_name;

include('header.php');

?>

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