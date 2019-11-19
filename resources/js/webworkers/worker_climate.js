importScripts('/js/calendar/calendar_functions.js');
importScripts('/js/calendar/calendar_variables.js');
importScripts('/js/calendar/calendar_season_generator.js');

onmessage = e => {
	
	var calendar_name = e.data.calendar_name;

	var owner = e.data.owner;

	var static_data = e.data.static_data;
	
	var dynamic_data = e.data.dynamic_data;

	var preview_date = e.data.preview_date;

	var start_epoch = e.data.start_epoch;

	var end_epoch = e.data.end_epoch;

	if(dynamic_data.year != preview_date.year || dynamic_data.timespan != preview_date.timespan || dynamic_data.day != preview_date.day){
		dynamic_data.year = preview_date.year;
		dynamic_data.timespan = preview_date.timespan;
		dynamic_data.day = preview_date.day;
	}
	
	var epoch_data = e.data.epoch_data;

	var first_epoch = Number(Object.keys(epoch_data)[0]);
	
	climate_generator.set_up(calendar_name, static_data, dynamic_data, first_epoch);

	if(climate_generator.process_seasons){

		for(var epoch in epoch_data){

			var epoch = Number(epoch);

			epoch_data[epoch].season = climate_generator.get_season_data(epoch);

			if(climate_generator.process_weather){
				epoch_data[epoch].weather = climate_generator.get_weather_data(epoch);
			}else{
				epoch_data[epoch].weather = false;
			}
			
		}

	}
	
	postMessage({
		epoch_data: epoch_data,
		processed_seasons: climate_generator.process_seasons,
		processed_weather: climate_generator.process_weather
	});

}