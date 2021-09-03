function update_moon_colors(){
	moon_colors = [];
	var html = [];

	if($('#global_moon_colors').length == 0){
		html.push("<style type='text/css' id='global_moon_colors'>");
	}

	for(var index = 0; index < static_data.moons.length; index++){

		let color = static_data.moons[index].color ? static_data.moons[index].color : '#ffffff';
		let shadow_color = static_data.moons[index].shadow_color ? static_data.moons[index].shadow_color : '#292b4a';
		html.push(`.moon[moon='${index}'] .lunar_background { fill:${color}; }\n`);
		html.push(`.moon[moon='${index}'] .lunar_shadow { fill:${shadow_color}; }\n`);

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

	year_text: '',

	evaluate_current_era: function(static_data, start_epoch, end_epoch){

		this.static_data = static_data;

		this.current_eras = [];
		this.prev_era = -1;
		this.current_era = 0;
		this.next_era = 1;
		this.start_epoch = start_epoch;
		this.end_epoch = end_epoch;
		this.era = undefined;

		if(this.static_data.eras.length > 0){

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

		var year_text = "";

		if(this.era !== undefined && this.era !== -1){

			var era = this.current_eras[this.era].data;

			if(!this.static_data.settings.hide_eras || Perms.player_at_least('co-owner')){

				if(era.settings.use_custom_format && era.formatting){

					var format = era.formatting.replace(/\{\{/g, '{{{').replace(/\}\}/g, '}}}');

					var epoch_data = evaluated_static_data.epoch_data[this.start_epoch];

					year_text = Mustache.render(
						format,
						{
							"year": epoch_data.year,
							"nth_year": ordinal_suffix_of(epoch_data.year),
							"abs_year": Math.abs(epoch_data.year),
							"abs_nth_year": ordinal_suffix_of(Math.abs(epoch_data.year)),
							"era_year": epoch_data.era_year,
							"era_nth_year": ordinal_suffix_of(epoch_data.era_year),
							"abs_era_nth_year": ordinal_suffix_of(Math.abs(epoch_data.era_year)),
							"era_name": era.name
						}
					);

				}else{

					if(era.settings.restart){
						var format = `Era year {{era_year}} (year {{year}}) - {{era_name}}`;
					}else{
						var format = `Year {{year}} - {{era_name}}`
					}

					var epoch_data = evaluated_static_data.epoch_data[this.start_epoch];

					year_text = Mustache.render(
						format,
						{
							"year": epoch_data.year,
							"nth_year": ordinal_suffix_of(epoch_data.year),
							"abs_year": Math.abs(epoch_data.year),
							"abs_nth_year": ordinal_suffix_of(Math.abs(epoch_data.year)),
							"era_year": epoch_data.era_year,
							"era_nth_year": ordinal_suffix_of(epoch_data.era_year),
							"abs_era_nth_year": ordinal_suffix_of(Math.abs(epoch_data.era_year)),
							"era_name": era.name
						}
					);
				}
			}

		}

		if(year_text == ''){

			var format = `Year {{year}}`;

			var epoch_data = evaluated_static_data.epoch_data[this.start_epoch];

			year_text = Mustache.render(
				format,
				{
					"year": epoch_data.year,
					"nth_year": ordinal_suffix_of(epoch_data.year),
					"abs_year": Math.abs(epoch_data.year),
					"abs_nth_year": ordinal_suffix_of(Math.abs(epoch_data.year)),
					"era_year": epoch_data.era_year,
					"era_nth_year": ordinal_suffix_of(epoch_data.era_year),
					"abs_era_nth_year": ordinal_suffix_of(Math.abs(epoch_data.era_year))
				}
			);

		}

		if(this.year_text != year_text){
			this.update_year_follower(year_text);
		}

	},

	// This just sets up the starting era, in case the user refreshed and isn't at the top of the page
	set_up_position: function(){

		if(static_data.eras.length > 0){

			var position = $("#calendar_container").scrollTop();

			var first_timespan = $(`.timespan_day`).first();

			if(first_timespan.length == 0){
				return;
			}

			var first_day = position + first_timespan.offset().top;

			for(var i = 0; i < this.current_eras.length; i++){
				if(!this.current_eras[i].data.settings.starting_era){
					if($(`[epoch=${this.current_eras[i].data.date.epoch}]`).length){
						this.current_eras[i].position = this.current_eras[i].position + position + $(`[epoch=${this.current_eras[i].data.date.epoch}]`).offset().top - first_day;
					}
				}
			}

			if(this.current_eras.length >= 2){
				if(this.current_eras[0].position == -1000 && this.current_eras[1].position <= 0){
					this.current_eras.shift();
				}
			}

			if(this.current_eras.length == 0){

				this.set_current_era(0);

			}else if(this.current_eras.length == 1){

				if(position >= this.current_eras[0].position || this.current_eras[0].data.date.epoch < this.start_epoch){
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

				if(position >= this.current_eras[0].position || this.current_eras[0].data.date.epoch < this.start_epoch){

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

		}else{

			this.set_current_era(-1);

		}

	},

	update_year_follower: function(year_text){

		this.year_text = year_text;

		$('#top_follower_content').removeClass().addClass(this.name_layout).find('.year').text(year_text);

	},

}

function pre_update_current_day(recalculate){

	var apply_changes_immediately = $('#apply_changes_immediately');

	if(apply_changes_immediately.length == 0){
		apply_changes_immediately = true;
	}else{
		apply_changes_immediately = apply_changes_immediately.is(':checked');
	}

	if(!apply_changes_immediately){
		evaluate_apply_show_hide();
		return;
	}

	update_current_day(recalculate);

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

	update_cycle_text();

}

scroll_attempts = 0;

function scroll_to_epoch(){

	if($(`[epoch=${preview_date.epoch}]`).length){
		scroll_attempts = 0;
		return $(`[epoch=${preview_date.epoch}]`)[0].scrollIntoView({block: "center", inline: "nearest"});
	}else if($(`[epoch=${dynamic_data.epoch}]`).length){
		scroll_attempts = 0;
		return $(`[epoch=${dynamic_data.epoch}]`)[0].scrollIntoView({block: "center", inline: "nearest"});
	}

	scroll_attempts++;

	if(scroll_attempts < 10){
		setTimeout(scroll_to_epoch, 100);
	}else{
		scroll_attempts = 0;
	}

}

function update_cycle_text(){

	if(evaluated_static_data.epoch_data && static_data.cycles.data.length > 0){

		var format = static_data.cycles.format.replace(/\{\{/g, '{{{').replace(/\}\}/g, '}}}');

		var epoch = dynamic_data.epoch;
		if(preview_date.epoch != dynamic_data.epoch){
			preview_date.epoch = evaluate_calendar_start(static_data, convert_year(static_data, preview_date.year), preview_date.timespan, preview_date.day).epoch;
			epoch = preview_date.epoch;
		}

		var view = get_cycle(static_data, evaluated_static_data.epoch_data[epoch]).text;

		var cycle_text = Mustache.render(format, view);

		$('#top_follower_content .cycle').html(cycle_text).removeClass('hidden').toggleClass('smaller', cycle_text.includes("<br>"));

	}else{

		$('#top_follower_content .cycle').html('').addClass('hidden').toggleClass('smaller', false);

	}

}
