/**
 * TODO: Pagination?
 * TODO: Fix call to edit in main blade template
 * TODO: Limit height of result boxes
 * TODO:
 */

const events_manager = {
    open: true,

    calendar_events: [],
    event_categories: [],
    groupFilter: "",
    categorizedEvents: [],
    search: "",

    init() {
        this.$watch('window.events', () => { this.refreshEvents() });
        this.$watch('search', () => { this.refreshEvents() });
    },

    refreshEvents() {
        let results = (clone(window.events) ?? []).reduce((categorized, event) => {
            if(this.search.length && !this.inSearch(event)) {
                return categorized;
            }

            const categoryName = get_category(event.event_category_id)?.name ?? "No category";
            categorized[categoryName] = categorized[categoryName] ?? [];
            categorized[categoryName].push(event);
            return categorized;
        }, {});

        // results = Object.entries(results).map(([category, events]) => {
        //     return {
        //         name: category,
        //         events: events
        //     }
        // });

        this.categorizedEvents = results;
    },

    inSearch(event) {
        return (event.name
                .toLowerCase()
                .includes(this.search.toLowerCase())
            ||
            event.description
                .toLowerCase()
                .includes(this.search.toLowerCase())
            ||
            event.author && event.author
                .toLowerCase()
                .includes(this.search.toLowerCase()))
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
       setTimeout(() => {
            document.querySelector('input').focus();
        }); // has a default time value of 0
    },

    close_modal: function($event) {
        this.open = false;
    }
}

module.exports = events_manager;
