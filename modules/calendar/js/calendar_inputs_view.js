function set_up_view_inputs(){

	bind_calendar_events();

	calendar_container = $('#calendar');
	
	current_year = $('#current_year');
	current_timespan = $('#current_timespan');
	current_day = $('#current_day');

	current_hour = $('#current_hour');
	current_minute = $('#current_minute');

	if(calendar.date){

		current_year.val(calendar.date.year);
		current_year.data('val', current_year.val());

		var curr_timespan = repopulate_timespan_select(convert_year(calendar.date.year));
		repopulate_day_select(convert_year(calendar.date.year), curr_timespan);

	}

	if(calendar.clock && calendar.date.hour !== undefined && calendar.date.minute !== undefined){

		console.log(calendar.date.hour);

		current_hour.val(calendar.date.hour).prop('min', 0).prop('max', calendar.clock.hours-1);
		current_minute.val(calendar.date.minute).prop('min', 0).prop('max', calendar.clock.minutes-1);

	}


	sub_year = $('#sub_year');
	add_year = $('#add_year');

	sub_timespan = $('#sub_timespan');
	add_timespan = $('#add_timespan');

	sub_day = $('#sub_day');
	add_day = $('#add_day');

	sub_day.click(function(){

		var target = $(this).next();
		var value = target.val()|0;
		var selected = target.find('option:selected');
		var options = target.children(":enabled");
		var prev = options.index(selected)-1;

		if(prev < 0){
			sub_timespan.click();
			target.children('option:enabled').last().prop('selected', true).change();
		}else{
			options.eq(prev).prop('selected', true);
			target.change();
		}
	});

	sub_timespan.click(function(){

		var target = $(this).next();
		var value = target.val()|0;
		var selected = target.find('option:selected');
		var options = target.children(":enabled");
		var prev = options.index(selected)-1;

		if(prev < 0){
			sub_year.click();
			target.children('option:enabled').last().prop('selected', true).change();
		}else{
			options.eq(prev).prop('selected', true);
			target.change();
		}

	});

	sub_year.click(function(){

		var target = $(this).next();
		var value = target.val()|0;
		target.val(value-1).change();
		if(current_timespan.children(":enabled").length == 0){
			sub_year.click();
		}else{
			if(current_timespan.val() === null){
				current_timespan.children('option:enabled').eq(calendar.date.timespan).prop('selected', true).change();
			}
			
			if(current_day.val() === null){
				current_day.children('option:enabled').eq(calendar.date.timespan).prop('selected', true).change();
			}
		}

	});

	add_day.click(function(){

		var target = $(this).prev();
		var value = target.val()|0;
		var selected = target.find('option:selected');
		var options = target.children(":enabled");
		var next = options.index(selected)+1;

		if(next == options.length){
			add_timespan.click();
			target.children('option:enabled').first().prop('selected', true).change();
		}else{
			options.eq(next).prop('selected', true);
			target.change();
		}
	});

	add_timespan.click(function(){

		var target = $(this).prev();
		var value = target.val()|0;
		var selected = target.find('option:selected');
		var options = target.children(":enabled");
		var next = options.index(selected)+1;

		if(next == options.length){
			add_year.click();
			target.children('option:enabled').first().prop('selected', true).change();
		}else{
			options.eq(next).prop('selected', true);
			target.change();
		}

	});

	add_year.click(function(){

		var target = $(this).prev();
		var value = target.val()|0;
		target.val(value+1).change();
		if(current_timespan.children(":enabled").length == 0){
			add_year.click();
		}else{
			if(current_timespan.val() === null){
				current_timespan.children('option:enabled').eq(calendar.date.timespan).prop('selected', true).change();
			}
			
			if(current_day.val() === null){
				current_day.children('option:enabled').eq(calendar.date.timespan).prop('selected', true).change();
			}
		}
	});


	current_year.change(function(){

		var curr_year = $(this).val()|0;
		
		if(curr_year == 0){
			if(calendar.date.year < 0){
				curr_year = 1;
			}else if(calendar.date.year > 0){
				curr_year = -1;
			}
			$(this).data('val', curr_year);
			$(this).val(curr_year);
		}

		if(calendar.date.year != curr_year){

			var curr_timespan = repopulate_timespan_select(convert_year(curr_year));

			repopulate_day_select(convert_year(curr_year), curr_timespan);

		}

	});

	current_timespan.change(function(){

		var curr_timespan = $(this).val()|0;
		var prev_timespan = $(this).data('val')|0;
		var rebuild = false;

		repopulate_day_select(convert_year(calendar.date.year), curr_timespan);

	});

	current_year.change($.debounce(200, function(e) {
		set_date();
	}));

	current_timespan.change($.debounce(50, function(e) {
		set_date();
	}));

	current_day.change($.debounce(10, function(e) {
		set_date();
	}));

	function set_date(){

		var rebuild = false;

		var curr_year = current_year.val()|0;
		var curr_timespan = current_timespan.val()|0;
		var curr_day = current_day.val()|0;

		if(calendar.date.year != curr_year){
			rebuild = true;
		}else if(calendar.date.timespan != curr_timespan && calendar.settings.show_current_month){
			rebuild = true;
		}

		calendar.date.year = curr_year;
		calendar.date.timespan = curr_timespan;
		calendar.date.day = curr_day;

		if(rebuild){
			rebuild_calendar('calendar');
		}
		update_current_day(true);

	}

	function repopulate_timespan_select(year){
		var html = [];
		for(var i = 0; i < calendar.year_data.timespans.length; i++){
			var is_there = does_timespan_appear(year, i);
			html.push(`<option ${!is_there.result ? 'disabled' : ''} value='${i}'>`);
			html.push(calendar.year_data.timespans[i].name + (!is_there.result ? ` (${is_there.reason})` : ''));
			html.push('</option>');
		}

		current_timespan.html(html.join('')).val(calendar.date.timespan);
		if(current_timespan.find('option:selected').prop('disabled') || current_timespan.val() == null){
			for(var i = current_timespan.find('option:selected').val()|0; i >= 0 ; i--){
				if(!current_timespan.children().eq(i).prop('disabled')){
					break;
				}
			}
			current_timespan.val(i);
		}

		return current_timespan.val()|0;
	}

	function repopulate_day_select(year, timespan){
		var days = get_days_in_timespan(year, timespan, true);
		var html = [];
		for(var i = 0; i < days.length; i++){
			var day = days[i];
			html.push(`<option value='${i+1}' ${!day.is_there.result ? 'disabled' : ''}>`);
			html.push(day.text + (!day.is_there.result ? ` (${day.is_there.reason})` : ''));
			html.push('</option>');
		}
		current_day.html(html.join('')).val(calendar.date.day);
		if(current_day.find('option:selected').prop('disabled') || current_day.val() == null){
			for(var i = calendar.date.day-1; i >= 0; i--){
				if(current_day.children().eq(i).length && !current_day.children().eq(i).prop('disabled')){
					break;
				}
			}
			current_day.val(i+1);
		}
		current_day.data('val', calendar.date.day);

		return current_day.val()|0;
	}


	$('.adjust_hour').click(function(){

		var adjust = $(this).attr('val')|0;
		var curr_hour = current_hour.val()|0;
		curr_hour = curr_hour + adjust;

		if(curr_hour < 0){
			sub_day.click();
			curr_hour = calendar.clock.hours-1;
		}else if(curr_hour >= calendar.clock.hours){
			add_day.click();
			curr_hour = 0;
		}

		current_hour.val(curr_hour);

	});


	$('.adjust_minute').click(function(){

		var adjust = $(this).attr('val')|0;
		var curr_minute = current_minute.val()|0;
		curr_minute = curr_minute + adjust;

		if(curr_minute < 0){
			$('.adjust_hour[val=-1]').click();
			curr_minute = calendar.clock.minutes-1;
		}else if(curr_minute >= calendar.clock.minutes){
			$('.adjust_hour[val=1]').click();
			curr_minute = Math.abs(calendar.clock.minutes-curr_minute);
		}

		current_minute.val(curr_minute);

	});



}