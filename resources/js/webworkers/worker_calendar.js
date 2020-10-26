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

	data = calendar_builder.evaluate_calendar_data();

	postMessage({
		processed_data: data,
		action: e.data.action
	});
}
