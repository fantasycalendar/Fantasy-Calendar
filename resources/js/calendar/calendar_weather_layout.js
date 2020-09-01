var UID = {
	_current: 0,
	getNew: function(){
		this._current++;
		return this._current;
	}
};

HTMLElement.prototype.pseudoStyle = function(element,prop,value){
	var _this = this;
	var _sheetId = "pseudoStyles";
	var _head = document.head || document.getElementsByTagName('head')[0];
	var _sheet = document.getElementById(_sheetId) || document.createElement('style');
	_sheet.id = _sheetId;
	var className = "pseudoStyle" + UID.getNew();

	_this.className +=  " "+className;

	_sheet.innerHTML += " ."+className+":"+element+"{"+prop+":"+value+"}";
	_head.appendChild(_sheet);
	return this;
};

var calendar_weather = {

	epoch_data: {},

	start_epoch: null,
	end_epoch: null,

	processed_weather: true,

	tooltip: {

		set_up: function(){

			this.weather_tooltip_box = $('#weather_tooltip_box');
			this.base_height = parseInt(this.weather_tooltip_box.css('height'));
			this.weather_title = $('.weather_title');
			this.moon_title = $('.moon_title');
			this.moon_container = $('.moon_container');
			this.weather_temp_desc = $('.weather_temp_desc');
			this.weather_temp = $('.weather_temp');
			this.weather_wind = $('.weather_wind');
			this.weather_precip = $('.weather_precip');
			this.weather_clouds = $('.weather_clouds');
			this.weather_feature = $('.weather_feature');
			this.stop_hide = false;
			this.sticky_icon = false;

		},

		sticky: function(icon){

			if(registered_click_callbacks['sticky_weather_ui']){
				return;
			}

			this.sticky_icon = icon;

			this.sticky_icon.addClass('sticky');

			this.stop_hide = true;

			registered_click_callbacks['sticky_weather_ui'] = this.sticky_callback;

		},

		sticky_callback: function(event){

			if($(event.target).closest('#weather_tooltip_box').length == 0 && $(event.target).closest('.sticky').length == 0){

				calendar_weather.tooltip.stop_hide = false;

				calendar_weather.tooltip.hide();

				delete registered_click_callbacks['sticky_weather_ui'];

				calendar_weather.tooltip.sticky_icon.removeClass('sticky');

				if($(event.target).closest('.weather_popup').length != 0){
					calendar_weather.tooltip.show($(event.target).closest('.weather_popup'));
					calendar_weather.tooltip.sticky($(event.target).closest('.weather_popup'));
				}

			}

		},

		show: function(icon){

			if(registered_click_callbacks['sticky_weather_ui']){
				return;
			}

			var day_container = icon.closest(".timespan_day");

			var epoch = day_container.attr('epoch');

			this.moon_title.toggleClass('hidden', !icon.hasClass('moon_popup'));
			this.moon_container.toggleClass('hidden', !icon.hasClass('moon_popup'));

			if(icon.hasClass('moon_popup')){
				this.moon_container.children().first().html(insert_moons(calendar_layouts.epoch_data[epoch]));
			}

			this.stop_hide = false;
			this.sticky_icon = false;

			if(calendar_weather.processed_weather && !icon.hasClass('noweather')){

				this.weather_title.toggleClass('hidden', !icon.hasClass('moon_popup'));
				this.weather_temp_desc.parent().toggleClass('hidden', false);
				this.weather_temp.parent().toggleClass('hidden', false);
				this.weather_wind.parent().toggleClass('hidden', false);
				this.weather_precip.parent().toggleClass('hidden', false);
				this.weather_clouds.parent().toggleClass('hidden', false);
				this.weather_feature.parent().toggleClass('hidden', false);

				if(static_data.seasons.global_settings.cinematic){
					this.weather_temp_desc.parent().css('display', '');
				}else{
					this.weather_temp_desc.parent().css('display', 'none');
				}

				var weather = calendar_weather.epoch_data[epoch].weather;

				var desc = weather.temperature.cinematic;

				var temp_sys = static_data.seasons.global_settings.temp_sys;

				var temp = "";
				if(!static_data.settings.hide_weather_temp || Perms.player_at_least('co-owner')){
					if(temp_sys == 'imperial'){
						temp_symbol = '°F';
						var temp = `${precisionRound(weather.temperature[temp_sys].value[0], 1).toString()+temp_symbol} to ${precisionRound(weather.temperature[temp_sys].value[1], 1).toString()+temp_symbol}`;
					}else if(temp_sys == 'metric'){
						temp_symbol = '°C';
						var temp = `${precisionRound(weather.temperature[temp_sys].value[0], 1).toString()+temp_symbol} to ${precisionRound(weather.temperature[temp_sys].value[1], 1).toString()+temp_symbol}`;
					}else{
						var temp_f = `<span class='newline'>${precisionRound(weather.temperature['imperial'].value[0], 1).toString()}°F to ${precisionRound(weather.temperature['imperial'].value[1], 1).toString()}°F</span>`;
						var temp_c = `<span class='newline'>${precisionRound(weather.temperature['metric'].value[0], 1).toString()}°C to ${precisionRound(weather.temperature['metric'].value[1], 1).toString()}°C</span>`;
						var temp = `${temp_f}${temp_c}`;
					}
				}
				this.weather_temp.toggleClass('newline', (temp_sys == 'both_i' || temp_sys == 'both_m') && (!static_data.settings.hide_weather_temp || Perms.player_at_least('co-owner')));


				var wind_sys = static_data.seasons.global_settings.wind_sys;

				var wind_text = ""
				if(wind_sys == 'both'){
					wind_text = `${weather.wind_speed} (${weather.wind_direction})`;
					if(!static_data.settings.hide_wind_velocity || Perms.player_at_least('co-owner')){
						wind_text += `<span class='newline'>(${weather.wind_velocity.imperial} MPH | ${weather.wind_velocity.metric} KPH)</span>`;
					}
				}else{
					var wind_symbol = wind_sys == "imperial" ? "MPH" : "KPH";
					wind_text = `${weather.wind_speed} (${weather.wind_direction})`
					if(!static_data.settings.hide_wind_velocity || Perms.player_at_least('co-owner')){
						wind_text += `(${weather.wind_velocity[wind_sys]} ${wind_symbol})`;
					}
				}

				this.weather_temp_desc.each(function(){
					$(this).text(desc);
				});

				this.weather_temp.each(function(){
					$(this).html(temp);
				}).parent().toggleClass('hidden', static_data.settings.hide_weather_temp !== undefined && static_data.settings.hide_weather_temp && !Perms.player_at_least('co-owner'));

				this.weather_wind.each(function(){
					$(this).html(wind_text);
				});

				this.weather_precip.each(function(){
					$(this).text(weather.precipitation.key);
				});

				this.weather_clouds.each(function(){
					$(this).text(weather.clouds);
				});

				this.weather_feature.each(function(){
					$(this).text(weather.feature);
				});

				this.weather_feature.parent().toggleClass('hidden', weather.feature == "" ||  weather.feature == "None");

			}else{

				this.weather_title.toggleClass('hidden', true);
				this.weather_temp_desc.parent().toggleClass('hidden', true);
				this.weather_temp.parent().toggleClass('hidden', true);
				this.weather_wind.parent().toggleClass('hidden', true);
				this.weather_precip.parent().toggleClass('hidden', true);
				this.weather_clouds.parent().toggleClass('hidden', true);
				this.weather_feature.parent().toggleClass('hidden', true);
			}

            if((calendar_weather.processed_weather && !icon.hasClass('noweather')) || icon.hasClass('moon_popup')){

				this.popper = new Popper(icon, this.weather_tooltip_box, {
				    placement: 'top',
	                modifiers: {
				        preventOverflow: {
				            boundariesElement: $('#calendar')[0],
				        },
				        offset: {
				            enabled: true,
	                        offset: '0, 14px'
	                    }
	                }
	            });

				this.weather_tooltip_box.show();

			}
		},

		hide: function(){

			document.removeEventListener('click', function(){});

			if(!this.stop_hide){
				this.weather_tooltip_box.hide();
				this.weather_tooltip_box.css({"top":"", "left":""});
				this.weather_tooltip_box.removeClass();
			}
		}

	}

};

function removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets = {};
    chart.update(0);
}

function addData(chart, label, dataset) {
    chart.data.labels.push(label);
    chart.data.datasets = dataset;
    chart.update(0);
}

var day_length_chart;
var precipitation_chart;
var temperature_chart;

function evaluate_day_length_chart(){

	if($('#day_length').length == 0){
		return
	}

	if(day_length_chart !== undefined){
		removeData(day_length_chart);
	}

	if(!static_data.clock.enabled){
		$('#day_length').addClass('hidden');
		return;
	}

	if(calendar_weather.epoch_data[calendar_weather.start_epoch] === undefined){
		$('#day_length').addClass('hidden');
		return;
	}

	if(!calendar_weather.epoch_data[calendar_weather.start_epoch].season){
		$('#day_length').addClass('hidden');
		return;
	}

	if(!calendar_weather.epoch_data[calendar_weather.start_epoch].season.time.sunrise){
		$('#day_length').addClass('hidden');
		return;
	}

	var day_length = [[],[]];
	var labels = [];

	for(var epoch = calendar_weather.start_epoch, i = 0; epoch < calendar_weather.end_epoch; epoch++, i++){

		var epoch_data = calendar_weather.epoch_data[epoch];

		var day = ordinal_suffix_of(epoch_data.day)
		var month_name = epoch_data.timespan_name;
		var year = epoch_data.year != epoch_data.era_year ? `era year ${epoch_data.era_year} (absolute year ${epoch_data.year})` : `year ${epoch_data.year}`;

		labels.push([`${day} of ${month_name}, ${year}`]);

		var sunrise = epoch_data.season.time.sunrise;
		var sunset = epoch_data.season.time.sunset;

		day_length[0].push({x: epoch_data, y: precisionRound(sunrise.data, 2)});
		day_length[1].push({x: epoch_data, y: precisionRound(sunset.data, 2)});

	}

	var day_length_dataset = [
		{
			label: 'Sunrise',
			fill: '+1',
			data: day_length[0],
			borderColor: 'rgba(0, 0, 255, 0.5)',
			backgroundColor: 'rgba(0, 0, 175, 0.1)'
		},
		{
			label: 'Sunset',
			data: day_length[1],
			fill: false,
			borderColor: 'rgba(0, 0, 255, 0.5)'
		}
	];

	$('#day_length').removeClass('hidden');

	if(day_length_chart !== undefined){
		removeData(day_length_chart);
		addData(day_length_chart, labels, day_length_dataset);
	}else{
		var ctx = $('#day_length').find('.chart')[0].getContext('2d');
		day_length_chart = new Chart(ctx, {
			type: 'line',
			data: {
				labels: labels,
				datasets: day_length_dataset
			},
			options: {
				tooltips: {
					mode: 'index',
					intersect: false,
					callbacks: {
						label: function(item, data) {
							var datasetLabel = data.datasets[item.datasetIndex].label || "";
							var dataPoint = item.yLabel;
							return datasetLabel + ": " + time_data_to_string(static_data, dataPoint);
						}
					}
				},
				hover: {
					mode: 'index',
					intersect: false
				},
				scales: {
					xAxes: [{
						display: false,
						ticks: {
							callback: function(value, index, values){
								return value[1];
							}
						}
					}],
					yAxes: [{
						ticks: {
							suggestedMax: static_data.clock.hours-1,
							callback: function(value, index, values) {
								return value+":00";//time_data_to_string(static_data, dataPoint);
							}
						}
					}]
				},
				elements: {
					point:{
						radius: 0
					}
				}
			}
		});
	}

}

function evaluate_weather_charts(){

	if($('#precipitation').length == 0 || $('#temperature').length == 0){
		return;
	}

	if(precipitation_chart !== undefined){
		removeData(precipitation_chart);
	}
	if(temperature_chart !== undefined){
		removeData(temperature_chart);
	}

	if(!calendar_weather.processed_weather){
		$('#temperature').addClass('hidden');
		$('#precipitation').addClass('hidden');
		return;
	}

	if(!calendar_weather.epoch_data[calendar_weather.start_epoch].weather){
		$('#temperature').addClass('hidden');
		$('#precipitation').addClass('hidden');
		return;
	}

	var temperature = [[],[],[],[]];
	var precipitation = [[], [], []];
	var labels = [];

	var temp_sys = static_data.seasons.global_settings.temp_sys;
	if(temp_sys === "both_i"){
		var temp_sys = "imperial";
	}else if(temp_sys === "both_m"){
		var temp_sys = "metric";
	}

	for(var epoch = calendar_weather.start_epoch, i = 0; epoch < calendar_weather.end_epoch; epoch++, i++){

		var epoch_data = calendar_weather.epoch_data[epoch];

		if(epoch_data.weather){

			var day = ordinal_suffix_of(epoch_data.day)
			var month_name = epoch_data.timespan_name;
			var year = epoch_data.year != epoch_data.era_year ? `era year ${epoch_data.era_year} (absolute year ${epoch_data.year})` : `year ${epoch_data.year}`;

			labels.push([`${day} of ${month_name}, ${year}`]);

			temperature[0].push({x: epoch_data, y: precisionRound(epoch_data.weather.temperature[temp_sys].value[0], 5)});
			temperature[1].push({x: epoch_data, y: precisionRound(epoch_data.weather.temperature[temp_sys].value[1], 5)});
			temperature[2].push({x: epoch_data, y: precisionRound(epoch_data.weather.temperature[temp_sys].high, 5)});
			temperature[3].push({x: epoch_data, y: precisionRound(epoch_data.weather.temperature[temp_sys].low, 5)});

			precipitation[0].push({x: epoch_data, y: precisionRound(epoch_data.weather.precipitation.chance*100, 5)});
			precipitation[1].push({x: epoch_data, y: precisionRound(epoch_data.weather.precipitation.intensity*100, 5)});
			precipitation[2].push({x: epoch_data, y: precisionRound(epoch_data.weather.precipitation.actual*100, 5)});

		}

	}


	var temperature_datasets = [
		{
			label: `Temperature High (${temp_sys})`,
			fill: "+1",
			data: temperature[1],
			borderColor: 'rgba(0, 255, 0, 0.5)',
			fillBetweenSet: 0,
			backgroundColor: 'rgba(0, 175, 0, 0.1)',
		},
		{
			label: `Temperature Low (${temp_sys})`,
			fill: false,
			data: temperature[0],
			borderColor: 'rgba(0, 255, 0, 0.5)',
			fillBetweenSet: 0,
			fillBetweenColor: "rgba(5,5,255, 0.2)"
		},
		{
			label: 'Season High',
			fill: false,
			data: temperature[2],
			borderColor: 'rgba(255, 0, 0, 0.5)'
		},
		{
			label: 'Season Low',
			fill: false,
			data: temperature[3],
			borderColor: 'rgba(0, 0, 255, 0.5)'
		}
	];

	var precipitation_datasets = [
		{
			label: 'Intensity of precipitation',
			fill: false,
			data: precipitation[1],
			borderColor: 'rgba(0, 0, 255, 0.5)'
		},
		{
			label: 'Chance of precipitation',
			fill: false,
			data: precipitation[0],
			borderColor: 'rgba(255, 0, 0, 0.5)'
		},
		{
			label: 'Actual precipitation',
			data: precipitation[2],
			borderColor: 'rgba(0, 255, 0, 0.5)',
			backgroundColor: 'rgba(0, 175, 0, 0.1)',
		}
	];

	$('#precipitation').removeClass('hidden');
	if(precipitation_chart !== undefined){
		addData(precipitation_chart, labels, precipitation_datasets);
	}else{
		var ctx = $('#precipitation').find('.chart')[0].getContext('2d');
		precipitation_chart = new Chart(ctx, {
			type: 'line',
			data: {
				labels: labels,
				datasets: precipitation_datasets
			},
			options: {
				tooltips: {
					mode: 'index',
					intersect: false
				},
				hover: {
					mode: 'index',
					intersect: false
				},
				scales: {
					xAxes: [{
						display: false,
						ticks: {
							callback: function(value, index, values){
								return value[1];
							}
						}
					}],
					yAxes: [{
						ticks: {
							suggestedMin: 0,
							suggestedMax: 100
						}
					}]
				},
				elements: {
					point:{
						radius: 0
					}
				}
			}
		});
	}

	$('#temperature').removeClass('hidden');
	if(temperature_chart !== undefined){
		addData(temperature_chart, labels, temperature_datasets);
	}else{
		var ctx = $('#temperature').find('.chart')[0].getContext('2d');
		temperature_chart = new Chart(ctx, {
			type: 'line',
			data: {
				labels: labels,
				datasets: temperature_datasets
			},
			options: {
				tooltips: {
					mode: 'index',
					intersect: false
				},
				hover: {
					mode: 'index',
					intersect: false
				},
				scales: {
					xAxes: [{
						display: false,
						ticks: {
							callback: function(value, index, values){
								return value[1];
							}
						}
					}]
				},
				elements: {
					point:{
						radius: 0
					}
				}
			}
		});
	}

}
