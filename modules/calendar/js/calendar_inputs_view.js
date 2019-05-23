function set_up_view_inputs(){

	bind_calendar_events();

	calendar_container = $('#calendar');
	
	current_year = $('#current_year');
	current_timespan = $('#current_timespan');
	current_day = $('#current_day');
	
	target_year = $('#target_year');
	target_timespan = $('#target_timespan');
	target_day = $('#target_day');

	current_hour = $('#current_hour');
	current_minute = $('#current_minute');

	preview_date = clone(date);

	if(date){

		current_year.val(date.year);
		current_year.data('val', current_year.val());

		var curr_timespan = repopulate_timespan_select(current_timespan, convert_year(date.year));
		repopulate_day_select(current_day, convert_year(date.year), curr_timespan);

		if(target_year.length){

			target_year.val(preview_date.year);
			target_year.data('val', target_year.val());

			var curr_timespan = repopulate_timespan_select(target_timespan, convert_year(preview_date.year));
			repopulate_day_select(target_day, convert_year(preview_date.year), curr_timespan);

		}

	}

	if(calendar.clock && date.hour !== undefined && date.minute !== undefined){

		current_hour.val(date.hour).prop('min', 0).prop('max', calendar.clock.hours-1);
		current_minute.val(date.minute).prop('min', 0).prop('max', calendar.clock.minutes-1);

	}

	sub_year = $('.sub_year');
	add_year = $('.add_year');

	sub_timespan = $('.sub_timespan');
	add_timespan = $('.add_timespan');

	sub_day = $('.sub_day');
	add_day = $('.add_day');

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
				current_timespan.children('option:enabled').eq(date.timespan).prop('selected', true).change();
			}
			
			if(current_day.val() === null){
				current_day.children('option:enabled').eq(date.timespan).prop('selected', true).change();
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
				current_timespan.children('option:enabled').eq(date.timespan).prop('selected', true).change();
			}
			
			if(current_day.val() === null){
				current_day.children('option:enabled').eq(date.timespan).prop('selected', true).change();
			}
		}

	});

	current_year.change(function(){

		var curr_year = $(this).val()|0;
		
		if(curr_year == 0){
			if(date.year < 0){
				curr_year = 1;
			}else if(date.year > 0){
				curr_year = -1;
			}
			$(this).data('val', curr_year);
			$(this).val(curr_year);
		}

		if(date.year != curr_year){

			var curr_timespan = repopulate_timespan_select(current_timespan, convert_year(curr_year));

			repopulate_day_select(current_day, convert_year(curr_year), curr_timespan);			

		}

	});

	current_timespan.change(function(){

		var curr_year = current_year.val()|0;

		var curr_timespan = $(this).val()|0;
		var prev_timespan = $(this).data('val')|0;

		repopulate_day_select(current_day, convert_year(curr_year), curr_timespan);

	});

	current_year.change($.debounce(200, function(e) {
		var curr_year = current_year.val()|0;
		var curr_timespan = current_timespan.val()|0;
		var curr_day = current_day.val()|0;
		set_date(curr_year, curr_timespan, curr_day);
	}));

	current_timespan.change($.debounce(50, function(e) {
		var curr_year = current_year.val()|0;
		var curr_timespan = current_timespan.val()|0;
		var curr_day = current_day.val()|0;
		set_date(curr_year, curr_timespan, curr_day);
	}));

	current_day.change($.debounce(10, function(e) {
		var curr_year = current_year.val()|0;
		var curr_timespan = current_timespan.val()|0;
		var curr_day = current_day.val()|0;
		set_date(curr_year, curr_timespan, curr_day);
	}));

	function set_date(year, timespan, day){

		var rebuild = false;

		if((date.year != year || (date.year == year && date.year != preview_date.year))
			||
			(calendar.settings.show_current_month && (date.timespan != timespan || (date.timespan == timespan && date.timespan != preview_date.timespan)))
		){
			rebuild = true;
		}

		date.year = year;
		date.timespan = timespan;
		date.day = day;

		if(rebuild){
			rebuild_calendar('calendar');
			update_current_day(true);
			evaluate_sun();
		}else{
			update_current_day(true);
			evaluate_sun();
		}

	}

	function set_preview_date(year, timespan, day){

		var rebuild = false;

		if((preview_date.year != year || (preview_date.year == year && preview_date.year != date.year))
			||
			(calendar.settings.show_current_month && (preview_date.timespan != timespan || (preview_date.timespan == timespan && preview_date.timespan != date.timespan)))
		){
			rebuild = true;
		}

		preview_date.year = year;
		preview_date.timespan = timespan;
		preview_date.day = day;

		if(rebuild){
			rebuild_calendar('preview', preview_date);
		}

	}


	target_year.change(function(){

		var tar_year = $(this).val()|0;
		
		if(tar_year == 0){
			if(preview_date.year < 0){
				tar_year = 1;
			}else if(preview_date.year > 0){
				tar_year = -1;
			}
			$(this).data('val', tar_year);
			$(this).val(tar_year);
		}


		var tar_timespan = repopulate_timespan_select(target_timespan, convert_year(tar_year));

		repopulate_day_select(target_day, convert_year(tar_year), tar_timespan);

	});

	target_timespan.change(function(){

		var tar_year = target_year.val()|0;

		var tar_timespan = $(this).val()|0;
		var prev_timespan = $(this).data('val')|0;

		repopulate_day_select(target_day, convert_year(tar_year), tar_timespan);

	});

	$('#go_to_preview_date').click(function(){
		var tar_year = target_year.val()|0;
		var tar_timespan = target_timespan.val()|0;
		var tar_day = target_day.val()|0;
		set_preview_date(tar_year, tar_timespan, tar_day);
	});

	$('#reset_preview_date').click(function(){
		target_year.val(current_year.val());
		target_timespan.val(current_timespan.val());
		target_day.val(current_day.val());
		var curr_year = current_year.val()|0;
		var curr_timespan = current_timespan.val()|0;
		var curr_day = current_day.val()|0;
		set_date(curr_year, curr_timespan, curr_day);
	});

	function repopulate_timespan_select(select, year){
		var html = [];
		for(var i = 0; i < calendar.year_data.timespans.length; i++){
			var is_there = does_timespan_appear(year, i);
			html.push(`<option ${!is_there.result ? 'disabled' : ''} value='${i}'>`);
			html.push(calendar.year_data.timespans[i].name + (!is_there.result ? ` (${is_there.reason})` : ''));
			html.push('</option>');
		}

		select.html(html.join('')).val(date.timespan);
		if(select.find('option:selected').prop('disabled') || select.val() == null){
			for(var i = select.find('option:selected').val()|0; i >= 0 ; i--){
				if(!select.children().eq(i).prop('disabled')){
					break;
				}
			}
			select.val(i);
		}

		return select.val()|0;
	}

	function repopulate_day_select(select, year, timespan){
		var days = get_days_in_timespan(year, timespan, true);
		var html = [];
		for(var i = 0; i < days.length; i++){
			var day = days[i];
			html.push(`<option value='${i+1}' ${!day.is_there.result ? 'disabled' : ''}>`);
			html.push(day.text + (!day.is_there.result ? ` (${day.is_there.reason})` : ''));
			html.push('</option>');
		}
		select.html(html.join('')).val(date.day);
		if(select.find('option:selected').prop('disabled') || select.val() == null){
			for(var i = date.day-1; i >= 0; i--){
				if(select.children().eq(i).length && !select.children().eq(i).prop('disabled')){
					break;
				}
			}
			select.val(i+1);
		}
		select.data('val', date.day);

		return select.val()|0;
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

		current_hour.val(curr_hour).change();

	});


	$('.adjust_minute').click(function(){

		var adjust = $(this).attr('val')|0;
		var curr_minute = current_minute.val()|0;
		curr_minute = curr_minute + adjust;

		if(curr_minute < 0){
			$('.adjust_hour[val=-1]').click();
			curr_minute = Math.abs(calendar.clock.minutes+curr_minute);
		}else if(curr_minute >= calendar.clock.minutes){
			$('.adjust_hour[val=1]').click();
			curr_minute = Math.abs(calendar.clock.minutes-curr_minute);
		}

		current_minute.val(curr_minute).change();

	});

	current_hour.change(function(){
		date.hour = $(this).val()|0;
		eval_current_time();
	});

	current_minute.change(function(){
		date.minute = $(this).val()|0;
		eval_current_time();
	});

}


function eval_clock(){

	clock_hours = calendar.clock.hours;

	$('#clock').empty();

	$('#clock').css('display', 'block');

	var element = [];
	element.push("<img src='resources/clock_arm.png' id='clock_arm'/>");
	element.push("<div id='clock_hours'></div>");
	element.push("<img src='resources/endofday_dayhelper.png' id='end_dayhelper' class='SunUpDown'/>");
	element.push("<img src='resources/endofday_nighthelper.png' id='end_nighthelper' class='SunUpDown'/>");
	element.push("<img src='resources/startofday_dayhelper.png' id='start_dayhelper' class='SunUpDown'/>");
	element.push("<img src='resources/startofday_nighthelper.png' id='start_nighthelper' class='SunUpDown'/>");
	element.push("<img src='resources/startofday.png' id='StartOfDay' class='SunUpDown'/>");
	element.push("<img src='resources/endofday.png' id='EndOfDay' class='SunUpDown' />");
	element.push("<img src='resources/clock_base.png' id='base'/>");

	$('#clock').html(element.join(''));

	element = [];
	for(var i = 0; i < clock_hours; i++){
		var rotation = ((360/clock_hours)*i);
		element.push(`<div class='clock_hour_text_container' style='transform: rotate(${rotation+180}deg);'><span class='clock_hour_text' style='transform: rotate(-${rotation+180}deg);'>${i}</span></div>`)
		element.push(`<img class='clock_hour' src='resources/clock_hour.png' style='transform: rotate(${rotation}deg);'>`);
	}

	$('#clock_hours').html(element.join(''));

	eval_current_time();

}

function eval_current_time(){

	var clock_hour = date.hour;
	var clock_minute = date.minute;
	var clock_time = clock_hour + (clock_minute/60);
	var clock_fraction_time = clock_time/clock_hours;

	var rotation = (360/clock_hours)*clock_time;

	if(clock_time >= clock_hours)
	{
		rotation = 360+(360/clock_hours)*clock_time;
	}
	else if(clock_time < 0)
	{
		rotation = (360/clock_hours)*clock_time;
	}

	rotate_element($('#clock_arm'), rotation);

	evaluate_sun();

}

function evaluate_sun(){

	if(evaluated_calendar_data.epoch_data[date.epoch]){

		var sunset = evaluated_calendar_data.epoch_data[date.epoch].weather.sunset[0];
		var sunrise = evaluated_calendar_data.epoch_data[date.epoch].weather.sunrise[0];

		sunset = (360/clock_hours)*(sunset+clock_hours/4);
		sunrise = (360/clock_hours)*(sunrise-clock_hours/4);

		if(sunrise > 0){
			$('#start_dayhelper').css('display', 'none');
			$('#start_nighthelper').css('display', 'block');
		}else{
			$('#start_dayhelper').css('display', 'block');
			$('#start_nighthelper').css('display', 'none');
		}

		if(sunset > 360){
			$('#end_dayhelper').css('display', 'block');
			$('#end_nighthelper').css('display', 'none');
		}else{
			$('#end_dayhelper').css('display', 'none');
			$('#end_nighthelper').css('display', 'block');
		}

		rotate_element($('#StartOfDay'), sunrise);
		rotate_element($('#start_dayhelper'), sunrise*0.935);
		rotate_element($('#start_nighthelper'), sunrise*0.935);

		rotate_element($('#EndOfDay'), sunset);
		rotate_element($('#end_dayhelper'), (sunset-360)*0.935);
		rotate_element($('#end_nighthelper'), (sunset-360)*0.935);
		
	}

}

function rotate_element(element, rotation){
	element.css('-webkit-transform','rotate('+rotation+'deg)'); 
	element.css('-moz-transform','rotate('+rotation+'deg)');
	element.css('transform','rotate('+rotation+'deg)');
}