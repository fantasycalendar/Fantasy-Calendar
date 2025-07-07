import _ from "lodash";

export default (calendar_structure) => ({

    last_mouse_move: false,
    poll_timer: false,
    instapoll: false,
    new_dynamic_change: false,

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

        this.$store.calendar.setup();
        this.$store.calendar.rebuild_calendar();

        bind_calendar_events();

        if (window.has_parent) {

            this.last_mouse_move = Date.now();
            this.poll_timer = setTimeout(this.check_dates.bind(this), 5000);
            this.instapoll = false;

            window.addEventListener('focus', () => {
                this.check_dates();
            });

            window.registered_mousemove_callbacks['view_update'] = () => {
                this.last_mouse_move = Date.now();
                if (this.instapoll) {
                    this.instapoll = false;
                    this.check_dates();
                }
            }

        }

        this.$nextTick(
            () => this.$dispatch(
                'calendar-loaded', {
                hash: window.hash,
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
            }
            )
        );

        window.dispatchEvent(new CustomEvent("events-changed"));
    },

    check_dates() {
        if ((document.hasFocus() && (Date.now() - this.last_mouse_move) < 10000) || window.advancement.advancement_enabled) {
            this.instapoll = false;
            check_last_change(window.hash).then((result) => {
                this.new_dynamic_change = new Date(result.data.last_dynamic_change)
                if (this.new_dynamic_change > window.last_dynamic_change) {
                    window.last_dynamic_change = this.new_dynamic_change
                    get_dynamic_data(window.hash)
                        .then((result) => {
                            window.dispatchEvent(new CustomEvent("calendar-updated", {
                                detail: {
                                    calendar: {
                                        dynamic_data: result.dynamic_data
                                    }
                                }
                            }));
                            this.poll_timer = setTimeout(this.check_dates.bind(this), 5000);
                        })
                        .catch(error => {
                            this.$dispatch('notify', {
                                content: error.response.data.message,
                                type: "error"
                            });
                        });
                } else {
                    this.poll_timer = setTimeout(this.check_dates.bind(this), 5000);
                }
            });
        } else {
            this.instapoll = true;
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
    }
});
