import CollapsibleComponent from "./collapsible_component.js";

class SettingsCollapsible extends CollapsibleComponent {

    settings = {}

    loads = {
        "settings": "settings"
    };

    setters = {
        "settings": "settings"
    };

}

export default () => new SettingsCollapsible();
