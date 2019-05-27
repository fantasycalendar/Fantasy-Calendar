function set_up_visitor_inputs(){
	
	target_year = $('#target_year');
	target_timespan = $('#target_timespan');
	target_day = $('#target_day');


	$('.btn_preview_date').click(function(){

		var target = $(this).attr('key');
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


	preview_date = clone(date);

	if(preview_date){

		target_year.val(preview_date.year);
		target_year.data('val', target_year.val());

		var curr_timespan = repopulate_timespan_select(target_timespan, convert_year(preview_date.year));
		repopulate_day_select(target_day, convert_year(preview_date.year), curr_timespan);

	}

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
		if(value == 1){
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
		if(value == -1){
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
		
		if(tar_year == 0){
			if(preview_date.year < 0){
				tar_year = 1;
			}else if(preview_date.year > 0){
				tar_year = -1;
			}
			$(this).data('val', tar_year);
			$(this).val(tar_year);
		}


		var tar_timespan = repopulate_timespan_select(target_timespan, convert_year(tar_year));

		repopulate_day_select(target_day, convert_year(tar_year), tar_timespan);

	});

	target_timespan.change(function(){

		var tar_year = target_year.val()|0;

		var tar_timespan = $(this).val()|0;
		var prev_timespan = $(this).data('val')|0;

		repopulate_day_select(target_day, convert_year(tar_year), tar_timespan);

	});

	$('#go_to_preview_date').click(function(){
		var tar_year = target_year.val()|0;
		var tar_timespan = target_timespan.val()|0;
		var tar_day = target_day.val()|0;
		set_preview_date(tar_year, tar_timespan, tar_day);
	});

	$('#reset_preview_date').click(function(){
		target_year.val(date.year);
		target_timespan.val(date.timespan);
		target_day.val(date.day);
		set_date(date.year, date.timespan, date.day);
	});

	

	$('#input_collapse_btn').click(function(){
		$("#input_container").toggleClass('inputs_collapsed');
		evaluate_error_background_size();
	})

}

function set_preview_date(year, timespan, day){

	var rebuild = false;

	if((preview_date.year != year || (preview_date.year == year && preview_date.year != date.year))
		||
		(calendar.settings.show_current_month && (preview_date.timespan != timespan || (preview_date.timespan == timespan && preview_date.timespan != date.timespan)))
	){
		rebuild = true;
	}

	preview_date.year = year;
	preview_date.timespan = timespan;
	preview_date.day = day;

	if(rebuild){
		rebuild_calendar('preview', preview_date);
	}

}


function evaluate_settings(){

	$('.btn_container').toggleClass('hidden', !owner && !calendar.settings.allow_view);
	$('.btn_preview_date[key="year"]').prop('disabled', !owner && !calendar.settings.allow_view).toggleClass('hidden', !owner && !calendar.settings.allow_view);
	$('.btn_preview_date[key="timespan"]').prop('disabled', !owner && !calendar.settings.show_current_month).toggleClass('hidden', !owner && !calendar.settings.show_current_month)

}