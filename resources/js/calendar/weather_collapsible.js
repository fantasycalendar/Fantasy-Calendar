import CollapsibleComponent from "./collapsible_component.js";

class WeatherCollapsible extends CollapsibleComponent {

    weather = {};

    loads = {
        "weather": "seasons.global_settings"
    };

    setters = {
        "weather": "seasons.global_settings"
    };

}

export default () => new WeatherCollapsible();
