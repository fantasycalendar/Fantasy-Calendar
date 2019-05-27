function set_up_edit_inputs(){

	set_up_view_inputs();

	calendar_container = $('#calendar');
	weather_contrainer = $('#weather_container');

	removing = null;
	input_container = $('#input_container');
	timespan_sortable = $('#timespan_sortable');
	global_week_sortable = $('#global_week_sortable');
	leap_day_list = $('#leap_day_list');
	moon_list = $('#moon_list');
	season_sortable = $('#season_sortable');
	cycle_sortable = $('#cycle_sortable');
	era_list = $('#era_list');
	event_category_list = $('#event_category_list');
	events_list = $('#events_list');
	location_list = $('#location_list');

	var previous_view_type = 'owner';
	var first_switch = true;
	view_type = 'owner';

	$('input[name="view_type"]').change(function(){

		view_type = $(this).val();
		owner = true;

		switch(view_type){
			case "owner":
				if(previous_view_type !== 'owner'){
					error_check();
				}
				calendar_container.removeClass('hidden');
				weather_contrainer.addClass('hidden');
				previous_view_type = view_type;
				break;

			case "player":
				owner = 0;
				if(previous_view_type !== 'player'){
					error_check();
				}
				calendar_container.removeClass('hidden');
				weather_contrainer.addClass('hidden');
				previous_view_type = view_type;
				break;

			case "weather":
				if(first_switch){
					evaluate_weather_charts();
					first_switch = false;
				}
				calendar_container.addClass('hidden');
				weather_contrainer.removeClass('hidden');
				break;

		}

	});

	$(document).on('change, click', cycle_sortable, function(){
		update_cycle_example_text();
	});

	$('#cycle_test_input').click();

	global_week_sortable.sortable({
		placeholder: "highlight",
		handle: '.handle',
		opacity: 0.5,
		update: function(){
			input_container.change();
			reindex_weekday_sortable();
		},
		start: function(e, ui){
			ui.placeholder.height(ui.item.height());
		}
	});


	timespan_sortable.sortable({
		placeholder: "highlight",
		handle: '.handle',
		opacity: 0.5,
		update: function(){
			input_container.change();
			reindex_timespan_sortable();
		},
		start: function(e, ui){
			ui.placeholder.height(ui.item.height());
		}
	});

	season_sortable.sortable({
		placeholder: "highlight",
		handle: '.handle',
		opacity: 0.5,
		update: function(){
			input_container.change();
			reindex_season_sortable();
			error_check(season_sortable);
		},
		start: function(e, ui){
			ui.placeholder.height(ui.item.height());
		}
	});

	cycle_sortable.sortable({
		placeholder: "highlight",
		handle: '.handle',
		opacity: 0.5,
		update: function(){
			input_container.change();
			reindex_cycle_sortable();
		},
		start: function(e, ui){
			ui.placeholder.height(ui.item.height());
		}
	});


	for(var i = 0; i < calendar.year_data.global_week.length; i++){
		name = calendar.year_data.global_week[i];
		add_weekday_to_sortable(global_week_sortable, i, name);
	}
	global_week_sortable.sortable('refresh');

	if(calendar.year_data.timespans.length > 0){
	
		for(var i = 0; i < calendar.year_data.timespans.length; i++){
			name = calendar.year_data.timespans[i]['name'];
			type = calendar.year_data.timespans[i]['type'];
			add_timespan_to_sortable(timespan_sortable, i, name, calendar.year_data.timespans[i]);

		}
		timespan_sortable.sortable('refresh');

	}

	if(calendar.seasons){

		for(var i = 0; i < calendar.seasons.data.length; i++){
			add_season_to_sortable(season_sortable, i, calendar.seasons.data[i]);
		}
		evaluate_season_lengths();

		for(var i = 0; i < calendar.seasons.locations.length; i++){
			add_location_to_list(location_list, i, calendar.seasons.locations[i]);
		}

		$('.slider_percentage').slider({
			min: 0,
			max: 100,
			step: 1,
			change: function( event, ui ) {
				$(this).parent().parent().find('.slider_input').val($(this).slider('value')).change();
			},
			slide: function( event, ui ){
				$(this).parent().parent().find('.slider_input').val($(this).slider('value'));
			}
		});

		$('.slider_percentage').each(function(){
			$(this).slider('option', 'value', parseInt($(this).parent().parent().find('.slider_input').val()));
		});

	}

	if(calendar.cycles){
		for(var i = 0; i < calendar.cycles.data.length; i++){
			add_cycle_to_sortable(cycle_sortable, i, calendar.cycles.data[i]);
		}
	}

	if(calendar.year_data.leap_days){
		for(var i = 0; i < calendar.year_data.leap_days.length; i++){
			add_leap_day_to_list(leap_day_list, i, calendar.year_data.leap_days[i]);
		}
	}

	if(calendar.moons){
		for(var i = 0; i < calendar.moons.length; i++){
			add_moon_to_list(moon_list, i, calendar.moons[i]);
		}
		recreate_moon_colors();
	}

	if(calendar.eras){
		for(var i = 0; i < calendar.eras.length; i++){
			add_era_to_list(era_list, i, calendar.eras[i])
		}
	}

	if(calendar.event_data.categories){
		for(var i = 0; i < calendar.event_data.categories.length; i++){
			add_category_to_list(event_category_list, i, calendar.event_data.categories[i]);
		}
	}

	if(calendar.event_data.events){
		for(var i = 0; i < calendar.event_data.events.length; i++){
			add_event_to_list(events_list, i, calendar.event_data.events[i]);
		}
	}

	evaluate_remove_buttons();
	
	/* ------------------- Dynamic and static callbacks ------------------- */

	$('.static_input').each(function(){

		var data = $(this).attr('data');
		var key = $(this).attr('key');

		var current_calendar_data = get_calendar_data(data)

		if(current_calendar_data !== undefined){

			switch($(this).attr('type')){
				case "checkbox":
					$(this).prop("checked", current_calendar_data[key]);
					break;

				case "color":
					$(this).spectrum("set", current_calendar_data[key]);
					break;

				default:
					$(this).val(current_calendar_data[key]);
					break;
			}
		}

	});

	input_container.change(function(e){

		if(e.originalEvent){
			var target = $(e.originalEvent.target);	
		}else{
			var target = $(e.target);	
		}

		if(target.attr('class') !== undefined && target.attr('class').indexOf('dynamic_input') > -1){

			var type = target.attr('data').split('.');

			var current_calendar_data = calendar[type[0]];

			for(var i = 1; i < type.length-1; i++){
				current_calendar_data = current_calendar_data[type[i]];
			}

			var data = target.attr('key');

			if(target.attr('data').includes('week') || target.attr('data').includes('cycles')){

				current_calendar_data[type[type.length-1]] = [];

				target.closest(".collapsible-content").children().first().children().each(function(i){
					current_calendar_data[type[type.length-1]][i] = target.val();
				});

			}else{

				if(type.length > 1){
					current_calendar_data = current_calendar_data[type[type.length-1]];
				}

				if(!target.is(':disabled')){

					switch(target.attr('type')){
						case "number":
							var value = parseFloat(target.val());
							break;

						case "checkbox":
							var value = target.is(":checked");
							break;

						case "color":
							var value = target.spectrum("get").toString();
							break;

						default:
							var value = target.val();
							break;
					}

					if(target.attr('class').indexOf('slider_input') > -1){
						value = value/100;
					}
					
					current_calendar_data[data] = value;

				}else{
					
					delete current_calendar_data[data];
				}
			}

			var refresh = target.attr('refresh');
			refresh = refresh === "true" || refresh === undefined;

			if(type[0] === "seasons" && data == "name"){
				location_list.children().each(function(i){
					$(this).find('.location_season').each(function(j){
						$(this).prop('key', j);
						$(this).children().first().prop('id', `collapsible_seasons_${i}_${j}`);
						$(this).children().first().next().prop('for', `collapsible_seasons_${i}_${j}`).text(`Season name: ${calendar.seasons.data[j].name}`);
					});
				});
			}

			if(refresh || refresh === undefined){
				do_error_check(type[0]);
			}

		}else if(target.attr('class') !== undefined && target.attr('class').indexOf('static_input') > -1){

			var type = target.attr('data').split('.');

			var current_calendar_data = calendar;

			for(var i = 0; i < type.length; i++){
				current_calendar_data = current_calendar_data[type[i]];
			}

			var key = target.attr('key');
			var key2 = false;

			switch(target.attr('type')){
				case "number":
					var value = (target.val()|0);
					break;

				case "checkbox":
					var value = target.is(":checked");
					break;

				case "color":
					var value = target.spectrum("get").toString();
					break;

				default:
					value = target.val();
					break;
			}

			current_calendar_data[key] = value;

			var refresh = target.attr('refresh');
			refresh = refresh === "true" || refresh === undefined;

			if(refresh || refresh === undefined){
				do_error_check(type[0]);
			}
		}
	});

	var do_error_check = debounce(function(type){
		error_check(type);
		console.log("Done.")
	}, 150);

	recalc_stats();

	$(document).on('change', '.length-input, .interval, .offset', function(){
		recalc_stats();
	});

	$(document).on('change', '.disable_local_season_name', function(){
		var checked = $(this).prop('checked');
		var parent = $(this).closest('.wrap-collapsible');
		var key = parent.attr('key');
		var name_input = parent.find('input[key="name"]');
		if(checked){
			name_input.prop('disabled', false);
		}else{
			name_input.val(calendar.seasons.data[key].name).prop('disabled', true);
		}
	});

	$("input[data='clock']").change(function(){

		$('#current_hour').prop('min', 0)
		$('#current_hour').prop('max', ($("input[data='clock'][key='hours']").val()|0)-1);

		$('#current_minute').prop('min', 0)
		$('#current_minute').prop('max', ($("input[data='clock'][key='minutes']").val()|0)-1);

	});


	/* ------------------- Layout callbacks ------------------- */

	$('.form-inline.timespan .add').click(function(){
		var name = $(this).prev().prev();
		var type = $(this).prev();
		var id = $('#timespan_sortable .sortable-container').length;
		stats = {
			'name': name.val(),
			'type': type.val(),
			'length': 1,
			'interval': 1,
			'offset': 0
		};
		add_timespan_to_sortable(timespan_sortable, id, name.val(), stats);
		calendar.year_data.timespans.push(stats);
		timespan_sortable.sortable('refresh');
		reindex_timespan_sortable();
		name.val("");
	});

	$('.form-inline.leap .add').click(function(){
		var name = $(this).prev().prev();
		var type = $(this).prev();
		var id = $('#leap_day_list .sortable-container').length;
		stats = {
			'name': name.val(),
			'intercalary': type.val() == 'intercalary',
			'timespan': 0,
			'adds_week_day': false,
			'day': 0,
			'week_day': '',
			'interval': 1,
			'offset': 0,
			'reference': 'timespan'
		};
		add_leap_day_to_list(leap_day_list, id, stats);
		if(!calendar.year_data.leap_days){
			calendar.year_data.leap_days = [];
		}
		calendar.year_data.leap_days.push(stats);
		error_check();


		name.val("");
	});


	$(document).on('click', '.expand', function(){
		if($(this).parent().parent().hasClass('collapsed')){
			$(this).parent().parent().removeClass('collapsed').addClass('expanded');
			$(this).parent().parent().find('.detail-container').removeClass('hidden');
			$(this).removeClass('icon-collapse').addClass('icon-collapse-top');
		}else{
			$(this).parent().parent().removeClass('expanded').addClass('collapsed');
			$(this).parent().parent().find('.detail-container').addClass('hidden');
			$(this).removeClass('icon-collapse-top').addClass('icon-collapse');
		}
	});

	$('.form-inline.moon .add').click(function(){
		var name = $(this).prev();
		var cycle = $(this).next();
		var shift = $(this).next().next();
		var id = $('#moon_list .sortable-container').length;
		stats = {
			'name': name.val(),
			'cycle': cycle.val(),
			'shift': shift.val(),
			'color': '#ffffff',
			'hidden': false
		};
		if(calendar.moons === undefined){
			calendar.moons = [];
		}
		calendar.moons.push(stats);
		add_moon_to_list(moon_list, id, stats);
		name.val("");
		recreate_moon_colors();
	});

	$('.form-inline.seasons .add').click(function(){

		var name = $(this).prev();
		var id = season_sortable.children().length;
	
		stats = {
			"name": name.val(),
			"time": {
				"sunrise": {
					"hour": 9,
					"minute": 0
				},
				"sunset": {
					"hour": 18,
					"minute": 0
				}
			}
		};

		stats.transition_length = Math.floor((evaluated_calendar_data.year_data.last_epoch - evaluated_calendar_data.year_data.epoch)/2);
		stats.duration = 0;

		add_season_to_sortable(season_sortable, id, stats);
		season_sortable.sortable('refresh');
		reindex_season_sortable();
		name.val("");

	});

	$('.form-inline.locations .add').click(function(){

		var name = $(this).prev();
		var id = location_list.children().length;
	
		stats = {
			"name": name.val(),
			"seasons": [],
			"custom_dates": {},

			"settings": {
				"timezone": {
					"hour": 0,
					"minute": 0,
				},

				"large_noise_frequency": 0.015,
				"large_noise_amplitude": 5.0,

				"medium_noise_frequency": 0.3,
				"medium_noise_amplitude": 2.0,

				"small_noise_frequency": 0.8,
				"small_noise_amplitude": 3.0
			}
		};

		for(var i = 0; i < calendar.seasons.data.length; i++){

			stats.seasons[i] = {
				"custom_name": false,
				"time": calendar.seasons.data[i].time,
				"weather":{
					"temp_low": 0,
					"temp_high": 0,
					"precipitation": 0,
					"precipitation_intensity": 0
				}
			}
		}

		add_location_to_list(location_list, id, stats);
		reindex_location_list();
		repopulate_location_select_list();

		$('.slider_percentage').slider({
			min: 0,
			max: 100,
			step: 1,
			change: function( event, ui ) {
				$(this).parent().parent().find('.slider_input').val($(this).slider('value')).change();
			},
			slide: function( event, ui ){
				$(this).parent().parent().find('.slider_input').val($(this).slider('value'));
			}
		});

		$('.slider_percentage').each(function(){
			$(this).slider('option', 'value', parseInt($(this).parent().parent().find('.slider_input').val()));
		});

	});

	$('#copy_location_data').click(function(){

		var type = location_select.find('option:selected').parent().attr('value');
		var location = location_select.val();

		if(type === "custom"){
			var stats = calendar.seasons.locations[location];
		}else{
			var stats = climate_generator.presets[location];
			stats.settings = climate_generator.preset_curves;
			stats.custom_dates = {};

			for(var i = 0; i < calendar.seasons.data.length; i++){
				stats.seasons[i].time = calendar.seasons.data[i].time;
			}

		}

		var id = location_list.children().length;

		add_location_to_list(location_list, id, stats);
		reindex_location_list();
		repopulate_location_select_list();

		$('.slider_percentage').slider({
			min: 0,
			max: 100,
			step: 1,
			change: function( event, ui ) {
				$(this).parent().parent().find('.slider_input').val($(this).slider('value')).change();
			},
			slide: function( event, ui ){
				$(this).parent().parent().find('.slider_input').val($(this).slider('value'));
			}
		});

		$('.slider_percentage').each(function(){
			$(this).slider('option', 'value', parseInt($(this).parent().parent().find('.slider_input').val()));
		});

	});


	$('.form-inline.cycle .add').click(function(){

		id = cycle_sortable.children().length;
		stats = {
			'length': 1,
			'offset': 0,
			'names': ["Cycle name 1"]
		};
		if(calendar.cycles === undefined){
			calendar.cycles = {
				format: $('#cycle_format').val(),
				data: []
			};
		}
		calendar.cycles.data.push(stats);
		add_cycle_to_sortable(cycle_sortable, id, stats);
	});


	$('.form-inline.events .add').click(function(){

		id = events_list.children().length;
		stats = {
			'name': $(this).prev().val(),
			'data': {
				'conditions': []
			},
			'settings': {
				'color': 'Dark-Solid',
				'text': 'text'
			}
		};
		$(this).prev().val('');
		calendar.event_data.events.push(stats);
		add_event_to_list(events_list, id, stats);
		edit_event_ui.set_current_event(id);

	});

	$(document).on('click', '.btn_remove', function(){

		if(!$(this).hasClass('disabled')){

			var parent = $(this).parent().parent().parent();

			if($(this).parent().parent().hasClass('expanded')){
				$(this).parent().prev().find('.expand').click();
			}

			if(removing !== null){
				removing.click();
			}
			removing = $(this).next();
			$(this).parent().parent().find('.main-container').addClass('hidden');
			$(this).parent().parent().find('.detail-container').addClass('hidden');
			$(this).css('display', 'none');
			$(this).prev().css('display', 'block');
			$(this).next().css('display', 'block');
			$(this).next().next().css('display', 'block');

		}

	});

	$(document).on('click', '.btn_cancel', function(){
		$(this).parent().parent().find('.main-container').removeClass('hidden');
		$(this).parent().parent().find('.detail-container').removeClass('hidden');
		$(this).css('display', 'none');
		$(this).prev().prev().css('display', 'none');
		$(this).prev().css('display', 'block');
		$(this).next().css('display', 'none');
		removing = null;
	});

	$(document).on('click', '.btn_accept', function(){

		type = $(this).closest('.sortable-container').parent().attr('id');
		key = $(this).closest('.sortable-container').attr('key')|0;

		$(this).parent().parent().remove();
		$(this).parent().parent().parent().sortable('refresh');

		switch(type){
			case "timespan_sortable":
				reindex_timespan_sortable();
				recalc_stats();
				break;

			case "global_week_sortable":
				reindex_weekday_sortable();
				break;

			case "season_sortable":
				type = 'seasons';
				reindex_season_sortable(key);
				reindex_location_list();
				break;

			case "location_list":
				type = 'seasons';
				reindex_location_list();
				repopulate_location_select_list();
				break;

			case "cycle_sortable":
				reindex_cycle_sortable();
				break;

			case "moon_list":
				reindex_moon_list();
				break;

			case "era_list":
				reindex_era_list();
				break;

			case "event_category_list":

				console.log(key)

				for(var i = 0; i < calendar.event_data.events.length; i++){
					if(calendar.event_data.events[i].category == key){
						calendar.event_data.events[i].category = -1;
					}
				}

				for(var i = 0; i < calendar.eras.length; i++){
					if(calendar.eras[i].settings.event_category == key){
						calendar.eras[i].settings.event_category = -1;
					}
				}

				reindex_event_category_list();
				break;

			case "events_list":
				calendar.event_data.events.splice(key, 1);
				reindex_events_list();
				break;

			case "leap_day_list":
				calendar.year_data.leap_days.splice(key, 1)
				if(calendar.year_data.leap_days.length == 0){
					delete calendar.year_data.leap_days;
				}
				recalc_stats();
				break;

		}

		evaluate_remove_buttons();

		error_check(type);

		removing = null;
		input_container.change();

	});



	/* ------------------- Custom callbacks ------------------- */

	$(document).on('change', '.adds-week-day', function(){
		if($(this).is(':checked')){
			$(this).parent().parent().parent().next().removeClass('hidden');
			$(this).parent().parent().parent().next().next().removeClass('hidden');
			$(this).parent().parent().parent().parent().find('.timespan-day-list').prop('disabled', false).val(0).change();
			$(this).parent().parent().parent().parent().find('.internal-list-name').prop('disabled', false).val("Week day name").change();
		}else{
			$(this).parent().parent().parent().next().addClass('hidden');
			$(this).parent().parent().parent().next().next().addClass('hidden');
			$(this).parent().parent().parent().parent().find('.timespan-day-list').prop('disabled', true).change();
			$(this).parent().parent().parent().parent().find('.internal-list-name').prop('disabled', true).val("").change();
		}
	});


	$(document).on('change', '.unique-week-input', function(){
		var key = $(this).attr('key');
		if($(this).is(':checked')){
			element = [];
			element.push("<div class='week_list'>");
				for(index = 0; index < calendar.year_data.global_week.length; index++){
					element.push(`<input type='text' class='detail-row form-control internal-list-name dynamic_input' data='year_data.timespans.${key}.week' key='${index}' value='${calendar.year_data.global_week[index]}'/>`);
				}
			element.push("</div>");
			$(this).parent().parent().parent().parent().find(".detail-row.collapsible-content").append(element.join(""));
			$(this).parent().parent().next().find(".week-length").prop('disabled', false).val(calendar.year_data.global_week.length);
			$(this).parent().parent().parent().parent().find(".toggle").removeClass('hidden').prop('checked', true);
			$(this).parent().parent().parent().parent().find(".lbl-toggle").removeClass('hidden');

			$(this).parent().parent().parent().parent().find(".week_list").find(".internal-list-name").first().change();
		}else{
			$(this).parent().parent().next().find(".week-length").prop('disabled', true).val(0);
			$(this).parent().parent().parent().parent().find(".detail-row.collapsible-content").html("");
			$(this).parent().parent().parent().parent().find(".toggle").addClass('hidden');
			$(this).parent().parent().parent().parent().find(".lbl-toggle").addClass('hidden');
			delete calendar.year_data.timespans[key].week;
			error_check();


		}
	});

	$(document).on('change', '.show_as_event', function(){
		var key = $(this).parent().parent().parent().next().attr('key');
		if($(this).is(':checked')){
			$(this).parent().parent().parent().next().removeClass('hidden');
			$(this).parent().parent().parent().next().find('.dynamic_input').prop('disabled', false).change();
		}else{
			$(this).parent().parent().parent().next().addClass('hidden');
			$(this).parent().parent().parent().next().find('.dynamic_input').prop('disabled', true).change();
			delete calendar.eras[key].settings.event_category;
		}
	});

	$(document).on('change', '.week-length', function(){
		key = $(this).closest('.unique-week-input').attr('key');
		new_val = ($(this).val()|0);
		current_val = ($(this).parent().parent().parent().parent().find(".week_list").children().length|0);
		if(new_val > current_val){
			element = [];
			for(index = current_val; index < new_val; index++){
				element.push(`<input type='text' class='detail-row form-control internal-list-name dynamic_input' data='year_data.timespans.${key}.week' key='${index}' value='Week day ${(index+1)}'/>`);
			}
			$(this).parent().parent().parent().parent().find(".week_list").append(element.join(""));
			$(this).parent().parent().parent().parent().find(".week_list").find(".internal-list-name").first().change();
		}else if(new_val < current_val){
			$(this).parent().parent().parent().parent().find(".week_list").children().slice(new_val).remove();
			$(this).parent().parent().parent().parent().find(".week_list").find(".internal-list-name").first().change();
		}

		if(new_val == 0){
			$(this).parent().parent().parent().parent().find(".toggle").addClass('hidden');
			$(this).parent().parent().parent().parent().find(".lbl-toggle").addClass('hidden');
			delete calendar.year_data.timespans[key].week;
			error_check();



		}else{
			$(this).parent().parent().parent().parent().find(".toggle").removeClass('hidden');
			$(this).parent().parent().parent().parent().find(".lbl-toggle").removeClass('hidden');
		}

	});

	$(document).on('change', '.cycle-name-length', function(){
		key = $(this).attr('key');
		new_val = ($(this).val()|0);
		current_val = ($(this).parent().parent().parent().parent().find(".cycle_list").children().length|0);
		if(new_val > current_val){
			element = [];
			for(index = current_val; index < new_val; index++){
				element.push(`<input type='text' class='form-control internal-list-name dynamic_input' data='cycles.data.${key}.names' key='${index}' value='Cycle name ${(index+1)}'/>`);
			}
			$(this).parent().parent().parent().parent().find(".cycle_list").append(element.join(""));
			$(this).parent().parent().parent().parent().find(".cycle_list").find(".internal-list-name").first().change();
		}else if(new_val < current_val){
			$(this).parent().parent().parent().parent().find(".cycle_list").children().slice(new_val).remove();
			$(this).parent().parent().parent().parent().find(".cycle_list").find(".internal-list-name").first().change();
		}

	});


	$(document).on('change', '.timespan_occurance_input', function(){

		interval = $(this).parent().parent().parent().find('.interval');
		offset = $(this).parent().parent().parent().find('.offset');

		if(interval === undefined || offset === undefined) return;

		offset.prop('disabled', interval.val() == 1);
		offset.val(interval.val() == 1 ? 0 : offset.val());

		text = "This timespan will appear every";

		if(interval.val() > 1){
			text += " " + ordinal_suffix_of(interval.val())
		}

		text +=  " year";

		if(interval.val() > 1){
			start_year = (offset.val()%interval.val());
			if(start_year === 0){
				start_year = interval.val();
			}
			text += ", starting year " + start_year + ".";
		}else{
			text +=  ".";
		}

		$(this).parent().parent().parent().parent().find('.timespan_variance_output').text(text);

		repopulate_month_lists();

	});


	$(document).on('change', '.leap_day_occurance_input', function(){

		var interval = $(this).parent().parent().parent().parent().parent().find('.interval');
		var interval_val = (interval.val()|0)
		var offset = $(this).parent().parent().parent().parent().parent().find('.offset');
		var offset_val = (offset.val()|0)
		var reference = $(this).parent().parent().parent().parent().parent().find('.reference');
		var reference_val = reference.val();
		var timespan = $(this).parent().parent().parent().parent().parent().find('.timespan-list');
		var timespan_val = timespan.val();

		if(offset_val === undefined || interval_val === undefined) return;

		offset.prop('disabled', interval.val() == 1);
		offset.val(interval.val() == 1 ? 0 : offset.val());

		text = "This leap day will appear every ";

		if(reference_val == "year"){

			occurance = lcm(calendar.year_data.timespans[timespan_val].interval, interval_val)

			if(offset_val == 0 && calendar.year_data.timespans[timespan_val].offset == 0){

				year = occurance;

			}else{

				for(var year = 1; year <= occurance; year++){
					if((year - offset_val) % interval_val == 0 && (year - calendar.year_data.timespans[timespan_val].offset) % calendar.year_data.timespans[timespan_val].interval == 0){
						break;
					}
				}

			}
			if(occurance == 1){
				text += "year."
			}else{
				text += ordinal_suffix_of(occurance) + " year (starting year " + year + ").";
			}

		}else{

			if(interval_val == 1){

				text += "year."

			}else{

				text += ordinal_suffix_of(interval_val) + " ";
				text += `${calendar.year_data.timespans[timespan_val].name} every ${ordinal_suffix_of(calendar.year_data.timespans[timespan_val].interval*interval_val)} year`;

				total_offset = Math.abs((interval_val*offset_val)%(calendar.year_data.timespans[timespan_val].interval*interval_val));
				if(total_offset != 0){
					text += " starting year " + total_offset;
				}

				text += ")."

			}

		}	

		$(this).parent().parent().parent().parent().parent().find('.leap_day_variance_output').text(text);

	});


	$(document).on('change', '.year-input', function(){

		var child = $(this).parent().parent().parent().find('.timespan-list');

		var selected = (child.val()|0);

		var year = ($(this).val()|0);

		child.html("");

		var element = [];
		for(var i = 0; i < calendar.year_data.timespans.length; i++)
		{
			is_there = does_timespan_appear(year, i);
			element.push(`<option value="${i}" ${(selected == i && is_there.result ? "selected" : "")} ${(!is_there.result ? "disabled" : "")}>`);
			element.push(calendar.year_data.timespans[i].name+(!is_there.result ? ` (${is_there.reason})` : ""));
			element.push('</option>');
		}

		child.html(element.join('')).change();

	});


	$(document).on('change', '.timespan-list', function(){

		var child = $(this).closest('.sortable-container').find('.timespan-day-list');

		var selected_year = $(this).closest('.sortable-container').find('.year-input').val()|0;
		selected_year = convert_year(selected_year);
		var selected_timespan = $(this).val()|0;
		var selected_day = child.val()|0;

		var days = get_days_in_timespan(selected_year, selected_timespan, false);
		var html = [];
		
		if(child.hasClass('inclusive')){
			html.push(`<option value="${0}">Before 1</option>`);
		}

		for(var i = 0; i < days.length; i++){
			var day = days[i];
			html.push(`<option value='${i+1}' ${day.leaping ? 'disabled' : ''}>`);
			html.push(day.text + (day.leaping ? ` (leaping)` : ''));
			html.push('</option>');
		}
		child.html(html.join('')).val(selected_day);
		if(child.find('option:selected').prop('disabled') || child.val() == null){
			for(var i = selected_day-1; i >= 0; i--){
				if(child.children().eq(i).length && !child.children().eq(i).prop('disabled')){
					break;
				}
			}
			child.val(i+1);
		}
		child.data('val', selected_day);

	});

	$(document).on('change', '.timespan_length', function(){
		repopulate_day_lists();
	});

	$('#reorder_eras').click(function(){
		$(this).addClass('hidden');
		era_list.children().each(function(i){
			var curr = $(this);
			var curr_year = (curr.find('.year-input').val()|0);
			var curr_timespan = (curr.find('.timespan-list').val()|0);
			var curr_day = (curr.find('.timespan-day-list').val()|0);

			era_list.children().each(function(j){

				var comp = $(this);
				var comp_year = (comp.find('.year-input').val()|0);
				var comp_timespan = (comp.find('.timespan-list').val()|0);
				var comp_day = (comp.find('.timespan-day-list').val()|0);

				if(curr_year > comp_year){
					comp.insertBefore(curr);
				}else if(curr_year == comp_year){
					if(curr_timespan > comp_timespan){
						comp.insertBefore(curr);
					}else if(curr_timespan == comp_timespan){
						if(curr_day >= comp_day){
							comp.insertBefore(curr);
						}
					}
				}
			});
		});
	});


	$('#reseed_seasons').click(function(){
		$('#seasons_seed').val((Math.random().toString().substr(7)|0)).change();
	});

	$(document).on('change', '.invalid', function(){
		if($(this).val() !== null){
			$(this).removeClass('invalid');
		}
	});

	$(document).on('change', '.season-duration', function(){
		evaluate_season_lengths();
		rebuild_climate();
	});

	$(document).on('change', '.location-name', function(){
		repopulate_location_select_list();
	});

}

function add_weekday_to_sortable(parent, key, name){

	element = [];

	element.push("<div class='sortable-container week_day'>");
		element.push("<div class='main-container'>");
			element.push("<div class='handle icon-reorder'></div>");
			element.push("<div class='name-container'>");
				element.push(`<input type='text' value='${name}' class='form-control name-input small-input dynamic_input' data='year_data.global_week' key='${key}' tabindex='${(key+1)}'/>`);
			element.push("</div>");
		element.push("</div>");
		element.push("<div class='remove-container'>");
			element.push("<div class='remove-container-text'>Are you sure you want to remove this?</div>");
			element.push("<div class='btn_remove btn btn-danger icon-trash'></div>");
			element.push("<div class='btn_cancel btn btn-danger icon-remove'></div>");
			element.push("<div class='btn_accept btn btn-success icon-ok'></div>");
		element.push("</div>");

	element.push("</div>");

	parent.append(element.join(""));
}

function add_timespan_to_sortable(parent, key, name, data){
	element = [];
	element.push(`<div class='sortable-container ${data.type} collapsed' type='${data.type}' key='${key}'>`);
		element.push("<div class='main-container'>");
			element.push("<div class='handle icon-reorder'></div>");
			element.push("<div class='expand icon-collapse'></div>");
			element.push("<div class='name-container'>");
				element.push(`<input type='text' value='${name}' tabindex='${(100+key)}'class='name-input small-input form-control dynamic_input' data='year_data.timespans.${key}' key='name'/>`);
			element.push("</div>");
			element.push(`<div class='length_input'><input type='number' class='length-input form-control dynamic_input timespan_length' data='year_data.timespans.${key}' key='length' tabindex='${(100+key)}' value='${data.length}'/></div>`);
		element.push("</div>");
		element.push("<div class='remove-container'>");
			element.push("<div class='remove-container-text'>Are you sure you want to remove this?</div>");
			element.push("<div class='btn_remove btn btn-danger icon-trash'></div>");
			element.push("<div class='btn_cancel btn btn-danger icon-remove'></div>");
			element.push("<div class='btn_accept btn btn-success icon-ok'></div>");
		element.push("</div>");
				
		element.push("<div class='detail-container hidden'>");

			element.push("<div class='detail-row'>");

				element.push("<div class='detail-column full center-text bold-text big-text italics-text'>");
						
					element.push(type == "month" ? "Month" : "Intercalary month");

				element.push("</div>");

				element.push("<div class='detail-column full'>");

					element.push("<div class='detail-row'>");
							element.push("<div class='detail-text center-text bold-text'>Leaping settings</div>");
					element.push("</div>");

					element.push("<div class='detail-row'>");
						element.push("<div class='detail-column half'>");
							element.push("<div class='detail-row'>");
									element.push("<div class='detail-text'>Interval:</div>");
									element.push(`<input type='number' min='1' class='form-control timespan_occurance_input interval dynamic_input small-input' min='1' data='year_data.timespans.${key}' key='interval' min='1' value='${data.interval}' />`);
							element.push("</div>");	
						element.push("</div>");

						element.push("<div class='detail-column half'>");
							element.push("<div class='detail-row'>");
								element.push("<div class='detail-text'>Offset:</div>");
								element.push(`<input type='number' class='form-control timespan_occurance_input offset dynamic_input small-input' min='0' data='year_data.timespans.${key}' key='offset' value='${data.offset}'`);
								element.push(data.interval === 1 ? " disabled" : "");
								element.push("/>");
							element.push("</div>");
						element.push("</div>");
					element.push("</div>");

					element.push("<div class='detail-row'>");
						element.push("<div class='detail-text center-text italics-text timespan_variance_output'>This timespan will appear every year.</div>");
					element.push("</div>");

					if(data.type == 'month'){

					element.push("<div class='detail-row'>");
						element.push("<div class='separator'></div>");
					element.push("</div>");

					element.push("<div class='detail-row'>");
						element.push("<div class='detail-text center-text bold-text'>Week settings</div>");
					element.push("</div>");

					element.push("<div class='detail-row'>");
						element.push("<div class='detail-column half'>");
							element.push("<div class='detail-row'>");
								element.push("<div class='detail-text'>Use custom week:</div>");
								element.push(`<input type='checkbox' class='unique-week-input' key='${key}'`);
								element.push(data.week ? "checked" : "");
								element.push("/>");
							element.push("</div>");
						element.push("</div>");
						element.push("<div class='detail-column half'>");
							element.push("<div class='detail-row'>");
								element.push("<div class='detail-text'>Length:</div>");
								element.push(`<input type='number' class='form-control week-length small-input' ${(!data.week ? "disabled" : "")} value='${(data.week ? data.week.length : 0)}'/>`);
							element.push("</div>");
						element.push("</div>");
					element.push("</div>");
					element.push("<div class='detail-row custom-week-container wrap-collapsible'>");
						element.push(`<input id='collapsible_week_${key}' class='toggle${(data.week ? "" : " hidden")}' type='checkbox' checked>`);
						element.push(`<label for='collapsible_week_${key}' class='lbl-toggle${(data.week ? "" : " hidden")}'>Week</label>`);
						element.push("<div class='detail-row collapsible-content'>");
						if(data.week){
							element.push("<div class='week_list'>");
								for(index = 0; index < data.week.length; index++){
									element.push(`<input type='text' class='form-control internal-list-name dynamic_input' data='year_data.timespans.${key}.week' key='${index}' value='${data.week[index]}'/>`);
								}
						}
						element.push("</div>");
					element.push("</div>");

				}

			element.push("</div>");
		
		element.push("</div>");
		
	parent.append(element.join(""));
}

function add_leap_day_to_list(parent, key, data){

	element = [];

	element.push(`<div class='sortable-container ${(data.intercalary ? 'intercalary' : 'leap-day')} collapsed'>`);
		element.push("<div class='main-container'>");
			element.push("<div class='expand icon-collapse'></div>");
			element.push("<div class='name-container'>");
				element.push(`<input type='text' value='${data.name}' class='name-input small-input form-control dynamic_input' data='year_data.leap_days.${key}' key='name' tabindex='${(200+key)}'/>`);
			element.push("</div>");
		element.push("</div>");
		element.push("<div class='remove-container'>");
			element.push("<div class='remove-container-text'>Are you sure you want to remove this?</div>");
			element.push("<div class='btn_remove btn btn-danger icon-trash'></div>");
			element.push("<div class='btn_cancel btn btn-danger icon-remove'></div>");
			element.push("<div class='btn_accept btn btn-success icon-ok'></div>");
		element.push("</div>");

		element.push("<div class='detail-container'>");

			element.push("<div class='detail-row'>");

				element.push("<div class='detail-column full center-text bold-text big-text italics-text'>");
						
					element.push(!data.intercalary ? "Leap day" : "Intercalary leap day");

				element.push("</div>");

				element.push("<div class='detail-column full'>");

					element.push("<div class='detail-row'>");
							element.push("<div class='detail-text bold-text'>Leap day settings</div>");
					element.push("</div>");

					element.push("<div class='detail-row'>");
						element.push("<div class='detail-column'>");
							element.push("<div class='detail-row'>");
								element.push("<div class='detail-column'>");
									element.push("<div class='detail-text'>Timespan:</div>");
								element.push("</div>");
								element.push("<div class='detail-column'>");
									element.push(`<select type='number' class='custom-select form-control-sm leap_day_occurance_input timespan-list dynamic_input full' data='year_data.leap_days.${key}' key='timespan'>`);
									for(var i = 0; i < calendar.year_data.timespans.length; i++)
									{
										element.push(`<option value="${i}" ${(i==data.timespan ? "selected" : "")}>${calendar.year_data.timespans[i].name}</option>`);
									}
									element.push("</select>");
								element.push("</div>");
							element.push("</div>");
						element.push("</div>");
					element.push("</div>");

					element.push("<div class='detail-row'>");
						element.push("<div class='detail-column half'>");
							element.push("<div class='detail-row'>");
									element.push("<div class='detail-text'>Adds week day:</div>");
									element.push(`<input type='checkbox' class='form-control adds-week-day dynamic_input' data='year_data.leap_days.${key}' key='adds_week_day' ${(data.adds_week_day ? "checked" : "")} />`);
							element.push("</div>");	
						element.push("</div>");
					element.push("</div>");

					element.push(`<div class='detail-row ${(data.adds_week_day ? "" : "hidden")}'>`);
						element.push("<div class='detail-column'>");
							element.push("<div class='detail-row'>");
								element.push("<div class='detail-column'>");
									element.push("<div class='detail-text'>Appear after day:</div>");
								element.push("</div>");
								element.push("<div class='detail-column'>");
									element.push(`<select type='number' class='custom-select form-control-sm timespan-day-list dynamic_input inclusive' data='year_data.leap_days.${key}' key='day'>`);
									element.push(`<option value="${0}" ${(0==data.timespan ? "selected" : "")}>Before 1</option>`);
									for(var i = 1; i <= calendar.year_data.timespans[data.timespan].length; i++)
									{
										element.push(`<option value="${i}" ${(i==data.timespan ? "selected" : "")}>${i}</option>`);
									}
									element.push("</select>");
								element.push("</div>");
							element.push("</div>");
						element.push("</div>");
					element.push("</div>");

					element.push(`<div class='detail-row ${(data.adds_week_day ? "" : "hidden")}'>`);
						element.push("<div class='detail-column'>");
							element.push("<div class='detail-row'>");
								element.push("<div class='detail-text'>Week day name:</div>");
								element.push(`<input type='text' class='form-control internal-list-name dynamic_input' data='year_data.leap_days.${key}' key='week_day' value='${(data.week_day ? data.week_day : '')}' ${(data.adds_week_day ? "" : "disabled")}/>`);
							element.push("</div>");
						element.push("</div>");
					element.push("</div>");

					element.push("<div class='detail-row'>");
						element.push("<div class='separator'></div>");
					element.push("</div>");

					element.push("<div class='detail-row'>");
							element.push("<div class='detail-text bold-text'>Leaping settings</div>");
					element.push("</div>");

					
					element.push("<div class='detail-row'>");
						element.push("<div class='detail-column'>");
							element.push("<div class='detail-row'>");
								element.push("<div class='detail-column'>");
									element.push("<div class='detail-text'>Relative to:</div>");
								element.push("</div>");
								element.push("<div class='detail-column'>");
									element.push(`<select class='custom-select form-control-sm leap_day_occurance_input reference dynamic_input' data='year_data.leap_days.${key}' key='reference'>`);
										element.push(`<option ${(data.reference === "year" ? "selected" : "")} value='year'>Year</option>`);
										element.push(`<option ${(data.reference === "timespan" ? "selected" : "")} value='timespan'>Month</option>`);
									element.push("</select>");
								element.push("</div>");
							element.push("</div>");
						element.push("</div>");
					element.push("</div>");

					element.push("<div class='detail-row'>");
						element.push("<div class='detail-column half'>");
							element.push("<div class='detail-row'>");
									element.push("<div class='detail-text'>Interval:</div>");
									element.push(`<input type='number' min='1' class='form-control leap_day_occurance_input interval dynamic_input' min='0' data='year_data.leap_days.${key}' key='interval' min='1' value='${data.interval}' />`);
							element.push("</div>");	
						element.push("</div>");

						element.push("<div class='detail-column half'>");
							element.push("<div class='detail-row'>");
								element.push("<div class='detail-text'>Offset:</div>");
								element.push(`<input type='number' class='form-control leap_day_occurance_input offset dynamic_input' min='0' data='year_data.leap_days.${key}' key='offset' value='${data.offset}'`);
								element.push(data.interval === 1 ? " disabled" : "");
								element.push("/>");
							element.push("</div>");
						element.push("</div>");
					element.push("</div>");

					element.push("<div class='detail-row'>");

						var text = "This leap day will appear every ";

						if(data.reference == "year"){

							occurance = lcm(calendar.year_data.timespans[data.timespan].interval, data.interval)

							if(data.offset == 0 && calendar.year_data.timespans[data.timespan].offset == 0){

								year = occurance;

							}else{

								for(var year = 1; year <= occurance; year++){
									if((year - data.offset) % data.interval == 0 && (year - calendar.year_data.timespans[data.timespan].offset) % calendar.year_data.timespans[data.timespan].interval == 0){
										break;
									}
								}

							}
							if(occurance == 1){
								text += "year."
							}else{
								text += ordinal_suffix_of(occurance) + " year (starting year " + year + ").";
							}

						}else{

							if(data.interval == 1){

								text += "year."

							}else{

								text += ordinal_suffix_of(data.interval) + " ";
								text += `${calendar.year_data.timespans[data.timespan].name} every ${ordinal_suffix_of(calendar.year_data.timespans[data.timespan].interval*data.interval)} year`;

								total_offset = Math.abs((data.interval*data.offset)%(calendar.year_data.timespans[data.timespan].interval*data.interval));
								if(total_offset != 0){
									text += " starting year " + total_offset;
								}

								text += ")."

							}

						}	

						element.push(`<div class='detail-text center-text italics-text leap_day_variance_output'>${text}</div>`);
					element.push("</div>");
				element.push("</div>");
			element.push("</div>");
		element.push("</div>");
		element.push("</div>");

	element.push("</div>");

	parent.append(element.join(""));
}

function add_moon_to_list(parent, key, data){

	element = [];

	element.push("<div class='sortable-container moon_inputs expanded'>");
		element.push("<div class='main-container'>");
			element.push("<div class='name-container'>");
				element.push(`<input type='text' value='${data.name}' class='form-control name-input small-input dynamic_input' data='moons.${key}' key='name' tabindex='${(300+key)}'/>`);
			element.push("</div>");
		element.push("</div>");
		element.push("<div class='remove-container'>");
			element.push("<div class='remove-container-text'>Are you sure you want to remove this?</div>");
			element.push("<div class='btn_remove btn btn-danger icon-trash'></div>");
			element.push("<div class='btn_cancel btn btn-danger icon-remove'></div>");
			element.push("<div class='btn_accept btn btn-success icon-ok'></div>");
		element.push("</div>");

		element.push("<div class='detail-container'>");
			element.push("<div class='detail-row'>");
				element.push("<div class='detail-column half'>");
					element.push("<div class='detail-row'>");
						element.push("<div class='detail-text'>Cycle:</div>");
						element.push(`<input type='number' class='form-control dynamic_input cycle' data='moons.${key}' key='cycle' value='${data.cycle}' />`);
					element.push("</div>");
				element.push("</div>");
				element.push("<div class='detail-column half'>");
					element.push("<div class='detail-row'>");
						element.push("<div class='detail-text'>Shift:</div>");
						element.push(`<input type='number' class='form-control dynamic_input shift' data='moons.${key}' key='shift' value='${data.shift}' />`);
					element.push("</div>");
				element.push("</div>");
			element.push("</div>");
			element.push("<div class='detail-row'>");
				element.push("<div class='detail-column half'>");
					element.push("<div class='detail-row'>");
						element.push("<div class='detail-text'>Color:</div>");
						element.push("<div class='moon_color'>");
							element.push(`<input type='color' class='dynamic_input color' data='moons.${key}' key='color'/>`);
						element.push("</div>");
					element.push("</div>");
				element.push("</div>");
				element.push("<div class='detail-column half'>");
					element.push("<div class='detail-row'>");
						element.push("<div class='detail-text'>Hide from players: </div>");
						element.push(`<input type='checkbox' class='moon-hidden dynamic_input' data='moons.${key}' key='hidden'`);
						element.push(data.hidden ? "checked" : "");
						element.push("/>");
					element.push("</div>");
				element.push("</div>");
			element.push("</div>");
		element.push("</div>");

	element.push("</div>");

	parent.append(element.join(""));
}

function add_season_to_sortable(parent, key, data){
	element = [];
	element.push(`<div class='sortable-container season collapsed' key='${key}'>`);
		element.push("<div class='main-container'>");
			element.push("<div class='handle icon-reorder'></div>");
			element.push("<div class='expand icon-collapse'></div>");
			element.push("<div class='name-container'>");
				element.push(`<input type='text' value='${data.name}' tabindex='${(400+key)}'class='name-input small-input form-control dynamic_input' data='seasons.data.${key}' key='name'/>`);
			element.push("</div>");
		element.push("</div>");
		element.push("<div class='remove-container'>");
			element.push("<div class='remove-container-text'>Are you sure you want to remove this?</div>");
			element.push("<div class='btn_remove btn btn-danger icon-trash'></div>");
			element.push("<div class='btn_cancel btn btn-danger icon-remove'></div>");
			element.push("<div class='btn_accept btn btn-success icon-ok'></div>");
		element.push("</div>");
				
		element.push("<div class='detail-container hidden'>");

			element.push(`<div class='detail-row season-duration'>`);
				element.push("<div class='detail-column half'>");
					element.push("<div class='detail-row'>");
						element.push("<div class='detail-text'>Duration:</div>");
						var duration = data.duration == '' || data.duration == undefined ? 0 : data.duration;
						element.push(`<input type='number' step='any' class='form-control dynamic_input duration' data='seasons.data.${key}' key='duration' value='${duration}' />`);
					element.push("</div>");
				element.push("</div>");
				element.push("<div class='detail-column half'>");
					element.push("<div class='detail-row'>");
						element.push("<div class='detail-text'>Transition:</div>");
						var transition_length = data.transition_length == '' || data.transition_length == undefined ? 90 : data.transition_length;
						element.push(`<input type='number' step='any' class='form-control dynamic_input transition_length' data='seasons.data.${key}' key='transition_length' value='${transition_length}' />`);
					element.push("</div>");
				element.push("</div>");
			element.push("</div>");
				
			element.push("<div class='separator'></div>");

			element.push("<div class='detail-row'>");
				element.push("<div class='detail-column half'>");
					element.push("<div class='detail-row no-margin'>");
						element.push("<div class='detail-text'>Sunrise:</div>");
					element.push("</div>");
					element.push("<div class='detail-row'>");
						element.push("<div class='detail-column clock-input'>");
							element.push(`<input type='number' class='form-control full dynamic_input' clocktype='sunrise_hour' data='seasons.data.${key}.time.sunrise' key='hour' value='${data.time.sunrise.hour}' />`);
						element.push("</div>");
						element.push("<div class='detail-column'>:</div>");
						element.push("<div class='detail-column float clock-input'>");
							element.push(`<input type='number' class='form-control full dynamic_input' clocktype='sunrise_minute' data='seasons.data.${key}.time.sunrise' key='minute' value='${data.time.sunrise.minute}' />`);
						element.push("</div>");
					element.push("</div>");
				element.push("</div>");

				element.push("<div class='detail-column half'>");
					element.push("<div class='detail-row no-margin'>");
						element.push("<div class='detail-text'>Sunset:</div>");
					element.push("</div>");
					element.push("<div class='detail-row'>");
						element.push("<div class='detail-column clock-input'>");
							element.push(`<input type='number' class='form-control full dynamic_input' clocktype='sunset_hour' data='seasons.data.${key}.time.sunset' key='hour' value='${data.time.sunset.hour}' />`);
						element.push("</div>");
						element.push("<div class='detail-column'>:</div>");
						element.push("<div class='detail-column float clock-input'>");
							element.push(`<input type='number' class='form-control full dynamic_input' clocktype='sunset_minute' data='seasons.data.${key}.time.sunset' key='minute' value='${data.time.sunset.minute}' />`);
						element.push("</div>");
					element.push("</div>");
				element.push("</div>");
			element.push("</div>");
		element.push("</div>");
		
	parent.append(element.join(""));
}

function add_location_to_list(parent, key, data){

	element = [];

	element.push(`<div class='sortable-container location collapsed' key='${key}'>`);
		element.push("<div class='main-container'>");
			element.push("<div class='expand icon-collapse'></div>");
			element.push("<div class='name-container'>");
				element.push(`<input type='text' value='${data.name}' tabindex='${(500+key)}' class='name-input small-input form-control dynamic_input location-name' data='seasons.locations.${key}' key='name'/>`);
			element.push("</div>");
		element.push("</div>");
				
		element.push("<div class='remove-container'>");
			element.push("<div class='remove-container-text'>Are you sure you want to remove this?</div>");
			element.push("<div class='btn_remove btn btn-danger icon-trash'></div>");
			element.push("<div class='btn_cancel btn btn-danger icon-remove'></div>");
			element.push("<div class='btn_accept btn btn-success icon-ok'></div>");
		element.push("</div>");

		element.push("<div class='detail-container hidden'>");

			for(var i = 0; i < data.seasons.length; i++){

			element.push(`<div class='detail-row cycle-container wrap-collapsible location_season' key='${i}'>`);
				element.push(`<input id='collapsible_seasons_${key}_${i}' class='toggle' type='checkbox'>`);
				element.push(`<label for='collapsible_seasons_${key}_${i}' class='lbl-toggle'>Season name: ${calendar.seasons.data[i].name}</label>`);
				element.push("<div class='detail-column collapsible-content'>");

					element.push("<div class='detail-row'>");
						element.push("<div class='detail-column full'>");
							element.push("Name:");
						element.push("</div>");
					element.push("</div>");

					element.push("<div class='detail-row'>");
						element.push("<div class='detail-column twothird'>");
							if(data.seasons[i].custom_name){
								element.push(`<input type='text' class='form-control form-control-sm full dynamic_input' data='seasons.locations.${key}.seasons.${i}' key='name' value='${data.seasons[i].name}'>`);
							}else{
								element.push(`<input type='text' class='form-control form-control-sm full dynamic_input' data='seasons.locations.${key}.seasons.${i}' key='name' value='${calendar.seasons.data[i].name}' disabled>`);
							}
						element.push("</div>");
						element.push("<div class='detail-column third'>");
							element.push("<div class='detail-row'>");
								element.push("<div class='detail-text'>Custom:</div>");
								element.push(`<input type='checkbox' class='form-control form-control-bg dynamic_input disable_local_season_name' data='seasons.locations.${key}.seasons.${i}' key='custom_name' ${data.seasons[i].custom_name ? 'checked' : ''}>`);
							element.push("</div>");
						element.push("</div>");
					element.push("</div>");

					element.push("<div class='detail-row'>");
						element.push("<div class='detail-column half'>");
							element.push("Temperature low:");
						element.push("</div>");
						element.push("<div class='detail-column half'>");
							element.push("Temperature high:");
						element.push("</div>");
					element.push("</div>");
					element.push("<div class='detail-row'>");
						element.push("<div class='detail-column half'>");
							element.push(`<input type='number' class='form-control full dynamic_input' data='seasons.locations.${key}.seasons.${i}.weather' key='temp_low' value='${data.seasons[i].weather.temp_low}'>`);
						element.push("</div>");
						element.push("<div class='detail-column half'>");
							element.push(`<input type='number' class='form-control full dynamic_input' data='seasons.locations.${key}.seasons.${i}.weather' key='temp_high' value='${data.seasons[i].weather.temp_high}'>`);
						element.push("</div>");
					element.push("</div>");

					element.push("<div class='detail-row'>");
						element.push("<div class='detail-row'>");
							element.push("Percipitation chance: (%)");
						element.push("</div>");
						element.push("<div class='detail-column threequarter'>");
							element.push("<div class='slider_percentage'></div>");
						element.push("</div>");
						element.push("<div class='detail-column quarter'>");
							element.push(`<input type='number' class='form-control form-control-sm full dynamic_input slider_input' data='seasons.locations.${key}.seasons.${i}.weather' key='precipitation' value='${data.seasons[i].weather.precipitation*100}'>`);
						element.push("</div>");
					element.push("</div>");

					element.push("<div class='detail-row'>");
						element.push("<div class='detail-row'>");
							element.push("Percipitation intensity: (%)");
						element.push("</div>");
						element.push("<div class='detail-column threequarter'>");
							element.push("<div class='slider_percentage'></div>");
						element.push("</div>");
						element.push("<div class='detail-column quarter'>");
							element.push(`<input type='number' class='form-control form-control-sm full dynamic_input slider_input' data='seasons.locations.${key}.seasons.${i}.weather' key='precipitation_intensity' value='${data.seasons[i].weather.precipitation_intensity*100}'>`);
						element.push("</div>");
					element.push("</div>");

					element.push("<div class='detail-row'>");
						element.push("<div class='detail-column half'>");
							element.push("<div class='detail-row no-margin'>");
								element.push("<div class='detail-text'>Sunrise:</div>");
							element.push("</div>");
							element.push("<div class='detail-row'>");
								element.push("<div class='detail-column clock-input'>");
									element.push(`<input type='number' class='form-control full dynamic_input' clocktype='sunrise_hour' data='seasons.locations.${key}.seasons.${i}.time.sunrise' key='hour' value='${data.seasons[i].time.sunrise.hour}' />`);
								element.push("</div>");
								element.push("<div class='detail-column'>:</div>");
								element.push("<div class='detail-column float clock-input'>");
									element.push(`<input type='number' class='form-control full dynamic_input' clocktype='sunrise_minute' data='seasons.locations.${key}.seasons.${i}.time.sunrise' key='minute' value='${data.seasons[i].time.sunrise.minute}' />`);
								element.push("</div>");
							element.push("</div>");
						element.push("</div>");

						element.push("<div class='detail-column half'>");
							element.push("<div class='detail-row no-margin'>");
								element.push("<div class='detail-text'>Sunset:</div>");
							element.push("</div>");
							element.push("<div class='detail-row'>");
								element.push("<div class='detail-column clock-input'>");
									element.push(`<input type='number' class='form-control full dynamic_input' clocktype='sunset_hour' data='seasons.locations.${key}.seasons.${i}.time.sunset' key='hour' value='${data.seasons[i].time.sunset.hour}' />`);
								element.push("</div>");
								element.push("<div class='detail-column'>:</div>");
								element.push("<div class='detail-column float clock-input'>");
									element.push(`<input type='number' class='form-control full dynamic_input' clocktype='sunset_minute' data='seasons.locations.${key}.seasons.${i}.time.sunset' key='minute' value='${data.seasons[i].time.sunset.minute}' />`);
								element.push("</div>");
							element.push("</div>");
						element.push("</div>");
					element.push("</div>");
				element.push("</div>");
				
				element.push("<div class='separator'></div>");
			
			element.push("</div>");

			}

			element.push("<div class='detail-row'>");

				element.push("<div class='detail-row'>");
					element.push("<div class='detail-text big-text'>");
						element.push("Settings:");
					element.push("</div>");
				element.push("</div>");

				element.push("<div class='detail-row'>");
					element.push("<div class='detail-column half'>");
						element.push("<div class='detail-row no-margin'>");
							element.push("<div class='detail-text'>Timezone:</div>");
						element.push("</div>");
						element.push("<div class='detail-row'>");
							element.push("<div class='detail-column clock-input'>");
								element.push(`<input type='number' class='form-control form-control-sm full dynamic_input' data='seasons.locations.${key}.settings.timezone' clocktype='timezone_hour' key='hour' value='${data.settings.timezone.hour}' />`);
							element.push("</div>");
							element.push("<div class='detail-column'>:</div>");
							element.push("<div class='detail-column float clock-input'>");
								element.push(`<input type='number' class='form-control form-control-sm full dynamic_input' data='seasons.locations.${key}.settings.timezone' clocktype='timezone_minute' key='minute' value='${data.settings.timezone.minute}' />`);
							element.push("</div>");
						element.push("</div>");
					element.push("</div>");
				element.push("</div>");

				element.push("<div class='detail-row'>");
					element.push("<div class='detail-text big-text'>");
						element.push("Curve noise settings:");
					element.push("</div>");
				element.push("</div>");

				element.push("<div class='detail-row'>");
					element.push("<div class='detail-column half'>");
						element.push("Large frequency:");
					element.push("</div>");
					element.push("<div class='detail-column half'>");
						element.push("Large amplitude:");
					element.push("</div>");
				element.push("</div>");
				element.push("<div class='detail-row'>");
					element.push("<div class='detail-column half'>");
						element.push(`<input type='float' class='form-control form-control-sm full dynamic_input' data='seasons.locations.${key}.settings' key='large_noise_frequency' value='${data.settings.large_noise_frequency}' />`);
					element.push("</div>");
					element.push("<div class='detail-column half'>");
						element.push(`<input type='float' class='form-control form-control-sm full dynamic_input' data='seasons.locations.${key}.settings' key='large_noise_amplitude' value='${data.settings.large_noise_amplitude}'>`);
					element.push("</div>");
				element.push("</div>");

				element.push("<div class='detail-row'>");
					element.push("<div class='detail-column half'>");
						element.push("Medium frequency:");
					element.push("</div>");
					element.push("<div class='detail-column half'>");
						element.push("Medium amplitude:");
					element.push("</div>");
				element.push("</div>");
				element.push("<div class='detail-row'>");
					element.push("<div class='detail-column half'>");
						element.push(`<input type='float' class='form-control form-control-sm full dynamic_input' data='seasons.locations.${key}.settings' key='medium_noise_frequency' value='${data.settings.medium_noise_frequency}' />`);
					element.push("</div>");
					element.push("<div class='detail-column half'>");
						element.push(`<input type='float' class='form-control form-control-sm full dynamic_input' data='seasons.locations.${key}.settings' key='medium_noise_amplitude' value='${data.settings.medium_noise_amplitude}'>`);
					element.push("</div>");
				element.push("</div>");

				element.push("<div class='detail-row'>");
					element.push("<div class='detail-column half'>");
						element.push("Small frequency:");
					element.push("</div>");
					element.push("<div class='detail-column half'>");
						element.push("Small amplitude:");
					element.push("</div>");
				element.push("</div>");
				element.push("<div class='detail-row'>");
					element.push("<div class='detail-column half'>");
						element.push(`<input type='float' class='form-control form-control-sm full dynamic_input' data='seasons.locations.${key}.settings' key='small_noise_frequency' value='${data.settings.small_noise_frequency}' />`);
					element.push("</div>");
					element.push("<div class='detail-column half'>");
						element.push(`<input type='float' class='form-control form-control-sm full dynamic_input' data='seasons.locations.${key}.settings' key='small_noise_amplitude' value='${data.settings.small_noise_amplitude}'>`);
					element.push("</div>");
				element.push("</div>");

			element.push("</div>");

		element.push("</div>");
		
	parent.append(element.join(""));
}

function add_cycle_to_sortable(parent, key, data){

	element = [];

	element.push("<div class='sortable-container cycle_inputs collapsed'>");
		element.push("<div class='main-container'>");
			element.push("<div class='handle icon-reorder'></div>");
			element.push("<div class='expand icon-collapse'></div>");
			element.push(`<div class='detail-text'>Cycle number ${(key+1)} - Using $${(key+1)}</div>`);
		element.push("</div>");
		element.push("<div class='remove-container'>");
			element.push("<div class='remove-container-text'>Are you sure you want to remove this?</div>");
			element.push("<div class='btn_remove btn btn-danger icon-trash'></div>");
			element.push("<div class='btn_cancel btn btn-danger icon-remove'></div>");
			element.push("<div class='btn_accept btn btn-success icon-ok'></div>");
		element.push("</div>");

		element.push("<div class='detail-container'>");
			element.push("<div class='detail-row'>");

				element.push("<div class='detail-column full'>");

					element.push("<div class='detail-row'>");
							element.push("<div class='detail-text center-text bold-text'>Cycle settings</div>");
					element.push("</div>");

					element.push("<div class='detail-row'>");
						element.push("<div class='detail-column half'>");
							element.push("<div class='detail-row'>");
									element.push("<div class='detail-text'>Length:</div>");
									element.push(`<input type='number' class='form-control length dynamic_input' min='1' data='cycles.${key}' key='length' min='1' value='${data.length}' />`);
							element.push("</div>");	
						element.push("</div>");

						element.push("<div class='detail-column half'>");
							element.push("<div class='detail-row'>");
								element.push("<div class='detail-text'>Offset:</div>");
								element.push(`<input type='number' class='form-control offset dynamic_input' min='0' data='cycles.${key}' key='offset' value='${data.offset}'/>`);
							element.push("</div>");
						element.push("</div>");
					element.push("</div>");

					element.push("<div class='detail-row'>");
						element.push("<div class='detail-column full'>");
							element.push("<div class='detail-row'>");
								element.push("<div class='detail-text'>Number of names:</div>");
								element.push(`<input type='number' class='form-control cycle-name-length' value='${data.names.length}' key='${key}'/>`);
							element.push("</div>");
						element.push("</div>");
					element.push("</div>");
					element.push("<div class='detail-row cycle-container wrap-collapsible'>");
						element.push(`<input id='collapsible_cycle_${key}' class='toggle' type='checkbox'>`);
						element.push(`<label for='collapsible_cycle_${key}' class='lbl-toggle'>Cycle names</label>`);
						element.push("<div class='detail-column collapsible-content'>");
							element.push("<div class='cycle_list'>");
								for(index = 0; index < data.names.length; index++){
									element.push(`<input type='text' class='form-control internal-list-name dynamic_input' data='cycles.data.${key}.names' key='${index}' value='${data.names[index]}'/>`);
								}
							element.push("</div>");
						element.push("</div>");
					element.push("</div>");
			element.push("</div>");
		element.push("</div>");

	element.push("</div>");

	parent.append(element.join(""));
}

function add_era_to_list(parent, key, data){

	element = [];

	element.push("<div class='sortable-container era_inputs collapsed'>");
		element.push("<div class='main-container'>");
			element.push("<div class='expand icon-collapse'></div>");
			element.push("<div class='name-container'>");
				element.push(`<input type='text' value='${data.name}' class='form-control name-input small-input dynamic_input' data='eras.${key}' key='name' tabindex='${(800+key)}'/>`);
			element.push("</div>");
		element.push("</div>");
		element.push("<div class='remove-container'>");
			element.push("<div class='remove-container-text'>Are you sure you want to remove this?</div>");
			element.push("<div class='btn_remove btn btn-danger icon-trash'></div>");
			element.push("<div class='btn_cancel btn btn-danger icon-remove'></div>");
			element.push("<div class='btn_accept btn btn-success icon-ok'></div>");
		element.push("</div>");

		element.push("<div class='detail-container'>");
			element.push("<div class='detail-row'>");
				element.push("<div class='detail-column full'>");
					element.push("<div class='detail-row'>");
						element.push("<div class='detail-text'>Abbreviation:</div>");
						element.push(`<input type='text' class='form-control small-input dynamic_input era_abbreviation' data='eras.${key}' key='abbreviation' value='${data.abbreviation}' />`);
					element.push("</div>");
				element.push("</div>");
			element.push("</div>");
			element.push("<div class='detail-row'>");
				element.push("<div class='detail-column full'>");
					element.push(`<div class='btn btn-outline-primary full era_description html_edit' value='${data.description}' data='eras.${key}' key='description'>Edit event description</div>`);
				element.push("</div>");
			element.push("</div>");

			element.push("<div class='detail-row'>");
				element.push("<div class='separator'></div>");
			element.push("</div>");

			element.push("<div class='detail-row'>");
				element.push("<div class='detail-column half'>");
					element.push("<div class='detail-row'>");
						element.push("<div class='detail-text'>Show as event:</div>");
						element.push(`<input type='checkbox' class='form-control dynamic_input show_as_event' data='eras.${key}.settings' key='show_as_event' ${(data.settings.show_as_event ? "checked" : "")} />`);
					element.push("</div>");
				element.push("</div>");
			element.push("</div>");

			element.push(`<div class='detail-row ${(!data.settings.show_as_event ? "hidden" : "")}' key='${key}'>`);
				element.push("<div class='detail-column full'>");
					element.push("<div class='detail-row'>");
						element.push("<div class='detail-text'>Event category:</div>");
						element.push(`<select type='text' class='custom-select form-control-sm event-category-list dynamic_input' data='eras.${key}.settings' key='event_category'>`);
							for(var i = 0; i < calendar.event_data.categories.length; i++)
							{
								var name = calendar.event_data.categories[i].name;
								element.push(`<option value="${i}" ${(i==data.settings.event_category ? "selected" : "")}>${name}</option>`);
							}
							element.push("</select>");
					element.push("</div>");
				element.push("</div>");
			element.push("</div>");

			element.push("<div class='detail-row'>");
				element.push("<div class='separator'></div>");
			element.push("</div>");

			element.push("<div class='detail-row'>");
					element.push("<div class='detail-text bold-text'>Date:</div>");
			element.push("</div>");

			element.push("<div class='detail-row'>");
				element.push("<div class='detail-column full date-container'>");
					element.push("<div class='detail-row'>");
						element.push("<div class='detail-column quarter'>");
							element.push("<div class='detail-text'>Year:</div>");
						element.push("</div>");
						element.push("<div class='detail-column threequarter'>");
							element.push(`<input type='number' class='form-control small-input dynamic_input threequarter year-input' data='eras.${key}.date' key='year' value='${data.date.year}'/>`);
						element.push("</div>");
					element.push("</div>");

					element.push("<div class='detail-row'>");
						element.push("<div class='detail-column quarter'>");
							element.push("<div class='detail-text'>Timespan:</div>");
						element.push("</div>");
						element.push("<div class='detail-column threequarter'>");
							element.push(`<select type='number' class='custom-select form-control-sm timespan-list dynamic_input threequarter' data='eras.${key}.date' key='timespan'>`);
							for(var i = 0; i < calendar.year_data.timespans.length; i++)
							{
								is_there = does_timespan_appear(data.date.year, i);
								element.push(`<option value="${i}" ${(!is_there.result ? "disabled" : "")} ${(i==data.date.timespan ? "selected" : "")}>`);
								element.push(calendar.year_data.timespans[i].name+(!is_there.result ? ` (${is_there.reason})` : ""));
								element.push('</option>');
							}
							element.push("</select>");
						element.push("</div>");
					element.push("</div>");

					element.push("<div class='detail-row'>");
						element.push("<div class='detail-column quarter'>");
							element.push("<div class='detail-text'>Day:</div>");
						element.push("</div>");
						element.push("<div class='detail-column threequarter'>");
							element.push(`<select type='number' class='custom-select form-control-sm timespan-day-list dynamic_input threequarter' data='eras.${key}.date' key='day'>`);
							var days = get_days_in_timespan(convert_year(data.date.year), data.date.timespan, false);
							for(var i = 0; i < days.length; i++)
							{
								var day = days[i];
								element.push(`<option value='${i+1}' ${day.leaping ? 'disabled' : ''}>`);
								element.push(day.text + (day.leaping ? ` (leaping)` : ''));
								element.push('</option>');
							}
							element.push("</select>");
						element.push("</div>");
					element.push("</div>");
				element.push("</div>");

				element.push("<div class='detail-column full'>");

					element.push("<div class='detail-row'>");
						element.push("<div class='detail-column half'>");
							element.push("<div class='detail-text'>Ends year:</div>");
						element.push("</div>");
						element.push("<div class='detail-column half'>");
							element.push(`<input type='checkbox' class='form-control dynamic_input ends_year' data='eras.${key}.settings' key='ends_year' ${(data.settings.ends_year ? "checked" : "")} />`);
						element.push("</div>");
					element.push("</div>");

					element.push("<div class='detail-row'>");
						element.push("<div class='detail-column half'>");
							element.push("<div class='detail-text'>Restarts year count:</div>");
						element.push("</div>");
						element.push("<div class='detail-column half'>");
							element.push(`<input type='checkbox' class='form-control dynamic_input ends_year' data='eras.${key}.settings' key='restart' ${(data.settings.ends_year ? "checked" : "")} />`);
						element.push("</div>");
					element.push("</div>");

				element.push("</div>");

			element.push("</div>");

		element.push("</div>");

	element.push("</div>");

	parent.append(element.join(""));

}

function add_category_to_list(parent, key, data){

	element = [];

	element.push(`<div class='sortable-container category_inputs collapsed' key='${key}'>`);
		element.push("<div class='main-container'>");
			element.push("<div class='expand icon-collapse'></div>");
			element.push("<div class='name-container'>");
				element.push(`<input type='text' value='${data.name}' name='name_input' class='form-control name-input small-input dynamic_input_self' data='event_data.categories.${key}' tabindex='${(700+key)}'/>`);
			element.push("</div>");
		element.push("</div>");
		element.push("<div class='remove-container'>");
			element.push("<div class='remove-container-text'>Are you sure you want to remove this?</div>");
			element.push("<div class='btn_remove btn btn-danger icon-trash'></div>");
			element.push("<div class='btn_cancel btn btn-danger icon-remove'></div>");
			element.push("<div class='btn_accept btn btn-success icon-ok'></div>");
		element.push("</div>");
		element.push("<div class='detail-container'>");

			element.push("<div class='detail-row'>");
				element.push("<div class='detail-column full'>");
					element.push(`Event display: <div class='half event-text-output event ${data.color} ${data.event_settings.color_display}'>Event name</div>`);
				element.push("</div>");
			element.push("</div>");

			element.push("<div class='detail-row'>");
				element.push("<div class='detail-column half'>");
					element.push("<div class='detail-row'>");
						element.push("<div class='detail-column'>");
							element.push("<div class='detail-text'>Color:</div>");
						element.push("</div>");
						element.push("<div class='detail-column'>");
							element.push(`<select class='custom-select form-control-sm dynamic_input event-text-input color_display' data='event_data.categories.${key}' key='color_display'>`);
								element.push(`<option class="event background Dark-Solid"${(data.color_display == 'Dark-Solid' ? ' selected' : '')}>Dark-Solid</option>`);
								element.push(`<option class="event background Red"${(data.color_display == 'Red' ? ' selected' : '')}>Red</option>`);
								element.push(`<option class="event background Pink"${(data.color_display == 'Pink' ? ' selected' : '')}>Pink</option>`);
								element.push(`<option class="event background Purple"${(data.color_display == 'Purple' ? ' selected' : '')}>Purple</option>`);
								element.push(`<option class="event background Deep-Purple"${(data.color_display == 'Deep-Purple' ? ' selected' : '')}>Deep-Purple</option>`);
								element.push(`<option class="event background Blue"${(data.color_display == 'Blue' ? ' selected' : '')}>Blue</option>`);
								element.push(`<option class="event background Light-Blue"${(data.color_display == 'Light-Blue' ? ' selected' : '')}>Light-Blue</option>`);
								element.push(`<option class="event background Cyan"${(data.color_display == 'Cyan' ? ' selected' : '')}>Cyan</option>`);
								element.push(`<option class="event background Teal"${(data.color_display == 'Teal' ? ' selected' : '')}>Teal</option>`);
								element.push(`<option class="event background Green"${(data.color_display == 'Green' ? ' selected' : '')}>Green</option>`);
								element.push(`<option class="event background Light-Green"${(data.color_display == 'Light-Green' ? ' selected' : '')}>Light-Green</option>`);
								element.push(`<option class="event background Lime"${(data.color_display == 'Lime' ? ' selected' : '')}>Lime</option>`);
								element.push(`<option class="event background Yellow"${(data.color_display == 'Yellow' ? ' selected' : '')}>Yellow</option>`);
								element.push(`<option class="event background Orange"${(data.color_display == 'Orange' ? ' selected' : '')}>Orange</option>`);
								element.push(`<option class="event background Blue-Grey"${(data.color_display == 'Blue-Grey' ? ' selected' : '')}>Blue-Grey</option>`);
							element.push("</select>");
						element.push("</div>");
					element.push("</div>");
				element.push("</div>");

				element.push("<div class='detail-column half'>");
					element.push("<div class='detail-row'>");
						element.push("<div class='detail-column'>");
							element.push("<div class='detail-text'>Display:</div>");
						element.push("</div>");
						element.push("<div class='detail-column threequarter float'>");
							element.push(`<select class='custom-select form-control-sm dynamic_input event-text-input text_display' data='event_data.categories.${key}' key='text'>`);
								element.push(`<option class="event Dark-Solid text" value="text"${(data.text_display == 'text' ? ' selected' : '')}>Just text</option>`);
								element.push(`<option class="event Dark-Solid dot" value="dot"${(data.text_display == 'dot' ? ' selected' : '')}>• Dot with text</option>`);
								element.push(`<option class="event Dark-Solid background" value="background"${(data.text_display == 'background' ? ' selected' : '')}>Background</option>`);
							element.push("</select>");
						element.push("</div>");
					element.push("</div>");
				element.push("</div>");
			element.push("</div>");

			element.push("<div class='detail-row'>");
				element.push("<div class='separator'></div>");
			element.push("</div>");

			element.push("<div class='detail-row'>");
					element.push("<div class='detail-text bold-text'>Category settings (global):</div>");
			element.push("</div>");

			element.push("<div class='detail-row'>");
				element.push("<div class='detail-column half'>");
					element.push("<div class='detail-row'>");
						element.push("<div class='detail-text'>Hide from viewers:</div>");
						element.push(`<input type='checkbox' class='form-control dynamic_input global_hide' data='event_data.categories.${key}.category_settings' key='hide' ${(data.category_settings.hide ? "checked" : "")} />`);
					element.push("</div>");
				element.push("</div>");
				element.push("<div class='detail-column half'>");
					element.push("<div class='detail-row'>");
						element.push("<div class='detail-text'>Usable by players:</div>");
						element.push(`<input type='checkbox' class='form-control dynamic_input player_usable' data='event_data.categories.${key}.category_settings' key='player_usable' ${(data.category_settings.player_usable ? "checked" : "")} />`);
					element.push("</div>");
				element.push("</div>");
			element.push("</div>");

			element.push("<div class='detail-row'>");
				element.push("<div class='separator'></div>");
			element.push("</div>");

			element.push("<div class='detail-row'>");
					element.push("<div class='detail-text bold-text'>Event settings (local):</div>");
			element.push("</div>");

			element.push("<div class='detail-row'>");
				element.push("<div class='detail-column half'>");
					element.push("<div class='detail-row'>");
						element.push("<div class='detail-text'>Hide event:</div>");
						element.push(`<input type='checkbox' class='form-control dynamic_input local_hide' data='event_data.categories.${key}.event_settings' key='hide' ${(data.event_settings.hide ? "checked" : "")} />`);
					element.push("</div>");
				element.push("</div>");
				element.push("<div class='detail-column half'>");
					element.push("<div class='detail-row'>");
						element.push("<div class='detail-text'>Don't print event:</div>");
						element.push(`<input type='checkbox' class='form-control dynamic_input noprint' data='event_data.categories.${key}.event_settings' key='noprint' ${(data.event_settings.noprint ? "checked" : "")} />`);
					element.push("</div>");
				element.push("</div>");
			element.push("</div>");

		element.push("</div>");

	element.push("</div>");

	parent.append(element.join(""));
}


function add_event_to_list(parent, key, data){

	element = [];

	element.push(`<div class='sortable-container events_input' key='${key}'>`);
		element.push("<div class='main-container'>");
			element.push(`<div class='btn btn-outline-primary open-edit-event-ui'>Edit - ${data.name}</div>`);
		element.push("</div>");
		element.push("<div class='remove-container'>");
			element.push("<div class='remove-container-text'>Are you sure you want to remove this?</div>");
			element.push("<div class='btn_remove btn btn-danger icon-trash'></div>");
			element.push("<div class='btn_cancel btn btn-danger icon-remove'></div>");
			element.push("<div class='btn_accept btn btn-success icon-ok'></div>");
		element.push("</div>");

	element.push("</div>");


	parent.append(element.join(""));
}

function error_check(parent){

	errors = [];

	for(var era_i = 0; era_i < calendar.eras.length; era_i++){
		var era = calendar.eras[era_i];
		if(calendar.year_data.timespans[era.date.timespan]){
			if(!does_timespan_appear(era.date.year, era.date.timespan).result){
				errors.push(`Era <i>${era.name}</i> is currently on a leaping month. Please move it to another month.`);
			}

			/*if(era.date.day > calendar.year_data.timespans[era.date.timespan].length){
				errors.push(`Era <i>${era.name}</i> lands on a day later than the length of its month. Please adjust it accordingly.`);
			}*/
		}else{
			errors.push(`Era <i>${era.name}</i> doesn't have a valid month.`);
		}
	}

	for(var era_i = 0; era_i < calendar.eras.length-1; era_i++){
		var curr = calendar.eras[era_i];
		var next = calendar.eras[era_i+1];
		if(curr.year == next.date.year && curr.settings.ends_year && next.settings.ends_year){
			errors.push(`Eras <i>${curr.name}</i> and <i>${next.name}</i> both end the same year. This is not possible.`);
		}
		if(curr.date.year == next.date.year && curr.date.timespan == next.date.timespan && curr.date.day == next.date.day){
			errors.push(`Eras <i>${calendar.eras[era_i].name}</i> and <i>${calendar.eras[era_i+1].name}</i> both share the same date. One has to come after another.`);
		}
	}
	
	for(var season_i = 0; season_i < calendar.seasons.data.length; season_i++){
		var season = calendar.seasons.data[season_i];
		if(season.transition_length == 0){
			errors.push(`Season <i>${season.name}</i> can't have 0 transition length.`);
		}
	}

	if(calendar.year_data.timespans.length == 0){

		errors.push(`You need at least one month.`);

	}

	if(calendar.year_data.global_week.length == 0){

		errors.push(`You need at least one global week day.`);

	}

	if(errors.length == 0 && $('.invalid').length == 0){

		close_calendar_message();
		if(parent !== undefined && (parent === "seasons")){
			rebuild_climate();
		}else{
			rebuild_calendar('calendar', date);
		}

	}else{

		var text = [];
		
		text.push(`Errors:<ol>`);

		for(var i = 0; i < errors.length; i++){

			text.push(`<li>${errors[i]}</li>`);

		}
		text.push(`</ol>`);

		calendar_error_message(text.join(''));

	}

}



function update_cycle_example_text(){
	$('#cycle_test_result').text(get_cycle(($('#cycle_test_input').val()|0)).text);
}

function evaluate_remove_buttons(){
	$('.btn_remove').each(function(){
		if($(this).parent().parent().hasClass('month') || $(this).parent().parent().hasClass('week_day')){
			$(this).toggleClass('disabled', $(this).parent().parent().parent().children().length == 1);
		}
	});
}

function reindex_weekday_sortable(){

	var tabindex = 1;

	calendar.year_data.global_week = [];

	$('#global_week_sortable').children().each(function(i){
		$(this).find(".name-input").attr("key", i);
		$(this).find(".name-input").prop("tabindex", tabindex)
		tabindex++;

		calendar.year_data.global_week[i] = $(this).find('.name-input').val();

	})

	error_check();
}

function reindex_timespan_sortable(){
	var tabindex = 100;
	
	calendar.year_data.timespans = [];

	new_order = [];
	timespan_sortable.children().each(function(i){
		new_order.push(($(this).attr('key')|0));
		$('.dynamic_input', this).each(function(){
			$(this).attr('data', $(this).attr('data').replace(/[0-9]/g, i));
		});
		$(this).attr('key', i);
		$(this).find('.name-input').prop('tabindex', tabindex+1)
		tabindex++;
		$(this).find('.length-input').prop('tabindex', tabindex+1)
		tabindex++;
		$(this).find('.toggle').prop('id', 'collapsible_week_'+i)
		$(this).find('.lbl-toggle').prop('for', 'collapsible_week_'+i)

		calendar.year_data.timespans[i] = {
			'name': $(this).find('.name-input').val(),
			'type': $(this).attr('type'),
			'length': Number($(this).find('.length-input').val()),
			'interval': Number($(this).find('.interval').val()),
			'offset': Number($(this).find('.offset').val())
		};

		if($(this).find('.unique-week-input').is(':checked')){
			calendar.year_data.timespans[i].week = [];
			$(this).find('.collapsible-content').children().first().children().each(function(j){
				calendar.year_data.timespans[i].week[j] = $(this).val();
			});
		}

	});

	repopulate_month_lists();

	error_check();


}

function reindex_season_sortable(key){

	var tabindex = 400;

	calendar.seasons.data = [];

	season_sortable.children().each(function(i){

		$(this).attr("key", i);
		$(this).find(".name-input").prop("tabindex", tabindex)
		tabindex++;

		calendar.seasons.data[i] = {
			"name": $(this).find('.name-input').val(),
			"time": {
				"sunrise": {
					"hour": ($(this).find('input[clocktype="sunrise_hour"]').val()|0),
					"minute": ($(this).find('input[clocktype="sunrise_minute"]').val()|0)
				},
				"sunset": {
					"hour": ($(this).find('input[clocktype="sunset_hour"]').val()|0),
					"minute": ($(this).find('input[clocktype="sunset_minute"]').val()|0)
				}
			}
		};

		calendar.seasons.data[i].transition_length = parseFloat($(this).find('.transition_length').val());
		calendar.seasons.data[i].duration = parseFloat($(this).find('.duration').val());

	});

	if(key !== undefined){
		location_list.find(`.location_season[key="${key}"]`).remove();
	}

	error_check(season_sortable);

}

function reindex_location_list(){

	var tabindex = 500;

	calendar.seasons.locations = [];

	location_list.children().each(function(i){

		var data = {};

		$(this).attr("key", i);
		$(this).find(".name-input").prop("tabindex", tabindex);
		tabindex++;

		data = {
			"name": $(this).find(".name-input").val(),
			"seasons": [],
			"settings": {
				"timezone": {
					"hour": ($(this).find("input[key='timezone_hour']").val()|0),
					"minute": ($(this).find("input[key='timezone_minute']").val()|0),
				},

				"large_noise_frequency": ($(this).find("input[key='large_noise_frequency']").val()|0),
				"large_noise_amplitude": ($(this).find("input[key='large_noise_amplitude']").val()|0),

				"medium_noise_frequency": ($(this).find("input[key='medium_noise_frequency']").val()|0),
				"medium_noise_amplitude": ($(this).find("input[key='medium_noise_amplitude']").val()|0),

				"small_noise_frequency": ($(this).find("input[key='small_noise_frequency']").val()|0),
				"small_noise_amplitude": ($(this).find("input[key='small_noise_amplitude']").val()|0)
			},
			"custom_dates": {}
		};

		$(this).find('.location_season').each(function(j){

			data.seasons[j] = {};

			data.seasons[j].time = {
				"sunrise": {
					"hour": $(this).find('input[clocktype="sunrise_hour"]').val()|0,
					"minute": $(this).find('input[clocktype="sunrise_minute"]').val()|0,
				},
				"sunset": {
					"hour": $(this).find('input[clocktype="sunset_hour"]').val()|0,
					"minute": $(this).find('input[clocktype="sunset_minute"]').val()|0,
				}
			};
			data.seasons[j].weather = {
				"temp_low": $(this).find('input[key="temp_low"]').val()|0,
				"temp_high": $(this).find('input[key="temp_high"]').val()|0,
				"precipitation": ($(this).find('input[key="precipitation"]').val()|0)/100,
				"precipitation_intensity": ($(this).find('input[key="precipitation_intensity"]').val()|0)/100
			};

			data.seasons[j].custom_name = $(this).find('input[key="custom_name"]').prop('checked');

			if(data.seasons[j].custom_name){
				data.seasons[j].name = $(this).find('input[clocktype="name"]').val();
			}

		})

		calendar.seasons.locations[i] = data;

	});

}

function reindex_cycle_sortable(){
	
	calendar.cycles.data = [];

	$('#cycle_sortable').children().each(function(i){
		$('.dynamic_input', this).each(function(){
			$(this).attr('data', $(this).attr('data').replace(/[0-9]/g, i));
		});
		$(this).attr('key', i);
		$(this).find('.main-container').find('.detail-text').text(`Cycle number ${i+1} - Using \$${i+1}`)

		calendar.cycles.data[i] = {
			'length': ($(this).find('.length').val()|0),
			'offset': ($(this).find('.offset').val()|0),
			'names': []
		};

		$(this).find('.collapsible-content').children().first().children().each(function(j){
			calendar.cycles.data[i].names[j] = $(this).val();
		});

	});

	error_check();

	update_cycle_example_text();
}

function reindex_moon_list(){
	
	calendar.moons = [];

	$('#moon_list').children().each(function(i){

		$('.dynamic_input', this).each(function(){
			$(this).attr('data', $(this).attr('data').replace(/[0-9]/g, i));
		});

		$(this).attr('key', i);

		var cycle = ($(this).find('.cycle').val()|0);

		if(cycle <= 8){
			var granularity = 8;
		}else if(cycle <= 16){
			var granularity = 16;
		}else{
			var granularity = 32;
		}

		calendar.moons[i] = {
			'name': $(this).find('.name-input').val(),
			'cycle': ($(this).find('.cycle').val()|0),
			'shift': ($(this).find('.shift').val()|0),
			'color': $(this).find('.color').spectrum('get', 'hex').toString(),
			'hidden': $(this).find('.moon-hidden').is(':checked'),
			'granularity': granularity
		};

	});

	error_check();


}

function reindex_era_list(){
	
	calendar.eras = [];

	era_list.children().each(function(i){

		$('.dynamic_input', this).each(function(){
			$(this).attr('data', $(this).attr('data').replace(/[0-9]/g, i));
		});

		$(this).attr('key', i);

		calendar.eras[i] = {
			'name': $(this).find('.name-input').val(),
			'abbreviation': $(this).find('.era_abbreviation').val(),
			'description': $(this).find('.era_description').attr('value'),
			'settings': {
				'show_as_event': $(this).find('.show_as_event').is(':checked'),
				'event_category': $(this).find('.event-category-list').val(),
				'ends_year': $(this).find('.ends_year').is(':checked')
			},
			'date': {
				'year': ($(this).find('.year-input').val()|0),
				'timespan': ($(this).find('.timespan-list').val()|0),
				'day': ($(this).find('.timespan-day-list').val()|0)
			}
		};

		calendar.eras[i].date.epoch = evaluate_calendar_start(calendar, convert_year(calendar.eras[i].date.year), calendar.eras[i].date.timespan, calendar.eras[i].date.day).epoch;

	});

	error_check();

}

function reindex_event_category_list(){
	
	calendar.event_data.categories = [];

	event_category_list.children().each(function(i){

		$('.dynamic_input', this).each(function(){
			$(this).attr('data', $(this).attr('data').replace(/[0-9]/g, i));
		});

		$(this).attr('key', i);

		calendar.event_data.categories[i] = {
			'name': $(this).find('.name-input').val(),
			'color': $(this).find('.color_display').val(),
			'texty': $(this).find('.text_display').val(),
			'category_settings': {
				'hide': $(this).find('.global_hide').is(':checked'),
				'player_usable': $(this).find('.player_usable').is(':checked')
			},
			'event_settings': {
				'hide': $(this).find('.local_hide').is(':checked'),
				'noprint': $(this).find('.noprint').is(':checked')
			}
		};

	});

	$('.event-category-list').each(function(){
		var element = [];
		var selected = $('.event-category-list').val();
		for(var i = 0; i < calendar.event_data.categories.length; i++)
		{
			var name = calendar.event_data.categories[i].name;
			element.push(`<option value="${i}" ${(i==selected ? "selected" : "")}>${name}</option>`);
		}
		$(this).html(element.join(""));
	});

	error_check();

}

function reindex_events_list(){

	events_list.empty();

	for(var i = 0; i < calendar.event_data.events.length; i++){

		add_event_to_list(events_list, i, calendar.event_data.events[i]);

	}

}


function repopulate_month_lists(){
	$(".timespan-list").each(function(i){
		selected = $(this).val();
		html = [];
		$(this).html('');
		for(var i = 0; i < calendar.year_data.timespans.length; i++)
		{
			html.push(`<option value="${i}">${calendar.year_data.timespans[i].name}</option>`);
		}
		$(this).append(html);
		$(this).val(selected);
	});
}

function repopulate_day_lists(){

	$(".timespan-day-list").each(function(i){

		var year = convert_year($(this).closest('.sortable-container').find('.year-input').val()|0);
		var timespan = $(this).closest('.sortable-container').find('.timespan-list').val()|0;
		var day = $(this).val();

		var days = get_days_in_timespan(year, timespan, true);
		var html = [];
		for(var i = 0; i < days.length; i++){
			var day = days[i];
			html.push(`<option value='${i+1}' ${!day.is_there.result ? 'disabled' : ''}>`);
			html.push(day.text + (!day.is_there.result ? ` (${day.is_there.reason})` : ''));
			html.push('</option>');
		}
		$(this).html(html.join('')).val(day);
		if($(this).find('option:selected').prop('disabled') || $(this).val() == null){
			for(var i = day-1; i >= 0; i--){
				if($(this).children().eq(i).length && !$(this).children().eq(i).prop('disabled')){
					break;
				}
			}
			$(this).val(i+1);
		}
		$(this).data('val', day);

	});

}

function recreate_moon_colors(){

	$('.moon_inputs .color').spectrum({
		color: "#FFFFFF",
		preferredFormat: "hex",
		showInput: true
	});

	$('#moon_list').children().each(function(i){
		$(this).find('.color').spectrum("set", calendar.moons[i].color);
	});

}

function evaluate_season_lengths(){

	var data = {
		'season_length': 0
	};
	
	var epoch_start = evaluate_calendar_start(calendar, date.internal_year).epoch;
	var epoch_end = evaluate_calendar_start(calendar, date.internal_year+1).epoch-1;
	var season_length = epoch_end-epoch_start;

	for(var i = 0; i < calendar.seasons.data.length; i++){
		current_season = calendar.seasons.data[i];
		data.season_length += current_season.transition_length;
		data.season_length += current_season.duration;
	}

	data.season_offset = calendar.seasons.global_settings.offset;

	$('#season_length_text').removeClass('hidden');
	$('#season_length_text').text(`Season length: ${data.season_length} / ${fract_year_length()} (year length)`);

}

function recalc_stats(){
	var year_length = fract_year_length();
	var month_length = avg_month_length();
	$('#fract_year_length').text(year_length);
	$('#fract_year_length').prop('title', year_length);
	$('#avg_month_length').text(month_length);
	$('#avg_month_length').prop('title', month_length);
}


function adjustInput(element, int){
	if(int > 0){
		var element = $(element).prev();
	}else{
		var element = $(element).next();
	}
	element.val((element.val()|0)+int).change();

}