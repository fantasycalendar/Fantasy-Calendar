import CollapsibleComponent from "./collapsible_component";

class ClockCollapsible extends CollapsibleComponent {
    inboundProperties = {
        'clock': 'clock'
    };

    changeHandlers = {
        'clock': this.changed
    };

    outboundProperties = {
        "clock": "clock"
    }

    changed(current, previous) {
        this.$dispatch('clock-changed', {
            ...current
        });
    }
}

export default () => new ClockCollapsible();
