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

	current_year.change(function(){

		var curr_year = $(this).val()|0;
		
		if(curr_year == 0 && !static_data.settings.year_zero_exists){
			if(dynamic_data.year < 0){
				curr_year = 1;
			}else if(dynamic_data.year > 0){
				curr_year = -1;
			}
			$(this).data('val', curr_year);
			$(this).val(curr_year);
		}

		repopulate_timespan_select(current_timespan, dynamic_data.timespan);

		repopulate_day_select(current_day, dynamic_data.day);

		repopulate_timespan_select(target_timespan, dynamic_data.timespan);

		repopulate_day_select(target_day, dynamic_data.day);

	});

	current_timespan.change(function(){

		var curr_year = current_year.val()|0;

		var curr_timespan = $(this).val()|0;
		var prev_timespan = $(this).data('val')|0;

		repopulate_day_select(current_day, dynamic_data.day);
		repopulate_day_select(target_day, dynamic_data.day);

	});



	sub_curr_year = $('#sub_current_year');
	add_curr_year = $('#add_current_year');

	sub_curr_timespan = $('#sub_current_timespan');
	add_curr_timespan = $('#add_current_timespan');

	sub_curr_day = $('#sub_current_day');
	add_curr_day = $('#add_current_day');

	sub_curr_day.click(function(){

		var target = $(this).next();
		var value = target.val()|0;
		var selected = target.find('option:selected');
		var options = target.children(":enabled");
		var prev = options.index(selected)-1;

		if(prev < 0){
			sub_curr_timespan.click();
			if(target.children('option:enabled').length == 0 || target.children().length == 0){
				$(this).click();
			}else{
				target.children('option:enabled').last().prop('selected', true).change();
			}
		}else{
			options.eq(prev).prop('selected', true);
			target.change();
		}

	});

	sub_curr_timespan.click(function(){

		var target = $(this).next();
		var value = target.val()|0;
		var selected = target.find('option:selected');
		var options = target.children(":enabled");
		var prev = options.index(selected)-1;

		if(prev < 0){
			sub_curr_year.click();
			if(target.children('option:enabled').length == 0 || target.children().length == 0){
				$(this).click();
			}else{
				target.children('option:enabled').last().prop('selected', true).change();
			}
		}else{
			options.eq(prev).prop('selected', true);
			target.change();
		}

	});

	sub_curr_year.click(function(){

		var target = $(this).next();
		var value = target.val()|0;
		if(value == 1 && !static_data.settings.year_zero_exists){
			value -= 2;
		}else{
			value -= 1;
		}

		var btn_type = $(this).parent().attr('value') === "current";

		var timespan_input = btn_type ? current_timespan : target_timespan;
		var day_input = btn_type ? current_day : target_day;
		var date_var = btn_type ? dynamic_data : preview_date;

		if(timespan_input.children(":enabled").length == 0){
			sub_curr_year.click();
		}else{
			if(timespan_input.val() === null){
				timespan_input.children('option:enabled').eq(date_var.timespan).prop('selected', true).change();
			}
			
			if(day_input.val() === null){
				day_input.children('option:enabled').eq(date_var.day).prop('selected', true).change();
			}
		}

		target.val(value).change();

	});

	add_curr_day.click(function(){

		var target = $(this).prev();
		var value = target.val()|0;
		var selected = target.find('option:selected');
		var options = target.children(":enabled");
		var next = options.index(selected)+1;

		if(next == options.length){
			add_curr_timespan.click();
			if(target.children('option:enabled').length == 0 || target.children().length == 0){
				$(this).click()
			}else{
				target.children('option:enabled').first().prop('selected', true).change();
			}
		}else{
			options.eq(next).prop('selected', true);
			target.change();
		}

	});

	add_curr_timespan.click(function(){

		var target = $(this).prev();
		var value = target.val()|0;
		var selected = target.find('option:selected');
		var options = target.children(":enabled");
		var next = options.index(selected)+1;

		if(next == options.length){
			add_curr_year.click();
			if(target.children('option:enabled').length == 0 || target.children().length == 0){
				$(this).click()
			}else{
				target.children('option:enabled').first().prop('selected', true).change();
			}
		}else{
			options.eq(next).prop('selected', true);
			target.change();
		}

	});

	add_curr_year.click(function(){

		var target = $(this).prev();
		var value = target.val()|0;
		if(value == -1 && !static_data.settings.year_zero_exists){
			value += 2;
		}else{
			value += 1;
		}

		var btn_type = $(this).parent().attr('value') === "current";

		var timespan_input = btn_type ? current_timespan : target_timespan;
		var day_input = btn_type ? current_day : target_day;
		var date_var = btn_type ? dynamic_data : preview_date;

		if(timespan_input.children(":enabled").length == 0){
			add_curr_year.click();
		}else{
			if(timespan_input.val() === null){
				timespan_input.children('option:enabled').eq(date_var.timespan).prop('selected', true).change();
			}
			
			if(day_input.val() === null){
				day_input.children('option:enabled').eq(date_var.day).prop('selected', true).change();
			}
		}
		
		target.val(value).change();

	});

	current_year.change($.debounce(200, function(e) {
		var curr_year = current_year.val()|0;
		var curr_timespan = current_timespan.val()|0;
		var curr_day = current_day.val()|0;
		target_year.val(curr_year);
		target_timespan.val(curr_timespan);
		target_day.val(curr_day);
		set_date(curr_year, curr_timespan, curr_day);
	}));

	current_timespan.change($.debounce(50, function(e) {
		var curr_year = current_year.val()|0;
		var curr_timespan = current_timespan.val()|0;
		var curr_day = current_day.val()|0;
		target_year.val(curr_year);
		target_timespan.val(curr_timespan);
		target_day.val(curr_day);
		set_date(curr_year, curr_timespan, curr_day);
	}));

	current_day.change(function(e){

		var curr_year = current_year.val()|0;
		var curr_timespan = current_timespan.val()|0;
		var curr_day = current_day.val()|0;
		target_year.val(curr_year);
		target_timespan.val(curr_timespan);
		target_day.val(curr_day);
		set_date(curr_year, curr_timespan, curr_day);
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

		dynamic_data.custom_location = $(this).find('option:selected').parent().attr('value') === "custom";

		dynamic_data.location = $(this).val();

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
			day_adjust = 1;
		}else if(dynamic_data.hour >= static_data.clock.hours){
			dynamic_data.hour = Math.abs(static_data.clock.hours-dynamic_data.hour);
			day_adjust = -1;
		}

		current_hour.val(dynamic_data.hour);
		current_minute.val(dynamic_data.minute);

		if(day_adjust != 0){
			var value = current_day.val()|0;
			var selected = current_day.find('option:selected');
			var options = current_day.children(":enabled");
			var val = options.index(selected)+day_adjust;

			if(val < 0){
				sub_curr_timespan.click();
				current_day.children('option:enabled').last().prop('selected', true).change();
			}else if(val == options.length){
				add_curr_timespan.click();
				target.children('option:enabled').first().prop('selected', true).change();
			}else{
				options.eq(val).prop('selected', true);
				current_day.change();
			}
		}

		do_error_check('seasons');

	});

}

var set_date = debounce(function(year, timespan, day){

	var rebuild = false;

	if((dynamic_data.year != year || (dynamic_data.year == year && dynamic_data.year != preview_date.year))
		||
		(static_data.settings.show_current_month && (dynamic_data.timespan != timespan || (dynamic_data.timespan == timespan && dynamic_data.timespan != preview_date.timespan)))
	){
		rebuild = true;
	}

	dynamic_data.year = year;
	dynamic_data.timespan = timespan;
	dynamic_data.day = day;

	error_check(undefined, rebuild);

	if(!rebuild){
		scroll_to_epoch(dynamic_data.epoch)
	}

}, 200);



function fix_date(){
	if(current_day.children('option:enabled').length == 0){
		sub_curr_day.click();
	}
}


function set_up_view_values(){

	if(dynamic_data){

		current_year.val(dynamic_data.year);
		current_year.data('val', current_year.val());

		repopulate_timespan_select(current_timespan, dynamic_data.timespan);

		repopulate_day_select(current_day, dynamic_data.day);

	}

	if(static_data.clock && dynamic_data.hour !== undefined && dynamic_data.minute !== undefined){

		current_hour.val(dynamic_data.hour).prop('min', 0).prop('max', static_data.clock.hours-1);
		current_minute.val(dynamic_data.minute).prop('min', 0).prop('max', static_data.clock.minutes-1);

	}

	if(static_data.seasons.locations){

		repopulate_location_select_list();

	}

	set_up_preview_values();

}