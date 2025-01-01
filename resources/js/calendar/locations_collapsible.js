import CollapsibleComponent from "./collapsible_component.js";
import { preset_data } from "./calendar_variables.js";
import _ from "lodash";
import {
    fahrenheit_to_celcius,
    fract,
    lerp,
    precisionRound
} from "./calendar_functions.js";

class LocationsCollapsible extends CollapsibleComponent {

    deleting = -1;
    name = "";

    seasons = [];
    locations = [];
    season_settings = {};
    clock = {};
    current_location = "0";
    using_custom_location = false;

    preset_locations = [];
    can_use_preset_locations = false;

    inboundProperties = {
        "seasons": "static_data.seasons.data",
        "locations": "static_data.seasons.locations",
        "season_settings": "static_data.seasons.global_settings",
        "clock": "static_data.clock",
        "using_custom_location": "dynamic_data.custom_location",
        "current_location": "dynamic_data.location",
    }

    outboundProperties = {
        "locations": "static_data.seasons.locations",
        "using_custom_location": "dynamic_data.custom_location",
        "current_location": "dynamic_data.location",
    }

    changeHandlers = {
        "seasons": this.updateLocationsWithSeasonBasedTime
    }

    loaded() {

        this.can_use_preset_locations = (this.seasons.length === 2 || this.seasons.length === 4) && this.season_settings.enable_weather;

        if(this.can_use_preset_locations) {
            let length = this.can_use_preset_locations ? this.seasons.length : 4;
            this.preset_locations = Object.values(preset_data.locations[length]);
        }else{
            this.preset_locations = [];
        }

    }

    addLocation(){
        this.locations.push({
            "name": this.name || "New location",
            "seasons": this.seasons.map(season => {
                return {
                    "time": season.time,
                    "weather": {
                        "temp_low": 0,
                        "temp_high": 0,
                        "precipitation": 0,
                        "precipitation_intensity": 0
                    }
                }
            }),

            "settings": {
                "timezone": {
                    "hour": 0,
                    "minute": 0,
                },

                "season_based_time": true,

                "large_noise_frequency": 0.015,
                "large_noise_amplitude": 5.0,

                "medium_noise_frequency": 0.3,
                "medium_noise_amplitude": 2.0,

                "small_noise_frequency": 0.8,
                "small_noise_amplitude": 3.0
            }
        });

        this.name = "";

        this.current_location = (this.locations.length-1).toString();
        this.using_custom_location = true;
    }

    removeLocation(index){
        this.locations.splice(index, 1);
    }

    locationChanged($event) {
        let [location, type] = $event.target.value.split("-");
        this.current_location = location;
        this.using_custom_location = type === "custom";
    }

    copyCurrentLocation() {
        const currentLocation = this.using_custom_location
            ? this.locations[this.current_location]
            : this.preset_locations[this.current_location];

        let newLocation = _.cloneDeep(currentLocation);

        if(!this.using_custom_location){

            let copiedLocation = _.cloneDeep(currentLocation);

            let preset_seasons = this.seasons.length === 2 ? ['winter', 'summer'] : ['winter', 'spring', 'summer', 'autumn'];

            let valid_preset_order = this.season_settings.preset_order !== undefined
                && this.season_settings.preset_order.length === this.seasons.length;

            let preset_order = undefined;

            if (!valid_preset_order) {

                let season_test = [];
                for (let index in this.seasons) {
                    let season = this.seasons[index];
                    let preset_index = preset_seasons.indexOf(season.name.toLowerCase());
                    if (preset_index === -1 && season.name.toLowerCase() === "fall" && this.seasons.length === 4) {
                        preset_index = 3;
                    }
                    if (preset_index > -1) {
                        season_test.push(preset_index)
                    }
                }

                if (season_test.length === this.seasons.length) {
                    preset_order = season_test;
                }

            } else {

                preset_order = this.season_settings.preset_order;

            }

            newLocation.settings = _.cloneDeep(preset_data.curves);
            newLocation.settings.season_based_time = true;
            newLocation.seasons = [];

            for (let seasonIndex = 0; seasonIndex < this.seasons.length; seasonIndex++) {

                let presetIndex = seasonIndex;
                if (preset_order !== undefined && preset_order.length === this.seasons.length) {
                    presetIndex = preset_order[seasonIndex];
                }
                newLocation.seasons.push(_.cloneDeep(copiedLocation.seasons[presetIndex]));

                newLocation.seasons[seasonIndex].time = {}
                newLocation.seasons[seasonIndex].time.sunset = this.seasons[seasonIndex].time.sunset;
                newLocation.seasons[seasonIndex].time.sunrise = this.seasons[seasonIndex].time.sunrise;

                if (this.season_settings.temp_sys === "metric" || this.season_settings.temp_sys === "both_m") {
                    newLocation.seasons[seasonIndex].weather.temp_low = fahrenheit_to_celcius(newLocation.seasons[seasonIndex].weather.temp_low);
                    newLocation.seasons[seasonIndex].weather.temp_high = fahrenheit_to_celcius(newLocation.seasons[seasonIndex].weather.temp_high);
                }

            }

        }

        this.locations.push(newLocation);
        this.current_location = (this.locations.length-1).toString();
        this.using_custom_location = true;

    }

    interpolateSeasonTimes(location_index, season_index){

        let prev_id = (season_index - 1) % this.seasons.length
        if (prev_id < 0) prev_id += this.seasons.length

        let next_id = (season_index + 1) % this.seasons.length;

        let season_ratio;

        if (this.season_settings.periodic_seasons) {

            let season_length = this.seasons[prev_id].duration + this.seasons[prev_id].transition_length + this.seasons[season_index].duration + this.seasons[season_index].transition_length;
            let target = this.seasons[prev_id].duration + this.seasons[prev_id].transition_length;
            season_ratio = target / season_length;

        } else {

            let prev_season = this.seasons[prev_id];
            let curr_season = this.seasons[season_index];
            let next_season = this.seasons[next_id];

            let prev_year = 2;
            if (prev_id > season_index) {
                prev_year--;
            }

            let next_year = 2;
            if (next_id < season_index) {
                next_year++;
            }

            let prev_day = this.$store.calendar.evaluate_calendar_start(prev_year, prev_season.timespan, prev_season.day).epoch;
            let curr_day = this.$store.calendar.evaluate_calendar_start(2, curr_season.timespan, curr_season.day).epoch - prev_day;
            let next_day = this.$store.calendar.evaluate_calendar_start(next_year, next_season.timespan, next_season.day).epoch - prev_day;

            season_ratio = curr_day / next_day;

        }

        let prev_season = this.locations[location_index].seasons[prev_id];
        let next_season = this.locations[location_index].seasons[next_id];

        if (this.clock.enabled) {

            let prev_sunrise = prev_season.time.sunrise.hour + (prev_season.time.sunrise.minute / this.clock.minutes);
            let next_sunrise = next_season.time.sunrise.hour + (next_season.time.sunrise.minute / this.clock.minutes);

            let middle_sunrise = lerp(prev_sunrise, next_sunrise, season_ratio)

            let sunrise_h = Math.floor(middle_sunrise)
            let sunrise_m = Math.floor(fract(middle_sunrise) * this.clock.minutes)

            this.locations[location_index].seasons[season_index].time.sunrise.hour = sunrise_h;
            this.locations[location_index].seasons[season_index].time.sunrise.minute = sunrise_m;


            let prev_sunset = prev_season.time.sunset.hour + (prev_season.time.sunset.minute / this.clock.minutes);
            let next_sunset = next_season.time.sunset.hour + (next_season.time.sunset.minute / this.clock.minutes);

            let middle_sunset = lerp(prev_sunset, next_sunset, season_ratio)

            let sunset_h = Math.floor(middle_sunset)
            let sunset_m = Math.floor(fract(middle_sunset) * this.clock.minutes)

            this.locations[location_index].seasons[season_index].time.sunset.hour = sunset_h;
            this.locations[location_index].seasons[season_index].time.sunset.minute = sunset_m;

        }

        if (this.season_settings.enable_weather) {

            let temp_low = precisionRound(lerp(prev_season.weather.temp_low, next_season.weather.temp_low, season_ratio), 2);
            let temp_high = precisionRound(lerp(prev_season.weather.temp_high, next_season.weather.temp_high, season_ratio), 2);
            let precipitation = precisionRound(lerp(prev_season.weather.precipitation, next_season.weather.precipitation, season_ratio), 2);
            let precipitation_intensity = precisionRound(lerp(prev_season.weather.precipitation_intensity, next_season.weather.precipitation_intensity, season_ratio), 2);

            this.locations[location_index].seasons[season_index].weather.temp_low = temp_low;
            this.locations[location_index].seasons[season_index].weather.temp_high = temp_high;
            this.locations[location_index].seasons[season_index].weather.precipitation = precipitation;
            this.locations[location_index].seasons[season_index].weather.precipitation_intensity = precipitation_intensity;

        }
    }

    updateLocationsWithSeasonBasedTime(){
        for(let location_index in this.locations){
            this.updateSeasonBasedTime(location_index)
        }
    }

    updateSeasonBasedTime(location_index){

        if(!this.locations[location_index].settings.season_based_time) return;

        for(let [season_index, season] of this.seasons.entries()){
            this.locations[location_index].seasons[season_index].time.sunrise.hour = season.time.sunrise.hour;
            this.locations[location_index].seasons[season_index].time.sunrise.minute = season.time.sunrise.minute;
            this.locations[location_index].seasons[season_index].time.sunset.hour = season.time.sunset.hour;
            this.locations[location_index].seasons[season_index].time.sunset.minute = season.time.sunset.minute;
        }

    }

}

export default () => new LocationsCollapsible();
