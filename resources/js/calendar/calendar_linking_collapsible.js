import axios from "axios";
import CollapsibleComponent from "./collapsible_component";

class CalendarLinkingCollapsible extends CollapsibleComponent {
    children = [];
    owned = {};
    selectedCalendarHash = null;

    load() {
        this.retrieveOwnedCalendars();
    }

    retrieveOwnedCalendars() {
        axios.get(this.$store.calendar.api_url("/calendar/:hash/owned"))
            .then((response) => {
                this.owned = response.data;

                console.log(response.data);
            })
            .catch((error) => {
                console.log(error);

                this.$dispatch('notify', {
                    type: "error",
                    content: error.response.data.message
                });
            });
    }

    get selectedCalendar() {
        return this.owned[this.selectedCalendarHash] ?? {name: 'None selected'};
    }
}

export default () => new CalendarLinkingCollapsible();
