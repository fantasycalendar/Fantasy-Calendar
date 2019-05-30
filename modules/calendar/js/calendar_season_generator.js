var climate_generator = {

	process: true,

	set_up: function(calendar, epoch){

		this.calendar = clone(calendar);

		if(this.calendar.year_data.timespans.length == 0
		   ||
		   this.calendar.year_data.global_week.length == 0
		   ||
		   this.calendar.seasons.location === ''
		){

			this.process = false;

		}else{

			this.data =  {
				"season_length": 0,
				"season_offset": 0,
				"seasons": []
			};

			this.weather =  {
				"season_length": 0,
				"season_offset": 0,
				"seasons": []
			};

			this.current_location = {};

			this.wind_direction = false;

			var seed = 100;

			for(var i = 0; i < this.calendar.seasons.location.length; i++){
				seed *= this.calendar.seasons.location.charCodeAt(i)/100;
			}

			for(var i = 0; i < this.calendar.name.length; i++){
				seed *= this.calendar.name.charCodeAt(i)/100;
			}

			/*for(var i = 0; i < this.calendar.year_data.timespans.length; i++){
				seed += (1+this.calendar.year_data.timespans[i].offset)/this.calendar.year_data.timespans[i].interval;
			}

			for(var i = 0; i < this.calendar.year_data.leap_days.length; i++){
				seed += (1+this.calendar.year_data.leap_days[i].offset)/this.calendar.year_data.leap_days[i].interval;
			}*/



			seed += this.calendar.year_data.timespans.length * (this.calendar.year_data.leap_days.length+1);

			seed += this.calendar.year_data.global_week.length;

			seed += this.calendar.seasons.global_settings.seed;

			this.random = new random(seed);

			if(this.calendar.seasons.location_type === 'custom'){

				this.current_location = clone(this.calendar.seasons.locations[this.calendar.seasons.location]);

			}else{

				this.current_location = this.presets[this.calendar.seasons.location];

				for(var i = 0; i < this.calendar.seasons.data.length; i++){

					this.current_location.seasons[i].time = clone(this.calendar.seasons.data[i].time);

				}

				this.current_location.settings = clone(this.preset_curves);
				this.current_location.settings.timezone = 0;
				this.current_location.custom_dates = {};

			}
			
			for(var i = 0; i < this.calendar.seasons.data.length; i++){
				current_season = this.calendar.seasons.data[i];
				this.data.season_length += current_season.transition_length;
				this.data.season_length += current_season.duration;
			}

			// This creates a list that we can use to loop through to find the current season
			this.data.seasons = [];
			var added_season = 0;
			for(var i = 0; i < this.calendar.seasons.data.length; i++){
				current_season = this.calendar.seasons.data[i];
				this.data.seasons.push(added_season);
				this.data.seasons.push(added_season + (current_season.duration ? current_season.duration : 0));
				added_season += current_season.transition_length + (current_season.duration ? current_season.duration : 0);

			}
			this.data.seasons.push(added_season);

			this.data.season_offset = this.calendar.seasons.global_settings.season_offset;

			this.data.season_epoch = (epoch-this.data.season_offset) % this.data.season_length;
			this.data.season_epoch = this.data.season_epoch < 0 ? this.data.season_epoch + this.data.season_length : this.data.season_epoch;

			this.data.last_point = 0;
			this.data.next_point = 1;

			// Here we actually loop through each season to find out which one we're in currently
			for(i = 0; i < this.data.seasons.length-1; i++, this.data.last_point++, this.data.next_point++){

				this.data.last_epoch = this.data.seasons[this.data.last_point];
				this.data.next_epoch = this.data.seasons[this.data.next_point];

				if(this.data.last_epoch == this.data.next_epoch){
					this.data.last_point++;
					this.data.next_point++;
					this.data.last_epoch = this.data.seasons[this.data.last_point];
					this.data.next_epoch = this.data.seasons[this.data.next_point];
				}

				if(this.data.season_epoch >= this.data.last_epoch && this.data.season_epoch < this.data.next_epoch){
					break;
				}

			}

			this.weather = clone(this.data);

			this.weather.season_epoch = (epoch-this.weather.season_offset-this.calendar.seasons.global_settings.weather_offset) % this.weather.season_length;
			this.weather.season_epoch = this.weather.season_epoch < 0 ? this.weather.season_epoch + this.weather.season_length : this.weather.season_epoch;

			this.weather.last_point = 0;
			this.weather.next_point = 1;

			// Here we actually loop through each season to find out which one we're in currently
			for(i = 0; i < this.weather.seasons.length-1; i++, this.weather.last_point++, this.weather.next_point++){

				this.weather.last_epoch = this.weather.seasons[this.weather.last_point];
				this.weather.next_epoch = this.weather.seasons[this.weather.next_point];

				if(this.weather.last_epoch == this.weather.next_epoch){
					this.weather.last_point++;
					this.weather.next_point++;
					this.weather.last_epoch = this.weather.seasons[this.weather.last_point];
					this.weather.next_epoch = this.weather.seasons[this.weather.next_point];
				}

				if(this.weather.season_epoch >= this.weather.last_epoch && this.weather.season_epoch < this.weather.next_epoch){
					break;
				}

			}

		}

	},

	get_season_data: function(epoch){

		this.data.season_epoch = (epoch-this.data.season_offset) % this.data.season_length;
		this.data.season_epoch = this.data.season_epoch < 0 ? this.data.season_epoch + this.data.season_length : this.data.season_epoch;


		if(this.data.season_epoch == this.data.next_epoch){

			this.data.last_point++;
			this.data.next_point++;
			this.data.last_epoch = this.data.seasons[this.data.last_point];
			this.data.next_epoch = this.data.seasons[this.data.next_point];

			if(this.data.last_epoch == this.data.next_epoch && this.data.last_epoch != this.data.season_length){
				this.data.last_point++;
				this.data.next_point++;
				this.data.last_epoch = this.data.seasons[this.data.last_point];
				this.data.next_epoch = this.data.seasons[this.data.next_point];
			}

		}

		var curr_season = Math.floor(this.data.last_point / 2);
		var next_season = Math.floor(this.data.next_point / 2) != this.current_location.seasons.length ? Math.floor(this.data.next_point / 2) : 0;

		if(this.calendar.seasons.data.length == 1){
			var next_season = curr_season;
		}

		this.data.perc = norm(this.data.season_epoch, this.data.last_epoch, this.data.next_epoch);

		if(this.data.season_epoch == this.data.season_length-1){

			this.data.last_point = 0;
			this.data.next_point = 1;
			this.data.last_epoch = this.data.seasons[this.data.last_point];
			this.data.next_epoch = this.data.seasons[this.data.next_point];

		}

		var curr_season_data = this.current_location.seasons[curr_season];
		var next_season_data = this.current_location.seasons[next_season];

		if(!curr_season_data){
			console.log(curr_season, next_season);
		}

		var sunrise_minute = Math.round(lerp(curr_season_data.time.sunrise.minute, next_season_data.time.sunrise.minute, this.data.perc));
		var sunrise_hour = lerp(curr_season_data.time.sunrise.hour, next_season_data.time.sunrise.hour, this.data.perc);
		var sunrise = sunrise_hour+sunrise_minute/this.calendar.clock.minutes;

		var sunset_minute = Math.round(lerp(curr_season_data.time.sunset.minute, next_season_data.time.sunset.minute, this.data.perc));
		var sunset_hour = lerp(curr_season_data.time.sunset.hour, next_season_data.time.sunset.hour, this.data.perc);
		var sunset = sunset_hour+sunset_minute/this.calendar.clock.minutes;

		var sunrise_m = (Math.round(fract(sunrise)*this.calendar.clock.minutes)).toString().length < 2 ? "0"+(Math.round(fract(sunrise)*this.calendar.clock.minutes)).toString() : (Math.round(fract(sunrise)*this.calendar.clock.minutes));
		var sunset_m = (Math.round(fract(sunset)*this.calendar.clock.minutes)).toString().length < 2 ? "0"+(Math.round(fract(sunset)*this.calendar.clock.minutes)).toString() : (Math.round(fract(sunset)*this.calendar.clock.minutes));

		var sunrise_s = Math.floor(sunrise)+":"+sunrise_m;
		var sunset_s = Math.floor(sunset)+":"+sunset_m;

		return {
			season_name: curr_season_data.name,
			season_index: curr_season,
			season_perc: this.data.perc,
			sunrise: [sunrise, sunrise_s],
			sunset: [sunset, sunset_s]
		}

	},

	get_weather_data: function(epoch){

		/*----------------------------- WEATHER GENERATION ------------------------------------*/

		this.weather.season_epoch = (epoch-this.weather.season_offset-this.calendar.seasons.global_settings.weather_offset) % this.weather.season_length;
		this.weather.season_epoch = this.weather.season_epoch < 0 ? this.weather.season_epoch + this.weather.season_length : this.weather.season_epoch;

		if(this.weather.season_epoch == this.weather.next_epoch){

			this.weather.last_point++;
			this.weather.next_point++;
			this.weather.last_epoch = this.weather.seasons[this.weather.last_point];
			this.weather.next_epoch = this.weather.seasons[this.weather.next_point];

			if(this.weather.last_epoch == this.weather.next_epoch && this.weather.last_epoch != this.weather.season_length){
				this.weather.last_point++;
				this.weather.next_point++;
				this.weather.last_epoch = this.weather.seasons[this.weather.last_point];
				this.weather.next_epoch = this.weather.seasons[this.weather.next_point];
			}

		}

		var curr_season = Math.floor(this.weather.last_point / 2);
		var next_season = Math.floor(this.weather.next_point / 2) != this.current_location.seasons.length ? Math.floor(this.weather.next_point / 2) : 0;

		var val = 0;

		if(this.calendar.seasons.data.length == 1){
			next_season = curr_season;
		}

		perc = 0;

		if(curr_season == next_season){

			val = 1.0;

		}else{

			middle = mid(this.weather.last_epoch, this.weather.next_epoch);

			perc = norm(this.weather.season_epoch, this.weather.last_epoch, this.weather.next_epoch);

			if(perc <= 0.5){

				val = bezierQuadratic(0.0, 0.0, 0.5, norm(this.weather.season_epoch, this.weather.last_epoch, middle))

				
			}else{

				val = bezierQuadratic(0.5, 1.0, 1.0, norm(this.weather.season_epoch, middle, this.weather.next_epoch))

			}

		}

		if(this.weather.season_epoch == this.weather.season_length-1){

			this.weather.last_point = 0;
			this.weather.next_point = 1;
			this.weather.last_epoch = this.weather.seasons[this.weather.last_point];
			this.weather.next_epoch = this.weather.seasons[this.weather.next_point];

		}

		var curr_season_data = this.current_location.seasons[curr_season];
		var next_season_data = this.current_location.seasons[next_season];

		var low = lerp(curr_season_data.weather.temp_low, next_season_data.weather.temp_low, val);
		var high = lerp(curr_season_data.weather.temp_high, next_season_data.weather.temp_high, val);
		var temp = mid(low, high);
		temp += this.random.noise(epoch, 1.0, this.current_location.settings.large_noise_frequency, this.current_location.settings.large_noise_amplitude);
		temp += this.random.noise(epoch+this.weather.season_length, 1.0, this.current_location.settings.medium_noise_frequency, this.current_location.settings.medium_noise_amplitude);
		temp += this.random.noise(epoch+this.weather.season_length*2, 1.0, this.current_location.settings.small_noise_frequency, this.current_location.settings.small_noise_amplitude);
		
		var range_low = Math.abs((this.random.noise(epoch+this.weather.season_length*3, 1.0, 0.5, 1.5))*(high-low)*0.5);
		var range_high = Math.abs((this.random.noise(epoch+this.weather.season_length*4, 1.0, 0.5, 1.5))*(high-low)*0.5);


		var temperature_i = [temp-range_low, temp+range_high];
		var temperature_m = [this.fahrenheit_to_celcius(temperature_i[0]), this.fahrenheit_to_celcius(temperature_i[1])];
		var temperature_c = this.pick_from_table(temp, this.temperature_gauge, false).key;

		var percipitation_table = temp > 32 ? "warm" : "cold";		

		var precipitation_chance = lerp(curr_season_data.weather.precipitation, next_season_data.weather.precipitation, val);
		var precipitation_intensity = lerp(curr_season_data.weather.precipitation_intensity, next_season_data.weather.precipitation_intensity, val);

		chance = clamp(0.5+this.random.noise(epoch+this.weather.season_length*4, 5.0, 0.35, 0.5), 0.0, 1.0);

		var inner_chance = 0;

		var precipitation = {'key': 'None'};
		var wind_speed = {'key': 'Calm'};
		var clouds = 'Clear';
		var feature_select = false;
		var feature = '';

		if(precipitation_chance > chance){

			inner_chance = clamp((0.5+this.random.noise(epoch+this.weather.season_length*5, 10, 0.3, 0.5))*precipitation_intensity, 0.0, 1.0);
	
			precipitation = this.pick_from_table(inner_chance, this.precipitation[percipitation_table], true);

			if(precipitation){

				clouds = this.clouds[precipitation.index];

				wind_type_chance = this.random.roll_dice(epoch+this.weather.season_length, this.wind.type[precipitation.index]);

				if(wind_type_chance == 20){
					wind_type_chance += this.random.roll_dice(epoch+this.weather.season_length*6, '1d10');
					feature_select = 'Storm';
				}else{
					feature_select = 'Rain';
				}

				wind_speed = this.pick_from_table(wind_type_chance, this.wind.speed, true);

			}

		}else{

			clouds_chance = clamp((0.5+this.random.noise(epoch+this.weather.season_length*7, 10, 0.4, 0.5)), 0.0, 1.0);

			another_precipitation = this.pick_from_table(clouds_chance-0.3, this.precipitation[percipitation_table], true);

			if(clouds_chance > 0.3 && another_precipitation > 0.2){
				clouds = this.clouds[another_precipitation.index];
			}

			wind_type_chance = this.random.roll_dice(epoch+this.weather.season_length*8, this.wind.type[another_precipitation.index]);

			wind_type_chance = wind_type_chance == 20 ? 19 : wind_type_chance;
			
			wind_speed = this.pick_from_table(wind_type_chance, this.wind.speed, true);

			if(wind_speed.key > 4){
				feature_select = 'Windy';
			}

		}

		if(feature_select && this.feature_table[feature_select]){

			feature_chance = clamp((0.5+this.random.noise(epoch+this.weather.season_length*9, 10, 0.4, 0.5)), 0.0, 1.0);

			feature = this.pick_from_table(feature_chance, this.feature_table[feature_select][percipitation_table], false).key;

		}

		if(!this.wind_direction){
			this.wind_direction = this.random.random_int_between(epoch+1000, 0, Object.keys(this.wind.direction_table).length-1);
			this.wind_direction = Object.keys(this.wind.direction_table)[this.wind_direction];
		}

		var wind_chance = clamp((0.5+this.random.noise(epoch+1000, 10, 0.4, 0.5)), 0.0, 1.0);
		this.wind_direction = this.pick_from_table(wind_chance, this.wind.direction_table[this.wind_direction], true).key;
		var wind_direction = this.wind_direction;

		var wind_info = clone(this.wind.info[wind_speed.key]);
		var wind_velocity_i = wind_info['mph'];
		var wind_velocity_m = wind_info['mph'].replace( /(\d+)/g, function(a, b){
			return Math.round(b*1.60934,2);
		});

		if(Object.keys(this.current_location.custom_dates).indexOf(epoch.toString()) !== -1){

			var custom_weather = this.current_location.custom_dates[epoch];

			if(custom_weather.temperature[0] === "i"){
				var temperature_i = custom_weather.temperature[1];
				var temperature_m = [this.fahrenheit_to_celcius(temperature_i[0]), this.fahrenheit_to_celcius(temperature_i[1])];
			}else{
				var temperature_m = custom_weather.temperature[1];
				var temperature_i = [this.celcius_to_fahrenheit(temperature_m[0]), this.celcius_to_fahrenheit(temperature_m[1])];
			}
			var temperature_c = this.pick_from_table(mid(temperature_i[0], temperature_i[1]), this.temperature_gauge, false).key;

			precipitation.key = custom_weather.precipitation !== undefined ? custom_weather.precipitation : precipitation.key;

			clouds = custom_weather.clouds !== undefined ? custom_weather.clouds : clouds;

			feature = custom_weather.feature !== undefined ? custom_weather.feature : feature;

			wind_speed.key = custom_weather.wind_speed !== undefined ? custom_weather.wind_speed : wind_speed.key;

			wind_info.desciption = custom_weather.wind_speed_desc !== undefined ? custom_weather.wind_speed_desc : wind_info.desciption;

			if(custom_weather.wind_velocity[0] === "i"){
				var wind_velocity_i = custom_weather.wind_velocity[1];
				var wind_velocity_m = custom_weather.wind_velocity[1].replace( /(\d+)/g, function(a, b){
					return Math.round(b*1.60934,2);
				});
			}else{
				var wind_velocity_m = custom_weather.wind_velocity[1];
				var wind_velocity_i = custom_weather.wind_velocity[1].replace( /(\d+)/g, function(a, b){
					return Math.round(b*0.62137,2);
				});
			}

			wind_direction = custom_weather.wind_direction !== undefined ? custom_weather.wind_direction : wind_direction;

		}

		var return_data = {
			temperature: {
				imperial: {
					value: temperature_i,
					low: lerp(curr_season_data.weather.temp_low, next_season_data.weather.temp_low, val),
					high: lerp(curr_season_data.weather.temp_high, next_season_data.weather.temp_high, val),
				},
				metric: {
					value: temperature_m,
					low: this.fahrenheit_to_celcius(lerp(curr_season_data.weather.temp_low, next_season_data.weather.temp_low, val)),
					high: this.fahrenheit_to_celcius(lerp(curr_season_data.weather.temp_high, next_season_data.weather.temp_high, val)),
				},
				cinematic: temperature_c
			},
			precipitation: {
				key: precipitation.key,
				chance: precipitation_chance,
				actual: inner_chance,
				intensity: precipitation_intensity,
			},
			clouds: clouds,
			feature: feature,
			wind_speed: wind_speed.key,
			wind_speed_desc: wind_info.desciption,
			wind_velocity: {
				imperial: wind_velocity_i,
				metric: wind_velocity_m
			},
			wind_direction: wind_direction
		}

		return return_data;

	},

	fahrenheit_to_celcius: function(temp){
		return precisionRound((temp-32)*(5/9), 4);
	},

	celcius_to_fahrenheit: function(temp){
		return precisionRound((temp*9/5)+32, 4);
	},

	pick_from_table: function(chance, array, grow){
		grow = grow !== undefined ? grow : false;
		keys = Object.keys(array);
		values = array;
		for(index = 0, target = 0; index < keys.length; index++){
			if(grow){
				target += values[keys[index]];
			}else{
				target = values[keys[index]];
			}
			if(chance <= target){
				return {
					'index': index,
					'key': keys[index],
					'value': values[keys[index]]
				};
			}
		}
		return false;
	},

	temperature_gauge: {
		'Polar': -40,
		'Bone-chilling': -22,
		'Bitter cold': -4,
		'Biting': 5,
		'Frigid': 14,
		'Crisp': 23,
		'Freezing': 32,
		'Cold': 41,
		'Chilly': 50,
		'Cool': 59,
		'Mild': 68,
		'Warm': 77,
		'Hot': 86,
		'Very Hot': 95,
		'Sweltering': 104,
		'Blistering': 113,
		'Burning': 140,
		'Blazing': 176,
		'Infernal': 212
	},

	clouds: [
		'A few clouds',
		'Mostly cloudy',
		'Gray, slightly overcast',
		'Gray, highly overcast',
		'Dark storm clouds',
		'Dark storm clouds'
	],

	precipitation: {
		'warm': {
			'Light mist': 0.2,
			'Drizzle': 0.175,
			'Steady rainfall': 0.175,
			'Strong rainfall': 0.15,
			'Pounding rain': 0.15,
			'Downpour': 0.15
		},
		'cold': {
			'A few flakes': 0.2,
			'A dusting of snow': 0.175,
			'Flurries': 0.175,
			'Moderate snowfall': 0.15,
			'Heavy snowfall': 0.15,
			'Blizzard': 0.15
		}
	},

	wind: {

		type: [
			'1d4',
			'1d6',
			'2d4',
			'2d6',
			'2d8',
			'2d10'
		],

		speed: {
			'Calm': 1,
			'Light air': 2,
			'Light breeze': 2,
			'Gentle breeze': 2,
			'Moderate breeze': 2,
			'Fresh breeze': 2,
			'Strong breeze': 2,
			'Moderate gale': 2,
			'Fresh gale': 2,
			'Strong gale': 1,
			'Storm': 1,
			'Violent storm': 19,
			'Hurricane': 2
		},

		info: {
			'Calm': {
				'mph': '<1',
				'desciption': 'Smoke rises vertically'
			},
			'Light air': {
				'mph': '1-3',
				'desciption': 'Wind direction shown by smoke but not wind vanes'
			},
			'Light breeze': {
				'mph': '4-7',
				'desciption': 'Wind felt on face, leaves rustle, vanes move'
			},
			'Gentle breeze': {
				'mph': '8-12',
				'desciption': 'Leaves and small twigs sway and banners flap'
			},
			'Moderate breeze': {
				'mph': '13-18',
				'desciption': 'Small branches move, and dust and small branches are raised'
			},
			'Fresh breeze': {
				'mph': '19-24',
				'desciption': 'Small trees sway and small waves form on inland waters'
			},
			'Strong breeze': {
				'mph': '25-31',
				'desciption': 'Large branches move'
			},
			'Moderate gale': {
				'mph': '32-38',
				'desciption': 'Whole trees sway and walking against wind takes some effort'
			},
			'Fresh gale': {
				'mph': '39-46',
				'desciption': 'Twigs break off trees and general progress is impeded'
			},
			'Strong gale': {
				'mph': '47-54',
				'desciption': 'Slight structural damage occurs'
			},
			'Storm': {
				'mph': '55-63',
				'desciption': 'Trees are uprooted and considerable structural damage occurs'
			},
			'Violent storm': {
				'mph': '64-72',
				'desciption': 'Widespread damage occurs'
			},
			'Hurricane': {
				'mph': '73-136',
				'desciption': 'Widespread devastation occurs'
			}
		},

		direction_table: {
			'N': {
				'N': 0.31,
				'NW': 0.14,
				'W': 0.105,
				'NE': 0.14,
				'E': 0.105,
				'SW': 0.075,
				'SE': 0.075,
				'S': 0.05
			},
			'NE': {
				'NE': 0.31,
				'N': 0.14,
				'E': 0.14,
				'W': 0.075,
				'S': 0.075,
				'NW': 0.105,
				'SE': 0.105,
				'SW': 0.05
			},
			'E': {
				'E': 0.31,
				'NE': 0.14,
				'SE': 0.14,
				'N': 0.105,
				'S': 0.105,
				'NW': 0.075,
				'SW': 0.075,
				'W': 0.05
			},
			'SE': {
				'SE': 0.31,
				'E': 0.14,
				'S': 0.14,
				'NE': 0.105,
				'SW': 0.105,
				'N': 0.075,
				'W': 0.075,
				'NW': 0.05
			},
			'S': {
				'S': 0.31,
				'SE': 0.14,
				'SW': 0.14,
				'E': 0.105,
				'W': 0.105,
				'NE': 0.075,
				'NW': 0.075,
				'N': 0.05
			},
			'SW': {
				'SW': 0.31,
				'S': 0.14,
				'W': 0.14,
				'SE': 0.105,
				'NW': 0.105,
				'E': 0.075,
				'N': 0.075,
				'NE': 0.05
			},
			'W': {
				'W': 0.31,
				'SW': 0.14,
				'NW': 0.14,
				'S': 0.105,
				'N': 0.105,
				'SE': 0.075,
				'NE': 0.075,
				'E': 0.05
			},
			'NW': {
				'NW': 0.31,
				'W': 0.14,
				'N': 0.14,
				'SW': 0.105,
				'NE': 0.105,
				'S': 0.075,
				'E': 0.075,
				'SE': 0.05
			}
		}
	},

	feature_table: {
		'Rain':{
			'warm': {
				'None': 0.5,
				'Fog': 1.0
			},
			'cold': {
				'None': 0.75,
				'Hail': 1.0
			}
		},
		'Storm': {
			'warm': {
				'None': 0.5,
				'Lightning': 1.0
			},
			'cold': {
				'None': 0.8,
				'Hail': 0.2
			}
		},
		'Windy': {
			'warm': {
				'None': 0.5,
				'Dust Storm': 0.3,
				'Tornado': 0.2
			},
			'cold': {
				'None': 0.8,
				'Tornado': 0.2
			}
		}
	},

	preset_curves: {

		"timezone": {
			"hour": 0,
			"minute": 0
		},

		"large_noise_frequency": 0.015,
		"large_noise_amplitude": 5.0,

		"medium_noise_frequency": 0.3,
		"medium_noise_amplitude": 2.0,

		"small_noise_frequency": 0.8,
		"small_noise_amplitude": 3.0

	},

	presets: {
		'Equatorial': {
			'name': 'Equatorial',
			'seasons': [
				{
					'name': 'Dry',
					'custom_name': true,
					'weather': {
						'temp_low': 60,
						'temp_high': 100,
						'precipitation': 0.5,
						'precipitation_intensity': 0.3
					}
				},
				{
					'name': 'Wet',
					'custom_name': true,
					'weather': {
						'temp_low': 60,
						'temp_high': 100,
						'precipitation': 0.6,
						'precipitation_intensity': 0.7
					}
				}
			]
		},
		'Monsoon': {
			'name': 'Monsoon',
			'seasons': [
				{
					'name': 'Dry',
					'custom_name': true,
					'weather': {
						'temp_low': 70,
						'temp_high': 120,
						'precipitation': 0.15,
						'precipitation_intensity': 0.1
					}
				},
				{
					'name': 'Wet',
					'custom_name': true,
					'weather': {
						'temp_low': 70,
						'temp_high': 120,
						'precipitation': 0.9,
						'precipitation_intensity': 0.8
					}
				}
			],
		},
		'Desert': {
			'name': 'Desert',
			'seasons': [
				{
					'name': 'Dry',
					'custom_name': true,
					'weather': {
						'temp_low': 55,
						'temp_high': 70,
						'precipitation': 0.05,
						'precipitation_intensity': 0.1
					}
				},
				{
					'name': 'Wet',
					'custom_name': true,
					'weather': {
						'temp_low': 65,
						'temp_high': 110,
						'precipitation': 0.05,
						'precipitation_intensity': 0.8
					}
				}
			]
		},
		'Tropical Savannah': {
			'name': 'Tropical Savannah',
			'seasons': [
				{
					'name': 'Dry',
					'custom_name': true,
					'weather': {
						'temp_low': 75,
						'temp_high': 115,
						'precipitation': 0.1,
						'precipitation_intensity': 0.1
					}
				},
				{
					'name': 'Wet',
					'custom_name': true,
					'weather': {
						'temp_low': 75,
						'temp_high': 115,
						'precipitation': 0.85,
						'precipitation_intensity': 0.2
					}
				}
			],
		},
		'Steppes': {
			'name': 'Steppes',
			'seasons': [
				{
					'name': 'Winter',
					'custom_name': true,
					'weather': {
						'temp_low': 35,
						'temp_high': 50,
						'precipitation': 0.2,
						'precipitation_intensity': 0.3
					}
				},
				{
					'name': 'Summer',
					'custom_name': true,
					'weather': {
						'temp_low': 70,
						'temp_high': 115,
						'precipitation': 0.05,
						'precipitation_intensity': 0.3
					}
				}
			]
		},
		'Warm and Rainy': {
			'name': 'Warm and Rainy',
			'seasons': [
				{
					'name': 'Winter',
					'custom_name': true,
					'weather': {
						'temp_low': 10,
						'temp_high': 50,
						'precipitation': 0.4,
						'precipitation_intensity': 0.5
					}
				},
				{
					'name': 'Summer',
					'custom_name': true,
					'weather': {
						'temp_low': 50,
						'temp_high': 85,
						'precipitation': 0.4,
						'precipitation_intensity': 0.6
					}
				}
			]
		},
		'Warm with Dry Summer': {
			'name': 'Warm with Dry Summer',
			'seasons': [
				{
					'name': 'Winter',
					'custom_name': true,
					'weather': {
						'temp_low': 10,
						'temp_high': 60,
						'precipitation': 0.3,
						'precipitation_intensity': 0.6
					}
				},
				{
					'name': 'Summer',
					'custom_name': true,
					'weather': {
						'temp_low': 60,
						'temp_high': 95,
						'precipitation': 0.1,
						'precipitation_intensity': 0.2
					}
				}
			]
		},
		'Warm with Dry Winter': {
			'name': 'Warm with Dry Winter',
			'seasons': [
				{
					'name': 'Winter',
					'custom_name': true,
					'weather': {
						'temp_low': 32,
						'temp_high': 50,
						'precipitation': 0.15,
						'precipitation_intensity': 0.2
					}
				},
				{
					'name': 'Summer',
					'custom_name': true,
					'weather': {
						'temp_low': 70,
						'temp_high': 110,
						'precipitation': 0.45,
						'precipitation_intensity': 0.6
					}
				}
			]
		},
		'Cool and Rainy': {
			'name': 'Cool and Rainy',
			'seasons': [
				{
					'name': 'Winter',
					'custom_name': true,
					'weather': {
						'temp_low': 5,
						'temp_high': 40,
						'precipitation': 0.35,
						'precipitation_intensity': 0.6
					}
				},
				{
					'name': 'Summer',
					'custom_name': true,
					'weather': {
						'temp_low': 60,
						'temp_high': 85,
						'precipitation': 0.35,
						'precipitation_intensity': 0.6
					}
				}
			]
		},
		'Cool with Dry Winter': {
			'name': 'Cool with Dry Winter',
			'seasons': [
				{
					'name': 'Winter',
					'custom_name': true,
					'weather': {
						'temp_low': 5,
						'temp_high': 40,
						'precipitation': 0.1,
						'precipitation_intensity': 0.1
					}
				},
				{
					'name': 'Summer',
					'custom_name': true,
					'weather': {
						'temp_low': 60,
						'temp_high': 85,
						'precipitation': 0.35,
						'precipitation_intensity': 0.75
					}
				}
			]
		},
		'Tundra': {
			'name': 'Tundra',
			'seasons': [
				{
					'name': 'Winter',
					'custom_name': true,
					'weather': {
						'temp_low': -35,
						'temp_high': -15,
						'precipitation': 0.1,
						'precipitation_intensity': 0.1
					}
				},
				{
					'name': 'Summer',
					'custom_name': true,
					'weather': {
						'temp_low': 35,
						'temp_high': 55,
						'precipitation': 0.1,
						'precipitation_intensity': 0.1
					}
				}
			]
		},
		'Polar: Arctic': {
			'name': 'Arctic',
			'seasons': [
				{
					'name': 'Winter',
					'custom_name': true,
					'weather': {
						'temp_low': -20,
						'temp_high': -10,
						'precipitation': 0.1,
						'precipitation_intensity': 0.1
					}
				},
				{
					'name': 'Summer',
					'custom_name': true,
					'weather': {
						'temp_low': 50,
						'temp_high': 70,
						'precipitation': 0.3,
						'precipitation_intensity': 0.1
					}
				}
			]
		},
		'Polar: Antarctic': {
			'name': 'Antarctic',
			'seasons': [
				{
					'name': 'Winter',
					'custom_name': true,
					'weather': {
						'temp_low': -81,
						'temp_high': -65,
						'precipitation': 0.1,
						'precipitation_intensity': 0.1
					}
				},
				{
					'name': 'Summer',
					'custom_name': true,
					'weather': {
						'temp_low': -22,
						'temp_high': -15,
						'precipitation': 0.1,
						'precipitation_intensity': 0.1
					}
				}
			]
		}
	}
};