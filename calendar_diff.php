<?php

header('Cache-Control: no-cache');

$title = 'Editing';

include('header.php');

?>

<script src="calendar_json_01.json?ver=<?php echo $jsversion; ?>"></script>
<script src="calendar_json_02.json?ver=<?php echo $jsversion; ?>"></script>

<script>
	
/*
const tester = new Worker('modules/calendar/webworkers/worker_calendar.js');


tester.postMessage({
	calendar: calendar,
	action: "calendar"
});


tester.onmessage = e => {

	evaluated_calendar_data = e.data.calendar;

	console.log(evaluated_calendar_data)

};*/

var t0 = performance.now();

date2 = get_date(calendar, 10000000000)

var t1 = performance.now();
console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.")
console.log(date2);

</script>



<?php
include('footer.php');

?>