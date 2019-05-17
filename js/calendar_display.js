$('body').css('display', 'none');

function ordinal_suffix_of(i) {
	var j = i % 10,
	k = i % 100;
	if (j == 1 && k != 11) {
		return i + "st";
	}
	if (j == 2 && k != 12) {
		return i + "nd";
	}
	if (j == 3 && k != 13) {
		return i + "rd";
	}
	return i + "th";
}

$(document).ready(function(){

	var table_container = $('#calendar');
	var weather_tooltip_box = $('#weather_tooltip_box');
	var weather_date = $('.weather_date');
	var weather_temp = $('.weather_temp');
	var weather_wind = $('.weather_wind');
	var weather_wind_velocity = $('.weather_wind_velocity');
	var weather_precip = $('.weather_precip');
	var weather_clouds = $('.weather_clouds');
	var weather_wind_description = $('.weather_wind_description');
	var weather_feature = $('.weather_feature');
	var collapse = 0;

	$('#generator_container').css('display', 'table');

	$(document).on('click', '#btn_prev_month', function()
	{
		set_viewing_month(-1);
	});

	$(document).on('click', '#btn_next_month', function()
	{
		set_viewing_month(1);
	});

	/*-------------------------------------------------\
	|   This is the element events for calendar events |
	\-------------------------------------------------*/

	$('.event-basic-container').click(function(e){
		e.stopPropagation();
	});

	$(document).on('click', '.calendar_event', function(){
		show_event_dialog($(this));
	});

	$('#event_background').click(function(){
		hide_event_dialog($(this));
	});

	$(document).on('click', '.weather_icon', function(){
		show_weather_dialog($(this));
	});

	$('#weather_background').click(function(){
		hide_weather_dialog($(this));
	});

	$(document).on('mouseenter', '.weather_icon', function(){

		weather_tooltip_box.position({
			my: 'center',
			at: 'top-100',
			of: $(this).parent().parent(),
			collision: "none"
		});

		weather_epoch = $(this).parent().parent().attr('epoch')

		weather = calendar_weather[weather_epoch];

		weather_date_text = 'The ' + ordinal_suffix_of(parseInt($(this).parent().parent().attr('day'))) + ' of ' + $(this).parent().parent().parent().parent().attr('id');

		weather_date.each(function(){
			$(this).text(weather_date_text);
		});

		temp = '';

		if(display_calendar['weather']['weather_cinematic']){
			temp += weather.temperature_cinematic + ' ('
		}

		if(display_calendar['weather']['weather_temp_sys'] === 'imperial'){
			temp += precisionRound(weather.temperature_imperial, 1).toString()+'°F';
		}else{
			temp += precisionRound(weather.temperature_metric, 1).toString()+'°C';
		}

		if(display_calendar['weather']['weather_cinematic']){
			temp += ')'
		}

		weather_temp.each(function(){
			$(this).text(temp);
		});

		weather_wind.each(function(){
			$(this).text(weather.wind_speed + ' ('+weather.wind_direction+')');
		});

		switch(display_calendar['weather']['weather_wind_sys']){
			case 'imperial':
				wind_velocity = weather.wind_velocity_imperial.toString()+' MPH';
				break;

			case 'metric':
				wind_velocity = weather.wind_velocity_metric.toString()+' KPH';
				break;
		}

		weather_wind_velocity.each(function(){
			$(this).text(' ('+wind_velocity+')');
		});

		weather_wind_description.each(function(){
			$(this).text(weather.wind_description);
		});

		weather_precip.each(function(){
			$(this).text(weather.precipitation);
		});

		weather_clouds.each(function(){
			$(this).text(weather.clouds);
		});

		weather_feature.each(function(){
			$(this).text(weather.feature);
		});
		
		weather_tooltip_box.show();
	});

	$(document).on('mouseleave', '.weather_icon', function(){
		weather_tooltip_box.hide();
		weather_tooltip_box.css({"top":"", "left":""});
	});

	/*------------------------------------\
	|   This is for hiding the view panel |
	\------------------------------------*/


	$('#btn_minimize_left_container').click(function(){
		$(this).animate({
			left: parseInt($(this).css('left'),10) == 10 ? 362 : 10
		}, { duration: 100, queue: false });

		$(this).text($(this).text() == '<' ? '>' : '<');

		$('#generator_container').animate({
			left: parseInt($('#generator_container').css('left'),10) == 0 ? -350 : 0
		}, { duration: 100, queue: false });

		collapse = parseInt($('#generator_container').css('left'),10) == 0 ? 350 : 0;

	});
});

/*----------------------------------------\
|   This is for creating the moon phases  |
\----------------------------------------*/
	
var moon_phases = [
	'New Moon',
	'New Moon Fading',
	'Waxing Crescent',
	'Waxing Crescent Fading',
	'First Quarter',
	'First Quarter Fading',
	'Waxing Gibbous',
	'Waxing Gibbous Fading',
	'Full Moon',
	'Full Moon Fading',
	'Waning Gibbous',
	'Waning Gibbous Fading',
	'Last Quarter',
	'Last Quarter Fading',
	'Waning Crescent',
	'Waning Crescent Fading'
  ];

function get_moon_data(moon_index)
{
	moon_data = {};
	moon_data['name']  = display_calendar['moons']			? display_calendar['moons'][moon_index]			: 'Moon ' + moon_index;
	moon_data['color'] = display_calendar['lunar_color']	? display_calendar['lunar_color'][moon_index]	: '#FFFFFF';
	moon_data['cycle'] = display_calendar['lunar_cyc']		? display_calendar['lunar_cyc'][moon_index]		: 1;
	moon_data['shift'] = display_calendar['lunar_shf']		? display_calendar['lunar_shf'][moon_index]		: 1;
	return moon_data;
}

function moon_phase(epoch, moon_index)
{
	moon_data = get_moon_data(moon_index);
	moon_position_data = ((epoch - moon_data['shift']) / moon_data['cycle']);
	moon_position = (moon_position_data - Math.floor(moon_position_data))
	phase = Math.floor(moon_position * 16);
	return phase;
}

var moon_repitition_data = {};

function isEmpty(obj) {
	return Object.keys(obj).length === 0;
}

function insert_moon(epoch, moon_month){

	if(isEmpty(moon_repitition_data) || display_calendar['moons'].length > Object.keys(moon_repitition_data).length || moon_repitition_data['month'] != moon_month){
		moon_repitition_data = {};
		moon_repitition_data['month'] = moon_month;
		for(var moon = 0; moon < display_calendar['moons'].length; moon++){
			moon_name = display_calendar['moons'][moon];
			moon_repitition_data[moon_name] = [];
			for(var phases = 0; phases < 16; phases++){
				moon_repitition_data[moon_name].push(1);
			}
		}
	}

	text = '';
	text += '<div class="calendar_moon_container">';
	for(var moon = 0; moon < display_calendar['moons'].length; moon++){
		moon_meta = get_moon_data(moon);
		phase = moon_phase(epoch, moon);
		text += '<div class="moon_container">';
			text += '<div title="'+moon_meta['name']+', '+moon_phases[phase]+'" name="'+moon_meta['name']+'" phase="'+phase+'" phase_number="'+moon_repitition_data[moon_meta['name']][phase]+'" class="calendar_moon lunar phase-'+phase+'"></div>';
			text += '<div class="lunar_background" moon_id="'+moon+'"></div>';
		text += '</div>'
		moon_repitition_data[moon_meta['name']][phase] += 1;

	}
	text += '</div>';
	return text;
}

function update_moon_colors(id){
	if(id){
		$('.lunar_background[moon_id='+id+']').each(function(){
			color = display_calendar['lunar_color'] ? display_calendar['lunar_color'][id] : '#ffffff';
			$(this).css('color', color);
		});
	}else{
		for(index = 0; index < display_calendar['moons'].length; index++){
			$('.lunar_background[moon_id='+index+']').each(function(){
				color = display_calendar['lunar_color'] ? display_calendar['lunar_color'][index] : '#ffffff';
				$(this).css('color', color);
			});
		}
	}
}


function evaluate_highlighted_date(){

	$('.current_day').removeClass('current_day');

	$('.calendar_month_day[epoch="'+get_epoch(display_calendar['year'], display_calendar['month'], display_calendar['day'])+'"]').addClass('current_day');

	if(previous_calendar.localeCompare(JSON.stringify(calendar)) != 0 && (show_current_month && showcase_view && external_view))
	{
		build_calendar();
	}

	eval_sun_rise_set();

}

function get_epoch(year, month, day){

	if(display_calendar['year_leap'] !== undefined && display_calendar['year_leap'] != 0){

		current_epoch = (year * calendar['year_len']) + 2 + Math.floor(year/display_calendar['year_leap']);
		if(year % display_calendar['year_leap'] === 0){
			current_epoch -= 1;
		}

	}else{
		current_epoch = (year * display_calendar['year_len']) + 1;
	}

	for(var months = 1; months < month; months++)
	{
		current_epoch += display_calendar['month_len'][months-1];
	}

	current_epoch += day - 1;

	return current_epoch;
}


/*-----------------------------------\
|   This builds the actual calendar  |
\-----------------------------------*/

var calendar_month;
var calendar_year;
var viewing_calendar_month;
var viewing_calendar_year;

function set_viewing_month(int){

	viewing_calendar_month += int;

	if(viewing_calendar_month > display_calendar['n_months'])
	{
		viewing_calendar_month = 1;
		viewing_calendar_year++;
	}
	else if(viewing_calendar_month < 1)
	{
		viewing_calendar_month = display_calendar['n_months'];
		viewing_calendar_year--;
	}

	if(display_calendar['year_leap'] !== undefined && display_calendar['year_leap'] != 0 && viewing_calendar_year % display_calendar['year_leap'] === 0 && viewing_calendar_month === display_calendar['month_leap']){
		display_calendar['month_len'][display_calendar['month_leap']-1] = calendar['month_len'][calendar['month_leap']-1] + 1;
		display_calendar['year_len'] = calendar['year_len'] + 1;
	}else{
		display_calendar['month_len'][display_calendar['month_leap']-1] = calendar['month_len'][calendar['month_leap']-1];
		display_calendar['year_len'] = calendar['year_len'];
	}

	build_calendar();

}

function set_viewing_year(int){

	viewing_calendar_year += int;

	if(viewing_calendar_month > display_calendar['month'] && only_backwards){
		viewing_calendar_month = display_calendar['month'];
	}

	if(display_calendar['year_leap'] !== undefined && display_calendar['year_leap'] != 0 && viewing_calendar_year % display_calendar['year_leap'] === 0){
		display_calendar['month_len'][display_calendar['month_leap']-1] = display_calendar['month_len'][display_calendar['month_leap']-1] + 1;
		display_calendar['year_len'] = calendar['year_len'] + 1;
	}else{
		display_calendar['month_len'][display_calendar['month_leap']-1] = calendar['month_len'][calendar['month_leap']-1];
		display_calendar['year_len'] = calendar['year_len'];
	}

	build_calendar();

}

var week_len;
var week;
var auto_events;
var show_current_month;
var hide_moons;
var hide_events;
var allow_view;
var only_backwards;
var previous_calendar = '';
var calendar_year;
var calendar_weather;

function build_calendar()
{

	var table_container = $('#calendar');

	table_container.empty();
	$('#weather_display_container').css('display', 'none');
	$('#all_event_container').empty();

	$('body').css('display', 'block');
	

	// Setting up variables
	week_len			= display_calendar['week_len'];
	week				= 1;
	auto_events			= display_calendar['settings'] ? display_calendar['settings']['auto_events'] : false;
	show_current_month	= display_calendar['settings'] ? display_calendar['settings']['show_current_month'] : false;
	hide_moons			= display_calendar['settings'] ? display_calendar['settings']['hide_moons'] : false;
	hide_events			= display_calendar['settings'] ? display_calendar['settings']['hide_events'] : false;
	hide_weather		= display_calendar['settings'] ? display_calendar['settings']['hide_weather'] : false;
	only_reveal_today	= display_calendar['settings'] ? display_calendar['settings']['only_reveal_today'] : false;
	allow_view			= display_calendar['settings'] ? display_calendar['settings']['allow_view'] : true;
	only_backwards		= display_calendar['settings'] ? display_calendar['settings']['only_backwards'] : true;
	add_month_number	= display_calendar['settings'] ? display_calendar['settings']['add_month_number'] : true;
	year_day			= display_calendar['first_day'];
	moon_repitition_data = {}

	// These variables set up weather to show certain elements, depending on if the events are hidden or if you're showcasing the calendar, etc
	hide_events = (owned && showcase_view && hide_events) != (!owned && hide_events);
	hide_moons = (owned && showcase_view && hide_moons) != (!owned && hide_moons);
	hide_weather = (owned && showcase_view && hide_weather) != (!owned && hide_weather);
	only_reveal_today = (owned && showcase_view && only_reveal_today) != (!owned && only_reveal_today);

	// This sets up the current month, if it isn't already set up. It's used when previewing months/years
	calendar_month = calendar_month === undefined ? display_calendar['month'] : calendar_month;
	calendar_year = calendar_year === undefined ? display_calendar['year'] : calendar_year;

	// Described in the comment before this one, it sets up the viewing for previewing previous months and years
	viewing_calendar_month = viewing_calendar_month === undefined ? display_calendar['month'] : viewing_calendar_month;
	viewing_calendar_year = viewing_calendar_year === undefined ? display_calendar['year'] : viewing_calendar_year;

	// Again, this sets up the preview for 
	if(previous_calendar.localeCompare(JSON.stringify(calendar)) != 0)
	{
		calendar_month = display_calendar['month'];
		calendar_year = display_calendar['year'];
		viewing_calendar_month = display_calendar['month'];
		viewing_calendar_year = display_calendar['year'];
	}else{
		calendar_month = viewing_calendar_month;
		calendar_year = viewing_calendar_year;
	}

	calendar_current_epoch = get_epoch(display_calendar['year'], display_calendar['month'], display_calendar['day']);

	// This entire block sets up whether to show the buttons at the top for previewing past and future dates
	show_forward_year_button = true;
	show_backward_year_button = true;
	show_forward_month_button = true;
	show_backward_month_button = true;
	enable_forward_year_button = true;
	enable_backward_year_button = true;
	enable_forward_month_button = true;
	enable_backward_month_button = true;

	if(owned && !showcase_view){
		show_forward_month_button = show_current_month && external_view;
		show_backward_month_button = show_current_month && external_view;
		enable_forward_month_button = show_current_month && external_view;
		enable_backward_month_button = show_current_month && external_view;
	}else{
		if(allow_view){
			show_forward_year_button		= true;
			show_backward_year_button		= true;
			show_forward_month_button		= show_current_month;
			show_backward_month_button		= show_current_month;
			enable_forward_year_button		= !only_backwards || (calendar_year < display_calendar['year']);
			enable_backward_year_button		= true;
			enable_forward_month_button		= !only_backwards || (show_current_month && (calendar_month < display_calendar['month'] || calendar_year < display_calendar['year']));
			enable_backward_month_button	= show_current_month;
		}else{
			show_forward_year_button = false;
			enable_forward_year_button = false;
			show_backward_year_button = false;
			enable_backward_year_button = false;
			show_forward_month_button = false;
			enable_forward_month_button = false;
			show_backward_month_button = false;
			enable_backward_month_button = false;
		}
	}


	// This calculates the current epoch in regards to leap years, it needs to take that into account
	if(display_calendar['year_leap'] !== undefined && display_calendar['year_leap'] != 0){
		epoch = (calendar_year * calendar['year_len']) + 2 + Math.floor(calendar_year/display_calendar['year_leap']);
		if(calendar_year % display_calendar['year_leap'] === 0){
			epoch -= 1;
		}
	}else{
		epoch = (calendar_year * display_calendar['year_len']) + 1;
	}

	// Adds the string for current era
	current_era = display_calendar['era'] ? ' ' + display_calendar['era'] : '';

	// If the months overflow to the next one, take that into account
	if(display_calendar['overflow']){
		first_day = (epoch + display_calendar['first_day'] - 1) % display_calendar['week_len'];
		year_day = first_day;
	}

	// Add the current year to the container
	table_container.attr('year', calendar_year);

	// If only the current month is shown, calculate the up until the start of this month, so that we don't miss any dates.
	if(show_current_month && (external_view || showcase_view))
	{
		// For each month
		for(var month = 1; month < calendar_month; month++)
		{
			// Add the length of that month to the year day, and the epoch day
			year_day += display_calendar['month_len'][month-1];
			epoch += display_calendar['month_len'][month-1];

			// Also calculate the current week
			week += Math.floor(display_calendar['month_len'][month-1] / week_len);
			if(year_day % week_len == 0 || year_day%week_len === 1){
				week++;
			}
		}
		// Then add the month id to the calendar container
		id = display_calendar['months'][calendar_month-1];
		table_container.append('<table class="calendar_month_table" month="'+calendar_month+'" id="'+id+'"></table>');
	}
	else
	{	
		// Otherwise, just add all the months to the container
		text = ''
		for(var i = 1; i <= display_calendar['n_months']; i++)
		{
			id = display_calendar['months'][i-1];
			text += '<table class="calendar_month_table" month="'+i+'" id="'+id+'"></table>';
		}
		table_container.append(text);
	}


	// This adds the topmost bar to the calendar with the year and the current era, along with the forward and backwards year buttons (if enabled)
	text = '<tr><th id="calendar_year" colspan="'+week_len+'">';
		text += '<div id="calendar_year_container">';
			text += '<div id="calendar_year_row">';
				text += '<div class="btn_view_year">';
				if(show_backward_year_button){
					text += '<button id="btn_prev_year" class="btn btn-danger" onclick="set_viewing_year(-1)"><</button>';
				}
				text += '</div>';
				text += '<div id="calendar_year_text">Year '+calendar_year+current_era+'</div>';
				text += '<div class="btn_view_year">';
				if(show_forward_year_button){
					text += '<button id="btn_next_year" class="btn btn-success" onclick="set_viewing_year(1)">></button>';
				}
				text += '</div>';
			text += '</div>';
		text += '</div>';
	text += '</th></tr>';
	table_container.children().first().append(text);

	// For each month in the 
	table_container.children().each(function(){

		// Get its name and add the number of the month of it is enabled
		name = $(this).attr('id');
		i = $(this).attr('month');
		if(add_month_number){
			name = name + ' - ' + i;
		}

		// Create a variable to store how many week days there have been
		week_day_number = {};

		// Add the top bar for each month, and add the buttons if it is the only month shown
		text = '<tr><th class="calendar_month_name" colspan="'+week_len+'">';
			text += '<div class="calendar_month_container">';
				text += '<div id="calendar_month_row">';
					text += '<div class="btn_view_month">';
					if(show_backward_month_button){
						text += '<button id="btn_prev_month" class="btn btn-danger"><</button>'
					}
					text += '</div>';
					text += '<div class="calendar_month_text">'+name+'</div>';

					text += '<div class="btn_view_month">';
					if(show_forward_month_button){
						text += '<button id="btn_next_month" class="btn btn-success">></button>'
					}
					text += '</div>';
				text += '</div>';
			text += '</div>';
		text += '</th></tr><tr>';

		// Add each week day, and increment the week day numbers
		for(var week_day = 1; week_day <= display_calendar['week_len']; week_day++)
		{
			week_day_name = display_calendar['weekdays'][week_day-1];
			text += '<th class="calendar_week_day_name">'+week_day_name+'</th>';
			week_day_number[week_day-1] = 1;
		}

		text += '</tr>';
		text += '<tr week="'+week+'">';

		// If the starting day of this month is not the first one in the week, offset the start of the week
		fix = ((year_day + week_len) % week_len);
		if(fix > 0 && display_calendar['overflow']){
			text += '<td colspan="'+fix+'" class="calendar_day_padder"></td>';
		}

		// Get the month length
		month_length = display_calendar['month_len'][i-1];

		// And loop through each day on that month
		for(day = 1; day <= month_length; day++, year_day++, epoch++)
		{
			// If this month is a overflow day, set it accordingly
			overflow_day = display_calendar['overflow'] ? year_day : day-1;

			// If it is, it will set the start of the this week where it is supposed to be
			week_day = ((overflow_day + week_len) % week_len);

			// If it's a new week, increment the week
			if(!display_calendar['overflow'] && day == 1){
				week++;
			}

			// If it's the start of a new week, add a week to the lines
			if(week_day === 0 && week > 1){
				text += '<tr week="'+week+'">';
			}

			// Then add the day
			text += '<td class="calendar_month_day" epoch="'+epoch+'" day="'+day+'" week_day="'+week_day+'" week_day_name="'+ display_calendar['weekdays'][week_day]+'" week_day_number="'+week_day_number[week_day]+'">';
				if(!only_reveal_today || (only_reveal_today && epoch <= calendar_current_epoch)){
					text += '<div>';
						text += '<div class="calendar_day_number">';
							text += day;
						text += '</div>';

						// If moons aren't hidden and the amount of moons are not zero, add the moons
						text += !hide_moons && display_calendar['moons'].length > 0 ? insert_moon(epoch, parseInt(i)) : '';
						text += '<div class="calendar_events"></div>';

						// If you're not hiding weather and it is enabled, add it
						text += !hide_weather && display_calendar['weather_enabled'] ? '<div class="weather_icon"></div>' : '';

						// If you're creating/editing the calendar, add the event button
						if(!showcase_view && !external_view){
							text += '<input type="button" class="btn_create_event btn btn-success" value="+" />';
						}
					text += '</div>';
				}else{
					text += '<div class="blocked_day"></div>';
				}
			text += '</td>';

			// If it's at the end of the month and there's days to fill, create a padder to fill the remaining area
			fix = week_len-week_day-1;
			if(day === month_length && fix > 0){
				text += '<td colspan="'+fix+'" class="calendar_day_padder"></td>';
			}

			// If it's at the end of a week, increment the week counter and break the week
			if(week_day+1 === week_len){
				text += '</tr>';
				week++;
			}

			// Increment the week day
			week_day_number[week_day] += 1;
		}

		$(this).append(text);
		delete text;

	});

	update_moon_colors();

	$('#btn_next_year').prop('disabled', !enable_forward_year_button);
	$('#btn_prev_year').prop('disabled', !enable_backward_year_button);

	$('#btn_next_month').prop('disabled', !enable_forward_month_button);
	$('#btn_prev_month').prop('disabled', !enable_backward_month_button);


	evaluate_highlighted_date();

	if(auto_events){
		evaluate_events('solstice_events');
	}

	if(!hide_events){
		evaluate_events('events');
	}

	generate_weather();

	previous_calendar = JSON.stringify(calendar);

}


function build_clock(){

	if(display_calendar['clock_enabled']){
		hide_clock_settings = display_calendar['settings'] ? display_calendar['settings']['hide_clock'] : false;

		hide_clock = ((owned && showcase_view && hide_clock_settings) != (!owned && hide_clock_settings));

		if(hide_clock){
			$('#clock').empty();
			$('#clock').css('display', 'none');
		}else{
			eval_clock();
		}
	}

}

var clock_hour;
var clock_minute;
var clock_time;
var clock_hours;
var clock_fraction_time;

function eval_clock(){

	clock_hours = display_calendar['n_hours'];

	$('#clock').empty();

	$('#clock').css('display', 'block');

	clock_text =  "<img src='resources/clock_arm.png' id='clock_arm'/>";
	clock_text += "<div id='clock_hours'></div>";
	clock_text += "<img src='resources/endofday_dayhelper.png' id='end_dayhelper' class='SunUpDown'/>";
	clock_text += "<img src='resources/endofday_nighthelper.png' id='end_nighthelper' class='SunUpDown'/>";
	clock_text += "<img src='resources/startofday_dayhelper.png' id='start_dayhelper' class='SunUpDown'/>";
	clock_text += "<img src='resources/startofday_nighthelper.png' id='start_nighthelper' class='SunUpDown'/>";
	clock_text += "<img src='resources/startofday.png' id='StartOfDay' class='SunUpDown'/>";
	clock_text += "<img src='resources/endofday.png' id='EndOfDay' class='SunUpDown' />";
	clock_text += "<img src='resources/clock_base.png' id='base'/>";

	$('#clock').append(clock_text);

	$('#clock_hours').empty();

	for(var i = 0; i < display_calendar['n_hours']; i++){
		var rotation = ((360/display_calendar['n_hours'])*i);
		$('#clock_hours').append("<div class='clock_hour_text_container' style='transform: rotate("+(rotation+180)+"deg);'><span class='clock_hour_text' style='transform: rotate(-"+(rotation+180)+"deg);'>"+i+"</span></div>")
		$('#clock_hours').append("<img class='clock_hour' src='resources/clock_hour.png' style='transform: rotate("+rotation+"deg);'>");
	}

	eval_current_time();

}

function eval_current_time(){

	clock_hour = display_calendar['hour'];
	clock_minute = display_calendar['minute'];
	clock_time = clock_hour + (clock_minute/60);
	clock_fraction_time = clock_time/clock_hours;

	rotation = (360/clock_hours)*clock_time;

	if(clock_time == clock_hours)
	{
		rotation = 360+(360/clock_hours)*clock_time;
	}
	else if(clock_time > clock_hours)
	{
		rotation = 360+(360/clock_hours)*clock_time;
	}
	else if(clock_time < 0)
	{
		rotation = (360/clock_hours)*clock_time;
	}

	rotate_element($('#clock_arm'), rotation);

}

function eval_sun_rise_set(){
	
	if(display_calendar['solstice_enabled'])
	{

		if(display_calendar['clock_enabled']){

			$('#StartOfDay').css('display', 'block');
			$('#EndOfDay').css('display', 'block');

			if(display_calendar['summer_year_day'] > display_calendar['winter_year_day'])
			{
				higher 			= display_calendar['summer_year_day'];
				higher_length 	= display_calendar['summer_length'];
				higher_rise 	= display_calendar['summer_rise'];
				higher_set 		= display_calendar['summer_set'];

				lower 			= display_calendar['winter_year_day'];
				lower_length 	= display_calendar['winter_length'];
				lower_rise 		= display_calendar['winter_rise'];
				lower_set 		= display_calendar['winter_set'];
			}
			else
			{
				higher 			= display_calendar['winter_year_day'];
				higher_length 	= display_calendar['winter_length'];
				higher_rise 	= display_calendar['winter_rise'];
				higher_set 		= display_calendar['winter_set'];

				lower 			= display_calendar['summer_year_day'];
				lower_length 	= display_calendar['summer_length'];
				lower_rise 		= display_calendar['summer_rise'];
				lower_set 		= display_calendar['summer_set'];

			}

			higher_rise_rotation	= (360/clock_hours)*(higher_rise-clock_hours/4);
			lower_rise_rotation		= (360/clock_hours)*(lower_rise-clock_hours/4);

			higher_set_rotation		= (360/clock_hours)*(higher_set+clock_hours/4);
			lower_set_rotation		= (360/clock_hours)*(lower_set+clock_hours/4);

			day = 0;

			if(display_calendar['year_day'] >= lower && display_calendar['year_day'] < higher)
			{

				day = display_calendar['year_day']-lower+clock_fraction_time;

				clock_rise_rotation = getTween(lower_rise_rotation, higher_rise_rotation, day, lower_length);
				clock_set_rotation = getTween(lower_set_rotation, higher_set_rotation, day, lower_length);
			}
			else
			{
				

				if(display_calendar['year_day'] > 0 && display_calendar['year_day'] < lower)
				{
					day = display_calendar['year_len']-higher+display_calendar['year_day']+clock_fraction_time;
				}
				else
				{
					day = display_calendar['year_day']-higher+clock_fraction_time;
				}

				clock_rise_rotation = getTween(higher_rise_rotation, lower_rise_rotation, day, higher_length);
				clock_set_rotation = getTween(higher_set_rotation, lower_set_rotation, day, higher_length);
			}

			if(clock_rise_rotation > 0){
				$('#start_dayhelper').css('display', 'none');
				$('#start_nighthelper').css('display', 'block');
			}else{
				$('#start_dayhelper').css('display', 'block');
				$('#start_nighthelper').css('display', 'none');
			}

			if(clock_set_rotation > 360){
				$('#end_dayhelper').css('display', 'block');
				$('#end_nighthelper').css('display', 'none');
			}else{
				$('#end_dayhelper').css('display', 'none');
				$('#end_nighthelper').css('display', 'block');
			}

			rotate_element($('#StartOfDay'), clock_rise_rotation);
			rotate_element($('#start_dayhelper'), clock_rise_rotation*0.935);
			rotate_element($('#start_nighthelper'), clock_rise_rotation*0.935);

			rotate_element($('#EndOfDay'), clock_set_rotation);
			rotate_element($('#end_dayhelper'), (clock_set_rotation-360)*0.935);
			rotate_element($('#end_nighthelper'), (clock_set_rotation-360)*0.935);

		}else{
			$('#StartOfDay').css('display', 'none');
			$('#EndOfDay').css('display', 'none');
			$('#start_dayhelper').css('display', 'none');
			$('#start_nighthelper').css('display', 'none');
			$('#end_nighthelper').css('display', 'none');
			$('#end_dayhelper').css('display', 'none');
		}

		display_calendar['solstice_events'] = [];

		if(display_calendar['settings']['auto_events'])
		{
			total = 1;
			spring_data = {};
			autumn_data = {};
			for(var months = 1; months <= display_calendar['n_months']; months++)
			{
				for(var day = 1; day <= display_calendar['month_len'][months-1]; day++, total++)
				{
					if(total == display_calendar['spring_equinox'])
					{
						spring_data = {
							"month": months,
							"day": day
						}
					}

					if(total == display_calendar['autumn_equinox'])
					{
						autumn_data = {
							"month": months,
							"day": day
						}
					}
				}
			}

			display_calendar['solstice_events'] = [
				{
					"id": 0,
					"name": "Spring Equinox",
					"class": "solstice_event",
					"description": "The Spring Equinox, also known as the Vernal Equinox, is when the night and day are approximately equal in length, marking the beginning of Spring and the approach of Summer.",
					"repeats": "annually_date",
					"data": spring_data
				},
				{
					"id": 1,
					"name": "Summer Solstice",
					"class": "solstice_event",
					"description": "The Summer Solstice is the longest day of the year.",
					"repeats": "annually_date",
					"data": {
						"month": display_calendar['summer_month'],
						"day": display_calendar['summer_day']
					}
				},
				{
					"id": 2,
					"name": "Autumn Equinox",
					"class": "solstice_event",
					"description": "The Autumn Equinox, also known as the Autumnal Equinox, is when the night and day are approximately equal in length, marking the beginning of Spring and the approach of Summer.",
					"repeats": "annually_date",
					"data": autumn_data
				},
				{
					"id": 3,
					"name": "Winter Solstice",
					"class": "solstice_event",
					"description": "The Winter Solstice is the shortest day of the year.",
					"repeats": "annually_date",
					"data": {
						"month": display_calendar['winter_month'],
						"day": display_calendar['winter_day']
					}
				}
			]
		}
	}

}

function rotate_element(element, rotation){
	element.css('-webkit-transform','rotate('+rotation+'deg)'); 
	element.css('-moz-transform','rotate('+rotation+'deg)');
	element.css('transform','rotate('+rotation+'deg)');
}

function getTween(beginning, end, value, max) {
	var val = beginning + ((value/max) * (end-beginning));
	return val;
}





function show_event_dialog(element){

	css_class = element.attr('class').split(' ')[1];

	event = element.attr('event_id');

	event = css_class !== 'event' && auto_events ? display_calendar['solstice_events'][event] : display_calendar['events'][event];

	$('#display_event_name').text(event['name']);

	if(event['description'] != "")
	{
		$('#display_event_description').text(event['description']);
		$('#display_event_description').css('display', 'block');
	}
	else
	{
		$('#display_event_description').css('display', 'none');
	}

	$("#event_background").fadeIn(150);
}


function hide_event_dialog(){
	$('#event_background').fadeOut(150, function(){
		if($('#event-form').length){ $('#event-form')[0].reset(); }
	});
}

function evaluate_events(event_array_name){

	if(event_array_name != '')
	{
		event_array = display_calendar[event_array_name];

		if(typeof event_array !== 'undefined')
		{
			str = event_array_name;
			str = str.slice(0, -1);
			$('.'+str).remove()


			$('.calendar_month_day').each(function(){
				text = '';
				filtered = get_event($(this), event_array);
				
				if(filtered.length > 0)
				{
					$.each(filtered, function(i){
						text += '<div class="calendar_event '+str+'" event_id="'+filtered[i]['id']+'">'+filtered[i]['name']+'</div>';
					});
					$(this).children().find('.calendar_events').append(text);
				}
			});
		}
	}
}

function get_day_data(day){

	data = {};

	data['year'] = parseInt(day.parent().parent().parent().attr('year'));
	data['month'] = parseInt(day.parent().parent().attr('month'));
	data['month_name'] = day.parent().parent().attr('id');
	data['day'] = parseInt(day.attr('day'));
	data['epoch'] = parseInt(day.attr('epoch'));
	data['week_day'] = parseInt(day.attr('week_day'));
	data['week_day_name'] = day.attr('week_day_name');
	data['week_day_number'] = parseInt(day.attr('week_day_number'));
	data['week'] = parseInt(day.parent().attr('week'));
	data['week_even'] = data['week'] % 2;
	data['moons'] = {}

	if(!hide_moons && display_calendar['moons'].length > 0){
		day.children().first().children().first().next().children().each(function(i){
			data['moons'][i] = {
				'moon_id': i,
				'moon_phase': parseInt($(this).children().first().attr('phase')),
				'moon_phase_number': parseInt($(this).children().first().attr('phase_number'))
			};
		});
	}

	return data;

}

function is_undef(data){
	return typeof data === 'undefined';
}

function get_event(day, event_array){

	data = get_day_data(day);

	eligable_events = [];

	for(index = 0; index < event_array.length; index++)
	{

		the_event = event_array[index];

		if((
			is_undef(the_event['from_date'])	|| data['epoch'] >= the_event['from_date']['epoch']
		)
		&&
		(
			is_undef(the_event['to_date'])	|| data['epoch'] <= the_event['to_date']['epoch']
		)
		&&
		(
			(!the_event['hide'] || (owned && !(showcase_view && !external_view)))
		))
		{
			switch(the_event['repeats'])
			{
				case 'once':
					if( (data['day']				=== the_event['data']['day']) &&
						(data['month']				=== the_event['data']['month']) &&
						(data['year']				=== the_event['data']['year'])){
						eligable_events.push(the_event);
					}

					break;

				case 'daily':
					eligable_events.push(the_event);
					break;

				case 'weekly':
					if( (data['week_day']			=== the_event['data']['week_day'])){
						eligable_events.push(the_event);
					}
					break;

				case 'fortnightly':
					if( (data['week_day']			=== the_event['data']['week_day']) &&
						(data['week_even']			=== the_event['data']['week_even'])){
						eligable_events.push(the_event);
					}
					break;

				case 'monthly_date':
					if( (data['day']				=== the_event['data']['day'])){
						eligable_events.push(the_event);
					}
					break;

				case 'monthly_weekday':
					if( (data['week_day_number']	=== the_event['data']['week_day_number']) &&
						(data['week_day']			=== the_event['data']['week_day'])){
						eligable_events.push(the_event);
					}
					break;

				case 'annually_date':
					if( (data['day']				=== the_event['data']['day']) &&
						(data['month']				=== the_event['data']['month'])){
						eligable_events.push(the_event);
					}
					break;

				case 'annually_month_weekday':
					if( (data['week_day']			=== the_event['data']['week_day']) &&
						(data['week_day_number']	=== the_event['data']['week_day_number']) &&
						(data['month']				=== the_event['data']['month'])){
						eligable_events.push(the_event);
					}
					break;

				case 'every_x_day':
					if( (data['epoch']%the_event['data']['every'] === the_event['data']['modulus'])){
						eligable_events.push(the_event);
					}
					break;

				case 'every_x_weekday':
					if( Math.floor(data['epoch']/display_calendar['week_len'])%the_event['data']['every'] === the_event['data']['modulus'] &&
						(data['week_day'] === the_event['data']['week_day'])){
						eligable_events.push(the_event);
					}
					break;

				case 'every_x_monthly_date':
					if( (((data['year']-1)*display_calendar['n_months'])+data['month']-1)%the_event['data']['every'] === the_event['data']['modulus'] &&
						(data['day']				=== the_event['data']['day'])){
						eligable_events.push(the_event);
					}
					break;

				case 'every_x_monthly_weekday':
					if( (((data['year']-1)*display_calendar['n_months'])+data['month']-1)%the_event['data']['every'] === the_event['data']['modulus'] &&
						(data['week_day_number']	=== the_event['data']['week_day_number']) &&
						(data['week_day']			=== the_event['data']['week_day'])){
						eligable_events.push(the_event);
					}
					break;

				case 'every_x_annually_date':
					if( (data['year']%the_event['data']['every'] === the_event['data']['modulus']) &&
						(data['day']				=== the_event['data']['day']) &&
						(data['month']				=== the_event['data']['month'])){
						eligable_events.push(the_event);
					}
					break;

				case 'every_x_annually_weekday':
					if( (data['year']%the_event['data']['every'] === the_event['data']['modulus']) &&
						(data['week_day']			=== the_event['data']['week_day']) &&
						(data['week_day_number']	=== the_event['data']['week_day_number']) &&
						(data['month']				=== the_event['data']['month'])){
						eligable_events.push(the_event);
					}
					break;

				case 'moon_every':

					if(	(data['moons'].hasOwnProperty(the_event['data']['moon_id'])) &&
						(data['moons'][the_event['data']['moon_id']]['moon_phase'] === the_event['data']['moon_phase'])){
						eligable_events.push(the_event);
					}

					break;

				case 'moon_monthly':

					if(	(data['moons'].hasOwnProperty(the_event['data']['moon_id'])) &&
						(data['moons'][the_event['data']['moon_id']]['moon_phase'] === the_event['data']['moon_phase']) &&
						(data['moons'][the_event['data']['moon_id']]['moon_phase_number'] === the_event['data']['moon_phase_number'])){
						eligable_events.push(the_event);
					}

					break;

				case 'moon_anually':

					if(	(data['moons'].hasOwnProperty(the_event['data']['moon_id'])) &&
						(data['moons'][the_event['data']['moon_id']]['moon_phase'] === the_event['data']['moon_phase']) &&
						(data['moons'][the_event['data']['moon_id']]['moon_phase_number'] === the_event['data']['moon_phase_number']) &&
						(data['month'] === the_event['data']['month'])){
						eligable_events.push(the_event);
					}

					break;

				case 'multimoon_every':
					still_eligiable = true;
					for(moon_index = 0; moon_index < the_event['data']['moons'].length; moon_index++){
						if(!(
							(data['moons'][moon_index]['moon_phase']			=== the_event['data']['moons'][moon_index]['moon_phase']))
						){
							still_eligiable = false;
							break;
						}
					}
					if(still_eligiable){
						eligable_events.push(the_event);
					}
					break;

				case 'multimoon_anually':
					still_eligiable = true;
					for(moon_index = 0; moon_index < the_event['data']['moons'].length; moon_index++){
						if(!(
							(data['moons'][moon_index]['moon_phase']			=== the_event['data']['moons'][moon_index]['moon_phase']) &&
							(data['moons'][moon_index]['moon_phase_number']		=== the_event['data']['moons'][moon_index]['moon_phase_number']))
						){
							still_eligiable = false;
							break;
						}
					}
					if(still_eligiable){
						eligable_events.push(the_event);
					}
					break;
			}
		}
	}

	return eligable_events;

}


function build_events(){

	$('#calendar').empty();
	$('#weather_display_container').css('display', 'none');
	$('#all_event_container').empty();

	$('body').css('display', 'block');
	
	all_event_container = $('#all_event_container');

	text = '';
	if(display_calendar['events'].length > 0){
		for(var i = 0; i < display_calendar['events'].length; i++){

			text += "<div class='event_display_container rounded'>";
			text += "<h5>"+display_calendar['events'][i]['name']+"</h5>";
			text += "<div class='btn_event_edit_container'>";
			text += "<button class='btn btn-sm btn-info btn-block btn_event_edit' event_id='"+display_calendar['events'][i]['id']+"'>Edit</button>";
			text += "</div></div>"
		}
	}
	else
	{
		text += '<h3>You do not have any events yet...</h3>'
	}

	all_event_container.append(text);
}



function build_weather_data(){

	if(typeof weather_view !== 'undefined' && weather_view && display_calendar['weather_enabled']){

		$('#calendar').empty();
		$('#all_event_container').empty();
		$('#weather_display_container').css('display', 'block');
		
		weather_data_container = $('#weather_display_container');

		text = '';
		if(display_calendar['weather_enabled']){
			
			data = {
				labels: [],
				datasets: [{
					label: 'Temperature',
					data: [],
					backgroundColor: "#FFF",
					borderColor: "#000",
					fill: false,
					pointRadius: 0
				}]
			}

			system = display_calendar['weather']['weather_temp_sys'];
			if(display_calendar['weather']['weather_temp_sys'] === 'cinematic'){
				system = 'metric'
			}

			if(window.weather_chart){

				window.weather_chart.data.datasets.forEach((dataset) => {
					for(new_weather_display_day = 1; new_weather_display_day <= Object.keys(calendar_weather).length; new_weather_display_day++){
						weather = calendar_weather[Object.keys(calendar_weather)[new_weather_display_day-1]];
						dataset.data[new_weather_display_day-1] = parseFloat(weather['temperature_'+system]);
					}
				});

				window.weather_chart.update();

			}else{

				for(weather_display_day = 1; weather_display_day <= Object.keys(calendar_weather).length; weather_display_day++){
					data.labels.push(weather_display_day);
					weather = calendar_weather[Object.keys(calendar_weather)[weather_display_day-1]];
					data.datasets[0].data.push(parseFloat(weather['temperature_'+system]));
				}

				config = {
					type: 'line',
					data: data,
					options: {
						legend: {
							display: false
						},
						responsive: true,
						title: {
							display: true,
							text: 'Temperature over the year'
						},
						tooltips: {
							mode: 'index',
							intersect: false,
						},
						hover: {
							mode: 'nearest',
							intersect: true
						},
						scales: {
							yAxes: [{
								ticks: {
                    				beginAtZero:true
								}
							}],
							xAxes: [{
								display: false
							}]
						}
					}
				};
				ctx = document.getElementById('weather_display_container').getContext('2d');
				window.weather_chart = new Chart(ctx, config);
			}

		}else{
			text += '<h3>You do not have any weather yet...</h3>'
		}

		weather_data_container.append(text);
	}
}

function show_weather_dialog(element){

	$("#weather_background").fadeIn(150);
}

function hide_weather_dialog(element){

	$("#weather_background").fadeOut(150);
}

function generate_weather(){

	if(display_calendar['weather_enabled']){

		switch(display_calendar['weather']['current_climate_type']){
			case 'preset':
				climate_name = display_calendar['weather']['current_climate'];
				climate = climate_table[climate_name];
				break

			case 'custom':
				climate_name = display_calendar['weather']['current_climate'];
				climate = display_calendar['weather']['custom_climates'][climate_name];
				break
		}

		if(display_calendar['solstice_enabled']){

			summer_season_month	= display_calendar['summer_month'];
			summer_season_day	= display_calendar['summer_day'];
			summer_season_epoch	= get_epoch(display_calendar['year'], summer_season_month, summer_season_day);

			winter_season_month	= display_calendar['winter_month'];
			winter_season_day	= display_calendar['winter_day'];
			winter_season_epoch	= get_epoch(display_calendar['year'], winter_season_month, winter_season_day);

		}else{

			summer_season_month	= Math.floor(display_calendar['n_months']/2);
			summer_season_day	= 1;
			summer_season_epoch	= get_epoch(display_calendar['year'], summer_season_month, summer_season_day);

			winter_season_month	= 1;
			winter_season_day	= 1;
			winter_season_epoch	= get_epoch(display_calendar['year'], 1, 1);


			summer_length = 0;
			total = 1;
			for(month = 1; month <= display_calendar['n_months']; month++)
			{
				for(day = 1; day <= display_calendar['month_len'][month-1]; day++)
				{
					if(month == summer_season_month && day == summer_season_day)
					{
						summer_length = total;
						break;
					}
					total++;
				}
			}

			display_calendar['summer_year_day'] = summer_length;
			display_calendar['winter_year_day'] = 1;

			display_calendar['summer_length'] = display_calendar['year_len'] - display_calendar['summer_year_day'] +  display_calendar['winter_year_day'];
			display_calendar['winter_length'] = display_calendar['summer_year_day'] - display_calendar['winter_year_day'];

		}

		if(summer_season_epoch > winter_season_epoch){
			high = 'summer';
			low = 'winter';
		}else{
			high = 'winter';
			low = 'summer';
		}

		higher 					= display_calendar[high+'_year_day'];
		higher_length 			= display_calendar[high+'_length'];
		higher_season_precip	= climate[high]['precipitation'];
		higher_season_hot		= climate[high]['temperature']['hot'];
		higher_season_cold		= climate[high]['temperature']['cold'];

		lower 					= display_calendar[low+'_year_day'];
		lower_length 			= display_calendar[low+'_length'];
		lower_season_precip		= climate[low]['precipitation'];
		lower_season_hot		= climate[low]['temperature']['hot'];
		lower_season_cold		= climate[low]['temperature']['cold'];

		season_first_day 		= get_epoch(display_calendar['year'], 1, 1);
		season_last_day 		= get_epoch(display_calendar['year'], display_calendar['n_months'], display_calendar['month_len'][display_calendar['n_months']-1]);

		season_year_length = season_last_day - season_first_day;

		seed = calendar_year.toString()+display_calendar['weather']['weather_seed'].toString()+climate_name;

		Math.seedrandom(seed);
		
		var Simple1DNoise = function() {
			var MAX_VERTICES = 256;
			var MAX_VERTICES_MASK = MAX_VERTICES -1;
			var amplitude = 1;
			var scale = 1;

			var r = [];

			for ( var i = 0; i < MAX_VERTICES; ++i ) {
				r.push(Math.random());
			}

			var getVal = function( x ){
				var scaledX = x * scale;
				var xFloor = Math.floor(scaledX);
				var t = scaledX - xFloor;
				var tRemapSmoothstep = t * t * ( 3 - 2 * t );

				/// Modulo using &
				var xMin = xFloor & MAX_VERTICES_MASK;
				var xMax = ( xMin + 1 ) & MAX_VERTICES_MASK;

				var y = lerp( r[ xMin ], r[ xMax ], tRemapSmoothstep );

				return y * amplitude;
			};

			/**
			* Linear interpolation function.
			* @param a The lower integer value
			* @param b The upper integer value
			* @param t The value between the two
			* @returns {number}
			*/
			var lerp = function(a, b, t ) {
				return a * ( 1 - t ) + b * t;
			};

			// return the API
			return {
				getVal: getVal,
				setAmplitude: function(newAmplitude) {
					amplitude = newAmplitude;
				},
				setScale: function(newScale) {
					scale = newScale;
				}
			};
		};
		
		generator = new Simple1DNoise();

		generator.setScale(display_calendar['weather']['weather_temp_scale']);
		generator.setAmplitude(display_calendar['weather']['weather_temp_amplitude']);

		precipitation_generator = new Simple1DNoise();
		precipitation_generator.setScale(0.5)
		precipitation_generator.setAmplitude(1.0)

		cloud_generator = new Simple1DNoise();
		cloud_generator.setScale(0.5)
		cloud_generator.setAmplitude(1.0)
		
		wind_direction = random_int_between(0, Object.keys(wind_direction_table).length-1);
		wind_direction = pick_from_table(Math.random(), wind_direction_table[Object.keys(wind_direction_table)[wind_direction]]);

		calendar_weather = {};

		for(day = 0; day <= season_year_length; day++){

			season_year_day = day + 1;
			epoch_day = season_first_day + day;

			if(season_year_day >= lower && season_year_day < higher)
			{

				target = season_year_day - lower;
				temperature_hot = getTween(lower_season_hot, higher_season_hot, target, lower_length);
				temperature_cold = getTween(lower_season_cold, higher_season_cold, target, lower_length);
				chance_of_precipitation = getTween(lower_season_precip, higher_season_precip, target, lower_length);

			}
			else
			{
				
				if(season_year_day > 0 && season_year_day < lower)
				{
					target = display_calendar['year_len'] - higher + season_year_day;
				}
				else
				{
					target = season_year_day - higher;
				}

				temperature_hot = getTween(higher_season_hot, lower_season_hot, target, higher_length);
				temperature_cold = getTween(higher_season_cold, lower_season_cold, target, higher_length);
				chance_of_precipitation = getTween(higher_season_precip, lower_season_precip, target, higher_length);

			}
			f_temperature = Math.floor(getTween(temperature_cold, temperature_hot, generator.getVal(epoch_day), 1.0));
			freezing = f_temperature > 32 ? 'warm' : 'cold';
			m_temperature = fahrenheit_to_celcius(f_temperature);
			c_temperature = pick_from_table(f_temperature, temperature_gauge_table, false).key;

			precipitation = {'key': 'None'};
			wind_speed = {'key': 'Calm'};
			clouds = 'Clear';
			precipitation_chance = precipitation_generator.getVal(epoch_day+season_year_length);
			wind_type_chance = 0;
			precipitation_index = 0;
			feature_select = '';
			if(precipitation_chance <= chance_of_precipitation){
				precipitation = pick_from_table(precipitation_chance, precipitation_table[freezing]);
				clouds = cloud_table[precipitation.index];

				wind_type_chance = roll_dice(wind_type_table[precipitation.index]);
				if(wind_type_chance == 20){
					wind_type_chance += roll_dice('1d10');
					wind_speed = pick_from_table(wind_type_chance, wind_speed_high_table);
					feature_select = 'Storm';
				}else{
					wind_speed = pick_from_table(wind_type_chance, wind_speed_table);
					feature_select = 'Rain';
				}
			}else{

				clouds_chance = cloud_generator.getVal(epoch_day+season_year_length+season_year_length);
				another_precipitation = pick_from_table(clouds_chance-0.3, precipitation_table[freezing]);
				
				if(clouds_chance > 0.3 && precipitation_chance > 0.2){
					clouds = cloud_table[another_precipitation.index];
				}

				another_precipitation = pick_from_table(clouds_chance, precipitation_table[freezing]);
				wind_type_chance = roll_dice(wind_type_table[another_precipitation.index]);

				wind_type_chance = wind_type_chance == 20 ? 19 : wind_type_chance;
				
				wind_speed = pick_from_table(wind_type_chance, wind_speed_table);

				if(wind_speed.key > 4){
					feature_select = 'Windy';
				}

			}

			feature_chance = Math.random();
			if(feature_table[feature_select] && pick_from_table(feature_chance, feature_table[feature_select][freezing]) !== undefined){
				feature = pick_from_table(feature_chance, feature_table[feature_select][freezing]).key;
			}else{
				feature = 'None';
			}

			wind_info = wind_speed_info_table[wind_speed.key];
			i_wind_velocity = wind_info['mph'];
			m_wind_velocity = wind_info['mph'].replace( /(\d+)/g, function(a, b){
				return Math.round(b*1.60934,2);
			});

			wind_direction = pick_from_table(Math.random(), wind_direction_table[wind_direction.key]);

			calendar_weather[epoch_day.toString()] = {
				'temperature_imperial': f_temperature,
				'temperature_metric': m_temperature,
				'temperature_cinematic': c_temperature,
				'precipitation': precipitation.key,
				'clouds': clouds,
				'wind_speed': wind_speed.key,
				'wind_velocity_imperial': i_wind_velocity,
				'wind_velocity_metric': m_wind_velocity,
				'wind_description': wind_info['desciption'],
				'wind_direction': wind_direction.key,
				'feature': feature
			}

		}
		build_weather_data();
	}
}

function cubic_tween(value, start_value, change, duration) {
	t = value;
	b = start_value;
	c = change;
	d = duration;
	t /= d/2;
	if (t < 1) return c/2*t*t*t + b;
	t -= 2;
	return c/2*(t*t*t + 2) + b;
}

function getTween(beginning, end, value, max) {
	var val = beginning + ((value/max) * (end-beginning));
	return val;
}

function roll_dice(dice_formula){
	dice_amount = parseInt(dice_formula.split('d')[0]);
	dice_size = parseInt(dice_formula.split('d')[1]);

	result = 0;
	for(dice = 1; dice <= dice_amount; dice++){
		result += random_int_between(1, dice_size);
	}
	return result;
}

function fahrenheit_to_celcius(temp){
	return precisionRound((temp-32)*(5/9), 1);
}


function celcius_to_fahrenheit(temp){
	return precisionRound((temp*9/5)+32, 1);
}

function precisionRound(number, precision) {
	var factor = Math.pow(10, precision);
	return Math.round(number * factor) / factor;
}

function pick_from_table(chance, array, grow){
	grow = grow === undefined ? true : false;
	keys = Object.keys(array);
	values = array;
	for(index = 0, target = 0; index < Object.keys(array).length; index++){
		if(grow){
			target += values[keys[index]];
		}else{
			target = values[keys[index]];
		}
		if(chance <= target){
			return {
				'index': index,
				'key': keys[index],
				'value': values[keys[index]]
			};
		}
	}
}

function random_int_between(min, max){
	return Math.round(Math.random() * (max - min) + min);  
}

function random_float_between(min, max){
	return Math.random() * (max - min) + min;  
}

var feature_table = {
	'Rain':{
		'warm': {
			'Fog': 0.25
		},
		'cold': {
			'Hail': 0.15
		}
	},
	'Storm': {
		'warm': {
			'Lightning': 0.25
		},
		'cold': {
			'Hail': 0.2
		}
	},
	'Windy': {
		'warm': {
			'Dust Storm': 0.2,
			'Tornado': 0.2
		},
		'cold': {
			'Tornado': 0.2
		}
	}
}

var supernatural_feature_table = [];

var temperature_gauge_table = {
	'Polar': -40,
	'Bone-chilling': -22,
	'Bitter cold': -4,
	'Biting': 5,
	'Frigid': 14,
	'Crisp': 23,
	'Freezing': 32,
	'Cold': 41,
	'Chilly': 50,
	'Cool': 59,
	'Mild': 68,
	'Warm': 77,
	'Hot': 86,
	'Very Hot': 95,
	'Sweltering': 104,
	'Blistering': 113,
	'Burning': 140,
	'Blazing': 176,
	'Infernal': 212
};

var precipitation_table = {
	'warm': {
		'Light mist': 0.2,
		'Drizzle': 0.175,
		'Steady rainfall': 0.175,
		'Strong rainfall': 0.15,
		'Pounding rain': 0.15,
		'Downpour': 0.15
	},
	'cold': {
		'A few flakes': 0.2,
		'A dusting of snow': 0.175,
		'Flurries': 0.175,
		'Moderate snowfall': 0.15,
		'Heavy snowfall': 0.15,
		'Blizzard': 0.15
	}
}

var cloud_table = [
	'A few clouds',
	'Mostly cloudy',
	'Gray, slightly overcast',
	'Gray, highly overcast',
	'Dark storm clouds',
	'Dark storm clouds'
]

var wind_type_table = [
	'1d4',
	'1d6',
	'2d4',
	'2d6',
	'2d8',
	'2d10'
]

var wind_speed_table = {
	'Calm': 1,
	'Light air': 2,
	'Light breeze': 2,
	'Gentle breeze': 2,
	'Moderate breeze': 2,
	'Fresh breeze': 2,
	'Strong breeze': 2,
	'Moderate gale': 2,
	'Fresh gale': 2,
	'Strong gale': 1,
	'Storm': 1
};

var wind_speed_high_table = {
	'Violent storm': 28,
	'Hurricane': 2
}

var wind_speed_info_table = {
	'Calm': {
		'mph': '<1',
		'desciption': 'Smoke rises vertically'
	},
	'Light air': {
		'mph': '1-3',
		'desciption': 'Wind direction shown by smoke but not wind vanes'
	},
	'Light breeze': {
		'mph': '4-7',
		'desciption': 'Wind felt on face, leaves rustle, vanes move'
	},
	'Gentle breeze': {
		'mph': '8–12',
		'desciption': 'Leaves and small twigs sway and banners flap'
	},
	'Moderate breeze': {
		'mph': '13–18',
		'desciption': 'Small branches move, and dust and small branches are raised'
	},
	'Fresh breeze': {
		'mph': '19–24',
		'desciption': 'Small trees sway and small waves form on inland waters'
	},
	'Strong breeze': {
		'mph': '25–31',
		'desciption': 'Large branches move'
	},
	'Moderate gale': {
		'mph': '32–38',
		'desciption': 'Whole trees sway and walking against wind takes some effort'
	},
	'Fresh gale': {
		'mph': '39–46',
		'desciption': 'Twigs break off trees and general progress is impeded'
	},
	'Strong gale': {
		'mph': '47–54',
		'desciption': 'Slight structural damage occurs'
	},
	'Storm': {
		'mph': '55–63',
		'desciption': 'Trees are uprooted and considerable structural damage occurs'
	},
	'Violent storm': {
		'mph': '64–72',
		'desciption': 'Widespread damage occurs'
	},
	'Hurricane': {
		'mph': '73–136',
		'desciption': 'Widespread devastation occurs'
	}
};

var wind_direction_table = {
	'N': {
		'SW': 0.075,
		'W': 0.105,
		'NW': 0.14,
		'N': 0.31,
		'NE': 0.14,
		'E': 0.105,
		'SE': 0.075,
		'S': 0.05
	},
	'NE': {
		'W': 0.075,
		'NW': 0.105,
		'N': 0.14,
		'NE': 0.31,
		'E': 0.14,
		'SE': 0.105,
		'S': 0.075,
		'SW': 0.05
	},
	'E': {
		'NW': 0.075,
		'N': 0.105,
		'NE': 0.14,
		'E': 0.31,
		'SE': 0.14,
		'S': 0.105,
		'SW': 0.075,
		'W': 0.05
	},
	'SE': {
		'N': 0.075,
		'NE': 0.105,
		'E': 0.14,
		'SE': 0.31,
		'S': 0.14,
		'SW': 0.105,
		'W': 0.075,
		'NW': 0.05
	},
	'S': {
		'NE': 0.075,
		'E': 0.105,
		'SE': 0.14,
		'S': 0.31,
		'SW': 0.14,
		'W': 0.105,
		'NW': 0.075,
		'N': 0.05
	},
	'SW': {
		'E': 0.075,
		'SE': 0.105,
		'S': 0.14,
		'SW': 0.31,
		'W': 0.14,
		'NW': 0.105,
		'N': 0.075,
		'NE': 0.05
	},
	'W': {
		'SE': 0.075,
		'S': 0.105,
		'SW': 0.14,
		'W': 0.31,
		'NW': 0.14,
		'N': 0.105,
		'NE': 0.075,
		'E': 0.05
	},
	'NW': {
		'S': 0.075,
		'SW': 0.105,
		'W': 0.14,
		'NW': 0.31,
		'N': 0.14,
		'NE': 0.105,
		'E': 0.075,
		'SE': 0.05
	}
}


var climate_table = {
	'Equatorial': {
		'winter': {
			'temperature': {
				'cold': 60,
				'hot': 100
			},
			'precipitation': 0.3
		},
		'summer': {
			'temperature': {
				'cold': 60,
				'hot': 100
			},
			'precipitation': 0.5
		}
	},
	'Monsoon': {
		'winter': {
			'temperature': {
				'cold': 70,
				'hot': 120
			},
			'precipitation': 0.15
		},
		'summer': {
			'temperature': {
				'cold': 70,
				'hot': 120
			},
			'precipitation': 0.9
		}
	},
	'Desert': {
		'winter': {
			'temperature': {
				'cold': 55,
				'hot': 70
			},
			'precipitation': 0.05
		},
		'summer': {
			'temperature': {
				'cold': 65,
				'hot': 110
			},
			'precipitation': 0.05
		}
	},
	'Tropical Savannah': {
		'winter': {
			'temperature': {
				'cold': 75,
				'hot': 115
			},
			'precipitation': 0.1
		},
		'summer': {
			'temperature': {
				'cold': 75,
				'hot': 115
			},
			'precipitation': 0.85
		}
	},
	'Steppes': {
		'winter': {
			'temperature': {
				'cold': 35,
				'hot': 50
			},
			'precipitation': 0.2
		},
		'summer': {
			'temperature': {
				'cold': 70,
				'hot': 115
			},
			'precipitation': 0.05
		}
	},
	'Warm and Rainy': {
		'winter': {
			'temperature': {
				'cold': 10,
				'hot': 50
			},
			'precipitation': 0.4
		},
		'summer': {
			'temperature': {
				'cold': 50,
				'hot': 85
			},
			'precipitation': 0.4
		}
	},
	'Warm with Dry Summer': {
		'winter': {
			'temperature': {
				'cold': 10,
				'hot': 60
			},
			'precipitation': 0.3
		},
		'summer': {
			'temperature': {
				'cold': 60,
				'hot': 95
			},
			'precipitation': 0.1
		}
	},
	'Warm with Dry Winter': {
		'winter': {
			'temperature': {
				'cold': 32,
				'hot': 50
			},
			'precipitation': 0.15
		},
		'summer': {
			'temperature': {
				'cold': 70,
				'hot': 110
			},
			'precipitation': 0.45
		}
	},
	'Cool and Rainy': {
		'winter': {
			'temperature': {
				'cold': 5,
				'hot': 40
			},
			'precipitation': 0.35
		},
		'summer': {
			'temperature': {
				'cold': 60,
				'hot': 85
			},
			'precipitation': 0.35
		}
	},
	'Cool with Dry Winter': {
		'winter': {
			'temperature': {
				'cold': 5,
				'hot': 40
			},
			'precipitation': 0.1
		},
		'summer': {
			'temperature': {
				'cold': 60,
				'hot': 85
			},
			'precipitation': 0.35
		}
	},
	'Tundra': {
		'winter': {
			'temperature': {
				'cold': -15,
				'hot': 35
			},
			'precipitation': 0.1
		},
		'summer': {
			'temperature': {
				'cold': 32,
				'hot': 65
			},
			'precipitation': 0.1
		}
	},
	'Polar': {
		'winter': {
			'temperature': {
				'cold': -35,
				'hot': 32
			},
			'precipitation': 0.1
		},
		'summer': {
			'temperature': {
				'cold': 32,
				'hot': 65
			},
			'precipitation': 0.1
		}
	}
}
