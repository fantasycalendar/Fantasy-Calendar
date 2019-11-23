function set_up_visitor_inputs(){

	show_event_ui.bind_events();
	
	target_year = $('#target_year');
	target_timespan = $('#target_timespan');
	target_day = $('#target_day');

	$('.btn_preview_date').click(function(){

		var target = $(this).attr('fc-index');
		var value = $(this).attr('value');

		if(target === 'year'){
			if(value[0] === "-"){
				target_year.prev().click();
			}else{
				target_year.next().click();
			}
		}else if(target === 'timespan'){
			if(value[0] === "-"){
				target_timespan.prev().click();
			}else{
				target_timespan.next().click();
			}
		}
		$('#go_to_preview_date').click();

	});

	set_up_preview_values();

	sub_target_year = $('#sub_target_year');
	add_target_year = $('#add_target_year');

	sub_target_timespan = $('#sub_target_timespan');
	add_target_timespan = $('#add_target_timespan');

	sub_target_day = $('#sub_target_day');
	add_target_day = $('#add_target_day');


	sub_target_day.click(function(){

		preview_date_manager.subtract_day();

		evaluate_preview_change();

	});

	sub_target_timespan.click(function(){

		preview_date_manager.subtract_timespan();

		evaluate_preview_change();

	});

	sub_target_year.click(function(){

		preview_date_manager.subtract_year();
		
		evaluate_preview_change();

	});

	add_target_day.click(function(){

		preview_date_manager.add_day();

		evaluate_preview_change();

	});

	add_target_timespan.click(function(){

		preview_date_manager.add_timespan();

		evaluate_preview_change();

	});

	add_target_year.click(function(){

		preview_date_manager.add_year();
		
		evaluate_preview_change();

	});


	target_year.change(function(e){

		if(e.originalEvent){
			preview_date_manager.year = convert_year(static_data, $(this).val()|0);
		}

		var year = $(this).val()|0;

		if(year != preview_date_manager.adjusted_year){
			$(this).val(preview_date_manager.adjusted_year);
			repopulate_timespan_select(target_timespan, preview_date_manager.timespan, false);
			repopulate_day_select(target_day, preview_date_manager.day, false);
		}

	});

	target_timespan.change(function(e){

		if(e.originalEvent){
			preview_date_manager.timespan = $(this).val()|0;
		}else{
			target_timespan.children().eq(preview_date_manager.timespan).prop('selected', true);
			repopulate_day_select(target_day, preview_date_manager.day, false);
		}


	});

	target_day.change(function(e){

		if(e.originalEvent){
			preview_date_manager.day = $(this).val()|0;
		}else{
			target_day.children().eq(preview_date_manager.day-1).prop('selected', true);
		}

	});

	$('#go_to_preview_date').click(function(){
		if($(this).prop('disabled')) return;
		go_to_preview_date();
	});

	$('#reset_preview_date').click(function(){
		if($(this).prop('disabled')) return;
		go_to_dynamic_date();
	});

}

function preview_date_follow(){

	if(preview_date.follow){

		preview_date_manager.year = dynamic_date_manager.year;
		preview_date_manager.timespan = dynamic_date_manager.timespan;
		preview_date_manager.day = dynamic_date_manager.day;

		evaluate_preview_change();

	}

}

function evaluate_preview_change(){

	if(preview_date_manager.adjusted_year != target_year.val()|0){
		target_year.change()
	}else if(preview_date_manager.timespan != target_timespan.val()|0){
		target_timespan.change()
	}else if(preview_date_manager.day != target_day.val()|0){
		target_day.change()
	}

}


function update_preview_calendar(){

	preview_date_manager = new date_manager(target_year.val()|0, target_timespan.val()|0, target_day.val()|0);

	preview_date.year = preview_date_manager.adjusted_year;
	preview_date.timespan = preview_date_manager.timespan;
	preview_date.day = preview_date_manager.day;
	preview_date.epoch = preview_date_manager.epoch;

}


function go_to_preview_date(){

	preview_date.follow = false

	$('#reset_preview_date').prop("disabled", preview_date.follow).toggleClass('disabled', preview_date.follow);

	var data = preview_date_manager.compare(preview_date)

	preview_date.year = data.year;
	preview_date.timespan = data.timespan;
	preview_date.day = data.day;
	preview_date.epoch = data.epoch;

	if(data.rebuild){
		rebuild_calendar('preview', preview_date)
	}else{
		highlight_preview_date()
		scroll_to_epoch(preview_date.epoch)
	}

}

function go_to_dynamic_date(){

	preview_date.follow = true

	$('#reset_preview_date').prop("disabled", preview_date.follow).toggleClass('disabled', preview_date.follow);

	preview_date_manager.year = dynamic_date_manager.year;
	preview_date_manager.timespan = dynamic_date_manager.timespan;
	preview_date_manager.day = dynamic_date_manager.day;

	evaluate_preview_change();

	var data = dynamic_date_manager.compare(preview_date)

	preview_date.year = data.year;
	preview_date.timespan = data.timespan;
	preview_date.day = data.day;
	preview_date.epoch = data.epoch;

	if(data.rebuild){
		rebuild_calendar('preview', dynamic_data)
	}else{
		update_current_day(false)
		scroll_to_epoch(dynamic_data.epoch)
	}

}




function highlight_preview_date(){

	if(preview_date.epoch == dynamic_data.epoch) return;

	if($(`[epoch=${preview_date.epoch}]`).length){
		
		$(`[epoch=${preview_date.epoch}]`).addClass('preview_day');

		window.setTimeout(function(){
			$(`[epoch=${preview_date.epoch}]`).removeClass('preview_day');
		}, 2000);

	}
}

function evaluate_settings(){

	$('.btn_container').toggleClass('hidden', !owner && !static_data.settings.allow_view);
	$('.btn_preview_date[fc-index="year"]').prop('disabled', !owner && !static_data.settings.allow_view).toggleClass('hidden', !owner && !static_data.settings.allow_view);
	$('.btn_preview_date[fc-index="timespan"]').prop('disabled', !static_data.settings.show_current_month).toggleClass('hidden', !static_data.settings.show_current_month)

}


function eval_clock(){

	if(!static_data.clock.enabled || isNaN(static_data.clock.hours) || isNaN(static_data.clock.minutes) || isNaN(static_data.clock.offset)){
		$('#clock').css('display', 'none');
		return;
	}

	var clock_face_canvas = document.getElementById("clock_face");
	var clock_sun_canvas = document.getElementById("clock_sun");
	var clock_background_canvas = document.getElementById("clock_background");

	clock_face_canvas.width = $('#clock').width()
	clock_face_canvas.height = $('#clock').width()

	clock_sun_canvas.width = $('#clock').width()
	clock_sun_canvas.height = $('#clock').width()

	clock_background_canvas.width = $('#clock').width()
	clock_background_canvas.height = $('#clock').width()

	window.clock = new Clock(
		clock_face_canvas,
		clock_sun_canvas,
		clock_background_canvas,
		hours		= static_data.clock.hours,
		minutes		= static_data.clock.minutes,
		offset		= static_data.clock.offset,
		crowding	= 0,
		hour		= dynamic_data.hour,
		minute		= dynamic_data.minute,
		sunrise		= 6,
		sunset		= 18
	);

	$('#clock').css('display', 'block');

	eval_current_time();

}

function eval_current_time(){

	if(!static_data.clock.enabled || isNaN(static_data.clock.hours) || isNaN(static_data.clock.minutes) || isNaN(static_data.clock.offset)){
		$('#clock').css('display', 'none');
		return;
	}

	window.clock.set_time(dynamic_data.hour, dynamic_data.minute)

	evaluate_sun();

}

function evaluate_sun(){

	if(!static_data.clock.enabled || isNaN(static_data.clock.hours) || isNaN(static_data.clock.minutes) || isNaN(static_data.clock.offset)){
		$('#clock').css('display', 'none');
		return;
	}

	if(evaluated_static_data.processed_seasons && evaluated_static_data.epoch_data[dynamic_data.epoch] !== undefined){

		var clock_hours = static_data.clock.hours;

		var sunset = evaluated_static_data.epoch_data[dynamic_data.epoch].season.sunset[0];
		var sunrise = evaluated_static_data.epoch_data[dynamic_data.epoch].season.sunrise[0];


		window.clock.sunrise = sunrise;
		window.clock.sunset = sunset;
		
	}

}

function repopulate_timespan_select(select, val, change){

	change = change === undefined ? true : change;

	select.each(function(){

		var year = convert_year(static_data, $(this).closest('.date_control').find('.year-input').val()|0);

		var special = $(this).hasClass('timespan_special');

		var html = [];

		for(var i = 0; i < static_data.year_data.timespans.length; i++){

			var is_there = does_timespan_appear(static_data, year, i);

			if(special && is_there.reason != "era ended"){

				html.push(`<option value='${i}'>${static_data.year_data.timespans[i].name}</option>`);

			}else{

				var days = get_days_in_timespan(static_data, year, i);

				if(days.length == 0){
					is_there.result = false;
					is_there.reason = "no days";
				}

				html.push(`<option ${!is_there.result ? 'disabled' : ''} value='${i}'>`);
				html.push(static_data.year_data.timespans[i].name + (!is_there.result ? ` (${is_there.reason})` : ''));
				html.push('</option>');

			}
		}

		if(val === undefined){
			var value = $(this).val()|0;
		}else{
			var value = val;
		}


		$(this).html(html.join('')).val(value);
		if($(this).find('option:selected').prop('disabled') || $(this).val() == null){
			internal_loop:
			for(var i = value, j = value+1; i >= 0 || j < $(this).children().length; i--, j++){
				if(!$(this).children().eq(i).prop('disabled')){
					var new_val = i;
					break internal_loop;
				}
				if(!$(this).children().eq(j).prop('disabled')){
					var new_val = j;
					break internal_loop;
				}
			}
			$(this).val(new_val);
		}
		if(change){
			$(this).change();
		}
	});


}

function repopulate_day_select(select, val, change){

	var change = change === undefined ? true : change;

	select.each(function(){

		var year = convert_year(static_data, $(this).closest('.date_control').find('.year-input').val()|0);
		var timespan = $(this).closest('.date_control').find('.timespan-list').val()|0;
		
		var exclude_self = $(this).hasClass('exclude_self');

		if(exclude_self){

			self_object = get_calendar_data($(this).attr('data'));

			if(self_object){
				var days = get_days_in_timespan(static_data, year, timespan, self_object);
			}

		}else{
			var days = get_days_in_timespan(static_data, year, timespan);
		}


		var html = [];

		if(!$(this).hasClass('date')){
			html.push(`<option value="${0}">Before 1</option>`);
		}

		for(var i = 0; i < days.length; i++){

			var day = days[i];

			if(day != ""){
				text = day;
			}else{
				text = `Day ${i+1}`;
			}

			html.push(`<option value='${i+1}'>`);
			html.push(`${text}`);
			html.push('</option>');

		}

		if(val === undefined){
			var value = $(this).val()|0;
		}else{
			var value = val;
		}

		$(this).html(html.join('')).val(value);

		if($(this).find('option:selected').prop('disabled') || $(this).val() == null){
			internal_loop:
			for(var i = value, j = value+1; i >= 0 || j < $(this).children().length; i--, j++){
				if($(this).children().eq(i).length && !$(this).children().eq(i).prop('disabled')){
					var new_val = i;
					break internal_loop;
				}
				if($(this).children().eq(j).length && !$(this).children().eq(j).prop('disabled')){
					var new_val = j;
					break internal_loop;
				}
			}
			$(this).val(new_val+1);
		}
		if(change){
			$(this).change();
		}

	});
	
}

function set_up_preview_values(){

	if(dynamic_data){

		preview_date = clone(dynamic_data)

		preview_date.follow = true

		$('#reset_preview_date').prop("disabled", preview_date.follow).toggleClass('disabled', preview_date.follow);

		preview_date_manager = new date_manager(dynamic_data.year, dynamic_data.timespan, dynamic_data.day);

		target_year.val(preview_date_manager.adjusted_year);
		repopulate_timespan_select(target_timespan, preview_date_manager.timespan, false);
		repopulate_day_select(target_day, preview_date_manager.day, false);

	}

}