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
                this.owned = response.data.filter(calendar => {
                    return calendar.hash !== this.$store.calendar.hash;
                }).map(calendar => {
                    calendar.locked = !!calendar.parent_hash;

                    return calendar;
                });
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
            }).catch(error => {
                this.$dispatch('notify', {
                    type: "error",
                    content: error.response.data.message
                })
            });
        })
    }

    unlinkChildCalendar(hash) {
        swal.fire({
            title: "Unlinking Calendar",
            html: "<p>Are you sure you want to break the link to this calendar?</p><p>This cannot be undone.</p>",
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, unlink',
            cancelButtonText: 'Leave linked',
            icon: "warning"
        })
            .then((result) => {
                if (result.dismiss) {
                    return;
                }

                axios.patch(this.$store.calendar.base_url(`/calendars/${hash}`), {
                    parent_hash: null,
                    parent_link_date: null,
                    parent_offset: null,
                }).then(() => {
                    update_dynamic(this.$store.calendar.hash, () => {
                        window.location.reload();
                    })
                }).catch(error => {
                    this.$dispatch('notify', {
                        type: "error",
                        content: error.response.data.message
                    })
                });
            });
    }

    isLinkable(calendar) {
        let returnval = calendar.hash !== this.$store.calendar.hash
            && !calendar.parent_hash
            && !calendar.advancement_enabled;

        return returnval;
    }

    getRelativeStartDate(calendar) {
        return (calendar.parent_link_date && calendar.parent_link_date.length === 3)
            ? {
                year: Number(calendar.parent_link_date[0]),
                timespan: Number(calendar.parent_link_date[1]),
                day: Number(calendar.parent_link_date[2]),
            } : {
                year: this.$store.calendar.dynamic_data.year,
                timespan: 0,
                day: 0,
            };
    }

    get linkable() {
        return this.owned.filter(calendar => this.isLinkable(calendar));
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
