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

		var target = $(this).next();
		var value = target.val()|0;
		var selected = target.find('option:selected');
		var options = target.children(":enabled");
		var prev = options.index(selected)-1;

		if(prev < 0){
			sub_target_timespan.click();
			target.children('option:enabled').last().prop('selected', true).change();
		}else{
			options.eq(prev).prop('selected', true);
			target.change();
		}

	});

	sub_target_timespan.click(function(){

		var target = $(this).next();
		var value = target.val()|0;
		var selected = target.find('option:selected');
		var options = target.children(":enabled");
		var prev = options.index(selected)-1;

		if(prev < 0){
			sub_target_year.click();
			target.children('option:enabled').last().prop('selected', true).change();
		}else{
			options.eq(prev).prop('selected', true);
			target.change();
		}

	});

	sub_target_year.click(function(){

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
		var date_var = btn_type ? date : preview_date;

		if(timespan_input.children(":enabled").length == 0){
			sub_target_year.click();
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

	add_target_day.click(function(){

		var target = $(this).prev();
		var value = target.val()|0;
		var selected = target.find('option:selected');
		var options = target.children(":enabled");
		var next = options.index(selected)+1;

		if(next == options.length){
			add_target_timespan.click();
			target.children('option:enabled').first().prop('selected', true).change();
		}else{
			options.eq(next).prop('selected', true);
			target.change();
		}

	});

	add_target_timespan.click(function(){

		var target = $(this).prev();
		var value = target.val()|0;
		var selected = target.find('option:selected');
		var options = target.children(":enabled");
		var next = options.index(selected)+1;

		if(next == options.length){
			add_target_year.click();
			target.children('option:enabled').first().prop('selected', true).change();
		}else{
			options.eq(next).prop('selected', true);
			target.change();
		}

	});

	add_target_year.click(function(){

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
		var date_var = btn_type ? date : preview_date;

		if(timespan_input.children(":enabled").length == 0){
			add_target_year.click();
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


	target_year.change(function(){

		var tar_year = $(this).val()|0;
		
		if(tar_year == 0 && !static_data.settings.year_zero_exists){
			if(preview_date.year < 0){
				tar_year = 1;
			}else if(preview_date.year > 0){
				tar_year = -1;
			}
			$(this).data('val', tar_year);
			$(this).val(tar_year);
		}

		repopulate_timespan_select(target_timespan, preview_date.timespan);

		repopulate_day_select(target_day, preview_date.day);

	});

	target_timespan.change(function(){

		var tar_year = target_year.val()|0;

		var tar_timespan = $(this).val()|0;
		var prev_timespan = $(this).data('val')|0;

		repopulate_day_select(target_day, preview_date.day);

	});

	$('#go_to_preview_date').click(function(){
		var tar_year = target_year.val()|0;
		var tar_timespan = target_timespan.val()|0;
		var tar_day = target_day.val()|0;
		set_preview_date(tar_year, tar_timespan, tar_day);
	});

	$('#reset_preview_date').click(function(){
		target_year.val(dynamic_data.year);
		target_timespan.val(dynamic_data.timespan);
		target_day.val(dynamic_data.day);
		set_date(dynamic_data.year, dynamic_data.timespan, dynamic_data.day);
	});

}

function set_preview_date(year, timespan, day){

	var rebuild = false;

	if((preview_date.year != year || (preview_date.year == year && preview_date.year != preview_date.year))
		||
		(static_data.settings.show_current_month && (preview_date.timespan != timespan || (preview_date.timespan == timespan && preview_date.timespan != preview_date.timespan)))
	){
		rebuild = true;
	}

	preview_date.year = year;
	preview_date.timespan = timespan;
	preview_date.day = day;
	preview_date.epoch = evaluate_calendar_start(static_data, convert_year(static_data, preview_date.year), preview_date.timespan, preview_date.day).epoch;

	if(rebuild){
		rebuild_calendar('preview', preview_date);
	}else{
		scroll_to_epoch(preview_date.epoch)
		highlight_preview_date();
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

	var clock_hours = static_data.clock.hours;

	$('#clock').css('display', 'block');

	var element = [];
	element.push("<img src='/resources/clock_arm.png' id='clock_arm'/>");
	element.push("<div id='clock_hours'></div>");
	element.push(`<img src='/resources/dayhelper.png' id='dayhelper' class='SunUpDown'/>`);
	element.push(`<img src='/resources/nighthelper.png' id='nighthelper' class='SunUpDown ${!evaluated_static_data.processed_seasons ? 'hidden' : ''}'/>`);
	element.push(`<div id='SunUp_Container' ${!evaluated_static_data.processed_seasons ? 'class="hidden"' : ''}>`);
		element.push(`<img src='/resources/startofday.png' id='StartOfDay'/>`);
	element.push(`</div>`);
	element.push(`<div id='SunDown_Container' ${!evaluated_static_data.processed_seasons ? 'class="hidden"' : ''}>`);
		element.push(`<img src='/resources/endofday.png' id='EndOfDay' />`);
	element.push(`</div>`);
	element.push("<img src='/resources/clock_base.png' id='base'/>");

	$('#clock').html(element.join(''));

	element = [];
	for(var i = 0; i < clock_hours; i++){

		var hour = (i-static_data.clock.offset)%clock_hours;

		var rotation = ((360/clock_hours)*hour);

		hour = hour < 0 ? Math.floor(hour+clock_hours) : Math.floor(hour);

		element.push(`<div class='clock_hour_text_container' style='transform: rotate(${rotation+180}deg);'><span class='clock_hour_text' style='transform: rotate(-${rotation+180}deg);'>${hour}</span></div>`)
		element.push(`<img class='clock_hour' src='/resources/clock_hour.png' style='transform: rotate(${rotation}deg);'>`);
	}

	$('#clock_hours').html(element.join(''));

	eval_current_time();

}

function eval_current_time(){

	if(!static_data.clock.enabled || isNaN(static_data.clock.hours) || isNaN(static_data.clock.minutes) || isNaN(static_data.clock.offset)){
		$('#clock').css('display', 'none');
		return;
	}

	var clock_hours = static_data.clock.hours;
	var clock_minutes = static_data.clock.minutes;
	var clock_hour = dynamic_data.hour;
	var clock_minute = dynamic_data.minute;
	var clock_time = clock_hour + (clock_minute/clock_minutes);

	clock_time = ((clock_time+static_data.clock.offset)%clock_hours)
	clock_time = clock_time < 0 ? clock_time+clock_hours : clock_time;

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

	if(!static_data.clock.enabled || isNaN(static_data.clock.hours) || isNaN(static_data.clock.minutes) || isNaN(static_data.clock.offset)){
		$('#clock').css('display', 'none');
		return;
	}

	if(evaluated_static_data.processed_seasons && evaluated_static_data.epoch_data[dynamic_data.epoch] !== undefined){

		var clock_hours = static_data.clock.hours;

		var sunset = evaluated_static_data.epoch_data[dynamic_data.epoch].season.sunset[0];
		var sunrise = evaluated_static_data.epoch_data[dynamic_data.epoch].season.sunrise[0];

		sunset = (sunset-static_data.clock.offset)%clock_hours;
		sunrise = (sunrise-static_data.clock.offset)%clock_hours;
		sunset = sunset < 0 ? sunset + clock_hours : sunset;
		sunrise = sunrise < 0 ? sunrise + clock_hours : sunrise;

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

		}
		
	}

}

function rotate_element(element, rotation){
	element.css('-webkit-transform','rotate('+rotation+'deg)'); 
	element.css('-moz-transform', 'rotate('+rotation+'deg)');
	element.css('transform', 'rotate('+rotation+'deg)');
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
					var val = i;
					break internal_loop;
				}
				if(!$(this).children().eq(j).prop('disabled')){
					var val = j;
					break internal_loop;
				}
			}
			$(this).val(val);
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
			if($(this).closest('.sortable-container').hasClass('observational')){
				self_object = get_calendar_data($(this).attr('data'));
			}else if($(this).closest('.sortable-container').hasClass('leap-day')){
				self_object = get_calendar_data($(this).attr('data'));
			}

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
					var val = i;
					break internal_loop;
				}
				if($(this).children().eq(j).length && !$(this).children().eq(j).prop('disabled')){
					var val = j;
					break internal_loop;
				}
			}
			$(this).val(val+1);
		}
		if(change){
			$(this).change();
		}

	});
	
}

function repopulate_location_select_list(){
	var html = [];
	if(static_data.seasons.locations.length > 0){
		html.push('<optgroup label="Custom" value="custom">');
		for(var i = 0; i < static_data.seasons.locations.length; i++){
			html.push(`<option value='${i}'>${static_data.seasons.locations[i].name}</option>`);
		}
		html.push('</optgroup>');
	}
	html.push('<optgroup label="Presets" value="preset">');
	for(var i = 0; i < Object.keys(climate_generator.presets).length; i++){
		html.push(`<option>${Object.keys(climate_generator.presets)[i]}</option>`);
	}
	html.push('</optgroup>');

	location_select.html(html.join('')).val(dynamic_data.location);

	if(location_select.val() === null){
		location_select.find('option').first().prop('selected', true);
		dynamic_data.location = location_select.val();
		dynamic_data.custom_location = location_select.find('option:selected').parent().attr('value') === 'custom';
	}
}

function set_up_preview_values(){

	preview_date = clone(dynamic_data);

	if(preview_date){

		target_year.val(preview_date.year);
		target_year.data('val', target_year.val());

		repopulate_timespan_select(target_timespan, preview_date.timespan);
		repopulate_day_select(target_day, preview_date.day);

	}

}