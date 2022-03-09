const calendar_html_editor = {

	open: false,
	era_id: false,
	description: false,
	has_initialized: false,

	init: function() {

		if (!this.has_initialized) {

			this.html_input = $(this.$refs.html_input);

			this.html_input.trumbowyg();

			this.has_initialized = true;

		}

	},

	edit_html: function($event){

		this.init()

		this.era_id = $event.detail.era_id;

		this.description = window.calendar.static_data.eras[this.era_id].description ? window.calendar.static_data.eras[this.era_id].description : "";

		this.html_input.trumbowyg("html", this.description);

		this.open = true;

	},

	save_html: function(){

        window.calendar.static_data.eras[this.era_id].description = this.html_input.trumbowyg("html");

		this.close()

	},

	confirm_close() {
        // Don't do anything if a swal is open.
        if(swal.isVisible()) {
            return false;
        }

        let description = this.html_input.trumbowyg("html");

		if (description != this.description) {
			swal.fire({
				title: "Are you sure?",
				text: 'Your changes will not be saved! Are you sure you want to close?',
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
        // Don't do anything if a swal is open.
        if(swal.isVisible()) {
            return false;
        }

        let description = this.html_input.trumbowyg("html");

		if (description != this.description) {
			swal.fire({
				title: "Are you sure?",
				text: 'Your changes to this event will not be saved! Are you sure you want to continue?',
				showCancelButton: true,
				confirmButtonColor: '#d33',
				cancelButtonColor: '#3085d6',
				icon: "warning",
			}).then((result) => {
				if (!result.dismiss) {
					window.dispatchEvent(new CustomEvent('event-viewer-modal-view-event', { detail: { id: this.era_id, era: true } }));
					this.close();
				}
			});
		} else {
			window.dispatchEvent(new CustomEvent('event-viewer-modal-view-event', { detail: { id: this.era_id, era: true } }));
			this.close();
		}

	},

	close: function() {

		this.open = false;
		this.era_id = false;
		this.description = false;
		this.html_input.trumbowyg("html", "");
		evaluate_save_button();

	}

}


module.exports = calendar_html_editor;
