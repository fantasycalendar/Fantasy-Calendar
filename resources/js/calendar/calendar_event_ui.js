/* ------------------------------------------------------- */
/* ------------------ Calendar UI class ------------------ */
/* ------------------------------------------------------- */

var edit_event_ui = {

	data: {},

	bind_events: function(){

		this.new_event							= false;
		this.event_id							= null;
		this.event_condition_sortables			= [];
		this.delete_droppable					= false;
		this.conditions_changed					= false;
		this.date 								= [];
		this.connected_events					= [];
		this.search_distance					= 0;
		this.prev_version_event					= {};

		this.event_background 					= $('#event_edit_background');
		this.event_conditions_container			= $('#event_conditions_container');
		this.condition_presets					= $('#condition_presets');
		this.repeat_input						= $('#repeat_input');
		this.non_preset_buttons					= $('#non_preset_buttons');
		this.save_btn							= this.event_background.find('#btn_event_save');
		this.close_ui_btn						= this.event_background.find('.close_ui_btn');
		this.test_event_btn						= this.event_background.find('.test_event_btn');
		this.trumbowyg							= this.event_background.find('.event_desc');

		this.event_occurrences_page = 1;
		this.processed_event_data = false;
		this.event_occurrences = false;

		this.event_occurrences_container		= $('.event_occurrences');
		this.event_occurrences_list_container	= $('.event_occurrences .list_container');
		this.event_occurrences_page_number		= $('.event_occurrences .list_container .page_number');
		this.event_occurrences_text				= $('.event_occurrences .list_container .text');
		this.event_occurrences_list				= $('.event_occurrences .list_container .list');
		this.event_occurrences_list_col1		= $('.event_occurrences .list_container .list .col1');
		this.event_occurrences_list_col2		= $('.event_occurrences .list_container .list .col2');
		this.event_occurrences_button_prev		= $('.event_occurrences .list_container .prev');
		this.event_occurrences_button_next		= $('.event_occurrences .list_container .next');

		this.event_occurrences_button_prev.click(function(e){
			edit_event_ui.event_occurrences_page--;
			edit_event_ui.show_event_dates();
		});

		this.event_occurrences_button_next.click(function(e){
			edit_event_ui.event_occurrences_page++;
			edit_event_ui.show_event_dates();
		});

		this.trumbowyg.trumbowyg();

		$(document).on('click', '.open-edit-event-ui', function(){

			var index = $(this).closest('.sortable-container').attr('index');

			edit_event_ui.edit_event(index);

		});

		$(document).on('click', '.btn_create_event', function(){

			var epoch = $(this).closest('.timespan_day').attr('epoch')|0;

			edit_event_ui.data = clone(evaluated_static_data.epoch_data[epoch]);

			edit_event_ui.create_new_event();

			edit_event_ui.populate_condition_presets();

		});

		this.save_btn.click(function(){
			edit_event_ui.event_background.scrollTop = 0;
			edit_event_ui.save_current_event();
		})

		edit_event_ui.close_ui_btn.click(function(){

			if(edit_event_ui.has_changed()){

				swal({
					title: "Are you sure?",
					text: 'This event will not be saved! Are you sure you want to close the event UI?',
					dangerMode: true,
					buttons: true,
					icon: "warning",
				}).then((willDelete) => {
					if(willDelete) {
						if(edit_event_ui.new_event){
							delete static_data.event_data.events[edit_event_ui.event_id];
						}

						edit_event_ui.clear_ui();
					}
				});

			}else{

				edit_event_ui.clear_ui();

			}
		});

		this.test_event_btn.click(function(){

			edit_event_ui.test_event(Number($(this).attr('years')))

		});

		this.condition_presets.on('focusin', function(){
			$(this).data('val', $(this).val());
		});

		this.condition_presets.change(function(e){
    		
    		var prev = $(this).data('val');

			var selected = edit_event_ui.condition_presets.children(':selected');

			if(selected.val() == prev){
				return;
			}

			var nth = selected[0].hasAttribute('nth');
							
			edit_event_ui.repeat_input.prop('disabled', !nth).parent().toggleClass('hidden', !nth);

			edit_event_ui.update_every_nth_presets();

			if(edit_event_ui.event_conditions_container.children().length > 0 && e.originalEvent){

				if(edit_event_ui.conditions_changed){

					swal({
						title: "Warning!",
						text: "This will override all of your conditions, are you sure you want to do that?",
						icon: "warning",
						buttons: true,
						dangerMode: true,
					}).then((override) => {

						if(override) {

							var preset = edit_event_ui.condition_presets.val();
							var repeats = edit_event_ui.repeat_input.val()|0;

							edit_event_ui.update_every_nth_presets();

							edit_event_ui.event_conditions_container.empty();
							edit_event_ui.add_preset_conditions(preset, repeats);

						}else{

							$(this).val(prev);

							var nth = $(this).find(`option[value="${prev}"]`)[0].hasAttribute('nth');
							
							edit_event_ui.repeat_input.prop('disabled', !nth).parent().toggleClass('hidden', !nth);

						}

					});

				}else{

					var preset = edit_event_ui.condition_presets.val();
					var repeats = edit_event_ui.repeat_input.val()|0;

					edit_event_ui.update_every_nth_presets();

					edit_event_ui.event_conditions_container.empty();
					edit_event_ui.add_preset_conditions(preset, repeats);
				}

			}else{

				var preset = edit_event_ui.condition_presets.val();
				var repeats = edit_event_ui.repeat_input.val()|0;

				edit_event_ui.update_every_nth_presets();

				edit_event_ui.event_conditions_container.empty();
				edit_event_ui.add_preset_conditions(preset, repeats);

			}

		});

		this.repeat_input.change(function(){
			edit_event_ui.update_every_nth_presets();
			edit_event_ui.condition_presets.change();
		});

		$(document).on('change', '.event-text-input', function(){

			if($(this).closest('.sortable-container').length){
				var parent = $(this).closest('.sortable-container');
			}else{
				var parent = $(this).closest('#event-form');
			}

			var output = parent.find('.event-text-output');
			var input = parent.find('.event-text-input');

			var classes = output.attr('class').split(' ');
			classes.length = 3;

			classes.push($(this).val());
			classes.push(input.not(this).val());

			classes = classes.join(' ');

			output.prop('class', classes);

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
				$('#remove_dropped').removeClass('hidden');

			},
			onDrop: function (item, container, _super, event) {
				item.removeClass(container.group.options.draggedClass).removeAttr("style");
				$("body").removeClass(container.group.options.bodyClass);
				$('#remove_dropped').addClass('hidden');
				if(edit_event_ui.delete_droppable){
					item.remove();
				}
				edit_event_ui.evaluate_condition_selects(edit_event_ui.event_conditions_container);
			},
			tolerance: -5
		});

		this.event_conditions_container.change(function(){
			edit_event_ui.event_occurrences_container.toggleClass('hidden', edit_event_ui.event_conditions_container.length == 0);
		})

		$('#remove_dropped').mouseover(function(){
			edit_event_ui.delete_droppable = true;
		}).mouseout(function(){
			edit_event_ui.delete_droppable = false;
		})

		$("#event_categories").change(function(){
			if($(this).val() != -1){
				slug = $(this).val();
				var category = get_category(slug);

				$('#color_style').val(category.event_settings.color);
				$('#text_style').val(category.event_settings.text).change();
				$('#event_hide_players').prop('checked', category.event_settings.hide);
				$('#event_dontprint_checkbox').prop('checked', category.event_settings.noprint);
				$('#event_hide_full').prop('checked', category.event_settings.hide_full);
			}
		});

		this.evaluate_condition_selects(edit_event_ui.event_conditions_container);

		$('#add_event_condition_group').click(function(){
			edit_event_ui.add_group(edit_event_ui.event_conditions_container, "normal");
			edit_event_ui.evaluate_condition_selects(edit_event_ui.event_conditions_container);
		});

		$('#add_event_condition').click(function(){
			edit_event_ui.add_condition(edit_event_ui.event_conditions_container, "Year");
			edit_event_ui.evaluate_inputs(edit_event_ui.event_conditions_container.children().last())
			edit_event_ui.evaluate_condition_selects(edit_event_ui.event_conditions_container);
		});


		$(document).on('change', '.moon_select', function(){
			edit_event_ui.evaluate_inputs($(this).closest('.condition'))
		});


		$(document).on('change', '.condition_type', function(){

			var selected_option = $(this).find(":selected");
			var type = selected_option.parent().attr('label');

			var lastClass = $(this).closest('.condition_container').attr('class').split(' ').pop();
			$(this).closest('.condition_container').removeClass(lastClass).addClass(type);

			edit_event_ui.evaluate_inputs($(this).closest('.condition'));

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
		})

		$('#limited_repeat').change(function(){
			edit_event_ui.event_background.find('#limited_repeat_num').prop('disabled', !$(this).prop('checked'));
		});

		$('#has_duration').change(function(){
			edit_event_ui.event_background.find('#duration').prop('disabled', !$(this).prop('checked'));
		});

	},

	create_new_event: function(name){

		edit_event_ui.new_event = true;

		var stats = {
			'name': name !== undefined ? name : 'New event',
			'description': '',
			'data': {
				'has_duration': false,
				'duration': 1,
				'show_first_last': false,
				'limited_repeat': false,
				'limited_repeat_num': 1,
				'conditions': [],
				'connected_events': false,
				'date': [],
				'search_distance': 0
			},
			'settings': {
				'color': 'Dark-Solid',
				'text': 'text',
				'hide': false,
				'noprint': false,
				'hide_full': false
			},
		};

		eventId = Object.keys(static_data.event_data.events).length;

		static_data.event_data.events[eventId] = stats;

		this.set_current_event(eventId)

	},

	edit_event: function(event_id){

		this.prev_version_event = clone(static_data.event_data.events[event_id]);

		this.set_current_event(event_id)

	},

	set_current_event: function(event_id){

		this.event_id = event_id;

		var event = static_data.event_data.events[this.event_id];

		this.event_background.find('.event_name').val(event.name);

		this.trumbowyg.trumbowyg('html', event.description);

		this.create_conditions(event.data.conditions, this.event_conditions_container);

		this.event_occurrences_container.toggleClass('hidden', edit_event_ui.event_conditions_container.length == 0);

		this.search_distance = event.data.search_distance;

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

		$('#event_dontprint_checkbox').prop('checked', event.settings.noprint);

		$('#limited_repeat').prop('checked', event.data.limited_repeat);
		$('#limited_repeat_num').prop('disabled', !event.data.limited_repeat).val(event.data.limited_repeat_num);

		$('#has_duration').prop('checked', event.data.has_duration);
		$('#duration').prop('disabled', !event.data.has_duration).val(event.data.duration);

		$('#show_first_last').prop('checked', event.data.show_first_last);

		this.event_background.removeClass('hidden');

	},

	save_current_event: function(){

		if(static_data.event_data.events[this.event_id]){
			var eventid = static_data.event_data.events[this.event_id].id;
			static_data.event_data.events[this.event_id] = {};
			static_data.event_data.events[this.event_id].id = eventid;
		}else{
			static_data.event_data.events[this.event_id] = {};
		}

		var name = this.event_background.find('.event_name').val();
		name = name !== '' ? name : "Unnamed Event";

		static_data.event_data.events[this.event_id].name = name;

		static_data.event_data.events[this.event_id].description = this.trumbowyg.trumbowyg('html');

		static_data.event_data.events[this.event_id].data = this.create_event_data();

		static_data.event_data.events[this.event_id].event_category_id = get_category($('#event_categories').val()).id;

		static_data.event_data.events[this.event_id].settings = {
			color: $('#color_style').val(),
			text: $('#text_style').val(),
			hide: $('#event_hide_players').prop('checked'),
			hide_full: $('#event_hide_full').prop('checked'),
			noprint: $('#event_dontprint_checkbox').prop('checked')
		}

		if(edit_event_ui.new_event){
			add_event_to_sortable(events_sortable, this.event_id, static_data.event_data.events[this.event_id]);
		}else{
			$(`.events_input[index="${this.event_id}"]`).find(".event_name").text(`Edit - ${name}`);
		}

		edit_event_ui.clear_ui();

		error_check();

		rebuild_events();

	},

	clear_ui: function(){

		this.event_id = null;

		this.event_background.find('.event_name').val('');

		this.trumbowyg.trumbowyg('html', '');

		this.repeat_input.val('1').parent().toggleClass('hidden', true);
		this.condition_presets.children().eq(0).prop('selected', true);
		this.condition_presets.parent().toggleClass('hidden', true);
		this.update_every_nth_presets();

		this.event_occurrences_container.addClass('hidden');
		this.event_occurrences_list_container.addClass('hidden');

		this.event_conditions_container.empty();

		this.data = {};

		this.new_event = false;

		this.date = [];

		this.connected_events = [];

		$('#event_categories').val('');

		$('#color_style').val('');
		$('#text_style').val('');

		$('#event_hide_players').prop('checked', false);

		$('#event_hide_full').prop('checked', false);

		$('#event_dontprint_checkbox').prop('checked', false);

		$('#limited_repeat').prop('checked', false);
		$('#limited_repeat_num').prop('disabled', true).val(1);

		$('#has_duration').prop('checked', false);
		$('#duration').prop('disabled', true).val(1);
		$('#show_first_last').prop('checked', false);

		this.event_background.addClass('hidden');

	},

	create_event_data: function(){

		var conditions = this.create_condition_array(edit_event_ui.event_conditions_container);

		this.date = []

		if(conditions.length == 5){

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

		return {
			has_duration: $('#has_duration').prop('checked'),
			duration: $('#duration').val()|0,
			show_first_last: $('#show_first_last').prop('checked'),
			limited_repeat: $('#limited_repeat').prop('checked'),
			limited_repeat_num: $('#limited_repeat_num').val()|0,
			conditions: conditions,
			connected_events: this.connected_events,
			date: this.date,
			search_distance: this.get_search_distance()
		};
    
	},

	get_search_distance: function(){

		var event = static_data.event_data.events[this.event_id];

		var search_distance = $('#duration').val()|0 > search_distance ? $('#duration').val()|0 : search_distance;
		var search_distance = $('#limited_repeat_num').val()|0 > search_distance ? $('#limited_repeat_num').val()|0 : search_distance;
		var search_distance = this.search_distance > search_distance ? this.search_distance : search_distance;

		return search_distance;

	},

	event_is_one_time: function(){

		var date = []

		var conditions = this.create_condition_array(edit_event_ui.event_conditions_container);

		if(conditions.length == 5){

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

		return date.length > 0;

	},

	has_changed: function(){

		if(static_data.event_data.events[this.event_id]){

			var event_check = clone(static_data.event_data.events[this.event_id])

			var eventid = static_data.event_data.events[this.event_id].id;

			event_check.id = eventid;

			var name = this.event_background.find('.event_name').val();
			name = name !== '' ? name : "Unnamed Event";

			event_check.name = name;

			event_check.description = this.trumbowyg.trumbowyg('html');

			event_check.data = this.create_event_data();

			event_check.event_category_id = get_category($('#event_categories').val()).id;

			event_check.settings = {
				color: $('#color_style').val(),
				text: $('#text_style').val(),
				hide: $('#event_hide_players').prop('checked'),
				hide_full: $('#event_hide_full').prop('checked'),
				noprint: $('#event_dontprint_checkbox').prop('checked')
			}

			return !Object.compare(event_check, static_data.event_data.events[this.event_id])

		}else{

			return false;

		}

	},

	populate_condition_presets: function(){

		this.condition_presets.parent().toggleClass('hidden', false);

		this.condition_presets.find('option[value="weekly"]').text(`Weekly on ${edit_event_ui.data.week_day_name}`);
		this.condition_presets.find('option[value="fortnightly"]').text(`Fortnightly on ${edit_event_ui.data.week_day_name}`);
		this.condition_presets.find('option[value="monthly_date"]').text(`Monthly on the ${ordinal_suffix_of(edit_event_ui.data.day)}`);
		this.condition_presets.find('option[value="monthly_weekday"]').text(`Monthly on the ${ordinal_suffix_of(edit_event_ui.data.month_week_num)} ${edit_event_ui.data.week_day_name}`);
		this.condition_presets.find('option[value="annually_date"]').text(`Annually on the ${ordinal_suffix_of(edit_event_ui.data.day)} of ${edit_event_ui.data.timespan_name}`);
		this.condition_presets.find('option[value="annually_month_weekday"]').text(`Annually on the ${ordinal_suffix_of(edit_event_ui.data.month_week_num)} ${edit_event_ui.data.week_day_name} in ${edit_event_ui.data.timespan_name}`);

		this.condition_presets.children().eq(1).prop('selected', true).change();

	},

	update_every_nth_presets: function(){

		var repeat_value = this.repeat_input.val()|0;

		if(!repeat_value){
			repeat_value = 'nth';
		}

		this.condition_presets.find('option[value="every_x_day"]').text(`Every ${ordinal_suffix_of(repeat_value)} day`);
		this.condition_presets.find('option[value="every_x_weekday"]').text(`Every ${ordinal_suffix_of(repeat_value)} ${edit_event_ui.data.week_day_name}`);
		this.condition_presets.find('option[value="every_x_monthly_date"]').text(`Every ${ordinal_suffix_of(repeat_value)} month on the ${ordinal_suffix_of(edit_event_ui.data.day)}`);
		this.condition_presets.find('option[value="every_x_monthly_weekday"]').text(`Every ${ordinal_suffix_of(repeat_value)} month on the ${ordinal_suffix_of(edit_event_ui.data.month_week_num)} ${edit_event_ui.data.week_day_name}`);
		this.condition_presets.find('option[value="every_x_annually_date"]').text(`Every ${ordinal_suffix_of(repeat_value)} year on the ${ordinal_suffix_of(edit_event_ui.data.day)} of ${edit_event_ui.data.timespan_name}`);
		this.condition_presets.find('option[value="every_x_annually_weekday"]').text(`Every ${ordinal_suffix_of(repeat_value)} year on the ${ordinal_suffix_of(edit_event_ui.data.month_week_num)} ${edit_event_ui.data.week_day_name} in ${edit_event_ui.data.timespan_name}`);

	},

	add_preset_conditions: function(preset, repeats){

		switch(preset){
			case 'once':
				var result = [
					['Year', '0', [edit_event_ui.data.year]],
					['&&'],
					['Month', '0', [edit_event_ui.data.timespan_index]],
					['&&'],
					['Day', '0', [edit_event_ui.data.day]]
				];
				break;

			case 'daily':
				var result = [
					['Epoch', '6', ["1", "0"]]
				];
				break;

			case 'weekly':
				var result = [
					['Weekday', '0', [edit_event_ui.data.week_day]]
				];
				break;

			case 'fortnightly':
				var result = [
					['Weekday', '0', [edit_event_ui.data.week_day]],
					['&&'],
					['Week', '13', [edit_event_ui.data.week_even ? '2' : '1', '0']]
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
					['Weekday', '0', [edit_event_ui.data.week_day]],
					['&&'],
					['Weekday', '6', [edit_event_ui.data.week_day_num]]
				];
				break;

			case 'annually_month_weekday':
				var result = [
					['Month', '0', [edit_event_ui.data.timespan_index]],
					['&&'],
					['Weekday', '0', [edit_event_ui.data.week_day]],
					['&&'],
					['Weekday', '6', [edit_event_ui.data.week_day_num]]
				];
				break;

			case 'every_x_day':
				var result = [
					['Epoch', '6', [repeats, (edit_event_ui.data.epoch+1)%repeats]]
				];
				break;

			case 'every_x_weekday':
				var result = [
					['Weekday', '0', [edit_event_ui.data.week_day]],
					['&&'],
					['Week', '20', [repeats, (edit_event_ui.data.total_week_num+1)%repeats]]
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
					['Weekday', '0', [edit_event_ui.data.week_day]],
					['&&'],
					['Weekday', '6', [edit_event_ui.data.week_day_num]]
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
					['Weekday', '0', [edit_event_ui.data.week_day]],
					['&&'],
					['Weekday', '6', [edit_event_ui.data.week_day_num]]
					['&&'],
					['Month', '0', [edit_event_ui.data.timespan_index]],
					['&&'],
					['Year', '6', [repeats, (edit_event_ui.data.year+1)%repeats]]
				];
				break;

			/*case 'moon_every':
				var result = [
					['Moons', '0', [edit_event_ui.data.moon_id, convert_to_granularity(edit_event_ui.data.moon_phase)]]
				];
				break;

			case 'moon_monthly':
				var result = [
					['Moons', '0', [edit_event_ui.data.moon_id, convert_to_granularity(edit_event_ui.data.moon_phase)]],
					['&&'],
					['Moons', '7', [edit_event_ui.data.moon_id, convert_to_granularity(edit_event_ui.data.moon_phase_number)]]
				];
				break;

			case 'moon_anually':
				var result = [
					['Moons', '0', [edit_event_ui.data.moon_id, convert_to_granularity(edit_event_ui.data.moon_phase)]],
					['&&'],
					['Moons', '7', [edit_event_ui.data.moon_id, edit_event_ui.data.moon_phase_number]],
					['&&'],
					['Month', '0', [edit_event_ui.data.timespan_index]]
				];
				break;

			case 'multimoon_every':
				var result = [];
				for(var i = 0; i < edit_event_ui.data.moons.length; i++){
					result.push(['Moons', '0', [i, convert_to_granularity(edit_event_ui.data.moons[i].moon_phase)]])
					if(i != edit_event_ui.data.moons.length-1){
						result.push(['&&']);
					}
				}
				break;

			case 'multimoon_anually':
				var result = [];
				result.push(['Month', '0', [edit_event_ui.data.timespan_index]]);
				result.push(['&&']);
				for(var i = 0; i < edit_event_ui.data.moons.length; i++){
					result.push(['Moons', '0', [i, convert_to_granularity(edit_event_ui.data.moons[i].moon_phase)]])
					if(i != edit_event_ui.data.moons.length-1){
						result.push(['&&']);
					}
				}
				break;*/
		}

		this.create_conditions(result, edit_event_ui.event_conditions_container);
		this.evaluate_condition_selects(edit_event_ui.event_conditions_container);

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

					edit_event_ui.search_distance = Number(val) > edit_event_ui.search_distance ? Number(val) : edit_event_ui.search_distance;

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

			if(!condition_operator.prop('disabled')){
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
					condition.find('.event_select').val(static_data.event_data.events[this.event_id].data.connected_events[element[2][0]])
					condition.find('.input_container').children().eq(1).val(element[2][1]);

					edit_event_ui.search_distance = Number(element[2][1]) > edit_event_ui.search_distance ? Number(element[2][1]) : edit_event_ui.search_distance;

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

		this.conditions_changed = true;

		var selected_option = element.find('.condition_type').find(":selected");

		var type = selected_option.parent().attr('label');
		var selected = selected_option.val();
		var condition_selected = condition_mapping[type][selected][2];

		var html = [];

		if(type == "Month"){

			var next_start = 0;

			if(condition_selected[0] == "select"){
				html.push("<select class='form-control form-control-sm'>")

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

				html.push(`<input type='${type}' placeholder='${placeholder}' class='form-control form-control-sm ${placeholder}'`);

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

		}else if(type == "Moons"){

			var next_start = 0;

			if(condition_selected[0] == "select"){

				var selected_moon = element.find('.moon_select').val();

				selected_moon = selected_moon ? selected_moon : 0;

				html.push("<select class='form-control form-control-sm'>")

				for(var i = 0; i < moon_phases[static_data.moons[selected_moon].granularity].length; i++){
					html.push(`<option value='${i}'>`);
					html.push(moon_phases[static_data.moons[selected_moon].granularity][i]);
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

				html.push(`<input type='${type}' placeholder='${placeholder}' class='form-control form-control-sm ${placeholder}'`);

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

		}else if(type == "Cycle"){

			html.push("<select class='form-control form-control-sm'>")

			for(var i = 0; i < static_data.cycles.data.length; i++){
				html.push(`<optgroup label='${ordinal_suffix_of(i+1)} cycle group' value='${i}'>`);
				for(var j = 0; j < static_data.cycles.data[i].names.length; j++){
					html.push(`<option value='${j}'>`);
					html.push(static_data.cycles.data[i].names[j]);
					html.push("</option>");
				}
				html.push("</optgroup>");
			}

			html.push("</select>")

		}else if(type == "Era"){

			html.push("<select class='form-control form-control-sm'>");

			for(var i = 0; i < static_data.eras.length; i++){
				html.push(`<option value='${i}'>`);
				html.push(static_data.eras[i].name);
				html.push("</option>");
			}

			html.push("</select>");

		}else if(type == "Season"){


			if(condition_selected[0] == "select"){
				html.push("<select class='form-control form-control-sm'>")
				for(var i = 0; i < static_data.seasons.data.length; i++){
					html.push(`<option value='${i}'>`);
					html.push(static_data.seasons.data[i].name);
					html.push("</option>");
				}

				html.push("</select>")

			}else{

				for(var i = 0; i < condition_selected.length; i++){

					var type = condition_selected[i][0];
					var placeholder = condition_selected[i][1];
					var alt = condition_selected[i][2];
					var value = condition_selected[i][3];
					var min = condition_selected[i][4];
					var max = condition_selected[i][5];

					html.push(`<input type='${type}' placeholder='${placeholder}' class='form-control form-control-sm ${placeholder}'`);

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

		}else if(type == "Weekday"){

			var next_start = 0;

			if(condition_selected[0] == "select"){

				html.push("<select class='form-control form-control-sm'>")

				html.push(`<optgroup label='Global week' value='global_week'>`);

				for(var i = 0; i < static_data.year_data.global_week.length; i++){

					html.push(`<option value='${i+1}'>`);
					html.push(static_data.year_data.global_week[i]);
					html.push("</option>");

				}

				html.push("</optgroup>");

				for(var i = 0; i < static_data.year_data.timespans.length; i++){

					if(static_data.year_data.timespans[i].week){

						html.push(`<optgroup label='${static_data.year_data.timespans[i].name} (custom week)' value='${i}'>`);

						for(var j = 0; j < static_data.year_data.timespans[i].week.length; j++){

							html.push(`<option value='${j+1}'>`);
							html.push(static_data.year_data.timespans[i].week[j]);
							html.push("</option>");

						}

						html.push("</optgroup>");

					}
				}

				html.push("</select>");

				next_start++;

			}


			for(var i = next_start; i < condition_selected.length; i++){

				html.push(`<input type='${condition_selected[i][0]}' placeholder='${condition_selected[i][1]}' class='form-control form-control-sm ${condition_selected[i][1]}'`);

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

		}else if(type == "Events"){

			html.push("<select class='event_select form-control form-control-sm'>")

			for(var eventId in static_data.event_data.events){

				var event = static_data.event_data.events[eventId];

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

				html.push(`<input type='${type}' placeholder='${placeholder}' class='form-control form-control-sm ${placeholder}'`);

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

		}else{

			for(var i = 0; i < condition_selected.length; i++){

				var type = condition_selected[i][0];
				var placeholder = condition_selected[i][1];
				var alt = condition_selected[i][2];
				var value = condition_selected[i][3];
				var min = condition_selected[i][4];
				var max = condition_selected[i][5];

				html.push(`<input type='${type}' placeholder='${placeholder}' class='form-control form-control-sm ${placeholder}'`);

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

		element.find('.input_container').empty().append(html.join(''));

	},

	add_condition: function(parent, type){

		var html = [];

		html.push("<li class='condition'>");
			html.push(`<div class='condition_container ${type}'>`);
				html.push("<div class='handle icon-reorder'></div>");
				html.push("<select class='form-control form-control-sm moon_select'>");
					for(var i = 0; i < static_data.moons.length; i++){
						html.push(`<option value='${i}'>`);
						html.push(static_data.moons[i].name);
						html.push("</option>");
					}
				html.push("</select>");
				html.push("<select class='form-control form-control-sm condition_type'>");

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
							(keys[i] === "Events" && static_data.event_data.events.length <= 1)
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

		return condition;

	},

	add_group: function(parent, group_class){

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
					html.push(`<label><input type='radio' ${(group_class === "num" ? "checked" : "")} name=''>AT LEAST</label><input type='number' class='form-control form-control-sm num_group_con' disabled>`);
				html.push("</div>");
			html.push("</div>");
			html.push("<div class='handle icon-reorder'></div>");
			html.push("<ol class='group_list'></ol>");
			html.push("<select class='form-control condition_operator'>");
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

			if($(this).next().length === 0){
				$(this).children('.condition_operator').prop('disabled', true).addClass('hidden');
			}else{
				$(this).children('.condition_operator').prop('disabled', false).removeClass('hidden');
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

			swal({
				title: "Uh...",
				text: "This event is an one time event (year, month, day), I'm pretty sure you know the answer to this test.",
				icon: "warning"
			});

		}else{

			swal({
				title: "Warning!",
				text: "Simulating events may take a loooong time, depending on many factors! If your event is based on other events, we need to simulate those too!",
				icon: "warning",
				buttons: true,
				dangerMode: true,
			}).then((will_simulate) => {

				if(will_simulate) {
					this.run_test_event(years);
				}

			});
			
		}

	},

	run_test_event: function(years){

		this.event_occurrences_list_col1.empty();
		this.event_occurrences_list_col2.empty();
		this.event_occurrences_text.empty();

		this.event_occurrences_list_container.addClass('hidden');

		show_loading_screen(true, cancel_event_test);

		if(edit_event_ui.new_event){

			static_data.event_data.events[edit_event_ui.event_id] = {}

			static_data.event_data.events[edit_event_ui.event_id].data = edit_event_ui.create_event_data();

		}else{

			edit_event_ui.backup_event_data = clone(static_data.event_data.events[edit_event_ui.event_id].data);

			static_data.event_data.events[edit_event_ui.event_id].data = edit_event_ui.create_event_data();

		}

		edit_event_ui.worker_future_calendar = new Worker('/js/webworkers/worker_calendar.js');

		edit_event_ui.worker_future_calendar.postMessage({
			calendar_name: calendar_name,
			static_data: static_data,
			dynamic_data: dynamic_data,
			action: "future",
			owner: owner,
			start_year: dynamic_data.year+1,
			end_year: dynamic_data.year+2+years
		});

		edit_event_ui.worker_future_calendar.onmessage = e => {

			edit_event_ui.event_data = e.data.processed_data.epoch_data;

			edit_event_ui.worker_future_events = new Worker('/js/webworkers/worker_events.js');

			edit_event_ui.worker_future_events.postMessage({
				static_data: static_data,
				epoch_data: edit_event_ui.event_data,
				event_id: edit_event_ui.event_id,
				start_epoch: e.data.processed_data.start_epoch,
				end_epoch: e.data.processed_data.end_epoch,
				callback: true
			});

			edit_event_ui.worker_future_events.onmessage = e => {

				if(e.data.callback){

					update_loading_bar(e.data.count[0] / e.data.count[1]);

				}else{

					event_occurrences = e.data.event_data.valid[edit_event_ui.event_id] ? e.data.event_data.valid[edit_event_ui.event_id] : [];
					edit_event_ui.event_occurrences = []

					for(event_occurrence in event_occurrences){

						var epoch = event_occurrences[event_occurrence];
						var epoch_data = edit_event_ui.event_data[epoch];

						if(convert_year(static_data, epoch_data.year) > dynamic_data.year){
							edit_event_ui.event_occurrences.push(event_occurrences[event_occurrence])
						}

					}

					var num = edit_event_ui.event_occurrences.length;

					edit_event_ui.event_occurrences_text.html(`This event will appear <span class='bold-text'>${num}</span> time${num > 1 ? "s" : ""} in the next ${years} year${years > 1 ? 's' : ''}.`);

					edit_event_ui.event_occurrences_list_container.removeClass('hidden');

					edit_event_ui.worker_future_calendar.terminate()
					edit_event_ui.worker_future_events.terminate()

					edit_event_ui.event_occurrences_page = 1;
					edit_event_ui.show_event_dates();

					if(edit_event_ui.new_event){

						static_data.event_data.events.splice(edit_event_ui.event_id, 1);

					}else{

						static_data.event_data.events[edit_event_ui.event_id].data = clone(edit_event_ui.backup_event_data)
						edit_event_ui.backup_event_data = {}

					}
					
					hide_loading_screen();

				}

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

				var epoch = edit_event_ui.event_occurrences[i];
				var epoch_data = edit_event_ui.event_data[epoch];

				if(epoch_data.intercalary){
					var text = `<li class='event_occurance'>${ordinal_suffix_of(epoch_data.day)} intercalary day of ${epoch_data.timespan_name}, ${epoch_data.year}</li>`
				}else{
					var text = `<li class='event_occurance'>${ordinal_suffix_of(epoch_data.day)} of ${epoch_data.timespan_name}, ${epoch_data.year}</li>`
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

		this.event_occurrences_page_number.text(`${this.event_occurrences_page} / ${Math.ceil(edit_event_ui.event_occurrences.length/10)}`)

		this.event_occurrences_button_prev.prop('disabled', this.event_occurrences_page == 1);
		this.event_occurrences_button_next.prop('disabled', i != length || i == edit_event_ui.event_occurrences.length);

		this.event_occurrences_list_col1.html(html_col1.join(''))
		this.event_occurrences_list_col2.html(html_col2.join(''))

	}

}

function cancel_event_test(){

	edit_event_ui.worker_future_calendar.terminate()
	edit_event_ui.worker_future_events.terminate()
	hide_loading_screen();

}


function check_event_chain(child, parent_id){

	if(static_data.event_data.events[parent_id].data.connected_events !== undefined && static_data.event_data.events[parent_id].data.connected_events.length > 0){

		if(static_data.event_data.events[parent_id].data.connected_events.includes(child)){

			return false;

		}else{

			for(var i = 0; i < static_data.event_data.events[parent_id].data.connected_events.length; i++){

				var id = static_data.event_data.events[parent_id].data.connected_events[i];

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

		this.event_id							= null;
		this.era_id								= null;
		this.event_condition_sortables			= [];
		this.delete_droppable					= false;

		this.event_background 					= $('#event_show_background');
		this.close_ui_btn						= show_event_ui.event_background.find('.close_ui_btn');

		this.event_wrapper						= this.event_background.find('.event-wrapper');
		this.event_name							= this.event_background.find('.event_name');
		this.event_desc							= this.event_background.find('.event_desc');
		this.event_comments						= this.event_background.find('#event_comments');
		this.event_comment_mastercontainer		= this.event_background.find('#event_comment_mastercontainer');
		this.event_comment_container			= this.event_background.find('#event_comment_container');
		this.event_comment_input				= this.event_background.find('#event_comment_input');
		this.event_save_btn						= this.event_background.find('#submit_comment');

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

		this.close_ui_btn.click(function(){
			if(show_event_ui.event_comment_input.trumbowyg('html').length > 0) {
				swal({
					title: "Cancel comment?",
					text: "You haven't posted your comment yet, are you sure you want to close this event?",
					icon: "warning",
					buttons: true,
					dangerMode: true,
				}).then((willCancel) => {
					if(willCancel) {
						show_event_ui.clear_ui();
					}
				});
			} else {
				show_event_ui.clear_ui();
			}
		});

		this.event_wrapper.mousedown(function(event){
			event.stopPropagation();
		});

		this.event_background.mousedown(function(){
			show_event_ui.clear_ui();
		});

		this.event_save_btn.click(function(){
			create_event_comment(show_event_ui.event_comment_input.trumbowyg('html'), show_event_ui.event_id, show_event_ui.add_comment);
			show_event_ui.event_comment_input.trumbowyg('empty');
		});

		$(document).on('click', '.event:not(.event-text-output)', function(){

			if($(this).hasClass('era_event')){
				var id = $(this).attr('era_id')|0;
				show_event_ui.era_id = id;
				show_event_ui.set_current_event(static_data.eras[id]);
			}else{
				var id = $(this).attr('event_id')|0;
				show_event_ui.event_id = id;
				show_event_ui.set_current_event(static_data.event_data.events[id]);
			}

		});

	},

	set_current_event: function(event){

		this.event_name.text(event.name);

		this.event_desc.html(event.description).toggleClass('hidden', event.description.length == 0);

		this.event_comments.html('').addClass('loading');

		get_event_comments(this.event_id, this.add_comments);

		this.event_background.removeClass('hidden');

	},

	add_comments: function(comments){

		show_event_ui.event_comments.removeClass('loading');

		show_event_ui.event_comments.toggleClass('empty', comments == false)

		if(comments != false){

			show_event_ui.event_comments.html('');

			for(var index in comments){

				show_event_ui.add_comment(index, comments[index]);

			}

		}else{

			show_event_ui.event_comments.html("No comments on this event yet... Maybe you'll be the first?")

		}

	},

	add_comment: function(index, comment){

		var content = [];

		content.push(`<div class='event_comment ${comment.comment_owner ? "comment_owner" : ""} ${comment.calendar_owner ? "calendar_owner" : ""}'`)
		content.push(` date='${comment.date}' comment_id='${index}'>`)
			content.push(`<p><span class='comment'>${comment.content}</span></p>`)
			content.push(`<p><span class='username'>- ${comment.username}${comment.calendar_owner ? " (owner)" : ""}</span></p>`)
			content.push(`<p><span class='date'>${comment.date}</span></p>`)
		content.push(`</div>`)

		show_event_ui.event_comments.append(content.join(''))

	},

	clear_ui: function(){

		this.event_id = -1;
		this.era_id = -1;

		this.event_name.text('');

		this.event_comment_container.addClass('hidden');

		this.event_comments.html('').addClass('loading');

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
		this.data								= null;
		this.key								= null;
		this.value								= null;
		this.trumbowyg							= this.html_edit_background.find('.html_input');

		this.trumbowyg.trumbowyg();

		edit_HTML_ui.save_btn.click(function(){
			edit_HTML_ui.save_html();
		})

		edit_HTML_ui.close_ui_btn.click(function(){
			edit_HTML_ui.clear_ui();
		});

		$(document).on('click', '.html_edit', function(){
			var data = $(this).attr('data');
			edit_HTML_ui.key = $(this).attr('index');
			edit_HTML_ui.data = get_calendar_data(data);
			edit_HTML_ui.value = clone(edit_HTML_ui.data[edit_HTML_ui.key]);
			edit_HTML_ui.set_html();
		})

	},

	set_html: function(){

		this.trumbowyg.trumbowyg('html', this.value);

		this.html_edit_background.removeClass('hidden');

	},

	save_html: function(){

		this.data[this.key] = this.trumbowyg.trumbowyg('html');

		edit_HTML_ui.key = null;
		edit_HTML_ui.data = null;
		edit_HTML_ui.value = null;

		evaluate_save_button();

		this.clear_ui();

	},

	clear_ui: function(){

		this.trumbowyg.trumbowyg('html', '');

		this.reference = null;

		this.html_edit_background.addClass('hidden');

	},
}
