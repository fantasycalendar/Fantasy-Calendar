class RandomCalendar{

	rndUNorm(idx){
		return fract(43758.5453 * Math.sin(this.seed + (78.233 * idx)));
	}

	random_int_between(idx, min, max){
		return Math.round(this.rndUNorm(idx) * (max - min) + min);
	}

	randomize(){

		this.seed = Math.abs((Math.random().toString().substr(7)|0));

		var static_data = {
            "year_data":{
                "first_day":1,
                "overflow":false,
                "global_week":[],
                "timespans":[],
                "leap_days":[]
            },
            "moons":[],
            "clock":{
                "enabled":false,
                "hours":24,
                "minutes":60,
                "offset":0
            },
            "seasons":{
                "data":[],
                "locations":[],
                "global_settings":{
                    "season_offset":0,
                    "weather_offset":0,
                    "seed":Math.abs(Math.random().toString().substr(7)|0),
                    "temp_sys":"metric",
                    "wind_sys":"metric",
                    "cinematic":false,
                    "enable_weather":false,
                    "periodic_seasons":false
                }
            },
            "eras":[],
            "settings":{
                "layout":"grid",
                "show_current_month":false,
                "allow_view":false,
                "only_backwards":false,
                "only_reveal_today":false,
                "hide_moons":false,
                "hide_clock":false,
                "hide_events":false,
                "hide_eras":false,
                "hide_all_weather":false,
                "hide_future_weather":false,
                "add_month_number":false,
                "add_year_day_number":false
            },
            "cycles":{
                "format":"",
                "data":[]
            },
            "event_data":{
                "categories":[],
                "events":[]
            }
        };

		var step = 0;

		var weekdays	= this.random_int_between(step, 5, 10);
		step++;
		var months		= this.random_int_between(step, 6, 24);
		step++;
		var leap_days	= this.random_int_between(step, 0, 3);
		step++;
		var moons		= this.random_int_between(step, 0, 5);
		step++;

		for(var i = 0; i < weekdays-1; i++){
			static_data.year_data.global_week.push(`Weekday ${i+1}`)			
		}

		for(var i = 0; i < months-1; i++, step++){
			static_data.year_data.timespans.push({
				"name": `Month ${i+1}`,
				'type': 'month',
				'interval': 1,
				'offset': 0,
				'length': this.random_int_between(step, 20, 50)
			});
		}

		for(var i = 0; i < leap_days-1; i++, step++){
			static_data.year_data.leap_days.push({
				'name': `Leap day ${i+1}`,
				'intercalary': false,
				'timespan': this.random_int_between(step+1000, 0, months-1),
				'adds_week_day': false,
				'day': 0,
				'week_day': '',
				'interval': this.random_int_between(step+100, 2, 8).toString(),
				'offset': 0
			});
		}

		for(var i = 0; i < moons-1; i++, step++){
			static_data.moons.push({
				'name':  `Moon ${i+1}`,
				'cycle': this.random_int_between(step+100, 4, 48),
				'shift': this.random_int_between(step+1000, 4, 48),
				'granularity': get_moon_granularity(this.random_int_between(step+100, 4, 48)),
				'color': '#FFFFFF',
				'hidden': false,
				'custom_phase': false
			});
		}

		return clone(static_data);

	}

}

module.exports = RandomCalendar;