const events_manager = {
    open: false,

    calendar_events: [],
    event_categories: [],
    grouped: [],
    search: "",

    get filteredGroupedEvents() {
        if(!window.events || !window.events.length) {
            return [];
        }

        let calendar_events = window.events.filter((item) => {
            return item.name
                    .toLowerCase()
                    .includes(this.search.toLowerCase())
                ||
                item.description
                    .toLowerCase()
                    .includes(this.search.toLowerCase())
                ||
                item.author && item.author
                    .toLowerCase()
                    .includes(this.search.toLowerCase());
        });
        this.event_categories = clone(window.event_categories)
        this.grouped = [];

        for(let category in this.event_categories) {
            let category_data = this.event_categories[category];
            let events = [];

            for(let event in calendar_events) {
                let event_data = calendar_events[event];

                if(event_data.event_category_id === category_data.id) {
                    events.push(event_data);

                    delete calendar_events[event];
                }
            }

            if(events.length > 0) {
                this.grouped.push({
                    name: category_data.name,
                    events: events
                });
            }
        }

        return this.grouped;
    },

    get filteredUngroupedEvents() {
        if(!window.events || !window.events.length) {
            return [];
        }

        return window.events.filter((item) => {
            return item.event_category_id < 1
                &&
                (item.name
                    .toLowerCase()
                    .includes(this.search.toLowerCase())
                ||
                item.description
                    .toLowerCase()
                    .includes(this.search.toLowerCase())
                ||
                item.author && item.author
                    .toLowerCase()
                    .includes(this.search.toLowerCase()));
        });
    },

    highlight_match: function(string) {
        let output = sanitizeHtml(string, {allowedTags: []});
        if(output.length < 1) return;

        let ellipses = (output.length > 100);

        if(this.search.length && output.toLowerCase().includes(this.search.toLowerCase())) {
            output = output.replace(new RegExp(this.search, 'gi'), function(str) { return `<mark>${str}</mark>`; })
        }

        if(ellipses) {
            output = output.substring(0, 100) + '...';
        }

        return output;
    },

    open_modal: function($event){
        this.open = true;
        setTimeout(() => {
            document.querySelector('input').focus();
        }); // has a default time value of 0
    },

    close_modal: function($event) {
        this.open = false;
    }
}

module.exports = events_manager;
