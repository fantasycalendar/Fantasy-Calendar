import { computePosition, flip, shift } from "@floating-ui/dom";

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
        let $store = this.$store;
        let $dispatch = this.$dispatch;

        $activateEvent.detail.items = [
            {
                name: 'Set as Current Date',
                icon: 'fas fa-hourglass-half',
                callback: function() {
                    var epoch_data = $store.calendar.evaluated_static_data.epoch_data[day.epoch];

                    $store.calendar.set_current_date({
                        year: epoch_data.year,
                        month: epoch_data.timespan_number,
                        day: epoch_data.day,
                        epoch: epoch_data.epoch,
                    });
                },
                disabled: function() {
                    return day.epoch == window.dynamic_data.epoch || !Perms.player_at_least('co-owner');
                },
                visible: function() {
                    return Perms.player_at_least('co-owner');
                }
            },
            {
                name: 'Set as Preview Date',
                icon: 'fas fa-hourglass',
                callback: function() {
                    var epoch_data = $store.calendar.evaluated_static_data.epoch_data[day.epoch];

                    $store.calendar.set_selected_date({
                        year: epoch_data.year,
                        month: epoch_data.timespan_number,
                        day: epoch_data.day,
                        epoch: epoch_data.epoch,
                    });
                    $store.calendar.set_selected_date_active(true);
                },
                disabled: function() {
                    return day.epoch == preview_date.epoch || !$store.calendar.static_data.settings.allow_view && !Perms.player_at_least('co-owner');
                },
                visible: function() {
                    return $store.calendar.static_data.settings.allow_view || Perms.player_at_least('co-owner');
                }
            },
            {
                name: 'Add new event',
                icon: 'fas fa-calendar-plus',
                callback: function() {
                    $dispatch('event-editor-modal-new-event', { name: '', epoch: day.epoch });
                },
                disabled: function() {
                    return !Perms.player_at_least('player');
                },
                visible: function() {
                    return Perms.player_at_least('player');
                }
            },
            {
                name: 'Copy link to date',
                icon: 'fas fa-link',
                callback: function() {
                    var epoch_data = $store.calendar.evaluated_static_data.epoch_data[day.epoch];

                    if (!valid_preview_date(epoch_data.year, epoch_data.timespan_number, epoch_data.day) && !window.hide_copy_warning) {
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
                                    window.copy_link(epoch_data);

                                    if (result.value) {
                                        window.hide_copy_warning = true;
                                    }
                                }
                            });
                    } else {
                        window.copy_link(epoch_data);
                    }
                },
                disabled: function() {
                    return !$store.calendar.static_data.settings.allow_view && !Perms.player_at_least('co-owner');
                },
                visible: function() {
                    return $store.calendar.static_data.settings.allow_view || Perms.player_at_least('co-owner');
                }
            }
        ];

        this.activate($activateEvent);
    },

    activate_for_event($activateEvent) {
        let calendar_event = $activateEvent.detail.calendar_event;
        let day = $activateEvent.detail.day;
        let $dispatch = this.$dispatch;

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
                disabled: (!Perms.can_modify_event(calendar_event.index)) || calendar_event.era,
                visible: Perms.can_modify_event(calendar_event.index) && !calendar_event.era,
            },
            {
                name: 'Clone event',
                icon: 'fas fa-clone',
                callback: function() {
                    $dispatch('event-editor-modal-clone-event', { event_id: calendar_event.index, era: calendar_event.era, epoch: day.epoch });
                },
                disabled: (!Perms.can_modify_event(calendar_event.index)) || calendar_event.era,
                visible: Perms.can_modify_event(calendar_event.index) && !calendar_event.era,
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
                    return !calendar_event.era || !Perms.user_is_owner() || window.location.href.indexOf('/edit') == -1;
                },
                visible: function() {
                    return calendar_event.era && Perms.user_is_owner() && window.location.href.indexOf('/edit') != -1;
                }
            },
            {
                name: events[calendar_event.index].settings.hide ? 'Show event' : 'Hide event',
                icon: 'fas fa-eye-slash',
                callback: function() {
                    window.submit_hide_show_event(calendar_event.index);
                },
                disabled: function() {
                    return calendar_event.era || !Perms.can_modify_event(calendar_event.index);
                },
                visible: function() {
                    return !calendar_event.era && Perms.can_modify_event(calendar_event.index);
                }
            },
            {
                name: 'Delete event',
                icon: 'fas fa-trash-alt',
                callback: function() {
                    $dispatch('event-editor-modal-delete-event', { event_id: calendar_event.index });
                },
                disabled: calendar_event.era || !Perms.can_modify_event(calendar_event.index),
                visible: !calendar_event.era && Perms.can_modify_event(calendar_event.index),
            }
        ];

        this.activate($activateEvent);
    }
});
