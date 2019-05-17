window.onbeforeunload = function() {
	return true;
};

var event_view = false;
var weather_view = false;

var calendar = {};
var display_calendar = {};
var day_data = {};
var events = [];
var custom_climates = {};
var date;
var number;
var last_tab = 'generate';

var calendar_name = $('#calendar_name');

var current_hour = $('#current_hour_input');
var current_minute = $('#current_minute_input');
var hours_input = $('#hours_input');

var current_era = $('#current_era');
var current_year = $('#current_year');
var current_month = $('#current_month');
var current_day = $('#current_day');

var year_len = $('#year_len');
var year_leap = $('#year_leap');
var month_leap = $('#month_leap');
var leap_month_container = $('#leap_month_container')
var n_months = $('#n_months');
var month_list = $('#month_list');
var overflow_months = $('#overflow_months');
var week_len = $('#week_len');
var week_day_list = $('#week_day_list');
var first_day_list = $('#first_day');
var n_moons = $('#n_moons');
var moon_list = $('#moon_list');

var clock_enabled = $('#clock_enabled');
var solstice_enabled = $('#solstice_enabled');

var summer_solstice_month = $('#summer_solstice_month');
var winter_solstice_month = $('#winter_solstice_month');

var weather_enabled = $('#weather_enabled');
var weather_seed = $('#weather_seed');
var btn_weather_random_seed = $('#btn_weather_random_seed');
var weather_climate = $('#weather_climate');

var weather_climate_name = $('#weather_climate_name');
var weather_climate_save = $('#weather_climate_save');
var weather_climate_delete = $('#weather_climate_delete');

var weather_cinematic = $('#weather_cinematic');
var weather_temp_scale = $('#weather_temp_scale');
var weather_temp_amplitude = $('#weather_temp_amplitude');

var weather_winter_temp_cold = $('#weather_winter_temp_cold');
var weather_winter_temp_hot = $('#weather_winter_temp_hot');
var weather_winter_precip_slider = $('#weather_winter_precip_slider');

var weather_summer_temp_cold = $('#weather_summer_temp_cold');
var weather_summer_temp_hot = $('#weather_summer_temp_hot');
var weather_summer_precip_slider = $('#weather_summer_precip_slider');

var weather_custom_temp = $('.weather_custom_temp');

var event_form = $('#event-form');

var event_repeats = $('#repeats');

var event_repeat_x = $('#event_repeat_x');

var event_from_checkbox = $('#event_from_checkbox');
var event_from_year = $('#event_from_year');
var event_from_month = $('#event_from_month');
var event_from_day = $('#event_from_day');

var event_to_checkbox = $('#event_to_checkbox');
var event_to_year = $('#event_to_year');
var event_to_month = $('#event_to_month');
var event_to_day = $('#event_to_day');

$(function () {
	$('[data-toggle="tooltip"]').tooltip()
})

$(document).ready(function(){

	current_hour.on('focusin', function(){
		$(this).data('val', $(this).val());
	});
	current_hour.change(function(){
		var prev = $(this).data('val');
		var current = $(this).val();
		if(current != '' && parseInt(current) >= 0 && parseInt(current) < parseInt(hours_input.val()))
		{
			$(this).val(parseInt(current));
			set_variables();
			eval_current_time();
			eval_sun_rise_set();
		}
		else
		{
			$(this).val(prev);
			$.notify(
				$(this).parent(),
				'Enter something less than\nyour amount of hours.', 
				{ position:"top left" }
			);
		}
	});

	current_minute.on('focusin', function(){
		$(this).data('val', $(this).val());
	});
	current_minute.change(function(){
		var prev = $(this).data('val');
		var current = $(this).val();
		if(current != '' && parseInt(current) < 60)
		{
			if(parseInt(current) < 10)
			{
				current = "0"+parseInt(current);
			}
			$(this).val(current);
			set_variables();
			eval_current_time();
			eval_sun_rise_set();
		}
		else
		{
			$(this).val(prev);
			$.notify(
				$(this).parent(),
				'Enter something between 0 and 60.', 
				{ position:"top" }
			);
		}
	});

	hours_input.on('focusin', function(){
		$(this).data('val', $(this).val());
	});
	hours_input.change(function(){
		var prev = $(this).data('val');
		var current = $(this).val();
		if(current != '' && current > 0)
		{
			$(this).val(parseInt(current));
			set_variables();
			build_clock();
			eval_current_time();
			eval_sun_rise_set();
		}
		else
		{
			$(this).val(prev);
			$.notify(
				$(this),
				'Enter something more than 0.', 
				{ position:"top right" }
			);
		}
	});

	$('.solstice_day').on('focusin', function(){
		$(this).data('val', $(this).val());
	});
	$('.solstice_day').change(function(){
		var prev = $(this).data('val');
		var current = $(this).val();
		if(current != '')
		{
			eval_sun_rise_set();
			set_variables();
			set_display_calendar();
			eval_sun_rise_set();
			evaluate_events('solstice_events');
		}
		else
		{
			$(this).val(prev);
		}
	});

	summer_solstice_month.change(function(){
		rebuild_day_list();
		set_variables();
		set_display_calendar();
		eval_sun_rise_set();
		evaluate_events('solstice_events');
	});

	winter_solstice_month.change(function(){
		rebuild_day_list();
		set_variables();
		set_display_calendar();
		eval_sun_rise_set();
		evaluate_events('solstice_events');
	});

	$('.solstice_input').on('focusin', function(){
		$(this).data('val', $(this).val());
	});
	$('.solstice_input').change(function(){
		var prev = $(this).data('val');
		var current = $(this).val();
		if(current != '' && hours_input.val() != '' && parseFloat(current) < parseInt(hours_input.val()))
		{
			if($(this).attr('id').split("_")[1] == "set" && parseFloat(current) < (parseInt(hours_input.val())/2))
			{
				$.notify(
					$(this),
					'This is not in AM/PM,\nthis is absolute hours\n(eg, 18 being 6PM)', 
					{ position:"left" }
				);
			}
			$(this).val(parseFloat(current));
			set_variables();
			eval_sun_rise_set();
		}
		else
		{
			$(this).val(prev);
		}
	});


	year_len.on('focusin', function(){
		$(this).data('val', $(this).val());
	});
	year_len.change(function(){
		var prev = $(this).data('val');
		var current = $(this).val();
		if(current != '' & parseInt(current) > 0)
		{
			$(this).val(parseInt(current));

			year_length_change();
			$(this).data('val', current);
		}
		else
		{
			$(this).val(prev);
		}
	});

	year_leap.on('focusin', function(){
		$(this).data('val', $(this).val());
	});
	year_leap.change(function(){
		var prev = $(this).data('val');
		var current = $(this).val();
		if(current != '' & parseInt(current) >= 0)
		{
			$(this).val(parseInt(current));
			if(current === "0"){
				leap_month_container.css('display', "none");
			}else{
				leap_month_container.css('display', "block");
			}

			$(this).data('val', current);
			set_variables();
			build_calendar();
		}
		else
		{
			$(this).val(prev);
		}
	});
	
	month_leap.change(function(){
		set_variables();
		rebuild_day_list();
		build_calendar();
	})


	n_months.on('focusin', function(){
		$(this).data('val', $(this).val());
	});
	n_months.change(function(){
		var prev = $(this).data('val');
		var current = $(this).val();
		if(current != '' & parseInt(current) > 0)
		{
			$(this).val(parseInt(current));
			rebuild_month_table(current);
			set_variables();
			update_date();
			build_calendar();
		}
		else
		{
			$(this).val(prev);
		}
	});


	week_len.on('focusin', function(){
		$(this).data('val', $(this).val());
	});
	week_len.change(function(){
		var prev = $(this).data('val');
		var current = $(this).val();
		if(current != '' & parseInt(current) > 0)
		{
			rebuild_week_table($(this).val());
			set_variables();
			build_calendar();
		}
		else
		{
			$(this).val('');
		}
	});
	
	n_moons.on('focusin', function(){
		$(this).data('val', $(this).val());
	});
	n_moons.change(function(){
		var prev = $(this).data('val');
		var current = $(this).val();
		if(current != '' & parseInt(current) >= 0)
		{
			rebuild_moon_table(n_moons.val());
			set_variables();
			build_calendar();
		}
		else
		{
			$(this).val('');
		}
	});
	
	$(document).on('change', '.moon_name', function(){
		set_variables();
		build_calendar();
	});
	
	$(document).on('change', '.moon_color', function(){
		set_variables();
		update_moon_colors(parseInt($(this).attr('moon_id')));
	});
	
	$(document).on('focusin', '.moon_cyc', function(){
		$(this).data('val', $(this).val());
	});
	$(document).on('change', '.moon_cyc', function(){
		var prev = $(this).data('val');
		var current = $(this).val();
		if(current != '' & parseFloat(current) > 0)
		{
			$(this).val(parseFloat(current));
			set_variables();
			build_calendar();
		}
		else
		{
			$(this).val('');
		}
	});
	
	$(document).on('focusin', '.moon_shf', function(){
		$(this).data('val', $(this).val());
	});
	$(document).on('change', '.moon_shf', function(){
		var prev = $(this).data('val');
		var current = $(this).val();
		if(current != '' & parseFloat(current) > 0)
		{
			$(this).val(parseFloat(current));
			set_variables();
			build_calendar();
		}
		else
		{
			$(this).val('');
		}
	});
	
	$(document).on('change', '.day_name', function(){
		var i = $(this).parent().index();
		first_day_list.children().eq(i).text($(this).val());
		set_variables();
		build_calendar();
	});
	
	first_day_list.change(function(){
		set_variables();
		build_calendar();
	});
	
	$(document).on('change', '.month_name', function(){
		rebuild_month_list();
		set_variables();
		build_calendar();
	});
	


	$(document).on('focusin', '.month_len', function(){
		$(this).data('val', $(this).val());
	});
	$(document).on('change', '.month_len', function(){
		var prev = $(this).data('val');
		var current = $(this).val();
		if(current != '' & parseInt(current) > 0)
		{
			evaluate_year_length();
			rebuild_day_list();
			set_variables();
			build_calendar();
		}
		else
		{
			$(this).val('');
		}
	});
	
	$('#btn-clear').click(function(){clear_data()});
	
	if($('#json_input').length){
		$('#json_input').on('input', function(){
			if($(this).val() != ''){
				try{
					$('#json_apply').prop('disabled', false);
					$(this).removeClass('alert-danger');
					$(this).addClass('alert-success');
					test = JSON.parse($(this).val());
				} catch (e){
					$('#json_apply').prop('disabled', true);
					$(this).removeClass('alert-success');
					$(this).addClass('alert-danger');
				}
			}else{
				$('#json_apply').prop('disabled', true);
				$(this).removeClass('alert-success');
				$(this).removeClass('alert-danger');
			}
		});
		$('#json_apply').click(function(){
			if($('#json_input').val() != ""){
				var json = JSON.parse($('#json_input').val());
				json_load(json);
			}
		});

		$('#presets').change(function(){
			if($('#presets :selected').val() == "Custom JSON")
			{
				$('#json_container').css('display', 'block');
			}
			else
			{
				$('#json_container').css('display', 'none');
				load_calendar($('#presets :selected').text());
			}
		});
	}else{
		$('#btn_delete').click(function(){
			delete_calendar();
		});
	}
	
	current_year.on('focusin', function(){
		$(this).data('val', $(this).val());
	});
	current_year.change(function(){
		var prev = $(this).data('val');
		var current = $(this).val();
		if(current != '')
		{
			set_variables();
			build_calendar();
		}
		else
		{
			$(this).val(prev);
		}
	});

	current_era.change(function(){
		set_variables();
		build_calendar();
	});


	current_month.change(function(){
		update_date();
	});

	current_day.on('focusin', function(){
		$(this).data('val', $(this).val());
	});
	current_day.change(function(){
		var prev = $(this).data('val');
		var current = $(this).val();
		if(current != '' && current <= display_calendar['month_len'][display_calendar['month']-1])
		{
			update_date();
		}
		else
		{
			$(this).val(prev);
		}
	});
	
	clock_enabled.change(function(){
		if($(this).prop("checked"))
		{
			$('.clock_setting_container').css('display', 'block');
			$('#clock').css('display', 'block');
		}
		else
		{
			$('.clock_setting_container').css('display', 'none');
			$('#clock').css('display', 'none');
		}
		set_variables();
	});

	solstice_enabled.change(function(){
		if($(this).prop("checked"))
		{
			$('.solstice_setting_container').css('display', 'block');
		}
		else
		{
			$('.solstice_setting_container').css('display', 'none');
			$('#auto_events').prop('checked', false);
		}
		$('#auto_events').prop('disabled', !$(this).prop("checked"));
		set_variables();
		build_clock();
	});

	weather_enabled.change(function(){

		disable = !weather_enabled.prop("checked");

		weather_seed.prop('disabled', disable);

		$('.weather_setting').each(function(){
			$(this).prop('disabled', disable);
		});
		$('.weather_setting[name="weather_temp_sys"][value="imperial"]').prop('checked', true);
		$('.weather_setting[name="weather_wind_sys"][value="imperial"]').prop('checked', true);
		btn_weather_random_seed.prop('disabled', disable);
		weather_climate.prop('disabled', disable);

		weather_cinematic.prop('disabled', disable);

		weather_temp_scale.slider("value", 10);
		weather_temp_scale.prev().val(10);
		weather_temp_scale.slider(disable ? 'disable' : 'enable');

		weather_temp_amplitude.slider("value", 75);
		weather_temp_amplitude.prev().val(75);
		weather_temp_amplitude.slider(disable ? 'disable' : 'enable');

		if(weather_seed.val() == ""){
			weather_seed.val(parseInt(Math.random().toString().substr(2)));
		}

		if(weather_enabled.prop("checked")){
			update_weather_inputs();
		}

		set_variables();

		if(weather_enabled.prop("checked")){
			build_calendar();
		}

	});

	btn_weather_random_seed.click(function(){
		Math.seedrandom();
		weather_seed.val(parseInt(Math.random().toString().substr(2)));
		set_variables();
		generate_weather();
	});

	weather_climate.change(function(){
		update_weather_inputs();
		set_variables();
		generate_weather();
	});

	weather_cinematic.change(function(){
		set_variables();
		generate_weather();
	});

	$('.weather_setting_temp').change(function(){
		update_weather_inputs();
		set_variables();
		generate_weather();
	});

	weather_climate_name.change(function(){
		weather_climate_save.prop('disabled', weather_climate_name.val().length == 0);
	})

	weather_climate_save.click(function(){
		add_custom_climate();
		update_weather_inputs();
		set_variables();
		generate_weather();
	})

	weather_climate_delete.click(function(){
		remove_custom_climate(weather_climate.val());
		update_weather_inputs();
		set_variables();
		generate_weather();
	})


	$('.weather_setting_wind').change(function(){
		set_variables();
		generate_weather();
	});

	weather_custom_temp.change(function(){
		update_custom_climate();
		set_variables();
		generate_weather();
	});

	$('.slider').slider({
		min: 0,
		max: 100,
		disabled: true,
		slide: function( event, ui ) {
			$(this).prev().val(ui.value)
		},
		change: function( event, ui ) {
			if(event.originalEvent){
				update_custom_climate();
				set_variables();
				generate_weather();
			}
		}
	});

	overflow_months.change(function(){
		set_variables();
		build_calendar();
	});

	calendar_name.change(function(){
		set_variables();
	});

	$('.btn_procedural').click(function(){
		var function_name = $(this).attr('function');
		var arguments = parseFloat($(this).attr('arguments'));
		executeFunctionByName(function_name, window, arguments);
	});
	
	$('#btn_save').click(function(){
		save_calendar();
	});
	
	$('#login_button').click(function(){
		set_session();
	});

	$('#btn_clear').click(function(){
		clear_data();
	});
	
	$('#btn_save').prop('disabled', true);

	// ----------- Settings inputs -----------
	$('#allow_view').change(function(){
		if(!$(this).prop('checked')){
			$('#only_backwards').prop('checked', false);
			$('#only_backwards').prop('disabled', true);
		}else{
			$('#only_backwards').prop('disabled', false);
		}
	});

	$('.setting').change(function(){
		set_variables();
		build_clock();
		build_calendar();
	});
	
	$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {

		tab = e.target.href.substring(e.target.href.lastIndexOf("#") + 1, e.target.href.length);

		if(tab === "generate")
		{
			$('#presets').prop('disabled', false).css('display', 'block');
			$('#json_apply').prop('disabled', false).css('display', 'block');
			showcase_view = false;
			event_view = false;
			weather_view = false;
			set_variables();
			build_clock();
			build_calendar();
		}
		else if(tab === "weather")
		{
			$('#presets').prop('disabled', true).css('display', 'none');
			$('#json_apply').prop('disabled', true).css('display', 'none');
			weather_view = true;
			build_weather_data();
		}
		else if(tab === "settings")
		{
			$('#presets').prop('disabled', true).css('display', 'none');
			$('#json_apply').prop('disabled', true).css('display', 'none');
			showcase_view = true;
			event_view = false;
			weather_view = false;
			set_variables();
			build_clock();
			build_calendar();
		}
		else if(tab === "events")
		{
			$('#presets').prop('disabled', true).css('display', 'none');
			$('#json_apply').prop('disabled', true).css('display', 'none');
			event_view = true;
			weather_view = false;
			build_events();
		}

		last_tab = tab;
	})

	$(document).on('click', '.btn_event_edit', function(){;
		edit_event(parseInt($(this).attr('event_id')))
	});
	
	get_session();

	/* ------------------ Events ------------------- */

	if($("#event-form").length){

		$('#event_background').click(function(){
			hide_event_dialog($(this));
		});

		$("#event-form").form(function(e){
			e.stopPropagation();
		});

		$(document).on('click', '.btn_create_event', function(){
			show_event_dialog($(this).prev());
		});

		$('#btn_event_delete').click(function(e){
			e.preventDefault();
			id = parseInt($('#event-form').attr('event_id'));
			remove_event(id);
			if(event_view){
				build_events();
			}
			$('#event_background').fadeOut(150, function(){
				$('#event-form')[0].reset();
			});
		});

		event_repeats.change(function(){

			event_from_checkbox.prop('disabled', $('#repeats :selected').val() == 'once').change();

			value = $('#repeats :selected').val();

			if(value.split('_')[0] === 'every')
			{
				$('#multimoon').css('display', 'none');
				event_repeat_x.css('display', 'block');
			}
			else if(value == 'multimoon_every' || value == 'multimoon_monthly' || value == 'multimoon_anually')
			{
				$('#multimoon').css('display', 'block');
				event_repeat_x.css('display', 'none');
			}
			else
			{
				$('#multimoon').css('display', 'none');
				event_repeat_x.css('display', 'none');
			}

			event_repeat_x.rules('add', {
				required: value.split('_')[0] === 'every'
			});
		});

		event_repeat_x.change(function(){
			if(parseInt(event_repeat_x.val()))
			{	

				repeat_value = ordinal_suffix_of(parseInt(event_repeat_x.val()));

				repeats.find('option[value="every_x_day"]').text('Every ' + repeat_value+ ' day');
				repeats.find('option[value="every_x_weekday"]').text('Every ' + repeat_value + ' '+day_data['week_day_name']);
				repeats.find('option[value="every_x_monthly_date"]').text('Every ' + repeat_value + ' month on the ' + ordinal_suffix_of(day_data['day']));
				repeats.find('option[value="every_x_monthly_weekday"]').text('Every ' + repeat_value + ' month on the ' + ordinal_suffix_of(day_data['week_day_number']) + ' ' + day_data['week_day_name']);
				repeats.find('option[value="every_x_annually_date"]').text('Every ' + repeat_value + ' year on the '+ordinal_suffix_of(day_data['day'])+' of '+day_data['month_name']);
				repeats.find('option[value="every_x_annually_weekday"]').text('Every ' + repeat_value + ' year on the '+ordinal_suffix_of(day_data['week_day_number'])+' '+day_data['week_day_name']+' in '+day_data['month_name']);
			}
		});

		event_from_checkbox.on('change', function(){
			event_evaluate_date_ranges();
		});
		event_from_year.on('change', function(){
			event_evaluate_date_ranges();
		});
		event_from_month.on('change', function(){
			rebuild_day_list();
			event_evaluate_date_ranges();
		});
		event_from_day.on('change', function(){
			event_evaluate_date_ranges();
		});

		event_to_checkbox.on('change', function(){
			event_evaluate_date_ranges();
		});
		event_to_year.on('change', function(){
			event_evaluate_date_ranges();
		});
		event_to_month.on('change', function(){
			rebuild_day_list();
			event_evaluate_date_ranges();
		});
		event_to_day.on('change', function(){
			event_evaluate_date_ranges();
		});

		function event_evaluate_date_ranges(){

			// Enable the from date inputs if the from date checkbox is checked
			event_from_year.prop('disabled', !event_from_checkbox.is(':checked'));
			event_from_month.prop('disabled', !event_from_checkbox.is(':checked'));
			event_from_day.prop('disabled', !event_from_checkbox.is(':checked'));

			event_to_checkbox.prop('disabled', !event_from_checkbox.is(':checked') || $('#repeats :selected').val() == 'once');

			if(event_from_checkbox.is(':checked'))
			{
				
				event_to_year.prop('disabled', !event_to_checkbox.is(':checked'));
				event_to_month.prop('disabled', !event_to_checkbox.is(':checked'));
				event_to_day.prop('disabled', !event_to_checkbox.is(':checked'));

				to_is_checked = event_to_checkbox.is(':checked');
				to_year_greater = parseInt(event_to_year.val()) > parseInt(event_from_year.val());

				event_from_month.children().each(function(month_index){
					is_below = parseInt(event_to_month.val()) < month_index+1;
					$(this).prop('disabled', is_below && to_is_checked && !to_year_greater);
				});

				event_to_month.children().each(function(month_index){
					is_greater = parseInt(event_from_month.val()) > month_index+1;
					$(this).prop('disabled', is_greater && !to_year_greater);
				});


				event_from_day.children().each(function(day_index){
					is_below = parseInt(event_to_day.val()) < day_index+1;
					month_greater = parseInt(event_to_month.val()) > parseInt(event_from_month.val());
					$(this).prop('disabled', is_below && to_is_checked && !to_year_greater && !month_greater);
				});

				event_to_day.children().each(function(day_index){
					is_greater = parseInt(event_from_day.val()) > day_index+1;
					month_greater = parseInt(event_to_month.val()) > parseInt(event_from_month.val());
					$(this).prop('disabled', is_greater && !to_year_greater && !month_greater);
				});

				// Enable the to date inputs if the to date checkbox is checked
				if(!event_to_checkbox.is(':checked'))
				{

					selected_from_month = parseInt(event_from_month.val());

					event_from_year.rules('add', {
						max: day_data['year']
					});

					event_from_month.rules('add', {
						max: display_calendar['n_months']-1
					});

					event_from_day.rules('add', {
						min: 1,
						max: display_calendar['month_len'][selected_from_month-1]
					});

				}
				else
				{

					event_from_year.rules('add', {
						max: parseInt(event_to_year.val())
					});

					console.log(parseInt(event_to_year.val()) > parseInt(event_from_year.val()));

					event_from_month.rules('add', {
						min: 0,
						max: parseInt(event_to_year.val()) > parseInt(event_from_year.val()) ? display_calendar['n_months'] : parseInt(event_to_month.not(':disabled').last().val())
					});

					event_from_day.rules('add', {
						min: 1,
						max: parseInt(event_to_year.val()) > parseInt(event_from_year.val()) || parseInt(event_to_month.val()) > parseInt(event_from_month.val()) ? display_calendar['month_len'][selected_from_month-1] : parseInt(event_to_day.not(':disabled').last().val())
					});

					selected_to_month = parseInt(event_to_month.val());

					event_to_year.rules('add', {
						min: parseInt(event_from_year.val())
					});

					event_to_month.rules('add', {
						min: parseInt(event_to_year.val()) > parseInt(event_from_year.val()) ? 0 : parseInt(event_from_month.not(':disabled').last().val()),
						max: display_calendar['n_months']
					});

					event_to_day.rules('add', {
						min: parseInt(event_to_year.val()) > parseInt(event_from_year.val()) || parseInt(event_to_month.val()) > parseInt(event_from_month.val()) ? 1 :parseInt(event_from_day.not(':disabled').last().val()),
						max: display_calendar['month_len'][selected_to_month-1]
					});

				}

			}else{

				event_to_checkbox.prop('checked', event_from_checkbox.is(':checked') && !event_from_checkbox.is(':checked'));

			}

		}

		event_form.validate({
			errorLabelContainer: "#event_messagebox",
			wrapper: "div",
			errorClass: 'alert alert-danger',
			rules: {
				event_name: {
	  				required: true,
	  				maxlength: 50
  				},
				event_desc: {
	  				maxlength: 600
  				},
				event_repeat_x: {
					min: 1,
	  				required: false
  				},
  				event_from_year: {
  					required: "#event_from_checkbox:checked"
  				},
  				event_from_month: {
  					required: "#event_from_checkbox:checked"
  				},
  				event_from_day: {
  					required: "#event_from_checkbox:checked"
  				},
  				event_to_year: {
  					required: "#event_to_checkbox:checked"
  				},
  				event_to_month: {
  					required: "#event_to_checkbox:checked"
  				},
  				event_to_day: {
  					required: "#event_to_checkbox:checked"
  				}
			},
			messages: {
				event_name: "Please enter an event name.",
				event_from_year: "Please enter a year equal or lesser than year " + calendar['year'] + ".",
				event_from_month: {
					required:"Please select a month",
					max: "Please select a month before the 'to' month."
				},
				event_repeat_x: {
					required: "Please enter a number greater than 1.",
					min: "Please enter a number greater than 1."
				},
				event_from_day: {
					required: "Please select a day",
					max: "Please select a day before the 'to' day."
				},
				event_to_year: "Please enter a year equal or greater than year " + calendar['year'] + ".",
				event_to_month: {
					required:"Please select a month",
					min: "Please select a month after the 'from' month."
				},
				event_to_day: {
					required: "Please select a day",
					min: "Please select a day after the 'from' day."
				}
			},
			submitHandler: function(form){

				var event_data = {};

				event_data['id'] = typeof $('#event-form').attr("event_id") !== 'undefined' ? parseInt($('#event-form').attr("event_id")) : calendar['events'].length;
				event_data['name'] = $('#event_name').val();
				event_data['class'] = 'event';
				event_data['description'] = $('#event_desc').val();
				event_data['hide'] = $('#event_hide_players').is(':checked');
				event_data['data'] = {};
				event_data['noprint'] = $('#event_dontprint_checkbox').is(':checked');

				repeating = parseInt($('#event_repeat_x').val()) ? parseInt($('#event_repeat_x').val()) : 0;

				if(event_from_checkbox.is(':checked'))
				{
					event_data['from_date'] = {
						'year': parseInt(event_from_year.val()),
						'month': parseInt(event_from_month.val()),
						'day': parseInt(event_from_day.val()),
						'epoch': get_epoch(parseInt(event_from_year.val()), parseInt(event_from_month.val()), parseInt(event_from_day.val()))
					};
				}

				if(event_to_checkbox.is(':checked'))
				{
					event_data['to_date'] = {
						'year': parseInt(event_to_year.val()),
						'month': parseInt(event_to_month.val()),
						'day': parseInt(event_to_day.val()),
						'epoch': get_epoch(parseInt(event_to_year.val()), parseInt(event_to_month.val()), parseInt(event_to_day.val()))
					}
				}

				if(!$('#repeats').is(':disabled'))
				{
					event_data['repeats'] = $('#repeats :selected').val();
					moon_id = $('#repeats :selected').attr('moon_id');

					switch(event_data['repeats'])
					{
						case 'once':
							event_data['data'] = {'year': day_data['year'],
												  'month': day_data['month'],
												  'day': day_data['day']};
							break;

						case 'daily':
							event_data['data'] = true;
							break;

						case 'weekly':
							event_data['data'] = {'week_day': day_data['week_day']};
							break;

						case 'fortnightly':
							event_data['data'] = {'week_day': day_data['week_day'],
												  'week_even': day_data['week_even']};
							break;

						case 'monthly_date':
							event_data['data'] = {'day': day_data['day']};
							break;

						case 'annually_date':
							event_data['data'] = {'month': day_data['month'],
												  'day': day_data['day']};
							break;

						case 'monthly_weekday':
							event_data['data'] = {'week_day': day_data['week_day'],
												  'week_day_number': day_data['week_day_number']};
							break;

						case 'annually_month_weekday':
							event_data['data'] = {'month': day_data['month'],
												  'week_day': day_data['week_day'],
												  'week_day_number': day_data['week_day_number']};
							break;

						case 'every_x_day':
							event_data['data'] = {'every': repeating,
												  'modulus': (day_data['epoch']%repeating)};
							break;

						case 'every_x_weekday':
							event_data['data'] = {'week_day': day_data['week_day'],
												  'every': repeating,
												  'modulus': (Math.floor(day_data['epoch']/display_calendar['week_len'])%repeating)};
							break;

						case 'every_x_monthly_date':
							event_data['data'] = {'day': day_data['day'],
												  'every': repeating,
												  'modulus': (Math.floor(day_data['epoch']/display_calendar['week_len'])%repeating)};
							break;

						case 'every_x_monthly_weekday':
							event_data['data'] = {'week_day': day_data['week_day'],
												  'week_day_number': day_data['week_day_number'],
												  'every': repeating,
												  'modulus': (Math.floor(day_data['epoch']/display_calendar['week_len'])%repeating)};
							break;

						case 'every_x_annually_date':
							event_data['data'] = {'month': day_data['month'],
												  'day': day_data['day'],
												  'every': repeating,
												  'modulus': day_data['year']%repeating};
							break;

						case 'every_x_annually_weekday':
							event_data['data'] = {'month': day_data['month'],
												  'week_day': day_data['week_day'],
												  'week_day_number': day_data['week_day_number'],
												  'every': repeating,
												  'modulus': day_data['year']%repeating};
							break;

						case 'moon_every':
							event_data['data'] = {'moon_id': parseInt(moon_id),
												  'moon_phase': day_data['moons'][moon_id]['moon_phase']};
							break;

						case 'moon_monthly':
							event_data['data'] = {'moon_id': parseInt(moon_id),
												  'moon_phase': day_data['moons'][moon_id]['moon_phase'],
												  'moon_phase_number': day_data['moons'][moon_id]['moon_phase_number']};
							break;

						case 'moon_anually':
							event_data['data'] = {'moon_id': parseInt(moon_id),
												  'moon_phase': day_data['moons'][moon_id]['moon_phase'],
												  'moon_phase_number': day_data['moons'][moon_id]['moon_phase_number'],
												  'month': day_data['month']};
							break;

						case 'multimoon_every':
							event_data['data']['moons'] = [];
							for(moon_index = 0; moon_index < display_calendar['moons'].length; moon_index++){
								event_data['data']['moons'][moon_index] = {
									'moon_phase': day_data['moons'][moon_index]['moon_phase']
								};
							}
							break;

						case 'multimoon_anually':
							event_data['data']['month'] = day_data['month'];
							event_data['data']['moons'] = [];
							for(moon_index = 0; moon_index < display_calendar['moons'].length; moon_index++){
								event_data['data']['moons'][moon_index] = {
									'moon_phase': day_data['moons'][moon_index]['moon_phase']
								};
							}
							break;

						default:
							break;
					}
				}
				else
				{
					event_data['data'] = calendar['events'][event_data['id']]['data'];
					event_data['repeats'] = calendar['events'][event_data['id']]['repeats'];
				}

				insert_event(event_data);

				$('#event_background').fadeOut(150, function(){
					$('#event-form')[0].reset();
				});
			}
		});

		event_form.on('reset', function(){

			$('#btn_event_delete').css('display', 'none');
			$('#btn_event_delete').prop('disabled', true);
			$('#event_from_checkbox').prop('disabled', true);
			$('#event_from_checkbox').prop('checked', false);
			$('#event_to_checkbox').prop('disabled', true);
			$('#event_to_checkbox').prop('checked', false);
			$('#event_from_year').prop('disabled', true);
			$('#event_from_month').prop('disabled', true);
			$('#event_from_day').prop('disabled', true);
			$('#event_to_year').prop('disabled', true);
			$('#event_to_month').prop('disabled', true);
			$('#event_to_day').prop('disabled', true);
			$('#event-form').attr('event_id', '');
			$('#multimoon').empty().css('display', 'none');

		});

	}

});

function executeFunctionByName(functionName, context /*, args */) {
	var args = Array.prototype.slice.call(arguments, 2);
	var namespaces = functionName.split(".");
	var func = namespaces.pop();
	for(var i = 0; i < namespaces.length; i++) {
		context = context[namespaces[i]];
	}
	return context[func].apply(context, args);
}

function get_session()
{
	$.ajax({
		url:window.baseurl+"ajax/ajax_calendar",
		type: "post",
		dataType: 'json',
		data: {action: 'session_get'},
		success: function(result){
			if(!result['error'])
			{
				json_load(result);
			}
		},
		error: function (log)
		{
			//console.log(log);
		}
	});
}