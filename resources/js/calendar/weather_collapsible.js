import CollapsibleComponent from "./collapsible_component.js";

class WeatherCollapsible extends CollapsibleComponent {

    weather = {};
    seasons = [];

    inboundProperties = {
        "seasons": "static_data.seasons.data",
        "weather": "static_data.seasons.global_settings"
    };

    outboundProperties = {
        "weather": "static_data.seasons.global_settings"
    };

}

export default () => new WeatherCollapsible();
