import axios from "axios";
import CollapsibleComponent from "./collapsible_component";

class CalendarLinkingCollapsible extends CollapsibleComponent {
    _children = [];
    owned = [];
    selectedCalendarHash = null;

    load() {
        this.retrieveOwnedCalendars();
    }

    retrieveChildren() {
        this.owned
    }

    retrieveOwnedCalendars() {
        axios.get(this.$store.calendar.api_url("/calendar/:hash/owned"))
            .then(response => {
                this.owned = response.data.filter(calendar => calendar.hash !== this.$store.calendar.hash);
            })
            .catch(error => {
                this.$dispatch('notify', {
                    type: "error",
                    content: error.response.data.message
                });
            });
    }

    get children() {
        return [
            this.selectedCalendar,
            ...this.owned.filter(calendar => calendar.parent_hash === this.$store.calendar.hash)
        ].filter(Boolean);
    }

    get selectedCalendar() {
        return this.owned.find(calendar => calendar.hash == this.selectedCalendarHash) ?? null;
    }
}

export default () => new CalendarLinkingCollapsible();
