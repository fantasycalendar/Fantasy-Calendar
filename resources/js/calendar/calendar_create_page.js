import _ from "lodash";
import { bind_calendar_events } from "./calendar_manager.js";
import Perms from "../perms.js";

export default (calendar_structure) => ({

    last_mouse_move: false,
    poll_timer: false,
    instapoll: false,
    new_dynamic_change: false,

    current_step: 1,
    steps: 3,

    evaluate_current_step: function () {

        if(this.current_step > this.steps){
            return;
        }

        const store = this.$store.calendar;

        if (this.current_step >= 1) {
            if (store.calendar_name === "") {
                this.current_step = 1;
                this.$dispatch('calendar-step-changed', {
                    step: this.current_step,
                    steps: this.steps,
                    content: [
                        {
                            icon: "fa-calendar",
                            text: "Your calendar must have a name"
                        }
                    ]
                });
            } else {
                this.current_step = 2;
            }
        }

        if (this.current_step >= 2) {
            if (store.static_data.year_data.global_week.length === 0) {
                this.$dispatch('calendar-step-changed', {
                    step: this.current_step,
                    steps: this.steps,
                    content: [
                        {
                            icon: "fa-calendar-check",
                            text: "Your calendar has a name!"
                        },
                        {
                            icon: "fa-calendar",
                            text: "You need at least one week day."
                        },

                    ]
                });
            } else {
                this.current_step = 3;
            }
        }

        if (this.current_step >= 3) {
            if (store.static_data.year_data.timespans.length === 0) {
                this.$dispatch('calendar-step-changed', {
                    step: this.current_step,
                    steps: this.steps,
                    content: [
                        {
                            icon: "fa-calendar-check",
                            text: "Your calendar has a name!"
                        },
                        {
                            icon: "fa-calendar-check",
                            text: "You have at least one week day!"
                        },
                        {
                            icon: "fa-calendar",
                            text: "You need at least one month."
                        },
                    ]
                });
            } else {
                this.$dispatch('calendar-step-changed', {
                    step: this.current_step,
                    steps: this.steps,
                    content: [
                        {
                            icon: "fa-calendar-check",
                            text: "Your calendar has a name!"
                        },
                        {
                            icon: "fa-calendar-check",
                            text: "You have at least one week day!"
                        },
                        {
                            icon: "fa-calendar-check",
                            text: "You have at least one month!"
                        },
                    ]
                });
                this.current_step = 4;
            }
        }

        if (this.current_step > this.steps) {
            this.$dispatch('calendar-step-changed', {
                step: this.current_step,
                steps: this.steps,
                done: this.current_step > this.steps
            });
        }
    },


    init() {
        let preview_date = _.cloneDeep(calendar_structure.dynamic_data);
        preview_date.follow = true;

        this.$store.calendar.initialize({
            perms: new Perms(
                calendar_structure.userId,
                calendar_structure.owned,
                calendar_structure.paymentLevel,
                calendar_structure.userRole
            ),
            calendar_name: calendar_structure.calendar_name,
            static_data: calendar_structure.static_data,
            dynamic_data: calendar_structure.dynamic_data,
            events: calendar_structure.events,
            event_categories: calendar_structure.event_categories,
            hash: calendar_structure.hash,
            calendar_id: calendar_structure.calendar_id,
            preview_date: preview_date,
            advancement: {
                advancement_enabled: !!calendar_structure.advancement_enabled,
                advancement_real_rate: calendar_structure.advancement_real_rate,
                advancement_real_rate_unit: calendar_structure.advancement_real_rate_unit,
                advancement_rate: calendar_structure.advancement_rate,
                advancement_rate_unit: calendar_structure.advancement_rate_unit,
                advancement_webhook_url: calendar_structure.advancement_webhook_url,
                advancement_timezone: calendar_structure.advancement_timezone
            },
            evaluated_static_data: {},
            is_linked: calendar_structure.is_linked,
            has_parent: calendar_structure.has_parent,
            parent_hash: calendar_structure.parent_hash,
            parent_offset: calendar_structure.parent_offset,
            last_static_change: new Date(calendar_structure.last_static_change),
            last_dynamic_change: new Date(calendar_structure.last_dynamic_change),
            dark_theme: calendar_structure.dark_theme
        });

        bind_calendar_events();

        document.addEventListener("DOMContentLoaded", () => {
            if (this.should_resume(window.location.search)) {
                this.autoload(false);
            } else {
                this.queryAutoload();
            }

            this.evaluate_current_step();
        });

        this.$dispatch("events-changed");
    },

    should_resume(queryString) {
        const urlParams = new URLSearchParams(queryString);
        return urlParams.has("resume");
    },

    autosave() {
        const store = this.$store.calendar;
        let saved_data = JSON.stringify({
            calendar_name: store.calendar_name,
            static_data: store.static_data,
            dynamic_data: store.dynamic_data,
            events: store.events,
            event_categories: store.event_categories
        })
        localStorage.setItem('autosave', saved_data);
    },

    queryAutoload() {
        return new Promise((resolve) => {
            if (localStorage.getItem('autosave')) {
                swal.fire({
                        title: "Load unsaved calendar?",
                        text: "It looks like you started a new calendar and didn't save it. Would you like to continue where you left off?",
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Continue',
                        cancelButtonText: 'Start Over',
                        icon: "info"
                    })
                    .then((result) => {
                        if (!result.dismiss) {
                            this.autoload(true);
                            resolve(true)
                        } else {
                            localStorage.clear();
                            resolve(false)
                        }
                    });
            }
            resolve(false);
        })
    },

    autoload(popup) {
        let saved_data = localStorage.getItem('autosave');

        if (saved_data) {
            let data = JSON.parse(saved_data);
            const store = this.$store.calendar;

            store.calendar_name = data.calendar_name;
            store.static_data = data.static_data;
            store.dynamic_data = data.dynamic_data;
            store.events = data.events;
            store.event_categories = data.event_categories;

            this.evaluate_current_step();

            this.$dispatch('calendar-loaded', {
                hash: store.hash,
                userId: calendar_structure.userId,
                calendar_name: store.calendar_name,
                calendar_id: store.calendar_id,
                static_data: store.static_data,
                dynamic_data: store.dynamic_data,
                is_linked: store.is_linked,
                has_parent: store.has_parent,
                parent_hash: store.parent_hash,
                parent_offset: store.parent_offset,
                events: store.events,
                event_categories: store.event_categories,
                last_static_change: store.last_static_change,
                last_dynamic_change: store.last_dynamic_change,
                advancement: store.advancement
            });

            this.$dispatch("rebuild-calendar");
            this.$dispatch("events-changed");

            if (popup) {
                swal.fire({
                    icon: "success",
                    title: "Loaded!",
                    text: "The calendar " + store.calendar_name + " has been loaded."
                });
            }

            this.$dispatch("events-changed");
        }
    },


    rebuild_calendar() {
        this.$store.calendar.rebuild_calendar();
    },

    render_calendar() {
        this.$store.calendar.render_calendar();
    },

    update_calendar($event) {
        this.$store.calendar.debounceUpdate($event.detail.calendar);
    },

    calendar_updated(){
        this.evaluate_current_step();
        this.autosave();
    }
});
