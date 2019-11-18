var climate_generator = {

	process: true,

	set_up: function(calendar_name, static_data, dynamic_data, epoch){

		this.process_seasons = true;
		this.process_weather = true;

		if(static_data.year_data.timespans.length == 0
		   ||
		   static_data.year_data.global_week.length == 0
		   ||
		   dynamic_data.location === ''
		   ||
		   static_data.seasons.data.length == 0
		){

			this.process_seasons = false;
			this.process_weather = false;
			return;

		}

		if(!static_data.seasons.global_settings.enable_weather){
			this.process_weather = false;
		}

		this.dynamic_data = dynamic_data;
		this.static_data = static_data;

		this.season_length = 0;

		this.season = {
			current_index: 0,
			next_index: 0,
			current: 0,
			next: 0,
			day: 0,
			total_day: 0,
			perc: 0,
			season_day: 0
		}

		this.weather = {
			current_index: 0,
			next_index: 0,
			current: 0,
			next: 0,
			day: 0,
			total_day: 0,
			perc: 0
		}

		this.settings = clone(static_data.seasons.global_settings);
		this.clock = clone(static_data.clock);
		this.seasons = clone(static_data.seasons.data);

		this.wind_direction = false;

		this.random = new random(this.static_data.seasons.global_settings.seed);

		if(this.dynamic_data.custom_location === false && (this.seasons.length == 2 || this.seasons.length == 4)){

			this.current_location = this.presets[this.seasons.length][this.dynamic_data.location] ? this.presets[this.seasons.length][this.dynamic_data.location] : this.presets[this.seasons.length]['Equatorial'];

			for(var i = 0; i < this.static_data.seasons.data.length; i++){

				this.current_location.seasons.push(this.current_location.seasons[i])

				this.current_location.seasons[i].time = clone(this.static_data.seasons.data[i].time);

			}

			this.current_location.settings = clone(this.preset_curves);
			this.current_location.settings.timezone = 0;
			this.current_location.custom_dates = {};

		}else if(this.dynamic_data.custom_location === true){

			this.current_location = clone(this.static_data.seasons.locations[this.dynamic_data.location]);

		}


		/* -------------------------------------------------------------------------------------------------------------*/

		for(var season_index in this.seasons){

			this.seasons[season_index].length = this.seasons[season_index].transition_length+this.seasons[season_index].duration;

			this.seasons[season_index].start = this.season_length;
			this.season_length += this.seasons[season_index].transition_length;
			this.seasons[season_index].end = this.season_length;
			this.season_length += this.seasons[season_index].duration;

		}

		this.season.day = (fract(epoch/this.season_length)*this.season_length)
		this.season.day -= this.settings.season_offset;

		/* -------------------------------------------------------------------------------------------------------------*/

		if(this.season.day < 0){
			this.season.day += this.season_length
		}else if(this.season.day > this.season_length){
			this.season.day -= this.season_length;
		}

		this.season.day++;

		for(var season_index in this.seasons){

			var season = this.seasons[season_index];

			if(this.season.day >= this.season.total_day && this.season.day < this.season.total_day+season.length){

				this.season.current_index = Number(season_index)
				this.season.next_index = (this.season.current_index+1)%this.seasons.length;

				this.season.current = this.seasons[this.season.current_index];
				this.season.next = this.seasons[this.season.next_index];
				
				this.season.total_day += season.length;
				break;

			}else{

				this.season.total_day += season.length;
			}
		}

		/* -------------------------------------------------------------------------------------------------------------*/

		this.weather.day = (fract(epoch/this.season_length)*this.season_length)

		this.weather.day -= this.settings.season_offset;
		this.weather.day -= this.settings.weather_offset;

		if(this.weather.day < 0){
			this.weather.day += this.season_length
		}else if(this.weather.day > this.season_length){
			this.weather.day -= this.season_length;
		}

		this.weather.day++;

		for(var season_index in this.seasons){

			var season = this.seasons[season_index];

			if(this.weather.day >= this.weather.total_day && this.weather.day < this.weather.total_day+season.length){

				this.weather.current_index = Number(season_index)
				this.weather.next_index = (this.weather.current_index+1)%this.seasons.length;

				this.weather.current = this.seasons[this.weather.current_index];
				this.weather.next = this.seasons[this.weather.next_index];

				this.weather.total_day += season.length;
				break;

			}else{

				this.weather.total_day += season.length;
			}
		}

		/* -------------------------------------------------------------------------------------------------------------*/


	},

	get_season_time: function(season_percentage){

		sunrise = false;
		sunset = false;

		if(this.static_data.clock.enabled){

			var sunrise_minute = Math.round(lerp(this.season.current.time.sunrise.minute, this.season.next.time.sunrise.minute, season_percentage));
			var sunrise_hour = lerp(this.season.current.time.sunrise.hour, this.season.next.time.sunrise.hour, season_percentage);
			var sunrise = sunrise_hour+sunrise_minute/this.static_data.clock.minutes;

			var sunset_minute = Math.round(lerp(this.season.current.time.sunset.minute, this.season.next.time.sunset.minute, season_percentage));
			var sunset_hour = lerp(this.season.current.time.sunset.hour, this.season.next.time.sunset.hour, season_percentage);
			var sunset = sunset_hour+sunset_minute/this.static_data.clock.minutes;

			var sunrise_m = (Math.round(fract(sunrise)*this.static_data.clock.minutes)).toString().length < 2 ? "0"+(Math.round(fract(sunrise)*this.static_data.clock.minutes)).toString() : (Math.round(fract(sunrise)*this.static_data.clock.minutes));
			var sunset_m = (Math.round(fract(sunset)*this.static_data.clock.minutes)).toString().length < 2 ? "0"+(Math.round(fract(sunset)*this.static_data.clock.minutes)).toString() : (Math.round(fract(sunset)*this.static_data.clock.minutes));

			var sunrise_s = Math.floor(sunrise)+":"+sunrise_m;
			var sunset_s = Math.floor(sunset)+":"+sunset_m;

			sunrise = {
				data: sunrise,
				string: sunrise_s
			}
			
			sunset = {
				data: sunset,
				string: sunset_s
			}

		}

		return {
			'sunrise': sunrise,
			'sunset': sunset
		}

	},

	get_season_data: function(epoch){

		if(!this.process_seasons) return;

		this.season.day = (fract(epoch/this.season_length)*this.season_length)

		this.season.day -= this.settings.season_offset;

		if(this.season.day < 0){
			this.season.day += this.season_length
		}else if(this.season.day > this.season_length){
			this.season.day -= this.season_length;
		}

		this.season.day++;

        this.season.season_day = this.seasons[this.season.current_index].length+this.season.day-this.season.total_day

		this.season.perc = clamp((this.season.season_day)/this.seasons[this.season.current_index].transition_length, 0.0, 1.0);

        this.season.season_day = Math.floor(this.season.season_day)

		/* -------------------------------------------------------------------------------------------------------------*/

		var time = this.get_season_time(this.season.perc)

		var data = {
			season_name: this.seasons[this.season.current_index].name,
			season_index: this.season.current_index,
			season_perc: Math.ceil(this.season.perc*100)/100,
			season_day: Math.ceil(this.season.season_day),
			time: time
		}

		/* -------------------------------------------------------------------------------------------------------------*/

		if(this.season.day > this.season.total_day){
			
			this.season.current_index = (this.season.current_index+1)%this.seasons.length;
			this.season.next_index = (this.season.current_index+1)%this.seasons.length;

			this.season.current = this.seasons[this.season.current_index];
			this.season.next = this.seasons[this.season.next_index];
			
			this.season.total_day += this.seasons[this.season.current_index].length;
			if(this.season.total_day > this.season_length){
				this.season.total_day = this.seasons[this.season.current_index].length;
			}

		}

		return data;


	},

	get_weather_data: function(epoch){

		if(!this.process_weather) return;

		this.weather.day = (fract(epoch/this.season_length)*this.season_length)

		this.weather.day -= this.settings.season_offset;
		this.weather.day -= this.settings.weather_offset;

		if(this.weather.day < 0){
			this.weather.day += this.season_length
		}else if(this.weather.day > this.season_length){
			this.weather.day -= this.season_length;
		}

		this.weather.day++;

        this.weather.season_day = this.seasons[this.weather.current_index].length+this.weather.day-this.weather.total_day

        if(Math.ceil(this.weather.season_day) > this.seasons[this.weather.current_index].duration){

			this.weather.perc = (this.weather.season_day-this.seasons[this.weather.current_index].duration)/this.seasons[this.weather.current_index].transition_length;

		}else{

			this.weather.perc = 0.0;

		}

        this.weather.season_day = Math.floor(this.weather.season_day)

		/* -------------------------------------------------------------------------------------------------------------*/

		var start = this.weather.current.start;
		var end = this.weather.current.end;
		var middle = Math.floor((end/2)+(start/2));

		var curve = {
			both: norm(bezierCubic(start, start, end, end, this.weather.perc), start, end),
			start: norm(bezierCubic(start, start, middle, end, this.weather.perc), start, end),
			end: norm(bezierCubic(start, middle, end, end, this.weather.perc), start, end)
		}

		var curr_season_data = this.current_location.seasons[this.weather.current_index];
		var next_season_data = this.current_location.seasons[this.weather.next_index];

		if(!curr_season_data.weather.temp_transitional && next_season_data.weather.temp_transitional){

			var next_next = (this.weather.current_index+2)%this.seasons.length;

			var temp_curve = curve.start;
			var curr_temp_low = curr_season_data.weather.temp_low;
			var curr_temp_high = curr_season_data.weather.temp_high;
			var next_temp_low = mid(curr_season_data.weather.temp_low, this.current_location.seasons[next_next].weather.temp_low);
			var next_temp_high = mid(curr_season_data.weather.temp_high, this.current_location.seasons[next_next].weather.temp_high);

		}else if(curr_season_data.weather.temp_transitional && !next_season_data.weather.temp_transitional){

			var prev_prev = (this.weather.current_index-1)%this.seasons.length;

			var temp_curve = curve.end;
			var curr_temp_low = mid(this.current_location.seasons[prev_prev].weather.temp_low, next_season_data.weather.temp_low);
			var curr_temp_high = mid(this.current_location.seasons[prev_prev].weather.temp_high, next_season_data.weather.temp_high);
			var next_temp_low = next_season_data.weather.temp_low;
			var next_temp_high = next_season_data.weather.temp_high;

		}else{

			var temp_curve = curve.both;
			var curr_temp_low = curr_season_data.weather.temp_low;
			var curr_temp_high = curr_season_data.weather.temp_high;
			var next_temp_low = next_season_data.weather.temp_low;
			var next_temp_high = next_season_data.weather.temp_high;

		}

		if(!curr_season_data.weather.precipitation_transitional && next_season_data.weather.precipitation_transitional){
			
			var next_next = (this.weather.current_index+2)%this.seasons.length;

			var precipitation_curve = curve.start;
			var curr_precipitation = curr_season_data.weather.precipitation;
			var curr_precipitation_intensity = curr_season_data.weather.precipitation_intensity;
			var next_precipitation = mid(curr_season_data.weather.precipitation, this.current_location.seasons[next_next].weather.precipitation);
			var next_precipitation_intensity = mid(curr_season_data.weather.precipitation_intensity, this.current_location.seasons[next_next].weather.precipitation_intensity);

		}else if(curr_season_data.weather.precipitation_transitional && !next_season_data.weather.precipitation_transitional){

			var prev_prev = (this.weather.current_index-1)%this.seasons.length;

			var precipitation_curve = curve.end;
			var curr_precipitation = mid(this.current_location.seasons[prev_prev].weather.precipitation, next_season_data.weather.precipitation);
			var curr_precipitation_intensity = mid(this.current_location.seasons[prev_prev].weather.precipitation_intensity, next_season_data.weather.precipitation_intensity);
			var next_precipitation = next_season_data.weather.precipitation;
			var next_precipitation_intensity = next_season_data.weather.precipitation_intensity;

		}else{

			var precipitation_curve = curve.both;
			var curr_precipitation = curr_season_data.weather.precipitation;
			var curr_precipitation_intensity = curr_season_data.weather.precipitation_intensity;
			var next_precipitation = next_season_data.weather.precipitation;
			var next_precipitation_intensity = next_season_data.weather.precipitation_intensity;

		}

		var low = lerp(curr_temp_low, next_temp_low, temp_curve);
		var high = lerp(curr_temp_high, next_temp_high, temp_curve);

		var range_low = low+Math.abs(this.random.noise(epoch, 1.0, this.current_location.settings.large_noise_frequency, this.current_location.settings.large_noise_amplitude));
		range_low += Math.abs(this.random.noise(epoch+this.season_length, 1.0, this.current_location.settings.medium_noise_frequency, this.current_location.settings.medium_noise_amplitude));
		range_low += Math.abs(this.random.noise(epoch+this.season_length*2, 1.0, this.current_location.settings.small_noise_frequency, this.current_location.settings.small_noise_amplitude));
		range_low += Math.abs((this.random.noise(epoch+this.season_length*4, 0.5, 0.3, 1.5))*(high-low)*0.6);
	
		var range_high = high-Math.abs(this.random.noise(epoch-this.season_length, 1.0, this.current_location.settings.large_noise_frequency, this.current_location.settings.large_noise_amplitude));
		range_high -= Math.abs(this.random.noise(epoch-this.season_length*2, 1.0, this.current_location.settings.medium_noise_frequency, this.current_location.settings.medium_noise_amplitude));
		range_high -= Math.abs(this.random.noise(epoch-this.season_length*3, 1.0, this.current_location.settings.small_noise_frequency, this.current_location.settings.small_noise_amplitude));
		range_high -= Math.abs((this.random.noise(epoch+this.season_length*3, 1.0, 0.3, 1.5))*(high-low)*0.6);

		// If the low value happened to go over the high, swap 'em
		if(range_low > range_high){
			range_low=range_high+(range_high=range_low)-range_low
		}

		var temp = mid(range_low, range_high);

		if(this.static_data.seasons.global_settings.temp_sys === "imperial" || this.static_data.seasons.global_settings.temp_sys === "both_i" || !this.dynamic_data.custom_location){
			var temperature_range_i = [low, high];
			var temperature_range_m = [this.fahrenheit_to_celcius(low), this.fahrenheit_to_celcius(high)];
			var temperature_i = [range_low, range_high];
			var temperature_m = [this.fahrenheit_to_celcius(temperature_i[0]), this.fahrenheit_to_celcius(temperature_i[1])];
			var temperature_c = this.pick_from_table(temp, this.temperature_gauge, false).key;
			var percipitation_table = temp > 32 ? "warm" : "cold";
		}else{
			var temperature_range_i = [this.celcius_to_fahrenheit(low), this.celcius_to_fahrenheit(high)];
			var temperature_range_m = [low, high];
			var temperature_m = [range_low, range_high];
			var temperature_i = [this.celcius_to_fahrenheit(temperature_m[0]), this.celcius_to_fahrenheit(temperature_m[1])];
			var temperature_c = this.pick_from_table(this.celcius_to_fahrenheit(temp), this.temperature_gauge, false).key;
			var percipitation_table = temp > 0 ? "warm" : "cold";
		}

		var precipitation_chance = lerp(curr_precipitation, next_precipitation, precipitation_curve);
		var precipitation_intensity = lerp(curr_precipitation_intensity, next_precipitation_intensity, precipitation_curve);


		var precipitation_chance = lerp(curr_precipitation, next_precipitation, precipitation_curve);
		var precipitation_intensity = lerp(curr_precipitation_intensity, next_precipitation_intensity, precipitation_curve);

		var chance = clamp(0.5+this.random.noise(epoch+this.season_length*4, 5.0, 0.35, 0.5), 0.0, 1.0);

		var inner_chance = 0;

		var precipitation = {'key': 'None'};
		var wind_speed = {'key': 'Calm'};
		var clouds = 'Clear';
		var feature_select = false;
		var feature = '';

		if(precipitation_chance > chance){

			inner_chance = clamp((0.5+this.random.noise(epoch+this.season_length*5, 10, 0.3, 0.5))*precipitation_intensity, 0.0, 1.0);
	
			precipitation = this.pick_from_table(inner_chance, this.precipitation[percipitation_table], true);

			if(precipitation){

				clouds = this.clouds[precipitation.index];

				wind_type_chance = this.random.roll_dice(epoch+this.season_length, this.wind.type[precipitation.index]);

				if(wind_type_chance == 20){
					wind_type_chance += this.random.roll_dice(epoch+this.season_length*6, '1d10');
					feature_select = 'Storm';
				}else{
					feature_select = 'Rain';
				}

				wind_speed = this.pick_from_table(wind_type_chance, this.wind.speed, true);

			}

		}else{

			clouds_chance = clamp((0.5+this.random.noise(epoch+this.season_length*7, 10, 0.4, 0.5)), 0.0, 1.0);

			another_precipitation = this.pick_from_table(clouds_chance-0.3, this.precipitation[percipitation_table], true);

			if(clouds_chance > 0.3 && another_precipitation > 0.2){
				clouds = this.clouds[another_precipitation.index];
			}

			wind_type_chance = this.random.roll_dice(epoch+this.season_length*8, this.wind.type[another_precipitation.index]);

			wind_type_chance = wind_type_chance == 20 ? 19 : wind_type_chance;
			
			wind_speed = this.pick_from_table(wind_type_chance, this.wind.speed, true);

			if(wind_speed.key > 4){
				feature_select = 'Windy';
			}

		}

		if(feature_select && this.feature_table[feature_select]){

			feature_chance = clamp((0.5+this.random.noise(epoch+this.season_length*9, 10, 0.4, 0.5)), 0.0, 1.0);

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
					low: temperature_range_i[0],
					high: temperature_range_i[1],
				},
				metric: {
					value: temperature_m,
					low: temperature_range_m[0],
					high: temperature_range_m[1],
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

		/* -------------------------------------------------------------------------------------------------------------*/

		if(this.weather.day > this.weather.total_day){
			
			this.weather.current_index = (this.weather.current_index+1)%this.seasons.length;
			this.weather.next_index = (this.weather.current_index+1)%this.seasons.length;

			this.weather.current = this.seasons[this.weather.current_index];
			this.weather.next = this.seasons[this.weather.next_index];
			
			this.weather.total_day += this.seasons[this.weather.current_index].length;
			if(this.weather.total_day > this.season_length){
				this.weather.total_day = this.seasons[this.weather.current_index].length;
			}

		}

		/* -------------------------------------------------------------------------------------------------------------*/

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
		"2": {
			'Equatorial': {
				'name': 'Equatorial',
				'seasons': [
					{
						'name': 'Dry',
						'custom_name': true,
						'weather': {
							'temp_low': 60,
							'temp_high': 100,
							'temp_transitional': false,
							'precipitation': 0.5,
							'precipitation_intensity': 0.3,
							'precipitation_transitional': false
						}
					},
					{
						'name': 'Wet',
						'custom_name': true,
						'weather': {
							'temp_low': 60,
							'temp_high': 100,
							'temp_transitional': false,
							'precipitation': 0.6,
							'precipitation_intensity': 0.7,
							'precipitation_transitional': false
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
							'temp_transitional': false,
							'precipitation': 0.15,
							'precipitation_intensity': 0.1,
							'precipitation_transitional': false
						}
					},
					{
						'name': 'Wet',
						'custom_name': true,
						'weather': {
							'temp_low': 70,
							'temp_high': 120,
							'temp_transitional': false,
							'precipitation': 0.9,
							'precipitation_intensity': 0.8,
							'precipitation_transitional': false
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
							'temp_transitional': false,
							'precipitation': 0.05,
							'precipitation_intensity': 0.1,
							'precipitation_transitional': false
						}
					},
					{
						'name': 'Wet',
						'custom_name': true,
						'weather': {
							'temp_low': 65,
							'temp_high': 110,
							'temp_transitional': false,
							'precipitation': 0.05,
							'precipitation_intensity': 0.8,
							'precipitation_transitional': false
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
							'temp_transitional': false,
							'precipitation': 0.1,
							'precipitation_intensity': 0.1,
							'precipitation_transitional': false
						}
					},
					{
						'name': 'Wet',
						'custom_name': true,
						'weather': {
							'temp_low': 75,
							'temp_high': 115,
							'temp_transitional': false,
							'precipitation': 0.85,
							'precipitation_intensity': 0.2,
							'precipitation_transitional': false
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
							'temp_transitional': false,
							'precipitation': 0.2,
							'precipitation_intensity': 0.3,
							'precipitation_transitional': false
						}
					},
					{
						'name': 'Summer',
						'custom_name': true,
						'weather': {
							'temp_low': 70,
							'temp_high': 115,
							'temp_transitional': false,
							'precipitation': 0.05,
							'precipitation_intensity': 0.3,
							'precipitation_transitional': false
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
							'temp_transitional': false,
							'precipitation': 0.4,
							'precipitation_intensity': 0.5,
							'precipitation_transitional': false
						}
					},
					{
						'name': 'Summer',
						'custom_name': true,
						'weather': {
							'temp_low': 50,
							'temp_high': 85,
							'temp_transitional': false,
							'precipitation': 0.4,
							'precipitation_intensity': 0.6,
							'precipitation_transitional': false
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
							'temp_transitional': false,
							'precipitation': 0.3,
							'precipitation_intensity': 0.6,
							'precipitation_transitional': false
						}
					},
					{
						'name': 'Summer',
						'custom_name': true,
						'weather': {
							'temp_low': 60,
							'temp_high': 95,
							'temp_transitional': false,
							'precipitation': 0.1,
							'precipitation_intensity': 0.2,
							'precipitation_transitional': false
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
							'temp_transitional': false,
							'precipitation': 0.15,
							'precipitation_intensity': 0.2,
							'precipitation_transitional': false
						}
					},
					{
						'name': 'Summer',
						'custom_name': true,
						'weather': {
							'temp_low': 70,
							'temp_high': 110,
							'temp_transitional': false,
							'precipitation': 0.45,
							'precipitation_intensity': 0.6,
							'precipitation_transitional': false
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
							'temp_transitional': false,
							'precipitation': 0.35,
							'precipitation_intensity': 0.6,
							'precipitation_transitional': false
						}
					},
					{
						'name': 'Summer',
						'custom_name': true,
						'weather': {
							'temp_low': 60,
							'temp_high': 85,
							'temp_transitional': false,
							'precipitation': 0.35,
							'precipitation_intensity': 0.6,
							'precipitation_transitional': false
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
							'temp_transitional': false,
							'precipitation': 0.1,
							'precipitation_intensity': 0.1,
							'precipitation_transitional': false
						}
					},
					{
						'name': 'Summer',
						'custom_name': true,
						'weather': {
							'temp_low': 60,
							'temp_high': 85,
							'temp_transitional': false,
							'precipitation': 0.35,
							'precipitation_intensity': 0.75,
							'precipitation_transitional': false
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
							'temp_transitional': false,
							'precipitation': 0.1,
							'precipitation_intensity': 0.1,
							'precipitation_transitional': false
						}
					},
					{
						'name': 'Summer',
						'custom_name': true,
						'weather': {
							'temp_low': 35,
							'temp_high': 55,
							'temp_transitional': false,
							'precipitation': 0.1,
							'precipitation_intensity': 0.1,
							'precipitation_transitional': false
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
							'temp_transitional': false,
							'precipitation': 0.1,
							'precipitation_intensity': 0.1,
							'precipitation_transitional': false
						}
					},
					{
						'name': 'Summer',
						'custom_name': true,
						'weather': {
							'temp_low': 50,
							'temp_high': 70,
							'temp_transitional': false,
							'precipitation': 0.3,
							'precipitation_intensity': 0.1,
							'precipitation_transitional': false
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
							'temp_transitional': false,
							'precipitation': 0.1,
							'precipitation_intensity': 0.1,
							'precipitation_transitional': false
						}
					},
					{
						'name': 'Summer',
						'custom_name': true,
						'weather': {
							'temp_low': -22,
							'temp_high': -15,
							'temp_transitional': false,
							'precipitation': 0.1,
							'precipitation_intensity': 0.1,
							'precipitation_transitional': false
						}
					}
				]
			}
		},




		"4": {
			'Equatorial': {
				'name': 'Equatorial',
				'seasons': [
					{
						'name': 'Winter',
						'custom_name': true,
						'weather': {
							'temp_low': 57,
							'temp_high': 70,
							'temp_transitional': false,
							'precipitation': 0.2,
							'precipitation_intensity': 0.2,
							'precipitation_transitional': false
						}
					},
					{
						'name': 'Spring',
						'custom_name': true,
						'weather': {
							'temp_low': 56,
							'temp_high': 68,
							'temp_transitional': true,
							'precipitation': 0.475,
							'precipitation_intensity': 0.4,
							'precipitation_transitional': true
						}
					},
					{
						'name': 'Summer',
						'custom_name': true,
						'weather': {
							'temp_low': 55,
							'temp_high': 66,
							'temp_transitional': false,
							'precipitation': 0.7,
							'precipitation_intensity': 0.6,
							'precipitation_transitional': false
						}
					},
					{
						'name': 'Autumn',
						'custom_name': true,
						'weather': {
							'temp_low': 56,
							'temp_high': 68,
							'temp_transitional': true,
							'precipitation': 0.475,
							'precipitation_intensity': 0.4,
							'precipitation_transitional': true
						}
					}
				]
			},
			'Monsoon': {
				'name': 'Monsoon',
				'seasons': [
					{
						'name': 'Winter',
						'custom_name': true,
						'weather': {
							'temp_low': 70,
							'temp_high': 90,
							'temp_transitional': false,
							'precipitation': 0.1,
							'precipitation_intensity': 0.1,
							'precipitation_transitional': false
						}
					},
					{
						'name': 'Spring',
						'custom_name': true,
						'weather': {
							'temp_low': 70,
							'temp_high': 90,
							'temp_transitional': true,
							'precipitation': 0.2,
							'precipitation_intensity': 0.1,
							'precipitation_transitional': true
						}
					},
					{
						'name': 'Summer',
						'custom_name': true,
						'weather': {
							'temp_low': 70,
							'temp_high': 90,
							'temp_transitional': false,
							'precipitation': 0.9,
							'precipitation_intensity': 0.8,
							'precipitation_transitional': false
						}
					},
					{
						'name': 'Autumn',
						'custom_name': true,
						'weather': {
							'temp_low': 70,
							'temp_high': 90,
							'temp_transitional': true,
							'precipitation': 0.5,
							'precipitation_intensity': 0.3,
							'precipitation_transitional': true
						}
					}
				],
			},
			'Warm Desert': {
				'name': 'Warm Desert',
				'seasons': [
					{
						'name': 'Winter',
						'custom_name': true,
						'weather': {
							'temp_low': 55,
							'temp_high': 70,
							'temp_transitional': false,
							'precipitation': 0.05,
							'precipitation_intensity': 0.1,
							'precipitation_transitional': false
						}
					},
					{
						'name': 'Spring',
						'custom_name': true,
						'weather': {
							'temp_low': 60,
							'temp_high': 90,
							'temp_transitional': true,
							'precipitation': 0.05,
							'precipitation_intensity': 0.1,
							'precipitation_transitional': true
						}
					},
					{
						'name': 'Summer',
						'custom_name': true,
						'weather': {
							'temp_low': 65,
							'temp_high': 110,
							'temp_transitional': false,
							'precipitation': 0.05,
							'precipitation_intensity': 0.1,
							'precipitation_transitional': false
						}
					},
					{
						'name': 'Winter',
						'custom_name': true,
						'weather': {
							'temp_low': 60,
							'temp_high': 90,
							'temp_transitional': true,
							'precipitation': 0.05,
							'precipitation_intensity': 0.1,
							'precipitation_transitional': true
						}
					}
				]
			},
			'Cold Desert': {
				'name': 'Cold Desert',
				'seasons': [
					{
						'name': 'Winter',
						'custom_name': true,
						'weather': {
							'temp_low': 7,
							'temp_high': 25,
							'temp_transitional': false,
							'precipitation': 0.2,
							'precipitation_intensity': 0.1,
							'precipitation_transitional': false
						}
					},
					{
						'name': 'Spring',
						'custom_name': true,
						'weather': {
							'temp_low': 22,
							'temp_high': 51,
							'temp_transitional': true,
							'precipitation': 0.2,
							'precipitation_intensity': 0.1,
							'precipitation_transitional': true
						}
					},
					{
						'name': 'Summer',
						'custom_name': true,
						'weather': {
							'temp_low': 52,
							'temp_high': 77,
							'temp_transitional': false,
							'precipitation': 0.3,
							'precipitation_intensity': 0.15,
							'precipitation_transitional': false
						}
					},
					{
						'name': 'Autumn',
						'custom_name': true,
						'weather': {
							'temp_low': 22,
							'temp_high': 51,
							'temp_transitional': true,
							'precipitation': 0.2,
							'precipitation_intensity': 0.1,
							'precipitation_transitional': true
						}
					}
				]
			},
			'Tropical Savanna': {
				'name': 'Tropical Savanna',
				'seasons': [
					{
						'name': 'Winter',
						'custom_name': true,
						'weather': {
							'temp_low': 75,
							'temp_high': 115,
							'temp_transitional': false,
							'precipitation': 0.1,
							'precipitation_intensity': 0.1,
							'precipitation_transitional': false
						}
					},
					{
						'name': 'Autumn',
						'custom_name': true,
						'weather': {
							'temp_low': 75,
							'temp_high': 115,
							'temp_transitional': true,
							'precipitation': 0.42,
							'precipitation_intensity': 0.15,
							'precipitation_transitional': true
						}
					},
					{
						'name': 'Summer',
						'custom_name': true,
						'weather': {
							'temp_low': 75,
							'temp_high': 115,
							'temp_transitional': false,
							'precipitation': 0.85,
							'precipitation_intensity': 0.2,
							'precipitation_transitional': false
						}
					},
					{
						'name': 'Autumn',
						'custom_name': true,
						'weather': {
							'temp_low': 75,
							'temp_high': 115,
							'temp_transitional': true,
							'precipitation': 0.42,
							'precipitation_intensity': 0.15,
							'precipitation_transitional': true
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
							'temp_transitional': false,
							'precipitation': 0.2,
							'precipitation_intensity': 0.3,
							'precipitation_transitional': false
						}
					},
					{
						'name': 'Spring',
						'custom_name': true,
						'weather': {
							'temp_low': 52,
							'temp_high': 82,
							'temp_transitional': true,
							'precipitation': 0.13,
							'precipitation_intensity': 0.3,
							'precipitation_transitional': true
						}
					},
					{
						'name': 'Summer',
						'custom_name': true,
						'weather': {
							'temp_low': 70,
							'temp_high': 115,
							'temp_transitional': false,
							'precipitation': 0.05,
							'precipitation_intensity': 0.3,
							'precipitation_transitional': false
						}
					},
					{
						'name': 'Autumn',
						'custom_name': true,
						'weather': {
							'temp_low': 52,
							'temp_high': 82,
							'temp_transitional': true,
							'precipitation': 0.13,
							'precipitation_intensity': 0.3,
							'precipitation_transitional': true
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
							'temp_transitional': false,
							'precipitation': 0.4,
							'precipitation_intensity': 0.5,
							'precipitation_transitional': false
						}
					},
					{
						'name': 'Spring',
						'custom_name': true,
						'weather': {
							'temp_low': 30,
							'temp_high': 57,
							'temp_transitional': true,
							'precipitation': 0.4,
							'precipitation_intensity': 0.55,
							'precipitation_transitional': true
						}
					},
					{
						'name': 'Summer',
						'custom_name': true,
						'weather': {
							'temp_low': 50,
							'temp_high': 85,
							'temp_transitional': false,
							'precipitation': 0.4,
							'precipitation_intensity': 0.6,
							'precipitation_transitional': false
						}
					},
					{
						'name': 'Autumn',
						'custom_name': true,
						'weather': {
							'temp_low': 30,
							'temp_high': 57,
							'temp_transitional': true,
							'precipitation': 0.4,
							'precipitation_intensity': 0.55,
							'precipitation_transitional': true
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
							'temp_transitional': false,
							'precipitation': 0.3,
							'precipitation_intensity': 0.6,
							'precipitation_transitional': false
						}
					},
					{
						'name': 'Spring',
						'custom_name': true,
						'weather': {
							'temp_low': 40,
							'temp_high': 77,
							'temp_transitional': true,
							'precipitation': 0.2,
							'precipitation_intensity': 0.4,
							'precipitation_transitional': true
						}
					},
					{
						'name': 'Summer',
						'custom_name': true,
						'weather': {
							'temp_low': 60,
							'temp_high': 95,
							'temp_transitional': false,
							'precipitation': 0.1,
							'precipitation_intensity': 0.2,
							'precipitation_transitional': false
						}
					},
					{
						'name': 'Autumn',
						'custom_name': true,
						'weather': {
							'temp_low': 40,
							'temp_high': 77,
							'temp_transitional': true,
							'precipitation': 0.2,
							'precipitation_intensity': 0.4,
							'precipitation_transitional': true
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
							'temp_transitional': false,
							'precipitation': 0.15,
							'precipitation_intensity': 0.2,
							'precipitation_transitional': false
						}
					},
					{
						'name': 'Spring',
						'custom_name': true,
						'weather': {
							'temp_low': 51,
							'temp_high': 80,
							'temp_transitional': true,
							'precipitation': 0.30,
							'precipitation_intensity': 0.4,
							'precipitation_transitional': true
						}
					},
					{
						'name': 'Summer',
						'custom_name': true,
						'weather': {
							'temp_low': 70,
							'temp_high': 110,
							'temp_transitional': false,
							'precipitation': 0.45,
							'precipitation_intensity': 0.6,
							'precipitation_transitional': false
						}
					},
					{
						'name': 'Autumn',
						'custom_name': true,
						'weather': {
							'temp_low': 51,
							'temp_high': 80,
							'temp_transitional': true,
							'precipitation': 0.30,
							'precipitation_intensity': 0.4,
							'precipitation_transitional': true
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
							'temp_transitional': false,
							'precipitation': 0.35,
							'precipitation_intensity': 0.6,
							'precipitation_transitional': false
						}
					},
					{
						'name': 'Spring',
						'custom_name': true,
						'weather': {
							'temp_low': 32,
							'temp_high': 62,
							'temp_transitional': true,
							'precipitation': 0.35,
							'precipitation_intensity': 0.6,
							'precipitation_transitional': true
						}
					},
					{
						'name': 'Summer',
						'custom_name': true,
						'weather': {
							'temp_low': 60,
							'temp_high': 85,
							'temp_transitional': false,
							'precipitation': 0.35,
							'precipitation_intensity': 0.6,
							'precipitation_transitional': false
						}
					},
					{
						'name': 'Autumn',
						'custom_name': true,
						'weather': {
							'temp_low': 32,
							'temp_high': 62,
							'temp_transitional': true,
							'precipitation': 0.35,
							'precipitation_intensity': 0.6,
							'precipitation_transitional': true
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
							'temp_transitional': false,
							'precipitation': 0.1,
							'precipitation_intensity': 0.1,
							'precipitation_transitional': false
						}
					},
					{
						'name': 'Spring',
						'custom_name': true,
						'weather': {
							'temp_low': 32,
							'temp_high': 62,
							'temp_transitional': true,
							'precipitation': 0.22,
							'precipitation_intensity': 0.42,
							'precipitation_transitional': true
						}
					},
					{
						'name': 'Summer',
						'custom_name': true,
						'weather': {
							'temp_low': 60,
							'temp_high': 85,
							'temp_transitional': false,
							'precipitation': 0.35,
							'precipitation_intensity': 0.75,
							'precipitation_transitional': false
						}
					},
					{
						'name': 'Autumn',
						'custom_name': true,
						'weather': {
							'temp_low': 32,
							'temp_high': 62,
							'temp_transitional': true,
							'precipitation': 0.22,
							'precipitation_intensity': 0.42,
							'precipitation_transitional': true
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
							'temp_transitional': false,
							'precipitation': 0.1,
							'precipitation_intensity': 0.1,
							'precipitation_transitional': false
						}
					},
					{
						'name': 'Spring',
						'custom_name': true,
						'weather': {
							'temp_low': 0,
							'temp_high': 20,
							'temp_transitional': true,
							'precipitation': 0.1,
							'precipitation_intensity': 0.1,
							'precipitation_transitional': true
						}
					},
					{
						'name': 'Summer',
						'custom_name': true,
						'weather': {
							'temp_low': 35,
							'temp_high': 55,
							'temp_transitional': false,
							'precipitation': 0.1,
							'precipitation_intensity': 0.1,
							'precipitation_transitional': false
						}
					},
					{
						'name': 'Autumn',
						'custom_name': true,
						'weather': {
							'temp_low': 0,
							'temp_high': 20,
							'temp_transitional': true,
							'precipitation': 0.1,
							'precipitation_intensity': 0.1,
							'precipitation_transitional': true
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
							'temp_transitional': false,
							'precipitation': 0.1,
							'precipitation_intensity': 0.1,
							'precipitation_transitional': false
						}
					},
					{
						'name': 'Spring',
						'custom_name': true,
						'weather': {
							'temp_low': 15,
							'temp_high': 30,
							'temp_transitional': true,
							'precipitation': 0.2,
							'precipitation_intensity': 0.1,
							'precipitation_transitional': true
						}
					},
					{
						'name': 'Summer',
						'custom_name': true,
						'weather': {
							'temp_low': 50,
							'temp_high': 70,
							'temp_transitional': false,
							'precipitation': 0.3,
							'precipitation_intensity': 0.1,
							'precipitation_transitional': false
						}
					},
					{
						'name': 'Autumn',
						'custom_name': true,
						'weather': {
							'temp_low': 15,
							'temp_high': 30,
							'temp_transitional': true,
							'precipitation': 0.2,
							'precipitation_intensity': 0.1,
							'precipitation_transitional': true
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
							'temp_transitional': false,
							'precipitation': 0.1,
							'precipitation_intensity': 0.1,
							'precipitation_transitional': false
						}
					},
					{
						'name': 'Spring',
						'custom_name': true,
						'weather': {
							'temp_low': -51,
							'temp_high': -40,
							'temp_transitional': true,
							'precipitation': 0.1,
							'precipitation_intensity': 0.1,
							'precipitation_transitional': true
						}
					},
					{
						'name': 'Summer',
						'custom_name': true,
						'weather': {
							'temp_low': -22,
							'temp_high': -15,
							'temp_transitional': false,
							'precipitation': 0.1,
							'precipitation_intensity': 0.1,
							'precipitation_transitional': false
						}
					},
					{
						'name': 'Autumn',
						'custom_name': true,
						'weather': {
							'temp_low': -51,
							'temp_high': -40,
							'temp_transitional': true,
							'precipitation': 0.1,
							'precipitation_intensity': 0.1,
							'precipitation_transitional': true
						}
					}
				]
			}
		}
	}
};
