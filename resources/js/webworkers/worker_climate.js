var version = new Date().getTime();

importScripts('/js/calendar/calendar_functions.js?v='+version);
importScripts('/js/calendar/calendar_variables.js?v='+version);
importScripts('/js/calendar/calendar_season_generator.js?v='+version);


onmessage = e => {
	
	var calendar_name = e.data.calendar_name;

	var static_data = e.data.static_data;
	
	var dynamic_data = e.data.dynamic_data;

	var preview_date = e.data.preview_date;
	
	var start_epoch = e.data.start_epoch;

	var end_epoch = e.data.end_epoch;

	var epoch_data = e.data.epoch_data;

	climate_generator = new Climate(epoch_data, static_data, dynamic_data, start_epoch, end_epoch);

	epoch_data = climate_generator.generate();
	
	postMessage({
		epoch_data: epoch_data,
		processed_seasons: climate_generator.process_seasons,
		processed_weather: climate_generator.process_weather
	});

}