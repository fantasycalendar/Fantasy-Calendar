var calendar_presets = {
	'Earth': {
		'dynamic_data': {'year':2019,'month':0,'day':23,'epoch':737227,'custom_location':false,'location':'Cool and Rainy','timespan':5,'internal_year':2018},
		'static_data': {
			'year_data':{
				'first_day':6,
				'overflow':true,
				'global_week':[
					'Monday',
					'Tuesday',
					'Wednesday',
					'Thursday',
					'Friday',
					'Saturday',
					'Sunday'
				],
				'timespans':[
					{
						'name':'January',
						'type':'month',
						'length':31,
						'interval':1,
						'offset':1
					},
					{
						'name':'February',
						'type':'month',
						'length':28,
						'interval':1,
						'offset':1
					},
					{
						'name':'March',
						'type':'month',
						'length':31,
						'interval':1,
						'offset':1
					},
					{
						'name':'April',
						'type':'month',
						'length':30,
						'interval':1,
						'offset':1
					},
					{
						'name':'May',
						'type':'month',
						'length':31,
						'interval':1,
						'offset':1
					},
					{
						'name':'June',
						'type':'month',
						'length':30,
						'interval':1,
						'offset':1
					},
					{
						'name':'July',
						'type':'month',
						'length':31,
						'interval':1,
						'offset':1
					},
					{
						'name':'August',
						'type':'month',
						'length':31,
						'interval':1,
						'offset':1
					},
					{
						'name':'September',
						'type':'month',
						'length':30,
						'interval':1,
						'offset':1
					},
					{
						'name':'October',
						'type':'month',
						'length':31,
						'interval':1,
						'offset':1
					},
					{
						'name':'November',
						'type':'month',
						'length':30,
						'interval':1,
						'offset':1
					},
					{
						'name':'December',
						'type':'month',
						'length':31,
						'interval':1,
						'offset':1
					}
				],
				'leap_days':[
					{
						'name':'Leap Day',
						'intercalary':false,
						'timespan':1,
						'removes_day':false,
						'removes_week_day':false,
						'adds_week_day':false,
						'day':0,
						'week_day':'',
						'interval':'+400,!100,4',
						'offset':0,
						'reference':'timespan'
					}
				]
			},
			'moons':[
				{
					'name':'Moon',
					'cycle':29.530588853,
					'shift':6,
					'granularity':32,
					'color':'#ffffff',
					'hidden':false
				}
			],
			'clock':{
				'hours':24,
				'minutes':60,
				'offset':0
			},
			'seasons':{
				'data':[
					{
						'name':'Winter',
						'time':{
							'sunrise':{
								'hour':9,
								'minute':0
							},
							'sunset':{
								'hour':18,
								'minute':0
							}
						},
						'transition_length':182.62,
						'duration':0
					},
					{
						'name':'Summer',
						'time':{
							'sunrise':{
								'hour':9,
								'minute':0
							},
							'sunset':{
								'hour':18,
								'minute':0
							}
						},
						'transition_length':182.62,
						'duration':0
					}
				],
				'locations':[

				],
				'global_settings':{
					'season_offset':-11,
					'weather_offset':56,
					'seed':826116802,
					'temp_sys':'both_m',
					'wind_sys':'both',
					'cinematic':true,
					'enable_weather':true
				}
			},
			'eras':[
				{
					'name':'Anno Domini',
					'abbreviation':'A.D.',
					'description':'',
					'settings':{
						'show_as_event':false,
						'event_category':-1,
						'ends_year':false
					},
					'date':{
						'year':1,
						'timespan':0,
						'day':1,
						'epoch':0,
						'era_year':1
					}
				}
			],
			'settings':{
				'layout':'grid',
				'show_current_month':false,
				'show_era_abbreviation':true,
				'allow_view':false,
				'only_backwards':false,
				'only_reveal_today':false,
				'hide_moons':false,
				'hide_clock':false,
				'hide_events':false,
				'hide_eras':false,
				'hide_all_weather':false,
				'hide_future_weather':false,
				'add_month_number':false,
				'add_year_day_number':false
			},
			'cycles':{
				'format':'',
				'data':[]
			},
			'event_data':{
				'categories':[
					{
						'name':'Natural Event',
						'color':'Dark-Solid',
						'texty':'text',
						'category_settings':{
							'hide':false,
							'player_usable':false
						},
						'event_settings':{
							'hide':false,
							'noprint':false
						}
					},
					{
						'name':'Christian Holiday',
						'color':'Dark-Solid',
						'texty':'text',
						'category_settings':{
							'hide':false,
							'player_usable':false
						},
						'event_settings':{
							'hide':false,
							'noprint':false
						}
					},
					{
						'name':'Secular Holiday',
						'color':'Dark-Solid',
						'texty':'text',
						'category_settings':{
							'hide':false,
							'player_usable':false
						},
						'event_settings':{
							'hide':false,
							'noprint':false
						}
					},
					{
						'name':'Historical Event',
						'color':'Dark-Solid',
						'texty':'text',
						'category_settings':{
							'hide':false,
							'player_usable':false
						},
						'event_settings':{
							'hide':false,
							'noprint':false
						}
					},
					{
						'name':'Miscalaneous event',
						'color':'Dark-Solid',
						'texty':'text',
						'category_settings':{
							'hide':false,
							'player_usable':false
						},
						'event_settings':{
							'hide':false,
							'noprint':false
						}
					}
				],
				'events':[
					{
						'name':'Work on This Calendar Started',
						'description':'',
						'data':{
							'length':1,
							'show_start_end':false,
							'show_first_last':false,
							'conditions': [['Year','0',['2019']],['&&'],['Month','0',['5']],['&&'],['Day','0',['23']]]
						},
						'category':'4',
						'settings':{
							'color':'Blue-Grey',
							'text':'text',
							'hide':false,
							'noprint':false
						}
					},
					{
						'name':'Christmas',
						'description':'',
						'data':{
							'length':1,
							'show_start_end':false,
							'show_first_last':false,
							'conditions': [['Month','0',['11']],['&&'],['Day','0',['25']]]
						},
						'category':'1',
						'settings':{
							'color':'Red',
							'text':'text',
							'hide':false,
							'noprint':false
						}
					},
					{
						'name':'Winter Solstice',
						'description':'',
						'data':{
							'length':1,
							'show_start_end':false,
							'show_first_last':false,
							'conditions': [['Season','0',['0']],['&&'],['Season','8',['1']]]
						},
						'category':'0',
						'settings':{
							'color':'Green',
							'text':'text',
							'hide':false,
							'noprint':false
						}
					},
					{
						'name':'Summer Solstice',
						'description':'',
						'data':{
							'length':1,
							'show_start_end':false,
							'show_first_last':false,
							'conditions':[['Season','0',['1']],['&&'],['Season','8',['1']]]
						},
						'category':'0',
						'settings':{
							'color':'Green',
							'text':'text',
							'hide':false,
							'noprint':false
						}
					},
					{
						'name':'Spring Equinox',
						'description':'',
						'data':{
							'length':1,
							'show_start_end':false,
							'show_first_last':false,
							'conditions':[['Season','0',['0']],['&&'],['Season','2',['50']]]
						},
						'category':'0',
						'settings':{
							'color':'Green',
							'text':'text',
							'hide':false,
							'noprint':false
						}
					},
					{
						'name':'Autumnal Equinox',
						'description':'',
						'data':{
							'length':1,
							'show_start_end':false,
							'show_first_last':false,
							'conditions':[['Season','0',['1']],['&&'],['Season','2',['50']]]
						},
						'category':'0',
						'settings':{
							'color':'Green',
							'text':null,
							'hide':false,
							'noprint':false
						}
					},
					{
						'name':'Easter',
						'description':'',
						'data':{
							'length':1,
							'show_start_end':false,
							'show_first_last':false,
							'conditions':[['',[['Moons','2',['0','15']],['&&'],['!',[['Day','5',['21']],['&&'],['Month','0',['2']]]]]],['&&'],['',[['Month','0',['2']],['||'],['',[['Month','0',['3']],['&&'],['Day','3',['25']],['&&'],['!',[['Day','4',['19']],['&&'],['Moons','3',['0','15']]]],['&&'],['!',[['Moons','3',['0','19']],['&&'],['Day','2',['24']]]]]]]],['&&'],['Weekday','0',['7']],['&&'],['!',[['Month','0',['2']],['&&'],['',[['',[['Moons','0',['0','21']],['||'],['Moons','0',['0','19']]]],['&&'],['Day','3',['24']]]],['||'],['',[['Day','3',['26']],['&&'],['Moons','3',['0','21']]]],['&&'],['!',[['Moons','0',['0','15']],['||'],['',[['Day','2',['22']],['&&'],['Month','0',['2']],['&&'],['Moons','0',['0','17']]]]]]]],['&&'],['Moons','5',['0','23']]]
						},
						'category':'1',
						'settings':{
							'color':'Red',
							'text':'text',
							'hide':false,
							'noprint':false
						}
					},
					{
						'name':'Valentine&#39;s Day',
						'description':'',
						'data':{
							'length':1,
							'show_start_end':false,
							'show_first_last':false,
							'conditions':[['Month','0',['1']],['&&'],['Day','0',['14']]]
						},
						'category':'2',
						'settings':{
							'color':'Dark-Solid',
							'text':'text',
							'hide':false,
							'noprint':false
						}
					},
					{
						'name':'New Year&#39;s Day',
						'description':'',
						'data':{
							'length':1,
							'show_start_end':false,
							'show_first_last':false,
							'conditions':[['Day','7',['1']]]
						},
						'category':'2',
						'settings':{
							'color':null,
							'text':null,
							'hide':false,
							'noprint':false
						}
					}
				]
			}
		}
	},
	'Forgotten Realms': {
		'dynamic_data': {'year':1,'month':0,'day':0,'epoch':0,'custom_location':false,'location':'Equatorial','timespan':0,'internal_year':0},
		'static_data': {
			'year_data':{
				'first_day':1,
				'overflow':false,
				'global_week':[
					'I',
					'II',
					'III',
					'IV',
					'V',
					'VI',
					'VII',
					'VIII',
					'IX',
					'X'
				],
				'timespans':[
					{
						'name':'Hammer (Deepwinter)',
						'type':'month',
						'length':30,
						'interval':1,
						'offset':1
					},
					{
						'name':'Midwinter',
						'type':'intercalary',
						'length':1,
						'interval':1,
						'offset':1
					},
					{
						'name':'Alturiak (The Claw of Winter)',
						'type':'month',
						'length':30,
						'interval':1,
						'offset':1
					},
					{
						'name':'Ches (The Claw of the Sunsets)',
						'type':'month',
						'length':30,
						'interval':1,
						'offset':1
					},
					{
						'name':'Tarsakh (The Claw of Storms)',
						'type':'month',
						'length':30,
						'interval':1,
						'offset':1
					},
					{
						'name':'Greengrass',
						'type':'intercalary',
						'length':1,
						'interval':1,
						'offset':1
					},
					{
						'name':'Mirtul (The Melting)',
						'type':'month',
						'length':30,
						'interval':1,
						'offset':1
					},
					{
						'name':'Kythorn (The Time of Flowers)',
						'type':'month',
						'length':30,
						'interval':1,
						'offset':1
					},
					{
						'name':'Flamerule (Summertide)',
						'type':'month',
						'length':30,
						'interval':1,
						'offset':1
					},
					{
						'name':'Midsummer',
						'type':'intercalary',
						'length':1,
						'interval':1,
						'offset':1
					},
					{
						'name':'Shieldmeet',
						'type':'intercalary',
						'length':1,
						'interval':4,
						'offset':0
					},
					{
						'name':'Eleasis (Highsun)',
						'type':'month',
						'length':30,
						'interval':1,
						'offset':1
					},
					{
						'name':'Eleint (The Fading)',
						'type':'month',
						'length':30,
						'interval':1,
						'offset':1
					},
					{
						'name':'Highharvestide',
						'type':'intercalary',
						'length':1,
						'interval':1,
						'offset':1
					},
					{
						'name':'Marpenoth (Leaffall)',
						'type':'month',
						'length':30,
						'interval':1,
						'offset':1
					},
					{
						'name':'Uktar (The Rotting)',
						'type':'month',
						'length':30,
						'interval':1,
						'offset':1
					},
					{
						'name':'The Feast of the Moon',
						'type':'intercalary',
						'length':1,
						'interval':1,
						'offset':1
					},
					{
						'name':'Nightal (The Drawing Down)',
						'type':'month',
						'length':30,
						'interval':1,
						'offset':1
					}
				],
				'leap_days':[

				]
			},
			'moons':[

			],
			'clock':{
				'hours':24,
				'minutes':60,
				'offset':0
			},
			'seasons':{
				'data':[

				],
				'locations':[

				],
				'global_settings':{
					'season_offset':0,
					'weather_offset':0,
					'seed':-192482740,
					'temp_sys':'metric',
					'wind_sys':'metric',
					'cinematic':false,
					'enable_weather':false
				}
			},
			'eras':[

			],
			'settings':{
				'layout':'grid',
				'show_current_month':false,
				'show_era_abbreviation':false,
				'allow_view':false,
				'only_backwards':false,
				'only_reveal_today':false,
				'hide_moons':false,
				'hide_clock':false,
				'hide_events':false,
				'hide_eras':false,
				'hide_all_weather':false,
				'hide_future_weather':false,
				'add_month_number':false,
				'add_year_day_number':false
			},
			'cycles':{
				'format':'',
				'data':[

				]
			},
			'event_data':{
				'categories':[

				],
				'events':[

				]
			}
		}
	}
}


function parse_json(json){

	try{

		var calendar = JSON.parse(json);

		var dynamic_data = {
			'year': 1,
			'month': 0,
			'day': 1,
			'epoch': 0,
			'custom_location': false,
			'location': 'Equatorial'
		};

		var static_data = {
			'year_data':{
				'first_day':1,
				'overflow':false,
				'global_week':[],
				'timespans':[],
				'leap_days':[]
			},
			'moons':[],
			'clock':{
				'enabled':false,
				'hours':24,
				'minutes':60,
				'offset':0
			},
			'seasons':{
				'data':[],
				'locations':[],
				'global_settings':{
					'season_offset':0,
					'weather_offset':0,
					'seed':(Math.random().toString().substr(7)|0),
					'temp_sys':'metric',
					'wind_sys':'metric',
					'cinematic':false,
					'enable_weather':false
				}
			},
			'eras':[],
			'settings':{
				'layout':'grid',
				'show_current_month':false,
				'show_era_abbreviation':false,
				'allow_view':false,
				'only_backwards':false,
				'only_reveal_today':false,
				'hide_moons':false,
				'hide_clock':false,
				'hide_events':false,
				'hide_eras':false,
				'hide_all_weather':false,
				'hide_future_weather':false,
				'add_month_number':false,
				'add_year_day_number':false
			},
			'cycles':{
				'format':'',
				'data':[]
			},
			'event_data':{
				'categories':[],
				'events':[]
			}
		};

		if(calendar.dynamic_data !== undefined){
			var source = '2.0';
		}else if(calendar.month_len[0] !== undefined){
			var source = '1.0';
		}else if(calendar.year_len){
			var source = 'donjon';
		}
		
		switch(source){
			case '2.0':
				return {
					dynamic_data: calendar.dynamic_data,
					static_data: calendar.static_data
				}
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

function process_old_fantasycalendar(calendar, dynamic_data, static_data){

	dynamic_data.year = calendar.year;
	dynamic_data.month = calendar.month-1;
	dynamic_data.day = calendar.day;

	static_data.year_data.first_day = calendar.first_day+1;

	static_data.year_data.global_week = calendar.weekdays;

	static_data.year_data.overflow = calendar.overflow;

	for(var i = 0; i < calendar.months.length; i++){
		static_data.year_data.timespans.push({
			'name': escapeHtml(calendar.months[i]),
			'type': 'month',
			'interval': 1,
			'offset': 0,
			'length': calendar.month_len[i]
		});
	}

	for(var i = 0; i < calendar.moons.length; i++){
		static_data.moons.push({
			'name': escapeHtml( calendar.moons[i]),
			'cycle': calendar.lunar_cyc[i],
			'shift': calendar.lunar_shf[i],
			'granularity': get_moon_granularity(calendar.lunar_cyc[i]),
			'color': calendar.lunar_color[i],
			'hidden': false
		});
	}

	for(var i = 0; i < calendar.events.length; i++){
		var event = calendar.events[i];
		static_data.event_data.events.push({
			'name': escapeHtml(event.name),
			'description': escapeHtml(event.description),
			'data':{
				'length':1,
				'show_start_end':false,
				'show_first_last':false,
				'conditions': convert_old_event(event)
			},
			'category':-1,
			'settings':{
				'color':'Dark-Solid',
				'text':'text',
				'hide': event.hide === undefined ? false : event.hide,
				'noprint': event.noprint === undefined ? false : event.noprint
			}
		});
	}

	if(calendar.year_leap !== undefined && calendar.year_leap > 1){
		static_data.year_data.leap_days.push({
			'name': 'Leap day',
			'intercalary': false,
			'timespan': calendar.month_leap-1,
			'removes_day': false,
			'removes_week_day': false,
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
			cinematic: calendar.weather.weather_cinematic
		}

		if(calendar.winter_month > calendar.summer_month){

			var avg_length = fract_year_length(static_data)

			var summer_epoch = evaluate_calendar_start(static_data, 0, calendar.summer_month-1, calendar.summer_day).epoch;

			var winter_epoch = evaluate_calendar_start(static_data, 0, calendar.winter_month-1, calendar.winter_day).epoch;
			
			if(winter_epoch > summer_epoch){
				var first_season = {
					'name': 'Summer',
					'epoch': summer_epoch,
					'rise': calendar.summer_rise,
					'set': calendar.summer_set
				}
				var second_season = {
					'name': 'Winter',
					'epoch': winter_epoch,
					'rise': calendar.winter_rise,
					'set': calendar.winter_set
				}
			}else{
				var first_season = {
					'name': 'Winter',
					'epoch': winter_epoch,
					'rise': calendar.winter_rise,
					'set': calendar.winter_set
				}
				var second_season = {
					'name': 'Summer',
					'epoch': summer_epoch,
					'rise': calendar.summer_rise,
					'set': calendar.summer_set
				}
			}

			first_season.length = second_season.epoch - first_season.epoch

			second_season.length = avg_length + second_season.epoch - first_season.epoch

			offset = first_season.epoch;

			static_data.seasons.data = [
				{
					'Name': first_season.name,
					'transition_length': first_season.length,
					'duration': 0,
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
					'transition_length': second_season.length,
					'duration': 0,
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
		show_era_abbreviation: false,
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
		add_year_day_number: calendar.settings.add_year_day_number,
		year_zero_exists: true
	}

	return {
		dynamic_data: dynamic_data,
		static_data: static_data
	}

}

function process_donjon(calendar, dynamic_data, static_data){

	dynamic_data.year = calendar.year;

	static_data.year_data.first_day = calendar.first_day;

	static_data.year_data.global_week = calendar.weekdays;

	for(var i = 0; i < calendar.months.length; i++){
		var name = calendar.months[i];
		static_data.year_data.timespans.push({
			'name': escapeHtml(name),
			'type': 'month',
			'interval': 1,
			'offset': 0,
			'length': calendar.month_len[name]
		});
	}

	for(var i = 0; i < calendar.moons.length; i++){
		var name = calendar.moons[i];
		static_data.moons.push({
			'name': escapeHtml(name),
			'cycle': calendar.lunar_cyc[name],
			'shift': calendar.lunar_shf[name],
			'granularity': get_moon_granularity(calendar.lunar_cyc[name]),
			'color': '#ffffff',
			'hidden': false
		});
	}

	return {
		dynamic_data: dynamic_data,
		static_data: static_data
	}

}


function convert_old_event(event){

	switch(event.repeats){
		case 'once':
			return [
				['Year', '0', [event.data.year]],
				['&&'],
				['Month', '0', [event.data.month-1]],
				['&&'],
				['Day', '0', [event.data.day]]
			];
		case 'daily':
			return [
				['Epoch', '6', ["1", "0"]]
			];
		case 'weekly':
			return [
				['Weekday', '0', [event.data.week_day+1]]
			];

		case 'fortnightly':
			return [
				['Weekday', '0', [event.data.week_day+1]],
				['&&'],
				['Week', '13', [event.data.week_even ? '2' : '1', '0']]
			];

		case 'monthly_date':
			return [
				['Day', '0', [event.data.day]],
			];

		case 'annually_date':
			return [
				['Month', '0', [event.data.month-1]],
				['&&'],
				['Day', '0', [event.data.day]]
			];

		case 'monthly_weekday':
			return [
				['Weekday', '0', [event.data.week_day+1]],
				['&&'],
				['Week', '0', [event.data.week_day_number]]
			];

		case 'annually_month_weekday':
			return [
				['Month', '0', [event.data.month-1]],
				['&&'],
				['Weekday', '0', [event.data.week_day+1]],
				['&&'],
				['Week', '0', [event.data.week_day_number]]
			];

		case 'every_x_day':
			return [
				['Epoch', '6', [event.data.every, event.data.modulus+1]]
			];

		case 'every_x_weekday':
			return [
				['Weekday', '0', [event.data.week_day]],
				['&&'],
				['Week', '20', [event.data.every, event.data.modulus+1]]
			];

		case 'every_x_monthly_date':
			return [
				['Day', '0', [event.data.day]],
				['&&'],
				['Month', '13', [event.data.every, event.data.modulus+1]]
			];

		case 'every_x_monthly_weekday':
			return [
				['Weekday', '0', [event.data.week_day+1]],
				['&&'],
				['Week', '0', [event.data.week_day_number]],
				['&&'],
				['Month', '13', [event.data.every, event.data.modulus+1]]
			];

		case 'every_x_annually_date':
			return [
				['Day', '0', [event.data.day]],
				['&&'],
				['Month', '0', [event.data.month-1]],
				['&&'],
				['Year', '6', [event.data.every, event.data.modulus+1]]
			];

		case 'every_x_annually_weekday':
			return [
				['Weekday', '0', [event.data.week_day+1]],
				['&&'],
				['Week', '0', [event.data.week_day_number]],
				['&&'],
				['Month', '0', [event.data.month-1]],
				['&&'],
				['Year', '6', [event.data.every, event.data.modulus+1]]
			];


		case 'moon_every':
			return [
				['Moons', '0', [event.data.moon_id, convert_to_granularity(event.data.moon_phase)]]
			];

		case 'moon_monthly':
			return [
				['Moons', '0', [event.data.moon_id, convert_to_granularity(event.data.moon_phase)]],
				['&&'],
				['Moons', '7', [event.data.moon_id, convert_to_granularity(event.data.moon_phase_number)]]
			];

		case 'moon_anually':
			return [
				['Moons', '0', [event.data.moon_id, convert_to_granularity(event.data.moon_phase)]],
				['&&'],
				['Moons', '7', [event.data.moon_id, event.data.moon_phase_number]],
				['&&'],
				['Month', '0', [event.data.month-1]]
			];

		case 'multimoon_every':
			var result = [];
			for(var i = 0; i < event.data.moons.length; i++){
				result.push(['Moons', '0', [i, convert_to_granularity(event.data.moons[i].moon_phase)]])
				if(i != event.data.moons.length-1){
					result.push(['&&']);
				}
			}
			return result;

		case 'multimoon_anually':
			var result = [];
			result.push(['Month', '0', [event.data.month-1]]);
			result.push(['&&']);
			for(var i = 0; i < event.data.moons.length; i++){
				result.push(['Moons', '0', [i, convert_to_granularity(event.data.moons[i].moon_phase)]])
				if(i != event.data.moons.length-1){
					result.push(['&&']);
				}
			}
			return result;
	}
}


function jsUcfirst(string) 
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function convert_to_granularity(cycle){

	if(cycle >= 32){
		return cycle*2;
	}else if(cycle >= 24){
		return Math.floor(cycle*1.5);
	}else if(cycle >= 16){
		return cycle;
	}else if(cycle >= 8){
		return Math.floor(cycle/2);
	}else{
		return Math.floor(cycle/3);
	}

}