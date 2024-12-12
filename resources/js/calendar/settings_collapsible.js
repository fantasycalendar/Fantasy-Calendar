import CollapsibleComponent from "./collapsible_component.js";

class SettingsCollapsible extends CollapsibleComponent {

    settings = {}

    loads = {
        "settings": "static_data.settings"
    };

    setters = {
        "settings": "settings"
    };

}

export default () => new SettingsCollapsible();
