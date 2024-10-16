<div
	x-data="weather_tooltip"
	@weather-mouse-enter.window="activate"
	@weather-mouse-leave.window="deactivate"
	@scroll.window="deactivate"
	id='weather_tooltip_box'
	x-ref='weather_tooltip_box'
	x-show="show"
	x-cloak
	:style="`left: ${x}px; top: ${y}px; opacity: ${opacity}; pointer-events: none;`"
>
	<div x-show='day.text'>Day Title:</div>
	<div x-show='day.text' x-text='day.text'></div>
	<div x-show='day.moons?.length' class='moon_title'>Moons:</div>
	<div class='flex justify-content-center flex-wrap'>mooooons</div>
	<div x-show="has_weather" class='weather_title'>Weather:</div>
	<div x-show='epoch_details.weather?.temp_desc'><span class='bold-text'>Description:</span> <span x-text='epoch_details.weather?.temp_desc'></span></div>
	<div x-show='temperature_ranges.length'><span class='bold-text'>Temperature:</span></div>
	<div x-show='epoch_details.weather?.wind'><span class='bold-text'>Wind:</span> <span x-text='epoch_details.weather?.wind'></span></div>
	<div x-show='epoch_details.weather?.precipitation?.key'><span class='bold-text'>Precipitation:</span> <span x-text='epoch_details.weather?.precipitation?.key'></span></div>
	<div x-show='epoch_details.weather?.clouds'><span class='bold-text'>Clouds:</span> <span x-text='epoch_details.weather?.clouds'></span></div>
	<div x-show='epoch_details.weather?.feature'><span class='bold-text'>Feature:</span> <span x-text='epoch_details.weather?.feature'></span></div>
</div>
