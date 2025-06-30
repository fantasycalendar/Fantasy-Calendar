<div x-data="WeatherGraphs" x-cloak x-show='visible'
     @set-weather-graph-visible.window='set_weather_graphs_visible($event.detail)'
     @calendar-updated.window='update_graphs'
>

    <div x-show="day_length_graph_data.length">
        <h3 class='text-center mt-3'>Sunrise and Sunset</h3>
        <canvas x-ref="day_length_canvas"></canvas>
    </div>

    <div x-show="temperature_graph_data.length">
        <h3 class='text-center mt-3'>Temperature</h3>
        <canvas x-ref="temperature_canvas"></canvas>
    </div>

    <div x-show="precipitation_graph_data.length">
        <h3 class='text-center mt-3'>Precipitation</h3>
        <canvas x-ref="precipitation_canvas"></canvas>
    </div>

</div>