function create_season_events(complex){

	if(complex){

		return [
			{
				"name":"Summer Solstice",
				"description":"At the summer solstice, the Sun travels the longest path through the sky, and that day therefore has the most daylight.",
				"data":{
					'has_duration': false,
					'duration': 0,
					'show_first_last': false,
					'limited_repeat': false,
					'limited_repeat_num': 0,
					'connected_events': [],
					'date': [],
					"conditions":[
						["Season","15",['1']]
					]
				},
				"event_category_id":"-1",
				"settings":{
					"color":"Green",
					"text":"text",
					"hide":false,
					"hide_full":false,
					"print":false
				}
			},
			{
				"name":"Winter Solstice",
				"description":"The winter solstice marks the shortest day and longest night of the year, when the sun is at its lowest arc in the sky.",
				"data":{
					'has_duration': false,
					'duration': 0,
					'show_first_last': false,
					'limited_repeat': false,
					'limited_repeat_num': 0,
					'connected_events': [],
					'date': [],
					"conditions":[
						["Season","16",['1']]
					]
				},
				"event_category_id":"-1",
				"settings":{
					"color":"Green",
					"text":"text",
					"hide":false,
					"hide_full":false,
					"print":false
				}
			},
			{
				"name":"Spring Equinox",
				"description":"The spring equinox is when the day and the night are equally as long, and are getting longer.",
				"data":{
					'has_duration': false,
					'duration': 0,
					'show_first_last': false,
					'limited_repeat': true,
					'limited_repeat_num': 2,
					'connected_events': [],
					'date': [],
					"conditions":[
						["Season","17",['1']]
					]
				},
				"event_category_id":"-1",
				"settings":{
					"color":"Green",
					"text":"text",
					"hide":false,
					"hide_full":false,
					"print":false
				}
			},
			{
				"name":"Autumn Equinox",
				"description":"The autumn equinox is when the day and the night are equally as long, and are getting shorter.",
				"data":{
					'has_duration': false,
					'duration': 0,
					'show_first_last': false,
					'limited_repeat': true,
					'limited_repeat_num': 2,
					'connected_events': [],
					'date': [],
					"conditions":[
						["Season","18",['1']]
					]
				},
				"event_category_id":"-1",
				"settings":{
					"color":"Green",
					"text":"text",
					"hide":false,
					"hide_full":false,
					"print":false
				}
			}
		]
	}else{

		var events = [];

		if(static_data.seasons.data.length == 4){

			for(var i = 0; i < static_data.seasons.data.length; i++){

				var season = static_data.seasons.data[i];

				var season_name = season.name;

				if(season_name.toLowerCase().includes('winter')){
					var name = "Winter Solstice";
					var description = "The winter solstice marks the shortest day and longest night of the year, when the sun is at its lowest arc in the sky.";
				}else if(season_name.toLowerCase().includes('summer')){
					var name = "Summer Solstice";
					var description = "	At the summer solstice, the Sun travels the longest path through the sky, and that day therefore has the most daylight.";
				}else if(season_name.toLowerCase().includes('autumn')){
					var name = "Autumn Equinox";
					var description = "The autumn equinox is when the day and the night are equally as long, and are getting shorter.";
				}else if(season_name.toLowerCase().includes('spring')){
					var name = "Spring Equinox";
					var description = "The spring equinox is when the day and the night are equally as long, and are getting longer.";
				}else{
					var name = `${season_name}`;
					var description = ""
				}

				events.push({
					"name": name,
					"description": description,
					"data":{
						'has_duration': false,
						'duration': 0,
						'show_first_last': false,
						'limited_repeat': false,
						'limited_repeat_num': 0,
						'connected_events': [],
						'date': [],
						"conditions":[
							["Season","0",[i]],
							["&&"],
							["Season","8",[1]],
						]
					},
					"event_category_id":"-1",
					"settings":{
						"color":"Green",
						"text":"text",
						"hide":false,
						"hide_full":false,
						"print":false
					}
				});

			}

		}else{

			for(var i = 0; i < static_data.seasons.data.length; i++){

				var season = static_data.seasons.data[i];

				var season_name = season.name;

				if(season_name.toLowerCase().includes('winter')){

					var name = "Winter Solstice";
					var description = "The winter solstice marks the shortest day and longest night of the year, when the sun is at its lowest arc in the sky.";
					var equinox_name = "Spring Equinox";
					var equinox_description = "The spring equinox is when the day and the night are equally as long, and are getting longer.";

				}else if(season_name.toLowerCase().includes('summer')){

					var name = "Summer Solstice";
					var description = "At the summer solstice, the Sun travels the longest path through the sky, and that day therefore has the most daylight.";
					var equinox_name = "Autumn Equinox";
					var equinox_description = "The autumn equinox is when the day and the night are equally as long, and are getting shorter.";

				}else if(season_name.toLowerCase().includes('autumn')){

					var name = "Autumn Equinox";
					var description = "The autumn equinox is when the day and the night are equally as long, and are getting shorter.";

				}else if(season_name.toLowerCase().includes('spring')){

					var name = "Spring Equinox";
					var description = "The spring equinox is when the day and the night are equally as long, and are getting longer.";

				}else{

					var name = `${season_name} Solstice`;
					var description = ""

					var equinox_name = `${season_name} Equinox`;
					var equinox_description = ""

				}

				events.push({
					"name": name,
					"description": description,
					"data":{
						'has_duration': false,
						'duration': 0,
						'show_first_last': false,
						'limited_repeat': false,
						'limited_repeat_num': 0,
						'connected_events': [],
						'date': [],
						"conditions":[
							["Season","0",[i]],
							["&&"],
							["Season","8",[1]],
						]
					},
					"event_category_id":"-1",
					"settings":{
						"color":"Green",
						"text":"text",
						"hide":false,
						"hide_full":false,
						"print":false
					}
				});

				if(static_data.seasons.global_settings.periodic_seasons){

					events.push({
						"name": equinox_name,
						"description": equinox_description,
						"data":{
							'has_duration': false,
							'duration': 0,
							'show_first_last': false,
							'limited_repeat': false,
							'limited_repeat_num': 0,
							'connected_events': [],
							'date': [],
							"conditions":[
								["Season","0",[i]],
								["&&"],
								["Season","8",[Math.floor(season.transition_length/2)]],
							]
						},
						"event_category_id":"-1",
						"settings":{
							"color":"Green",
							"text":"text",
							"hide":false,
							"hide_full":false,
							"print":false
						}

					});

				}

			}

		}

		return events;

	}

}

function parse_json(json){

	try{

		var calendar = JSON.parse(json);

		var dynamic_data = {
			'year': 1,
			'timespan': 0,
			'day': 1,
			'epoch': 0,
			'custom_location': false,
			'location': 'Equatorial'
		};

		var static_data = {
            "year_data":{
                "first_day":1,
                "overflow":true,
                "global_week":[],
                "timespans":[],
                "leap_days":[]
            },
            "moons":[],
            "clock":{
                "enabled":false,
                "render":false,
                "hours":24,
                "minutes":60,
                "offset":0,
                "crowding":0,
            },
            "seasons":{
                "data":[],
                "locations":[],
                "global_settings":{
                    "season_offset":0,
                    "weather_offset":0,
                    "seed": Math.abs(Math.random().toString().substr(7)|0),
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
                "comments":"none",
                "show_current_month":false,
                "allow_view":true,
                "only_backwards":true,
                "only_reveal_today":false,
                "hide_moons":false,
                "hide_clock":false,
                "hide_events":false,
                "hide_eras":false,
                "hide_all_weather":false,
                "hide_future_weather":false,
                "add_month_number":false,
                "add_year_day_number":false,
                "default_category":-1
            },
            "cycles":{
                "format":"",
                "data":[]
            }
        };

		
		if(calendar.dynamic_data !== undefined){
			var source = '2.0';
		}else if(calendar.settings !== undefined){
			var source = '1.0';
		}else if(calendar.year_len){
			var source = 'donjon';
		}

		console.log(source)

		switch(source){
			case '2.0':
				return process_fantasycalendar(calendar, dynamic_data, static_data);
			case '1.0':
				return process_old_fantasycalendar(calendar, dynamic_data, static_data);
			case 'donjon':
				return process_donjon(calendar, dynamic_data, static_data);

			default:
				return false;
		}
	} catch (e) {

		console.log(e)
		return false;

	}
}

function process_fantasycalendar(calendar, dynamic_data, static_data){

	var calendar_name = calendar.name;

	console.log("Checking global week")
	if(calendar.static_data.year_data.global_week !== undefined){
		for(var i = 0; i < calendar.static_data.year_data.global_week.length; i++){
			static_data.year_data.global_week.push(calendar.static_data.year_data.global_week[i].toString());
		}
	}

	console.log("Checking timespans")
	if(calendar.static_data.year_data.timespans !== undefined){

		for(var i = 0; i < calendar.static_data.year_data.timespans.length; i++){

			var timespan = {};
			var current_timespan = calendar.static_data.year_data.timespans[i];


			if(current_timespan.name !== undefined){
				timespan.name = current_timespan.name.toString();
			}else{
				throw `Timespan ${i+1} does not have name data!`;
			}

			if(current_timespan.type === 'month' || current_timespan.type === 'intercalary'){
				timespan.type = current_timespan.type.toString();
			}else{
				throw `${timespan.name} has invalid type!`;
			}

			if(current_timespan.length !== undefined && !isNaN(Number(current_timespan.length))){
				timespan.length = Number(current_timespan.length)
			}else{
				throw `${timespan.name} has invalid length!`;
			}

			if(current_timespan.interval !== undefined && !isNaN(Number(current_timespan.interval))){
				timespan.interval = Number(current_timespan.interval)
			}else{
				throw `${timespan.name} has invalid interval!`;
			}

			if(current_timespan.offset !== undefined && !isNaN(Number(current_timespan.offset))){
				timespan.offset = Number(current_timespan.offset)
			}else{
				throw `${timespan.name} has invalid offset!`;
			}

			if(current_timespan.week !== undefined && Array.isArray(current_timespan.week)){
				for(var j = 0; j < current_timespan.week.length; j++){
					timespan.push(current_timespan.week[j])
				}
			}

			static_data.year_data.timespans.push(timespan);

		}

	}

	console.log("Checking leap days")
	if(calendar.static_data.year_data.leap_days !== undefined){

		for(var i = 0; i < calendar.static_data.year_data.leap_days.length; i++){

			var leap_day = {};
			var current_leap_day = calendar.static_data.year_data.leap_days[i];

			if(current_leap_day.name !== undefined){
				leap_day.name = current_leap_day.name.toString();
			}else{
				throw `Leap day ${i+1} does not have name data!`;
			}

			if(current_leap_day.intercalary !== undefined && typeof current_leap_day.intercalary === "boolean"){
				leap_day.intercalary = current_leap_day.intercalary
			}else{
				throw `${leap_day.name} has invalid intercalary setting!`;
			}

			if(current_leap_day.timespan !== undefined && !isNaN(Number(current_leap_day.timespan)) && current_leap_day.timespan < static_data.year_data.timespans.length){
				leap_day.timespan = Number(current_leap_day.timespan)
			}else{
				console.log(current_leap_day.timespan)
				throw `${leap_day.name} has invalid timespan selection!`;
			}

			if(current_leap_day.adds_week_day !== undefined){
				if(typeof current_leap_day.adds_week_day === "boolean"){
					leap_day.adds_week_day = current_leap_day.adds_week_day
				}else{
					throw `${leap_day.name} has invalid add week day setting!`;
				}
			}

			if(current_leap_day.day !== undefined){
				if(!isNaN(Number(current_leap_day.day))){
					leap_day.day = Number(current_leap_day.day)
				}else{
					throw `${leap_day.name} has invalid day number!`;
				}
			}

			if(current_leap_day.interval !== undefined && current_leap_day.interval !== ""){
				var local_regex = /^\!*[1-9]+[0-9]{0,}$/;
				var intervals = current_leap_day.interval.split(',');
				for(var j = 0; j < intervals.length; j++){
					if(!local_regex.test(intervals[j])){
						throw `${leap_day.name} has invalid interval!`;
					}
				}

				leap_day.interval = current_leap_day.interval;
			}

			if(current_leap_day.offset !== undefined && !isNaN(Number(current_leap_day.offset))){
				leap_day.offset = Number(current_leap_day.offset)
			}else{
				throw `${leap_day.name} has invalid offset!`;
			}

			static_data.year_data.leap_days.push(leap_day);

		}

	}

	console.log("Checking moons")
	if(calendar.static_data.moons !== undefined){

		for(var i = 0; i < calendar.static_data.moons.length; i++){

			var moon = {};
			var current_moon = calendar.static_data.moons[i];

			if(current_moon.name !== undefined){
				moon.name = current_moon.name.toString();
			}else{
				throw `Moon ${i+1} does not have name data!`;
			}

			if(current_moon.custom_phase !== undefined && typeof current_moon.custom_phase === "boolean"){
				if(current_moon.custom_phase){
					var global_regex = /[`!+~@#$%^&*()_|\-=?;:'".<>\{\}\[\]\\\/A-Za-z ]/g;
					if(global_regex.test(interval_val)){
						throw `${moon.name} has invalid custom phases!`;
					}

					var granularity = Math.max.apply(null, current_moon.custom_cycle.split(','))+1;

					if(granularity > 40){
						throw `${moon.name} has invalid custom cycle number (numbers too high)!`;
					}

					moon.custom_cycle = current_moon.custom_cycle

				}else{

					if(current_moon.cycle && !isNaN(parseFloat(current_moon.cycle))){
						moon.cycle = parseFloat(current_moon.cycle)
					}else{
						throw `${moon.name} has invalid cycle!`;
					}
				}
			}

			if(current_moon.shift && !isNaN(parseFloat(current_moon.shift))){
				moon.shift = parseFloat(current_moon.shift)
			}else{
				throw `${moon.name} has invalid shift!`;
			}

			if(current_moon.granularity && !isNaN(Number(current_moon.granularity))){
				if(current_moon.granularity > 40){
					throw `${moon.name} has too high granularity! (40 max)`
				}
				moon.granularity = Number(current_moon.granularity)
			}else{
				throw `${moon.name} has invalid granularity!`;
			}

			if(current_moon.hidden !== undefined && typeof current_moon.hidden === "boolean"){
				moon.hidden = current_moon.hidden
			}else{
				throw `${moon.name} has invalid hidden property!`;
			}

			if(current_moon.color !== undefined && isHex(current_moon.color)){
				moon.color = current_moon.color
			}else{
				throw `${moon.name} has invalid color!`;
			}

			static_data.moons.push(moon);

		}

	}

	console.log("Checking clock")
	if(calendar.static_data.clock !== undefined){

		if(calendar.static_data.clock.enabled !== undefined && typeof calendar.static_data.clock.enabled === "boolean"){
			static_data.clock.enabled = calendar.static_data.clock.enabled
		}else{
			throw `Clock has invalid enabled property!`;
		}

		if(calendar.static_data.clock.render !== undefined && typeof calendar.static_data.clock.render === "boolean"){
			static_data.clock.render = calendar.static_data.clock.render
		}else{
			throw `Clock has invalid render property!`;
		}

		if(calendar.static_data.clock.hours !== undefined && !isNaN(Number(calendar.static_data.clock.hours))){
			if(Number(calendar.static_data.clock.hours) < 1){
				throw `Clock has invalid amount of hours!`;
			}
			static_data.clock.hours = Number(calendar.static_data.clock.hours);
		}else{
			throw `Clock has invalid hours!`;
		}

		if(calendar.static_data.clock.minutes !== undefined && !isNaN(Number(calendar.static_data.clock.minutes))){
			if(Number(calendar.static_data.clock.minutes) < 1){
				throw `Clock has invalid amount of minutes!`;
			}
			static_data.clock.minutes = Number(calendar.static_data.clock.minutes);
		}else{
			throw `Clock has invalid minutes!`;
		}

		if(calendar.static_data.clock.offset !== undefined && !isNaN(Number(calendar.static_data.clock.offset))){
			static_data.clock.offset = Number(calendar.static_data.clock.offset);
		}else{
			throw `Clock has invalid offset!`;
		}

		if(calendar.static_data.clock.crowding !== undefined && !isNaN(Number(calendar.static_data.clock.crowding))){
			static_data.clock.crowding = Number(calendar.static_data.clock.crowding);
		}else{
			throw `Clock has invalid crowding!`;
		}

	}

	console.log("Checking seasons")
	if(calendar.static_data.seasons !== undefined){

		if(calendar.static_data.seasons.global_settings !== undefined){

			var global_settings = calendar.static_data.seasons.global_settings;

			if(global_settings.season_offset !== undefined && !isNaN(Number(global_settings.season_offset))){
				static_data.seasons.global_settings.season_offset = global_settings.season_offset;
			}else{
				throw `Season settings have invalid season offset!`;
			}

			if(global_settings.weather_offset !== undefined && !isNaN(Number(global_settings.weather_offset))){
				static_data.seasons.global_settings.weather_offset = global_settings.weather_offset;
			}else{
				throw `Season settings have invalid weather offset!`;
			}

			if(global_settings.seed !== undefined && !isNaN(Number(global_settings.seed))){
				static_data.seasons.global_settings.seed = global_settings.seed;
			}else{
				throw `Season settings have invalid seed!`;
			}

			if(global_settings.temp_sys !== undefined && ['imperial', 'metric', 'both_i', 'both_m'].includes(global_settings.temp_sys)){
				static_data.seasons.global_settings.temp_sys = global_settings.temp_sys;
			}else{
				throw `Season settings have invalid temperature system!`;
			}

			if(global_settings.wind_sys !== undefined && ['imperial', 'metric', 'both'].includes(global_settings.wind_sys)){
				static_data.seasons.global_settings.wind_sys = global_settings.wind_sys;
			}else{
				throw `Season settings have invalid wind system!`;
			}

			if(global_settings.cinematic !== undefined && typeof global_settings.cinematic === "boolean"){
				static_data.seasons.global_settings.cinematic = global_settings.cinematic
			}else{
				throw `Season settings have invalid cinematic data!`;
			}

			if(global_settings.enable_weather !== undefined && typeof global_settings.enable_weather === "boolean"){
				static_data.seasons.global_settings.enable_weather = global_settings.enable_weather
			}else{
				throw `Season settings have invalid enable weather!`;
			}

			if(global_settings.periodic_seasons !== undefined && typeof global_settings.periodic_seasons === "boolean"){
				static_data.seasons.global_settings.periodic_seasons = global_settings.periodic_seasons
			}else{
				throw `Season settings have invalid periodic settings!`;
			}

		}else{
			throw `Season settings have invalid season global settings!`;
		}

		if(calendar.static_data.seasons.data !== undefined){

			for(var i = 0; i < calendar.static_data.seasons.data.length; i++){

				var season = {}
				var current_season = calendar.static_data.seasons.data[i];

				if(current_season.name !== undefined){
					season.name = current_season.name.toString();
				}else{
					throw `Season ${i+1} does not have name data!`;
				}

				
				if(static_data.seasons.global_settings.periodic_seasons){

					if(current_season.transition_length !== undefined && !isNaN(Number(current_season.transition_length))){
						season.transition_length = current_season.transition_length;
					}else{
						throw `${season.name} has invalid transition length!`;
					}

					if(current_season.duration !== undefined && !isNaN(Number(current_season.duration))){
						season.duration = current_season.duration;
					}else{
						throw `${season.name} has invalid duration!`;
					}

				}else{

					if(current_season.timespan !== undefined && !isNaN(Number(current_season.timespan))){
						season.timespan = current_season.timespan;
					}else{
						throw `${season.name} has invalid transition length!`;
					}

					if(current_season.day !== undefined && !isNaN(Number(current_season.day))){
						season.day = current_season.day;
					}else{
						throw `${season.name} has invalid day!`;
					}

				}

				if(current_season.time !== undefined){

					season.time = {};

					if(current_season.time.sunrise !== undefined){

						season.time.sunrise = {};

						if(current_season.time.sunrise.hour !== undefined && !isNaN(Number(current_season.time.sunrise.hour))){
							season.time.sunrise.hour = current_season.time.sunrise.hour;
						}else{
							throw `${season.name} has invalid sunrise hour data!`;
						}

						if(current_season.time.sunrise.minute !== undefined && !isNaN(Number(current_season.time.sunrise.minute))){
							season.time.sunrise.minute = current_season.time.sunrise.minute;
						}else{
							throw `${season.name} has invalid sunrise minute data!`;
						}

					}else{

						throw `${season.name} has invalid sunrise data!`;

					}

					if(current_season.time.sunset !== undefined){

						season.time.sunset = {};

						if(current_season.time.sunset.hour !== undefined && !isNaN(Number(current_season.time.sunset.hour))){
							season.time.sunset.hour = current_season.time.sunset.hour;
						}else{
							throw `${season.name} has invalid sunset hour data!`;
						}

						if(current_season.time.sunset.minute !== undefined && !isNaN(Number(current_season.time.sunset.minute))){
							season.time.sunset.minute = current_season.time.sunset.minute;
						}else{
							throw `${season.name} has invalid sunset minute data!`;
						}

					}else{

						throw `${season.name} has invalid sunset data!`;

					}


				}else{
					throw `${season.name} has invalid time data!`;
				}

				static_data.seasons.data.push(season);

			}

		}

		if(calendar.static_data.seasons.locations !== undefined){

			for(var i = 0; i < calendar.static_data.seasons.locations.length; i++){

				var location = {}
				var current_location = calendar.static_data.seasons.locations.data[i];

				if(current_location.name !== undefined){
					location.name = current_location.name.toString();
				}else{
					throw `Location ${i+1} does not have name data!`;
				}

				if(current_location.seasons !== undefined && Array.isArray(current_location.seasons)){

					for(var j = 0; j < current_location.seasons.length; j++){

						var season = {}
						var current_season = calendar.static_data.seasons.data[j];

						if(current_season.time !== undefined){

							season.time = {};

							if(current_season.time.sunrise !== undefined){

								season.time.sunrise = {};

								if(current_season.time.sunrise.hour !== undefined && !isNaN(Number(current_season.time.sunrise.hour))){
									season.time.sunrise.hour = current_season.time.sunrise.hour;
								}else{
									throw `${season.name} has invalid sunrise hour data!`;
								}

								if(current_season.time.sunrise.minute !== undefined && !isNaN(Number(current_season.time.sunrise.minute))){
									season.time.sunrise.minute = current_season.time.sunrise.minute;
								}else{
									throw `${season.name} has invalid sunrise minute data!`;
								}

							}else{

								throw `${season.name} has invalid sunrise data!`;

							}

							if(current_season.time.sunset !== undefined){

								season.time.sunset = {};

								if(current_season.time.sunset.hour !== undefined && !isNaN(Number(current_season.time.sunset.hour))){
									season.time.sunset.hour = current_season.time.sunset.hour;
								}else{
									throw `${season.name} has invalid sunset hour data!`;
								}

								if(current_season.time.sunset.minute !== undefined && !isNaN(Number(current_season.time.sunset.minute))){
									season.time.sunset.minute = current_season.time.sunset.minute;
								}else{
									throw `${season.name} has invalid sunset minute data!`;
								}

							}else{

								throw `${season.name} has invalid sunset data!`;

							}

						}else{
							throw `${location.name} has invalid time data!`;
						}

						if(current_season.weather !== undefined){

							season.weather = {};

							if(current_season.temp_low !== undefined && !isNaN(Number(current_season.temp_low))){
								season.weather.temp_low = current_season.weather.temp_low;
							}else{
								throw `${location.name} has invalid low temperature!`;
							}

							if(current_season.temp_high !== undefined && !isNaN(Number(current_season.temp_high))){
								season.weather.temp_high = current_season.weather.temp_high;
							}else{
								throw `${location.name} has invalid high temperature!`;
							}

							if(current_season.precipitation !== undefined && !isNaN(Number(current_season.precipitation))){
								season.weather.precipitation = current_season.weather.precipitation;
							}else{
								throw `${location.name} has invalid precipitation chance!`;
							}

							if(current_season.precipitation_intensity !== undefined && !isNaN(Number(current_season.precipitation_intensity))){
								season.weather.precipitation_intensity = current_season.weather.precipitation_intensity;
							}else{
								throw `${location.name} has invalid precipitation intensity!`;
							}

						}else{
							throw `${location.name} has invalid weather!`;
						}

						static_data.seasons.locations.seasons.data.push(season);

					}

				}else{
					throw `${location.name} has invalid season data!`;
				}

				if(current_location.settings !== undefined){

					location.settings = {};

					if(current_location.settings.timezone !== undefined){

						location.settings.timezone = {};

						if(current_season.settings.timezone.hour !== undefined && !isNaN(Number(current_season.settings.timezone.hour))){
							location.settings.timezone.hour = current_location.settings.timezone.hour;
						}else{
							throw `${location.name} has invalid hour timezone value!`;
						}

						if(current_season.settings.timezone.minute !== undefined && !isNaN(Number(current_season.settings.timezone.minute))){
							location.settings.timezone.minute = current_location.settings.timezone.minute;
						}else{
							throw `${location.name} has invalid minute timezone value!`;
						}

					}else{
						throw `${location.name} has invalid timezone data!`;
					}

					if(current_season.settings.large_noise_frequency !== undefined && !isNaN(Number(current_season.settings.large_noise_frequency))){
						location.settings.large_noise_frequency = current_location.settings.large_noise_frequency;
					}else{
						throw `${location.name} has invalid large noise frequency!`;
					}

					if(current_location.settings.large_noise_amplitude !== undefined && !isNaN(Number(current_location.settings.large_noise_amplitude))){
						location.settings.large_noise_amplitude = current_location.settings.large_noise_amplitude;
					}else{
						throw `${location.name} has invalid large noise amplitude!`;
					}

					if(current_location.settings.medium_noise_frequency !== undefined && !isNaN(Number(current_location.settings.medium_noise_frequency))){
						location.settings.medium_noise_frequency = current_location.settings.medium_noise_frequency;
					}else{
						throw `${location.name} has invalid medium noise frequency!`;
					}

					if(current_location.settings.medium_noise_amplitude !== undefined && !isNaN(Number(current_location.settings.medium_noise_amplitude))){
						location.settings.medium_noise_amplitude = current_location.settings.medium_noise_amplitude;
					}else{
						throw `${location.name} has invalid medium noise amplitude!`;
					}

					if(current_location.settings.small_noise_frequency !== undefined && !isNaN(Number(current_location.settings.small_noise_frequency))){
						location.settings.small_noise_frequency = current_location.settings.small_noise_frequency;
					}else{
						throw `${location.name} has invalid small noise frequency!`;
					}

					if(current_location.settings.small_noise_amplitude !== undefined && !isNaN(Number(current_location.settings.small_noise_amplitude))){
						location.settings.small_noise_amplitude = current_location.settings.small_noise_amplitude;
					}else{
						throw `${location.name} has invalid small noise amplitude!`;
					}

				}

				static_data.seasons.locations.push(location);

			}

		}

	}

	console.log("Checking eras")
	if(calendar.static_data.eras !== undefined){

		if(Array.isArray(calendar.static_data.eras)){

			for(var i = 0; i < calendar.static_data.eras.length; i++){

				var era = {};
				var current_era = calendar.static_data.eras[i];

				if(current_era.name !== undefined){
					era.name = current_era.name.toString();
				}else{
					throw `Era ${i+1} does not have name data!`;
				}

				if(current_era.format !== undefined){
					era.format = current_era.format.toString();
				}else{
					throw `${era.name} does not have format data!`;
				}

				if(current_era.description !== undefined){
					era.description = current_era.description.toString();
				}else{
					throw `${era.name} does not have description data!`;
				}

				if(current_era.date !== undefined){

					era.date = {};

					if(current_era.date.year !== undefined && !isNaN(Number(current_era.date.year))){
						era.date.year = Number(current_era.date.year);
					}else{
						throw `${era.name} does not have valid year!`;
					}

					if(current_era.date.timespan !== undefined && !isNaN(Number(current_era.date.timespan))){
						era.date.timespan = Number(current_era.date.timespan);
					}else{
						throw `${era.name} does not have valid timespan!`;
					}

					if(current_era.date.day !== undefined && !isNaN(Number(current_era.date.day))){
						era.date.day = Number(current_era.date.day);
					}else{
						throw `${era.name} does not have valid day!`;
					}

				}else{
					throw `${era.name} does not have valid date!`;
				}

				if(current_era.settings !== undefined){

					era.settings = {};

					if(current_era.settings.use_custom_format !== undefined && typeof current_era.settings.use_custom_format === "boolean"){
						era.settings.use_custom_format = current_era.settings.use_custom_format;
					}else{
						throw `${era.name} does not have valid use custom format!`;
					}

					if(current_era.settings.show_as_event !== undefined && typeof current_era.settings.show_as_event === "boolean"){
						era.settings.show_as_event = current_era.settings.show_as_event;
					}else{
						throw `${era.name} does not have valid show as event data!`;
					}

					if(current_era.settings.event_category !== undefined && !isNaN(Number(current_era.settings.event_category))){
						era.settings.event_category = Number(current_era.settings.event_category);
					}else{
						throw `${era.name} does not have valid event category!`;
					}

					if(current_era.settings.ends_year !== undefined && typeof current_era.settings.ends_year === "boolean"){
						era.settings.ends_year = current_era.settings.ends_year;
					}else{
						throw `${era.name} does not have valid ends year data!`;
					}

					if(current_era.settings.restart !== undefined && typeof current_era.settings.restart === "boolean"){
						era.settings.restart = current_era.settings.restart;
					}else{
						throw `${era.name} does not have valid restarts year data!`;
					}

				}else{
					throw `${era.name} does not have settings data!`;
				}

				static_data.eras.push(era);

			}


		}else{
			throw `Eras are invalid!`;
		}

	}

	console.log("Checking settings")
	if(calendar.static_data.settings.layout !== undefined && ['grid', 'vertical', 'minimalistic'].includes(calendar.static_data.settings.layout)){
		static_data.settings.layout = calendar.static_data.settings.layout;
	}else{
		throw `Setting: layout is invalid!`;
	}

	if(calendar.static_data.settings.show_current_month !== undefined && typeof calendar.static_data.settings.show_current_month === "boolean"){
		static_data.settings.show_current_month = calendar.static_data.settings.show_current_month;
	}else{
		throw `Setting: show_current_month is invalid!`;
	}

	if(calendar.static_data.settings.add_month_number !== undefined && typeof calendar.static_data.settings.add_month_number === "boolean"){
		static_data.settings.add_month_number = calendar.static_data.settings.add_month_number;
	}else{
		throw `Setting: add_month_number is invalid!`;
	}

	if(calendar.static_data.settings.add_year_day_number !== undefined && typeof calendar.static_data.settings.add_year_day_number === "boolean"){
		static_data.settings.add_year_day_number = calendar.static_data.settings.add_year_day_number;
	}else{
		throw `Setting: add_year_day_number is invalid!`;
	}

	if(calendar.static_data.settings.allow_view !== undefined && typeof calendar.static_data.settings.allow_view === "boolean"){
		static_data.settings.allow_view = calendar.static_data.settings.allow_view;
	}else{
		throw `Setting: allow_view is invalid!`;
	}

	if(calendar.static_data.settings.only_backwards !== undefined && typeof calendar.static_data.settings.only_backwards === "boolean"){
		static_data.settings.only_backwards = calendar.static_data.settings.only_backwards;
	}else{
		throw `Setting: only_backwards is invalid!`;
	}

	if(calendar.static_data.settings.only_reveal_today !== undefined && typeof calendar.static_data.settings.only_reveal_today === "boolean"){
		static_data.settings.only_reveal_today = calendar.static_data.settings.only_reveal_today;
	}else{
		throw `Setting: only_reveal_today is invalid!`;
	}

	if(calendar.static_data.settings.hide_moons !== undefined && typeof calendar.static_data.settings.hide_moons === "boolean"){
		static_data.settings.hide_moons = calendar.static_data.settings.hide_moons;
	}else{
		throw `Setting: hide_moons is invalid!`;
	}

	if(calendar.static_data.settings.hide_clock !== undefined && typeof calendar.static_data.settings.hide_clock === "boolean"){
		static_data.settings.hide_clock = calendar.static_data.settings.hide_clock;
	}else{
		throw `Setting: hide_clock is invalid!`;
	}

	if(calendar.static_data.settings.hide_events !== undefined && typeof calendar.static_data.settings.hide_events === "boolean"){
		static_data.settings.hide_events = calendar.static_data.settings.hide_events;
	}else{
		throw `Setting: hide_events is invalid!`;
	}

	if(calendar.static_data.settings.hide_eras !== undefined && typeof calendar.static_data.settings.hide_eras === "boolean"){
		static_data.settings.hide_eras = calendar.static_data.settings.hide_eras;
	}else{
		throw `Setting: hide_eras is invalid!`;
	}

	if(calendar.static_data.settings.hide_all_weather !== undefined && typeof calendar.static_data.settings.hide_all_weather === "boolean"){
		static_data.settings.hide_all_weather = calendar.static_data.settings.hide_all_weather;
	}else{
		throw `Setting: hide_all_weather is invalid!`;
	}

	if(calendar.static_data.settings.hide_future_weather !== undefined && typeof calendar.static_data.settings.hide_future_weather === "boolean"){
		static_data.settings.hide_future_weather = calendar.static_data.settings.hide_future_weather;
	}else{
		throw `Setting: hide_future_weather is invalid!`;
	}

	if(calendar.static_data.settings.hide_future_weather !== undefined && typeof calendar.static_data.settings.hide_future_weather === "boolean"){
		static_data.settings.hide_future_weather = calendar.static_data.settings.hide_future_weather;
	}else{
		throw `Setting: hide_future_weather is invalid!`;
	}

	if(calendar.static_data.settings.year_zero_exists !== undefined && typeof calendar.static_data.settings.year_zero_exists === "boolean"){
		static_data.settings.year_zero_exists = calendar.static_data.settings.year_zero_exists;
	}else{
		throw `Setting: year_zero_exists is invalid!`;
	}

	console.log("Checking cycles")
	if(calendar.static_data.cycles !== undefined){

		if(calendar.static_data.cycles.format !== undefined){
			static_data.cycles.format = calendar.static_data.cycles.format.toString();
		}else{
			throw `Cycles has invalid format!`;
		}

		if(calendar.static_data.cycles.data !== undefined && Array.isArray(calendar.static_data.cycles.data)){

			for(var i = 0; i < calendar.static_data.cycles.data.length; i++){

				var cycle = {};
				var current_cycle = calendar.static_data.cycles.data[i];

				if(calendar.static_data.cycles.data !== undefined && Array.isArray(current_cycle.names)){

					cycle.names = [];

					for(var j = 0; j < current_cycle.names.length; j++){

						cycle.names.push(current_cycle.names[j].toString());

					}

				}else{
					throw `Cycle ${i+1} does not have valid names!`;
				}

				if(current_cycle.offset !== undefined && !isNaN(Number(current_cycle.offset))){
					cycle.offset = Number(current_cycle.offset);
				}else{
					throw `Cycle ${i+1} does not have valid offset!`;
				}

				static_data.cycles.data.push(cycle)

			}

		}else{
			throw `Cycles has invalid data!`;
		}

	}

	console.log("Checking event categories")

    if(calendar.categories !== undefined && Array.isArray(calendar.categories)){

        for(var categoryid in calendar.categories){

            var category = {};
            var current_category = calendar.categories[categoryid];

            category.id = slugify(current_category.name);

            if(current_category.name !== undefined){
                category.name = current_category.name.toString();
            }else{
                throw `Event category ${i+1} does not have name data!`;
            }

            if(current_category.category_settings !== undefined){

                category.category_settings = {};

                if(current_category.category_settings.hide !== undefined && typeof current_category.category_settings.hide === "boolean"){
                    category.category_settings.hide = current_category.category_settings.hide;
                }else{
                    throw `${category.name} does not have hide category settings!`;
                }

                if(current_category.category_settings.player_usable !== undefined && typeof current_category.category_settings.player_usable === "boolean"){
                    category.category_settings.player_usable = current_category.category_settings.player_usable;
                }else{
                    throw `${category.name} does not have player usable category settings!`;
                }

            }else{
                throw `${category.name} does not have event settings!`;
            }

            if(current_category.event_settings !== undefined){

                category.event_settings = {};

                if(current_category.event_settings.color !== undefined){
                    category.event_settings.color = current_category.event_settings.color.toString();
                }else{
                    throw `${category.name} does not have color event settings!`;
                }

                if(current_category.event_settings.text !== undefined){
                    category.event_settings.text = current_category.event_settings.text.toString();
                }else{
                    throw `${category.name} does not have text event settings!`;
                }

                if(current_category.event_settings.hide !== undefined && typeof current_category.event_settings.hide === "boolean"){
                    category.event_settings.hide = current_category.event_settings.hide;
                }else{
                    throw `${category.name} does not have hide event settings!`;
                }

                if(current_category.event_settings.print !== undefined && typeof current_category.event_settings.print === "boolean"){
                    category.event_settings.print = current_category.event_settings.print;
                }else{
                    throw `${category.name} does not have print event settings!`;
                }

            }else{
                throw `${category.name} does not have event settings!`;
            }


            if(current_category.name !== undefined){
                category.name = current_category.name.toString();
            }else{
                throw `Event category ${i+1} does not have name data!`;
            }

        }

    }else{

        throw `Data has invalid event categories!`;

	}
	
	console.log("Checking events")
    if(calendar.events !== undefined && Array.isArray(calendar.events)){
        for(var eventId in calendar.events){

            var event = {};
            var current_event = calendar.events[eventId];

            if(current_event.name !== undefined){
                event.name = current_event.name.toString();
            }else{
                throw `Event ${i+1} does not have name data!`;
            }

            if(current_event.description !== undefined){
                event.description =current_event.description.toString();
            }else{
                throw `${event.name} does not have valid description data!`;
			}

            if((current_event.event_category !== undefined && !isNaN(Number(current_event.event_category))) || current_event.event_category == null){
                event.event_category_id = current_event.event_category != null ? calendar.event_categories[current_event.event_category].id : -1;
            }else{
                throw `${event.name} does not have valid category data!`;
            }

            if(current_event.settings !== undefined){

                event.settings = {};

                if(current_event.settings.color !== undefined){
                    event.settings.color = current_event.settings.color.toString();
                }else{
                    throw `${event.name} does not have valid color settings!`;
                }

                if(current_event.settings.text !== undefined){
                    event.settings.text = current_event.settings.text.toString();
                }else{
                    throw `${event.name} does not have valid text settings!`;
                }

                if(current_event.settings.hide !== undefined && typeof current_event.settings.hide === "boolean"){
                    event.settings.hide = current_event.settings.hide;
                }else{
                    event.settings.hide = false;
                }

                if(current_event.settings.hide_full !== undefined && typeof current_event.settings.hide_full === "boolean"){
                    event.settings.hide_full = current_event.settings.hide_full;
                }else{
                    current_event.settings.hide_full = false;
                }

                if(current_event.settings.print !== undefined && typeof current_event.settings.print === "boolean"){
                    event.print = current_event.print;
                }else{
                    throw `${event.name} does not have valid print settings!`;
                }

            }else{
                throw `${event.name} does not have valid settings data!`;
            }

            if(current_event.data !== undefined){

                event.data = {};

                if(current_event.data.has_duration !== undefined && typeof current_event.data.has_duration === "boolean"){
                    event.data.has_duration = current_event.data.has_duration;
                }else{
                    throw `${event.name} does not have valid has duration data!`;
                }

                if(current_event.data.duration !== undefined && !isNaN(Number(current_event.data.duration))){
                    event.data.duration = Number(current_event.data.duration);
                }else{
                    throw `${event.name} does not have valid duration data!`;
                }

                if(current_event.data.limited_repeat !== undefined && typeof current_event.data.limited_repeat === "boolean"){
                    event.data.limited_repeat = current_event.data.limited_repeat;
                }else{
                    throw `${event.name} does not have valid limited repeat data!`;
                }

                if(current_event.data.limited_repeat_num !== undefined && !isNaN(Number(current_event.data.limited_repeat_num))){
                    event.data.limited_repeat_num = Number(current_event.data.limited_repeat_num);
                }else{
                    throw `${event.name} does not have valid limited repeat num data!`;
                }

                if(current_event.data.show_first_last !== undefined && typeof current_event.data.show_first_last === "boolean"){
                    event.data.show_first_last = current_event.data.show_first_last;
                }else{
                    throw `${event.name} does not have valid show first last data!`;
                }

                if(current_event.data.date !== undefined && Array.isArray(current_event.data.date) && (current_event.data.date.length === 3 || current_event.data.date.length === 0)){
                    event.data.date = []
                    if(current_event.data.date.length === 3){
                        for(var j = 0; j < current_event.data.date.length; j++){
                            if(current_event.data.date[j] !== undefined && !isNaN(Number(current_event.data.date[j]))){
                                event.data.date.push(Number(current_event.data.date[j]));
                            }else{
                                throw `${event.name} does not have valid date data!`;
                            }
                        }
                    }
                }else{
                    throw `${event.name} does not have valid date data!`;
                }

                if(current_event.data.connected_events !== undefined && Array.isArray(current_event.data.connected_events)){
                    event.data.connected_events = [];
                    for(var j = 0; j < current_event.data.connected_events.length; j++){
                        if(current_event.data.connected_events[j] !== undefined && !isNaN(Number(current_event.data.connected_events[j]))){
                            event.data.connected_events.push(Number(current_event.data.connected_events[j]));
                        }else{
                            throw `${event.name} does not have valid connected events data!`;
                        }
                    }
                }else{
                    throw `${event.name} does not have valid connected events data!`;
                }

                /*// CONTINUE HERE
                array = $.grep(current_event.data.conditions, function(array) {
                    if(!Array.isArray(array)){
                        return array;
                    }
                    if(array.length == 1){
                        if(!['^','&&','||','NAND'].includes(array[0])){
                            return array;
                        }
                    }else if(array.length == 2){
                        // If it's a group
                        if(!Array.isArray(array[1]) || !['','!'].includes(array[0]) || isNaN(Number(array[0]))){
                            return array;
                        }
                    }else if(array.length == 3){
                        if(condition_mapping[array[0]] === undefined || isNaN(Number(array[1])) || !Array.isArray(array[2]) || array[2].length == 0){
                            return array;
                        }else{
                            for(var cond = 0; cond < array[2].length; cond++){
                                if(Array.isArray(array[2][cond])){
                                    return array;
                                }
                            }
                        }
                    }
                });

                if(array.length == 0){
                    event.data.conditions = current_event.data.conditions;
                }else{
                    throw `${event.name} has invalid event conditions!`;
                }*/

            }else{
                throw `${event.name} does not have valid data!`;
            }

        }

    }else{

        throw `Data has invalid events!`;

    }

	console.log("Checking current date")
	if(calendar.dynamic_data.year !== undefined && !isNaN(Number(calendar.dynamic_data.year))){
		dynamic_data.year = Number(calendar.dynamic_data.year)
	}else{
		throw `Calendar has invalid year!`;
	}

	if(calendar.dynamic_data.timespan !== undefined && !isNaN(Number(calendar.dynamic_data.timespan)) && Number(calendar.dynamic_data.timespan) >= 0){
		dynamic_data.timespan = Number(calendar.dynamic_data.timespan)
	}else{
		throw `Calendar has invalid timespan!`;
	}

	if(calendar.dynamic_data.day !== undefined && !isNaN(Number(calendar.dynamic_data.day)) && Number(calendar.dynamic_data.day) >= 1){
		dynamic_data.day = Number(calendar.dynamic_data.day)
	}else{
		throw `Calendar has invalid day!`;
	}

	if(calendar.dynamic_data.epoch !== undefined && !isNaN(Number(calendar.dynamic_data.epoch))){
		dynamic_data.epoch = Number(calendar.dynamic_data.epoch)
	}else{
		throw `Calendar has invalid epoch!`;
	}

	if(calendar.dynamic_data.hour !== undefined && !isNaN(Number(calendar.dynamic_data.hour)) && Number(calendar.dynamic_data.hour) >= 0){
		dynamic_data.hour = Number(calendar.dynamic_data.hour)
	}else{
		throw `Calendar has invalid hour!`;
	}

	if(calendar.dynamic_data.minute !== undefined && !isNaN(Number(calendar.dynamic_data.minute)) && Number(calendar.dynamic_data.minute) >= 0){
		dynamic_data.minute = Number(calendar.dynamic_data.minute)
	}else{
		throw `Calendar has invalid minute!`;
	}

	if(calendar.dynamic_data.custom_location !== undefined && typeof calendar.dynamic_data.custom_location === "boolean"){
		dynamic_data.custom_location = calendar.dynamic_data.custom_location;
	}else{
		throw `Custom location boolean is invalid!`;
	}

	if(!dynamic_data.custom_location){
		console.log(calendar.dynamic_data.location)
		if(calendar.dynamic_data.location !== undefined && preset_data.locations[static_data.seasons.data.length][calendar.dynamic_data.location] !== undefined){
			dynamic_data.location = calendar.dynamic_data.location;
		}else{
			dynamic_data.location = "Equatorial";
		}
	}else{
		if(calendar.dynamic_data.location !== undefined && !isNaN(Number(calendar.dynamic_data.location)) && Number(calendar.dynamic_data.location) >= 0 && Number(calendar.dynamic_data.location) < static_data.seasons.locations.length){
			dynamic_data.location = calendar.dynamic_data.location;
		}else{
			throw `Custom location is invalid!`;
		}
	}

	console.log(calendar);

	return {
		name: calendar_name,
		dynamic_data: dynamic_data,
		static_data: static_data,

	}

}


function process_old_fantasycalendar(calendar, dynamic_data, static_data){

	var calendar_name = calendar.name;

	dynamic_data.year = calendar.year+1;
	dynamic_data.timespan = calendar.month-1;
	dynamic_data.day = calendar.day;

	static_data.year_data.first_day = calendar.first_day+1;

	static_data.year_data.global_week = calendar.weekdays;

	static_data.year_data.overflow = calendar.overflow;

	for(var i = 0; i < calendar.months.length; i++){
		static_data.year_data.timespans.push({
			'name': calendar.months[i],
			'type': 'month',
			'interval': 1,
			'offset': 0,
			'length': calendar.month_len[i]
		});
	}

	for(var i = 0; i < calendar.moons.length; i++){
		static_data.moons.push({
			'name':  calendar.moons[i],
			'cycle': calendar.lunar_cyc[i],
			'shift': calendar.lunar_shf[i],
			'granularity': get_moon_granularity(calendar.lunar_cyc[i]),
			'color': calendar.lunar_color[i],
			'hidden': false,
			'custom_phase': false
		});
	}

	for(var i = 0; i < calendar.events.length; i++){

		var event = calendar.events[i];

		data = convert_old_event(event);

		events.push({
			'name': event.name,
			'description': event.description,
			'data':{
				'has_duration': false,
				'duration': 0,
				'show_first_last': false,
				'only_happen_once': false,
				'connected_events': [],
				'date': data[0],
				'conditions': data[1]
			},
			'category':'-1',
			'settings':{
				'color':'Dark-Solid',
				'text':'text',
				'hide_full': false,
				'hide': event.hide === undefined ? false : event.hide,
				'print': event.print === undefined ? false : event.print
			}
		});
	}

	if(calendar.year_leap !== undefined && calendar.year_leap > 1){
		static_data.year_data.leap_days.push({
			'name': 'Leap day',
			'intercalary': false,
			'timespan': calendar.month_leap-1,
			'adds_week_day': false,
			'day': 0,
			'week_day': '',
			'interval': calendar.year_leap.toString(),
			'offset': 0
		});
	}

	if(calendar.clock_enabled){
		static_data.clock.enabled = true;
		static_data.clock.hours = calendar.n_hours;
		static_data.clock.minutes = 60;

		dynamic_data.hour = calendar.hour;
		dynamic_data.minute = calendar.minute;
	}



	if(calendar.solstice_enabled){

		static_data.seasons.global_settings = {
			season_offset: 0,
			weather_offset: 0,
			seed: calendar.weather.weather_seed,
			temp_sys: calendar.weather.weather_temp_sys,
			wind_sys: calendar.weather.weather_wind_sys,
			cinematic: calendar.weather.weather_cinematic,
			periodic_seasons: false
		}

		if(calendar.winter_month > calendar.summer_month){
			var first_season = {
				'name': 'Summer',
				'epoch': summer_epoch,
				'rise': calendar.summer_rise,
				'set': calendar.summer_set,
				'timespan': calendar.summer_month,
				'day': calendar.summer_day
			}
			var second_season = {
				'name': 'Winter',
				'epoch': winter_epoch,
				'rise': calendar.winter_rise,
				'set': calendar.winter_set,
				'timespan': calendar.winter_month,
				'day': calendar.winter_day
			}
		}else{
			var first_season = {
				'name': 'Winter',
				'epoch': winter_epoch,
				'rise': calendar.winter_rise,
				'set': calendar.winter_set,
				'timespan': calendar.winter_month,
				'day': calendar.winter_day
			}
			var second_season = {
				'name': 'Summer',
				'epoch': summer_epoch,
				'rise': calendar.summer_rise,
				'set': calendar.summer_set,
				'timespan': calendar.summer_month,
				'day': calendar.summer_day
			}
		}

		static_data.seasons.data = [
			{
				'Name': first_season.name,
				'timespan': first_season.timespan,
				'day': first_season.day,
				'time': {
					'sunrise': {
						'hour': first_season.rise,
						'minute': 0
					},
					'sunset': {
						'hour': first_season.set,
						'minute': 0
					}
				}
			},
			{
				'Name': second_season.name,
				'timespan': second_season.timespan,
				'day': second_season.day,
				'time': {
					'sunrise': {
						'hour': second_season.rise,
						'minute': 0
					},
					'sunset': {
						'hour': second_season.set,
						'minute': 0
					}
				}
			}
		];
	}

	if(calendar.weather_enabled){

		var keys = Object.keys(calendar.weather.custom_climates);

		for(var i = 0; i < keys.length; i++){

			var location = calendar.weather.custom_climates[keys[i]];

			static_data.seasons.locations.push({
				'name': keys[i],
				'seasons': [
					{
						'name': '',
						'custom_name': false,
						'time': {
							'sunrise': {
								'hour': first_season.rise,
								'minute': 0
							},
							'sunset': {
								'hour': first_season.set,
								'minute': 0
							}
						},
						'weather':{
							'temp_low': location[first_season.name.toLowerCase()].temperature.cold,
							'temp_high': location[first_season.name.toLowerCase()].temperature.hot,
							'precipitation': location[first_season.name.toLowerCase()].precipitation,
							'precipitation_intensity': location[first_season.name.toLowerCase()].precipitation*0.5
						}
					},
					{
						'name': '',
						'custom_name': false,
						'time': {
							'sunrise': {
								'hour': second_season.rise,
								'minute': 0
							},
							'sunset': {
								'hour': second_season.set,
								'minute': 0
							}
						},
						'weather':{
							'temp_low': location[second_season.name.toLowerCase()].temperature.cold,
							'temp_high': location[second_season.name.toLowerCase()].temperature.hot,
							'precipitation': location[second_season.name.toLowerCase()].precipitation,
							'precipitation_intensity': location[second_season.name.toLowerCase()].precipitation*0.5
						}
					}
				],
				'settings': {
					'timezone': {
						'hour': 0,
						'minute': 0
					},
					'large_noise_frequency': calendar.weather.weather_temp_scale*0.1,
					'large_noise_amplitude': calendar.weather.weather_temp_scale*5,

					'medium_noise_frequency': calendar.weather.weather_temp_scale*3,
					'medium_noise_amplitude': calendar.weather.weather_temp_scale*2,

					'small_noise_frequency': calendar.weather.weather_temp_scale*8,
					'small_noise_amplitude': calendar.weather.weather_temp_scale*3
				}
			});
		}

		dynamic_data.custom_location = calendar.weather.current_climate_type === 'custom';

		if(dynamic_data.custom_location){
			dynamic_data.location = keys.indexOf(calendar.weather.current_climate);
		}else{
			dynamic_data.location = calendar.weather.current_climate;
		}

	}

	static_data.settings = {
		layout: 'grid',
		show_current_month: calendar.settings.show_current_month,
		allow_view: calendar.settings.allow_view,
		only_backwards: calendar.settings.only_backwards,
		only_reveal_today: calendar.settings.only_reveal_today,
		hide_moons: calendar.settings.hide_moons,
		hide_clock: calendar.settings.hide_clock,
		hide_events: calendar.settings.hide_events,
		hide_eras: false,
		hide_all_weather: calendar.settings.hide_weather,
		hide_future_weather: false,
		add_month_number: calendar.settings.add_month_number,
		add_year_day_number: calendar.settings.add_year_day_number
	}

	return {
		name: calendar_name,
		dynamic_data: dynamic_data,
		static_data: static_data
	}

}

function process_donjon(calendar, dynamic_data, static_data){

	if(calendar.year !== undefined && !isNaN(Number(calendar.year))){
		dynamic_data.year = Number(calendar.year)
	}else{
		throw `Calendar has invalid year!`;
	}

	if(calendar.week_len !== undefined && !isNaN(Number(calendar.week_len))){

		for(var i = 0; i < calendar.week_len; i++){
			var name = calendar.weekdays[i] !== undefined ? calendar.weekdays[i] : `Weekday ${i+1}`;
			static_data.year_data.global_week.push(name)
		}

	}else{
		throw `Calendar has invalid week length!`;
	}

	if(calendar.n_months !== undefined && !isNaN(Number(calendar.n_months))){

		for(var i = 0; i < calendar.n_months; i++){
			var name = calendar.months[i] !== undefined ? calendar.months[i] : `Month ${i+1}`;
			static_data.year_data.timespans.push({
				'name': name,
				'type': 'month',
				'interval': 1,
				'offset': 0,
				'length': calendar.month_len[name] !== undefined ? calendar.month_len[name] : calendar.month_len[i]
			});
		}

	}else{
		throw `Calendar has invalid number of months!`;
	}

	if(calendar.n_moons !== undefined && !isNaN(Number(calendar.n_moons))){

		for(var i = 0; i < calendar.n_moons; i++){
			var name = calendar.moons[i] !== undefined ? calendar.moons[i] : `Moon ${i+1}`;
			let cycle = calendar.lunar_cyc[name] !== undefined ? calendar.lunar_cyc[name] : calendar.lunar_cyc[i];
			let shift = calendar.lunar_shf[name] !== undefined ? calendar.lunar_shf[name] : calendar.lunar_shf[i];
			let granularity = calendar.lunar_cyc[name] !== undefined ? get_moon_granularity(calendar.lunar_cyc[name]) : get_moon_granularity(calendar.lunar_cyc[i]);


			static_data.moons.push({
				'name': name,
				'cycle': cycle,
				'shift': shift,
				'granularity': granularity,
				'color': '#ffffff',
				'hidden': false
			});
		}

	}else{
		throw `Calendar has invalid number of moons!`;
	}

	if(calendar.first_day === undefined || isNaN(Number(calendar.first_day))){
		throw `Calendar has invalid first day!`;
	}

	static_data.year_data.overflow = true;

	static_data.year_data.first_day = Number(calendar.first_day)+1;

	var target_first_day = Number(calendar.first_day)+1;

	var first_day = evaluate_calendar_start(static_data, convert_year(static_data, dynamic_data.year)).week_day;
	
	while(target_first_day != first_day){
		
		static_data.year_data.first_day++;

		if(static_data.year_data.first_day > static_data.year_data.global_week.length){
			static_data.year_data.first_day = 1;
		}

		first_day = evaluate_calendar_start(static_data, convert_year(static_data, dynamic_data.year)).week_day;

	}

	return {
		name: "New Calendar",
		dynamic_data: dynamic_data,
		static_data: static_data
	}

}


function convert_old_event(event){

	switch(event.repeats){
		case 'once':
			var conditions = [
				['Year', '0', [event.data.year.toString()]],
				['&&'],
				['Month', '0', [(event.data.month-1).toString()]],
				['&&'],
				['Day', '0', [event.data.day.toString()]]
			];
			var date = [event.data.year, event.data.month-1, event.data.day];
			return [date, conditions];

		case 'daily':
			var conditions = [
				['Epoch', '6', ["1", "0"]]
			];
			var date = [];
			return [date, conditions];

		case 'weekly':
			var conditions = [
				['Weekday', '0', [(event.data.week_day+1).toString()]]
			];
			var date = [];
			return [date, conditions];

		case 'fortnightly':
			var conditions = [
				['Weekday', '0', [(event.data.week_day+1).toString()]],
				['&&'],
				['Week', '13', [event.data.week_even ? '2' : '1', '0']]
			];
			var date = [];
			return [date, conditions];

		case 'monthly_date':
			var conditions = [
				['Day', '0', [event.data.day.toString()]],
			];
			var date = [];
			return [date, conditions];

		case 'annually_date':
			var conditions = [
				['Month', '0', [(event.data.month-1).toString()]],
				['&&'],
				['Day', '0', [event.data.day.toString()]]
			];
			var date = [];
			return [date, conditions];

		case 'monthly_weekday':
			var conditions = [
				['Weekday', '0', [(event.data.week_day+1).toString()]],
				['&&'],
				['Week', '0', [event.data.week_day_number.toString()]]
			];
			var date = [];
			return [date, conditions];

		case 'annually_month_weekday':
			var conditions = [
				['Month', '0', [(event.data.month-1).toString()]],
				['&&'],
				['Weekday', '0', [(event.data.week_day+1).toString()]],
				['&&'],
				['Week', '0', [event.data.week_day_number.toString()]]
			];
			var date = [];
			return [date, conditions];

		case 'every_x_day':
			var conditions = [
				['Epoch', '6', [event.data.every.toString(), (event.data.modulus+1).toString()]]
			];
			var date = [];
			return [date, conditions];

		case 'every_x_weekday':
			var conditions = [
				['Weekday', '0', [event.data.week_day.toString()]],
				['&&'],
				['Week', '20', [event.data.every.toString(), (event.data.modulus+1).toString()]]
			];
			var date = [];
			return [date, conditions];

		case 'every_x_monthly_date':
			var conditions = [
				['Day', '0', [event.data.day.toString()]],
				['&&'],
				['Month', '13', [event.data.every.toString(), (event.data.modulus+1).toString()]]
			];
			var date = [];
			return [date, conditions];

		case 'every_x_monthly_weekday':
			var conditions = [
				['Weekday', '0', [(event.data.week_day+1).toString()]],
				['&&'],
				['Week', '0', [event.data.week_day_number.toString()]],
				['&&'],
				['Month', '13', [event.data.every.toString(), (event.data.modulus+1).toString()]]
			];
			var date = [];
			return [date, conditions];

		case 'every_x_annually_date':
			var conditions = [
				['Day', '0', [event.data.day.toString()]],
				['&&'],
				['Month', '0', [(event.data.month-1).toString()]],
				['&&'],
				['Year', '6', [event.data.every.toString(), (event.data.modulus+1).toString()]]
			];
			var date = [];
			return [date, conditions];

		case 'every_x_annually_weekday':
			var conditions = [
				['Weekday', '0', [(event.data.week_day+1).toString()]],
				['&&'],
				['Week', '0', [event.data.week_day_number.toString()]],
				['&&'],
				['Month', '0', [(event.data.month-1).toString()]],
				['&&'],
				['Year', '6', [event.data.every.toString(), (event.data.modulus+1).toString()]]
			];
			var date = [];
			return [date, conditions];

		case 'moon_every':
			var conditions = [
				['Moons', '0', [event.data.moon_id.toString(), convert_to_granularity(event.data.moon_phase).toString()]]
			];
			var date = [];
			return [date, conditions];

		case 'moon_monthly':
			var conditions = [
				['Moons', '0', [event.data.moon_id.toString(), convert_to_granularity(event.data.moon_phase).toString()]],
				['&&'],
				['Moons', '7', [event.data.moon_id.toString(), convert_to_granularity(event.data.moon_phase_number).toString()]]
			];
			var date = [];
			return [date, conditions];

		case 'moon_anually':
			var conditions = [
				['Moons', '0', [event.data.moon_id.toString(), convert_to_granularity(event.data.moon_phase).toString()]],
				['&&'],
				['Moons', '7', [event.data.moon_id.toString(), event.data.moon_phase_number]],
				['&&'],
				['Month', '0', [(event.data.month-1).toString()]]
			];
			var date = [];
			return [date, conditions];

		case 'multimoon_every':
			var result = [];
			for(var i = 0; i < event.data.moons.length; i++){
				result.push(['Moons', '0', [i.toString(), convert_to_granularity(event.data.moons[i].moon_phase).toString()]])
				if(i != event.data.moons.length-1){
					result.push(['&&']);
				}
			}
			var conditions = clone(result);
			var date = [];
			return [date, conditions];

		case 'multimoon_anually':
			var result = [];
			result.push(['Month', '0', [(event.data.month-1).toString()]]);
			result.push(['&&']);
			for(var i = 0; i < event.data.moons.length; i++){
				result.push(['Moons', '0', [i.toString(), convert_to_granularity(event.data.moons[i].moon_phase).toString()]])
				if(i != event.data.moons.length-1){
					result.push(['&&']);
				}
			}
			var conditions = clone(result);
			var date = [];
			return [date, conditions];
	}

}


function jsUcfirst(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function convert_to_granularity(cycle){

	if(cycle >= 40){
		return cycle*2;
	}else if(cycle >= 24){
		return Math.floor(cycle*1.5);
	}else if(cycle >= 8){
		return Math.floor(cycle/2);
	}else{
		return Math.floor(cycle/3);
	}

}

function isHex(h) {
	return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(h);
}
