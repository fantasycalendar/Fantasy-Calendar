import axios from "axios";
import CollapsibleComponent from "./collapsible_component";
import { update_dynamic } from "./calendar_ajax_functions";
import { evaluate_calendar_start } from "./calendar_functions";

class CalendarLinkingCollapsible extends CollapsibleComponent {
    _children = [];
    owned = [];
    selectedCalendarHash = null;
    disableInputs = false;

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

    linkChildCalendar(hash, inputDate) {
        this.disableInputs = true;

        swal.fire({
            title: "Linking Calendar",
            html: "<p>Linking calendars will disable all structural inputs on both calendars (month lengths, week lengths, hours per day, minutes) so the link can be preserved. The link can be broken again at any point.</p>" +
                "<p>Are you sure you want link and save this calendar?</p>",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, link and save calendar',
            cancelButtonText: 'Leave unlinked',
            icon: "info"
        }).then((result) => {
            if (result.dismiss) {
                this.disableInputs = false;

                return;
            }

            axios.patch(this.$store.calendar.base_url(`/calendars/${hash}`), {
                parent_hash: this.$store.calendar.hash,
                parent_link_date: [inputDate.year, inputDate.timespan, inputDate.day],
                parent_offset: evaluate_calendar_start(window.static_data, inputDate.year, inputDate.timespan, inputDate.day).epoch
            }).then(() => {
                update_dynamic(this.$store.calendar.hash, () => {
                    window.location.reload();
                })
            }).catch(() => {
                this.$dispatch('notify', {
                    type: "error",
                    content: error.response.data.message
                })
            });

        })
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
