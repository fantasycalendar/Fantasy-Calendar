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

	calendar_data = calendar_builder.evaluate_future_calendar_data(e.data.start_year, e.data.end_year, e.data.build_seasons);

	event_data = event_evaluator.init(
		e.data.static_data,
		e.data.dynamic_data,
		e.data.events,
		e.data.event_categories,
		calendar_data.epoch_data,
		e.data.event_id,
		calendar_data.start_epoch,
		calendar_data.end_epoch,
		e.data.owner,
		e.data.callback
	);

    occurrences = event_data.valid[e.data.event_id] ? event_data.valid[e.data.event_id] : [];

    valid_occurrences = [];

    for(let index in occurrences){

        var epoch = occurrences[index];
        var epoch_data = calendar_data.epoch_data[epoch];

        if(epoch_data.year >= e.data.start_year && epoch_data.year < e.data.end_year){

            valid_occurrences.push({
                year: epoch_data.year,
                timespan: epoch_data.timespan_index,
                day: epoch_data.day,
                intercalary: epoch_data.intercalary
            });
        }
    }

	postMessage({
        occurrences: valid_occurrences
	});
}