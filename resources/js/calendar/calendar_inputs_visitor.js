function context_set_current_date(key, opt){

	const epoch = $(opt.$trigger[0]).attr('epoch');
	const epoch_data = evaluated_static_data.epoch_data[epoch];

    setTimeout(() => {
        window.dispatchEvent(new CustomEvent('change-current-date', {
            detail: {
                year: epoch_data.year,
                timespan: epoch_data.timespan_number,
                day: epoch_data.day,
            }
        }));
    }, 70);

}

function context_set_preview_date(key, opt){

	const epoch = $(opt.$trigger[0]).attr('epoch');
	const epoch_data = evaluated_static_data.epoch_data[epoch];

    setTimeout(() => {
        window.dispatchEvent(new CustomEvent('change-preview-date', { detail: {
            year: epoch_data.year,
            timespan: epoch_data.timespan_number,
            day: epoch_data.day,
        }}));
    }, 70);
}

function context_copy_link_date(element){

	const epoch = element.attr('epoch')|0;

	const epoch_data = evaluated_static_data.epoch_data[epoch];

	const year = epoch_data.year;
	const timespan = epoch_data.timespan_number;
	const day = epoch_data.day;

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

	let year = epoch_data.year;
	let timespan = epoch_data.timespan_number;
	let day = epoch_data.day;

	let link = `${window.location.origin}/calendars/${window.calendar.hash}?year=${year}&month=${timespan}&day=${day}`;

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
	const epoch = $(opt.$trigger[0]).attr('epoch')|0;
	window.dispatchEvent(new CustomEvent('event-editor-modal-new-event', { detail: { name: "", epoch: epoch } }));
}

function context_open_day_data(key, opt){

	const day_element = $(opt.$trigger[0]);
	const epoch = day_element.attr('epoch')|0;
	const epoch_data = evaluated_static_data.epoch_data[epoch];
	day_data_tooltip.show(day_element, epoch_data);

}

function set_up_context_menu(){

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
					return element.hasClass('era_event') || window.calendar.events[event_id].settings.hide || !Perms.can_modify_event(event_id);
				},
				visible: function(key, opt){
					let element = $(opt.$trigger[0]);
					let event_id = Number(element.attr('event'));
					return !element.hasClass('era_event') && !window.calendar.events[event_id].settings.hide && Perms.can_modify_event(event_id);
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
					return element.hasClass('era_event') || !window.calendar.events[event_id].settings.hide || !Perms.can_modify_event(event_id);
				},
				visible: function(key, opt){
					let element = $(opt.$trigger[0]);
					let event_id = Number(element.attr('event'));
					return !element.hasClass('era_event') && window.calendar.events[event_id].settings.hide && Perms.can_modify_event(event_id);
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

    let items = {};

	items.set_current_date = {
		name: "Set as Current Date",
		icon: "fas fa-hourglass-half",
		callback: context_set_current_date,
		disabled: function(key, opt){
			let element = $(opt.$trigger[0]);
			let epoch = Number(element.attr('epoch'));
			return epoch === window.calendar.dynamic_data.epoch || !Perms.player_at_least('co-owner');
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
			let epoch = Number(element.attr('epoch'));
			return epoch === window.calendar.preview_date.epoch || !window.calendar.static_data.settings.allow_view && !Perms.player_at_least('co-owner');
		},
		visible: function(key, opt){
			return window.calendar.static_data.settings.allow_view || Perms.player_at_least('co-owner');
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
			return !window.calendar.static_data.settings.allow_view && !Perms.player_at_least('co-owner');
		},
		visible: function(key, opt){
			return window.calendar.static_data.settings.allow_view || Perms.player_at_least('co-owner');
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

			if(window.calendar.static_data.settings.layout == "minimalistic"){

				delete items.view_events['items'];

				let epoch = $($trigger[0]).attr('epoch') | 0;
				let found_events = CalendarRenderer.render_data.event_epochs[epoch].events;

				items.view_events.visible = function(){ return found_events.length > 0 };
				items.view_events.disabled = found_events.length == 0;

				if(found_events.length > 1){

					items.view_events.name = "View events on this date";
					let sub_items = {};
					for(let i = 0; i < found_events.length; i++){
						let event_id = found_events[i].index;
						let event_name = found_events[i].name;
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

					items.view_events.name = `View event "${window.calendar.events[found_events[0].index].name}"`

				}

			}else{
				items.view_events.disabled = true;
				items.view_events.visible = function(){ return false };
			}

			let show_menu = false;
			for(let i in items){
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

}
