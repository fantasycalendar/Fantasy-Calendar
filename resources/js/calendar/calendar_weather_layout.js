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

var climate_charts = {

	day_length: undefined,
	precipitation: undefined,
	temperature: undefined,

	day_length_chart: undefined,
	precipitation_chart: undefined,
	temperature_chart: undefined,

	data_changed: false,

	get active_view(){
		if(this._active_view === undefined){
			this._active_view = false;
		}
		return this._active_view;
	},

	set active_view(active_view){
		this._active_view = active_view;
		if(this.data_changed){
			this.evaluate_day_length_chart();
			this.evaluate_weather_charts();
		}
	},

	evaluate_day_length_chart: function(){

		if(!this.active_view){
			this.data_changed = true;
			return;
		}
		this.data_changed = false;

		if(this.day_length === undefined){
			if($('#day_length')){
				this.day_length = $('#day_length');
			}else{
				return;
			}
		}

		if(this.day_length_chart !== undefined){
			removeData(this.day_length_chart);
		}

		if(!static_data.clock.enabled){
			this.day_length.addClass('hidden');
			return;
		}

		if(calendar_weather.epoch_data[calendar_weather.start_epoch] === undefined){
			this.day_length.addClass('hidden');
			return;
		}

		if(!calendar_weather.epoch_data[calendar_weather.start_epoch].season){
			this.day_length.addClass('hidden');
			return;
		}

		if(!calendar_weather.epoch_data[calendar_weather.start_epoch].season.time.sunrise){
			this.day_length.addClass('hidden');
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

		this.day_length.removeClass('hidden');

		if(this.day_length_chart !== undefined){
			removeData(this.day_length_chart);
			addData(this.day_length_chart, labels, day_length_dataset);
		}else{
			var ctx = this.day_length.find('.chart')[0].getContext('2d');
			this.day_length_chart = new Chart(ctx, {
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
	},

	evaluate_weather_charts: function(){

		if(!this.active_view){
			this.data_changed = true;
			return;
		}
		this.data_changed = false;

		if(this.precipitation === undefined){
			if($('#precipitation')){
				this.precipitation = $('#precipitation');
			}else{
				return;
			}
		}

		if(this.temperature === undefined){
			if($('#temperature')){
				this.temperature = $('#temperature');
			}else{
				return;
			}
		}

		if(this.precipitation_chart !== undefined){
			removeData(this.precipitation_chart);
		}
		if(this.temperature_chart !== undefined){
			removeData(this.temperature_chart);
		}

		if(!calendar_weather.processed_weather){
			this.temperature.addClass('hidden');
			this.precipitation.addClass('hidden');
			return;
		}

		if(!calendar_weather.epoch_data[calendar_weather.start_epoch].weather){
			this.temperature.addClass('hidden');
			this.precipitation.addClass('hidden');
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

		this.precipitation.removeClass('hidden');
		if(this.precipitation_chart !== undefined){
			addData(this.precipitation_chart, labels, precipitation_datasets);
		}else{
			var ctx = this.precipitation.find('.chart')[0].getContext('2d');
			this.precipitation_chart = new Chart(ctx, {
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

		this.temperature.removeClass('hidden');
		if(this.temperature_chart !== undefined){
			addData(this.temperature_chart, labels, temperature_datasets);
		}else{
			var ctx = this.temperature.find('.chart')[0].getContext('2d');
			this.temperature_chart = new Chart(ctx, {
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
}
