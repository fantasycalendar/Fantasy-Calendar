import { do_update_all } from "./calendar/calendar_ajax_functions";
import { show_loading_screen, hide_loading_screen } from "./calendar/header";

export default () => ({

    open: false,
    current_layout: undefined,

    layouts: [
        {
            "name": "Grid",
            "description": "A familiar detailed view that resembles a traditional wall-hung calendar.",
            "image": "/resources/layouts/light-grid.png"
        },
        {
            "name": "Vertical",
            "description": "A single column view for focusing on each day or for use on mobile devices.",
            "image": "/resources/layouts/light-vertical.png"
        },
        {
            "name": "Minimalistic",
            "description": "Beautiful minimalism that zooms out a bit to fit the whole calendar on one page.",
            "image": "/resources/layouts/light-minimal.png"
        }
    ],

    open_modal: function($event) {
        // if (evaluate_save_button()) { // TODO: Fix calendar layouts requiring calendar to be saved
            this.open = true;
            this.current_layout = this.layouts.find(layout => layout.name.toLowerCase() === window.static_data.settings.layout);
        // } else {
        //     this.$dispatch('notify', {
        //         content: "Applying a layout refreshes the page, please save your calendar first.",
        //         type: "warning"
        //     });
        // }
    },

    apply_layout: function(layout) {
        show_loading_screen();

        let previous_layout = this.$store.calendar.static_data.settings.layout;
        this.$store.calendar.static_data.settings.layout = layout.name.toLowerCase();

        do_update_all(window.hash, function() {
            window.onbeforeunload = function() { }
            window.location.reload(false);
        }, function() {
            window.static_data.settings.layout = previous_layout;
            hide_loading_screen();
        });
    }

})
