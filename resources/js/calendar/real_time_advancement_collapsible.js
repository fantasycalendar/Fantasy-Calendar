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

    validators = {
        "clock_enabled": this.validateClockEnabled,
    }

    set clock_enabled(value) {
        this._clock_enabled = value;

        if (this.advancement.advancement_rate_unit !== 'days') {
            this.advancement.advancement_rate_unit = 'days';
        }
    };

    get clock_enabled() {
        return this._clock_enabled;
    }

    loaded(static_data) {
        this.validate();
    }

    validateClockEnabled() {
        if (!this.advancement.advancement_enabled) {
            return [];
        }

        if (this._clock_enabled) {
            return [];
        }

        if (this.advancement.advancement_rate_unit === 'days') {
            return [];
        }

        return [{
            path: 'advancement.advancement_rate_unit',
            message: "Without the clock enabled, a calendar can only be advanced by days.",
        }]
    }
}

export default () => new RealTimeAdvancementCollapsible();
