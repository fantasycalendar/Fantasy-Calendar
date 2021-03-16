const render_data_generator = {

	get_weather_icon: function(epoch){

		let epoch_data = this.epoch_data[epoch];
        let weather = epoch_data.weather;

        if(weather === undefined ||
			(!Perms.player_at_least('co-owner')
				&&
				(
					static_data.settings.hide_all_weather
					||
					(
						static_data.settings.hide_future_weather
						&&
						epoch > dynamic_data.epoch
					)
				)
			)
		){
			return "";
		}

		if(weather.clouds == "Clear"){
			if(weather.feature == "Fog"){
				return `wi wi-fog`;
			}else{
				return `wi wi-day-sunny`;
			}
		}else{

			if(weather.precipitation.key == "None"){

				if(weather.clouds == "A few clouds"){
					return `wi wi-day-cloudy`;
				}else if(weather.clouds == "Mostly cloudy"){
					return `wi wi-cloud`;
				}else{
					return `wi wi-cloudy`;
				}

			}else{

				if(weather.temperature.metric.actual > 0){

					if(weather.precipitation.actual > 0.375){
						if(weather.feature == "Lightning"){
							return `wi wi-thunderstorm`;
						}else{
							return `wi wi-rain`;
						}
					}else {
						if(weather.feature == "Lightning"){
							return `wi wi-storm-showers`;
						}else{
							if(weather.feature == "Fog" && weather.precipitation.actual < 0.375){
								return `wi wi-fog`;
							}
							return `wi wi-showers`;
						}
					}

				}else{

					if(weather.feature == "Hail"){
						return `wi wi-hail`;
					}else{
						return `wi wi-snow`;
					}

				}
			}
		}

	},

    get_moon_data: function(epoch_data, events) {

        let moons = [];
        moon_loop:
        for (let moon_index = 0; moon_index < static_data.moons.length; moon_index++) {

            let moon = static_data.moons[moon_index];

            if (!moon.hidden || Perms.player_at_least('co-owner')) {

                let phase = epoch_data.moon_phase[moon_index];
                let phase_name = Object.keys(moon_phases[moon.granularity])[phase];
                let custom_phase_name = "";
                let color = moon.color;
                let shadow_color = moon.shadow_color ? moon.shadow_color : "#292b4a";
                let hidden = moon.hidden;

                for (let index in events) {
                    if (events[index].overrides) {
                        if (events[index].overrides.moons !== undefined) {
                            if (events[index].overrides.moons[moon_index] !== undefined) {
                                let moon_overrides = events[index].overrides.moons[moon_index];
                                phase = moon_overrides.phase !== undefined ? moon_overrides.phase : phase;
                                color = moon_overrides.color !== undefined ? moon_overrides.color : color;
                                shadow_color = moon_overrides.shadow_color !== undefined ? moon_overrides.shadow_color : shadow_color;
                                hidden = moon_overrides.hidden !== undefined ? moon_overrides.hidden : hidden;
                                custom_phase_name = moon_overrides.phase_name !== undefined ? moon_overrides.phase_name : phase_name;
                                if (hidden) continue moon_loop;
                            }
                        }
                    }
                }
                let path = moon_phases[moon.granularity][phase_name];

                phase_name = custom_phase_name == "" ? phase_name : custom_phase_name;

                moons.push({
                    "index": moon_index,
                    "name": moon.name,
                    "phase": phase_name,
                    "path": path,
                    "color": color,
                    "shadow_color": shadow_color
                });
            }
        }


		return moons;

	},

	get_day_data: function(epoch){

		let epoch_data = this.epoch_data[epoch];

		if(static_data.settings.only_reveal_today && epoch > dynamic_data.epoch && !Perms.player_at_least('co-owner')){
			return {
				"number": "",
				"text": "",
				"type": "empty",
                "weekday": '',
				"epoch": undefined,
				"year_day": '',
				"weather_icon": '',
                "season_color": '',
                "show_event_button": false,
				"events": [],
                "moons": [],
                "has_events": false
			}
		}

		let text = ""
		if(epoch_data.leap_day !== undefined){
			let index = epoch_data.leap_day;
			text = static_data.year_data.leap_days[index].name;
		}

		let season_color = epoch_data.season ? (epoch_data.season.color !== undefined ? epoch_data.season.color : false) : false;
        let weather_icon = this.get_weather_icon(epoch);

        let events = this.event_data[epoch] ? this.event_data[epoch] : [];

		let moons = [];
		if(!static_data.settings.hide_moons || (static_data.settings.hide_moons && Perms.player_at_least('co-owner'))){
            moons = this.get_moon_data(epoch_data, events);
		}

        let year_day = static_data.settings.add_year_day_number ? epoch_data.year_day : false;

		return {
			"number": epoch_data.day,
			"text": text,
            "type": "day",
            "weekday": epoch_data.week_day_name,
			"epoch": epoch,
			"year_day": year_day,
			"weather_icon": weather_icon,
			"season_color": season_color,
            "show_event_button": Perms.player_at_least('player'),
            "events": events,
			"moons": moons,
            "has_events": true
		};
	},

	overflow: function(){
		return {
			"number": "",
			"text": "",
            "type": "overflow",
            "weekday": '',
			"epoch": undefined,
			"year_day": '',
			"weather_icon": '',
            "season_color": '',
            "show_event_button": false,
			"events": [],
			"moons": [],
            "has_events": false
		};
    },

    _create_render_data: function(processed_data){

        if(processed_data !== undefined){
            this.processed_data = processed_data;
        }else if(this.processed_data === undefined){
            return {
                success: false,
                message: 'No calendar data available'
            };
        }

        let timespans_to_build = this.processed_data.timespans_to_build;
        let year_data = this.processed_data.year_data;
        this.epoch_data = this.processed_data.epoch_data;

        this.render_data = {
            "current_epoch": dynamic_data.epoch,
            "preview_epoch": preview_date.epoch,
            "render_style": static_data.settings.layout,
            "timespans": [],
            "event_epochs": {},
            "timespan_event_epochs": {}
        }

        this.create_event_data();

        let indexes = Object.keys(timespans_to_build);
        let length = indexes.length

        let epoch = year_data.start_epoch;
        let week_day = year_data.week_day;

        for(var index = 0; index < length; index++){

            let timespan = timespans_to_build[indexes[index]];

            var filtered_leap_days_beforestart = timespan.leap_days.filter(function(features){
                return features.intercalary && features.day === 0;
            });

            if(filtered_leap_days_beforestart.length > 0){

                let timespan_data = {
                    "title": "",
                    "show_title": false,
                    "short_weekdays": timespan.truncated_week,
                    "weekdays": static_data.year_data.global_week,
                    "show_weekdays": false,
                    "days": [[]],
                    "events": []
                }

                let weekday_number = 1;

                for(var leap_day_index in filtered_leap_days_beforestart){

                    let day_data = this.get_day_data(epoch);
                    timespan_data.days[timespan_data.days.length-1].push(day_data);
                    this.render_data.event_epochs[epoch] = day_data;
                    this.render_data.timespan_event_epochs[epoch] = timespan_data;

                    weekday_number++;
                    epoch++;

                    if(weekday_number > timespan.week.length){
                        weekday_number = 1;
                        if(this.render_data.render_style != "vertical"){
                            timespan_data.days.push([]);
                        }
                    }
                }

                for(weekday_number; weekday_number <= static_data.year_data.global_week.length; weekday_number++){
                    timespan_data.days[timespan_data.days.length-1].push(this.overflow());
                }

                this.render_data.timespans.push(timespan_data);

            }

            let show_months = timespan.type === "month";

            let timespan_data = {
                "title": static_data.settings.add_month_number ? `${timespan.name} - Month ${timespan.num+1}` : timespan.name,
                "show_title": true,
                "weekdays": timespan.week,
                "short_weekdays": timespan.truncated_week,
                "show_weekdays": !static_data.settings.hide_weekdays ? timespan.type === "month" : false,
                "days": [[]],
                "events": []
            }

            if(!static_data.year_data.overflow){
                week_day = 1;
            }

            for(let day_number = 1; day_number <= timespan.length;){

                if(timespan_data.days[timespan_data.days.length-1].length != 0){
                    if(this.render_data.render_style != "vertical"){
                        timespan_data.days.push([])
                    }
                }

                for(let weekday_number = 1; weekday_number <= timespan.week.length; weekday_number++){

                    if(week_day > weekday_number && show_months && this.render_data.render_style != "vertical"){

                        timespan_data.days[timespan_data.days.length-1].push(this.overflow());

                    }else if(day_number <= timespan.length){

                        let day_data = this.get_day_data(epoch);
                        timespan_data.days[timespan_data.days.length-1].push(day_data);
                        this.render_data.event_epochs[epoch] = day_data;
                        this.render_data.timespan_event_epochs[epoch] = timespan_data;

                        epoch++;

                        filtered_leap_days = timespan.leap_days.filter(function(leap_day){
                            return leap_day.intercalary && leap_day.day === day_number && leap_day.day !== timespan.length;
                        });

                        if(filtered_leap_days.length > 0){

                            for(let internal_weekday_number = week_day; internal_weekday_number < timespan.week.length; internal_weekday_number++){
                                timespan_data.days[timespan_data.days.length-1].push(this.overflow());
                            }

                            this.render_data.timespans.push(timespan_data);

                            timespan_data = {
                                "title": "",
                                "show_title": false,
                                "weekdays": static_data.year_data.global_week,
                                "short_weekdays": timespan.truncated_week,
                                "show_weekdays": false,
                                "days": [[]],
                                "events": []
                            }

                            let internal_weekday_number = 1;

                            for(var leap_day_index in filtered_leap_days){

                                let day_data = this.get_day_data(epoch);
                                timespan_data.days[timespan_data.days.length-1].push(day_data);
                                this.render_data.event_epochs[epoch] = day_data;
                                this.render_data.timespan_event_epochs[epoch] = timespan_data;

                                internal_weekday_number++;
                                epoch++;

                                if(internal_weekday_number > timespan.week.length){
                                    internal_weekday_number = 1;
                                    if(this.render_data.render_style != "vertical"){
                                        timespan_data.days.push([]);
                                    }
                                }
                            }

                            for(internal_weekday_number; internal_weekday_number <= static_data.year_data.global_week.length; internal_weekday_number++){
                                timespan_data.days[timespan_data.days.length-1].push(this.overflow());
                            }

                            this.render_data.timespans.push(timespan_data);

                            timespan_data = {
                                "title": static_data.settings.add_month_number ? `${timespan.name} - Month ${index+1}` : timespan.name,
                                "show_title": true,
                                "weekdays": timespan.week,
                                "short_weekdays": timespan.truncated_week,
                                "show_weekdays": !static_data.settings.hide_weekdays ? timespan.type === "month" : false,
                                "days": [[]],
                                "events": []
                            }

                            if(week_day != timespan.week.length){
                                for(let internal_weekday_number = 0; internal_weekday_number < week_day; internal_weekday_number++){
                                    timespan_data.days[timespan_data.days.length-1].push(this.overflow());
                                }
                            }

                        }

                        day_number++;

                        if(show_months){
                            week_day++;

                            if(week_day > timespan.week.length){
                                week_day = 1;
                                if(this.render_data.render_style == "vertical"){
                                    day_data.extra_class = "week_end"
                                }
                            }
                        }

                    }else{

                        if(this.render_data.render_style != "vertical"){
                            timespan_data.days[timespan_data.days.length-1].push(this.overflow());
                        }

                    }
                }
                
            }

            this.render_data.timespans.push(timespan_data);

            if(Perms.player_at_least('co-owner') || !static_data.settings.only_reveal_today || (static_data.settings.only_reveal_today && epoch > dynamic_data.epoch)){

                var filtered_leap_days_end = timespan.leap_days.filter(function(features) {
                    return features.intercalary && features.day === timespan.length;
                });

                if(filtered_leap_days_end.length > 0){

                    let timespan_data = {
                        "title": "",
                        "show_title": false,
                        "short_weekdays": timespan.truncated_week,
                        "weekdays": static_data.year_data.global_week,
                        "show_weekdays": false,
                        "days": [[]],
                        "events": []
                    }
                    
                    let weekday_number = 1;

                    for(var leap_day_index in filtered_leap_days_end){

                        let day_data = this.get_day_data(epoch);
                        timespan_data.days[timespan_data.days.length - 1].push(day_data);
                        this.render_data.event_epochs[epoch] = day_data;
                        this.render_data.timespan_event_epochs[epoch] = timespan_data;

                        weekday_number++;
                        epoch++;

                        if(weekday_number > timespan.week.length){
                            weekday_number = 1;
                            if(this.render_data.render_style != "vertical"){
                                timespan_data.days.push([]);
                            }
                        }
                    }

                    for(weekday_number; weekday_number <= static_data.year_data.global_week.length; weekday_number++){
                        timespan_data.days[timespan_data.days.length-1].push(this.overflow());
                    }

                    this.render_data.timespans.push(timespan_data);

                }

            }

            if(static_data.settings.only_reveal_today && epoch > dynamic_data.epoch && !Perms.player_at_least('co-owner')){
                break;
            }

        }

        return {
            success: true,
            render_data: this.render_data
        };

    },

	create_render_data: function(processed_data){

        return new Promise(function(resolve, reject){

            var result = render_data_generator._create_render_data(processed_data);

            if(result.success){
                resolve(result.render_data);
            }else{
                reject(result.message);
            }

        });

    },

    event_deleted: function(event_id){

        for(let epoch in render_data_generator.events_to_send){
            let events = render_data_generator.events_to_send[epoch];
            for(let index in events){
                if(events[index].index == event_id){
                    delete events[index];
                }else if(events[index].index > event_id){
                    events[index].index -= 1;
                }
            }
        }

        return render_data_generator.events_to_send;

    },

    _create_event_data: function(evaluated_event_data){

        if(this.processed_data === undefined){
            return {
                success: false,
                message: 'No calendar data available'
            };
        }

        if(evaluated_event_data !== undefined){
            this.evaluated_event_data = evaluated_event_data;
        }else if(this.evaluated_event_data === undefined){
            return {
                success: false,
                message: 'No event data available'
            };
        }

        this.events_to_send = {};

        if(static_data.settings.hide_events && !Perms.player_at_least('co-owner')){
            return {
                success: true,
                event_data: this.events_to_send
            }
        }   

		if(static_data.eras.length > 0 && !static_data.settings.hide_eras){

			var num_eras = Object.keys(static_data.eras).length;

			for(var era_index = 0; era_index < num_eras; era_index++){

				var era = static_data.eras[era_index];

				if(era.settings.show_as_event){

                    let event_class = ['era_event'];

                    var category = era.settings.event_category_id && era.settings.event_category_id > -1 ?  get_category(era.settings.event_category_id) : false;

                    if(category && category.id != -1){
                        if(category.event_settings.hide_full){
                            continue;
                        }
                        event_class.push(!category.event_settings.print ? "" : "d-print-none");
                        event_class.push(category.event_settings.color ? category.event_settings.color : "");
                        event_class.push(category.event_settings.text ? category.event_settings.text : "");
                        event_class.push(category.event_settings.hide || category.category_settings.hide ? "hidden_event" : "");
                    }

                    if(this.events_to_send[era.date.epoch] === undefined){
                        this.events_to_send[era.date.epoch] = []
                    }

                    this.events_to_send[era.date.epoch].push({
                        "index": era_index,
                        "name": era.name,
                        "overrides": {},
                        "class": event_class.join(' ')
                    });
                }
            }
        }

        for(let event_index = 0; event_index < events.length; event_index++){

            let event = events[event_index];

            if(event.settings.hide_full){
                continue;
            }

            var category = event.event_category_id && event.event_category_id > -1 ?  get_category(event.event_category_id) : false;

            var category_hide = category && category.id != -1 ? category.category_settings.hide : false;

            if(!Perms.can_modify_event(event_index) && (event.settings.hide || category_hide)){
                continue;
            }

            let epochs = this.evaluated_event_data.valid[event_index];

            for(let epoch_index in epochs){

                let epoch = epochs[epoch_index];

                if(this.events_to_send[epoch] === undefined){
                    this.events_to_send[epoch] = []
                }

                var start = this.evaluated_event_data.starts[event_index].indexOf(epoch) != -1;
                var end = this.evaluated_event_data.ends[event_index].indexOf(epoch) != -1;

                let event_class = [];
                event_class.push(!event.settings.print ? "d-print-none" : "");
                event_class.push(event.settings.color ? event.settings.color : "");
                event_class.push(event.settings.text ? event.settings.text : "");
                event_class.push(event.settings.hide || static_data.settings.hide_events || category_hide ? " hidden_event" : "");
                event_class.push(start ? "event_start" : "");
                event_class.push(end ? "event_end" : "");

                let event_name = event.name;

                if(this.render_data.render_style == "minimalistic" && this.render_data.event_epochs[epoch] !== undefined){
                    let day = this.render_data.event_epochs[epoch];
                    event_name = `${ordinal_suffix_of(day.number)}: ${event_name}`
                }

                if(start){
                    event_name = `${event_name} (start)`
                }else if(end){
                    event_name = `${event_name} (end)`
                }

                this.events_to_send[epoch].push({
                    "index": event_index,
                    "name": event_name,
                    "overrides": event.data.overrides,
                    "class": event_class.join(' ')
                });
            }
        }

        return {
            success: true,
            event_data: this.events_to_send
        }
    },

	create_event_data: function(){

        let evaluated_event_data = event_evaluator.init(
            static_data,
            dynamic_data,
            events,
            event_categories,
            this.epoch_data,
            undefined,
            this.processed_data.year_data.start_epoch,
            this.processed_data.year_data.end_epoch,
            Perms.player_at_least('co-owner'),
            false
        );

        let event_data = this._create_event_data(evaluated_event_data);

        if (event_data.success) {
            this.event_data = event_data.event_data;
        } else {
            this.event_data = {};
        }

    }
}

module.exports = render_data_generator;
