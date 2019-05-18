var utcDate1 = Date.now();

importScripts('../js/calendar_functions.js?v='+utcDate1);
importScripts('../js/calendar_variables.js?v='+utcDate1);
importScripts('../js/calendar_climate_generator.js?v=2000'+utcDate1);

onmessage = e => {
	
	var calendar = e.data.calendar;
	
	var epoch_data = e.data.calendar_data.epoch_data;

	var first_epoch = Object.keys(epoch_data)[0];
	
	climate_generator.set_up(calendar, first_epoch|0);

	var keys = Object.keys(epoch_data);
	var length = keys.length;

	for(var i = 0; i < length; i++){
		var epoch = keys[i]|0;
		epoch_data[epoch].weather = climate_generator.get_weather(epoch);
	}
	
	postMessage(epoch_data);

}