import { ordinal_suffix_of, precisionRound, time_data_to_string } from "./calendar_functions.js";
import _ from "lodash";

function alpha(hex, opacity) {
    return hex + Math.round(opacity * 255).toString(16).padStart(2, '0');
}

let _lightColors, _darkColors;

function buildPalettes() {
    if (_lightColors) return;
    const tc = window.tailwindColors;

    _lightColors = {
        // Day length
        sunrise:         tc.amber[400],
        sunset:          tc.indigo[400],
        daylightFill:    alpha(tc.amber[200], 0.2),

        // Temperature
        tempHigh:        tc.orange[400],
        tempLow:         tc.sky[500],
        tempFill:        alpha(tc.orange[300], 0.15),
        seasonHigh:      tc.red[400],
        seasonLow:       tc.blue[400],

        // Precipitation
        precipIntensity: tc.cyan[500],
        precipChance:    tc.violet[500],
        precipActual:    tc.emerald[500],
        precipFill:      alpha(tc.emerald[400], 0.15),

        // Chart chrome
        gridLine:        'rgba(0, 0, 0, 0.1)',
        tickText:        tc.gray[600],
        legendText:      tc.gray[700],
    };

    _darkColors = {
        // Day length
        sunrise:         tc.amber[300],
        sunset:          tc.indigo[400],
        daylightFill:    alpha(tc.amber[400], 0.15),

        // Temperature
        tempHigh:        tc.orange[400],
        tempLow:         tc.sky[400],
        tempFill:        alpha(tc.orange[400], 0.1),
        seasonHigh:      tc.red[400],
        seasonLow:       tc.blue[400],

        // Precipitation
        precipIntensity: tc.cyan[400],
        precipChance:    tc.violet[400],
        precipActual:    tc.emerald[400],
        precipFill:      alpha(tc.emerald[400], 0.1),

        // Chart chrome
        gridLine:        'rgba(255, 255, 255, 0.1)',
        tickText:        tc.gray[400],
        legendText:      tc.gray[300],
    };
}

const seasonBoundaryPlugin = {
    afterDraw(chart) {
        const boundaries = chart.config.seasonBoundaries;
        if (!boundaries || !boundaries.length) return;

        const ctx = chart.ctx;
        const xScale = chart.scales['x-axis-0'];
        const chartArea = chart.chartArea;
        if (!xScale || !chartArea) return;

        ctx.save();
        for (const { dataIndex, color } of boundaries) {
            const x = xScale.getPixelForValue(undefined, dataIndex);
            if (x < chartArea.left || x > chartArea.right) continue;

            ctx.beginPath();
            ctx.setLineDash([4, 4]);
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = color;
            ctx.moveTo(x, chartArea.top);
            ctx.lineTo(x, chartArea.bottom);
            ctx.stroke();
        }
        ctx.restore();
    }
};

export default () => ({
    visible: false,

    day_length_graph: undefined,
    temperature_graph: undefined,
    precipitation_graph: undefined,

    day_length_graph_data: [],
    temperature_graph_data: [],
    precipitation_graph_data: [],

    color(name) {
        buildPalettes();
        const isDark = document.body.classList.contains('dark');
        return (isDark ? _darkColors : _lightColors)[name];
    },

    get_season_boundary_color(season_index) {
        const seasons = this.$store.calendar.static_data.seasons;
        const season = seasons.data[season_index];
        if (seasons.global_settings.color_enabled && season?.color?.[0]) {
            return alpha(season.color[0], 0.45);
        }
        const isDark = document.body.classList.contains('dark');
        return isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.12)';
    },

    get_default_graph_options() {
        return {
            scales: {
                xAxes: [{
                    display: false,
                    ticks: {
                        callback: (value) => {
                            return value[1];
                        }
                    }
                }],
                yAxes: [{
                    gridLines: {
                        color: this.color('gridLine'),
                    },
                    ticks: {
                        fontColor: this.color('tickText'),
                    }
                }],
            },
            legend: {
                labels: {
                    fontColor: this.color('legendText'),
                }
            },
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'index',
                intersect: false
            },
            elements: {
                point: {
                    radius: 0
                }
            }
        };
    },

    set_weather_graphs_visible(visible) {
        this.visible = visible;
        this.update_graphs();
    },

    resize_graphs() {
        if (!this.visible) return;
        setTimeout(() => {
            this.day_length_graph?.resize();
            this.temperature_graph?.resize();
            this.precipitation_graph?.resize();
        }, 300);
    },

    update_graphs() {
        if (!this.visible) {
            return;
        }
        this.update_day_length_graph();
        this.update_climate_graphs();
    },

    update_graph(graph, datasets, labels) {
        graph.data.labels.pop();
        graph.data.datasets = {};
        graph.data.labels.push(labels);
        graph.data.datasets = datasets;
        graph.update(0);
    },

    create_graph(graph, datasets, labels, options = {}, seasonBoundaries = []) {
        let ctx = graph.getContext('2d');
        let config = {
            type: 'line',
            data: {
                labels,
                datasets
            },
            options: _.merge(_.cloneDeep(this.get_default_graph_options()), options),
            plugins: [seasonBoundaryPlugin],
            seasonBoundaries,
        };
        return new Chart(ctx, config);
    },

    update_day_length_graph() {
        this.day_length_graph_data = [];

        if (!this.$store.calendar.static_data.clock.enabled) {
            return;
        }

        let { start_epoch, end_epoch } = this.$store.calendar.evaluated_static_data.year_data;
        let all_epoch_data = this.$store.calendar.evaluated_static_data?.epoch_data;

        if (!all_epoch_data?.[start_epoch]) {
            return;
        }

        if (!all_epoch_data?.[start_epoch].season) {
            return;
        }

        if (!all_epoch_data?.[start_epoch].season.time.sunrise) {
            return;
        }

        let sunrise_dataset = [];
        let sunset_dataset = [];
        let labels = [];
        let day_length_boundaries = [];
        let prev_season_index = null;

        for (let epoch = start_epoch, i = 0; epoch < end_epoch; epoch++, i++) {
            let epoch_data = all_epoch_data[epoch];

            let season_index = epoch_data.season.season_index;
            if (prev_season_index !== null && season_index !== prev_season_index) {
                day_length_boundaries.push({
                    dataIndex: i,
                    color: this.get_season_boundary_color(season_index),
                });
            }
            prev_season_index = season_index;

            let day = ordinal_suffix_of(epoch_data.day)
            let month_name = epoch_data.timespan_name;
            let year = epoch_data.year !== epoch_data.era_year
                ? `era year ${epoch_data.era_year} (absolute year ${epoch_data.year})`
                : `year ${epoch_data.year}`;

            labels.push([`${day} of ${month_name}, ${year}`]);

            let sunrise = epoch_data.season.time.sunrise;
            let sunset = epoch_data.season.time.sunset;

            sunrise_dataset.push({ x: epoch_data, y: precisionRound(sunrise.data, 2) });
            sunset_dataset.push({ x: epoch_data, y: precisionRound(sunset.data, 2) });
        }

        this.day_length_graph_data = [
            {
                label: 'Sunrise',
                fill: '+1',
                data: sunrise_dataset,
                borderColor: this.color('sunrise'),
                backgroundColor: this.color('daylightFill'),
            },
            {
                label: 'Sunset',
                data: sunset_dataset,
                fill: false,
                borderColor: this.color('sunset'),
            }
        ];

        if (this.day_length_graph) {
            this.day_length_graph.config.seasonBoundaries = day_length_boundaries;
            return this.update_graph(this.day_length_graph, this.day_length_graph_data, labels);
        }

        this.day_length_graph = this.create_graph(this.$refs.day_length_canvas, this.day_length_graph_data, labels, {
            tooltips: {
                callbacks: {
                    label: (item, data) => {
                        let datasetLabel = data.datasets[item.datasetIndex].label || "";
                        let dataPoint = item.yLabel;
                        return datasetLabel + ": " + time_data_to_string(this.$store.calendar.static_data, dataPoint);
                    }
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        suggestedMax: this.$store.calendar.static_data.clock.hours - 1,
                        fontColor: this.color('tickText'),
                        callback: function (value, index, values) {
                            return value + ":00";
                        }
                    },
                    gridLines: {
                        color: this.color('gridLine'),
                    }
                }]
            }
        }, day_length_boundaries);

    },

    update_climate_graphs() {
        this.temperature_graph_data = [];
        this.precipitation_graph_data = [];

        if (!this.$store.calendar.evaluated_static_data.processed_weather) {
            return;
        }

        let { start_epoch, end_epoch } = this.$store.calendar.evaluated_static_data.year_data;
        let all_epoch_data = this.$store.calendar.evaluated_static_data?.epoch_data;

        if (!all_epoch_data?.[start_epoch].weather) {
            return;
        }

        let temperature_high_dataset = [];
        let temperature_low_dataset = [];
        let temperature_season_high_dataset = [];
        let temperature_season_low_dataset = [];

        let precipitation_chance_dataset = [];
        let precipitation_intensity_dataset = [];
        let precipitation_actual_dataset = [];

        let labels = [];
        let climate_boundaries = [];
        let prev_season_index = null;

        let temp_sys = this.$store.calendar.static_data.seasons.global_settings.temp_sys;
        if (temp_sys === "both_i") {
            temp_sys = "imperial";
        } else if (temp_sys === "both_m") {
            temp_sys = "metric";
        }

        for (let epoch = start_epoch, i = 0; epoch < end_epoch; epoch++, i++) {
            let epoch_data = all_epoch_data[epoch];

            if (epoch_data.weather) {
                let season_index = epoch_data.season?.season_index;
                if (prev_season_index !== null && season_index !== undefined && season_index !== prev_season_index) {
                    climate_boundaries.push({
                        dataIndex: labels.length,
                        color: this.get_season_boundary_color(season_index),
                    });
                }
                if (season_index !== undefined) {
                    prev_season_index = season_index;
                }

                let day = ordinal_suffix_of(epoch_data.day)
                let month_name = epoch_data.timespan_name;
                let year = epoch_data.year != epoch_data.era_year ? `era year ${epoch_data.era_year} (absolute year ${epoch_data.year})` : `year ${epoch_data.year}`;

                labels.push([`${day} of ${month_name}, ${year}`]);

                temperature_high_dataset.push({
                    x: epoch_data,
                    y: precisionRound(epoch_data.weather.temperature[temp_sys].value[1], 5)
                });
                temperature_low_dataset.push({
                    x: epoch_data,
                    y: precisionRound(epoch_data.weather.temperature[temp_sys].value[0], 5)
                });
                temperature_season_high_dataset.push({
                    x: epoch_data,
                    y: precisionRound(epoch_data.weather.temperature[temp_sys].high, 5)
                });
                temperature_season_low_dataset.push({
                    x: epoch_data,
                    y: precisionRound(epoch_data.weather.temperature[temp_sys].low, 5)
                });

                precipitation_chance_dataset.push({
                    x: epoch_data,
                    y: precisionRound(epoch_data.weather.precipitation.chance * 100, 5)
                });
                precipitation_intensity_dataset.push({
                    x: epoch_data,
                    y: precisionRound(epoch_data.weather.precipitation.intensity * 100, 5)
                });
                precipitation_actual_dataset.push({
                    x: epoch_data,
                    y: precisionRound(epoch_data.weather.precipitation.actual * 100, 5)
                });
            }
        }

        this.temperature_graph_data = [
            {
                label: `Temperature High (${temp_sys})`,
                fill: "+1",
                data: temperature_high_dataset,
                borderColor: this.color('tempHigh'),
                backgroundColor: this.color('tempFill'),
            },
            {
                label: `Temperature Low (${temp_sys})`,
                fill: false,
                data: temperature_low_dataset,
                borderColor: this.color('tempLow'),
            },
            {
                label: 'Season High',
                fill: false,
                data: temperature_season_high_dataset,
                borderColor: this.color('seasonHigh'),
                borderDash: [5, 5],
            },
            {
                label: 'Season Low',
                fill: false,
                data: temperature_season_low_dataset,
                borderColor: this.color('seasonLow'),
                borderDash: [5, 5],
            }
        ];

        if (this.temperature_graph) {
            this.temperature_graph.config.seasonBoundaries = climate_boundaries;
            return this.update_graph(this.temperature_graph, this.temperature_graph_data, labels);
        } else {
            this.temperature_graph = this.create_graph(this.$refs.temperature_canvas, this.temperature_graph_data, labels, {}, climate_boundaries);
        }

        this.precipitation_graph_data = [
            {
                label: 'Intensity of precipitation',
                fill: false,
                data: precipitation_intensity_dataset,
                borderColor: this.color('precipIntensity'),
            },
            {
                label: 'Chance of precipitation',
                fill: false,
                data: precipitation_chance_dataset,
                borderColor: this.color('precipChance'),
            },
            {
                label: 'Actual precipitation',
                data: precipitation_actual_dataset,
                borderColor: this.color('precipActual'),
                backgroundColor: this.color('precipFill'),
            }
        ];

        if (this.precipitation_graph) {
            this.precipitation_graph.config.seasonBoundaries = climate_boundaries;
            return this.update_graph(this.precipitation_graph, this.precipitation_graph_data, labels);
        } else {
            this.precipitation_graph = this.create_graph(this.$refs.precipitation_canvas, this.precipitation_graph_data, labels, {
                scales: {
                    yAxes: [{
                        ticks: {
                            suggestedMin: 0,
                            suggestedMax: 100
                        }
                    }]
                }
            }, climate_boundaries);
        }
    },
});
