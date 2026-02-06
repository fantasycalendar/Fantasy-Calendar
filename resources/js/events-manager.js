import { clone, get_category } from "./calendar/calendar_functions";

export default () => ({
    open: false,

    event_categories: [],
    groupFilter: "-1",
    categorizedEvents: [],
    categories: [],
    search: "",
    multiselect: false,
    selected: {},
    visibility: "any",
    updateCategoryTo: null,
    showFilters: false,

    init() {
        this.$watch("window.events", () => {
            this.refreshEvents();
        });
        this.$watch("search", () => {
            this.refreshEvents();
        });
        this.$watch("visibility", () => {
            this.refreshEvents();
        });
        this.$watch("multiselect", () => {
            this.selected = {};
        });
    },

    affectSelected($dispatch, callback) {
        Object.entries(this.selected)
            .filter((entry) => entry[1])
            .forEach((event) => {
                let canonicalEvent = window.events.find(
                    (canonicalEvent) =>
                        canonicalEvent.id.toString() === event[0],
                );

                callback(canonicalEvent);
            });

        this.selected = {};

        $dispatch("events-changed");
    },

    hideSelected($dispatch) {
        this.affectSelected($dispatch, (canonicalEvent) => {
            canonicalEvent.settings.hide = true;
        });
    },

    unhideSelected($dispatch) {
        this.affectSelected($dispatch, (canonicalEvent) => {
            canonicalEvent.settings.hide = false;
        });
    },

    printSelected($dispatch) {
        this.affectSelected($dispatch, (canonicalEvent) => {
            canonicalEvent.settings.print = true;
        });
    },

    dontPrintSelected($dispatch) {
        this.affectSelected($dispatch, (canonicalEvent) => {
            canonicalEvent.settings.print = false;
        });
    },

    eventVisibilityTooltip(event) {
        if (event.settings.hide_full) {
            return "This event is entirely hidden from the calendar.";
        }

        if (event.settings.hide) {
            return "This event is hidden from anyone besides the calendar owner/co-owner.";
        }

        return "This event is visible to anyone who can see the calendar.";
    },

    toggleEventPrint(event, $dispatch) {
        let canonicalEvent = window.events.find(
            (canonicalEvent) => canonicalEvent.id === event.id,
        );

        canonicalEvent.settings.print = !canonicalEvent.settings.print;

        $dispatch("events-changed");
    },

    toggleEventHidden(event, $dispatch) {
        let canonicalEvent = window.events.find(
            (canonicalEvent) => canonicalEvent.id === event.id,
        );

        canonicalEvent.settings.hide = !canonicalEvent.settings.hide;

        $dispatch("events-changed");
    },

    get numberSelected() {
        return Object.values(this.selected).filter(Boolean).length;
    },

    get visibilityLabel() {
        switch (this.visibility) {
            case "any":
                return "Any";
            case "visible":
                return "Visible Only";
            case "hidden":
                return "Hidden Only";
        }
    },

    get updateCategoryText() {
        if (!this.categories.length) {
            return "No event categories";
        }

        return this.numberSelected
            ? `Move ${this.numberSelected} to category...`
            : 'Move selected to category...'
    },

    // Only if all selected events are in the same category
    get canUpdateCategory() {
        if (!this.categories.length) {
            return false;
        }

        const selectedEvents = Object.entries(this.selected)
            .filter((entry) => {
                console.log(entry[1]);
                return entry[1];
            })
            .map((entry) =>
                window.events.find((event) => event.id === +entry[0]),
            );

        return selectedEvents.length > 0;
    },

    updateCategory($event, $dispatch) {
        let desiredId = this.updateCategoryTo;

        // Only doing this because IDs can be non-numeric. Whoot!
        if (!isNaN(desiredId)) {
            desiredId = Number(desiredId);
        }

        Object.entries(this.selected)
            .filter((entry) => entry[1])
            .forEach((event) => {
                let canonicalEvent = window.events.find(
                    (canonicalEvent) =>
                        canonicalEvent.id.toString() === event[0],
                );

                console.log(event, desiredId, canonicalEvent);

                canonicalEvent.event_category_id = desiredId;
            });

        this.selected = {};
        this.updateCategoryTo = null;

        $dispatch("events-changed");
    },
    refreshCategories() {
        this.categories = clone(this.$store.calendar.event_categories) ?? [];
    },
    refreshEvents() {
        this.refreshCategories();
        this.categorizedEvents = (clone(this.$store.calendar.events) ?? []).reduce(
            (categorized, event) => {
                if (
                    (this.search.length && !this.inSearch(event)) ||
                    !this.matchesVisibility(event)
                ) {
                    return categorized;
                }

                const categoryName =
                    get_category(event.event_category_id)?.name ??
                    "Uncategorized";
                categorized[categoryName] = categorized[categoryName] ?? [];
                categorized[categoryName].push(event);
                return categorized;
            },
            {},
        );

        let unsorted = Object.entries(this.categorizedEvents);
        this.categorizedEvents = unsorted
            .sort((a, b) => {
                if (a[0] === "Uncategorized") {
                    return -1;
                }
                if (b[0] === "Uncategorized") {
                    return 1;
                }
                return a[0] > b[0] ? 1 : -1;
            })
            .reduce((sorted, category) => {
                sorted[category[0]] = category[1];
                return sorted;
            }, {});
    },

    matchesVisibility(event) {
        switch (this.visibility) {
            case "any":
                return true;
            case "visible":
                return !(event.settings.hide || event.settings.hide_full);
            case "hidden":
                return event.settings.hide || event.settings.hide_full;
            case "entirely_hidden":
                return event.settings.hide_full;
        }
    },

    inSearch(event) {
        const searchComponents = this.search.toLowerCase().split(" ");
        return searchComponents.every(
            (search) =>
                event.name.toLowerCase().includes(search) ||
                event.description.toLowerCase().includes(search) ||
                (event.author && event.author.toLowerCase().includes(search)),
        );
    },

    isSelected(id) {
        return this.selected[id] === true;
    },

    selectEvent(event_data, $dispatch) {
        if (this.multiselect) {
            this.toggleSelected(event_data.id);
            return;
        }
        $dispatch("event-viewer-modal-view-event", {
            event_db_id: event_data.id,
            epoch: window.dynamic_data.epoch,
        });
    },

    toggleSelected(id) {
        this.selected[id] = !this.isSelected(id);
    },

    highlight_match: function(string, offset = 0) {
        let element = document.createElement("div");
        element.innerHTML = string;

        let output = element.textContent;

        let index = 0;
        if (output.length < 1) return;
        let lengthLimit = 110 - offset;

        // Using a dedicated variable for this because adding the "<mark>" to the HTML
        // makes the final output have a higher length. We want to check length on the **unaltered** results,
        // in case the original is, say, 99 characters, and the <mark> tag would result in
        // unnecessary ellipsis.
        let ellipses = output.length > lengthLimit;

        if (
            this.search.length &&
            output.toLowerCase().includes(this.search.toLowerCase())
        ) {
            let found = output.toLowerCase().indexOf(this.search.toLowerCase());

            if (found + this.search.length + 1 > lengthLimit - this.search.length - 2) {
                index = Math.max(0, Math.floor(found - lengthLimit / 2));
            }

            output = output
                .substring(index, index + lengthLimit)
                .replace(
                    new RegExp(this.search, "gi"),
                    function(str) {
                        return `<mark class='p-0'>${str}</mark>`;
                    },
                );
        } else if (!this.search.length && ellipses) {
            output = output.substring(0, lengthLimit);
        }

        if (ellipses) {
            output = output + "...";
        }

        if (index) {
            output = "..." + output;
        }

        return output;
    },

    open_modal: function($event) {
        this.refreshEvents()
        this.open = true;
        setTimeout(() => {
            document.getElementById("eventManagerSearch")?.focus();
        }, 100); // has a default time value of 0
    },

    close_modal: function($event) {
        this.open = false;
    },
});
