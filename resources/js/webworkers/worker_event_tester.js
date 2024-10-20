import { window.calendar_data_generator, event_evaluator } from "../calendar/calendar_workers";

var version = new Date().getTime();


importScripts('/js/calendar/calendar_functions.js?v='+version);
importScripts('/js/calendar/calendar_variables.js?v='+version);
importScripts('/js/calendar/calendar_season_generator.js?v='+version);
importScripts('/js/calendar/calendar_workers.js?v='+version);

onmessage = async (e) => {

	window.calendar_data_generator.calendar_name = e.data.calendar_name;
	window.calendar_data_generator.static_data = e.data.static_data;
	window.calendar_data_generator.dynamic_data = e.data.dynamic_data;
	window.calendar_data_generator.owner = e.data.owner;
	window.calendar_data_generator.events = e.data.events;
	window.calendar_data_generator.event_categories = e.data.event_categories;

	let calendar_data = await window.calendar_data_generator.run_future(Number(e.data.start_year), Number(e.data.end_year), e.data.build_seasons);

	let event_data = event_evaluator.init(
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

    let occurrences = event_data.valid[e.data.event_id] ? event_data.valid[e.data.event_id] : [];

    let valid_occurrences = [];

    for(let index in occurrences){

        let epoch = occurrences[index];
        let epoch_data = calendar_data.epoch_data[epoch];

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
