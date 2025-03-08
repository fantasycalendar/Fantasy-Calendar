import CollapsibleComponent from "./collapsible_component.js";

class SettingsCollapsible extends CollapsibleComponent {

    collapsible_name = "SettingsCollapsible"

    settings = {}

    inboundProperties = {
        "settings": "static_data.settings"
    };

    outboundProperties = {
        "settings": "static_data.settings"
    };

}

export default () => new SettingsCollapsible();
