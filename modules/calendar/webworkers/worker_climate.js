var utcDate1 = Date.now();

importScripts('../js/calendar_functions.js?v='+utcDate1);
importScripts('../js/calendar_variables.js?v='+utcDate1);
importScripts('../js/calendar_season_generator.js?v=2000'+utcDate1);

onmessage = e => {
	
	var calendar_name = e.data.calendar_name;

	var static_data = e.data.static_data;
	
	var dynamic_data = e.data.dynamic_data;
	
	var epoch_data = e.data.evaluated_static_data;

	var first_epoch = Object.keys(epoch_data)[0]|0;
	
	climate_generator.set_up(static_data, dynamic_data, first_epoch);

	var keys = Object.keys(epoch_data);
	var length = keys.length;

	for(var i = 0; i < length; i++){
		var epoch = keys[i]|0;
		epoch_data[epoch].season = climate_generator.get_season_data(epoch);
		epoch_data[epoch].weather = climate_generator.get_weather_data(epoch);
	}
	
	postMessage(epoch_data);

}