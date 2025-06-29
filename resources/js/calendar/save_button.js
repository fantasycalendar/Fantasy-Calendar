import { update_all, update_dynamic, update_name } from "./calendar_ajax_functions.js";
import _ from "lodash";

export default () => ({

    timeout: false,
    saving: false,
    save_status: "",
    has_changes: false,
    errors: {},
    prev_calendar_data: {},

    // Technically duplicated from the calendar error modal, but both do need to know about this
    addErrors($event) {
        this.errors[$event.detail.key] = $event.detail.errors;
    },

    removeErrors($event) {
        if(this.errors[$event.detail.key]){
            delete this.errors[$event.detail.key];
        }
    },

    getErrors(){
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

    calendarUpdated() {
        let newData = this.cloneCalendarData(this.$store.calendar);
        this.has_changes = !_.isEqual(this.prev_calendar_data, newData);
    },

    get text(){
        if(this.has_changes && !this.getErrors().length){
            return "Save Calendar";
        }
        if(this.save_status){
            switch(this.save_status){
                case "saving":
                    return "Saving...";
                case "success":
                    return "Saved!";
                case "error":
                    return "Failed to save!";
            }
        }
        if(!this.has_changes && !this.getErrors().length){
            return "No changes to save";
        }
        return "Calendar has errors";
    },

    get warning(){
        return this.getErrors().length > 0;
    },

    get disabled() {
        return !this.has_changes || this.getErrors().length > 0;
    },

    async save() {
        if(this.timeout){
            clearTimeout(this.timeout);
        }

        let updateMethod;
        let updateParams = [];

        if(!_.isEqual(this.prev_calendar_data.static_data, this.$store.calendar.static_data)){
            updateMethod = update_all;
        } else if (!_.isEqual(this.prev_calendar_data.dynamic_data, this.$store.calendar.dynamic_data)){
            updateMethod = update_dynamic
            updateParams = [this.$store.calendar.hash];
        } else if (this.prev_calendar_data.calendar_name !== this.$store.calendar.calendar_name){
            updateMethod = update_name;
        }

        this.save_status = "saving";

        updateMethod(...updateParams)
            .then(() => {
                this.save_status = "success";
                this.$dispatch('notify', {
                    content: "Successfully saved calendar!",
                    type: "success"
                });
            })
            .catch(() => {
                this.save_status = "error";
                this.$dispatch('notify', {
                    content: error.response.data.message,
                    type: "error"
                });
            })
            .finally(() => {
                this.timeout = setTimeout(() => this.save_status = "", 4000);
                this.has_changes = false;
                this.prev_calendar_data = this.cloneCalendarData(this.$store.calendar);
            })
    }
})