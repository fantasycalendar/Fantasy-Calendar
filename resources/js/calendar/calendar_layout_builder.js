function display_events(static_data, event_data){

	$('#calendar .event:not(.era_event)').remove();

	if(owner || !static_data.settings.hide_events){

		var num_valid_events = Object.keys(event_data.valid).length;

		for(var i = 0; i < num_valid_events; i++){

			var event_index = Object.keys(event_data.valid)[i];
			var current_event = static_data.event_data.events[event_index];

			$(`[event_id='${event_index}']`).remove();

			var category = current_event.event_category_id && current_event.event_category_id > -1 ?  get_category(current_event.event_category_id) : false;

			var category_hide = category ? category.category_settings.hide : false;

			if(current_event.settings.hide_full || (!owner && (current_event.settings.hide || static_data.settings.hide_events || category_hide))) continue;
				
			calendar_layouts.layout.add_event(event_data, event_index, current_event, category_hide);

		}

	}

}

function insert_moons(data){

	var moon_text = ['<div class="calendar_moon_container">'];

	if(owner || !static_data.settings.hide_moons){

		for(moon_index = 0; moon_index < static_data.moons.length; moon_index++){

			var moon = static_data.moons[moon_index];

			if(!owner && moon.hidden) continue;

			var name_array = moon_phases[moon.granularity];

			moon_text.push(`<div class='moon_container protip' moon_id="${moon_index}" data-pt-position="top" data-pt-title='${moon.name}, ${name_array[data.moon_phase[moon_index]]}' >`);

				moon_text.push(`<svg width="24" height="24" viewBox="0 0 64 64">`);
					moon_text.push(`<g>`);
						moon_text.push(`<circle cx="32" cy="32" r="23" class="lunar_background"/>`);
						moon_text.push(svg_moon_shadows[Math.floor((svg_moon_shadows.length/moon.granularity)*data.moon_phase[moon_index])]);
						moon_text.push(`<circle cx="32" cy="32" r="23" class="lunar_border"/>`);
					moon_text.push(`</g>`);
				moon_text.push("</svg>");

			moon_text.push("</div>");

		}

	}

	moon_text.push("</div>");

	return moon_text.join('');
}


function update_moon_colors(){
	moon_colors = [];
	var html = [];

	if($('#global_moon_colors').length == 0){
		html.push("<style type='text/css' id='global_moon_colors'>");
	}

	for(var index = 0; index < static_data.moons.length; index++){

		let color = static_data.moons[index].color ? static_data.moons[index].color : '#ffffff';
		let shadow_color = static_data.moons[index].shadow_color ? static_data.moons[index].shadow_color : '#292b4a';
		html.push(`.moon_container[moon_id='${index}'] .lunar_background { fill:${color}; }\n`);
		html.push(`.moon_container[moon_id='${index}'] .lunar_shadow { fill:${shadow_color}; }\n`);

		if(color == '#ffffff') {
		    color = '#dfdfdf';
        }

        html.push(`.moon_inputs[index='${index}']{ border: ${color} solid 2px; padding: 2px; }\n`);

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

		this.static_data = static_data;

		if(this.static_data.eras.length > 0){

			this.current_eras = [];
			this.prev_era = -1;
			this.current_era = 0;
			this.next_era = 1;
			this.start_epoch = start_epoch;
			this.end_epoch = end_epoch;
			this.era = undefined;

			// If the last era shift was behind us, then it is the last era
			if(this.static_data.eras[this.static_data.eras.length-1].date.epoch < this.start_epoch){

				var era = this.static_data.eras[this.static_data.eras.length-1];

				this.current_eras.push({
					"id": this.static_data.eras.length-1,
					"position": 0,
					"data": era
				});

			// Otherwise, this finds the current overlapping eras with the displayed days
			}else{

				// Find eras within this year
				for(var i = this.static_data.eras.length-1; i >= 0; i--){

					var era = this.static_data.eras[i];

					if(!era.settings.starting_era && era.date.epoch >= this.start_epoch && era.date.epoch < this.end_epoch){
						this.current_eras.push({
							"id": i,
							"position": 0,
							"data": era
						});
					}else{

						if(era.settings.starting_era || era.date.epoch < this.start_epoch){
							this.current_eras.push({
								"id": i,
								"position": -1000,
								"data": era
							});
							break;
						}
					}

				}

				this.current_eras.reverse();

			}

		}

	},

	// This simply sets the new era
	set_current_era: function(index){

		if(this.current_eras.length > 0){
			// If it's not a new era, don't update the text
			if(this.era != index){
				this.era = index;
			}
		}

		var year_text = `Year ${calendar_layouts.year_data.year}`;

		if(this.era !== undefined && this.era !== -1){

			var era = this.current_eras[this.era].data;

			if(!this.static_data.settings.hide_eras || owner){

				if(era.settings.use_custom_format && era.formatting){

					var format = era.formatting.replace(/\{\{/g, '{{{').replace(/\}\}/g, '}}}');

					year_text = Mustache.render(
						format,
						{
							"year": calendar_layouts.year_data.year,
							"nth_year": ordinal_suffix_of(calendar_layouts.year_data.year),
							"abs_year": Math.abs(calendar_layouts.year_data.year),
							"abs_nth_year": ordinal_suffix_of(Math.abs(calendar_layouts.year_data.year)),
							"era_year": calendar_layouts.year_data.era_year,
							"era_nth_year": ordinal_suffix_of(calendar_layouts.year_data.era_year),
							"era_name": era.name
						}
					);

				}else{

					if(era.settings.restart){
						var year_text = `Era year ${calendar_layouts.year_data.era_year} (year ${calendar_layouts.year_data.year})`;
					}else{
						year_text += ` - ${era.name}`
					}

				}
			}
		}

		if(year_text != ''){

			calendar_layouts.update_year_follower(year_text);

		}

	},

	// This just sets up the starting era, in case the user refreshed and isn't at the top of the page
	set_up_position: function(){

		if(static_data.eras.length > 0){

			var position = $("#calendar_container").scrollTop();

			for(var i = 0; i < this.current_eras.length; i++){
				if(!this.current_eras[i].data.settings.starting_era){
					if($(`[epoch=${this.current_eras[i].data.date.epoch}]`).length){
						this.current_eras[i].position = this.current_eras[i].position + position + $(`[epoch=${this.current_eras[i].data.date.epoch}]`).offset().top - 150;
					}
				}
			}

			if(this.current_eras.length >= 2){
				if(this.current_eras[0].position == -1000 && this.current_eras[1].position < 0){
					this.current_eras.shift();
				}
			}

			if(this.current_eras.length == 0){

				this.set_current_era(0);

			}else if(this.current_eras.length == 1){

				if(position > this.current_eras[0].position || this.current_eras[0].data.date.epoch < this.start_epoch){
					this.set_current_era(0);
				}else{
					this.set_current_era(-1);
				}

			}else{
				for(var i = 0; i < this.current_eras.length; i++){
					var current_era = this.current_eras[i];
					if(position > current_era.position && i < this.current_eras.length-1){
						if(current_era.position != -1000){
							this.prev_era++;
							this.current_era++;
							this.next_era++;
						}
					}
				}
				this.set_current_era(this.current_era);
			}
		}

	},

	// This is evaluated every time the user scrolls to calculate the next era
	evaluate_position: function(){

		if(static_data.eras.length > 0){

			var position = $("#calendar_container").scrollTop();

			// If there's only one era, don't do anything
			if(this.current_eras.length == 0){

				this.set_current_era(0);

			}else if(this.current_eras.length == 1){

				if(position > this.current_eras[0].position || this.current_eras[0].data.date.epoch < this.start_epoch){

					this.set_current_era(0);

				}else{

					this.set_current_era(-1);

				}


			}else{

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

				this.set_current_era(this.current_era);

			}

		}

	},


	display_era_events: function(static_data){

		if(static_data.eras.length > 0){

			var num_eras = Object.keys(static_data.eras).length;

			for(var era_index = 0; era_index < num_eras; era_index++){

				var current_era = static_data.eras[era_index];

				if(current_era.settings.show_as_event){

					var parent = $(`.timespan_day[epoch='${current_era.date.epoch}'] .event_container`);

					if(parent !== undefined){

						var event_class = '';
						var category = '';

						if(current_era.settings.event_category && current_era.settings.event_category > -1){
							var category = static_data.event_data.categories[current_era.settings.event_category];
							event_class = category.color ? " " + category.color : "";
							event_class += category.text ? " " + category.text : "";
						}

						var html = `<div class='event era_event ${event_class}' era_id='${era_index}' category='${category.name}'>${current_era.name}</div>`;

						parent.append(html);

					}
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
	$(`.preview_day`).removeClass('preview_day');

	if(recalculate){
		dynamic_data.epoch = evaluate_calendar_start(static_data, convert_year(static_data, dynamic_data.year), dynamic_data.timespan, dynamic_data.day).epoch;
	}

	var day_container = $(`.timespan_day[epoch=${dynamic_data.epoch}]`);

	day_container.addClass('current_day');

	if(preview_date.epoch != dynamic_data.epoch){
		preview_day_container = $(`[epoch=${preview_date.epoch}]`);
		preview_day_container.addClass('preview_day');
	}

	evaluate_sun();

	update_cycle_text();

}

function scroll_to_epoch(){

	if($(`[epoch=${preview_date.epoch}]`).length){
		$(`[epoch=${preview_date.epoch}]`)[0].scrollIntoView({block: "center", inline: "nearest"});
	}else if($(`[epoch=${dynamic_data.epoch}]`).length){
		$(`[epoch=${dynamic_data.epoch}]`)[0].scrollIntoView({block: "center", inline: "nearest"});
	}
}

function update_cycle_text(){

	if(evaluated_static_data.epoch_data && static_data.cycles.data.length > 0){

		var format = static_data.cycles.format.replace(/\{\{/g, '{{{').replace(/\}\}/g, '}}}');

		var cycle_text = Mustache.render(format, get_cycle(static_data, evaluated_static_data.epoch_data[preview_date.epoch]).text);

		$('#top_follower_content .cycle').text(cycle_text).removeClass('hidden');

	}else{

		$('#top_follower_content .cycle').text('').addClass('hidden');

	}

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
		this.layout = (deviceType() == "Mobile Phone") ? 'vertical' : 'grid';

		this.append_layout();

		this.update_year_follower(`Year ${calendar_layouts.year_data.era_year}`);

	},

	insert_calendar: function(data){

		var div = document.getElementById('calendar');
		div.innerHTML = "";

		this.data = clone(data)
		this.year_data = this.data.year_data;
		this.year_data.epoch = this.year_data.start_epoch;
		this.epoch_data = this.data.epoch_data;
		this.timespans = this.data.timespans;
		this.name_layout = static_data.settings.layout;
		this.layout = calendar_layouts[this.name_layout];

		for(var i = 0; i < Object.keys(this.timespans).length; i++){

			var timespan_index = Object.keys(this.timespans)[i]

			if(static_data.settings.only_reveal_today && !owner && is_past_current_date(dynamic_data, calendar_layouts.year_data.year, timespan_index)){

				continue;

			}

			var timespan = this.timespans[timespan_index];

			this.layout.insert_timespan(timespan);

			filtered_leap_days_afterend = timespan.leap_days.filter(function(elem){
				return elem.intercalary && elem.day === timespan.length;
			});

			this.layout.insert_intercalary_day(timespan, filtered_leap_days_afterend, timespan.length, false);

		}

		this.append_layout();

		this.add_year_day_number();

		this.add_month_number();

		this.update_year_follower(`Year ${calendar_layouts.year_data.era_year}`);

	},

	update_year_follower: function(year_text){

		$('#top_follower_content').removeClass().addClass(this.name_layout).find('.year').text(year_text);

	},

	grid: {

		add_event: function(event_data, event_index, event){

			var category = event.event_category_id && event.event_category_id > -1 ?  get_category(event.event_category_id) : false;

			var category_hide = category ? category.category_settings.hide : false;

			for(var epoch_index = 0; event_data.valid[event_index] && epoch_index < event_data.valid[event_index].length; epoch_index++){

				var local_epoch = event_data.valid[event_index][epoch_index];

				var start = event_data.starts[event_index].indexOf(local_epoch) != -1;
				var end = event_data.ends[event_index].indexOf(local_epoch) != -1;

				var event_class = event.settings.color ? " " + event.settings.color : "";
				event_class += event.settings.text ? " " + event.settings.text : "";
				event_class += event.settings.hide || static_data.settings.hide_events || category_hide ? " hidden_event" : "";

				var category_name = category ?  category.name : "";

				var html = `<div class='event ${(event_class + (start ? " event_start" : (end ? " event_end" : "")))}' event_id='${event_index}' category='${category_name}'>${((start ? "Start: " : (end ? "End: " : "")) + event.name)}</div>`;

				var parent = $(`.timespan_day[epoch='${local_epoch}'] .event_container`);

				parent.append(html);

			}

		},

		insert_day: function(epoch, weather_align, day_num, day_class, title){

			if(static_data.settings.only_reveal_today && !owner && is_past_current_date(dynamic_data, calendar_layouts.year_data.year, this.timespan.index, this.timespan.day))
			{

				this.insert_empty_day(day_class);

			}else{

				calendar_layouts.html.push(`<div class='${day_class}' epoch='${epoch}'>`);

					calendar_layouts.html.push("<div class='day_row'>");
						calendar_layouts.html.push("<div class='toprow left'>");
							calendar_layouts.html.push(`<div class='number'>${day_num}</div>`);
							//calendar_layouts.html.push(`<div class='number'>${calendar_layouts.epoch_data[epoch].era_year}</div>`);
						calendar_layouts.html.push("</div>");
						calendar_layouts.html.push("<div class='toprow center'>");
						if(calendar_layouts.epoch_data[epoch].weather && calendar_layouts.data.processed_weather){
							if(!(static_data.settings.hide_all_weather || (!owner && static_data.settings.hide_future_weather && is_past_current_date(dynamic_data, calendar_layouts.year_data.year, this.timespan.index, this.timespan.day)))){
								calendar_layouts.html.push(`<div class='weather_icon weather_popup' align='${weather_align}'></div>`);
							}
						}
						calendar_layouts.html.push("</div>");
						calendar_layouts.html.push("<div class='toprow right'>");
							if(owner){
								calendar_layouts.html.push(`<div epoch='${epoch}' class='btn_create_event btn_small_plus btn btn-success' title='Create new event'></div>`);
							}
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

				var filtered_leap_days_beforestart = timespan.leap_days.filter(function(features){
					return features.intercalary && features.day === 0;
				});

				this.insert_intercalary_day(timespan, filtered_leap_days_beforestart, timespan.length, false);

				calendar_layouts.html.push("<div class='timespan_container grid'>");

				calendar_layouts.html.push("<div class='timespan_name'>");
					calendar_layouts.html.push(timespan.name);
					calendar_layouts.html.push("<span class='timespan_number'>");
						calendar_layouts.html.push(` - Month ${timespan.index+1}`);
					calendar_layouts.html.push("</span>");
				calendar_layouts.html.push("</div>");

				calendar_layouts.html.push("<div class='timespan_row_container'>");

					if(!static_data.settings.hide_weekdays){

						calendar_layouts.html.push("<div class='timespan_row_names'>");

						for(day_in_week = 1; day_in_week <= timespan.week.length; day_in_week++){

							calendar_layouts.html.push("<div class='week_day_name'>");
							calendar_layouts.html.push(timespan.week[day_in_week-1]);
							calendar_layouts.html.push("</div>");

						}

						calendar_layouts.html.push("</div>");

					}

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

							if(calendar_layouts.year_data.week_day >= timespan.week.length){
								calendar_layouts.year_data.week_day = 1;
								if(timespan_day != timespan.length){
									calendar_layouts.html.push("</div>");
									calendar_layouts.html.push("<div class='timespan_row'>");
								}
							}else{
								calendar_layouts.year_data.week_day++;
							}

							this.insert_intercalary_day(timespan, filtered_features, timespan.length, true);

						}

						this.get_overflow(false, ((timespan.week.length-calendar_layouts.year_data.week_day+1)%timespan.week.length));


					calendar_layouts.html.push("</div>");

				calendar_layouts.html.push("</div>");
				calendar_layouts.html.push("</div>");

			}else if(timespan.type === 'intercalary'){

				calendar_layouts.html.push("<div class='timespan_container grid'>");

					calendar_layouts.html.push("<div class='timespan_name'>");
						calendar_layouts.html.push(timespan.name);
						calendar_layouts.html.push("<span class='timespan_number'>");
							calendar_layouts.html.push(` - Month ${timespan.index+1}`);
						calendar_layouts.html.push("</span>");
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

								this.insert_day(calendar_layouts.year_data.epoch, weather_align, intercalary_day, "timespan_day timespan_intercalary");

								if(intercalary_week_day < timespan.week.length){
									intercalary_week_day++;
								}else if(intercalary_week_day >= timespan.week.length){
									if(intercalary_day != timespan.length){
										calendar_layouts.html.push("</div>");
										calendar_layouts.html.push("<div class='timespan_row intercalary'>");
									}
									intercalary_week_day = 1;
								}

							}

							this.get_overflow(false, ((timespan.week.length-intercalary_week_day+1)%timespan.week.length), "intercalary");

					calendar_layouts.html.push("</div>");

				calendar_layouts.html.push("</div>");

				calendar_layouts.html.push("</div>");

			}

		},

		insert_intercalary_day: function(timespan, filtered_features, length, add_subt){

			if(filtered_features.length > 0){

				calendar_layouts.year_data.epoch += add_subt ? 1 : 0;
				calendar_layouts.year_data.year_day += add_subt ? 1 : 0;
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
					this.insert_day(calendar_layouts.year_data.epoch, weather_align, index+1, "timespan_day timespan_intercalary", feature.name);

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
						calendar_layouts.html.push(timespan.name);
						calendar_layouts.html.push("<span class='timespan_number'>");
							calendar_layouts.html.push(` - Month ${timespan.index+1}`);
						calendar_layouts.html.push("</span>");
					calendar_layouts.html.push("</div>");
					calendar_layouts.html.push("<div class='timespan_row_container'>");

					if(!static_data.settings.hide_weekdays){

					calendar_layouts.html.push("<div class='timespan_row_names'>");

						for(day_in_week = 1; day_in_week <= timespan.week.length; day_in_week++){

							calendar_layouts.html.push("<div class='week_day_name'>");
							calendar_layouts.html.push(timespan.week[day_in_week-1]);
							calendar_layouts.html.push("</div>");

						}

						calendar_layouts.html.push("</div>");

					}

					calendar_layouts.html.push("<div class='timespan_row'>");
					this.get_overflow(true, calendar_layouts.year_data.week_day-1);

				}

				calendar_layouts.year_data.epoch -= add_subt ? 1 : 0;
				calendar_layouts.year_data.year_day -= add_subt ? 1 : 0;
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

		add_event: function(event_data, event_index, event){

			calendar_layouts.grid.add_event(event_data, event_index, event);

		},

		insert_day: function(epoch, weather_align, day_num, day_class, title){

			if(static_data.settings.only_reveal_today && !owner && is_past_current_date(dynamic_data, calendar_layouts.year_data.year, this.timespan.index, this.timespan.day)){

				this.insert_empty_day(day_class);

			}else{

				calendar_layouts.html.push(`<div class='${day_class}' epoch='${epoch}'>`);

					calendar_layouts.html.push("<div class='day_row'>");
						calendar_layouts.html.push("<div class='toprow left'>");
							calendar_layouts.html.push(`<div class='number'>${day_num}</div>`);
						calendar_layouts.html.push("</div>");
						calendar_layouts.html.push("<div class='toprow center'>");
						if(calendar_layouts.epoch_data[epoch].weather && calendar_layouts.data.processed_weather){
							if(!(static_data.settings.hide_all_weather || (!owner && static_data.settings.hide_future_weather && is_past_current_date(dynamic_data, calendar_layouts.year_data.year, this.timespan.index, this.timespan.day)))){
								calendar_layouts.html.push(`<div class='weather_icon weather_popup' align='${weather_align}'></div>`);
							}
						}
						calendar_layouts.html.push("</div>");
						calendar_layouts.html.push("<div class='toprow right'>");
							if(owner){
								calendar_layouts.html.push(`<div epoch='${epoch}' class='btn_create_event btn_small_plus btn btn-success' title='Create new event'></div>`);
							}
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

				this.insert_intercalary_day(timespan, filtered_leap_days_beforestart, timespan.length, false);

				calendar_layouts.html.push("<div class='timespan_container wide'>");

				calendar_layouts.html.push("<div class='timespan_name'>");
					calendar_layouts.html.push(timespan.name);
					calendar_layouts.html.push("<span class='timespan_number'>");
						calendar_layouts.html.push(` - Month ${timespan.index+1}`);
					calendar_layouts.html.push("</span>");
				calendar_layouts.html.push("</div>");


				calendar_layouts.html.push("<div class='timespan_row_container'>");

					if(!static_data.settings.hide_weekdays){

						calendar_layouts.html.push("<div class='timespan_row_names'>");

						for(day_in_week = 1; day_in_week <= timespan.week.length; day_in_week++){

							calendar_layouts.html.push("<div class='week_day_name'>");
							calendar_layouts.html.push(timespan.week[day_in_week-1]);
							calendar_layouts.html.push("</div>");

						}

						calendar_layouts.html.push("</div>");

					}

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


							if(calendar_layouts.year_data.week_day >= timespan.week.length){
								calendar_layouts.year_data.week_day = 1;
								if(timespan_day != timespan.length){
									calendar_layouts.html.push("</div>");
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

				calendar_layouts.html.push("<div class='timespan_container wide'>");

					calendar_layouts.html.push("<div class='timespan_name'>");
						calendar_layouts.html.push(timespan.name);
						calendar_layouts.html.push("<span class='timespan_number'>");
							calendar_layouts.html.push(` - Month ${timespan.index+1}`);
						calendar_layouts.html.push("</span>");
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

								this.insert_day(calendar_layouts.year_data.epoch, weather_align, intercalary_day, "timespan_day timespan_intercalary");

								if(intercalary_week_day <= timespan.week.length){
									intercalary_week_day++;
								}else if(intercalary_week_day > timespan.week.length){
									if(intercalary_day != timespan.length){
										calendar_layouts.html.push("</div>");
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
				calendar_layouts.year_data.year_day += add_subt ? 1 : 0;

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

					this.insert_day(calendar_layouts.year_data.epoch, weather_align, index+1, "timespan_day timespan_intercalary", feature.name);

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
						calendar_layouts.html.push(timespan.name);
						calendar_layouts.html.push("<span class='timespan_number'>");
							calendar_layouts.html.push(` - Month ${timespan.index+1}`);
						calendar_layouts.html.push("</span>");
					calendar_layouts.html.push("</div>");
					calendar_layouts.html.push("<div class='timespan_row_container'>");
					
					if(!static_data.settings.hide_weekdays){
					
						calendar_layouts.html.push("<div class='timespan_row_names'>");

						for(day_in_week = 1; day_in_week <= timespan.week.length; day_in_week++){

							calendar_layouts.html.push("<div class='week_day_name'>");
							calendar_layouts.html.push(timespan.week[day_in_week-1]);
							calendar_layouts.html.push("</div>");

						}

						calendar_layouts.html.push("</div>");

					}

					cale1ndar_layouts.html.push("<div class='timespan_row'>");
					this.get_overflow(true, calendar_layouts.year_data.week_day-1);

				}

				calendar_layouts.year_data.epoch -= add_subt ? 1 : 0;
				calendar_layouts.year_data.year_day -= add_subt ? 1 : 0;
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

		add_event: function(event_data, event_index, event){

			calendar_layouts.grid.add_event(event_data, event_index, event);

		},

		insert_empty_day: function(day_class){
			calendar_layouts.html.push(`<div class='empty_timespan_day ${day_class}'>`);
			calendar_layouts.html.push("</div>");
		},

		insert_day: function(epoch, day_num, day_class, title, intercalary){

			if(static_data.settings.only_reveal_today && !owner && is_past_current_date(dynamic_data, calendar_layouts.year_data.year, this.timespan.index, this.timespan.day)){

				this.insert_empty_day(day_class);

			}else{

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
						if(calendar_layouts.epoch_data[epoch].weather && calendar_layouts.data.processed_weather){
							if(!(static_data.settings.hide_all_weather || (!owner && static_data.settings.hide_future_weather && is_past_current_date(dynamic_data, calendar_layouts.year_data.year, this.timespan.index, this.timespan.day)))){
								calendar_layouts.html.push(`<div class='weather_icon weather_popup' align=''></div>`);
							}
						}
						calendar_layouts.html.push("</div>");
						calendar_layouts.html.push("<div class='toprow right'>");
							if(owner){
								calendar_layouts.html.push(`<div epoch='${epoch}' class='btn_create_event btn_small_plus btn btn-success' title='Create new event'></div>`);
							}
						calendar_layouts.html.push("</div>");
					calendar_layouts.html.push("</div>");

					/*if(calendar_layouts.epoch_data[epoch].weather && calendar_layouts.data.processed_weather){

						calendar_layouts.html.push("<div class='day_row weather'>");

						weather = calendar_layouts.epoch_data[epoch].weather;

						var temp_sys = static_data.seasons.global_settings.temp_sys;

						if(temp_sys == 'imperial'){
							temp_symbol = '°F';
							var temp = `${precisionRound(weather.temperature[temp_sys].value[0], 1).toString()+temp_symbol} to ${precisionRound(weather.temperature[temp_sys].value[1], 1).toString()+temp_symbol}`;
						}else if(temp_sys == 'metric'){
							temp_symbol = '°C';
							var temp = `${precisionRound(weather.temperature[temp_sys].value[0], 1).toString()+temp_symbol} to ${precisionRound(weather.temperature[temp_sys].value[1], 1).toString()+temp_symbol}`;
						}else{
							var temp_f = `${precisionRound(weather.temperature['imperial'].value[0], 1).toString()}°F to ${precisionRound(weather.temperature['imperial'].value[1], 1).toString()}°F`;
							var temp_c = `${precisionRound(weather.temperature['metric'].value[0], 1).toString()}°C to ${precisionRound(weather.temperature['metric'].value[1], 1).toString()}°C`;
							var temp = `${temp_f} | ${temp_c}`;
						}

						var wind_sys = static_data.seasons.global_settings.wind_sys;

						if(wind_sys == 'imperial'){
							var wind_symbol = "MPH";
							var wind_text = `${weather.wind_speed} (${weather.wind_direction}) (${weather.wind_velocity[wind_sys]} ${wind_symbol})`;
						}else if(wind_sys == 'metric'){
							var wind_symbol = "KPH";
							var wind_text = `${weather.wind_speed} (${weather.wind_direction}) (${weather.wind_velocity[wind_sys]} ${wind_symbol})`;
						}else{
							var wind_text = `${weather.wind_speed} (${weather.wind_direction}) (${weather.wind_velocity.imperial} MPH | ${weather.wind_velocity.metric} KPH)`;
						}

						calendar_layouts.html.push(`${temp} | ${weather.precipitation.key} | ${weather.clouds} | ${wind_text}`);

						calendar_layouts.html.push("</div>");

					}*/

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

		insert_timespan: function(timespan){

			this.timespan = timespan;

			this.timespan.day = 1;

			if(timespan.type === 'month'){

				filtered_leap_days_beforestart = timespan.leap_days.filter(function(features){
					return features.intercalary && features.day === 0;
				});

				this.insert_intercalary_day(timespan, filtered_leap_days_beforestart, timespan.length, false);

				calendar_layouts.html.push("<div class='timespan_container vertical'>");

				calendar_layouts.html.push("<div class='timespan_name'>");
					calendar_layouts.html.push(timespan.name);
					calendar_layouts.html.push("<span class='timespan_number'>");
						calendar_layouts.html.push(` - Month ${timespan.index+1}`);
					calendar_layouts.html.push("</span>");
				calendar_layouts.html.push("</div>");


				calendar_layouts.html.push("<div class='timespan_row_container'>");

					if(!static_data.year_data.overflow){
						calendar_layouts.year_data.week_day = 1;
					}

					for(timespan_day = 1; timespan_day <= timespan.length; timespan_day++, calendar_layouts.year_data.year_day++, calendar_layouts.year_data.epoch++, this.timespan.day++){

						this.insert_day(calendar_layouts.year_data.epoch, timespan_day, "timespan_day");

						filtered_features = timespan.leap_days.filter(function(features){
							return features.intercalary && features.day === timespan_day && timespan.length != features.day;
						});

						if(calendar_layouts.year_data.week_day >= timespan.week.length){
							calendar_layouts.year_data.week_day = 1;
						}else{
							calendar_layouts.year_data.week_day++;
						}

						this.insert_intercalary_day(timespan, filtered_features, timespan.length, true);

						this.previous_epoch = calendar_layouts.year_data.epoch;

					}

				calendar_layouts.html.push("</div>");
				calendar_layouts.html.push("</div>");

			}else if(timespan.type === 'intercalary'){

				calendar_layouts.html.push("<div class='timespan_container vertical'>");

					calendar_layouts.html.push("<div class='timespan_name'>");
						calendar_layouts.html.push(timespan.name);
						calendar_layouts.html.push("<span class='timespan_number'>");
							calendar_layouts.html.push(` - Month ${timespan.index+1}`);
						calendar_layouts.html.push("</span>");
					calendar_layouts.html.push("</div>");

					calendar_layouts.html.push("<div class='timespan_row_container'>");

						intercalary_week_day = 1;

						for(intercalary_day = 1; intercalary_day <= timespan.length; intercalary_day++, calendar_layouts.year_data.year_day++, calendar_layouts.year_data.epoch++, this.timespan.day++){

							this.insert_day(calendar_layouts.year_data.epoch, intercalary_day, "timespan_day timespan_intercalary");

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
				calendar_layouts.year_data.year_day += add_subt ? 1 : 0;

				if(!(filtered_features[0].day === 0) && !(filtered_features[0].day === length)){

					calendar_layouts.html.push("</div>");
					calendar_layouts.html.push("</div>");

				}

				calendar_layouts.html.push("<div class='timespan_container vertical'>");

				calendar_layouts.html.push("<div class='timespan_row_container intercalary'>");

				intercalary_week = 1;

				for(index = 0; index < filtered_features.length; index++, calendar_layouts.year_data.year_day++, calendar_layouts.year_data.epoch++, this.timespan.day++){

					feature = filtered_features[index];

					this.insert_day(calendar_layouts.year_data.epoch, index+1, "timespan_day timespan_intercalary", feature.name, true);

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
						calendar_layouts.html.push(timespan.name);
						calendar_layouts.html.push("<span class='timespan_number'>");
							calendar_layouts.html.push(` - Month ${timespan.index+1}`);
						calendar_layouts.html.push("</span>");
					calendar_layouts.html.push("</div>");
					calendar_layouts.html.push("<div class='timespan_row_container'>");

				}

				calendar_layouts.year_data.epoch -= add_subt ? 1 : 0;
				calendar_layouts.year_data.year_day -= add_subt ? 1 : 0;
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

	minimalistic: {

		events: [],
		event_containers: [],

		add_event: function(event_data, event_index, event){

			var category = event.event_category_id && event.event_category_id > -1 ?  get_category(event.event_category_id) : false;

			var category_hide = category ? category.category_settings.hide : false;

			for(var epoch_index = 0; event_data.valid[event_index] && epoch_index < event_data.valid[event_index].length; epoch_index++){

				var local_epoch = event_data.valid[event_index][epoch_index];

				var day = $(`.timespan_day[epoch='${local_epoch}']`);

				if(!day.length) continue;

				day.addClass('has_event');

				if(event.settings.print){

					var event_container = day.closest('.timespan_outer_container').find('.event_container');

					var epoch_data = calendar_layouts.epoch_data[local_epoch];

					var category_name = event.event_category_id > -1 ?  category.name : "";

					var event_class = event.settings.color ? " " + event.settings.color : "";
					event_class += event.settings.text ? " " + event.settings.text : "";
					event_class += event.settings.hide || static_data.settings.hide_events || category_hide ? " hidden_event" : "";

					var element = $(`<div class='mx-2 my-0 px-1 py-0 text-left event ${event_class}' event_id='${event_index}' category='${category_name}'>${event.name} (${ordinal_suffix_of(epoch_data.day)})</div>`);

					event_container.append(element);

					event_container.children().each(function(){
						if($(this).attr('day')|0 > epoch_data.day){
							$(this).insertAfter(element);
						}
					});

				}
			}

		},

		insert_day: function(epoch, weather_align, day_num, day_class, title){

			if(static_data.settings.only_reveal_today && !owner && is_past_current_date(dynamic_data, calendar_layouts.year_data.year, this.timespan.index, this.timespan.day)){

				this.insert_empty_day(day_class);

			}else{

				if(!(!owner && (static_data.settings.hide_all_weather || (static_data.settings.hide_future_weather && is_past_current_date(dynamic_data, calendar_layouts.year_data.year, this.timespan.index, this.timespan.day))))){
					day_class += " weather_popup";
				}else{
					day_class += " weather_popup noweather";
				}

				if(static_data.moons.length > 0 && (owner || !static_data.settings.hide_moons)){
					day_class += " moon_popup ";
				}

				calendar_layouts.html.push(`<div class='${day_class}' epoch='${epoch}'>`);
					calendar_layouts.html.push(`<div class='number'>${day_num}</div>`);
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

				calendar_layouts.html.push("<div class='timespan_outer_container'>");

					var filtered_leap_days_beforestart = timespan.leap_days.filter(function(features){
						return features.intercalary && features.day === 0;
					});

					this.insert_intercalary_day(timespan, filtered_leap_days_beforestart, timespan.length, false);

					calendar_layouts.html.push("<div class='timespan_container minimalistic'>");

						calendar_layouts.html.push("<div class='timespan_name'>");
							calendar_layouts.html.push(timespan.name);
							calendar_layouts.html.push("<span class='timespan_number'>");
								calendar_layouts.html.push(` - Month ${timespan.index+1}`);
							calendar_layouts.html.push("</span>");
						calendar_layouts.html.push("</div>");

						calendar_layouts.html.push("<div class='timespan_row_container'>");

							if(!static_data.settings.hide_weekdays){

								calendar_layouts.html.push("<div class='timespan_row_names'>");

								for(day_in_week = 1; day_in_week <= timespan.week.length; day_in_week++){

									calendar_layouts.html.push("<div class='week_day_name'>");
									calendar_layouts.html.push(timespan.truncated_week[day_in_week-1]);
									calendar_layouts.html.push("</div>");

								}

								calendar_layouts.html.push("</div>");

							}

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

									if(calendar_layouts.year_data.week_day >= timespan.week.length){
										calendar_layouts.year_data.week_day = 1;
										if(timespan_day != timespan.length){
											calendar_layouts.html.push("</div>");
											calendar_layouts.html.push("<div class='timespan_row'>");
										}
									}else{
										calendar_layouts.year_data.week_day++;
									}

									this.insert_intercalary_day(timespan, filtered_features, timespan.length, true);

								}

								this.get_overflow(false, ((timespan.week.length-calendar_layouts.year_data.week_day+1)%timespan.week.length));

							calendar_layouts.html.push("</div>");

						calendar_layouts.html.push("</div>");

					calendar_layouts.html.push("</div>");

					calendar_layouts.html.push("<div class='event_container d-inline-flex flex-column'></div>");

				calendar_layouts.html.push("</div>");

			}else if(timespan.type === 'intercalary'){

				calendar_layouts.html.push("<div class='timespan_outer_container'>");

					calendar_layouts.html.push("<div class='timespan_container minimalistic'>");

						calendar_layouts.html.push("<div class='timespan_name'>");
							calendar_layouts.html.push(timespan.name);
							calendar_layouts.html.push("<span class='timespan_number'>");
								calendar_layouts.html.push(` - Month ${timespan.index+1}`);
							calendar_layouts.html.push("</span>");
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

									this.insert_day(calendar_layouts.year_data.epoch, weather_align, intercalary_day, "timespan_day timespan_intercalary");

									if(intercalary_week_day < timespan.week.length){
										intercalary_week_day++;
									}else if(intercalary_week_day >= timespan.week.length){
										if(intercalary_day != timespan.length){
											calendar_layouts.html.push("</div>");
											calendar_layouts.html.push("<div class='timespan_row intercalary'>");
										}
										intercalary_week_day = 1;
									}

								}

								this.get_overflow(false, ((timespan.week.length-intercalary_week_day+1)%timespan.week.length), "intercalary");

							calendar_layouts.html.push("</div>");

						calendar_layouts.html.push("</div>");

					calendar_layouts.html.push("</div>");

					calendar_layouts.html.push("<div class='event_container d-inline-flex flex-column'></div>");

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

				calendar_layouts.html.push("<div class='timespan_container minimalistic'>");

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
					this.insert_day(calendar_layouts.year_data.epoch, weather_align, index+1, "timespan_day timespan_intercalary", feature.name);

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

					calendar_layouts.html.push("<div class='timespan_container minimalistic'>");
					/*calendar_layouts.html.push("<div class='timespan_name'>");
						calendar_layouts.html.push(timespan.name);
						calendar_layouts.html.push("<span class='timespan_number'>");
							calendar_layouts.html.push(` - Month ${timespan.index+1}`);
						calendar_layouts.html.push("</span>");
					calendar_layouts.html.push("</div>");*/
					calendar_layouts.html.push("<div class='timespan_row_container'>");

					if(!static_data.settings.hide_weekdays){
					
						calendar_layouts.html.push("<div class='timespan_row_names'>");

						for(day_in_week = 1; day_in_week <= timespan.week.length; day_in_week++){

							calendar_layouts.html.push("<div class='week_day_name'>");
							calendar_layouts.html.push(timespan.truncated_week[day_in_week-1]);
							calendar_layouts.html.push("</div>");

						}

						calendar_layouts.html.push("</div>");

					}
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
}
