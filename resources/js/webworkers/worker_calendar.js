/*--------------------------------------------------------*/
/*---------------- CALCULATION FUNCTIONS  ----------------*/
/*--------------------------------------------------------*/

var version = new Date().getTime();

importScripts('/js/calendar/calendar_functions.js?v='+version);
importScripts('/js/calendar/calendar_variables.js?v='+version);
importScripts('/js/calendar/calendar_season_generator.js?v='+version);
importScripts('/js/calendar/calendar_workers.js?v='+version);

onmessage = e => {

	calendar_data_generator.calendar_name = e.data.calendar_name;
	calendar_data_generator.static_data = e.data.static_data;
	calendar_data_generator.dynamic_data = e.data.dynamic_data;
	calendar_data_generator.owner = e.data.owner;
	calendar_data_generator.events = e.data.events;
	calendar_data_generator.event_categories = e.data.event_categories;

	let debug = false;
	let data = {};

	if(debug) {

		target_loops = 2000;
		loops = 0;

		calendar_data_generator.dynamic_data.year = Math.floor(target_loops / 2);

		execution_time.start();

		let average_time = 0;

		for(let loops; loops < target_loops; loops++) {

			let start_time = performance.now();

			data = calendar_data_generator.run();
			calendar_data_generator.dynamic_data.year++;
			if(calendar_data_generator.dynamic_data.year === 0 && !calendar_data_generator.static_data.settings.year_zero_exists) {
				calendar_data_generator.dynamic_data.year++;
			}

			average_time += precisionRound(performance.now() - start_time, 7)

		}

		average_time = average_time / target_loops;

		console.log(`${average_time}ms`)

		execution_time.end("Entire execution took:");

		postMessage({
			processed_data: data,
			action: e.data.action
		});

	} else {

	    data = calendar_data_generator.run();

	}

	postMessage({
		processed_data: data,
		action: e.data.action
	});
}
