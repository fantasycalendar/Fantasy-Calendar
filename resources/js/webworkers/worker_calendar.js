/*--------------------------------------------------------*/
/*---------------- CALCULATION FUNCTIONS  ----------------*/
/*--------------------------------------------------------*/

var version = new Date().getTime();

importScripts('/js/calendar/calendar_functions.js?v='+version);
importScripts('/js/calendar/calendar_variables.js?v='+version);
importScripts('/js/calendar/calendar_season_generator.js?v='+version);
importScripts('/js/calendar/calendar_workers.js?v='+version);

onmessage = e => {

	calendar_builder.calendar_name = e.data.calendar_name;
	calendar_builder.static_data = e.data.static_data;
	calendar_builder.dynamic_data = e.data.dynamic_data;
	calendar_builder.owner = e.data.owner;
	calendar_builder.events = e.data.events;
	calendar_builder.event_categories = e.data.event_categories;

	let debug = false;

	if(debug) {

		target_loops = 2000;
		loops = 0;

		calendar_builder.dynamic_data.year = Math.floor(target_loops / 2);
		
		execution_time.start();

		var average_time = 0;

		for(var loops; loops < target_loops; loops++) {

			starttime = performance.now();

			data = calendar_builder.evaluate_calendar_data();
			calendar_builder.dynamic_data.year++;
			if(calendar_builder.dynamic_data.year == 0 && !calendar_builder.static_data.settings.year_zero_exists) {
				calendar_builder.dynamic_data.year++;
			}

			average_time += precisionRound(performance.now() - starttime, 7)

		}

		average_time = average_time / target_loops;

		console.log(`${average_time}ms`)

		execution_time.end();

		postMessage({
			processed_data: data,
			action: e.data.action
		});

	} else {

		data = calendar_builder.evaluate_calendar_data();

	}

	postMessage({
		processed_data: data,
		action: e.data.action
	});
}
