

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


$(document).ready(function(){
	
	$('body').css('display', 'none');
	$('#header').css('display', 'none');
	$('#footer').css('display', 'none');
	$('#content').css('top', '0px');

	timeoutID = window.setTimeout(load_calendar, 150);

});

var hash = getUrlParameter('id');
var external_view = false;
var showcase_view = false;
var owned = true;
var display_calendar = {};

function load_calendar(){
	$.ajax({
		url:"https://fantasy-calendar.com/ajax/ajax_calendar",
		type: "get",
		dataType: 'json',
		data: {action: 'load', hash: hash},
		success: function(data){
			inc_calendar = $.parseJSON(data['result']['data']);
			calendar =  $.parseJSON(data['result']['data']);
			set_display_calendar();
			build_calendar();
		},
		error: function ( log )
		{
			console.log(log);
		}
	});
}


function set_display_calendar(){

	display_calendar = $.extend( true, {}, calendar );

	if(display_calendar['year_leap'] != 0 && display_calendar['year'] % display_calendar['year_leap'] === 0){
		display_calendar['month_len'][display_calendar['month_leap']-1] = display_calendar['month_len'][display_calendar['month_leap']-1] + 1;
		display_calendar['year_len'] = display_calendar['year_len'] + 1;
	}
}

$(document).ready(function(){

	$('#generator_container').css('display', 'table');
	window.onbeforeunload = null;
});

var table_container = $('#calendar');

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

/*-----------------------------------\
|   This builds the actual calendar  |
\-----------------------------------*/

var calendar_month;
var calendar_year;
var week_len;
var week;
var auto_events;
var show_current_month;
var hide_moons;
var hide_events;
var allow_view;
var only_backwards;
var previous_calendar = '';

function build_calendar()
{

	var table_container = $('#calendar');
	
	$('body').css('display', 'block');

	table_container.empty();
	
	week_len			= display_calendar['week_len'];
	week				= 1;
	auto_events			= display_calendar['settings'] ? display_calendar['settings']['auto_events'] : false;
	show_current_month	= display_calendar['settings'] ? display_calendar['settings']['show_current_month'] : false;
	hide_moons			= display_calendar['settings'] ? display_calendar['settings']['hide_moons'] : false;
	hide_events			= display_calendar['settings'] ? display_calendar['settings']['hide_events'] : false;
	allow_view			= display_calendar['settings'] ? display_calendar['settings']['allow_view'] : true;
	only_backwards		= display_calendar['settings'] ? display_calendar['settings']['only_backwards'] : true;
	add_month_number	= display_calendar['settings'] ? display_calendar['settings']['add_month_number'] : true;
	year_day			= display_calendar['first_day'];
	moon_repitition_data = {}

	hide_events = (owned && showcase_view && hide_events) != (!owned && hide_events);
	hide_moons = (owned && showcase_view && hide_moons) != (!owned && hide_moons);

	calendar_month = calendar_month === undefined ? display_calendar['month'] : calendar_month;
	calendar_year = calendar_year === undefined ? display_calendar['year'] : calendar_year;

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

	if(display_calendar['year_leap'] !== undefined && display_calendar['year_leap'] != 0){
		epoch = (calendar_year * calendar['year_len']) + 2 + Math.floor(calendar_year/display_calendar['year_leap']);
		if(calendar_year % display_calendar['year_leap'] === 0){
			epoch -= 1;
		}
	}else{
		epoch = (calendar_year * display_calendar['year_len']) + 1;
	}

	current_era = display_calendar['era'] ? ' ' + display_calendar['era'] : '';
	
	if(display_calendar['overflow']){
		first_day = (epoch + display_calendar['first_day'] - 1) % display_calendar['week_len'];
		year_day = first_day;
	}

	table_container.attr('year', calendar_year);

	text = ''
	for(var i = 1; i <= display_calendar['n_months']; i++)
	{
		id = display_calendar['months'][i-1];
		text += '<table class="calendar_month_table" month="'+i+'" id="'+id+'"></table>';
	}
	table_container.append(text);

	text = '';

	text += '<tr><th id="calendar_year" colspan="'+week_len+'">';
		text += '<div id="calendar_year_container">';
			text += '<div id="calendar_year_row">';
				text += '<div class="btn_view_year">';
				text += '</div>';
				text += '<div id="calendar_year_text">Year '+calendar_year+current_era+'</div>';
				text += '<div class="btn_view_year">';
				text += '</div>';
			text += '</div>';
		text += '</div>';
	text += '</th></tr>';

	table_container.children().first().append(text);

	table_container.children().each(function(){

		name = $(this).attr('id');
		i = $(this).attr('month');
		if(add_month_number){
			name = name + ' - ' + i;
		}
		text = '';

		week_day_number = {};

		text += '<tr><th class="calendar_month_name" colspan="'+week_len+'">';
			text += '<div class="calendar_month_container">';
				text += '<div id="calendar_month_row">';
					text += '<div class="btn_view_month">';
					text += '</div>';
					text += '<div class="calendar_month_text">'+name+'</div>';
					text += '<div class="btn_view_month">';
					text += '</div>';
				text += '</div>';
			text += '</div>';
		text += '</th></tr>';

		// The week days
		text += '<tr>';

		for(var week_day = 1; week_day <= display_calendar['week_len']; week_day++)
		{
			week_day_name = display_calendar['weekdays'][week_day-1];

			text += '<th class="calendar_week_day_name">'+week_day_name+'</th>';

			week_day_number[week_day-1] = 1;
		}

		text += '</tr>';
			
		fix = ((year_day + week_len) % week_len);

		text += '<tr week="'+week+'">';

		if(fix > 0 && display_calendar['overflow']){
			text += '<td colspan="'+fix+'" class="calendar_day_padder"></td>';
		}

		month_length = display_calendar['month_len'][i-1];

		for(var day = 1; day <= month_length; day++, year_day++, epoch++)
		{
			overflow_day = display_calendar['overflow'] ? year_day : day-1;

			week_day = ((overflow_day + week_len) % week_len);

			if(!display_calendar['overflow'] && day == 1){
				week++;
			}

			if(week_day === 0 && week > 1){
				text += '<tr week="'+week+'">';
			}

			text += '<td class="calendar_month_day" epoch="'+epoch+'" day="'+day+'" week_day="'+week_day+'" week_day_name="'+ display_calendar['weekdays'][week_day]+'" week_day_number="'+week_day_number[week_day]+'">';
				text += '<div>';
					text += '<div class="calendar_day_number">';
						text += day;
					text += '</div>';

					text += display_calendar['moons'].length > 0 ? insert_moon(epoch, parseInt(i)) : '';
					text += '<div class="calendar_events"></div>';
				text += '</div>';
			text += '</td>';

			var fix = week_len-week_day-1;

			if(day === month_length && fix > 0){
				text += '<td colspan="'+fix+'" class="calendar_day_padder"></td>';
			}

			if(week_day+1 === week_len){
				text += '</tr>';
				week++;
			}

			week_day_number[week_day] += 1;
		}

		$(this).append(text);
		delete text;
	});

	update_moon_colors();


	if(!hide_events){
		evaluate_events('events');
	}

	if(auto_events){
		evaluate_events('solstice_events');
	}

	build_events();

}

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
	
	all_event_container = $('#all_event_container');

	if(display_calendar['events'].length > 0){

		all_event_container.empty();

		text = '';

		events = display_calendar['events'].filter(event => !event['noprint'] || event['noprint'] === undefined);

		for(var i = 0; i < events.length; i++){

			if(i % 3 == 0){
				text += "<div class='event_display_container_row'>";
			}

			event = events[i];

			text += "<div class='event_display_container rounded black'>";
			text += "<h3>"+event['name']+"</h3>";
			text += "<div class='event_repeat_text'>Repeats: ";

			switch(event['repeats']){

				case 'once':
					text += 'Once';
					break;

				case 'daily':
					text += 'Daily';
					break;

				case 'weekly':
					text += 'Weekly on '+calendar['weekdays'][event['data']['week_day']];
					break;

				case 'fortnightly':
					text += 'Fortnightly on '+calendar['weekdays'][event['data']['week_day']];
					break;

				case 'monthly_date':
					text += 'Monthly on the ' + ordinal_suffix_of(event['data']['day']);
					break;

				case 'annually_date':
					text += 'Annually on the ' + ordinal_suffix_of(event['data']['day']) + ' of ' + calendar['months'][event['data']['month']-1];
					break;

				case 'monthly_weekday':
					text += 'Monthly on the '+ordinal_suffix_of(event['data']['week_day_number'])+' '+calendar['weekdays'][event['data']['week_day']];
					break;

				case 'annually_month_weekday':
					text += 'Annually on the '+ordinal_suffix_of(event['data']['week_day_number'])+' '+calendar['weekdays'][event['data']['week_day']]+' in '+calendar['months'][event['data']['month']-1];
					break;

				case 'every_x_day':
					text += 'Every ' + ordinal_suffix_of(event['data']['every']) + ' day';
					break;

				case 'every_x_weekday':
					text += 'Every ' + ordinal_suffix_of(event['data']['every']) + ' '+calendar['weekdays'][event['data']['week_day']];
					break;

				case 'every_x_monthly_date':
					text += 'Every ' + ordinal_suffix_of(event['data']['every']) + ' month on the ' + ordinal_suffix_of(event['data']['day']);
					break;

				case 'every_x_monthly_weekday':
					text += 'Every ' + ordinal_suffix_of(event['data']['every']) + ' month on the '+ordinal_suffix_of(event['data']['week_day_number'])+' '+calendar['weekdays'][event['data']['week_day']];
					break;

				case 'every_x_annually_date':
					text += 'Every ' + ordinal_suffix_of(event['data']['every']) + ' year on the ' + ordinal_suffix_of(event['data']['day']) + ' of ' + calendar['months'][event['data']['month']-1];
					break;

				case 'every_x_annually_weekday':
					text += 'Every ' + ordinal_suffix_of(event['data']['every']) + ' year on the '+ordinal_suffix_of(event['data']['week_day_number'])+' '+calendar['weekdays'][event['data']['week_day']]+' in '+calendar['months'][event['data']['month']-1];
					break;

				case 'moon_every':
					event_moon_id = event['data']['moon_id'];
					event_moon_name = calendar['moons'][event_moon_id];;
					event_possessive = event_moon_name.slice(-1) === "s" ? "'" : "'s";
					event_moon_phase_name = moon_phases[event['data']['moon_phase']];
					text += 'Every ' + event_moon_name + event_possessive + ' ' + event_moon_phase_name;
					break;

				case 'moon_monthly':
					event_moon_id = event['data']['moon_id'];
					event_moon_name = calendar['moons'][event_moon_id];;
					event_possessive = event_moon_name.slice(-1) === "s" ? "'" : "'s";
					event_moon_phase_name = moon_phases[event['data']['moon_phase']];
					event_moon_phase_number = data['moons'][event_moon_id]['moon_phase_number'];
					text += 'Monthly on ' + event_moon_name + event_possessive + ' ' + ordinal_suffix_of(event_moon_phase_number) + ' ' + event_moon_phase_name;
					break;

				case 'moon_anually':
					event_moon_id = event['data']['moon_id'];
					event_moon_name = calendar['moons'][event_moon_id];;
					event_possessive = event_moon_name.slice(-1) === "s" ? "'" : "'s";
					event_moon_phase_name = moon_phases[event['data']['moon_phase']];
					event_moon_phase_number = data['moons'][event_moon_id]['moon_phase_number'];
					text += 'Anually on ' + event_moon_name + event_possessive + ' ' + ordinal_suffix_of(event_moon_phase_number) + ' ' + event_moon_phase_name +' in '+calendar['months'][event['data']['month']-1];
					break;

				case 'multimoon_every':
					text += 'Every moon cycle where:<br>';
					break;

				case 'multimoon_anually':
					text += 'Anually in ' + calendar['months'][event['data']['month']-1] + ' when moon cycles match:<br>';
					break;

				default:
					break;
			}

			text += "</div>";
			if(event['description'].length > 0){
				text += "<div class='event_description_text'>"+event['description']+"</div>"
			}
			text += "</div>"

			if(i % 3 == 2){
				text += "</div>";
			}

		}

		if(i % 3 == 2 || i % 3 == 1){

		}

		all_event_container.append(text);

	}

}