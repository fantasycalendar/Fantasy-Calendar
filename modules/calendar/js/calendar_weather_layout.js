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

const calendar_weather = {

	epoch_data: {},

	tooltip: {

		set_up: function(){

			this.weather_tooltip_box = $('#weather_tooltip_box');
			this.weather_temp_desc = $('.weather_temp_desc');
			if(calendar.seasons.global_settings.cinematic){
				this.weather_temp_desc.css('display', '');
			}else{
				this.weather_temp_desc.css('display', 'none');
			}
			this.weather_temp = $('.weather_temp');
			this.weather_wind = $('.weather_wind');
			this.weather_precip = $('.weather_precip');
			this.weather_clouds = $('.weather_clouds');

		},

		show: function(icon){

			var day_container = icon.closest(".timespan_day");

			var weather_epoch = day_container.attr('epoch');

			var position = '';

			var val = 0;

			if(day_container.innerWidth() < 190){
				if(icon.attr('align') != ""){
					val = clamp(190-day_container.innerWidth(), 0, 70);
					if(icon.attr('align') === "start"){
						position = "+"
					}else{
						position = "-"
					}
				}
			}


			var combined = position+val == "0" ? "" : position+val;
			this.weather_tooltip_box.position({
				my: "center"+combined,
				at: 'top-115',
				of: icon.parent().parent(),
				collision: "none"
			});

			position = position == "+" ? "-" : "+";
			var tooltip_box = document.getElementById("weather_tooltip_box");
			tooltip_box.pseudoStyle("before", "left", "calc(50% "+position+" "+val+"px) !important");
			tooltip_box.pseudoStyle("after", "left", "calc(50% "+position+" "+val+"px)  !important");

			var weather = calendar_weather.epoch_data[weather_epoch].weather;

			var desc = weather.temperature.cinematic;

			var temp_sys = calendar.seasons.global_settings.temp_sys;
			var temp_symbol = temp_sys === "imperial" ? '°F' : '°C';
			var temp = `${precisionRound(weather.temperature[temp_sys].value[0], 1).toString()+temp_symbol} to ${precisionRound(weather.temperature[temp_sys].value[1], 1).toString()+temp_symbol}`;

			this.weather_temp_desc.each(function(){
				$(this).text(desc);
			});

			this.weather_temp.each(function(){
				$(this).text(temp);
			});

			this.weather_wind.each(function(){
				$(this).text(weather.wind_speed + ' ('+weather.wind_direction+')');
			});

			this.weather_precip.each(function(){
				$(this).text(weather.precipitation.key);
			});

			this.weather_clouds.each(function(){
				$(this).text(weather.clouds);
			});
			
			this.weather_tooltip_box.show();
		},

		hide: function(){
			this.weather_tooltip_box.hide();
			this.weather_tooltip_box.css({"top":"", "left":""});
			this.weather_tooltip_box.removeClass();
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

var precipitation_chart;
var temperature_chart;

function evaluate_weather_charts(epoch_data){

	var keys = Object.keys(epoch_data);
	var length = keys.length;

	var temperature = [[],[],[],[]];
	var precipitation = [[], [], []];
	var labels = [];

	var temp_sys = calendar.seasons.global_settings.temp_sys;

	if(epoch_data[keys[0]].weather){

		for(var i = 0; i < length; i++){

			var epoch = epoch_data[keys[i]];

			labels.push([keys[i], ordinal_suffix_of(epoch.day) + " of " + epoch.timespan_name]);

			temperature[0].push({x: keys[i], y: precisionRound(epoch.weather.temperature[temp_sys].value[0], 5)});
			temperature[1].push({x: keys[i], y: precisionRound(epoch.weather.temperature[temp_sys].value[1], 5)});
			temperature[2].push({x: keys[i], y: precisionRound(epoch.weather.temperature[temp_sys].high, 5)});
			temperature[3].push({x: keys[i], y: precisionRound(epoch.weather.temperature[temp_sys].low, 5)});

			precipitation[0].push({x: keys[i], y: precisionRound(epoch.weather.precipitation.chance*100, 5)});
			precipitation[1].push({x: keys[i], y: precisionRound(epoch.weather.precipitation.intensity*100, 5)});
			precipitation[2].push({x: keys[i], y: precisionRound(epoch.weather.precipitation.actual*100, 5)});
		}


		var temperature_datasets = [
			{
				label: 'Temperature high',
				fill: false,
				data: temperature[0],
				borderColor: 'rgba(0, 255, 0, 0.5)',
          		fillBetweenSet: 0,
          		fillBetweenColor: "rgba(5,5,255, 0.2)"
			},
			{
				label: 'Temperature low',
				fill: false,
				data: temperature[1],
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
				borderColor: 'rgba(0, 255, 0, 0.5)'
			}
		];

		if(precipitation_chart !== undefined){
			removeData(precipitation_chart);
			addData(precipitation_chart, labels, precipitation_datasets);
		}else{
			var ctx = $('#precipitation')[0].getContext('2d');
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
		
		if(temperature_chart !== undefined){
			removeData(temperature_chart);
			addData(temperature_chart, labels, temperature_datasets);
		}else{
			var ctx = $('#temperature')[0].getContext('2d');
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

}