/*--------------------------------------------------------*/
/*---------------- CALCULATION FUNCTIONS  ----------------*/
/*--------------------------------------------------------*/

var version = new Date().getTime();

importScripts('/js/calendar/calendar_functions.js?v='+version);
importScripts('/js/calendar/calendar_variables.js?v='+version);
importScripts('/js/calendar/calendar_season_generator.js?v='+version);

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

	evaluate_future_calendar_data: function(start_year, end_year){

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
			timespans_to_build: {},
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

		var year_start_data = evaluate_calendar_start(this.static_data, first_eval_year, first_eval_month);
		var era_year = unconvert_year(this.static_data, year_start_data.era_year);
		var count_timespans = year_start_data.count_timespans;
		var num_timespans = year_start_data.num_timespans;
		var total_week_num = year_start_data.total_week_num;

		var epoch = year_start_data.epoch;
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

		var year_day = 1+year_start_data.epoch-evaluate_calendar_start(this.static_data, first_eval_year).epoch;

		var week_day = year_start_data.week_day;

		var order = Object.keys(this.calendar_list.pre_timespans_to_evaluate);

		if(order[0] > order[order.length-1]){
			order.reverse();
		}

		for(var year_i = 0; year_i < order.length; year_i++){

			var year_start_epoch = epoch;

			year_index = parseInt(order[year_i]);

			timespan_list = this.calendar_list.pre_timespans_to_evaluate[year_index];

			year_week_num = 1;

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

			var climate_generator = new Climate(this.data.epochs, this.static_data, this.dynamic_data, year_start_epoch, epoch);
			this.data.epochs = climate_generator.generate()

		}

		if(!this.static_data.settings.show_current_month){
			year_day = 1;
		}

		order = Object.keys(this.calendar_list.post_timespans_to_evaluate);

		for(var year_i = 0; year_i < order.length; year_i++){

			var year_start_epoch = epoch;

			year_index = parseInt(order[year_i]);

			timespan_list = this.calendar_list.post_timespans_to_evaluate[year_index];

			year_week_num = 1;

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

			var climate_generator = new Climate(this.data.epochs, this.static_data, this.dynamic_data, year_start_epoch, epoch);
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

		year_start_data = evaluate_calendar_start(this.static_data, first_eval_year, first_eval_month, undefined, true);
		era_year = year_start_data.era_year;
		count_timespans = year_start_data.count_timespans;
		num_timespans = year_start_data.num_timespans;
		total_week_num = year_start_data.total_week_num;

		epoch = year_start_data.epoch;

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
		
		year_day = 1+year_start_data.epoch-evaluate_calendar_start(this.static_data, first_eval_year).epoch;

		week_day = year_start_data.week_day;

		order = Object.keys(this.calendar_list.pre_timespans_to_evaluate);

		if(order[0] > order[order.length-1]){
			order.reverse();
		}

		for(var year_i = 0; year_i < order.length; year_i++){

			year_index = parseInt(order[year_i]);

			timespan_list = this.calendar_list.pre_timespans_to_evaluate[year_index];

			year_week_num = 1;

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

		}

		if(!this.static_data.settings.show_current_month){
			era_year++;
		}

		var calendar_end_epoch = epoch;
		var calendar_first_week_day = first_week_day;

		order = Object.keys(this.calendar_list.post_timespans_to_evaluate);

		for(var year_i = 0; year_i < order.length; year_i++){

			year_index = parseInt(order[year_i]);

			timespan_list = this.calendar_list.post_timespans_to_evaluate[year_index];

			year_week_num = 1;

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
		}

		climate_generator = new Climate(this.data.epochs, this.static_data, this.dynamic_data, calendar_start_epoch, calendar_end_epoch);
		this.data.epochs = climate_generator.generate();
		
		let render_data = this.create_render_data({
			start_epoch: calendar_start_epoch,
			week_day: calendar_first_week_day,
			year_day: calendar_year_day
		});

		if(debug || debugtext){

			var wrong = false;
			if(Math.abs(this.prevous_year-this.dynamic_data.year) == 1){
				if(this.prevous_year !== undefined && this.previous_start_epoch !== undefined && this.previous_end_epoch !== undefined){
					if(this.dynamic_data.year > this.prevous_year){
						wrong = calendar_start_epoch != this.previous_end_epoch;
					}else{
						wrong = calendar_end_epoch != this.previous_start_epoch;
					}
				}
			}

			if(debugtext){
				//console.log(this.dynamic_data.year, this.previous_end_epoch, calendar_start_epoch, calendar_end_epoch)
				console.log(this.dynamic_data.year, calendar_era_year)
			}

			if(wrong){
				console.log("------------------------")
				console.log("WRONG!")
				if(this.dynamic_data.year > this.prevous_year){
					console.log(this.dynamic_data.year, calendar_era_year)
					console.log(this.previous_end_epoch, calendar_start_epoch, calendar_end_epoch)
				}else{
					console.log(this.dynamic_data.year, calendar_era_year)
					console.log(calendar_start_epoch, calendar_end_epoch, this.previous_start_epoch)
				}
				console.log("------------------------")
			}

			this.previous_end_epoch = calendar_end_epoch;
			this.previous_start_epoch = calendar_start_epoch;
			this.prevous_year = this.dynamic_data.year;

		}

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
			render_data: render_data
		}

	},

	get_weather_icon: function(weather){

		if(weather){
			if(weather.clouds == "Clear"){
				if(weather.feature == "Fog"){
					return `wi wi-fog`;
				}else{
					return `wi wi-day-sunny`;
				}
			}else{

				if(weather.precipitation.key == "None"){

					if(weather.clouds == "A few clouds"){
						return `wi wi-day-cloudy`;
					}else if(weather.clouds == "Mostly cloudy"){
						return `wi wi-cloud`;
					}else{
						return `wi wi-cloudy`;
					}

				}else{

					if(weather.temperature.metric.actual > 0){

						if(weather.precipitation.actual > 0.375){
							if(weather.feature == "Lightning"){
								return `wi wi-thunderstorm`;
							}else{
								return `wi wi-rain`;
							}
						}else {
							if(weather.feature == "Lightning"){
								return `wi wi-storm-showers`;
							}else{
								if(weather.feature == "Fog" && weather.precipitation.actual < 0.375){
									return `wi wi-fog`;
								}
								return `wi wi-showers`;
							}
						}

					}else{

						if(weather.feature == "Hail"){
							return `wi wi-hail`;
						}else{
							return `wi wi-snow`;
						}

					}
				}
			}
		}

		return "";

	},

	get_day_data: function(epoch){
	
		let epoch_data = this.data.epochs[epoch];

		let text = ""
		if(epoch_data.leap_day !== undefined){
			let index = epoch_data.leap_day;
			text = this.static_data.year_data.leap_days[index].name;
		}

		let season_color = epoch_data.season ? (epoch_data.season.color !== undefined ? epoch_data.season.color : null) : null;
		let weather_icon = epoch_data.weather ? this.get_weather_icon(epoch_data.weather) : null;

		let moons = [];
		for(let moon_index = 0; moon_index < this.static_data.moons.length; moon_index++){
			let moon = this.static_data.moons[moon_index];
			moons.push({
				"index": moon_index,
				"name": moon.name,
				"phase": moon_phases[moon.granularity][data.moon_phase[moon_index]],
				"image": svg_moon_shadows[Math.floor((svg_moon_shadows.length/moon.granularity)*epoch_data.moon_phase[moon_index])]
			})
		}

		return {
			"number": `${epoch_data.day}`,
			"text": text,
			"type": "day",
			"epoch": epoch,
			"year_day": epoch_data.year_day,
			"weather_icon": weather_icon,
			"season_color": season_color,
			"events": [],
			"moons": moons
		};
	},

	overflow: function(){
		return {
			"number": ``,
			"text": "",
			"type": "overflow",
			"epoch": false,
			"year_day": false,
			"weather_icon": false,
			"season_color": false,
			"events": [],
			"moons": []
		};
	},

	create_render_data: function(data){

		let render_data = {
			"current_epoch": this.dynamic_data.epoch,
			"preview_epoch": this.dynamic_data.epoch,
			"render_style": this.static_data.settings.layout,
			"timespans": [],
			"event_epochs": {}
		}

		let indexes = Object.keys(this.calendar_list.timespans_to_build)
		let length = indexes.length

		let epoch = data.start_epoch;
		let week_day = data.week_day;

		for(var index = 0; index < length; index++){

			let timespan = this.calendar_list.timespans_to_build[indexes[index]];

			var filtered_leap_days_beforestart = timespan.leap_days.filter(function(features){
				return features.intercalary && features.day === 0;
			});

			if(filtered_leap_days_beforestart.length > 0){
					
				let timespan_data = {
					"title": "",
					"show_title": false,
					"number": index+1,
					"weekdays": this.static_data.year_data.global_week,
					"show_weekdays": false,
					"days": [[]]
				}

				let weekday_number = 1;
				let week_index = 0;

				for(var leap_day_index in filtered_leap_days_beforestart){

					let day_data = this.get_day_data(epoch);
					timespan_data.days[timespan_data.days.length-1].push(day_data);
					render_data.event_epochs[epoch] = day_data.events;

					weekday_number++;
					epoch++;

					if(weekday_number > timespan.week.length){
						weekday_number = 1;
						week_index++;
						timespan_data.days.push([]);
					}
				}

				for(weekday_number; weekday_number <= this.static_data.year_data.global_week.length; weekday_number++){
					timespan_data.days[week_index].push(this.overflow());
				}

				render_data.timespans.push(timespan_data);

			}

			let show_months = timespan.type === "month";

			let timespan_data = {
				"title": timespan.name,
				"show_title": true,
				"number": index+1,
				"weekdays": timespan.week,
				"show_weekdays": show_months,
				"days": [[]]
			}

			if(!this.static_data.year_data.overflow){
				week_day = 1;
			}

			for(let day_number = 1; day_number <= timespan.length;){
				
				if(timespan_data.days[timespan_data.days.length-1].length != 0){
					timespan_data.days.push([])
				}

				for(let weekday_number = 1; weekday_number <= timespan.week.length; weekday_number++){

					if(week_day > weekday_number && show_months){

						timespan_data.days[timespan_data.days.length-1].push(this.overflow());
						
					}else if(day_number <= timespan.length){

						let day_data = this.get_day_data(epoch);
						timespan_data.days[timespan_data.days.length-1].push(day_data);
						render_data.event_epochs[epoch] = day_data.events;

						epoch++;

						filtered_leap_days = timespan.leap_days.filter(function(leap_day){
							return leap_day.intercalary && leap_day.day === day_number && leap_day.day !== timespan.length;
						});

						if(filtered_leap_days.length > 0){

							for(let internal_weekday_number = week_day; internal_weekday_number < timespan.week.length; internal_weekday_number++){
								timespan_data.days[timespan_data.days.length-1].push(this.overflow());
							}

							render_data.timespans.push(timespan_data);

							timespan_data = {
								"title": "",
								"show_title": false,
								"number": index+1,
								"weekdays": this.static_data.year_data.global_week,
								"show_weekdays": false,
								"days": [[]]
							}

							let internal_weekday_number = 1;

							for(var leap_day_index in filtered_leap_days){

								let day_data = this.get_day_data(epoch);
								timespan_data.days[timespan_data.days.length-1].push(day_data);
								render_data.event_epochs[epoch] = day_data.events;

								internal_weekday_number++;
								epoch++;

								if(internal_weekday_number > timespan.week.length){
									internal_weekday_number = 1;
									timespan_data.days.push([]);
								}
							}

							for(internal_weekday_number; internal_weekday_number <= this.static_data.year_data.global_week.length; internal_weekday_number++){
								timespan_data.days[timespan_data.days.length-1].push(this.overflow());
							}

							render_data.timespans.push(timespan_data);

							timespan_data = {
								"title": timespan.name,
								"show_title": true,
								"number": index+1,
								"weekdays": timespan.week,
								"show_weekdays": timespan.type === "month",
								"days": [[]]
							}

							if(week_day != timespan.week.length){
								for(let internal_weekday_number = 0; internal_weekday_number < week_day; internal_weekday_number++){
									timespan_data.days[timespan_data.days.length-1].push(this.overflow());
								}
							}

						}

						day_number++;

						if(show_months){
							week_day++;
							
							if(week_day > timespan.week.length){
								week_day = 1;
							}
						}

					}else{

						timespan_data.days[timespan_data.days.length-1].push(this.overflow());

					}
				}
			}

			render_data.timespans.push(timespan_data);

			var filtered_leap_days_end = timespan.leap_days.filter(function(features){
				return features.intercalary && features.day === timespan.length;
			});

			if(filtered_leap_days_end.length > 0){
					
				let timespan_data = {
					"title": "",
					"show_title": false,
					"number": index+1,
					"weekdays": this.static_data.year_data.global_week,
					"show_weekdays": false,
					"days": [[]]
				}

				let weekday_number = 1;
				let week_index = 0;

				for(var leap_day_index in filtered_leap_days_end){

					timespan_data.days[week_index].push(this.get_day_data(epoch));

					weekday_number++;
					epoch++;

					if(weekday_number > timespan.week.length){
						weekday_number = 1;
						week_index++;
						timespan_data.days.push([]);
					}
				}

				for(weekday_number; weekday_number <= this.static_data.year_data.global_week.length; weekday_number++){
					timespan_data.days[week_index].push(this.overflow());
				}

				render_data.timespans.push(timespan_data);

			}

		}
		
		return render_data;

	}


}

var debug = false;
var debugtext = false;

onmessage = e => {

	calendar_builder.calendar_name = e.data.calendar_name;
	calendar_builder.static_data = e.data.static_data;
	calendar_builder.dynamic_data = e.data.dynamic_data;
	calendar_builder.owner = e.data.owner;
	calendar_builder.events = e.data.events;
	calendar_builder.event_categories = e.data.event_categories;

	if(debug){

		target_loops = 20000;
		loops = 0;

		calendar_builder.dynamic_data.year = -10000;

		var average_time = 0;

		for(var loops; loops < target_loops; loops++){

			starttime = performance.now();

			data = calendar_builder.evaluate_calendar_data();
			calendar_builder.dynamic_data.year++;
			if(calendar_builder.dynamic_data.year == 0 && !calendar_builder.static_data.settings.year_zero_exists){
				calendar_builder.dynamic_data.year++;
			}

			average_time += precisionRound(performance.now() - starttime, 7)

		}

		average_time = average_time/target_loops;

		console.log(`${average_time}ms`)

		postMessage({
			processed_data: data,
			action: e.data.action
		});

	}else{

		if(e.data.action != "future"){
			data = calendar_builder.evaluate_calendar_data();
		}else{
			data = calendar_builder.evaluate_future_calendar_data(e.data.start_year, e.data.end_year);
		}

		postMessage({
			processed_data: data,
			action: e.data.action
		});

	}
}
