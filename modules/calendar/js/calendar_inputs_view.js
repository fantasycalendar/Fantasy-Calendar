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

	if(date){

		current_year.val(date.year);
		current_year.data('val', current_year.val());

		var curr_timespan = repopulate_timespan_select(current_timespan, convert_year(date.year));
		repopulate_day_select(current_day, convert_year(date.year), curr_timespan);

	}

	if(calendar.clock && date.hour !== undefined && date.minute !== undefined){

		current_hour.val(date.hour).prop('min', 0).prop('max', calendar.clock.hours-1);
		current_minute.val(date.minute).prop('min', 0).prop('max', calendar.clock.minutes-1);

	}

	if(calendar.seasons.locations){

		repopulate_location_select_list();

	}

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
	element.push("<img src='resources/dayhelper.png' id='dayhelper' class='SunUpDown'/>");
	element.push("<img src='resources/nighthelper.png' id='nighthelper' class='SunUpDown'/>");
	element.push("<div id='SunUp_Container'>");
		element.push("<img src='resources/startofday.png' id='StartOfDay'/>");
	element.push("</div>");
	element.push("<div id='SunDown_Container'>");
		element.push("<img src='resources/endofday.png' id='EndOfDay' />");
	element.push("</div>");
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

		var sunset = evaluated_calendar_data.epoch_data[date.epoch].season.sunset[0];
		var sunrise = evaluated_calendar_data.epoch_data[date.epoch].season.sunrise[0];

		sunrise = (360/clock_hours)*(sunrise-clock_hours/4);
		sunset = (360/clock_hours)*(sunset+clock_hours/4)-360;

		if(Math.abs(sunset-sunrise) < 220){

			var rotate_parent = mid(sunrise, sunset);

			if(sunset-sunrise > 0){
				$('#dayhelper').css('display', 'block');
				$('#nighthelper').css('display', 'none');
			}else{
				$('#nighthelper').css('display', 'block');
				$('#dayhelper').css('display', 'none');
			}

			rotate_element($('#StartOfDay'), sunrise-rotate_parent);
			rotate_element($('#SunUp_Container'), rotate_parent);

			rotate_element($('#EndOfDay'), sunset-rotate_parent);
			rotate_element($('#SunDown_Container'), rotate_parent);

			rotate_element($('#nighthelper'), rotate_parent);
			rotate_element($('#dayhelper'), rotate_parent);

		}
		
	}

}

function rotate_element(element, rotation){
	element.css('-webkit-transform','rotate('+rotation+'deg)'); 
	element.css('-moz-transform', 'rotate('+rotation+'deg)');
	element.css('transform', 'rotate('+rotation+'deg)');
}


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
		rebuild_calendar('calendar', date);
		update_current_day(true);
		evaluate_sun();
	}else{
		update_current_day(true);
		evaluate_sun();
	}

}

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

function repopulate_location_select_list(){
	var html = [];
	if(calendar.seasons.locations.length > 0){
		html.push('<optgroup label="Custom" value="custom">');
		for(var i = 0; i < calendar.seasons.locations.length; i++){
			html.push(`<option value='${i}'>${calendar.seasons.locations[i].name}</option>`);
		}
		html.push('</optgroup>');
	}
	html.push('<optgroup label="Presets" value="preset">');
	for(var i = 0; i < Object.keys(climate_generator.presets).length; i++){
		html.push(`<option>${Object.keys(climate_generator.presets)[i]}</option>`);
	}
	html.push('</optgroup>');

	location_select.html(html.join('')).val(calendar.seasons.location);

	if(location_select.val() === null){
		location_select.find('option').first().prop('selected', true);
		calendar.seasons.location = location_select.val();
		calendar.seasons.location_type = location_select.find('option:selected').parent().attr('value');
	}
}