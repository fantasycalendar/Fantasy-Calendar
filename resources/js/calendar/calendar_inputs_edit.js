function set_up_edit_inputs(){

	prev_calendar_name = clone(calendar_name);
	prev_dynamic_data = clone(dynamic_data);
	prev_static_data = clone(static_data);

	calendar_name_same = calendar_name == prev_calendar_name;
	static_same = JSON.stringify(static_data) === JSON.stringify(prev_static_data);
	dynamic_same = JSON.stringify(dynamic_data) === JSON.stringify(prev_dynamic_data);

	window.onbeforeunload = function(e){

		calendar_name_same = calendar_name == prev_calendar_name;
		static_same = JSON.stringify(static_data) === JSON.stringify(prev_static_data);
		dynamic_same = JSON.stringify(dynamic_data) === JSON.stringify(prev_dynamic_data);

		var not_changed = static_same && dynamic_same && calendar_name_same;

		if(!not_changed){

			var confirmationMessage = "It looks like you have unsaved changes, are you sure you want to navigate away from this page?";

			(e || window.event).returnValue = confirmationMessage; //Gecko + IE
			return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.

		}

	};

	set_up_view_inputs();

	save_button = $('#btn_save');

	save_button.click(function(){

		calendar_saving();

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

		// Unhook before unload
		window.onbeforeunload = function () {}

		create_calendar();

	});

	save_button.prop('disabled', true);
	create_button.prop('disabled', true);

	delete_button = $('#btn_delete');

	delete_button.click(function(){
		delete_calendar(hash, calendar_name, function(){self.location = '/'});
	});

	calendar_container = $('#calendar');
	weather_contrainer = $('#weather_container');

	removing = null;
	input_container = $('#input_container');
	timespan_sortable = $('#timespan_sortable');
	first_day = $('#first_day');
	global_week_sortable = $('#global_week_sortable');
	leap_day_list = $('#leap_day_list');
	moon_list = $('#moon_list');
	periodic_seasons_checkbox = $('#periodic_seasons_checkbox');
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

	$(document).on('change', cycle_sortable, function(){
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

	/* ------------------- Dynamic and static callbacks ------------------- */

	$('#calendar_name').change(function(){
		calendar_name = $(this).val();
		evaluate_save_button();
	});

	$(document).on('change', '.length-input, .interval, .offset', function(){
		recalc_stats();
	});

	$(document).on('change', '.disable_local_season_name', function(){
		var checked = $(this).prop('checked');
		var parent = $(this).closest('.wrap-collapsible');
		var index = parent.attr('index');
		var name_input = parent.find('input[fc-index="name"]');
		if(checked){
			name_input.prop('disabled', false);
		}else{
			name_input.val(static_data.seasons.data[index].name).prop('disabled', true);
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

		$('#create_season_events').prop('disabled', !static_data.clock.enabled);

		eval_clock();

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
		var id = global_week_sortable.children().length;
		add_weekday_to_sortable(global_week_sortable, id, name.val())
		static_data.year_data.global_week.push(name.val());
		global_week_sortable.sortable('refresh');
		reindex_weekday_sortable();
		name.val("");
		set_up_view_values();
	});

	$('.form-inline.timespan .add').click(function(){
		var name = $(this).prev().prev();
		var type = $(this).prev();
		var id = timespan_sortable.children().length;
		stats = {
			'name': name.val(),
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
		var id = leap_day_list.children().length;
		stats = {
			'name': name.val(),
			'intercalary': type.val() == 'intercalary',
			'timespan': 0,
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

		if(stats.intercalary){
			repopulate_day_select(leap_day_list.children().last().find('.timespan-day-list'), stats.day, false);
		}else{
			repopulate_day_select(leap_day_list.children().last().find('.week-day-select'), static_data.year_data.leap_days[id].day, false);
		}

		do_error_check();

		name.val("");
		set_up_view_values();

	});


	$(document).on('click', '.expand', function(){
		if($(this).parent().parent().hasClass('collapsed')){
			$('#calendar_container').addClass('container_collapsed');
			$(this).parent().parent().removeClass('collapsed').addClass('expanded');
			$(this).parent().parent().find('.detail-container').removeClass('hidden');
		}else{
			$('#calendar_container').removeClass('container_collapsed');
			$(this).parent().parent().removeClass('expanded').addClass('collapsed');
			$(this).parent().parent().find('.detail-container').addClass('hidden');
		}
	});

	$('.form-inline.moon .add').click(function(){
		var name = $(this).prev();
		var cycle = $(this).next();
		var shift = $(this).next().next();
		var cycle_val = cycle.val()|0;
		var id = moon_list.children().length;

		var granularity = get_moon_granularity(cycle_val);

		stats = {
			'name': name.val(),
			'cycle': cycle.val(),
			'shift': shift.val(),
			'granularity': granularity,
			'color': '#ffffff',
			'shadow_color': '#292b4a',
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

	periodic_seasons_checkbox.change(function(){

		var checked = $(this).prop('checked');
		$(this).prop('checked', !checked);

		var ends_year = false;
		for(var era_index in static_data.eras){
			var era = static_data.eras[era_index];
			if(era.settings.ends_year){
				ends_year = true;
				break;
			}
		}

		if(ends_year){
			swal({
			title: "Error!",
				text: `You have eras that end years - you cannot switch to dated seasons with year-ending eras as the dates might disappear, and that kinda defeats the whole purpose.`,
				icon: "error",
				dangerMode: true
			});
			return;
		}

		swal({
			title: "Are you sure?",
			text: `Are you sure you want to switch to ${checked ? "PERIODIC" : "DATED"} seasons? Your current seasons will be deleted so you can re-create them.`,
			buttons: true,
			icon: "warning",
			dangerMode: true,
		})
		.then((doSwitch) => {
			if(doSwitch) {
				$(this).prop('checked', checked);
				season_sortable.empty();
				static_data.seasons.data = []
				evaluate_season_lengths();
				static_data.seasons.global_settings.periodic_seasons = checked;

				$('.season_text.dated').toggleClass('active', !checked);
				$('.season_text.periodic').toggleClass('active', checked);

				$('.season_offset_container').prop('disabled', !checked).toggleClass('hidden', !checked);

				era_list.children().each(function(){
					$(this).find('.ends_year').prop('disabled', !checked).toggleClass('protip');
				});

				error_check("calendar", true);
			}
		});

	});

	$('.form-inline.seasons .add').click(function(){

		var fract_year_len = fract_year_length(static_data);

		var name = $(this).prev();
		var id = season_sortable.children().length;

		stats = {
			"name": name.val() != "" ? name.val() : `Season ${id+1}`,
			"time": {
				"sunrise": {
					"hour": 6,
					"minute": 0
				},
				"sunset": {
					"hour": 18,
					"minute": 0
				}
			}
		};

		if(static_data.seasons.global_settings.periodic_seasons){

			if(season_sortable.children().length == 0){
				stats.transition_length = fract_year_len;
			}else{
				if(season_sortable.children().length > 0){
					season_sortable.children().each(function(){
						var val = $(this).find('.transition_length').val()
						if(val == fract_year_len / (season_sortable.children().length)){
							$(this).find('.transition_length').val(fract_year_len / (season_sortable.children().length+1));
						}
					})
				}
				stats.transition_length = fract_year_len / (season_sortable.children().length+1);
			}

			stats.duration = 0;

		}else{

			if(season_sortable.children().length == 0){

				stats.timespan = 0;
				stats.day = 1;

			}else{

				stats.timespan = Math.floor(static_data.year_data.timespans.length/(season_sortable.children().length+1))
				stats.day = 1;

			}

		}

		add_season_to_sortable(season_sortable, id, stats);

		if(!static_data.seasons.global_settings.periodic_seasons){

			repopulate_timespan_select(season_sortable.children().last().find('.timespan-list'), stats.timespan, false, true);
			repopulate_day_select(season_sortable.children().last().find('.timespan-day-list'), stats.day, false, true);
			sort_list_by_partial_date(season_sortable);

		}

		season_sortable.sortable('refresh');
		reindex_season_sortable();
		evaluate_season_lengths();
		reindex_location_list();
		name.val("");
		do_error_check();

		$('#create_season_events').prop('disabled', static_data.seasons.data.length == 0 && static_data.clock.enabled);

	});

	$('#create_season_events').prop('disabled', static_data.seasons.data.length == 0 && static_data.clock.enabled);

	$('#create_season_events').click(function(){
		swal({
			title: "Are you sure?",
			text: 'Are you sure you want to create seasonal events? If you already have created them, you might get doubling.',
			buttons: true,
			icon: "info",
			dangerMode: true,
		})
		.then((willCreate) => {
			if(willCreate) {

				var events = create_season_events();

				for(index in events){
					static_data.event_data.events.push(events[index])
					add_event_to_sortable(events_sortable, static_data.event_data.events.length-1, static_data.event_data.events[static_data.event_data.events.length-1]);
				}

				do_error_check();
			}
		});
	})

	$('.form-inline.locations .add').click(function(){

		var name = $(this).prev();
		var id = location_list.children().length;

		stats = {
			"name": name.val(),
			"seasons": [],

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
		var location = location_select.val();

		if(type === "custom"){
			var stats = static_data.seasons.locations[location];
		}else{
			var stats = preset_data.locations[static_data.seasons.data.length][location];
			stats.settings = preset_data.curves;

			for(var i = 0; i < static_data.seasons.data.length; i++){
				stats.seasons[i].time = static_data.seasons.data[i].time;
			}

		}

		var id = location_list.children().length;

		add_location_to_list(location_list, id, stats);
		reindex_location_list();

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

		location_select.find('optgroup[value="custom"]').children().eq(id).prop('selected', true).change();

		do_error_check();

	});

	$(document).on('click', '.location_middle_btn', function(){

		var container = $(this).closest('.sortable-container');

		var current_season = $(this).closest('.location_season');

		var season_id = current_season.attr('fc-index')|0;

		var location_id = container.attr('index')|0;

		var prev_id = (season_id-1)%static_data.seasons.data.length
		if(prev_id < 0) prev_id += static_data.seasons.data.length

		var prev_season = static_data.seasons.locations[location_id].seasons[prev_id];
		var next_season = static_data.seasons.locations[location_id].seasons[(season_id+1)%static_data.seasons.data.length];

		var season_length = static_data.seasons.data[prev_id].duration+static_data.seasons.data[prev_id].transition_length+static_data.seasons.data[season_id].duration+static_data.seasons.data[season_id].transition_length;
		var target = static_data.seasons.data[prev_id].duration+static_data.seasons.data[prev_id].transition_length;
		var perc = target/season_length;

		if(static_data.clock.enabled){

			var prev_sunrise = prev_season.time.sunrise.hour+(prev_season.time.sunrise.minute/static_data.clock.minutes);
			var next_sunrise = next_season.time.sunrise.hour+(next_season.time.sunrise.minute/static_data.clock.minutes);

			var middle = lerp(prev_sunrise, next_sunrise, perc)

			var sunrise_h = Math.floor(middle)
			var sunrise_m = Math.floor(fract(middle)*static_data.clock.minutes)

			current_season.find("input[clocktype='sunrise_hour']").val(sunrise_h)
			current_season.find("input[clocktype='sunrise_minute']").val(sunrise_m)

			static_data.seasons.locations[location_id].seasons[season_id].time.sunrise.hour = sunrise_h;
			static_data.seasons.locations[location_id].seasons[season_id].time.sunrise.minute = sunrise_m;


			var prev_sunset = prev_season.time.sunset.hour+(prev_season.time.sunset.minute/static_data.clock.minutes);
			var next_sunset = next_season.time.sunset.hour+(next_season.time.sunset.minute/static_data.clock.minutes);

			var middle = lerp(prev_sunset, next_sunset, perc)

			var sunset_h = Math.floor(middle)
			var sunset_m = Math.floor(fract(middle)*static_data.clock.minutes)

			current_season.find("input[clocktype='sunset_hour']").val(sunset_h)
			current_season.find("input[clocktype='sunset_minute']").val(sunset_m)

			static_data.seasons.locations[location_id].seasons[season_id].time.sunset.hour = sunset_h;
			static_data.seasons.locations[location_id].seasons[season_id].time.sunset.minute = sunset_m;

		}

		if(static_data.seasons.global_settings.enable_weather){

			var temp_low = precisionRound(lerp(prev_season.weather.temp_low, next_season.weather.temp_low, perc),2);
			var temp_high = precisionRound(lerp(prev_season.weather.temp_high, next_season.weather.temp_high, perc),2);
			var precipitation = precisionRound(lerp(prev_season.weather.precipitation, next_season.weather.precipitation, perc),2);
			var precipitation_intensity = precisionRound(lerp(prev_season.weather.precipitation_intensity, next_season.weather.precipitation_intensity, perc),2);

			current_season.find("input[fc-index='precipitation']").val(precipitation).parent().parent().find('.slider_input').val(precipitation)
			current_season.find("input[fc-index='precipitation_intensity']").val(precipitation_intensity).parent().parent().find('.slider_input').val(precipitation_intensity)

			current_season.find("input[fc-index='temp_high']").val(temp_high)
			current_season.find("input[fc-index='temp_low']").val(temp_low)

			static_data.seasons.locations[location_id].seasons[season_id].weather.temp_low = temp_low;
			static_data.seasons.locations[location_id].seasons[season_id].weather.temp_high = temp_high;
			static_data.seasons.locations[location_id].seasons[season_id].weather.precipitation = precipitation;
			static_data.seasons.locations[location_id].seasons[season_id].weather.precipitation_intensity = precipitation_intensity;

		}

		do_error_check('seasons');

	});

	$(document).on('click', '.season_middle_btn', function(){

		var container = $(this).closest('.sortable-container');

		var season_id = container.attr('index')|0;

		var prev_id = (season_id-1)%static_data.seasons.data.length
		if(prev_id < 0) prev_id += static_data.seasons.data.length

		var prev_season = static_data.seasons.data[prev_id];
		var next_season = static_data.seasons.data[(season_id+1)%static_data.seasons.data.length];

		var season_length = static_data.seasons.data[prev_id].duration+static_data.seasons.data[prev_id].transition_length+static_data.seasons.data[season_id].duration+static_data.seasons.data[season_id].transition_length;
		var target = static_data.seasons.data[prev_id].duration+static_data.seasons.data[prev_id].transition_length;
		var perc = target/season_length;

		if(static_data.clock.enabled){

			var prev_sunrise = prev_season.time.sunrise.hour+(prev_season.time.sunrise.minute/static_data.clock.minutes);
			var next_sunrise = next_season.time.sunrise.hour+(next_season.time.sunrise.minute/static_data.clock.minutes);

			var middle = lerp(prev_sunrise, next_sunrise, perc)

			var sunrise_h = Math.floor(middle)
			var sunrise_m = Math.floor(fract(middle)*static_data.clock.minutes)

			container.find("input[clocktype='sunrise_hour']").val(sunrise_h)
			container.find("input[clocktype='sunrise_minute']").val(sunrise_m)

			static_data.seasons.data[season_id].time.sunrise.hour = sunrise_h;
			static_data.seasons.data[season_id].time.sunrise.minute = sunrise_m;


			var prev_sunset = prev_season.time.sunset.hour+(prev_season.time.sunset.minute/static_data.clock.minutes);
			var next_sunset = next_season.time.sunset.hour+(next_season.time.sunset.minute/static_data.clock.minutes);

			var middle = lerp(prev_sunset, next_sunset, perc)

			var sunset_h = Math.floor(middle)
			var sunset_m = Math.floor(fract(middle)*static_data.clock.minutes)

			container.find("input[clocktype='sunset_hour']").val(sunset_h)
			container.find("input[clocktype='sunset_minute']").val(sunset_m)

			static_data.seasons.data[season_id].time.sunset.hour = sunset_h;
			static_data.seasons.data[season_id].time.sunset.minute = sunset_m;

		}

		do_error_check('seasons');

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
				format: $('#cycle_format').val(),
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
			"name": name.val(),
			"formatting": "",
			"description": "",
			"settings": {
				"show_as_event": false,
				"use_custom_format": false,
				"starting_era": false,
				"event_category_id": -1,
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
		var era = add_era_to_list(era_list, id, stats);
		repopulate_timespan_select(era.find('.timespan-list'), dynamic_data.timespan);
		repopulate_day_select(era.find('.timespan-day-list'), dynamic_data.day);
		name.val("");
		do_error_check();

	});


	$('.form-inline.event_categories .add').click(function(){

		var name = $(this).prev();

		var slug = slugify(name.val());

		var stats = {
			"name": name.val(),
			"category_settings":{
				"hide": false,
				"player_usable": false
			},
			"event_settings": {
				"color": "Dark-Solid",
				"text": "text",
				"hide": false,
				"noprint": false
			},
			"calendar_id": typeof calendar_id != "undefined" ? calendar_id : null,
			"id": slug
		};

		sort_by = static_data.event_data.categories.length;

		add_category_to_list(event_category_list, sort_by, stats);

		static_data.event_data.categories[sort_by] = stats;

		repopulate_event_category_lists();

		name.val('');

		do_error_check();

	});


	$('.form-inline.events .add').click(function(){
		var name = $(this).prev().val();

		edit_event_ui.create_new_event(name);
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
		var index = $(this).closest('.sortable-container').attr('index')|0;

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
				reindex_season_sortable(index);
				reindex_location_list();
				break;

			case "location_list":
				$(this).closest('.sortable-container').remove();
				$(this).closest('.sortable-container').parent().sortable('refresh');
				type = 'seasons';
				reindex_location_list();
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

				var category = static_data.event_data.categories[index];

				for(var event in static_data.event_data.events){
					if(static_data.event_data.events[event].category == category.id){
						static_data.event_data.events[event].category = -1;
					}
				}

				for(var era in static_data.eras){
					if(static_data.eras[era].settings.event_category_id == index){
						static_data.eras[era].settings.event_category_id = -1;
					}
				}

				reindex_event_category_list();
				static_data.event_data.categories = static_data.event_data.categories.filter(function(category) { return category; });
				repopulate_event_category_lists();

				break;

			case "events_sortable":

				var warnings = [];

				for(var eventId in static_data.event_data.events){
					if(static_data.event_data.events[eventId].data.connected_events !== undefined){
						var connected_events = static_data.event_data.events[eventId].data.connected_events;
						if(connected_events.includes(String(index)) || connected_events.includes(index)){
							warnings.push(eventId);
						}
					}
				}

				if(warnings.length > 0){

					callback = true;

					var html = [];
					html.push(`<h5>You are deleting "${static_data.event_data.events[index].name}" which referenced in the following events:</h5>`)
					html.push(`<ul>`);
					for(var i = 0; i < warnings.length; i++){
						var event_id = warnings[i];
						html.push(`<li>• ${static_data.event_data.events[event_id].name}</li>`);
					}
					html.push(`</ul>`);
					html.push(`<p>Please remove the conditions referencing "${static_data.event_data.events[index].name}" in these events before deleting.</p>`)

					warning_message.show(html.join(''));

					$(this).closest('.sortable-container').find('.btn_cancel').click();

				}else{

					events_sortable.children("[index='"+index+"']").remove();

					for(var eventId in static_data.event_data.events){
						if(static_data.event_data.events[eventId].data.connected_events !== undefined){
							for(connectedId in static_data.event_data.events[eventId].data.connected_events){
								var number = Number(static_data.event_data.events[eventId].data.connected_events[connectedId])
								if(Number(static_data.event_data.events[eventId].data.connected_events[connectedId]) > index){
									static_data.event_data.events[eventId].data.connected_events[connectedId] = String(number-1)
								}
							}
						}
					}

					static_data.event_data.events.splice(index, 1);

					events_sortable.children().each(function(i){
						static_data.event_data.events[i].sort_by = i;
						$(this).attr('index', i);
					});

				}

				break;

			case "leap_day_list":
				$(this).closest('.sortable-container').remove();
				$(this).closest('.sortable-container').parent().sortable('refresh');
				static_data.year_data.leap_days.splice(index, 1)
				reindex_leap_day_list();
				recalc_stats();
				break;

			case "calendar_link_list":
				$(this).closest('.sortable-container').remove();
				$(this).closest('.sortable-container').parent().sortable('refresh');
				var target_hash = link_data.children[index];
				link_data.children.splice(index, 1);
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

		var index = $(this).closest('.sortable-container').attr('index')|0;

		var cycle = $(this).val()|0;

		static_data.moons[index].granularity = get_moon_granularity(cycle);

	});

	$(document).on('change', '.custom_phase', function(){

		var checked = $(this).is(':checked');

		var index = $(this).closest('.sortable-container').attr('index')|0;

		$(this).closest('.sortable-container').find('.no_custom_phase_container').toggleClass('hidden', checked);
		$(this).closest('.sortable-container').find('.custom_phase_container').toggleClass('hidden', !checked);

		if(checked){

			var value = "";

			for(var i = 0; i < static_data.moons[index].granularity-1; i++){
				value += `${i},`
			}

			value += `${i}`

			delete static_data.moons[index].cycle;
			delete static_data.moons[index].shift;

			$(this).closest('.sortable-container').find('.custom_cycle').val(value).change();

		}else{

			var strings = $(this).closest('.sortable-container').find('.custom_cycle').val().split(',');

			var cycle = (strings.length|0);

			var offset = (strings[0]|0);

			$(this).closest('.sortable-container').find('.cycle').val(cycle).change();
			$(this).closest('.sortable-container').find('.shift').val(offset).change();

			delete static_data.moons[index].custom_cycle;
		}

	});



	$(document).on('keyup', '.custom_cycle', function(e){

		$(this).val($(this).val().replace(/[`!+~@#$%^&*()_|\-=?;:'".<>\{\}\[\]\\\/A-Za-z ]/g,'').replace(/,{2,}/g,","));

	});

	$(document).on('change', '.custom_cycle', function(e){

		$(this).val($(this).val().replace(/[`!+~@#$%^&*()_|\-=?;:'".<>\{\}\[\]\\\/A-Za-z ]/g,'').replace(/,{2,}/g,","));

		var value = $(this).val();

		var index = $(this).closest('.sortable-container').attr('index')|0;

		var cycle = Math.max.apply(null, value.split(','))+1;

		if(cycle > 40){

			invalid = true;

		}else{

			invalid = false;

			static_data.moons[index].granularity = get_moon_granularity(cycle);

			$(this).closest('.sortable-container').find('.custom_phase_text').text(`This moon has ${value.split(',').length} phases, with a granularity of ${static_data.moons[index].granularity}.`);

			do_error_check();

		}

		$(this).toggleClass('invalid', invalid).attr('error_msg', invalid ? `${static_data.moons[index].name} has an invalid custom cycle. 31 is the highest possible number.` : '');

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
		repopulate_weekday_select($(this).closest('.sortable-container').find('.week-day-select'));
	});

	$(document).on('change', '.adds-week-day', function(){
		var container = $(this).closest('.sortable-container');
		var checked = $(this).is(':checked');
		container.find('.week_day_select_container').toggleClass('hidden', !checked);
		container.find('.adds_week_day_data_container').toggleClass('hidden', !checked);
		container.find('.adds_week_day_data_container input, .adds_week_day_data_container select').prop('disabled', !checked);
		container.find('.week-day-select').toggleClass('inclusive', checked);
		$('#first_week_day_container').toggleClass('hidden', !checked).find('select').prop('disabled', !checked);
		$('#overflow_explanation').toggleClass('hidden', !checked);
		if(checked){
			$('#month_overflow').prop('checked', true);
		}
		repopulate_weekday_select($(this).closest('.sortable-container').find('.week-day-select'));
		container.find('.internal-list-name').change();
	});

	$('#month_overflow').change(function(){
		var checked = $(this).is(':checked');
		$('#first_week_day_container').toggleClass('hidden', !checked).find('select').prop('disabled', !checked);
	});

	$(document).on('change', '.unique-week-input', function(){
		var index = $(this).attr('index');
		if($(this).is(':checked')){
			var element = [];
			element.push("<div class='week_list'>");
				static_data.year_data.timespans[index].week = [];
				for(index = 0; index < static_data.year_data.global_week.length; index++){
					static_data.year_data.timespans[index].week.push(static_data.year_data.global_week[index]);
					element.push(`<input type='text' class='detail-row form-control internal-list-name dynamic_input custom_week_day' data='year_data.timespans.${index}.week' fc-index='${index}' value='${static_data.year_data.global_week[index]}'/>`);
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
			delete static_data.year_data.timespans[index].week;
			do_error_check();
		}

		evaluate_custom_weeks();

	});

	$(document).on('change', '.show_as_event', function(){
		var index = $(this).closest('.sortable-container').attr('index')|0;
		if($(this).is(':checked')){
			$(this).parent().parent().parent().next().removeClass('hidden');
			$(this).parent().parent().parent().next().find('.dynamic_input').prop('disabled', false).val(-1).change();
		}else{
			$(this).parent().parent().parent().next().addClass('hidden');
			$(this).parent().parent().parent().next().find('.dynamic_input').prop('disabled', true).change();
			delete static_data.eras[index].settings.event_category_id;
		}
	});

	$(document).on('change', '.use_custom_format', function(){
		var index = $(this).closest('.sortable-container').attr('index')|0;
		if($(this).is(':checked')){
			$(this).parent().parent().parent().next().removeClass('hidden');
			$(this).parent().parent().parent().next().find('.dynamic_input').prop('disabled', false).val('Year {{year}} - {{era_name}}').change();
		}else{
			$(this).parent().parent().parent().next().addClass('hidden');
			$(this).parent().parent().parent().next().find('.dynamic_input').prop('disabled', true).val('').change();
		}
	});

	$(document).on('change', '.starting_era', function(){

		var changed_era = $(this);

		era_list.children().each(function(i){
			if($(this).find('.starting_era')[0] != changed_era[0] && $(this).find('.starting_era').is(':checked')){
				$(this).find('.starting_era').prop('checked', false);
				$(this).find('.starting_era').parent().parent().parent().next().removeClass('hidden');
				static_data.eras[i].settings.starting_era = false;
			}
		});

		if(changed_era.is(':checked')){
			changed_era.parent().parent().parent().next().addClass('hidden');
		}else{
			changed_era.parent().parent().parent().next().removeClass('hidden');
		}

		reindex_era_list();

	});


	$(document).on('change', '#era_list .date_control', function(){
		reindex_era_list();
		eras.evaluate_position();
	});

	$(document).on('change', '#season_sortable .date_control', function(){
		reindex_season_sortable();
	});

	$(document).on('change', '.week-length', function(){
		var index = $(this).parent().parent().parent().find('.unique-week-input').attr('index');
		var new_val = ($(this).val()|0);
		var current_val = ($(this).parent().parent().parent().parent().find(".week_list").children().length|0);
		if(new_val > current_val){
			var element = [];
			for(index = current_val; index < new_val; index++){
				static_data.year_data.timespans[index].week.push(`Week day ${(index+1)}`);
				element.push(`<input type='text' class='detail-row form-control internal-list-name custom_week_day dynamic_input' data='year_data.timespans.${index}.week' fc-index='${index}' value='Week day ${(index+1)}'/>`);
			}
			$(this).parent().parent().parent().parent().find(".week_list").append(element.join(""));
		}else if(new_val < current_val){
			static_data.year_data.timespans[index].week = static_data.year_data.timespans[index].week.slice(0, new_val);
			$(this).parent().parent().parent().parent().find(".week_list").children().slice(new_val).remove();
		}

		if(new_val == 0){
			$(this).parent().parent().parent().parent().find(".toggle").addClass('hidden');
			$(this).parent().parent().parent().parent().find(".lbl-toggle").addClass('hidden');
			delete static_data.year_data.timespans[index].week;
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
		var index = $(this).attr('index');
		var new_val = ($(this).val()|0);
		var current_val = ($(this).parent().parent().parent().parent().find(".cycle_list").children().length|0);
		if(new_val > current_val){
			var element = [];
			for(index = current_val; index < new_val; index++){
				element.push(`<input type='text' class='form-control internal-list-name dynamic_input' data='cycles.data.${index}.names' fc-index='${index}' value='Cycle name ${(index+1)}'/>`);
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

	$(document).on('keyup', '.leap_day_occurance_input', function(){
		var interval = $(this).closest('.sortable-container').find('.interval');
		interval.val(interval.val().replace(/[ `~@#$%^&*()_|\-=?;:'".<>\{\}\[\]\\\/A-Za-z]/g, ""));
	});

	$(document).on('change', '.leap_day_occurance_input', function(){

		var index = $(this).closest('.sortable-container').attr('index')|0;
		var interval = $(this).closest('.sortable-container').find('.interval');
		var interval_val = interval.val();
		var offset = $(this).closest('.sortable-container').find('.offset');
		var offset_val = (offset.val()|0);
		var timespan = $(this).closest('.sortable-container').find('.timespan-list');
		var timespan_val = timespan.val();

		if(offset_val === undefined || interval_val === undefined) return;

		var global_regex = /[ `~@#$%^&*()_|\-=?;:'".<>\{\}\[\]\\\/A-Za-z]/g;
		var local_regex = /^\+*\!*[1-9]+[0-9]{0,}$/;
		var numbers_regex = /([1-9]+[0-9]{0,})/;

		var invalid = global_regex.test(interval_val);
		var values = interval_val.split(',');

		$(this).toggleClass('invalid', invalid).attr('error_msg', invalid ? `${static_data.year_data.leap_days[index].name} has an invalid interval formula.` : '');

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
					var index = unsorted.indexOf(sorted[i]);
					result.push(values[index]);
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
					var index = unsorted.indexOf(sorted[i]);
					result.push(values[index]);
				}

				values = result;

			}

		}

		if(!invalid){

			varvalues = values.reverse();
			sorted = sorted.reverse();

			if(values.length == 1 && Number(values[0]) == 1){
				offset.val(0).prop('disabled', true);
			}else{
				offset.prop('disabled', false);
			}

			var timespan_item = timespan_sortable.children().eq(timespan_val);
			var timespan_interval = timespan_item.find('.interval').val()|0;
			var timespan_name = timespan_item.find('.name-input').val();

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



						if(values[i].indexOf('+') != -1){

							text += ` (year ${sorted[i]}, ${sorted[i]*2*timespan_interval}, ${sorted[i]*3*timespan_interval}...)`;

						}else{

							text += ` (year ${total_offset}, ${total_offset+sorted[i]*timespan_interval}, ${total_offset+sorted[i]*2*timespan_interval}...)`;

						}


					}else{

						if(timespan_interval == '1'){
							text += `<br>• but also every ${ordinal_suffix_of(sorted[i])} year`;
						}else{
							text += `<br>• but also every ${ordinal_suffix_of(sorted[i])} ${timespan_name}`;
						}

						if(values[i].indexOf('+') != -1){

							text += ` (year ${sorted[i]}, ${sorted[i]*2*timespan_interval}, ${sorted[i]*3*timespan_interval}...)`;

						}else{

							text += ` (year ${total_offset}, ${total_offset+sorted[i]*timespan_interval}, ${total_offset+sorted[i]*2*timespan_interval}...)`;

						}


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
		static_data.seasons.global_settings.enable_weather = checked;
		$('#weather_inputs').toggleClass('hidden', !checked);
		$('#weather_inputs').find('select, input').prop('disabled', !checked);
		repopulate_location_select_list();
	});

	$(document).on('change', '.year-input', function(){
		repopulate_timespan_select($(this).closest('.date_control').find('.timespan-list'));
		repopulate_day_select($(this).closest('.date_control').find('.timespan-day-list'))
	});

	$(document).on('change', '.timespan-list', function(){
		repopulate_day_select($(this).closest('.date_control').find('.timespan-day-list'))
	});

	$('#reseed_seasons').click(function(){
		$('#seasons_seed').val(Math.abs((Math.random().toString().substr(7)|0))).change();
	});


	$(document).on('change', '.sortable-container.leap-day', function(){

		var changed_timespan = $(this).find('.timespan-list');
		var changed_days = $(this).find('.timespan-day-list');

		$('.timespan-list').each(function(){
			repopulate_timespan_select($(this), $(this).val(), changed_timespan == $(this));
		});

		$('.timespan-day-list').each(function(){
			repopulate_day_select($(this), $(this).val(), changed_days == $(this));
		});

	});




	$('#temp_sys').change(function(){

		var new_val = $(this).val();
		var old_val = static_data.seasons.global_settings.temp_sys;

		if((new_val == "metric" || new_val == "both_m") && (old_val == "imperial" || old_val == "both_i")){

			$('input[fc-index="temp_low"], input[fc-index="temp_high"]').each(function(){

				var val = $(this).val()|0;

				$(this).val(precisionRound(fahrenheit_to_celcius(val), 4));

			}).change();

		}else if((new_val == "imperial" || new_val == "both_i") && (old_val == "metric" || old_val == "both_m")){

			$('input[fc-index="temp_low"], input[fc-index="temp_high"]').each(function(){

				var val = $(this).val()|0;

				$(this).val(precisionRound(celcius_to_fahrenheit(val), 4)).change;

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

			var key = target.attr('fc-index');

			if(type.includes('cycles') && type.includes('names')){

				current_calendar_data[type[type.length-1]] = [];

				target.closest('.cycle_list').children().each(function(i){
					current_calendar_data[type[type.length-1]][i] = $(this).val();
				});

			}else{

				if(!target.is(':disabled')){

					switch(target.attr('type')){
						case "number":
							if(target.attr('step') === "any"){
								var value = parseFloat(target.val());
							}else{
								var value = parseInt(target.val().split('.')[0]);
							}
							target.val(value);
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

					if(type.length > 1){
						current_calendar_data = current_calendar_data[type[type.length-1]];
					}

					current_calendar_data[key] = value;

				}
			}


			if(data.includes('event_data.categories')){
				var key = data.split('.')[2]|0;
				for(var eventkey in static_data.event_data.events){
					if(static_data.event_data.events[eventkey].event_category_id == static_data.event_data.categories[key].id){
						static_data.event_data.events[eventkey].settings = clone(static_data.event_data.categories[key].event_settings);
					}
				}
				repopulate_event_category_lists();
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

			do_error_check(type[0], refresh);

		}else if(target.attr('class') !== undefined && target.attr('class').indexOf('static_input') > -1){


			var type = target.attr('data').split('.');

			var current_calendar_data = static_data;

			for(var i = 0; i < type.length; i++){
				current_calendar_data = current_calendar_data[type[i]];
			}

			var key = target.attr('fc-index');
			var key2 = false;

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
					value = target.val();
					break;
			}

			current_calendar_data[key] = value;

			var refresh = target.attr('refresh');
			refresh = refresh === "true" || refresh === undefined;

			do_error_check(type[0], refresh);

		}

	});
}

var do_error_check = debounce(function(type, rebuild){
	error_check(type, rebuild);
	recalc_stats();
}, 150);

function add_weekday_to_sortable(parent, key, name){

	var element = [];

	element.push("<div class='sortable-container list-group-item week_day'>");
		element.push("<div class='main-container'>");
			element.push("<div class='handle icon-reorder'></div>");
			element.push("<div class='name-container'>");
				element.push(`<input type='text' value='${name}' class='form-control name-input small-input dynamic_input' data='year_data.global_week' index='${key}' tabindex='${(key+1)}'/>`);
			element.push("</div>");
			element.push("<div class='remove-spacer'></div>");
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
	element.push(`<div class='sortable-container list-group-item ${data.type} collapsed' type='${data.type}' index='${key}'>`);
		element.push("<div class='main-container'>");
			element.push("<div class='handle icon-reorder'></div>");
			element.push("<div class='expand icon-collapse'></div>");
			element.push("<div class='name-container'>");
				element.push(`<input type='text' value='${data.name}' step='1.0' tabindex='${(100+key)}'class='name-input small-input form-control dynamic_input' data='year_data.timespans.${key}' fc-index='name'/>`);
			element.push("</div>");
			element.push(`<div class='length_input'><input type='number' min='1' class='length-input form-control dynamic_input timespan_length' data='year_data.timespans.${key}' fc-index='length' tabindex='${(100+key)}' value='${data.length}'/></div>`);
			element.push('<div class="remove-spacer"></div>');
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
									element.push(`<input type='number' step="1" min='1' class='form-control timespan_occurance_input interval dynamic_input small-input' data='year_data.timespans.${key}' fc-index='interval' value='${data.interval}' />`);
							element.push("</div>");
						element.push("</div>");

						element.push("<div class='detail-column half'>");
							element.push("<div class='detail-row'>");
								element.push("<div class='detail-text'>Offset:</div>");
								element.push(`<input type='number' step="1" class='form-control timespan_occurance_input offset dynamic_input small-input' min='0' data='year_data.timespans.${key}' fc-index='offset' value='${data.offset}'`);
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
								element.push(`<input type='checkbox' class='unique-week-input' index='${key}'`);
								element.push(data.week ? "checked" : "");
								element.push("/>");
							element.push("</div>");
						element.push("</div>");
						element.push("<div class='detail-column half'>");
							element.push("<div class='detail-row'>");
								element.push("<div class='detail-text'>Length:</div>");
								element.push(`<input type='number' step="1" class='form-control week-length small-input' ${(!data.week ? "disabled" : "")} value='${(data.week ? data.week.length : 0)}'/>`);
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
									element.push(`<input type='text' class='form-control internal-list-name dynamic_input custom_week_day' data='year_data.timespans.${key}.week' fc-index='${index}' value='${data.week[index]}'/>`);
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

	element.push(`<div class='sortable-container ${(data.intercalary ? 'intercalary leap-day' : 'leap-day')} index='${key}' collapsed'>`);
		element.push("<div class='main-container'>");
			element.push("<div class='expand icon-collapse'></div>");
			element.push("<div class='name-container'>");
				element.push(`<input type='text' value='${data.name}' class='name-input small-input form-control dynamic_input' data='year_data.leap_days.${key}' fc-index='name' tabindex='${(200+key)}'/>`);
			element.push("</div>");
			element.push('<div class="remove-spacer"></div>');
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

						element.push(`<input type='hidden' class='form-control year-input hidden' value='0'>`);

						element.push("<div class='detail-row'>");
							element.push("<div class='detail-column'>");
								element.push("<div class='detail-row'>");
									element.push("<div class='detail-column'>");
										element.push("<div class='detail-text'>Timespan: </div>");
									element.push("</div>");
									element.push("<div class='detail-column'>");
										element.push(`<select type='number' class='custom-select form-control leap_day_occurance_input timespan-list dynamic_input full timespan_special' data='year_data.leap_days.${key}' fc-index='timespan'>`);
										for(var j = 0; j < static_data.year_data.timespans.length; j++)
										{
											element.push(`<option value="${j}" ${(j==data.timespan ? "selected" : "")}>${static_data.year_data.timespans[j].name}</option>`);
										}
										element.push("</select>");
									element.push("</div>");
								element.push("</div>");
							element.push("</div>");
						element.push("</div>");

						element.push(`<div class='detail-row adds_week_day_container ${(!data.intercalary ? "" : "hidden")}'>`);
							element.push("<div class='detail-column half'>");
								element.push("<div class='detail-row'>");
										element.push("<div class='detail-text'>Adds week day: </div>");
										element.push(`<input type='checkbox' class='form-control adds-week-day dynamic_input' data='year_data.leap_days.${key}' fc-index='adds_week_day' ${(data.adds_week_day ? "checked" : "")} />`);
								element.push("</div>");
							element.push("</div>");
						element.push("</div>");

						element.push(`<div class='adds_week_day_data_container ${(data.adds_week_day && !data.intercalary ? "" : "hidden")}'>`);
							element.push(`<div class='detail-row'>`);
								element.push("<div class='detail-column'>");
									element.push("<div class='detail-row'>");
										element.push("<div class='detail-text'>Week day name: </div>");
										element.push(`<input type='text' class='form-control internal-list-name dynamic_input' data='year_data.leap_days.${key}' fc-index='week_day' value='${(data.week_day && !data.intercalary ? data.week_day : 'Weekday')}' ${(data.adds_week_day && !data.intercalary ? "" : "disabled")}/>`);
									element.push("</div>");
								element.push("</div>");
							element.push("</div>");
						element.push("</div>");

						element.push(`<div class='detail-row week_day_select_container ${(data.adds_week_day && !data.intercalary) ? "" : "hidden"}'>`);
							element.push("<div class='detail-column full'>");
								element.push("<div class='detail-row'>");
									element.push(`<div class='detail-text'>Select weekday: </div>`);
								element.push("</div>");
								element.push("<div class='detail-row'>");
									element.push(`<select type='number' class='custom-select form-control dynamic_input full week-day-select ${(data.adds_week_day ? "inclusive" : "")}' data='year_data.leap_days.${key}' fc-index='day'>`);

										if(data.timespan === undefined){
											var week = static_data.year_data.global_week;
										}else{
											if(data.timespan <= static_data.year_data.timespans.length){
												var week = static_data.year_data.timespans[data.timespan].week ? static_data.year_data.timespans[data.timespan].week : static_data.year_data.global_week;
											}
										}
										if(data.adds_week_day){
											element.push(`<option ${data.day == 0 ? 'selected' : ''} value='0'>Before ${week[0]}</option>`);
										}
										for(var i = 0; i < week.length; i++){
											element.push(`<option ${data.day == i ? 'selected' : ''} value='${i+1}'>${week[i]}</option>`);
										}

									element.push("</select>");
								element.push("</div>");
							element.push("</div>");
						element.push("</div>");

						element.push(`<div class='detail-row ${(!data.intercalary ? "hidden" : "")}'>`);
							element.push("<div class='detail-column full'>");
								element.push("<div class='detail-row'>");
									element.push(`<div class='detail-text'>Select after which day: </div>`);
								element.push("</div>");
								element.push("<div class='detail-row'>");
									element.push(`<select type='number' class='custom-select form-control dynamic_input full timespan-day-list exclude_self' data='year_data.leap_days.${key}' fc-index='day'>`);
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
									element.push(`<input type='text' class='form-control leap_day_occurance_input interval dynamic_input' data='year_data.leap_days.${key}' fc-index='interval' value='${data.interval}' />`);
							element.push("</div>");
						element.push("</div>");

						element.push("<div class='detail-column third'>");
							element.push("<div class='detail-row'>");
								element.push("<div class='detail-text'>Offset:</div>");
								element.push(`<input type='number' step="1" class='form-control leap_day_occurance_input offset dynamic_input' min='0' data='year_data.leap_days.${key}' fc-index='offset' value='${data.offset}'`);
								element.push(data.interval === "1" ? " disabled" : "");
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

	parent.append(element.join(""));

}

function add_moon_to_list(parent, key, data){

	var element = [];

	element.push(`<div class='sortable-container moon_inputs expanded' index='${key}'>`);
		element.push("<div class='main-container'>");
			element.push("<div class='name-container'>");
				element.push(`<input type='text' value='${data.name}' class='form-control name-input small-input dynamic_input' data='moons.${key}' fc-index='name' tabindex='${(300+key)}'/>`);
			element.push("</div>");
			element.push('<div class="remove-spacer"></div>');
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
						element.push(`<input type='checkbox' class='dynamic_input custom_phase' data='moons.${key}' fc-index='custom_phase'`);
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
							element.push(`<input type='number' step="any" class='form-control dynamic_input cycle' data='moons.${key}' fc-index='cycle' value='${!data.custom_phase ? data.cycle : ''}' />`);
						element.push("</div>");
					element.push("</div>");
					element.push("<div class='detail-column half'>");
						element.push("<div class='detail-row'>");
							element.push("<div class='detail-text'>Shift:</div>");
							element.push(`<input type='number' step="any" class='form-control dynamic_input shift' data='moons.${key}' fc-index='shift' value='${!data.custom_phase ? data.shift : ''}' />`);
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
						element.push(`<input type='text' class='form-control form-control dynamic_input custom_cycle full' data='moons.${key}' fc-index='custom_cycle' value='${data.custom_phase ? data.custom_cycle : ''}' />`);
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
						element.push("<div class='detail-text'>Moon color:</div>");
					element.push("</div>");
					element.push("<div class='detail-row'>");
						element.push("<div class='moon_color'>");
							element.push(`<input type='color' class='dynamic_input color' data='moons.${key}' fc-index='color'/>`);
						element.push("</div>");
					element.push("</div>");
				element.push("</div>");
				element.push("<div class='detail-column half'>");
					element.push("<div class='detail-row'>");
						element.push("<div class='detail-text'>Shadow color:</div>");
					element.push("</div>");
					element.push("<div class='detail-row'>");
						element.push("<div class='moon_color'>");
							element.push(`<input type='color' class='dynamic_input shadow_color' data='moons.${key}' fc-index='shadow_color'/>`);
						element.push("</div>");
					element.push("</div>");
				element.push("</div>");
			element.push("</div>");
			element.push("<div class='detail-row'>");
				element.push("<div class='detail-column half'>");
					element.push("<div class='detail-row'>");
						element.push("<div class='detail-text'>Hide from players: </div>");
						element.push(`<input type='checkbox' class='moon-hidden dynamic_input' data='moons.${key}' fc-index='hidden'`);
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
	element.push(`<div class='sortable-container season collapsed' index='${key}'>`);
		element.push("<div class='main-container'>");
			if(static_data.seasons.global_settings.periodic_seasons){
				element.push("<div class='handle icon-reorder'></div>");
			}
			element.push("<div class='expand icon-collapse'></div>");
			element.push("<div class='name-container'>");
				element.push(`<input type='text' value='${data.name}' tabindex='${(400+key)}'class='name-input small-input form-control dynamic_input' data='seasons.data.${key}' fc-index='name'/>`);
			element.push("</div>");
			element.push('<div class="remove-spacer"></div>');
		element.push("</div>");
		element.push("<div class='remove-container'>");
			element.push("<div class='remove-container-text'>Are you sure you want to remove this?</div>");
			element.push("<div class='btn_remove btn btn-danger icon-trash'></div>");
			element.push("<div class='btn_cancel btn btn-danger icon-remove'></div>");
			element.push("<div class='btn_accept btn btn-success icon-ok'></div>");
		element.push("</div>");

		element.push("<div class='detail-container hidden'>");

			if(static_data.seasons.global_settings.periodic_seasons){

				element.push(`<div class='season-duration'>`);
					element.push(`<div class='detail-row'>`);
						element.push("<div class='detail-column'>");
							element.push("<div class='detail-row'>");
								element.push("<div class='detail-text'>Duration:</div>");
								var transition_length = data.transition_length == '' || data.transition_length == undefined ? 90 : data.transition_length;
								element.push(`<input type='number' step='any' class='form-control dynamic_input transition_length protip' data='seasons.data.${key}' fc-index='transition_length' min='1' value='${transition_length}' data-pt-position="right" data-pt-title='How many days until this season ends, and the next begins.'/>`);
							element.push("</div>");
						element.push("</div>");
					element.push("</div>");
					element.push(`<div class='detail-row'>`);
						element.push("<div class='detail-column'>");
							element.push("<div class='detail-row'>");
								element.push("<div class='detail-text'>Peak duration:</div>");
								var duration = data.duration == '' || data.duration == undefined ? 0 : data.duration;
								element.push(`<input type='number' step='any' class='form-control dynamic_input duration protip' data='seasons.data.${key}' fc-index='duration' min='0' value='${duration}' data-pt-position="right" data-pt-title='If the duration is the path up a mountain, the peak duration is a flat summit. This is how many days the season will pause before going down the other side of the mountain.'/>`);
							element.push("</div>");
						element.push("</div>");
					element.push("</div>");
				element.push("</div>");

			}else{

				element.push(`<div class='date_control season-date full'>`);

					element.push("<div class='row my-1'>");
						element.push("<div class='col-5'>");
							element.push("<div class='detail-text'>Timespan:</div>");
						element.push("</div>");
						element.push("<div class='col'>");
							element.push(`<select type='number' class='date form-control form-control timespan-list dynamic_input' data='seasons.data.${key}' fc-index='timespan'>`);
							element.push("</select>");
						element.push("</div>");
					element.push("</div>");

					element.push("<div class='row my-1'>");
						element.push("<div class='col-5'>");
							element.push("<div class='detail-text'>Day:</div>");
						element.push("</div>");
						element.push("<div class='col'>");
							element.push(`<select type='number' class='date form-control form-control timespan-day-list dynamic_input' data='seasons.data.${key}' fc-index='day'>`);
							element.push("</select>");
						element.push("</div>");
					element.push("</div>");

				element.push("</div>");

			}

			element.push("<div class='clock_inputs'>");
				element.push("<div class='detail-row'>");
					element.push("<div class='detail-column full'>");
						element.push("<div class='detail-row no-margin'>");
							element.push("<div class='detail-text'>Sunrise:</div>");
						element.push("</div>");
						element.push("<div class='detail-row'>");
							element.push("<div class='detail-column clock-input'>");
								element.push(`<input type='number' step="1.0" class='form-control full dynamic_input hour_input' clocktype='sunrise_hour' data='seasons.data.${key}.time.sunrise' fc-index='hour' value='${data.time.sunrise.hour}' />`);
							element.push("</div>");
							element.push("<div class='detail-column'>:</div>");
							element.push("<div class='detail-column float clock-input'>");
								element.push(`<input type='number' step="1.0" class='form-control full dynamic_input' clocktype='sunrise_minute' data='seasons.data.${key}.time.sunrise' fc-index='minute' value='${data.time.sunrise.minute}' />`);
							element.push("</div>");
						element.push("</div>");
					element.push("</div>");
				element.push("</div>");
				element.push("<div class='detail-row'>");
					element.push("<div class='detail-column full'>");
						element.push("<div class='detail-row no-margin'>");
							element.push("<div class='detail-text'>Sunset:</div>");
						element.push("</div>");
						element.push("<div class='detail-row'>");
							element.push("<div class='detail-column clock-input'>");
								element.push(`<input type='number' step="1.0" class='form-control full dynamic_input hour_input' clocktype='sunset_hour' data='seasons.data.${key}.time.sunset' fc-index='hour' value='${data.time.sunset.hour}' />`);
							element.push("</div>");
							element.push("<div class='detail-column'>:</div>");
							element.push("<div class='detail-column float clock-input'>");
								element.push(`<input type='number' step="1.0" class='form-control full dynamic_input' clocktype='sunset_minute' data='seasons.data.${key}.time.sunset' fc-index='minute' value='${data.time.sunset.minute}' />`);
							element.push("</div>");
						element.push("</div>");
					element.push("</div>");
				element.push("</div>");

				element.push("<div class='detail-row'>");
					element.push(`<button type="button" class="btn btn-sm btn-info season_middle_btn full protip" data-pt-delay-in="100" data-pt-title="Use the median values from the previous and next seasons' time data. This season will act as a transition between the two, similar to Spring or Autumn">Interpolate sunrise & sunset from surrounding seasons</button>`);
				element.push("</div>");

			element.push("</div>");

		element.push("</div>");

	parent.append(element.join(""));
}

function add_location_to_list(parent, key, data){

	var element = [];

	element.push(`<div class='sortable-container location collapsed' index='${key}'>`);
		element.push("<div class='main-container'>");
			element.push("<div class='expand icon-collapse'></div>");
			element.push("<div class='name-container'>");
				element.push(`<input type='text' value='${data.name}' tabindex='${(500+key)}' class='name-input small-input form-control dynamic_input location-name' data='seasons.locations.${key}' fc-index='name'/>`);
			element.push("</div>");
			element.push('<div class="remove-spacer"></div>');
		element.push("</div>");

		element.push("<div class='remove-container'>");
			element.push("<div class='remove-container-text'>Are you sure you want to remove this?</div>");
			element.push("<div class='btn_remove btn btn-danger icon-trash'></div>");
			element.push("<div class='btn_cancel btn btn-danger icon-remove'></div>");
			element.push("<div class='btn_accept btn btn-success icon-ok'></div>");
		element.push("</div>");

		element.push("<div class='detail-container hidden'>");

			for(var i = 0; i < data.seasons.length; i++){

			element.push(`<div class='detail-row cycle-container wrap-collapsible location_season' fc-index='${i}'>`);
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
								element.push(`<input type='text' class='form-control form-control full dynamic_input' data='seasons.locations.${key}.seasons.${i}' fc-index='name' value='${data.seasons[i].name}'>`);
							}else{
								element.push(`<input type='text' class='form-control form-control full dynamic_input' data='seasons.locations.${key}.seasons.${i}' fc-index='name' value='${static_data.seasons.data[i].name}' disabled>`);
							}
						element.push("</div>");
						element.push("<div class='detail-column third'>");
							element.push("<div class='detail-row'>");
								element.push("<div class='detail-text'>Custom:</div>");
								element.push(`<input type='checkbox' class='form-control form-control-bg dynamic_input disable_local_season_name' data='seasons.locations.${key}.seasons.${i}' fc-index='custom_name' ${data.seasons[i].custom_name ? 'checked' : ''}>`);
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
							element.push(`<input type='number' step="any" class='form-control full dynamic_input' data='seasons.locations.${key}.seasons.${i}.weather' fc-index='temp_low' value='${data.seasons[i].weather.temp_low}'>`);
						element.push("</div>");
						element.push("<div class='detail-column half'>");
							element.push(`<input type='number' step="any" class='form-control full dynamic_input' data='seasons.locations.${key}.seasons.${i}.weather' fc-index='temp_high' value='${data.seasons[i].weather.temp_high}'>`);
						element.push("</div>");
					element.push("</div>");

					element.push("<div class='separator'></div>");

					element.push("<div class='detail-row'>");
						element.push("<div class='detail-row'>");
							element.push("Precipitation chance: (%)");
						element.push("</div>");
						element.push("<div class='detail-column threequarter'>");
							element.push("<div class='slider_percentage'></div>");
						element.push("</div>");
						element.push("<div class='detail-column quarter'>");
							element.push(`<input type='number' step="any" class='form-control form-control full dynamic_input slider_input' data='seasons.locations.${key}.seasons.${i}.weather' fc-index='precipitation' value='${data.seasons[i].weather.precipitation*100}'>`);
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
							element.push(`<input type='number' step="any" class='form-control form-control full dynamic_input slider_input' data='seasons.locations.${key}.seasons.${i}.weather' fc-index='precipitation_intensity' value='${data.seasons[i].weather.precipitation_intensity*100}'>`);
						element.push("</div>");
					element.push("</div>");

					element.push("<div class='separator'></div>");

					element.push("<div class='clock_inputs'>");
						element.push("<div class='detail-row'>");
							element.push("<div class='detail-column'>");
								element.push("<div class='detail-row no-margin'>");
									element.push("<div class='detail-text'>Sunrise:</div>");
								element.push("</div>");
								element.push("<div class='detail-row'>");
									element.push("<div class='detail-column clock-input'>");
										element.push(`<input type='number' step="1.0" class='form-control full dynamic_input' clocktype='sunrise_hour' data='seasons.locations.${key}.seasons.${i}.time.sunrise' fc-index='hour' value='${data.seasons[i].time.sunrise.hour}' />`);
									element.push("</div>");
									element.push("<div class='detail-column'>:</div>");
									element.push("<div class='detail-column float clock-input'>");
										element.push(`<input type='number' step="1.0" class='form-control full dynamic_input' clocktype='sunrise_minute' data='seasons.locations.${key}.seasons.${i}.time.sunrise' fc-index='minute' value='${data.seasons[i].time.sunrise.minute}' />`);
									element.push("</div>");
								element.push("</div>");
							element.push("</div>");
						element.push("</div>");
						element.push("<div class='detail-row'>");
							element.push("<div class='detail-column'>");
								element.push("<div class='detail-row no-margin'>");
									element.push("<div class='detail-text'>Sunset:</div>");
								element.push("</div>");
								element.push("<div class='detail-row'>");
									element.push("<div class='detail-column clock-input'>");
										element.push(`<input type='number' step="1.0" class='form-control full dynamic_input' clocktype='sunset_hour' data='seasons.locations.${key}.seasons.${i}.time.sunset' fc-index='hour' value='${data.seasons[i].time.sunset.hour}' />`);
									element.push("</div>");
									element.push("<div class='detail-column'>:</div>");
									element.push("<div class='detail-column float clock-input'>");
										element.push(`<input type='number' step="1.0" class='form-control full dynamic_input' clocktype='sunset_minute' data='seasons.locations.${key}.seasons.${i}.time.sunset' fc-index='minute' value='${data.seasons[i].time.sunset.minute}' />`);
									element.push("</div>");
								element.push("</div>");
							element.push("</div>");
						element.push("</div>");
					element.push("</div>");

					element.push("<div class='detail-row'>");
						element.push(`<button type="button" class="btn btn-sm btn-info location_middle_btn full protip" data-pt-delay-in="100" data-pt-title="Use the median values from the previous and next seasons' weather and time data. This season will act as a transition between the two, similar to Spring or Autumn">Interpolate data from surrounding seasons</button>`);
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
									element.push(`<input type='number' step="1.0" class='form-control form-control full dynamic_input' data='seasons.locations.${key}.settings.timezone' clocktype='timezone_hour' fc-index='hour' value='${data.settings.timezone.hour}' />`);
								element.push("</div>");
								element.push("<div class='detail-column'>:</div>");
								element.push("<div class='detail-column float clock-input'>");
									element.push(`<input type='number' step="1.0" class='form-control form-control full dynamic_input' data='seasons.locations.${key}.settings.timezone' clocktype='timezone_minute' fc-index='minute' value='${data.settings.timezone.minute}' />`);
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
						element.push(`<input type='float' class='form-control form-control full dynamic_input' data='seasons.locations.${key}.settings' fc-index='large_noise_frequency' value='${data.settings.large_noise_frequency}' />`);
					element.push("</div>");
					element.push("<div class='detail-column half'>");
						element.push(`<input type='float' class='form-control form-control full dynamic_input' data='seasons.locations.${key}.settings' fc-index='large_noise_amplitude' value='${data.settings.large_noise_amplitude}'>`);
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
						element.push(`<input type='float' class='form-control form-control full dynamic_input' data='seasons.locations.${key}.settings' fc-index='medium_noise_frequency' value='${data.settings.medium_noise_frequency}' />`);
					element.push("</div>");
					element.push("<div class='detail-column half'>");
						element.push(`<input type='float' class='form-control form-control full dynamic_input' data='seasons.locations.${key}.settings' fc-index='medium_noise_amplitude' value='${data.settings.medium_noise_amplitude}'>`);
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
						element.push(`<input type='float' class='form-control form-control full dynamic_input' data='seasons.locations.${key}.settings' fc-index='small_noise_frequency' value='${data.settings.small_noise_frequency}' />`);
					element.push("</div>");
					element.push("<div class='detail-column half'>");
						element.push(`<input type='float' class='form-control form-control full dynamic_input' data='seasons.locations.${key}.settings' fc-index='small_noise_amplitude' value='${data.settings.small_noise_amplitude}'>`);
					element.push("</div>");
				element.push("</div>");

			element.push("</div>");

		element.push("</div>");

	parent.append(element.join(""));
}

function add_cycle_to_sortable(parent, key, data){

	var element = [];

	element.push("<div class='sortable-container cycle_inputs collapsed' index='${key}'>");
		element.push("<div class='main-container'>");
			element.push("<div class='handle icon-reorder'></div>");
			element.push("<div class='expand icon-collapse'></div>");
			element.push(`<div class='detail-text'>Cycle #${(key+1)} - Using {{${(key+1)}}}</div>`);
			element.push('<div class="remove-spacer"></div>');
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
									element.push(`<input type='number' step="1.0" class='form-control length dynamic_input' min='1' data='cycles.data.${key}' fc-index='length' value='${data.length}' />`);
							element.push("</div>");
						element.push("</div>");

						element.push("<div class='detail-column half'>");
							element.push("<div class='detail-row'>");
								element.push("<div class='detail-text'>Offset:</div>");
								element.push(`<input type='number' step="1.0" class='form-control offset dynamic_input' min='0' data='cycles.data.${key}' fc-index='offset' value='${data.offset}'/>`);
							element.push("</div>");
						element.push("</div>");
					element.push("</div>");

					element.push("<div class='detail-row'>");
						element.push("<div class='detail-column full'>");
							element.push("<div class='detail-row'>");
								element.push("<div class='detail-text'>Number of names:</div>");
								element.push(`<input type='number' step="1.0" class='form-control cycle-name-length' value='${data.names.length}' fc-index='${key}'/>`);
							element.push("</div>");
						element.push("</div>");
					element.push("</div>");
					element.push("<div class='detail-row cycle-container wrap-collapsible'>");
						element.push(`<input id='collapsible_cycle_${key}' class='toggle' type='checkbox'>`);
						element.push(`<label for='collapsible_cycle_${key}' class='lbl-toggle'>Cycle names</label>`);
						element.push("<div class='detail-column collapsible-content'>");
							element.push("<div class='cycle_list'>");
								for(index = 0; index < data.names.length; index++){
									element.push(`<input type='text' class='form-control internal-list-name dynamic_input' data='cycles.data.${key}.names' fc-index='${index}' value='${data.names[index]}'/>`);
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

	element.push("<div class='sortable-container era_inputs collapsed' index='${key}'>");
		element.push("<div class='main-container'>");
			element.push("<div class='expand icon-collapse'></div>");
			element.push("<div class='name-container'>");
				element.push(`<input type='text' value='${data.name}' class='form-control name-input small-input dynamic_input' data='eras.${key}' fc-index='name' tabindex='${(800+key)}'/>`);
			element.push("</div>");
			element.push('<div class="remove-spacer"></div>');
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
						element.push("<div class='detail-text'>Custom year header formatting:</div>");
						element.push(`<input type='checkbox' class='form-control dynamic_input use_custom_format' data='eras.${key}.settings' fc-index='use_custom_format' ${(data.settings.use_custom_format ? "checked" : "")} />`);
					element.push("</div>");
				element.push("</div>");
			element.push("</div>");

			element.push(`<div class='detail-row ${(!data.settings.use_custom_format ? "hidden" : "")}'>`);
				element.push("<div class='detail-column full'>");
					element.push("<div class='detail-row'>");
						element.push("<div class='detail-text'>Format:</div>");
						element.push(`<input type='text' class='form-control small-input dynamic_input era_formatting' data='eras.${key}' fc-index='formatting' value='${data.formatting}' />`);
							element.push("</select>");
					element.push("</div>");
				element.push("</div>");
			element.push("</div>");

			element.push("<div class='detail-row'>");
				element.push("<div class='detail-column full'>");
					element.push(`<div class='btn btn-outline-primary full era_description html_edit' value='${data.description}' data='eras.${key}' fc-index='description'>Edit event description</div>`);
				element.push("</div>");
			element.push("</div>");

			element.push("<div class='detail-row'>");
				element.push("<div class='separator'></div>");
			element.push("</div>");

			element.push("<div class='detail-row'>");
				element.push("<div class='detail-column half'>");
					element.push("<div class='detail-row'>");
						element.push("<div class='detail-text'>Show as event:</div>");
						element.push(`<input type='checkbox' class='form-control dynamic_input show_as_event' data='eras.${key}.settings' fc-index='show_as_event' ${(data.settings.show_as_event ? "checked" : "")} />`);
					element.push("</div>");
				element.push("</div>");
			element.push("</div>");

			element.push(`<div class='detail-row ${(!data.settings.show_as_event ? "hidden" : "")}'>`);
				element.push("<div class='detail-column full'>");
					element.push("<div class='detail-row'>");
						element.push("<div class='detail-text'>Event category:</div>");
						element.push(`<select type='text' class='custom-select form-control event-category-list dynamic_input' data='eras.${key}.settings' fc-index='event_category_id'>`);
							for(var catkey in static_data.event_data.categories)
							{
								var name = static_data.event_data.categories[catkey].name;
								var id = static_data.event_data.categories[catkey].id;
								element.push(`<option value="${id}" ${(catkey==data.event_category_id ? "selected" : "")}>${name}</option>`);
							}
							element.push("</select>");
					element.push("</div>");
				element.push("</div>");
			element.push("</div>");

			element.push("<div class='detail-row'>");
				element.push("<div class='separator'></div>");
			element.push("</div>");

			element.push("<div class='detail-row'>");
				element.push("<div class='detail-column half'>");
					element.push("<div class='detail-row'>");
						element.push("<div class='detail-text'>Is starting era:</div>");
						element.push(`<input type='checkbox' class='form-control dynamic_input starting_era' data='eras.${key}.settings' fc-index='starting_era' ${(data.settings.starting_era ? "checked" : "")} />`);
					element.push("</div>");
				element.push("</div>");
			element.push("</div>");

			element.push(`<div class='${data.settings.starting_era ? "hidden" : ""}'>`);

				element.push("<div class='detail-row'>");
					element.push("<div class='detail-text bold-text'>Date:</div>");
				element.push("</div>");

				element.push(`<div class='detail-row'>`);
					element.push("<div class='detail-column full date_control'>");
						element.push("<div class='detail-row'>");
							element.push("<div class='detail-column quarter'>");
								element.push("<div class='detail-text'>Year:</div>");
							element.push("</div>");
							element.push("<div class='detail-column threequarter'>");
								element.push(`<input type='number' step="1.0" class='date form-control small-input dynamic_input year-input' refresh data='eras.${key}.date' fc-index='year' value='${data.date.year}'/>`);
							element.push("</div>");
						element.push("</div>");

						element.push("<div class='detail-row'>");
							element.push("<div class='detail-column quarter'>");
								element.push("<div class='detail-text'>Timespan:</div>");
							element.push("</div>");
							element.push("<div class='detail-column threequarter'>");
								element.push(`<select type='number' class='date custom-select form-control timespan-list dynamic_input' refresh data='eras.${key}.date' fc-index='timespan'>`);
								element.push("</select>");
							element.push("</div>");
						element.push("</div>");

						element.push("<div class='detail-row'>");
							element.push("<div class='detail-column quarter'>");
								element.push("<div class='detail-text'>Day:</div>");
							element.push("</div>");
							element.push("<div class='detail-column threequarter'>");
								element.push(`<select type='number' class='date custom-select form-control timespan-day-list dynamic_input' refresh data='eras.${key}.date' fc-index='day'>`);
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
							element.push(`<input type='checkbox' class='form-control dynamic_input ends_year ${!static_data.seasons.global_settings.periodic_seasons ? " protip' disabled" : "'"} data-pt-position="right" data-pt-title='This is disabled because static seasons cannot support eras that end years, as months disappear and seasons require the assigned months.' disabled data='eras.${key}.settings' fc-index='ends_year' ${(data.settings.ends_year ? "checked" : "")} />`);
							element.push("</div>");
						element.push("</div>");

						element.push("<div class='detail-row'>");
							element.push("<div class='detail-column half'>");
								element.push("<div class='detail-text'>Restarts year count:</div>");
							element.push("</div>");
							element.push("<div class='detail-column half'>");
								element.push(`<input type='checkbox' class='form-control dynamic_input restart' data='eras.${key}.settings' fc-index='restart' ${(data.settings.restart ? "checked" : "")} />`);
							element.push("</div>");
						element.push("</div>");

					element.push("</div>");

				element.push("</div>");

			element.push("</div>");

		element.push("</div>");

	element.push("</div>");

	var element = parent.append(element.join(""));

	return element;

}

function add_category_to_list(parent, key, data){

	var element = [];

	element.push(`<div class='sortable-container list-group-item category_inputs collapsed' index='${key}'>`);

		element.push("<div class='main-container'>");
			element.push("<div class='expand icon-collapse'></div>");
			element.push("<div class='name-container'>");
				element.push(`<input type='text' value='${data.name}' name='name_input' fc-index='name' class='form-control name-input small-input dynamic_input_self' data='event_data.categories.${key}' tabindex='${(700+key)}'/>`);
			element.push("</div>");
			element.push('<div class="remove-spacer"></div>');
		element.push("</div>");
		element.push("<div class='remove-container'>");
			element.push("<div class='remove-container-text'>Are you sure you want to remove this?</div>");
			element.push("<div class='btn_remove btn btn-danger icon-trash'></div>");
			element.push("<div class='btn_cancel btn btn-danger icon-remove'></div>");
			element.push("<div class='btn_accept btn btn-success icon-ok'></div>");
		element.push("</div>");
		element.push("<div class='detail-container'>");

			element.push("<div class='detail-row'>");
					element.push("<div class='detail-text bold-text'>Category settings (global):</div>");
			element.push("</div>");

			element.push("<div class='detail-row'>");
					element.push(`<input type='hidden' class='category_id' value='${key}'>`);
			element.push("</div>");

			element.push("<div class='detail-row'>");
				element.push("<div class='detail-column half'>");
					element.push("<div class='detail-row'>");
						element.push("<div class='detail-text'>Hide from viewers:</div>");
						element.push(`<input type='checkbox' class='form-control dynamic_input global_hide' data='event_data.categories.${key}.category_settings' fc-index='hide' ${(data.category_settings.hide ? "checked" : "")} />`);
					element.push("</div>");
				element.push("</div>");
				element.push("<div class='detail-column half'>");
					element.push("<div class='detail-row'>");
						element.push("<div class='detail-text'>Usable by players:</div>");
						element.push(`<input type='checkbox' class='form-control dynamic_input player_usable' data='event_data.categories.${key}.category_settings' fc-index='player_usable' ${(data.category_settings.player_usable ? "checked" : "")} />`);
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
						element.push(`<input type='checkbox' class='form-control dynamic_input' data='event_data.categories.${key}.event_settings' fc-index='hide_full' ${(data.event_settings.hide_full ? "checked" : "")} />`);
					element.push("</div>");
				element.push("</div>");

				element.push("<div class='detail-row'>");
					element.push("<div class='detail-column half'>");
						element.push("<div class='detail-text'>Hide event:</div>");
					element.push("</div>");
					element.push("<div class='detail-column half'>");
						element.push(`<input type='checkbox' class='form-control dynamic_input local_hide' data='event_data.categories.${key}.event_settings' fc-index='hide' ${(data.event_settings.hide ? "checked" : "")} />`);
					element.push("</div>");
				element.push("</div>");

				element.push("<div class='detail-row'>");
					element.push("<div class='detail-column half'>");
						element.push("<div class='detail-text'>Don't print event:</div>");
					element.push("</div>");
					element.push("<div class='detail-column half'>");
						element.push(`<input type='checkbox' class='form-control dynamic_input noprint' data='event_data.categories.${key}.event_settings' fc-index='noprint' ${(data.event_settings.noprint ? "checked" : "")} />`);
					element.push("</div>");
				element.push("</div>");
			element.push("</div>");

			element.push("<div class='detail-row'>");
				element.push("<div class='detail-column half'>");
					element.push("<div class='detail-row'>");
						element.push("<div class='detail-column'>");
							element.push("<div class='detail-text'>Color:</div>");
						element.push("</div>");
						element.push("<div class='detail-column'>");
							element.push(`<select class='custom-select form-control dynamic_input event-text-input color_display' data='event_data.categories.${key}.event_settings' fc-index='color'>`);
								element.push(`<option ${(data.event_settings.color == 'Dark-Solid' ? ' selected' : '')}>Dark-Solid</option>`);
								element.push(`<option ${(data.event_settings.color == 'Red' ? ' selected' : '')}>Red</option>`);
								element.push(`<option ${(data.event_settings.color == 'Pink' ? ' selected' : '')}>Pink</option>`);
								element.push(`<option ${(data.event_settings.color == 'Purple' ? ' selected' : '')}>Purple</option>`);
								element.push(`<option ${(data.event_settings.color == 'Deep-Purple' ? ' selected' : '')}>Deep-Purple</option>`);
								element.push(`<option ${(data.event_settings.color == 'Blue' ? ' selected' : '')}>Blue</option>`);
								element.push(`<option ${(data.event_settings.color == 'Light-Blue' ? ' selected' : '')}>Light-Blue</option>`);
								element.push(`<option ${(data.event_settings.color == 'Cyan' ? ' selected' : '')}>Cyan</option>`);
								element.push(`<option ${(data.event_settings.color == 'Teal' ? ' selected' : '')}>Teal</option>`);
								element.push(`<option ${(data.event_settings.color == 'Green' ? ' selected' : '')}>Green</option>`);
								element.push(`<option ${(data.event_settings.color == 'Light-Green' ? ' selected' : '')}>Light-Green</option>`);
								element.push(`<option ${(data.event_settings.color == 'Lime' ? ' selected' : '')}>Lime</option>`);
								element.push(`<option ${(data.event_settings.color == 'Yellow' ? ' selected' : '')}>Yellow</option>`);
								element.push(`<option ${(data.event_settings.color == 'Orange' ? ' selected' : '')}>Orange</option>`);
								element.push(`<option ${(data.event_settings.color == 'Blue-Grey' ? ' selected' : '')}>Blue-Grey</option>`);
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
							element.push(`<select class='custom-select form-control dynamic_input event-text-input text_display' data='event_data.categories.${key}.event_settings' fc-index='text'>`);
								element.push(`<option value="text"${(data.event_settings.text == 'text' ? ' selected' : '')}>Just text</option>`);
								element.push(`<option value="dot"${(data.event_settings.text == 'dot' ? ' selected' : '')}>• Dot with text</option>`);
								element.push(`<option value="background"${(data.event_settings.text == 'background' ? ' selected' : '')}>Background</option>`);
							element.push("</select>");
						element.push("</div>");
					element.push("</div>");
				element.push("</div>");
			element.push("</div>");

			element.push("<div class='detail-row'>");
				element.push("<div class='detail-column full'>");
					element.push(`Event display: <div class='half event-text-output event ${data.event_settings.color} ${data.event_settings.text}'>Event name</div>`);
				element.push("</div>");
			element.push("</div>");

		element.push("</div>");

	element.push("</div>");

	parent.append(element.join(""));
}


function add_event_to_sortable(parent, key, data){

	var element = [];

	element.push(`<div class='sortable-container events_input list-group-item' index='${key}'>`);
		element.push("<div class='main-container'>");
			element.push("<div class='handle icon-reorder'></div>");
			element.push(`<div class='btn btn-outline-primary open-edit-event-ui event_name'>Edit - ${data.name}</div>`);
			element.push('<div class="remove-spacer"></div>');
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

	element.push(`<div class='sortable-container events_input' index='${key}'>`);
		element.push("<div class='main-container'>");
			element.push(`<div>${calendar_name}</div>`);
			element.push('<div class="remove-spacer"></div>');
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
			if(!does_timespan_appear(static_data, convert_year(era.date.year), era.date.timespan).result){
				errors.push(`Era <i>${era.name}</i> is currently on a leaping month. Please move it to another month.`);
			}
		}else{
			errors.push(`Era <i>${era.name}</i> doesn't have a valid month.`);
		}
	}

	for(var era_i = 0; era_i < static_data.eras.length-1; era_i++){
		var curr = static_data.eras[era_i];
		var next = static_data.eras[era_i+1];
		if(!curr.settings.starting_era && !next.settings.starting_era){
			if(curr.year == next.date.year && curr.settings.ends_year && next.settings.ends_year){
				errors.push(`Eras <i>${curr.name}</i> and <i>${next.name}</i> both end the same year. This is not possible.`);
			}
			if(curr.date.year == next.date.year && curr.date.timespan == next.date.timespan && curr.date.day == next.date.day){
				errors.push(`Eras <i>${static_data.eras[era_i].name}</i> and <i>${static_data.eras[era_i+1].name}</i> both share the same date. One has to come after another.`);
			}
		}
	}

	for(var season_i = 0; season_i < static_data.seasons.data.length; season_i++){
		var season = static_data.seasons.data[season_i];
		if(static_data.seasons.global_settings.periodic_seasons){
			if(season.transition_length == 0){
				errors.push(`Season <i>${season.name}</i> can't have 0 transition length.`);
			}
		}else{
			if(static_data.year_data.timespans[season.timespan].interval != 1){
				errors.push(`Season <i>${season.name}</i> can't be on a leaping month.`);
			}
		}
	}

	if(!static_data.seasons.global_settings.periodic_seasons){
		for(var season_i = 0; season_i < static_data.seasons.data.length-1; season_i++){
			var curr_season = static_data.seasons.data[season_i];
			var next_season = static_data.seasons.data[season_i+1];
			if(curr_season.timespan == next_season.timespan && curr_season.day == next_season.day){
				errors.push(`Season <i>${curr_season.name}</i> and <i>${next_season.name}</i> cannot be on the same month and day.`);
			}
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

			if(!preview_date.follow){

				update_preview_calendar();

				rebuild_calendar('preview', preview_date);

			}else{

				rebuild_calendar('calendar', dynamic_data);

				update_current_day(true);

				preview_date_follow();

			}

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

	var year = ($('#cycle_test_input').val()|0);

	var cycle_text = get_cycle(static_data, year).text;

	var text = Mustache.render(static_data.cycles.format, cycle_text);

	$('#cycle_test_result').text(text);
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

		static_data.year_data.global_week[i] = $(this).find('.name-input').val();

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

		html.push(`<option value='${i+1}'>${week[i]}</option>`);

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
			html.push(`<option value='0'>Before ${week[0]}</option>`);
		}

		for(var i = 0; i < week.length; i++){

			html.push(`<option value='${i+1}'>${week[i]}</option>`);

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
			'name': $(this).find('.name-input').val(),
			'type': $(this).attr('type'),
			'length': Number($(this).find('.length-input').val()),
			'interval': Number($(this).find('.interval').val()),
			'offset': Number($(this).find('.offset').val())
		};

		if($(this).find('.unique-week-input').is(':checked')){
			static_data.year_data.timespans[i].week = [];
			$(this).find('.collapsible-content').children().first().children().each(function(j){
				static_data.year_data.timespans[i].week[j] = $(this).val();
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
			'name': $(this).find('.name-input').val(),
			'intercalary': $(this).attr('type') == 'intercalary',
			'timespan': Number($(this).find('.timespan-list').val()),
			'adds_week_day': $(this).find('.adds-week-day').is(':checked'),
			'day': Number($(this).find('.week-day-select').val()),
			'week_day': $(this).find('.internal-list-name').val(),
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

		if(static_data.seasons.global_settings.periodic_seasons){

			static_data.seasons.data[i].transition_length = parseFloat($(this).find('.transition_length').val());
			static_data.seasons.data[i].duration = parseFloat($(this).find('.duration').val());

		}else{

			static_data.seasons.data[i].timespan = ($(this).find('.timespan-list').val()|0);
			static_data.seasons.data[i].day = ($(this).find('.timespan-day-list').val()|0);

		}

	});

	if(!static_data.seasons.global_settings.periodic_seasons){
		sort_list_by_partial_date(season_sortable);
	}

	if(key !== undefined){
		location_list.find(`.location_season[fc-index="${key}"]`).remove();
	}

	eval_clock();

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
			"name": $(this).find(".name-input").val(),
			"seasons": [],
			"settings": {
				"timezone": {
					"hour": ($(this).find("input[fc-index='timezone_hour']").val()|0),
					"minute": ($(this).find("input[fc-index='timezone_minute']").val()|0),
				},

				"large_noise_frequency": Number($(this).find("input[fc-index='large_noise_frequency']").val()),
				"large_noise_amplitude": Number($(this).find("input[fc-index='large_noise_amplitude']").val()),

				"medium_noise_frequency": Number($(this).find("input[fc-index='medium_noise_frequency']").val()),
				"medium_noise_amplitude": Number($(this).find("input[fc-index='medium_noise_amplitude']").val()),

				"small_noise_frequency": Number($(this).find("input[fc-index='small_noise_frequency']").val()),
				"small_noise_amplitude": Number($(this).find("input[fc-index='small_noise_amplitude']").val())
			}
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
				"temp_low": $(this).find('input[fc-index="temp_low"]').val()|0,
				"temp_high": $(this).find('input[fc-index="temp_high"]').val()|0,
				"precipitation": ($(this).find('input[fc-index="precipitation"]').val()|0)/100,
				"precipitation_intensity": ($(this).find('input[fc-index="precipitation_intensity"]').val()|0)/100
			};

			data.seasons[j].custom_name = $(this).find('input[fc-index="custom_name"]').prop('checked');

			if(data.seasons[j].custom_name){
				data.seasons[j].name = $(this).find('input[fc-index="name"]').val();
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

	if(static_data.seasons.locations.length == 0){
		dynamic_data.location = "Equatorial";
		dynamic_data.custom_location = false;
	}

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

	repopulate_location_select_list();

}

function reindex_cycle_sortable(){

	static_data.cycles.data = [];

	$('#cycle_sortable').children().each(function(i){
		$('.dynamic_input', this).each(function(){
			$(this).attr('data', $(this).attr('data').replace(/[0-9]+/g, i));
		});
		$(this).attr('key', i);
		$(this).find('.main-container').find('.detail-text').text(`Cycle #${i+1} - Using {{${i+1}}}`)

		static_data.cycles.data[i] = {
			'length': ($(this).find('.length').val()|0),
			'offset': ($(this).find('.offset').val()|0),
			'names': []
		};

		$(this).find('.collapsible-content').children().first().children().each(function(j){
			static_data.cycles.data[i].names[j] = $(this).val();
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
			'name': $(this).find('.name-input').val(),
			'custom_phase': $(this).find('.custom_phase').is(':checked'),
			'color': $(this).find('.color').spectrum('get', 'hex').toString(),
			'hidden': $(this).find('.moon-hidden').is(':checked'),
			'custom_cycle': $(this).find('.custom_cycle').val(),
			'cycle': ($(this).find('.cycle').val()|0),
			'shift': ($(this).find('.shift').val()|0),

		};

		if(static_data.moons[i].custom_phase){

			static_data.moons[i].granularity = Math.max.apply(null, static_data.moons[i].custom_cycle.split(','))+1;

		}else{

			static_data.moons[i].granularity = get_moon_granularity(static_data.moons[i].cycle)
		}

	});

	do_error_check();

}

function reindex_era_list(){

	sort_list_by_date(era_list);

	era_list.children().each(function(){

		var starting_era = $(this).find('.starting_era').is(':checked');

		if(starting_era){
			$(this).insertBefore(era_list.children().eq(0))
		}

	});

	static_data.eras = [];

	era_list.children().each(function(i){

		$('.dynamic_input', this).each(function(){
			$(this).attr('data', $(this).attr('data').replace(/[0-9]+/g, i));
		});

		$(this).attr('key', i);

		static_data.eras[i] = {
			'name': $(this).find('.name-input').val(),
			'formatting': $(this).find('.era_formatting').val(),
			'description': $(this).find('.era_description').attr('value'),
			'settings': {
				'use_custom_format': $(this).find('.use_custom_format').is(':checked'),
				'show_as_event': $(this).find('.show_as_event').is(':checked'),
				'starting_era': $(this).find('.starting_era').is(':checked'),
				'event_category_id': $(this).find('.event-category-list').val(),
				'ends_year': $(this).find('.ends_year').is(':checked'),
				'restart': $(this).find('.restart').is(':checked')
			},
			'date': {
				'year': ($(this).find('.year-input').val()|0),
				'timespan': ($(this).find('.timespan-list').val()|0),
				'day': ($(this).find('.timespan-day-list').val()|0)
			}
		};

		static_data.eras[i].date.epoch = evaluate_calendar_start(static_data, convert_year(static_data.eras[i].date.year), static_data.eras[i].date.timespan, static_data.eras[i].date.day).epoch;

	});

	do_error_check();

}

function sort_list_by_date(list){

	list.children().each(function(){

		var curr = $(this);
		var curr_year = (curr.find('.year-input').val()|0);
		var curr_timespan = (curr.find('.timespan-list').val()|0);
		var curr_day = (curr.find('.timespan-day-list').val()|0);

		list.children().each(function(){

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

function sort_list_by_partial_date(list){

	list.children().each(function(){

		var curr = $(this);
		var curr_timespan = (curr.find('.timespan-list').val()|0);
		var curr_day = (curr.find('.timespan-day-list').val()|0);

		list.children().each(function(){

			var comp = $(this);
			var comp_timespan = (comp.find('.timespan-list').val()|0);
			var comp_day = (comp.find('.timespan-day-list').val()|0);

			if(curr_timespan > comp_timespan){
				comp.insertBefore(curr);
			}else if(curr_timespan == comp_timespan){
				if(curr_day >= comp_day){
					comp.insertBefore(curr);
				}
			}

		});

	});

	list.change();
}

function reindex_event_category_list(){

	var new_order = [];

	event_category_list.children().each(function(i){

		var index = $(this).attr('index');

		if(isNaN(index)) {
			$(this).attr('index', index);
		} else {
			$(this).attr('index', i);
		}


		new_order[index] = static_data.event_data.categories[index];

	});

	static_data.event_data.categories = clone(new_order);

	return;
}

function reindex_events_sortable(){

	var new_order = []
	var new_events = []

	events_sortable.children().each(function(i){

		var id = Number($(this).attr('index'));

		new_order[id] = i;
		new_events[i] = static_data.event_data.events[id];
		new_events[i].sort_by = i;

		$(this).attr('index', i);

	});

	for(var event_id in static_data.event_data.events){

		var event = static_data.event_data.events[event_id];

		if(event.data.connected_events.length > 0){

			for(var connected_id in event.data.connected_events){

				event.data.connected_events[connected_id] = new_order[event.data.connected_events[connected_id]];

			}

		}

	}

	static_data.event_data.events = clone(new_events);

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

	$('.moon_inputs .shadow_color').spectrum({
		color: "#292b4a",
		preferredFormat: "hex",
		showInput: true
	});

	$('#moon_list').children().each(function(i){
		$(this).find('.color').spectrum("set", static_data.moons[i].color ? static_data.moons[i].color : "#FFFFFF");
		$(this).find('.shadow_color').spectrum("set", static_data.moons[i].shadow_color ? static_data.moons[i].shadow_color : "#292b4a");
	});

}

function evaluate_season_lengths(){

	var disable = static_data.seasons.data.length == 0 || (!static_data.seasons.global_settings.periodic_seasons && static_data.seasons.global_settings.periodic_seasons !== undefined);

	$('#season_length_text').toggleClass('hidden', disable).empty();

	if(disable){
		return;
	}

	var data = {
		'season_length': 0
	};

	var epoch_start = evaluate_calendar_start(static_data, convert_year(dynamic_data.year)).epoch;
	var epoch_end = evaluate_calendar_start(static_data, convert_year(dynamic_data.year)+1).epoch-1;
	var season_length = epoch_end-epoch_start;

	for(var i = 0; i < static_data.seasons.data.length; i++){
		current_season = static_data.seasons.data[i];
		data.season_length += current_season.transition_length;
		data.season_length += current_season.duration;
	}

	data.season_offset = static_data.seasons.global_settings.offset;

	var equal = fract_year_length(static_data) == data.season_length;

	var html = []
	html.push(`<div class='detail-row'>`)
	html.push(equal ? '<i class="detail-column fas fa-check-circle"></i>' : '<i class="detail-column fas fa-exclamation-circle"></i>');
	html.push(`<div class='detail-column'>Season length: ${data.season_length} / ${fract_year_length(static_data)} (year length)</div></div>`)
	html.push(`<div class='detail-row'>${equal ? "The season length and year length are the same, and will not drift away from each other." : "The season length and year length at not the same, and will diverge over time. Use with caution."}</div>`)

	$('#season_length_text').toggleClass('warning', !equal).toggleClass('valid', equal);
	$('#season_length_text').html(html.join(''));

}

function recalc_stats(){
	var year_length = fract_year_length(static_data);
	var month_length = avg_month_length(static_data);
	$('#fract_year_length').text(year_length);
	$('#fract_year_length').prop('title', year_length);
	$('#avg_month_length').text(month_length);
	$('#avg_month_length').prop('title', month_length);
	evaluate_season_lengths();
}


function adjustInput(element, int){
	if(int > 0){
		var element = $(element).prev();
	}else{
		var element = $(element).next();
	}
	element.val((element.val()|0)+int).change();

}

function calendar_saving(){

	var text = "Saving..."

	save_button.prop('disabled', true).toggleClass('btn-secondary', true).toggleClass('btn-primary', false).toggleClass('btn-success', false).toggleClass('btn-warning', false).text(text);

}

function calendar_saved(){

	calendar_name_same = calendar_name == prev_calendar_name;
	static_same = JSON.stringify(static_data) === JSON.stringify(prev_static_data);
	dynamic_same = JSON.stringify(dynamic_data) === JSON.stringify(prev_dynamic_data);

	var not_changed = static_same && dynamic_same && calendar_name_same;

	if(not_changed){

		var text = "Saved!"

		save_button.prop('disabled', true).toggleClass('btn-secondary', false).toggleClass('btn-success', true).toggleClass('btn-primary', false).toggleClass('btn-warning', false).text(text);

		setTimeout(evaluate_save_button, 3000);

	}

}

function calendar_save_failed(){

	var text = "Failed to save!"

	save_button.prop('disabled', true).toggleClass('btn-secondary', false).toggleClass('btn-success', true).toggleClass('btn-primary', false).toggleClass('btn-warning', true).text(text);

}

function evaluate_save_button(){

	if($('#btn_save').length){

		calendar_name_same = calendar_name == prev_calendar_name;
		static_same = JSON.stringify(static_data) === JSON.stringify(prev_static_data);
		dynamic_same = JSON.stringify(dynamic_data) === JSON.stringify(prev_dynamic_data);

		var not_changed = static_same && dynamic_same && calendar_name_same;

		var text = static_same && dynamic_same && calendar_name_same ? "No changes to save" : "Save calendar";

		save_button.prop('disabled', not_changed).toggleClass('btn-secondary', false).toggleClass('btn-success', not_changed).toggleClass('btn-primary', !not_changed).toggleClass('btn-warning', false).text(text);

	}else if($('#btn_create').length){

		calendar_name_same = calendar_name == prev_calendar_name;
		static_same = JSON.stringify(static_data) === JSON.stringify(prev_static_data);
		dynamic_same = JSON.stringify(dynamic_data) === JSON.stringify(prev_dynamic_data);

		var not_changed = static_same && dynamic_same && calendar_name_same;

		var text = static_same && dynamic_same && calendar_name_same ? "Cannot create yet" : "Create calendar";

		autosave();

		create_button.prop('disabled', not_changed).toggleClass('btn-danger', not_changed).toggleClass('btn-success', !not_changed).text(text);

	}

}

function populate_calendar_lists(){

	link_changed();

	if(link_data.master_hash !== ""){
		return;
	}

	get_owned_calendars(function(owned_calendars){

		for(var calendar in owned_calendars){
			if(owned_calendars[calendar].children == ""){
				owned_calendars[calendar].children = JSON.parse(owned_calendars[calendar].children);
			}
		}

		calendar_link_list.html('');

		for(var calendar in link_data.children){
			var child = link_data.children[calendar];
			var calendar = owned_calendars[child];
			add_link_to_list(calendar_link_list, calendar, calendar.name);
		}

		var html = [];

		html.push(`<option>None</option>`);

		for(var calendarhash in owned_calendars){

			var calendar = owned_calendars[calendarhash];

			if(calendar.hash != hash){

				if(calendar.master_hash){

					var owner = clone(owned_calendars[calendar.hash]);

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

	$("#date_inputs :input, #date_inputs :button").prop("disabled", has_master);
	$(".calendar_link_explaination").toggleClass("hidden", !has_master);

}

function repopulate_event_category_lists(){

	var html = [];
	html.push("<option selected value='-1'>None</option>")

	for(var categoryId in static_data.event_data.categories){
		var category = static_data.event_data.categories[categoryId];

		if(typeof category.id !== "undefined") {
			slug = category.id;
		} else {
			slug = slugify(category.name);
		}
		html.push(`<option value='${slug}'>`)
		html.push(category.name)
		html.push("</option>")
	}

	$('.event-category-list').each(function(){
		var val = $(this).val();
		$(this).html(html.join("")).val(val);
	});

}

function evaluate_clock_inputs(){

	$('#clock_inputs :input, #clock_inputs :button').prop('disabled', !static_data.clock.enabled);
	$('#clock_inputs').toggleClass('hidden', !static_data.clock.enabled);

	$('.hour_input').each(function(){
		$(this).prop('min', 0).prop('max', static_data.clock.hours).prop('disabled', !static_data.clock.enabled).toggleClass('hidden', !static_data.clock.enabled);
	});
	$('.minute_input').each(function(){
		$(this).prop('min', 1).prop('max', static_data.clock.minutes-1).prop('disabled', !static_data.clock.enabled).toggleClass('hidden', !static_data.clock.enabled);
	});

	$('#create_season_events').prop('disabled', static_data.seasons.data.length == 0 && static_data.clock.enabled);

}

function recalculate_era_epochs(){

	for(var i = 0; i < static_data.eras.length; i++){
		static_data.eras[i].date.epoch = evaluate_calendar_start(static_data, convert_year(static_data.eras[i].date.year), static_data.eras[i].date.timespan, static_data.eras[i].date.day).epoch;
	}

}

function set_up_edit_values(){

	$('#calendar_name').val(calendar_name);

	$('.static_input').each(function(){

		var data = $(this).attr('data');
		var key = $(this).attr('fc-index');

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
		let weekdayname = static_data.year_data.global_week[i];
		add_weekday_to_sortable(global_week_sortable, i, weekdayname);
	}
	populate_first_day_select(static_data.year_data.first_day);
	$('#first_week_day_container').toggleClass('hidden', !static_data.year_data.overflow).find('select').prop('disabled', !static_data.year_data.overflow);
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

			repopulate_timespan_select(season_sortable.children().last().find('.timespan-list'), static_data.seasons.data[i].timespan, false, true);
			repopulate_day_select(season_sortable.children().last().find('.timespan-day-list'), static_data.seasons.data[i].day, false, true);
		}

		$('.season_offset_container').prop('disabled', !static_data.seasons.global_settings.periodic_seasons).toggleClass('hidden', !static_data.seasons.global_settings.periodic_seasons);

		$('.season_text.dated').toggleClass('active', !static_data.seasons.global_settings.periodic_seasons);
		$('.season_text.periodic').toggleClass('active', static_data.seasons.global_settings.periodic_seasons);

		evaluate_season_lengths();

		for(var i = 0; i < static_data.seasons.locations.length; i++){
			add_location_to_list(location_list, i, static_data.seasons.locations[i]);
		}

		periodic_seasons_checkbox.prop("checked", static_data.seasons.global_settings.periodic_seasons);

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

	$('#create_season_events').prop('disabled', !static_data.clock.enabled);

	if(static_data.cycles){
		for(var i = 0; i < static_data.cycles.data.length; i++){
			add_cycle_to_sortable(cycle_sortable, i, static_data.cycles.data[i]);
		}
		update_cycle_example_text();
	}

	if($('#collapsible_clock').is(':checked')){
		$('#clock').prependTo($('#collapsible_clock').parent().children('.collapsible-content'));
	}else{
		$('#clock').prependTo($('#collapsible_date').parent().children('.collapsible-content'));
	}

	if(static_data.year_data.leap_days){

		for(var i = 0; i < static_data.year_data.leap_days.length; i++){

			var leap_day = clone(static_data.year_data.leap_days[i]);

			add_leap_day_to_list(leap_day_list, i, leap_day);

		}

		leap_day_list.children().each(function(i){

			var leap_day = clone(static_data.year_data.leap_days[i]);

			if(!leap_day.intercalary && leap_day.adds_week_day){
				repopulate_weekday_select($(this).find('.week-day-select'), leap_day.day, false);
			}
			if(leap_day.intercalary){
				repopulate_day_select($(this).find('.timespan-day-list'), leap_day.day, false);
			}
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
		for(var key in static_data.event_data.categories){
			var category = static_data.event_data.categories[key];
			var catkey = (typeof category.sort_by !== "undefined") ? category.sort_by : slugify(category.name);
			add_category_to_list(event_category_list, catkey, category);
		}
	}

	if(static_data.event_data.events){
		for(var eventId in static_data.event_data.events){
			add_event_to_sortable(events_sortable, eventId, static_data.event_data.events[eventId]);
		}
	}


	$('#weather_inputs').toggleClass('hidden', !static_data.seasons.global_settings.enable_weather);
	$('#weather_inputs').find('select, input').prop('disabled', !static_data.seasons.global_settings.enable_weather);

	if(window.location.pathname != '/calendars/create') {

        populate_calendar_lists();

        if(link_data.master_hash !== ''){

    		get_all_master_data(function(result){

        		master_static_data = result.static_data;
        		master_dynamic_data = result.dynamic_data;
        		master_last_dynamic_change = new Date(result.last_dynamic_change);
        		master_last_static_change = new Date(result.last_static_change);

        	})

        }

    }
  
		populate_calendar_lists();
  
	}

	evaluate_clock_inputs();

	evaluate_remove_buttons();

	repopulate_event_category_lists();

	$('#cycle_test_input').click();

	recalc_stats();

}


function get_category(search) {
	if(static_data.event_data.categories.length == 0){
		return {id: -1};
	}

	var results = static_data.event_data.categories.filter(function(element) {
		return element.id == search;
	});

	if(results.length < 1) {
		return {id: -1};
	}

	return results[0];
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


function autosave(){

	var saved_data = JSON.stringify({
		calendar_name: calendar_name,
		static_data: static_data,
		dynamic_data: dynamic_data
	})

	localStorage.setItem('autosave', saved_data);

}

function autoload(){

	var saved_data = localStorage.getItem('autosave')

	if(saved_data){

		swal({
			title: "Load unsaved calendar?",
			text: "It looks like you started a new calendar and didn't save it. Would you like to continue where you left off?",
            buttons: {
                cancel: {
                    text:"Start Over",
                    value: false,
                    closeModal: true,
                    visible: true
                },
                confirm: {
                    text: "Continue",
                    closeModal: false,
                }
            },
			icon: "info"
		})
		.then((load) => {

			if(load) {

				var data = JSON.parse(saved_data);
                prev_dynamic_data = {}
                prev_static_data = {}
                calendar_name = data.calendar_name;
                static_data = data.static_data;
                dynamic_data = data.dynamic_data;
                dynamic_data.epoch = evaluate_calendar_start(static_data, convert_year(dynamic_data.year), dynamic_data.timespan, dynamic_data.day).epoch;
                empty_edit_values();
                set_up_edit_values();
                set_up_view_values();
                set_up_visitor_values();

				error_check("calendar", true);

                swal({
                    icon: "success",
                    title: "Loaded!",
                    text: "The calendar " + calendar_name + " has been loaded.",
                    button: true
                });

            }else{

            	localStorage.clear();

            }

		});

	}

}
