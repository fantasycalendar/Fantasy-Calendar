class EventEditor {
    show = true;
    event = {};
    errors = [];

    init() {
        this.reset();
    }

    load_event(event) {
        this.event = event;
        this.open = true;
    }

    reset_and_close() {
        this.reset();
        this.close();
    }

    reset() {
        this.event = {
            id: null,
            event_category_id: null,
            name: "New Event",
            data: {
                has_duration: false,
                duration: 0,
                show_first_last: false,
                limited_repeat: false,
                limited_repeat_num: 0,
                search_distance: 0,
                date: [],
                connected_events: [],
                conditions: [],
            },
            settings: {
                color: "Dark",
                text: "text",
                hide: false,
                hide_full: false,
                print: false,
            },
            sort_by: this.$store.calendar_events.count,
            updated_at: null,
        };
    }

    close() {
        this.show = false;
    }

    hasError(errorPath) {
        return false; // TODO: Error handling
    }

    getErrorMessage(errorPath) {
        return "";
    }
}

export default () => new EventEditor();
