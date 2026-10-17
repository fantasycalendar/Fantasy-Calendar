import CollapsibleComponent from "./collapsible_component";

class ClockCollapsible extends CollapsibleComponent {

    collapsible_name = "ClockCollapsible"

	clock = {};

    _was_enabled = false;

    inboundProperties = {
        'clock': 'static_data.clock'
    };

    changeHandlers = {
        'clock': this.changed
    };

    outboundProperties = {
        "clock": "static_data.clock"
    }

    loaded() {
        // Sync the transition tracker to the loaded state so the render
        // coupling only fires on a real user-driven enable, not on load of an
        // already-enabled clock.
        this._was_enabled = !!this.clock.enabled;
    }

    changed(current, previous) {
        // Enabling the clock also turns on rendering, so it becomes visible
        // immediately. Only couples on the enabled false->true transition, so a
        // user who turns render off while the clock stays enabled isn't fought.
        if (current.enabled && !this._was_enabled) {
            this.clock.render = true;
        }
        this._was_enabled = current.enabled;

        this.$dispatch('clock-changed', {
            ...current
        });
    }
}

export default () => new ClockCollapsible();
