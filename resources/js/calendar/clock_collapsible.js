import CollapsibleComponent from "./collapsible_component";

class ClockCollapsible extends CollapsibleComponent {
    inboundProperties = {
        'clock': 'static_data.clock'
    };

    changeHandlers = {
        'clock': this.changed
    };

    outboundProperties = {
        "clock": "static_data.clock"
    }

    changed(current, previous) {
        this.$dispatch('clock-changed', {
            ...current
        });
    }
}

export default () => new ClockCollapsible();
