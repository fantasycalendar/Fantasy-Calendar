/* ------------------------------------------------------- */
/* ------------------ Calendar UI class ------------------ */
/* ------------------------------------------------------- */

var edit_event_ui = {

	data: {},

	esc_event: function(e){

		if (e.keyCode === 27) edit_event_ui.close_ui_btn.click();

	},

	bind_events: function(){

		this.new_event							= false;
		this.event_id							= null;
		this.event_condition_sortables			= [];
		this.delete_droppable					= false;
		this.deleting_clicked					= false;
		this.delete_hover_element				= undefined;
		this.conditions_changed					= false;
		this.date 								= [];
		this.connected_events					= [];
		this.search_distance					= 0;
		this.prev_version_event					= {};
		this.inputs_changed						= true;

		this.event_background 					= $('#event_edit_background');
		this.event_conditions_container			= $('#event_conditions_container');
		this.event_conditions_container			= $('#event_conditions_container');
		this.condition_presets					= $('#condition_presets');
		this.repeat_input						= $('#repeat_input');
		this.non_preset_buttons					= $('#non_preset_buttons');
		this.save_btn							= this.event_background.find('#btn_event_save');
		this.delete_btn							= this.event_background.find('#btn_event_delete');
		this.close_ui_btn						= this.event_background.find('.close_ui_btn');
		this.test_event_btn						= this.event_background.find('.test_event_btn');
		this.trumbowyg							= this.event_background.find('.event_desc');
		this.event_action_type			 		= this.event_background.find('.event_action_type span');
		this.view_event_btn				   		= this.event_background.find('.view_event_btn');


		this.event_occurrences_page = 1;
		this.processed_event_data = false;
		this.event_occurrences = false;

		this.event_occurrences_container		= $('.event_occurrences');
		this.event_occurrences_list_container	= $('.event_occurrences_list_container');
		this.event_occurrences_page_number		= $('.event_occurrences_list_container .page_number');
		this.event_occurrences_text				= $('.event_occurrences_list_container .text');
		this.event_occurrences_list				= $('.event_occurrences_list_container .list');
		this.event_occurrences_list_col1		= $('.event_occurrences_list_container .list .col1');
		this.event_occurrences_list_col2		= $('.event_occurrences_list_container .list .col2');
		this.event_occurrences_button_prev		= $('.event_occurrences_list_container .prev');
		this.event_occurrences_button_next		= $('.event_occurrences_list_container .next');

		this.event_occurrences_button_prev.click(function(e){
			edit_event_ui.event_occurrences_page--;
			edit_event_ui.show_event_dates();
		});

		this.event_occurrences_button_next.click(function(e){
			edit_event_ui.event_occurrences_page++;
			edit_event_ui.show_event_dates();
		});

		this.trumbowyg.trumbowyg().on("tbwchange", function(){
			edit_event_ui.inputs_changed = true;
		});

		$(document).on('change', '.event_setting', function(){
			edit_event_ui.inputs_changed = true;
		});


		$(document).on('click', '.open-edit-event-ui', function(){

			var index = $(this).closest('.sortable-container').attr('index');

			edit_event_ui.edit_event(index);

		});

		this.save_btn.click(function(){
			edit_event_ui.save_current_event();
		})

		this.delete_btn.click(function(){
			edit_event_ui.query_delete_event(edit_event_ui.event_id);
		})

		this.view_event_btn.click(function(){
			edit_event_ui.callback_do_close(function(){
				show_event_ui.show_event(edit_event_ui.event_id);
				edit_event_ui.clear_ui();
			});
		});

		edit_event_ui.close_ui_btn.click(function(){
			edit_event_ui.callback_do_close(function(){
				if(edit_event_ui.new_event){
					events.splice(edit_event_ui.event_id, 1);
				}
				edit_event_ui.clear_ui();
			});
		});

		this.test_event_btn.click(function(){

			edit_event_ui.test_event(Number($(this).attr('years')))

		});


		$('.open_settings').click(function(){
			$('.settings_container').toggleClass('hidden');
			let closed = $('.settings_container').hasClass("hidden");
			$(this).find('.icon').toggleClass('fa-angle-right', closed).toggleClass('fa-angle-down', !closed);
		})


		this.condition_presets.on('focusin', function(){
			$(this).data('val', $(this).val());
		});

		this.condition_presets.change(function(e){

			var prev = $(this).data('val');

			var selected = edit_event_ui.condition_presets.find(':selected');

			if(selected.val() == prev && e.originalEvent){
				return;
			}

			var nth = selected[0].hasAttribute('nth');

			edit_event_ui.data.moon_id = selected.attr('moon');

			edit_event_ui.repeat_input.prop('disabled', !nth).parent().toggleClass('hidden', !nth);

			edit_event_ui.update_every_nth_presets();

			if(e.originalEvent){

				if(edit_event_ui.conditions_changed){

					swal.fire({
						title: "Warning!",
						text: "This will override all of your conditions, are you sure you want to do that?",
						showCancelButton: true,
						confirmButtonColor: '#d33',
						cancelButtonColor: '#3085d6',
						confirmButtonText: 'OK',
						icon: "warning",
					}).then((result) => {

						if(!result.dismiss) {

							var preset = edit_event_ui.condition_presets.val();
							var repeats = edit_event_ui.repeat_input.val()|0;

							edit_event_ui.update_every_nth_presets();

							edit_event_ui.event_conditions_container.empty();
							edit_event_ui.add_preset_conditions(preset, repeats);

							$(this).data('val', $(this).val());

						}else{

							$(this).val(prev);

							var nth = $(this).find(`option[value="${prev}"]`)[0].hasAttribute('nth');

							edit_event_ui.repeat_input.prop('disabled', !nth).parent().toggleClass('hidden', !nth);

						}

					});

					return;

				}

			}

			var preset = edit_event_ui.condition_presets.val();
			var repeats = edit_event_ui.repeat_input.val()|0;

			edit_event_ui.update_every_nth_presets();

			edit_event_ui.event_conditions_container.empty();
			edit_event_ui.add_preset_conditions(preset, repeats);

			$(this).data('val', $(this).val());

		});

		this.repeat_input.change(function(){
			edit_event_ui.update_every_nth_presets();
			edit_event_ui.event_conditions_container.empty();
			var preset = edit_event_ui.condition_presets.val();
			var repeats = edit_event_ui.repeat_input.val()|0;
			edit_event_ui.add_preset_conditions(preset, repeats);
		});

		$(document).on('change', '.event-text-input', function(){

			if($(this).closest('.sortable-container').length){
				var parent = $(this).closest('.sortable-container');
			}else{
				var parent = $(this).closest('#event-form');
				edit_event_ui.inputs_changed = true;
			}

			var value_input = this;

			var output = parent.find('.event-text-output');
			var input = parent.find('.event-text-input');

			output.each(function(){

				var classes = $(this).attr('class').split(' ');

				if(classes.indexOf("hidden_event") > -1){
					classes.length = 4;
				}else{
					classes.length = 3;
				}

				classes.push($(value_input).val());
				classes.push(input.not(value_input).val());

				classes = classes.join(' ');

				$(this).prop('class', classes);

			})

		});

		this.event_conditions_container.nestedSortable({
			handle: ".handle",
			containerSelector: ".group_list_root, .group_list",
			onDragStart: function (item, container, _super, event) {
				item.css({
					height: item.outerHeight(),
					width: item.outerWidth()
				})
				item.addClass(container.group.options.draggedClass)
				$("body").addClass(container.group.options.bodyClass)
				var height = item.css("height");
				container.rootGroup.placeholder.css('height', height);
				$('#condition_remove_button .icon').addClass('wiggle');
			},
			onDrop: function (item, container, _super, event) {
				item.removeClass(container.group.options.draggedClass).removeAttr("style");
				$("body").removeClass(container.group.options.bodyClass);
				$('#condition_remove_button .icon').removeClass('wiggle');
				$('#condition_remove_button .icon').removeClass('faster');
				if(edit_event_ui.delete_droppable){
					item.remove();
				}
				edit_event_ui.evaluate_condition_selects(edit_event_ui.event_conditions_container);
				edit_event_ui.inputs_changed = true;
			},
			tolerance: -5
		});

		this.event_conditions_container.change(function(){
			edit_event_ui.show_hide_event_testing();
		});

		$("#event_categories").change(function(){
			if($(this).val() != -1){
				slug = $(this).val();
				var category = get_category(slug);

				$('#color_style').val(category.event_settings.color);
				$('#text_style').val(category.event_settings.text).change();
				$('#event_hide_players').prop('checked', category.event_settings.hide);

				if($('#event_print_checkbox').length){
					$('#event_print_checkbox').prop('checked', category.event_settings.print);
				}
				if($('#event_hide_full').length){
					$('#event_hide_full').prop('checked', category.event_settings.hide_full);
				}
			}
		});

		this.evaluate_condition_selects(edit_event_ui.event_conditions_container);

		$('#add_event_condition_group').click(function(){
			edit_event_ui.add_group(edit_event_ui.event_conditions_container, "normal");
			edit_event_ui.evaluate_condition_selects(edit_event_ui.event_conditions_container);
			edit_event_ui.show_hide_event_testing();
		});

		$('#add_event_condition').click(function(){
			edit_event_ui.add_condition(edit_event_ui.event_conditions_container, "Year");
			edit_event_ui.evaluate_inputs(edit_event_ui.event_conditions_container.children().last())
			edit_event_ui.evaluate_condition_selects(edit_event_ui.event_conditions_container);
			edit_event_ui.show_hide_event_testing();
		});

		$(document).on('change', '.moon_select', function(){
			edit_event_ui.evaluate_inputs($(this).closest('.condition'));
			edit_event_ui.event_is_one_time();
		});


		$(document).on('change', '.condition_type', function(){

			var selected_option = $(this).find(":selected");
			var type = selected_option.parent().attr('label');

			var lastClass = $(this).closest('.condition_container').attr('class').split(' ').pop();
			$(this).closest('.condition_container').removeClass(lastClass).addClass(type);

			edit_event_ui.evaluate_inputs($(this).closest('.condition'));

			edit_event_ui.event_is_one_time();

		});

		$(document).on('change', '.group_type input[type="radio"]', function(){
			var container = $(this).parent().parent().parent();
			var type = $(this).parent().parent().attr('class');
			container.attr('type', type);
			if(type == "num"){
				container.find('.num_group_con').prop('disabled', false).attr('min', 1).attr('max', Math.max(1, container.find('.group_list').children().length)).val("1");
			}else{
				container.find('.num_group_con').prop('disabled', true).val('');
			}
			edit_event_ui.evaluate_condition_selects(edit_event_ui.event_conditions_container);
			edit_event_ui.event_is_one_time();
		})

		$('#limited_repeat').change(function(){
			edit_event_ui.event_background.find('#limited_repeat_num').prop('disabled', !$(this).prop('checked'));
			edit_event_ui.event_background.find('.limit_for_warning').toggleClass('hidden', !$(this).prop('checked'));
		});

		$('#has_duration').change(function(){
			edit_event_ui.event_background.find('#duration').prop('disabled', !$(this).prop('checked'));
			edit_event_ui.event_background.find('.duration_warning').toggleClass('hidden', !$(this).prop('checked'));
		});




		$(document).on('mouseenter', '.condition', function(e){
			if(edit_event_ui.deleting_clicked){
				edit_event_ui.set_delete_element($(this));
			}
		});

		$(document).on('mouseleave', '.condition', function(e){
			if(edit_event_ui.deleting_clicked){
				if($(this).parent().hasClass('group_list')){
					edit_event_ui.set_delete_element($(this).parent().parent());
				}else{
					edit_event_ui.set_delete_element();
				}
			}
		});

		$(document).on('mouseenter', '.group', function(e){
			if(edit_event_ui.deleting_clicked){
				edit_event_ui.set_delete_element($(this));
			}
		});

		$(document).on('mouseleave', '.group', function(e){
			if(edit_event_ui.deleting_clicked){
				if($(this).parent().hasClass('group_list')){
					edit_event_ui.set_delete_element($(this).parent().parent());
				}else{
					edit_event_ui.set_delete_element();
				}
			}
		});

		$(document).on('click', '.condition, .condition div, .condition select, .condition span', function(e){
			if(edit_event_ui.deleting_clicked){
				e.preventDefault();
				e.stopPropagation();
				var item = $(this).closest('.condition');
				if(item.parent().hasClass('group_list')){
					var parent = item.parent();
					item.remove();
					if(parent.children().length == 0){
						parent.parent().remove();
					}
				}else{
					item.remove();
				}

				edit_event_ui.evaluate_condition_selects(edit_event_ui.event_conditions_container);
				edit_event_ui.show_hide_event_testing();
				edit_event_ui.inputs_changed = true;
			}
		});

		$(document).on('click', '.group, .group .group_list', function(e){
			if(edit_event_ui.deleting_clicked){

				e.preventDefault();
				e.stopPropagation();

				if($(this).hasClass('group_list')){
					var group_list = $(this);
				}else{
					var group_list = $(this).find('.group_list');
				}

				if(group_list.children().length > 0){

					swal.fire({
						title: "Warning!",
						text: "This group has conditions in it, are you sure you want to delete it and all of its conditions?",
						showCancelButton: true,
						confirmButtonColor: '#d33',
						cancelButtonColor: '#3085d6',
						confirmButtonText: 'Yes',
						icon: "warning",
					}).then((result) => {

						if(!result.dismiss) {
							group_list.parent().remove();
							edit_event_ui.evaluate_condition_selects(edit_event_ui.event_conditions_container);
							edit_event_ui.show_hide_event_testing();
							edit_event_ui.inputs_changed = true;
						}

					});

				}else{
					group_list.parent().remove();
					edit_event_ui.evaluate_condition_selects(edit_event_ui.event_conditions_container);
					edit_event_ui.show_hide_event_testing();
					edit_event_ui.inputs_changed = true;
				}


			}
		});

		$('#condition_remove_button').click(function(e){
			edit_event_ui.deleting_clicked = !edit_event_ui.deleting_clicked;
			$('#condition_remove_button .icon').toggleClass('wiggle', edit_event_ui.deleting_clicked);
			$('#condition_remove_button .icon').removeClass('faster', false);
			$('#event_conditions_container').toggleClass('deleting', edit_event_ui.deleting_clicked);
			$('#add_event_condition').prop('disabled', edit_event_ui.deleting_clicked);
			$('#add_event_condition_group').prop('disabled', edit_event_ui.deleting_clicked);
			$('#condition_presets').prop('disabled', edit_event_ui.deleting_clicked);
		});

		$('#condition_remove_button').mouseover(function(e){
			edit_event_ui.delete_droppable = true;
			$(this).find('.icon').addClass('faster');
		}).mouseout(function(e){
			edit_event_ui.delete_droppable = false;
			$(this).find('.icon').removeClass('faster');
		})

	},

	callback_do_close(callback){

		if(edit_event_ui.has_changed()){

			swal.fire({
				title: "Are you sure?",
				text: 'Your changes to this event will not be saved! Are you sure you want to continue?',
				showCancelButton: true,
				confirmButtonColor: '#d33',
				cancelButtonColor: '#3085d6',
				icon: "warning",
			}).then((result) => {
				if(!result.dismiss) {

					callback();

				}
			});

		}else{

			callback();

		}

	},

	set_delete_element(element){
		if(this.delete_hover_element !== undefined){
			this.delete_hover_element.removeClass('hover').removeClass('cursor-pointer');
			this.delete_hover_element.find('select').not('.condition_operator').prop('disabled', false);
			this.delete_hover_element.find('input').prop('disabled', false);
			this.delete_hover_element.find('.icon-reorder').addClass('handle');
		}
		this.delete_hover_element = element;
		if(this.delete_hover_element !== undefined){
			this.delete_hover_element.addClass('hover').addClass('cursor-pointer');
			this.delete_hover_element.find('select').not('.condition_operator').prop('disabled', true);
			this.delete_hover_element.find('input').prop('disabled', true);
			this.delete_hover_element.find('.icon-reorder').removeClass('handle');
		}
	},

	show_hide_event_testing(){

		this.event_occurrences_container.toggleClass('hidden', edit_event_ui.event_conditions_container.length == 0 || edit_event_ui.event_is_one_time());

	},

	create_new_event: function(name, epoch){

		this.new_event = true;

		this.delete_btn.toggleClass('hidden', true);

		this.data = clone(evaluated_static_data.epoch_data[epoch]);

		var stats = {
			'name': name,
			'description': '',
			'data': {
				'has_duration': false,
				'duration': 1,
				'show_first_last': false,
				'limited_repeat': false,
				'limited_repeat_num': 1,
				'conditions': [
					['Date', '0', [this.data.year, this.data.timespan_index, this.data.day]]
				],
				'connected_events': [],
				'date': [this.data.year, this.data.timespan_index, this.data.day],
				'search_distance': 0
			},
			'settings': {
				'color': 'Dark-Solid',
				'text': 'text',
				'hide': false,
				'print': false,
				'hide_full': false
			},
		};

		var category_id = static_data.settings.default_category !== undefined ? static_data.settings.default_category : -1;

		if(category_id != -1){
			var category = get_category(category_id);
			if(category !== undefined && category.id != -1){
				stats.event_category_id = category.id;
				stats.settings.color = category.event_settings.color;
				stats.settings.text = category.event_settings.text;
				stats.settings.hide = category.event_settings.hide;
				stats.settings.print = category.event_settings.print;
				stats.settings.hide_full = category.event_settings.hide_full;
			}
		}

		eventId = Object.keys(events).length;

		events[eventId] = stats;

		this.set_current_event(eventId)

		this.event_action_type.text("Creating event");
		this.view_event_btn.hide();

		this.populate_condition_presets();

		this.inputs_changed = false;

	},

	edit_event: function(event_id){

		this.prev_version_event = clone(events[event_id]);

		this.repeat_input.val('1').parent().toggleClass('hidden', true);
		this.condition_presets.children().eq(0).prop('selected', true);
		this.condition_presets.parent().toggleClass('hidden', true);
		this.condition_presets.parent().prev().toggleClass('hidden', true);

		this.event_action_type.text("Editing event");
		this.view_event_btn.show();

		this.set_current_event(event_id)

	},

	set_current_event: function(event_id){

		registered_keydown_callbacks['event_ui_escape'] = this.esc_event;

		this.event_id = event_id;

		var event = events[this.event_id];

		this.event_background.find('.event_name').val(event.name);

		this.trumbowyg.trumbowyg('html', event.description);

		this.create_conditions(event.data.conditions, this.event_conditions_container);

		this.evaluate_condition_selects(this.event_conditions_container);

		if(typeof event.event_category_id !== 'undefined' && event.event_category_id !== null){
			var category_id = event.event_category_id;
			var category = get_category(category_id);

			$('#event_categories').val(category.id);
		}else{
			$('#event_categories').val(-1);
		}

		$('#color_style').val(event.settings.color);
		$('#text_style').val(event.settings.text).change();

		$('#event_hide_players').prop('checked', event.settings.hide);

		$('#event_hide_full').prop('checked', event.settings.hide_full);

		$('#event_print_checkbox').prop('checked', event.settings.print);

		$('#limited_repeat').prop('checked', event.data.limited_repeat);
		$('#limited_repeat_num').prop('disabled', !event.data.limited_repeat).val(event.data.limited_repeat_num);

		$('#has_duration').prop('checked', event.data.has_duration);
		$('#duration').prop('disabled', !event.data.has_duration).val(event.data.duration);

		$('#show_first_last').prop('checked', event.data.show_first_last);

		this.event_background.removeClass('hidden');

		this.inputs_changed = false;

		this.event_background.find('.event_name').focus();

		this.show_hide_event_testing();

	},

	save_current_event: function(){

		var event_id = events[this.event_id].id;
		var creator_id = events[this.event_id].creator_id;
		var sort_by = events[this.event_id].sort_by;
		let new_event = {}
		new_event.id = event_id;
		new_event.creator_id = creator_id;
		new_event.sort_by = sort_by;

		var name = this.event_background.find('.event_name').val();
		name = name !== '' ? name : "Unnamed Event";
		new_event.name = name;

		new_event.description = sanitizeHtml(this.trumbowyg.trumbowyg('html'), {allowedTags: [ 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol', 'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div', 'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'img' ]});

		if(Perms.playerLevel == "player"){
			new_event.data = events[this.event_id].data;
		}else{
			let data = this.create_event_data();
			new_event.data = data;
		}

		new_event.event_category_id = $('#event_categories').length > 0 ? get_category($('#event_categories').val()).id : -1;

		new_event.settings = {
			color: $('#color_style').val(),
			text: $('#text_style').val(),
			hide: $('#event_hide_players').length > 0 ? $('#event_hide_players').prop('checked') : false,
			hide_full: $('#event_hide_full').length > 0 ? $('#event_hide_full').prop('checked') : false,
			print: $('#event_print_checkbox').length > 0 ? $('#event_print_checkbox').prop('checked') : false
		}

		events[this.event_id] = new_event;

		if($('#events_sortable').length){
			if(this.new_event){
				add_event_to_sortable(events_sortable, this.event_id, events[this.event_id]);
			}else{
				$(`.events_input[index="${this.event_id}"]`).find(".event_name").text(`Edit - ${name}`);
			}

			this.submit_event_callback(true);

		}else{
			if(this.new_event){
				submit_new_event(this.event_id, this.submit_event_callback);
			}else{
				submit_edit_event(this.event_id, this.submit_event_callback);
			}
		}

	},

	submit_event_callback: function(success){

		if(success){

			edit_event_ui.clear_ui();

			eval_apply_changes(function(){
				rebuild_events();
			});

		}

	},

	clear_ui: function(){

		delete registered_keydown_callbacks['event_ui_escape'];

		this.event_background.find('.event_name').val('');

		this.trumbowyg.trumbowyg('html', '');

		this.repeat_input.val('').parent().toggleClass('hidden', true);
		this.condition_presets.children().eq(0).prop('selected', true);
		this.condition_presets.parent().toggleClass('hidden', true);
		this.condition_presets.parent().prev().toggleClass('hidden', true);
		this.update_every_nth_presets();

		this.event_occurrences_container.addClass('hidden');
		this.event_occurrences_list_container.addClass('hidden');

		this.event_conditions_container.empty();

		this.data = {};

		this.new_event = false;

		this.date = [];

		this.connected_events = [];

		if(this.deleting_clicked){
			$('#condition_remove_button').click();
		}

		$('#event_categories').val('');

		$('#color_style').val('');
		$('#text_style').val('');

		$('#event_hide_players').prop('checked', false);

		$('#event_hide_full').prop('checked', false);

		$('#event_print_checkbox').prop('checked', false);

		$('#limited_repeat').prop('checked', false);
		$('#limited_repeat_num').prop('disabled', true).val(1);
		$('.limit_for_warning').toggleClass('hidden', true);

		$('#has_duration').prop('checked', false);
		$('#duration').prop('disabled', true).val(1);
		$('#show_first_last').prop('checked', false);
		$('.duration_warning').toggleClass('hidden', true);

		this.delete_btn.toggleClass('hidden', false);

		this.event_background.scrollTop(0);

		this.event_background.addClass('hidden');

	},

	create_event_data: function(){

		var conditions = this.create_condition_array(edit_event_ui.event_conditions_container);

		this.date = []


		if(conditions.length == 1 || conditions.length == 5){

			if(conditions.length == 1){

				if(conditions[0][0] == "Date" && conditions[0][1] == 0){
					this.date = [Number(conditions[0][2][0]), Number(conditions[0][2][1]), Number(conditions[0][2][2])];
				}

			}else{

				var year = false;
				var month = false;
				var day = false
				var ands = 0

				for(var i = 0; i < conditions.length; i++){
					if(conditions[i].length == 3){
						if(conditions[i][0] == "Year" && Number(conditions[i][1]) == 0){
							year = true;
							this.date[0] = Number(conditions[i][2][0])
						}

						if(conditions[i][0] == "Month" && Number(conditions[i][1]) == 0){
							month = true;
							this.date[1] = Number(conditions[i][2][0])
						}

						if(conditions[i][0] == "Day" && Number(conditions[i][1]) == 0){
							day = true;
							this.date[2] = Number(conditions[i][2][0])
						}
					}else if(conditions[i].length == 1){
						if(conditions[i][0] == "&&"){
							ands++;
						}
					}
				}

				if(!(year && month && day && ands == 2)){
					this.date = [];
				}
			}
		}

		return {
			has_duration: $('#has_duration').length > 0 ? $('#has_duration').prop('checked') : false,
			duration: $('#duration').length > 0 ? $('#duration').val()|0 : 0,
			show_first_last: $('#show_first_last').length > 0 ? $('#show_first_last').prop('checked') : false,
			limited_repeat: $('#limited_repeat').length > 0 ? $('#limited_repeat').prop('checked') : false,
			limited_repeat_num: $('#limited_repeat_num').length > 0 ? $('#limited_repeat_num').val()|0 : 0,
			conditions: conditions,
			connected_events: this.connected_events,
			date: this.date,
			search_distance: this.get_search_distance(conditions)
		};

	},

	get_search_distance: function(conditions){

		var event = events[this.event_id];

		var search_distance = 0;

		if($('#has_duration').prop('checked') || $('#limited_repeat').prop('checked')){
			search_distance = $('#duration').val()|0 > search_distance ? $('#duration').val()|0 : search_distance;
			search_distance = $('#limited_repeat_num').val()|0 > search_distance ? $('#limited_repeat_num').val()|0 : search_distance;
		}

		search_distance = this.recurse_conditions(conditions, search_distance);

		return search_distance;

	},

	recurse_conditions: function(conditions, search_distance){

		for(let index in conditions){

			let new_search_distance = 0;

			let condition = conditions[index];

			if(condition.length == 3 && condition[0] === "Events"){
				new_search_distance = Number(condition[2][1]);
			}else if(condition.length == 2){
				new_search_distance = this.recurse_conditions(condition[1], search_distance)
			}

			search_distance = new_search_distance > search_distance ? new_search_distance : search_distance;
		}

		return search_distance;

	},

	event_is_one_time: function(){

		var date = []

		var conditions = this.create_condition_array(edit_event_ui.event_conditions_container);

		if(conditions.length == 1 || conditions.length == 5){

			if(conditions.length == 1){

				if(conditions[0][0] == "Date" && conditions[0][1] == 0){
					return true
				}

			}else{

				var year = false;
				var month = false;
				var day = false
				var ands = 0

				for(var i = 0; i < conditions.length; i++){
					if(conditions[i].length == 3){
						if(conditions[i][0] == "Year" && Number(conditions[i][1]) == 0){
							year = true;
							date[0] = Number(conditions[i][2][0])
						}

						if(conditions[i][0] == "Month" && Number(conditions[i][1]) == 0){
							month = true;
							date[1] = Number(conditions[i][2][0])
						}

						if(conditions[i][0] == "Day" && Number(conditions[i][1]) == 0){
							day = true;
							date[2] = Number(conditions[i][2][0])
						}
					}else if(conditions[i].length == 1){
						if(conditions[i][0] == "&&"){
							ands++;
						}
					}
				}

				if(!(year && month && day && ands == 2)){
					date = [];
				}

			}
		}

		return date.length > 0 || conditions.length == 0;

	},

	has_changed: function(){

		if(events[this.event_id] && this.inputs_changed){

			var event_check = clone(events[this.event_id])

			var eventid = events[this.event_id].id;

			if(eventid !== undefined){
				event_check.id = eventid;
			}

			var name = this.event_background.find('.event_name').val();
			name = name !== '' ? name : "";

			event_check.name = name;

			event_check.description = this.trumbowyg.trumbowyg('html');

			event_check.data = this.create_event_data();

			event_check.settings = {
				color: $('#color_style').val(),
				text: $('#text_style').val(),
				hide: $('#event_hide_players').prop('checked'),
				hide_full: $('#event_hide_full').prop('checked'),
				print: $('#event_print_checkbox').prop('checked')
			}

			return !Object.compare(event_check, events[this.event_id])

		}else{

			return false;

		}

	},

	populate_condition_presets: function(){

		this.repeat_input.val('').parent().toggleClass('hidden', true);
		this.condition_presets.children().eq(0).prop('selected', true);
		this.condition_presets.parent().toggleClass('hidden', false);
		this.condition_presets.parent().prev().toggleClass('hidden', false);

		this.condition_presets.find('option[value="weekly"]').text(`Weekly on ${edit_event_ui.data.week_day_name}`);
		this.condition_presets.find('option[value="fortnightly"]').text(`Fortnightly on ${edit_event_ui.data.week_day_name}`);
		this.condition_presets.find('option[value="monthly_date"]').text(`Monthly on the ${ordinal_suffix_of(edit_event_ui.data.day)}`);
		this.condition_presets.find('option[value="monthly_weekday"]').text(`Monthly on the ${ordinal_suffix_of(edit_event_ui.data.week_day_num)} ${edit_event_ui.data.week_day_name}`);

		let inverse_week_day_num = edit_event_ui.data.inverse_week_day_num == 1 ? "last" : ordinal_suffix_of(edit_event_ui.data.inverse_week_day_num) + " to last";

		this.condition_presets.find('option[value="monthly_inverse_weekday"]').text(`Monthly on the ${inverse_week_day_num} ${edit_event_ui.data.week_day_name}`);

		this.condition_presets.find('option[value="annually_date"]').text(`Annually on the ${ordinal_suffix_of(edit_event_ui.data.day)} of ${edit_event_ui.data.timespan_name}`);
		this.condition_presets.find('option[value="annually_month_weekday"]').text(`Annually on the ${ordinal_suffix_of(edit_event_ui.data.week_day_num)} ${edit_event_ui.data.week_day_name} in ${edit_event_ui.data.timespan_name}`);
		this.condition_presets.find('option[value="annually_inverse_month_weekday"]').text(`Annually on the ${inverse_week_day_num} ${edit_event_ui.data.week_day_name} in ${edit_event_ui.data.timespan_name}`);

		var html = [];

		var moon_phase_collection = ''

		for(moon_index in static_data.moons){

			var moon = static_data.moons[moon_index];

			var moon_phase_name = Object.keys(moon_phases[moon.granularity])[edit_event_ui.data.moon_phase[moon_index]];

			moon_phase_collection += `${moon.name} is ${moon_phase_name}, `

			html.push(`<option moon="${moon_index}" value="moon_every">${moon.name} - Every ${moon_phase_name}</option>`);
			html.push(`<option moon="${moon_index}" value="moon_n_every">${moon.name} - Every ${ordinal_suffix_of(edit_event_ui.data.moon_phase_num_month[moon_index])} ${moon_phase_name}</option>`);
			html.push(`<option moon="${moon_index}" value="moon_annually">${moon.name} - Annually every ${moon_phase_name} in ${edit_event_ui.data.timespan_name}</option>`);
			html.push(`<option moon="${moon_index}" value="moon_n_annually">${moon.name} - Annually every ${ordinal_suffix_of(edit_event_ui.data.moon_phase_num_month[moon_index])} ${moon_phase_name} in ${edit_event_ui.data.timespan_name}</option>`);
			html.push(`<option moon="${moon_index}" value="moon_yearly">${moon.name} - Every ${ordinal_suffix_of(edit_event_ui.data.moon_phase_num_year[moon_index])} ${moon_phase_name} in the year</option>`);

		}

		html.push(`<option value="multimoon_every" title="${moon_phase_collection.substring(0, moon_phase_collection.length-2)}">When the moons are all in this alignment.</option>`);

		this.condition_presets.find('optgroup[value="moons"]').html(html.join('')).toggleClass('hidden', html.length == 0);

		this.condition_presets.children().eq(1).prop('selected', true).change();

	},

	update_every_nth_presets: function(){

		var repeat_value = this.repeat_input.val()|0;

		var repeat_string = !isNaN(repeat_value) && repeat_value > 1 ? `${ordinal_suffix_of(repeat_value)} ` : (repeat_value == "" ? "nth " : "");

		let inverse_week_day_num = edit_event_ui.data.inverse_week_day_num == 1 ? "last" : ordinal_suffix_of(edit_event_ui.data.inverse_week_day_num) + " to last";

		this.condition_presets.find('option[value="every_x_day"]').text(`Every ${repeat_string}day`);
		this.condition_presets.find('option[value="every_x_weekday"]').text(`Every ${repeat_string}${edit_event_ui.data.week_day_name}`);
		this.condition_presets.find('option[value="every_x_monthly_date"]').text(`Every ${repeat_string}month on the ${ordinal_suffix_of(edit_event_ui.data.day)}`);
		this.condition_presets.find('option[value="every_x_monthly_weekday"]').text(`Every ${repeat_string}month on the ${ordinal_suffix_of(edit_event_ui.data.week_day_num)} ${edit_event_ui.data.week_day_name}`);
		this.condition_presets.find('option[value="every_x_inverse_monthly_weekday"]').text(`Every ${repeat_string}month on the ${inverse_week_day_num} ${edit_event_ui.data.week_day_name}`);
		this.condition_presets.find('option[value="every_x_annually_date"]').text(`Every ${repeat_string}year on the ${ordinal_suffix_of(edit_event_ui.data.day)} of ${edit_event_ui.data.timespan_name}`);
		this.condition_presets.find('option[value="every_x_annually_weekday"]').text(`Every ${repeat_string}year on the ${ordinal_suffix_of(edit_event_ui.data.week_day_num)} ${edit_event_ui.data.week_day_name} in ${edit_event_ui.data.timespan_name}`);
		this.condition_presets.find('option[value="every_x_inverse_annually_weekday"]').text(`Every ${repeat_string}year on the ${inverse_week_day_num} ${edit_event_ui.data.week_day_name} in ${edit_event_ui.data.timespan_name}`);

	},

	add_preset_conditions: function(preset, repeats){

		this.inputs_changed = true;

		switch(preset){

			case 'none':
				var result = [];
				break;

			case 'once':
				var result = [
					['Date', '0', [edit_event_ui.data.year, edit_event_ui.data.timespan_index, edit_event_ui.data.day]]
				];
				break;

			case 'daily':
				var result = [
					['Epoch', '6', ["1", "0"]]
				];
				break;

			case 'weekly':
				var result = [
					['Weekday', '0', [edit_event_ui.data.week_day_name]]
				];
				break;

			case 'fortnightly':
				var result = [
					['Weekday', '0', [edit_event_ui.data.week_day_name]],
					['&&'],
					['Week', '20', ['2', edit_event_ui.data.week_even ? '0' : '1']]
				];
				break;

			case 'monthly_date':
				var result = [
					['Day', '0', [edit_event_ui.data.day]],
				];
				break;

			case 'annually_date':
				var result = [
					['Month', '0', [edit_event_ui.data.timespan_index]],
					['&&'],
					['Day', '0', [edit_event_ui.data.day]]
				];
				break;

			case 'monthly_weekday':
				var result = [
					['Weekday', '0', [edit_event_ui.data.week_day_name]],
					['&&'],
					['Weekday', '8', [edit_event_ui.data.week_day_num]]
				];
				break;

			case 'monthly_inverse_weekday':
				var result = [
					['Weekday', '0', [edit_event_ui.data.week_day_name]],
					['&&'],
					['Weekday', '14', [edit_event_ui.data.inverse_week_day_num]]
				];
				break;

			case 'annually_month_weekday':
				var result = [
					['Month', '0', [edit_event_ui.data.timespan_index]],
					['&&'],
					['Weekday', '0', [edit_event_ui.data.week_day_name]],
					['&&'],
					['Weekday', '8', [edit_event_ui.data.week_day_num]]
				];
				break;

			case 'annually_inverse_month_weekday':
				var result = [
					['Month', '0', [edit_event_ui.data.timespan_index]],
					['&&'],
					['Weekday', '0', [edit_event_ui.data.week_day_name]],
					['&&'],
					['Weekday', '14', [edit_event_ui.data.inverse_week_day_num]]
				];
				break;

			case 'every_x_day':
				var result = [
					['Epoch', '6', [repeats, (edit_event_ui.data.epoch)%repeats]]
				];
				break;

			case 'every_x_weekday':
				var result = [
					['Weekday', '0', [edit_event_ui.data.week_day_name]],
					['&&'],
					['Week', '20', [repeats, (edit_event_ui.data.total_week_num)%repeats]]
				];
				break;

			case 'every_x_monthly_date':
				var result = [
					['Day', '0', [edit_event_ui.data.day]],
					['&&'],
					['Month', '13', [repeats, (edit_event_ui.data.timespan_count+1)%repeats]]
				];
				break;

			case 'every_x_monthly_weekday':
				var result = [
					['Weekday', '0', [edit_event_ui.data.week_day_name]],
					['&&'],
					['Weekday', '8', [edit_event_ui.data.week_day_num]],
					['&&'],
					['Month', '13', [repeats, (edit_event_ui.data.timespan_count+1)%repeats]]
				];
				break;

			case 'every_x_inverse_monthly_weekday':
				var result = [
					['Weekday', '0', [edit_event_ui.data.week_day_name]],
					['&&'],
					['Weekday', '14', [edit_event_ui.data.inverse_week_day_num]],
					['&&'],
					['Month', '13', [repeats, (edit_event_ui.data.timespan_count+1)%repeats]]
				];
				break;

			case 'every_x_annually_date':
				var result = [
					['Day', '0', [edit_event_ui.data.day]],
					['&&'],
					['Month', '0', [edit_event_ui.data.timespan_index]],
					['&&'],
					['Year', '6', [repeats, (edit_event_ui.data.year+1)%repeats]]
				];
				break;

			case 'every_x_annually_weekday':
				var result = [
					['Weekday', '0', [edit_event_ui.data.week_day_name]],
					['&&'],
					['Weekday', '8', [edit_event_ui.data.week_day_num]],
					['&&'],
					['Month', '0', [edit_event_ui.data.timespan_index]],
					['&&'],
					['Year', '6', [repeats, (edit_event_ui.data.year+1)%repeats]]
				];
				break;

			case 'every_x_inverse_annually_weekday':
				var result = [
					['Weekday', '0', [edit_event_ui.data.week_day_name]],
					['&&'],
					['Weekday', '14', [edit_event_ui.data.inverse_week_day_num]],
					['&&'],
					['Month', '0', [edit_event_ui.data.timespan_index]],
					['&&'],
					['Year', '6', [repeats, (edit_event_ui.data.year+1)%repeats]]
				];
				break;

			case 'moon_every':
				var result = [
					['Moons', '0', [edit_event_ui.data.moon_id, edit_event_ui.data.moon_phase[edit_event_ui.data.moon_id]]]
				];
				break;

			case 'moon_n_every':
				var result = [
					['Moons', '0', [edit_event_ui.data.moon_id, edit_event_ui.data.moon_phase[edit_event_ui.data.moon_id]]],
					['&&'],
					['Moons', '7', [edit_event_ui.data.moon_id, edit_event_ui.data.moon_phase_num_month[edit_event_ui.data.moon_id]]]
				];
				break;

			case 'moon_annually':
				var result = [
					['Moons', '0', [edit_event_ui.data.moon_id, edit_event_ui.data.moon_phase[edit_event_ui.data.moon_id]]],
					['&&'],
					['Month', '0', [edit_event_ui.data.timespan_index]]
				];
				break;

			case 'moon_n_annually':
				var result = [
					['Moons', '0', [edit_event_ui.data.moon_id, edit_event_ui.data.moon_phase[edit_event_ui.data.moon_id]]],
					['&&'],
					['Moons', '7', [edit_event_ui.data.moon_id, edit_event_ui.data.moon_phase_num_month[edit_event_ui.data.moon_id]]],
					['&&'],
					['Month', '0', [edit_event_ui.data.timespan_index]]
				];
				break;

			case 'moon_yearly':
				var result = [
					['Moons', '0', [edit_event_ui.data.moon_id, edit_event_ui.data.moon_phase[edit_event_ui.data.moon_id]]],
					['&&'],
					['Moons', '14', [edit_event_ui.data.moon_id, edit_event_ui.data.moon_phase_num_year[edit_event_ui.data.moon_id]]]
				];
				break;

			case 'multimoon_every':
				var result = [];
				for(var i = 0; i < static_data.moons.length; i++){
					result.push(['Moons', '0', [i, edit_event_ui.data.moon_phase[i]]])
					if(i != static_data.moons.length-1){
						result.push(['&&']);
					}
				}
				break;

		}

		this.create_conditions(result, edit_event_ui.event_conditions_container);
		this.evaluate_condition_selects(edit_event_ui.event_conditions_container);
		this.show_hide_event_testing();

		this.conditions_changed = false;

	},

	// This function creates an array for the conditions so that it may be stored
	create_condition_array: function(element){

		var array = [];

		element.children().each(function(){

			if($(this).hasClass('condition')){

				var selected_option = $(this).find('.condition_type').find(":selected");
				var type = selected_option.parent().attr('label');
				var values = [];

				if(type === "Moons"){

					values.push($(this).find('.moon_select').val());

					$(this).find('.input_container').children().each(function(i){

						if($(this).val() == ""){
							var val = 0;
						}else{
							var val = $(this).val();
						}

						values.push(val);

					});

				}else if(type === "Cycle"){

					values.push($(this).find('.input_container').find("option:selected").parent().attr("value"));
					values.push($(this).find('.input_container').find("option:selected").val());

				}else if(type === "Events"){

					var event_id = $(this).find('.input_container').find("option:selected").val()|0;

					if(edit_event_ui.connected_events.indexOf(event_id) == -1){
						edit_event_ui.connected_events.push(event_id)
					}

					values.push(edit_event_ui.connected_events.indexOf(event_id));

					if($(this).find('.input_container').children().eq(1).val() == ""){
						var val = 0;
					}else{
						var val = $(this).find('.input_container').children().eq(1).val();
					}
					values.push(val);

				}else if(type === "Date"){

					let inputs = $(this).find('.input_container').find('.date_control').children();
					let year = inputs.eq(0).val()|0;
					let timespan = inputs.eq(1).find('option:selected').val()|0;
					let day = inputs.eq(2).find('option:selected').val()|0;

					values.push(year);
					values.push(timespan);
					values.push(day);

				}else{

					$(this).find('.input_container').children().each(function(){
						if($(this).val() == ""){
							var val = 0;
						}else{
							var val = $(this).val();
						}
						values.push(val);
					});
				}

				array.push([type, selected_option.val(), values])

			}else if($(this).hasClass('group')){

				var type = $(this).find('.group_type');

				if(type.attr("type") === "normal"){
					type = "";
				}else if(type.attr("type") === "not"){
					type = "!";
				}else{
					type = type.find('.num_group_con').val();
				}

				array.push([type, edit_event_ui.create_condition_array($(this).children('.group_list'))])

			}

			var condition_operator = $(this).children('.condition_operator');

			if(!condition_operator.prop('disabled') && $(this).next().length != 0){
				array.push([condition_operator.val()])
			}

		});

		return array;
	},

	// This function finds and replaces all NAND operators and places !( and ) around them
	replace_NAND: function(array){
		for(var i = array.length-1; i > -1 ; i--){
			element = array[i];
			if(element[1] && Array.isArray(element[1]) && element[1].length > 0){
				array[i][1] = replace_NAND(element[1]);
			}else if(element[0] === "NAND"){

				array.splice(i-1, 0, ["!("])
				i++;
				array[i] = ['&&'];
				i++;

				if(array[i] === "!("){
					var j = i;
					loop:
					while(array[j] != ")"){
						j++;
						if(j > 100){
							break loop;
						}
					}
					array.splice(j, 0, ")")
				}else if(array[i] === "!"){
					array.splice(i+2, 0, [")"])
				}else{
					array.splice(i+1, 0, [")"])
				}

			}
		}
		return array;
	},

	// This function takes an array of conditions, and the parent which to attach the conditions UI
	create_conditions: function(array, parent, group_type){

		if(!array){
			return;
		}

		var increment = group_type === "num" ? 1 : 2;

		for(var i = 0; i < array.length; i+=increment){

			element = array[i];

			if(Array.isArray(element[1])){

				var group_type = "normal";
				if(element[0] === "!"){
					group_type = "not";
				}else if(element[0] >= 1){
					group_type = "num";
				}

				var parent_new = edit_event_ui.add_group(parent, group_type);

				if(element[0] >= 1){
					parent_new.parent().children('.group_type').find('.num_group_con').prop('disabled', false).val(element[0]);
				}

				edit_event_ui.create_conditions(element[1], parent_new, group_type);

				if(array[i+1] && group_type !== "num"){
					parent_new.next().val(array[i+1][0]);
				}

			}else{

				condition = edit_event_ui.add_condition(parent, element[0]);

				condition.find('.condition_type').find(`optgroup[label='${element[0]}']`).find(`option[value='${element[1]}']`).prop('selected', true).trigger('change');

				if(element[0] === "Moons"){
					condition.find('.moon_select').val(element[2][0])
				}

				edit_event_ui.evaluate_inputs(condition);

				if(element[0] === "Moons"){
					condition.find('.moon_select').val(element[2][0])
					condition.find('.input_container').children().each(function(i){
						$(this).val(element[2][i+1]);
					})
				}else if(element[0] === "Events"){

					condition.find('.event_select').val(events[this.event_id].data.connected_events[element[2][0]])
					condition.find('.input_container').children().eq(1).val(element[2][1]);

				}else if(element[0] == "Weekday"){

					condition.find('.input_container').children().each(function(i){
						$(this).val(element[2][i]);
					})

				}else if(element[0] == "Cycle"){

					condition.find('.input_container').find(`optgroup[value=${element[2][0]}]`).find(`option[value=${element[2][1]}]`).prop('selected', true);

				}else if(element[0] == "Date"){
					condition.find('.input_container').children().first().children().each(function(i){
						$(this).val(element[2][i]).change();
					})
				}else{
					condition.find('.input_container').children().each(function(i){
						$(this).val(element[2][i]);
					})
				}

				if(array[i+1] && group_type !== "num"){
					condition.children().last().val(array[i+1][0])
				}
			}
		}
	},

	// This function evaluates what inputs should be connected to any given condition based on its input
	evaluate_inputs: function(element){

		this.inputs_changed = true;
		this.conditions_changed = true;

		var selected_option = element.find('.condition_type').find(":selected");
		var type = selected_option.parent().attr('label');
		var selected = selected_option.val();
		var condition_selected = condition_mapping[type][selected][2];

		element.find('.input_container').toggleClass('hidden', condition_selected[0] == "boolean");
		element.find('.condition_type').toggleClass('full', condition_selected[0] == "boolean").toggleClass('nomax', condition_selected[0] == "boolean");

		var html = [];

		let new_element = undefined;

		if(type == "Month"){

			var next_start = 0;

			if(condition_selected[0] == "select"){
				html.push("<select class='form-control order-1'>")

				for(var i = 0; i < static_data.year_data.timespans.length; i++){
					html.push(`<option value='${i}'>`);
					html.push(static_data.year_data.timespans[i].name);
					html.push("</option>");
				}

				html.push("</select>")
				next_start++;
			}

			for(var i = next_start; i < condition_selected.length; i++){

				var type = condition_selected[i][0];
				var placeholder = condition_selected[i][1];
				var alt = condition_selected[i][2];
				var value = condition_selected[i][3];
				var min = condition_selected[i][4];
				var max = condition_selected[i][5];

				html.push(`<input type='${type}' placeholder='${placeholder}' class='form-control ${placeholder} order-2'`);

				if(typeof alt !== 'undefined'){
					html.push(` alt='${alt}'`)
				}

				if(typeof value !== 'undefined'){
					html.push(` value='${value}'`);
				}

				if(typeof min !== 'undefined'){
					html.push(` min='${min}'`);
				}

				if(typeof max !== 'undefined'){
					html.push(` max='${max}'`);
				}

				html.push(">");

			}

			new_element = $(html.join(''))

		}else if(type == "Date"){

			var type = condition_selected[0][0];
			var placeholder = condition_selected[0][1];
			var alt = condition_selected[0][0];
			var value = this.data.year;
			var min = condition_selected[0][4];
			var max = condition_selected[0][5];

			html.push(`<div class='date_control flex-grow-1'>`);

			html.push(`<input type='${type}' placeholder='${placeholder}' class='date form-control ${placeholder} order-1 year-input'`);

			if(typeof alt !== 'undefined'){
				html.push(` alt='${alt}'`)
			}

			if(typeof value !== 'undefined'){
				html.push(` value='${value}'`);
			}

			if(typeof min !== 'undefined'){
				html.push(` min='${min}'`);
			}

			if(typeof max !== 'undefined'){
				html.push(` max='${max}'`);
			}

			html.push(">");

			html.push("<select type='number' class='date form-control order-2 timespan-list'></select>")

			html.push(`<select type='${type}' placeholder='${placeholder}' class='date form-control ${placeholder} order-3 timespan-day-list'></select>`);

			html.push(`</div>`);

			new_element = $(html.join(''));

			repopulate_timespan_select(new_element.find('.timespan-list'), this.data.timespan_index);
			repopulate_day_select(new_element.find('.timespan-day-list'), this.data.day);

		}else if(type == "Moons"){

			var next_start = 0;

			if(condition_selected[0] == "select"){

				var selected_moon = element.find('.moon_select').val();

				selected_moon = selected_moon ? selected_moon : 0;

				html.push("<select class='form-control'>")

				let phases = Object.keys(moon_phases[static_data.moons[selected_moon].granularity]);

				for(var i = 0; i < phases.length; i++){
					html.push(`<option value='${i}'>`);
					html.push(phases[i]);
					html.push("</option>");
				}

				html.push("</select>")

				next_start++;

			}

			for(var i = next_start; i < condition_selected.length; i++){

				var type = condition_selected[i][0];
				var placeholder = condition_selected[i][1];
				var alt = condition_selected[i][2];
				var value = condition_selected[i][3];
				var min = condition_selected[i][4];
				var max = condition_selected[i][5];

				html.push(`<input type='${type}' placeholder='${placeholder}' class='form-control ${placeholder} order-1'`);

				if(typeof alt !== 'undefined'){
					html.push(` alt='${alt}'`)
				}

				if(typeof value !== 'undefined'){
					html.push(` value='${value}'`);
				}

				if(typeof min !== 'undefined'){
					html.push(` min='${min}'`);
				}

				if(typeof max !== 'undefined'){
					html.push(` max='${max}'`);
				}

				html.push(">");

			}

			new_element = $(html.join(''))

		}else if(type == "Cycle"){

			html.push("<select class='form-control order-1'>")

			for(var i = 0; i < static_data.cycles.data.length; i++){
				html.push(`<optgroup label='${ordinal_suffix_of(i+1)} cycle group' value='${i}'>`);
				for(var j = 0; j < static_data.cycles.data[i].names.length; j++){
					html.push(`<option value='${j}'>`);
					html.push(`Cycle ${i+1}: ${static_data.cycles.data[i].names[j]}`);
					html.push("</option>");
				}
				html.push("</optgroup>");
			}

			html.push("</select>")

			new_element = $(html.join(''))

		}else if(type == "Era"){

			html.push("<select class='form-control order-1'>");

			for(var i = 0; i < static_data.eras.length; i++){
				html.push(`<option value='${i}'>`);
				html.push(static_data.eras[i].name);
				html.push("</option>");
			}

			html.push("</select>");

			new_element = $(html.join(''))

		}else if(type == "Season"){

			if(condition_selected[0] == "select"){
				html.push("<select class='form-control order-1'>")
				for(var i = 0; i < static_data.seasons.data.length; i++){
					html.push(`<option value='${i}'>`);
					html.push(static_data.seasons.data[i].name);
					html.push("</option>");
				}

				html.push("</select>")

			}else if(condition_selected[0] == "boolean"){

				html.push(`<input type='hidden' value='1'>`);

			}else{

				for(var i = 0; i < condition_selected.length; i++){

					var type = condition_selected[i][0];
					var placeholder = condition_selected[i][1];
					var alt = condition_selected[i][2];
					var value = condition_selected[i][3];
					var min = condition_selected[i][4];
					var max = condition_selected[i][5];

					html.push(`<input type='${type}' placeholder='${placeholder}' class='form-control ${placeholder} order-1'`);

					if(typeof alt !== 'undefined'){
						html.push(` alt='${alt}'`)
					}

					if(typeof value !== 'undefined'){
						html.push(` value='${value}'`);
					}

					if(typeof min !== 'undefined'){
						html.push(` min='${min}'`);
					}

					if(typeof max !== 'undefined'){
						html.push(` max='${max}'`);
					}

					html.push(">");

				}

			}

            new_element = $(html.join(''))

		}else if(type == "Weekday"){

			var next_start = 0;

			if(condition_selected[0] == "select"){

				var weekdays = [];

				for(var i = 0; i < static_data.year_data.global_week.length; i++){

					if(weekdays.indexOf(static_data.year_data.global_week[i]) == -1){
						weekdays.push(static_data.year_data.global_week[i]);
					}

				}

				for(var i = 0; i < static_data.year_data.timespans.length; i++){

					if(static_data.year_data.timespans[i].week){

						for(var j = 0; j < static_data.year_data.timespans[i].week.length; j++){

							if(weekdays.indexOf(static_data.year_data.timespans[i].week[j]) == -1){
								weekdays.push(static_data.year_data.timespans[i].week[j]);
							}
						}
					}
				}

				html.push("<select class='form-control'>")

				for(var index in weekdays){

					html.push(`<option>`);
					html.push(weekdays[index]);
					html.push("</option>");

				}

				html.push("</select>");

				next_start++;

			}


			for(var i = next_start; i < condition_selected.length; i++){

				html.push(`<input type='${condition_selected[i][0]}' placeholder='${condition_selected[i][1]}' class='form-control ${condition_selected[i][1]}'`);

				if(condition_selected[i][2]){
					html.push(` alt='${condition_selected[i][2]}'`)
				}

				if(condition_selected[i][3]){
					html.push(` value='${condition_selected[i][3]}'`);
				}

				if(condition_selected[i][4]){
					html.push(` min='${condition_selected[i][4]}'`);
				}

				if(condition_selected[i][5]){
					html.push(` max='${condition_selected[i][5]}'`);
				}

				html.push(">");

			}

			new_element = $(html.join(''))

		}else if(type == "Location"){

			html.push("<select class='form-control'>")

			for(var locationId in static_data.seasons.locations){

				var location = static_data.seasons.locations[locationId]

				html.push(`<option value="${locationId}">`);
				html.push(location.name);
				html.push("</option>");

			}

			new_element = $(html.join(''))

		}else if(type == "Events"){

			html.push("<select class='event_select form-control'>")

			for(var eventId in events){

				var event = events[eventId];

				if(eventId == this.event_id){
					html.push(`<option disabled>`);
					html.push(`${event.name} (this event)`);
					html.push("</option>");
				}else{
					if(check_event_chain(this.event_id|0, eventId)){
						html.push(`<option value="${eventId}">`);
						html.push(event.name);
						html.push("</option>");
					}else{
						html.push(`<option disabled>`);
						html.push(`${event.name} (chains to this event)`);
						html.push("</option>");
					}
				}

			}

			html.push("</select>");

			for(var i = 1; i < condition_selected.length; i++){

				var type = condition_selected[i][0];
				var placeholder = condition_selected[i][1];
				var alt = condition_selected[i][2];
				var value = condition_selected[i][3];
				var min = condition_selected[i][4];
				var max = condition_selected[i][5];

				html.push(`<input type='${type}' placeholder='${placeholder}' class='form-control ${placeholder}'`);

				if(typeof alt !== 'undefined'){
					html.push(` alt='${alt}'`)
				}

				if(typeof value !== 'undefined'){
					html.push(` value='${value}'`);
				}

				if(typeof min !== 'undefined'){
					html.push(` min='${min}'`);
				}

				if(typeof max !== 'undefined'){
					html.push(` max='${max}'`);
				}

				html.push(">");

			}

			new_element = $(html.join(''))

		}else if(type === "Random"){

			for(var i = 0; i < condition_selected.length; i++){

				var type = condition_selected[i][0];
				var placeholder = condition_selected[i][1];
				var alt = condition_selected[i][2];
				var value = i == 0 ? condition_selected[i][3] : Math.abs(Math.random().toString().substr(7) | 0);
				var min = condition_selected[i][4];
				var max = condition_selected[i][5];

				html.push(`<input type='${type}' placeholder='${placeholder}' class='form-control ${placeholder}'`);

				if(typeof alt !== 'undefined'){
					html.push(` alt='${alt}'`)
				}

				if(typeof value !== 'undefined'){
					html.push(` value='${value}'`);
				}

				if(typeof min !== 'undefined'){
					html.push(` min='${min}'`);
				}

				if(typeof max !== 'undefined'){
					html.push(` max='${max}'`);
				}

				html.push(">");

			}

			new_element = $(html.join(''))

		}else{

			if(condition_selected[0] == "boolean"){

				html.push(`<input type='hidden' value='1'>`);

			}else{

				for(var i = 0; i < condition_selected.length; i++){

					var type = condition_selected[i][0];
					var placeholder = condition_selected[i][1];
					var alt = condition_selected[i][2];
					var value = condition_selected[i][3];
					var min = condition_selected[i][4];
					var max = condition_selected[i][5];

					html.push(`<input type='${type}' placeholder='${placeholder}' class='form-control ${placeholder}'`);

					if(typeof alt !== 'undefined'){
						html.push(` alt='${alt}'`)
					}

					if(typeof value !== 'undefined'){
						html.push(` value='${value}'`);
					}

					if(typeof min !== 'undefined'){
						html.push(` min='${min}'`);
					}

					if(typeof max !== 'undefined'){
						html.push(` max='${max}'`);
					}

					html.push(">");

				}

			}

			new_element = $(html.join(''))

		}

		element.find('.input_container').empty().append(new_element);

	},

	add_condition: function(parent, type){

		this.inputs_changed = true;

		var html = [];

		html.push("<li class='condition'>");
			html.push(`<div class='condition_container ${type}'>`);
				html.push("<div class='handle icon-reorder'></div>");
				html.push("<select class='form-control moon_select'>");
					for(var i = 0; i < static_data.moons.length; i++){
						html.push(`<option value='${i}'>`);
						html.push(static_data.moons[i].name);
						html.push("</option>");
					}
				html.push("</select>");
				html.push("<select class='form-control condition_type'>");

					var keys = Object.keys(condition_mapping);

					for(var i = 0; i < keys.length; i++){

						if(
							(keys[i] === "Era year" && static_data.eras === undefined)
							||
							(keys[i] === "Era" && static_data.eras === undefined)
							||
							(keys[i] === "Month" && static_data.year_data.timespans === undefined)
							||
							(keys[i] === "Weekday" && static_data.year_data.global_week === undefined)
							||
							(keys[i] === "Moons" && static_data.moons === undefined)
							||
							(keys[i] === "Cycle" && static_data.cycles === undefined)
							||
							(keys[i] === "Events" && events.length <= 1)
							||
							(keys[i] === "Season" && static_data.seasons.data.length < 1)
							||
							(keys[i] === "Location" && static_data.seasons.locations.length < 1)
						){
							continue;
						}

						html.push(`<optgroup label='${keys[i]}'>`);

						var options = condition_mapping[keys[i]];

						for(var j = 0; j < options.length; j++){

							html.push(`<option value='${j}'>`);
							html.push(options[j][0]);
							html.push("</option>");
						}

						html.push("</optgroup>");
					}

				html.push("</select>");
				html.push("<div class='input_container'>");
				html.push("</div>");
			html.push("</div>");
			html.push("<select class='form-control condition_operator'>");
				html.push("<option value='&&'>AND - both must be true</option>");
				html.push("<option value='NAND'>NAND - neither can be true</option>");
				html.push("<option value='||'>OR - at least one is true</option>");
				html.push("<option value='^'>XOR - only one must be true</option>");
			html.push("</select>");
		html.push("</li>");

		var condition = $(html.join(''));
		parent.append(condition);

		condition.find('.condition_type').select2({
			matcher: matcher
		});

		condition.find('.select2').removeAttr('style');

		return condition;

	},

	add_group: function(parent, group_class){

		this.inputs_changed = true;

		var html = [];

		html.push("<li class='group'>");
			html.push(`<div class='group_type' type='${group_class}'>`);
				html.push("<div class='normal'>");
					html.push(`<label><input type='radio' ${(group_class === "normal" ? "checked" : "")} name=''>NORMAL</label>`);
				html.push("</div>");
				html.push("<div class='not'>");
					html.push(`<label><input type='radio' ${(group_class === "not" ? "checked" : "")} name=''>NOT</label>`);
				html.push("</div>");
				html.push("<div class='num'>");
					html.push(`<label><input type='radio' ${(group_class === "num" ? "checked" : "")} name=''>AT LEAST</label><input type='number' class='form-control num_group_con' disabled>`);
				html.push("</div>");
			html.push("</div>");
			html.push("<div class='handle icon-reorder'></div>");
			html.push("<ol class='group_list'></ol>");
			html.push("<select class='form-control condition_operator' disabled>");
				html.push("<option value='&&'>AND  - both must be true</option>");
				html.push("<option value='NAND'>NAND - neither can be true</option>");
				html.push("<option value='||'>OR   - at least one is true</option>");
				html.push("<option value='XOR'>XOR  - only one must be true</option>");
			html.push("</select>");
		html.push("</li>");

		var group = $(html.join(''));

		parent.append(group);

		edit_event_ui.update_radio_button_names();

		return group.children('.group_list');

	},

	update_radio_button_names: function(){
		$(".group_type").each(function(i){
			$(this).find("input[type='radio']").attr("name", `${i}_group_type`);
			var type = $(this).attr('type');
			$(this).find(`.${type} input[type='radio']`).prop('checked', true);
		});
	},

	evaluate_condition_selects: function(element){

		element.children().each(function(){

			if($(this).next().length == 0){
				$(this).find('.condition_operator').prop('disabled', true).addClass('hidden');
			}else{
				$(this).find('.condition_operator').prop('disabled', false).removeClass('hidden');
			}

			if($(this).hasClass('group')){

				edit_event_ui.evaluate_condition_selects($(this).children('.group_list'));

			}

		});

		if(element.hasClass('group_list')){

			if(element.parent().children().first().attr('type') === 'num'){

				element.parent().children('.num_group_con').attr('min', 1).attr('max', Math.max(1, element.children().length));

				element.children().each(function(){

					$(this).children('.condition_operator').prop('disabled', true).addClass('hidden');

				});

				element.children().each(function(){
					if($(this).hasClass('group')){
						edit_event_ui.evaluate_condition_selects($(this).children('.group_list'));
					}
				});
			}
		}
	},

	test_event: function(years){

		if(this.event_is_one_time()){

			swal.fire({
				title: "Uh...",
				text: "This event is a one time event (year, month, day), I'm pretty sure you know the answer to this test.",
				icon: "warning"
			});

		}else{

			this.build_seasons = event_checker.evaluation_has_season_event(this.event_id);

			if(!this.build_seasons){
				this.run_test_event(years);
			}else{
				swal.fire({
					title: "Warning!",
					html: "Simulating events that rely on season data can be <strong>incredibly</strong> slow, as we need to generate the seasons for all of the years we simulate. If you hit OK, be prepared to wait a while. Go get a cup of coffee or two, that kind of thing.",
					showCancelButton: true,
					confirmButtonColor: '#d33',
					cancelButtonColor: '#3085d6',
					confirmButtonText: 'OK',
					icon: "warning",
				}).then((result) => {

					if(!result.dismiss) {
						this.run_test_event(years);
					}

				});
			}


		}

	},

	run_test_event: function(years){

		this.event_occurrences_list_col1.empty();
		this.event_occurrences_list_col2.empty();
		this.event_occurrences_text.empty();

		this.event_occurrences_list_container.addClass('hidden');

		show_loading_screen(true, cancel_event_test);

		if(edit_event_ui.new_event){

			events[edit_event_ui.event_id] = {}

			events[edit_event_ui.event_id].data = edit_event_ui.create_event_data();

		}else{

			edit_event_ui.backup_event_data = clone(events[edit_event_ui.event_id].data);

			events[edit_event_ui.event_id].data = edit_event_ui.create_event_data();

		}

		edit_event_ui.worker_event_tester = new Worker('/js/webworkers/worker_event_tester.js');

		start_year = preview_date.year;
		end_year = preview_date.year+years;

		edit_event_ui.worker_event_tester.postMessage({
			calendar_name: calendar_name,
			static_data: static_data,
			dynamic_data: preview_date,
            events: events,
            event_categories: event_categories,
			owner: Perms.player_at_least('co-owner'),
			start_year: start_year,
			end_year: end_year,
			callback: true,
			event_id: edit_event_ui.event_id,
			build_seasons: this.build_seasons
		});

		edit_event_ui.worker_event_tester.onmessage = e => {
			if(e.data.callback){
				update_loading_bar(e.data.percentage, e.data.message);
			}else{

				edit_event_ui.event_occurrences = e.data.occurrences;

				var num = edit_event_ui.event_occurrences.length;

				let text = years > 1 ? `the next ${years} years.` : "this year.";

				edit_event_ui.event_occurrences_text.html(`This event will appear <span class='bold-text'>${num}</span> time${num > 1 ? "s" : ""} in ${text}`);

				edit_event_ui.event_occurrences_list_container.removeClass('hidden');

				edit_event_ui.worker_event_tester.terminate()

				edit_event_ui.event_occurrences_page = 1;
				edit_event_ui.show_event_dates();

				if(!edit_event_ui.new_event){

					events[edit_event_ui.event_id].data = clone(edit_event_ui.backup_event_data)
					edit_event_ui.backup_event_data = {}

				}

				hide_loading_screen();

			}
		}
	},

	show_event_dates: function(){

		this.event_occurrences_list.toggleClass('hidden', edit_event_ui.event_occurrences.length == 0);

		var html_col1 = []
		var html_col2 = []

		var length = this.event_occurrences_page*10;

		for(var i = (this.event_occurrences_page-1)*10; i < length; i++){

			if(edit_event_ui.event_occurrences[i]){

				let occurrence = edit_event_ui.event_occurrences[i];

				let year = occurrence.year;
				let timespan = occurrence.timespan;
				let timespan_name = static_data.year_data.timespans[occurrence.timespan].name;
				let day = occurrence.day;
				let intercalary = occurrence.intercalary;

				let pre = "";
				let post = "";
				if(window.location.pathname != '/calendars/create') {
					pre = `<a href='${window.baseurl}calendars/${hash}?year=${year}&month=${timespan}&day=${day}' target="_blank">`;
					post = `</a>`;
				}

				if(intercalary){
					var text = `<li class='event_occurance'>${pre}${ordinal_suffix_of(day)} intercalary day of ${timespan_name}, ${year}${post}</li>`
				}else{
					var text = `<li class='event_occurance'>${pre}${ordinal_suffix_of(day)} of ${timespan_name}, ${year}${post}</li>`
				}

				if(i-((this.event_occurrences_page-1)*10) < 5){
					html_col1.push(text);
				}else{
					html_col2.push(text);
				}

			}else{
				break;
			}

		}

		this.event_occurrences_page_number.text(`${this.event_occurrences_page} / ${Math.ceil(edit_event_ui.event_occurrences.length/10)}`).toggleClass('hidden', edit_event_ui.event_occurrences.length <= 10);

		this.event_occurrences_button_prev.prop('disabled', this.event_occurrences_page == 1).parent().toggleClass('hidden', edit_event_ui.event_occurrences.length <= 10);
		this.event_occurrences_button_next.prop('disabled', i != length || i == edit_event_ui.event_occurrences.length).parent().toggleClass('hidden', edit_event_ui.event_occurrences.length <= 10);

		this.event_occurrences_list_col1.html(html_col1.join(''))
		this.event_occurrences_list_col2.html(html_col2.join(''))

	},

	query_delete_event: function(delete_event_id){

		var warnings = [];

		for(var eventId in events){
			if(events[eventId].data.connected_events !== undefined){
				var connected_events = events[eventId].data.connected_events;
				if(connected_events.includes(String(delete_event_id)) || connected_events.includes(Number(delete_event_id))){
					warnings.push(eventId);
				}
			}
		}

		if(warnings.length > 0){

			var html = [];
			html.push(`<div class='text-left'>`)
			html.push(`<h5>You trying to delete "${events[delete_event_id].name}" which is used in the conditions of the following events:</h5>`)
			html.push(`<ul>`);
			for(var i = 0; i < warnings.length; i++){
				var warning_event_id = warnings[i];
				html.push(`<li>${events[warning_event_id].name}</li>`);
			}
			html.push(`</ul>`);
			html.push(`<p>Please remove the conditions using "${events[delete_event_id].name}" in these events before trying to delete it.</p>`)
			html.push(`</div>`);

			swal.fire({
				title: "Warning!",
				html: html.join(''),
				showCancelButton: false,
				confirmButtonColor: '#3085d6',
				confirmButtonText: 'OK',
				icon: "warning",
			})

		}else{

			swal.fire({

				title: "Warning!",
				html: `Are you sure you want to delete the event<br>"${events[delete_event_id].name}"?`,
				showCancelButton: true,
				confirmButtonColor: '#d33',
				cancelButtonColor: '#3085d6',
				confirmButtonText: 'OK',
				icon: "warning",

			}).then((result) => {

				if(!result.dismiss) {

					if($('#events_sortable').length){

						edit_event_ui.delete_event(delete_event_id);

						events_sortable.children(`[index='${delete_event_id}']`).remove();

						events_sortable.children().each(function(i){
							events[i].sort_by = i;
							$(this).attr('index', i);
						});

						evaluate_save_button();

					}else{

						var event_id = events[delete_event_id].id;

						submit_delete_event(event_id, function(){
							edit_event_ui.delete_event(delete_event_id);
						});

					}

				}

			});

		}

	},

	delete_event(delete_event_id){

		for(var eventId in events){
			if(events[eventId].data.connected_events !== undefined){
				for(connectedId in events[eventId].data.connected_events){
					var number = Number(events[eventId].data.connected_events[connectedId])
					if(number > delete_event_id){
						events[eventId].data.connected_events[connectedId] = String(number-1)
					}
				}
			}
		}

		events.splice(delete_event_id, 1);

		edit_event_ui.clear_ui();

		let result = RenderDataGenerator.event_deleted(delete_event_id)
		window.dispatchEvent(new CustomEvent('events-change', {detail: result} ));

	}

}

function cancel_event_test(){

	try{
		edit_event_ui.worker_event_tester.terminate();
	}catch(err){
		console.log(err)
	}

	hide_loading_screen();

}

var event_checker = {

    event_ids: [],

    evaluation_has_season_event: function(event_id){

        this.check_event_chain(event_id)

        for(var i in this.event_ids){

            let event = events[this.event_ids[i]];

            if(JSON.stringify(event.data.conditions).indexOf(`["Season",`) > -1){
				this.event_ids = [];
                return true;
            }

        }

		this.event_ids = [];
        return false;

    },

    check_event_chain: function(event_id){

        this.event_ids.push(event_id);

        var current_event = events[event_id];

        if(current_event.data.connected_events !== undefined && current_event.data.connected_events !== "false"){

            for(var connectedId in current_event.data.connected_events){

                var parent_id = current_event.data.connected_events[connectedId];

                this.check_event_chain(parent_id);

            }

        }

    }

}


function check_event_chain(child, parent_id){

	if(events[parent_id].data.connected_events !== undefined && events[parent_id].data.connected_events.length > 0){

		if(events[parent_id].data.connected_events.includes(child)){

			return false;

		}else{

			for(var i = 0; i < events[parent_id].data.connected_events.length; i++){

				var id = events[parent_id].data.connected_events[i];

				var result = check_event_chain(child, id);

				if(!result){
					return false;
				}
			}
		}
	}

	return true;
}

var show_event_ui = {

	bind_events: function(){

		this.event_id							= -1;
		this.db_event_id						= -1;
		this.era_id								= -1;
		this.event_condition_sortables			= [];
		this.delete_droppable					= false;

		this.event_background 					= $('#event_show_background');
		this.close_ui_btn						= show_event_ui.event_background.find('.close_ui_btn');

		this.event_wrapper						= this.event_background.find('.modal-wrapper');
		this.event_name							= this.event_background.find('.event_name');
		this.event_desc							= this.event_background.find('.event_desc');
		this.event_comments						= this.event_background.find('#event_comments');
		this.event_comment_mastercontainer		= this.event_background.find('#event_comment_mastercontainer');
		this.event_comment_container			= this.event_background.find('#event_comment_container');
		this.event_comment_input_container		= this.event_background.find('#event_comment_input_container');
		this.event_comment_input				= this.event_background.find('#event_comment_input');
		this.event_save_btn						= this.event_background.find('#submit_comment');
		this.edit_event_btn				   		= this.event_background.find('.edit_event_btn');

		this.event_comment_mastercontainer.toggleClass('hidden', !Perms.user_can_comment());

		this.event_comment_input.trumbowyg({
			btns: [
				['strong', 'em', 'del'],
				['superscript', 'subscript'],
				['link'],
				['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
				['unorderedList', 'orderedList'],
				['removeformat']
			]
		});

		this.event_comment_input_container.hide();
		this.event_comment_input.trumbowyg('disabled', true);

		this.close_ui_btn.click(function(){
			show_event_ui.callback_do_close(function(){
				show_event_ui.clear_ui();
			});
		});

		this.event_wrapper.mousedown(function(event){
			event.stopPropagation();
		});

		this.event_background.mousedown(function(){
			show_event_ui.callback_do_close(function(){
				show_event_ui.clear_ui();
			});
		});

		this.event_save_btn.click(function(){
			submit_new_comment(show_event_ui.event_comment_input.trumbowyg('html'), show_event_ui.db_event_id, show_event_ui.add_comment);
			show_event_ui.event_comment_input.trumbowyg('empty');
		});


		this.edit_event_btn.click(function(){
			show_event_ui.callback_do_close(function(){
				edit_event_ui.edit_event(show_event_ui.event_id);
				show_event_ui.clear_ui();
			});
		});

		$.contextMenu({
			selector: ".comment_context_btn",
			trigger: 'left',
			items: {
				edit: {
					name: "Edit comment",
					icon: "fas fa-edit",
					callback: function(key, opt){
						let element = $(opt.$trigger[0]);
						show_event_ui.start_edit_comment(element);
					},
					disabled: function(key, opt){
						let element = $(opt.$trigger[0]);
						let comment_id = Number(element.attr('comment_index'));
						return !show_event_ui.comments[comment_id].comment_owner;
					},
					visible: function(key, opt){
						let element = $(opt.$trigger[0]);
						let comment_id = Number(element.attr('comment_index'));
						return show_event_ui.comments[comment_id].comment_owner;
					}
				},
				delete: {
					name: "Delete comment",
					icon: "fas fa-trash-alt",
					callback: function(key, opt){
						let element = $(opt.$trigger[0]);
						show_event_ui.delete_comment(element);
					}
				},
			},
			zIndex: 1501
		});

		$(document).on('click', '.submit_edit_comment_btn', function(){
			let button = $(this);

			let comment_index = $(this).attr('comment_index');
			let comment = show_event_ui.comments[comment_index];

			let comment_container = button.closest('.event_comment');
			let comment_id = button.attr('comment_id');
			let comment_text_container = comment_container.find('.comment');
			let edit_comment_container = comment_container.find('.edit_comment_container');
			let content = edit_comment_container.trumbowyg('html');

			if(content == ""){
                $.notify(
                    "Comment cannot be empty."
				);
				return;
			};

			submit_edit_comment(comment_id, content, function(){
				comment_text_container.html(content)
				comment.content = content;
				show_event_ui.cancel_edit_comment(button);
			})
		});

		$(document).on('click', '.cancel_edit_comment_btn', function(){
			show_event_ui.cancel_edit_comment($(this));
		});

	},

	delete_comment(element){
		let comment_index = element.attr('comment_index');
		let comment_id = element.attr('comment_id');
		let comment_container = element.closest('.event_comment');
		swal.fire({
			title: "Delete comment?",
			text: "Are you sure you want to delete this comment? This is irreversible.",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: '#d33',
			cancelButtonColor: '#3085d6',
			confirmButtonText: 'OK',
		}).then((result) => {
			if(!result.dismiss) {
				submit_delete_comment(comment_id, function(){
					$.notify(
						"Removed comment.",
						"success"
					);
					comment_container.remove();
					show_event_ui.comments.splice(comment_index, 1)
				});
			}
		});
	},

	start_edit_comment: function(element){

		let comment_index = element.attr('comment_index');
		let comment_content = show_event_ui.comments[comment_index].content;

		let comment_container = element.closest('.event_comment');

		let comment_text_container = comment_container.find('.comment');
		let edit_comment_container = comment_container.find('.edit_comment_container');

		let submit_edit_comment_btn = comment_container.find('.submit_edit_comment_btn');
		let cancel_edit_comment_btn = comment_container.find('.cancel_edit_comment_btn');

		let comment_context_btn = comment_container.find('.comment_context_btn');

		comment_context_btn.toggleClass('hidden', true);
		comment_text_container.toggleClass('hidden', true);

		submit_edit_comment_btn.toggleClass('hidden', false);
		cancel_edit_comment_btn.toggleClass('hidden', false);

		edit_comment_container.trumbowyg({
			btns: [
				['strong', 'em', 'del'],
				['superscript', 'subscript'],
				['link'],
				['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
				['unorderedList', 'orderedList'],
				['removeformat']
			]
		}).trumbowyg('html', comment_content);

		edit_comment_container.toggleClass('hidden', false);

	},

	cancel_edit_comment: function(element){

		let comment_container = element.closest('.event_comment');

		let comment_text_container = comment_container.find('.comment');
		let edit_comment_container = comment_container.find('.edit_comment_container');

		let comment_context_btn = comment_container.find('.comment_context_btn');
		let submit_edit_comment_btn = comment_container.find('.submit_edit_comment_btn');
		let cancel_edit_comment_btn = comment_container.find('.cancel_edit_comment_btn');

		comment_text_container.toggleClass('hidden', false);
		comment_context_btn.toggleClass('hidden', false);

		cancel_edit_comment_btn.toggleClass('hidden', true);
		submit_edit_comment_btn.toggleClass('hidden', true);

		edit_comment_container.toggleClass('hidden', true).trumbowyg('destroy');

	},

	callback_do_close: function(callback){

		if(show_event_ui.event_comment_input.trumbowyg('html').length > 0) {
			swal.fire({
				title: "Cancel comment?",
				text: "You haven't posted your comment yet, are you sure you want to continue?",
				icon: "warning",
				showCancelButton: true,
				confirmButtonColor: '#d33',
				cancelButtonColor: '#3085d6',
				confirmButtonText: 'OK',
			}).then((result) => {
				if(!result.dismiss) {
					callback();
				}
			});
		} else {
			callback();
		}

	},

	clicked_event: function(item){

		if(item.hasClass('era_event')){

			var id = item.attr('event')|0;
			this.era_id = id;
			this.set_current_event(static_data.eras[id]);

		}else{

			var id = item.attr('event')|0;
			this.event_id = id;
			this.set_current_event(events[show_event_ui.event_id]);

		}


	},

	show_event(event_id){
		this.event_id = event_id;
		var event = events[event_id];
		this.set_current_event(event);
	},

	set_current_event: function(event){

		this.db_event_id = event.id;

		let no_edit = !Perms.can_modify_event(this.event_id) || this.era_id > -1;

		this.edit_event_btn.prop('disabled', no_edit).toggleClass('hidden', no_edit);

		this.event_name.text(event.name);

		this.event_desc.html(event.description).toggleClass('hidden', event.description.length == 0);

		this.event_comments.html('').addClass('loading');

		this.event_comment_mastercontainer.removeClass('hidden');

		this.comments = [];

		if(this.era_id > -1){
			this.event_comment_mastercontainer.addClass('hidden');
		}else if(this.db_event_id !== undefined){
			get_event_comments(this.db_event_id, this.add_comments);
		}else if(Perms.user_can_comment()){
			this.event_comments.html("You need to save your calendar before comments can be added to this event!").removeClass('loading');
		}else{
			this.event_comments.removeClass("loading").addClass('hidden');
		}

		this.event_background.removeClass('hidden');

	},

	add_comments: function(comments){

		show_event_ui.event_comments.removeClass('loading');

		show_event_ui.event_comments.toggleClass('empty', comments == false)

		if(comments != false){

			show_event_ui.event_comments.html('');

			for(var index in comments){

				show_event_ui.add_comment(comments[index]);

			}

		}else{

			show_event_ui.event_comment_mastercontainer.toggleClass('hidden', !Perms.user_can_comment());

			if(Perms.user_can_comment()){
				show_event_ui.event_comments.html("No comments on this event yet... Maybe you'll be the first?")
			}

		}

		if(Perms.user_can_comment()){
			show_event_ui.event_comment_input_container.show().find('button').prop('disable', false);
			show_event_ui.event_comment_input.trumbowyg('disabled', false);
		}else{
			show_event_ui.event_comment_input_container.hide().find('button').prop('disable', true);
			show_event_ui.event_comment_input.trumbowyg('disabled', true);
		}

	},

	add_comment: function(comment){

		show_event_ui.comments.push(comment);

		let comment_index = show_event_ui.comments.length-1;

		var content = [];

		content.push(`<div class='container p-2 rounded event_comment ${comment.comment_owner ? "comment_owner" : ""} ${comment.calendar_owner ? "calendar_owner" : ""}'`);
		content.push(` date='${comment.date}' comment_id='${comment.id}' comment_index='${comment_index}'>`);
			content.push(`<div class='row mb-1'>`);
				content.push(`<div class='col-auto'>`);
					content.push(`<p><span class='username'>${comment.username}${comment.comment_owner ? " (you)" : (comment.calendar_owner ? " (owner)" : "")}</span>`);
					content.push(`<span class='date'> - ${comment.date}</span></p>`);
				content.push(`</div>`);
			if(Perms.user_can_delete_comment(comment)){
				content.push(`<div class='col-auto ml-auto'>`);
					content.push(`<button class='btn btn-sm btn-outline-secondary border-0 comment_context_btn' comment_id='${comment.id}' comment_index='${comment_index}'><i class="fas fa-ellipsis-v"></i></button>`);
					if(comment.comment_owner){
						content.push(`<button class='btn btn-sm btn-primary hidden submit_edit_comment_btn ml-2' comment_id='${comment.id}' comment_index='${comment_index}'>Submit</button>`);
						content.push(`<button class='btn btn-sm btn-danger hidden cancel_edit_comment_btn ml-2' comment_id='${comment.id}' comment_index='${comment_index}'>Cancel</button>`);
					}
				content.push(`</div>`);
			}
			content.push(`</div>`);
			content.push(`<div class='row'>`);
				content.push(`<div class='col'>`);
					content.push(`<div class='comment'>${comment.content}</div>`);
					content.push(`<div class='edit_comment_container hidden'></div>`);
				content.push(`</div>`);
			content.push(`</div>`);
		content.push(`</div>`);

		show_event_ui.event_comments.append(content.join(''))

	},

	clear_ui: function(){

		this.event_id = -1;
		this.db_event_id = -1;
		this.era_id = -1;

		this.event_name.text('');

		this.event_comment_container.addClass('hidden');

		this.event_comments.html('').addClass('loading');

		this.event_comment_input_container.hide().find('button').prop('disable', true);
		this.event_comment_input.trumbowyg('disabled', true);

		this.event_desc.html('').removeClass('hidden');

		this.event_comment_input.trumbowyg('html', '');

		this.event_background.addClass('hidden');

	},
}

var edit_HTML_ui = {

	bind_events: function(){

		this.html_edit_background 				= $('#html_edit_background');
		this.save_btn							= this.html_edit_background.find('#btn_html_save');
		this.close_ui_btn						= this.html_edit_background.find('.close_ui_btn');
		this.trumbowyg							= this.html_edit_background.find('.html_input');

		this.trumbowyg.trumbowyg();

		edit_HTML_ui.save_btn.click(function(){
			edit_HTML_ui.save_html();
		})

		edit_HTML_ui.close_ui_btn.click(function(){
			edit_HTML_ui.clear_ui();
		});

		$(document).on('click', '.html_edit', function(){
			edit_HTML_ui.edit_era_description($(this).closest('.sortable-container').attr('index')|0);
		});

	},

	edit_era_description: function(era_index){

		this.era = static_data.eras[era_index];

		this.set_html();

	},

	set_html: function(){

		this.trumbowyg.trumbowyg('html', this.era.description);

		this.html_edit_background.removeClass('hidden');

	},

	save_html: function(){

		this.era.description = this.trumbowyg.trumbowyg('html');

		evaluate_save_button();

		this.clear_ui();

	},

	clear_ui: function(){

		this.trumbowyg.trumbowyg('html', '');

		this.html_edit_background.addClass('hidden');

	},
}
