var utcDate1 = Date.now();

const worker_calendar = new Worker('/js/webworkers/worker_calendar.js?v='+utcDate1);
const worker_events = new Worker('/js/webworkers/worker_events.js?v='+utcDate1);
const worker_climate = new Worker('/js/webworkers/worker_climate.js?v='+utcDate1);

function sidescroll(){
	//calculate left position
	var left = $(this.event.target).scrollLeft();
	//apply to header in negative
	$(this.event.target).children().first().css('left', left);

}

function bind_calendar_events(){

	$('#input_collapse_btn').click(function(){
		$("#input_container").toggleClass('inputs_collapsed');
		$("#calendar_container").toggleClass('inputs_collapsed');

		$(this).toggleClass('is-active');
		evaluate_error_background_size();
	})

	calendar_weather.tooltip.set_up();

	$(document).on('mouseenter', '.weather_icon', function(){
		calendar_weather.tooltip.show($(this));
	});

	$(document).on('mouseleave', '.weather_icon', function(){
		calendar_weather.tooltip.hide();
	});

	$('#calendar').on('scroll', function(){
		calendar_weather.tooltip.hide();
	});

	$('#calendar').scroll(function(){
		eras.evaluate_position();
	});

}


var evaluated_static_data = {};

function rebuild_calendar(action, dynamic_data){

	show_loading_screen();

	worker_calendar.postMessage({
		calendar_name: calendar_name,
		static_data: static_data,
		dynamic_data: dynamic_data,
		action: action,
		owner: owner
	});
}

function rebuild_climate(){

	show_loading_screen();

	worker_climate.postMessage({
		calendar_name: calendar_name,
		static_data: static_data,
		dynamic_data: dynamic_data,
		preview_date: preview_date,
		evaluated_static_data: evaluated_static_data.epoch_data,
		owner: owner
	});
}

function rebuild_events(event_id){

	show_loading_screen();

	worker_events.postMessage({
		static_data: static_data,
		pre_epoch_data: evaluated_static_data.pre_epoch_data,
		epoch_data: evaluated_static_data.epoch_data,
		event_id: event_id
	});
}


worker_events.onmessage = e => {

	display_events(static_data, e.data.event_data)

	hide_loading_screen();

}

worker_climate.onmessage = e => {

	var prev_seasons = calendar_weather.processed_seasons;
	var prev_weather = calendar_weather.processed_weather;

	evaluated_static_data.epoch_data = e.data.epoch_data;
	evaluated_static_data.processed_weather = e.data.processed_weather;
	calendar_weather.epoch_data = clone(evaluated_static_data.epoch_data);
	calendar_weather.processed_seasons = clone(e.data.processed_seasons);
	calendar_weather.processed_weather = clone(e.data.processed_weather);

	if(prev_seasons != calendar_weather.processed_seasons || prev_weather != calendar_weather.processed_weather){

		var start_epoch = Number(Object.keys(evaluated_static_data.epoch_data)[0]);
		var end_epoch = Number(Object.keys(evaluated_static_data.epoch_data)[Object.keys(evaluated_static_data.epoch_data).length-1]);

		calendar_layouts.insert_calendar(evaluated_static_data);

		calendar_weather.epoch_data = evaluated_static_data.epoch_data;
		calendar_weather.processed_weather = evaluated_static_data.processed_weather;

		eras.evaluate_current_era(static_data, start_epoch, end_epoch);
		eras.set_up_position();
		eras.display_era_events(static_data);

		rebuild_events();

		eval_clock();
		update_current_day(false);

		evaluate_weather_charts();

	}else{

		evaluate_weather_charts();

		eval_current_time();

	}

	hide_loading_screen();

}

worker_calendar.onmessage = e => {

	evaluated_static_data = e.data.processed_data;
	var static_data = evaluated_static_data.static_data;
	var action = e.data.action;

	if(evaluated_static_data.success){

		if(Object.keys(evaluated_static_data.timespans).length > 0){

			calendar_layouts.insert_calendar(evaluated_static_data);

			calendar_weather.epoch_data = evaluated_static_data.epoch_data;
			calendar_weather.processed_weather = evaluated_static_data.processed_weather;

			var start_epoch = Number(Object.keys(evaluated_static_data.epoch_data)[0]);
			var end_epoch = Number(Object.keys(evaluated_static_data.epoch_data)[Object.keys(evaluated_static_data.epoch_data).length-1]);

			eras.evaluate_current_era(static_data, start_epoch, end_epoch);
			eras.set_up_position();
			eras.display_era_events(static_data);

			rebuild_events();

			if(action !== "preview"){
				eval_clock();
				scroll_to_epoch(dynamic_data.epoch)
			}else{
				scroll_to_epoch(preview_date.epoch)
				highlight_preview_date();
			}

			update_current_day(false);

			evaluate_weather_charts();

		}else{

			calendar_layouts.insert_empty_calendar(evaluated_static_data);

		}

	}else{

		var text = [];

		text.push(`Errors:<ol>`);

		for(var i = 0; i < evaluated_static_data.errors.length; i++){

			text.push(`<li>${evaluated_static_data.errors[i]}</li>`);

		}
		text.push(`</ol>`);

		calendar_error_message(text.join(''));

	}

	evaluate_settings();

	hide_loading_screen();

};
