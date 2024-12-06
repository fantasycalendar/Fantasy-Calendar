import CollapsibleComponent from "./collapsible_component.js";
import { preset_data } from "./calendar_variables.js";

class LocationsCollapsible extends CollapsibleComponent {

    deleting = -1;
    name = "";

    seasons = [];
    locations = [];
    season_settings = {};
    clock = {};

    preset_locations = [];
    can_use_preset_locations = false;

    inboundProperties = {
        "seasons": "seasons.data",
        "locations": "seasons.locations",
        "season_settings": "seasons.global_settings",
        "clock": "clock",
    }

    outboundProperties = {
        "locations": "seasons.locations",
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

        // TODO: Change the current location to the new location

        this.name = "";
    }

    removeLocation(index){
        this.locations.splice(index, 1);
    }

}

export default () => new LocationsCollapsible();
