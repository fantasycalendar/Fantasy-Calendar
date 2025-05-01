import CollapsibleComponent from "./collapsible_component";

class RealTimeAdvancementCollapsible extends CollapsibleComponent {
    collapsible_name = "Real-Time Advancement";
    clock_enabled = false;

    inboundProperties = {
        "advancement": "advancement",
        "clock_enabled": "static_data.clock.enabled"
    };

    outboundProperties = {
        "advancement": "advancement",
    };

    changeHandlers = {
        "clock_enabled": this.updateClockEnabled
    }

    updateClockEnabled() {
        if (!this.clock_enabled && this.advancement.advancement_rate_unit !== 'days') {
            this.advancement.advancement_enabled = false;

            this.$dispatch('notify', {
                content: `Real-time advancement by ${this.advancement.advancement_rate_unit} is only possible with the clock enabled. Real-time advancement has been disabled.`,
            })
        }
    }
}

export default () => new RealTimeAdvancementCollapsible();
