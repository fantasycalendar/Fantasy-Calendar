import { event_evaluator } from "../calendar/calendar_workers";

onmessage = e => {
	data = event_evaluator.init(e.data.static_data, e.data.dynamic_data, e.data.events, e.data.event_categories, e.data.epoch_data, e.data.event_id, e.data.start_epoch, e.data.end_epoch, e.data.owner, e.data.callback);
	postMessage({
		event_data: data,
		callback: false
	});
}
