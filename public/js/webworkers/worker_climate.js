var utcDate1 = Date.now();

importScripts('../js/calendar_functions.js?v='+utcDate1);
importScripts('../js/calendar_variables.js?v='+utcDate1);
importScripts('../js/calendar_season_generator.js?v='+utcDate1);

onmessage = e => {
	
	var calendar_name = e.data.calendar_name;

	var owner = e.data.owner;

	var static_data = e.data.static_data;
	
	var dynamic_data = e.data.dynamic_data;

	var preview_date = e.data.preview_date;

	if(dynamic_data.year != preview_date.year || dynamic_data.timespan != preview_date.timespan || dynamic_data.day != preview_date.day){
		dynamic_data.year = preview_date.year;
		dynamic_data.timespan = preview_date.timespan;
		dynamic_data.day = preview_date.day;
	}
	
	var epoch_data = e.data.evaluated_static_data;

	var first_epoch = Object.keys(epoch_data)[0]|0;
	
	climate_generator.set_up(calendar_name, static_data, dynamic_data, first_epoch);

	if(climate_generator.process_seasons){

		var keys = Object.keys(epoch_data);
		var length = keys.length;

		for(var i = 0; i < length; i++){
			var epoch = keys[i]|0;
			epoch_data[epoch].season = climate_generator.get_season_data(epoch);
			if((static_data.settings.hide_all_weather && !owner) || (static_data.settings.hide_future_weather && !owner && (timespan_index > dynamic_data.timespan || (timespan_index == dynamic_data.timespan && total_day > dynamic_data.day)))){
				epoch_data[epoch].weather = false;
			}else{
				if(climate_generator.process_weather){
					epoch_data[epoch].weather = climate_generator.get_weather_data(epoch);
				}else{
					epoch_data[epoch].weather = false;
				}
			}
		}

	}
	
	postMessage({
		epoch_data: epoch_data,
		processed_seasons: climate_generator.process_seasons,
		processed_weather: climate_generator.process_weather
	});

}