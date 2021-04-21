const calendar_data_generator = {

	calendar_name: '',
	dynamic_data: {},
	static_data: {},
    events: {},
    event_categories: {},
    repetitions: {},
    epochs: {},
    climate_generator: undefined,
    callback: false,
    build_seasons: true,

    /**
     * Evaluates the moon phase based on the given epoch data
     *
     * @param epoch_data
     * @returns epoch_data
     */
	add_moon_data: function(epoch_data){

	    let epoch = epoch_data.epoch;

		for(let moon_index = 0; moon_index < this.static_data.moons.length; moon_index++){

			let moon = this.static_data.moons[moon_index];
			let phase = 0;
			let phase_epoch;

			if(moon.custom_phase){

				let custom_cycle = moon.custom_cycle.split(',');
				phase = custom_cycle[Math.abs(epoch%(custom_cycle.length))]|0;
				phase_epoch = Math.round(Math.abs(epoch/(custom_cycle.length))+1);

			}else{

				let moon_position_data = ((epoch - moon.shift) / moon.cycle);
				let moon_position = (moon_position_data - Math.floor(moon_position_data));

				if(moon.cycle_rounding === "floor"){
					phase = Math.floor(moon_position*moon.granularity)%moon.granularity;
					phase_epoch = Math.floor(Math.abs(moon_position_data)+1);
				}else if(moon.cycle_rounding === "round" || moon.cycle_rounding === undefined){
					phase = Math.round(moon_position*moon.granularity)%moon.granularity;
					phase_epoch = Math.round(Math.abs(moon_position_data)+1);
				}else if(moon.cycle_rounding === "ceil"){
					phase = Math.ceil(moon_position*moon.granularity)%moon.granularity;
					phase_epoch = Math.ceil(Math.abs(moon_position_data)+1);
				}

			}

			epoch_data['moon_phase'][moon_index] = phase;
			epoch_data['moon_phase_num_epoch'][moon_index] = phase_epoch;
			epoch_data['moon_phase_num_year'][moon_index] = this.increment_moon_year_repetitions(epoch_data.year, moon_index, phase);
			epoch_data['moon_phase_num_month'][moon_index] = this.increment_moon_month_repetitions(epoch_data.year, epoch_data.timespan_index, moon_index, phase);

		}

		return epoch_data;

	},

    /**
     * Increments each time a certain moon phase was spotted in a year
     *
     * @param year
     * @param moon_index
     * @param phase
     * @returns {*}
     */
    increment_moon_year_repetitions(year, moon_index, phase){

	    if(this.repetitions[year] === undefined){
	        this.repetitions[year] = {};
        }

	    if(this.repetitions[year][moon_index] === undefined){
	        this.repetitions[year][moon_index] = {};
        }

	    if(this.repetitions[year][moon_index][phase] === undefined){
	        this.repetitions[year][moon_index][phase] = 0;
        }

	    this.repetitions[year][moon_index][phase]++;

	    return this.repetitions[year][moon_index][phase];

    },

    /**
     * Increments each time a certain moon phase was spotted in a timespan within a year
     *
     * @param year
     * @param timespan
     * @param moon_index
     * @param phase
     * @returns {*}
     */
    increment_moon_month_repetitions(year, timespan, moon_index, phase){

	    if(this.repetitions[year] === undefined){
	        this.repetitions[year] = {};
        }

	    if(this.repetitions[year][timespan] === undefined){
	        this.repetitions[year][timespan] = {};
        }

	    if(this.repetitions[year][timespan][moon_index] === undefined){
	        this.repetitions[year][timespan][moon_index] = {};
        }

	    if(this.repetitions[year][timespan][moon_index][phase] === undefined){
	        this.repetitions[year][timespan][moon_index][phase] = 0;
        }

	    this.repetitions[year][timespan][moon_index][phase]++;

	    return this.repetitions[year][timespan][moon_index][phase];

    },

    /**
     * Increments each time a certain weekday is spotted in a timespan within a year
     *
     * @param year
     * @param timespan
     * @param weekday
     * @returns int
     */
    increment_weekday_repetitions(year, timespan, weekday){

	    if(this.repetitions[year] === undefined){
	        this.repetitions[year] = {};
        }

	    if(this.repetitions[year][timespan] === undefined){
	        this.repetitions[year][timespan] = {};
        }

	    if(this.repetitions[year][timespan][weekday] === undefined){
	        this.repetitions[year][timespan][weekday] = 0;
        }

	    this.repetitions[year][timespan][weekday]++;

	    return this.repetitions[year][timespan][weekday];

    },

    /**
     * Sanity function that resets every era's start point (their epoch) to be 100% sure it is sane data
     */
    reset_eras: function(){

		for(let i = 0; i < this.static_data.eras.length; i++){
			if(this.static_data.eras[i].settings.starting_era) continue;
			let epoch_data = evaluate_calendar_start(
			    this.static_data,
                convert_year(this.static_data, this.static_data.eras[i].date.year),
                this.static_data.eras[i].date.timespan,
                this.static_data.eras[i].date.day
            );
			this.static_data.eras[i].date.epoch = epoch_data.epoch;
		}

    },

    /**
     * Evaluates the extra days we must add to the pre and post calendar epoch data range to accurately calculate the events
     */
    evaluate_pre_post: function(){

		this.pre_search = 0;
		this.post_search = 0;

		for(let event_index = 0; event_index < this.events.length; event_index++){
			let event = this.events[event_index];

			this.pre_search = event.data.has_duration ? Math.max(event.data.duration, this.pre_search) : this.pre_search;
			this.pre_search = event.data.limited_repeat ? Math.max(event.data.limited_repeat_num, this.pre_search) : this.pre_search;
			this.pre_search = event.data.search_distance ? Math.max(event.data.search_distance, this.pre_search) : this.pre_search;

			this.post_search = event.data.search_distance ? Math.max(event.data.search_distance, this.post_search) : this.post_search;

			this.events[event_index].data.search_distance = Math.max(this.pre_search, this.post_search);
		}

    },

    /**
     * Creates a holistic timespan object with all the data needed for a full calendar render data creation
     *
     * @param year
     * @param timespan_index
     * @returns {Object}
     */
    create_adjusted_timespan: function(year, timespan_index){

		let timespan = clone(this.static_data.year_data.timespans[timespan_index]);

		timespan.index = timespan_index;

		timespan.render = false;

        if(convert_year(this.static_data, this.dynamic_data.year) === year){
            timespan.render = (!this.static_data.settings.show_current_month) || (this.static_data.settings.show_current_month && timespan_index === this.dynamic_data.timespan);
        }

		timespan.week = timespan.week ? timespan.week : clone(this.static_data.year_data.global_week);
		timespan.truncated_week = truncate_weekdays(timespan.week);

		timespan.leap_days = [];

		let timespan_fraction;

		if(timespan.interval === 1){

			timespan_fraction = year;

		}else{

			let offset = timespan.offset%timespan.interval;

			timespan_fraction = Math.floor((year - offset) / timespan.interval);

		}

		let leap_days = this.static_data.year_data.leap_days.filter(leap_day => leap_day.timespan === timespan_index);
		let normal_leapdays = leap_days.filter(leap_day => !leap_day.adds_week_day && !leap_day.intercalary)
		let intercalary_leapdays = leap_days.filter(leap_day => !leap_day.adds_week_day && leap_day.intercalary)
		let week_day_leap_days = leap_days.filter(leap_day => leap_day.adds_week_day)

		for (let index in normal_leapdays) {

			let leap_day = normal_leapdays[index];

			leap_day.index = leap_days.indexOf(leap_day);

			if (is_leap(this.static_data, timespan_fraction, leap_day.interval, leap_day.offset)) {
				timespan.length++;
			}

		}

		for (let index in intercalary_leapdays) {

			let leap_day = intercalary_leapdays[index];

			leap_day.index = leap_days.indexOf(leap_day);

			if (is_leap(this.static_data, timespan_fraction, leap_day.interval, leap_day.offset)) {
				if(timespan.type === 'intercalary'){
					timespan.length++;
				}else{
					timespan.leap_days.push(leap_day);
				}
			}

		}

		week_day_leap_days.sort((a, b) => a.day - b.day);

		let leap_day_offset = 0;
		let week_length = timespan.week.length;
		let before_weekdays = [];
		let after_weekdays = [];

		for (let index in week_day_leap_days) {

			let leap_day = week_day_leap_days[index];

			leap_day.index = leap_days.indexOf(leap_day);

			if (is_leap(this.static_data, timespan_fraction, leap_day.interval, leap_day.offset)) {
				timespan.length++;
				if (leap_day.day === 0) {
					before_weekdays.push(leap_day.week_day)
				} else if (leap_day.day === week_length) {
					after_weekdays.push(leap_day.week_day)
				} else {
					let location = leap_day.day % timespan.week.length;
					timespan.week.splice(location + leap_day_offset, 0, leap_day.week_day)
					leap_day_offset++;
				}
			}

		}

		timespan.week = before_weekdays.concat(timespan.week).concat(after_weekdays);

		return timespan;

	},

    /**
     * Evaluates which timespans should appear in a given year
     *
     * @param year
     * @returns timespans array
     */
    get_timespans_in_year: function(year){

	    let timespans = [];
        let num_timespans = this.static_data.year_data.timespans.length;
        let ending_day = 0;

        for(let era_index = 0; era_index < this.static_data.eras.length; era_index++){

            let era = this.static_data.eras[era_index];

            if(era.settings.ends_year && convert_year(this.static_data, year) === convert_year(this.static_data, era.date.year) && era.date.timespan < num_timespans+1){

                num_timespans = era.date.timespan+1;
                ending_day = era.date.day;

            }

        }

        for(let timespan_index = 0; timespan_index < num_timespans; timespan_index++){

            let timespan_object = this.static_data.year_data.timespans[timespan_index];

            let timespan_data = this.create_adjusted_timespan(convert_year(this.static_data, year), timespan_index);

            if(is_leap_simple(this.static_data, convert_year(this.static_data, year), timespan_object.interval, timespan_object.offset) && timespan_data.length > 0){

                if(timespan_index === num_timespans-1){
                    timespan_data.length = Math.max(timespan_data.length, ending_day);
                }

                timespans.push(timespan_data);

            }

        }

        return timespans;

    },

    /**
     * Returns a number of timespans based on a given year range
     *
     * @param start_year
     * @param end_year
     * @returns timespans object
     */
    get_timespans_in_year_range: function(start_year, end_year){

	    let timespans = {};

	    for(let year = start_year; year < end_year; year++){

	        timespans[convert_year(this.static_data, year)] = this.get_timespans_in_year(year);

        }

	    return timespans;

    },

    /**
     * Evaluates how many extra years we need to add before the timespans to the evaluation for year-spanning events
     * @param year
     */
    evaluate_pre_calculation: function(year){

		let pre_year = year;
		let days = 0;

		if(this.pre_search !== 0){

			while(days < this.pre_search){

                pre_year--;

                let timespans_in_year = this.get_timespans_in_year(pre_year);

                if(timespans_in_year.length === 0) continue;

                this.timespans[convert_year(this.static_data, pre_year)] = timespans_in_year;

                let days_in_year = timespans_in_year.reduce(function(a, b) {
                    return isNaN(a) ? a.length + b.length : a + b.length ;
                });

                days += days_in_year;

                if(days >= this.pre_search){
                    break;
                }

			}

		}

    },

    /**
     * Evaluates how many extra years we need to add after the timespans to the evaluation for year-spanning events
     * @param year
     */
    evaluate_post_calculation: function(year){

		let post_year = year;
		let days = 0;

		if(this.post_search !== 0){

			while(days < this.post_search){

			    post_year++;

                let timespans_in_year = this.get_timespans_in_year(post_year);

                if(timespans_in_year.length === 0) continue;

                this.timespans[convert_year(this.static_data, post_year)] = timespans_in_year;

                let days_in_year = timespans_in_year.reduce(function(a, b) {
                    return isNaN(a) ? a.length + b.length : a + b.length ;
                });

                days += days_in_year;

                if(days >= this.post_search){
                    break;
                }

			}

		}

    },

    /**
     * Adds a given data to a specific epoch within the epoch data container
     *
     * @param epoch
     * @param data
     */
    add_epoch_data: function(epoch, data){

	    this.epochs[epoch] = data;

    },

    /**
     * Transforms collected timespans into epoch data
     */
    evaluate_years: function(){

	    let start_year = Number(Object.keys(this.timespans)[0]);
		let start_data = evaluate_calendar_start(this.static_data, start_year);
		let era_year = start_data.era_year;
		let count_timespans = start_data.count_timespans;
		let num_timespans = start_data.num_timespans;
		let total_week_num = start_data.total_week_num
		let week_day = start_data.week_day;
		let epoch = start_data.epoch;
		let current_era = start_data.current_era;

		let year_start_data = evaluate_calendar_start(this.static_data, start_year);
		let year_day = 1 + start_data.epoch - year_start_data.epoch;
		let year_week_num = 1 + start_data.total_week_num - year_start_data.total_week_num;
		let inverse_year_week_num = 1 + evaluate_calendar_start(this.static_data, start_year+1).total_week_num - year_start_data.total_week_num - year_week_num;

		let year_num_timespans = start_data.num_timespans - year_start_data.num_timespans;

        for(let year_str in this.timespans){

            let year = Number(year_str);

            for(let timespan_str in this.timespans[year]){

                let timespan_index = Number(timespan_str)

                let current_timespan = this.timespans[year][timespan_index];

                current_timespan.epochs = {}

                count_timespans[current_timespan.index]++;
                num_timespans++;
                year_num_timespans++;
                month_week_num = 1;

                if(!this.static_data.year_data.overflow){
                    week_day = 1;
                }

                let month_start_epoch = epoch;

                for(let day = 0, timespan_day = 1; day <= current_timespan.length; day++) {

                    if (this.static_data.eras[current_era + 1] && epoch >= this.static_data.eras[current_era + 1].date.epoch) {
                        current_era++;
                        if (this.static_data.eras[current_era].settings.restart) {
                            era_year = 0;
                        }

                    }

                    if(day === 0) {
                        for (let leap_day_index = 0; leap_day_index < current_timespan.leap_days.length; leap_day_index++) {
                            let leap_day = current_timespan.leap_days[leap_day_index];
                            if (leap_day.intercalary && leap_day.day === day) {

                                let data = {
                                    'year': unconvert_year(this.static_data, year),
                                    'era_year': unconvert_year(this.static_data, era_year),

                                    'timespan_index': timespan_index,
                                    'timespan_number': i,
                                    'timespan_count': count_timespans[timespan_index],
                                    'num_timespans': num_timespans,
                                    'timespan_name': current_timespan.name,

                                    'epoch': epoch,
                                    'day': timespan_day,
                                    'inverse_day': 1 + current_timespan.length - day,
                                    'year_day': year_day,
                                    'week_day': undefined,
                                    'week_day_name': undefined,

                                    'inverse_month_week_num': undefined,
                                    'inverse_year_week_num': undefined,

                                    'month_week_num': current_timespan.type !== "intercalary" ? month_week_num : undefined,
                                    'year_week_num': current_timespan.type !== "intercalary" ? year_week_num : undefined,
                                    'total_week_num': current_timespan.type !== "intercalary" ? total_week_num : undefined,

                                    'moon_phase': [],
                                    'moon_phase_num_epoch': [],
                                    'moon_phase_num_month': [],
                                    'moon_phase_num_year': [],

                                    'intercalary': true,
                                    'leap_day': leap_day.index,

                                    'era': current_era

                                }

                                data.cycle = get_cycle(this.static_data, data).array;

                                data = this.add_moon_data(data);

                                this.add_epoch_data(epoch, data);
                                current_timespan.epochs[epoch] = data;

                                epoch++;
                                year_day++;
                                timespan_day++;
                            }
                        }
                    }

                    if (day > 0) {

                        let data = {
                            'year': unconvert_year(this.static_data, year),
                            'era_year': unconvert_year(this.static_data, era_year),

                            'timespan_index': timespan_index,
                            'timespan_number': year_num_timespans - 1,
                            'timespan_count': count_timespans[timespan_index],
                            'num_timespans': num_timespans,
                            'timespan_name': current_timespan.name,

                            'epoch': epoch,
                            'day': timespan_day,
                            'inverse_day': 1 + current_timespan.length - day,
                            'year_day': year_day,
                            'week_day': current_timespan.type !== "intercalary" ? week_day : undefined,
                            'week_day_name': current_timespan.type !== "intercalary" ? current_timespan.week[week_day - 1] : undefined,

                            'inverse_month_week_num': undefined,
                            'inverse_year_week_num': current_timespan.type !== "intercalary" ? inverse_year_week_num : undefined,
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

                        data.cycle = get_cycle(this.static_data, data).array;

                        if (current_timespan.type !== "intercalary") {

                            data.week_day_num = this.increment_weekday_repetitions(year, data.timespan_index, data.weekday-1);

                        }

                        data = this.add_moon_data(data);

                        this.add_epoch_data(epoch, data);
                        current_timespan.epochs[epoch] = data;
                        epoch++;
                        year_day++;
                        timespan_day++;

                        for(let leap_day_index = 0; leap_day_index < current_timespan.leap_days.length; leap_day_index++) {
                            let leap_day = current_timespan.leap_days[leap_day_index];
                            if (leap_day.intercalary && leap_day.day === day) {

                                let data = {
                                    'year': unconvert_year(this.static_data, year),
                                    'era_year': unconvert_year(this.static_data, era_year),

                                    'timespan_index': timespan_index,
                                    'timespan_number': i,
                                    'timespan_count': count_timespans[timespan_index],
                                    'num_timespans': num_timespans,
                                    'timespan_name': current_timespan.name,

                                    'epoch': epoch,
                                    'day': timespan_day,
                                    'inverse_day': 1 + current_timespan.length - day,
                                    'year_day': year_day,
                                    'week_day': undefined,
                                    'week_day_name': undefined,

                                    'inverse_month_week_num': undefined,
                                    'inverse_year_week_num': undefined,

                                    'month_week_num': current_timespan.type !== "intercalary" ? month_week_num : undefined,
                                    'year_week_num': current_timespan.type !== "intercalary" ? year_week_num : undefined,
                                    'total_week_num': current_timespan.type !== "intercalary" ? total_week_num : undefined,

                                    'moon_phase': [],
                                    'moon_phase_num_epoch': [],
                                    'moon_phase_num_month': [],
                                    'moon_phase_num_year': [],

                                    'intercalary': true,
                                    'leap_day': leap_day.index,

                                    'era': current_era

                                }

                                data.cycle = get_cycle(this.static_data, data).array;

                                data = this.add_moon_data(data);

                                this.add_epoch_data(epoch, data);
                                current_timespan.epochs[epoch] = data;
                                epoch++;
                                year_day++;
                                timespan_day++;
                            }
                        }

                        if(current_timespan.type !== "intercalary") {

                            week_day++;

                            if (week_day > current_timespan.week.length) {
                                week_day = 1;
                                month_week_num++;
                                year_week_num++;
                                total_week_num++;
                                inverse_year_week_num--;
                            }

                        }

                    }

                }

				let highest_month_week_num = this.epochs[epoch-1].month_week_num ?? 0;
				let week_day_nums = {};

				for(var j = epoch - 1; j >= month_start_epoch; j--) {

					if(this.epochs[j].month_week_num) {

						let current_month_week_num = this.epochs[j].month_week_num;
						let inverse_month_week_num = (highest_month_week_num-current_month_week_num)+1;
						this.epochs[j].inverse_month_week_num = inverse_month_week_num;

						if(week_day_nums[this.epochs[j].week_day] === undefined){
							week_day_nums[this.epochs[j].week_day] = 1;
						}else{
							week_day_nums[this.epochs[j].week_day]++;
						}

						this.epochs[j].inverse_week_day_num = week_day_nums[this.epochs[j].week_day];

					}

				}

				if(!this.static_data.year_data.overflow){
					year_week_num++;
					total_week_num++;
					inverse_year_week_num--;
				}
			}

			if(year !== convert_year(this.static_data, this.dynamic_data.year)){
				if(this.static_data.eras.length > 0 && current_era !== -1){
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
				year_num_timespans = 0;
				year_week_num = 1;
				inverse_year_week_num = 1 + evaluate_calendar_start(this.static_data, convert_year(this.static_data, this.dynamic_data.year)+1).total_week_num - evaluate_calendar_start(this.static_data, convert_year(this.static_data, this.dynamic_data.year)).total_week_num;
			}

        }

        if(this.build_seasons) {
            this.climate_generator = new Climate(this.epochs, this.static_data, this.dynamic_data, this.dynamic_data.year, start_data.epoch, epoch - 1, this.callback);
            this.epochs = this.climate_generator.generate();
        }

    },

    /**
     * Initializes the generator, checks for errors, and resets some key variables
     *
     * @returns {{success: boolean, errors: *[]}}
     * @private
     */
    __init__: function(){

		if(this.static_data.year_data.timespans.length === 0 || this.static_data.year_data.global_week.length === 0){

			let result = {
				success: true,
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

		this.repetitions = {};
        this.epochs = {};
        this.build_seasons = true;
	    this.callback = false;

		this.reset_eras();

		this.evaluate_pre_post();

    },

    /**
     * Creates data for a year range for event testing - does not generate display data
     *
     * @param start_year        The starting year from which to evaluate
     * @param end_year          The ending year to which to evaluate
     * @param build_seasons     Whether to also calculate seasons. May not be needed for the event being tested.
     * @returns {{end_epoch: number, success: boolean, start_epoch: number, epoch_data: object}}
     */
    run_future: function(start_year, end_year, build_seasons){

	    this.__init__();

	    this.callback = true;
	    this.build_seasons = build_seasons;

        start_year = unconvert_year(this.static_data, start_year)
        end_year = unconvert_year(this.static_data, end_year)
        this.timespans = this.get_timespans_in_year_range(start_year, end_year);
        this.evaluate_pre_calculation(start_year);
        this.evaluate_post_calculation(end_year);

		this.evaluate_years();

        const epochs = Object.keys(this.epochs);
        const calendar_start_epoch = Number(epochs[0]);
        const calendar_end_epoch = Number(epochs[epochs.length-1]);

		return {
			success: true,
            start_epoch: calendar_start_epoch,
            end_epoch: calendar_end_epoch,
			epoch_data: this.epochs
        }

    },

    /**
     * Primary generation function within the epoch data generation. Returns all the data needed to display a calendar
     *
     * @returns {{
     *      year_data: {
     *          year: int,
     *          end_epoch: int,
     *          start_epoch: int,
     *          year_day: int,
     *          week_day: int,
     *          era_year: int
     *      },
     *      success: boolean,
     *      epoch_data: object,
     *      static_data: object,
     *      processed_weather: boolean,
     *      processed_seasons: boolean,
     *      timespans_to_build: array
     *  }}
     */
    run: function(){

		this.__init__();

		this.timespans = {};

        this.timespans[convert_year(this.static_data, this.dynamic_data.year)] = this.get_timespans_in_year(this.dynamic_data.year);
        let timespans_to_build = this.timespans[convert_year(this.static_data, this.dynamic_data.year)].filter(timespan => timespan.render)
        this.evaluate_pre_calculation(this.dynamic_data.year);
        this.evaluate_post_calculation(this.dynamic_data.year);

		this.evaluate_years();

        const first_timespan = timespans_to_build[0];
        const epochs = Object.keys(timespans_to_build[timespans_to_build.length-1].epochs);

        const calendar_start_epoch = Number(epochs[0]);
        const calendar_end_epoch = Number(epochs[epochs.length-1]);
        const calendar_week_day = Number(first_timespan.epochs[calendar_start_epoch].week_day);
        const calendar_year_day = Number(first_timespan.epochs[calendar_start_epoch].year_day);
        const calendar_era_year = Number(first_timespan.epochs[calendar_start_epoch].era_year);

		return {
			success: true,
			static_data: this.static_data,
			year_data: {
				year: this.dynamic_data.year,
				era_year: unconvert_year(this.static_data, calendar_era_year),
				start_epoch: calendar_start_epoch,
				end_epoch: calendar_end_epoch,
				week_day: calendar_week_day,
				year_day: calendar_year_day
			},
			epoch_data: this.epochs,
			processed_seasons: this.climate_generator.process_seasons,
			processed_weather: this.climate_generator.process_weather,
			timespans_to_build: timespans_to_build
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

		this.stored_epochs = {}

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

		function find_stored_epoch(year, timespan, day) {
			let date_string = `${convert_year(event_evaluator.static_data, year)}-${timespan}-${day}`;
			let epoch = event_evaluator.stored_epochs[date_string];
			if(epoch === undefined) {
				epoch = evaluate_calendar_start(event_evaluator.static_data, convert_year(event_evaluator.static_data, year), timespan, day).epoch;
				event_evaluator.stored_epochs[date_string] = epoch;
			}
			return epoch;
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
					var cond_1 = find_stored_epoch(values[0], values[1], values[2]);

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

				}else if(array[0] === "Cycle"){

					var selected_cycle = !isNaN(Number(values[subcon[2]])) ? Number(values[subcon[2]]) : values[subcon[2]];
					var selected = epoch_data[selector][selected_cycle];
					var cond_1 = !isNaN(Number(values[subcon[3]])) ? Number(values[subcon[3]]) : values[subcon[3]];

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

					var is_count = condition[0] !== "" && condition[0] !== "!" && !isNaN(Number(condition[0]));

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

					var is_count = condition[0] !== "" && condition[0] !== "!" && !isNaN(Number(condition[0]));

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

			if(this.current_event.data.conditions.length != 0){
				if(this.current_event.data.conditions[this.current_event.data.conditions.length-1].length == 1){
					this.current_event.data.conditions.pop();
				}
			}

			if(this.current_event.data.date !== undefined && this.current_event.data.date.length === 3){

				var epoch = evaluate_calendar_start(event_evaluator.static_data, convert_year(event_evaluator.static_data, this.current_event.data.date[0]), this.current_event.data.date[1], this.current_event.data.date[2]).epoch;

				var begin_epoch = this.current_event.data.has_duration ? event_evaluator.start_epoch-this.current_event.data.duration : event_evaluator.start_epoch;

				if(epoch >= begin_epoch && epoch <= event_evaluator.end_epoch){

					add_to_epoch(this.current_event, event_index, epoch);

				}

			}else{

				let search_distance = this.current_event.data.search_distance ? this.current_event.data.search_distance : 0;

				var begin_epoch = this.current_event.lookback ? event_evaluator.start_epoch-this.current_event.lookback-1 : event_evaluator.start_epoch-search_distance-1;
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

