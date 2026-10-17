import _ from "lodash";
import { get_dynamic_data, check_last_change } from "./calendar_ajax_functions.js";
import { bind_calendar_events, registerMousemoveCallback } from './calendar_manager.js';
import Perms from "../perms.js";

export default (calendar_structure) => ({

    last_mouse_move: false,
    poll_timer: false,
    instapoll: false,
    new_dynamic_change: false,

    init() {
        let preview_date = _.cloneDeep(calendar_structure.dynamic_data);
        preview_date.follow = true;
        const store = this.$store.calendar;

        store.initialize({
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

        store.setup();
        store.rebuild_calendar();

        bind_calendar_events();

        if (store.has_parent) {

            this.last_mouse_move = Date.now();
            this.poll_timer = setTimeout(this.check_dates.bind(this), 5000);
            this.instapoll = false;

            window.addEventListener('focus', () => {
                this.check_dates();
            });

            registerMousemoveCallback('view_update', () => {
                this.last_mouse_move = Date.now();
                if (this.instapoll) {
                    this.instapoll = false;
                    this.check_dates();
                }
            })

        }

        this.$nextTick(
            () => this.$dispatch(
                'calendar-loaded', {
                hash: store.hash,
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
            }
            )
        );

        this.$dispatch("events-changed");
    },

    check_dates() {
        const store = this.$store.calendar;
        if ((document.hasFocus() && (Date.now() - this.last_mouse_move) < 10000) || store.advancement.advancement_enabled) {
            this.instapoll = false;
            check_last_change(store.hash).then((result) => {
                this.new_dynamic_change = new Date(result.data.last_dynamic_change)
                if (this.new_dynamic_change > store.last_dynamic_change) {
                    store.last_dynamic_change = this.new_dynamic_change
                    return get_dynamic_data(store.hash)
                        .then((result) => {
                            this.$dispatch("calendar-updated", {
                                calendar: {
                                    dynamic_data: result.data.dynamic_data
                                }
                            });
                        });
                }
            }).catch(() => {}).finally(() => {
                this.poll_timer = setTimeout(this.check_dates.bind(this), 5000);
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
