var calendar_builder = {

	calendar_name: '',
	dynamic_data: {},
	static_data: {},
    events: {},
    event_categories: {},

	add_moon_data: function(object1, object2, epoch, data, test){

		for(moon_index = 0; moon_index < this.static_data.moons.length; moon_index++){

			var moon = this.static_data.moons[moon_index];

			if(moon.custom_phase){

				var custom_cycle = moon.custom_cycle.split(',');
				var phase = custom_cycle[Math.abs(epoch%(custom_cycle.length))]|0;
				var phase_epoch = Math.round(Math.abs(epoch/(custom_cycle.length))+1);

			}else{

				var moon_position_data = ((epoch - moon.shift) / moon.cycle);
				var moon_position = (moon_position_data - Math.floor(moon_position_data));

				if(moon.cycle_rounding == "floor"){
					var phase = Math.floor(moon_position*moon.granularity)%moon.granularity;
					var phase_epoch = Math.floor(Math.abs(moon_position_data)+1);
				}else if(moon.cycle_rounding == "round" || moon.cycle_rounding === undefined){
					var phase = Math.round(moon_position*moon.granularity)%moon.granularity;
					var phase_epoch = Math.round(Math.abs(moon_position_data)+1);
				}if(moon.cycle_rounding == "ceil"){
					var phase = Math.ceil(moon_position*moon.granularity)%moon.granularity;
					var phase_epoch = Math.ceil(Math.abs(moon_position_data)+1);
				}

			}

			object1[moon_index][phase]++;
			object2[moon_index][phase]++;

			data['moon_phase'][moon_index] = phase;
			data['moon_phase_num_epoch'][moon_index] = phase_epoch;
			data['moon_phase_num_year'][moon_index] = object1[moon_index][phase];
			data['moon_phase_num_month'][moon_index] = object2[moon_index][phase];

		}

		return data;

	},

	create_adjusted_timespan: function(year, timespan_index){

		var timespan = clone(this.static_data.year_data.timespans[timespan_index]);

		timespan.index = timespan_index;

		timespan.week = timespan.week ? timespan.week : clone(this.static_data.year_data.global_week);
		timespan.truncated_week = truncate_weekdays(timespan.week);

		timespan.leap_days = [];

		if(timespan.interval == 1){

			var timespan_fraction = year;

		}else{

			var offset = timespan.offset%timespan.interval;

			if(year < 0 || this.static_data.settings.year_zero_exists){
				var timespan_fraction = Math.ceil((year - offset) / timespan.interval);
			}else{
				var timespan_fraction = Math.floor((year - offset) / timespan.interval);
			}

		}

		var leap_day_offset = 0;

		// Get all current leap days and check if any of them should be on this timespan
		for(leap_day_index = 0; leap_day_index < this.static_data.year_data.leap_days.length; leap_day_index++){

			var leap_day = this.static_data.year_data.leap_days[leap_day_index];

			if(leap_day.timespan == timespan_index){

				leap_day.index = leap_day_index;

				if(is_leap(this.static_data, timespan_fraction, leap_day.interval, leap_day.offset)){

					if(leap_day.intercalary){
						if(timespan.type === 'intercalary'){
							timespan.length++;
						}else{
							timespan.leap_days.push(leap_day);
						}

					}else{
						timespan.length++;
						if(leap_day.adds_week_day){
							var location = (leap_day.day)%timespan.week.length;
							timespan.week.splice(location+leap_day_offset, 0, leap_day.week_day)
							leap_day_offset++;
						}
					}
				}
			}
		}

		return timespan;

	},

	pre_data: {
		epochs: {},
		repititions: {
			week_days: {},
			timespan_moons: {},
			year_moons: {}
		},
	},

	data: {
		epochs: {},
		repititions: {
			week_days: {},
			timespan_moons: {},
			year_moons: []
		},
	},

	post_data: {
		epochs: {},
		repititions: {
			week_days: {},
			timespan_moons: {},
			year_moons: {}
		},
	},

	set_up_repititions: function(){

		this.pre_data = {
			epochs: {},
			repititions: {
				week_days: {},
				timespan_moons: {},
				year_moons: {}
			},
		};

		this.data = {
			epochs: {},
			repititions: {
				week_days: {},
				timespan_moons: {},
				year_moons: []
			},
		};

		this.post_data = {
			epochs: {},
			repititions: {
				week_days: {},
				timespan_moons: {},
				year_moons: {}
			},
		};

		if(this.calendar_list.timespans_to_build !== undefined){
			for(var i = 0; i < Object.keys(this.calendar_list.timespans_to_build).length; i++){

				timespan_index = parseInt(Object.keys(this.calendar_list.timespans_to_build)[i]);

				this.data.repititions.week_days[timespan_index] = [];
				for(week_day = 0; week_day < this.calendar_list.timespans_to_build[timespan_index].week.length; week_day++){
					this.data.repititions.week_days[timespan_index][week_day] = 0;
				}
			}

			for(var i = 0; i < Object.keys(this.calendar_list.timespans_to_build).length; i++){

				timespan_index = parseInt(Object.keys(this.calendar_list.timespans_to_build)[i]);

				this.data.repititions.timespan_moons[timespan_index] = [];
				for(var moon = 0; moon < this.static_data.moons.length; moon++){
					this.data.repititions.timespan_moons[timespan_index][moon] = [];
					for(j = 0; j < this.static_data.moons[moon].granularity; j++){
						this.data.repititions.timespan_moons[timespan_index][moon].push(0);
					}
				}
			}
		}


		for(var moon = 0; moon < this.static_data.moons.length; moon++){
			this.data.repititions.year_moons[moon] = [];
			for(var i = 0; i < this.static_data.moons[moon].granularity; i++){
				this.data.repititions.year_moons[moon].push(0);
			}
		}

		for(var i = 0; i < Object.keys(this.calendar_list.pre_timespans_to_evaluate).length; i++){

			year_index = Object.keys(this.calendar_list.pre_timespans_to_evaluate)[i];

			this.pre_data.repititions.week_days[year_index] = {};
			this.pre_data.repititions.year_moons[year_index] = {};
			this.pre_data.repititions.timespan_moons[year_index] = {};

			for(var j = 0; j < Object.keys(this.calendar_list.pre_timespans_to_evaluate[year_index]).length; j++){

				timespan_index = Object.keys(this.calendar_list.pre_timespans_to_evaluate[year_index])[j];

				this.pre_data.repititions.timespan_moons[year_index][timespan_index] = [];
				for(var moon = 0; moon < this.static_data.moons.length; moon++){
					this.pre_data.repititions.timespan_moons[year_index][timespan_index][moon] = [];
					for(k = 0; k < this.static_data.moons[moon].granularity; k++){
						this.pre_data.repititions.timespan_moons[year_index][timespan_index][moon].push(0);
					}
				}
			}

			for(var j = 0; j < Object.keys(this.calendar_list.pre_timespans_to_evaluate[year_index]).length; j++){

				timespan_index = Object.keys(this.calendar_list.pre_timespans_to_evaluate[year_index])[j];

				this.pre_data.repititions.week_days[year_index][timespan_index] = [];
				for(week_day = 0; week_day < this.calendar_list.pre_timespans_to_evaluate[year_index][timespan_index].week.length; week_day++){
					this.pre_data.repititions.week_days[year_index][timespan_index][week_day] = 0;
				}

			}

			for(var moon = 0; moon < this.static_data.moons.length; moon++){
				this.pre_data.repititions.year_moons[year_index][moon] = [];
				for(k = 0; k < this.static_data.moons[moon].granularity; k++){
					this.pre_data.repititions.year_moons[year_index][moon].push(0);
				}
			}
		}

		for(var i = 0; i < Object.keys(this.calendar_list.post_timespans_to_evaluate).length; i++){

			year_index = Object.keys(this.calendar_list.post_timespans_to_evaluate)[i];

			this.post_data.repititions.week_days[year_index] = {};
			this.post_data.repititions.year_moons[year_index] = {};
			this.post_data.repititions.timespan_moons[year_index] = {};

			for(var j = 0; j < Object.keys(this.calendar_list.post_timespans_to_evaluate[year_index]).length; j++){

				timespan_index = Object.keys(this.calendar_list.post_timespans_to_evaluate[year_index])[j];

				this.post_data.repititions.timespan_moons[year_index][timespan_index] = [];
				for(var moon = 0; moon < this.static_data.moons.length; moon++){
					this.post_data.repititions.timespan_moons[year_index][timespan_index][moon] = [];
					for(k = 0; k < this.static_data.moons[moon].granularity; k++){
						this.post_data.repititions.timespan_moons[year_index][timespan_index][moon].push(0);
					}
				}
			}

			for(var j = 0; j < Object.keys(this.calendar_list.post_timespans_to_evaluate[year_index]).length; j++){

				timespan_index = Object.keys(this.calendar_list.post_timespans_to_evaluate[year_index])[j];

				this.post_data.repititions.week_days[year_index][timespan_index] = [];
				for(week_day = 0; week_day < this.calendar_list.post_timespans_to_evaluate[year_index][timespan_index].week.length; week_day++){
					this.post_data.repititions.week_days[year_index][timespan_index][week_day] = 0;
				}

			}

			for(var moon = 0; moon < this.static_data.moons.length; moon++){
				this.post_data.repititions.year_moons[year_index][moon] = [];
				for(k = 0; k < this.static_data.moons[moon].granularity; k++){
					this.post_data.repititions.year_moons[year_index][moon].push(0);
				}
			}
		}

	},

	add_epoch_data: function(epoch, data){
		this.data.epochs[epoch] = data;
	},

	evaluate_future_calendar_data: function(start_year, end_year, build_seasons){

		if(this.static_data.year_data.timespans.length === 0 || this.static_data.year_data.global_week.length === 0){

			var result = {
				success: false,
				errors: []
			};

			if(this.static_data.year_data.timespans.length === 0){
				result.errors.push("You need at least one month.")
			}

			if(this.static_data.year_data.global_week.length === 0){
				result.errors.push("You need at least one week day.")
			}

			return result;

		}

		this.data.epochs = {};

		for(var i = 0; i < this.static_data.eras.length; i++){
			if(this.static_data.eras[i].settings.starting_era) continue;
			this.static_data.eras[i].year_data = evaluate_calendar_start(this.static_data, convert_year(this.static_data, this.static_data.eras[i].date.year), this.static_data.eras[i].date.timespan, this.static_data.eras[i].date.day);
			this.static_data.eras[i].year_data.era_year = unconvert_year(this.static_data, this.static_data.eras[i].year_data.era_year);
		}

		this.calendar_list = {
			pre_timespans_to_evaluate: {},
			post_timespans_to_evaluate: {}
		}

		var start_year = convert_year(this.static_data, start_year);
		var end_year = convert_year(this.static_data, end_year);
		var adjusted_year = start_year;

		for(year = start_year; year <= end_year; year++){

			this.calendar_list.post_timespans_to_evaluate[year] = {};

			for(timespan = 0; timespan < this.static_data.year_data.timespans.length; timespan++){

				var timespan_object = this.static_data.year_data.timespans[timespan]

				if(is_leap_simple(this.static_data, year, timespan_object.interval, timespan_object.offset)){

					this.calendar_list.post_timespans_to_evaluate[year][timespan] = this.create_adjusted_timespan(year, timespan);

				}

			}

			let percentage = (year-start_year)/(end_year-start_year)
			postMessage({
				percentage: percentage,
				message: "Collecting years to generate...",
				callback: true
			})

			if(Object.keys(this.calendar_list.post_timespans_to_evaluate[year]).length == 0){

				adjusted_year++;
				end_year++;

			}

		}


		var pre_search = 0;
		var post_search = 0;
		
		for(event_index = 0; event_index < this.events.length; event_index++){
			var event = this.events[event_index];
			pre_search = event.data.has_duration && event.data.duration > pre_search ? event.data.duration : pre_search;
			pre_search = event.data.limited_repeat && event.data.limited_repeat_num > pre_search ? event.data.limited_repeat_num : pre_search;
			pre_search = event.data.search_distance > pre_search ? event.data.search_distance : pre_search;
			post_search = event.data.search_distance > post_search ? event.data.search_distance : post_search;
		}

		var days = 0;

		var pre_year = adjusted_year;
		var pre_timespan = Object.keys(this.calendar_list.post_timespans_to_evaluate[adjusted_year])[0];

		if(pre_search != 0){

			while(days < pre_search){

				ending_day = 0;

				if(this.static_data.settings.show_current_month && days == 0){

					num_timespans = pre_timespan-1;
					if(num_timespans < 0){
						pre_year--;
						num_timespans = this.static_data.year_data.timespans.length-1;
					}

				}else{

					pre_year--;

					num_timespans = this.static_data.year_data.timespans.length-1;

				}

				for(var era_index = 0; era_index < this.static_data.eras.length; era_index++){

					era = this.static_data.eras[era_index];

					if(era.settings.ends_year && pre_year == convert_year(this.static_data, era.date.year) && era.date.timespan < num_timespans){

						num_timespans = era.date.timespan;
						ending_day = era.date.day-1;


					}

				}

				this.calendar_list.pre_timespans_to_evaluate[pre_year] = {};

				for(timespan = num_timespans; timespan >= 0; timespan--){

					var timespan_object = this.static_data.year_data.timespans[timespan]

					if(is_leap_simple(this.static_data, pre_year, timespan_object.interval, timespan_object.offset)){

						this.calendar_list.pre_timespans_to_evaluate[pre_year][timespan] = this.create_adjusted_timespan(pre_year, timespan);

						if(ending_day > 0 && timespan == num_timespans){
							this.calendar_list.pre_timespans_to_evaluate[pre_year][timespan].length = ending_day > this.calendar_list.pre_timespans_to_evaluate[pre_year][timespan].length ? this.calendar_list.pre_timespans_to_evaluate[pre_year][timespan].length : ending_day;
						}

						days += this.calendar_list.pre_timespans_to_evaluate[pre_year][timespan].length;

						if(days >= pre_search){
							break;
						}

					}

				}

			}

		}

		days = 0;

		var post_year = end_year;
		var post_timespan = timespan;

		if(post_search != 0){

			while(days < post_search){

				ending_day = 0;

				if(this.static_data.settings.show_current_month && days == 0){

					num_timespans = post_timespan-1;
					if(num_timespans < 0){
						post_year++;
						num_timespans = this.static_data.year_data.timespans.length-1;
					}

				}else{

					post_year++;

					num_timespans = this.static_data.year_data.timespans.length-1;

				}

				for(var era_index = 0; era_index < this.static_data.eras.length; era_index++){

					era = this.static_data.eras[era_index];

					if(era.settings.ends_year && post_year == convert_year(this.static_data, era.date.year) && era.date.timespan < num_timespans){

						num_timespans = era.date.timespan;
						ending_day = era.date.day-1;


					}

				}

				this.calendar_list.post_timespans_to_evaluate[post_year] = {};

				for(timespan = 0; timespan < num_timespans; timespan++){

					var timespan_object = this.static_data.year_data.timespans[timespan]

					if(is_leap_simple(this.static_data, post_year, timespan_object.interval, timespan_object.offset)){

						this.calendar_list.post_timespans_to_evaluate[post_year][timespan] = this.create_adjusted_timespan(post_year, timespan);

						if(ending_day > 0 && timespan == num_timespans){
							this.calendar_list.post_timespans_to_evaluate[post_year][timespan].length = ending_day > this.calendar_list.post_timespans_to_evaluate[post_year][timespan].length ? this.calendar_list.post_timespans_to_evaluate[post_year][timespan].length : ending_day;
						}

						days += this.calendar_list.post_timespans_to_evaluate[post_year][timespan].length;

						if(days >= post_search){
							break;
						}

					}

				}

			}

		}

		this.set_up_repititions();

		if(Object.keys(this.calendar_list.pre_timespans_to_evaluate).length > 0){

			first_eval_year = parseInt(Object.keys(this.calendar_list.pre_timespans_to_evaluate)[0]);

			for(var i = 0; i < Object.keys(this.calendar_list.pre_timespans_to_evaluate).length; i++){

				curr_year = parseInt(Object.keys(this.calendar_list.pre_timespans_to_evaluate)[i]);

				if(first_eval_year > curr_year){
					first_eval_year = curr_year;
				}

			}

			first_eval_month = parseInt(Object.keys(this.calendar_list.pre_timespans_to_evaluate[first_eval_year])[0]);

		}else{

			first_eval_year = parseInt(Object.keys(this.calendar_list.post_timespans_to_evaluate)[0]);
			first_eval_month = parseInt(Object.keys(this.calendar_list.post_timespans_to_evaluate[first_eval_year])[0]);

		}

		var start_data = evaluate_calendar_start(this.static_data, first_eval_year, first_eval_month);
		var era_year = unconvert_year(this.static_data, start_data.era_year);
		var count_timespans = start_data.count_timespans;
		var num_timespans = start_data.num_timespans;
		var total_week_num = start_data.total_week_num;
		var week_day = start_data.week_day;
		var epoch = start_data.epoch;
		var start_epoch = epoch;

		var current_era = -1;

		for(var i = 0; i < this.static_data.eras.length; i++){
			if(epoch >= this.static_data.eras[i].date.epoch){
				current_era = i;
			}
		}
		
		if(this.static_data.eras[current_era] && this.static_data.eras[current_era].settings.restart){
			era_year = 0;
		}

		let year_start_data = evaluate_calendar_start(this.static_data, first_eval_year);
		var year_day = 1 + start_data.epoch - year_start_data.epoch;
		var year_week_num = 1 + start_data.total_week_num - year_start_data.total_week_num;

		var order = Object.keys(this.calendar_list.pre_timespans_to_evaluate);

		if(order[0] > order[order.length-1]){
			order.reverse();
        }

		for(var year_i = 0; year_i < order.length; year_i++){

			var year_start_epoch = epoch;

			year_index = parseInt(order[year_i]);

			timespan_list = this.calendar_list.pre_timespans_to_evaluate[year_index];

			for(var i = 0; i < Object.keys(timespan_list).length; i++){

				let month_start_epoch = epoch;

				timespan_index = parseInt(Object.keys(timespan_list)[i]);

				count_timespans[timespan_index]++;
				num_timespans++;

				current_timespan = timespan_list[timespan_index];

				month_week_num = 1;

				if(!this.static_data.year_data.overflow){
					week_day = 1;
				}

				for(day = 0, timespan_day = 1; day <= current_timespan.length; day++){

					if(this.static_data.eras.length > 0 && this.static_data.eras[current_era+1] && epoch >= this.static_data.eras[current_era+1].date.epoch){
						current_era++;
						if(current_era != -1 && this.static_data.eras[current_era].settings.restart){
							era_year = 0;
						}
					}

					moon_data = [];

					if(day == 0){
						for(leap_day_index = 0; leap_day_index < current_timespan.leap_days.length; leap_day_index++){
							leap_day = current_timespan.leap_days[leap_day_index];
							if(leap_day.intercalary && leap_day.day === day){

								data = {
									'year': unconvert_year(this.static_data, year_index),
									'era_year': unconvert_year(this.static_data, era_year),

									'timespan_index': undefined,
									'timespan_number': undefined,
									'timespan_count': undefined,
									'num_timespans': undefined,
									'timespan_name': undefined,

									'epoch': epoch,
									'day': timespan_day,
									'inverse_day': 1+current_timespan.length-day,
									'year_day': year_day,
									'week_day': undefined,
									'week_day_name': undefined,

									'inverse_month_week_num': undefined,
									'inverse_year_week_num': undefined,
									'month_week_num': undefined,
									'year_week_num': undefined,
									'total_week_num': undefined,

									'moon_phase': [],
									'moon_phase_num_epoch': [],
									'moon_phase_num_month': [],
									'moon_phase_num_year': [],

									'intercalary': true,
									'leap_day': leap_day.index,

									'era': current_era

								}

								data.current_cycle = get_cycle(this.static_data, data).array;

								data = this.add_moon_data(
									this.pre_data.repititions.year_moons[year_index],
									this.pre_data.repititions.timespan_moons[year_index][timespan_index],
									epoch,
									data
								);

								this.add_epoch_data(epoch, data);

								epoch++;
								year_day++;
								timespan_day++;
							}
						}
					}

					if(day > 0){

						data = {
							'year': unconvert_year(this.static_data, year_index),
							'era_year': unconvert_year(this.static_data, era_year),

							'timespan_index': timespan_index,
							'timespan_number': i,
							'timespan_count': count_timespans[timespan_index],
							'num_timespans': num_timespans,
							'timespan_name': current_timespan.name,

							'epoch': epoch,
							'day': timespan_day,
							'inverse_day': 1+current_timespan.length-day,
							'year_day': year_day,
							'week_day': current_timespan.type !== "intercalary" ? week_day : undefined,
							'week_day_name': current_timespan.type !== "intercalary" ? current_timespan.week[week_day-1] : undefined,

							'inverse_month_week_num': undefined,
							'inverse_year_week_num': undefined,
							'month_week_num': current_timespan.type !== "intercalary" ? month_week_num : undefined,
							'year_week_num': current_timespan.type !== "intercalary" ? year_week_num : undefined,
							'total_week_num': current_timespan.type !== "intercalary" ? total_week_num : undefined,



							'moon_phase': [],
							'moon_phase_num_epoch': [],
							'moon_phase_num_month': [],
							'moon_phase_num_year': [],

							'intercalary': current_timespan.type === "intercalary",

							'era': current_era
						}

						data.current_cycle = get_cycle(this.static_data, data).array;

						if(current_timespan.type !== "intercalary"){

							this.pre_data.repititions.week_days[year_index][data.timespan_index][data.week_day-1]++;
							data.week_day_num = this.pre_data.repititions.week_days[year_index][data.timespan_index][data.week_day-1];

						}

						data = this.add_moon_data(
							this.pre_data.repititions.year_moons[year_index],
							this.pre_data.repititions.timespan_moons[year_index][timespan_index],
							epoch,
							data
						);

						this.add_epoch_data(epoch, data);
						epoch++;
						year_day++;
						timespan_day++;

						if(current_timespan.type !== "intercalary"){

							week_day++;

							if(week_day > current_timespan.week.length){
								week_day = 1;
								month_week_num++;
								year_week_num++;
								total_week_num++;
							}

						}

						for(leap_day_index = 0; leap_day_index < current_timespan.leap_days.length; leap_day_index++){
							leap_day = current_timespan.leap_days[leap_day_index];
							if(leap_day.intercalary && leap_day.day === day){

								data = {
									'year': unconvert_year(this.static_data, year_index),
									'era_year': unconvert_year(this.static_data, era_year),

									'timespan_index': undefined,
									'timespan_number': undefined,
									'timespan_count': undefined,
									'num_timespans': undefined,
									'timespan_name': undefined,

									'epoch': epoch,
									'day': timespan_day,
									'inverse_day': 1+current_timespan.length-day,
									'year_day': year_day,
									'week_day': undefined,
									'week_day_name': undefined,

									'inverse_month_week_num': undefined,
									'inverse_year_week_num': undefined,
									'month_week_num': undefined,
									'year_week_num': undefined,
									'total_week_num': undefined,

									'moon_phase': [],
									'moon_phase_num_epoch': [],
									'moon_phase_num_month': [],
									'moon_phase_num_year': [],

									'intercalary': true,
									'leap_day': leap_day.index,

									'era': current_era
								}

								data.current_cycle = get_cycle(this.static_data, data).array;

								data = this.add_moon_data(
									this.pre_data.repititions.year_moons[year_index],
									this.pre_data.repititions.timespan_moons[year_index][timespan_index],
									epoch,
									data
								);

								this.add_epoch_data(epoch, data);
								epoch++;
								year_day++;
								timespan_day++;
							}
						}
					}
				}

				if(!this.static_data.year_data.overflow){
					year_week_num++;
					total_week_num++;
				}

				let highest_month_week_num = this.data.epochs[epoch-1].month_week_num;
				let week_day_nums = {};

				for(var j = epoch-1; j >= month_start_epoch; j--){

					let current_month_week_num = this.data.epochs[j].month_week_num;
					let inverse_month_week_num = (highest_month_week_num-current_month_week_num)+1;
					this.data.epochs[j].inverse_month_week_num = inverse_month_week_num;

					if(week_day_nums[this.data.epochs[j].week_day] === undefined){
						week_day_nums[this.data.epochs[j].week_day] = 1;
					}else{
						week_day_nums[this.data.epochs[j].week_day]++;
					}
	
					this.data.epochs[j].inverse_week_day_num = week_day_nums[this.data.epochs[j].week_day];

				}
			}
			if(year_index != convert_year(this.static_data, this.dynamic_data.year)) year_day = 1;

			if(this.static_data.eras.length != 0 && current_era != -1){
				if(this.static_data.eras[current_era].settings.ends_year){
					if(!this.static_data.eras[current_era].settings.restart){
						era_year++;
					}
				}else{
					era_year++;
				}
			}else{
				era_year++;
			}

			let highest_year_week_num = this.data.epochs[epoch-1].year_week_num;
			for(var j = epoch-1; j >= year_start_epoch; j--){
				let current_year_week_num = this.data.epochs[j].year_week_num;
				let inverse_year_week_num = (highest_year_week_num-current_year_week_num)+1;
				this.data.epochs[j].inverse_year_week_num = inverse_year_week_num;
			}

		}

        if(build_seasons){
            var climate_generator = new Climate(this.data.epochs, this.static_data, this.dynamic_data, unconvert_year(this.static_data, first_eval_year), start_epoch, epoch-1, true);
            this.data.epochs = climate_generator.generate()
        }

		if(!this.static_data.settings.show_current_month){
			year_day = 1;
		}

		order = Object.keys(this.calendar_list.post_timespans_to_evaluate);

		let post_epoch = epoch;
        
        execution_time.start();

		for(var year_i = 0; year_i < order.length; year_i++){

			var year_start_epoch = epoch;

			year_index = parseInt(order[year_i]);

			timespan_list = this.calendar_list.post_timespans_to_evaluate[year_index];

			for(var i = 0; i < Object.keys(timespan_list).length; i++){

				let month_start_epoch = epoch;

				timespan_index = parseInt(Object.keys(timespan_list)[i]);

				count_timespans[timespan_index]++;
				num_timespans++;

				current_timespan = timespan_list[timespan_index];

				month_week_num = 1;

				if(!this.static_data.year_data.overflow){
					week_day = 1;
				}

				for(day = 0, timespan_day = 1; day <= current_timespan.length; day++){

					if(this.static_data.eras.length > 0 && this.static_data.eras[current_era+1] && epoch >= this.static_data.eras[current_era+1].date.epoch){
						current_era++;
						if(current_era != -1 && this.static_data.eras[current_era].settings.restart){
							era_year = 0;
						}
					}

					moon_data = [];

					if(day == 0){
						for(leap_day_index = 0; leap_day_index < current_timespan.leap_days.length; leap_day_index++){
							leap_day = current_timespan.leap_days[leap_day_index];
							if(leap_day.intercalary && leap_day.day === day){

								data = {
									'year': unconvert_year(this.static_data, year_index),
									'era_year': unconvert_year(this.static_data, era_year),

									'timespan_index': undefined,
									'timespan_number': undefined,
									'timespan_count': undefined,
									'num_timespans': undefined,
									'timespan_name': undefined,

									'epoch': epoch,
									'day': timespan_day,
									'inverse_day': 1+current_timespan.length-day,
									'year_day': year_day,
									'week_day': undefined,
									'week_day_name': undefined,

									'inverse_month_week_num': undefined,
									'inverse_year_week_num': undefined,
									'month_week_num': undefined,
									'year_week_num': undefined,
									'total_week_num': undefined,

									'moon_phase': [],
									'moon_phase_num_epoch': [],
									'moon_phase_num_month': [],
									'moon_phase_num_year': [],

									'intercalary': true,
									'leap_day': leap_day.index,

									'era': current_era

								}

								data.current_cycle = get_cycle(this.static_data, data).array;

								data = this.add_moon_data(
									this.post_data.repititions.year_moons[year_index],
									this.post_data.repititions.timespan_moons[year_index][timespan_index],
									epoch,
									data
								);

								this.add_epoch_data(epoch, data);

								epoch++;
								year_day++;
								timespan_day++;
							}
						}
					}

					if(day > 0){

						data = {
							'year': unconvert_year(this.static_data, year_index),
							'era_year': unconvert_year(this.static_data, era_year),

							'timespan_index': timespan_index,
							'timespan_number': i,
							'timespan_count': count_timespans[timespan_index],
							'num_timespans': num_timespans,
							'timespan_name': current_timespan.name,

							'epoch': epoch,
							'day': timespan_day,
							'inverse_day': 1+current_timespan.length-day,
							'year_day': year_day,
							'week_day': current_timespan.type !== "intercalary" ? week_day : undefined,
							'week_day_name': current_timespan.type !== "intercalary" ? current_timespan.week[week_day-1] : undefined,

							'inverse_month_week_num': undefined,
							'inverse_year_week_num': undefined,
							'month_week_num': current_timespan.type !== "intercalary" ? month_week_num : undefined,
							'year_week_num': current_timespan.type !== "intercalary" ? year_week_num : undefined,
							'total_week_num': current_timespan.type !== "intercalary" ? total_week_num : undefined,

							'moon_phase': [],
							'moon_phase_num_epoch': [],
							'moon_phase_num_month': [],
							'moon_phase_num_year': [],

							'intercalary': current_timespan.type === "intercalary",

							'era': current_era

						}

						data.current_cycle = get_cycle(this.static_data, data).array;

						if(current_timespan.type !== "intercalary"){

							this.post_data.repititions.week_days[year_index][data.timespan_index][data.week_day-1]++;
							data.week_day_num = this.post_data.repititions.week_days[year_index][data.timespan_index][data.week_day-1];

						}

						data = this.add_moon_data(
							this.post_data.repititions.year_moons[year_index],
							this.post_data.repititions.timespan_moons[year_index][timespan_index],
							epoch,
							data
						);

						this.add_epoch_data(epoch, data);
						epoch++;
						year_day++;
						timespan_day++;

						if(current_timespan.type !== "intercalary"){

							week_day++;

							if(week_day > current_timespan.week.length){
								week_day = 1;
								month_week_num++;
								year_week_num++;
								total_week_num++;
							}

						}

						for(leap_day_index = 0; leap_day_index < current_timespan.leap_days.length; leap_day_index++){
							leap_day = current_timespan.leap_days[leap_day_index];
							if(leap_day.intercalary && leap_day.day === day){

								data = {
									'year': unconvert_year(this.static_data, year_index),
									'era_year': unconvert_year(this.static_data, era_year),

									'timespan_index': undefined,
									'timespan_number': undefined,
									'timespan_count': undefined,
									'num_timespans': undefined,
									'timespan_name': undefined,

									'epoch': epoch,
									'day': timespan_day,
									'inverse_day': 1+current_timespan.length-day,
									'year_day': year_day,
									'week_day': undefined,
									'week_day_name': undefined,

									'inverse_month_week_num': undefined,
									'inverse_year_week_num': undefined,
									'month_week_num': undefined,
									'year_week_num': undefined,
									'total_week_num': undefined,

									'moon_phase': [],
									'moon_phase_num_epoch': [],
									'moon_phase_num_month': [],
									'moon_phase_num_year': [],

									'intercalary': true,
									'leap_day': leap_day.index,

									'era': current_era
								}

								data.current_cycle = get_cycle(this.static_data, data).array;

								data = this.add_moon_data(
									this.post_data.repititions.year_moons[year_index],
									this.post_data.repititions.timespan_moons[year_index][timespan_index],
									epoch,
									data
								);

								this.add_epoch_data(epoch, data);
								epoch++;
								year_day++;
								timespan_day++;
							}
						}
					}
				}

				if(!this.static_data.year_data.overflow){
					year_week_num++;
					total_week_num++;
				}

				let highest_month_week_num = this.data.epochs[epoch-1].month_week_num;
				let week_day_nums = {};

				for(var j = epoch-1; j >= month_start_epoch; j--){

					let current_month_week_num = this.data.epochs[j].month_week_num;
					let inverse_month_week_num = (highest_month_week_num-current_month_week_num)+1;
					this.data.epochs[j].inverse_month_week_num = inverse_month_week_num;

					if(week_day_nums[this.data.epochs[j].week_day] === undefined){
						week_day_nums[this.data.epochs[j].week_day] = 1;
					}else{
						week_day_nums[this.data.epochs[j].week_day]++;
					}

					this.data.epochs[j].inverse_week_day_num = week_day_nums[this.data.epochs[j].week_day];

				}

				let percentage = (year_index-start_year)/(end_year-start_year)
				postMessage({
					percentage: percentage,
					message: "Generating future calendar data...",
					callback: true
				})

			}
			if(year_index != convert_year(this.static_data, this.dynamic_data.year)) year_day = 1;
			if(this.static_data.eras.length != 0 && current_era != -1){
				if(this.static_data.eras[current_era].settings.ends_year){
					if(!this.static_data.eras[current_era].settings.restart){
						era_year++;
					}
				}else{
					era_year++;
				}
			}else{
				era_year++;
			}

			let highest_year_week_num = this.data.epochs[epoch-1].year_week_num;
			for(var j = epoch-1; j >= year_start_epoch; j--){
				let current_year_week_num = this.data.epochs[j].year_week_num;
				let inverse_year_week_num = (highest_year_week_num-current_year_week_num)+1;
				this.data.epochs[j].inverse_year_week_num = inverse_year_week_num;
			}
		}

        if(build_seasons){
            var climate_generator = new Climate(this.data.epochs, this.static_data, this.dynamic_data, unconvert_year(this.static_data, parseInt(order[0])), post_epoch, epoch-1, true);
            this.data.epochs = climate_generator.generate()
        }

		return {
			epoch_data: this.data.epochs,
			start_epoch: start_epoch,
			end_epoch: epoch
		};

	},

	evaluate_calendar_data: function(){

		if(this.static_data.year_data.timespans.length === 0 || this.static_data.year_data.global_week.length === 0){

			var result = {
				success: false,
				errors: []
			};

			if(this.static_data.year_data.timespans.length === 0){
				result.errors.push("You need at least one month.")
			}

			if(this.static_data.year_data.global_week.length === 0){
				result.errors.push("You need at least one week day.")
			}

			return result;

		}

		this.data.epochs = {};

		for(var i = 0; i < this.static_data.eras.length; i++){
			if(this.static_data.eras[i].settings.starting_era) continue;
			this.static_data.eras[i].date.epoch = evaluate_calendar_start(this.static_data, convert_year(this.static_data, this.static_data.eras[i].date.year), this.static_data.eras[i].date.timespan, this.static_data.eras[i].date.day).epoch;
		}

		this.calendar_list = {
			pre_timespans_to_evaluate: {},
			timespans_to_build: {},
			post_timespans_to_evaluate: {}
		}

		// If the setting is on, only select the current month to be calculated
		if(this.static_data.settings.show_current_month){

			this.calendar_list.timespans_to_build[this.dynamic_data.timespan] = this.create_adjusted_timespan(convert_year(this.static_data, this.dynamic_data.year), this.dynamic_data.timespan);

		}else{

			num_timespans = this.static_data.year_data.timespans.length;
			ending_day = 0;

			for(var era_index = 0; era_index < this.static_data.eras.length; era_index++){

				era = this.static_data.eras[era_index];

				if(era.settings.ends_year && convert_year(this.static_data, this.dynamic_data.year) == convert_year(this.static_data, era.date.year) && era.date.timespan < num_timespans+1){

					num_timespans = era.date.timespan+1;
					ending_day = era.date.day;

				}

			}

			for(timespan = 0; timespan < num_timespans; timespan++){

				var timespan_object = this.static_data.year_data.timespans[timespan];

				var timespan_data = this.create_adjusted_timespan(convert_year(this.static_data, this.dynamic_data.year), timespan);

				if(is_leap_simple(this.static_data, convert_year(this.static_data, this.dynamic_data.year), timespan_object.interval, timespan_object.offset) && timespan_data.length > 0){

					this.calendar_list.timespans_to_build[timespan] = timespan_data;

					if(ending_day > 0 && timespan == num_timespans-1){
						this.calendar_list.timespans_to_build[timespan].length = ending_day > this.calendar_list.timespans_to_build[timespan].length ? this.calendar_list.timespans_to_build[timespan].length : ending_day;
					}

				}

			}

		}


		pre_search = 0;
		post_search = 0;
		for(event_index = 0; event_index < this.events.length; event_index++){
			var event = this.events[event_index];
			pre_search = event.data.has_duration && event.data.duration > pre_search ? event.data.duration : pre_search;
			pre_search = event.data.limited_repeat && event.data.limited_repeat_num > pre_search ? event.data.limited_repeat_num : pre_search;
			pre_search = event.data.search_distance > pre_search ? event.data.search_distance : pre_search;
			post_search = event.data.search_distance > post_search ? event.data.search_distance : post_search;
			this.events[event_index].data.search_distance = pre_search > post_search ? pre_search : post_search;
		}

		days = 0;

		timespan = parseInt(Object.keys(this.calendar_list.timespans_to_build)[0]);
		year = convert_year(this.static_data, this.dynamic_data.year);

		pre_year = convert_year(this.static_data, this.dynamic_data.year);
		pre_timespan = parseInt(Object.keys(this.calendar_list.timespans_to_build)[0]);

		if(pre_search != 0){

			while(days < pre_search){

				ending_day = 0;

				if(this.static_data.settings.show_current_month && days == 0){

					num_timespans = pre_timespan-1;
					if(num_timespans < 0){
						pre_year--;
						num_timespans = this.static_data.year_data.timespans.length-1;
					}

				}else{

					pre_year--;

					num_timespans = this.static_data.year_data.timespans.length-1;

				}

				for(var era_index = 0; era_index < this.static_data.eras.length; era_index++){

					era = this.static_data.eras[era_index];

					if(era.settings.ends_year && pre_year == convert_year(this.static_data, era.date.year) && era.date.timespan < num_timespans){

						num_timespans = era.date.timespan;
						ending_day = era.date.day-1;

					}

				}

				this.calendar_list.pre_timespans_to_evaluate[pre_year] = {};

				for(var timespan_index = num_timespans; timespan_index >= 0; timespan_index--){

					var timespan_object = this.static_data.year_data.timespans[timespan_index];

					if(is_leap_simple(this.static_data, pre_year, timespan_object.interval, timespan_object.offset)){

						this.calendar_list.pre_timespans_to_evaluate[pre_year][timespan_index] = this.create_adjusted_timespan(pre_year, timespan_index);

						if(ending_day > 0 && timespan_index == num_timespans){
							this.calendar_list.pre_timespans_to_evaluate[pre_year][timespan_index].length = ending_day > this.calendar_list.pre_timespans_to_evaluate[pre_year][timespan_index].length ? this.calendar_list.pre_timespans_to_evaluate[pre_year][timespan].length : ending_day;
						}

						days += this.calendar_list.pre_timespans_to_evaluate[pre_year][timespan_index].length;

						if(days >= pre_search){
							break;
						}

					}

				}

			}

		}

		days = 0;

		post_year = convert_year(this.static_data, this.dynamic_data.year);
		post_timespan = parseInt(Object.keys(this.calendar_list.timespans_to_build)[0]);

		if(post_search != 0){

			if(!this.static_data.settings.show_current_month){
				post_timespan = 0;
				post_year++;
			}else{
				post_timespan++;
				if(post_timespan > this.static_data.year_data.timespans.length-1){
					post_timespan = 0;
					post_year++;
				}
			}

			while(days < post_search){

				var era_ended = 0;
				var ending_day = 0;

				for(var era_index = 0; era_index < this.static_data.eras.length; era_index++){

					era = this.static_data.eras[era_index];

					if(era.settings.ends_year && post_year == convert_year(this.static_data, era.date.year)){

						era_ended = true;
						ending_day = era.date.day-1;
						ending_timespan = era.date.timespan;

					}

				}

				for(var timespan_index = post_timespan; timespan_index < this.static_data.year_data.timespans.length-1; timespan_index++){

					var timespan_object = this.static_data.year_data.timespans[timespan_index];

					if(is_leap_simple(this.static_data, post_year, timespan_object.interval, timespan_object.offset)){

						if(this.calendar_list.post_timespans_to_evaluate[post_year] === undefined){
							this.calendar_list.post_timespans_to_evaluate[post_year] = {};
						}

						this.calendar_list.post_timespans_to_evaluate[post_year][timespan_index] = this.create_adjusted_timespan(post_year, timespan_index);

						if(era_ended && timespan_index == ending_timespan){
							this.calendar_list.post_timespans_to_evaluate[post_year][timespan_index].length = ending_day > this.calendar_list.post_timespans_to_evaluate[post_year][timespan_index].length ? this.calendar_list.post_timespans_to_evaluate[post_year][timespan].length : ending_day;
						}

						days += this.calendar_list.post_timespans_to_evaluate[post_year][timespan_index].length;

						if(days >= post_search){
							break;
						}

					}

				}

				post_year++;
				post_timespan = 0;

			}

		}

		this.set_up_repititions();

		if(Object.keys(this.calendar_list.pre_timespans_to_evaluate).length > 0){

			first_eval_year = parseInt(Object.keys(this.calendar_list.pre_timespans_to_evaluate)[0]);

			for(var i = 0; i < Object.keys(this.calendar_list.pre_timespans_to_evaluate).length; i++){

				curr_year = parseInt(Object.keys(this.calendar_list.pre_timespans_to_evaluate)[i]);

				if(first_eval_year > curr_year){
					first_eval_year = curr_year;
				}

			}

			first_eval_month = parseInt(Object.keys(this.calendar_list.pre_timespans_to_evaluate[first_eval_year])[0]);

		}else{

			first_eval_year = convert_year(this.static_data, this.dynamic_data.year);
			first_eval_month = parseInt(Object.keys(this.calendar_list.timespans_to_build)[0]);

		}

		start_data = evaluate_calendar_start(this.static_data, first_eval_year, first_eval_month, undefined, true);
		era_year = start_data.era_year;
		count_timespans = start_data.count_timespans;
		num_timespans = start_data.num_timespans;
		total_week_num = start_data.total_week_num
		week_day = start_data.week_day;
		epoch = start_data.epoch;

		var current_era = -1;

		for(var i = 0; i < this.static_data.eras.length; i++){
			if(epoch >= this.static_data.eras[i].date.epoch){
				current_era = i;
			}
		}
		
		if(this.static_data.eras[0] && current_era == -1 && this.static_data.eras[0].settings.starting_era){
			current_era = 0;
		}
		
		if(this.static_data.eras[current_era] && epoch == this.static_data.eras[current_era].date.epoch && this.static_data.eras[current_era].settings.restart){
			era_year = 0;
		}
		
		let year_start_data = evaluate_calendar_start(this.static_data, first_eval_year);
		year_day = 1 + start_data.epoch - year_start_data.epoch;
		year_week_num = 1 + start_data.total_week_num - year_start_data.total_week_num;

		order = Object.keys(this.calendar_list.pre_timespans_to_evaluate);

		if(order[0] > order[order.length-1]){
			order.reverse();
		}

		for(var year_i = 0; year_i < order.length; year_i++){

			year_index = parseInt(order[year_i]);

			timespan_list = this.calendar_list.pre_timespans_to_evaluate[year_index];

			let year_start_epoch = epoch;

			for(var i = 0; i < Object.keys(timespan_list).length; i++){

				timespan_index = parseInt(Object.keys(timespan_list)[i]);

				count_timespans[timespan_index]++;
				num_timespans++;

				current_timespan = timespan_list[timespan_index];

				month_week_num = 1;

				if(!this.static_data.year_data.overflow){
					week_day = 1;
				}

				let month_start_epoch = epoch;

				for(day = 0, timespan_day = 1; day <= current_timespan.length; day++){

					if(this.static_data.eras[current_era+1] && epoch >= this.static_data.eras[current_era+1].date.epoch){
						current_era++;
						if(this.static_data.eras[current_era].settings.restart){
							era_year = 0;
						}

					}

					moon_data = [];

					if(day == 0){
						for(leap_day_index = 0; leap_day_index < current_timespan.leap_days.length; leap_day_index++){
							leap_day = current_timespan.leap_days[leap_day_index];
							if(leap_day.intercalary && leap_day.day === day){

								data = {
									'year': unconvert_year(this.static_data, year_index),
									'era_year': unconvert_year(this.static_data, era_year),

									'timespan_index': undefined,
									'timespan_number': undefined,
									'timespan_count': undefined,
									'num_timespans': undefined,
									'timespan_name': undefined,

									'epoch': epoch,
									'day': timespan_day,
									'inverse_day': 1+current_timespan.length-day,
									'year_day': year_day,
									'week_day': undefined,
									'week_day_name': undefined,

									'inverse_month_week_num': undefined,
									'inverse_year_week_num': undefined,
									'month_week_num': undefined,
									'year_week_num': undefined,
									'total_week_num': undefined,

									'moon_phase': [],
									'moon_phase_num_epoch': [],
									'moon_phase_num_month': [],
									'moon_phase_num_year': [],

									'intercalary': true,
									'leap_day': leap_day.index,

									'era': current_era

								}

								data.current_cycle = get_cycle(this.static_data, data).array;

								data = this.add_moon_data(
									this.pre_data.repititions.year_moons[year_index],
									this.pre_data.repititions.timespan_moons[year_index][timespan_index],
									epoch,
									data
								);

								this.add_epoch_data(epoch, data);

								epoch++;
								year_day++;
								timespan_day++;
							}
						}
					}

					if(day > 0){

						data = {
							'year': unconvert_year(this.static_data, year_index),
							'era_year': unconvert_year(this.static_data, era_year),

							'timespan_index': timespan_index,
							'timespan_number': i,
							'timespan_count': count_timespans[timespan_index],
							'num_timespans': num_timespans,
							'timespan_name': current_timespan.name,

							'epoch': epoch,
							'day': timespan_day,
							'inverse_day': 1+current_timespan.length-day,
							'year_day': year_day,
							'week_day': current_timespan.type !== "intercalary" ? week_day : undefined,
							'week_day_name': current_timespan.type !== "intercalary" ? current_timespan.week[week_day-1] : undefined,

							'inverse_month_week_num': undefined,
							'inverse_year_week_num': undefined,
							'month_week_num': current_timespan.type !== "intercalary" ? month_week_num : undefined,
							'year_week_num': current_timespan.type !== "intercalary" ? year_week_num : undefined,
							'total_week_num': current_timespan.type !== "intercalary" ? total_week_num : undefined,



							'moon_phase': [],
							'moon_phase_num_epoch': [],
							'moon_phase_num_month': [],
							'moon_phase_num_year': [],

							'intercalary': current_timespan.type === "intercalary",

							'era': current_era

						}

						data.current_cycle = get_cycle(this.static_data, data).array;

						if(current_timespan.type !== "intercalary"){

							this.pre_data.repititions.week_days[year_index][data.timespan_index][data.week_day-1]++;
							data.week_day_num = this.pre_data.repititions.week_days[year_index][data.timespan_index][data.week_day-1];

						}

						data = this.add_moon_data(
							this.pre_data.repititions.year_moons[year_index],
							this.pre_data.repititions.timespan_moons[year_index][timespan_index],
							epoch,
							data
						);

						this.add_epoch_data(epoch, data);
						epoch++;
						year_day++;
						timespan_day++;

						if(current_timespan.type !== "intercalary"){

							week_day++;

							if(week_day > current_timespan.week.length){
								week_day = 1;
								month_week_num++;
								year_week_num++;
								total_week_num++;
							}

						}

						for(leap_day_index = 0; leap_day_index < current_timespan.leap_days.length; leap_day_index++){
							leap_day = current_timespan.leap_days[leap_day_index];
							if(leap_day.intercalary && leap_day.day === day){

								data = {
									'year': unconvert_year(this.static_data, year_index),
									'era_year': unconvert_year(this.static_data, era_year),

									'timespan_index': undefined,
									'timespan_number': undefined,
									'timespan_count': undefined,
									'num_timespans': undefined,
									'timespan_name': undefined,

									'epoch': epoch,
									'day': timespan_day,
									'inverse_day': 1+current_timespan.length-day,
									'year_day': year_day,
									'week_day': undefined,
									'week_day_name': undefined,

									'inverse_month_week_num': undefined,
									'inverse_year_week_num': undefined,
									'month_week_num': undefined,
									'year_week_num': undefined,
									'total_week_num': undefined,

									'moon_phase': [],
									'moon_phase_num_epoch': [],
									'moon_phase_num_month': [],
									'moon_phase_num_year': [],

									'intercalary': true,
									'leap_day': leap_day.index,

									'era': current_era

								}

								data.current_cycle = get_cycle(this.static_data, data).array;

								data = this.add_moon_data(
									this.pre_data.repititions.year_moons[year_index],
									this.pre_data.repititions.timespan_moons[year_index][timespan_index],
									epoch,
									data
								);

								this.add_epoch_data(epoch, data);
								epoch++;
								year_day++;
								timespan_day++;
							}
						}
					}
				}

				let highest_month_week_num = this.data.epochs[epoch-1].month_week_num;
				let week_day_nums = {};

				for(var j = epoch-1; j >= month_start_epoch; j--){

					let current_month_week_num = this.data.epochs[j].month_week_num;
					let inverse_month_week_num = (highest_month_week_num-current_month_week_num)+1;
					this.data.epochs[j].inverse_month_week_num = inverse_month_week_num;

					if(week_day_nums[this.data.epochs[j].week_day] === undefined){
						week_day_nums[this.data.epochs[j].week_day] = 1;
					}else{
						week_day_nums[this.data.epochs[j].week_day]++;
					}
	
					this.data.epochs[j].inverse_week_day_num = week_day_nums[this.data.epochs[j].week_day];

				}

				if(!this.static_data.year_data.overflow){
					year_week_num++;
					total_week_num++;
				}
			}

			let highest_year_week_num = this.data.epochs[epoch-1].year_week_num;
			for(var j = epoch-1; j >= year_start_epoch; j--){
				let current_year_week_num = this.data.epochs[j].year_week_num;
				let inverse_year_week_num = (highest_year_week_num-current_year_week_num)+1;
				this.data.epochs[j].inverse_year_week_num = inverse_year_week_num;
			}

			if(year_index !== convert_year(this.static_data, this.dynamic_data.year)){
				if(this.static_data.eras.length > 0 && current_era != -1){				
					if(this.static_data.eras[current_era].settings.ends_year){
						if(!this.static_data.eras[current_era].settings.restart){
							era_year++;
						}
					}else{
						era_year++;
					}
				}else{
					era_year++;
				}
				year_day = 1;
			}

		}

		if(!this.static_data.settings.show_current_month){
			year_day = 1;
		}

		first_epoch = epoch;
		first_week_day = week_day;
		year_week_num = 1;

		var calendar_year_day = year_day;
		var calendar_era_year = era_year;
		var calendar_start_epoch = first_epoch;

		for(var i = 0; i < Object.keys(this.calendar_list.timespans_to_build).length; i++){

			timespan_index = parseInt(Object.keys(this.calendar_list.timespans_to_build)[i]);

			total_day = 0;

			count_timespans[timespan_index]++;
			num_timespans++;

			current_timespan = this.calendar_list.timespans_to_build[timespan_index];

			month_week_num = 1;

			if(!this.static_data.year_data.overflow){
				week_day = 1;
			}

			let month_start_epoch = epoch;

			for(day = 0, timespan_day = 1; day <= current_timespan.length; day++){

				if(this.static_data.eras.length > 0 && this.static_data.eras[current_era+1] && epoch >= this.static_data.eras[current_era+1].date.epoch){
					current_era++;
					if(current_era != -1 && this.static_data.eras[current_era].settings.restart){
						era_year = 0;
						calendar_era_year = 0;
					}
				}

				moon_data = [];

				if(day == 0){

					total_day++;

					for(leap_day_index = 0; leap_day_index < current_timespan.leap_days.length; leap_day_index++){

						leap_day = current_timespan.leap_days[leap_day_index];

						if(leap_day.intercalary && leap_day.day === day){

							data = {
								'year': this.dynamic_data.year,
								'era_year': unconvert_year(this.static_data, era_year),

								'timespan_index': undefined,
								'timespan_number': undefined,
								'timespan_count': undefined,
								'num_timespans': undefined,
								'timespan_name': undefined,

								'epoch': epoch,
								'day': timespan_day,
								'year_day': year_day,
								'week_day': undefined,
								'week_day_name': undefined,

								'inverse_month_week_num': undefined,
								'inverse_year_week_num': undefined,
								'month_week_num': undefined,
								'year_week_num': undefined,
								'total_week_num': undefined,



								'moon_phase': [],
								'moon_phase_num_epoch': [],
								'moon_phase_num_month': [],
								'moon_phase_num_year': [],

								'intercalary': true,
								'leap_day': leap_day.index,

								'era': current_era

							}

							data.current_cycle = get_cycle(this.static_data, data).array;

							data = this.add_moon_data(
								this.data.repititions.year_moons,
								this.data.repititions.timespan_moons[timespan_index],
								epoch,
								data
							);

							this.add_epoch_data(epoch, data);

							epoch++;

							year_day++;

							total_day++;

							timespan_day++;

						}

					}

					total_day--;

				}

				if(day > 0){

					data = {
						'year': this.dynamic_data.year,
						'era_year': unconvert_year(this.static_data, era_year),

						'timespan_index': timespan_index,
						'timespan_number': i,
						'timespan_count': count_timespans[timespan_index],
						'num_timespans': num_timespans,
						'timespan_name': current_timespan.name,

						'epoch': epoch,
						'day': timespan_day,
						'inverse_day': 1+current_timespan.length-day,
						'year_day': year_day,
						'week_day': current_timespan.type !== "intercalary" ? week_day : undefined,
						'week_day_name': current_timespan.type !== "intercalary" ? current_timespan.week[week_day-1] : undefined,

						'inverse_month_week_num': undefined,
						'inverse_year_week_num': undefined,
						'month_week_num': current_timespan.type !== "intercalary" ? month_week_num : undefined,
						'year_week_num': current_timespan.type !== "intercalary" ? year_week_num : undefined,
						'total_week_num': current_timespan.type !== "intercalary" ? total_week_num : undefined,

						'moon_phase': [],
						'moon_phase_num_epoch': [],
						'moon_phase_num_month': [],
						'moon_phase_num_year': [],

						'intercalary': current_timespan.type === "intercalary",

						'era': current_era

					}

					data.current_cycle = get_cycle(this.static_data, data).array;

					if(current_timespan.type !== "intercalary"){

						this.data.repititions.week_days[data.timespan_index][data.week_day-1]++;
						data.week_day_num = this.data.repititions.week_days[data.timespan_index][data.week_day-1];

					}

					data = this.add_moon_data(
						this.data.repititions.year_moons,
						this.data.repititions.timespan_moons[timespan_index],
						epoch,
						data
					);

					this.add_epoch_data(epoch, data);
					epoch++;
					year_day++;
					timespan_day++;

					if(current_timespan.type !== "intercalary"){

						week_day++;

						if(week_day > current_timespan.week.length){
							week_day = 1;
							month_week_num++;
							year_week_num++;
							total_week_num++;
						}

					}

					total_day++;

					for(leap_day_index = 0; leap_day_index < current_timespan.leap_days.length; leap_day_index++){

						leap_day = current_timespan.leap_days[leap_day_index];

						if(leap_day.intercalary && leap_day.day === day){

							data = {
								'year': this.dynamic_data.year,
								'era_year': unconvert_year(this.static_data, era_year),

								'timespan_index': undefined,
								'timespan_number': undefined,
								'timespan_count': undefined,
								'num_timespans': undefined,
								'timespan_name': undefined,

								'epoch': epoch,
								'day': timespan_day,
								'year_day': year_day,
								'week_day': undefined,
								'week_day_name': undefined,

								'inverse_month_week_num': undefined,
								'inverse_year_week_num': undefined,
								'month_week_num': undefined,
								'year_week_num': undefined,
								'total_week_num': undefined,

								'moon_phase': [],
								'moon_phase_num_epoch': [],
								'moon_phase_num_month': [],
								'moon_phase_num_year': [],

								'intercalary': true,
								'leap_day': leap_day.index,

								'era': current_era
							}

							data.current_cycle = get_cycle(this.static_data, data).array;

							data = this.add_moon_data(
								this.data.repititions.year_moons,
								this.data.repititions.timespan_moons[timespan_index],
								epoch,
								data
							);

							this.add_epoch_data(epoch, data);

							epoch++;

							year_day++;

							total_day++;

							timespan_day++;

						}
					}

					total_day--;
				}

			}

			if(!this.static_data.year_data.overflow){
				year_week_num++;
				total_week_num++;
			}

			let highest_month_week_num = this.data.epochs[epoch-1].month_week_num;
			let week_day_nums = {};

			for(var j = epoch-1; j >= month_start_epoch; j--){

				let current_month_week_num = this.data.epochs[j].month_week_num;
				let inverse_month_week_num = (highest_month_week_num-current_month_week_num)+1;
				this.data.epochs[j].inverse_month_week_num = inverse_month_week_num;

				if(week_day_nums[this.data.epochs[j].week_day] === undefined){
					week_day_nums[this.data.epochs[j].week_day] = 1;
				}else{
					week_day_nums[this.data.epochs[j].week_day]++;
				}

				this.data.epochs[j].inverse_week_day_num = week_day_nums[this.data.epochs[j].week_day];

			}

		}

		if(!this.static_data.settings.show_current_month){
			era_year++;
		}

		var calendar_end_epoch = epoch-1;
		var calendar_first_week_day = first_week_day;

		let highest_year_week_num = this.data.epochs[calendar_end_epoch].year_week_num;
		for(var j = calendar_end_epoch; j >= epoch; j--){
			let current_year_week_num = this.data.epochs[j].year_week_num;
			let inverse_year_week_num = (highest_year_week_num-current_year_week_num)+1;
			this.data.epochs[j].inverse_year_week_num = inverse_year_week_num;
		}

		order = Object.keys(this.calendar_list.post_timespans_to_evaluate);

		for(var year_i = 0; year_i < order.length; year_i++){

			year_index = parseInt(order[year_i]);

			timespan_list = this.calendar_list.post_timespans_to_evaluate[year_index];

			let year_start_epoch = epoch;

			for(var i = 0; i < Object.keys(timespan_list).length; i++){

				timespan_index = parseInt(Object.keys(timespan_list)[i]);

				count_timespans[timespan_index]++;
				num_timespans++;

				current_timespan = timespan_list[timespan_index];

				month_week_num = 1;

				if(!this.static_data.year_data.overflow){
					week_day = 1;
				}

				for(day = 0, timespan_day = 1; day <= current_timespan.length; day++){

					moon_data = [];

					if(this.static_data.eras.length > 0 && this.static_data.eras[current_era+1] && epoch >= this.static_data.eras[current_era+1].date.epoch){
						current_era++;
						if(current_era != -1 && this.static_data.eras[current_era].settings.restart){
							era_year = 0;
						}
					}

					if(day == 0){
						for(leap_day_index = 0; leap_day_index < current_timespan.leap_days.length; leap_day_index++){
							leap_day = current_timespan.leap_days[leap_day_index];
							if(leap_day.intercalary && leap_day.day === day){

								data = {
									'year': unconvert_year(this.static_data, year_index),
									'era_year': unconvert_year(this.static_data, era_year),

									'timespan_index': undefined,
									'timespan_number': undefined,
									'timespan_count': undefined,
									'num_timespans': undefined,
									'timespan_name': undefined,

									'epoch': epoch,
									'day': timespan_day,
									'inverse_day': 1+current_timespan.length-day,
									'year_day': year_day,
									'week_day': undefined,
									'week_day_name': undefined,

									'inverse_month_week_num': undefined,
									'inverse_year_week_num': undefined,
									'month_week_num': undefined,
									'year_week_num': undefined,
									'total_week_num': undefined,

									'moon_phase': [],
									'moon_phase_num_epoch': [],
									'moon_phase_num_month': [],
									'moon_phase_num_year': [],

									'intercalary': true,
									'leap_day': leap_day.index,

									'era': current_era

								}

								data.current_cycle = get_cycle(this.static_data, data).array;

								data = this.add_moon_data(
									this.post_data.repititions.year_moons[year_index],
									this.post_data.repititions.timespan_moons[year_index][timespan_index],
									epoch,
									data
								);

								this.add_epoch_data(epoch, data);

								epoch++;
								year_day++;
								timespan_day++;
							}
						}
					}

					if(day > 0){

						data = {
							'year': unconvert_year(this.static_data, year_index),
							'era_year': unconvert_year(this.static_data, era_year),

							'timespan_index': timespan_index,
							'timespan_number': i,
							'timespan_count': count_timespans[timespan_index],
							'num_timespans': num_timespans,
							'timespan_name': current_timespan.name,

							'epoch': epoch,
							'day': timespan_day,
							'inverse_day': 1+current_timespan.length-day,
							'year_day': year_day,
							'week_day': current_timespan.type !== "intercalary" ? week_day : undefined,
							'week_day_name': current_timespan.type !== "intercalary" ? current_timespan.week[week_day-1] : undefined,

							'inverse_month_week_num': undefined,
							'inverse_year_week_num': undefined,
							'month_week_num': current_timespan.type !== "intercalary" ? month_week_num : undefined,
							'year_week_num': current_timespan.type !== "intercalary" ? year_week_num : undefined,
							'total_week_num': current_timespan.type !== "intercalary" ? total_week_num : undefined,



							'moon_phase': [],
							'moon_phase_num_epoch': [],
							'moon_phase_num_month': [],
							'moon_phase_num_year': [],

							'intercalary': current_timespan.type === "intercalary",

							'era': current_era,
						}

						data.current_cycle = get_cycle(this.static_data, data).array;

						if(current_timespan.type !== "intercalary"){

							this.post_data.repititions.week_days[year_index][data.timespan_index][data.week_day-1]++;
							data.week_day_num = this.post_data.repititions.week_days[year_index][data.timespan_index][data.week_day-1];

						}

						data = this.add_moon_data(
							this.post_data.repititions.year_moons[year_index],
							this.post_data.repititions.timespan_moons[year_index][timespan_index],
							epoch,
							data
						);

						this.add_epoch_data(epoch, data);
						epoch++;
						year_day++;
						timespan_day++;

						if(current_timespan.type !== "intercalary"){

							week_day++;

							if(week_day > current_timespan.week.length){
								week_day = 1;
								month_week_num++;
								year_week_num++;
								total_week_num++;
							}

						}

						for(leap_day_index = 0; leap_day_index < current_timespan.leap_days.length; leap_day_index++){
							leap_day = current_timespan.leap_days[leap_day_index];
							if(leap_day.intercalary && leap_day.day === day){

								data = {
									'year': unconvert_year(this.static_data, year_index),
									'era_year': unconvert_year(this.static_data, era_year),

									'timespan_index': undefined,
									'timespan_number': undefined,
									'timespan_count': undefined,
									'num_timespans': undefined,
									'timespan_name': undefined,

									'epoch': epoch,
									'day': timespan_day,
									'inverse_day': 1+current_timespan.length-day,
									'year_day': year_day,
									'week_day': undefined,
									'week_day_name': undefined,

									'inverse_month_week_num': undefined,
									'inverse_year_week_num': undefined,
									'month_week_num': undefined,
									'year_week_num': undefined,
									'total_week_num': undefined,

									'moon_phase': [],
									'moon_phase_num_epoch': [],
									'moon_phase_num_month': [],
									'moon_phase_num_year': [],

									'intercalary': true,
									'leap_day': leap_day.index,

									'era': current_era
								}

								data.current_cycle = get_cycle(this.static_data, data).array;

								data = this.add_moon_data(
									this.post_data.repititions.year_moons[year_index],
									this.post_data.repititions.timespan_moons[year_index][timespan_index],
									epoch,
									data
								);

								this.add_epoch_data(epoch, data);
								epoch++;
								year_day++;
								timespan_day++;
							}
						}
					}
				}

				if(!this.static_data.year_data.overflow){
					year_week_num++;
					total_week_num++;
				}
			}
			year_day = 1;
			if(this.static_data.eras.length > 0 && current_era != -1){
				if(this.static_data.eras[current_era].settings.ends_year){
					if(!this.static_data.eras[current_era].settings.restart){
						era_year++;
					}
				}else{
					era_year++;
				}
			}else{
				era_year++;
			}

			let highest_year_week_num = this.data.epochs[epoch-1].year_week_num;
			for(var j = epoch-1; j >= year_start_epoch; j--){
				let current_year_week_num = this.data.epochs[j].year_week_num;
				let inverse_year_week_num = (highest_year_week_num-current_year_week_num)+1;
				this.data.epochs[j].inverse_year_week_num = inverse_year_week_num;
			}

		}

		climate_generator = new Climate(this.data.epochs, this.static_data, this.dynamic_data, this.dynamic_data.year, start_data.epoch, epoch-1);
		this.data.epochs = climate_generator.generate();

		return {
			success: true,
			static_data: this.static_data,
			year_data: {
				year: this.dynamic_data.year,
				era_year: unconvert_year(this.static_data, calendar_era_year),
				start_epoch: calendar_start_epoch,
				end_epoch: calendar_end_epoch,
				week_day: calendar_first_week_day,
				year_day: calendar_year_day
			},
			epoch_data: this.data.epochs,
			processed_seasons: climate_generator.process_seasons,
			processed_weather: climate_generator.process_weather,
			timespans_to_build: this.calendar_list.timespans_to_build
		}

	}

}

var event_evaluator = {

	events: [],
	categories: [],

	static_data: {},
	epoch_data: {},

	current_data: {},

	init: function(static_data, dynamic_data, events, event_categories, epoch_data, event_id, start_epoch, end_epoch, owner, callback){

		this.static_data = static_data;
		this.dynamic_data = dynamic_data;
		this.events = events;
		this.categories = event_categories;
		this.epoch_data = epoch_data;

		this.start_epoch =  start_epoch;
		this.end_epoch = end_epoch;

		this.owner = owner;

		this.callback = callback;

		this.event_data = {
			valid: {},
			starts: {},
			ends: {},
		}

		if(this.static_data.settings.hide_events && !this.owner){
			return this.event_data;
		}

		this.events_only_happen_once = [];

		this.event_id = event_id;

		this.evaluate_valid_events(this.epoch_data, event_id);

		return this.event_data;

	},

	evaluate_valid_events: function(epoch_list, event_id){

		if(Object.keys(epoch_list).length == 0) return false;

		function evaluate_operator(operator, a, b, c){

			switch(operator){
				case '==':
					return a == b;
					break;
				case '!=':
					return a != b;
					break;
				case '>=':
					return a >= b;
					break;
				case '<=':
					return a <= b;
					break;
				case '>':
					return a > b;
					break;
				case '<':
					return a < b;
					break;
				case '%':
					c = (c)%b;
					return (a-c)%b==0;
					break;
				case '&&':
					return a&&b;
					break;
				case 'NAND':
					return !(a&&b);
					break;
				case '||':
					return a||b;
					break;
				case '^':
					return a^b;
					break;
			}
		}

		function evaluate_condition(epoch_data, array){

			var category = array[0];
			var type = array[1];
			var values = array[2];

			var result = true;

			for(var i = 0; i < condition_mapping[category][type][1].length; i++){

				var subcon = condition_mapping[category][type][1][i];
				var selector = subcon[0];
				var operator = subcon[1];

				if(array[0] === "Epoch"){

					var selected = epoch_data[selector];
					var cond_1 = Number(values[subcon[2]]) != NaN ? Number(values[subcon[2]]) : values[subcon[2]];
					var cond_2 = values[subcon[3]] ? values[subcon[3]] : undefined;
					cond_2 = Number(cond_2) != NaN ? Number(cond_2) : cond_2;

				}else if(array[0] === "Date"){

					var selected = epoch_data["epoch"];
					if(values[3] === undefined){
						values[3] = evaluate_calendar_start(this.static_data, values[0], values[1], values[2]).epoch
					}

					var cond_1 = values[3];

				}else if(array[0] === "Moons"){

					var selected = epoch_data[selector][values[0]];
					var cond_1 = values[subcon[2]]|0;
					var cond_2 = values[subcon[3]] ? values[subcon[3]]|0 : undefined;

				}else if(array[0] === "Season" && epoch_data["season"]){

					var selected = epoch_data["season"][selector];
					var cond_1 = values[subcon[2]]|0;
					var cond_2 = values[subcon[3]] ? values[subcon[3]]|0 : undefined;

				}else if(array[0] === "Random"){

					var cond_1 = values[subcon[2]]|0;
					var cond_2 = values[subcon[3]] ? values[subcon[3]]|0 : undefined;
					var selected = fract(43758.5453 * Math.sin(cond_2 + (78.233 * epoch_data.epoch)))*100;

				}else if(array[0] === "Location"){

					var cond_1 = values[subcon[2]]|0;

					return event_evaluator.dynamic_data.custom_location && evaluate_operator(operator, cond_1, event_evaluator.dynamic_data.location);

				}else if(array[0] === "Events"){

					var cond_1 = values[subcon[2]]|0;
					cond_1 = this.current_event.data.connected_events[cond_1];
					var cond_2 = values[subcon[3]]|0;

					if(event_evaluator.event_data.valid[cond_1] === undefined || event_evaluator.event_data.valid[cond_1].length == 0){

						var result = false;

					}else if(operator == "exactly_past"){

						for(var j = 0; j < event_evaluator.event_data.valid[cond_1].length; j++){

							var result = epoch_data.epoch == event_evaluator.event_data.valid[cond_1][j]+cond_2

							if(result) break;

						}

					}else if(operator == "exactly_future"){

						for(var j = 0; j < event_evaluator.event_data.valid[cond_1].length; j++){

							var result = epoch_data.epoch == event_evaluator.event_data.valid[cond_1][j]-cond_2

							if(result) break;

						}

					}else if(operator == "in_past_exc"){

						for(var j = 0; j < event_evaluator.event_data.valid[cond_1].length; j++){

							var result = epoch_data.epoch >= event_evaluator.event_data.valid[cond_1][j]-cond_2 && event_evaluator.event_data.valid[cond_1][j] > epoch_data.epoch

							if(result) break;

						}

					}else if(operator == "in_future_exc"){

						for(var j = 0; j < event_evaluator.event_data.valid[cond_1].length; j++){

							var result = epoch_data.epoch <= event_evaluator.event_data.valid[cond_1][j]+cond_2 && event_evaluator.event_data.valid[cond_1][j] < epoch_data.epoch

							if(result) break;

						}

					}else if(operator == "in_past_inc"){

						for(var j = 0; j < event_evaluator.event_data.valid[cond_1].length; j++){

							var result = epoch_data.epoch >= event_evaluator.event_data.valid[cond_1][j]-cond_2 && event_evaluator.event_data.valid[cond_1][j] >= epoch_data.epoch

							if(result) break;

						}

					}else if(operator == "in_future_inc"){

						for(var j = 0; j < event_evaluator.event_data.valid[cond_1].length; j++){

							var result = epoch_data.epoch <= event_evaluator.event_data.valid[cond_1][j]+cond_2 && event_evaluator.event_data.valid[cond_1][j] <= epoch_data.epoch

							if(result) break;

						}

					}

				}else if(array[0] === 'Weekday'){
					var selected = epoch_data[selector];
					var cond_1 = !isNaN(Number(values[subcon[2]])) ? Number(values[subcon[2]]) : values[subcon[2]];
					if(!isNaN(cond_1) && (array[1] === "0" || array[1] === "1")){
						cond_1 = event_evaluator.static_data.year_data.global_week[cond_1];
					}
					var cond_2 = values[subcon[3]] ? values[subcon[3]] : undefined;
					cond_2 = !isNaN(Number(cond_2)) ? Number(cond_2) : cond_2;

				}else{

					var selected = epoch_data[selector];
					var cond_1 = !isNaN(Number(values[subcon[2]])) ? Number(values[subcon[2]]) : values[subcon[2]];
					var cond_2 = values[subcon[3]] ? values[subcon[3]] : undefined;
					cond_2 = !isNaN(Number(cond_2)) ? Number(cond_2) : cond_2;

				}

				if(array[0] !== "Events"){

					if(operator == '%'){
						var result = evaluate_operator("&&", evaluate_operator(operator, selected, cond_1, cond_2), result)
					}else{
						if(subcon.length == 4){
							var result = evaluate_operator("&&", evaluate_operator(operator, selected, cond_1, cond_2), result)
						}else{
							var result = evaluate_operator("&&", evaluate_operator(operator, selected, cond_1), result)
						}
					}

				}

			}

			return result;
		}

		function evaluate_event_num_group(epoch_data, array, num){

			var result = false;

			var count_result = 0;

			for(var i = array.length-1; i >= 0; i-=1){

				var condition = array[i];

				var is_array = Array.isArray(condition[1]);

				if(is_array){

					var is_count = Number(condition[0]) != NaN;

					if(is_count){

						var new_result = evaluate_event_num_group(epoch_data, condition[1], Number(condition[0]));

					}else{

						var new_result = evaluate_event_group(epoch_data, condition[1]);

						new_result = condition[0] === "!" ? !new_result : new_result;

					}

				}else{

					var new_result = evaluate_condition(epoch_data, condition);

				}

				count_result = new_result ? count_result+1 : count_result;

				result = count_result >= num;

				if(result) return true;

			}

			return false;

		}

		function evaluate_event_group(epoch_data, array){

			var result = false;

			for(var i = array.length-1; i >= 0; i-=2){

				var condition = array[i];

				var is_array = Array.isArray(condition[1]);

				if(is_array){

					var is_count = condition[0] !== "" && condition[0] !== "!" && Number(condition[0]) !== NaN;

					if(is_count){

						var new_result = evaluate_event_num_group(epoch_data, condition[1], Number(condition[0]));

					}else{

						var new_result = evaluate_event_group(epoch_data, condition[1]);

						new_result = condition[0] === "!" ? !new_result : new_result;

					}

				}else{

					var new_result = evaluate_condition(epoch_data, condition);

				}

				if(array[i+1]){

					result = evaluate_operator(array[i+1][0], result, new_result);

				}else{

					result = new_result;

				}

			}

			return result;

		}

		function evaluate_event(event_index){

			this.current_event = event_evaluator.events[event_index];

			if(this.current_event.data.conditions[this.current_event.data.conditions.length-1].length == 1){
				this.current_event.data.conditions.pop();
			}

			if(this.current_event.data.date !== undefined && this.current_event.data.date.length === 3){

				var epoch = evaluate_calendar_start(event_evaluator.static_data, convert_year(event_evaluator.static_data, this.current_event.data.date[0]), this.current_event.data.date[1], this.current_event.data.date[2]).epoch;
				
				if(epoch >= event_evaluator.start_epoch && epoch <= event_evaluator.end_epoch){

					add_to_epoch(this.current_event, event_index, epoch);

				}

			}else{

				let search_distance = this.current_event.data.search_distance ? this.current_event.data.search_distance : 0;

				var begin_epoch = this.current_event.lookback ? event_evaluator.start_epoch-this.current_event.lookback : event_evaluator.start_epoch-search_distance;
				var last_epoch = this.current_event.lookahead ? event_evaluator.end_epoch+this.current_event.lookahead : event_evaluator.end_epoch+search_distance;

				for(var epoch = begin_epoch; epoch <= last_epoch; epoch++){

					if(event_evaluator.callback){

                        let percentage = event_evaluator.current_number_of_epochs/event_evaluator.total_number_of_epochs
        
                        postMessage({
                            percentage: percentage,
							message: "Testing event conditions against future calendar data...",
                            callback: true
                        })

						event_evaluator.current_number_of_epochs++;

					}

					add_event = true
					if(this.current_event.data.limited_repeat){
						for(var i = 1; i <= this.current_event.data.limited_repeat_num; i++){
							if(event_evaluator.event_data.valid[event_index] && event_evaluator.event_data.valid[event_index].includes(epoch-i)){
								add_event = false
								epoch += this.current_event.data.limited_repeat_num-1;
								event_evaluator.current_number_of_epochs += this.current_event.data.limited_repeat_num-1;
								break;
							}
						}
					}

					if(add_event){

						if(event_evaluator.epoch_data[epoch] !== undefined){

							var result = evaluate_event_group(event_evaluator.epoch_data[epoch], this.current_event.data.conditions);

							if(result){

								add_to_epoch(this.current_event, event_index, epoch);

							}

						}

					}

				}

			}

		}

		function add_to_epoch(event, event_index, epoch){

			if(!event_evaluator.event_data.valid[event_index]){
				event_evaluator.event_data.valid[event_index] = [];
				event_evaluator.event_data.starts[event_index] = [];
				event_evaluator.event_data.ends[event_index] = [];
			}

			if(event.data.has_duration){

				if(event_evaluator.event_data.valid[event_index].indexOf(epoch) == -1 && epoch >= event_evaluator.start_epoch) {
					event_evaluator.event_data.valid[event_index].push(epoch);
					event_evaluator.event_data.starts[event_index].push(epoch);
				}

				if(!event.data.show_first_last){

					for(var duration = 1; duration < event.data.duration; duration++)
					{
						if(event_evaluator.event_data.valid[event_index].indexOf(epoch+duration-1) == -1 && epoch+duration >= event_evaluator.start_epoch) {
							event_evaluator.event_data.valid[event_index].push(epoch+duration-1);
						}
					}
				}

				if(event_evaluator.event_data.valid[event_index].indexOf(epoch+event.data.duration-1) == -1 && epoch+event.data.duration-1 >= event_evaluator.start_epoch) {
					event_evaluator.event_data.valid[event_index].push(epoch+event.data.duration-1);
					event_evaluator.event_data.ends[event_index].push(epoch+event.data.duration-1);
				}

			}else{

				if(event_evaluator.event_data.valid[event_index].indexOf(epoch) == -1){
					event_evaluator.event_data.valid[event_index].push(epoch);
				}

			}

		}

		function check_event_chain(id, lookback, lookahead){

			var current_event = event_evaluator.events[id];

			if(lookback === undefined && lookahead === undefined){

				var lookback = 0;

				if(current_event.data.limited_repeat){
					lookback = current_event.data.limited_repeat_num;
				}

				if(current_event.data.search_distance && current_event.data.search_distance > lookback){
					lookback = current_event.data.search_distance;
				}

				var lookahead = current_event.data.search_distance ? current_event.data.search_distance : 0;

			}

			current_event.lookback = lookback;
			current_event.lookahead = lookahead;

			if(current_event.data.connected_events !== undefined && current_event.data.connected_events !== "false"){

				for(var connectedId in current_event.data.connected_events){

					var parent_id = current_event.data.connected_events[connectedId];

					check_event_chain(parent_id, current_event.lookback, current_event.lookahead);

				}

			}

			if(event_evaluator.event_data.valid[id] === undefined){

				evaluate_event(id);

			}

		}

		function get_number_of_events(id){

			var current_event = event_evaluator.events[id];

			if(current_event.data.connected_events !== undefined && current_event.data.connected_events !== "false"){

				var begin_epoch = event_evaluator.start_epoch;
				var last_epoch = event_evaluator.end_epoch;

				for(var connectedId in current_event.data.connected_events){

					var parent_id = current_event.data.connected_events[connectedId];

					get_number_of_events(parent_id);

					var lookback = 0;

					if(current_event.data.limited_repeat){
						lookback = current_event.data.limited_repeat_num;
					}

					if(current_event.data.search_distance && current_event.data.search_distance > lookback){
						lookback = current_event.data.search_distance;
					}

					var lookahead = current_event.data.search_distance ? current_event.data.search_distance : 0;

					begin_epoch -= lookback;
					last_epoch += lookahead;

				}

				event_evaluator.total_number_of_epochs += (last_epoch-begin_epoch);

			}

		}

		if(event_id !== undefined){

			if(event_evaluator.callback !== undefined){

				event_evaluator.total_number_of_epochs = 0;
				event_evaluator.current_number_of_epochs = 0;

				get_number_of_events(event_id);

			}

			if(this.events[event_id].data.connected_events !== undefined && this.events[event_id].data.connected_events.length > 0){
				check_event_chain(event_id);
			}

			if(this.events[event_id].data.connected_events === undefined || this.events[event_id].data.connected_events.length == 0){
				evaluate_event(event_id);
			}

		}else{

			for(var event_index in this.events){
				if(this.events[event_index].data.connected_events !== undefined && this.events[event_index].data.connected_events.length > 0){
					check_event_chain(event_index);
				}
			}

			for(var event_index in this.events){
				if(this.events[event_index].data.connected_events === undefined || this.events[event_index].data.connected_events.length == 0){
					evaluate_event(event_index);
				}
			}

		}

	}

};

