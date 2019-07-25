function set_up_edit_inputs(set_up){

	prev_calendar_name = clone(calendar_name);
	prev_dynamic_data = clone(dynamic_data);
	prev_static_data = clone(static_data);

	calendar_name_same = calendar_name == prev_calendar_name;
	static_same = JSON.stringify(static_data) === JSON.stringify(prev_static_data);
	dynamic_same = JSON.stringify(dynamic_data) === JSON.stringify(prev_dynamic_data);

	set_up_view_inputs();

	save_button = $('#btn_save');

	save_button.click(function(){

		if(!static_same || (!static_same && !dynamic_same)){
			update_all();
		}else if(!dynamic_same){
			update_dynamic();
		}else if(!calendar_name_same){
			update_name();
		}

	});

	create_button = $('#btn_create');

	create_button.click(function(){

		create_calendar();

	});

	delete_button = $('#btn_delete');

	delete_button.click(function(){
		var input = prompt('To delete this calendar, please type DELETE into the field:');
		if(input === "DELETE"){
			delete_calendar();
		}
	})

	calendar_container = $('#calendar');
	weather_contrainer = $('#weather_container');

	removing = null;
	input_container = $('#input_container');
	timespan_sortable = $('#timespan_sortable');
	first_day = $('#first_day');
	global_week_sortable = $('#global_week_sortable');
	leap_day_list = $('#leap_day_list');
	moon_list = $('#moon_list');
	season_sortable = $('#season_sortable');
	cycle_sortable = $('#cycle_sortable');
	era_list = $('#era_list');
	event_category_list = $('#event_category_list');
	events_sortable = $('#events_sortable');
	location_list = $('#location_list');
	calendar_link_select = $('#calendar_link_select');
	calendar_link_list = $('#calendar_link_list');
	
	var previous_view_type = 'owner';
	var first_switch = true;
	view_type = 'owner';

	$('input[name="view_type"]').change(function(){

		view_type = $(this).val();
		owner = true;

		switch(view_type){
			case "owner":
				if(previous_view_type !== 'owner'){
					do_error_check();
				}
				calendar_container.removeClass('hidden');
				weather_contrainer.addClass('hidden');
				previous_view_type = view_type;
				break;

			case "player":
				owner = 0;
				if(previous_view_type !== 'player'){
					do_error_check();
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
			do_error_check(season_sortable);
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

	events_sortable.sortable({
		placeholder: "highlight",
		handle: '.handle',
		opacity: 0.5,
		update: function(){
			reindex_events_sortable();
			do_error_check();
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

	if(set_up){
		set_up_edit_values();
	}
	
	/* ------------------- Dynamic and static callbacks ------------------- */

	$('#calendar_name').val(unescapeHtml(calendar_name));

	$('#calendar_name').change(function(){
		calendar_name = escapeHtml($(this).val());
		evaluate_save_button();
	});

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
			name_input.val(static_data.seasons.data[key].name).prop('disabled', true);
		}
	});

	$("input[data='clock']").change(function(){

		evaluate_clock_inputs();

	});

	$('#enable_clock').change(function(){

		static_data.clock.enabled = $(this).is(':checked');

		dynamic_data.hour = 0;
		dynamic_data.minute = 0;

		evaluate_clock_inputs();

	});

	$('#collapsible_clock').change(function(){
		if($(this).is(':checked')){
			$('#clock').prependTo($(this).parent().children('.collapsible-content'));
		}else{
			$('#clock').prependTo($('#collapsible_date').parent().children('.collapsible-content'));
		}
	});


	/* ------------------- Layout callbacks ------------------- */

	$('.form-inline').keyup(function(e){
		if (e.keyCode == 13) {
			$(this).find('.add').click();
		}
	});


	$('.form-inline.global_week .add').click(function(){
		var name = $(this).prev();
		var id = $('#global_week_sortable .sortable-container').length;
		add_weekday_to_sortable(global_week_sortable, id, escapeHtml(name.val()))
		static_data.year_data.global_week.push(escapeHtml(name.val()));
		global_week_sortable.sortable('refresh');
		reindex_weekday_sortable();
		name.val("");
		set_up_view_values();
	});

	$('.form-inline.timespan .add').click(function(){
		var name = $(this).prev().prev();
		var type = $(this).prev();
		var id = $('#timespan_sortable .sortable-container').length;
		stats = {
			'name': escapeHtml(name.val()),
			'type': type.val(),
			'length': 1,
			'interval': 1,
			'offset': 0
		};

		add_timespan_to_sortable(timespan_sortable, id, stats);
		static_data.year_data.timespans.push(stats);
		timespan_sortable.sortable('refresh');
		reindex_timespan_sortable();
		name.val("");
		set_up_view_values();
		$('#leap_day_explaination').prop('disabled', static_data.year_data.timespans.length == 0).toggleClass('hidden', static_data.year_data.timespans.length > 0);
		$('.form-inline.leap input, .form-inline.leap select, .form-inline.leap button').prop('disabled', static_data.year_data.timespans.length == 0);
	});

	$('.form-inline.leap .add').click(function(){
		var name = $(this).prev().prev();
		var type = $(this).prev();
		var id = $('#leap_day_list .sortable-container').length;
		stats = {
			'name': escapeHtml(name.val()),
			'intercalary': type.val() == 'intercalary',
			'timespan': 0,
			'removes_day': false,
			'removes_week_day': false,
			'adds_week_day': false,
			'day': 0,
			'week_day': '',
			'interval': '1',
			'offset': 0
		};
		
		if(!static_data.year_data.leap_days){
			static_data.year_data.leap_days = [];
		}
		static_data.year_data.leap_days.push(stats);

		add_leap_day_to_list(leap_day_list, id, stats);

		repopulate_day_select(leap_day_list.children().last().find('.timespan-day-list.leap_day_input'), static_data.year_data.leap_days[id].day, false);

		do_error_check();

		name.val("");
		set_up_view_values();

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
		var cycle_val = cycle.val()|0;
		var id = $('#moon_list .sortable-container').length;

		var granularity = get_moon_granularity(cycle_val);

		stats = {
			'name': escapeHtml(name.val()),
			'cycle': cycle.val(),
			'shift': shift.val(),
			'granularity': granularity,
			'color': '#ffffff',
			'hidden': false
		};
		if(static_data.moons === undefined){
			static_data.moons = [];
		}
		static_data.moons.push(stats);
		add_moon_to_list(moon_list, id, stats);
		name.val("");
		cycle.val("");
		shift.val("");
		recreate_moon_colors();
		do_error_check();
	});

	$('.form-inline.seasons .add').click(function(){

		var fract_year_len = fract_year_length(static_data);

		var name = $(this).prev();
		var id = season_sortable.children().length;
	
		stats = {
			"name": escapeHtml(name.val()),
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

		if(season_sortable.children().length == 0){
			stats.transition_length = fract_year_len;
		}else{
			if(season_sortable.children().length == 1){
				season_sortable.children().eq(0).find('.transition_length').val(fract_year_len/2);
			}
			stats.transition_length = fract_year_len/2;
		}

		stats.duration = 0;

		add_season_to_sortable(season_sortable, id, stats);
		season_sortable.sortable('refresh');
		reindex_season_sortable();
		evaluate_season_lengths();
		reindex_location_list();
		name.val("");
		do_error_check();
		
		$('#create_season_events').prop('disabled', static_data.seasons.data.length == 0);

	});

	$('#create_season_events').prop('disabled', static_data.seasons.data.length == 0);

	$('#create_season_events').click(function(){
		if(confirm('Are you sure you want to create seasonal events? If you already have created them, you might get doubling.')){
			for(var i = 0; i < static_data.seasons.data.length; i++){
				static_data.event_data.events = static_data.event_data.events.concat(create_season_events(i, static_data.seasons.data[i].name));
			}
			reindex_events_sortable();
			do_error_check('seasons');
		}
	})

	$('.form-inline.locations .add').click(function(){

		var name = $(this).prev();
		var id = location_list.children().length;
	
		stats = {
			"name": escapeHtml(name.val()),
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

		for(var i = 0; i < static_data.seasons.data.length; i++){

			stats.seasons[i] = {
				"custom_name": false,
				"time": static_data.seasons.data[i].time,
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
		name.val('');

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

		do_error_check();

	});

	$('#copy_location_data').click(function(){

		var type = location_select.find('option:selected').parent().attr('value');
		var location = escapeHtml(location_select.val());

		if(type === "custom"){
			var stats = static_data.seasons.locations[location];
		}else{
			var stats = climate_generator.presets[location];
			stats.settings = climate_generator.preset_curves;
			stats.custom_dates = {};

			for(var i = 0; i < static_data.seasons.data.length; i++){
				stats.seasons[i].time = static_data.seasons.data[i].time;
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

		do_error_check();

	});


	$('.form-inline.cycle .add').click(function(){

		var id = cycle_sortable.children().length;
		var stats = {
			'length': 1,
			'offset': 0,
			'names': ["Cycle name 1"]
		};
		if(static_data.cycles === undefined){
			static_data.cycles = {
				format: escapeHtml($('#cycle_format').val()),
				data: []
			};
		}
		static_data.cycles.data.push(stats);
		add_cycle_to_sortable(cycle_sortable, id, stats);
		do_error_check();

	});


	$('.form-inline.eras .add').click(function(){

		var id = era_list.children().length;

		var name = $(this).prev();

		var stats = {
			"name": escapeHtml(name.val()),
			"abbreviation": "",
			"description": "",
			"settings": {
				"show_as_event": false,
				"event_category": -1,
				"ends_year": false,
				"restart": false
			},
			"date": {
				"year": dynamic_data.year,
				"timespan": dynamic_data.timespan,
				"day": dynamic_data.day
			}
		};

		if(static_data.eras === undefined){
			static_data.eras = [];
		}

		static_data.eras.push(stats);
		add_era_to_list(era_list, id, stats);
		repopulate_timespan_select(era_list.children().last().find('.timespan-list'), dynamic_data.timespan);
		repopulate_day_select(era_list.children().last().find('.timespan-day-list'), dynamic_data.day);
		name.val("");
		do_error_check();

	});


	$('.form-inline.event_categories .add').click(function(){

		var id = event_category_list.children().length;

		var name = $(this).prev();
		
		var stats = {
			"name": escapeHtml(name.val()),
			"category_settings":{
				"hide": false,
				"player_usable": false
			},
			"event_settings": {
				"color": "Dark-Solid",
				"text": "text",
				"hide": false,
				"noprint": false
			}
		};
		static_data.event_data.categories.push(stats);
		add_category_to_list(event_category_list, id, stats);
		name.val('');
		repopulate_event_category_lists();
		do_error_check();

	});


	$('.form-inline.events .add').click(function(){
		
		edit_event_ui.create_new_event(escapeHtml($(this).prev().val()));
		$(this).prev().val('');

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

		var type = $(this).closest('.sortable-container').parent().attr('id');
		var key = $(this).closest('.sortable-container').attr('key')|0;

		var callback = false;

		switch(type){
			case "timespan_sortable":
				$(this).closest('.sortable-container').remove();
				$(this).closest('.sortable-container').parent().sortable('refresh');
				reindex_timespan_sortable();
				recalc_stats();
				break;

			case "global_week_sortable":
				$(this).closest('.sortable-container').remove();
				$(this).closest('.sortable-container').parent().sortable('refresh');
				reindex_weekday_sortable();
				break;

			case "season_sortable":
				$(this).closest('.sortable-container').remove();
				$(this).closest('.sortable-container').parent().sortable('refresh');
				type = 'seasons';
				reindex_season_sortable(key);
				reindex_location_list();
				break;

			case "location_list":
				$(this).closest('.sortable-container').remove();
				$(this).closest('.sortable-container').parent().sortable('refresh');
				type = 'seasons';
				reindex_location_list();
				repopulate_location_select_list();
				break;

			case "cycle_sortable":
				$(this).closest('.sortable-container').remove();
				$(this).closest('.sortable-container').parent().sortable('refresh');
				reindex_cycle_sortable();
				break;

			case "moon_list":
				$(this).closest('.sortable-container').remove();
				$(this).closest('.sortable-container').parent().sortable('refresh');
				reindex_moon_list();
				break;

			case "era_list":
				$(this).closest('.sortable-container').remove();
				$(this).closest('.sortable-container').parent().sortable('refresh');
				reindex_era_list();
				break;

			case "event_category_list":
				$(this).closest('.sortable-container').remove();
				$(this).closest('.sortable-container').parent().sortable('refresh');

				for(var i = 0; i < static_data.event_data.events.length; i++){
					if(static_data.event_data.events[i].category == key){
						static_data.event_data.events[i].category = -1;
					}
				}

				for(var i = 0; i < static_data.eras.length; i++){
					if(static_data.eras[i].settings.event_category == key){
						static_data.eras[i].settings.event_category = -1;
					}
				}

				reindex_event_category_list();
				
				break;

			case "events_sortable":

				var warnings = [];

				for(var i = 0; i < static_data.event_data.events.length; i++){
					if(static_data.event_data.events[i].data.connected_events !== undefined && static_data.event_data.events[i].data.connected_events.includes(key)){
						warnings.push(i);
					}
				}
				if(warnings.length > 0){

					callback = true;

					var html = [];
					html.push(`<h5>You are deleting "${static_data.event_data.events[key].name}" which referenced in the following events:</h5>`)
					html.push(`<ul>`);
					for(var i = 0; i < warnings.length; i++){
						var event_id = warnings[i];
						html.push(`<li>• ${static_data.event_data.events[event_id].name}</li>`);
					}
					html.push(`</ul>`);
					html.push(`<p>Please remove the conditions referencing "${static_data.event_data.events[key].name}" in these events before deleting.</p>`)

					warning_message.show(html.join(''));

					$(this).closest('.sortable-container').find('.btn_cancel').click();

				}else{

					events_sortable.children().eq(key).remove();

					reindex_events_sortable();

					for(var i = 0; i < static_data.event_data.events.length; i++){
						if(static_data.event_data.events[i].data.connected_events !== undefined && static_data.event_data.events[i].data.connected_events.length > 0){
							for(var j = 0; j < static_data.event_data.events[i].data.connected_events.length; j++){
								if(static_data.event_data.events[i].data.connected_events[j] > key){
									static_data.event_data.events[i].data.connected_events[j]--;
								}
							}
						}
					}
				}

				break;

			case "leap_day_list":
				$(this).closest('.sortable-container').remove();
				$(this).closest('.sortable-container').parent().sortable('refresh');
				static_data.year_data.leap_days.splice(key, 1)
				reindex_leap_day_list();
				recalc_stats();
				break;

			case "calendar_link_list":
				$(this).closest('.sortable-container').remove();
				$(this).closest('.sortable-container').parent().sortable('refresh');
				var target_hash = link_data.children[key];
				link_data.children.splice(key, 1);
				remove_hashes(target_hash);
				break;

		}


		if(!callback){

			evaluate_remove_buttons();

			do_error_check(type);

			removing = null;

			input_container.change();

		}

	});

	/* ------------------- Custom callbacks ------------------- */


	$(document).on('change', '.moon_inputs .cycle', function(){

		var key = $(this).closest('.sortable-container').attr('key')|0;

		var cycle = $(this).val()|0;

		static_data.moons[key].granularity = get_moon_granularity(cycle);

	});

	$(document).on('change', '.custom_phase', function(){

		var checked = $(this).is(':checked');

		var key = $(this).closest('.sortable-container').attr('key')|0;

		$(this).closest('.sortable-container').find('.no_custom_phase_container').toggleClass('hidden', checked);
		$(this).closest('.sortable-container').find('.custom_phase_container').toggleClass('hidden', !checked);

		if(checked){

			var value = "";

			for(var i = 0; i < static_data.moons[key].granularity-1; i++){
				value += `${i},`
			}

			value += `${i}`

			delete static_data.moons[key].cycle;
			delete static_data.moons[key].shift;
			
			$(this).closest('.sortable-container').find('.custom_cycle').val(value).change();

		}else{

			var strings = $(this).closest('.sortable-container').find('.custom_cycle').val().split(',');

			var value = (strings[strings.length-1]|0)+1;
			
			$(this).closest('.sortable-container').find('.cycle').val(value).change();
			$(this).closest('.sortable-container').find('.shift').val(0).change();

			delete static_data.moons[key].custom_cycle;
		}

	});



	$(document).on('keyup', '.custom_cycle', function(e){

		$(this).val($(this).val().replace(/[`!+~@#$%^&*()_|\-=?;:'".<>\{\}\[\]\\\/A-Za-z ]/g,'').replace(/,{2,}/g,","));

	});

	$(document).on('change', '.custom_cycle', function(e){

		$(this).val($(this).val().replace(/[`!+~@#$%^&*()_|\-=?;:'".<>\{\}\[\]\\\/A-Za-z ]/g,'').replace(/,{2,}/g,","));
		
		var value = $(this).val();

		var key = $(this).closest('.sortable-container').attr('key')|0;

		var granularity = Math.max.apply(null, value.split(','))+1;

		if(granularity > 32){

			invalid = true;

			$(this).toggleClass('invalid', invalid).attr('error_msg', invalid ? `${static_data.moons[key].name} has an invalid custom cycle. 31 is the highest possible number.` : '');

		}else{

			granularity = get_moon_granularity(cycle);

			static_data.moons[key].granularity = granularity;

			$(this).closest('.sortable-container').find('.custom_phase_text').text(`This moon has ${value.split(',').length} phases, with a granularity of ${granularity}.`);

			do_error_check();

		}

	});

	$(document).on('click', '.moon_shift_back, .moon_shift_forward', function(e){

		if($(this).hasClass('invalid')) return;

		var value = $(this).closest('.sortable-container').find('.custom_cycle').val().split(',');

		if($(this).hasClass('moon_shift_back')){

			value = [...value.slice(value.length-1), ...value.slice(0, value.length-1)];

		}else{

			value = [...value.slice(1, value.length), ...value.slice(0,1)];

		}

		var value = value.join(',');

		$(this).closest('.sortable-container').find('.custom_cycle').val(value);

		do_custom_cycle_change($(this).closest('.sortable-container').find('.custom_cycle'));

	});

	var do_custom_cycle_change = debounce(function(element){
		element.change();
	}, 350);


	$(document).on('change', '.leap-day .timespan-list', function(){
		var removes_week_day = $(this).closest('.sortable-container').find('.removes-day').is(':checked');
		repopulate_weekday_select($(this).closest('.sortable-container').find('.week-day-select'));
	});

	$(document).on('change', '.adds-week-day', function(){
		var container = $(this).closest('.sortable-container');
		var checked = $(this).is(':checked');
		container.find('.internal-list-name').change();
		container.find('.week_day_select_container').toggleClass('hidden', !checked);
		container.find('.adds_week_day_data_container').toggleClass('hidden', !checked);
		container.find('.adds_week_day_data_container input, .adds_week_day_data_container select').prop('disabled', !checked);
		container.find('.removes_day_container').toggleClass('hidden', checked);
		container.find('.week-day-select').toggleClass('inclusive', checked);
		if(container.find('.removes_day_container input').is(':checked')){
			container.find('.removes_day_container input').prop('checked', false)
			container.find('.removes_week_day_data_container').toggleClass('hidden', true);
			container.find('.removes_week_day_data_container input').prop('checked', false);
		}
		$('#overflow_explanation').toggleClass('hidden', !checked);
		if(checked){
			$('#month_overflow').prop('checked', true);
		}
		repopulate_weekday_select($(this).closest('.sortable-container').find('.week-day-select'));
	});

	$(document).on('change', '.removes-day', function(){
		var container = $(this).closest('.sortable-container');
		var checked = $(this).is(':checked');
		container.find('.removes_week_day_data_container').toggleClass('hidden', !checked);
		container.find('.adds_week_day_data_container').toggleClass('hidden', true);
		container.find('.adds_week_day_data_container input, .adds_week_day_data_container select').prop('disabled', true);
		container.find('.adds_week_day_container').toggleClass('hidden', checked);
		if(container.find('.adds_week_day_container input').is(':checked')){
			container.find('.adds_week_day_container input').prop('checked', false);
		}
		repopulate_weekday_select($(this).closest('.sortable-container').find('.week-day-select'));
	});

	$(document).on('change', '.removes-week-day', function(){
		var container = $(this).closest('.sortable-container');
		var checked = $(this).is(':checked');
		container.find('.week-day-select').toggleClass('inclusive', !checked);
		container.find('.week_day_select_container').toggleClass('hidden', !checked).prop('disabled', !checked);
		repopulate_weekday_select($(this).closest('.sortable-container').find('.week-day-select'));
	});

	$(document).on('change', '.unique-week-input', function(){
		var key = $(this).attr('key');
		if($(this).is(':checked')){
			var element = [];
			element.push("<div class='week_list'>");
				static_data.year_data.timespans[key].week = [];
				for(index = 0; index < static_data.year_data.global_week.length; index++){
					static_data.year_data.timespans[key].week.push(escapeHtml(static_data.year_data.global_week[index]));
					element.push(`<input type='text' class='detail-row form-control internal-list-name dynamic_input custom_week_day' data='year_data.timespans.${key}.week' key='${index}' value='${escapeHtml(static_data.year_data.global_week[index])}'/>`);
				}
			element.push("</div>");
			$(this).parent().parent().parent().parent().find(".detail-row.collapsible-content").append(element.join(""));
			$(this).parent().parent().next().find(".week-length").prop('disabled', false).val(static_data.year_data.global_week.length);
			$(this).parent().parent().parent().parent().find(".toggle").removeClass('hidden').prop('checked', true);
			$(this).parent().parent().parent().parent().find(".lbl-toggle").removeClass('hidden');
		}else{
			$(this).parent().parent().next().find(".week-length").prop('disabled', true).val(0);
			$(this).parent().parent().parent().parent().find(".detail-row.collapsible-content").html("");
			$(this).parent().parent().parent().parent().find(".toggle").addClass('hidden');
			$(this).parent().parent().parent().parent().find(".lbl-toggle").addClass('hidden');
			delete static_data.year_data.timespans[key].week;
			do_error_check();
		}

		evaluate_custom_weeks();

	});

	$(document).on('change', '.show_as_event', function(){
		var key = $(this).parent().parent().parent().next().attr('key');
		if($(this).is(':checked')){
			$(this).parent().parent().parent().next().removeClass('hidden');
			$(this).parent().parent().parent().next().find('.dynamic_input').prop('disabled', false).val(-1).change();
		}else{
			$(this).parent().parent().parent().next().addClass('hidden');
			$(this).parent().parent().parent().next().find('.dynamic_input').prop('disabled', true).change();
			delete static_data.eras[key].settings.event_category;
		}
	});


	$(document).on('change', '#era_list .date_control', function(){
		reindex_era_list();
	});

	$(document).on('change', '.week-length', function(){
		var key = $(this).parent().parent().parent().find('.unique-week-input').attr('key');
		var new_val = ($(this).val()|0);
		var current_val = ($(this).parent().parent().parent().parent().find(".week_list").children().length|0);
		if(new_val > current_val){
			var element = [];
			for(index = current_val; index < new_val; index++){
				static_data.year_data.timespans[key].week.push(`Week day ${(index+1)}`);
				element.push(`<input type='text' class='detail-row form-control internal-list-name custom_week_day dynamic_input' data='year_data.timespans.${key}.week' key='${index}' value='Week day ${(index+1)}'/>`);
			}
			$(this).parent().parent().parent().parent().find(".week_list").append(element.join(""));
		}else if(new_val < current_val){
			static_data.year_data.timespans[key].week = static_data.year_data.timespans[key].week.slice(0, new_val);
			$(this).parent().parent().parent().parent().find(".week_list").children().slice(new_val).remove();
		}

		if(new_val == 0){
			$(this).parent().parent().parent().parent().find(".toggle").addClass('hidden');
			$(this).parent().parent().parent().parent().find(".lbl-toggle").addClass('hidden');
			delete static_data.year_data.timespans[key].week;
			do_error_check();

		}else{
			$(this).parent().parent().parent().parent().find(".toggle").removeClass('hidden');
			$(this).parent().parent().parent().parent().find(".lbl-toggle").removeClass('hidden');
		}

		evaluate_custom_weeks();

	});

	$(document).on('change', '.custom_week_day', function(){

		populate_first_day_select();

	});


	$(document).on('change', '.cycle-name-length', function(){
		var key = $(this).attr('key');
		var new_val = ($(this).val()|0);
		var current_val = ($(this).parent().parent().parent().parent().find(".cycle_list").children().length|0);
		if(new_val > current_val){
			var element = [];
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

		var interval = $(this).closest('.sortable-container').find('.interval');
		var interval_val = interval.val()|0;
		var offset = $(this).closest('.sortable-container').find('.offset');
		var offset_val = offset.val()|0;

		if(interval_val === undefined || offset_val === undefined) return;

		text = "This timespan will appear every";

		if(interval_val > 1){
			text += " " + ordinal_suffix_of(interval_val)
		}

		text +=  " year";

		if(interval_val > 1){

			var start_year = ((interval_val+offset_val)%interval_val);
			if(start_year === 0){
				start_year = interval_val;
			}
			text += ", starting year " + start_year + `. (year ${start_year}, ${interval_val+start_year}, ${(interval_val*2)+start_year}...)`;

			offset.prop('disabled', false);

		}else{
			offset.prop('disabled', true).val(0);
		}
		
		text +=  ".";
		
		$(this).closest('.sortable-container').find('.timespan_variance_output').html(text);

		$('.leap_day_occurance_input').change();

	});


	$(document).on('change', '.leap_day_occurance_input', function(){

		var key = $(this).closest('.sortable-container').attr('key')|0;
		var interval = $(this).closest('.sortable-container').find('.interval');
		interval.val(interval.val().replace(/[|&;$%@"<> ()]/g, ""));
		var interval_val = interval.val();
		var offset = $(this).closest('.sortable-container').find('.offset');
		var offset_val = (offset.val()|0);
		var timespan = $(this).closest('.sortable-container').find('.timespan-list');
		var timespan_val = timespan.val();

		if(offset_val === undefined || interval_val === undefined) return;

		var global_regex = /[ `+~@#$%^&*()_|\-=?;:'".<>\{\}\[\]\\\/A-Za-z]/g;
		var local_regex = /^\!+[1-9]+[0-9]{0,}$/;
		var numbers_regex = /([1-9]+[0-9]{0,})/;

		var invalid = global_regex.test(interval_val);
		var values = interval_val.split(',');

		$(this).toggleClass('invalid', invalid).attr('error_msg', invalid ? `${static_data.year_data.leap_days[key].name} has an invalid interval formula.` : '');

		if($(this).hasClass('interval')){

			if(!invalid){

				for(var i = 0; i < values.length; i++){
					if(!local_regex.test(values[i])){
						invalid = true;
						break;
					}
				}

			}

			if(!invalid){

				var unsorted = [];

				for(var i = 0; i < values.length; i++){
					unsorted.push(Number(values[i].match(numbers_regex)[0]));
				}

				var sorted = unsorted.slice(0).sort(sorter).reverse();
				var result = [];

				for(var i = 0; i < sorted.length; i++){
					var key = unsorted.indexOf(sorted[i]);
					result.push(values[key]);
				}

				$(this).val(result.join(','));

				values = result;

			}

		}else{

			if(!invalid){

				var unsorted = [];

				for(var i = 0; i < values.length; i++){
					unsorted.push(Number(values[i].match(numbers_regex)[0]));
				}

				var sorted = unsorted.slice(0).sort(sorter).reverse();
				var result = [];

				for(var i = 0; i < sorted.length; i++){
					var key = unsorted.indexOf(sorted[i]);
					result.push(values[key]);
				}

				values = result;

			}

		}

		if(!invalid){

			varvalues = values.reverse();
			sorted = sorted.reverse();

			offset.val(Number(values[0]) == 1 ? 0 : offset.val());

			var timespan_item = timespan_sortable.children().eq(timespan_val);
			var timespan_interval = timespan_item.find('.interval').val()|0;
			var timespan_name = escapeHtml(timespan_item.find('.name-input').val());

			var text = "This leap day will appear every";

			for(var i = 0; i < values.length; i++){

				var leap_interval = sorted[i];
				var leap_offset = offset_val;

				var total_offset = ((leap_interval+leap_offset)%leap_interval);

				if(total_offset == 0){
					total_offset = sorted[i]*timespan_interval;
				}

				if(i == 0 && sorted[i] == 1){

					text += " year"

				}else if(i == 0){

					if(values.length > 1){
						text += ": <br>•";
					}

					if(timespan_interval == '1'){
						text += ` ${ordinal_suffix_of(sorted[i])} year`;
					}else{
						text += ` ${ordinal_suffix_of(sorted[i])} ${timespan_name}`;
					}
						
					text += ` (year ${total_offset}, ${(total_offset+sorted[i]*timespan_interval)}, ${total_offset+sorted[i]*2*timespan_interval}...)`;

				}

				if(i > 0 && sorted[i] > 1){

					if(values[i].indexOf('!') != -1){

						if(timespan_interval == '1'){
							text += `<br>• but not every ${ordinal_suffix_of(sorted[i])} year`;
						}else{
							text += `<br>• but not every ${ordinal_suffix_of(sorted[i])} ${timespan_name}`;
						}

						text += ` (year ${total_offset}, ${total_offset+sorted[i]*timespan_interval}, ${total_offset+sorted[i]*2*timespan_interval}...)`;


					}else{

						if(timespan_interval == '1'){
							text += `<br>• but also every ${ordinal_suffix_of(sorted[i])} year`;
						}else{
							text += `<br>• but also every ${ordinal_suffix_of(sorted[i])} ${timespan_name}`;
						}

						text += ` (year ${total_offset}, ${total_offset+sorted[i]*timespan_interval}, ${total_offset+sorted[i]*2*timespan_interval}...)`;

					}

				}

			}

			$(this).closest('.sortable-container').find('.leap_day_variance_output').html(text);

		}

	});

	$(document).on('change', '.timespan_length', function(){
		repopulate_day_select($('.timespan-day-list'));
	});

	$('#enable_weather').change(function(){
		var checked = $(this).prop('checked');
		$('#weather_inputs').toggleClass('hidden', !checked);
		$('#weather_inputs').find('select, input').prop('disabled', !checked);
	});

	$(document).on('change', '.year-input', function(){
		repopulate_timespan_select($(this).closest('.date_control').find('.timespan-list'));
		repopulate_day_select($(this).closest('.date_control').find('.timespan-day-list'))
	});

	$('#reseed_seasons').click(function(){
		$('#seasons_seed').val(Math.abs((Math.random().toString().substr(7)|0))).change();
	});




	$('#temp_sys').change(function(){

		var new_val = $(this).val();
		var old_val = static_data.seasons.global_settings.temp_sys;

		if((new_val == "metric" || new_val == "both_m") && (old_val == "imperial" || old_val == "both_i")){

			$('input[key="temp_low"], input[key="temp_high"]').each(function(){

				var val = $(this).val()|0;

				$(this).val(precisionRound(climate_generator.fahrenheit_to_celcius(val), 4));

			}).change();

		}else if((new_val == "imperial" || new_val == "both_i") && (old_val == "metric" || old_val == "both_m")){

			$('input[key="temp_low"], input[key="temp_high"]').each(function(){

				var val = $(this).val()|0;

				$(this).val(precisionRound(climate_generator.celcius_to_fahrenheit(val), 4)).change;

			}).change();

		}

	})







	$(document).on('change', '.invalid', function(){
		if($(this).val() !== null){
			$(this).removeClass('invalid');
		}
	});

	$(document).on('change', '.season-duration', function(){
		evaluate_season_lengths();
		rebuild_climate();
	});


	$('#refresh_calendar_list_select').click(function(){
		populate_calendar_lists();
	});

	$('#link_calendar').prop('disabled', true);

	calendar_link_select.change(function(){
		$('#link_calendar').prop('disabled', $(this).val() == "None");
	});

	$('#link_calendar').click(function(){
		var target_hash = calendar_link_select.val();
		link_data.children.push(target_hash);
		update_hashes(target_hash);
		$('#link_calendar').prop('disabled', true);
	});

	input_container.change(function(e){

		if(e.originalEvent){
			var target = $(e.originalEvent.target);	
		}else{
			var target = $(e.target);	
		}

		if(target.hasClass('invalid')){
			return;
		}

		if(target.attr('class') !== undefined && target.attr('class').indexOf('dynamic_input') > -1){

			var data = target.attr('data');
			var type = data.split('.');

			var current_calendar_data = static_data[type[0]];

			for(var i = 1; i < type.length-1; i++){
				current_calendar_data = current_calendar_data[type[i]];
			}

			var key = target.attr('key');

			if(data.includes('cycles') && data.includes('names')){

				current_calendar_data[type[type.length-1]] = [];

				target.closest('.cycle_list').children().each(function(i){
					current_calendar_data[type[type.length-1]][i] = escapeHtml($(this).val());
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
							var value = escapeHtml(target.val());
							break;
					}

					if(target.attr('class').indexOf('slider_input') > -1){
						value = value/100;
					}
					
					current_calendar_data[key] = value;

				}
			}

			if(data.includes('event_data.categories')){
				var key = data.split('.')[2]|0;
				for(var i = 0; i < static_data.event_data.events.length; i++){
					if(static_data.event_data.events[i].category == key){
						static_data.event_data.events[i].settings = clone(static_data.event_data.categories[key].event_settings);
					}
				}				
			}

			var refresh = target.attr('refresh') === "true" || refresh === undefined;

			if(type[0] === "seasons" && key == "name"){
				location_list.children().each(function(i){
					$(this).find('.location_season').each(function(j){
						$(this).prop('key', j);
						$(this).children().first().prop('id', `collapsible_seasons_${i}_${j}`);
						$(this).children().first().next().prop('for', `collapsible_seasons_${i}_${j}`).text(`Season name: ${static_data.seasons.data[j].name}`);
					});
				});
				repopulate_location_select_list();
			}

			if(refresh || refresh === undefined){
				do_error_check(type[0]);
			}

		}else if(target.attr('class') !== undefined && target.attr('class').indexOf('static_input') > -1){

			var type = target.attr('data').split('.');

			var current_calendar_data = static_data;

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
					value = escapeHtml(target.val());
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
}

var do_error_check = debounce(function(type, rebuild){
	error_check(type, rebuild);
	recalc_stats();
}, 150);

function add_weekday_to_sortable(parent, key, name){

	var element = [];

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

function add_timespan_to_sortable(parent, key, data){
	var element = [];
	element.push(`<div class='sortable-container ${data.type} collapsed' type='${data.type}' key='${key}'>`);
		element.push("<div class='main-container'>");
			element.push("<div class='handle icon-reorder'></div>");
			element.push("<div class='expand icon-collapse'></div>");
			element.push("<div class='name-container'>");
				element.push(`<input type='text' value='${data.name}' tabindex='${(100+key)}'class='name-input small-input form-control dynamic_input' data='year_data.timespans.${key}' key='name'/>`);
			element.push("</div>");
			element.push(`<div class='length_input'><input type='number' min='1' class='length-input form-control dynamic_input timespan_length' data='year_data.timespans.${key}' key='length' tabindex='${(100+key)}' value='${data.length}'/></div>`);
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
						
					element.push(data.type == "month" ? "Month" : "Intercalary month");

				element.push("</div>");

				element.push("<div class='detail-column full'>");

					element.push("<div class='detail-row'>");
							element.push("<div class='detail-text center-text bold-text'>Leaping settings</div>");
					element.push("</div>");

					element.push("<div class='detail-row'>");
						element.push("<div class='detail-column half'>");
							element.push("<div class='detail-row'>");
									element.push("<div class='detail-text'>Interval:</div>");
									element.push(`<input type='number' min='1' class='form-control timespan_occurance_input interval dynamic_input small-input' data='year_data.timespans.${key}' key='interval' value='${data.interval}' />`);
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
						element.push("<div class='detail-text italics-text timespan_variance_output'>");

							text = "This timespan will appear every";

							if(data.interval > 1){
								text += " " + ordinal_suffix_of(data.interval)
							}

							text +=  " year";

							if(data.interval > 1){

								var start_year = ((data.interval+data.offset)%data.interval);
								if(start_year === 0){
									start_year = data.interval;
								}
								text += ", starting year " + start_year + `. (year ${start_year}, ${data.interval+start_year}, ${(data.interval*2)+start_year}...)`;

							}

							text +=  ".";
							

							element.push(text);

						element.push("</div>");
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
									element.push(`<input type='text' class='form-control internal-list-name dynamic_input custom_week_day' data='year_data.timespans.${key}.week' key='${index}' value='${data.week[index]}'/>`);
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

	var element = [];

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

					element.push("<div class='date_control'>");
										
						element.push(`<input type='hidden' class='form-control-sm year-input hidden' value='0'>`);

						element.push("<div class='detail-row'>");
							element.push("<div class='detail-column'>");
								element.push("<div class='detail-row'>");
									element.push("<div class='detail-column'>");
										element.push("<div class='detail-text'>Timespan: </div>");
									element.push("</div>");
									element.push("<div class='detail-column'>");
										element.push(`<select type='number' class='custom-select form-control-sm leap_day_occurance_input timespan-list dynamic_input full' data='year_data.leap_days.${key}' key='timespan'>`);
										for(var j = 0; j < static_data.year_data.timespans.length; j++)
										{
											element.push(`<option value="${j}" ${(j==data.timespan ? "selected" : "")}>${static_data.year_data.timespans[j].name}</option>`);
										}
										element.push("</select>");
									element.push("</div>");
								element.push("</div>");
							element.push("</div>");
						element.push("</div>");

						element.push(`<div class='detail-row removes_day_container ${(!data.adds_week_day && !data.intercalary ? "" : "hidden")}'>`);
							element.push("<div class='detail-column twothird'>");
								element.push("<div class='detail-row'>");
										element.push("<div class='detail-text'>Removes day instead: </div>");
										element.push(`<input type='checkbox' class='form-control removes-day dynamic_input' data='year_data.leap_days.${key}' key='removes_day' ${(data.removes_day ? "checked" : "")} />`);
								element.push("</div>");	
							element.push("</div>");
						element.push("</div>");

						element.push(`<div class='detail-row adds_week_day_container ${(!data.removes_day && !data.intercalary ? "" : "hidden")}'>`);
							element.push("<div class='detail-column half'>");
								element.push("<div class='detail-row'>");
										element.push("<div class='detail-text'>Adds week day: </div>");
										element.push(`<input type='checkbox' class='form-control adds-week-day dynamic_input' data='year_data.leap_days.${key}' key='adds_week_day' ${(data.adds_week_day ? "checked" : "")} />`);
								element.push("</div>");	
							element.push("</div>");
						element.push("</div>");

						element.push(`<div class='adds_week_day_data_container ${(!data.removes_day && data.adds_week_day && !data.intercalary ? "" : "hidden")}'>`);
							element.push(`<div class='detail-row'>`);
								element.push("<div class='detail-column'>");
									element.push("<div class='detail-row'>");
										element.push("<div class='detail-text'>Week day name: </div>");
										element.push(`<input type='text' class='form-control internal-list-name dynamic_input' data='year_data.leap_days.${key}' key='week_day' value='${(data.week_day && !data.intercalary ? data.week_day : 'Weekday')}' ${(data.adds_week_day && !data.intercalary ? "" : "disabled")}/>`);
									element.push("</div>");
								element.push("</div>");
							element.push("</div>");
						element.push("</div>");

						element.push(`<div class='removes_week_day_data_container ${(data.removes_day && !data.adds_week_day && !data.intercalary ? "" : "hidden")}'>`);
							element.push(`<div class='detail-row'>`);
								element.push("<div class='detail-column twothird'>");
									element.push("<div class='detail-row'>");
											element.push("<div class='detail-text'>Removes week day: </div>");
											element.push(`<input type='checkbox' class='form-control removes-week-day dynamic_input' data='year_data.leap_days.${key}' key='removes_week_day' ${(data.removes_week_day ? "checked" : "")} />`);
									element.push("</div>");	
								element.push("</div>");
							element.push("</div>");
						element.push("</div>");

						element.push(`<div class='detail-row week_day_select_container ${(!data.removes_week_day && !data.adds_week_day ? "hidden" : "")}'>`);
							element.push("<div class='detail-column full'>");
								element.push("<div class='detail-row'>");
									element.push("<div class='detail-text'>Select weekday: </div>");
								element.push("</div>");
								element.push("<div class='detail-row'>");
									element.push(`<select type='number' class='custom-select form-control-sm dynamic_input full week-day-select ${(data.adds_week_day ? "inclusive" : "")}' data='year_data.leap_days.${key}' key='day'>`);

										if(data.timespan === undefined){
											var week = static_data.year_data.global_week;
										}else{
											var week = static_data.year_data.timespans[data.timespan].week ? static_data.year_data.timespans[data.timespan].week : static_data.year_data.global_week;
										}
										if(data.adds_week_day){
											element.push(`<option ${data.day == 0 ? 'selected' : ''} value='0'>Before ${escapeHtml(week[0])}</option>`);
										}
										for(var i = 0; i < week.length; i++){
											element.push(`<option ${data.day == i ? 'selected' : ''} value='${i+1}'>${escapeHtml(week[i])}</option>`);
										}

									element.push("</select>");
								element.push("</div>");
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
						element.push("<div class='detail-column twothird'>");
							element.push("<div class='detail-row'>");
									element.push("<div class='detail-text'>Interval:</div>");
									element.push(`<input type='text' class='form-control leap_day_occurance_input interval dynamic_input' data='year_data.leap_days.${key}' key='interval' value='${data.interval}' />`);
							element.push("</div>");	
						element.push("</div>");

						element.push("<div class='detail-column third'>");
							element.push("<div class='detail-row'>");
								element.push("<div class='detail-text'>Offset:</div>");
								element.push(`<input type='number' class='form-control leap_day_occurance_input offset dynamic_input' min='0' data='year_data.leap_days.${key}' key='offset' value='${data.offset}'`);
								element.push(data.interval === 1 ? " disabled" : "");
								element.push("/>");
							element.push("</div>");
						element.push("</div>");
					element.push("</div>");

					var values = data.interval.split(',').reverse();
					var sorted = [];

					var numbers_regex = /([1-9]+[0-9]*)/;

					for(var i = 0; i < values.length; i++){
						sorted.push(Number(values[i].match(numbers_regex)[0]));
					}

					var text = "This leap day will appear every";

					var timespan_interval = static_data.year_data.timespans[data.timespan].interval;

					for(var i = 0; i < values.length; i++){

						var leap_interval = sorted[i];
						var leap_offset = data.offset;
						
						var total_offset = (((leap_interval-leap_offset)%leap_interval)*timespan_interval);

						if(total_offset == 0){
							total_offset = sorted[i]*timespan_interval;
						}

						if(i == 0 && sorted[i] == 1){

							text += " year"

						}else if(i == 0){

							if(values.length > 1){
								text += ": <br>•";
							}

							if(static_data.year_data.timespans[data.timespan].interval == 1){
								text += ` ${ordinal_suffix_of(sorted[i])} year`;
							}else{
								text += ` ${ordinal_suffix_of(timespan_interval*sorted[i])} ${static_data.year_data.timespans[data.timespan].name}`;
							}

							text += ` (year ${total_offset}, ${(total_offset+sorted[i]*timespan_interval)}, ${total_offset+sorted[i]*2*timespan_interval}...)`;

						}

						if(i > 0 && sorted[i] > 1){

							if(values[i].indexOf('!') != -1){
								if(timespan_interval == 1){
									text += `<br>• but not every ${ordinal_suffix_of(sorted[i])} year`;
								}else{
									text += `<br>• but not every ${ordinal_suffix_of(timespan_interval*sorted[i])} ${static_data.year_data.timespans[data.timespan].name}`;
								}

								if(values[i].indexOf('+') == -1){
									text += ` (year ${total_offset}, ${total_offset+sorted[i]}, ${total_offset+sorted[i]*2}...)`;
								}

							}else{

								if(timespan_interval == 1){
									text += `<br>• but also every ${ordinal_suffix_of(sorted[i])} year`;
								}else{
									text += `<br>• but also every ${ordinal_suffix_of(timespan_interval*sorted[i])} ${static_data.year_data.timespans[data.timespan].name}`;
								}

								if(values[i].indexOf('+') == -1){
									text += ` (year ${total_offset}, ${total_offset+sorted[i]}, ${total_offset+sorted[i]*2}...)`;
								}

							}

						}

					}

					element.push("<div class='detail-row'>");
						element.push(`<div class='detail-text italics-text leap_day_variance_output'>${text}</div>`);
					element.push("</div>");
				element.push("</div>");
			element.push("</div>");
		element.push("</div>");
		element.push("</div>");

	element.push("</div>");

	parent.append(element.join(""));

}

function add_moon_to_list(parent, key, data){

	var element = [];

	element.push(`<div class='sortable-container moon_inputs expanded' key='${key}'>`);
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
				element.push("<div class='detail-column twothird'>");
					element.push("<div class='detail-row'>");
						element.push("<div class='detail-text'>Custom phase count: </div>");
						element.push(`<input type='checkbox' class='dynamic_input custom_phase' data='moons.${key}' key='custom_phase'`);
						element.push(data.custom_phase ? "checked" : "");
						element.push("/>");
					element.push("</div>");
				element.push("</div>");
			element.push("</div>");
				
			element.push("<div class='separator'></div>");

			element.push(`<div class='full no_custom_phase_container ${data.custom_phase ? "hidden" : ""}'>`);
				element.push("<div class='detail-row'>");
					element.push("<div class='detail-column half'>");
						element.push("<div class='detail-row'>");
							element.push("<div class='detail-text'>Cycle:</div>");
							element.push(`<input type='number' class='form-control dynamic_input cycle' data='moons.${key}' key='cycle' value='${!data.custom_phase ? data.cycle : ''}' />`);
						element.push("</div>");
					element.push("</div>");
					element.push("<div class='detail-column half'>");
						element.push("<div class='detail-row'>");
							element.push("<div class='detail-text'>Shift:</div>");
							element.push(`<input type='number' class='form-control dynamic_input shift' data='moons.${key}' key='shift' value='${!data.custom_phase ? data.shift : ''}' />`);
						element.push("</div>");
					element.push("</div>");
				element.push("</div>");
			element.push("</div>");

			element.push(`<div class='full custom_phase_container ${!data.custom_phase ? "hidden" : ""}'>`);
				element.push("<div class='detail-row'>");
					element.push("<div class='detail-text'>Custom phase:</div>");
				element.push("</div>");
				element.push("<div class='detail-row'>");
					element.push("<div class='detail-column detail-shrink'>");
						element.push("<button type='button' class='btn btn-sm btn-danger moon_shift_back'><</button>");
					element.push("</div>");
					element.push("<div class='detail-column detail-grow'>");
						element.push(`<input type='text' class='form-control form-control-sm dynamic_input custom_cycle full' data='moons.${key}' key='custom_cycle' value='${data.custom_phase ? data.custom_cycle : ''}' />`);
					element.push("</div>");
					element.push("<div class='detail-column detail-shrink'>");
						element.push("<button type='button' class='btn btn-sm btn-success moon_shift_forward'>></button>");
					element.push("</div>");
				element.push("</div>");
				element.push(`<div class='detail-row custom_phase_text italics-text small-text'>${data.custom_phase ? `This moon has ${data.custom_cycle.split(',').length} phases, with a granularity of ${data.granularity}.` : ''}</div>`);
			element.push("</div>");
				
			element.push("<div class='separator'></div>");

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
	var element = [];
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
						element.push("<div class='detail-text'>Peak duration:</div>");
						var duration = data.duration == '' || data.duration == undefined ? 0 : data.duration;
						element.push(`<input type='number' step='any' class='form-control dynamic_input duration' data='seasons.data.${key}' key='duration' min='0' value='${duration}' />`);
					element.push("</div>");
				element.push("</div>");
				element.push("<div class='detail-column half'>");
					element.push("<div class='detail-row'>");
						element.push("<div class='detail-text'>Duration:</div>");
						var transition_length = data.transition_length == '' || data.transition_length == undefined ? 90 : data.transition_length;
						element.push(`<input type='number' step='any' class='form-control dynamic_input transition_length' data='seasons.data.${key}' key='transition_length' min='1' value='${transition_length}' />`);
					element.push("</div>");
				element.push("</div>");
			element.push("</div>");
				
			element.push("<div class='separator'></div>");

			element.push("<div class='clock_inputs'>");
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
		element.push("</div>");
		
	parent.append(element.join(""));
}

function add_location_to_list(parent, key, data){

	var element = [];

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
				element.push(`<label for='collapsible_seasons_${key}_${i}' class='lbl-toggle'>Season name: ${static_data.seasons.data[i].name}</label>`);
				element.push("<div class='detail-column collapsible-content'>");

					element.push("<div class='detail-row'>");
						element.push("<div class='detail-column full'>");
							element.push("Overriding name:");
						element.push("</div>");
					element.push("</div>");

					element.push("<div class='detail-row'>");
						element.push("<div class='detail-column twothird'>");
							if(data.seasons[i].custom_name){
								element.push(`<input type='text' class='form-control form-control-sm full dynamic_input' data='seasons.locations.${key}.seasons.${i}' key='name' value='${data.seasons[i].name}'>`);
							}else{
								element.push(`<input type='text' class='form-control form-control-sm full dynamic_input' data='seasons.locations.${key}.seasons.${i}' key='name' value='${static_data.seasons.data[i].name}' disabled>`);
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
							element.push("Precipitation chance: (%)");
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
							element.push("Precipitation intensity: (%)");
						element.push("</div>");
						element.push("<div class='detail-column threequarter'>");
							element.push("<div class='slider_percentage'></div>");
						element.push("</div>");
						element.push("<div class='detail-column quarter'>");
							element.push(`<input type='number' class='form-control form-control-sm full dynamic_input slider_input' data='seasons.locations.${key}.seasons.${i}.weather' key='precipitation_intensity' value='${data.seasons[i].weather.precipitation_intensity*100}'>`);
						element.push("</div>");
					element.push("</div>");

					element.push("<div class='clock_inputs'>");
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

				element.push("<div class='clock_inputs'>");
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

	var element = [];

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
									element.push(`<input type='number' class='form-control length dynamic_input' min='1' data='cycles.${key}' key='length' value='${data.length}' />`);
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

	var element = [];

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
							for(var i = 0; i < static_data.event_data.categories.length; i++)
							{
								var name = static_data.event_data.categories[i].name;
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
				element.push("<div class='detail-column full date_control'>");
					element.push("<div class='detail-row'>");
						element.push("<div class='detail-column quarter'>");
							element.push("<div class='detail-text'>Year:</div>");
						element.push("</div>");
						element.push("<div class='detail-column threequarter'>");
							element.push(`<input type='number' class='form-control small-input dynamic_input threequarter year-input' refresh data='eras.${key}.date' key='year' value='${data.date.year}'/>`);
						element.push("</div>");
					element.push("</div>");

					element.push("<div class='detail-row'>");
						element.push("<div class='detail-column quarter'>");
							element.push("<div class='detail-text'>Timespan:</div>");
						element.push("</div>");
						element.push("<div class='detail-column threequarter'>");
							element.push(`<select type='number' class='custom-select form-control-sm timespan-list dynamic_input threequarter' refresh data='eras.${key}.date' key='timespan'>`);
							element.push("</select>");
						element.push("</div>");
					element.push("</div>");

					element.push("<div class='detail-row'>");
						element.push("<div class='detail-column quarter'>");
							element.push("<div class='detail-text'>Day:</div>");
						element.push("</div>");
						element.push("<div class='detail-column threequarter'>");
							element.push(`<select type='number' class='custom-select form-control-sm timespan-day-list dynamic_input threequarter' refresh data='eras.${key}.date' key='day'>`);
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
							element.push(`<input type='checkbox' class='form-control dynamic_input restart' data='eras.${key}.settings' key='restart' ${(data.settings.restart ? "checked" : "")} />`);
						element.push("</div>");
					element.push("</div>");

				element.push("</div>");

			element.push("</div>");

		element.push("</div>");

	element.push("</div>");

	var select = parent.append(element.join(""));

}

function add_category_to_list(parent, key, data){

	var element = [];

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
							element.push(`<select class='custom-select form-control-sm dynamic_input event-text-input color_display' data='event_data.categories.${key}.event_settings' key='color'>`);
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
							element.push(`<select class='custom-select form-control-sm dynamic_input event-text-input text_display' data='event_data.categories.${key}.event_settings' key='text'>`);
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
				
				element.push("<div class='detail-row'>");
					element.push("<div class='detail-column half'>");
						element.push("<div class='detail-text'>Fully hide event:</div>");
					element.push("</div>");
					element.push("<div class='detail-column half'>");
						element.push(`<input type='checkbox' class='form-control dynamic_input' data='event_data.categories.${key}.event_settings' key='hide_full' ${(data.event_settings.hide_full ? "checked" : "")} />`);
					element.push("</div>");
				element.push("</div>");
			
				element.push("<div class='detail-row'>");
					element.push("<div class='detail-column half'>");
						element.push("<div class='detail-text'>Hide event:</div>");
					element.push("</div>");
					element.push("<div class='detail-column half'>");
						element.push(`<input type='checkbox' class='form-control dynamic_input local_hide' data='event_data.categories.${key}.event_settings' key='hide' ${(data.event_settings.hide ? "checked" : "")} />`);
					element.push("</div>");
				element.push("</div>");
			
				element.push("<div class='detail-row'>");
					element.push("<div class='detail-column half'>");
						element.push("<div class='detail-text'>Don't print event:</div>");
					element.push("</div>");
					element.push("<div class='detail-column half'>");
						element.push(`<input type='checkbox' class='form-control dynamic_input noprint' data='event_data.categories.${key}.event_settings' key='noprint' ${(data.event_settings.noprint ? "checked" : "")} />`);
					element.push("</div>");
				element.push("</div>");

			element.push("</div>");

		element.push("</div>");

	element.push("</div>");

	parent.append(element.join(""));
}


function add_event_to_sortable(parent, key, data){

	var element = [];

	element.push(`<div class='sortable-container events_input' key='${key}'>`);
		element.push("<div class='main-container'>");
			element.push("<div class='handle icon-reorder'></div>");
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


function add_link_to_list(parent, key, calendar_name){

	var element = [];

	element.push(`<div class='sortable-container events_input' key='${key}'>`);
		element.push("<div class='main-container'>");
			element.push(`<div>${calendar_name}</div>`);
		element.push("</div>");
		element.push("<div class='remove-container'>");
			element.push("<div class='remove-container-text'>Are you sure you want to unlink this?</div>");
			element.push("<div class='btn_remove btn btn-danger icon-trash'></div>");
			element.push("<div class='btn_cancel btn btn-danger icon-remove'></div>");
			element.push("<div class='btn_accept btn btn-success icon-ok'></div>");
		element.push("</div>");

	element.push("</div>");


	parent.append(element.join(""));
}

function error_check(parent, rebuild){

	if(wizard) return;

	errors = [];

	for(var era_i = 0; era_i < static_data.eras.length; era_i++){
		var era = static_data.eras[era_i];
		if(static_data.year_data.timespans[era.date.timespan]){
			if(!does_timespan_appear(static_data, convert_year(static_data, era.date.year), era.date.timespan).result){
				errors.push(`Era <i>${era.name}</i> is currently on a leaping month. Please move it to another month.`);
			}
		}else{
			errors.push(`Era <i>${era.name}</i> doesn't have a valid month.`);
		}
	}

	for(var era_i = 0; era_i < static_data.eras.length-1; era_i++){
		var curr = static_data.eras[era_i];
		var next = static_data.eras[era_i+1];
		if(curr.year == next.date.year && curr.settings.ends_year && next.settings.ends_year){
			errors.push(`Eras <i>${curr.name}</i> and <i>${next.name}</i> both end the same year. This is not possible.`);
		}
		if(curr.date.year == next.date.year && curr.date.timespan == next.date.timespan && curr.date.day == next.date.day){
			errors.push(`Eras <i>${static_data.eras[era_i].name}</i> and <i>${static_data.eras[era_i+1].name}</i> both share the same date. One has to come after another.`);
		}
	}
	
	for(var season_i = 0; season_i < static_data.seasons.data.length; season_i++){
		var season = static_data.seasons.data[season_i];
		if(season.transition_length == 0){
			errors.push(`Season <i>${season.name}</i> can't have 0 transition length.`);
		}
	}

	if(static_data.year_data.timespans.length == 0){

		errors.push(`You need at least one month.`);

	}

	if(static_data.year_data.global_week.length == 0){

		errors.push(`You need at least one global week day.`);

	}

	if(errors.length == 0 && $('.invalid').length == 0){

		evaluate_save_button();

		close_error_message();

		if(parent === "eras"){
			recalculate_era_epochs();
		}
		if(rebuild === undefined || rebuild){
			rebuild_calendar('calendar', dynamic_data);
			update_current_day(true);
		}else{

			if(parent !== undefined && (parent === "seasons")){
				rebuild_climate();
			}else{
				update_current_day(true);
				evaluate_sun();
			}
		}
		

	}else{

		var text = [];

		$('.invalid').each(function(){
			errors.push($(this).attr('error_msg'));
		})
		
		text.push(`Errors:<ol>`);

		for(var i = 0; i < errors.length; i++){

			text.push(`<li>${errors[i]}</li>`);

		}
		text.push(`</ol>`);

		error_message(text.join(''));

		save_button.prop('disabled', true);
		create_button.prop('disabled', true);

	}

}



function update_cycle_example_text(){
	$('#cycle_test_result').text(get_cycle(($('#cycle_test_input').val()|0)).text);
}

function evaluate_remove_buttons(){
	$('.month .btn_remove, .week_day .btn_remove').each(function(){
		$(this).toggleClass('disabled', $(this).closest('.sortable').children().length == 1);
	});
}

function reindex_weekday_sortable(){

	var tabindex = 1;

	static_data.year_data.global_week = [];

	global_week_sortable.children().each(function(i){

		$(this).find(".name-input").attr("key", i);
		$(this).find(".name-input").prop("tabindex", tabindex)
		tabindex++;

		static_data.year_data.global_week[i] = escapeHtml($(this).find('.name-input').val());

	});

	populate_first_day_select();

	do_error_check();
	evaluate_remove_buttons();

}

function populate_first_day_select(val){

	var custom_week = false;
	timespan_sortable.children().each(function(){
		if($(this).find('.unique-week-input').is(':checked')){
			custom_week = true;
		}
	});	

	var i = 0;

	var timespan = false;

	if(custom_week){
		while(true){
			var timespans = get_timespans_in_year(static_data, i, true);
			if(timespans.length > 0){
				if(static_data.year_data.timespans[timespans[0].id].week !== undefined){
					timespan = timespans[0].id;
				}
				break;
			}
			if(i > 1000) break;
			i++;
		}
	}

	var week = timespan === false ? static_data.year_data.global_week : static_data.year_data.timespans[timespan].week;

	var html = [];

	for(var i = 0; i < week.length; i++){
		
		html.push(`<option value='${i+1}'>${escapeHtml(week[i])}</option>`);

	}

	if(val !== undefined){
		var selected_first_day = val;
	}else{
		var selected_first_day = first_day.val() ? first_day.val() : 0;
	}

	first_day.html(html.join('')).val(selected_first_day);

}

function repopulate_weekday_select(elements){

	elements.each(function(){

		var timespan = $(this).attr('timespan')|0;

		var inclusive = $(this).hasClass('inclusive');

		if(timespan === undefined){

			var week = static_data.year_data.global_week;

		}else{

			var week = static_data.year_data.timespans[timespan].week ? static_data.year_data.timespans[timespan].week : static_data.year_data.global_week;

		}

		var selected = $(this).val()|0;

		selected = selected > week.length ? week.length-1 : selected;

		var html = [];

		if(inclusive){
			html.push(`<option value='0'>Before ${escapeHtml(week[0])}</option>`);
		}

		for(var i = 0; i < week.length; i++){
			
			html.push(`<option value='${i+1}'>${escapeHtml(week[i])}</option>`);

		}

		$(this).html(html.join('')).val(selected);

	});

}

function reindex_timespan_sortable(){

	var tabindex = 100;
	
	static_data.year_data.timespans = [];

	timespan_sortable.children().each(function(i){

		$('.dynamic_input', this).each(function(){
			$(this).attr('data', $(this).attr('data').replace(/[0-9]+/g, i));
		});

		$(this).find('.name-input').prop('tabindex', tabindex+1)
		tabindex++;
		$(this).find('.length-input').prop('tabindex', tabindex+1)
		tabindex++;
		$(this).find('.toggle').prop('id', 'collapsible_week_'+i)
		$(this).find('.lbl-toggle').prop('for', 'collapsible_week_'+i)

		static_data.year_data.timespans[i] = {
			'name': escapeHtml($(this).find('.name-input').val()),
			'type': $(this).attr('type'),
			'length': Number($(this).find('.length-input').val()),
			'interval': Number($(this).find('.interval').val()),
			'offset': Number($(this).find('.offset').val())
		};

		if($(this).find('.unique-week-input').is(':checked')){
			static_data.year_data.timespans[i].week = [];
			$(this).find('.collapsible-content').children().first().children().each(function(j){
				static_data.year_data.timespans[i].week[j] = escapeHtml($(this).val());
			});
		}

	});

	repopulate_month_lists();

	do_error_check();

	evaluate_remove_buttons();

	evaluate_custom_weeks();

}

function reindex_leap_day_list(){

	var tabindex = 200;
	
	static_data.year_data.leap_days = [];

	leap_day_list.children().each(function(i){

		$('.dynamic_input', this).each(function(){
			$(this).attr('data', $(this).attr('data').replace(/[0-9]+/g, i));
		});

		$(this).find('.name-input').prop('tabindex', tabindex+1)
		tabindex++;

		static_data.year_data.leap_days[i] = {
			'name': escapeHtml($(this).find('.name-input').val()),
			'intercalary': $(this).attr('type') == 'intercalary',
			'timespan': Number($(this).find('.timespan-list').val()),
			'removes_day': $(this).find('.removes-day').is(':checked'),
			'removes_week_day': $(this).find('.removes-week-day').is(':checked'),
			'adds_week_day': $(this).find('.adds-week-day').is(':checked'),
			'day': Number($(this).find('.week-day-select').val()),
			'week_day': escapeHtml($(this).find('.internal-list-name').val()),
			'interval': $(this).find('.interval').val(),
			'offset': Number($(this).find('.offset').val())
		};

	});
	
	do_error_check();

	evaluate_remove_buttons();

}

function evaluate_custom_weeks(){

	var custom_week = false;
	timespan_sortable.children().each(function(i){
		if($(this).find('.unique-week-input').is(':checked')){
			custom_week = true;
		}
	});

	if(custom_week){
		$('#month_overflow').prop('checked', !custom_week).change();
	}

	$('#month_overflow').prop('disabled', custom_week);
	$('#overflow_explanation').toggleClass('hidden', !custom_week)

	populate_first_day_select();

}

function reindex_season_sortable(key){

	var tabindex = 400;

	static_data.seasons.data = [];

	season_sortable.children().each(function(i){

		$(this).attr("key", i);
		$(this).find(".name-input").prop("tabindex", tabindex)
		tabindex++;

		static_data.seasons.data[i] = {
			"name": escapeHtml($(this).find('.name-input').val()),
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

		static_data.seasons.data[i].transition_length = parseFloat($(this).find('.transition_length').val());
		static_data.seasons.data[i].duration = parseFloat($(this).find('.duration').val());

	});

	if(key !== undefined){
		location_list.find(`.location_season[key="${key}"]`).remove();
	}

	do_error_check('seasons');

}

function reindex_location_list(){

	var tabindex = 500;

	static_data.seasons.locations = [];

	location_list.children().each(function(i){

		var data = {};

		$(this).attr("key", i);
		$(this).find(".name-input").prop("tabindex", tabindex);
		tabindex++;

		data = {
			"name": escapeHtml($(this).find(".name-input").val()),
			"seasons": [],
			"settings": {
				"timezone": {
					"hour": ($(this).find("input[key='timezone_hour']").val()|0),
					"minute": ($(this).find("input[key='timezone_minute']").val()|0),
				},

				"large_noise_frequency": Number($(this).find("input[key='large_noise_frequency']").val()),
				"large_noise_amplitude": Number($(this).find("input[key='large_noise_amplitude']").val()),

				"medium_noise_frequency": Number($(this).find("input[key='medium_noise_frequency']").val()),
				"medium_noise_amplitude": Number($(this).find("input[key='medium_noise_amplitude']").val()),

				"small_noise_frequency": Number($(this).find("input[key='small_noise_frequency']").val()),
				"small_noise_amplitude": Number($(this).find("input[key='small_noise_amplitude']").val())
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
				data.seasons[j].name = escapeHtml($(this).find('input[key="name"]').val());
			}

		});

		if($(this).find('.location_season').length != static_data.seasons.data.length){

			for(var j = $(this).find('.location_season').length; j < static_data.seasons.data.length; j++){

				data.seasons[j] = {
					"custom_name": false,
					"time": static_data.seasons.data[i].time,
					"weather":{
						"temp_low": 0,
						"temp_high": 0,
						"precipitation": 0,
						"precipitation_intensity": 0
					}
				}


			}

		}

		static_data.seasons.locations[i] = data;

	});

	location_list.empty();

	for(var i = 0; i < static_data.seasons.locations.length; i++){
		add_location_to_list(location_list, i, static_data.seasons.locations[i]);
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

function reindex_cycle_sortable(){
	
	static_data.cycles.data = [];

	$('#cycle_sortable').children().each(function(i){
		$('.dynamic_input', this).each(function(){
			$(this).attr('data', $(this).attr('data').replace(/[0-9]+/g, i));
		});
		$(this).attr('key', i);
		$(this).find('.main-container').find('.detail-text').text(`Cycle number ${i+1} - Using \$${i+1}`)

		static_data.cycles.data[i] = {
			'length': ($(this).find('.length').val()|0),
			'offset': ($(this).find('.offset').val()|0),
			'names': []
		};

		$(this).find('.collapsible-content').children().first().children().each(function(j){
			static_data.cycles.data[i].names[j] = escapeHtml($(this).val());
		});

	});

	do_error_check();

	update_cycle_example_text();
}

function reindex_moon_list(){
	
	static_data.moons = [];

	$('#moon_list').children().each(function(i){

		$('.dynamic_input', this).each(function(){
			$(this).attr('data', $(this).attr('data').replace(/[0-9]+/g, i));
		});

		$(this).attr('key', i);

		static_data.moons[i] = {
			'name': escapeHtml($(this).find('.name-input').val()),
			'custom_phase': $(this).find('.custom_phase').is(':checked'),
			'color': $(this).find('.color').spectrum('get', 'hex').toString(),
			'hidden': $(this).find('.moon-hidden').is(':checked'),
			'custom_cycle': escapeHtml($(this).find('.custom_cycle').val()),
			'cycle': ($(this).find('.cycle').val()|0),
			'shift': ($(this).find('.shift').val()|0),

		};

		if(static_data.moons[i].custom_phase){

			static_data.moons[i].granularity = Math.max.apply(null, static_data.moons[i].custom_cycle.split(','))+1;

		}else{

			if(static_data.moons[i].cycle >= 32){
				static_data.moons[i].granularity = 32;
			}else if(static_data.moons[i].cycle >= 24){
				static_data.moons[i].granularity = 24;
			}else if(static_data.moons[i].cycle >= 16){
				static_data.moons[i].granularity = 16;
			}else if(static_data.moons[i].cycle >= 8){
				static_data.moons[i].granularity = 8;
			}else{
				static_data.moons[i].granularity = 4;
			}

		}

	});

	do_error_check();

}

function reindex_era_list(){

	sort_era_list_by_date();
	
	static_data.eras = [];

	era_list.children().each(function(i){

		$('.dynamic_input', this).each(function(){
			$(this).attr('data', $(this).attr('data').replace(/[0-9]+/g, i));
		});

		$(this).attr('key', i);

		static_data.eras[i] = {
			'name': escapeHtml($(this).find('.name-input').val()),
			'abbreviation': escapeHtml($(this).find('.era_abbreviation').val()),
			'description': $(this).find('.era_description').attr('value'),
			'settings': {
				'show_as_event': $(this).find('.show_as_event').is(':checked'),
				'event_category': $(this).find('.event-category-list').val(),
				'ends_year': $(this).find('.ends_year').is(':checked'),
				'restart': $(this).find('.restart').is(':checked')
			},
			'date': {
				'year': ($(this).find('.year-input').val()|0),
				'timespan': ($(this).find('.timespan-list').val()|0),
				'day': ($(this).find('.timespan-day-list').val()|0)
			}
		};

		static_data.eras[i].date.epoch = evaluate_calendar_start(static_data, convert_year(static_data, static_data.eras[i].date.year), static_data.eras[i].date.timespan, static_data.eras[i].date.day).epoch;

	});

	do_error_check();

}

function sort_era_list_by_date(){

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
}

function reindex_event_category_list(){
	
	static_data.event_data.categories = [];

	event_category_list.children().each(function(i){

		$('.dynamic_input', this).each(function(){
			$(this).attr('data', $(this).attr('data').replace(/[0-9]+/g, i));
		});

		$(this).attr('key', i);

		static_data.event_data.categories[i] = {
			'name': escapeHtml($(this).find('.name-input').val()),
			'category_settings': {
				'hide': $(this).find('.global_hide').is(':checked'),
				'player_usable': $(this).find('.player_usable').is(':checked')
			},
			'event_settings': {
				'hide': $(this).find('.local_hide').is(':checked'),
				'noprint': $(this).find('.noprint').is(':checked'),
				'color': $(this).find('.color_display').val(),
				'text': $(this).find('.text_display').val()
			}
		};

	});

	$('.event-category-list').each(function(){
		var element = [];
		var selected = $('.event-category-list').val();
		for(var i = 0; i < static_data.event_data.categories.length; i++)
		{
			var name = static_data.event_data.categories[i].name;
			element.push(`<option value="${i}" ${(i==selected ? "selected" : "")}>${name}</option>`);
		}
		$(this).html(element.join(""));
	});

	do_error_check();

}

function reindex_events_sortable(){

	var new_order = []

	events_sortable.children().each(function(i){

		var id = Number($(this).attr('key'));

		new_order[i] = static_data.event_data.events[id];

		$(this).attr('key', i);

	});

	static_data.event_data.events = clone(new_order);

}


function repopulate_month_lists(){
	$(".timespan-list").each(function(i){
		selected = $(this).val();
		html = [];
		$(this).html('');
		for(var i = 0; i < static_data.year_data.timespans.length; i++)
		{
			html.push(`<option value="${i}">${static_data.year_data.timespans[i].name}</option>`);
		}
		$(this).append(html);
		$(this).val(selected);
	});
}

function recreate_moon_colors(){

	$('.moon_inputs .color').spectrum({
		color: "#FFFFFF",
		preferredFormat: "hex",
		showInput: true
	});

	$('#moon_list').children().each(function(i){
		$(this).find('.color').spectrum("set", static_data.moons[i].color);
	});

}

function evaluate_season_lengths(){

	var data = {
		'season_length': 0
	};
	
	var epoch_start = evaluate_calendar_start(static_data, convert_year(static_data, dynamic_data.year)).epoch;
	var epoch_end = evaluate_calendar_start(static_data, convert_year(static_data, dynamic_data.year)+1).epoch-1;
	var season_length = epoch_end-epoch_start;

	for(var i = 0; i < static_data.seasons.data.length; i++){
		current_season = static_data.seasons.data[i];
		data.season_length += current_season.transition_length;
		data.season_length += current_season.duration;
	}

	data.season_offset = static_data.seasons.global_settings.offset;

	$('#season_length_text').removeClass('hidden');
	$('#season_length_text').text(`Season length: ${data.season_length} / ${fract_year_length(static_data)} (year length)`);

}

function recalc_stats(){
	var year_length = fract_year_length(static_data);
	var month_length = avg_month_length(static_data);
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

function evaluate_save_button(){

	if($('#btn_save').length){

		calendar_name_same = calendar_name == prev_calendar_name;
		static_same = JSON.stringify(static_data) === JSON.stringify(prev_static_data);
		dynamic_same = JSON.stringify(dynamic_data) === JSON.stringify(prev_dynamic_data);

		text = static_same && dynamic_same && calendar_name_same ? "No changes to save" : "Save calendar";

		save_button.prop('disabled', static_same && dynamic_same && calendar_name_same).text(text);

	}else if($('#btn_create').length){

		calendar_name_same = calendar_name == prev_calendar_name;
		static_same = JSON.stringify(static_data) === JSON.stringify(prev_static_data);
		dynamic_same = JSON.stringify(dynamic_data) === JSON.stringify(prev_dynamic_data);

		text = static_same && dynamic_same && calendar_name_same ? "No changes to save" : "Save calendar";

		create_button.prop('disabled', static_same && dynamic_same && calendar_name_same).text(text);
		
	}

}

function populate_calendar_lists(){

	link_changed();

	if(link_data.master_hash !== ""){
		return;
	}

	get_owned_calendars(function(owned_calendars){

		for(var i = 0; i < owned_calendars.length; i++){
			if(owned_calendars[i].children != ""){
				owned_calendars[i].children = JSON.parse(owned_calendars[i].children);
			}
		}

		calendar_link_list.html('');

		for(var i = 0; i < link_data.children.length; i++){
			var child = link_data.children[i];
			var calendar = owned_calendars[owned_calendars.findIndex(e => e.hash == child)];
			add_link_to_list(calendar_link_list, i, calendar.name);
		}

		var html = [];

		html.push(`<option>None</option>`);

		for(var i = 0; i < owned_calendars.length; i++){

			var calendar = owned_calendars[i];

			if(calendar.hash != hash){

				if(calendar.master_hash){

					var owner = clone(owned_calendars[owned_calendars.findIndex(c => c.children.indexOf(calendar.hash) != -1)]);

					if(owner.hash == hash){
						owner.name = "this calendar";
					}
					
				}else{

					var owner = false;

				}

				html.push(`<option ${owner ? "disabled" : ""} value="${calendar.hash}">${calendar.name}${owner ? ` | Linked to ${owner.name}` : ""}</option>`);
			}
		}

		calendar_link_select.html(html.join(''));

	});
	
	$('#link_calendar').prop('disabled', true);

}

function link_changed(){

	var has_master = link_data.master_hash !== "";

	$('#calendar_link_hide select, #calendar_link_hide button').prop('disabled', has_master);
	$('#calendar_link_hide').toggleClass('hidden', has_master);

	$("#date_inputs :input, #date_inputs :button").attr("disabled", has_master);
	$(".calendar_link_explaination").toggleClass("hidden", !has_master);

}

function repopulate_event_category_lists(){

	var html = [];
	html.push("<option selected value='-1'>None</option>")
	for(var i = 0; i < static_data.event_data.categories.length; i++){
		var category = static_data.event_data.categories[i];
		html.push(`<option value='${i}'>`)
		html.push(category.name)
		html.push("</option>")
	}

	$('.event-category-list').each(function(){
		var val = $(this).val();
		$(this).html(html.join("")).val(val);
	});

}

function evaluate_clock_inputs(){

	$('.clock_inputs :input, .clock_inputs :button').prop('disabled', !static_data.clock.enabled);
	$('.clock_inputs').toggleClass('hidden', !static_data.clock.enabled);

	$('.hour_input').each(function(){
		$(this).prop('min', 0).prop('max', static_data.clock.hours).prop('disabled', !static_data.clock.enabled).toggleClass('hidden', !static_data.clock.enabled);
	});
	$('.minute_input').each(function(){
		$(this).prop('min', 1).prop('max', static_data.clock.minutes-1).prop('disabled', !static_data.clock.enabled).toggleClass('hidden', !static_data.clock.enabled);
	});

}

function recalculate_era_epochs(){

	for(var i = 0; i < static_data.eras.length; i++){
		static_data.eras[i].date.epoch = evaluate_calendar_start(static_data, convert_year(static_data, static_data.eras[i].date.year), static_data.eras[i].date.timespan, static_data.eras[i].date.day).epoch;
	}
	
}

function set_up_edit_values(){

	$('.static_input').each(function(){

		var data = $(this).attr('data');
		var key = $(this).attr('key');

		var current_calendar_data = get_calendar_data(data);

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

	for(var i = 0; i < static_data.year_data.global_week.length; i++){
		name = static_data.year_data.global_week[i];
		add_weekday_to_sortable(global_week_sortable, i, name);
	}
	populate_first_day_select(static_data.year_data.first_day);
	global_week_sortable.sortable('refresh');

	if(static_data.year_data.timespans.length > 0){
	
		for(var i = 0; i < static_data.year_data.timespans.length; i++){
			add_timespan_to_sortable(timespan_sortable, i, static_data.year_data.timespans[i]);
		}
		timespan_sortable.sortable('refresh');

	}

	if(static_data.seasons){

		for(var i = 0; i < static_data.seasons.data.length; i++){
			add_season_to_sortable(season_sortable, i, static_data.seasons.data[i]);
		}
		evaluate_season_lengths();

		for(var i = 0; i < static_data.seasons.locations.length; i++){
			add_location_to_list(location_list, i, static_data.seasons.locations[i]);
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

	if(static_data.cycles){
		for(var i = 0; i < static_data.cycles.data.length; i++){
			add_cycle_to_sortable(cycle_sortable, i, static_data.cycles.data[i]);
		}
	}

	if(static_data.year_data.leap_days){

		for(var i = 0; i < static_data.year_data.leap_days.length; i++){

			var leap_day = clone(static_data.year_data.leap_days[i]);

			add_leap_day_to_list(leap_day_list, i, leap_day);

		}

		leap_day_list.children().each(function(i){
			repopulate_day_select($(this).find('.timespan-day-list.leap_day_input'), static_data.year_data.leap_days[i].day, false);
		})
	}

	$('#leap_day_explaination').prop('disabled', static_data.year_data.timespans.length == 0).toggleClass('hidden', static_data.year_data.timespans.length > 0);
	$('.form-inline.leap input, .form-inline.leap select, .form-inline.leap button').prop('disabled', static_data.year_data.timespans.length == 0);

	if(static_data.moons){
		for(var i = 0; i < static_data.moons.length; i++){
			add_moon_to_list(moon_list, i, static_data.moons[i]);
		}
		recreate_moon_colors();
	}

	if(static_data.eras){

		for(var i = 0; i < static_data.eras.length; i++){
			add_era_to_list(era_list, i, static_data.eras[i])
		}
		
		era_list.children().each(function(i){
			
			repopulate_timespan_select($(this).find('.timespan-list'), static_data.eras[i].date.timespan, false);
			repopulate_day_select($(this).find('.timespan-day-list'), static_data.eras[i].date.day, false);

		})
	}

	if(static_data.event_data.categories){
		for(var i = 0; i < static_data.event_data.categories.length; i++){
			add_category_to_list(event_category_list, i, static_data.event_data.categories[i]);
		}
	}

	if(static_data.event_data.events){
		for(var i = 0; i < static_data.event_data.events.length; i++){
			add_event_to_sortable(events_sortable, i, static_data.event_data.events[i]);
		}
	}

	populate_calendar_lists();

	evaluate_clock_inputs();

	evaluate_remove_buttons();

	repopulate_event_category_lists();

	$('#cycle_test_input').click();

	recalc_stats();
	
	$('#enable_weather').change();

	set_up_view_values();

}


function empty_edit_values(){

	timespan_sortable.empty()
	first_day.empty()
	global_week_sortable.empty()
	leap_day_list.empty()
	moon_list.empty()
	season_sortable.empty()
	cycle_sortable.empty()
	era_list.empty()
	event_category_list.empty()
	events_sortable.empty()
	location_list.empty()
	calendar_link_select.empty()
	calendar_link_list.empty()

}
