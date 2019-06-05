var utcDate1 = Date.now();

const worker_calendar = new Worker('modules/calendar/webworkers/worker_calendar.js?v='+utcDate1);
const worker_events = new Worker('modules/calendar/webworkers/worker_events.js?v='+utcDate1);
const worker_climate = new Worker('modules/calendar/webworkers/worker_climate.js?v='+utcDate1);

function bind_calendar_events(){

	$(".timespan_container").on('scroll', function(e) {
		//calculate left position
		var left = $(this).scrollLeft();
		//apply to header in negative
		$(this).children().first().css('left', left);
	});

	calendar_weather.tooltip.set_up();
	
	$(document).on('mouseenter', '.weather_icon', function(){
		calendar_weather.tooltip.show($(this));
	});

	$(document).on('mouseleave', '.weather_icon', function(){
		calendar_weather.tooltip.hide();
	});

	$(document).on('scroll', function(){
		calendar_weather.tooltip.hide();
	});

	$('#calendar').scroll(function(){
		eras.evaluate_position();
	});

}


var evaluated_static_data = {};

function rebuild_calendar(action, dynamic_data){
	worker_calendar.postMessage({
		calendar_name: calendar_name,
		static_data: static_data,
		dynamic_data: dynamic_data,
		action: action,
		owner: owner
	});
}

function rebuild_climate(){
	worker_climate.postMessage({
		calendar_name: calendar_name,
		static_data: static_data,
		dynamic_data: dynamic_data,
		evaluated_static_data: evaluated_static_data.epoch_data
	});
}

function rebuild_events(event_id){
	worker_events.postMessage({
		static_data: static_data,
		pre_epoch_data: evaluated_static_data.pre_epoch_data,
		epoch_data: evaluated_static_data.epoch_data,
		event_id: event_id
	});
}


worker_events.onmessage = e => {

	display_events(static_data, e.data)

}

worker_climate.onmessage = e => {

	evaluated_static_data.epoch_data = e.data;
	calendar_weather.epoch_data = clone(evaluated_static_data.epoch_data);

	evaluate_weather_charts();
	
	eval_current_time();

}

worker_calendar.onmessage = e => {

	evaluated_static_data = e.data.processed_data;
	var static_data = evaluated_static_data.static_data;
	var action = e.data.action;

	if(evaluated_static_data.success){

		calendar_layouts.insert_calendar(evaluated_static_data);

		calendar_weather.epoch_data = evaluated_static_data.epoch_data;

		var start_epoch = Number(Object.keys(evaluated_static_data.epoch_data)[0]);
		var end_epoch = Number(Object.keys(evaluated_static_data.epoch_data)[Object.keys(evaluated_static_data.epoch_data).length-1]);

		eras.evaluate_current_era(static_data, start_epoch, end_epoch);
		eras.set_up_position();
		eras.display_era_events(static_data);

		rebuild_events();

		if(action !== "preview"){
			eval_clock();
			update_current_day(false);
		}

		evaluate_weather_charts();

	}else{

		calendar_layouts.insert_empty_calendar(evaluated_static_data);

	}

	evaluate_settings();

};