<?php

include('header.php');

?>

	<link rel='stylesheet' href='css/calendar_generation_style.css?ver=<?php echo $jsversion; ?>'>
	<link rel='stylesheet' href='css/calendar_display_style.css?ver=<?php echo $jsversion; ?>'>

	<script src='js/calendar_print.js?ver=<?php echo $jsversion; ?>'></script>

	<div id='right_container'>
		<div id='calendar_container'>
			<div id='calendar'>
			</div>
			<div id='all_event_container'>
			</div>
		</div>
	</div>

</div>
<?php
	
include('footer.php');


?>
