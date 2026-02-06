import {
    _update_dynamic,
    create_calendar,
    update_all,
    update_dynamic,
    update_name
} from "./calendar_ajax_functions.js";
import _ from "lodash";

export default () => ({

    timeout: false,
    saving: false,
    show: false,
    save_status: "",
    errors: {},
    prev_calendar_data: {},
    ready_to_save: false,
    user_logged_in: false,
    calendar_step: 0,

    // Technically duplicated from the calendar error modal, but both do need to know about this
    addErrors($event) {
        this.errors[$event.detail.key] = $event.detail.errors;
    },

    removeErrors($event) {
        if (this.errors[$event.detail.key]) {
            delete this.errors[$event.detail.key];
        }
    },

    getErrors() {
        return [].concat(...Object.values(this.errors));
    },

    cloneCalendarData(calendar) {
        return {
            calendar_name: _.cloneDeep(calendar.calendar_name),
            dynamic_data: _.cloneDeep(calendar.dynamic_data),
            static_data: _.cloneDeep(calendar.static_data),
            events: _.cloneDeep(calendar.events),
            event_categories: _.cloneDeep(calendar.event_categories),
            advancement: _.cloneDeep(calendar.advancement)
        }
    },

    calendarLoaded($event) {
        this.prev_calendar_data = this.cloneCalendarData($event.detail);
    },

    get text() {
        if(!this.ready_to_save){
            return "Cannot create yet";
        }
        if(!this.user_logged_in){
            return "Log in to save";
        }
        if (!this.getErrors().length) {
            return "Create Calendar";
        }
        if (!this.getErrors().length) {
            return "No changes to save";
        }
        return "Calendar has errors";
    },

    get warning() {
        return this.getErrors().length > 0;
    },

    get disabled() {
        return !this.ready_to_save || this.getErrors().length > 0;
    },

    async save() {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        if(!this.user_logged_in){
            window.onbeforeunload = function () {}
            window.location = '/login?postlogin=/calendars/create?resume=1';
            return;
        }

        this.save_status = "saving";

        create_calendar()
            .catch((error) => {
                // TODO: Handle page not knowing that the user had logged on a separate page
                this.save_status = "error";
                this.$dispatch('notify', {
                    content: error.response.data.message,
                    type: "error"
                });
            })
            .finally(() => {
                this.timeout = setTimeout(() => this.save_status = "", 4000);
                this.prev_calendar_data = this.cloneCalendarData(this.$store.calendar);
            })
    },

    evaluateCalendarStep($event) {
        this.ready_to_save = !!$event.detail.done;
        this.user_logged_in = this.$store.calendar.perms.userid !== null;
    }
})
