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
			sub_current_day.click();
			curr_hour = static_data.clock.hours-1;
		}else if(curr_hour >= static_data.clock.hours){
			add_current_day.click();
			curr_hour = 0;
		}

		current_hour.val(curr_hour).change();

	});

	current_hour.change(function(){

		var curr_hour = current_hour.val()|0;

		if(curr_hour < 0){
			sub_current_day.click();
			curr_hour = static_data.clock.hours-1;
		}else if(curr_hour >= static_data.clock.hours){
			add_current_day.click();
			curr_hour = 0;
		}

		dynamic_data.hour = curr_hour;
		current_hour.val(curr_hour);

		var apply_changes_immediately = $('#apply_changes_immediately');

		if(apply_changes_immediately.length == 0){
			apply_changes_immediately = true;
		}else{
			apply_changes_immediately = apply_changes_immediately.is(':checked');
		}

		if(!apply_changes_immediately){
			evaluate_apply_show_hide();
			return;
		}

		eval_current_time();
		evaluate_save_button();

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

	current_minute.change(function(){

		var curr_minute = current_minute.val()|0;

		if(curr_minute < 0){
			$('.adjust_hour[val=-1]').click();
			curr_minute = Math.abs(static_data.clock.minutes+curr_minute);
		}else if(curr_minute >= static_data.clock.minutes){
			$('.adjust_hour[val=1]').click();
			curr_minute = Math.abs(static_data.clock.minutes-curr_minute);
		}

		dynamic_data.minute = curr_minute;
		current_minute.val(curr_minute);

		var apply_changes_immediately = $('#apply_changes_immediately');

		if(apply_changes_immediately.length == 0){
			apply_changes_immediately = true;
		}else{
			apply_changes_immediately = apply_changes_immediately.is(':checked');
		}

		if(!apply_changes_immediately){
			evaluate_apply_show_hide();
			return;
		}

		eval_current_time();
		evaluate_save_button();
	});

	location_select.change(function(){

		var prev_location_type = dynamic_data.custom_location;

		if(prev_location_type){
			var prev_location = static_data.seasons.locations[dynamic_data.location];
		}else{
			var prev_location = preset_data.locations[dynamic_data.location];
		}

		dynamic_data.custom_location = location_select.find('option:selected').parent().attr('value') === "custom" && !location_select.find('option:selected').prop('disabled');

		dynamic_data.location = location_select.val();

		if(dynamic_data.custom_location){
			var location = static_data.seasons.locations[dynamic_data.location];
		}else{
			var location = preset_data.locations[dynamic_data.location];
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
			if(day_adjust > 0){
				dynamic_date_manager.add_day();
			}else{
				dynamic_date_manager.subtract_day();
			}
			evaluate_dynamic_change();
		}

		do_error_check('seasons');

	});



	$('#current_date_btn').click(function(){
		if(!Perms.player_at_least('co-owner') && !static_data.settings.allow_view){
			return;
		}
		increment_date_units(true);
	});

	$('#preview_date_btn').click(function(){
		if(!Perms.player_at_least('co-owner') && !static_data.settings.allow_view){
			return;
		}
		increment_date_units(false);
	});


	$('#unit_years').val("");
	$('#unit_months').val("");
	$('#unit_days').val("");
	$('#unit_hours').val("");
	$('#unit_minutes').val("");

}


function increment_date_units(current){

	var unit_years = $('#unit_years').val()|0;
	var unit_months = $('#unit_months').val()|0;
	var unit_days = $('#unit_days').val()|0;
	var unit_hours = $('#unit_hours').val()|0;
	var unit_minutes = $('#unit_minutes').val()|0;

	if(current){
		var manager = dynamic_date_manager;
	}else{
		var manager = preview_date_manager;
	}

	for(var years = 1; years <= Math.abs(unit_years); years++){
		if(unit_years < 0){
			manager.subtract_year();
		}else if(unit_years > 0){
			manager.add_year();
		}
	}

	for(var months = 1; months <= Math.abs(unit_months); months++){
		if(unit_months < 0){
			manager.subtract_timespan();
		}else if(unit_months > 0){
			manager.add_timespan();
		}
	}

	let extra_days = 0;

	if(static_data.clock.enabled){

		let extra_hours = (unit_minutes+dynamic_data.minute)/static_data.clock.minutes;
		extra_days = (unit_hours+extra_hours+dynamic_data.hour)/static_data.clock.hours;

		var new_hour = precisionRound(fract(extra_days) * static_data.clock.hours, 4);
		var new_minute = Math.floor(fract(new_hour) * static_data.clock.minutes);

		extra_days = Math.floor(extra_days);
		new_hour = Math.floor(new_hour);

	}

	unit_days += extra_days;

	for(var days = 1; days <= Math.abs(unit_days); days++){
		if(unit_days < 0){
			manager.subtract_day();
		}else if(unit_days > 0){
			manager.add_day();
		}
	}

	if(current){

		if(static_data.clock.enabled){
			if(dynamic_data.hour != new_hour || dynamic_data.minute != new_minute){
				dynamic_data.hour = new_hour
				dynamic_data.minute = new_minute;
				current_hour.val(new_hour);
				current_minute.val(new_minute);
				eval_clock();
			}
		}

		evaluate_dynamic_change();
	}else{
		evaluate_preview_change();
		go_to_preview_date();
	}

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

	dynamic_data.year		 = data.year;
	dynamic_data.timespan	 = data.timespan;
	dynamic_data.day		 = data.day;
	dynamic_data.epoch		 = data.epoch;
	dynamic_data.current_era = get_current_era(static_data, dynamic_data.epoch);

	var apply_changes_immediately = $('#apply_changes_immediately');

	if(apply_changes_immediately.length == 0){
		apply_changes_immediately = true;
	}else{
		apply_changes_immediately = apply_changes_immediately.is(':checked');
	}

	changes_applied = false;

	if(preview_date.follow){

		preview_date.year		= data.year;
		preview_date.timespan	= data.timespan;
		preview_date.day		= data.day;
		preview_date.epoch		= data.epoch;

		if(data.rebuild || (!Perms.owner && static_data.settings.only_reveal_today) || !apply_changes_immediately){
			pre_rebuild_calendar('calendar', dynamic_data)
		}else{
			scroll_to_epoch();
			update_current_day(false);
		}

		preview_date_follow();

	}else{

		if(!apply_changes_immediately){
			pre_rebuild_calendar('calendar', preview_date)
		}else{
			update_current_day(false);
		}

	}

	evaluate_save_button();

}


function fix_date(){
	if(current_day.children('option:enabled').length == 0){
		sub_curr_day.click();
	}
}

function repopulate_location_select_list(){

	if(!creation.is_done()){
		return;
	}

	var html = [];

	if(static_data.seasons.locations.length > 0){

		html.push('<optgroup label="Custom" value="custom">');
		for(var i = 0; i < static_data.seasons.locations.length; i++){
			html.push(`<option value='${i}'>${static_data.seasons.locations[i].name}</option>`);
		}
		html.push('</optgroup>');

	}

	html.push('<optgroup label="Location Presets" value="preset">');
	if((static_data.seasons.data.length == 2 || static_data.seasons.data.length == 4) && static_data.seasons.global_settings.enable_weather){
		for(var i = 0; i < Object.keys(preset_data.locations[static_data.seasons.data.length]).length; i++){
			html.push(`<option>${Object.keys(preset_data.locations[static_data.seasons.data.length])[i]}</option>`);
		}
	}else{
		html.push(`<option disabled>Presets require two or four seasons and weather enabled.</option>`);
	}
	html.push('</optgroup>');


	if(html.length > 0){

		location_select.prop('disabled', false).html(html.join('')).val(dynamic_data.location);

	}else{

		location_select.prop('disabled', true).html(html.join(''));

	}

	if(location_select.val() === null){
		location_select.children().find('option').first().prop('selected', true);
		dynamic_data.location = location_select.val();
		dynamic_data.custom_location = location_select.find('option:selected').parent().attr('value') === 'custom';
	}


}

function set_up_view_values(){

    preview_date = clone(dynamic_data);

    preview_date.follow = true;

	dynamic_date_manager = new date_manager(dynamic_data.year, dynamic_data.timespan, dynamic_data.day);

	current_year.val(dynamic_date_manager.adjusted_year);

	repopulate_timespan_select(current_timespan, dynamic_data.timespan, false);

	repopulate_day_select(current_day, dynamic_data.day, false);

	if(static_data.clock && dynamic_data.hour !== undefined && dynamic_data.minute !== undefined){

		current_hour.val(dynamic_data.hour).prop('min', -1).prop('max', static_data.clock.hours);
		current_minute.val(dynamic_data.minute).prop('min', -1).prop('max', static_data.clock.minutes);

	}

	repopulate_location_select_list();

}
