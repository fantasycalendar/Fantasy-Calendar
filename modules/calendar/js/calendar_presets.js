function create_season_events(id, season_name){

	if(season_name == "Winter"){
		equinox_name = "Vernal"
	}else if(season_name == "Summer"){
		equinox_name = "Autumnal"
	}else{
		equinox_name = season_name
	}

	return [
		{
			"name":`${season_name} Solstice`,
			"description":"",
			"data":{
				'has_duration': false,
				'duration': 0,
				'show_first_last': false,
				'only_happen_once': false,
				'connected_events': false,
				'one_time_event': false,
				'date': [],
				"conditions":[
					["Season","0",[id]],["&&"],["Season","8",["1"]]
				]
			},
			"category":"-1",
			"settings":{
				"color":"Green",
				"text":"text",
				"hide":false,
				"hide_full":false,
				"noprint":false
			}
		},
		{
			"name": `${equinox_name} Equinox`,
			"description":"",
			"data":{
				'has_duration': false,
				'duration': 0,
				'show_first_last': false,
				'only_happen_once': false,
				'connected_events': false,
				'one_time_event': false,
				'date': [],
				"conditions":[
					["Season","0",[id]],["&&"],["Season","2",["50"]]
				]
			},
			"category":"-1",
			"settings":{
				"color":"Green",
				"text":"text",
				"hide":false,
				"hide_full":false,
				"noprint":false
			}
		}
	]
}

var date = new Date();

var calendar_presets = {
	'Earth': {
		'dynamic_data': {"year":date.getFullYear(),"timespan":date.getMonth(),"day":date.getDate(),"epoch":0,"custom_location":false,"location":"Cool and Rainy","hour":date.getHours(),"minute":date.getMinutes()},
		'static_data': {"year_data":{"first_day":1,"overflow":true,"global_week":["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],"timespans":[{"name":"January","type":"month","length":31,"interval":1,"offset":1},{"name":"February","type":"month","length":28,"interval":1,"offset":1},{"name":"March","type":"month","length":31,"interval":1,"offset":1},{"name":"April","type":"month","length":30,"interval":1,"offset":1},{"name":"May","type":"month","length":31,"interval":1,"offset":1},{"name":"June","type":"month","length":30,"interval":1,"offset":1},{"name":"July","type":"month","length":31,"interval":1,"offset":1},{"name":"August","type":"month","length":31,"interval":1,"offset":1},{"name":"September","type":"month","length":30,"interval":1,"offset":1},{"name":"October","type":"month","length":31,"interval":1,"offset":1},{"name":"November","type":"month","length":30,"interval":1,"offset":1},{"name":"December","type":"month","length":31,"interval":1,"offset":1}],"leap_days":[{"name":"Leap Day","intercalary":false,"timespan":1,"adds_week_day":false,"interval":"400,!100,4","offset":0}]},"moons":[{"name":"Moon","cycle":29.530588853,"shift":10.24953,"granularity":32,"color":"#ffffff","hidden":false}],"clock":{"hours":24,"minutes":60,"offset":0,"enabled":true},"seasons":{"data":[{"name":"Winter","time":{"sunrise":{"hour":9,"minute":0},"sunset":{"hour":18,"minute":0}},"transition_length":182.62125,"duration":0},{"name":"Summer","time":{"sunrise":{"hour":7,"minute":0},"sunset":{"hour":20,"minute":0}},"transition_length":182.62125,"duration":0}],"locations":[],"global_settings":{"season_offset":-12,"weather_offset":56,"seed":826116802,"temp_sys":"both_m","wind_sys":"both","cinematic":true,"enable_weather":true}},"eras":[{"name":"Before Christ","abbreviation":"B.C.","description":"","settings":{"show_as_event":false,"event_category":-1,"ends_year":false,"restart":false},"date":{"year":-9000,"timespan":0,"day":0,"era_year":-9000,"epoch":-3287161}},{"name":"Anno Domini","abbreviation":"A.D.","description":"","settings":{"show_as_event":false,"event_category":-1,"ends_year":false,"restart":false},"date":{"year":-1,"timespan":11,"day":31,"era_year":-1,"epoch":-1}}],"settings":{"layout":"grid","show_current_month":false,"show_era_abbreviation":true,"allow_view":false,"only_backwards":false,"only_reveal_today":false,"hide_moons":false,"hide_clock":false,"hide_events":false,"hide_eras":false,"hide_all_weather":false,"hide_future_weather":false,"add_month_number":false,"add_year_day_number":false},"cycles":{"format":"","data":[]},"event_data":{"categories":[{"name":"Christian Holiday","category_settings":{"hide":false,"player_usable":false},"event_settings":{"hide":false,"noprint":false,"color":"Blue-Grey","text":"dot"}},{"name":"Secular Holiday","category_settings":{"hide":false,"player_usable":false},"event_settings":{"hide":false,"noprint":false,"color":"Orange","text":"dot"}},{"name":"Historical Event","category_settings":{"hide":false,"player_usable":false},"event_settings":{"hide":false,"noprint":false,"color":"Lime","text":"dot"}},{"name":"Miscalaneous event","category_settings":{"hide":false,"player_usable":false},"event_settings":{"hide":false,"noprint":false,"color":"Teal","text":"dot"}},{"name":"Natural Event","category_settings":{"hide":false,"player_usable":false},"event_settings":{"color":"Cyan","text":"text","hide":false,"noprint":false}}],"events":[{"name":"Work on This Calendar Started","description":"Aecius started work on the Gregorian Calendar for Fantasy Calendar on this day.<br>","data":{"has_duration":false,"duration":0,"show_first_last":false,"only_happen_once":false,"conditions":[["Year","0",["2019"]],["&&"],["Month","0",["5"]],["&&"],["Day","0",["23"]]],"connected_events":[]},"category":"3","settings":{"hide":false,"noprint":false,"color":"Teal","text":"dot"}},{"name":"Christmas","description":"Christmas is a Christian holiday celebrating the birth of Christ. Due to a combination of marketability and long lasting traditions it is popular even among many non-Christians, especially in countries that have a strong Christian tradition.&lt;br&gt;","data":{"has_duration":false,"duration":0,"show_first_last":false,"only_happen_once":false,"conditions":[["Month","0",["11"]],["&&"],["Day","0",["25"]]],"connected_events":[],"date":[]},"category":"1","settings":{"hide":false,"noprint":false,"color":"Orange","text":"dot"}},{"name":"Winter Solstice","description":"The Winter Solstice is the day of the year with the least time between sunrise and sunset. Many western cultures consider it the official start of winter.&lt;br&gt;","data":{"has_duration":false,"duration":0,"show_first_last":false,"only_happen_once":false,"conditions":[["Season","0",["0"]],["&&"],["Season","8",["1"]]],"connected_events":[],"date":[]},"category":"4","settings":{"color":"Cyan","text":"text","hide":false,"noprint":false}},{"name":"Summer Solstice","description":"&lt;p&gt;The Summer Solstice is the day of the year with the most time between \nsunrise and sunset. Many western cultures consider it the official start\n of summer.&lt;&#x2F;p&gt;","data":{"has_duration":false,"duration":0,"show_first_last":false,"only_happen_once":false,"conditions":[["Season","0",["1"]],["&&"],["Season","8",["1"]]],"connected_events":[],"date":[]},"category":"4","settings":{"color":"Cyan","text":"text","hide":false,"noprint":false}},{"name":"Spring Equinox","description":"The Vernal Equinox,\nalso called the spring equinox is the day between the winter and\nsummer solstices where the day is the exact same length as the night.\nMany western cultures consider it the official start of Spring.\n","data":{"has_duration":false,"duration":0,"show_first_last":false,"only_happen_once":false,"conditions":[["Season","0",["0"]],["&&"],["Season","2",["50"]]],"connected_events":[],"date":[]},"category":"4","settings":{"color":"Cyan","text":"text","hide":false,"hide_full":false,"noprint":false}},{"name":"Autumnal Equinox","description":"The Autmumnal Equinox,\nalso called the Fall equinox is the day between the summer and\nwinter solstices where the day is the exact same length as the night.\nMany western cultures consider it the official start of Autumn.\n","data":{"has_duration":false,"duration":0,"show_first_last":false,"only_happen_once":false,"conditions":[["Season","0",["1"]],["&&"],["Season","2",["50"]]],"connected_events":[],"date":[]},"category":"4","settings":{"color":"Cyan","text":"text","hide":false,"noprint":false}},{"name":"Valentine&#39;s Day","description":"Valentine&#39;s day is a celebration of love and romance that is popular across the world. Many more cynically minded people mosty consider it an attempt to monetize the expecation of romantic gestures on the holiday through gift cards, flowers, chocolate and dates.&lt;br&gt;","data":{"has_duration":false,"duration":0,"show_first_last":false,"only_happen_once":false,"conditions":[["Month","0",["1"]],["&&"],["Day","0",["14"]]],"connected_events":[],"date":[]},"category":"2","settings":{"hide":false,"noprint":false,"color":"Lime","text":"dot"}},{"name":"New Year&#39;s Day","description":"New Year&#39;s day marks the start of a new year on the Gregorian Calendar. It starts when the clock strikes midnight and is often celebrated with fireworks, champagne and kissing.&lt;br&gt;","data":{"has_duration":false,"duration":0,"show_first_last":false,"only_happen_once":false,"conditions":[["Day","7",["1"]]],"connected_events":[],"date":[]},"category":"1","settings":{"hide":false,"noprint":false,"color":"Orange","text":"dot"}},{"name":"Halloween","description":"&lt;p&gt;Halloween is holiday popular in the US, Canada and Ireland that has gradually been adopted by more and more countries. It is often celebrated by people dressing up, usually as something scary. Children will often go from door to door shouting &quot;trick or treat&quot; in the hopes of receiving candy, while adults tend to go to parties.&lt;br&gt;&lt;&#x2F;p&gt;","data":{"has_duration":false,"duration":0,"show_first_last":false,"only_happen_once":false,"conditions":[["Month","0",["9"]],["&&"],["Day","0",["31"]]],"connected_events":[],"date":[]},"category":"1","settings":{"hide":false,"noprint":false,"color":"Orange","text":"dot"}},{"name":"Paschal Full Moon","description":"The first full moon after march 21st, which is considered the fixed date for the spring equinox.&lt;br&gt;","data":{"has_duration":false,"duration":0,"show_first_last":false,"only_happen_once":true,"conditions":[["",[["",[["Month","0",["2"]],["&&"],["Day","2",["21"]]]],["||"],["",[["Month","0",["3"]],["&&"],["Day","5",["21"]]]]]],["&&"],["Moons","0",["0","15"]]],"connected_events":[],"date":[]},"category":"-1","settings":{"color":"Purple","text":"text","hide":false,"hide_full":true,"noprint":false}},{"name":"Easter","description":"<p>Easter is considered the most important feast for Christians, \ncelebrating the resurrection of Christ. It is classed as a moveable \nfeast occurring on the first full moon after the spring equinox, which \nis considered to be fixed at March 21st for the sake of computing the \ndate.</p>","data":{"has_duration":false,"duration":0,"show_first_last":false,"only_happen_once":false,"conditions":[["Events","5",[0,"6"]],["&&"],["Weekday","0",["7"]]],"connected_events":[9]},"category":"0","settings":{"hide":false,"noprint":false,"color":"Blue-Grey","text":"dot"}},{"name":"Easter Monday","description":"The monday following the Easter Sunday is often considered part of the Easter Celebration and is a free day in many countries with a strong Christian tradition.&lt;br&gt;","data":{"has_duration":false,"duration":0,"show_first_last":false,"only_happen_once":false,"conditions":[["Events","0",[0,"1"]]],"connected_events":[10],"date":[]},"category":"0","settings":{"hide":false,"noprint":false,"color":"Blue-Grey","text":"dot"}},{"name":"Good Friday","description":"Good Friday is the friday preceding Easter. It comemmorates the crucifixion of Christ according to the Bible.&lt;br&gt;","data":{"has_duration":false,"duration":0,"show_first_last":false,"only_happen_once":false,"conditions":[["Events","1",[0,"2"]]],"connected_events":[10],"date":[]},"category":"0","settings":{"hide":false,"noprint":false,"color":"Blue-Grey","text":"dot"}}]}}
	},
	'Forgotten Realms': {
		'dynamic_data': {'year':1,'timespan':0,'day':0,'epoch':0,'custom_location':false,'location':'Equatorial'},
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
						'offset':0
					},
					{
						'name':'Midwinter',
						'type':'intercalary',
						'length':1,
						'interval':1,
						'offset':0
					},
					{
						'name':'Alturiak (The Claw of Winter)',
						'type':'month',
						'length':30,
						'interval':1,
						'offset':0
					},
					{
						'name':'Ches (The Claw of the Sunsets)',
						'type':'month',
						'length':30,
						'interval':1,
						'offset':0
					},
					{
						'name':'Tarsakh (The Claw of Storms)',
						'type':'month',
						'length':30,
						'interval':1,
						'offset':0
					},
					{
						'name':'Greengrass',
						'type':'intercalary',
						'length':1,
						'interval':1,
						'offset':0
					},
					{
						'name':'Mirtul (The Melting)',
						'type':'month',
						'length':30,
						'interval':1,
						'offset':0
					},
					{
						'name':'Kythorn (The Time of Flowers)',
						'type':'month',
						'length':30,
						'interval':1,
						'offset':0
					},
					{
						'name':'Flamerule (Summertide)',
						'type':'month',
						'length':30,
						'interval':1,
						'offset':0
					},
					{
						'name':'Midsummer',
						'type':'intercalary',
						'length':1,
						'interval':1,
						'offset':0
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
						'offset':0
					},
					{
						'name':'Eleint (The Fading)',
						'type':'month',
						'length':30,
						'interval':1,
						'offset':0
					},
					{
						'name':'Highharvestide',
						'type':'intercalary',
						'length':1,
						'interval':1,
						'offset':0
					},
					{
						'name':'Marpenoth (Leaffall)',
						'type':'month',
						'length':30,
						'interval':1,
						'offset':0
					},
					{
						'name':'Uktar (The Rotting)',
						'type':'month',
						'length':30,
						'interval':1,
						'offset':0
					},
					{
						'name':'The Feast of the Moon',
						'type':'intercalary',
						'length':1,
						'interval':1,
						'offset':0
					},
					{
						'name':'Nightal (The Drawing Down)',
						'type':'month',
						'length':30,
						'interval':1,
						'offset':0
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
	},
	"Exandria/Tal'Dorei":{
		'dynamic_data': {"year":835,"month":0,"day":16,"epoch":273596,"custom_location":false,"location":"Cool and Rainy","timespan":1,"hour":0,"minute":0},
		'static_data': {"year_data":{"first_day":1,"overflow":false,"global_week":["Miresen","Grissen","Whelsen","Conthsen","Folsen","Yulisen","Da&#39;leysen"],"timespans":[{"name":"Horisal","type":"month","length":29,"interval":1,"offset":0},{"name":"Misuthar","type":"month","length":30,"interval":1,"offset":0},{"name":"Dualahei","type":"month","length":30,"interval":1,"offset":0},{"name":"Thunsheer","type":"month","length":31,"interval":1,"offset":0},{"name":"Unndilar","type":"month","length":28,"interval":1,"offset":0},{"name":"Brussendar","type":"month","length":31,"interval":1,"offset":0},{"name":"Sydenstar","type":"month","length":32,"interval":1,"offset":0},{"name":"Fessuran","type":"month","length":29,"interval":1,"offset":0},{"name":"Quen&#39;pillar","type":"month","length":27,"interval":1,"offset":0},{"name":"Cuersaar","type":"month","length":29,"interval":1,"offset":0},{"name":"Duscar","type":"month","length":32,"interval":1,"offset":0}],"leap_days":[]},"moons":[{"name":"Moon","cycle":29.8181,"shift":5.9986,"granularity":24,"color":"#ffffff","hidden":false},{"name":"Red Moon","cycle":16,"shift":-3.125,"granularity":16,"color":"#d15858","hidden":false}],"clock":{"enabled":true,"hours":24,"minutes":60,"offset":0},"seasons":{"data":[{"name":"Winter","time":{"sunrise":{"hour":10,"minute":0},"sunset":{"hour":16,"minute":0}},"transition_length":164,"duration":0},{"name":"Summer","time":{"sunrise":{"hour":7,"minute":0},"sunset":{"hour":21,"minute":0}},"transition_length":164,"duration":0}],"locations":[],"global_settings":{"season_offset":-11,"weather_offset":33,"seed":755201528,"temp_sys":"both_i","wind_sys":"both","cinematic":true,"enable_weather":true}},"eras":[{"name":"The Age of Arcanum","abbreviation":"","description":"","settings":{"show_as_event":false,"event_category":null,"ends_year":false,"restart":false},"date":{"year":-1500,"timespan":0,"day":1,"era_year":-1500,"epoch":-492000}},{"name":"The Calamity","abbreviation":"","description":"","settings":{"show_as_event":false,"event_category":null,"ends_year":false,"restart":false},"date":{"year":-665,"timespan":0,"day":1,"era_year":-665,"epoch":-218120}},{"name":"Post-Divergence","abbreviation":"PD","description":"<p>Much time has passed since, and the world has been reborn once again.Â  The gods still exhibit their influence and guidance from beyond the Divine Gate, bestowing their knowledge and power to their most devout worshipers, but the path of mortals is now their own to make.</p>","settings":{"show_as_event":false,"event_category":null,"ends_year":false,"restart":false},"date":{"year":1,"timespan":0,"day":1,"era_year":1,"epoch":0}}],"settings":{"layout":"grid","show_current_month":false,"show_era_abbreviation":true,"allow_view":true,"only_backwards":true,"only_reveal_today":false,"hide_moons":false,"hide_clock":false,"hide_events":false,"hide_eras":false,"hide_all_weather":false,"hide_future_weather":false,"add_month_number":true,"add_year_day_number":false},"cycles":{"format":"","data":[]},"event_data":{"categories":[],"events":[{"name":"New Dawn","description":"<p>The first day of the new year is also the holy day of the Changebringer, as the old year gives way to a new path. Emon celebrates New Dawn with a grand midnight feast, which commonly features a short play celebrating the changes witnessed in the past year.</p>","data":{"length":1,"show_start_end":false,"show_first_last":false,"conditions":[["Month","0",["0"]],["&&"],["Day","0",["1"]]]},"category":null,"settings":{"color":"Dark-Solid","text":"text","hide":false,"noprint":false}},{"name":"Hillsgold","description":"<p><em>No information on this event is available.</em></p>","data":{"has_duration":false,"duration":0,"show_first_last":false,"only_happen_once":false,"conditions":[["Month","0",["0"]],["&&"],["Day","0",["27"]]],"connected_events":[]},"category":null,"settings":{"color":"Dark-Solid","text":"text","hide":false,"hide_full":false,"noprint":false}},{"name":"Day of Challenging","description":"<p>The holy day of the Stormlord is one of the most raucous holidays in Emon. Thousands of spectators attend the annual Godsbrawl, which is held in the fighting ring within the Temple of the Stormlord. The people root for their deity's favored champion, and there is a fierce (yet friendly) rivalry between the Champion of the Stormlord and the Champion of the Platinum Dragon. The winner earns the title of \"Supreme Champion\" for an entire year.</p>","data":{"length":1,"show_start_end":false,"show_first_last":false,"conditions":[["Month","0",["1"]],["&&"],["Day","0",["7"]]]},"category":null,"settings":{"color":"Dark-Solid","text":"text","hide":false,"noprint":false}},{"name":"Renewal Festival","description":"<p>Though the Archeart is the god of spring, the peak of the spring season is the holy day of the Wildmother. The people in the southern wilds of Tal'Dorei celebrate the Wildmother's strength by journeying to a place of great natural beauty. This could be the top of a mountainous waterfall, the center of a desert, or even an old and peaceful city park (such as Azalea Street Park in Emon). Though Emon rarely celebrates Wild's Grandeur, the few who do will plant trees in observance of the holiday.</p>","data":{"length":1,"show_start_end":false,"show_first_last":false,"conditions":[["Month","0",["2"]],["&&"],["Day","0",["13"]]]},"category":null,"settings":{"color":"Dark-Solid","text":"text","hide":false,"noprint":false}},{"name":"Wild&#39;s Grandeur","description":"<p><em>No information on this event is available.</em></p>","data":{"has_duration":false,"duration":0,"show_first_last":false,"only_happen_once":false,"conditions":[["Month","0",["2"]],["&&"],["Day","0",["20"]]],"connected_events":[]},"category":null,"settings":{"color":"Dark-Solid","text":"text","hide":false,"hide_full":false,"noprint":false}},{"name":"Harvest&#39;s Rise","description":"<p><em>No information on this event is available.</em></p>","data":{"has_duration":false,"duration":0,"show_first_last":false,"only_happen_once":false,"conditions":[["Month","0",["3"]],["&&"],["Day","0",["11"]]],"connected_events":[]},"category":null,"settings":{"color":"Dark-Solid","text":"text","hide":false,"hide_full":false,"noprint":false}},{"name":"Merryfrond&#39;s Day","description":"<p><em>No information on this event is available.</em></p>","data":{"has_duration":false,"duration":0,"show_first_last":false,"only_happen_once":false,"conditions":[["Month","0",["3"]],["&&"],["Day","0",["31"]]],"connected_events":[]},"category":null,"settings":{"color":"Dark-Solid","text":"text","hide":false,"hide_full":false,"noprint":false}},{"name":"Deep Solace","description":"<p>The holy day of The Allhammer is celebrated by especially devout followers in isolation. They meditate on the meaning of family and how they may be better mothers, fathers, siblings, and children. Dwarven communities, such as Kraghammer, celebrate with a full day of feasting and drinking.</p>","data":{"has_duration":false,"duration":0,"show_first_last":false,"only_happen_once":false,"conditions":[["Month","0",["4"]],["&&"],["Day","0",["8"]]],"connected_events":[]},"category":null,"settings":{"color":"Dark-Solid","text":"text","hide":false,"hide_full":false,"noprint":false}},{"name":"Zenith","description":"<p><em>No information on this event is available.</em></p>","data":{"has_duration":false,"duration":0,"show_first_last":false,"only_happen_once":false,"conditions":[["Month","0",["4"]],["&&"],["Day","0",["26"]]],"connected_events":[]},"category":null,"settings":{"color":"Dark-Solid","text":"text","hide":false,"hide_full":false,"noprint":false}},{"name":"Artisan&#39;s Faire","description":"<p><em>No information on this event is available.</em></p>","data":{"has_duration":false,"duration":0,"show_first_last":false,"only_happen_once":false,"conditions":[["Month","0",["5"]],["&&"],["Day","0",["15"]]],"connected_events":[]},"category":null,"settings":{"color":"Dark-Solid","text":"text","hide":false,"hide_full":false,"noprint":false}},{"name":"Elvendawn","description":"<p>The holy day of the Archeart celebrates the first emergence of the Elves into Exandria from the Feywild. In Syngorn, the Elves open small doorways into the Feywild and celebrate alongside the wild fey with uncharacteristic vigor.</p>","data":{"has_duration":false,"duration":0,"show_first_last":false,"only_happen_once":false,"conditions":[["Month","0",["5"]],["&&"],["Day","0",["20"]]],"connected_events":[]},"category":"-1","settings":{"color":"Dark-Solid","text":"text","hide":false,"hide_full":false,"noprint":false}},{"name":"Highsummer","description":"<p>The holy day of the Dawnfather is the peak of the summer season. Emon celebrates with an entire week of gift-giving and feasting, ending at midnight on the 21st of Sydenstar (the anniversary of the Battle of the Umbra Hills, where Zan Tal'Dorei dethroned Trist Drassig). Whitestone (where the Dawnfather is the city's patron god) celebrates with gift-giving and a festival of lights around the Sun Tree. Due to the Briarwood occupation, money is thin, so most Whitestone folk choose to recount the small things they are thankful for, rather than buy gifts.</p>","data":{"has_duration":false,"duration":0,"show_first_last":false,"only_happen_once":false,"conditions":[["Month","0",["6"]],["&&"],["Day","0",["7"]]],"connected_events":[]},"category":"-1","settings":{"color":"Dark-Solid","text":"text","hide":false,"hide_full":false,"noprint":false}},{"name":"Morn of Largesse","description":"<p><em>No information on this event is available.</em></p>","data":{"has_duration":false,"duration":0,"show_first_last":false,"only_happen_once":false,"conditions":[["Month","0",["6"]],["&&"],["Day","0",["14"]]],"connected_events":[]},"category":"-1","settings":{"color":"Dark-Solid","text":"text","hide":false,"hide_full":false,"noprint":false}},{"name":"Harvest&#39;s Close","description":"<p><em>No information on this event is available.</em></p>","data":{"has_duration":false,"duration":0,"show_first_last":false,"only_happen_once":false,"conditions":[["Month","0",["7"]],["&&"],["Day","0",["3"]]],"connected_events":[]},"category":"-1","settings":{"color":"Dark-Solid","text":"text","hide":false,"hide_full":false,"noprint":false}},{"name":"The Hazel Festival","description":"<p><em>No information on this event is available.</em></p>","data":{"has_duration":false,"duration":0,"show_first_last":false,"only_happen_once":false,"conditions":[["Month","0",["8"]],["&&"],["Day","0",["10"]]],"connected_events":[]},"category":"-1","settings":{"color":"Dark-Solid","text":"text","hide":false,"hide_full":false,"noprint":false}},{"name":"Civilization&#39;s Dawn","description":"<p>The holy day of the Lawbearer is the peak of the autumn season. Emon celebrates with a great bonfire in the square of each neighborhood, around which each community dances and gives gifts.</p>","data":{"has_duration":false,"duration":0,"show_first_last":false,"only_happen_once":false,"conditions":[["Month","0",["8"]],["&&"],["Day","0",["22"]]],"connected_events":[]},"category":"-1","settings":{"color":"Dark-Solid","text":"text","hide":false,"hide_full":false,"noprint":false}},{"name":"Night of Ascension","description":"<p>Though the actual date of her rise to divinity is unclear, the holy day of the Matron of Ravens is nonetheless celebrated as the day of her apotheosis. Though most in Emon see this celebration of the dead as unnerving and macabre, the followers of the Matron of Ravens believe that the honored dead would prefer to be venerated with cheer, not misery.</p>","data":{"length":1,"show_start_end":false,"show_first_last":false,"conditions":[["Month","0",["9"]],["&&"],["Day","0",["13"]]]},"category":"-1","settings":{"color":"Dark-Solid","text":"text","hide":false,"noprint":false}},{"name":"Zan&#39;s Cup","description":"<p><em>No information on this event is available.</em></p>","data":{"has_duration":false,"duration":0,"show_first_last":false,"only_happen_once":false,"conditions":[["Month","0",["9"]],["&&"],["Day","0",["21"]]],"connected_events":[]},"category":"-1","settings":{"color":"Dark-Solid","text":"text","hide":false,"hide_full":false,"noprint":false}},{"name":"Barren Eve","description":"<p><em>No information on this event is available.</em></p>","data":{"has_duration":false,"duration":0,"show_first_last":false,"only_happen_once":false,"conditions":[["Month","0",["10"]],["&&"],["Day","0",["2"]]],"connected_events":[]},"category":"-1","settings":{"color":"Dark-Solid","text":"text","hide":false,"hide_full":false,"noprint":false}},{"name":"Embertide","description":"<p>The holy day of the Platinum Dragon is a day of remembrance. Solemnity and respect are shown to those who have fallen in the defense of others.</p>","data":{"has_duration":false,"duration":0,"show_first_last":false,"only_happen_once":false,"conditions":[["Month","0",["10"]],["&&"],["Day","0",["5"]]],"connected_events":[]},"category":"-1","settings":{"color":"Dark-Solid","text":"text","hide":false,"hide_full":false,"noprint":false}},{"name":"Winter&#39;s Crest","description":"<p>This day celebrates the freedom of Tal'Dorei from Errevon the Rimelord. It is the peak of the winter season, so devout followers of the Matron of Ravens (as the goddess of winter) consider it to be one of her holy days. However, in most of the land, people see Winter's Crest as a secular holiday, often celebrated with omnipresent music in public areas, lavish gift-giving to relatives and loved ones, and the cutting and decorating of trees placed indoors. The Sun Tree in Whitestone is often decorated with lights and other baubles for Winter's Crest. Winter's Crest is also when the barrier between planes is at its thinnest, as seen when Raishan was able to tear open the rift to the Elemental Plane of Fire and allow Thordak back into Exandria.</p>","data":{"has_duration":false,"duration":0,"show_first_last":false,"only_happen_once":false,"conditions":[["Month","0",["10"]],["&&"],["Day","0",["20"]]],"connected_events":[]},"category":"-1","settings":{"color":"Dark-Solid","text":"text","hide":false,"hide_full":false,"noprint":false}}]}}
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
		}else if(calendar.year_len){
			var source = 'donjon';
		}else if(calendar.month_len[0] !== undefined){
			var source = '1.0';
		}

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

	var calendar_name = escapeHtml(unescapeHtml(calendar_name.name));

	if(calendar.static_data.year_data.global_week !== undefined){
		for(var i = 0; i < calendar.static_data.year_data.global_week.length; i++){
			static_data.year_data.global_week.push(escapeHtml(unescapeHtml(calendar.static_data.year_data.global_week[i])).toString());
		}
	}

	if(calendar.static_data.year_data.timespans !== undefined){

		for(var i = 0; i < calendar.static_data.year_data.timespans.length; i++){
			
			var timespan = {};
			var current_timespan = calendar.static_data.year_data.timespans[i];
			

			if(current_timespan.name !== undefined){
				timespan.name = escapeHtml(unescapeHtml(current_timespan.name)).toString();
			}else{
				throw `Timespan ${i+1} does not have name data!`;
			}
			
			if(current_timespan.type === 'month' || current_timespan.type === 'intercalary'){
				timespan.type = escapeHtml(unescapeHtml(current_timespan.type).toString())
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
					timespan.push(escapeHtml(current_timespan.week[j]))
				}
			}

			static_data.year_data.timespans.push(timespan);

		}

	}

	if(calendar.static_data.year_data.leap_days !== undefined){

		for(var i = 0; i < calendar.static_data.year_data.leap_days.length; i++){
			
			var leap_day = {};
			var current_leap_day = calendar.static_data.year_data.leap_days[i];

			if(current_leap_day.name !== undefined){
				leap_day.name = escapeHtml(unescapeHtml(current_leap_day.name)).toString();
			}else{
				throw `Leap day ${i+1} does not have name data!`;
			}
			
			if(current_leap_day.intercalary !== undefined && typeof current_leap_day.intercalary === "boolean"){
				leap_day.intercalary = current_leap_day.intercalary
			}else{
				throw `${leap_day.name} has invalid intercalary setting!`;
			}

			if(current_leap_day.timespan && !isNaN(Number(current_leap_day.timespan))){
				leap_day.timespan = Number(current_leap_day.timespan)
			}else{
				throw `${leap_day.name} has invalid timespan selection!`;
			}
			
			if(current_leap_day.adds_week_day !== undefined){
				if(typeof current_leap_day.adds_week_day === "boolean"){
					leap_day.adds_week_day = current_leap_day.adds_week_day
				}else{
					throw `${leap_day.name} has invalid add week day setting!`;
				}
			}
			
			if(current_leap_day.removes_week_day !== undefined){
				if(typeof current_leap_day.removes_week_day === "boolean"){
					leap_day.removes_week_day = current_leap_day.removes_week_day
				}else{
					throw `${leap_day.name} has invalid remove week day setting!`;
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
				for(var i = 0; i < intervals.length; i++){
					if(!local_regex.test(intervals[i])){
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

	if(calendar.static_data.moons !== undefined){

		for(var i = 0; i < calendar.static_data.moons.length; i++){
			
			var moon = {};
			var current_moon = calendar.static_data.moons[i];

			if(current_moon.name !== undefined){
				moon.name = escapeHtml(unescapeHtml(current_moon.name)).toString();
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

					if(granularity > 32){
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
				if(current_moon.granularity > 32){
					throw `${moon.name} has too high granularity! (32 max)`
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


	if(calendar.static_data.clock !== undefined){

		if(calendar.static_data.clock.enabled !== undefined && typeof calendar.static_data.clock.enabled === "boolean"){
			static_data.clock.enabled = calendar.static_data.clock.enabled
		}else{
			throw `Clock has invalid enabled property!`;
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

	}

	if(calendar.static_data.seasons !== undefined){

		if(calendar.static_data.seasons.data !== undefined){

			for(var i = 0; i < calendar.static_data.seasons.data.length; i++){

				var season = {}
				var current_season = calendar.static_data.seasons.data[i];
				
				if(current_season.name !== undefined){
					season.name = escapeHtml(unescapeHtml(current_season.name)).toString();
				}else{
					throw `Season ${i+1} does not have name data!`;
				}

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
					location.name = escapeHtml(unescapeHtml(current_location.name)).toString();
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

		}else{
			throw `Season settings have invalid season global settings!`;
		}
	
	}

	if(calendar.static_data.eras !== undefined){

		if(Array.isArray(calendar.static_data.eras)){

			for(var i = 0; i < calendar.static_data.eras.length; i++){

				var era = {};
				var current_era = calendar.static_data.eras[i];

				if(current_era.name !== undefined){
					era.name = escapeHtml(unescapeHtml(current_era.name)).toString();
				}else{
					throw `Era ${i+1} does not have name data!`;
				}

				if(current_era.abbreviation !== undefined){
					era.abbreviation = escapeHtml(unescapeHtml(current_era.abbreviation)).toString();
				}else{
					throw `${era.name} does not have abbreviation data!`;
				}

				if(current_era.description !== undefined){
					era.description = escapeHtml(unescapeHtml(current_era.description)).toString();
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

	if(calendar.static_data.settings.layout !== undefined && ['grid', 'vertical', 'wide', 'minimalistic'].includes(calendar.static_data.settings.layout)){
		static_data.settings.layout = calendar.static_data.settings.layout;
	}else{
		throw `Setting: layout is invalid!`;
	}

	if(calendar.static_data.settings.show_current_month !== undefined && typeof calendar.static_data.settings.show_current_month === "boolean"){
		static_data.settings.show_current_month = calendar.static_data.settings.show_current_month;
	}else{
		throw `Setting: show_current_month is invalid!`;
	}

	if(calendar.static_data.settings.show_era_abbreviation !== undefined && typeof calendar.static_data.settings.show_era_abbreviation === "boolean"){
		static_data.settings.show_era_abbreviation = calendar.static_data.settings.show_era_abbreviation;
	}else{
		throw `Setting: show_era_abbreviation is invalid!`;
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

	if(calendar.static_data.cycles !== undefined){

		if(calendar.static_data.cycles.format !== undefined){
			static_data.cycles.format = escapeHtml(unescapeHtml(calendar.static_data.cycles.format)).toString();
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

						cycle.names.push(escapeHtml(unescapeHtml(current_cycle.names[j])).toString());

					}

				}else{
					throw `Cycle ${i+1} does not have valid names!`;
				}

				if(current_era.offset !== undefined && !isNaN(Number(current_era.offset))){
					cycle.offset = Number(current_era.offset);
				}else{
					throw `Cycle ${i+1} does not have valid offset!`;
				}

				static_data.cycles.data.push(cycle)

			}

		}else{
			throw `Cycles has invalid data!`;
		}

	}

	if(calendar.static_data.event_data !== undefined){

		if(calendar.static_data.event_data.categories !== undefined && Array.isArray(calendar.static_data.event_data.categories)){

			for(var i = 0; i < calendar.static_data.event_data.categories.length; i++){

				var category = {};
				var current_category = calendar.static_data.event_data.categories[i];

				if(current_category.name !== undefined){
					category.name = escapeHtml(unescapeHtml(current_category.name)).toString();
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
						category.event_settings.color = escapeHtml(unescapeHtml(current_category.event_settings.color)).toString();
					}else{
						throw `${category.name} does not have color event settings!`;
					}

					if(current_category.event_settings.text !== undefined){
						category.event_settings.text = escapeHtml(unescapeHtml(current_category.event_settings.text)).toString();
					}else{
						throw `${category.name} does not have text event settings!`;
					}

					if(current_category.event_settings.hide !== undefined && typeof current_category.event_settings.hide === "boolean"){
						category.event_settings.hide = current_category.event_settings.hide;
					}else{
						throw `${category.name} does not have hide event settings!`;
					}

					if(current_category.event_settings.noprint !== undefined && typeof current_category.event_settings.noprint === "boolean"){
						category.event_settings.noprint = current_category.event_settings.noprint;
					}else{
						throw `${category.name} does not have noprint event settings!`;
					}

				}else{
					throw `${category.name} does not have event settings!`;
				}


				if(current_category.name !== undefined){
					category.name = escapeHtml(unescapeHtml(current_category.name)).toString();
				}else{
					throw `Event category ${i+1} does not have name data!`;
				}

			}

		}else{

			throw `Data has invalid event categories!`;

		}

		if(calendar.static_data.event_data.categories !== undefined && Array.isArray(calendar.static_data.event_data.categories)){

			for(var i = 0; i < calendar.static_data.event_data.events.length; i++){

				var event = {};
				var current_event = calendar.static_data.event_data.events[i];

				if(current_event.name !== undefined){
					event.name = escapeHtml(unescapeHtml(current_event.name)).toString();
				}else{
					throw `Event ${i+1} does not have name data!`;
				}

				if(current_event.description !== undefined){
					event.description = escapeHtml(unescapeHtml(current_event.description)).toString();
				}else{
					throw `${event.name} does not have valid description data!`;
				}

				if(current_event.category !== undefined && !isNaN(Number(current_event.category))){
					event.category = Number(current_event.category);
				}else{
					throw `${event.name} does not have valid category data!`;
				}

				if(current_event.settings !== undefined){

					event.settings = {};

					if(current_event.settings.color !== undefined){
						event.settings.color = escapeHtml(unescapeHtml(current_event.settings.color)).toString();
					}else{
						throw `${event.name} does not have valid color settings!`;
					}

					if(current_event.settings.text !== undefined){
						event.settings.text = escapeHtml(unescapeHtml(current_event.settings.text)).toString();
					}else{
						throw `${event.name} does not have valid text settings!`;
					}

					if(current_event.settings.hide !== undefined && typeof current_event.settings.hide === "boolean"){
						event.settings.hide = current_event.settings.hide;
					}else{
						throw `${event.name} does not have valid hide settings!`;
					}

					if(current_event.settings.hide_full !== undefined && typeof current_event.settings.hide_full === "boolean"){
						event.settings.hide_full = current_event.settings.hide_full;
					}else{
						throw `${event.name} does not have valid hide full settings!`;
					}

					if(current_event.settings.noprint !== undefined && typeof current_event.settings.noprint === "boolean"){
						event.noprint = current_event.noprint;
					}else{
						throw `${event.name} does not have valid noprint settings!`;
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

					if(current_event.data.show_first_last !== undefined && typeof current_event.data.show_first_last === "boolean"){
						event.data.show_first_last = current_event.data.show_first_last;
					}else{
						throw `${event.name} does not have valid show first last data!`;
					}

					if(current_event.data.only_happen_once !== undefined && typeof current_event.data.only_happen_once === "boolean"){
						event.data.only_happen_once = current_event.data.only_happen_once;
					}else{
						throw `${event.name} does not have valid only happen once data!`;
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

					if(current_event.data.duration !== undefined && !isNaN(Number(current_event.data.duration))){
						event.data.duration = Number(current_event.data.duration);
					}else{
						throw `${event.name} does not have valid duration data!`;
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

					// CONTINUE HERE
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
					}

				}else{
					throw `${event.name} does not have valid data!`;
				}

			}

		}else{

			throw `Data has invalid events!`;

		}

	}


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

	if(calendar.dynamic_data.day !== undefined && !isNaN(Number(calendar.dynamic_data.day)) && Number(calendar.dynamic_data.day) > 1){
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
		if(calendar.dynamic_data.location !== undefined && climate_generator.presets[calendar.dynamic_data.location] !== undefined){
			dynamic_data.location = calendar.dynamic_data.location;
		}else{
			throw `Location is invalid (preset doesn't exist)!`;
		}
	}else{
		if(calendar.dynamic_data.location !== undefined && !isNaN(Number(calendar.dynamic_data.location)) && Number(calendar.dynamic_data.location) >= 0 && Number(calendar.dynamic_data.location) < static_data.seasons.locations.length){
			dynamic_data.location = calendar.dynamic_data.location;
		}else{
			throw `Custom location is invalid!`;
		}
	}

	return {
		name: calendar_name,
		dynamic_data: dynamic_data,
		static_data: static_data
	}

}


function process_old_fantasycalendar(calendar, dynamic_data, static_data){

	var calendar_name = escapeHtml(unescapeHtml(calendar.name));

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
			var name = calendar.weekdays[i] ? calendar.weekdays[i] : `Weekday ${i+1}`;
			static_data.year_data.global_week.push(name)
		}

	}else{
		throw `Calendar has week length!`;
	}

	if(calendar.n_months !== undefined && !isNaN(Number(calendar.n_months))){

		for(var i = 0; i < calendar.n_months; i++){
			var name = calendar.months[i] ? escapeHtml(unescapeHtml(calendar.months[i])) : `Month ${i+1}`;
			static_data.year_data.timespans.push({
				'name': name,
				'type': 'month',
				'interval': 1,
				'offset': 0,
				'length': calendar.month_len[name] ? calendar.month_len[name] : calendar.month_len[i]
			});
		}
	
	}else{
		throw `Calendar has number of months!`;
	}

	if(calendar.n_moons !== undefined && !isNaN(Number(calendar.n_moons))){

		for(var i = 0; i < calendar.n_moons; i++){
			var name = calendar.moons[i] ? escapeHtml(unescapeHtml(calendar.moons[i])) : `Moon ${i+1}`;
			static_data.moons.push({
				'name': name,
				'cycle': calendar.lunar_cyc[name] ? calendar.lunar_cyc[name] : calendar.lunar_cyc[i],
				'shift': calendar.lunar_shf[name] ? calendar.lunar_shf[name] : calendar.lunar_shf[i],
				'granularity': calendar.lunar_cyc[name] ? get_moon_granularity(calendar.lunar_cyc[name]) : get_moon_granularity(calendar.lunar_cyc[i]),
				'color': '#ffffff',
				'hidden': false
			});
		}
	
	}else{
		throw `Calendar has number of months!`;
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

function isHex(h) {
	return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(h);
}