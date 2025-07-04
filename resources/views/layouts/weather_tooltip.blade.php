<div
    x-data="weather_tooltip"
    @weather-mouse-enter.window="activate"
    @weather-mouse-leave.window="deactivate"
    @scroll.window="deactivate"
    id='weather_tooltip_box'
    x-ref='weather_tooltip_box'
    x-show="show"
    x-cloak
    :class="{'pointer-events-none' : !show}"
    :style="`left: ${x}px; top: ${y}px; opacity: ${opacity};`"
>
    <div x-show='day.text'>Day Title:</div>
    <div x-show='day.text' x-text='day.text'></div>

    <div x-show='show_moons && day.moons?.length' class='moon_title'>Moons:</div>
    <div x-show='show_moons && day.moons?.length' class='flex justify-content-center flex-wrap'>
        <template x-for="moon in day.moons">
            <svg class="moon"
                :moon_id="moon.index"
                preserveAspectRatio="xMidYMid"
                width="28"
                height="28"
                viewBox="0 0 32 32"
            >
                <circle cx="16" cy="16" r="10" class="lunar_background" :style="`fill: ${moon.color};`" />
                <path class="lunar_shadow" :style="`fill: ${moon.shadow_color};`" x-show="moon.path" :d="moon.path"/>
                <circle cx="16" cy="16" r="10" class="lunar_border"/>
            </svg>
        </template>
    </div>

    <div x-show="has_weather" class='bold-text'>Weather:</div>
    <div x-show='has_weather && epoch_details.weather?.temperature?.cinematic'>
        <span class='bold-text'>Description:</span> <span x-text='epoch_details.weather?.temperature?.cinematic'></span>
    </div>
    <div x-show='has_weather && temperature_ranges.length'>
        <span class='bold-text'>Temperature:</span>
    </div>
    <template x-for="temperature_range in temperature_ranges">
        <div>
            <span x-text="temperature_range"></span>
        </div>
    </template>
    <div x-show='has_weather && wind_direction'>
        <span class='bold-text'>Wind:</span>
        <span x-text='wind_direction'></span>
    </div>
    <div x-show='has_weather && wind_speeds.length'>
        <span x-text='"(" + wind_speeds.join(" | ") + ")"'></span>
    </div>
    <div x-show='has_weather && epoch_details.weather?.precipitation?.key'>
        <span class='bold-text'>Precipitation:</span> <span x-text='epoch_details.weather?.precipitation?.key'></span>
    </div>
    <div x-show='has_weather && epoch_details.weather?.clouds'>
        <span class='bold-text'>Clouds:</span> <span x-text='epoch_details.weather?.clouds'></span>
    </div>
    <div x-show='has_weather && epoch_details.weather?.feature'>
        <span class='bold-text'>Feature:</span> <span x-text='epoch_details.weather?.feature'></span>
    </div>
</div>
