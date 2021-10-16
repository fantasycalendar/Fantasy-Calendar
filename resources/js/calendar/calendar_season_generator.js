class Climate{

	constructor(
		epoch_data,
		static_data,
		dynamic_data,
		first_year,
		start_epoch,
		end_epoch,
		callback
	){

		this.epoch_data = epoch_data;
		this.dynamic_data = dynamic_data;
		this.first_year = first_year;
		this.static_data = static_data;
		this.start_epoch = start_epoch;
		this.end_epoch = end_epoch;
		this.callback = callback;

		this.settings = this.static_data.seasons.global_settings;
		this.clock = this.static_data.clock;
		this.seasons = this.static_data.seasons.data;

		if(!this.settings.periodic_seasons){
		    this.seasons.sort((a, b) => {
		        return a.timespan - b.timespan || a.day - b.day;
            });
        }

		if(this.settings.color_enabled){
			for(let season of this.seasons){
				season.gradient = new Gradient(season.color)
			}
		}

		this.season = {}
		this.weather = {}

		this.wind_direction = false;

		this.random = new random(this.static_data.seasons.global_settings.seed);

	}

	get process_seasons(){

		return !(this.static_data.year_data.timespans.length === 0
            ||
            this.static_data.year_data.global_week.length === 0
            ||
            this.dynamic_data.location === ''
            ||
            this.static_data.seasons.data.length === 0
            ||
            Object.keys(this.epoch_data).length === 0);

	}

	get process_weather(){

		return this.process_seasons && this.static_data.seasons.global_settings.enable_weather && !this.callback;

	}

	set_up_location_seasons(){

		if(this.dynamic_data.custom_location === false && (this.static_data.seasons.data.length === 2 || this.static_data.seasons.data.length === 4)){

			let preset_season_length = preset_data.locations[this.static_data.seasons.data.length];

			let location = preset_season_length[this.dynamic_data.location] !== undefined ? preset_season_length[this.dynamic_data.location] : preset_season_length[Object.keys(preset_season_length)[0]];

			this.current_location = {
				'name': location.name,
				'seasons':[]
			}

			let preset_seasons;
			if(this.static_data.seasons.data.length === 2){
				preset_seasons = ['Winter', 'Summer'];
			}else{
				preset_seasons = ['Winter', 'Spring', 'Summer', 'Autumn'];
			}

			let valid_preset_order = this.static_data.seasons.global_settings.preset_order !== undefined && this.static_data.seasons.global_settings.preset_order.reduce((a, b) => a + b, 0) === this.static_data.seasons.data.reduce((a, b) => a + b, 0);

			let preset_order = undefined;

			if(!valid_preset_order){

				let season_test = [];
				let lowercase_preset = preset_seasons.map(name => name.toLowerCase());
				for(let season of this.static_data.seasons.data){
					let preset_index = lowercase_preset.indexOf(season.name.toLowerCase());
					if(preset_index === -1 && season.name.toLowerCase() === "fall" && this.static_data.seasons.data.length === 4){
						preset_index = 3;
					}
					if(preset_index > -1){
						season_test.push(preset_index)
					}
				}

				if(season_test.length === this.static_data.seasons.data.length){
					preset_order = season_test;
				}

			}else{

				preset_order = this.settings.preset_order;

			}

			for(let i = 0; i < this.static_data.seasons.data.length; i++){

				let index = i;
				if(preset_order !== undefined && preset_order.length === this.static_data.seasons.data.length){
					index = preset_order[i];
				}
				this.current_location.seasons.push(clone(location.seasons[index]));

				this.current_location.seasons[i].time = {};
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

			for(let i = 0; i < this.static_data.seasons.data.length; i++){

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

			for(let season of this.current_location.seasons){

				let sunrise = season.time.sunrise.hour+season.time.sunrise.minute/this.static_data.clock.minutes;
				let sunset = season.time.sunset.hour+season.time.sunset.minute/this.static_data.clock.minutes;

				let length = sunset-sunrise;

				if(this.shortest_day_time > length){
					this.shortest_day_time = precisionRound(length, 3);
				}

				if(this.longest_day_time < length){
					this.longest_day_time = precisionRound(length, 3);
				}

			}

			this.middle_day_time = precisionRound(mid(this.shortest_day_time, this.longest_day_time), 3);

			this.solstices_appear = true;

			if(this.shortest_day_time === this.longest_day_time){
				this.solstices_appear = false;
			}

			this.low_solstice_epochs = [];
			this.high_solstice_epochs = [];

		}

	}

	get season_length(){

		if(this._season_length === undefined){

			if(this.settings.periodic_seasons){

				this._season_length = 0;

				for(let season_index in this.seasons){

					let duration = this.seasons[season_index].duration ? this.seasons[season_index].duration : 0;
					let transition_length = this.seasons[season_index].transition_length ? this.seasons[season_index].transition_length : 90;

					this.seasons[season_index].length = transition_length+duration;

					this.seasons[season_index].start = this._season_length;
					this._season_length += transition_length;
					this.seasons[season_index].end = this._season_length;
					this._season_length += duration;

				}

			}else{

				this._season_length = 1000;

			}

		}

		return this._season_length;

	}

	generate(){

		if(!this.process_seasons){
			return this.epoch_data;
		}

		this.set_up_location_seasons();
		this.set_up_solstice_equinox();

		if(this.settings.periodic_seasons){

			this.generate_periodic_seasons();

		}else{

			this.generate_static_seasons();

		}

		return this.epoch_data;

	}

	generate_static_seasons(){

		this.set_up_season_epochs();
		this.set_up_weather_epochs();

		for(let epoch = this.start_epoch; epoch <= this.end_epoch; epoch++){
			this.epoch_data[epoch].season = this.get_static_season_data(epoch);
			this.epoch_data[epoch].weather = this.get_static_weather_data(epoch);

			if(this.callback){
				let percentage = (epoch-this.start_epoch)/(this.end_epoch-this.start_epoch)
				postMessage({
					percentage: percentage,
					message: "Generating future seasonal data...",
					callback: true
				})
			}
		}

		this.evaluate_equinoxes();

	}

	set_up_season_epochs(){

		this.season.local_seasons = [];

		let year = convert_year(this.static_data, this.first_year)-1;

		let index = this.seasons.length-1;
		if(index < 0){
			index += this.seasons.length
		}

		let season = clone(this.seasons[index]);
        season.year = year;
		season.epoch = evaluate_calendar_start(this.static_data, year, season.timespan, season.day).epoch-1;
		season.index = index;

		this.season.local_seasons.push(season)

		while(this.start_epoch < season.epoch){

			index--;
			if(index < 0){
				index += this.seasons.length
				year--;
			}

			season = clone(this.seasons[index]);
            season.year = year;
			season.epoch = evaluate_calendar_start(this.static_data, year, season.timespan, season.day).epoch-1;
			season.index = index;

			this.season.local_seasons.push(season)

		}

		this.season.local_seasons.reverse();

		year = convert_year(this.static_data, this.first_year);

		index = 0;

		season = clone(this.seasons[index]);
        season.year = year;
		season.epoch = evaluate_calendar_start(this.static_data, year, season.timespan, season.day).epoch-1;
		season.index = index;

		this.season.local_seasons.push(season)

		while(season.epoch < this.end_epoch){

			index++;
			if(index >= this.seasons.length){
				index -= this.seasons.length;
				year++;
			}

			season = clone(this.seasons[index]);
            season.year = year;
			season.epoch = evaluate_calendar_start(this.static_data, year, season.timespan, season.day).epoch-1;
			season.index = index;

			this.season.local_seasons.push(season)

		}

		if(season.epoch !== this.end_epoch){

			index++;
			if(index >= this.seasons.length){
				index -= this.seasons.length;
				year++;
			}

			season = clone(this.seasons[index]);
            season.year = year;
			season.epoch = evaluate_calendar_start(this.static_data, year, season.timespan, season.day).epoch-1;
			season.index = index;

			this.season.local_seasons.push(season)

		}

		this.season.local_current_index = 0;
		this.season.local_next_index = 1;

		this.season.current_season = this.season.local_seasons[0];
		this.season.next_season = this.season.local_seasons[1];

		this.season.current_index = this.season.current_season.index;
		this.season.next_index = this.season.next_season.index;

		while(this.season.next_season.epoch < this.start_epoch){

			this.season.local_current_index++;
			this.season.local_next_index++;

			this.season.current_season = this.season.local_seasons[this.season.local_current_index];
			this.season.next_season = this.season.local_seasons[this.season.local_next_index];

			this.season.current_index = this.season.current_season.index;
			this.season.next_index = this.season.next_season.index;

		}

	}

	get_static_season_data(epoch){

		epoch = epoch-1;

		if(epoch >= this.season.next_season.epoch){

			this.season.local_current_index++;
			this.season.local_next_index++;

			this.season.current_season = this.season.local_seasons[this.season.local_current_index];
			this.season.next_season = this.season.local_seasons[this.season.local_next_index];

			this.season.current_index = this.season.current_season.index;
			this.season.next_index = this.season.next_season.index;

		}

		this.season.season_day = epoch - this.season.current_season.epoch + 1;

		this.season.perc = 1-norm(epoch, this.season.current_season.epoch, this.season.next_season.epoch);

		this.season.high_perc = clamp(Math.ceil(this.season.perc*100), 1, 100);

		return this.evaluate_season_data(epoch);

	}

	set_up_weather_epochs(){

		this.weather.local_seasons = [];

		let year = convert_year(this.static_data, this.first_year)-1;

		let index = this.seasons.length-1;
		if(index < 0){
			index += this.seasons.length
		}

		let season = clone(this.seasons[index]);
		season.epoch = evaluate_calendar_start(this.static_data, year, season.timespan, season.day).epoch-1;
		season.epoch += this.settings.weather_offset;
		season.index = index;

		this.weather.local_seasons.push(season)

		while(this.start_epoch < season.epoch){

			index--;
			if(index < 0){
				index += this.seasons.length
				year--;
			}

			season = clone(this.seasons[index]);
			season.epoch = evaluate_calendar_start(this.static_data, year, season.timespan, season.day).epoch-1;
			season.epoch += this.settings.weather_offset;
			season.index = index;

			this.weather.local_seasons.push(season)

		}

		this.weather.local_seasons.reverse();


		year = convert_year(this.static_data, this.first_year);

		index = 0;

		season = clone(this.seasons[index]);
		season.epoch = evaluate_calendar_start(this.static_data, year, season.timespan, season.day).epoch-1;
		season.epoch += this.settings.weather_offset;
		season.index = index;

		this.weather.local_seasons.push(season)

		while(season.epoch < this.end_epoch){

			index++;
			if(index >= this.seasons.length){
				index -= this.seasons.length;
				year++;
			}

			season = clone(this.seasons[index]);
			season.epoch = evaluate_calendar_start(this.static_data, year, season.timespan, season.day).epoch-1;
			season.epoch += this.settings.weather_offset;
			season.index = index;

			this.weather.local_seasons.push(season)

		}

		if(season.epoch !== this.end_epoch){

			index++;
			if(index >= this.seasons.length){
				index -= this.seasons.length;
				year++;
			}

			season = clone(this.seasons[index]);
			season.epoch = evaluate_calendar_start(this.static_data, year, season.timespan, season.day).epoch-1;
			season.epoch += this.settings.weather_offset;
			season.index = index;

			this.weather.local_seasons.push(season)

		}

		this.weather.local_current_index = 0;
		this.weather.local_next_index = 1;

		this.weather.current_season = this.weather.local_seasons[0];
		this.weather.next_season = this.weather.local_seasons[1];

		this.weather.current_index = this.weather.current_season.index;
		this.weather.next_index = this.weather.next_season.index;

		this.weather.local_season_length = this.weather.next_season.epoch - this.start_epoch;

		while(this.weather.next_season.epoch < this.start_epoch){

			this.weather.local_current_index++;
			this.weather.local_next_index++;

			this.weather.current_season = this.weather.local_seasons[this.weather.local_current_index];
			this.weather.next_season = this.weather.local_seasons[this.weather.local_next_index];

			this.weather.current_index = this.weather.current_season.index;
			this.weather.next_index = this.weather.next_season.index;

		}

	}

	get_static_weather_data(epoch){

		if(!this.process_weather) return;

		epoch = epoch-1;

		if(epoch > this.weather.next_season.epoch){

			this.weather.local_current_index++;
			this.weather.local_next_index++;

			this.weather.current_season = this.weather.local_seasons[this.weather.local_current_index];
			this.weather.next_season = this.weather.local_seasons[this.weather.local_next_index];

			this.weather.current_index = this.weather.current_season.index;
			this.weather.next_index = this.weather.next_season.index;

			this.weather.local_season_length = this.weather.next_season.epoch - epoch;

		}

		this.weather.season_day = epoch - this.weather.current_season.epoch + 1;

		this.weather.perc = 1-norm(epoch, this.weather.current_season.epoch, this.weather.next_season.epoch);

		this.weather.high_perc = clamp(Math.ceil(this.weather.perc*100), 1, 100);

		return this.evaluate_weather_data(epoch);

	}

	generate_periodic_seasons(){

		let season_epoch = this.start_epoch - this.settings.season_offset;

		this.season.year = season_epoch / this.season_length;

		this.season.day = Math.round(fract(this.season.year)*this.season_length);

		this.season.total_day = 0;

		for(let season_index in this.seasons){

			let season = this.seasons[season_index];

			if(this.season.day >= this.season.total_day && this.season.day < this.season.total_day+season.length){

				this.season.current_index = Number(season_index);
				this.season.next_index = (this.season.current_index+1)%this.seasons.length;

				this.season.total_day += season.length;
				break;

			}else{

				this.season.total_day += season.length;

			}
		}

		this.season.season_day = Math.floor(this.seasons[this.season.current_index].length + this.season.day - this.season.total_day);

		/* -------------------------------------------------------------------------------------------------------------*/

		let weather_epoch = this.start_epoch - this.settings.season_offset - this.settings.weather_offset;

		this.weather.year = weather_epoch/this.season_length;

		this.weather.day = Math.round(fract(this.weather.year)*this.season_length)

		this.weather.total_day = 0;

		for(let season_index in this.seasons){

			let season = this.seasons[season_index];

			if(this.weather.day >= this.weather.total_day && this.weather.day < this.weather.total_day+season.length){

				this.weather.current_index = Number(season_index)
				this.weather.next_index = (this.weather.current_index+1)%this.seasons.length;

				this.weather.total_day += season.length;

				break;

			}else{

				this.weather.total_day += season.length;
			}
		}

		for(let epoch = this.start_epoch; epoch <= this.end_epoch; epoch++){
			this.epoch_data[epoch].season = this.get_dynamic_season_data(epoch);
			this.epoch_data[epoch].weather = this.get_dynamic_weather_data(epoch);

			if(this.callback){
				let percentage = (epoch-this.start_epoch)/(this.end_epoch-this.start_epoch)
				postMessage({
					percentage: percentage,
					callback: true
				})
			}
		}

		this.evaluate_equinoxes();

	}

	next_season(){

		this.season.current_index = (this.season.current_index+1)%this.seasons.length;
		this.season.next_index = (this.season.current_index+1)%this.seasons.length;

		this.season.total_day += this.seasons[this.season.current_index].length;
		if(this.season.total_day > this.season_length){
			this.season.total_day = this.seasons[this.season.current_index].length;
		}

		this.season.season_day = 0;

	}

	get_dynamic_season_data(epoch){

		if(!this.process_seasons) return;

		let season_epoch = epoch - this.settings.season_offset;

		this.season.year = season_epoch/this.season_length;
		this.season.next_year = (season_epoch+1)/this.season_length;

		this.season.day = Math.round(fract(this.season.year)*this.season_length);

		if(this.season.day >= this.season.total_day){
			this.next_season();
		}

		if(this.season.season_day >= this.seasons[this.season.current_index].duration){

			this.season.perc = 1-((this.season.season_day-this.seasons[this.season.current_index].duration)/this.seasons[this.season.current_index].transition_length);

		}else{

			this.season.perc = 1.0;

		}

		this.season.high_perc = clamp(Math.floor(this.season.perc*100), 1, 100);

		this.season.season_day++;

		/* -------------------------------------------------------------------------------------------------------------*/

		let data = this.evaluate_season_data(epoch);

		if(Math.floor(this.season.year) !== Math.floor(this.season.next_year) && !(Math.floor(this.season.day) >= this.season.total_day)){
			this.next_season();
		}

		return data;

	}

	next_weather_season(){

		this.weather.current_index = (this.weather.current_index+1)%this.seasons.length;
		this.weather.next_index = (this.weather.current_index+1)%this.seasons.length;

		this.weather.total_day += this.seasons[this.weather.current_index].length;
		if(this.weather.total_day > this.season_length){
			this.weather.total_day = this.seasons[this.weather.current_index].length;
		}

	}

	get_dynamic_weather_data(epoch){

		if(!this.process_weather) return;

		let weather_epoch = epoch - this.settings.season_offset - this.settings.weather_offset;

		this.weather.year = weather_epoch/this.season_length;
		this.weather.next_year = (weather_epoch+1)/this.season_length;

		this.weather.day = Math.round(fract(this.weather.year)*this.season_length);

		if(this.weather.day >= this.weather.total_day){
			this.next_weather_season();
		}

		this.weather.season_day = Math.floor(this.seasons[this.weather.current_index].length+this.weather.day-this.weather.total_day);

		if(this.weather.season_day >= this.seasons[this.weather.current_index].duration){

			this.weather.perc = 1-((this.weather.season_day-this.seasons[this.weather.current_index].duration-1)/this.seasons[this.weather.current_index].transition_length);

		}else{

			this.weather.perc = 1.0;

		}

		this.weather.season_day++;

		/* -------------------------------------------------------------------------------------------------------------*/

		let data = this.evaluate_weather_data(epoch);

		/* -------------------------------------------------------------------------------------------------------------*/

		if(Math.floor(this.weather.year) !== Math.floor(this.weather.next_year) && !(Math.floor(this.weather.day) >= this.weather.total_day)){
			this.next_weather_season();
		}

		return data;

	}

	evaluate_season_data(epoch){

		let time = {
			sunrise: false,
			sunset: false
		}

		let high_solstice = false;
		let low_solstice = false;

		if(this.static_data.clock.enabled){

			let curr_sunrise = this.current_location.seasons[this.season.current_index].time.sunrise;
			let curr_sunset = this.current_location.seasons[this.season.current_index].time.sunset;

			let next_sunrise = this.current_location.seasons[this.season.next_index].time.sunrise;
			let next_sunset = this.current_location.seasons[this.season.next_index].time.sunset;

			let sunrise_minute = Math.round(lerp(next_sunrise.minute, curr_sunrise.minute, this.season.perc));
			let sunrise_hour = lerp(next_sunrise.hour, curr_sunrise.hour, this.season.perc);
			let sunrise = sunrise_hour+sunrise_minute/this.static_data.clock.minutes;

			let sunset_minute = Math.round(lerp(next_sunset.minute, curr_sunset.minute, this.season.perc));
			let sunset_hour = lerp(next_sunset.hour, curr_sunset.hour, this.season.perc);
			let sunset = sunset_hour+sunset_minute/this.static_data.clock.minutes;

			let sunrise_m = (Math.round(fract(sunrise)*this.static_data.clock.minutes)).toString().length < 2 ? "0"+(Math.round(fract(sunrise)*this.static_data.clock.minutes)).toString() : (Math.round(fract(sunrise)*this.static_data.clock.minutes));
			let sunset_m = (Math.round(fract(sunset)*this.static_data.clock.minutes)).toString().length < 2 ? "0"+(Math.round(fract(sunset)*this.static_data.clock.minutes)).toString() : (Math.round(fract(sunset)*this.static_data.clock.minutes));

			let sunrise_s = Math.floor(sunrise)+":"+sunrise_m;
			let sunset_s = Math.floor(sunset)+":"+sunset_m;

			if(this.solstices_appear){

				if(!this.event_happened){

					high_solstice = this.longest_day_time === precisionRound(sunset-sunrise, 3);
					low_solstice = this.shortest_day_time === precisionRound(sunset-sunrise, 3);

					if(high_solstice || low_solstice){
						this.event_happened = true;
						this.high_solstice = high_solstice;
						this.low_solstice = low_solstice;
						if(high_solstice){
							this.high_solstice_epochs.push(epoch);
						}else{
							this.low_solstice_epochs.push(epoch);
						}
					}

				}else{

					if(this.low_solstice && !this.high_solstice && this.longest_day_time === precisionRound(sunset-sunrise, 3)){
						high_solstice = true;
						this.high_solstice = true;
						this.low_solstice = false;
						this.high_solstice_epochs.push(epoch);
					}

					if(this.high_solstice && !this.low_solstice && this.shortest_day_time === precisionRound(sunset-sunrise, 3)){
						low_solstice = true;
						this.low_solstice = true;
						this.high_solstice = false;
						this.low_solstice_epochs.push(epoch);
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

		return {
			season_name: this.seasons[this.season.current_index].name,
			season_index: this.season.current_index,
			season_perc: this.season.high_perc,
			season_precise_perc: this.season.perc,
			season_day: this.season.season_day,
			time: time,
			high_solstice: high_solstice,
			low_solstice: low_solstice,
			falling_equinox: false,
			rising_equinox: false,
			color: this.settings.color_enabled ? this.seasons[this.season.current_index].gradient.colorAt(1.0-this.season.perc) : undefined
		}

	}

	get_time_data(epoch_data){

		let curr_sunrise = this.current_location.seasons[epoch_data.season_index].time.sunrise;
		let curr_sunset = this.current_location.seasons[epoch_data.season_index].time.sunset;

		let next_season = (epoch_data.season_index+1)%this.current_location.seasons.length;

		let next_sunrise = this.current_location.seasons[next_season].time.sunrise;
		let next_sunset = this.current_location.seasons[next_season].time.sunset;

		let sunrise_minute = Math.round(lerp(next_sunrise.minute, curr_sunrise.minute, epoch_data.season_precise_perc));
		let sunrise_hour = lerp(next_sunrise.hour, curr_sunrise.hour, epoch_data.season_precise_perc);
		let sunrise = sunrise_hour+sunrise_minute/this.static_data.clock.minutes;

		let sunset_minute = Math.round(lerp(next_sunset.minute, curr_sunset.minute, epoch_data.season_precise_perc));
		let sunset_hour = lerp(next_sunset.hour, curr_sunset.hour, epoch_data.season_precise_perc);
		let sunset = sunset_hour+sunset_minute/this.static_data.clock.minutes;

		return {
			sunrise: sunrise,
			sunset: sunset,
		}
	}

	convert_object_to_time(obj){

		return obj.hour+obj.minute/this.static_data.clock.minutes;

	}

	evaluate_equinoxes() {

		if(this.static_data.clock.enabled){

			let first_epoch_data = this.epoch_data[this.start_epoch].season;

			let time = this.get_time_data(first_epoch_data);

			if(this.low_solstice_epochs.length != 0 || this.high_solstice_epochs.length != 0){

				if(this.low_solstice_epochs[0] > this.high_solstice_epochs[0]){
					let falling_equinox = false;
					let rising_equinox = time.sunset-time.sunrise < this.middle_day_time;
				}else{
					let falling_equinox = time.sunset-time.sunrise > this.middle_day_time;
					let rising_equinox = false;
				}

			}else{

				let curr_sunrise = this.current_location.seasons[first_epoch_data.season_index].time.sunrise;
				let curr_sunset = this.current_location.seasons[first_epoch_data.season_index].time.sunset;

				let curr_season_day_length = this.convert_object_to_time(curr_sunset)-this.convert_object_to_time(curr_sunrise)

				let next_season = (first_epoch_data.season_index+1)%this.current_location.seasons.length;

				let next_sunrise = this.current_location.seasons[next_season].time.sunrise;
				let next_sunset = this.current_location.seasons[next_season].time.sunset;

				let next_season_day_length = this.convert_object_to_time(next_sunset)-this.convert_object_to_time(next_sunrise)

				let falling_equinox = next_season_day_length <= curr_season_day_length;
				let rising_equinox = next_season_day_length > curr_season_day_length;

			}

			let rising_equinox;
            let falling_equinox;
			for(let epoch = this.start_epoch; epoch < this.end_epoch; epoch++){

				let epoch_data = this.epoch_data[epoch].season;

				let time = this.get_time_data(epoch_data);

				if(epoch_data.high_solstice){
					rising_equinox = false;
					falling_equinox = true;
				}
				if(epoch_data.low_solstice){
					rising_equinox = true;
					falling_equinox = false;
				}

				if(rising_equinox && time.sunset-time.sunrise >= this.middle_day_time){
					rising_equinox = false;
					this.epoch_data[epoch].season.rising_equinox = true;
				}

				if(falling_equinox && time.sunset-time.sunrise <= this.middle_day_time){
					falling_equinox = false;
					this.epoch_data[epoch].season.falling_equinox = true;
				}

			}

		}

	}

	evaluate_weather_data(epoch){

		let curr_season_data = this.current_location.seasons[this.weather.current_index];
		let next_season_data = this.current_location.seasons[this.weather.next_index];

		let low = lerp(next_season_data.weather.temp_low, curr_season_data.weather.temp_low, this.weather.perc);
		let high = lerp(next_season_data.weather.temp_high, curr_season_data.weather.temp_high, this.weather.perc);
		let middle = mid(low, high);

		let range_low = mid(low, middle);
		let large = this.random.noise(epoch, 1.0, this.current_location.settings.large_noise_frequency, this.current_location.settings.large_noise_amplitude)*0.5;
		let medium = this.random.noise(epoch+this.season_length, 1.0, this.current_location.settings.medium_noise_frequency, this.current_location.settings.medium_noise_amplitude)*0.8;
		let small = this.random.noise(epoch+this.season_length*2, 1.0, this.current_location.settings.small_noise_frequency, this.current_location.settings.small_noise_amplitude);
		range_low = range_low-large+medium-small;

		let range_high = mid(middle, high);
		large = this.random.noise(epoch+this.season_length*1.5, 1.0, this.current_location.settings.large_noise_frequency, this.current_location.settings.large_noise_amplitude)*0.5;
		medium = this.random.noise(epoch+this.season_length*2.5, 1.0, this.current_location.settings.medium_noise_frequency, this.current_location.settings.medium_noise_amplitude)*0.8;
		small = this.random.noise(epoch+this.season_length*3.5, 1.0, this.current_location.settings.small_noise_frequency, this.current_location.settings.small_noise_amplitude);
		range_high = range_high-large+medium-small;

		// If the low value happened to go over the high, swap 'em
		if(range_low > range_high){
			range_low=range_high+(range_high=range_low)-range_low
		}

		let temp = mid(range_low, range_high);

        let temperature_range_i;
        let temperature_range_m;
        let temperature_i;
        let temperature_m;
        let temperature_c;
        let temperature_actual_i;
        let temperature_actual_m;
        let percipitation_table;

		if(this.static_data.seasons.global_settings.temp_sys === "imperial" || this.static_data.seasons.global_settings.temp_sys === "both_i" || !this.dynamic_data.custom_location){
			temperature_range_i = [low, high];
			temperature_range_m = [fahrenheit_to_celcius(low), fahrenheit_to_celcius(high)];
			temperature_i = [range_low, range_high];
			temperature_m = [fahrenheit_to_celcius(temperature_i[0]), fahrenheit_to_celcius(temperature_i[1])];
			temperature_c = pick_from_table(temp, preset_data.temperature_gauge, false).key;
			temperature_actual_i = temp;
			temperature_actual_m = fahrenheit_to_celcius(temp);
			percipitation_table = temp > 32 ? "warm" : "cold";
		}else{
			temperature_range_i = [celcius_to_fahrenheit(low), celcius_to_fahrenheit(high)];
			temperature_range_m = [low, high];
			temperature_m = [range_low, range_high];
			temperature_i = [celcius_to_fahrenheit(temperature_m[0]), celcius_to_fahrenheit(temperature_m[1])];
			temperature_c = pick_from_table(celcius_to_fahrenheit(temp), preset_data.temperature_gauge, false).key;
			temperature_actual_m = temp;
			temperature_actual_i = celcius_to_fahrenheit(temp);
			percipitation_table = temp > 0 ? "warm" : "cold";
		}

		let precipitation_chance = lerp(next_season_data.weather.precipitation, curr_season_data.weather.precipitation, this.weather.perc);
		let precipitation_intensity = lerp(next_season_data.weather.precipitation_intensity, curr_season_data.weather.precipitation_intensity, this.weather.perc);

		let chance = clamp(0.5+this.random.noise(epoch+this.season_length*4, 5.0, 0.35, 0.5), 0.0, 1.0);

		let inner_chance = 0;

		let precipitation = {'key': 'None'};
		let wind_speed = {'key': 'Calm'};
		let clouds = 'Clear';
		let feature_select = false;
		let feature = '';

		if(precipitation_chance > chance){

			inner_chance = clamp((0.5+this.random.noise(epoch+this.season_length*5, 10, 0.3, precipitation_intensity))*precipitation_intensity, 0.0, 1.0);

			precipitation = pick_from_table(inner_chance, preset_data.precipitation[percipitation_table], true);

			if(precipitation){

				clouds = preset_data.clouds[precipitation.index];

				let wind_type_chance = this.random.roll_dice(epoch+this.season_length, preset_data.wind.type[precipitation.index]);

				if(wind_type_chance === 20 || (clouds === "Dark storm clouds" && precipitation.index >= 4)){
					wind_type_chance += this.random.roll_dice(epoch+this.season_length*6, '1d10');
					feature_select = 'Storm';
				}else{
					feature_select = 'Rain';
				}

				wind_speed = pick_from_table(wind_type_chance, preset_data.wind.speed, true);

			}

		}else{

			let clouds_chance = clamp((0.5+this.random.noise(epoch+this.season_length*7, 10, 0.4, 0.5)), 0.0, 1.0);

			let another_precipitation = pick_from_table(clouds_chance-0.25, preset_data.precipitation[percipitation_table], true);

			if(clouds_chance > 0.3 && another_precipitation.index >= 0){
				let index = another_precipitation.index-1;
				if(index >= 0){
					clouds = preset_data.clouds[index];
				}
			}

			let wind_type_chance = this.random.roll_dice(epoch+this.season_length*8, preset_data.wind.type[another_precipitation.index]);

			wind_type_chance = wind_type_chance === 20 ? 19 : wind_type_chance;

			wind_speed = pick_from_table(wind_type_chance, preset_data.wind.speed, true);

			if(wind_speed.key > 4){
				feature_select = 'Windy';
			}

		}

		if(feature_select && preset_data.feature_table[feature_select]){

			let feature_chance = clamp((0.5+this.random.noise(epoch+this.season_length*9, 10, 0.4, 0.5)), 0.0, 1.0);

			feature = pick_from_table(feature_chance, preset_data.feature_table[feature_select][percipitation_table], false).key;

		}

		if(!this.wind_direction){
			let table = Object.keys(preset_data.wind.direction_table);
			this.wind_direction = table[this.random.random_int_between(epoch+1000, 0, table.length-1)];
		}

		let wind_chance = clamp((0.5+this.random.noise(epoch+1000, 10, 0.4, 0.5)), 0.0, 1.0);
		this.wind_direction = pick_from_table(wind_chance, preset_data.wind.direction_table[this.wind_direction], true).key;
		let wind_direction = this.wind_direction;

		let wind_info = preset_data.wind.info[wind_speed.key];
		let wind_velocity_i = wind_info['mph'];
		let wind_velocity_m = wind_info['mph'].replace( /(\d+)/g, function(a, b){
			return Math.round(b*1.60934,2);
		});
		let wind_velocity_k = wind_info['mph'].replace( /(\d+)/g, function(a, b){
			return Math.round(b*0.868976,2);
		});

		return {
			temperature: {
				imperial: {
					actual: temperature_actual_i,
					value: temperature_i,
					low: temperature_range_i[0],
					high: temperature_range_i[1],
				},
				metric: {
					actual: temperature_actual_m,
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
				metric: wind_velocity_m,
				knots: wind_velocity_k
			},
			wind_direction: wind_direction
		}

	}

}



class Gradient{

	constructor(array){

		this.start = this.processHEX(array[0]);
		this.end = this.processHEX(array[1]);

	}

	colorAt(number){

		return this.rgbToHex(
			Math.floor(lerp(this.start[0], this.end[0], number)),
			Math.floor(lerp(this.start[1], this.end[1], number)),
			Math.floor(lerp(this.start[2], this.end[2], number))
		)

	}

	componentToHex(c) {
	    let hex = c.toString(16);
		return hex.length === 1 ? "0" + hex : hex;
	}

	rgbToHex(r, g, b) {
		return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
	}

	processHEX(val) {

		let stripped_val = val.replace('NaN', "FF")

		//does the hex contain extra char?
		let hex = stripped_val.length > 6 ? stripped_val.substr(1, stripped_val.length - 1) : stripped_val;

		// is it a six character hex?
		if (hex.length > 3) {

			//scrape out the numerics
			return [
			    parseInt(hex.substr(0, 2), 16),
			    parseInt(hex.substr(2, 2), 16),
			    parseInt(hex.substr(4, 2), 16)
            ];
		}

        // if not six character hex,
        // then work as if its a three character hex
        return [
            parseInt(hex.substr(0, 1) + hex.substr(0, 1), 16),
            parseInt(hex.substr(1, 1) + hex.substr(1, 1), 16),
            parseInt(hex.substr(2, 1) + hex.substr(2, 1), 16)
        ]
	}
}
