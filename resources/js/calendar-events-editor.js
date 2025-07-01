import { submit_new_event, submit_edit_event, submit_delete_event } from "./calendar/calendar_ajax_functions";
import { ordinal_suffix_of, precisionRound, clone } from "./calendar/calendar_functions";
import { condition_mapping, moon_phases } from "./calendar/calendar_variables";
import { repopulate_timespan_select, repopulate_day_select } from "./calendar/calendar_inputs_visitor";
import { hide_loading_screen } from "./calendar/header";

export default () => ({
    open: false,
    new_event: true,
    cloning_event: false,
    creation_type: "Creating Event",
    moon_overrides_open: false,
    settings_open: false,
    event_id: undefined,
    epoch_data: undefined,
    event_conditions_container: undefined,
    event_description_content: '',
    inputs_changed: false,
    delete_hover_element: undefined,
    isDeletingDroppable: false,
    isDeletingConditions: false,
    moons: [],

    working_event: {
        'name': '',
        'description': '',
        'event_category_id': -1,
        'data': {
            'has_duration': false,
            'duration': 1,
            'show_first_last': false,
            'limited_repeat': false,
            'limited_repeat_num': 1,
            'conditions': [],
            'connected_events': [],
            'date': [],
            'search_distance': 0,
            'moon_overrides': []
        },
        'settings': {
            'color': 'Dark-Solid',
            'text': 'text',
            'hide': false,
            'print': false,
            'hide_full': false
        },
    },

    has_initialized: false,

    initialize($event) {

        this.epoch = $event.detail.epoch;
        this.epoch_data = window.evaluated_static_data.epoch_data[this.epoch];

        /* Some scripts are loaded after Alpine, so we need to set everything up when the UI is first opened */
        if (!this.has_initialized) {
            let event_editor_ui = this;

            this.event_conditions_container = $(this.$refs.event_conditions_container);
            this.nth_input = $(this.$refs.nth_input);

            // this.event_conditions_container.nestedSortable({
            //     handle: ".handle",
            //     containerSelector: ".group_list_root, .group_list",
            //     onDragStart(item, container, _super, event) {
            //         item.css({
            //             height: item.outerHeight(),
            //             width: item.outerWidth()
            //         })
            //         item.addClass(container.group.options.draggedClass)
            //         $("body").addClass(container.group.options.bodyClass)
            //         container.rootGroup.placeholder.css('height', item.css("height"));
            //         $('#condition_remove_button .icon').addClass('wiggle');
            //     },
            //     onDrop(item, container, _super, event) {
            //         item.removeClass(container.group.options.draggedClass).removeAttr("style");
            //         $("body").removeClass(container.group.options.bodyClass);
            //         $('#condition_remove_button .icon').removeClass('wiggle').removeClass('faster');
            //         if (event_editor_ui.isDeletingDroppable) {
            //             item.remove();
            //         }
            //         event_editor_ui.evaluate_condition_selects(event_editor_ui.event_conditions_container);
            //         event_editor_ui.inputs_changed = true;
            //     },
            //     tolerance: -5
            // });

            this.evaluate_condition_selects(event_editor_ui.event_conditions_container);

            $(document).on('change', '.moon_select', function() {
                event_editor_ui.evaluate_inputs($(this).closest('.condition'));
            });


            $(document).on('change', '.condition_type', function() {

                let selected_option = $(this).find(":selected");
                let type = selected_option.parent().attr('label');

                let lastClass = $(this).closest('.condition_container').attr('class').split(' ').pop();
                $(this).closest('.condition_container').removeClass(lastClass).addClass(type);

                event_editor_ui.evaluate_inputs($(this).closest('.condition'));

            });

            $(document).on('change', '.group_type input[type="radio"]', function() {
                let container = $(this).parent().parent().parent();
                let type = $(this).parent().parent().attr('class');
                container.attr('type', type);
                if (type === "num") {
                    container.find('.num_group_con').prop('disabled', false).attr('min', 1).attr('max', Math.max(1, container.find('.group_list').children().length)).val("1");
                } else {
                    container.find('.num_group_con').prop('disabled', true).val('');
                }
                event_editor_ui.evaluate_condition_selects(event_editor_ui.event_conditions_container);
            })

            $(document).on('mouseenter', '.condition', function(e) {
                if (event_editor_ui.isDeletingConditions) {
                    event_editor_ui.set_delete_element($(this));
                }
            });

            $(document).on('mouseleave', '.condition', function(e) {
                if (event_editor_ui.isDeletingConditions) {
                    if ($(this).parent().hasClass('group_list')) {
                        event_editor_ui.set_delete_element($(this).parent().parent());
                    } else {
                        event_editor_ui.set_delete_element();
                    }
                }
            });

            $(document).on('mouseenter', '.group', function(e) {
                if (event_editor_ui.isDeletingConditions) {
                    event_editor_ui.set_delete_element($(this));
                }
            });

            $(document).on('mouseleave', '.group', function(e) {
                if (event_editor_ui.isDeletingConditions) {
                    if ($(this).parent().hasClass('group_list')) {
                        event_editor_ui.set_delete_element($(this).parent().parent());
                    } else {
                        event_editor_ui.set_delete_element();
                    }
                }
            });

            $(document).on('click', '.condition, .condition div, .condition select, .condition span', function(e) {
                if (event_editor_ui.isDeletingConditions) {
                    e.preventDefault();
                    e.stopPropagation();
                    let item = $(this).closest('.condition');
                    if (item.parent().hasClass('group_list')) {
                        let parent = item.parent();
                        item.remove();
                        if (parent.children().length === 0) {
                            parent.parent().remove();
                        }
                    } else {
                        item.remove();
                    }

                    event_editor_ui.evaluate_condition_selects(event_editor_ui.event_conditions_container);
                    event_editor_ui.inputs_changed = true;
                }
            });

            $(document).on('click', '.group, .group .group_list', function(e) {
                if (event_editor_ui.isDeletingConditions) {

                    e.preventDefault();
                    e.stopPropagation();

                    let group_list;
                    if ($(this).hasClass('group_list')) {
                        group_list = $(this);
                    } else {
                        group_list = $(this).find('.group_list');
                    }

                    if (group_list.children().length > 0) {

                        swal.fire({
                            title: "Warning!",
                            text: "This group has conditions in it, are you sure you want to delete it and all of its conditions?",
                            showCancelButton: true,
                            confirmButtonColor: '#d33',
                            cancelButtonColor: '#3085d6',
                            confirmButtonText: 'Yes',
                            icon: "warning",
                        }).then((result) => {

                            if (!result.dismiss) {
                                group_list.parent().remove();
                                event_editor_ui.evaluate_condition_selects(event_editor_ui.event_conditions_container);
                                event_editor_ui.inputs_changed = true;
                            }

                        });

                    } else {
                        group_list.parent().remove();
                        event_editor_ui.evaluate_condition_selects(event_editor_ui.event_conditions_container);
                        event_editor_ui.inputs_changed = true;
                    }
                }
            });

            this.has_initialized = true;

        }

    },

    set_delete_element(element) {
        if (this.delete_hover_element !== undefined) {
            this.delete_hover_element.removeClass('hover').removeClass('cursor-pointer');
            this.delete_hover_element.find('select').not('.condition_operator').prop('disabled', false);
            this.delete_hover_element.find('input').prop('disabled', false);
            this.delete_hover_element.find('.fa-bars').addClass('handle');
        }
        this.delete_hover_element = element;
        if (this.delete_hover_element !== undefined) {
            this.delete_hover_element.addClass('hover').addClass('cursor-pointer');
            this.delete_hover_element.find('select').not('.condition_operator').prop('disabled', true);
            this.delete_hover_element.find('input').prop('disabled', true);
            this.delete_hover_element.find('.fa-bars').removeClass('handle');
        }
    },

    show() {
        this.open = true;

        this.$nextTick(() => this.$refs.event_name.focus());
    },

    clone_event($event) {

        this.initialize($event);

        if ($event.detail.event_data === undefined && $event.detail.event_id) {
            $event.detail.event_data = clone(window.events[$event.detail.event_id]);
            $event.detail.event_data.name += " (clone)";
        }

        this.new_event = true;
        this.cloning_event = true;

        this.working_event = $event.detail.event_data;
        delete this.working_event['id'];

        this.creation_type = "Cloning Event"

        this.set_up_moon_data();

        this.event_id = Object.keys(window.events).length;

        this.create_conditions(this.working_event.data.conditions, this.event_conditions_container);

        this.evaluate_condition_selects(this.event_conditions_container);

        this.inputs_changed = false;

        this.show();
    },

    create_new_event($event) {

        this.initialize($event);

        this.new_event = true;
        let name = sanitizeHtml($event.detail.name ?? "");
        this.creation_type = "Creating Event"

        this.working_event = {
            'name': name,
            'description': '',
            'event_category_id': -1,
            'data': {
                'has_duration': false,
                'duration': 1,
                'show_first_last': false,
                'limited_repeat': false,
                'limited_repeat_num': 1,
                'conditions': [
                    ['Date', '0', [this.epoch_data.year, this.epoch_data.timespan_index, this.epoch_data.day]]
                ],
                'connected_events': [],
                'date': [this.epoch_data.year, this.epoch_data.timespan_index, this.epoch_data.day],
                'search_distance': 0
            },
            'settings': {
                'color': 'Dark-Solid',
                'text': 'text',
                'hide': false,
                'print': false,
                'hide_full': false
            },
        };

        if (this.description_input) {
            // this.description_input.trumbowyg('html', this.working_event.description);
        }

        let default_category = this.$store.calendar.default_event_category;

        if (default_category) {
            this.working_event.event_category_id = default_category.id;
            this.working_event.settings.color = default_category.event_settings.color;
            this.working_event.settings.text = default_category.event_settings.text;
            this.working_event.settings.hide = default_category.event_settings.hide;
            this.working_event.settings.print = default_category.event_settings.print;
            this.working_event.settings.hide_full = default_category.event_settings.hide_full;
        }

        this.set_up_moon_data();

        this.event_id = Object.keys(window.events).length;

        this.populate_condition_presets();
        this.update_every_nth_presets();

        this.add_preset_conditions(this.preset, this.nth);

        this.show();

    },

    event_category_changed() {
        if (this.working_event.event_category_id == -1) {
            return;
        }

        let category = this.$store.calendar.find_event_category(this.working_event.event_category_id);

        if (!category) {
            return;
        }

        this.working_event.settings.color = category.event_settings.color;
        this.working_event.settings.text = category.event_settings.text;
        this.working_event.settings.hide = category.event_settings.hide;
        this.working_event.settings.print = category.event_settings.print;
        this.working_event.settings.hide_full = category.event_settings.hide_full;
    },

    edit_event($event) {

        this.initialize($event);

        this.new_event = false;

        this.creation_type = "Editing Event"

        let event_index = $event.detail.event_id;

        if ($event.detail.event_db_id !== undefined) {
            event_index = window.events.findIndex((item) => item.id === $event.detail.event_db_id);
        }

        this.event_id = event_index;

        this.working_event = clone(window.events[this.event_id]);

        this.set_up_moon_data();

        this.event_description_content = this.working_event.description;

        this.create_conditions(this.working_event.data.conditions, this.event_conditions_container);

        this.evaluate_condition_selects(this.event_conditions_container);

        this.inputs_changed = false;

        this.show();

    },

    save_event() {

        this.working_event.data = this.create_event_data();

        this.working_event.name = sanitizeHtml((this.working_event.name === "") ? "New Event" : this.working_event.name);

        this.working_event.description = this.event_description_content;

        window.events[this.event_id] = clone(this.working_event);

        let not_view_page = window.location.pathname.indexOf('/edit') > -1 || window.location.pathname.indexOf('/calendars/create') > -1;

        if (not_view_page) {
            if (!this.new_event) {
                $(`.events_input[index="${this.event_id}"]`).find(".event_name").text(`Edit - ${sanitizeHtml(window.events[this.event_id].name)}`);
            }

            this.submit_event_callback(true);

        } else {
            if (this.new_event) {
                submit_new_event(this.event_id, this.submit_event_callback);
            } else {
                submit_edit_event(this.event_id, this.submit_event_callback);
            }
        }

        window.dispatchEvent(new CustomEvent("events-changed"));

        this.close();

    },

    submit_event_callback(success) {

        if (success) {
            window.dispatchEvent(new CustomEvent("render-calendar"));
        }

    },

    close() {

        this.open = false;

        this.event_id = -1;
        this.settings_open = false;
        this.preset = "once";
        this.previous_preset = "once";
        this.moon_presets = [];
        this.nth = 1;
        this.show_nth = false;
        this.cloning_event = false;

        if (this.description_input) {
            // this.description_input.trumbowyg('html', '');
        }

        this.working_event = {
            'name': '',
            'description': '',
            'event_category_id': -1,
            'data': {
                'has_duration': false,
                'duration': 1,
                'show_first_last': false,
                'limited_repeat': false,
                'limited_repeat_num': 1,
                'conditions': [],
                'connected_events': [],
                'date': [],
                'search_distance': 0
            },
            'settings': {
                'color': 'Dark-Solid',
                'text': 'text',
                'hide': false,
                'print': false,
                'hide_full': false
            },
        }

        this.event_testing.occurrences = [];
        this.event_testing.occurrences_text = [];
        this.event_testing.visible_occurrences_1 = [];
        this.event_testing.visible_occurrences_2 = [];
        this.event_testing.text = "";

        if (this.event_conditions_container) {
            this.event_conditions_container.empty();
        }

    },

    esc_clicked($event) {

        if (this.isDeletingConditions) {
            this.remove_clicked();
            return;
        }

        if (this.open) {
            this.confirm_close($event);
        }

    },

    confirm_clone() {
        // Don't do anything if a swal is open or the user is deleting conditions
        if (swal.isVisible() || this.isDeletingConditions) {
            this.remove_clicked();
            return false;
        }

        swal.fire({
            title: "Clone event?",
            text: 'Your changes to this event will not be saved! Are you sure you want to continue?',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            icon: "warning",
        }).then((result) => {
            if (!result.dismiss) {
                let new_event = clone(this.working_event);
                new_event.data = this.create_event_data();
                new_event.name = sanitizeHtml(((new_event.name === "") ? "New Event" : new_event.name) + " (clone)");
                new_event.description = "this.description_input.trumbowyg('html')";
                this.close();
                window.dispatchEvent(new CustomEvent('event-editor-modal-clone-event', { detail: { event_data: new_event, epoch: this.epoch } }));
            }
        });

    },

    confirm_close($event) {
        const possibleTrumbowyg = [$event.target.id, $event.target.parentElement?.id].concat(
            Array.from($event.target?.classList),
            Array.from($event.target?.parentElement?.classList ?? []),
            Array.from($event.target?.parentElement?.parentElement?.classList ?? []),
        );

        if (possibleTrumbowyg.some(entry => entry.startsWith('trumbowyg-'))) return false;

        // Don't do anything if a swal is open or the user is deleting conditions
        if (swal.isVisible() || this.isDeletingConditions) {
            return false;
        }

        if (this.event_has_changed() || this.new_event) {
            swal.fire({
                title: "Close event without saving?",
                text: 'Any changes to this event will not be saved! Are you sure you want to continue?',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                icon: "warning",
            }).then((result) => {
                if (!result.dismiss) {
                    this.close();
                }
            });
        } else {
            this.close();
        }

    },

    confirm_view() {

        if (this.event_has_changed()) {
            swal.fire({
                title: "Close event without saving?",
                text: 'Your changes to this event will not be saved! Are you sure you want to continue?',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                icon: "warning",
            }).then((result) => {
                if (!result.dismiss) {
                    window.dispatchEvent(new CustomEvent('event-viewer-modal-view-event', { detail: { event_id: this.event_id, era: false, epoch: this.epoch } }));
                    this.close();
                }
            });
        } else {
            window.dispatchEvent(new CustomEvent('event-viewer-modal-view-event', { detail: { event_id: this.event_id, era: false, epoch: this.epoch } }));
            this.close();
        }

    },

    create_event_data() {

        this.working_event.data.connected_events = [];
        let conditions = Perms.player_at_least("co-owner")
            ? this.create_condition_array(this.event_conditions_container)
            : [['Date', '0', [this.epoch_data.year, this.epoch_data.timespan_index, this.epoch_data.day]]];

        let search_distance = this.get_search_distance(conditions);

        let date = [];

        if (conditions.length === 1 || conditions.length === 5) {

            if (conditions.length === 1) {

                if (conditions[0][0] === "Date" && conditions[0][1] === "0") {
                    date = [Number(conditions[0][2][0]), Number(conditions[0][2][1]), Number(conditions[0][2][2])];
                }

            } else {

                let year = false;
                let month = false;
                let day = false
                let ands = 0

                for (let i = 0; i < conditions.length; i++) {
                    if (conditions[i].length === 3) {
                        if (conditions[i][0] === "Year" && Number(conditions[i][1]) === 0) {
                            year = true;
                            date[0] = Number(conditions[i][2][0])
                        }

                        if (conditions[i][0] === "Month" && Number(conditions[i][1]) === 0) {
                            month = true;
                            date[1] = Number(conditions[i][2][0])
                        }

                        if (conditions[i][0] === "Day" && Number(conditions[i][1]) === 0) {
                            day = true;
                            date[2] = Number(conditions[i][2][0])
                        }
                    } else if (conditions[i].length === 1) {
                        if (conditions[i][0] === "&&") {
                            ands++;
                        }
                    }
                }

                if (!(year && month && day && ands === 2)) {
                    date = [];
                }
            }
        }



        let moon_data = {}
        for (let index in this.moons) {
            let moon = this.moons[index];
            moon_data[index] = {};
            if (moon.hidden) {
                moon_data[index]['hidden'] = true;
                continue
            }
            if (moon.override_phase) {
                moon_data[index]['override_phase'] = moon.override_phase;
                moon_data[index]['phase'] = moon.phase;
            }
            if (moon.color !== moon.original_color) {
                moon_data[index]['color'] = moon.color;
            }
            if (moon.shadow_color !== moon.original_shadow_color) {
                moon_data[index]['shadow_color'] = moon.shadow_color;
            }
            if (moon.phase_name !== "") {
                moon_data[index]['phase_name'] = moon.phase_name;
            }
            if (Object.keys(moon_data[index]).length === 0) {
                delete moon_data[index];
            }
        }

        return JSON.parse(JSON.stringify({
            has_duration: this.working_event.data.has_duration,
            duration: this.working_event.data.duration | 0,
            show_first_last: this.working_event.data.show_first_last,
            limited_repeat: this.working_event.data.limited_repeat,
            limited_repeat_num: this.working_event.data.limited_repeat_num | 0,
            conditions: conditions,
            connected_events: this.working_event.data.connected_events,
            date: date,
            search_distance: search_distance,
            overrides: {
                moons: moon_data
            }
        }));

    },

    get_search_distance(conditions) {

        let search_distance = 0;

        if (this.working_event.data.has_duration || this.working_event.data.limited_repeat) {
            search_distance = this.working_event.data.duration | 0 > search_distance ? this.working_event.data.duration | 0 : search_distance;
            search_distance = this.working_event.data.limited_repeat_num | 0 > search_distance ? this.working_event.data.limited_repeat_num | 0 : search_distance;
        }

        search_distance = this.recurse_conditions(conditions, search_distance);

        return search_distance;

    },

    recurse_conditions(conditions, search_distance) {

        for (let index in conditions) {

            let new_search_distance = 0;

            let condition = conditions[index];

            if (condition.length === 3 && condition[0] === "Events") {
                new_search_distance = Number(condition[2][1]);
            } else if (condition.length === 2) {
                new_search_distance = this.recurse_conditions(condition[1], search_distance)
            }

            search_distance = new_search_distance > search_distance ? new_search_distance : search_distance;
        }

        return search_distance;

    },

    reset_moon_color(index, shadow) {

        let color_key = (shadow ? "shadow_" : "") + "color";

        this.moons[index][color_key] = this.moons[index]["original_" + color_key];

    },

    event_is_one_time() {

        let date = []

        this.working_event.data.connected_events = [];
        this.working_event.data.conditions = this.create_condition_array(this.event_conditions_container);

        if (this.working_event.data.conditions.length === 1 || this.working_event.data.conditions.length === 5) {

            if (this.working_event.data.conditions.length === 1) {

                if (this.working_event.data.conditions[0][0] === "Date" && this.working_event.data.conditions[0][1] === 0) {
                    return true
                }

            } else {

                let year = false;
                let month = false;
                let day = false
                let ands = 0

                for (let i = 0; i < this.working_event.data.conditions.length; i++) {
                    if (this.working_event.data.conditions[i].length === 3) {
                        if (this.working_event.data.conditions[i][0] === "Year" && Number(this.working_event.data.conditions[i][1]) === 0) {
                            year = true;
                            date[0] = Number(this.working_event.data.conditions[i][2][0])
                        }

                        if (this.working_event.data.conditions[i][0] === "Month" && Number(this.working_event.data.conditions[i][1]) === 0) {
                            month = true;
                            date[1] = Number(this.working_event.data.conditions[i][2][0])
                        }

                        if (this.working_event.data.conditions[i][0] === "Day" && Number(this.working_event.data.conditions[i][1]) === 0) {
                            day = true;
                            date[2] = Number(this.working_event.data.conditions[i][2][0])
                        }
                    } else if (this.working_event.data.conditions[i].length === 1) {
                        if (this.working_event.data.conditions[i][0] === "&&") {
                            ands++;
                        }
                    }
                }

                if (!(year && month && day && ands === 2)) {
                    date = [];
                }

            }
        }

        return date.length > 0 || this.working_event.data.conditions.length === 0;

    },

    event_has_changed() {

        if (window.events[this.event_id] && this.inputs_changed) {

            let event_check = clone(window.events[this.event_id])

            let eventid = window.events[this.event_id].id;

            if (eventid !== undefined) {
                event_check.id = eventid;
            }

            event_check.data = this.create_event_data();

            event_check.description = "this.description_input.trumbowyg('html')";

            event_check.settings = clone(this.working_event.settings)

            return !Object.compare(event_check, window.events[this.event_id])

        } else {

            return false;

        }

    },

    set_up_moon_data() {

        if (!window.static_data.moons.length) return;

        this.moons = [];
        for (let index in window.static_data.moons) {
            let moon = clone(window.static_data.moons[index])
            moon.index = index;
            moon.hidden = false;
            moon.shadow_color = moon.shadow_color ? moon.shadow_color : "#292b4a";
            moon.original_shadow_color = clone(moon.shadow_color);
            moon.original_color = clone(moon.color);
            moon.override_phase = false;
            moon.original_phase = this.epoch_data.moon_phase[index];
            moon.phase = this.epoch_data.moon_phase[index];
            moon.phases = clone(Object.keys(moon_phases[moon.granularity]))
            moon.paths = clone(Object.values(moon_phases[moon.granularity]))
            moon.phase_name = "";
            this.moons.push(moon);
        }

        if (this.working_event.data.overrides !== undefined) {
            if (this.working_event.data.overrides.moons !== undefined) {
                for (let index in this.working_event.data.overrides.moons) {
                    let moon_data = this.working_event.data.overrides.moons[index];
                    for (let key in moon_data) {
                        this.moons[index][key] = moon_data[key];
                    }
                }
            }
        }

    },

    presets: {
        "none": { text: "None", enabled: true, nth: false },
        "once": { text: "Once", enabled: true, nth: false },
        "daily": { text: "Daily", enabled: true, nth: false },
        "weekly": { text: "", enabled: true, nth: false },
        "fortnightly": { text: "", enabled: true, nth: false },
        "monthly_date": { text: "", enabled: true, nth: false },
        "monthly_weekday": { text: "", enabled: true, nth: false },
        "monthly_inverse_weekday": { text: "", enabled: true, nth: false },
        "annually_date": { text: "", enabled: true, nth: false },
        "annually_month_weekday": { text: "", enabled: true, nth: false },
        "annually_inverse_month_weekday": { text: "", enabled: true, nth: false },
        "every_x_day": { text: "", enabled: true, nth: true },
        "every_x_weekday": { text: "", enabled: true, nth: true },
        "every_x_monthly_date": { text: "", enabled: true, nth: true },
        "every_x_monthly_weekday": { text: "", enabled: true, nth: true },
        "every_x_inverse_monthly_weekday": { text: "", enabled: true, nth: true },
        "every_x_annually_date": { text: "", enabled: true, nth: true },
        "every_x_annually_weekday": { text: "", enabled: true, nth: true },
        "every_x_inverse_annually_weekday": { text: "", enabled: true, nth: true },
    },

    preset: "once",
    previous_preset: "once",
    moon_presets: [],
    nth: 2,
    show_nth: false,

    get selected_preset() {

        let selected_preset = this.presets[this.preset];

        if (!selected_preset) {
            selected_preset = this.moon_presets.find(moon_preset => moon_preset.value === this.preset);
        }
        return selected_preset;

    },

    condition_preset_changed($event) {

        if (this.preset === this.previous_preset) {
            return;
        }

        this.update_every_nth_presets();

        if (this.conditions_changed) {

            swal.fire({
                title: "Warning!",
                text: "This will override all of your conditions, are you sure you want to do that?",
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'OK',
                icon: "warning",
            }).then((result) => {

                if (result.dismiss) {

                    this.update_every_nth_presets();

                    this.event_conditions_container.empty();
                    this.add_preset_conditions(this.preset, this.nth);

                    this.previous_preset = this.preset;

                }

            });

            return;

        }

        this.update_every_nth_presets();

        this.event_conditions_container.empty();
        this.add_preset_conditions(this.preset, this.nth);

        this.previous_preset = this.preset;

        if (this.selected_preset.nth) {
            setTimeout(() => {
                $(this.$refs.nth_input).focus();
            }, 100);
        }

    },

    populate_condition_presets() {

        this.presets.weekly = {
            text: `Weekly on ${this.epoch_data.week_day_name}`,
            enabled: !this.epoch_data.intercalary
        }
        this.presets.fortnightly = {
            text: `Fortnightly on ${this.epoch_data.week_day_name}`,
            enabled: !this.epoch_data.intercalary
        }
        this.presets.monthly_date.text = `Monthly on the ${ordinal_suffix_of(this.epoch_data.day)}`;
        this.presets.monthly_weekday = {
            text: `Monthly on the ${ordinal_suffix_of(this.epoch_data.week_day_num)} ${this.epoch_data.week_day_name}`,
            enabled: !this.epoch_data.intercalary
        }

        let inverse_week_day_num = this.epoch_data.inverse_week_day_num === 1 ? "last" : ordinal_suffix_of(this.epoch_data.inverse_week_day_num) + " to last";

        this.presets.monthly_inverse_weekday = {
            text: `Monthly on the ${inverse_week_day_num} ${this.epoch_data.week_day_name}`,
            enabled: !this.epoch_data.intercalary
        }

        this.presets.annually_date.text = `Annually on the ${ordinal_suffix_of(this.epoch_data.day)} of ${sanitizeHtml(this.epoch_data.timespan_name)}`;

        this.presets.annually_month_weekday = {
            text: `Annually on the ${ordinal_suffix_of(this.epoch_data.week_day_num)} ${this.epoch_data.week_day_name} in ${sanitizeHtml(this.epoch_data.timespan_name)}`,
            enabled: !this.epoch_data.intercalary
        }
        this.presets.annually_inverse_month_weekday = {
            text: `Annually on the ${inverse_week_day_num} ${this.epoch_data.week_day_name} in ${sanitizeHtml(this.epoch_data.timespan_name)}`,
            enabled: !this.epoch_data.intercalary
        }

        this.moon_presets = [];

        if (!window.static_data.moons.length) return;

        let moon_phase_collection = ''

        for (let moon_index in window.static_data.moons) {

            let moon = window.static_data.moons[moon_index];

            const moonName = sanitizeHtml(moon.name);

            let moon_phase_name = Object.keys(moon_phases[moon.granularity])[this.epoch_data.moon_phase[moon_index]];

            moon_phase_collection += `${moonName} is ${moon_phase_name}, `

            this.moon_presets.push({
                text: `${moonName} - Every ${moon_phase_name}`,
                value: `moon_every.${moon_index}`,
                moon_index: moon_index,
                nth: false
            })

            this.moon_presets.push({
                text: `${moonName} - Every ${ordinal_suffix_of(this.epoch_data.moon_phase_num_month[moon_index])} ${moon_phase_name}`,
                value: `moon_x_every.${moon_index}`,
                moon_index: moon_index,
                nth: true
            })

            this.moon_presets.push({
                text: `${moonName} - Annually every ${moon_phase_name} in ${sanitizeHtml(this.epoch_data.timespan_name)}`,
                value: `moon_annually.${moon_index}`,
                moon_index: moon_index,
                nth: false
            })

            this.moon_presets.push({
                text: `${moonName} - Annually every ${ordinal_suffix_of(this.epoch_data.moon_phase_num_month[moon_index])} ${moon_phase_name} in ${sanitizeHtml(this.epoch_data.timespan_name)}`,
                value: `moon_x_annually.${moon_index}`,
                moon_index: moon_index,
                nth: true
            })

            this.moon_presets.push({
                text: `${moonName} - Every ${ordinal_suffix_of(this.epoch_data.moon_phase_num_year[moon_index])} ${moon_phase_name} in the year`,
                value: `moon_yearly.${moon_index}`,
                moon_index: moon_index,
                nth: false
            })

        }

        this.moon_presets.push({
            text: `When the moons are all in this alignment.`,
            value: "multimoon_every"
        })
    },

    nth_input_changed() {
        this.update_every_nth_presets();
        this.event_conditions_container.empty();
        this.add_preset_conditions(this.preset, this.nth);
    },

    update_every_nth_presets() {

        let repeat_string = !isNaN(this.nth) && this.nth > 1 ? `Every ${ordinal_suffix_of(this.nth)} ` : (this.nth === "" ? "Every nth" : "Every");

        let inverse_week_day_num = this.epoch_data.inverse_week_day_num === 1 ? "last" : ordinal_suffix_of(this.epoch_data.inverse_week_day_num) + " to last";

        this.presets.every_x_day.text = `${repeat_string} day`;

        this.presets.every_x_weekday = {
            text: `${repeat_string} ${this.epoch_data.week_day_name}`,
            enabled: !this.epoch_data.intercalary,
            nth: true
        }

        this.presets.every_x_monthly_date.text = `${repeat_string} month on the ${ordinal_suffix_of(this.epoch_data.day)}`;

        this.presets.every_x_monthly_weekday = {
            text: `${repeat_string} month on the ${ordinal_suffix_of(this.epoch_data.week_day_num)} ${this.epoch_data.week_day_name}`,
            enabled: !this.epoch_data.intercalary,
            nth: true
        }

        this.presets.every_x_inverse_monthly_weekday = {
            text: `${repeat_string} month on the ${inverse_week_day_num} ${this.epoch_data.week_day_name}`,
            enabled: !this.epoch_data.intercalary,
            nth: true
        }

        this.presets.every_x_annually_date.text = `${repeat_string} year on the ${ordinal_suffix_of(this.epoch_data.day)} of ${sanitizeHtml(this.epoch_data.timespan_name)}`;

        this.presets.every_x_annually_weekday = {
            text: `${repeat_string} year on the ${ordinal_suffix_of(this.epoch_data.week_day_num)} ${this.epoch_data.week_day_name} in ${sanitizeHtml(this.epoch_data.timespan_name)}`,
            enabled: !this.epoch_data.intercalary,
            nth: true
        }

        this.presets.every_x_inverse_annually_weekday = {
            text: `${repeat_string} year on the ${inverse_week_day_num} ${this.epoch_data.week_day_name} in ${sanitizeHtml(this.epoch_data.timespan_name)}`,
            enabled: !this.epoch_data.intercalary,
            nth: true
        }


    },

    add_preset_conditions(preset, repeats) {

        this.inputs_changed = true;

        let result;
        let moon_id;

        [preset, moon_id] = preset.split('.');

        switch (preset) {

            case 'none':
                result = [];
                break;

            case 'once':
                result = [
                    ['Date', '0', [this.epoch_data.year, this.epoch_data.timespan_index, this.epoch_data.day]]
                ];
                break;

            case 'daily':
                result = [
                    ['Epoch', '6', ["1", "0"]]
                ];
                break;

            case 'weekly':
                result = [
                    ['Weekday', '0', [this.epoch_data.week_day_name]]
                ];
                break;

            case 'fortnightly':
                result = [
                    ['Weekday', '0', [this.epoch_data.week_day_name]],
                    ['&&'],
                    ['Week', '32', ['2', (this.epoch_data.total_week_num % 2).toString()]]
                ];
                break;

            case 'monthly_date':
                result = [
                    ['Day', '0', [this.epoch_data.day]],
                ];
                break;

            case 'annually_date':
                result = [
                    ['Month', '0', [this.epoch_data.timespan_index]],
                    ['&&'],
                    ['Day', '0', [this.epoch_data.day]]
                ];
                break;

            case 'monthly_weekday':
                result = [
                    ['Weekday', '0', [this.epoch_data.week_day_name]],
                    ['&&'],
                    ['Weekday', '8', [this.epoch_data.week_day_num]]
                ];
                break;

            case 'monthly_inverse_weekday':
                result = [
                    ['Weekday', '0', [this.epoch_data.week_day_name]],
                    ['&&'],
                    ['Weekday', '14', [this.epoch_data.inverse_week_day_num]]
                ];
                break;

            case 'annually_month_weekday':
                result = [
                    ['Month', '0', [this.epoch_data.timespan_index]],
                    ['&&'],
                    ['Weekday', '0', [this.epoch_data.week_day_name]],
                    ['&&'],
                    ['Weekday', '8', [this.epoch_data.week_day_num]]
                ];
                break;

            case 'annually_inverse_month_weekday':
                result = [
                    ['Month', '0', [this.epoch_data.timespan_index]],
                    ['&&'],
                    ['Weekday', '0', [this.epoch_data.week_day_name]],
                    ['&&'],
                    ['Weekday', '14', [this.epoch_data.inverse_week_day_num]]
                ];
                break;

            case 'every_x_day':
                result = [
                    ['Epoch', '6', [repeats, (this.epoch_data.epoch) % repeats]]
                ];
                break;

            case 'every_x_weekday':
                result = [
                    ['Weekday', '0', [this.epoch_data.week_day_name]],
                    ['&&'],
                    ['Week', '20', [repeats, (this.epoch_data.total_week_num) % repeats]]
                ];
                break;

            case 'every_x_monthly_date':
                result = [
                    ['Day', '0', [this.epoch_data.day]],
                    ['&&'],
                    ['Month', '13', [repeats, (this.epoch_data.timespan_count + 1) % repeats]]
                ];
                break;

            case 'every_x_monthly_weekday':
                result = [
                    ['Weekday', '0', [this.epoch_data.week_day_name]],
                    ['&&'],
                    ['Weekday', '8', [this.epoch_data.week_day_num]],
                    ['&&'],
                    ['Month', '13', [repeats, (this.epoch_data.timespan_count + 1) % repeats]]
                ];
                break;

            case 'every_x_inverse_monthly_weekday':
                result = [
                    ['Weekday', '0', [this.epoch_data.week_day_name]],
                    ['&&'],
                    ['Weekday', '14', [this.epoch_data.inverse_week_day_num]],
                    ['&&'],
                    ['Month', '13', [repeats, (this.epoch_data.timespan_count + 1) % repeats]]
                ];
                break;

            case 'every_x_annually_date':
                result = [
                    ['Day', '0', [this.epoch_data.day]],
                    ['&&'],
                    ['Month', '0', [this.epoch_data.timespan_index]],
                    ['&&'],
                    ['Year', '6', [repeats, (this.epoch_data.year + 1) % repeats]]
                ];
                break;

            case 'every_x_annually_weekday':
                result = [
                    ['Weekday', '0', [this.epoch_data.week_day_name]],
                    ['&&'],
                    ['Weekday', '8', [this.epoch_data.week_day_num]],
                    ['&&'],
                    ['Month', '0', [this.epoch_data.timespan_index]],
                    ['&&'],
                    ['Year', '6', [repeats, (this.epoch_data.year + 1) % repeats]]
                ];
                break;

            case 'every_x_inverse_annually_weekday':
                result = [
                    ['Weekday', '0', [this.epoch_data.week_day_name]],
                    ['&&'],
                    ['Weekday', '14', [this.epoch_data.inverse_week_day_num]],
                    ['&&'],
                    ['Month', '0', [this.epoch_data.timespan_index]],
                    ['&&'],
                    ['Year', '6', [repeats, (this.epoch_data.year + 1) % repeats]]
                ];
                break;

            case 'moon_every':
                result = [
                    ['Moons', '0', [moon_id, this.epoch_data.moon_phase[moon_id]]]
                ];
                break;

            case 'moon_x_every':
                result = [
                    ['Moons', '0', [moon_id, this.epoch_data.moon_phase[moon_id]]],
                    ['&&'],
                    ['Moons', '7', [moon_id, this.epoch_data.moon_phase_num_month[moon_id]]]
                ];
                break;

            case 'moon_annually':
                result = [
                    ['Moons', '0', [moon_id, this.epoch_data.moon_phase[moon_id]]],
                    ['&&'],
                    ['Month', '0', [this.epoch_data.timespan_index]]
                ];
                break;

            case 'moon_x_annually':
                result = [
                    ['Moons', '0', [moon_id, this.epoch_data.moon_phase[moon_id]]],
                    ['&&'],
                    ['Moons', '7', [moon_id, this.epoch_data.moon_phase_num_month[moon_id]]],
                    ['&&'],
                    ['Month', '0', [this.epoch_data.timespan_index]]
                ];
                break;

            case 'moon_yearly':
                result = [
                    ['Moons', '0', [moon_id, this.epoch_data.moon_phase[moon_id]]],
                    ['&&'],
                    ['Moons', '14', [moon_id, this.epoch_data.moon_phase_num_year[moon_id]]]
                ];
                break;

            case 'multimoon_every':
                result = [];
                for (let i = 0; i < window.static_data.moons.length; i++) {
                    result.push(['Moons', '0', [i, this.epoch_data.moon_phase[i]]])
                    if (i !== window.static_data.moons.length - 1) {
                        result.push(['&&']);
                    }
                }
                break;

        }

        this.create_conditions(result, this.event_conditions_container);
        this.evaluate_condition_selects(this.event_conditions_container);

        this.conditions_changed = false;

    },

    // This function creates an array for the conditions so that it may be stored
    create_condition_array(element) {

        let array = [];

        let event_editor_ui = this;

        element.children().each(function() {

            if ($(this).hasClass('condition')) {

                let selected_option = $(this).find('.condition_type').find(":selected");
                let type = selected_option.parent().attr('label');
                let values = [];

                if (type === "Moons") {

                    values.push($(this).find('.moon_select').val());

                    $(this).find('.input_container').children().each(function(i) {

                        let val;
                        if ($(this).val() === "") {
                            val = 0;
                        } else {
                            val = $(this).val();
                        }

                        values.push(val);

                    });

                } else if (type === "Cycle") {

                    values.push($(this).find('.input_container').find("option:selected").parent().attr("value"));
                    values.push($(this).find('.input_container').find("option:selected").val());

                } else if (type === "Events") {

                    let event_id = Number($(this).find('.input_container').find("option:selected").val());
                    if (event_id !== null && !isNaN(event_id) && event_editor_ui.working_event.data.connected_events.indexOf(event_id) === -1 && typeof event_id === "number") {
                        event_editor_ui.working_event.data.connected_events.push(event_id);
                    }

                    values.push(event_editor_ui.working_event.data.connected_events.indexOf(event_id));

                    let val;
                    if ($(this).find('.input_container').children().eq(1).val() === "") {
                        val = 0;
                    } else {
                        val = $(this).find('.input_container').children().eq(1).val();
                    }
                    values.push(val);

                } else if (type === "Date") {

                    let inputs = $(this).find('.input_container').find('.date_control').children();
                    let year = inputs.eq(0).val() | 0;
                    let timespan = inputs.eq(1).find('option:selected').val() | 0;
                    let day = inputs.eq(2).find('option:selected').val() | 0;

                    values.push(year);
                    values.push(timespan);
                    values.push(day);

                } else {

                    $(this).find('.input_container').children().each(function() {
                        let val;
                        if ($(this).val() === "") {
                            val = 0;
                        } else {
                            val = $(this).val();
                        }
                        values.push(val);
                    });
                }

                array.push([type, selected_option.val(), values])

            } else if ($(this).hasClass('group')) {

                let type = $(this).find('.group_type');

                if (type.attr("type") === "normal") {
                    type = "";
                } else if (type.attr("type") === "not") {
                    type = "!";
                } else {
                    type = type.find('.num_group_con').val();
                }

                array.push([type, event_editor_ui.create_condition_array($(this).children('.group_list'))])

            }

            let condition_operator = $(this).children('.condition_operator');

            if (!condition_operator.prop('disabled') && $(this).next().length !== 0) {
                array.push([condition_operator.val()])
            }

        });

        return array;
    },

    // This function finds and replaces all NAND operators and places !( and ) around them
    replace_NAND(array) {
        for (let i = array.length - 1; i > -1; i--) {
            let element = array[i];
            if (element[1] && Array.isArray(element[1]) && element[1].length > 0) {
                array[i][1] = replace_NAND(element[1]);
            } else if (element[0] === "NAND") {

                array.splice(i - 1, 0, ["!("])
                i++;
                array[i] = ['&&'];
                i++;

                if (array[i] === "!(") {
                    let j = i;
                    while (array[j] !== ")") {
                        j++;
                        if (j > 100) {
                            break;
                        }
                    }
                    array.splice(j, 0, ")")
                } else if (array[i] === "!") {
                    array.splice(i + 2, 0, [")"])
                } else {
                    array.splice(i + 1, 0, [")"])
                }

            }
        }
        return array;
    },

    // This function takes an array of conditions, and the parent which to attach the conditions UI
    create_conditions(array, parent, group_type) {

        if (!array) {
            return;
        }

        let increment = group_type === "num" ? 1 : 2;

        for (let i = 0; i < array.length; i += increment) {

            let element = array[i];

            if (Array.isArray(element[1])) {

                let group_type = "normal";
                if (element[0] === "!") {
                    group_type = "not";
                } else if (element[0] >= 1) {
                    group_type = "num";
                }

                let parent_new = this.add_group(parent, group_type);

                if (element[0] >= 1) {
                    parent_new.parent().children('.group_type').find('.num_group_con').prop('disabled', false).val(element[0]);
                }

                this.create_conditions(element[1], parent_new, group_type);

                if (array[i + 1] && group_type !== "num") {
                    parent_new.next().val(array[i + 1][0]);
                }

            } else {

                let condition = this.add_condition(parent, element[0]);

                condition.find('.condition_type').find(`optgroup[label='${element[0]}']`).find(`option[value='${element[1]}']`).prop('selected', true).trigger('change');

                if (element[0] === "Moons") {
                    condition.find('.moon_select').val(element[2][0])
                }

                this.evaluate_inputs(condition);

                if (element[0] === "Moons") {
                    condition.find('.moon_select').val(element[2][0])
                    condition.find('.input_container').children().each(function(i) {
                        $(this).val(element[2][i + 1]);
                    })
                } else if (element[0] === "Events") {

                    condition.find('.event_select').val(this.working_event.data.connected_events[element[2][0]])
                    condition.find('.input_container').children().eq(1).val(element[2][1]);

                } else if (element[0] === "Weekday") {

                    condition.find('.input_container').children().each(function(i) {
                        $(this).val(element[2][i]);
                    })

                } else if (element[0] === "Cycle") {

                    condition.find('.input_container').find(`optgroup[value=${element[2][0]}]`).find(`option[value=${element[2][1]}]`).prop('selected', true);

                } else if (element[0] === "Date") {
                    condition.find('.input_container').children().first().children().each(function(i) {
                        $(this).val(element[2][i]).change();
                    })
                } else {
                    condition.find('.input_container').children().each(function(i) {
                        $(this).val(element[2][i]);
                    })
                }

                if (array[i + 1] && group_type !== "num") {
                    condition.children().last().val(array[i + 1][0])
                }
            }
        }
    },

    evaluate_condition_selects(element) {

        let event_editor_ui = this;

        element.children().each(function() {

            if ($(this).next().length === 0) {
                $(this).find('.condition_operator').prop('disabled', true).addClass('hidden');
            } else {
                $(this).find('.condition_operator').prop('disabled', false).removeClass('hidden');
            }

            if ($(this).hasClass('group')) {

                event_editor_ui.evaluate_condition_selects($(this).children('.group_list'));

            }

        });

        if (element.hasClass('group_list')) {

            if (element.parent().children().first().attr('type') === 'num') {

                element.parent().children('.num_group_con').attr('min', 1).attr('max', Math.max(1, element.children().length));

                element.children().each(function() {

                    $(this).children('.condition_operator').prop('disabled', true).addClass('hidden');

                });

                element.children().each(function() {
                    if ($(this).hasClass('group')) {
                        event_editor_ui.evaluate_condition_selects($(this).children('.group_list'));
                    }
                });
            }
        }
    },

    remove_clicked() {

        this.isDeletingConditions = !this.isDeletingConditions;
        $('#condition_remove_button .icon').toggleClass('wiggle', this.isDeletingConditions).removeClass('faster', false);
        $('#event_conditions_container').toggleClass('deleting', this.isDeletingConditions);
        $('#add_event_condition').prop('disabled', this.isDeletingConditions);
        $('#add_event_condition_group').prop('disabled', this.isDeletingConditions);
        $('#condition_presets').prop('disabled', this.isDeletingConditions);

    },

    remove_mouseover($event) {
        this.isDeletingDroppable = true;
        $('#condition_remove_button .icon').addClass('faster');
    },

    remove_mouseout() {
        this.isDeletingDroppable = false;
        $('#condition_remove_button .icon').removeClass('faster');
    },

    // This function evaluates what inputs should be connected to any given condition based on its input
    evaluate_inputs(element) {

        this.inputs_changed = true;
        this.conditions_changed = true;

        let selected_option = element.find('.condition_type').find(":selected");
        let type = selected_option.parent().attr('label');
        let selected = selected_option.val();
        let condition_selected = condition_mapping[type][selected][2];

        element.find('.input_container').toggleClass('hidden', condition_selected[0] === "boolean");
        element.find('.condition_type').toggleClass('full', condition_selected[0] === "boolean").toggleClass('nomax', condition_selected[0] === "boolean");

        let html = [];

        let new_element = undefined;

        if (type === "Month") {

            for (let i = 0; i < condition_selected.length; i++) {

                let type = condition_selected[i][0];
                let placeholder = condition_selected[i][1];
                let alt = condition_selected[i][2];
                let value = condition_selected[i][3];
                let min = condition_selected[i][4];
                let max = condition_selected[i][5];

                if (type === "select") {

                    html.push("<select class='form-control order-1'>")

                    for (let i = 0; i < window.static_data.year_data.timespans.length; i++) {
                        html.push(`<option value='${i}'>`);
                        html.push(sanitizeHtml(window.static_data.year_data.timespans[i].name));
                        html.push("</option>");
                    }

                    html.push("</select>")

                } else {

                    html.push(`<input type='${type}' placeholder='${placeholder}' class='form-control ${placeholder} order-2'`);

                    if (typeof alt !== 'undefined') {
                        html.push(` alt='${alt}'`)
                    }

                    if (typeof value !== 'undefined') {
                        html.push(` value='${value}'`);
                    }

                    if (typeof min !== 'undefined') {
                        html.push(` min='${min}'`);
                    }

                    if (typeof max !== 'undefined') {
                        html.push(` max='${max}'`);
                    }

                    html.push(">");

                }

            }

            new_element = $(html.join(''));

        } else if (type === "Date") {

            let type = condition_selected[0][0];
            let placeholder = condition_selected[0][1];
            let alt = condition_selected[0][0];
            let value = this.epoch_data ? this.epoch_data.year : window.dynamic_data.year;
            let min = condition_selected[0][4];
            let max = condition_selected[0][5];

            html.push(`<div class='date_control flex-grow-1'>`);

            html.push(`<input type='${type}' placeholder='${placeholder}' class='date form-control ${placeholder} order-1 year-input'`);

            if (typeof alt !== 'undefined') {
                html.push(` alt='${alt}'`)
            }

            if (typeof value !== 'undefined') {
                html.push(` value='${value}'`);
            }

            if (typeof min !== 'undefined') {
                html.push(` min='${min}'`);
            }

            if (typeof max !== 'undefined') {
                html.push(` max='${max}'`);
            }

            html.push(">");

            html.push("<select type='number' class='date form-control order-2 timespan-list'></select>")

            html.push(`<select type='${type}' placeholder='${placeholder}' class='date form-control ${placeholder} order-3 timespan-day-list'></select>`);

            html.push(`</div>`);

            new_element = $(html.join(''));

            repopulate_timespan_select(new_element.find('.timespan-list'), this.epoch_data.timespan_index);
            repopulate_day_select(new_element.find('.timespan-day-list'), this.epoch_data.day);

        } else if (type === "Moons") {

            for (let i = 0; i < condition_selected.length; i++) {

                let type = condition_selected[i][0];
                let placeholder = condition_selected[i][1];
                let alt = condition_selected[i][2];
                let value = condition_selected[i][3];
                let min = condition_selected[i][4];
                let max = condition_selected[i][5];

                if (type === "select") {

                    let selected_moon = element.find('.moon_select').val();

                    selected_moon = selected_moon ? selected_moon : 0;

                    html.push("<select class='form-control'>")

                    let phases = Object.keys(moon_phases[window.static_data.moons[selected_moon].granularity]);

                    for (let i = 0; i < phases.length; i++) {
                        html.push(`<option value='${i}'>`);
                        html.push(phases[i]);
                        html.push("</option>");
                    }

                    html.push("</select>")



                } else {

                    html.push(`<input type='${type}' placeholder='${placeholder}' class='form-control ${placeholder} order-1'`);

                    if (typeof alt !== 'undefined') {
                        html.push(` alt='${alt}'`)
                    }

                    if (typeof value !== 'undefined') {
                        html.push(` value='${value}'`);
                    }

                    if (typeof min !== 'undefined') {
                        html.push(` min='${min}'`);
                    }

                    if (typeof max !== 'undefined') {
                        html.push(` max='${max}'`);
                    }

                    html.push(">");

                }

            }

            new_element = $(html.join(''));

        } else if (type === "Cycle") {

            html.push("<select class='form-control order-1'>")

            for (let i = 0; i < window.static_data.cycles.data.length; i++) {
                html.push(`<optgroup label='${ordinal_suffix_of(i + 1)} cycle group' value='${i}'>`);
                for (let j = 0; j < window.static_data.cycles.data[i].names.length; j++) {
                    html.push(`<option value='${j}'>`);
                    html.push(`Cycle ${i + 1}: ${sanitizeHtml(window.static_data.cycles.data[i].names[j])}`);
                    html.push("</option>");
                }
                html.push("</optgroup>");
            }

            html.push("</select>");

            new_element = $(html.join(''));

        } else if (type === "Era") {

            html.push("<select class='form-control order-1'>");

            for (let i = 0; i < window.static_data.eras.length; i++) {
                html.push(`<option value='${i}'>`);
                html.push(sanitizeHtml(window.static_data.eras[i].name));
                html.push("</option>");
            }

            html.push("</select>");

            new_element = $(html.join(''));

        } else if (type === "Season") {

            for (let i = 0; i < condition_selected.length; i++) {

                let type = condition_selected[i][0];
                let placeholder = condition_selected[i][1];
                let alt = condition_selected[i][2];
                let value = condition_selected[i][3];
                let min = condition_selected[i][4];
                let max = condition_selected[i][5];

                if (type === "select") {
                    html.push("<select class='form-control order-1'>")
                    for (let i = 0; i < window.static_data.seasons.data.length; i++) {
                        html.push(`<option value='${i}'>`);
                        html.push(sanitizeHtml(window.static_data.seasons.data[i].name));
                        html.push("</option>");
                    }

                    html.push("</select>")

                } else if (type === "boolean") {

                    html.push(`<input type='hidden' value='1'>`);

                } else {

                    html.push(`<input type='${type}' placeholder='${placeholder}' class='form-control ${placeholder} order-1'`);

                    if (typeof alt !== 'undefined') {
                        html.push(` alt='${alt}'`)
                    }

                    if (typeof value !== 'undefined') {
                        html.push(` value='${value}'`);
                    }

                    if (typeof min !== 'undefined') {
                        html.push(` min='${min}'`);
                    }

                    if (typeof max !== 'undefined') {
                        html.push(` max='${max}'`);
                    }

                    html.push(">");

                }

            }

            new_element = $(html.join(''));

        } else if (type === "Weekday") {

            for (let i = 0; i < condition_selected.length; i++) {

                let type = condition_selected[i][0];
                let placeholder = condition_selected[i][1];
                let alt = condition_selected[i][2];
                let value = condition_selected[i][3];
                let min = condition_selected[i][4];
                let max = condition_selected[i][5];

                if (type === "select") {

                    let weekdays = [];

                    for (let i = 0; i < window.static_data.year_data.global_week.length; i++) {

                        if (weekdays.indexOf(window.static_data.year_data.global_week[i]) === -1) {
                            weekdays.push(window.static_data.year_data.global_week[i]);
                        }

                    }

                    for (let i = 0; i < window.static_data.year_data.timespans.length; i++) {

                        if (window.static_data.year_data.timespans[i].week) {

                            for (let j = 0; j < window.static_data.year_data.timespans[i].week.length; j++) {

                                if (weekdays.indexOf(window.static_data.year_data.timespans[i].week[j]) === -1) {
                                    weekdays.push(window.static_data.year_data.timespans[i].week[j]);
                                }
                            }
                        }
                    }

                    html.push("<select class='form-control'>")

                    for (let index in weekdays) {

                        html.push(`<option>`);
                        html.push(weekdays[index]);
                        html.push("</option>");

                    }

                    html.push("</select>");

                } else {

                    html.push(`<input type='${type}' placeholder='${placeholder}' class='form-control ${placeholder} order-1'`);

                    if (typeof alt !== 'undefined') {
                        html.push(` alt='${alt}'`)
                    }

                    if (typeof value !== 'undefined') {
                        html.push(` value='${value}'`);
                    }

                    if (typeof min !== 'undefined') {
                        html.push(` min='${min}'`);
                    }

                    if (typeof max !== 'undefined') {
                        html.push(` max='${max}'`);
                    }

                    html.push(">");
                }

            }

            new_element = $(html.join(''));

        } else if (type === "Location") {

            html.push("<select class='form-control'>")

            for (let locationId in window.static_data.seasons.locations) {

                let location = window.static_data.seasons.locations[locationId]

                html.push(`<option value="${locationId}">`);
                html.push(sanitizeHtml(location.name));
                html.push("</option>");

            }

            new_element = $(html.join(''));

        } else if (type === "Events") {

            html.push("<select class='event_select form-control'>")

            for (let eventId = 0; eventId < window.events.length; eventId++) {

                let event = window.events[eventId];

                if (eventId === this.event_id) {
                    html.push(`<option disabled>`);
                    html.push(`${sanitizeHtml(event.name)} (this event)`);
                    html.push("</option>");
                } else {
                    this.event_chain_looked_at = [];
                    if (this.look_through_event_chain(this.event_id | 0, eventId)) {
                        html.push(`<option value="${eventId}">`);
                        html.push(sanitizeHtml(event.name));
                        html.push("</option>");
                    } else {
                        html.push(`<option disabled>`);
                        html.push(`${sanitizeHtml(event.name)} (chains to this event)`);
                        html.push("</option>");
                    }
                }

            }

            html.push("</select>");

            for (let i = 1; i < condition_selected.length; i++) {

                let type = condition_selected[i][0];
                let placeholder = condition_selected[i][1];
                let alt = condition_selected[i][2];
                let value = condition_selected[i][3];
                let min = condition_selected[i][4];
                let max = condition_selected[i][5];

                html.push(`<input type='${type}' placeholder='${placeholder}' class='form-control ${placeholder}'`);

                if (typeof alt !== 'undefined') {
                    html.push(` alt='${alt}'`)
                }

                if (typeof value !== 'undefined') {
                    html.push(` value='${value}'`);
                }

                if (typeof min !== 'undefined') {
                    html.push(` min='${min}'`);
                }

                if (typeof max !== 'undefined') {
                    html.push(` max='${max}'`);
                }

                html.push(">");

            }

            new_element = $(html.join(''));

        } else if (type === "Random") {

            for (let i = 0; i < condition_selected.length; i++) {

                let type = condition_selected[i][0];
                let placeholder = condition_selected[i][1];
                let alt = condition_selected[i][2];
                let value = i === 0 ? condition_selected[i][3] : Math.abs(Math.random().toString().substr(7) | 0);
                let min = condition_selected[i][4];
                let max = condition_selected[i][5];

                html.push(`<input type='${type}' placeholder='${placeholder}' class='form-control ${placeholder}'`);

                if (typeof alt !== 'undefined') {
                    html.push(` alt='${alt}'`)
                }

                if (typeof value !== 'undefined') {
                    html.push(` value='${value}'`);
                }

                if (typeof min !== 'undefined') {
                    html.push(` min='${min}'`);
                }

                if (typeof max !== 'undefined') {
                    html.push(` max='${max}'`);
                }

                html.push(">");

            }

            new_element = $(html.join(''));

        } else {

            for (let i = 0; i < condition_selected.length; i++) {

                let type = condition_selected[i][0];
                let placeholder = condition_selected[i][1];
                let alt = condition_selected[i][2];
                let value = condition_selected[i][3];
                let min = condition_selected[i][4];
                let max = condition_selected[i][5];

                if (type === "boolean") {

                    html.push(`<input type='hidden' value='1'>`);

                } else {

                    html.push(`<input type='${type}' placeholder='${placeholder}' class='form-control ${placeholder}'`);

                    if (typeof alt !== 'undefined') {
                        html.push(` alt='${alt}'`)
                    }

                    if (typeof value !== 'undefined') {
                        html.push(` value='${value}'`);
                    }

                    if (typeof min !== 'undefined') {
                        html.push(` min='${min}'`);
                    }

                    if (typeof max !== 'undefined') {
                        html.push(` max='${max}'`);
                    }

                    html.push(">");

                }

            }

            new_element = $(html.join(''));

        }

        element.find('.input_container').empty().append(new_element);

    },

    add_condition_clicked() {

        this.add_condition(this.event_conditions_container, "Year");
        this.evaluate_inputs(this.event_conditions_container.children().last())
        this.evaluate_condition_selects(this.event_conditions_container);

    },

    add_condition(parent, type) {

        this.inputs_changed = true;

        let html = [];

        html.push("<li class='condition'>");
        html.push(`<div class='condition_container ${type}'>`);
        html.push("<div class='handle fa fa-bars'></div>");
        html.push("<select class='form-control moon_select'>");
        for (let i = 0; i < window.static_data.moons.length; i++) {
            html.push(`<option value='${i}'>`);
            html.push(sanitizeHtml(window.static_data.moons[i].name));
            html.push("</option>");
        }
        html.push("</select>");
        html.push("<select class='form-control condition_type'>");

        let keys = Object.keys(condition_mapping);

        for (let i = 0; i < keys.length; i++) {

            if (
                (keys[i] === "Era year" && window.static_data.eras === undefined)
                ||
                (keys[i] === "Era" && window.static_data.eras === undefined)
                ||
                (keys[i] === "Month" && window.static_data.year_data.timespans === undefined)
                ||
                (keys[i] === "Weekday" && window.static_data.year_data.global_week === undefined)
                ||
                (keys[i] === "Moons" && window.static_data.moons === undefined)
                ||
                (keys[i] === "Cycle" && window.static_data.cycles === undefined)
                ||
                (keys[i] === "Events" && window.events.length <= 1)
                ||
                (keys[i] === "Season" && window.static_data.seasons.data.length < 1)
                ||
                (keys[i] === "Location" && window.static_data.seasons.locations.length < 1)
            ) {
                continue;
            }

            html.push(`<optgroup label='${keys[i]}'>`);

            let options = condition_mapping[keys[i]];

            for (let j = 0; j < options.length; j++) {

                html.push(`<option value='${j}'>`);
                html.push(options[j][0]);
                html.push("</option>");
            }

            html.push("</optgroup>");
        }

        html.push("</select>");
        html.push("<div class='input_container'>");
        html.push("</div>");
        html.push("</div>");
        html.push("<select class='form-control condition_operator'>");
        html.push("<option value='&&'>AND - both must be true</option>");
        html.push("<option value='NAND'>NAND - neither can be true</option>");
        html.push("<option value='||'>OR - at least one is true</option>");
        html.push("<option value='^'>XOR - only one must be true</option>");
        html.push("</select>");
        html.push("</li>");

        let condition = $(html.join(''));
        parent.append(condition);

        // condition.find('.condition_type').select2({
        //     matcher: matcher
        // });

        condition.find('.select2').removeAttr('style');

        return condition;

    },

    add_group_clicked() {

        this.add_group(this.event_conditions_container, "normal");
        this.evaluate_condition_selects(this.event_conditions_container);

    },

    add_group(parent, group_class) {

        this.inputs_changed = true;

        let html = [];

        html.push("<li class='group'>");
        html.push(`<div class='group_type' type='${group_class}'>`);
        html.push("<div class='normal'>");
        html.push(`<label><input type='radio' ${(group_class === "normal" ? "checked" : "")} name=''>NORMAL</label>`);
        html.push("</div>");
        html.push("<div class='not'>");
        html.push(`<label><input type='radio' ${(group_class === "not" ? "checked" : "")} name=''>NOT</label>`);
        html.push("</div>");
        html.push("<div class='num'>");
        html.push(`<label><input type='radio' ${(group_class === "num" ? "checked" : "")} name=''>AT LEAST</label><input type='number' class='form-control num_group_con' disabled>`);
        html.push("</div>");
        html.push("</div>");
        html.push("<div class='handle fa fa-bars'></div>");
        html.push("<ol class='group_list'></ol>");
        html.push("<select class='form-control condition_operator' disabled>");
        html.push("<option value='&&'>AND  - both must be true</option>");
        html.push("<option value='NAND'>NAND - neither can be true</option>");
        html.push("<option value='||'>OR   - at least one is true</option>");
        html.push("<option value='XOR'>XOR  - only one must be true</option>");
        html.push("</select>");
        html.push("</li>");

        let group = $(html.join(''));

        parent.append(group);

        this.update_radio_button_names();

        return group.children('.group_list');

    },

    update_radio_button_names() {
        $(".group_type").each(function(i) {
            $(this).find("input[type='radio']").attr("name", `${i}_group_type`);
            let type = $(this).attr('type');
            $(this).find(`.${type} input[type='radio']`).prop('checked', true);
        });
    },

    confirm_delete_event($event) {

        let delete_event_id = $event.detail.event_id;

        if ($event.detail.event_db_id !== undefined) {
            delete_event_id = window.events.findIndex((item) => item.id === $event.detail.event_db_id);
        }

        let warnings = [];

        for (let eventId = 0; eventId < window.events.length; eventId++) {
            if (eventId === delete_event_id) continue;
            if (window.events[eventId].data.connected_events !== undefined) {
                let connected_events = window.events[eventId].data.connected_events;
                if (connected_events.includes(String(delete_event_id)) || connected_events.includes(Number(delete_event_id))) {
                    warnings.push(eventId);
                }
            }
        }

        if (warnings.length > 0) {

            let html = [];
            html.push(`<div class='text-left'>`)
            html.push(`<h5>You trying to delete "${window.events[delete_event_id].name}" which is used in the conditions of the following events:</h5>`)
            html.push(`<ul>`);
            for (let i = 0; i < warnings.length; i++) {
                let warning_event_id = warnings[i];
                html.push(`<li>${window.events[warning_event_id].name}</li>`);
            }
            html.push(`</ul>`);
            html.push(`<p>Please remove the conditions using "${window.events[delete_event_id].name}" in these events before trying to delete it.</p>`)
            html.push(`</div>`);

            swal.fire({
                title: "Warning!",
                html: html.join(''),
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK',
                icon: "warning",
            })

        } else {

            swal.fire({

                title: "Warning!",
                html: `Are you sure you want to delete the event<br>"${window.events[delete_event_id].name}"?`,
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'OK',
                icon: "warning",

            }).then((result) => {

                if (!result.dismiss) {

                    let not_view_page = window.location.pathname.indexOf('/edit') > -1 || window.location.pathname.indexOf('/calendars/create') > -1;

                    if (not_view_page) {

                        this.delete_event(delete_event_id);

                    } else {

                        let event_id = window.events[delete_event_id].id;

                        submit_delete_event(event_id, () => {
                            this.delete_event(delete_event_id);
                        })

                    }

                }

            });

        }

    },

    delete_event(delete_event_id) {

        for (let eventId = 0; eventId < window.events.length; eventId++) {
            if (window.events[eventId].data.connected_events !== undefined) {
                const connectedEvents = window.events[eventId].data.connected_events;
                for (let connectedIndex = 0; connectedIndex < connectedEvents.length; connectedIndex++) {
                    let connectedIdNumber = Number(connectedEvents[connectedIndex])
                    if (connectedIdNumber > delete_event_id) {
                        window.events[eventId].data.connected_events[connectedIndex] = connectedIdNumber - 1;
                    }
                }
            }
        }

        window.events.splice(delete_event_id, 1);

        this.close();

        window.dispatchEvent(new CustomEvent("render-calendar"));

        window.dispatchEvent(new CustomEvent("events-changed"));

    },

    build_seasons: false,

    test_event(years) {

        if (this.event_is_one_time()) {

            swal.fire({
                title: "Uh...",
                text: "This event is a one time event (year, month, day), I'm pretty sure you know the answer to this test.",
                icon: "warning"
            });

        } else {

            this.build_seasons = this.evaluation_has_season_event();

            if (!this.build_seasons) {
                this.run_test_event(years);
            } else {
                swal.fire({
                    title: "Warning!",
                    html: "Simulating events that rely on season data can be <strong>incredibly</strong> slow, as we need to generate the seasons for all of the years we simulate. If you hit OK, be prepared to wait a while. Go get a cup of coffee or two, that kind of thing.",
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'OK',
                    icon: "warning",
                }).then((result) => {

                    if (!result.dismiss) {
                        this.run_test_event(years);
                    }

                });

            }

        }

    },

    cancel_event_test(self) {

        try {
            self.worker_event_tester.terminate();
        } catch (err) {
            console.log(err)
        }

        hide_loading_screen();

    },

    run_test_event(years) {

        show_loading_screen(true, this.cancel_event_test, this);

        if (this.new_event) {

            window.events[this.event_id] = {}

            window.events[this.event_id].data = this.create_event_data();

        } else {

            this.backup_event_data = clone(window.events[this.event_id].data);

            window.events[this.event_id].data = this.create_event_data();

        }

        let start_year = preview_date.year;
        let end_year = preview_date.year + years;

        this.worker_event_tester = new Worker('/js/webworkers/worker_event_tester.js')

        this.worker_event_tester.postMessage(JSON.parse(JSON.stringify({
            calendar_name: window.calendar_name,
            static_data: window.static_data,
            dynamic_data: window.preview_date,
            events: window.events,
            event_categories: window.event_categories,
            owner: Perms.player_at_least('co-owner'),
            start_year: window.start_year,
            end_year: window.end_year,
            callback: true,
            event_id: this.event_id,
            build_seasons: this.build_seasons
        })));

        let event_editor_ui = this;

        this.worker_event_tester.onmessage = e => {
            if (e.data.callback) {
                percentage = precisionRound(percentage, 3);

                if (progress == percentage) {
                    return;
                }

                progress = percentage;

                if (message) {
                    $('#loading_information_text').text(message).removeClass("hidden");
                }
            } else {

                event_editor_ui.event_testing.occurrences = e.data.occurrences;

                event_editor_ui.worker_event_tester.terminate()

                event_editor_ui.set_up_event_text(years);

                if (!event_editor_ui.new_event) {

                    window.events[event_editor_ui.event_id].data = clone(event_editor_ui.backup_event_data)
                    event_editor_ui.backup_event_data = {}

                }

                hide_loading_screen();

            }
        }
    },

    backup_event_data: {},

    event_testing: {
        occurrences: [],
        occurrences_text: [],
        visible_occurrences_1: [],
        visible_occurrences_2: [],
        page: 1,
        max_page: 1,
        items_per_page: 10,
        text: "",
    },

    set_up_event_text(years) {

        let event_has_changed = this.event_has_changed();

        let num_occurrences = this.event_testing.occurrences.length;

        let text = years > 1 ? `the next ${years} years.` : "this year.";
        text = `This event will appear <span class='bold-text'>${num_occurrences}</span> time${num_occurrences > 1 ? "s" : ""} in ${text}`;

        this.event_testing.text = text;

        this.event_testing.occurrences_text = [];

        for (let i = 0; i < num_occurrences; i++) {

            let occurrence = this.event_testing.occurrences[i];

            let year = occurrence.year;
            let timespan = occurrence.timespan;
            let timespan_name = sanitizeHtml(window.static_data.year_data.timespans[occurrence.timespan].name);
            let day = occurrence.day;
            let intercalary = occurrence.intercalary;

            let pre = "";
            let post = "";

            if (window.location.pathname !== '/calendars/create' && !event_has_changed) {
                pre = `<a href='${window.baseurl}calendars/${window.hash}?year=${year}&month=${timespan}&day=${day}' target="_blank">`;
                post = `</a>`;
            }

            let text = ""
            if (intercalary) {
                text = `${pre}${ordinal_suffix_of(day)} intercalary day of ${timespan_name}, ${year}${post}`
            } else {
                text = `${pre}${ordinal_suffix_of(day)} of ${timespan_name}, ${year}${post}`
            }

            this.event_testing.occurrences_text.push(text);

        }

        this.event_testing.max_page = Math.ceil(num_occurrences / 10);

        this.set_page(1);

    },

    next_page() {
        this.set_page(this.event_testing.page + 1);
    },

    prev_page() {
        this.set_page(this.event_testing.page - 1);
    },

    set_page(page) {

        this.event_testing.page = page;

        const start = (this.event_testing.page - 1) * this.event_testing.items_per_page;
        const end = start + this.event_testing.items_per_page;

        this.event_testing.visible_occurrences_1 = this.event_testing.occurrences_text.slice(start, end - 5);
        this.event_testing.visible_occurrences_2 = this.event_testing.occurrences_text.slice(start + 5, end);

    },

    checked_events: [],

    evaluation_has_season_event() {

        this.check_event_chain(this.event_id, true)

        for (let index in this.checked_events) {

            let event = this.checked_events[index];

            if (JSON.stringify(event.data.conditions).indexOf(`["Season",`) > -1) {
                return true;
            }

        }

        return false;

    },

    check_event_chain(event_id, working_event) {

        let current_event = {}
        if (working_event) {
            current_event = clone(this.working_event);
        } else {
            current_event = window.events[event_id];
        }
        this.checked_events.push(current_event);

        if (current_event.data.connected_events !== undefined && current_event.data.connected_events !== "false") {

            for (let parent_id of current_event.data.connected_events) {
                if (parent_id !== null && parent_id === event_id) {
                    this.check_event_chain(parent_id, false);
                }
            }

        }

    },



    look_through_event_chain(child, parent_id) {

        if (this.event_chain_looked_at.indexOf(parent_id) === -1) {
            return true;
        }

        this.event_chain_looked_at.push(parent_id);

        if (window.events[parent_id].data.connected_events !== undefined && window.events[parent_id].data.connected_events.length > 0) {

            if (window.events[parent_id].data.connected_events.includes(child)) {

                return false;

            } else {

                for (let id of window.events[parent_id].data.connected_events) {
                    if (id === null || !isNaN(id) || child === parent_id || !window.events[id]) continue;
                    if (!this.look_through_event_chain(child, id)) {
                        return false;
                    }
                }
            }
        }

        return true;
    }

})
