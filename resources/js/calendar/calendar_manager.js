var utcDate1 = Date.now();

const worker_calendar = new Worker('/js/webworkers/worker_calendar.js?v='+utcDate1);
const worker_events = new Worker('/js/webworkers/worker_events.js?v='+utcDate1);
const worker_climate = new Worker('/js/webworkers/worker_climate.js?v='+utcDate1);

var registered_click_callbacks = {}
var registered_keydown_callbacks = {}
var registered_onfocus_callbacks = {}
var registered_onblur_callbacks = {}
var registered_mousemove_callbacks = {}

function bind_calendar_events(){

	document.addEventListener('keydown', function(event){
		for(var callback_id in registered_keydown_callbacks){
			registered_keydown_callbacks[callback_id](event);
		}
	});

	document.addEventListener('click', function(event){
		for(var callback_id in registered_click_callbacks){
			registered_click_callbacks[callback_id](event);
		}
	});

	window.onfocus = function(event){
		for(var callback_id in registered_onfocus_callbacks){
			registered_onfocus_callbacks[callback_id](event);
		}
	};

	window.onblur = function(event){
		for(var callback_id in registered_onblur_callbacks){
			registered_onblur_callbacks[callback_id](event);
		}
	};

	window.addEventListener('mousemove', function(event){
		for(var callback_id in registered_mousemove_callbacks){
			registered_mousemove_callbacks[callback_id](event);
		}
	});

	$('#input_collapse_btn').click(function(){
	    toggle_sidebar();
	});

	calendar_weather.tooltip.set_up();

	$(document).on('click', '.weather_popup', function(){
		calendar_weather.tooltip.sticky($(this));
	});

	$(document).on('mouseenter', '.weather_popup', function(){
		calendar_weather.tooltip.show($(this));
	});

	$(document).on('mouseleave', '.weather_popup', function(){
		calendar_weather.tooltip.hide();
	});

	$('#calendar_container').on('scroll', function(){
		calendar_weather.tooltip.hide();
	});

	$('#calendar_container').scroll(function(){
		evaluate_era_position();
	});

}

var evaluate_era_position = debounce(function(){
	eras.evaluate_position();
}, 50);

function eval_apply_changes(output){

	var apply_changes_immediately = $('#apply_changes_immediately');

	if(apply_changes_immediately.length == 0){
		output();
	}else if(!apply_changes_immediately.is(':checked')){
		if(!changes_applied){
			evaluate_save_button();
			show_changes_button();
		}else{
			hide_changes_button();
			evaluate_save_button(true);
			output();
		}
	}else{
		evaluate_save_button();
		output();
	}

}

function pre_rebuild_calendar(action, dynamic_data){

	eval_apply_changes(function(){

		rebuild_calendar(action, dynamic_data);

	});

}

var evaluated_static_data = {};
var evaluated_event_data = {};

function rebuild_calendar(action, dynamic_data){

    worker_calendar.postMessage({
		calendar_name: calendar_name,
		static_data: static_data,
		dynamic_data: dynamic_data,
        events: events,
        event_categories: event_categories,
		action: action,
		owner: window.Perms.player_at_least('co-owner')
	});

}

function rebuild_climate(){

	worker_climate.postMessage({
		calendar_name: calendar_name,
		static_data: static_data,
		dynamic_data: dynamic_data,
		preview_date: preview_date,
		epoch_data: evaluated_static_data.epoch_data,
		start_epoch: evaluated_static_data.year_data.start_epoch,
		end_epoch: evaluated_static_data.year_data.end_epoch
	});
}

function rebuild_events(event_id){

	show_loading_screen_buffered();

	worker_events.postMessage({
		static_data: static_data,
		dynamic_data: dynamic_data,
		epoch_data: evaluated_static_data.epoch_data,
        events: events,
        event_categories: event_categories,
		event_id: event_id,
		start_epoch: evaluated_static_data.year_data.start_epoch,
		end_epoch: evaluated_static_data.year_data.end_epoch
	});
}


worker_events.onmessage = e => {

	evaluated_event_data = e.data.event_data;

	display_events(static_data, evaluated_event_data);

	hide_loading_screen();

}

worker_climate.onmessage = e => {

	var prev_seasons = calendar_weather.processed_seasons;
	var prev_weather = calendar_weather.processed_weather;

	evaluated_static_data.epoch_data = e.data.epoch_data;
	evaluated_static_data.processed_weather = e.data.processed_weather;
	calendar_weather.epoch_data = clone(evaluated_static_data.epoch_data);
	calendar_weather.processed_weather = clone(e.data.processed_weather);
	calendar_weather.start_epoch = evaluated_static_data.year_data.start_epoch;
	calendar_weather.end_epoch = evaluated_static_data.year_data.end_epoch;

	if(prev_seasons != calendar_weather.processed_seasons || prev_weather != calendar_weather.processed_weather){

		var start_epoch = evaluated_static_data.year_data.start_epoch;
		var end_epoch = evaluated_static_data.year_data.end_epoch;

		calendar_layouts.insert_calendar(evaluated_static_data);

		calendar_weather.epoch_data = evaluated_static_data.epoch_data;
		calendar_weather.processed_weather = evaluated_static_data.processed_weather;
		calendar_weather.start_epoch = start_epoch;
		calendar_weather.end_epoch = end_epoch;

		eras.evaluate_current_era(static_data, start_epoch, end_epoch);
		eras.set_up_position();
		eras.display_era_events(static_data);

		rebuild_events();

		eval_clock();
		update_current_day(false);

		evaluate_day_length_chart();
		evaluate_weather_charts();
		
	}else{
		
		evaluate_day_length_chart();
		evaluate_weather_charts();
		eval_current_time();

	}

	hide_loading_screen();

}

worker_calendar.onmessage = e => {

	evaluated_static_data = {}
	evaluated_static_data = e.data.processed_data;
	var static_data = evaluated_static_data.static_data;
	var action = e.data.action;

	if(evaluated_static_data.success){

		if(Object.keys(evaluated_static_data.timespans).length > 0){

			calendar_layouts.insert_calendar(evaluated_static_data);

			var start_epoch = evaluated_static_data.year_data.start_epoch;
			var end_epoch = evaluated_static_data.year_data.end_epoch;

			eras.evaluate_current_era(static_data, start_epoch, end_epoch);
			eras.set_up_position();
			eras.display_era_events(static_data);

			calendar_weather.epoch_data = evaluated_static_data.epoch_data;
			calendar_weather.processed_weather = evaluated_static_data.processed_weather;
			calendar_weather.start_epoch = start_epoch;
			calendar_weather.end_epoch = end_epoch;

			rebuild_events();

			scroll_to_epoch();

			eval_clock();

			update_current_day(false);

			evaluate_day_length_chart();
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

		error_message(text.join(''));

	}

	hide_loading_screen();

};
