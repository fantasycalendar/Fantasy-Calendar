import { Climate } from "../calendar/calendar_season_generator";

var version = new Date().getTime();

importScripts('/js/calendar/calendar_functions.js?v='+version);
importScripts('/js/calendar/calendar_variables.js?v='+version);
importScripts('/js/calendar/calendar_season_generator.js?v='+version);


onmessage = e => {

	let static_data = e.data.static_data;

	let dynamic_data = e.data.dynamic_data;

	let start_epoch = e.data.start_epoch;

	let end_epoch = e.data.end_epoch;

	let epoch_data = e.data.epoch_data;

	let climate_generator = new Climate(epoch_data, static_data, dynamic_data, dynamic_data.year, start_epoch, end_epoch);

	epoch_data = climate_generator.generate();

	postMessage({
		epoch_data: epoch_data,
		processed_seasons: climate_generator.process_seasons,
		processed_weather: climate_generator.process_weather
	});

}
