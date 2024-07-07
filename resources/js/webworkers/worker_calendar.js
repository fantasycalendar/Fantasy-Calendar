import { precisionRound } from "../calendar/calendar_functions";

/*--------------------------------------------------------*/
/*---------------- CALCULATION FUNCTIONS  ----------------*/
/*--------------------------------------------------------*/

var version = new Date().getTime();

importScripts('/js/calendar/calendar_functions.js?v='+version);
importScripts('/js/calendar/calendar_variables.js?v='+version);
importScripts('/js/calendar/calendar_season_generator.js?v='+version);
importScripts('/js/calendar/calendar_workers.js?v='+version);

onmessage = async (e) => {

	window.calendar_data_generator.static_data = e.data.static_data;
	window.calendar_data_generator.dynamic_data = e.data.dynamic_data;
	window.calendar_data_generator.owner = e.data.owner;
	window.calendar_data_generator.events = e.data.events;
	window.calendar_data_generator.event_categories = e.data.event_categories;

	let debug = true;
	let data = {};

	if(debug) {

		let from_year = -1000;
		let to_year = 1000;

		window.calendar_data_generator.dynamic_data.year = from_year;

		execution_time.start();

		let average_time = 0;

		let last_epoch;

		for(let year = from_year; year <= to_year; year++) {

			let start_time = performance.now();

            data = await window.calendar_data_generator.run();

            if(last_epoch){
                if(last_epoch !==  data.year_data.start_epoch){
                    console.log("WRONG!", window.calendar_data_generator.dynamic_data.year)
                }else{
                    console.log(window.calendar_data_generator.dynamic_data.year)
                }
            }

            last_epoch = data.year_data.end_epoch+1;

            window.calendar_data_generator.dynamic_data.year++;
            if(window.calendar_data_generator.dynamic_data.year === 0 && !window.calendar_data_generator.static_data.settings.year_zero_exists) {
                window.calendar_data_generator.dynamic_data.year++;
            }

			average_time += precisionRound(performance.now() - start_time, 7)

		}

		average_time = average_time / to_year;

		console.log(`${average_time}ms`)

		execution_time.end("Entire execution took:");

		postMessage({
			processed_data: data,
			action: e.data.action
		});

	} else {

	    data = window.calendar_data_generator.run();

	}

	postMessage({
		processed_data: data,
		action: e.data.action
	});
}
