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

		var weekdays	= this.random_int_between(5, 10);
		var months		= this.random_int_between(6, 18);
		var leap_days	= this.random_int_between(0, 3);
		var moons		= this.random_int_between(1, 5);

		var longest_moon_cycle = 0
		var longest_moon_index = 0

		static_data.moons = [];
		for(var i = 0; i < moons; i++){

			var cycle = this.random_int_between(4, 48)

			static_data.moons.push({
				'name':  `Moon ${i+1}`,
				'cycle': cycle,
				'shift': this.random_int_between(4, 48),
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

		static_data.year_data.global_week = [];
		for(var i = 0; i < weekdays; i++){
			static_data.year_data.global_week.push(`Weekday ${i+1}`)			
		}

		var year_length = 0;
		static_data.year_data.timespans = [];
		for(var i = 0; i < months; i++){
			var length = this.random_int_between(longest_moon_cycle-2, longest_moon_cycle+2);
			year_length += length;
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
			var interval = this.random_int_between(2, 8);
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

		return static_data;

	}

}

module.exports = RandomCalendar;