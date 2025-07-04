import $ from 'jquery';

export default () => ({

    open: false,
    era_id: false,
    description: "",
    original_description: "",
    has_initialized: false,

    edit_html: function($event) {
        this.era_id = $event.detail.era_id;

        this.description = this.$store.calendar.static_data.eras[this.era_id].description ?? "";
        this.original_description = this.$store.calendar.static_data.eras[this.era_id].description ?? "";

        this.open = true;
    },

    save_html: function() {
        this.$dispatch('calendar-updating', {
            calendar: {
                ['static_data.eras.' + this.era_id + '.description']: this.description,
            }
        });

        this.close_and_reset()
    },

    confirm_close($event) {
        if (swal.isVisible()) {
            return;
        }

        if (this.original_description !== this.description) {
            swal.fire({
                title: "Are you sure?",
                text: 'Your changes will not be saved! Are you sure you want to close?',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                icon: "warning",
            }).then((result) => {
                if (!result.dismiss) {
                    this.close_and_reset();
                }
            });
        } else {
            this.close_and_reset();
        }
    },

    confirm_view() {
        if (swal.isVisible()) {
            return;
        }

        if (this.original_description !== this.description) {
            swal.fire({
                title: "Are you sure?",
                text: 'Your changes to this event will not be saved! Are you sure you want to continue?',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                icon: "warning",
            }).then((result) => {
                if (!result.dismiss) {
                    window.dispatchEvent(new CustomEvent('event-viewer-modal-view-event', { detail: { event_id: this.era_id, era: true } }));
                    this.close_and_reset();
                }
            });
        } else {
            window.dispatchEvent(new CustomEvent('event-viewer-modal-view-event', { detail: { event_id: this.era_id, era: true } }));
            this.close_and_reset();
        }
    },

    close_and_reset() {
        this.open = false;
        this.era_id = false;
        this.description = "";
        this.original_description = "";
    }
})
