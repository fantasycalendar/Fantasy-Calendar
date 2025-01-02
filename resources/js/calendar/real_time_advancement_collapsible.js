import CollapsibleComponent from "./collapsible_component";

class RealTimeAdvancementCollapsible extends CollapsibleComponent {
    collapsible_name = "Real-Time Advancement";
    _clock_enabled = false;

    inboundProperties = {
        "advancement": "advancement",
        "clock_enabled": "static_data.clock.enabled"
    };

    outboundProperties = {
        "advancement": "advancement",
    };

    set clock_enabled(value) {
        this._clock_enabled = value;

        if (this.advancement.advancement_rate_unit !== 'days') {
            this.advancement.advancement_rate_unit = 'days';
        }
    };

    get clock_enabled() {
        return this._clock_enabled;
    }
}

export default () => new RealTimeAdvancementCollapsible();
