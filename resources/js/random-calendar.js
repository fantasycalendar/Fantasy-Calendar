class RandomCalendar{

	get rndUNorm(){
		this.idx++;
		return fract(43758.5453 * Math.sin(this.seed + (78.233 * this.idx)));
	}

	random_int_between(min, max){
		return Math.round(this.rndUNorm * (max - min) + min);
	}

	randomize(static_data){

		this.seed = Math.abs((Math.random().toString().substr(7)|0));
		this.idx = 0;

		var months		= this.random_int_between(6, 18);
		var leap_days	= this.random_int_between(0, 1);
		var moons		= this.random_int_between(1, 5);
		var seasons		= this.random_int_between(1, 2)*2;

		var longest_moon_cycle = 0;
		var longest_moon_index = 0;

		static_data.moons = [];
		for(var i = 0; i < moons; i++){

			var cycle = this.random_int_between(4, 48)

			static_data.moons.push({
				'name':  `Moon ${i+1}`,
				'cycle': cycle,
				'shift': this.random_int_between(0, cycle),
				'granularity': get_moon_granularity(cycle),
				'color': '#FFFFFF',
				'hidden': false,
				'custom_phase': false
			});

			if(cycle > longest_moon_cycle){
				longest_moon_cycle = cycle;
				longest_moon_index = i;
			}
		}

		static_data.moons[longest_moon_index].shift = 0;

		var weekdays	= longest_moon_cycle/4 > 8 ? Math.floor(longest_moon_cycle/5) : Math.floor(longest_moon_cycle/4);

		static_data.year_data.global_week = [];
		for(var i = 0; i < weekdays; i++){
			static_data.year_data.global_week.push(`Weekday ${i+1}`)
		}

		static_data.year_data.overflow = true;

		var year_length = 0;
		var total_year_length = longest_moon_cycle*months;
		static_data.year_data.timespans = [];
		for(var i = 0; i < months; i++){
			var length = this.random_int_between(longest_moon_cycle-2, longest_moon_cycle+2);
			if(total_year_length-length < 0){
				length = total_year_length;
			}
			year_length += length;
			total_year_length -= length;
			static_data.year_data.timespans.push({
				"name": `Month ${i+1}`,
				'type': 'month',
				'interval': 1,
				'offset': 0,
				'length': length
			});
		}

		static_data.year_data.leap_days = [];
		for(var i = 0; i < leap_days; i++){
			var interval = 2*this.random_int_between(1, 4);
			year_length += 1/interval;
			static_data.year_data.leap_days.push({
				'name': `Leap day ${i+1}`,
				'intercalary': false,
				'timespan': this.random_int_between(0, months-1),
				'adds_week_day': false,
				'day': 0,
				'week_day': '',
				'interval': interval.toString(),
				'offset': 0
			});
		}

		static_data.moons[longest_moon_index].cycle = year_length/months;
		static_data.moons[longest_moon_index].granularity = get_moon_granularity(year_length/months);

		static_data.clock.enabled = true;
		static_data.clock.render = true;
		static_data.clock.hours = 24;
		static_data.clock.minutes = 30;

		static_data.seasons.global_settings.periodic_seasons = true;

		static_data.seasons.data = [];

		static_data.seasons.data.push({
			"name": "Winter",
			"time": {
				"sunrise": {
					"hour": 10,
					"minute": 0
				},
				"sunset": {
					"hour": 17,
					"minute": 0
				}
			},
			"transition_length": year_length / seasons,
			"duration": 0
		});

		if(seasons == 4){

			static_data.seasons.data.push({
				"name": "Spring",
				"time": {
					"sunrise": {
						"hour": 8,
						"minute": 30
					},
					"sunset": {
						"hour": 18,
						"minute": 30
					}
				},
				"transition_length": year_length / seasons,
				"duration": 0
			});

		}

		static_data.seasons.data.push({
			"name": "Summer",
			"time": {
				"sunrise": {
					"hour": 7,
					"minute": 0
				},
				"sunset": {
					"hour": 20,
					"minute": 0
				}
			},
			"transition_length": year_length / seasons,
			"duration": 0
		});

		if(seasons == 4){

			static_data.seasons.data.push({
				"name": "Autumn",
				"time": {
					"sunrise": {
						"hour": 8,
						"minute": 30
					},
					"sunset": {
						"hour": 18,
						"minute": 30
					}
				},
				"transition_length": year_length / seasons,
				"duration": 0
			});

		}

		static_data.seasons.global_settings.season_offset = Math.floor(0-static_data.year_data.timespans[static_data.year_data.timespans.length-1].length/3);

		return static_data;

	}

}

export default RandomCalendar;
