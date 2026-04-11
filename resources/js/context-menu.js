import { copy_link, valid_preview_date } from "./calendar/calendar_functions.js";
import { submit_hide_show_event } from "./calendar/calendar_ajax_functions.js";

let hide_copy_warning = false;

export default () => ({
    show: true,
    opacity: 1,
    x: -9999,
    y: -9999,
    items: [],

    activate($event) {
        this.items = $event.detail.items;

        this.$nextTick(() => {
            this.x = $event.detail.click.clientX;
            this.y = $event.detail.click.clientY;
            this.opacity = 1;
        });
    },

    deactivate() {
        this.items = [];
        this.content = "";
        this.opacity = 0;
        this.x = -9999;
        this.y = -9999;
    },

    shouldDisable(item) {
        if (typeof item.disabled == 'undefined') {
            return false;
        }

        if (typeof item.disabled == 'function') {
            return item.disabled();
        }

        return item.disabled;
    },

    shouldBeVisible(item) {
        if (typeof item.visible == 'undefined') {
            return false;
        }

        if (typeof item.visible == 'function') {
            return item.visible();
        }

        return item.visible;
    },

    activate_for_date($activateEvent) {
        let day = $activateEvent.detail.day;
        const store = this.$store.calendar;
        let $dispatch = this.$dispatch;

        $activateEvent.detail.items = [
            {
                name: 'Set as Current Date',
                icon: 'fas fa-hourglass-half',
                callback: function() {
                    var epoch_data = store.evaluated_static_data.epoch_data[day.epoch];

                    store.set_current_date({
                        year: epoch_data.year,
                        month: epoch_data.timespan_number,
                        day: epoch_data.day,
                        epoch: epoch_data.epoch,
                    });
                },
                disabled: function() {
                    return day.epoch == store.dynamic_data.epoch || !store.perms.player_at_least('co-owner');
                },
                visible: function() {
                    return store.perms.player_at_least('co-owner');
                }
            },
            {
                name: 'Set as Preview Date',
                icon: 'fas fa-hourglass',
                callback: function() {
                    var epoch_data = store.evaluated_static_data.epoch_data[day.epoch];

                    store.set_selected_date({
                        year: epoch_data.year,
                        month: epoch_data.timespan_number,
                        day: epoch_data.day,
                        epoch: epoch_data.epoch,
                        follow: false
                    });
                },
                disabled: function() {
                    return day.epoch == store.preview_date.epoch || !store.static_data.settings.allow_view && !store.perms.player_at_least('co-owner');
                },
                visible: function() {
                    return store.static_data.settings.allow_view || store.perms.player_at_least('co-owner');
                }
            },
            {
                name: 'Add new event',
                icon: 'fas fa-calendar-plus',
                callback: function() {
                    $dispatch('event-editor-modal-new-event', { name: '', epoch: day.epoch });
                },
                disabled: function() {
                    return !store.perms.player_at_least('player');
                },
                visible: function() {
                    return store.perms.player_at_least('player');
                }
            },
            {
                name: 'Copy link to date',
                icon: 'fas fa-link',
                callback: function() {
                    var epoch_data = store.evaluated_static_data.epoch_data[day.epoch];

                    if (!valid_preview_date(epoch_data.year, epoch_data.timespan_number, epoch_data.day) && !hide_copy_warning) {
                        swal.fire({
                            title: 'Date inaccessible',
                            html: `<p>This date is not visible to guests or players, settings such as 'Allow advancing view in calendar' and 'Show only up to current day' can affect this.</p><p>Are you sure you want to copy a link to it?</p>`,
                            input: 'checkbox',
                            inputPlaceholder: 'Remember this choice',
                            inputClass: 'form-control',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Yes',
                            icon: 'info'
                        })
                            .then((result) => {
                                if (!result.dismiss) {
                                    copy_link(epoch_data, hide_copy_warning);

                                    if (result.value) {
                                        hide_copy_warning = true;
                                    }
                                }
                            });
                    } else {
                        copy_link(epoch_data, hide_copy_warning);
                    }
                },
                disabled: function() {
                    return !store.static_data.settings.allow_view && !store.perms.player_at_least('co-owner');
                },
                visible: function() {
                    return store.static_data.settings.allow_view || store.perms.player_at_least('co-owner');
                }
            }
        ];

        this.activate($activateEvent);
    },

    activate_for_event($activateEvent) {
        let calendar_event = $activateEvent.detail.calendar_event;
        let day = $activateEvent.detail.day;
        let $dispatch = this.$dispatch;
        const store = this.$store.calendar;

        $activateEvent.detail.items = [
            {
                name: 'View event',
                icon: 'fas fa-eye',
                callback: function() {
                    $dispatch('event-viewer-modal-view-event', { event_id: calendar_event.index, era: calendar_event.era, epoch: day.epoch });
                },
                disabled: calendar_event.era,
                visible: !calendar_event.era,
            },
            {
                name: 'Edit event',
                icon: 'fas fa-edit',
                callback: function() {
                    $dispatch('event-editor-modal-edit-event', { event_id: calendar_event.index, era: calendar_event.era, epoch: day.epoch });
                },
                disabled: (!store.perms.can_modify_event(calendar_event.index)) || calendar_event.era,
                visible: store.perms.can_modify_event(calendar_event.index) && !calendar_event.era,
            },
            {
                name: 'Clone event',
                icon: 'fas fa-clone',
                callback: function() {
                    $dispatch('event-editor-modal-clone-event', { event_id: calendar_event.index, era: calendar_event.era, epoch: day.epoch });
                },
                disabled: (!store.perms.can_modify_event(calendar_event.index)) || calendar_event.era,
                visible: store.perms.can_modify_event(calendar_event.index) && !calendar_event.era,
            },
            {
                name: 'View era description',
                icon: 'fas fa-eye',
                callback: function() {
                    $dispatch('event-viewer-modal-view-event', { event_id: calendar_event.index, era: calendar_event.era, epoch: day.epoch });
                },
                disabled: !calendar_event.era,
                visible: calendar_event.era,
            },
            {
                name: 'Edit era description',
                icon: 'fas fa-edit',
                callback: function() {
                    $dispatch('html-editor-modal-edit-html', { era_id: calendar_event.index });
                },
                disabled: function() {
                    return !calendar_event.era || !store.perms.user_is_owner() || window.location.href.indexOf('/edit') == -1;
                },
                visible: function() {
                    return calendar_event.era && store.perms.user_is_owner() && window.location.href.indexOf('/edit') != -1;
                }
            },
            {
                name: store.events[calendar_event.index].settings.hide ? 'Show event' : 'Hide event',
                icon: 'fas fa-eye-slash',
                callback: function() {
                    submit_hide_show_event(calendar_event.index);
                },
                disabled: function() {
                    return calendar_event.era || !store.perms.can_modify_event(calendar_event.index);
                },
                visible: function() {
                    return !calendar_event.era && store.perms.can_modify_event(calendar_event.index);
                }
            },
            {
                name: 'Delete event',
                icon: 'fas fa-trash-alt',
                callback: function() {
                    $dispatch('event-editor-modal-delete-event', { event_id: calendar_event.index });
                },
                disabled: calendar_event.era || !store.perms.can_modify_event(calendar_event.index),
                visible: !calendar_event.era && store.perms.can_modify_event(calendar_event.index),
            }
        ];

        this.activate($activateEvent);
    }
});
