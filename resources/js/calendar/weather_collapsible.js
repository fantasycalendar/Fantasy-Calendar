import CollapsibleComponent from "./collapsible_component.js";

class WeatherCollapsible extends CollapsibleComponent {

    weather = {};

    inboundProperties = {
        "weather": "seasons.global_settings"
    };

    outboundProperties = {
        "weather": "seasons.global_settings"
    };

}

export default () => new WeatherCollapsible();
