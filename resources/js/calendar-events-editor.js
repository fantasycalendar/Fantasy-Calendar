const calendar_events_editor = {

	open: false,
	new_event: true,
	event_index: undefined,
	epoch_data: undefined,

	trumbowyg: undefined,

	event: {
		'name': '',
		'description': '',
		'event_category_id': -1,
		'data': {
			'has_duration': false,
			'duration': 1,
			'show_first_last': false,
			'limited_repeat': false,
			'limited_repeat_num': 1,
			'conditions': [],
			'connected_events': [],
			'date': [],
			'search_distance': 0
		},
		'settings': {
			'color': 'Dark-Solid',
			'text': 'text',
			'hide': false,
			'print': false,
			'hide_full': false
		},
	},

	has_initialized: false,

	init(){
		if(!this.has_initialized){
			$(this.$refs.description).trumbowyg();
			this.has_initialized = true;
		}
	},

	new_event: function($event) {

		this.init();
		
		this.open = true;
		this.new_event = true;
		let name = $event.detail.name ?? "New Event";

		let epoch = $event.detail.epoch;
		this.epoch_data = evaluated_static_data.epoch_data[epoch];

		this.event = {
			'name': name,
			'description': '',
			'event_category_id': -1,
			'data': {
				'has_duration': false,
				'duration': 1,
				'show_first_last': false,
				'limited_repeat': false,
				'limited_repeat_num': 1,
				'conditions': [
					['Date', '0', [this.epoch_data.year, this.epoch_data.timespan_index, this.epoch_data.day]]
				],
				'connected_events': [],
				'date': [this.epoch_data.year, this.epoch_data.timespan_index, this.epoch_data.day],
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

		if (category_id != -1) {
			var category = get_category(category_id);
			if (category !== undefined && category.id != -1) {
				this.event.event_category_id = category.id;
				this.event.settings.color = category.event_settings.color;
				this.event.settings.text = category.event_settings.text;
				this.event.settings.hide = category.event_settings.hide;
				this.event.settings.print = category.event_settings.print;
				this.event.settings.hide_full = category.event_settings.hide_full;
			}
		}

		this.event_index = Object.keys(events).length;

	},

	event_category_changed: function(){

		if (this.event.event_category_id != -1) {
			var category = get_category(this.event.event_category_id);
			if (category !== undefined && category.id != -1) {
				this.event.settings.color = category.event_settings.color;
				this.event.settings.text = category.event_settings.text;
				this.event.settings.hide = category.event_settings.hide;
				this.event.settings.print = category.event_settings.print;
				this.event.settings.hide_full = category.event_settings.hide_full;
			}
		}

	},

	edit_event: function($event) {

		this.init();
		this.open = true;
		this.new_event = false;

		this.event_index = $event.detail.event_index;
		this.event = events[this.event_index];

	},

	save_event: function() {

		events[this.event_index] = clone(this.event);

		let not_view_page = window.location.pathname.indexOf('/edit') > -1 || window.location.pathname.indexOf('/calendars/create') > -1;

		if (not_view_page) {
			if (this.new_event) {
				add_event_to_sortable(events_sortable, this.event_index, events[this.event_index]);
			} else {
				$(`.events_input[index="${this.event_index}"]`).find(".event_name").text(`Edit - ${this.event.name}`);
			}

			this.submit_event_callback(true);

		} else {
			if (this.new_event) {
				submit_new_event(this.event_index, this.submit_event_callback);
			} else {
				submit_edit_event(this.event_index, this.submit_event_callback);
			}
		}

		this.close();

	},

	submit_event_callback: function(success){

		if (success) {

			eval_apply_changes(function() {
				rebuild_events();
			});

		}

	},

	close: function(){

		this.open = false;

		this.event = {
			'name': '',
			'description': '',
			'event_category_id': -1,
			'data': {
				'has_duration': false,
				'duration': 1,
				'show_first_last': false,
				'limited_repeat': false,
				'limited_repeat_num': 1,
				'conditions': [],
				'connected_events': [],
				'date': [],
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

	},

}

module.exports = calendar_events_editor;