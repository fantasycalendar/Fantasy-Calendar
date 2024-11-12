import CollapsibleComponent from "./collapsible_component";

class ClockCollapsible extends CollapsibleComponent {
    loads = {
        'clock': 'clock'
    };

    watchers = {
        'clock': this.changed
    };

    changed(current, previous) {
        this.$dispatch('clock-changed', {
            ...current
        });

        this.$dispatch('calendar-rerender-requested', {
            rerender: previous.enabled !== current.enabled
                || previous.hours !== current.hours
                || previous.minutes !== current.minutes,
            calendar: { clock: { ...current } },
        });
    }
}

export default () => new ClockCollapsible();
