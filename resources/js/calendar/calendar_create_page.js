import _ from "lodash";


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

        if (this.current_step >= 1) {
            if (this.$store.calendar.calendar_name === "") {
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
            if (this.$store.calendar.static_data.year_data.global_week.length === 0) {
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
            if (this.$store.calendar.static_data.year_data.timespans.length === 0) {
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

        window.Perms = new Perms(
            calendar_structure.userId,
            calendar_structure.owned,
            calendar_structure.paymentLevel,
            calendar_structure.userRole
        );

        window.evaluated_static_data = {};

        window.dark_theme = calendar_structure.dark_theme;

        window.hash = calendar_structure.hash;

        window.calendar_name = calendar_structure.calendar_name;
        window.calendar_id = calendar_structure.calendar_id;
        window.static_data = calendar_structure.static_data;
        window.dynamic_data = calendar_structure.dynamic_data;

        window.is_linked = calendar_structure.is_linked;
        window.has_parent = calendar_structure.has_parent;
        window.parent_hash = calendar_structure.parent_hash;
        window.parent_offset = calendar_structure.parent_offset;

        window.events = calendar_structure.events;
        window.event_categories = calendar_structure.event_categories;

        window.last_static_change = new Date(calendar_structure.last_static_change)
        window.last_dynamic_change = new Date(calendar_structure.last_dynamic_change)

        window.advancement = {
            advancement_enabled: !!calendar_structure.advancement_enabled,
            advancement_real_rate: calendar_structure.advancement_real_rate,
            advancement_real_rate_unit: calendar_structure.advancement_real_rate_unit,
            advancement_rate: calendar_structure.advancement_rate,
            advancement_rate_unit: calendar_structure.advancement_rate_unit,
            advancement_webhook_url: calendar_structure.advancement_webhook_url,
            advancement_timezone: calendar_structure.advancement_timezone
        }

        window.preview_date = _.cloneDeep(calendar_structure.dynamic_data);
        window.preview_date.follow = true;

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
        let saved_data = JSON.stringify({
            calendar_name: this.$store.calendar.calendar_name,
            static_data: this.$store.calendar.static_data,
            dynamic_data: this.$store.calendar.dynamic_data,
            events: this.$store.calendar.events,
            event_categories: this.$store.calendar.event_categories
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
            // TODO: Change these from window to some unified store
            let data = JSON.parse(saved_data);
            window.prev_calendar_name = "";
            window.prev_dynamic_data = {};
            window.prev_static_data = {};
            window.prev_events = {};
            window.prev_event_categories = {};

            window.calendar_name = data.calendar_name;
            window.static_data = data.static_data;
            window.dynamic_data = data.dynamic_data;
            window.events = data.events;

            this.evaluate_current_step();

            this.$dispatch('calendar-loaded', {
                hash: window.hash,
                userId: calendar_structure.userId,
                calendar_name: window.calendar_name,
                calendar_id: window.calendar_id,
                static_data: window.static_data,
                dynamic_data: window.dynamic_data,
                is_linked: window.is_linked,
                has_parent: window.has_parent,
                parent_hash: window.parent_hash,
                parent_offset: window.parent_offset,
                events: window.events,
                event_categories: window.event_categories,
                last_static_change: window.last_static_change,
                last_dynamic_change: window.last_dynamic_change,
                advancement: window.advancement
            });

            this.$dispatch("rebuild-calendar");
            this.$dispatch("events-changed");

            if (popup) {
                swal.fire({
                    icon: "success",
                    title: "Loaded!",
                    text: "The calendar " + window.calendar_name + " has been loaded."
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
