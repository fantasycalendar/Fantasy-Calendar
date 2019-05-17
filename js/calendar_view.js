var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (var i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

function executeFunctionByName(functionName, context /*, args */) {
	var args = Array.prototype.slice.call(arguments, 2);
	var namespaces = functionName.split(".");
	var func = namespaces.pop();
	for(var i = 0; i < namespaces.length; i++) {
		context = context[namespaces[i]];
	}
	return context[func].apply(context, args);
}

var hash = getUrlParameter('id');
var external_view = true;
var showcase_view = false;
var owned = false;
var calendar = {};
var display_calendar = {};

function load_calendar(){

	$.ajax({
		url:window.baseurl+"ajax/ajax_calendar",
		type: "post",
		dataType: "json",
		data: {action: 'load', hash: hash},
		success: function(data){
			$('body').css('display', 'block');
			inc_calendar = $.parseJSON(data['result']['data']);
			calendar = inc_calendar;
			set_display_calendar();
			owned = data['owned'];
			set_inputs();
			build_clock();
			build_calendar();
			$('html, body').animate({
				scrollTop: $(".current_day").parent().parent().offset().top-45
			}, 0);
		},
		error: function ( log )
		{
			console.log(log);
		}
	});
}

$(document).ready(function(){

	window.onbeforeunload = null;

	timeoutID = window.setTimeout(load_calendar, 150);

	$('#weather_climate').change(function(){
		set_variables();
		generate_weather();
	});

});

var timer;

function save_calendar(){
	clearTimeout(timer);
	timer = 0;
	timer = setTimeout('ajax()', 750);
}

function ajax(){

	var json = JSON.stringify(calendar);

	$.ajax({
		url:window.baseurl+"ajax/ajax_calendar",
		type: "post",
		data: {action: 'update', hash: hash, data: json},
		success: function( result )
		{
			clearTimeout(timer);
			timer = 0;
		},
		error: function ( log )
		{
			console.log(log);
		}
	});

}

function set_inputs(){

	$('#current_year').val(calendar['year']);

	$('#current_month').empty();

	for(var i = 1; i <= calendar['n_months']; i++)
	{
		var name = calendar['months'][i-1];
		$('#current_month').append("<option value='"+i+"'>"+name+"</option>");
	}

	temp_current_month = calendar['month'] ? calendar['month']-1 : 0;

	$("#current_month").get(0).selectedIndex = temp_current_month;

	day = calendar['day'] ? calendar['day']-1 : 0;

	rebuild_day_list();

	$("#current_day").get(0).selectedIndex = day;

	if(calendar['clock_enabled']){

		$('#current_hour_input').val(calendar['hour']);

		minute = calendar['minute'];
		if(parseInt(minute) < 10)
		{
			minute = "0"+parseInt(minute);
		}
		$('#current_minute_input').val(minute);

	}
	else
	{
		$('#time').remove();
	}

	if(calendar['weather_enabled']){

		if(calendar['weather']['custom_climates']){

			text = '<optgroup id="custom_weather_presets" value="custom" label="Custom weather presets">';
			for(key in calendar['weather']['custom_climates']){
				text += '<option value="' + key + '">' + key + '</option>';
			}
			text += '</optgroup>';

			$('#weather_climate').append(text);
			$('#weather_climate').val(calendar['weather']['current_climate']);
		}
	}else{
		$('#weather_container').remove();
	}

}


function set_variables(){

	calendar['month'] = parseInt($('#current_month').find(":selected").val());

	calendar['year'] = parseInt($('#current_year').val());

	calendar['day'] = parseInt($('#current_day').val());

	calendar['hour'] = parseInt($('#current_hour_input').val());

	calendar['minute'] = parseInt($('#current_minute_input').val());
	
	if(calendar['weather']){

		calendar['weather']['current_climate'] = $('#weather_climate').find(":selected").val();

		calendar['weather']['current_climate_type'] = $('#weather_climate').find(":selected").parent().attr('value');
	
	}
	set_display_calendar();

	save_calendar();

}

function set_display_calendar(){

	display_calendar = $.extend( true, {}, calendar );

	if(display_calendar['year_leap'] != 0 && display_calendar['year'] % display_calendar['year_leap'] === 0){
		display_calendar['month_len'][display_calendar['month_leap']-1] = calendar['month_len'][display_calendar['month_leap']-1] + 1;
		display_calendar['year_len'] = calendar['year_len'] + 1;
	}

	if(display_calendar['solstice_enabled']){

		display_calendar['summer_year_day'] = 0;
		display_calendar['winter_year_day'] = 0;
		display_calendar['year_day'] = 0;

		var total = 1;
		for(var month = 1; month <= display_calendar['n_months']; month++)
		{
			for(var day = 1; day <= display_calendar['month_len'][month-1]; day++)
			{
				if(month == display_calendar["summer_month"] && day == display_calendar["summer_day"])
				{
					display_calendar['summer_year_day'] = total;
				}

				if(month == display_calendar["winter_month"] && day == display_calendar["winter_day"])
				{
					display_calendar['winter_year_day'] = total;
				}

				if(month == display_calendar['month'] && day == display_calendar['day'])
				{
					display_calendar['year_day'] = total;
				}

				total++;
			}
		}

		if(display_calendar['summer_year_day'] > display_calendar['winter_year_day'])
		{
			higher = display_calendar['summer_year_day'];
			lower = display_calendar['winter_year_day'];
			higher_len = display_calendar['year_len'] - higher +  lower;
			lower_len = higher - lower;
			lower_to_higher = Math.floor(lower_len/2)+lower
			higher_to_lower = Math.floor(higher_len/2)+higher > display_calendar['year_len'] ? Math.floor(higher_len/2)+higher-display_calendar['year_len'] : Math.floor(higher_len/2)+higher;

			display_calendar['summer_length'] = higher_len;
			display_calendar['winter_length'] = lower_len;

			display_calendar['autumn_equinox'] = higher_to_lower;
			display_calendar['spring_equinox'] = lower_to_higher;
		}
		else
		{
			higher = display_calendar['winter_year_day'];
			lower = display_calendar['summer_year_day'];
			higher_len = display_calendar['year_len'] - higher +  lower;
			lower_len = higher - lower;
			lower_to_higher = Math.floor(lower_len/2)+lower
			higher_to_lower = Math.floor(higher_len/2)+higher > display_calendar['year_len'] ? Math.floor(higher_len/2)+higher-display_calendar['year_len'] : Math.floor(higher_len/2)+higher;

			display_calendar['winter_length'] = higher_len;
			display_calendar['summer_length'] = lower_len;

			display_calendar['autumn_equinox'] = lower_to_higher;
			display_calendar['spring_equinox'] = higher_to_lower;
		}
	}
}

function change_hour(int){
	var hour = parseInt($('#current_hour_input').val());
	var hours = calendar['n_hours'];
	hour = hour + int;
	if(hour == hours)
	{
		hour = 0;
		update_date(1);
	}
	else if(hour > hours)
	{
		hour = int;
		update_date(1);
	}
	else if(hour < 0)
	{
		hour = hours + hour;
		update_date(-1);
	}
	$('#current_hour_input').val(hour);
	set_variables();
	eval_current_time();
}

function change_minute(int){
	var minute = parseInt($('#current_minute_input').val());
	var hour = parseInt($('#current_hour_input').val());
	minute = minute + int;
	if(minute == 60)
	{
		minute = 0;
		change_hour(1);
	}
	else if(minute > 60)
	{
		minute = int;
		change_hour(1);
	}
	else if(minute < 0)
	{
		minute = 60 + minute;
		change_hour(-1);
	}

	if(parseInt(minute) < 10)
	{
		minute = "0"+parseInt(minute);
	}

	$('#current_minute_input').val(minute);
	set_variables();
	eval_current_time();
}

function change_year(int)
{
	update_date(0, 0, int);
}

function change_month(int)
{
	update_date(0, int);
}

function update_date(day_int, month_int, year_int){

	if(year_int === undefined){
		year_int = 0;
	}

	if(month_int === undefined){
		month_int = 0;
	}

	if(day_int === undefined){
		day_int = 0;
	}

	current_year_val = $('#current_year').val() != "" ? parseInt($('#current_year').val()) : 0;
	current_month_val = parseInt($('#current_month').find(":selected").val());
	current_day_val =  $('#current_day').val() != "" ? parseInt($('#current_day').val()) : 1;

	new_year_val = current_year_val + year_int;
	new_month_val = current_month_val + month_int;
	new_day_val = current_day_val + day_int;

	monthchange = false;
	if(new_day_val > display_calendar['month_len'][current_month_val-1])
	{
		new_month_val++;

		if(new_month_val > display_calendar['n_months'])
		{
			new_year_val++;
			new_month_val = 1;
		}
		
		new_day_val = 1;

		monthchange = true;
	}
	else if(new_day_val < 1)
	{
		new_month_val--;

		if(new_month_val < 1)
		{
			new_year_val--;
			new_month_val = display_calendar['n_months'];
		}
		
		new_day_val = display_calendar['month_len'][new_month_val-1];

		monthchange = true;
	}

	$('#current_year').val(new_year_val);
	$('#current_month').val(new_month_val);

	if(monthchange){
		set_display_calendar();
		rebuild_day_list();
	}

	$('#current_day').val(new_day_val);

	show_current_month	= display_calendar['settings'] ? display_calendar['settings']['show_current_month'] : false;

	if((new_month_val != display_calendar['month'] && show_current_month) || new_year_val != display_calendar['year'])
	{	
		set_variables();
		set_display_calendar();
		build_calendar();
		$('html, body').animate({
			scrollTop: $(".current_day").parent().parent().offset().top-45
		}, 100);
	}
	else
	{
		set_variables();
		set_display_calendar();
		evaluate_highlighted_date();
	}
}

function rebuild_day_list()
{
	$('.procedural_day_list').each(function(){

		prev_val = parseInt($(this).val()) ? parseInt($(this).val()) : 1;

		parent_id = $(this).attr('parent');

		month = parseInt($('#'+parent_id).val());

		current_month_len = calendar['month_len'][month-1];

		if(is_leap_year(display_calendar['year_leap'], display_calendar['year']) && month == display_calendar['month_leap']){
			current_month_len += 1;
		}

		text = '';
		
		for(var i = 1; i <= current_month_len; i++)
		{
			text += "<option value='"+i+"'>"+i+"</option>";
		}

		$(this).empty().append(text);

		if(prev_val > $(this).children().length)
		{
			$(this).val($(this).children().length);
		}
		else
		{
			$(this).val(prev_val);
		}

	});

}

function is_leap_year(year_leap, year){
	return year_leap != 0 && year % year_leap === 0;
}