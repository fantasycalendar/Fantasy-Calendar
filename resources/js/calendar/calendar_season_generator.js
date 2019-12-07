class Climate{

	constructor(
		epoch_data,
		static_data,
		dynamic_data,
		start_epoch,
		end_epoch
	){

		this.epoch_data = epoch_data;
		this.dynamic_data = dynamic_data;
		this.static_data = static_data;
		this.start_epoch = start_epoch;
		this.end_epoch = end_epoch;

		this.settings = this.static_data.seasons.global_settings;
		this.clock = this.static_data.clock;
		this.seasons = this.static_data.seasons.data;

		this.season = {}
		this.weather = {}

		this.wind_direction = false;

		this.random = new random(this.static_data.seasons.global_settings.seed);

	}

	get process_seasons(){

		if(this.static_data.year_data.timespans.length == 0
		   ||
		   this.static_data.year_data.global_week.length == 0
		   ||
		   this.dynamic_data.location === ''
		   ||
		   this.static_data.seasons.data.length == 0
		){
			return false;
		}else{
			return true;
		}

	}

	get process_weather(){

		return this.process_seasons && this.static_data.seasons.global_settings.enable_weather;

	}

	set_up_location_seasons(){

		if(this.dynamic_data.custom_location === false && (this.static_data.seasons.data.length == 2 || this.static_data.seasons.data.length == 4)){

			this.current_location = preset_data.locations[this.static_data.seasons.data.length][this.dynamic_data.location] ? preset_data.locations[this.static_data.seasons.data.length][this.dynamic_data.location] : preset_data.locations[this.static_data.seasons.data.length]['Equatorial'];

			for(var i = 0; i < this.static_data.seasons.data.length; i++){

				this.current_location.seasons[i].time = {}
				this.current_location.seasons[i].time.sunset = this.static_data.seasons.data[i].time.sunset;
				this.current_location.seasons[i].time.sunrise = this.static_data.seasons.data[i].time.sunrise;

			}

			this.current_location.settings = preset_data.curves;

		}else if(this.dynamic_data.custom_location === true){

			this.current_location = this.static_data.seasons.locations[this.dynamic_data.location];

		}else{

			this.current_location = {
				"seasons": [],
				"settings": preset_data.curves
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

	}

	set_up_solstice_equinox(){

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

			this.middle_day_time = precisionRound(mid(this.shortest_day_time, this.longest_day_time),1);

			this.solstices_appear = true;

			if(this.shortest_day_time == this.longest_day_time){
				this.solstices_appear = false;
			}

		}

	}

	get season_length(){

		if(this._season_length === undefined){

			this._season_length = 0;

			for(var season_index in this.seasons){

				this.seasons[season_index].length = this.seasons[season_index].transition_length+this.seasons[season_index].duration;

				this.seasons[season_index].start = this._season_length;
				this._season_length += this.seasons[season_index].transition_length;
				this.seasons[season_index].end = this._season_length;
				this._season_length += this.seasons[season_index].duration;

			}

		}

		return this._season_length;

	}

	generate(){

		if(!this.process_seasons){
			return this.epoch_data;
		}

		this.set_up_location_seasons()
		this.set_up_solstice_equinox()

		/* -------------------------------------------------------------------------------------------------------------*/


		/* -------------------------------------------------------------------------------------------------------------*/

		var season_epoch = this.start_epoch - this.settings.season_offset;

		this.season.year = season_epoch/this.season_length;
		this.season.next_year = (season_epoch+1)/this.season_length;

		this.season.day = Math.floor(fract(this.season.year)*this.season_length);

		this.season.total_day = 0;

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
	
		var weather_epoch = this.start_epoch - this.settings.season_offset - this.settings.weather_offset;

		this.weather.year = weather_epoch/this.season_length;
		this.weather.next_year = (weather_epoch+1)/this.season_length;

		this.weather.day = Math.floor(fract(this.weather.year)*this.season_length)

		this.weather.total_day = 0;

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

		for(var epoch = this.start_epoch; epoch < this.end_epoch; epoch++){

			this.epoch_data[epoch].season = this.get_season_data(epoch);
			this.epoch_data[epoch].weather = this.get_weather_data(epoch);

		}
		
		return this.epoch_data;

		/* -------------------------------------------------------------------------------------------------------------*/

	}

	next_season(){
			
		this.season.current_index = (this.season.current_index+1)%this.seasons.length;
		this.season.next_index = (this.season.current_index+1)%this.seasons.length;

		this.season.current = this.seasons[this.season.current_index];
		this.season.next = this.seasons[this.season.next_index];
		
		this.season.total_day += this.seasons[this.season.current_index].length;
		if(this.season.total_day > this.season_length){
			this.season.total_day = this.seasons[this.season.current_index].length;
		}

	}

	get_season_data(epoch){

		if(!this.process_seasons) return;

		var season_epoch = epoch - this.settings.season_offset;

		this.season.year = season_epoch/this.season_length;
		this.season.next_year = (season_epoch+1)/this.season_length;

		this.season.day = Math.floor(fract(this.season.year)*this.season_length);

		if(this.season.day > this.season.total_day){
			this.next_season();
		}

        this.season.season_day = Math.floor(this.seasons[this.season.current_index].length+this.season.day-this.season.total_day);

        if(this.season.season_day > this.seasons[this.season.current_index].duration){

			this.season.perc = 1-((this.season.season_day-this.seasons[this.season.current_index].duration)/this.seasons[this.season.current_index].transition_length);

		}else{

			this.season.perc = 1.0;

		}

		this.season.high_perc = clamp(Math.floor(this.season.perc*100), 1, 100);

		this.season.season_day++;

		/* -------------------------------------------------------------------------------------------------------------*/

		var time = {
			sunrise: false,
			sunset: false
		}

		var high_solstice = false;
		var low_solstice = false;
		var equinox = false;

		if(this.static_data.clock.enabled){

			var curr_sunrise = this.current_location.seasons[this.season.current_index].time.sunrise;
			var curr_sunset = this.current_location.seasons[this.season.current_index].time.sunset;

			var next_sunrise = this.current_location.seasons[this.season.next_index].time.sunrise;
			var next_sunset = this.current_location.seasons[this.season.next_index].time.sunset;

			var sunrise_minute = Math.round(lerp(next_sunrise.minute, curr_sunrise.minute, this.season.perc));
			var sunrise_hour = lerp(next_sunrise.hour, curr_sunrise.hour, this.season.perc);
			var sunrise = sunrise_hour+sunrise_minute/this.static_data.clock.minutes;

			var sunset_minute = Math.round(lerp(next_sunset.minute, curr_sunset.minute, this.season.perc));
			var sunset_hour = lerp(next_sunset.hour, curr_sunset.hour, this.season.perc);
			var sunset = sunset_hour+sunset_minute/this.static_data.clock.minutes;

			var sunrise_m = (Math.round(fract(sunrise)*this.static_data.clock.minutes)).toString().length < 2 ? "0"+(Math.round(fract(sunrise)*this.static_data.clock.minutes)).toString() : (Math.round(fract(sunrise)*this.static_data.clock.minutes));
			var sunset_m = (Math.round(fract(sunset)*this.static_data.clock.minutes)).toString().length < 2 ? "0"+(Math.round(fract(sunset)*this.static_data.clock.minutes)).toString() : (Math.round(fract(sunset)*this.static_data.clock.minutes));

			var sunrise_s = Math.floor(sunrise)+":"+sunrise_m;
			var sunset_s = Math.floor(sunset)+":"+sunset_m;

			if(this.solstices_appear){

				if(!this.event_happened){
				
					high_solstice = this.longest_day_time == (sunset-sunrise);
					low_solstice = this.shortest_day_time == (sunset-sunrise);
					equinox = this.middle_day_time == precisionRound(sunset-sunrise, 1);

					if(high_solstice || low_solstice || equinox){
						this.event_happened = true;

						this.high_solstice = high_solstice;
						this.low_solstice = low_solstice;
						this.equinox = equinox;
					}

				}else{

					if(this.equinox && !this.high_solstice && this.longest_day_time == (sunset-sunrise)){
						high_solstice = true;
						this.high_solstice = true;
						this.equinox = false;
					}

					if(this.equinox && !this.low_solstice && this.shortest_day_time == (sunset-sunrise)){
						low_solstice = true;
						this.low_solstice = true;
						this.equinox = false;
					}

					if(!this.equinox && (this.low_solstice || this.high_solstice) && this.middle_day_time == precisionRound(sunset-sunrise, 1)){
						equinox = true;
						this.equinox = true;
						this.high_solstice = false;
						this.low_solstice = false;
					}

				}

			}

			time.sunrise = {
				data: sunrise,
				string: sunrise_s
			}
			
			time.sunset = {
				data: sunset,
				string: sunset_s
			}

		}

		var data = {
			season_name: this.seasons[this.season.current_index].name,
			season_index: this.season.current_index,
			season_perc: this.season.high_perc,
			season_day: this.season.season_day,
			time: time,
			high_solstice: high_solstice,
			low_solstice: low_solstice,
			equinox: equinox
		}

		if(Math.floor(this.season.year) != Math.floor(this.season.next_year) && !(Math.floor(this.season.day) > this.season.total_day)){
			this.next_season();
		}

		return data;


	}

	next_weather_season(){
			
		this.weather.current_index = (this.weather.current_index+1)%this.seasons.length;
		this.weather.next_index = (this.weather.current_index+1)%this.seasons.length;

		this.weather.current = this.seasons[this.weather.current_index];
		this.weather.next = this.seasons[this.weather.next_index];
		
		this.weather.total_day += this.seasons[this.weather.current_index].length;
		if(this.weather.total_day > this.season_length){
			this.weather.total_day = this.seasons[this.weather.current_index].length;
		}

	}

	get_weather_data(epoch){

		if(!this.process_weather) return;

		var weather_epoch = epoch - this.settings.season_offset - this.settings.weather_offset;

		this.weather.year = weather_epoch/this.season_length;
		this.weather.next_year = (weather_epoch+1)/this.season_length;

		this.weather.day = Math.floor(fract(this.weather.year)*this.season_length);

		if(this.weather.day > this.weather.total_day){
			this.next_weather_season();
		}

        this.weather.season_day = Math.floor(this.seasons[this.weather.current_index].length+this.weather.day-this.weather.total_day)+1;

        if(this.weather.season_day > this.seasons[this.weather.current_index].duration){

			this.weather.perc = 1-((this.weather.season_day-this.seasons[this.weather.current_index].duration-1)/this.seasons[this.weather.current_index].transition_length);

		}else{

			this.weather.perc = 1.0;

		}

		/* -------------------------------------------------------------------------------------------------------------*/


		var curr_season_data = this.current_location.seasons[this.weather.current_index];
		var next_season_data = this.current_location.seasons[this.weather.next_index];

		var low = lerp(next_season_data.weather.temp_low, curr_season_data.weather.temp_low, this.weather.perc);
		var high = lerp(next_season_data.weather.temp_high, curr_season_data.weather.temp_high, this.weather.perc);
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
			var temperature_range_m = [fahrenheit_to_celcius(low), fahrenheit_to_celcius(high)];
			var temperature_i = [range_low, range_high];
			var temperature_m = [fahrenheit_to_celcius(temperature_i[0]), fahrenheit_to_celcius(temperature_i[1])];
			var temperature_c = pick_from_table(temp, preset_data.temperature_gauge, false).key;
			var percipitation_table = temp > 32 ? "warm" : "cold";
		}else{
			var temperature_range_i = [celcius_to_fahrenheit(low), celcius_to_fahrenheit(high)];
			var temperature_range_m = [low, high];
			var temperature_m = [range_low, range_high];
			var temperature_i = [celcius_to_fahrenheit(temperature_m[0]), celcius_to_fahrenheit(temperature_m[1])];
			var temperature_c = pick_from_table(celcius_to_fahrenheit(temp), preset_data.temperature_gauge, false).key;
			var percipitation_table = temp > 0 ? "warm" : "cold";
		}

		var precipitation_chance = lerp(next_season_data.weather.precipitation, curr_season_data.weather.precipitation, this.weather.perc);
		var precipitation_intensity = lerp(next_season_data.weather.precipitation_intensity, curr_season_data.weather.precipitation_intensity, this.weather.perc);


		var precipitation_chance = lerp(next_season_data.weather.precipitation, curr_season_data.weather.precipitation, this.weather.perc);
		var precipitation_intensity = lerp(next_season_data.weather.precipitation_intensity, curr_season_data.weather.precipitation_intensity, this.weather.perc);

		var chance = clamp(0.5+this.random.noise(epoch+this.season_length*4, 5.0, 0.35, 0.5), 0.0, 1.0);

		var inner_chance = 0;

		var precipitation = {'key': 'None'};
		var wind_speed = {'key': 'Calm'};
		var clouds = 'Clear';
		var feature_select = false;
		var feature = '';

		if(precipitation_chance > chance){

			inner_chance = clamp((0.5+this.random.noise(epoch+this.season_length*5, 10, 0.3, 0.5))*precipitation_intensity, 0.0, 1.0);
	
			precipitation = pick_from_table(inner_chance, preset_data.precipitation[percipitation_table], true);

			if(precipitation){

				clouds = preset_data.clouds[precipitation.index];

				var wind_type_chance = this.random.roll_dice(epoch+this.season_length, preset_data.wind.type[precipitation.index]);

				if(wind_type_chance == 20){
					wind_type_chance += this.random.roll_dice(epoch+this.season_length*6, '1d10');
					feature_select = 'Storm';
				}else{
					feature_select = 'Rain';
				}

				wind_speed = pick_from_table(wind_type_chance, preset_data.wind.speed, true);

			}

		}else{

			var clouds_chance = clamp((0.5+this.random.noise(epoch+this.season_length*7, 10, 0.4, 0.5)), 0.0, 1.0);

			var another_precipitation = pick_from_table(clouds_chance-0.3, preset_data.precipitation[percipitation_table], true);

			if(clouds_chance > 0.3 && another_precipitation > 0.2){
				clouds = preset_data.clouds[another_precipitation.index];
			}

			var wind_type_chance = this.random.roll_dice(epoch+this.season_length*8, preset_data.wind.type[another_precipitation.index]);

			wind_type_chance = wind_type_chance == 20 ? 19 : wind_type_chance;
			
			wind_speed = pick_from_table(wind_type_chance, preset_data.wind.speed, true);

			if(wind_speed.key > 4){
				feature_select = 'Windy';
			}

		}

		if(feature_select && preset_data.feature_table[feature_select]){

			var feature_chance = clamp((0.5+this.random.noise(epoch+this.season_length*9, 10, 0.4, 0.5)), 0.0, 1.0);

			feature = pick_from_table(feature_chance, preset_data.feature_table[feature_select][percipitation_table], false).key;

		}

		if(!this.wind_direction){
			this.wind_direction = this.random.random_int_between(epoch+1000, 0, Object.keys(preset_data.wind.direction_table).length-1);
			this.wind_direction = Object.keys(preset_data.wind.direction_table)[this.wind_direction];
		}

		var wind_chance = clamp((0.5+this.random.noise(epoch+1000, 10, 0.4, 0.5)), 0.0, 1.0);
		this.wind_direction = pick_from_table(wind_chance, preset_data.wind.direction_table[this.wind_direction], true).key;
		var wind_direction = this.wind_direction;

		var wind_info = clone(preset_data.wind.info[wind_speed.key]);
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

		if(Math.floor(this.weather.year) != Math.floor(this.weather.next_year) && !(Math.floor(this.weather.day) > this.weather.total_day)){
			this.next_weather_season();
		}

		return return_data;

	}

}