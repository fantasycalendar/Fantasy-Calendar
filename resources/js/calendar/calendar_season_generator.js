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

		if(this.dynamic_data.custom_location === false && (static_data.seasons.data.length == 2 || static_data.seasons.data.length == 4)){

			this.current_location = this.presets[static_data.seasons.data.length][this.dynamic_data.location] ? this.presets[static_data.seasons.data.length][this.dynamic_data.location] : this.presets[static_data.seasons.data.length]['Equatorial'];

			for(var i = 0; i < this.static_data.seasons.data.length; i++){

				this.current_location.seasons[i].time = {}
				this.current_location.seasons[i].time.sunset = clone(this.static_data.seasons.data[i].time.sunset);
				this.current_location.seasons[i].time.sunrise = clone(this.static_data.seasons.data[i].time.sunrise);

			}

			this.current_location.settings = clone(this.preset_curves);

		}else if(this.dynamic_data.custom_location === true){

			this.current_location = clone(this.static_data.seasons.locations[this.dynamic_data.location]);

		}else{

			this.current_location = {
				"seasons": [],
				"settings": clone(this.preset_curves)
			};

			for(var i = 0; i < this.static_data.seasons.data.length; i++){

				this.current_location.seasons.push({
					"time":{},
					"weather":{
						"temp_low": 0,
						"temp_high": 0,
						"precipitation": 0,
						"precipitation_intensity": 0
					}
				});

				this.current_location.seasons[i].time.sunset = clone(this.static_data.seasons.data[i].time.sunset);
				this.current_location.seasons[i].time.sunrise = clone(this.static_data.seasons.data[i].time.sunrise);

			}

		}

		if(this.static_data.clock.enabled){

			this.shortest_day_time = Infinity;
			this.longest_day_time = 0;

			for(var season_index in this.current_location.seasons){

				var season = this.current_location.seasons[season_index];

				var sunrise = season.time.sunrise.hour+season.time.sunrise.minute/this.static_data.clock.minutes;
				var sunset = season.time.sunset.hour+season.time.sunset.minute/this.static_data.clock.minutes;

				var length = sunset-sunrise;

				if(this.shortest_day_time > length){
					this.shortest_day_time = length;
				}

				if(this.longest_day_time < length){
					this.longest_day_time = length;
				}

			}

			this.middle_day_time = mid(this.shortest_day_time, this.longest_day_time);

			this.high_appeared = false;
			this.low_appeared = false;
			this.rising_appeared = false;
			this.falling_appeared = false;

			this.all_appear = true;

			this.solstices_appear = true;

			if(this.shortest_day_time == this.longest_day_time){
				this.solstices_appear = false;
			}

		}


		/* -------------------------------------------------------------------------------------------------------------*/

		for(var season_index in this.seasons){

			this.seasons[season_index].length = this.seasons[season_index].transition_length+this.seasons[season_index].duration;

			this.seasons[season_index].start = this.season_length;
			this.season_length += this.seasons[season_index].transition_length;
			this.seasons[season_index].end = this.season_length;
			this.season_length += this.seasons[season_index].duration;

		}


		/* -------------------------------------------------------------------------------------------------------------*/

		var season_epoch = epoch - this.settings.season_offset;

		this.season.prev_day = -Infinity;
		this.season.day = Math.floor(fract(season_epoch/this.season_length)*this.season_length);

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

		this.season.rising = null;

		/* -------------------------------------------------------------------------------------------------------------*/
	
		var weather_epoch = epoch - this.settings.season_offset - this.settings.weather_offset;

		this.weather.prev_day = -Infinity;
		this.weather.day = Math.floor(fract(weather_epoch/this.season_length)*this.season_length)

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

	get_season_data: function(epoch){

		if(!this.process_seasons) return;

		var season_epoch = epoch - this.settings.season_offset;

		this.season.day = fract(season_epoch/this.season_length)*this.season_length;

		if(Math.floor(this.season.day) > this.season.total_day || Math.floor(this.season.day) < this.season.prev_day){
			
			this.season.current_index = (this.season.current_index+1)%this.seasons.length;
			this.season.next_index = (this.season.current_index+1)%this.seasons.length;

			this.season.current = this.seasons[this.season.current_index];
			this.season.next = this.seasons[this.season.next_index];
			
			this.season.total_day += this.seasons[this.season.current_index].length;
			if(this.season.total_day > this.season_length){
				this.season.total_day = this.seasons[this.season.current_index].length;
			}

		}

		this.season.prev_day = Math.floor(this.season.day);

        this.season.season_day = this.seasons[this.season.current_index].length+this.season.day-this.season.total_day+1;

        if(Math.ceil(this.season.season_day) > this.seasons[this.season.current_index].duration){

			this.season.perc = clamp((this.season.season_day-this.seasons[this.season.current_index].duration)/this.seasons[this.season.current_index].transition_length, 0.0, 1.0);

		}else{

			this.season.perc = 0.0;

		}

		this.season.round_perc = Math.floor(this.season.perc*100)/100;

        this.season.season_day = Math.ceil(this.season.season_day)

		/* -------------------------------------------------------------------------------------------------------------*/

		var time = {
			sunrise: false,
			sunset: false
		}

		var rising_equinox = false;
		var falling_equinox = false;
		var high_solstice = false;
		var low_solstice = false;

		if(this.static_data.clock.enabled){

			var prev_index = this.season.current_index-1;

			if(prev_index < 0) prev_index += this.current_location.seasons.length;

			var prev_sunrise = this.current_location.seasons[prev_index].time.sunrise;
			var prev_sunset = this.current_location.seasons[prev_index].time.sunset;

			var curr_sunrise = this.current_location.seasons[this.season.current_index].time.sunrise;
			var curr_sunset = this.current_location.seasons[this.season.current_index].time.sunset;

			var next_sunrise = this.current_location.seasons[this.season.next_index].time.sunrise;
			var next_sunset = this.current_location.seasons[this.season.next_index].time.sunset;

			var sunrise_exact_minute = Math.round(lerp(curr_sunrise.minute, next_sunrise.minute, this.season.perc));
			var sunrise_exact_hour = lerp(curr_sunrise.hour, next_sunrise.hour, this.season.perc);
			var sunrise_exact = sunrise_exact_hour+sunrise_exact_minute/this.static_data.clock.minutes;

			var sunset_exact_minute = Math.round(lerp(curr_sunset.minute, next_sunset.minute, this.season.perc));
			var sunset_exact_hour = lerp(curr_sunset.hour, next_sunset.hour, this.season.perc);
			var sunset_exact = sunset_exact_hour+sunset_exact_minute/this.static_data.clock.minutes;

			var sunrise_minute = Math.round(lerp(curr_sunrise.minute, next_sunrise.minute, this.season.round_perc));
			var sunrise_hour = lerp(curr_sunrise.hour, next_sunrise.hour, this.season.round_perc);
			var sunrise = sunrise_hour+sunrise_minute/this.static_data.clock.minutes;

			var sunset_minute = Math.round(lerp(curr_sunset.minute, next_sunset.minute, this.season.round_perc));
			var sunset_hour = lerp(curr_sunset.hour, next_sunset.hour, this.season.round_perc);
			var sunset = sunset_hour+sunset_minute/this.static_data.clock.minutes;

			var sunrise_m = (Math.round(fract(sunrise)*this.static_data.clock.minutes)).toString().length < 2 ? "0"+(Math.round(fract(sunrise)*this.static_data.clock.minutes)).toString() : (Math.round(fract(sunrise)*this.static_data.clock.minutes));
			var sunset_m = (Math.round(fract(sunset)*this.static_data.clock.minutes)).toString().length < 2 ? "0"+(Math.round(fract(sunset)*this.static_data.clock.minutes)).toString() : (Math.round(fract(sunset)*this.static_data.clock.minutes));

			var sunrise_s = Math.floor(sunrise)+":"+sunrise_m;
			var sunset_s = Math.floor(sunset)+":"+sunset_m;

			if(this.solstices_appear){

				if(this.all_appear){

					var temp_sunrise = prev_sunrise.hour+prev_sunrise.minute/this.static_data.clock.minutes;
					var temp_sunset = prev_sunset.hour+prev_sunset.minute/this.static_data.clock.minutes;

					if(this.shortest_day_time == (sunset-sunrise)){
						this.falling_appeared = true;
					}else if(this.longest_day_time == (sunset-sunrise)){
						this.rising_appeared = true;
					}

					if(this.middle_day_time == (sunset-sunrise)){
						if((temp_sunset-temp_sunrise) < (sunset-sunrise)){
							this.low_appeared = true;
						}else if((temp_sunset-temp_sunrise) > (sunset-sunrise)){
							this.high_appeared = true;
						}
					}

					this.all_appear = !(this.low_appeared || this.rising_appeared || this.high_appeared || this.falling_appeared)
				}

				if(!this.all_appear && this.falling_appeared && !this.low_appeared){
					low_solstice = this.shortest_day_time == (sunset-sunrise);
					if(low_solstice){
						this.falling_appeared = false;
						this.low_appeared = true;
					}
				}

				if(!this.all_appear && this.low_appeared && !this.rising_appeared){
					rising_equinox = this.middle_day_time == (sunset-sunrise);
					if(rising_equinox){
						this.low_appeared = false;
						this.rising_appeared = true;
					}
				}

				if(!this.all_appear && this.rising_appeared && !this.high_appeared){
					high_solstice = this.longest_day_time == (sunset-sunrise);
					if(high_solstice){
						this.rising_appeared = false;
						this.high_appeared = true;
					}
				}

				if(!this.all_appear && this.high_appeared && !this.falling_appeared){
					falling_equinox = this.middle_day_time == (sunset-sunrise);
					if(falling_equinox){
						this.high_appeared = false;
						this.falling_appeared = true;
					}
				}
			}


			time.sunrise = {
				data: sunrise_exact,
				string: sunrise_s
			}
			
			time.sunset = {
				data: sunset_exact,
				string: sunset_s
			}

		}

		var data = {
			season_name: this.seasons[this.season.current_index].name,
			season_index: this.season.current_index,
			season_perc: this.season.round_perc+1,
			season_day: this.season.season_day,
			time: time,
			rising_equinox: rising_equinox,
			falling_equinox: falling_equinox,
			high_solstice: high_solstice,
			low_solstice: low_solstice
		}

		return data;


	},

	get_weather_data: function(epoch){

		if(!this.process_weather) return;

		var weather_epoch = epoch - this.settings.season_offset - this.settings.weather_offset;

		this.weather.day = fract(weather_epoch/this.season_length)*this.season_length

		if(Math.floor(this.weather.day) > this.weather.total_day ||  Math.floor(this.weather.day) < this.weather.prev_day){
			
			this.weather.current_index = (this.weather.current_index+1)%this.seasons.length;
			this.weather.next_index = (this.weather.current_index+1)%this.seasons.length;

			this.weather.current = this.seasons[this.weather.current_index];
			this.weather.next = this.seasons[this.weather.next_index];
			
			this.weather.total_day += this.seasons[this.weather.current_index].length;
			if(this.weather.total_day > this.season_length){
				this.weather.total_day = this.seasons[this.weather.current_index].length;
			}

		}

		this.weather.prev_day = Math.floor(this.weather.day);

        this.weather.season_day = this.seasons[this.weather.current_index].length+this.weather.day-this.weather.total_day+1;

        if(Math.ceil(this.weather.season_day) > this.seasons[this.weather.current_index].duration){

			this.weather.perc = clamp((this.weather.season_day-this.seasons[this.weather.current_index].duration)/this.seasons[this.weather.current_index].transition_length, 0.0, 1.0);

		}else{

			this.weather.perc = 0.0;

		}

        this.weather.season_day = Math.floor(this.weather.season_day)

		/* -------------------------------------------------------------------------------------------------------------*/


		var curr_season_data = this.current_location.seasons[this.weather.current_index];
		var next_season_data = this.current_location.seasons[this.weather.next_index];

		var low = lerp(curr_season_data.weather.temp_low, next_season_data.weather.temp_low, this.weather.perc);
		var high = lerp(curr_season_data.weather.temp_high, next_season_data.weather.temp_high, this.weather.perc);
		var middle = mid(low, high);

		var range_low = mid(low, middle);
		var large = this.random.noise(epoch, 1.0, this.current_location.settings.large_noise_frequency, this.current_location.settings.large_noise_amplitude)*0.5;
		var medium = this.random.noise(epoch+this.season_length, 1.0, this.current_location.settings.medium_noise_frequency, this.current_location.settings.medium_noise_amplitude)*0.8;
		var small = this.random.noise(epoch+this.season_length*2, 1.0, this.current_location.settings.small_noise_frequency, this.current_location.settings.small_noise_amplitude);
		range_low = range_low-large+medium-small;
	
		var range_high = mid(middle, high);
		var large = this.random.noise(epoch+this.season_length*1.5, 1.0, this.current_location.settings.large_noise_frequency, this.current_location.settings.large_noise_amplitude)*0.5;
		var medium = this.random.noise(epoch+this.season_length*2.5, 1.0, this.current_location.settings.medium_noise_frequency, this.current_location.settings.medium_noise_amplitude)*0.8;
		var small = this.random.noise(epoch+this.season_length*3.5, 1.0, this.current_location.settings.small_noise_frequency, this.current_location.settings.small_noise_amplitude);
		range_high = range_high-large+medium-small;

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

		var precipitation_chance = lerp(curr_season_data.weather.precipitation, next_season_data.weather.precipitation, this.weather.perc);
		var precipitation_intensity = lerp(curr_season_data.weather.precipitation_intensity, next_season_data.weather.precipitation_intensity, this.weather.perc);


		var precipitation_chance = lerp(curr_season_data.weather.precipitation, next_season_data.weather.precipitation, this.weather.perc);
		var precipitation_intensity = lerp(curr_season_data.weather.precipitation_intensity, next_season_data.weather.precipitation_intensity, this.weather.perc);

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
		"large_noise_amplitude": 10.0,

		"medium_noise_frequency": 0.3,
		"medium_noise_amplitude": 4.0,

		"small_noise_frequency": 0.8,
		"small_noise_amplitude": 5.0

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
		},

		"4": {
			"Equatorial":{
				"name":"Equatorial",
				"seasons":[
					{
						"name":"Winter",
						"custom_name":true,
						"weather":{
							"temp_low":57,
							"temp_high":70,
							"precipitation":0.2,
							"precipitation_intensity":0.2
						}
					},
					{
						"name":"Spring",
						"custom_name":true,
						"weather":{
							"temp_low":56.0,
							"temp_high":68.0,
							"precipitation":0.45,
							"precipitation_intensity":0.4
						}
					},
					{
						"name":"Summer",
						"custom_name":true,
						"weather":{
							"temp_low":55,
							"temp_high":66,
							"precipitation":0.7,
							"precipitation_intensity":0.6
						}
					},
					{
						"name":"Autumn",
						"custom_name":true,
						"weather":{
							"temp_low":56.0,
							"temp_high":68.0,
							"precipitation":0.45,
							"precipitation_intensity":0.4
						}
					}
				]
			},
			"Monsoon":{
				"name":"Monsoon",
				"seasons":[
					{
						"name":"Winter",
						"custom_name":true,
						"weather":{
							"temp_low":70,
							"temp_high":90,
							"precipitation":0.1,
							"precipitation_intensity":0.1
						}
					},
					{
						"name":"Spring",
						"custom_name":true,
						"weather":{
							"temp_low":70.0,
							"temp_high":90.0,
							"precipitation":0.5,
							"precipitation_intensity":0.45
						}
					},
					{
						"name":"Summer",
						"custom_name":true,
						"weather":{
							"temp_low":70,
							"temp_high":90,
							"precipitation":0.9,
							"precipitation_intensity":0.8
						}
					},
					{
						"name":"Autumn",
						"custom_name":true,
						"weather":{
							"temp_low":70.0,
							"temp_high":90.0,
							"precipitation":0.5,
							"precipitation_intensity":0.45
						}
					}
				]
			},
			"Warm Desert":{
				"name":"Warm Desert",
				"seasons":[
					{
						"name":"Winter",
						"custom_name":true,
						"weather":{
							"temp_low":55,
							"temp_high":70,
							"precipitation":0.05,
							"precipitation_intensity":0.1
						}
					},
					{
						"name":"Spring",
						"custom_name":true,
						"weather":{
							"temp_low":60.0,
							"temp_high":90.0,
							"precipitation":0.05,
							"precipitation_intensity":0.1
						}
					},
					{
						"name":"Summer",
						"custom_name":true,
						"weather":{
							"temp_low":65,
							"temp_high":110,
							"precipitation":0.05,
							"precipitation_intensity":0.1
						}
					},
					{
						"name":"Winter",
						"custom_name":true,
						"weather":{
							"temp_low":60.0,
							"temp_high":90.0,
							"precipitation":0.05,
							"precipitation_intensity":0.1
						}
					}
				]
			},
			"Cold Desert":{
				"name":"Cold Desert",
				"seasons":[
					{
						"name":"Winter",
						"custom_name":true,
						"weather":{
							"temp_low":7,
							"temp_high":25,
							"precipitation":0.2,
							"precipitation_intensity":0.1
						}
					},
					{
						"name":"Spring",
						"custom_name":true,
						"weather":{
							"temp_low":29.5,
							"temp_high":51.0,
							"precipitation":0.25,
							"precipitation_intensity":0.125
						}
					},
					{
						"name":"Summer",
						"custom_name":true,
						"weather":{
							"temp_low":52,
							"temp_high":77,
							"precipitation":0.3,
							"precipitation_intensity":0.15
						}
					},
					{
						"name":"Autumn",
						"custom_name":true,
						"weather":{
							"temp_low":29.5,
							"temp_high":51.0,
							"precipitation":0.25,
							"precipitation_intensity":0.125
						}
					}
				]
			},
			"Tropical Savanna":{
				"name":"Tropical Savanna",
				"seasons":[
					{
						"name":"Winter",
						"custom_name":true,
						"weather":{
							"temp_low":75,
							"temp_high":115,
							"precipitation":0.1,
							"precipitation_intensity":0.1
						}
					},
					{
						"name":"Autumn",
						"custom_name":true,
						"weather":{
							"temp_low":75.0,
							"temp_high":115.0,
							"precipitation":0.475,
							"precipitation_intensity":0.15
						}
					},
					{
						"name":"Summer",
						"custom_name":true,
						"weather":{
							"temp_low":75,
							"temp_high":115,
							"precipitation":0.85,
							"precipitation_intensity":0.2
						}
					},
					{
						"name":"Autumn",
						"custom_name":true,
						"weather":{
							"temp_low":75.0,
							"temp_high":115.0,
							"precipitation":0.475,
							"precipitation_intensity":0.15
						}
					}
				]
			},
			"Steppes":{
				"name":"Steppes",
				"seasons":[
					{
						"name":"Winter",
						"custom_name":true,
						"weather":{
							"temp_low":35,
							"temp_high":50,
							"precipitation":0.2,
							"precipitation_intensity":0.3
						}
					},
					{
						"name":"Spring",
						"custom_name":true,
						"weather":{
							"temp_low":52.5,
							"temp_high":82.5,
							"precipitation":0.125,
							"precipitation_intensity":0.3
						}
					},
					{
						"name":"Summer",
						"custom_name":true,
						"weather":{
							"temp_low":70,
							"temp_high":115,
							"precipitation":0.05,
							"precipitation_intensity":0.3
						}
					},
					{
						"name":"Autumn",
						"custom_name":true,
						"weather":{
							"temp_low":52.5,
							"temp_high":82.5,
							"precipitation":0.125,
							"precipitation_intensity":0.3
						}
					}
				]
			},
			"Warm and Rainy":{
				"name":"Warm and Rainy",
				"seasons":[
					{
						"name":"Winter",
						"custom_name":true,
						"weather":{
							"temp_low":10,
							"temp_high":50,
							"precipitation":0.4,
							"precipitation_intensity":0.5
						}
					},
					{
						"name":"Spring",
						"custom_name":true,
						"weather":{
							"temp_low":30.0,
							"temp_high":67.5,
							"precipitation":0.4,
							"precipitation_intensity":0.55
						}
					},
					{
						"name":"Summer",
						"custom_name":true,
						"weather":{
							"temp_low":50,
							"temp_high":85,
							"precipitation":0.4,
							"precipitation_intensity":0.6
						}
					},
					{
						"name":"Autumn",
						"custom_name":true,
						"weather":{
							"temp_low":30.0,
							"temp_high":67.5,
							"precipitation":0.4,
							"precipitation_intensity":0.55
						}
					}
				]
			},
			"Warm with Dry Summer":{
				"name":"Warm with Dry Summer",
				"seasons":[
					{
						"name":"Winter",
						"custom_name":true,
						"weather":{
							"temp_low":10,
							"temp_high":60,
							"precipitation":0.3,
							"precipitation_intensity":0.6
						}
					},
					{
						"name":"Spring",
						"custom_name":true,
						"weather":{
							"temp_low":35.0,
							"temp_high":77.5,
							"precipitation":0.2,
							"precipitation_intensity":0.4
						}
					},
					{
						"name":"Summer",
						"custom_name":true,
						"weather":{
							"temp_low":60,
							"temp_high":95,
							"precipitation":0.1,
							"precipitation_intensity":0.2
						}
					},
					{
						"name":"Autumn",
						"custom_name":true,
						"weather":{
							"temp_low":35.0,
							"temp_high":77.5,
							"precipitation":0.2,
							"precipitation_intensity":0.4
						}
					}
				]
			},
			"Warm with Dry Winter":{
				"name":"Warm with Dry Winter",
				"seasons":[
					{
						"name":"Winter",
						"custom_name":true,
						"weather":{
							"temp_low":32,
							"temp_high":50,
							"precipitation":0.15,
							"precipitation_intensity":0.2
						}
					},
					{
						"name":"Spring",
						"custom_name":true,
						"weather":{
							"temp_low":51.0,
							"temp_high":80.0,
							"precipitation":0.3,
							"precipitation_intensity":0.4
						}
					},
					{
						"name":"Summer",
						"custom_name":true,
						"weather":{
							"temp_low":70,
							"temp_high":110,
							"precipitation":0.45,
							"precipitation_intensity":0.6
						}
					},
					{
						"name":"Autumn",
						"custom_name":true,
						"weather":{
							"temp_low":51.0,
							"temp_high":80.0,
							"precipitation":0.3,
							"precipitation_intensity":0.4
						}
					}
				]
			},
			"Cool and Rainy":{
				"name":"Cool and Rainy",
				"seasons":[
					{
						"name":"Winter",
						"custom_name":true,
						"weather":{
							"temp_low":5,
							"temp_high":40,
							"precipitation":0.35,
							"precipitation_intensity":0.6
						}
					},
					{
						"name":"Spring",
						"custom_name":true,
						"weather":{
							"temp_low":32.5,
							"temp_high":62.5,
							"precipitation":0.35,
							"precipitation_intensity":0.6
						}
					},
					{
						"name":"Summer",
						"custom_name":true,
						"weather":{
							"temp_low":60,
							"temp_high":85,
							"precipitation":0.35,
							"precipitation_intensity":0.6
						}
					},
					{
						"name":"Autumn",
						"custom_name":true,
						"weather":{
							"temp_low":32.5,
							"temp_high":62.5,
							"precipitation":0.35,
							"precipitation_intensity":0.6
						}
					}
				]
			},
			"Cool with Dry Winter":{
				"name":"Cool with Dry Winter",
				"seasons":[
					{
						"name":"Winter",
						"custom_name":true,
						"weather":{
							"temp_low":5,
							"temp_high":40,
							"precipitation":0.1,
							"precipitation_intensity":0.1
						}
					},
					{
						"name":"Spring",
						"custom_name":true,
						"weather":{
							"temp_low":32.5,
							"temp_high":62.5,
							"precipitation":0.225,
							"precipitation_intensity":0.425
						}
					},
					{
						"name":"Summer",
						"custom_name":true,
						"weather":{
							"temp_low":60,
							"temp_high":85,
							"precipitation":0.35,
							"precipitation_intensity":0.75
						}
					},
					{
						"name":"Autumn",
						"custom_name":true,
						"weather":{
							"temp_low":32.5,
							"temp_high":62.5,
							"precipitation":0.225,
							"precipitation_intensity":0.425
						}
					}
				]
			},
			"Tundra":{
				"name":"Tundra",
				"seasons":[
					{
						"name":"Winter",
						"custom_name":true,
						"weather":{
							"temp_low":-35,
							"temp_high":-15,
							"precipitation":0.1,
							"precipitation_intensity":0.1
						}
					},
					{
						"name":"Spring",
						"custom_name":true,
						"weather":{
							"temp_low":0.0,
							"temp_high":20.0,
							"precipitation":0.1,
							"precipitation_intensity":0.1
						}
					},
					{
						"name":"Summer",
						"custom_name":true,
						"weather":{
							"temp_low":35,
							"temp_high":55,
							"precipitation":0.1,
							"precipitation_intensity":0.1
						}
					},
					{
						"name":"Autumn",
						"custom_name":true,
						"weather":{
							"temp_low":0.0,
							"temp_high":20.0,
							"precipitation":0.1,
							"precipitation_intensity":0.1
						}
					}
				]
			},
			"Polar: Arctic":{
				"name":"Arctic",
				"seasons":[
					{
						"name":"Winter",
						"custom_name":true,
						"weather":{
							"temp_low":-20,
							"temp_high":-10,
							"precipitation":0.1,
							"precipitation_intensity":0.1
						}
					},
					{
						"name":"Spring",
						"custom_name":true,
						"weather":{
							"temp_low":15.0,
							"temp_high":30.0,
							"precipitation":0.2,
							"precipitation_intensity":0.1
						}
					},
					{
						"name":"Summer",
						"custom_name":true,
						"weather":{
							"temp_low":50,
							"temp_high":70,
							"precipitation":0.3,
							"precipitation_intensity":0.1
						}
					},
					{
						"name":"Autumn",
						"custom_name":true,
						"weather":{
							"temp_low":15.0,
							"temp_high":30.0,
							"precipitation":0.2,
							"precipitation_intensity":0.1
						}
					}
				]
			},
			"Polar: Antarctic":{
				"name":"Antarctic",
				"seasons":[
					{
						"name":"Winter",
						"custom_name":true,
						"weather":{
							"temp_low":-81,
							"temp_high":-65,
							"precipitation":0.1,
							"precipitation_intensity":0.1
						}
					},
					{
						"name":"Spring",
						"custom_name":true,
						"weather":{
							"temp_low":-51.5,
							"temp_high":-40.0,
							"precipitation":0.1,
							"precipitation_intensity":0.1
						}
					},
					{
						"name":"Summer",
						"custom_name":true,
						"weather":{
							"temp_low":-22,
							"temp_high":-15,
							"precipitation":0.1,
							"precipitation_intensity":0.1
						}
					},
					{
						"name":"Autumn",
						"custom_name":true,
						"weather":{
							"temp_low":-51.5,
							"temp_high":-40.0,
							"precipitation":0.1,
							"precipitation_intensity":0.1
						}
					}
				]
			}
		}
	}
};
