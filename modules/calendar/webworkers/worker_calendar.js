/*--------------------------------------------------------*/
/*---------------- CALCULATION FUNCTIONS  ----------------*/
/*--------------------------------------------------------*/

var utcDate1 = Date.now();

importScripts('../js/calendar_functions.js?version='+utcDate1);
importScripts('../js/calendar_variables.js?version='+utcDate1);
importScripts('../js/calendar_season_generator.js?version='+utcDate1);

var calendar_builder = {

	date: {},
	calendar: {},

	create_adjusted_timespan: function(timespan_index){

		var timespan = clone(this.calendar.year_data.timespans[timespan_index]);

		timespan.index = timespan_index;

		timespan.week = timespan.week ? timespan.week : clone(this.calendar.year_data.global_week);

		timespan.leap_days = [];

		// Get all current leap days and check if any of them should be on this timespan
		for(leap_day_index = 0; leap_day_index < this.calendar.year_data.leap_days.length; leap_day_index++){

			var leap_day = this.calendar.year_data.leap_days[leap_day_index];

			if(leap_day.timespan == timespan_index){

				leap_day.index = leap_day_index;

				var add = false;

				if(is_leap(this.date.internal_year, leap_day.interval, leap_day.offset)){

					add = true;

					if(leap_day.intercalary){
						timespan.leap_days.push(leap_day);
					}else{
						timespan.length++;
						if(leap_day.adds_week_day){
							timespan.week.splice(leap_day.day-1, 0, leap_day.week_day)
						}
					}
				}
			}
		}

		return timespan;
	},


	get_cycle: function(year){

		var text = '';

		// If cycles are enabled
		if(this.calendar.cycles && year >= 0){

			// Define the index array
			var index_array = [];

			// Get the format
			text = this.calendar.cycles.format;

			// Loop through each cycle
			for(var index = 0; index < this.calendar.cycles.data.length; index++){

			
				var cycle = this.calendar.cycles.data[index];

				// Get the cycle length from the year
				var cycle_year = Math.floor((year + cycle.offset) / cycle.cycle_length);

				// Store the cycle index
				var cycle_index = cycle_year % cycle.names.length;

				// Get the name for this cycle
				var cycle_name = cycle.names[cycle_index];

				// Replace the part of the text that has the current index's place
				text = text.replace('$'+(index+1), cycle_name);

				// Record the cycle index to the array
				index_array.push(cycle_index)
			}
		}
		return {'text': text,
				'array': index_array};
	},

	pre_data: {
		epochs: {},
		repititions: {
			week_days: {},
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
			for(var moon = 0; moon < this.calendar.moons.length; moon++){
				this.data.repititions.timespan_moons[timespan_index][moon] = [];
				for(j = 0; j < this.calendar.moons[moon].granularity; j++){
					this.data.repititions.timespan_moons[timespan_index][moon].push(0);
				}
			}
		}


		for(var moon = 0; moon < this.calendar.moons.length; moon++){
			this.data.repititions.year_moons[moon] = [];
			for(var i = 0; i < this.calendar.moons[moon].granularity; i++){
				this.data.repititions.year_moons[moon].push(0);
			}
		}

		for(var i = 0; i < Object.keys(this.calendar_list.timespans_to_evaluate).length; i++){

			year_index = Object.keys(this.calendar_list.timespans_to_evaluate)[i];

			this.pre_data.repititions.week_days[year_index] = {};
			this.pre_data.repititions.year_moons[year_index] = {};
			this.pre_data.repititions.timespan_moons[year_index] = {};

			for(var j = 0; j < Object.keys(this.calendar_list.timespans_to_evaluate[year_index]).length; j++){

				timespan_index = Object.keys(this.calendar_list.timespans_to_evaluate[year_index])[j];

				this.pre_data.repititions.timespan_moons[year_index][timespan_index] = [];
				for(var moon = 0; moon < this.calendar.moons.length; moon++){
					this.pre_data.repititions.timespan_moons[year_index][timespan_index][moon] = [];
					for(k = 0; k < this.calendar.moons[moon].granularity; k++){
						this.pre_data.repititions.timespan_moons[year_index][timespan_index][moon].push(0);
					}
				}
			}

			for(var j = 0; j < Object.keys(this.calendar_list.timespans_to_evaluate[year_index]).length; j++){

				timespan_index = Object.keys(this.calendar_list.timespans_to_evaluate[year_index])[j];

				this.pre_data.repititions.week_days[year_index][timespan_index] = [];
				for(week_day = 0; week_day < this.calendar_list.timespans_to_evaluate[year_index][timespan_index].week.length; week_day++){
					this.pre_data.repititions.week_days[year_index][timespan_index][week_day] = 0;
				}

			}

			for(var moon = 0; moon < this.calendar.moons.length; moon++){
				this.pre_data.repititions.year_moons[year_index][moon] = [];
				for(k = 0; k < this.calendar.moons[moon].granularity; k++){
					this.pre_data.repititions.year_moons[year_index][moon].push(0);
				}
			}
		}

	},

	add_epoch_data: function(epoch, data){
		this.data.epochs[epoch] = data;
	},

	add_epoch_pre_data: function(epoch, data){
		this.pre_data.epochs[epoch] = data;
	},

	evaluate_calendar_data: function(){

		if(this.calendar.year_data.timespans.length === 0 || this.calendar.year_data.global_week.length === 0){
			var result = {
				success: false,
				errors: []
			};

			if(this.calendar.year_data.timespans.length === 0){
				result.errors.push("You need at least one month.")
			}

			if(this.calendar.year_data.global_week.length === 0){
				result.errors.push("You need at least one week day.")
			}

			return result;
		}

		// Set the internal year, so that year 1 is technically year 0, and year 2 is technically year 1, which means that it's easier to calculate negative years.
		this.date.internal_year = this.date.year >= 0 ? this.date.year - 1 : this.date.year;

		this.calendar_list = {

			timespans_to_evaluate: {},
			timespans_to_build: {}

		}

		for(var i = 0; i < this.calendar.eras.length; i++){
			this.calendar.eras[i].date.epoch = evaluate_calendar_start(this.calendar, this.calendar.eras[i].date.year-1, this.calendar.eras[i].date.timespan, this.calendar.eras[i].date.day).epoch;
		}

		// If the setting is on, only select the current month to be calculated
		if(this.calendar.settings.show_current_month){

			this.calendar_list.timespans_to_build[this.date.timespan] = this.create_adjusted_timespan(this.date.timespan);


		}else{


			num_timespans = this.calendar.year_data.timespans.length;
			ending_day = 0;

			for(var era_index = 0; era_index < this.calendar.eras.length; era_index++){

				era = this.calendar.eras[era_index];

				if(era.settings.ends_year && this.date.internal_year == era.date.year-1 && era.date.timespan < num_timespans+1){

					num_timespans = era.date.timespan+1;
					ending_day = era.date.day;

				}

			}

			for(timespan = 0; timespan < num_timespans; timespan++){

				var offset = (this.calendar.year_data.timespans[timespan].interval-this.calendar.year_data.timespans[timespan].offset)%this.calendar.year_data.timespans[timespan].interval;

				// Get the fraction of that month's appearances
				var is_leaping = (this.date.internal_year + offset) % this.calendar.year_data.timespans[timespan].interval == 0;

				if(is_leaping){

					this.calendar_list.timespans_to_build[timespan] = this.create_adjusted_timespan(timespan);

					if(ending_day > 0 && timespan == num_timespans-1){
						this.calendar_list.timespans_to_build[timespan].length = ending_day > this.calendar_list.timespans_to_build[timespan].length ? this.calendar_list.timespans_to_build[timespan].length : ending_day; 
					}

				}

			}

		}


		backtrack_days = 0;
		for(event_index = 0; event_index < this.calendar.event_data.events.length; event_index++){
			event = this.calendar.event_data.events[event_index];
			backtrack_days = event.data.length > backtrack_days ? event.data.length : backtrack_days;
		}


		days = 0;
		timespan = parseInt(Object.keys(this.calendar_list.timespans_to_build)[0]);
		year = this.date.internal_year;

		if(backtrack_days != 1){

			while(days < backtrack_days){

				ending_day = 0;

				if(this.calendar.settings.show_current_month && days == 0){

					num_timespans = timespan-1;
					if(num_timespans < 0){
						year--;
						num_timespans = this.calendar.year_data.timespans.length-1;
					}
					
				}else{

					year--;

					num_timespans = this.calendar.year_data.timespans.length-1;

				}

				for(var era_index = 0; era_index < this.calendar.eras.length; era_index++){

					era = this.calendar.eras[era_index];

					if(era.settings.ends_year && year == era.date.year-1 && era.date.timespan < num_timespans){

						num_timespans = era.date.timespan;
						ending_day = era.date.day;


					}

				}

				this.calendar_list.timespans_to_evaluate[year] = {};

				for(timespan = num_timespans; timespan >= 0; timespan--){

					var offset = (this.calendar.year_data.timespans[timespan].interval-this.calendar.year_data.timespans[timespan].offset)%this.calendar.year_data.timespans[timespan].interval;

					// Get the fraction of that month's appearances
					var is_leaping = (year + offset) % this.calendar.year_data.timespans[timespan].interval == 0;

					if(is_leaping){

						this.calendar_list.timespans_to_evaluate[year][timespan] = this.create_adjusted_timespan(timespan);

						if(ending_day > 0 && timespan == num_timespans){
							this.calendar_list.timespans_to_evaluate[year][timespan].length = ending_day > this.calendar_list.timespans_to_evaluate[year][timespan].length ? this.calendar_list.timespans_to_evaluate[year][timespan].length : ending_day; 
						}

						days += this.calendar_list.timespans_to_evaluate[year][timespan].length;

						if(days >= backtrack_days){
							break;
						}

					}

				}

			}

		}

		this.set_up_repititions();

		if(Object.keys(this.calendar_list.timespans_to_evaluate).length > 0){

			first_eval_year = parseInt(Object.keys(this.calendar_list.timespans_to_evaluate)[0]);

			for(var i = 0; i < Object.keys(this.calendar_list.timespans_to_evaluate).length; i++){

				curr_year = parseInt(Object.keys(this.calendar_list.timespans_to_evaluate)[i]);

				if(first_eval_year > curr_year){
					first_eval_year = curr_year;
				}

			}

			first_eval_month = parseInt(Object.keys(this.calendar_list.timespans_to_evaluate[first_eval_year])[0]);
			last_year = first_eval_year;

		}else{

			first_eval_year = this.date.internal_year;
			first_eval_month = parseInt(Object.keys(this.calendar_list.timespans_to_build)[0]);

		}

		year_start_data = evaluate_calendar_start(this.calendar, first_eval_year, first_eval_month);
		era_year = year_start_data.era_year;
		count_timespans = year_start_data.count_timespans;
		num_timespans = year_start_data.num_timespans;
		total_week_num = year_start_data.total_week_num;

		epoch = year_start_data.epoch;

		year_day = 1+year_start_data.epoch-evaluate_calendar_start(this.calendar, first_eval_year).epoch;

		week_day = year_start_data.week_day;

		order = Object.keys(this.calendar_list.timespans_to_evaluate);

		if(order[0] > order[order.length-1]){
			order.reverse();
		}

		for(var year_i = 0; year_i < order.length; year_i++){

			year_index = parseInt(order[year_i]);

			timespan_list = this.calendar_list.timespans_to_evaluate[year_index];

			current_cycle = this.get_cycle(year_index)

			year_week_num = 1;

			for(var i = 0; i < Object.keys(timespan_list).length; i++){

				timespan_index = parseInt(Object.keys(timespan_list)[i]);

				count_timespans[timespan_index]++;
				num_timespans++;

				current_timespan = timespan_list[timespan_index];

				month_week_num = 1;

				if(!this.calendar.year_data.overflow){
					week_day = 1;
					year_week_num++;
					total_week_num++;
				}

				for(day = 0; day <= current_timespan.length; day++){

					moon_data = [];

					if(day == 0){
						for(leap_day_index = 0; leap_day_index < current_timespan.leap_days.length; leap_day_index++){
							leap_day = current_timespan.leap_days[leap_day_index];
							if(leap_day.intercalary && leap_day.day === day){

								data = {
									'year': this.date.year,
									'era_year': era_year,

									'timespan_index': timespan_index,
									'timespan_number': i,
									'timespan_count': count_timespans[timespan_index],
									'num_timespans': num_timespans,
									'timespan_name': current_timespan.name,

									'epoch': epoch, 
									'day': day,
									'year_day': year_day,

									'month_week_num': false,
									'year_week_num': false,
									'total_week_num': false,

									//

									'moon_phase': [],
									'moon_phase_num_epoch': [],
									'moon_phase_num_month': [],
									'moon_phase_num_year': [],

									'cycle': current_cycle.array,
									'intercalary': true,
									'leap_day': leap_day.index,
								}

								for(moon_index = 0; moon_index < this.calendar.moons.length; moon_index++){


									var moon = this.calendar.moons[moon_index];

									var moon_position_data = ((epoch - moon.shift) / moon.cycle);
									var moon_position = (moon_position_data - Math.floor(moon_position_data));
									var phase = Math.floor(moon_position*moon.granularity);

									this.pre_data.repititions.year_moons[year_index][moon_index][phase]++;
									this.pre_data.repititions.timespan_moons[year_index][timespan_index][moon_index][phase]++;

									var position_data = ((epoch-moon.shift)/moon.cycle)
									var phase_epoch = Math.floor(Math.abs(position_data)+1);

									data['moon_phase'][moon_index] = phase;
									data['moon_phase_num_epoch'][moon_index] = phase_epoch;
									data['moon_phase_num_month'][moon_index] = this.pre_data.repititions.timespan_moons[year_index][timespan_index][moon_index][phase];
									data['moon_phase_num_year'][moon_index] = this.pre_data.repititions.year_moons[year_index][moon_index][phase];

								}

								this.add_epoch_pre_data(epoch, data);
								epoch++;
								year_day++;
							}
						}
					}

					if(day > 0){

						data = {
						
							'year': this.date.year,
							'era_year': era_year,

							'timespan_index': timespan_index,
							'timespan_number': i,
							'timespan_count': count_timespans[timespan_index],
							'num_timespans': num_timespans,
							'timespan_name': current_timespan.name,

							'epoch': epoch, 
							'day': day,
							'year_day': year_day,
							'week_day': week_day,

							'month_week_num': month_week_num,
							'year_week_num': year_week_num,
							'total_week_num': total_week_num,

							//

							'moon_phase': [],
							'moon_phase_num_epoch': [],
							'moon_phase_num_month': [],
							'moon_phase_num_year': [],

							'cycle': current_cycle.array,
							'intercalary': timespan.type === "intercalary",
							'leap_day': false,
						}

						for(moon_index = 0; moon_index < this.calendar.moons.length; moon_index++){


							var moon = this.calendar.moons[moon_index];

							var moon_position_data = ((epoch - moon.shift) / moon.cycle);
							var moon_position = (moon_position_data - Math.floor(moon_position_data));
							var phase = Math.floor(moon_position*moon.granularity);

							this.pre_data.repititions.year_moons[year_index][moon_index][phase]++;
							this.pre_data.repititions.timespan_moons[year_index][timespan_index][moon_index][phase]++;

							var position_data = ((epoch-moon.shift)/moon.cycle)
							var phase_epoch = Math.floor(Math.abs(position_data)+1);

							data['moon_phase'][moon_index] = phase;
							data['moon_phase_num_epoch'][moon_index] = phase_epoch;
							data['moon_phase_num_month'][moon_index] = this.pre_data.repititions.timespan_moons[year_index][timespan_index][moon_index][phase];
							data['moon_phase_num_year'][moon_index] = this.pre_data.repititions.year_moons[year_index][moon_index][phase];
						}

						this.pre_data.repititions.week_days[year_index][data.timespan_index][data.week_day]++;
						data.week_day_num = this.pre_data.repititions.week_days[year_index][data.timespan_index][data.week_day];

						this.add_epoch_pre_data(epoch, data);
						epoch++;
						year_day++;
					
						week_day++;
						if(week_day > current_timespan.week.length){
							week_day = 1;
							year_week_num++;
							total_week_num++;
							month_week_num++;
						}

						for(leap_day_index = 0; leap_day_index < current_timespan.leap_days.length; leap_day_index++){
							leap_day = current_timespan.leap_days[leap_day_index];
							if(leap_day.intercalary && leap_day.day === day){

								data = {
									'year': this.date.year,
									'era_year': era_year,

									'timespan_index': timespan_index,
									'timespan_number': i,
									'timespan_count': count_timespans[timespan_index],
									'num_timespans': num_timespans,
									'timespan_name': current_timespan.name,

									'epoch': epoch, 
									'day': day,
									'year_day': year_day,
									'week_day': week_day,

									'month_week_num': false,
									'year_week_num': false,
									'total_week_num': false,

									//

									'moon_phase': [],
									'moon_phase_num_epoch': [],
									'moon_phase_num_month': [],
									'moon_phase_num_year': [],

									'cycle': current_cycle.array,
									
									'intercalary': true,
									'leap_day': leap_day.index,
								}

								for(moon_index = 0; moon_index < this.calendar.moons.length; moon_index++){

									var moon = this.calendar.moons[moon_index];

									var moon_position_data = ((epoch - moon.shift) / moon.cycle);
									var moon_position = (moon_position_data - Math.floor(moon_position_data));
									var phase = Math.floor(moon_position*moon.granularity);

									this.pre_data.repititions.year_moons[year_index][moon_index][phase]++;
									this.pre_data.repititions.timespan_moons[year_index][timespan_index][moon_index][phase]++;

									var position_data = ((epoch-moon.shift)/moon.cycle)
									var phase_epoch = Math.floor(Math.abs(position_data)+1);

									data['moon_phase'][moon_index] = phase;
									data['moon_phase_num_epoch'][moon_index] = phase_epoch;
									data['moon_phase_num_month'][moon_index] = this.pre_data.repititions.timespan_moons[year_index][timespan_index][moon_index][phase];
									data['moon_phase_num_year'][moon_index] = this.pre_data.repititions.year_moons[year_index][moon_index][phase];
								}

								this.add_epoch_pre_data(epoch, data);
								epoch++;
								year_day++;
							}
						}
					}	
				}
			}
			last_year = year_index;
			year_day = 1;
		}


		if(!this.calendar.settings.show_current_month){
			year_day = 1;
		}

		first_epoch = epoch;
		first_week_day = week_day;
		year_week_num = 1;

		climate_generator.set_up(this.calendar, first_epoch, this.calendar_list.timespans_to_build);

		current_cycle = this.get_cycle(this.date.internal_year)

		for(var i = 0; i < Object.keys(this.calendar_list.timespans_to_build).length; i++){

			timespan_index = parseInt(Object.keys(this.calendar_list.timespans_to_build)[i]);
			total_day = 0;

			count_timespans[timespan_index]++;
			num_timespans++;

			current_timespan = this.calendar_list.timespans_to_build[timespan_index];

			month_week_num = 1;

			if(!this.calendar.year_data.overflow){
				week_day = 1;
				year_week_num++;
				total_week_num++;
			}

			for(day = 0; day <= current_timespan.length; day++, total_day++){

				if(this.calendar.settings.only_reveal_today && !this.owner && (timespan_index > this.date.timespan || (timespan_index == this.date.timespan && total_day > this.date.day))){

					data = {
						processed: false
					}

					continue;

				}

				moon_data = [];

				if(day == 0){

					total_day++;

					for(leap_day_index = 0; leap_day_index < current_timespan.leap_days.length; leap_day_index++){

						leap_day = current_timespan.leap_days[leap_day_index];

						if(leap_day.intercalary && leap_day.day === day){

							data = {
								'year': this.date.year,
								'era_year': era_year,

								'timespan_index': false,
								'timespan_number': i,
								'timespan_count': count_timespans[timespan_index],
								'num_timespans': num_timespans,
								'timespan_name': false,

								'epoch': epoch, 
								'day': leap_day_index+1,
								'year_day': year_day,
								'week_day': false,

								'month_week_num': false,
								'year_week_num': false,
								'total_week_num': false,

								

								'moon_phase': [],
								'moon_phase_num_epoch': [],
								'moon_phase_num_month': [],
								'moon_phase_num_year': [],

								'cycle': current_cycle.array,
								
								'intercalary': true,
								'leap_day': leap_day.index,

								'season': climate_generator.get_season_data(epoch)
								
							}

							if((this.calendar.settings.hide_all_weather && !this.owner) || (this.calendar.settings.hide_future_weather && !this.owner && (timespan_index > this.date.timespan || (timespan_index == this.date.timespan && total_day > this.date.day)))){
								data.weather = false;
							}else{
								if(climate_generator.process){
									data.weather = climate_generator.get_weather_data(epoch);
								}
							}

							for(moon_index = 0; moon_index < this.calendar.moons.length; moon_index++){

								var moon = this.calendar.moons[moon_index];

								var moon_position_data = ((epoch - moon.shift) / moon.cycle);
								var moon_position = (moon_position_data - Math.floor(moon_position_data));
								var phase = Math.floor(moon_position*moon.granularity);

								this.data.repititions.year_moons[moon_index][phase]++;
								this.data.repititions.timespan_moons[timespan_index][moon_index][phase]++;

								var position_data = ((epoch-moon.shift)/moon.cycle)
								var phase_epoch = Math.floor(Math.abs(position_data)+1);

								data['moon_phase'][moon_index] = phase;
								data['moon_phase_num_epoch'][moon_index] = phase_epoch;
								data['moon_phase_num_month'][moon_index] = this.data.repititions.timespan_moons[timespan_index][moon_index][phase];
								data['moon_phase_num_year'][moon_index] = this.data.repititions.year_moons[moon_index][phase];

							}

							this.add_epoch_data(epoch, data);

							epoch++;

							year_day++;

							total_day++;

						}
					}

					total_day--;

				}

				if(day > 0){

					data = {
						'year': this.date.year,
						'era_year': era_year,

						'timespan_index': timespan_index,
						'timespan_number': i,
						'timespan_count': count_timespans[timespan_index],
						'num_timespans': num_timespans,
						'timespan_name': current_timespan.name,

						'epoch': epoch, 
						'day': day,
						'year_day': year_day,
						'week_day': week_day,

						'month_week_num': month_week_num,
						'year_week_num': year_week_num,
						'total_week_num': total_week_num,

						

						'moon_phase': [],
						'moon_phase_num_epoch': [],
						'moon_phase_num_month': [],
						'moon_phase_num_year': [],

						'cycle': current_cycle.array,
						'intercalary': timespan.type === "intercalary",

						'season': climate_generator.get_season_data(epoch)
					}

					if((this.calendar.settings.hide_all_weather && !this.owner) || (this.calendar.settings.hide_future_weather && !this.owner && (timespan_index > this.date.timespan || (timespan_index == this.date.timespan && total_day > this.date.day)))){
						data.weather = false;
					}else{
						if(climate_generator.process){
							data.weather = climate_generator.get_weather_data(epoch);
						}
					}
					
					for(moon_index = 0; moon_index < this.calendar.moons.length; moon_index++){

						var moon = this.calendar.moons[moon_index];

						var moon_position_data = ((epoch - moon.shift) / moon.cycle);
						var moon_position = (moon_position_data - Math.floor(moon_position_data));
						var phase = Math.floor(moon_position*moon.granularity);

						this.data.repititions.year_moons[moon_index][phase]++;
						this.data.repititions.timespan_moons[timespan_index][moon_index][phase]++;

						var position_data = ((epoch-moon.shift)/moon.cycle)
						var phase_epoch = Math.floor(Math.abs(position_data)+1);

						data['moon_phase'][moon_index] = phase;
						data['moon_phase_num_epoch'][moon_index] = phase_epoch;
						data['moon_phase_num_month'][moon_index] = this.data.repititions.timespan_moons[timespan_index][moon_index][phase];
						data['moon_phase_num_year'][moon_index] = this.data.repititions.year_moons[moon_index][phase];

					}

					this.data.repititions.week_days[data.timespan_index][data.week_day]++;
					data.week_day_num = this.data.repititions.week_days[data.timespan_index][data.week_day];

					this.add_epoch_data(epoch, data);
					epoch++;
					year_day++;

					week_day++;

					if(week_day > current_timespan.week.length){
						week_day = 1;
						month_week_num++;
						year_week_num++;
						total_week_num++;
					}

					total_day++;

					for(leap_day_index = 0; leap_day_index < current_timespan.leap_days.length; leap_day_index++){

						leap_day = current_timespan.leap_days[leap_day_index];

						if(leap_day.intercalary && leap_day.day === day){

							data = {
								'year': this.date.year,
								'era_year': era_year,

								'timespan_index': false,
								'timespan_number': false,
								'timespan_count': count_timespans[timespan_index],
								'num_timespans': num_timespans,
								'timespan_name': false,

								'epoch': epoch, 
								'day': leap_day_index+1,
								'year_day': year_day,
								'week_day': week_day,

								'month_week_num': false,
								'year_week_num': false,
								'total_week_num': false,

								'moon_phase': [],
								'moon_phase_num_epoch': [],
								'moon_phase_num_month': [],
								'moon_phase_num_year': [],

								'cycle': current_cycle.array,
								
								'intercalary': true,
								'leap_day': leap_day.index,

								'season': climate_generator.get_season_data(epoch)
							}

							if((this.calendar.settings.hide_all_weather && !this.owner) || (this.calendar.settings.hide_future_weather && !this.owner && (timespan_index > this.date.timespan || (timespan_index == this.date.timespan && total_day > this.date.day)))){
								data.weather = false;
							}else{
								if(climate_generator.process){
									data.weather = climate_generator.get_weather_data(epoch);
								}
							}

							for(moon_index = 0; moon_index < this.calendar.moons.length; moon_index++){

								var moon = this.calendar.moons[moon_index];

								var moon_position_data = ((epoch - moon.shift) / moon.cycle);
								var moon_position = (moon_position_data - Math.floor(moon_position_data));
								var phase = Math.floor(moon_position*moon.granularity);

								this.data.repititions.year_moons[moon_index][phase]++;
								this.data.repititions.timespan_moons[timespan_index][moon_index][phase]++;

								var position_data = ((epoch-moon.shift)/moon.cycle)
								var phase_epoch = Math.floor(Math.abs(position_data)+1);

								data['moon_phase'][moon_index] = phase;
								data['moon_phase_num_epoch'][moon_index] = phase_epoch;
								data['moon_phase_num_month'][moon_index] = this.data.repititions.timespan_moons[timespan_index][moon_index][phase];
								data['moon_phase_num_year'][moon_index] = this.data.repititions.year_moons[moon_index][phase];

							}


							this.add_epoch_data(epoch, data);
							
							epoch++;

							year_day++;

							total_day++;

						}
					}

					total_day--;
				}
			}
		}

		console.log(this.date.year, first_epoch, epoch, year_day-1)

		if(!this.calendar.settings.show_current_month){
			year_day = 1;
		}


		return {
			calendar: this.calendar,
			success: true,
			year_data: {
				year: this.date.year,
				era_year: era_year,
				epoch: first_epoch,
				last_epoch: epoch,
				week_day: first_week_day,
				year_day: year_day,
				has_weather: climate_generator.process
			},
			timespans: this.calendar_list.timespans_to_build,
			epoch_data: this.data.epochs,
			pre_epoch_data: this.pre_data.epochs,
		}

	},

}

onmessage = e => {
	calendar_builder.calendar = e.data.calendar;
	calendar_builder.date = e.data.date;
	calendar_builder.owner = e.data.owner;


	data = calendar_builder.evaluate_calendar_data();
	
	postMessage({
		processed_data: data,
		action: e.data.action
	});
}