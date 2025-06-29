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

    changeHandlers = {
        "settings": this.changed
    }

    changed(settings) {
        if(!settings.allow_view){
            settings.only_backwards = false;
        }
    }

}

export default () => new SettingsCollapsible();
