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
    groupFilter: "-1",
    categorizedEvents: [],
    categories: [],
    search: "",
    multiselect: false,
    selected: {},
    visibility: "any",
    updateCategoryTo: null,

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

    // Cycle through visibility options:
    // any -> visible -> hidden -> any
    cycleVisibility() {
        switch (this.visibility) {
            case "any":
                this.visibility = "visible";
                break;
            case "visible":
                this.visibility = "hidden";
                break;
            case "hidden":
                this.visibility = "any";
                break;
        }
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

    // Only if all selected events are in the same category
    get canUpdateCategory() {
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

    delete_events() {
        console.log("Would have deleted", this.selected);
        // for (let event_id in this.selected) {
        //     let delete_event_id = $event.detail.event_id;

        //     let warnings = [];

        //     for (let eventId = 0; eventId < events.length; eventId++) {
        //         if (eventId === delete_event_id) continue;
        //         if (events[eventId].data.connected_events !== undefined) {
        //             let connected_events =
        //                 events[eventId].data.connected_events;
        //             if (
        //                 connected_events.includes(String(delete_event_id)) ||
        //                 connected_events.includes(Number(delete_event_id))
        //             ) {
        //                 warnings.push(eventId);
        //             }
        //         }
        //     }

        //     if (warnings.length > 0) {
        //         let html = [];
        //         html.push(`<div class='text-left'>`);
        //         html.push(
        //             `<h5>You trying to delete "${events[delete_event_id].name}" which is used in the conditions of the following events:</h5>`,
        //         );
        //         html.push(`<ul>`);
        //         for (let i = 0; i < warnings.length; i++) {
        //             let warning_event_id = warnings[i];
        //             html.push(`<li>${events[warning_event_id].name}</li>`);
        //         }
        //         html.push(`</ul>`);
        //         html.push(
        //             `<p>Please remove the conditions using "${events[delete_event_id].name}" in these events before trying to delete it.</p>`,
        //         );
        //         html.push(`</div>`);

        //         swal.fire({
        //             title: "Warning!",
        //             html: html.join(""),
        //             showCancelButton: false,
        //             confirmButtonColor: "#3085d6",
        //             confirmButtonText: "OK",
        //             icon: "warning",
        //         });
        //     } else {
        //         swal.fire({
        //             title: "Warning!",
        //             html: `Are you sure you want to delete the event<br>"${events[delete_event_id].name}"?`,
        //             showCancelButton: true,
        //             confirmButtonColor: "#d33",
        //             cancelButtonColor: "#3085d6",
        //             confirmButtonText: "OK",
        //             icon: "warning",
        //         }).then((result) => {
        //             if (!result.dismiss) {
        //                 let not_view_page =
        //                     window.location.pathname.indexOf("/edit") > -1 ||
        //                     window.location.pathname.indexOf(
        //                         "/calendars/create",
        //                     ) > -1;

        //                 if (not_view_page) {
        //                     this.delete_event(delete_event_id);

        //                     evaluate_save_button();
        //                 } else {
        //                     let event_id = events[delete_event_id].id;

        //                     submit_delete_event(event_id, () => {
        //                         this.delete_event(delete_event_id);
        //                     });
        //                 }
        //             }
        //         });
        //     }
        // }
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
        this.categories = clone(window.event_categories) ?? [];
    },
    refreshEvents() {
        this.refreshCategories();
        this.categorizedEvents = (clone(window.events) ?? []).reduce(
            (categorized, event) => {
                if (
                    (this.search.length && !this.inSearch(event)) ||
                    !this.matchesVisibility(event)
                ) {
                    return categorized;
                }

                const categoryName =
                    get_category(event.event_category_id)?.name ??
                    "No category";
                categorized[categoryName] = categorized[categoryName] ?? [];
                categorized[categoryName].push(event);
                return categorized;
            },
            {},
        );
    },

    matchesVisibility(event) {
        switch (this.visibility) {
            case "any":
                return true;
            case "visible":
                return !(event.settings.hide || event.settings.hide_full);
            case "hidden":
                return event.settings.hide || event.settings.hide_full;
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
            event_id: event_data.sort_by,
            epoch: window.dynamic_data.epoch,
        });
    },

    toggleSelected(id) {
        this.selected[id] = !this.isSelected(id);
    },

    highlight_match: function(string) {
        let output = sanitizeHtml(string, { allowedTags: [] });
        let index = 0;
        if (output.length < 1) return;

        // Using a dedicated variable for this because adding the "<mark>" to the HTML
        // makes the final output have a higher length. We want to check length on the **unaltered** results,
        // in case the original is, say, 99 characters, and the <mark> tag would result in
        // unnecessary ellipsis.
        let ellipses = output.length > 900;

        if (
            this.search.length &&
            output.toLowerCase().includes(this.search.toLowerCase())
        ) {
            let found = output.toLowerCase().indexOf(this.search);

            if (found > 900 - this.search.length) {
                index = found - 10;
            }

            output = output.replace(
                new RegExp(this.search, "gi"),
                function(str) {
                    return `<mark>${str}</mark>`;
                },
            );
        }

        if (ellipses) {
            output = output.substring(index, index + 900) + "...";
        }

        if (index) {
            output = "..." + output;
        }

        return output;
    },

    open_modal: function($event) {
        this.open = true;
        setTimeout(() => {
            document.querySelector("input").focus();
        }); // has a default time value of 0
    },

    close_modal: function($event) {
        this.open = false;
    },
};

module.exports = events_manager;
