<?php

header('Cache-Control: no-cache');

$title = 'Editing';

include('header.php');

?>

<!--<script src="calendar_json_01.json?ver=<?php echo $jsversion; ?>"></script>
<script src="calendar_json_02.json?ver=<?php echo $jsversion; ?>"></script>-->

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

/*var t0 = performance.now();

//date2 = get_date(calendar, calendar1, 10000000000)

var appears = 0;

for(var i = 1800; i <= 2200; i++){

	
	console.log('--------')
	console.log(get_leap_fraction(i, ["4","!10","40"], 0));
	console.log('--------')
	if(get_leap(i, ["400","!200","100","16","!8","4"], 2)) appears++;

}

console.log(appears);

var t1 = performance.now();
console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.")*/
//console.log(date2);


var year_appears = 0;
var month_appears = 0;

var year = 2000;

var timespan = {};
timespan.interval = ['40', '!10', '4'];
timespan.offset = 0;

var leap_day = {};
leap_day.interval = ['40', '!10', '2'];
leap_day.offset = 0;


//var leap_day_apperances = Math.floor((year+(leap_day.offset*timespan.interval)) / lcm(timespan.interval, leap_day.interval))

//console.log(leap_day_apperances);

console.log(get_leap_day_fraction(year, timespan.interval, timespan.offset, leap_day.interval, leap_day.offset))



</script>



<?php
include('footer.php');

?>