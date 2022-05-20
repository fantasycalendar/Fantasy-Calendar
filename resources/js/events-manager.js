/**
 * TODO: Pagination?
 * TODO: Fix call to edit in main blade template
 * TODO: Limit height of result boxes
 * TODO:
 */

const events_manager = {
    open: false,

    calendar_events: [],
    event_categories: [],
    grouped: [],
    ungrouped: [],
    search: "",

    init() {
        this.$watch('search', () => {
            this.$nextTick(() => {
                this.updateFilteredGroupedEvents();
                this.updateFilteredUngroupedEvents();
            })
        })
    },

    updateFilteredGroupedEvents() {
        // console.log(window.events);

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

        // console.log(calendar_events);

        this.event_categories = clone(window.event_categories)
        this.grouped = [];

        // console.log(this.grouped);

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
    },

    updateFilteredUngroupedEvents() {
        if(!window.events || !window.events.length) {
            return [];
        }

        this.ungrouped = window.events.filter((item) => {
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
        let index = 0;
        if(output.length < 1) return;

        // Using a dedicated variable for this because adding the "<mark>" to the HTML
        // makes the final output have a higher length. We want to check length on the **unaltered** results,
        // in case the original is, say, 99 characters, and the <mark> tag would result in
        // unnecessary ellipsis.
        let ellipses = (output.length > 100);

        if(this.search.length && output.toLowerCase().includes(this.search.toLowerCase())) {
            let found = output.toLowerCase().indexOf(this.search);

            if(found > (100 - this.search.length)) {
                index = found - 10;
            }

            output = output.replace(new RegExp(this.search, 'gi'), function(str) { return `<mark>${str}</mark>`; })
        }

        if(ellipses) {
            output = output.substring(index, index + 100) + '...';
        }

        if(index) {
            output = '...' + output;
        }

        return output;
    },

    open_modal: function($event){
        this.updateFilteredGroupedEvents();
        this.updateFilteredUngroupedEvents();
        this.$nextTick(() => {
            this.open = true;
        });
        setTimeout(() => {
            document.querySelector('input').focus();
        }); // has a default time value of 0
    },

    close_modal: function($event) {
        this.open = false;
    }
}

module.exports = events_manager;
