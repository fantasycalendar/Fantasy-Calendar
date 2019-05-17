/*--------------------------------------------------\
|   This contains the functions related to events   |
\--------------------------------------------------*/

function insert_event(event_data){
	events[event_data['id']] = event_data;
	set_variables();
	evaluate_events('events');
}

function remove_event(i){
	$('.event[event_id="'+i+'"]').remove();
	delete events[i];
	events = events.filter(function(n){ return n != undefined });
	set_variables();
}

function reorder_events(){
	$.each(events, function(i, local_event){
		event_id = local_event['id'];
		try{
			$('.event[event_id="'+event_id+'"]').each(function(){
				$(this).attr('event_id', i);
			});
			events[i]['id'] = i;
		}catch(err){
			console.log(err);
		}
	});
}

function edit_event(id){

	event = calendar['events'][id];

	$('#event-form').attr('event_id', id);
	$("#event_name").val(event['name']);
	$("#event_desc").val(event['description']);
	$('#btn_event_delete').css('display', 'block');
	$('#btn_event_delete').prop('disabled', false);

	$('#event_from_year').val(calendar['year']);
	$('#event_to_year').val(calendar['year']);

	$('#event_from_month').val(calendar['month']);
	$('#event_to_month').val(calendar['month']);

	rebuild_day_list();
	$('#event_from_day').val(calendar['day']);
	$('#event_to_day').val(calendar['day']);

	repeats = $('#repeats');
	repeats.prop('disabled', true);
	repeats.css('display', 'none');

	text = '';
	
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

		case 'monthly_weekday':
			text += 'Monthly on the '+ordinal_suffix_of(event['data']['week_day_number'])+' '+calendar['weekdays'][event['data']['week_day']];
			break;

		case 'annually_date':
			text += 'Annually on the ' + ordinal_suffix_of(event['data']['day']) + ' of ' + calendar['months'][event['data']['month']-1];
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

	$('#multimoon').empty();
	$('#editfield').empty();

	if(event['data']['moons']){
		 
		text += '<ul>';

		for(moon_id = 0; moon_id < event['data']['moons'].length; moon_id++){

			event_moon_name = calendar['moons'][moon_id];

			event_moon_phase = event['data']['moons'][moon_id]['moon_phase'];

			event_moon_phase_name = moon_phases[event['data']['moons'][[moon_id]]['moon_phase']];

			event_possessive = event_moon_name.slice(-1) === "s" ? "'" : "'s";

			text += '<li>' + event_moon_phase_name + ' on ' + event_moon_name + '</li>';

		}

		text += '</ul>'

	}

	$('#editfield').append(text).css('display', 'block');

	delete text;

	$('#event_hide_players').prop('checked', event['hide']);

	$('#event_from_checkbox').prop('disabled', event['repeats'] === 'once');

	value = $('#repeats :selected').val();
	if(value == 'multimoon_every' || value == 'multimoon_monthly' || value == 'multimoon_anually'){
		$('#multimoon').css('display', 'block');
	}else{
		$('#multimoon').css('display', 'none');
	}

	if(typeof event['from_date'] !== 'undefined')
	{
		$('#event_from_checkbox').prop('checked', true);

		$('#event_from_year').val(event['from_date']['year']).prop('disabled', false);
		$('#event_from_month').val(event['from_date']['month']).prop('disabled', false);
		rebuild_day_list();
		$('#event_from_day').val(event['from_date']['day']).prop('disabled', false);
		
		$('#event_to_checkbox').prop('disabled', false);

		if(typeof event['to_date'] !== 'undefined')
		{
			$('#event_to_checkbox').prop('checked', true);

			$('#event_to_year').val(event['to_date']['year']).prop('disabled', false);
			$('#event_to_month').val(event['to_date']['month']).prop('disabled', false);
			rebuild_day_list();
			$('#event_to_day').val(event['to_date']['day']).prop('disabled', false);
		}
	}

	$("#event_background").fadeIn(150);

}

function show_event_dialog(element){

	css_class = element.attr('class');

	if(css_class.split(' ')[1] === 'solstice_event')
	{
		return;
	}

	is_event = element.hasClass('event');

	day = is_event ? element.parent().parent().parent() : element.parent().parent();

	data = get_day_data(day);

	repeats = $('#repeats');

	repeats.prop('disabled', false);
	repeats.css('display', 'block');
	$('#editfield').css('display', 'none');

	repeats.find('option[value="weekly"]').text('Weekly on '+data['week_day_name']);
	repeats.find('option[value="fortnightly"]').text('Fortnightly on '+data['week_day_name']);
	repeats.find('option[value="monthly_date"]').text('Monthly on the ' + ordinal_suffix_of(data['day']));
	repeats.find('option[value="monthly_weekday"]').text('Monthly on the '+ordinal_suffix_of(data['week_day_number'])+' '+data['week_day_name']);
	repeats.find('option[value="annually_month_date"]').text('Annually on the '+ordinal_suffix_of(data['day'])+' of '+data['month_name']);
	repeats.find('option[value="annually_month_weekday"]').text('Annually on the '+ordinal_suffix_of(data['week_day_number'])+' '+data['week_day_name']+' in '+data['month_name']);

	event_repeat_text = 'x'

	if(is_event){
		id = parseInt(element.attr('event_id'));
		event = events[id];
		if(event['data']['every']){
			event_repeat_text = ordinal_suffix_of(event['data']['every']);
		}
	}

	repeats.find('option[value="every_x_day"]').text('Every ' + event_repeat_text + ' day');
	repeats.find('option[value="every_x_weekday"]').text('Every ' + event_repeat_text + ' '+data['week_day_name']);
	repeats.find('option[value="every_x_monthly_date"]').text('Every ' + event_repeat_text + ' month on the ' + ordinal_suffix_of(data['day']));
	repeats.find('option[value="every_x_monthly_weekday"]').text('Every ' + event_repeat_text + ' month on the ' + ordinal_suffix_of(data['week_day_number']) + ' ' + data['week_day_name']);
	repeats.find('option[value="every_x_annually_date"]').text('Every ' + event_repeat_text + ' year on the '+ordinal_suffix_of(data['day'])+' of '+data['month_name']);
	repeats.find('option[value="every_x_annually_weekday"]').text('Every ' + event_repeat_text + ' year on the '+ordinal_suffix_of(data['week_day_number'])+' '+data['week_day_name']+' in '+data['month_name']);

	if(data['moons']){

		$('#date_options').nextAll('optgroup').remove();

		text = '';

		for(var moon_id = 0; moon_id < calendar['moons'].length; moon_id++){

			event_moon_name = calendar['moons'][moon_id];

			event_moon_phase = data['moons'][moon_id]['moon_phase'];

			event_moon_phase_name = moon_phases[data['moons'][moon_id]['moon_phase']];

			event_moon_phase_number = data['moons'][moon_id]['moon_phase_number'];

			event_possessive = event_moon_name.slice(-1) === "s" ? "'" : "'s";

			text += '<optgroup label="'+event_moon_name+' events:">';
			text += '<option moon_id="'+moon_id+'" value="moon_every">Every ' + event_moon_name + event_possessive + ' ' + event_moon_phase_name + '</option>';
			text += '<option moon_id="'+moon_id+'" value="moon_monthly">Monthly on ' + event_moon_name + event_possessive + ' ' + ordinal_suffix_of(event_moon_phase_number) + ' ' + event_moon_phase_name +'</option>';
			text += '<option moon_id="'+moon_id+'" value="moon_anually">Anually on ' + event_moon_name + event_possessive + ' ' + ordinal_suffix_of(event_moon_phase_number) + ' ' + event_moon_phase_name +' in '+data['month_name'] + '</option>';
			text += '</optgroup>';
		}

		if(calendar['moons'].length > 1){

			text += '<optgroup value="multimoon" label="Multi-moon event:">';

			text += '<option value="multimoon_every">Every moon cycle where: (see below)</option>';
			text += '<option value="multimoon_anually">Anually in ' + data['month_name'] + ' when moon cycles match: (see below)</option>';

			text += '</optgroup>'
		}

		repeats.append(text);
		delete text;
	}

	length = $('#repeats > option').length;
	$('#repeats').prop('size', length);


	$('#multimoon').empty();

	text = '<ul>';

	for(moon_id = 0; moon_id < calendar['moons'].length; moon_id++){

		event_moon_name = calendar['moons'][moon_id];

		event_moon_phase = data['moons'][moon_id]['moon_phase'];

		event_moon_phase_name = moon_phases[data['moons'][moon_id]['moon_phase']];

		event_moon_phase_number = data['moons'][moon_id]['moon_phase_number'];

		event_possessive = event_moon_name.slice(-1) === "s" ? "'" : "'s";

		text += '<li>' + event_moon_phase_name + ' on ' + event_moon_name + '</li>';

	}

	text += '</ul>'

	$('#multimoon').append(text);

	$('#event_from_year').val(data['year']);
	$('#event_to_year').val(data['year']);

	$('#event_from_month').val(data['month']);
	$('#event_to_month').val(data['month']);

	rebuild_day_list();
	$('#event_from_day').val(data['day']);
	$('#event_to_day').val(data['day']);

	if(is_event)
	{

		$('#event-form').attr('event_id', id);
		$("#event_name").val(event['name']);
		$("#event_desc").val(event['description']);
		if(event['data']['moon_id']){
			$('#repeats [moon_id="'+event['data']['moon_id']+'"][value="'+event['repeats']+'"]').prop('selected', true);

		}else{
			$('#repeats').val(event['repeats']);
		}

		if(event['data']['every']){
			$('#event_repeat_x').css('display', 'block').val(event['data']['every']);
		}else{
			$('#event_repeat_x').css('display', 'none');
		}


		$('#event_hide_players').prop('checked', event['hide']);

		$('#event_from_checkbox').prop('disabled', event['repeats'] === 'once');

		value = $('#repeats :selected').val();
		if(value == 'multimoon_every' || value == 'multimoon_monthly' || value == 'multimoon_anually'){
			$('#multimoon').css('display', 'block');
		}else{
			$('#multimoon').css('display', 'none');
		}

		if(typeof event['from_date'] !== 'undefined')
		{
			$('#event_from_checkbox').prop('checked', true);

			$('#event_from_year').val(event['from_date']['year']).prop('disabled', false);
			$('#event_from_month').val(event['from_date']['month']).prop('disabled', false);
			rebuild_day_list();
			$('#event_from_day').val(event['from_date']['day']).prop('disabled', false);
			
			$('#event_to_checkbox').prop('disabled', false);

			if(typeof event['to_date'] !== 'undefined')
			{
				$('#event_to_checkbox').prop('checked', true);

				$('#event_to_year').val(event['to_date']['year']).prop('disabled', false);
				$('#event_to_month').val(event['to_date']['month']).prop('disabled', false);
				rebuild_day_list();
				$('#event_to_day').val(event['to_date']['day']).prop('disabled', false);
			}
		}

		$('#btn_event_delete').css('display', 'block');
		$('#btn_event_delete').prop('disabled', false);
	}else{
		$('#event-form').attr('event_id', calendar['events'].length);
		$('#btn_event_delete').css('display', 'none');
		$('#btn_event_delete').prop('disabled', true);
	}

	day_data = data;

	$("#event_background").fadeIn(150);

	$("#event_name").focus();
}

/*--------------------------------------------------------------------\
|   This contains the functions for advancing days, months, or year   |
\--------------------------------------------------------------------*/

function change_hour(int){
	if(hours_input.val() != ""){
		var hour = current_hour.val() != "" ? parseFloat(current_hour.val()) : 0;
		var hours = parseInt(hours_input.val());
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
		current_hour.val(hour);
		set_variables();
		eval_current_time();
		evaluate_highlighted_date();
	}
}

function change_minute(int){
	if(current_hour.val() != ""){
		var minute = current_minute.val() != "" ? parseFloat(current_minute.val()) : 0;
		var hour = current_hour.val();
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
		current_minute.val(minute);
		set_variables();
		eval_current_time();
		evaluate_highlighted_date();
	}
}


function change_hours(int){
	var hours = hours_input.val() != "" ? parseFloat(hours_input.val()) : 0;
	hours = hours + int;
	if(hours <= 0)
	{
		hours = 1;
	}
	if(hours < parseInt(current_hour.val()))
	{
		current_hour.val(hours-1);
	}
	hours_input.val(hours);
	set_variables();
	build_clock();
}

function change_year(year_int){
	update_date(0, year_int);
}

function update_date(day_int, year_int){

	if(year_int === undefined){
		year_int = 0;
	}

	if(day_int === undefined){
		day_int = 0;
	}

	current_year_val = current_year.val() != "" ? parseInt(current_year.val()) : 0;
	current_month_val = parseInt(current_month.find(":selected").val());
	current_day_val =  current_day.val() != "" ? parseInt(current_day.val()) : 1;

	new_year_val = current_year_val + year_int;
	new_month_val = current_month_val;
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

	current_year.val(new_year_val);
	current_month.val(new_month_val);
	set_display_calendar();
	if(monthchange){
		rebuild_day_list();
	}
	current_day.val(new_day_val);

	if(current_year_val != new_year_val || (monthchange && display_calendar['settings']['show_current_month'] && !showcase_view && external_view)){
		set_variables();
		build_calendar();
		$('html, body').animate({
			scrollTop: $(".current_day").parent().parent().offset().top-45
		}, 100);
	}else{
		set_variables();
		evaluate_highlighted_date();
	}
}

/*---------------------------------------------------\
|   This contains re-building of the generation UI   |
\---------------------------------------------------*/

function evaluate_year_length()
{

	var year_length = parseInt($('#year_len').val());
	var prev_year_length = parseInt($('#year_len').data('val'));
	var num_months = $('#month_list').children().length;

	var total = 0;
	$('#month_list').children().each(function(){
		var value = parseInt($(this).children().last().val());
		total += value ? value : 0;
	});

	$('#year_len').val(total);

}

// This function evaluates the current year length and the month's length
function year_length_change(){
	
	// Store the new year length
	new_year_len = parseInt($('#year_len').val());

	// Store the previous year length
	previous_year_len = parseInt($('#year_len').data('val'));

	//If the new year length is less than the amount of months
	if( new_year_len < $('#month_list').children().length )
	{
		// Set the year length to the amount of months, since each month must have at least 1 day
		$('#year_len').val(parseInt($('#month_list').children().length));
		return;
	}

	// If the new year length is shorter
	if(previous_year_len > new_year_len){
		
		// Store the difference between the two years
		var difference = previous_year_len - new_year_len;
		
		//Get the last month
		var index = $('#month_list').children().length-1;
		var month = $('#month_list').children().eq(index).children().last();
		var value = 0;
		
		// While the difference is still above 0
		while(difference > 0){
			// Sore the month's length
			value = parseInt(month.val());
			// If the difference is greater than the month's length
			if(difference >= value){
				// Subtract the month's length from the difference
				difference = difference - value + 1;
				// And set the month's length to its minimum (1)
				value = 1;
				// Set the month's length to the stored value
				month.val(value);
				// And go to the previous month
				index -= 1;
				month = $('#month_list').children().eq(index).children().last();
			}else{
				// Otherwise, the month's length is greater than the difference, and we can subtract it
				value = value - difference;
				// Set the month's length to the stored value
				month.val(value);
				difference = 0;
				// Exit the loop
				break;
			}
		}
	}
	// If the new year length is longer
	else if(previous_year_len < new_year_len){
		
		// Get the last month
		var month = $('#month_list').children().last().children().last();
		
		// Set the month's length to be the difference between the old and new year
		var difference = new_year_len - previous_year_len;
		month.val(parseInt(month.val()) + difference)
		
	}

	set_variables();

	build_calendar();
	
}

// This function rebuilds the month table under generation
function rebuild_month_table(target_num)
{
	// Store the current number of months
	var current_num = $('#month_list').children().length;

	text = '';
	
	// If the input is greater than the current number
	if(target_num > current_num)
	{
		
		var last_month = $('#month_list').children().last().children().last();
		if((parseInt(last_month.val())-(target_num-current_num)) > 0){
			last_month.val(parseInt(last_month.val())-(target_num-current_num));	
		}else{
			last_month.val(1);
		}
		
		// For each new month
		for(var i = current_num; i < target_num; i++)
		{	
			// Add a new month to the inputs
			text += "<div class='month' data='Month "+(i+1)+"'><input type='text' placeholder='Month name' class='month_name'/><input type='number' placeholder='# days' class='month_len' value='1'/></div>";
		}

		$('#month_list').append(text);
		
	}
	// Else, the number is lower than the current amount
	else if(target_num < current_num)
	{
		// For each month to remove
		for(var i = current_num; i > target_num; i--)
		{
			// Remove the last month input
			$('#month_list').children().last().remove();
		}
	}

	rebuild_month_list();

	// Evaluate the year new length
	evaluate_year_length();
}

function rebuild_month_list(id)
{
	$('.procedural_month_list').each(function(){

		prev_val = parseInt($(this).val()) ? parseInt($(this).val()) : 1;

		text = '';
		
		for(var i = 1; i <= $('#month_list').children().length; i++)
		{
			actual_name = $('#month_list').children().eq(i-1).children().first().val();
			name = actual_name != '' ? actual_name : "Month "+ i;
			text += "<option value='"+i+"'>"+name+"</option>";
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

	//event_filter_months();
}

function rebuild_day_list()
{

	$('.procedural_day_list').each(function(){

		prev_val = parseInt($(this).val()) ? parseInt($(this).val()) : 1;

		parent_id = $(this).attr('parent');

		month = parseInt($('#'+parent_id).val());

		current_month_len = parseInt($('#month_list').children().eq(month-1).children().last().val());

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

// This function rebuilds the week table under generation
function rebuild_week_table(target_num)
{
	// Store the current number of week days
	var current_num = $('#week_day_list').children().length;
	
	text = '';

	// If the input is greater than the current number
	if(target_num > current_num)
	{
		// For each week day to add
		for(var i = current_num; i < target_num; i++)
		{
			// Add the new week day inputs
			text += "<div class='day' data='Weekday "+(i+1)+"'><input type='text' class='day_name' placeholder='Day name'/></div>";
		}
		$('#week_day_list').append(text);
	}
	// Else, the number is lower than the current amount
	else if(target_num < current_num)
	{
		// For each week to remove
		for(var i = current_num; i > target_num; i--)
		{
			// Remove the last week day input
			$('#week_day_list').children().last().remove();
		};
	}
	
	rebuild_first_day_table();
	rebuild_day_list();
}

function rebuild_first_day_table()
{
	$('#first_day').empty();
	text = '';
	for(var i = 0; i < $('#week_day_list').children().length; i++)
	{
		var actual_name = $('#week_day_list').children().eq(i).children().first().val();
		var name = actual_name != '' ? actual_name : "Weekday "+ (i+1);
		text += "<option value='"+i+"'>"+name+"</option>";
	}
	$('#first_day').append(text);
}

// This function rebuilds the moon table under generation
function rebuild_moon_table(target_num)
{
	// Store the current number of moons
	var current_num = $('#moon_list').children().length;
	
	text = '';

	// If the input is greater than the current number
	if(target_num > current_num)
	{
		// For each moon to add
		for(var i = current_num; i < target_num; i++)
		{
			// Add the new moon inputs
			text += "<div class='moon' data='Moon "+(i+1)+"'>";
				text += "<div class='moon_text'>";
					text += "<input type='text' class='moon_name' placeholder='Name' />";
					text += "<input type='text' class='moon_color' moon_id='"+i+"'/>";
				text += "</div>"
				text += "<div class='moon_inputs'>"
					text += "<input type='number' class='moon_cyc' placeholder='Cycle' data-toggle='tooltip' data-animation='false' data-placement='right' title='This determines how many days it takes for the moon to complete one full rotation. Multiples of 8 is recommended (8, 16, 32, etc) to ensure peaks are shown. It starts at new moon.'/>";
					text += "<input type='number' class='moon_shf' placeholder='Shift' data-toggle='tooltip' data-animation='false' data-placement='right' title='This shifts the moon in the calendar (If the new moon is on Monday (day 1), with a 3 in this field the new moon falls on a Wednesday instead)'/>";
				text += "</div>"
			text += "</div>"
		}

		$('#moon_list').append(text);
	}
	// Else, the number is lower than the current amount
	else if(target_num < current_num)
	{
		// For each moon to remove
		for(var i = current_num; i > target_num; i--)
		{
			// Remove the last moon inputs
			$('#moon_list').children().last().remove();
		};
	}

	$('.moon_color').spectrum({
		color: "#FFFFFF",
		preferredFormat: "hex",
		showInput: true
	});

	$(function () {
		$('[data-toggle="tooltip"]').tooltip()
	})
}


function update_custom_climate(){

	climate_type = weather_climate.find(":selected").parent().attr('value');
	climate_selected_name = weather_climate.find(":selected").val();

	if(climate_type === 'custom'){

		if($('input[name=weather_temp_sys]:checked').val() === 'imperial'){
			summer_cold = parseInt($('#weather_summer_temp_cold').val());
			summer_hot = parseInt($('#weather_summer_temp_hot').val());
			winter_cold = parseInt($('#weather_winter_temp_cold').val());
			winter_hot = parseInt($('#weather_winter_temp_hot').val());
		}else if($('input[name=weather_temp_sys]:checked').val() === 'metric'){
			summer_cold = celcius_to_fahrenheit(parseInt($('#weather_summer_temp_cold').val()));
			summer_hot = celcius_to_fahrenheit(parseInt($('#weather_summer_temp_hot').val()));
			winter_cold = celcius_to_fahrenheit(parseInt($('#weather_winter_temp_cold').val()));
			winter_hot = celcius_to_fahrenheit(parseInt($('#weather_winter_temp_hot').val()));
		}

		custom_climates[climate_selected_name] = {
			'summer': {
				'temperature':{
					'cold': summer_cold,
					'hot': summer_hot
				},
				'precipitation': parseInt($('#weather_summer_precip_slider').prev().val())/100
			},
			'winter': {
				'temperature':{
					'cold': winter_cold,
					'hot': winter_hot
				},
				'precipitation': parseInt($('#weather_winter_precip_slider').prev().val())/100
			}
		}
	}
}

function add_custom_climate(){

	custom_name = $('#weather_climate_name').val();

	if(!custom_climates[custom_name]){
		custom_climates[custom_name] = {};
	}else{
		remove_custom_climate(custom_name);
	}

	if($('input[name=weather_temp_sys]:checked').val() === 'imperial'){
		summer_cold = parseInt($('#weather_summer_temp_cold').val());
		summer_hot = parseInt($('#weather_summer_temp_hot').val());
		winter_cold = parseInt($('#weather_winter_temp_cold').val());
		winter_hot = parseInt($('#weather_winter_temp_hot').val());
	}else if($('input[name=weather_temp_sys]:checked').val() === 'metric'){
		summer_cold = celcius_to_fahrenheit(parseInt($('#weather_summer_temp_cold').val()));
		summer_hot = celcius_to_fahrenheit(parseInt($('#weather_summer_temp_hot').val()));
		winter_cold = celcius_to_fahrenheit(parseInt($('#weather_winter_temp_cold').val()));
		winter_hot = celcius_to_fahrenheit(parseInt($('#weather_winter_temp_hot').val()));
	}

	custom_climates[custom_name] = {
		'summer': {
			'temperature':{
				'cold': summer_cold,
				'hot': summer_hot
			},
			'precipitation': parseInt($('#weather_summer_precip_slider').prev().val())/100
		},
		'winter': {
			'temperature':{
				'cold': winter_cold,
				'hot': winter_hot
			},
			'precipitation': parseInt($('#weather_winter_precip_slider').prev().val())/100
		}
	}

	climate_element = $('#weather_climate');

	if(climate_element.children().length == 1){
		text = '<optgroup id="custom_weather_presets" value="custom" label="Custom weather presets">';
		text += '<option value="' + custom_name + '">' + custom_name + '</option>'
		text += '</optgroup>';
		climate_element.append(text);
	}else{
		custom_climate_element = $('#custom_weather_presets');
		custom_climate_element.append('<option value="' + custom_name + '">' + custom_name + '</option>')
	}

	climate_element.val(custom_name);

	$('#weather_climate_name').val('').change();

}

function remove_custom_climate(climate_name){

	if(custom_climates[climate_name]){
		delete custom_climates[climate_name];
	}

	$('option[value="'+climate_name+'"]').remove();

	if($('#custom_weather_presets').children().length == 0){
		$('#custom_weather_presets').remove();
	}

}

function update_weather_inputs(){

	climate_type = weather_climate.find(":selected").parent().attr('value');
	climate_name = weather_climate.val();

	if(climate_type !== 'custom'){
		values = climate_table[climate_name];
	}else{
		values = custom_climates[climate_name];
	}

	if($('input[name=weather_temp_sys]:checked').val() === 'imperial'){
		winter_cold = values['winter']['temperature']['cold'];
		winter_hot = values['winter']['temperature']['hot'];
		summer_cold = values['summer']['temperature']['cold'];
		summer_hot = values['summer']['temperature']['hot'];
	}else if($('input[name=weather_temp_sys]:checked').val() === 'metric'){
		winter_cold = fahrenheit_to_celcius(values['winter']['temperature']['cold']);
		winter_hot = fahrenheit_to_celcius(values['winter']['temperature']['hot']);
		summer_cold = fahrenheit_to_celcius(values['summer']['temperature']['cold']);
		summer_hot = fahrenheit_to_celcius(values['summer']['temperature']['hot']);
	}

	weather_winter_temp_cold.val(winter_cold).prop('disabled', climate_type !== 'custom');
	weather_winter_temp_hot.val(winter_hot).prop('disabled', climate_type !== 'custom');
	weather_winter_precip_slider.slider('option', 'value', parseInt(values['winter']['precipitation']*100));
	weather_winter_precip_slider.slider(climate_type !== 'custom' ? 'disable' : 'enable');
	weather_winter_precip_slider.prev().val(parseInt(values['winter']['precipitation']*100));

	weather_summer_temp_cold.val(summer_cold).prop('disabled', climate_type !== 'custom');
	weather_summer_temp_hot.val(summer_hot).prop('disabled', climate_type !== 'custom');
	weather_summer_precip_slider.slider('option', 'value', parseInt(values['summer']['precipitation']*100));
	weather_summer_precip_slider.slider(climate_type !== 'custom' ? 'disable' : 'enable');
	weather_summer_precip_slider.prev().val(parseInt(values['summer']['precipitation']*100));

	weather_climate_delete.prop('disabled', climate_type !== 'custom');

}

function clear_data()
{
	calendar = {};
	$('#presets').val('Presets');
	$('#current_year').val('');
	$('#current_day').empty();
	$('#current_month').empty();
	$('#year_len').val('');
	$('#month_list').empty();
	$('#n_months').val('');
	$('#first_day').empty();
	$('#week_day_list').empty();
	$('#week_len').val('');
	$('#moon_list').empty();
	$('#n_moons').val('');
	$('#json_input').val('');
	$('#calendar').empty();


	$('#clock_enabled').prop('checked', false);
	$('#solstice_enabled').prop('checked', false);
	$('#hours_input').val('');
	$('#current_hour_input').val('');
	$('#current_minute_input').val('');
	$('#summer_solstice_month').empty();
	$('#summer_solstice_day').val('');
	$('#summer_set').val('');
	$('#summer_rise').val('');
	$('#winter_solstice_month').empty();
	$('#winter_solstice_day').val('');
	$('#winter_set').val('');
	$('#winter_rise').val('');
	$('#calendar_name').val('');

	$('#overflow_months').prop("checked", false);

	var error_check = [
		$('#hours_input'),
		$('#current_time_input'),
		$('#summer_solstice_day'),
		$('#summer_set'),
		$('#summer_rise'),
		$('#winter_solstice_day'),
		$('#winter_set'),
		$('#winter_rise'),
		$('#calendar_name'),
		$('#year_len'),
		$('#n_months'),
		$('#week_len')
	];

	$.each(error_check, function(key, value){

		value.removeClass('error');
		
	});

	unset_session();
}

function unset_session()
{

	$.ajax({
		url:window.baseurl+"ajax/ajax_calendar",
		type: "post",
		data: {action: 'session_unset'},
		error: function (log)
		{
			console.log(log);
		}
	});
}

function set_session()
{

	data = JSON.stringify(calendar);

	$.ajax({
		url:window.baseurl+"ajax/ajax_calendar",
		type: "post",
		data: {action: 'session_set', calendar: data},
		error: function (log)
		{
			console.log(log);
		}
	});
}

/*-------------------------------------------------\
|   These are all of the presets for the calendar  |
\-------------------------------------------------*/


function set_variables(){

	calendar = {};

	/* ------------------------------------------- */
	settings = {};


	$('.setting').each(function(){

		id = $(this).attr('id');

		settings[id] = $(this).is(':checked');

	});

	calendar['settings'] 			= settings;

	/* ------------------ Name ------------------- */
	calendar['name']	= $('#calendar_name').val();
	/* ------------------------------------------- */

	/* ------------------ Year ------------------- */
	calendar['year_len']	= parseInt(year_len.val());
	calendar['year_leap']	= parseInt(year_leap.val()) ? parseInt(year_leap.val()) : 0;
	calendar['month_leap']	= parseInt(month_leap.find(":selected").val());
	/* ------------------------------------------- */

	calendar['first_day']	= parseInt(first_day_list.find(":selected").val());
	calendar['year']		= parseInt(current_year.val()) ? parseInt(current_year.val()) : 0;
	calendar['era']			= $('#current_era').val();
	calendar['month']		= parseInt(current_month.find(":selected").val());
	calendar['day']			= parseInt(current_day.val());
	calendar['overflow']	= overflow_months.is(':checked');

	/* ----------------- Months ------------------ */
	calendar['n_months'] = parseInt(n_months.val());
	calendar['months'] = [];
	calendar['month_len'] = [];
	for(month = 1; month <= month_list.children().length; month++){
		month_input = month_list.children().eq(month-1).children().first().val();
		name = month_input != "" ? month_input : 'Month ' + month;
		len = parseInt(month_list.children().eq(month-1).children().last().val()) ? parseInt(month_list.children().eq(month-1).children().last().val()) : 0;
		calendar['months'].splice(month-1, 1, name);
		calendar['month_len'].splice(month-1, 1, len);
	}
	/* ------------------------------------------- */
	
	/* ---------------- Week days ---------------- */
	calendar['week_len'] = parseInt($('#week_len').val()) ? parseInt($('#week_len').val()) : 0;
	calendar['weekdays'] = [];
	for(weekday = 1; weekday <= week_day_list.children().length; weekday++){
		day_input = week_day_list.children().eq(weekday-1).children().first().val()
		name = day_input != "" ? day_input : 'Weekday ' + weekday;
		calendar['weekdays'].splice(weekday-1, 1, name);
	}
	/* ------------------------------------------- */

	
	
	/* ------------------ Moons ------------------ */
	calendar['n_moons']	= parseInt(n_moons.val());
	calendar['moons'] = [];
	calendar['lunar_color'] = [];
	calendar['lunar_cyc'] = [];
	calendar['lunar_shf'] = [];
	for(moon = 0; moon <= moon_list.children().length-1; moon++){
		moon_input = moon_list.children().eq(moon).children().first().children().first().val();
		name = moon_input != "" ? moon_input : 'Moon ' + moon + 1;
		color = moon_list.children().eq(moon).children().first().children().first().next().spectrum("get").toString();
		cyc = parseFloat(moon_list.children().eq(moon).children().last().children().first().val()) ? parseFloat(moon_list.children().eq(moon).children().last().children().first().val()) : 1;
		shf = parseFloat(moon_list.children().eq(moon).children().last().children().last().val()) ? parseFloat(moon_list.children().eq(moon).children().last().children().last().val()) : 1;
		calendar['moons'].splice(moon, 1, name);
		calendar['lunar_color'].splice(moon, 1, color);
		calendar['lunar_cyc'].splice(moon, 1, cyc);
		calendar['lunar_shf'].splice(moon, 1, shf);
	}
	/* ------------------------------------------- */

	reorder_events();

	calendar['events'] 		= events.slice();

	/* ------------------ Time ------------------- */

	calendar['clock_enabled'] = $('#clock_enabled').is(':checked');

	if(calendar['clock_enabled']){
		calendar['hour'] = parseInt(current_hour.val()) ? parseInt(current_hour.val()) : 0;
		calendar['minute'] = parseInt(current_minute.val()) ? parseInt(current_minute.val()) : 0;
		calendar['n_hours'] = parseInt(hours_input.val());
	}

	calendar['solstice_enabled'] = $('#solstice_enabled').is(':checked');

	if(calendar['solstice_enabled']){
		calendar["summer_month"] = parseInt($('#summer_solstice_month').find(":selected").val());
		calendar["summer_day"] = parseInt($('#summer_solstice_day').val());
		calendar["summer_rise"] = parseInt($('#summer_rise').val());
		calendar["summer_set"] = parseInt($('#summer_set').val());

		calendar["winter_month"] = parseInt($('#winter_solstice_month').find(":selected").val());
		calendar["winter_day"] = parseInt($('#winter_solstice_day').val());
		calendar["winter_rise"] = parseInt($('#winter_rise').val());
		calendar["winter_set"] = parseInt($('#winter_set').val());
	}

	calendar['weather_enabled'] = $('#weather_enabled').is(':checked');

	if(calendar['weather_enabled']){

		calendar['weather'] = {};

		calendar['weather']['current_climate'] = $('#weather_climate').find(":selected").val();

		calendar['weather']['current_climate_type'] = $('#weather_climate').find(":selected").parent().attr('value');

		calendar['weather']['custom_climates'] = $.extend({}, custom_climates);

		calendar['weather']['weather_seed'] = parseInt($('#weather_seed').val());

		calendar['weather']['weather_temp_sys'] = $('input[name=weather_temp_sys]:checked').val();
		
		calendar['weather']['weather_wind_sys'] = $('input[name=weather_wind_sys]:checked').val();

		calendar['weather']['weather_cinematic'] = $('#weather_cinematic').is(':checked');

		temp_scale = parseInt($('#weather_temp_scale').slider("value"))/100;
		temp_scale = temp_scale === 0 ? 0.75 : temp_scale;
		calendar['weather']['weather_temp_scale'] = temp_scale;

		temp_amplitude = parseInt($('#weather_temp_amplitude').slider("value"))/100;
		temp_amplitude = temp_amplitude === 0 ? 0.75 : temp_amplitude;
		calendar['weather']['weather_temp_amplitude'] = temp_amplitude;
	}

	set_display_calendar();

	validate_calendar();

}

function set_display_calendar(){

	display_calendar = $.extend( true, {}, calendar );

	if(is_leap_year(display_calendar['year_leap'], display_calendar['year']))
	{
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

function is_leap_year(year_leap, year){
	return year_leap != 0 && year % year_leap === 0;
}

function fahrenheit_to_celcius(temp){
	return precisionRound((temp-32)*0.5556, 2);
}


function celcius_to_fahrenheit(temp){
	return precisionRound(temp*1.8+32, 2);
}

function validate_calendar(){

	var compare = true;

	if(typeof inc_calendar !== 'undefined')
	{
		compare = JSON.stringify(inc_calendar).localeCompare(JSON.stringify(calendar)) != 0;
	}

	var valid_clock = ((!calendar['clock_enabled']) || (calendar["n_hours"] > 0 && calendar["hour"] >= 0 && calendar["minute"] >= 0));
	var valid_solstice = ((!calendar['solstice_enabled']) || (calendar["summer_month"] >= 0 && calendar["summer_day"] > 0 && calendar["summer_rise"] > 0 && calendar["summer_set"] > 0 && calendar["winter_month"] >= 0 && calendar["winter_day"] > 0 && calendar["winter_rise"] > 0 && calendar["winter_set"] > 0));

	var error_check = [
		$('#hours_input'),
		$('#current_hour_input'),
		$('#current_minute_input'),
		$('#summer_solstice_day'),
		$('#summer_set'),
		$('#summer_rise'),
		$('#winter_solstice_day'),
		$('#winter_set'),
		$('#winter_rise'),
		$('#calendar_name'),
		$('#year_len'),
		$('#n_months'),
		$('#week_len')
	];

	$.each(error_check, function(key, value){

		if(value.val() == '')
		{
			value.addClass('error');
		}
		else
		{
			value.removeClass('error');
		}
	});

	weather_available = calendar['year_len'] != '' && calendar['n_months'] != '' && calendar['week_len'] != '' && (calendar['year'] != '' || calendar['year'] == 0) && valid_clock && valid_solstice;

	$('#weather_enabled').prop("disabled", !weather_available);

	if(weather_available){
		$('#weather_warning').text('If you do not have your seasons set up, the weather system assumes that your first month is winter, and the middle month is the summer.');
	}else{
		$('#weather_warning').text('In order to enable weather, you need a complete calendar. The weather generated here requires it.');
	}

	$('#btn_save').prop('disabled', !(calendar['name'] != '' && weather_available && compare));

	if(compare){
		window.onbeforeunload = function() {
			return true;
		};
	}else{
		window.onbeforeunload = null;
	}

}

function json_load(json)
{

	checked = 'overflow' in json ? json['overflow'] : true;
	
	$('#overflow_months').prop("checked", checked);

	name = json['name'] ? json['name'] : $('#calendar_name').val()

	$('#calendar_name').val(name);

	$('#current_year').val(json['year']);

	display_calendar['year'] = parseInt(json['year']);

	$('#current_era').val(json['era']);

	$('#n_months').val(json['n_months']);
	
	rebuild_month_table(json['n_months']);

	$('#month_list').children().each(function(i, ev){
		if(json['months']){
			$(this).children().first().val(json['months'][i]);
		}

		if(json['month_len'][i]){
			$(this).children().last().val(json['month_len'][i]);
		}else if(json['month_len'][json['months'][i]]){
			$(this).children().last().val(json['month_len'][json['months'][i]]);
		}else{
			if(i === 0){
				var fix = ((json['year_len'] + json['n_months']) % json['n_months']);
				var value = (Math.floor(json['year_len']/json['n_months']))+fix;
				$(this).children().last().val(value);
				json['month_len']['Month '+(i+1)] = value;
			}
			else{
				var value = Math.floor(json['year_len']/json['n_months']);
				$(this).children().last().val(value);
				json['month_len']['Month '+(i+1)] = value;
			}
		}
		
	});

	rebuild_month_list();

	total = 0;
	$.each(json['month_len'], function(i){

		total += json['month_len'][i];

	});

	$('#year_len').val(total);

	temp_year_leap = json['year_leap'] ? json['year_leap'] : 0;

	$('#year_leap').val(temp_year_leap);

	if(temp_year_leap === 0){
		$('#leap_month_container').css('display', "none");
	}else{
		$('#leap_month_container').css('display', "block");
	}

	temp_month_leap = json['month_leap'] ? json['month_leap']-1 : 0;

	$("#month_leap").get(0).selectedIndex = temp_month_leap;


	temp_current_month = json['month'] ? json['month']-1 : 0;

	$("#current_month").get(0).selectedIndex = temp_current_month;

	temp_day = json['day'] ? json['day']-1 : 0;

	rebuild_day_list();

	$("#current_day").get(0).selectedIndex = temp_day;

	evaluate_year_length();

	$('#week_len').val(json['week_len']);
	
	rebuild_week_table(json['week_len']);
	
	$('#week_day_list').children().each(function(i, ev){
		$(this).children().first().val(json['weekdays'][i]);
	});
	
	rebuild_first_day_table();

	$("#first_day").get(0).selectedIndex = json['first_day'];

	$('#n_moons').val(json['n_moons']);
	
	rebuild_moon_table(json['n_moons']);

	$('#moon_list').children().each(function(i, ev){
		if(json['moons']){
			$(this).children().first().children().first().val(json['moons'][i]);
			if(json['lunar_color']){
				$(this).children().first().children().first().next().spectrum("set", json['lunar_color'][i]);
			}
			if(json['lunar_cyc'][json['moons'][i]])
			{
				cyc = json['lunar_cyc'][json['moons'][i]];
				shf = json['lunar_shf'][json['moons'][i]];
			}
			else
			{
				cyc = json['lunar_cyc'][i];
				shf = json['lunar_shf'][i];
			}
			$(this).children().last().children().first().val(cyc);
			$(this).children().last().children().last().val(shf);
		}
	});

	clock_checked = 'clock_enabled' in json ? json['clock_enabled'] : false;
	$('#clock_enabled').prop("checked", clock_checked);

	hours_input.val(json['n_hours']);

	current_hour.val(json['hour']);

	minute = json['minute'];
	if(parseInt(minute) < 10)
	{
		minute = "0"+parseInt(minute);
	}
	current_minute.val(minute);

	solstice_checked = 'solstice_enabled' in json ? json['solstice_enabled'] : false;
	$('#solstice_enabled').prop("checked", solstice_checked);
	$('#clock_enabled').change();

	if(solstice_checked)
	{
		temp_summer_month = json['summer_month'] ? json['summer_month'] : 0;
		$('#summer_solstice_month').val(temp_summer_month);
		rebuild_day_list();
		$('#summer_solstice_day').val(json["summer_day"]);
		$('#summer_rise').val(json["summer_rise"]);
		$('#summer_set').val(json["summer_set"]);

		temp_winter_month = json['winter_month'] ? json['winter_month'] : 0;
		$('#winter_solstice_month').val(temp_winter_month);
		rebuild_day_list();
		$('#winter_solstice_day').val(json["winter_day"]);
		$('#winter_rise').val(json["winter_rise"]);
		$('#winter_set').val(json["winter_set"]);
	}else{
		$('.solstice_setting_container').css('display', 'none');
	}
	
	weather_checked = 'weather_enabled' in json ? json['weather_enabled'] : false;
	$('#weather_enabled').prop('checked', weather_checked);
	if(weather_checked){
		$('#weather_enabled').prop('disabled', false);
		$('#weather_seed').val(parseInt(json['weather']['weather_seed'])).prop('disabled', false);

		custom_climates = $.extend({}, json['weather']['custom_climates']);

		if(custom_climates && Object.keys(custom_climates).length > 0){

			text = '<optgroup id="custom_weather_presets" value="custom" label="Custom weather presets">';

			for(key in json['weather']['custom_climates']){
				text += '<option value="' + key + '">' + key + '</option>';
			}
			text += '</optgroup>';

			$('#weather_climate').append(text);

		}
		$('.weather_setting[name="weather_temp_sys"][value="'+json['weather']['weather_temp_sys']+'"]').prop('checked', true);
		$('.weather_setting[name="weather_wind_sys"][value="'+json['weather']['weather_wind_sys']+'"]').prop('checked', true);

		weather_cinematic_checked = 'weather_cinematic' in json['weather'] ? json['weather']['weather_cinematic'] : false;
		$('#weather_cinematic').prop('checked', weather_cinematic_checked).prop('disabled', false);


		$('#weather_climate').val(json['weather']['current_climate']).prop('disabled', false);

		update_weather_inputs();

		if(json['weather']['current_climate_type'] === 'custom'){
			$('.weather_custom_temp').each(function(){
				$(this).prop('disabled', false);
			});
			$('#weather_summer_precip_slider').slider("enable");
			$('#weather_winter_precip_slider').slider("enable");
		}

		$('#btn_weather_random_seed').prop('disabled', false);

		$('.weather_setting').each(function(){
			$(this).prop('disabled', false);
		})

		weather_scale = json['weather']['weather_temp_scale'] ? json['weather']['weather_temp_scale'] : 0.25;
		$('#weather_temp_scale').slider("value", parseInt(weather_scale*100));
		$('#weather_temp_scale').prev().val(parseInt(weather_scale*100));
		$('#weather_temp_scale').slider("enable");

		weather_amplitude = json['weather']['weather_temp_amplitude'] ? json['weather']['weather_temp_amplitude'] : 0.75;
		$('#weather_temp_amplitude').slider("value", parseInt(weather_amplitude*100));
		$('#weather_temp_amplitude').prev().val(parseInt(weather_amplitude*100));
		$('#weather_temp_amplitude').slider("enable");

	}else{
		$('#weather_seed').val(parseInt(Math.random().toString().substr(2)));
	}

	local_events = typeof json['events'] !== 'undefined' ? json ['events'] : [];

	if(json['notes']){
		local_events = [];
		$.each(json['notes'], function(date, name){
			dates = date.split('-');
			local_event = {
				'id': 2,
				'name': name,
				'description': '',
				'repeats': 'once',
				'data': {
					'year': parseInt(dates[0]),
					'month': parseInt(dates[1]),
					'day': parseInt(dates[2])
				}
			};

			local_events.push(local_event);
		});
	}

	events = local_events.slice();

	local_settings = json['settings'] ? json['settings'] : {};

	if(json['settings'] && json['settings']['allow_view']){
		$('#only_backwards').prop("disabled", false);
	}

	$.each(local_settings, function(key, value){

		$('#'+key).prop("checked", value);

	})
	
	set_variables();

	build_clock();

	build_calendar();

	if($('#json_input').length)
	{
		$('#json_input').val('').change();
	}

}

function json_set(data)
{
	var json = JSON.stringify(data);
	$('#json_input').val(json).change();
}

function load_calendar(name)
{
	json_set(calendar_list[name]);
}

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1;
var yyyy = today.getFullYear();
var hour = today.getHours();
var minute = today.getMinutes();

var calendar_list = {
		'Earth': {
		"year_len":365,
		"year_leap": 4,
		"month_leap": 2,
		"n_months":12,
		"months":[
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December"
		],
		"month_len":[
			31,
			28,
			31,
			30,
			31,
			30,
			31,
			31,
			30,
			31,
			30,
			31
		],
		"week_len":7,
		"weekdays":[
			"Sunday",
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday"
		],
		"n_moons":1,
		"moons":[
			"Luna"
		],
		"lunar_cyc":{
			"Luna":29.53
		},
		"lunar_shf":{
			"Luna":7
		},
		"first_day":1,
		"overflow":true,
		'clock_enabled': true,
		'solstice_enabled': true,
		"summer_month": 6,
		"summer_day": 21,
		"summer_rise": 4,
		"summer_set": 22,
		"winter_month": 12,
		"winter_day": 21,
		"winter_rise": 9,
		"winter_set": 15,
		"n_hours": 24,
		"year":yyyy,
		'era': 'AD',
		"month": mm,
		"day": dd,
		"hour": hour,
		"minute": minute
	},

	"Tal'Dorei": {
		"year_len":328,
		"n_months":11,
		"months":[
			"Horisal",
			"Misuthar",
			"Dualahei",
			"Thunsheer",
			"Unndilar",
			"Brussendar",
			"Sydenstar",
			"Fessuran",
			"Quen'pillar",
			"Cuersaar",
			"Duscar"
		],
		"month_len":[
			29,
			30,
			30,
			31,
			28,
			31,
			32,
			29,
			27,
			29,
			32
		],
		"week_len":7,
		"weekdays":[
			"Miresen",
			"Grissen",
			"Whelsen",
			"Conthsen",
			"Folsen",
			"Yulisen",
			"Da'leysen"
		],
		"n_moons":1,
		"moons":[
			"Moon"
		],
		"lunar_cyc":{
			"Moon":29.53
		},
		"lunar_shf":{
			"Moon":7
		},
		"first_day":1,
		"overflow":true,
		'clock_enabled': true,
		'solstice_enabled': true,
		"summer_month": 6,
		"summer_day": 20,
		"summer_rise": 4,
		"summer_set": 22,
		"winter_month": 11,
		"winter_day": 2,
		"winter_rise": 9,
		"winter_set": 15,
		"n_hours": 24,
		"year":835,
		'era': 'PD',
		"month": 1,
		"day": 1,
		"hour": 0,
		"minute": 0,
		"events": [
			{
				"id": 0,
				"name": "New Dawn",
				"description": "The first day of the new year is also the holy day of the Changebringer, as the old year gives way to a new path.  Emon celebrates New Dawn with a grand midnight feast, which commonly features a short play celebrating the changes witnessed in the past year.",
				"repeats": "annually_date",
				"data": {
					"month": 1,
					"day": 1
				}
			},
			{
				"id": 1,
				"name": "Hillsgold",
				"description": "",
				"repeats": "annually_date",
				"data": {
					"month": 1,
					"day": 27
				}
			},
			{
				"id": 2,
				"name": "Day of Challenging",
				"description": "The holy day of the Stormlord is one of the most raucous holidays in Emon.  Thousands of spectators attend the annual Godsbrawl, which is held in the fighting ring within the Temple of the Stormlord.  The people root for their deity's favored champion, and there is a fierce (yet friendly) rivalry between the Champion of the Stormlord and the Champion of the Platinum Dragon.  The winner earns the title of 'Supreme Champion' for an entire year.",
				"repeats": "annually_date",
				"data": {
					"month": 2,
					"day": 7
				}
			},
			{
				"id": 3,
				"name": "Renewal Festival (Spring Equinox)",
				"description": "",
				"repeats": "annually_date",
				"data": {
					"month": 3,
					"day": 13
				}
			},
			{
				"id": 4,
				"name": "Wild's Grandeur",
				"description": "Though the Archeart is the god of spring, the peak of the spring season is the holy day of the Wildmother.  The people in the southern wilds of Tal'Dorei celebrate the Wildmother's strength by journeying to a place of great natural beauty.  This could be the top of a mountainous waterfall, the center of a desert, or even an old and peaceful city park (such as Azalea Street Park in Emon).  Though Emon rarely celebrates Wild's Grandeur, the few who do will plant trees in observance of the holiday.",
				"repeats": "annually_date",
				"data": {
					"month": 3,
					"day": 20
				}
			},
			{
				"id": 5,
				"name": "Harvest's Rise",
				"description": "",
				"repeats": "annually_date",
				"data": {
					"month": 4,
					"day": 11
				}
			},
			{
				"id": 6,
				"name": "Merryfrond's Day",
				"description": "",
				"repeats": "annually_date",
				"data": {
					"month": 4,
					"day": 31
				}
			},
			{
				"id": 7,
				"name": "Deep Solace",
				"description": "The holy day of the Allhammer is celebrated by especially devout followers in isolation.  They meditate on the meaning of family and how they may be better mothers, fathers, siblings, and children.  Dwarven communities, such as Kraghammer, celebrate with a full day of feasting and drinking.",
				"repeats": "annually_date",
				"data": {
					"month": 5,
					"day": 8
				}
			},
			{
				"id": 8,
				"name": "Zenith",
				"description": "",
				"repeats": "annually_date",
				"data": {
					"month": 5,
					"day": 26
				}
			},
			{
				"id": 9,
				"name": "Artisan's Faire",
				"description": "",
				"repeats": "annually_date",
				"data": {
					"month": 6,
					"day": 15
				}
			},
			{
				"id": 10,
				"name": "Elvendawn (Midsummer)",
				"description": "The holy day of the Archeart celebrates the first emergence of the Elves into Exandria from the Feywild.  In Syngorn, the Elves open small doorways into the Feywild and celebrate alongside the wild fey with uncharacteristic vigor.",
				"repeats": "annually_date",
				"data": {
					"month": 6,
					"day": 20
				}
			},
			{
				"id": 11,
				"name": "Highsummer",
				"description": "The holy day of the Dawnfather is the peak of the summer season.  Emon celebrates with an entire week of gift-giving and feasting, ending at midnight on the 21st of Sydenstar (the anniversary of the Battle of the Umbra Hills, where Zan Tal'Dorei dethroned Trist Drassig).  Whitestone (where the Dawnfather is the city's patron god) celebrates with gift-giving and a festival of lights around the Sun Tree.  Due to the Briarwood occupation, money is thin, so most Whitestone folk choose to recount the small things they are thankful for, rather than buy gifts.",
				"repeats": "annually_date",
				"data": {
					"month": 7,
					"day": 7
				}
			},
			{
				"id": 12,
				"name": "Morn of Largesse",
				"description": "",
				"repeats": "annually_date",
				"data": {
					"month": 7,
					"day": 14
				}
			},
			{
				"id": 13,
				"name": "Harvest's Close (Autumn Equinox)",
				"description": "",
				"repeats": "annually_date",
				"data": {
					"month": 8,
					"day": 3
				}
			},
			{
				"id": 14,
				"name": "The Hazel Festival",
				"description": "",
				"repeats": "annually_date",
				"data": {
					"month": 9,
					"day": 10
				}
			},
			{
				"id": 15,
				"name": "Civilization's Dawn",
				"description": "The holy day of the Lawbearer is the peak of the autumn season.  Emon celebrates with a great bonfire in the square of each neighborhood, around which each community dances and gives gifts.",
				"repeats": "annually_date",
				"data": {
					"month": 9,
					"day": 22
				}
			},
			{
				"id": 16,
				"name": "Night of Ascension",
				"description": "Though the actual date of her rise to divinity is unclear, the holy day of the Matron of Ravens is nonetheless celebrated as the day of her apotheosis.  Though most in Emon see this celebration of the dead as unnerving and macabre, the followers of the Matron of Ravens believe that the honored dead would prefer to be venerated with cheer, not misery.",
				"repeats": "annually_date",
				"data": {
					"month": 10,
					"day": 13
				}
			},
			{
				"id": 17,
				"name": "Zan's Cup",
				"description": "",
				"repeats": "annually_date",
				"data": {
					"month": 10,
					"day": 21
				}
			},
			{
				"id": 18,
				"name": "Barren Eve (Winter Solstice)",
				"description": "",
				"repeats": "annually_date",
				"data": {
					"month": 11,
					"day": 2
				}
			},
			{
				"id": 19,
				"name": "Embertide",
				"description": "The holy day of the Platinum Dragon is a day of remembrance.  Solemnity and respect are shown to those who have fallen in the defense of others.",
				"repeats": "annually_date",
				"data": {
					"month": 11,
					"day": 5
				}
			},
			{
				"id": 20,
				"name": "Winter's Crest",
				"description": "This day celebrates the freedom of Tal'Dorei from Errevon the Rimelord.  It is the peak of the winter season, so devout followers of the Matron of Ravens (as the goddess of winter) consider it to be one of her holy days.  However, in most of the land, people see Winter's Crest as a secular holiday, often celebrated with omnipresent music in public areas, lavish gift-giving to relatives and loved ones, and the cutting and decorating of trees placed indoors.  The Sun Tree in Whitestone is often decorated with lights and other baubles for Winter's Crest.  Winter's Crest is also when the barrier between planes is at its thinnest, as seen when Raishan was able to tear open the rift to the Elemental Plane of Fire and allow Thordak back into Exandria.",
				"repeats": "annually_date",
				"data": {
					"month": 11,
					"day": 20
				}
			}
		]
	},
	
	'Eberron': {
		"year_len":336,
		"n_months":12,
		"months":[
			"Zarantyr",
			"Olarune",
			"Therendor",
			"Eyre",
			"Dravago",
			"Nymm",
			"Lharvion",
			"Barrakas",
			"Rhaan",
			"Sypheros",
			"Aryth",
			"Vult"
		],
		"month_len":[
			28,
			28,
			28,
			28,
			28,
			28,
			28,
			28,
			28,
			28,
			28,
			28
		],
		"week_len":7,
		"weekdays":[
			"Sul",
			"Mol",
			"Zol",
			"Wir",
			"Zor",
			"Far",
			"Sar"
		],
		"n_moons":12,
		"moons":[
			"Zarantyr",
			"Olarune",
			"Therendor",
			"Eyre",
			"Dravago",
			"Nymm",
			"Lharvion",
			"Barrakas",
			"Rhaan",
			"Sypheros",
			"Aryth",
			"Vult"
		],
		"lunar_cyc":{
			"Zarantyr":28,
			"Olarune":35,
			"Therendor":42,
			"Eyre":49,
			"Dravago":56,
			"Nymm":63,
			"Lharvion":70,
			"Barrakas":77,
			"Rhaan":84,
			"Sypheros":91,
			"Aryth":98,
			"Vult":105
		},
		"lunar_shf":{
			"Zarantyr":0,
			"Olarune":1,
			"Therendor":1,
			"Eyre":2,
			"Dravago":2,
			"Nymm":2,
			"Lharvion":3,
			"Barrakas":3,
			"Rhaan":3,
			"Sypheros":3,
			"Aryth":4,
			"Vult":4
		},
		"year":998,
		"era": "YK",
		"first_day":1,
		"overflow":true,
		'clock_enabled': true,
		'solstice_enabled': true,
		"summer_month": 5,
		"summer_day": 14,
		"summer_rise": 6,
		"summer_set": 19,
		"winter_month": 9,
		"winter_day": 14,
		"winter_rise": 7,
		"winter_set": 17,
		"n_hours": 24,
		"hour": 0,
		"minute": 0
	},



	
	'Golarion': {
		"year_len":365,
		"n_months":12,
		"months":[
			"Abadius",
			"Calistril",
			"Pharast",
			"Gozran",
			"Desnus",
			"Sarenith",
			"Erastus",
			"Arodus",
			"Rova",
			"Lamashan",
			"Neth",
			"Kuthona"
		],
		"month_len":[
			31,
			28,
			31,
			30,
			31,
			30,
			31,
			31,
			30,
			31,
			30,
			31
		],
		"week_len":7,
		"weekdays":[
			"Moonday",
			"Toilday",
			"Wealday",
			"Oathday",
			"Fireday",
			"Starday",
			"Sunday"
		],
		"n_moons":1,
		"moons":[
			"Somal"
		],
		"lunar_cyc":{
			"Somal":29.53
		},
		"lunar_shf":{
			"Somal":0
		},
		"year":4707,
		"era": "AR",
		"first_day":1,
		"overflow":true,
		'clock_enabled': true,
		'solstice_enabled': true,
		"summer_month": 6,
		"summer_day": 20,
		"summer_rise": 5,
		"summer_set": 19,
		"winter_month": 12,
		"winter_day": 21,
		"winter_rise": 7,
		"winter_set": 17,
		"n_hours": 24,
		"hour": 0,
		"minute": 0
	},
	


	'Greyhawk': {
		"year_len":364,
		"n_months":16,
		"months":[
			"Needfest",
			"Fireseek",
			"Readying",
			"Coldeven",
			"Growfest",
			"Planting",
			"Flocktime",
			"Wealsun",
			"Richfest",
			"Reaping",
			"Goodmonth",
			"Harvester",
			"Brewfest",
			"Patchwall",
			"Ready'reat",
			"Sunsebb"
		],
		"month_len":[
			7,
			28,
			28,
			28,
			7,
			28,
			28,
			28,
			7,
			28,
			28,
			28,
			7,
			28,
			28,
			28
		],
		"week_len":7,
		"weekdays":[
			"Starday",
			"Sunday",
			"Moonday",
			"Godsday",
			"Waterday",
			"Earthday",
			"Freeday"
		],
		"n_moons":2,
		"moons":[
			"Luna",
			"Celene"
		],
		"lunar_cyc":{
			"Luna":28,
			"Celene":91
		},
		"lunar_shf":{
			"Luna":1,
			"Celene":43
		},
		"year":595,
		"era": "CY",
		"first_day":0,
		"overflow":false,
		'clock_enabled': true,
		'solstice_enabled': true,
		"summer_month": 9,
		"summer_day": 4,
		"summer_rise": 5,
		"summer_set": 19,
		"winter_month": 1,
		"winter_day": 4,
		"winter_rise": 7,
		"winter_set": 17,
		"n_hours": 24,
		"hour": 0,
		"minute": 0
	},
	
	'Forgotten Realms': {
		"year_len":365,
		"n_months":12,
		"year_leap": 4,
		"month_leap": 7,
		"months":[
			"Hammer (Deepwinter)",
			"Alturiak (The Claw of Winter)",
			"Ches (The Claw of the Sunsets)",
			"Tarsakh (The Claw of the Storms)",
			"Mirtul (The Melting)",
			"Kythorn (The Time of Flowers)",
			"Flamerule (Summertide)",
			"Eleasis (Highsun)",
			"Eleint (The Fading)",
			"Marpenot (Leaffall)",
			"Uktar (The Rotting)",
			"Nightal (The Drawing Down)"
		],
		"month_len":[
			31,
			30,
			30,
			31,
			30,
			30,
			31,
			30,
			31,
			30,
			31,
			30
		],
		"week_len":10,
		"weekdays":[
			"First-day",
			"Second-day",
			"Third-day",
			"Fourth-day",
			"Fifth-day",
			"Sixth-day",
			"Seventh-day",
			"Eighth-day",
			"Ninth-day",
			"Tenth-day"
		],
		"n_moons":1,
		"moons":[
			"Selûne"
		],
		"lunar_cyc":{
			"Selûne":30.45
		},
		"lunar_shf":{
			"Selûne":14
		},
		"events": [
			{
				"id": 0,
				"name": "Midwinter",
				"description": "",
				"repeats": "annually_date",
				"data": {
					"month": 1,
					"day": 31
				}
			},
			{
				"id": 1,
				"name": "Greengrass",
				"description": "",
				"repeats": "annually_date",
				"data": {
					"month": 4,
					"day": 31
				}
			},
			{
				"id": 2,
				"name": "Midsummer",
				"description": "",
				"repeats": "annually_date",
				"data": {
					"month": 7,
					"day": 31
				}
			},
			{
				"id": 3,
				"name": "Shieldsmeet",
				"description": "",
				"repeats": "annually_date",
				"data": {
					"month": 7,
					"day": 32
				}
			},
			{
				"id": 4,
				"name": "Highharvestide",
				"description": "",
				"repeats": "annually_date",
				"data": {
					"month": 9,
					"day": 31
				}
			},
			{
				"id": 5,
				"name": "The Feast of the Moon",
				"description": "",
				"repeats": "annually_date",
				"data": {
					"month": 11,
					"day": 31
				}
			}
		],
		"year":1491,
		'era': 'DR',
		"first_day":9,
		"overflow":false,
		'clock_enabled': true,
		'solstice_enabled': true,
		"summer_month": 5,
		"summer_day": 14,
		"summer_rise": 5,
		"summer_set": 19,
		"winter_month": 10,
		"winter_day": 14,
		"winter_rise": 7,
		"winter_set": 17,
		"n_hours": 24,
		"hour": 0,
		"minute": 0
	}
};