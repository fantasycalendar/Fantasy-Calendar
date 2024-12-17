import { do_error_check } from "./calendar_inputs_edit.js";
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
            advancement_enabled: calendar_structure.advancement_enabled,
            advancement_real_rate: calendar_structure.advancement_real_rate,
            advancement_real_rate_unit: calendar_structure.advancement_real_rate_unit,
            advancement_rate: calendar_structure.advancement_rate,
            advancement_rate_unit: calendar_structure.advancement_rate_unit,
            advancement_webhook_url: calendar_structure.advancement_webhook_url,
            advancement_timezone: calendar_structure.advancement_timezone
        }

        window.preview_date = _.cloneDeep(calendar_structure.dynamic_data);
        window.preview_date.follow = true;

        rebuild_calendar('calendar', dynamic_data);

        set_up_edit_inputs();
        set_up_edit_values();
        set_up_view_values();
        set_up_visitor_values();

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

            check_last_change(window.hash, (result) => {

                this.new_dynamic_change = new Date(result.last_dynamic_change)

                if (this.new_dynamic_change > window.last_dynamic_change) {

                    window.last_dynamic_change = this.new_dynamic_change

                    get_dynamic_data(window.hash, (result) => {

                        if (result.error) {
                            throw result.message;
                        }

                        window.dynamic_data = _.cloneDeep(result.dynamic_data);

                        this.check_update(false);
                        evaluate_settings();
                        eval_clock();
                        this.poll_timer = setTimeout(this.check_dates.bind(this), 5000);

                    });

                } else {

                    this.poll_timer = setTimeout(this.check_dates.bind(this), 5000);

                }

            });

        } else {

            this.instapoll = true;

        }

    },

    check_update(rebuild) {

        let data = window.dynamic_date_manager.compare(window.dynamic_data);

        window.dynamic_date_manager = new date_manager(window.dynamic_data.year, window.dynamic_data.timespan, window.dynamic_data.day);

        if (window.preview_date.follow) {
            window.preview_date = _.cloneDeep(window.dynamic_data);
            window.preview_date.follow = true;
            window.preview_date_manager = new date_manager(window.preview_date.year, window.preview_date.timespan, window.preview_date.day);
        }

        window.current_year.val(window.dynamic_data.year);

        repopulate_timespan_select(window.current_timespan, window.dynamic_data.timespan, false);

        repopulate_day_select(window.current_day, window.dynamic_data.day, false);

        display_preview_back_button();

        if (rebuild || ((data.rebuild || window.static_data.settings.only_reveal_today) && window.preview_date.follow)) {
            rebuild_calendar('calendar', window.dynamic_data);
            set_up_visitor_values();
        } else {
            update_current_day(false);
        }

        set_up_view_values();

    },

    rerenderRequested($event) {
        // TODO: Evaluate whether this should be here or not
        let structuralKeys = ["year_data"];
        let structureChanged = false;
        for(const [key, value] of Object.entries($event.detail.calendar)) {
            window.static_data = _.set(window.static_data, key, _.cloneDeep(value));
            console.log(key)
            structureChanged = structureChanged || structuralKeys.some(structuralKey => key.startsWith(structuralKey));
        }

        // First of many rules, I'm sure.
        window.static_data.year_data.overflow = window.static_data.year_data.overflow
            && !window.static_data.year_data.leap_days.some(leapDay => leapDay.adds_week_day)
            && !window.static_data.year_data.timespans.some(month => month?.week?.length);

        do_error_check("calendar", $event.detail.rerender);

        if(structureChanged){
            window.dispatchEvent(new CustomEvent('calendar-structure-changed'));
        }
    }
});
