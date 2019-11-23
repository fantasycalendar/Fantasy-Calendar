rebuild_type = 'calendar';

function set_up_view_inputs(){
	
	set_up_visitor_inputs();

	calendar_container = $('#calendar');
	
	current_year = $('#current_year');
	current_timespan = $('#current_timespan');
	current_day = $('#current_day');

	current_hour = $('#current_hour');
	current_minute = $('#current_minute');

	location_select = $('#location_select');

	link_changed();

	set_up_view_values();

	sub_current_year = $('#sub_current_year');
	add_current_year = $('#add_current_year');

	sub_current_timespan = $('#sub_current_timespan');
	add_current_timespan = $('#add_current_timespan');

	sub_current_day = $('#sub_current_day');
	add_current_day = $('#add_current_day');

	sub_current_day.click(function(){

		dynamic_date_manager.subtract_day();

		evaluate_dynamic_change();

	});

	sub_current_timespan.click(function(){

		if(preview_date_manager.timespan == dynamic_date_manager.timespan){
			preview_date_manager.subtract_timespan();
		}

		dynamic_date_manager.subtract_timespan();

		evaluate_dynamic_change();

	});

	sub_current_year.click(function(){

		dynamic_date_manager.subtract_year();
		
		evaluate_dynamic_change();

	});

	add_current_day.click(function(){

		dynamic_date_manager.add_day();

		evaluate_dynamic_change();

	});

	add_current_timespan.click(function(){

		dynamic_date_manager.add_timespan();

		evaluate_dynamic_change();

	});

	add_current_year.click(function(){

		dynamic_date_manager.add_year();
		
		evaluate_dynamic_change();

	});


	current_year.change(function(e){

		if(e.originalEvent){
			dynamic_date_manager.year = convert_year(static_data, $(this).val()|0);
			evaluate_dynamic_change();
		}

		var year = $(this).val()|0;

		if(year != dynamic_date_manager.adjusted_year){
			$(this).val(dynamic_date_manager.adjusted_year);
			repopulate_timespan_select(current_timespan, dynamic_date_manager.timespan, false);
			repopulate_day_select(current_day, dynamic_date_manager.day, false);
		}

	});

	current_timespan.change(function(e){

		if(e.originalEvent){
			dynamic_date_manager.timespan = $(this).val()|0;
			evaluate_dynamic_change();
		}else{
			current_timespan.children().eq(dynamic_date_manager.timespan).prop('selected', true);
			repopulate_day_select(current_day, dynamic_date_manager.day, false);
		}


	});

	current_day.change(function(e){

		if(e.originalEvent){
			dynamic_date_manager.day = $(this).val()|0;
			evaluate_dynamic_change();
		}else{
			current_day.children().eq(dynamic_date_manager.day-1).prop('selected', true);
		}

	});



	$('.adjust_hour').click(function(){

		var adjust = $(this).attr('val')|0;
		var curr_hour = current_hour.val()|0;
		curr_hour = curr_hour + adjust;

		if(curr_hour < 0){
			sub_curr_day.click();
			curr_hour = static_data.clock.hours-1;
		}else if(curr_hour >= static_data.clock.hours){
			add_curr_day.click();
			curr_hour = 0;
		}

		current_hour.val(curr_hour).change();

	});


	$('.adjust_minute').click(function(){

		var adjust = $(this).attr('val')|0;
		var curr_minute = current_minute.val()|0;
		curr_minute = curr_minute + adjust;

		if(curr_minute < 0){
			$('.adjust_hour[val=-1]').click();
			curr_minute = Math.abs(static_data.clock.minutes+curr_minute);
		}else if(curr_minute >= static_data.clock.minutes){
			$('.adjust_hour[val=1]').click();
			curr_minute = Math.abs(static_data.clock.minutes-curr_minute);
		}

		current_minute.val(curr_minute).change();

	});

	current_hour.change(function(){
		dynamic_data.hour = $(this).val()|0;
		eval_current_time();
	});

	current_minute.change(function(){
		dynamic_data.minute = $(this).val()|0;
		eval_current_time();
	});



	location_select.change(function(){

		var prev_location_type = dynamic_data.custom_location;

		if(prev_location_type){
			var prev_location = static_data.seasons.locations[dynamic_data.location];
		}else{
			var prev_location = climate_generator.presets[dynamic_data.location];
		}

		dynamic_data.custom_location = location_select.find('option:selected').parent().attr('value') === "custom" && !location_select.find('option:selected').prop('disabled');

		dynamic_data.location = location_select.val();

		location_select.val()

		if(dynamic_data.custom_location){
			var location = static_data.seasons.locations[dynamic_data.location];
		}else{
			var location = climate_generator.presets[dynamic_data.location];
		}

		if(prev_location_type){
			dynamic_data.hour -= prev_location.settings.timezone.hour;
			dynamic_data.minute -= prev_location.settings.timezone.minute;
		}

		if(dynamic_data.custom_location){
			dynamic_data.hour += location.settings.timezone.hour;
			dynamic_data.minute += location.settings.timezone.minute;
		}

		if(dynamic_data.minute < 0){
			dynamic_data.minute = Math.abs(static_data.clock.minutes+dynamic_data.minute);
			dynamic_data.hour--;
		}else if(dynamic_data.minute >= static_data.clock.minutes){
			dynamic_data.minute = Math.abs(static_data.clock.minutes-dynamic_data.minute);
			dynamic_data.hour++;
		}

		var day_adjust = 0;
		if(dynamic_data.hour < 0){
			dynamic_data.hour = Math.abs(static_data.clock.hours+dynamic_data.hour);
			day_adjust = -1;
		}else if(dynamic_data.hour >= static_data.clock.hours){
			dynamic_data.hour = Math.abs(static_data.clock.hours-dynamic_data.hour);
			day_adjust = 1;
		}

		current_hour.val(dynamic_data.hour);
		current_minute.val(dynamic_data.minute);

		if(day_adjust != 0){
			dynamic_date_manager.day = dynamic_date_manager.day+day_adjust;
			evaluate_dynamic_change()
		}

		do_error_check('seasons', day_adjust != 0);

	});

}

function evaluate_dynamic_change(){

	if(dynamic_date_manager.adjusted_year != current_year.val()|0){
		current_year.change()
	}else if(dynamic_date_manager.timespan != current_timespan.val()|0){
		current_timespan.change()
	}else if(dynamic_date_manager.day != current_day.val()|0){
		current_day.change()
	}

	data = dynamic_date_manager.compare(dynamic_data);

	dynamic_data.year		= data.year;
	dynamic_data.timespan	= data.timespan;
	dynamic_data.day		= data.day;
	dynamic_data.epoch		= data.epoch;

	if(preview_date.follow){

		if(data.rebuild){
			rebuild_calendar('calendar', dynamic_data)
		}else{
			scroll_to_epoch(dynamic_data.epoch)
		}

		preview_date_follow();

	}

	update_current_day(false);

}


function fix_date(){
	if(current_day.children('option:enabled').length == 0){
		sub_curr_day.click();
	}
}

function repopulate_location_select_list(){

	var show_location_select = static_data.seasons.data.length > 0;

	var is_edit = location_select.closest('.wrap-collapsible').find('.form-inline.locations').length > 0;

	location_select.closest('.wrap-collapsible').toggleClass('hidden', !show_location_select && !is_edit);

	var html = [];

	if(show_location_select){

		if(static_data.seasons.locations.length > 0){

			html.push('<optgroup label="Custom" value="custom">');
			for(var i = 0; i < static_data.seasons.locations.length; i++){
				html.push(`<option value='${i}'>${static_data.seasons.locations[i].name}</option>`);
			}
			html.push('</optgroup>');

		}

		if(static_data.seasons.global_settings.enable_weather){
			if((static_data.seasons.data.length == 2 || static_data.seasons.data.length == 4)){
				html.push('<optgroup label="Presets" value="preset">');
				for(var i = 0; i < Object.keys(climate_generator.presets[static_data.seasons.data.length]).length; i++){
					html.push(`<option>${Object.keys(climate_generator.presets[static_data.seasons.data.length])[i]}</option>`);
				}
				html.push('</optgroup>');
			}else{
				html.push('<optgroup label="Presets" value="preset">');
				html.push(`<option disabled>Presets require two or four seasons.</option>`);
				html.push('</optgroup>');
			}
		}

		if(location_select.val() === null){
			location_select.find('option').first().prop('selected', true);
			dynamic_data.location = location_select.val();
			dynamic_data.custom_location = location_select.find('option:selected').parent().attr('value') === 'custom';
		}

	}

	if(html.length > 0){

		location_select.prop('disabled', false).html(html.join('')).val(dynamic_data.location);

	}else{

		location_select.prop('disabled', true).html(html.join(''));

	}

}

function set_up_view_values(){

	if(dynamic_data){

		dynamic_date_manager = new date_manager(dynamic_data.year, dynamic_data.timespan, dynamic_data.day);

		current_year.val(dynamic_date_manager.adjusted_year);

		repopulate_timespan_select(current_timespan, dynamic_data.timespan, false);

		repopulate_day_select(current_day, dynamic_data.day, false);

	}

	if(static_data.clock && dynamic_data.hour !== undefined && dynamic_data.minute !== undefined){

		current_hour.val(dynamic_data.hour).prop('min', 0).prop('max', static_data.clock.hours-1);
		current_minute.val(dynamic_data.minute).prop('min', 0).prop('max', static_data.clock.minutes-1);

	}

	repopulate_location_select_list();

}