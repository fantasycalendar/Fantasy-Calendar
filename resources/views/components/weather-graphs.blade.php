<div x-data="WeatherGraphs" x-cloak x-show='visible'
     @set-weather-graph-visible.window='set_weather_graphs_visible($event.detail)'
     @calendar-updated.window='update_graphs'
     class="space-y-12 px-4 py-6"
>

    <div x-show="day_length_graph_data.length">
        <h3 class='text-center mb-2 text-lg font-semibold'>Sunrise and Sunset</h3>
        <canvas x-ref="day_length_canvas"></canvas>
    </div>

    <div x-show="temperature_graph_data.length">
        <h3 class='text-center mb-2 text-lg font-semibold'>Temperature</h3>
        <canvas x-ref="temperature_canvas"></canvas>
    </div>

    <div x-show="precipitation_graph_data.length">
        <h3 class='text-center mb-2 text-lg font-semibold'>Precipitation</h3>
        <canvas x-ref="precipitation_canvas"></canvas>
    </div>

</div>