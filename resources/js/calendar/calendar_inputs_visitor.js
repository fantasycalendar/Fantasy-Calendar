function context_set_current_date(key, opt){

	var epoch = $(opt.$trigger[0]).attr('epoch');

	var epoch_data = evaluated_static_data.epoch_data[epoch];

	dynamic_date_manager.year = convert_year(static_data, epoch_data.year);
	dynamic_date_manager.timespan = epoch_data.timespan_number;
	dynamic_date_manager.day = epoch_data.day;
	dynamic_date_manager.epoch = epoch_data.epoch;

	evaluate_dynamic_change();

}

function context_set_preview_date(key, opt){

	var epoch = $(opt.$trigger[0]).attr('epoch');

	var epoch_data = evaluated_static_data.epoch_data[epoch];

	set_preview_date(epoch_data.year, epoch_data.timespan_number, epoch_data.day, epoch_data.epoch);
}

function context_copy_link_date(element){

	var epoch = element.attr('epoch')|0;

	var epoch_data = evaluated_static_data.epoch_data[epoch];

	var year = epoch_data.year;
	var timespan = epoch_data.timespan_number;
	var day = epoch_data.day;

	if(!valid_preview_date(year, timespan, day) && !window.hide_copy_warning){
		swal.fire({
			title: "Date inaccessible",
			html: '<p>This date is not visible to guests or players, settings such as "Allow advancing view in calendar" and "Show only up to current day" can affect this.</p><p>Are you sure you want to copy a link to it?</p>',
			input: 'checkbox',
			inputPlaceholder: 'Remember this choice',
			inputClass: "form-control",
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes',
			icon: "info"
		})
		.then((result) => {
			if(!result.dismiss) {
				copy_link(epoch_data);
				if(result.value){
					window.hide_copy_warning = true;
				}
			}
		});
	}else{
		copy_link(epoch_data);
	}
}

function copy_link(epoch_data){

	var year = epoch_data.year;
	var timespan = epoch_data.timespan_number;
	var day = epoch_data.day;

	var link = `${window.location.origin}/calendars/${hash}?year=${year}&month=${timespan}&day=${day}`;

	const el = document.createElement('textarea');
	el.value = link;
	document.body.appendChild(el);
	el.select();
	document.execCommand('copy');
	document.body.removeChild(el);

	if(window.hide_copy_warning){
		$.notify(
			"Quick reminder: The copied date will not be visible to\nguests or players due to your calendar's settings.",
			"warn"
		);
	}else{
		$.notify(
			"Copied to clipboard!",
			"success"
		);
	}

}

function context_add_event(key, opt){
	var epoch = $(opt.$trigger[0]).attr('epoch')|0;
	window.dispatchEvent(new CustomEvent('event-editor-modal-new-event', { detail: { name: "", epoch: epoch } }));
}

function context_open_day_data(key, opt){

	var day_element = $(opt.$trigger[0]);
	var epoch = day_element.attr('epoch')|0;
	var epoch_data = evaluated_static_data.epoch_data[epoch];
	day_data_tooltip.show(day_element, epoch_data);

}

function set_up_visitor_inputs(){

    document.addEventListener('keydown', function(event) {
        if(event.code === 'AltLeft') {
            window.altPressed = true;
        }
    });

    document.addEventListener('keyup', function(event) {
        if(event.code === 'AltLeft') {
            window.altPressed = false;
        }
    });

    $('#calendar_container').scroll(function(event) {
        if($('#top_follower').height() < $(this).scrollTop()) {
            $('#top_follower').addClass('follower_shadow');
        } else {
            $('#top_follower').removeClass('follower_shadow');
        }
	});

	$.contextMenu({
		selector: ".event:not(.event-text-output)",
		items: {
			view: {
				name: "View event",
				icon: "fas fa-eye",
				callback: function(key, opt){
					let element = $(opt.$trigger[0]);
					let event_id = element.attr('event');
					window.dispatchEvent(new CustomEvent('event-viewer-modal-view-event', { detail: { id: event_id, era: element.hasClass('era_event'), epoch: element.parent().parent().attr('epoch') } }));
				},
				disabled: function(key, opt){
					let element = $(opt.$trigger[0]);
					return element.hasClass('era_event');
				},
				visible: function(key, opt){
					let element = $(opt.$trigger[0]);
					return !element.hasClass('era_event');
				}
			},
			edit: {
				name: "Edit event",
				icon: "fas fa-edit",
				callback: function(key, opt){
					let element = $(opt.$trigger[0]);
					let event_id = element.attr('event');
					window.dispatchEvent(new CustomEvent('event-editor-modal-edit-event', { detail: { event_id: event_id, epoch: element.parent().parent().attr('epoch') } }));
				},
				disabled: function(key, opt){
					let element = $(opt.$trigger[0]);
					let event_id = element.attr('event');
					return !Perms.can_modify_event(event_id) || element.hasClass('era_event');
				},
				visible: function(key, opt){
					let element = $(opt.$trigger[0]);
					let event_id = element.attr('event');
					return Perms.can_modify_event(event_id) && !element.hasClass('era_event');
				}
			},
			clone: {
				name: "Clone event",
				icon: "fas fa-clone",
				callback: function(key, opt){
					let element = $(opt.$trigger[0]);
					let event_id = element.attr('event');
                    window.dispatchEvent(new CustomEvent('event-editor-modal-clone-event', { detail: { event_id: event_id, epoch: element.parent().parent().attr('epoch') } }));
				},
				disabled: function(key, opt){
					let element = $(opt.$trigger[0]);
					let event_id = element.attr('event');
					return !Perms.can_modify_event(event_id) || element.hasClass('era_event');
				},
				visible: function(key, opt){
					let element = $(opt.$trigger[0]);
					let event_id = element.attr('event');
					return Perms.can_modify_event(event_id) && !element.hasClass('era_event');
				}
			},
			view_era: {
				name: "View era description",
				icon: "fas fa-eye",
				callback: function(key, opt){
					let element = $(opt.$trigger[0]);
					let event_id = element.attr('event');
					window.dispatchEvent(new CustomEvent('event-viewer-modal-view-event', { detail: { id: event_id, era: element.hasClass('era_event'), epoch: element.parent().parent().attr('epoch') } }));
				},
				disabled: function(key, opt){
					let element = $(opt.$trigger[0]);
					return !element.hasClass('era_event');
				},
				visible: function(key, opt){
					let element = $(opt.$trigger[0]);
					return element.hasClass('era_event');
				}
			},
			edit_era: {
				name: "Edit era description",
				icon: "fas fa-edit",
				callback: function(key, opt){
					let element = $(opt.$trigger[0]);
					let era_id = element.attr('event')|0;
					window.dispatchEvent(new CustomEvent('html-editor-modal-edit-html', { detail: { era_id: era_id } }));
				},
				disabled: function(key, opt){
					let element = $(opt.$trigger[0]);
					return !element.hasClass('era_event') || !Perms.user_is_owner() || window.location.href.indexOf('/edit') == -1;
				},
				visible: function(key, opt){
					let element = $(opt.$trigger[0]);
					return element.hasClass('era_event') && Perms.user_is_owner() && window.location.href.indexOf('/edit') != -1;
				}
			},
			hide: {
				name: "Hide event",
				icon: "fas fa-eye-slash",
				callback: function(key, opt){
					let element = $(opt.$trigger[0]);
					let event_id = Number(element.attr('event'));
					submit_hide_show_event(event_id);
				},
				disabled: function(key, opt){
					let element = $(opt.$trigger[0]);
					let event_id = Number(element.attr('event'));
					return element.hasClass('era_event') || events[event_id].settings.hide || !Perms.can_modify_event(event_id);
				},
				visible: function(key, opt){
					let element = $(opt.$trigger[0]);
					let event_id = Number(element.attr('event'));
					return !element.hasClass('era_event') && !events[event_id].settings.hide && Perms.can_modify_event(event_id);
				}
			},
			show: {
				name: "Show event",
				icon: "fas fa-eye-slash",
				callback: function(key, opt){
					let element = $(opt.$trigger[0]);
					let event_id = Number(element.attr('event'));
					submit_hide_show_event(event_id);
				},
				disabled: function(key, opt){
					let element = $(opt.$trigger[0]);
					let event_id = Number(element.attr('event'));
					return element.hasClass('era_event') || !events[event_id].settings.hide || !Perms.can_modify_event(event_id);
				},
				visible: function(key, opt){
					let element = $(opt.$trigger[0]);
					let event_id = Number(element.attr('event'));
					return !element.hasClass('era_event') && events[event_id].settings.hide && Perms.can_modify_event(event_id);
				}
			},
			delete: {
				name: "Delete event",
				icon: "fas fa-trash-alt",
				callback: function(key, opt){
					let element = $(opt.$trigger[0]);
					let event_id = element.attr('event');
					window.dispatchEvent(new CustomEvent('event-editor-modal-delete-event', { detail: { event_id: event_id } }));
				},
				disabled: function(key, opt){
					let element = $(opt.$trigger[0]);
					let event_id = element.attr('event');
					return element.hasClass('era_event') || !Perms.can_modify_event(event_id);
				},
				visible: function(key, opt){
					let element = $(opt.$trigger[0]);
					let event_id = element.attr('event');
					return !element.hasClass('era_event') && Perms.can_modify_event(event_id);
				}
			}
		},
		zIndex: 1501
	});

    var items = {};

	items.set_current_date = {
		name: "Set as Current Date",
		icon: "fas fa-hourglass-half",
		callback: context_set_current_date,
		disabled: function(key, opt){
			let element = $(opt.$trigger[0]);
			let epoch = element.attr('epoch');
			return epoch == dynamic_data.epoch || !Perms.player_at_least('co-owner');
		},
		visible: function(){
			return Perms.player_at_least('co-owner');
		}
	}

	items.set_preview_date = {
		name: "Set as Preview Date",
		icon: "fas fa-hourglass",
		callback: context_set_preview_date,
		disabled: function(key, opt){
			let element = $(opt.$trigger[0]);
			let epoch = element.attr('epoch');
			return epoch == preview_date.epoch || !static_data.settings.allow_view && !Perms.player_at_least('co-owner');
		},
		visible: function(key, opt){
			return static_data.settings.allow_view || Perms.player_at_least('co-owner');
		}
	}

	items.add_event = {
		name: "Add new event",
		icon: "fas fa-calendar-plus",
		callback: context_add_event,
		disabled: function(){
			return !(Perms.player_at_least('player'));
		},
		visible: function(key, opt){
			return Perms.player_at_least('player');
		}
	}

	items.copy_link_date = {
		name: "Copy link to date",
		icon: "fas fa-link",
		callback: function(key, opt){
			context_copy_link_date($(opt.$trigger[0]));
		},
		disabled: function(){
			return !static_data.settings.allow_view && !Perms.player_at_least('co-owner');
		},
		visible: function(key, opt){
			return static_data.settings.allow_view || Perms.player_at_least('co-owner');
		}
	}

	items.day_data = {
		name: "View advanced day info",
		icon: "fas fa-cogs",
		callback: context_open_day_data,
		disabled: function(){
			return !Perms.player_at_least('co-owner');
		},
		visible: function(){
			return Perms.player_at_least('co-owner');
		}
	}

	items.view_events = {
		name: "View events on this date",
		icon: "fas fa-eye",
		callback: function(key, opt){
			let epoch = $(opt.$trigger[0]).attr('epoch') | 0;
			let found_events = CalendarRenderer.render_data.event_epochs[epoch].events;
			let event_id = found_events[0].index;
			let era_event = found_events[0].era;
			window.dispatchEvent(new CustomEvent('event-viewer-modal-view-event', { detail: { id: event_id, era: era_event, epoch: epoch } }));
		}
	}

	$.contextMenu({
		selector: ".timespan_day:not(.empty_timespan_day)",
		items: items,
		zIndex: 1501,
        events: {
            preShow: function(event) {
                return !window.altPressed;
            }
        },
		build: function($trigger, e){

			if(static_data.settings.layout == "minimalistic"){

				delete items.view_events['items'];

				let epoch = $($trigger[0]).attr('epoch') | 0;
				let found_events = CalendarRenderer.render_data.event_epochs[epoch].events;

				items.view_events.visible = function(){ return found_events.length > 0 };
				items.view_events.disabled = found_events.length == 0;

				if(found_events.length > 1){

					items.view_events.name = "View events on this date";
					let sub_items = {};
					for(var i = 0; i < found_events.length; i++){
						let event_id = found_events[i].index;
						let event_name = sanitizeHtml(found_events[i].name);
						let era_event = found_events[i].era;
						sub_items[event_id] = {
							name: event_name,
							id: event_id,
							callback: function(key, opt) {
								window.dispatchEvent(new CustomEvent('event-viewer-modal-view-event', { detail: { id: event_id, era: era_event, epoch: epoch } }));
							}
						}
					}
					items.view_events['items'] = sub_items;

				}else if(found_events.length == 1){

					items.view_events.name = sanitizeHtml(`View event "${events[found_events[0].index].name}"`)

				}

			}else{
				items.view_events.disabled = true;
				items.view_events.visible = function(){ return false };
			}

			let show_menu = false;
			for(var i in items){
				if(items[i].visible()){
					show_menu = true
				}
			}

			if(!show_menu){
				return false;
			}

			return {
				items: items
			};
		}
	});

	target_year = $('#target_year');
	target_timespan = $('#target_timespan');
	target_day = $('#target_day');

	follower_buttons = $('.btn_container');

	follower_year_buttons = $('.btn_preview_date[fc-index="year"]');
	follower_year_buttons_sub = $('.btn_preview_date[fc-index="year"][value="-1"]');
	follower_year_buttons_add = $('.btn_preview_date[fc-index="year"][value="1"]');

	follower_timespan_buttons = $('.btn_preview_date[fc-index="timespan"]');
	follower_timespan_buttons_sub = $('.btn_preview_date[fc-index="timespan"][value="-1"]');
	follower_timespan_buttons_add = $('.btn_preview_date[fc-index="timespan"][value="1"]');

	sub_target_year = $('#sub_target_year');
	add_target_year = $('#add_target_year');

	sub_target_timespan = $('#sub_target_timespan');
	add_target_timespan = $('#add_target_timespan');

	sub_target_day = $('#sub_target_day');
	add_target_day = $('#add_target_day');


	$('.btn_preview_date').click(function(){

		var target = $(this).attr('fc-index');
		var value = $(this).attr('value');

		if(target === 'year'){
			if(value[0] === "-"){
				sub_target_year.click();
			}else{
				add_target_year.click();
			}
		}else if(target === 'timespan'){
			if(value[0] === "-"){
				sub_target_timespan.click();
			}else{
				add_target_timespan.click();
			}
		}

		follower_year_buttons_add.prop('disabled', !preview_date_manager.check_max_year(preview_date_manager.year+1));

		follower_timespan_buttons_add.prop('disabled', !preview_date_manager.check_max_timespan(preview_date_manager.timespan+1));

		follower_eval();

	});

	var follower_eval = debounce(function(){

		$('#go_to_preview_date').click();

	}, 200);

	sub_target_day.click(function(){

		preview_date_manager.subtract_day();

		evaluate_preview_change();

	});

	sub_target_timespan.click(function(){

		preview_date_manager.subtract_timespan();

		evaluate_preview_change();

	});

	sub_target_year.click(function(){

		preview_date_manager.subtract_year();

		evaluate_preview_change();

	});

	add_target_day.click(function(){

		preview_date_manager.add_day();

		evaluate_preview_change();

	});

	add_target_timespan.click(function(){

		preview_date_manager.add_timespan();

		evaluate_preview_change();

	});

	add_target_year.click(function(){

		preview_date_manager.add_year();

		evaluate_preview_change();

	});


	target_year.change(function(e){

		if(typeof preview_date_manager == "undefined") set_up_visitor_values();

		if(e.originalEvent){
			preview_date_manager.year = convert_year(static_data, $(this).val()|0);
		}

		var year = $(this).val()|0;

		if(year != preview_date_manager.adjusted_year){
			$(this).val(preview_date_manager.adjusted_year);
			repopulate_timespan_select(target_timespan, preview_date_manager.timespan, false, preview_date_manager.last_valid_timespan);
			repopulate_day_select(target_day, preview_date_manager.day, false, false, preview_date_manager.last_valid_day);
		}

		add_target_year.prop('disabled', !preview_date_manager.check_max_year(target_year.val()|0));

		add_target_timespan.prop('disabled', !preview_date_manager.check_max_timespan((target_timespan.val()|0)+1));

		add_target_day.prop('disabled', !preview_date_manager.check_max_day((target_day.val()|0)+1));

	});

	target_timespan.change(function(e){

		if(typeof preview_date_manager == "undefined") set_up_visitor_values();

		if(e.originalEvent){
			preview_date_manager.timespan = $(this).val()|0;
		}else{
			target_timespan.children().eq(preview_date_manager.timespan).prop('selected', true);
		}
		repopulate_day_select(target_day, preview_date_manager.day, false, false, preview_date_manager.last_valid_day);

		add_target_timespan.prop('disabled', !preview_date_manager.check_max_timespan((target_timespan.val()|0)+1));

		add_target_day.prop('disabled', !preview_date_manager.check_max_day((target_day.val()|0)+1));

	});

	target_day.change(function(e){

		if(typeof preview_date_manager == "undefined") set_up_visitor_values();

		if(e.originalEvent){
			preview_date_manager.day = $(this).val()|0;
		}else{
			target_day.children().eq(preview_date_manager.day-1).prop('selected', true);
		}

		add_target_day.prop('disabled', !preview_date_manager.check_max_day((target_day.val()|0)+1));

	});

	$('#go_to_preview_date').click(function(){
		if($(this).prop('disabled')) return;
		go_to_preview_date();
	});

	$('.reset_preview_date, #reset_preview_date_button').click(function(){
		if($(this).prop('disabled')) return;
        $(this).protipHide();
		go_to_dynamic_date();
	});

}


function preview_date_follow(){

	if(preview_date.follow){

		if(typeof dynamic_date_manager == "undefined") set_up_view_values();
		if(typeof preview_date_manager == "undefined") set_up_visitor_values();

		preview_date_manager.year = dynamic_date_manager.year;
		preview_date_manager.timespan = dynamic_date_manager.timespan;
		preview_date_manager.day = dynamic_date_manager.day;

		evaluate_preview_change();

	}

}

function evaluate_preview_change(){

	if(preview_date_manager.adjusted_year != target_year.val()|0){
		target_year.change()
	}else if(preview_date_manager.timespan != target_timespan.val()|0){
		target_timespan.change()
	}else if(preview_date_manager.day != target_day.val()|0){
		target_day.change()
	}

}

function refresh_preview_inputs(){
	target_year.val(preview_date_manager.adjusted_year);
	repopulate_timespan_select(target_timespan, preview_date_manager.timespan, false, preview_date_manager.last_valid_timespan);
	repopulate_day_select(target_day, preview_date_manager.day, false, false, preview_date_manager.last_valid_day);
}


function update_preview_calendar(){

	preview_date_manager = new date_manager(target_year.val()|0, target_timespan.val()|0, target_day.val()|0);

	preview_date.year = preview_date_manager.adjusted_year;
	preview_date.timespan = preview_date_manager.timespan;
	preview_date.day = preview_date_manager.day;
	preview_date.epoch = preview_date_manager.epoch;

}

function set_preview_date(year, timespan, day, epoch){

	preview_date_manager.year = convert_year(static_data, year);
	preview_date_manager.timespan = timespan;
	preview_date_manager.day = day;
	if(epoch !== undefined){
		preview_date_manager.epoch = epoch;
	}else{
		preview_date_manager.update_epoch()
	}

	go_to_preview_date();

}


function go_to_preview_date(rebuild){

	preview_date.follow = false;

	var data = preview_date_manager.compare(preview_date);

	preview_date.year = data.year;
	preview_date.timespan = data.timespan;
	preview_date.day = data.day;
	preview_date.epoch = data.epoch;

	display_preview_back_button();

	add_target_year.prop('disabled', !preview_date_manager.check_max_year(preview_date_manager.year));

	add_target_timespan.prop('disabled', !preview_date_manager.check_max_timespan(preview_date_manager.timespan));

	add_target_day.prop('disabled', !preview_date_manager.check_max_day(preview_date_manager.day));

	follower_year_buttons_add.prop('disabled', !preview_date_manager.check_max_year(preview_date_manager.year+1));

	follower_timespan_buttons_add.prop('disabled', !preview_date_manager.check_max_timespan(preview_date_manager.timespan+1));

	rebuild = rebuild !== undefined ? rebuild : data.rebuild;

	if(rebuild){
		rebuild_calendar('preview', preview_date)
	}else{
		update_current_day();
	}

}

function display_preview_back_button(){

	if(preview_date.epoch != dynamic_data.epoch){
		$('.reset_preview_date_container.right .reset_preview_date').prop("disabled", preview_date.epoch > dynamic_data.epoch).toggleClass('hidden', preview_date.epoch > dynamic_data.epoch);
		$('.reset_preview_date_container.left .reset_preview_date').prop("disabled", preview_date.epoch < dynamic_data.epoch).toggleClass('hidden', preview_date.epoch < dynamic_data.epoch);
		$('#reset_preview_date_button').prop("disabled", false).toggleClass('hidden', false);
	}else{
		$('.reset_preview_date_container.right .reset_preview_date').prop("disabled", true).toggleClass('hidden', true);
		$('.reset_preview_date_container.left .reset_preview_date').prop("disabled", true).toggleClass('hidden', true);
		$('#reset_preview_date_button').prop("disabled", true).toggleClass('hidden', true);
		preview_date.follow = true;
	}

}

function update_current_day(recalculate){

    if(recalculate){
        dynamic_data.epoch = evaluate_calendar_start(static_data, convert_year(static_data, dynamic_data.year), dynamic_data.timespan, dynamic_data.day).epoch;
    }

    window.dispatchEvent(new CustomEvent('update-epochs', {detail: {
            current_epoch: dynamic_data.epoch,
            preview_epoch: preview_date.follow ? dynamic_data.epoch : preview_date.epoch
        }}));

    evaluate_sun();

}

function go_to_dynamic_date(rebuild){

	preview_date.follow = true

	preview_date_manager.year = dynamic_date_manager.year;
	preview_date_manager.timespan = dynamic_date_manager.timespan;
	preview_date_manager.day = dynamic_date_manager.day;

	evaluate_preview_change();

	var data = dynamic_date_manager.compare(preview_date)

	preview_date.year = data.year;
	preview_date.timespan = data.timespan;
	preview_date.day = data.day;
	preview_date.epoch = data.epoch;

	display_preview_back_button();

	rebuild = rebuild !== undefined ? rebuild : data.rebuild;

	if(rebuild){
		rebuild_calendar('preview', dynamic_data)
	}else{
		update_current_day(false)
	}

}

function evaluate_settings(){

	if(static_data){
		if(static_data.year_data.global_week.length == 0 || static_data.year_data.timespans.length == 0){
			$('.date_inputs').toggleClass('hidden', true);
			$('.date_inputs').find('select, input').prop('disabled', true);
            $('#empty_calendar_explaination').toggleClass('hidden', !(static_data.year_data.global_week.length == 0 || static_data.year_data.timespans.length == 0));
			return;
		}
	}

	$('#empty_calendar_explaination').toggleClass('hidden', true);

	$('.date_control').toggleClass('hidden', (!Perms.player_at_least('co-owner') && !static_data.settings.allow_view));
	$('.date_control').find('select, input').not('#current_hour, #current_minute').prop('disabled', !Perms.player_at_least('co-owner') && !static_data.settings.allow_view);

	$("#date_inputs :input, #date_inputs :button").prop("disabled", has_parent);
	$(".calendar_link_explanation").toggleClass("hidden", !has_parent);

	follower_buttons.toggleClass('hidden', (!Perms.player_at_least('co-owner') && !static_data.settings.allow_view));
	follower_year_buttons.prop('disabled', (!Perms.player_at_least('co-owner') && !static_data.settings.allow_view)).toggleClass('hidden', (!Perms.player_at_least('co-owner') && !static_data.settings.allow_view));
	follower_timespan_buttons.prop('disabled', !static_data.settings.show_current_month).toggleClass('hidden', !static_data.settings.show_current_month);

	if(!Perms.player_at_least('co-owner') && static_data.settings.allow_view && (static_data.settings.only_backwards || static_data.settings.only_reveal_today)){

		preview_date_manager.max_year = dynamic_data.year;

		if(static_data.settings.show_current_month){
			preview_date_manager.max_timespan = dynamic_data.timespan;
		}else{
			preview_date_manager.max_timespan = preview_date_manager.last_timespan;
		}

		add_target_year.prop('disabled', !preview_date_manager.check_max_year(preview_date_manager.year+1));
		follower_year_buttons_add.prop('disabled', !preview_date_manager.check_max_year(preview_date_manager.year+1));

		add_target_timespan.prop('disabled', !preview_date_manager.check_max_timespan(preview_date_manager.timespan+1));
		follower_timespan_buttons_add.prop('disabled', !preview_date_manager.check_max_timespan(preview_date_manager.timespan+1));

		if(static_data.settings.only_reveal_today){
			preview_date_manager.max_day = dynamic_data.day;
		}else{
			preview_date_manager.max_day = preview_date_manager.num_days;
		}

		add_target_day.prop('disabled', !preview_date_manager.check_max_day(preview_date_manager.day+1));

	}else{

		preview_date_manager.max_year = false;
		preview_date_manager.max_timespan = false;
		preview_date_manager.max_day = false;

	}

}


function eval_clock(){

	if(!Perms.user_can_see_clock()){
		$('#clock').css('display', 'none');
		return;
	}

	var clock_face_canvas = document.getElementById("clock_face");
	var clock_sun_canvas = document.getElementById("clock_sun");
	var clock_background_canvas = document.getElementById("clock_background");

	window.Clock = new CalendarClock(
		clock_face_canvas,
		clock_sun_canvas,
		clock_background_canvas,
		width       = $('#clock').width(),
		hours		= static_data.clock.hours,
		minutes		= static_data.clock.minutes,
		offset		= static_data.clock.offset,
		crowding	= static_data.clock.crowding,
		hour		= dynamic_data.hour,
		minute		= dynamic_data.minute,
		has_sun		= evaluated_static_data.processed_seasons,
		sunrise		= 6,
		sunset		= 18
	);

	$('#clock').css('display', 'block');

	eval_current_time();

}

function eval_current_time(){

	if(!Perms.user_can_see_clock()){
		$('#clock').css('display', 'none');
		return;
	}

	window.Clock.set_time(dynamic_data.hour, dynamic_data.minute);

	evaluate_sun();

}

function evaluate_sun(){

	if(!Perms.user_can_see_clock()){
		$('#clock').css('display', 'none');
		return;
	}

	if(evaluated_static_data.processed_seasons && evaluated_static_data.epoch_data[preview_date.epoch] !== undefined && evaluated_static_data.epoch_data[preview_date.epoch].season !== undefined){

		var sunset = evaluated_static_data.epoch_data[preview_date.epoch].season.time.sunset.data;
		var sunrise = evaluated_static_data.epoch_data[preview_date.epoch].season.time.sunrise.data;

		window.Clock.sunrise = sunrise;
		window.Clock.sunset = sunset;

	}

}

function repopulate_event_category_lists(){

	var html = [];
	html.push("<option selected value='-1'>None</option>")

	for(var categoryId in event_categories){

		var category = event_categories[categoryId];

		if(!category.category_settings.player_usable && !Perms.player_at_least('co-owner')) continue;

		if(!isNaN(category.id)) {
			slug = category.id;
		} else {
			slug = slugify(category.name);
		}
		html.push(`<option value='${slug}'>`)
		html.push(sanitizeHtml(category.name))
		html.push("</option>")
	}

	$('.event-category-list').each(function(){
		var val = $(this).val();
		$(this).html(html.join("")).val(val);
	});

	var default_event_category = static_data.settings.default_category !== undefined ? get_category(static_data.settings.default_category) : {id: -1};

    $('#default_event_category').val(default_event_category.id);
}

function repopulate_timespan_select(select, val, change, max){

	if(static_data.year_data.timespans.length == 0 || static_data.year_data.global_week.length == 0) return;

	var select = select === undefined ? $('.timespan-list') : select;
	var change = change === undefined ? true : change;
	var max = max === undefined ? false : max;

	select.each(function(){

		var year = convert_year(static_data, $(this).closest('.date_control').find('.year-input').val()|0);

		var special = $(this).hasClass('timespan_special');

		var html = [];

		for(var i = 0; i < static_data.year_data.timespans.length; i++){

			var is_there = does_timespan_appear(static_data, year, i);

			if(special){

				html.push(`<option value='${i}'>${sanitizeHtml(static_data.year_data.timespans[i].name)}</option>`);

			}else{

				var days = get_days_in_timespan(static_data, year, i);

				if(days.length == 0){
					is_there.result = false;
					is_there.reason = "no days";
				}

				if(max && i > max) break;

				html.push(`<option ${!is_there.result ? 'disabled' : ''} value='${i}'>`);
				html.push(sanitizeHtml(static_data.year_data.timespans[i].name + (!is_there.result ? ` (${is_there.reason})` : '')));
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
			if(value >= $(this).children().length){
				var new_val = $(this).children().length-1;
			}else{
				for(var i = value, j = value+1; i >= 0 || j < $(this).children().length; i--, j++){
					if(!$(this).children().eq(i).prop('disabled')){
						var new_val = i;
						break internal_loop;
					}
					if(!$(this).children().eq(j).prop('disabled')){
						var new_val = j;
						break internal_loop;
					}
				}
			}
			$(this).val(new_val);
		}
		if(change){
			$(this).change();
		}
	});


}

function repopulate_day_select(select, val, change, no_leaps, max, filter_timespan){

	if(static_data.year_data.timespans.length == 0 || static_data.year_data.global_week.length == 0) return;

	var select = select === undefined ? $('.timespan-day-list') : select;
	var change = change === undefined ? true : change;
	var no_leaps = no_leaps === undefined ? false : no_leaps;
	var max = max === undefined ? false : max;

	select.each(function(){

		var year = convert_year(static_data, $(this).closest('.date_control').find('.year-input').val()|0);
		var timespan = $(this).closest('.date_control').find('.timespan-list').val()|0;
		var special = $(this).hasClass('day_special');

		if(filter_timespan === undefined || timespan == filter_timespan){

			var exclude_self = $(this).hasClass('exclude_self');
			var no_leaps = no_leaps || $(this).hasClass('no_leap');

			if(exclude_self){

				var self_object = get_calendar_data($(this).attr('data'));

				if(self_object){
					var days = get_days_in_timespan(static_data, year, timespan, self_object, no_leaps, special);
				}

			}else{
				var days = get_days_in_timespan(static_data, year, timespan, undefined, no_leaps, special);
			}

			var html = [];

			if(!$(this).hasClass('date')){
				html.push(`<option value="${0}">Before 1</option>`);
			}

			for(var i = 0, offset = 0; i < days.length; i++){

				var day = days[i];
				let number = i-offset+1;

				if(!day.normal_day && day.not_numbered) offset++;

				if(max && i >= max) break;

				html.push(`<option value='${i+1}'>`);
				html.push(day.normal_day ? `Day ${number}` : day.not_numbered ? day.text : `Day ${number} (${day.text})`);
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
						var new_val = i;
						break internal_loop;
					}
					if($(this).children().eq(j).length && !$(this).children().eq(j).prop('disabled')){
						var new_val = j;
						break internal_loop;
					}
				}
				$(this).val(new_val+1);
			}
			if(change){
				$(this).change();
			}
		}

	});

}

function set_up_visitor_values(){

	preview_date.follow = true;

	$('.reset_preview_date_container.right .reset_preview_date').prop("disabled", preview_date.follow).toggleClass('hidden', preview_date.follow);
	$('.reset_preview_date_container.left .reset_preview_date').prop("disabled", preview_date.follow).toggleClass('hidden', preview_date.follow);

	preview_date_manager = new date_manager(dynamic_data.year, dynamic_data.timespan, dynamic_data.day);


	target_year.val(preview_date_manager.adjusted_year);
	if(preview_date_manager.last_valid_year){
		target_year.prop('max', preview_date_manager.last_valid_year)
	}else{
		target_year.removeAttr('max')
	}

	repopulate_timespan_select(target_timespan, preview_date_manager.timespan, false, preview_date_manager.last_valid_timespan);
	repopulate_day_select(target_day, preview_date_manager.day, false, false, preview_date_manager.last_valid_day);

	repopulate_event_category_lists();

	evaluate_settings();

}
