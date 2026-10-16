import CollapsibleComponent from "./collapsible_component.js";

class EventsCollapsible extends CollapsibleComponent {
    collapsible_name = "EventsCollapsible";

    inboundProperties = {
        "events": "events",
        "dynamic_data": "dynamic_data",
        "preview_date": "preview_date",
    }

    outboundProperties = {
        "events": "events"
    }

    changeHandlers = {
        "events": this.handleChangedEvents,
    }

    events = [];
    dynamic_data = {};
    preview_date = {};

    draggableRef = "events-sortable";
    deleting = -1;
    reordering = true;
    alwaysReordering = true;

    new_event_name = "";

    get_current_epoch() {
        return (this.preview_date?.follow ?? true) ? this.dynamic_data.epoch : this.preview_date.epoch;
    }

    reorderSortable(start, end) {
        const elem = this.events.splice(start, 1)[0];
        this.events.splice(end, 0, elem);

        // connected_events holds array indices (legacy data stores them as
        // strings); shift each one to where its event moved.
        const new_index = (old_index) => {
            if (old_index === start) return end;
            if (start < end && old_index > start && old_index <= end) return old_index - 1;
            if (end < start && old_index >= end && old_index < start) return old_index + 1;
            return old_index;
        };

        for (const event of this.events) {
            const connected = event.data.connected_events;
            if (!connected?.length) continue;

            for (let i = 0; i < connected.length; i++) {
                const old_index = Number(connected[i]);
                if (connected[i] === null || !Number.isInteger(old_index) || this.events[old_index] === undefined) {
                    continue;
                }
                connected[i] = new_index(old_index);
            }
        }

        for (let i = 0; i < this.events.length; i++) {
            const event = this.events[i];
            event.sort_by = i;
        }
    }

    reload_events() {
        this.events = this.$store.calendar.events;
    }

    handleChangedEvents() {
        this.deleting = -1;
    }
}

export default () => new EventsCollapsible();
