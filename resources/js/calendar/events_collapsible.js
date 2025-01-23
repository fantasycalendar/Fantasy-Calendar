import CollapsibleComponent from "./collapsible_component.js";

class EventsCollapsible extends CollapsibleComponent {

    inboundProperties = {
        "events": "events",
        "dynamic_data": "dynamic_data",
        "preview_date": "preview_date",
    }

    outboundProperties = {
        "events": "events"
    }

    events = [];
    dynamic_data = {};
    preview_date = {};

    draggableRef = "events-sortable";

    get_current_epoch() {
        return (this.preview_date?.follow ?? true) ? this.dynamic_data.epoch : this.preview_date.epoch;
    }

    reorderSortable(start, end){
        const elem = this.events.splice(start, 1)[0];
        this.events.splice(end, 0, elem);

        // TODO: Break this out into a draggable/sortable component?

        for(let i = 0; i < this.events.length; i++){
            const event = this.events[i];
            if(event.data.connected_events?.length){
                for(let connected_id = 0; connected_id < event.data.connected_events.length; connected_id++){
                    const old_index = event.data.connected_events[connected_id];
                    if(old_index === null) continue;
                    event.data.connected_events[connected_id] = this.events.findIndex(event => event.sort_by === old_index);
                }
            }
        }

        for(let i = 0; i < this.events.length; i++){
            const event = this.events[i];
            event.sort_by = i;
        }
    }
}

export default () => new EventsCollapsible();
