function display_events(static_data, event_data){

	if(owner || !static_data.settings.hide_events){

		var num_valid_events = Object.keys(event_data.valid).length;
				
		for(var i = 0; i < num_valid_events; i++){

			var event_index = Object.keys(event_data.valid)[i];
			var current_event = static_data.event_data.events[event_index];

			$(`[event_id='${event_index}']`).remove();

			for(var epoch_index = 0; event_data.valid[event_index] && epoch_index < event_data.valid[event_index].length; epoch_index++){

				var local_epoch = event_data.valid[event_index][epoch_index];

				var start = event_data.starts[event_index].indexOf(local_epoch) != -1;
				var end = event_data.ends[event_index].indexOf(local_epoch) != -1;

				var category_name = current_event.category != -1 ? static_data.event_data.categories[current_event.category].name : "";

				var event_group = current_event.settings.color ? " " + current_event.settings.color : "";
				event_group += current_event.settings.text ? " " + current_event.settings.text : "";

				var html = `<div class='event ${(event_group + (start ? " event_start" : (end ? " event_end" : "")))}' event_id='${event_index}' category='${category_name}'>${((start ? "Start: " : (end ? "End: " : "")) + current_event.name)}</div>`;

				var parent = $(`.timespan_day[epoch='${local_epoch}'] .event_container`);

				parent.append(html);

			}
		}
	}
}

function insert_moons(data){

	var moon_text = '<div class="calendar_moon_container">';

	if(owner || !static_data.settings.hide_moons){

		for(moon_index = 0; moon_index < static_data.moons.length; moon_index++){

			var moon = static_data.moons[moon_index];

			if(owner || !moon.hidden){

				var name_array = moon_phases[moon.granularity];

				moon_text += "<div class='moon_container'>";
					moon_text += `<div title='${moon.name}, ${name_array[data.moon_phase[moon_index]]}' class='calendar_moon lunar gran-${moon.granularity} phase-${data.moon_phase[moon_index]}'></div>`;
					moon_text += `<div class='lunar_background' moon_id='${moon_index}'></div>`;
				moon_text += "</div>";

			}

		}

	}

	moon_text += "</div>";

	return moon_text;
}


function update_moon_colors(){
	moon_colors = [];
	var html = [];

	if($('#global_moon_colors').length == 0){
		html.push("<style type='text/css' id='global_moon_colors'>");
	}

	for(var index = 0; index < static_data.moons.length; index++){

		color = static_data.moons[index].color ? static_data.moons[index].color : '#ffffff';
		html.push(`.lunar_background[moon_id='${index}']{ background-color:${color}; }\n`);

	}

	if($('#global_moon_colors').length == 0){
		html.push("</style>");
		$(html.join('')).appendTo('head');
	}else{
		$('#global_moon_colors').empty().append(html.join(''));
	}
}

var eras = {

	current_eras: [],

	internal_class: '',

	prev_era: -1,
	current_era: 0,
	next_era: 1,

	start_epoch: 0,
	end_epoch: 0,

	era: undefined,

	evaluate_current_era: function(static_data, start_epoch, end_epoch){

		if(static_data.eras.length > 0){

			this.current_eras = [];
			this.internal_class = '';
			this.prev_era = -1;
			this.current_era = 0;
			this.next_era = 1;
			this.start_epoch = start_epoch;
			this.end_epoch = end_epoch;
			this.era = undefined;

			for(var i = 0; i < static_data.eras.length; i++){
				static_data.eras[i].date.epoch = evaluate_calendar_start(static_data, static_data.eras[i].date.year-1, static_data.eras[i].date.timespan, static_data.eras[i].date.day).epoch;
			}

			// If the last era shift was behind us, then it is the last era
			if(this.start_epoch > static_data.eras[static_data.eras.length-1].date.epoch){
				this.current_eras.push({
					"id": static_data.eras.length-1,
					"position": 0,
					"data": static_data.eras[static_data.eras.length-1]
				});
			// Otherwise, this finds the current overlapping eras with the displayed days
			}else{

				for(var i = 0; i < static_data.eras.length; i++){

					var current_era = static_data.eras[i];

					if(current_era.date.epoch >= this.start_epoch && current_era.date.epoch <= this.end_epoch){
						this.current_eras.push({
							"id": i,
							"position": 0,
							"data": current_era
						});
					}
				}

				if(this.current_eras.length == 0){

					for(var i = 0; i < static_data.eras.length-1; i++){

						var current_era = static_data.eras[i];
						var next_era = static_data.eras[i+1];

						if(this.start_epoch > current_era.date.epoch && next_era.date.epoch > this.end_epoch){
							this.current_eras.push({
								"id": i,
								"position": 0,
								"data": current_era
							});
						}
					}
				// If there are eras, and the first era is after the starting epoch
				// that means that we need to add the previous era too
				}else{

					if(this.current_eras[0].data.date.epoch > this.start_epoch){
						if(static_data.eras[this.current_eras[0].id-1]){
							this.current_eras.splice(0, 0, {
								"id": this.current_eras[0].id-1,
								"position": 0,
								"data": static_data.eras[this.current_eras[0].id-1]
							});
						}
					}
				}
			}
		}
	},

	// This simply sets the new era
	set_current_era: function(index){

		if(static_data.eras.length > 0){
			// If it's not a new era, don't update the text
			if(this.era != index){
				this.era = index;
				if(owner || !static_data.settings.hide_eras){
					this.internal_class = document.getElementsByClassName('era')[0];
					var text = static_data.settings.show_era_abbreviation ? this.current_eras[this.era].data.abbreviation : this.current_eras[this.era].data.name;
					this.internal_class.innerHTML = " - " + text;
				}
			}
		}
	},

	// This just sets up the starting era, in case the user refreshed and isn't at the top of the page
	set_up_position: function(){

		if(static_data.eras.length > 0){

			for(var i = 0; i < eras.current_eras.length; i++){
				if($(`[epoch=${eras.current_eras[i].data.date.epoch}]`).length){
					eras.current_eras[i].position = $(`[epoch=${eras.current_eras[i].data.date.epoch}]`).offset().top - 175;
				}
			}

			if(this.current_eras.length > 1){
				var position = $(window).scrollTop();
				for(var i = 0; i < this.current_eras.length; i++){
					var current_era = this.current_eras[i];
					if(position > current_era.position && i < this.current_eras.length-1){
						this.prev_era++;
						this.current_era++;
						this.next_era++;
					}
				}
			}else{
				this.current_era = 0;
			}
			eras.set_current_era(this.current_era);
		}
		
	},

	// This is evaluated every time the user scrolls to calculate the next era
	evaluate_position: function(){

		if(static_data.eras.length > 0){

			// If there's only one era, don't do anything
			if(this.current_eras.length <= 1) return;

			var position = $("#static_data").scrollTop();

			if(this.next_era < this.current_eras.length){
				if(position > this.current_eras[this.next_era].position){
					this.prev_era++;
					this.current_era++;
					this.next_era++;
				}
			}
			if(position < this.current_eras[this.current_era].position){
				this.next_era--;
				this.current_era--;
				this.prev_era--;
			}

			eras.set_current_era(this.current_era);

		}

	},


	display_era_events: function(static_data){

		if(static_data.eras.length > 0){

			var num_eras = Object.keys(static_data.eras).length;
					
			for(var era_index = 0; era_index < num_eras; era_index++){

				var current_era = static_data.eras[era_index];

				var parent = $(`.timespan_day[epoch='${current_era.date.epoch}'] .event_container`);

				if(parent !== undefined){

					var event_group = '';
					var category = '';

					if(current_era.settings.event_category != -1){
						var category = static_data.event_data.categories[current_era.settings.event_category];
						event_group = category.color ? " " + category.color : "";
						event_group += category.text ? " " + category.text : "";
					}

					var html = `<div class='event era_event ${event_group}' era_id='${era_index}' category='${category.name}'>${ current_era.name}</div>`;

					parent.append(html);
					
				}
			}
		}
	},

}

function weather_overlay(data, show){

	if(show){

		weather_element = $('#weather_overlay');

		weather_date_text = `The ${ordinal_suffix_of((data.day|0))} of ${data.timespan_name}`;

	}

}

function update_current_day(recalculate){

	$('.current_day').removeClass('current_day');

	if(recalculate){
		dynamic_data.internal_year = dynamic_data.year > 0 ? dynamic_data.year - 1 : dynamic_data.year;
		dynamic_data.epoch = evaluate_calendar_start(static_data, dynamic_data.internal_year, dynamic_data.timespan, dynamic_data.day).epoch;
	}

	$(`[epoch=${dynamic_data.epoch}]`).addClass('current_day');
	eval_current_time();

}

var calendar_layouts = {

	append_layout: function(){
		var div = document.getElementById('calendar');
		div.innerHTML = calendar_layouts.html.join("");
		calendar_layouts.html = [];
		update_moon_colors();
	},

	html: [],

	timespan: {},

	timespans: {},

	epoch_data: {},

	year_data: {},

	add_year_day_number: function(){
		if(static_data.settings.add_year_day_number){
			$('body').removeClass("hide_year_day");
		}else{
			$('body').addClass("hide_year_day");
		}
	},

	add_month_number: function(){
		if(static_data.settings.add_month_number){
			$('body').removeClass("hide_timespan_number");
		}else{
			$('body').addClass("hide_timespan_number");
		}
	},

	insert_empty_calendar: function(data){

		this.year_data = data.year_data;

		this.epoch_data = data.epoch_data;
		this.timespans = data.timespans;
		this.layout = calendar_layouts[static_data.settings.layout];
	
		this.layout.insert_year_follower();

		this.append_layout();

	},

	insert_calendar: function(data){

		var div = document.getElementById('calendar');
		div.innerHTML = "";

		this.year_data = data.year_data;
		this.epoch_data = data.epoch_data;
		this.timespans = data.timespans;
		this.layout = calendar_layouts[static_data.settings.layout];

		if(!this.year_data.has_weather){
			var style = document.createElement('style');
			style.innerHTML =
				'.weather_icon {' +
					'display: none;' +
				'}';

			// Get the first script tag
			var ref = document.querySelector('script');

			// Insert our new styles before the first script tag
			ref.parentNode.insertBefore(style, ref);
		}

		for(var i = 0; i < Object.keys(this.timespans).length; i++){

			var timespan_index = Object.keys(this.timespans)[i]

			if(static_data.settings.only_reveal_today && !owner && timespan_index > dynamic_data.timespan){

				continue;

			}

			var timespan = this.timespans[timespan_index];

			this.layout.insert_timespan(timespan);

			filtered_leap_days_afterend = timespan.leap_days.filter(function(elem){
				return elem.intercalary && elem.day === timespan.length;
			});

			this.layout.insert_intercalary_day(timespan, filtered_leap_days_afterend, timespan.length, false);

		}
	
		this.layout.insert_year_follower();

		this.append_layout();

		this.add_year_day_number();

		this.add_month_number();

	},

	grid: {

		insert_year_follower: function(){

			var html = [];
			html.push(`<div class='year'>Year ${calendar_layouts.year_data.era_year}`);
			html.push("<span class='era'></span></div>");
			html.push(`<div class='cycle'>${get_cycle(calendar_layouts.year_data.year).text}</div>`);

			$('#top_follower_content').html(html.join('')).removeClass().addClass('grid');

		},

		insert_day: function(epoch, weather_align, day_num, day_class, title){

			if(static_data.settings.only_reveal_today && !owner && (calendar_layouts.year_data.year > dynamic_data.year || this.timespan.index > dynamic_data.timespan || (this.timespan.index == dynamic_data.timespan && this.timespan.day > dynamic_data.day))){

				this.insert_empty_day(day_class);

			}else{

				calendar_layouts.html.push(`<div class='${day_class}' epoch='${epoch}'>`);

					calendar_layouts.html.push("<div class='day_row'>");
						calendar_layouts.html.push("<div class='toprow left'>");
							calendar_layouts.html.push(`<div class='number'>${day_num}</div>`);
						calendar_layouts.html.push("</div>");
						calendar_layouts.html.push("<div class='toprow center'>");
						if(calendar_layouts.epoch_data[epoch].weather){
							calendar_layouts.html.push(`<div class='weather_icon' align='${weather_align}'></div>`);
						}
						calendar_layouts.html.push("</div>");
						calendar_layouts.html.push("<div class='toprow right'>");
							calendar_layouts.html.push("<div class='btn_create_event btn btn-success'>+</div>");
						calendar_layouts.html.push("</div>");
					calendar_layouts.html.push("</div>");
					if(title){
						calendar_layouts.html.push("<div class='day_row'>");
							calendar_layouts.html.push(`<div class='title'>${title}</div>`);
						calendar_layouts.html.push("</div>");
					}
					calendar_layouts.html.push("<div class='day_row'>");
						calendar_layouts.html.push(insert_moons(calendar_layouts.epoch_data[epoch]));
					calendar_layouts.html.push("</div>");
					calendar_layouts.html.push("<div class='day_row'>");
						calendar_layouts.html.push("<div class='event_container'></div>");
					calendar_layouts.html.push("</div>");
					calendar_layouts.html.push("<div class='day_row year_day_number_parent'>");
						calendar_layouts.html.push(`<div class='year_day_number'>${calendar_layouts.year_data.year_day}</div>`);
					calendar_layouts.html.push("</div>");
				calendar_layouts.html.push("</div>");

			}

		},

		insert_empty_day: function(day_class){
			calendar_layouts.html.push(`<div class='empty_timespan_day ${day_class}'>`);
			calendar_layouts.html.push("</div>");
		},

		insert_timespan: function(timespan){

			this.timespan = timespan;

			this.timespan.day = 1;

			if(timespan.type === 'month'){

				filtered_leap_days_beforestart = timespan.leap_days.filter(function(features){
					return features.intercalary && features.day === 0;
				});

				filtered_era_beforestart = static_data.eras.filter(function(era){
					return era.year === dynamic_data.internal_year && era.timespan === timespan.index && era.day === 0;
				});

				this.insert_intercalary_day(timespan, filtered_leap_days_beforestart, timespan.length, true);

				calendar_layouts.html.push("<div class='timespan_container grid'>");

				calendar_layouts.html.push("<div class='timespan_name'>");
					calendar_layouts.html.push(timespan.name);
					calendar_layouts.html.push("<span class='timespan_number'>");
						calendar_layouts.html.push(` - Month ${timespan.index+1}`);
					calendar_layouts.html.push("</span>");
				calendar_layouts.html.push("</div>");

				calendar_layouts.html.push("<div class='timespan_row_container'>");

					calendar_layouts.html.push("<div class='timespan_row_names'>");

					for(day_in_week = 1; day_in_week <= timespan.week.length; day_in_week++){

						calendar_layouts.html.push("<div class='week_day_name'>");
						calendar_layouts.html.push(timespan.week[day_in_week-1]);
						calendar_layouts.html.push("</div>");

					}

					calendar_layouts.html.push("</div>");

					calendar_layouts.html.push("<div class='timespan_row'>");

						if(static_data.year_data.overflow){
							this.get_overflow(true, calendar_layouts.year_data.week_day-1);
						}else{
							calendar_layouts.year_data.week_day = 1;
						}

						for(timespan_day = 1; timespan_day <= timespan.length; timespan_day++, calendar_layouts.year_data.year_day++, calendar_layouts.year_data.epoch++, this.timespan.day++){

							var weather_align = "";
							if(calendar_layouts.year_data.week_day == 1){
								weather_align = "start";
							}
							if(calendar_layouts.year_data.week_day == timespan.week.length){
								weather_align = "end";
							}
							
							this.insert_day(calendar_layouts.year_data.epoch, weather_align, timespan_day, "timespan_day");

							filtered_features = timespan.leap_days.filter(function(features){
								return features.intercalary && features.day === timespan_day && timespan.length != features.day;
							});

							filtered_era = static_data.eras.filter(function(era){
								return era.year === dynamic_data.internal_year &&
								era.timespan === timespan.index &&
								era.day === timespan_day &&
								era.day != timespan.length;
							});

							if(calendar_layouts.year_data.week_day >= timespan.week.length){
								calendar_layouts.html.push("</div>");
								calendar_layouts.year_data.week_day = 1;
								if(timespan_day != timespan.length){
									calendar_layouts.html.push("<div class='timespan_row'>");
								}
							}else{
								calendar_layouts.year_data.week_day++;
							}

							this.insert_intercalary_day(timespan, filtered_features, timespan.length, true);

						}

						this.get_overflow(false, (timespan.week.length-calendar_layouts.year_data.week_day+1)%timespan.week.length);

					calendar_layouts.html.push("</div>");

				calendar_layouts.html.push("</div>");
				calendar_layouts.html.push("</div>");

			}else if(timespan.type === 'intercalary'){

				return_week_day = 0;

				calendar_layouts.html.push("<div class='timespan_container grid'>");

					calendar_layouts.html.push("<div class='timespan_name'>");
						calendar_layouts.html.push(timespan.name + (static_data.settings.add_month_number ? " - Month " + (timespan.index+1) : ""));
					calendar_layouts.html.push("</div>");

					calendar_layouts.html.push("<div class='timespan_row_container'>");

						calendar_layouts.html.push("<div class='timespan_row'>");
							
							intercalary_week_day = 1;

							for(intercalary_day = 1; intercalary_day <= timespan.length; intercalary_day++, calendar_layouts.year_data.year_day++, calendar_layouts.year_data.epoch++, this.timespan.day++){

								var weather_align = "";
								if(intercalary_week_day == 1){
									weather_align = "start";
								}
								if(intercalary_week_day == timespan.week.length){
									weather_align = "end";
								}

								this.insert_day(calendar_layouts.year_data.epoch, weather_align, '', "timespan_day timespan_intercalary");

								if(intercalary_week_day <= timespan.week.length){
									intercalary_week_day++;
								}else if(intercalary_week_day > timespan.week.length){
									calendar_layouts.html.push("</div>");
									if(intercalary_day != timespan.length){
										calendar_layouts.html.push("<div class='timespan_row intercalary'>");
									}
									intercalary_week_day = 1;
								}

							}

							this.get_overflow(false, intercalary_week_day+1, "intercalary");

					calendar_layouts.html.push("</div>");

				calendar_layouts.html.push("</div>");

				calendar_layouts.html.push("</div>");
			
			}

		},

		insert_intercalary_day: function(timespan, filtered_features, length, add_subt){

			if(filtered_features.length > 0){

				calendar_layouts.year_data.epoch += add_subt ? 1 : 0;
				this.timespan.day += add_subt ? 1 : 0;

				if(!(filtered_features[0].day === 0) && !(filtered_features[0].day === length)){

					this.get_overflow(false, (timespan.week.length-calendar_layouts.year_data.week_day+1)%timespan.week.length);
					
					calendar_layouts.html.push("</div>");
					calendar_layouts.html.push("</div>");
					calendar_layouts.html.push("</div>");

				}

				calendar_layouts.html.push("<div class='timespan_container grid'>");

				calendar_layouts.html.push("<div class='timespan_row_container intercalary'>");

				calendar_layouts.html.push("<div class='timespan_row'>");

				intercalary_week = 1;

				for(index = 0; index < filtered_features.length; index++, calendar_layouts.year_data.year_day++, calendar_layouts.year_data.epoch++, this.timespan.day++){

					feature = filtered_features[index];

					var weather_align = "";
					if(intercalary_week == 1){
						weather_align = "start";
					}
					if(intercalary_week == timespan.week.length){
						weather_align = "end";
					}
					this.insert_day(calendar_layouts.year_data.epoch, weather_align, '', "timespan_day timespan_intercalary", feature.name);

					if(intercalary_week == timespan.week.length){
						calendar_layouts.html.push("</div>");
						calendar_layouts.html.push("<div class='timespan_row intercalary'>");
						intercalary_week = 1;
					}else{
						intercalary_week++;
					}
					
				}

				this.get_overflow(false, (timespan.week.length-intercalary_week+1) % timespan.week.length, "intercalary");

				calendar_layouts.html.push("</div>");

				calendar_layouts.html.push("</div>");

				calendar_layouts.html.push("</div>");

				if(!(filtered_features[0].day === 0) && !(filtered_features[0].day === length)){

					calendar_layouts.html.push("<div class='timespan_container grid'>");
					calendar_layouts.html.push("<div class='timespan_name'>");
						calendar_layouts.html.push(timespan.name + (static_data.settings.add_month_number ? " - Month " + (timespan.index+1) : ""));
					calendar_layouts.html.push("</div>");
					calendar_layouts.html.push("<div class='timespan_row_container'>");
					calendar_layouts.html.push("<div class='timespan_row_names'>");

					for(day_in_week = 1; day_in_week <= timespan.week.length; day_in_week++){

						calendar_layouts.html.push("<div class='week_day_name'>");
						calendar_layouts.html.push(timespan.week[day_in_week-1]);
						calendar_layouts.html.push("</div>");

					}

					calendar_layouts.html.push("</div>");
					calendar_layouts.html.push("<div class='timespan_row'>");
					this.get_overflow(true, calendar_layouts.year_data.week_day-1);

				}

				calendar_layouts.year_data.epoch -= add_subt ? 1 : 0;
				this.timespan.day -= add_subt ? 1 : 0;
			}
		},

		get_overflow: function(start, num, features_class){

			features_class = features_class ? ' ' + features_class : '';

			for(current = 0; current < num; current++){

				calendar_layouts.html.push(`<div class='timespan_overflow ${features_class}`);

				if(start && current === 0){
					calendar_layouts.html.push(" first");
				}

				if(!start && current == 0){
					calendar_layouts.html.push(" firstlast");
				}

				if(!start && current === num-1){
					calendar_layouts.html.push(" last");
				}

				calendar_layouts.html.push("'></div>");

			}
		}
	},

	wide: {

		insert_year_follower: function(){

			var html = [];
				
			html.push(`<div class='year'>Year ${calendar_layouts.year_data.era_year}`);
			html.push("<span class='era'></span></div>");
			html.push(`<div class='cycle'>${get_cycle(calendar_layouts.year_data.year).text}</div>`);

			$('#top_follower_content').html(html.join('')).removeClass().addClass('wide');

		},

		insert_day: function(epoch, weather_align, day_num, day_class, title){

			if(static_data.settings.only_reveal_today && !owner && (calendar_layouts.year_data.year > dynamic_data.year || this.timespan.index > dynamic_data.timespan || (this.timespan.index == dynamic_data.timespan && this.timespan.day > dynamic_data.day))){

				this.insert_empty_day(day_class);

			}else{



				calendar_layouts.html.push(`<div class='${day_class}' epoch='${epoch}'>`);

					calendar_layouts.html.push("<div class='day_row'>");
						calendar_layouts.html.push("<div class='toprow left'>");
							calendar_layouts.html.push(`<div class='number'>${day_num}</div>`);
						calendar_layouts.html.push("</div>");
						calendar_layouts.html.push("<div class='toprow center'>");
						if(calendar_layouts.epoch_data[epoch].weather){
							calendar_layouts.html.push(`<div class='weather_icon' align='${weather_align}'></div>`);
						}
						calendar_layouts.html.push("</div>");
						calendar_layouts.html.push("<div class='toprow right'>");
							calendar_layouts.html.push("<div class='btn_create_event btn btn-success'>+</div>");
						calendar_layouts.html.push("</div>");
					calendar_layouts.html.push("</div>");
					if(title){
						calendar_layouts.html.push("<div class='day_row'>");
							calendar_layouts.html.push(`<div class='title'>${title}</div>`);
						calendar_layouts.html.push("</div>");
					}
					calendar_layouts.html.push("<div class='day_row'>");
						calendar_layouts.html.push(insert_moons(calendar_layouts.epoch_data[epoch]));
					calendar_layouts.html.push("</div>");
					calendar_layouts.html.push("<div class='day_row'>");
						calendar_layouts.html.push("<div class='event_container'></div>");
					calendar_layouts.html.push("</div>");
					calendar_layouts.html.push("<div class='day_row year_day_number_parent'>");
						calendar_layouts.html.push(`<div class='year_day_number'>${calendar_layouts.year_data.year_day}</div>`);
					calendar_layouts.html.push("</div>");
				calendar_layouts.html.push("</div>");
				/*
				calendar_layouts.html.push(`<div class='${day_class}' epoch='${epoch}'>`);

					calendar_layouts.html.push("<div class='day_row'>");
						calendar_layouts.html.push("<div class='toprow left'>");
							calendar_layouts.html.push(`<div class='number'>${day_num}</div>`);
						calendar_layouts.html.push("</div>");
						calendar_layouts.html.push("<div class='toprow center'>");
							calendar_layouts.html.push("<div class='weather_icon'></div>");
						calendar_layouts.html.push("</div>");
						calendar_layouts.html.push("<div class='toprow right'>");
							calendar_layouts.html.push("<div class='btn_create_event btn btn-success'>+</div>");
						calendar_layouts.html.push("</div>");
					calendar_layouts.html.push("</div>");
					if(title){
						calendar_layouts.html.push("<div class='day_row'>");
							calendar_layouts.html.push(`<div class='title'>${title}</div>`);
						calendar_layouts.html.push("</div>");
					}
					calendar_layouts.html.push("<div class='day_row'>");
						calendar_layouts.html.push(insert_moons(calendar_layouts.epoch_data[epoch]));
					calendar_layouts.html.push("</div>");
					calendar_layouts.html.push("<div class='day_row'>");
						calendar_layouts.html.push("<div class='event_container'></div>");
					calendar_layouts.html.push("</div>");
					calendar_layouts.html.push("<div class='day_row year_day_number'>");
						calendar_layouts.html.push(calendar_layouts.year_data.year_day);
					calendar_layouts.html.push("</div>");
				calendar_layouts.html.push("</div>");*/

			}
		},

		insert_empty_day: function(day_class){
			calendar_layouts.html.push(`<div class='empty_timespan_day ${day_class}'>`);
			calendar_layouts.html.push("</div>");
		},

		insert_timespan: function(timespan){

			this.timespan = timespan;

			this.timespan.day = 1;

			if(timespan.type === 'month'){

				filtered_leap_days_beforestart = timespan.leap_days.filter(function(features){
					return features.intercalary && features.day === 0;
				});

				filtered_era_beforestart = static_data.eras.filter(function(era){
					return era.year === dynamic_data.internal_year && era.timespan === timespan.index && era.day === 0;
				});

				this.insert_intercalary_day(timespan, filtered_leap_days_beforestart, timespan.length, true);

				calendar_layouts.html.push("<div class='timespan_container wide' onscroll='sidescroll()'>");

				calendar_layouts.html.push("<div class='timespan_name'>");
					calendar_layouts.html.push(timespan.name + (static_data.settings.add_month_number ? " - Month " + (timespan.index+1) : ""));
				calendar_layouts.html.push("</div>");


				calendar_layouts.html.push("<div class='timespan_row_container'>");

					calendar_layouts.html.push("<div class='timespan_row_names'>");

					for(day_in_week = 1; day_in_week <= timespan.week.length; day_in_week++){

						calendar_layouts.html.push("<div class='week_day_name'>");
						calendar_layouts.html.push(timespan.week[day_in_week-1]);
						calendar_layouts.html.push("</div>");

					}

					calendar_layouts.html.push("</div>");

					calendar_layouts.html.push("<div class='timespan_row'>");

						if(static_data.year_data.overflow){
							this.get_overflow(true, calendar_layouts.year_data.week_day-1);
						}else{
							calendar_layouts.year_data.week_day = 1;
						}

						for(timespan_day = 1; timespan_day <= timespan.length; timespan_day++, calendar_layouts.year_data.year_day++, calendar_layouts.year_data.epoch++, this.timespan.day++){

							var weather_align = "";
							if(calendar_layouts.year_data.week_day == 1){
								weather_align = "start";
							}
							if(calendar_layouts.year_data.week_day == timespan.week.length){
								weather_align = "end";
							}

							this.insert_day(calendar_layouts.year_data.epoch, weather_align, timespan_day, "timespan_day");

							filtered_features = timespan.leap_days.filter(function(features){
								return features.intercalary && features.day === timespan_day && timespan.length != features.day;
							});

							filtered_era = static_data.eras.filter(function(era){
								return era.year === dynamic_data.internal_year &&
								era.timespan === timespan.index &&
								era.day === timespan_day &&
								era.day != timespan.length;
							});

							if(calendar_layouts.year_data.week_day >= timespan.week.length){
								calendar_layouts.html.push("</div>");
								calendar_layouts.year_data.week_day = 1;
								if(timespan_day != timespan.length){
									calendar_layouts.html.push("<div class='timespan_row'>");
								}
							}else{
								calendar_layouts.year_data.week_day++;
							}

							this.insert_intercalary_day(timespan, filtered_features, timespan.length, true);

						}

						this.get_overflow(false, (timespan.week.length-calendar_layouts.year_data.week_day+1)%timespan.week.length);

					calendar_layouts.html.push("</div>");

				calendar_layouts.html.push("</div>");
				calendar_layouts.html.push("</div>");

			}else if(timespan.type === 'intercalary'){

				return_week_day = 0;

				calendar_layouts.html.push("<div class='timespan_container wide' onscroll='sidescroll()'>");

					calendar_layouts.html.push("<div class='timespan_name'>");
						calendar_layouts.html.push(timespan.name + (static_data.settings.add_month_number ? " - Month " + (timespan.index+1) : ""));
					calendar_layouts.html.push("</div>");

					calendar_layouts.html.push("<div class='timespan_row_container'>");

						calendar_layouts.html.push("<div class='timespan_row'>");
							
							intercalary_week_day = 1;

							for(intercalary_day = 1; intercalary_day <= timespan.length; intercalary_day++, calendar_layouts.year_data.year_day++, calendar_layouts.year_data.epoch++, this.timespan.day++){

								var weather_align = "";
								if(intercalary_week_day == 1){
									weather_align = "start";
								}
								if(intercalary_week_day == timespan.week.length){
									weather_align = "end";
								}

								this.insert_day(calendar_layouts.year_data.epoch, weather_align, '', "timespan_day timespan_intercalary");

								if(intercalary_week_day <= timespan.week.length){
									intercalary_week_day++;
								}else if(intercalary_week_day > timespan.week.length){
									calendar_layouts.html.push("</div>");
									if(intercalary_day != timespan.length){
										calendar_layouts.html.push("<div class='timespan_row intercalary'>");
									}
									intercalary_week_day = 1;
								}

							}

							this.get_overflow(false, intercalary_week_day+1, "intercalary");

					calendar_layouts.html.push("</div>");

				calendar_layouts.html.push("</div>");

				calendar_layouts.html.push("</div>");
			
			}

		},

		insert_intercalary_day: function(timespan, filtered_features, length, add_subt){

			if(filtered_features.length > 0){

				calendar_layouts.year_data.epoch += add_subt ? 1 : 0;

				if(!(filtered_features[0].day === 0) && !(filtered_features[0].day === length)){

					this.get_overflow(false, (timespan.week.length-calendar_layouts.year_data.week_day+1)%timespan.week.length);
					
					calendar_layouts.html.push("</div>");
					calendar_layouts.html.push("</div>");
					calendar_layouts.html.push("</div>");

				}

				calendar_layouts.html.push("<div class='timespan_container wide'>");

				calendar_layouts.html.push("<div class='timespan_row_container intercalary'>");

				calendar_layouts.html.push("<div class='timespan_row'>");

				intercalary_week = 1;

				for(index = 0; index < filtered_features.length; index++, calendar_layouts.year_data.year_day++, calendar_layouts.year_data.epoch++){

					feature = filtered_features[index];

					var weather_align = "";
					if(intercalary_week == 1){
						weather_align = "start";
					}
					if(intercalary_week == timespan.week.length){
						weather_align = "end";
					}

					this.insert_day(calendar_layouts.year_data.epoch, weather_align, '', "timespan_day timespan_intercalary", feature.name);

					if(intercalary_week == timespan.week.length){
						calendar_layouts.html.push("</div>");
						calendar_layouts.html.push("<div class='timespan_row intercalary'>");
						intercalary_week = 1;
					}else{
						intercalary_week++;
					}
					
				}

				this.get_overflow(false, (timespan.week.length-intercalary_week+1) % timespan.week.length, "intercalary");

				calendar_layouts.html.push("</div>");

				calendar_layouts.html.push("</div>");

				calendar_layouts.html.push("</div>");

				if(!(filtered_features[0].day === 0) && !(filtered_features[0].day === length)){

					calendar_layouts.html.push("<div class='timespan_container wide'>");
					calendar_layouts.html.push("<div class='timespan_name'>");
						calendar_layouts.html.push(timespan.name + (static_data.settings.add_month_number ? " - Month " + (timespan.index+1) : ""));
					calendar_layouts.html.push("</div>");
					calendar_layouts.html.push("<div class='timespan_row_container'>");
					calendar_layouts.html.push("<div class='timespan_row_names'>");

					for(day_in_week = 1; day_in_week <= timespan.week.length; day_in_week++){

						calendar_layouts.html.push("<div class='week_day_name'>");
						calendar_layouts.html.push(timespan.week[day_in_week-1]);
						calendar_layouts.html.push("</div>");

					}

					calendar_layouts.html.push("</div>");
					calendar_layouts.html.push("<div class='timespan_row'>");
					this.get_overflow(true, calendar_layouts.year_data.week_day-1);

				}

				calendar_layouts.year_data.epoch -= add_subt ? 1 : 0;
			}
		},

		get_overflow: function(start, num, features_class){

			features_class = features_class ? ' ' + features_class : '';

			for(current = 0; current < num; current++){

				calendar_layouts.html.push("<div class='timespan_overflow" + features_class);

				if(start && current === 0){
					calendar_layouts.html.push(" first");
				}

				if(!start && current == 0){
					calendar_layouts.html.push(" firstlast");
				}

				if(!start && current === num-1){
					calendar_layouts.html.push(" last");
				}

				calendar_layouts.html.push("'></div>");

			}
		}
	},

	vertical: {

		insert_year_follower: function(){

			var html = [];
				
			html.push(`<div class='year'>Year ${calendar_layouts.year_data.era_year}`);
			html.push("<span class='era'></span></div>");
			html.push(`<div class='cycle'>${get_cycle(calendar_layouts.year_data.year).text}</div>`);

			$('#top_follower_content').html(html.join('')).removeClass().addClass('vertical');

		},

		insert_day: function(epoch, day_num, day_class, title, intercalary){

			calendar_layouts.html.push(`<div class='${day_class}' epoch='${epoch}'>`);

				calendar_layouts.html.push("<div class='day_row'>");
					calendar_layouts.html.push("<div class='toprow left'>");
						if(intercalary){
							calendar_layouts.html.push("<div class='weekday'>");
							calendar_layouts.html.push(title);
						}else{
							calendar_layouts.html.push(`<div class='number'>${timespan_day}</div>`);
							calendar_layouts.html.push("<div class='weekday'>");
							calendar_layouts.html.push(this.timespan.week[calendar_layouts.year_data.week_day-1]);
						}
						calendar_layouts.html.push("</div>");
					calendar_layouts.html.push("</div>");
					calendar_layouts.html.push("<div class='toprow center'>");
						calendar_layouts.html.push("<div class='weather_icon'></div>");
					calendar_layouts.html.push("</div>");
					calendar_layouts.html.push("<div class='toprow right'>");
						calendar_layouts.html.push("<div class='btn_create_event btn btn-success'>+</div>");
					calendar_layouts.html.push("</div>");
				calendar_layouts.html.push("</div>");

				/*calendar_layouts.html.push("<div class='day_row weather'>");

					weather = calendar_layouts.epoch_data[epoch].weather;

					temp = "";
					switch(static_data.climate.global_settings.temp_sys){
						case "metric":
							temp = weather.temperature_m+"°C";
							break

						case "imperial":
							temp = weather.temperature_i+"°F";
							break

						case "cinematic":
							temp = weather.temperature_c;
							break
					}

					wind = weather.wind_speed_desc + " (${weather.wind_direction})";

					if(weather.wind_velocity_m !== undefined && weather.wind_velocity_i !== undefined){
						wind += " (";
						switch(static_data.climate.global_settings.wind_sys){
							case "metric":
								wind += weather.wind_velocity_m+" KPH";
								break

							case "imperial":
								wind += weather.wind_velocity_i+" MPH";
								break
						}
						wind += ")";
					}

					calendar_layouts.html.push(temp + " | ${weather.precipitation} | ${weather.clouds} | " + wind);

				calendar_layouts.html.push("</div>");*/

				calendar_layouts.html.push("<div class='day_row'>");
					calendar_layouts.html.push(insert_moons(calendar_layouts.epoch_data[epoch]));
				calendar_layouts.html.push("</div>");


				calendar_layouts.html.push("<div class='day_row year_day_number'>");
					calendar_layouts.html.push(calendar_layouts.year_data.year_day);
				calendar_layouts.html.push("</div>");

				calendar_layouts.html.push("<div class='day_row'>");
					calendar_layouts.html.push("<div class='event_container'></div>");
				calendar_layouts.html.push("</div>");

			calendar_layouts.html.push("</div>");
		},

		insert_timespan: function(timespan){

			this.timespan = timespan;

			if(timespan.type === 'month'){

				filtered_leap_days_beforestart = timespan.leap_days.filter(function(features){
					return features.intercalary && features.day === 0;
				});

				filtered_era_beforestart = static_data.eras.filter(function(era){
					return era.year === dynamic_data.internal_year && era.timespan === timespan.index && era.day === 0;
				});

				this.insert_intercalary_day(timespan, filtered_leap_days_beforestart, timespan.length, true);

				calendar_layouts.html.push("<div class='timespan_container vertical'>");

				calendar_layouts.html.push("<div class='timespan_name'>");
					calendar_layouts.html.push(timespan.name + (static_data.settings.add_month_number ? " - Month " + (timespan.index+1) : ""));
				calendar_layouts.html.push("</div>");


				calendar_layouts.html.push("<div class='timespan_row_container'>");

						if(!static_data.year_data.overflow){
							calendar_layouts.year_data.week_day = 1;
						}

						for(timespan_day = 1; timespan_day <= timespan.length; timespan_day++, calendar_layouts.year_data.year_day++, calendar_layouts.year_data.epoch++){

							this.insert_day(calendar_layouts.year_data.epoch, timespan_day, "timespan_day");

							filtered_features = timespan.leap_days.filter(function(features){
								return features.intercalary && features.day === timespan_day && timespan.length != features.day;
							});

							filtered_era = static_data.eras.filter(function(era){
								return era.year === dynamic_data.internal_year &&
								era.timespan === timespan.index &&
								era.day === timespan_day &&
								era.day != timespan.length;
							});

							if(calendar_layouts.year_data.week_day >= timespan.week.length){
								calendar_layouts.year_data.week_day = 1;
							}else{
								calendar_layouts.year_data.week_day++;
							}

							this.insert_intercalary_day(timespan, filtered_features, timespan.length, true);

						}

				calendar_layouts.html.push("</div>");
				calendar_layouts.html.push("</div>");

			}else if(timespan.type === 'intercalary'){

				return_week_day = 0;

				calendar_layouts.html.push("<div class='timespan_container vertical'>");

					calendar_layouts.html.push("<div class='timespan_name'>");
						calendar_layouts.html.push(timespan.name + (static_data.settings.add_month_number ? " - Month " + (timespan.index+1) : ""));
					calendar_layouts.html.push("</div>");

					calendar_layouts.html.push("<div class='timespan_row_container'>");
							
						intercalary_week_day = 1;

						for(intercalary_day = 1; intercalary_day <= timespan.length; intercalary_day++, calendar_layouts.year_data.year_day++, calendar_layouts.year_data.epoch++){

							this.insert_day(calendar_layouts.year_data.epoch, '', "timespan_day timespan_intercalary");

							if(intercalary_week_day <= timespan.week.length){
								intercalary_week_day++;
							}else if(intercalary_week_day > timespan.week.length){
								intercalary_week_day = 1;
							}

						}

					calendar_layouts.html.push("</div>");

				calendar_layouts.html.push("</div>");
			
			}

		},

		insert_intercalary_day: function(timespan, filtered_features, length, add_subt){

			if(filtered_features.length > 0){

				calendar_layouts.year_data.epoch += add_subt ? 1 : 0;

				if(!(filtered_features[0].day === 0) && !(filtered_features[0].day === length)){
					
					calendar_layouts.html.push("</div>");
					calendar_layouts.html.push("</div>");

				}

				calendar_layouts.html.push("<div class='timespan_container vertical'>");

				calendar_layouts.html.push("<div class='timespan_row_container intercalary'>");

				intercalary_week = 1;

				for(index = 0; index < filtered_features.length; index++){
				
					calendar_layouts.year_data.year_day++;
					calendar_layouts.year_data.epoch++;

					feature = filtered_features[index];

					this.insert_day(calendar_layouts.year_data.epoch, '', "timespan_day timespan_intercalary", feature.name, true);

					if(intercalary_week == timespan.week.length){
						intercalary_week = 1;
					}else{
						intercalary_week++;
					}
					
				}

				calendar_layouts.html.push("</div>");

				calendar_layouts.html.push("</div>");

				if(!(filtered_features[0].day === 0) && !(filtered_features[0].day === length)){

					calendar_layouts.html.push("<div class='timespan_container vertical'>");
					calendar_layouts.html.push("<div class='timespan_name'>");
						calendar_layouts.html.push(timespan.name + (static_data.settings.add_month_number ? " - Month " + (timespan.index+1) : ""));
					calendar_layouts.html.push("</div>");
					calendar_layouts.html.push("<div class='timespan_row_container'>");

				}

				calendar_layouts.year_data.epoch -= add_subt ? 1 : 0;
			}
		},

		get_overflow: function(start, num, features_class){

			features_class = features_class ? ' ' + features_class : '';

			for(current = 0; current < num; current++){

				calendar_layouts.html.push("<div class='timespan_overflow" + features_class);

				if(start && current === 0){
					calendar_layouts.html.push(" first");
				}

				if(!start && current == 0){
					calendar_layouts.html.push(" firstlast");
				}

				if(!start && current === num-1){
					calendar_layouts.html.push(" last");
				}

				calendar_layouts.html.push("'></div>");

			}
		}
	}
}